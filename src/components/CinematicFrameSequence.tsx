import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { siteConfig } from '../config/site'

type SequenceStatus = 'loading' | 'ready' | 'fallback'
type SequenceSettings = typeof siteConfig.cinematic

/**
 * Canvas raster sequence without a renderer dependency.
 * - All frames must exist; otherwise the owner-provided artwork is displayed.
 * - Frames are progressively preloaded in small concurrent batches.
 * - Interaction is enabled only when the complete, genuine sequence is loaded.
 */
export default function CinematicFrameSequence({ settings = siteConfig.cinematic }: { settings?: SequenceSettings }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const imagesRef = useRef<Array<HTMLImageElement | null>>([])
  const currentRef = useRef(0)
  const targetRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const draggingRef = useRef(false)
  const [status, setStatus] = useState<SequenceStatus>('loading')
  const [activeFrame, setActiveFrame] = useState(0)
  const reducedMotion = useReducedMotion()

  const draw = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context) return
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (!width || !height) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const pxW = Math.round(width * dpr)
    const pxH = Math.round(height * dpr)
    if (canvas.width !== pxW || canvas.height !== pxH) {
      canvas.width = pxW
      canvas.height = pxH
    }
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.fillStyle = '#0b0b0a'
    context.fillRect(0, 0, width, height)
    const index = Math.round(frameIndex)
    const loaded = imagesRef.current[index]
    if (!loaded) return
    const iw = loaded.naturalWidth
    const ih = loaded.naturalHeight
    const scale = Math.max(width / iw, height / ih)
    const sw = iw * scale
    const sh = ih * scale
    const dx = (width - sw) * settings.objectPositionX
    const dy = (height - sh) * settings.objectPositionY
    context.drawImage(loaded, dx, dy, sw, sh)
  }, [settings])

  const animateToTarget = useCallback(() => {
    if (rafRef.current !== null) return
    const tick = () => {
      const delta = targetRef.current - currentRef.current
      currentRef.current += delta * 0.15
      if (Math.abs(delta) < 0.035) currentRef.current = targetRef.current
      draw(currentRef.current)
      setActiveFrame(Math.round(currentRef.current))
      if (currentRef.current !== targetRef.current) {
        rafRef.current = requestAnimationFrame(tick)
      } else rafRef.current = null
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [draw])

  const goToFrame = useCallback((next: number) => {
    targetRef.current = Math.min(settings.frameCount - 1, Math.max(0, next))
    animateToTarget()
  }, [animateToTarget, settings.frameCount])

  useEffect(() => {
    if (reducedMotion || settings.frameCount < 2) {
      setStatus('fallback')
      return
    }
    let cancelled = false
    imagesRef.current = Array(settings.frameCount).fill(null)
    currentRef.current = 0
    targetRef.current = 0
    setStatus('loading')
    let failedFrames = 0
    const filename = (idx: number) => `${settings.directory}${settings.filePrefix}${String(idx + 1).padStart(settings.padding, '0')}.${settings.extension}`

    const loadFrame = (idx: number): Promise<void> => new Promise(resolve => {
      const image = new Image()
      image.decoding = 'async'
      image.onload = () => {
        if (!cancelled) {
          imagesRef.current[idx] = image
          // Keep the fallback visible until the entire frame set is ready.
        }
        resolve()
      }
      image.onerror = () => {
        if (!cancelled) { failedFrames++; if (idx === 0) setStatus('fallback') }
        resolve()
      }
      image.src = filename(idx)
    })

    // A missing first image means no sequence has been installed yet.
    const begin = async () => {
      await loadFrame(0)
      if (cancelled || !imagesRef.current[0]) return
      let cursor = 1
      const work = async () => {
        while (!cancelled && cursor < settings.frameCount) {
          const idx = cursor++
          await loadFrame(idx)
        }
      }
      await Promise.all(Array.from({ length: Math.min(3, settings.frameCount - 1) }, work))
      if (!cancelled) setStatus(failedFrames === 0 ? 'ready' : 'fallback')
    }
    void begin()
    return () => { cancelled = true; if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); rafRef.current = null }
  }, [settings, reducedMotion])

  useEffect(() => {
    if (status !== 'ready') return
    const observer = new ResizeObserver(() => draw(currentRef.current))
    if (stageRef.current) observer.observe(stageRef.current)
    draw(currentRef.current)
    return () => observer.disconnect()
  }, [status, draw])

  useEffect(() => {
    if (status !== 'ready') return
    const onMouseMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || draggingRef.current) return
      const rect = stageRef.current?.getBoundingClientRect()
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return
      goToFrame((event.clientX / window.innerWidth) * (settings.frameCount - 1))
    }
    window.addEventListener('pointermove', onMouseMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMouseMove)
  }, [status, settings.frameCount, goToFrame])

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (status !== 'ready' || event.pointerType === 'mouse' || !draggingRef.current) return
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    goToFrame(((event.clientX - rect.left) / rect.width) * (settings.frameCount - 1))
  }
  const onKeyDown = (event: ReactKeyboardEvent<HTMLCanvasElement>) => {
    if (status !== 'ready') return
    if (event.key === 'ArrowRight') { event.preventDefault(); goToFrame(targetRef.current + 1) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goToFrame(targetRef.current - 1) }
    if (event.key === 'Home') { event.preventDefault(); goToFrame(0) }
    if (event.key === 'End') { event.preventDefault(); goToFrame(settings.frameCount - 1) }
  }
  return (
    <div className="cinematic-frame-sequence" ref={stageRef}
      onPointerDown={(e: ReactPointerEvent<HTMLDivElement>) => { if (e.pointerType !== 'mouse') draggingRef.current = true }}
      onPointerMove={onPointerMove}
      onPointerUp={() => { draggingRef.current = false }}
      onPointerCancel={() => { draggingRef.current = false }}>
      <img src={settings.fallbackSrc} alt="Silhouette masculine dans un décor sombre, illuminée par un rayon de lumière dorée" className={`sequence-poster ${status === 'ready' ? 'sequence-poster--under' : ''}`} fetchPriority="high" draggable={false}/>
      {status === 'ready' && <canvas ref={canvasRef} className="sequence-canvas" role="slider" tabIndex={0}
        aria-label="Explorer les images de la séquence cinématique"
        aria-orientation="horizontal" aria-valuemin={1} aria-valuemax={settings.frameCount}
        aria-valuenow={activeFrame + 1} aria-valuetext={`Image ${activeFrame + 1} sur ${settings.frameCount}`}
        onKeyDown={onKeyDown} />}
      <div className="sequence-edge-vignette" aria-hidden="true" />
      {status === 'ready' && <div className="sequence-controls">
        <span className="sequence-hint"><MoveHorizontal size={15}/> Bougez la souris pour explorer</span>
        <div className="sequence-buttons"><button onClick={() => goToFrame(targetRef.current - 1)} disabled={activeFrame === 0} aria-label="Image précédente"><ChevronLeft size={16}/></button>
          <span className="sequence-counter">{String(activeFrame + 1).padStart(2, '0')} / {String(settings.frameCount).padStart(2, '0')}</span>
          <button onClick={() => goToFrame(targetRef.current + 1)} disabled={activeFrame === settings.frameCount - 1} aria-label="Image suivante"><ChevronRight size={16}/></button>
        </div>
      </div>}
      {status === 'loading' && <span className="sr-only" role="status">Chargement de la séquence cinématique…</span>}
    </div>
  )
}
