import { ArrowUpRight, Check, MapPin } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function About() {
  return <section id="apropos" className="section about-section">
    <div className="site-container"><Reveal><SectionHeading eyebrow="DERRIÈRE LE CODE" index="03" title="Un développeur.\nUne vision business." /></Reveal>
      <div className="about-grid">
        <Reveal className="about-art"><div className="about-art__border"/><div className="about-art__monogram" aria-hidden="true">A<span>/</span></div><div className="about-art__caption"><MapPin size={16}/> MARRAKECH, MAROC <span>— 31.6295° N</span></div><div className="about-art__quote">CONSTRUIRE UTILE.<br/><span>PENSER DURABLE.</span></div></Reveal>
        <Reveal className="about-copy" delay={.12}><p className="about-lead">Je suis <strong>Anas Ait Daoud</strong>, développeur Full Stack freelance basé à Marrakech. Je crée des expériences web qui servent des objectifs réels, pas seulement de jolies interfaces.</p><p>Mon cœur de métier : <strong>Laravel / PHP et React</strong>. Depuis 2023, je travaille sur des sites pour des entreprises, du e-commerce, de la maintenance et mes propres produits web.</p><p>J’ai également travaillé en équipe chez <strong>EF2C Maroc</strong> sur des applications internes : fonctionnalités, corrections, API REST et améliorations ciblées. Cette expérience nourrit une approche attentive à la fiabilité et à la continuité des projets.</p>
          <div className="about-values"><div><Check size={16}/><span>Comprendre votre besoin avant de coder</span></div><div><Check size={16}/><span>Expliquer clairement les choix techniques</span></div><div><Check size={16}/><span>Construire des solutions simples à maintenir</span></div></div><a href="#contact" className="text-link text-link--large">Faire connaissance <ArrowUpRight size={18}/></a>
        </Reveal>
      </div>
      <Reveal className="about-timeline"><div className="timeline-item"><small>2023 — AUJOURD’HUI</small><strong>Développement web freelance</strong><span>Sites web, e-commerce, maintenance et projets numériques</span></div><div className="timeline-item"><small>2025 — 2026</small><strong>Développeur Full Stack · EF2C Maroc</strong><span>Applications internes, Laravel, React et travail en équipe</span></div><div className="timeline-item"><small>2023 — 2025</small><strong>Formation en développement digital</strong><span>Technicien spécialisé Full Stack · ISTA NTIC SYBA</span></div></Reveal>
    </div>
  </section>
}
