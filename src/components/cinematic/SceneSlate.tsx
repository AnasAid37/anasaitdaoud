import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

/**
 * A film "slate" between acts: a gold line draws across, the scene number and title
 * resolve out of the dark. Decorative — the real section headings follow right after.
 */
export default function SceneSlate({ number, title, chapters, variant = 'default' }: { number: string; title: string; chapters?: string[]; variant?: 'bridge' | 'default' }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const line = useTransform(scrollYProgress, [.15, .5], [0, 1])
  const opacity = useTransform(scrollYProgress, [.2, .45, .75, .95], [0, 1, 1, .2])
  const y = useTransform(scrollYProgress, [.15, .5, 1], [36, 0, -30])
  const tracking = useTransform(scrollYProgress, [.15, .55], ['.6em', '.28em'])
  const live = !reduce

  return <div ref={ref} className={`scene-slate scene-slate--${variant}`} aria-hidden="true">
    <motion.span className="scene-slate__line" style={live ? { scaleX: line } : undefined} />
    <motion.div className="scene-slate__body" style={live ? { opacity, y } : undefined}>
      <span className="scene-slate__number">SCÈNE {number}</span>
      <motion.strong className="scene-slate__title" style={live ? { letterSpacing: tracking } : undefined}>{title}</motion.strong>
      {chapters && <span className="scene-slate__chapters">{chapters.map((chapter, index) => <span key={chapter}>{index > 0 && <i />}{chapter}</span>)}</span>}
    </motion.div>
  </div>
}
