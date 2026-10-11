import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

export default function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div className={className}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: .75, ease: [.22, 1, .36, 1], delay }}>
      {children}
    </motion.div>
  )
}
