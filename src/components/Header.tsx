import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import type { Theme } from '../hooks/useTheme'
import Brand from './Brand'
import { navigation } from '../content/fr'

export default function Header({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#accueil')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 25)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(`#${entry.target.id}`) })
    }, { rootMargin: '-32% 0px -57% 0px' })
    navigation.forEach(item => {
      const element = document.querySelector(item.href)
      if (element) observer.observe(element)
    })
    return () => { window.removeEventListener('scroll', handleScroll); observer.disconnect() }
  }, [])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className={`site-header ${active === '#accueil' && !menuOpen ? 'is-over-hero' : ''} ${scrolled || menuOpen ? 'is-scrolled' : ''}`}>
      <div className="site-header__inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Navigation principale">
          {navigation.map(item => <a key={item.href} href={item.href} className={active === item.href ? 'active' : ''}>{item.label}</a>)}
        </nav>
        <a href="#assistant" className="header-availability"><span className="availability-dot" /> Discutons de votre projet <ArrowUpRight size={14}/></a>
        <button type="button" className="theme-toggle" onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
          title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          aria-pressed={theme === 'light'}>
          {theme === 'dark' ? <Sun size={17} strokeWidth={1.8}/> : <Moon size={17} strokeWidth={1.8}/>}
          <span className="theme-toggle__label">{theme === 'dark' ? 'Clair' : 'Sombre'}</span>
        </button>
        <button className="menu-toggle" onClick={() => setMenuOpen(prev => !prev)} aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation">
          {menuOpen ? <X size={25}/> : <Menu size={25}/>}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && <motion.nav id="mobile-navigation" className="mobile-nav" aria-label="Navigation mobile" initial={{opacity:0,y:-14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-14}} transition={{duration:.2}}>
          {navigation.map((item,index) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><span>0{index+1}</span>{item.label}<ArrowUpRight size={18}/></a>)}
          <a className="mobile-nav-cta" href="#assistant" onClick={() => setMenuOpen(false)}>Parler de mon projet <ArrowUpRight size={18}/></a>
        </motion.nav>}
      </AnimatePresence>
    </header>
  )
}
