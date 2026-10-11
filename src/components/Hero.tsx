import { ArrowDown, ArrowRight, ArrowUpRight, Github, Linkedin, MessageCircle } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { siteConfig, whatsappUrl } from '../config/site'
import EmailComposer from './EmailComposer'

export default function Hero() {
  const reduce = useReducedMotion()
  const intro = { initial: reduce ? false : {opacity:0,y:22}, animate: {opacity:1,y:0}, transition: {duration:.85,ease:'easeOut' as const} }
  const socialLinks = [
    { icon: MessageCircle, label:'WhatsApp', href: whatsappUrl('Bonjour Anas, je souhaite discuter de mon projet web.') },
    { icon: Linkedin, label:'LinkedIn', href: siteConfig.socials.linkedin || null },
    { icon: Github, label:'GitHub', href: siteConfig.socials.github || null },
  ].filter(item => item.href)

  return <section id="accueil" className="hero" aria-labelledby="hero-title">
    <div className="hero-glow" aria-hidden="true" />
    <div className="hero-visual" aria-hidden="true"><img className="hero-portrait" src="/images/cinematic-portrait.webp" alt="" fetchPriority="high" decoding="async" /></div>
    <div className="hero-overlay" aria-hidden="true" />
    <div className="hero-content site-container">
      <motion.div {...intro} className="hero-copy">
        <div className="hero-kicker"><span className="hero-kicker-dot"/> DÉVELOPPEUR WEB FREELANCE <span className="hero-kicker-divider"/> MARRAKECH</div>
        <h1 id="hero-title">Des sites web<br/> qui font grandir<br/><span>votre activité.</span></h1>
        <p className="hero-description">Je conçois des sites web et des solutions digitales sur mesure pour les riads, les entreprises et les entrepreneurs qui veulent aller plus loin.</p>
        <div className="hero-cta"><a className="button button-gold" href="#assistant">Discuter de mon projet <ArrowRight size={17}/></a><a className="button button-outline" href="#projets">Découvrir mes projets <ArrowUpRight size={16}/></a></div>
      </motion.div>
      <div className="hero-bottom"><div className="hero-specialties">DÉVELOPPEMENT WEB <span/> UI / UX <span/> PERFORMANCE <span/> AUTOMATISATION</div>
        <a className="hero-scroll" href="#projets"><span className="mouse-symbol"><span /></span> SCROLL DOWN <ArrowDown size={13}/></a>
        <div className="hero-location">BASÉ À MARRAKECH <span className="location-pin"/></div>
      </div>
    </div>
    <div className="hero-social" aria-label="Réseaux et contacts">
      {socialLinks.map(({icon:Icon,label,href}) => <a key={label} href={href!} target={href!.startsWith('https:') ? '_blank' : undefined} rel={href!.startsWith('https:') ? 'noopener noreferrer' : undefined} aria-label={label}><Icon size={19} strokeWidth={1.5}/></a>)}
      <EmailComposer variant="hero" subject="Prise de contact — projet web" body={"Bonjour Anas,\n\nJe souhaite discuter de mon projet web.\n\nMerci !"}/>
    </div>
    <div className="hero-index" aria-hidden="true"><span className="hero-index-active">01 <i/></span><span>02</span><span>03</span><span>04</span></div>
  </section>
}
