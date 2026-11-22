import { motion, useReducedMotion, type Variants } from 'motion/react'

const ease = [.22, 1, .36, 1] as const
const line: Variants = { hidden: { y: '108%' }, show: (i: number) => ({ y: '0%', transition: { duration: 1.05, ease, delay: .08 + i * .12 } }) }
const rule: Variants = { hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: .9, ease } } }

/**
 * Section title revealed line by line from behind a mask, like a film title card.
 * The viewport trigger sits on the (unclipped) heading, the masked lines follow via variants.
 */
export default function SectionHeading({ eyebrow, title, introduction, index, id }: { eyebrow: string; title: string; introduction?: string; index?: string; id?: string }) {
  const reduce = useReducedMotion()
  const lines = title.split(/\\n|\n/) // JSX attribute strings keep "\n" literally
  return <motion.div className="section-heading" initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, margin: '0px 0px -80px 0px' }}>
    <div className="section-heading__top"><span className="eyebrow">
      <motion.span className="eyebrow-line" variants={rule} style={{ transformOrigin: 'left' }} /> {eyebrow}</span>{index && <span className="section-index">/ {index}</span>}</div>
    <div className="section-heading__body"><h2 id={id}>
      {lines.map((text, i) => <span key={i} className="heading-line"><motion.span className="heading-line__inner" variants={line} custom={i}>{text}</motion.span></span>)}
    </h2>{introduction && <p>{introduction}</p>}</div>
  </motion.div>
}
