import { ArrowUpRight } from 'lucide-react'
import { skills } from '../content/fr'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Skills() {
  return <section className="section skills-section" id="competences"><div className="site-container">
    <Reveal><SectionHeading eyebrow="OUTILS & SAVOIR-FAIRE" index="04" title="La technique,\nau service des idées." introduction="Un socle solide, des outils complémentaires et la curiosité d’explorer la bonne technologie selon le projet." /></Reveal>
    <div className="skills-grid">{skills.map((group,index) => <Reveal key={group.title} delay={index * .09} className="skill-card"><span className="skill-card__number">0{index+1}</span><h3>{group.title}</h3><p>{group.subtitle}</p><div className="skill-chip-list">{group.tech.map(tech => <span key={tech}>{tech}</span>)}</div></Reveal>)}</div>
    <Reveal className="skills-closer"><span>VOUS AVEZ UN PROJET SPÉCIFIQUE ?</span><a href="#assistant">Explorons la solution ensemble <ArrowUpRight size={18}/></a></Reveal>
  </div></section>
}
