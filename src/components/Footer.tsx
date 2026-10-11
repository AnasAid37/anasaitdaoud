import { ArrowUp, Heart } from 'lucide-react'
import Brand from './Brand'
import { navigation } from '../content/fr'
import { siteConfig } from '../config/site'

export default function Footer() {
  return <footer className="footer"><div className="site-container"><div className="footer-main"><div><Brand/><p>Développement web & solutions digitales<br/>sur mesure à Marrakech.</p></div><nav aria-label="Navigation de pied de page">{navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav><a className="back-to-top" href="#accueil" aria-label="Retour en haut"><ArrowUp size={21}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.</span><div><a href="/mentions-legales.html">Mentions légales</a><a href="/confidentialite.html">Confidentialité</a></div><span className="footer-crafted">Créé avec soin <Heart size={13}/></span></div></div></footer>
}
