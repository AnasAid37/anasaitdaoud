import { ArrowUpRight, CornerDownRight } from 'lucide-react'
import { cases } from '../content/fr'
import ProjectScreenshot from './ProjectScreenshot'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Projects() {
  return <section id="projets" className="section projects-section" aria-labelledby="projects-title">
    <div className="site-container">
      <Reveal><SectionHeading id="projects-title" eyebrow="TRAVAUX SÉLECTIONNÉS" index="01" title="Des projets concrets.\nDes idées qui prennent vie." introduction="Des produits personnels aux réalisations pour des entreprises : un aperçu fidèle de ce que je construis." /></Reveal>
      <div className="projects-grid">
        {cases.map((project, index) => <Reveal key={project.id} delay={(index % 2) * .12} className={`project-card project-card--${project.id}`}>
          <div className="project-card__visual"><ProjectScreenshot src={project.image} name={project.title} domain={project.domain} priority={index === 0}/></div>
          <div className="project-card__info"><div className="project-card__meta"><span>{project.num} / {project.kind}</span><span className="project-card__line"/></div>
            <h3>{project.title}<span className="project-card__arrow">{project.href ? <ArrowUpRight size={23}/> : <CornerDownRight size={23}/>}</span></h3>
            <p className="project-card__subtitle">{project.subtitle}</p>
            <p className="project-card__description">{project.description}</p>
            <div className="project-card__footer"><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              {project.href ? <a className="text-link" href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`Visiter ${project.title} dans un nouvel onglet`}>Voir le site <ArrowUpRight size={16}/></a> : <span className="project-in-progress">EN DÉVELOPPEMENT</span>}
            </div></div>
        </Reveal>)}
      </div>
      <div className="projects-after"><span>UNE IDÉE EN TÊTE ?</span><a href="#assistant">Parlons de votre projet <ArrowUpRight size={17}/></a></div>
    </div>
  </section>
}
