import { ArrowUpRight, Github, Linkedin, MapPin, MessageCircle } from 'lucide-react'
import { siteConfig, whatsappUrl } from '../config/site'
import EmailComposer from './EmailComposer'
import Reveal from './Reveal'

export default function Contact() {
  const contacts = [
    { name: 'WhatsApp', value: 'Un message, une première discussion', url: whatsappUrl('Bonjour Anas, je souhaite échanger avec vous au sujet de mon projet web.'), icon: MessageCircle },
    { name: 'LinkedIn', value: 'Mon profil professionnel', url: siteConfig.socials.linkedin, icon: Linkedin },
    { name: 'GitHub', value: 'Mes projets et dépôts publics', url: siteConfig.socials.github, icon: Github },
  ].filter(contact => Boolean(contact.url))

  return <section id="contact" className="section contact-section"><div className="contact-ambient" aria-hidden="true"/><div className="site-container"><Reveal className="contact-top"><span className="eyebrow"><span className="eyebrow-line"/> LE PROCHAIN PROJET COMMENCE ICI</span><h2>Vous avez une idée ?<br/><em>Faisons-la exister.</em></h2><p>Un site pour votre établissement, une application sur mesure ou un problème technique à résoudre : parlons de ce qui vous ferait avancer.</p><a className="button button-gold button-contact" href="#assistant">Préparer ma demande <ArrowUpRight size={20}/></a></Reveal>
    <Reveal className="contact-bottom"><div className="contact-bottom__label"><MapPin size={18}/><span>MARRAKECH, MAROC</span></div><div className="contact-links">{contacts.map(({name,value,url,icon:Icon})=><a key={name} href={url!} target={url!.startsWith('https:') ? '_blank' : undefined} rel={url!.startsWith('https:') ? 'noopener noreferrer' : undefined}><Icon size={20}/><span><strong>{name}</strong><small>{value}</small></span><ArrowUpRight size={18}/></a>)}<EmailComposer variant="contact" subject="Prise de contact — projet web" body={"Bonjour Anas,\n\nJe souhaite discuter de mon projet web.\n\nMerci !"}/></div></Reveal>
  </div></section>
}
