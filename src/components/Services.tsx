import { ArrowUpRight, CalendarDays, Code2, LayoutTemplate, ShieldCheck, ShoppingBag, Zap } from 'lucide-react'
import { services } from '../content/fr'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const icons = { layout: LayoutTemplate, calendar: CalendarDays, shopping: ShoppingBag, code: Code2, shield: ShieldCheck, zap: Zap }

export default function Services() {
  return <section id="services" className="section services-section">
    <div className="site-container"><Reveal><SectionHeading eyebrow="COMMENT JE PEUX VOUS AIDER" index="02" title="La bonne solution.\nPour le bon besoin." introduction="Pas de complexité pour le plaisir de la technique. Chaque solution part de votre activité et de vos objectifs." /></Reveal>
      <div className="services-list">{services.map(service => {
        const Icon = icons[service.icon]
        return <Reveal key={service.number} className="service-row"><div className="service-row__number">{service.number}</div><div className="service-row__icon"><Icon size={25} strokeWidth={1.45}/></div><div className="service-row__main"><h3>{service.title}</h3><p>{service.detail}</p><div className="service-row__tags">{service.labels.map(label => <span key={label}>{label}</span>)}</div></div><a href="#assistant" className="service-row__link" aria-label={`Discuter d'un projet : ${service.title}`}><ArrowUpRight size={24}/></a></Reveal>
      })}</div>
    </div>
  </section>
}
