import { useEffect, useRef } from 'react'

interface Mote { x: number; y: number; r: number; vx: number; vy: number; a: number; phase: number; speed: number }

/**
 * Procedural dust floating in the light. A single 2D canvas, DPR capped,
 * paused while off-screen or when the tab is hidden. Purely decorative.
 */
export default function DustField({ density = 1, origin = { x: .8, y: .4 }, className = '' }: { density?: number; origin?: { x: number; y: number }; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let width = 0, height = 0, raf = 0, visible = false, last = performance.now()
    let motes: Mote[] = []
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const spawn = (anywhere: boolean): Mote => {
      // Concentrate motes inside the light cone that falls from the scene's light source.
      const spreadX = (Math.random() - .5) * (Math.random() < .7 ? .45 : 1.4)
      return {
        x: (origin.x + spreadX) * width,
        y: anywhere ? Math.random() * height : height * (.75 + Math.random() * .3),
        r: Math.random() * 1.5 + .35,
        vx: (Math.random() - .5) * 5,
        vy: -(Math.random() * 7 + 2.5),
        a: Math.random() * .55 + .18,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * .8 + .4,
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width; height = rect.height
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(90, (width * height) / 16000) * density)
      motes = Array.from({ length: count }, () => spawn(true))
    }

    const frame = (now: number) => {
      const dt = Math.min(.05, (now - last) / 1000); last = now
      ctx.clearRect(0, 0, width, height)
      const lx = origin.x * width, ly = origin.y * height
      for (const m of motes) {
        m.phase += dt * m.speed
        m.x += (m.vx + Math.sin(m.phase) * 4) * dt
        m.y += m.vy * dt
        if (m.y < -10 || m.x < -20 || m.x > width + 20) Object.assign(m, spawn(false))
        // Brighter when close to the light source, like dust caught in a beam.
        const d = Math.hypot(m.x - lx, (m.y - ly) * .6) / Math.max(width, 1)
        const glow = Math.max(.25, 1 - d * 1.6)
        const twinkle = .65 + Math.sin(m.phase * 2.3) * .35
        ctx.beginPath()
        ctx.fillStyle = `rgba(241, 214, 168, ${(m.a * glow * twinkle).toFixed(3)})`
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(frame)
    }

    const start = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame) } }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop() })
    const onVisibility = () => (document.hidden ? stop() : start())
    const ro = new ResizeObserver(resize)

    resize()
    ro.observe(canvas)
    io.observe(canvas)
    document.addEventListener('visibilitychange', onVisibility)
    return () => { stop(); io.disconnect(); ro.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [density, origin.x, origin.y])

  return <canvas ref={ref} className={`cine-dust ${className}`} aria-hidden="true" />
}
