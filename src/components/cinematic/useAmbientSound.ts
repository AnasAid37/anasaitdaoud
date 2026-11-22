import { useCallback, useEffect, useRef, useState } from 'react'

interface Graph { ctx: AudioContext; master: GainNode; stop: () => void }

/**
 * Optional atmospheric sound design, synthesised live with the Web Audio API
 * (no audio file is downloaded). Off by default; only starts after a user click,
 * as browsers require. Low drone + filtered "air", both slowly modulated.
 */
export function useAmbientSound() {
  const [enabled, setEnabled] = useState(false)
  const graph = useRef<Graph | null>(null)

  const build = (): Graph | null => {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return null
    const ctx = new AudioCtx()
    const master = ctx.createGain(); master.gain.value = 0
    const lowpass = ctx.createBiquadFilter(); lowpass.type = 'lowpass'; lowpass.frequency.value = 380; lowpass.Q.value = .6
    lowpass.connect(master); master.connect(ctx.destination)

    const sources: AudioScheduledSourceNode[] = []
    const drone = (freq: number, type: OscillatorType, level: number, detune = 0) => {
      const osc = ctx.createOscillator(); osc.type = type; osc.frequency.value = freq; osc.detune.value = detune
      const g = ctx.createGain(); g.gain.value = level
      osc.connect(g); g.connect(lowpass); osc.start(); sources.push(osc)
    }
    drone(55, 'sine', .5)            // A1 foundation
    drone(82.41, 'sine', .28, 4)     // E2 open fifth
    drone(110, 'triangle', .07, -6)  // A2 colour
    drone(164.8, 'sine', .035, 7)    // soft upper partial

    // Slow "breathing" of the filter.
    const lfo = ctx.createOscillator(); lfo.frequency.value = .06
    const lfoDepth = ctx.createGain(); lfoDepth.gain.value = 140
    lfo.connect(lfoDepth); lfoDepth.connect(lowpass.frequency); lfo.start(); sources.push(lfo)

    // Air: band-passed noise with its own slow swell.
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource(); noise.buffer = buffer; noise.loop = true
    const band = ctx.createBiquadFilter(); band.type = 'bandpass'; band.frequency.value = 700; band.Q.value = .5
    const air = ctx.createGain(); air.gain.value = .018
    const airLfo = ctx.createOscillator(); airLfo.frequency.value = .045
    const airDepth = ctx.createGain(); airDepth.gain.value = .012
    airLfo.connect(airDepth); airDepth.connect(air.gain)
    noise.connect(band); band.connect(air); air.connect(master)
    noise.start(); airLfo.start(); sources.push(noise, airLfo)

    return { ctx, master, stop: () => { sources.forEach(s => { try { s.stop() } catch { /* already stopped */ } }); void ctx.close() } }
  }

  const toggle = useCallback(() => setEnabled(value => !value), [])

  useEffect(() => {
    if (enabled) {
      graph.current ??= build()
      const g = graph.current
      if (!g) { setEnabled(false); return }
      void g.ctx.resume()
      const now = g.ctx.currentTime
      g.master.gain.cancelScheduledValues(now)
      g.master.gain.setValueAtTime(g.master.gain.value, now)
      g.master.gain.linearRampToValueAtTime(.16, now + 2.5)
    } else if (graph.current) {
      const g = graph.current
      const now = g.ctx.currentTime
      g.master.gain.cancelScheduledValues(now)
      g.master.gain.setValueAtTime(g.master.gain.value, now)
      g.master.gain.linearRampToValueAtTime(0, now + .8)
      const t = window.setTimeout(() => { void g.ctx.suspend() }, 900)
      return () => window.clearTimeout(t)
    }
  }, [enabled])

  // Silence when the tab is hidden; release everything on unmount.
  useEffect(() => {
    const onVisibility = () => {
      const g = graph.current
      if (!g) return
      if (document.hidden) void g.ctx.suspend()
      else if (enabled) void g.ctx.resume()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [enabled])
  useEffect(() => () => { graph.current?.stop(); graph.current = null }, [])

  return { enabled, toggle }
}
