import Header from './components/Header'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Services from './components/Services'
import About from './components/About'
import Skills from './components/Skills'
import ProjectAssistant from './components/ProjectAssistant'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  return <>
    <a href="#main-content" className="skip-link">Aller au contenu principal</a>
    <Header theme={theme} onToggleTheme={toggleTheme}/>
    <main id="main-content"><Hero/><Projects/><Services/><About/><Skills/><ProjectAssistant/><Contact/></main>
    <Footer/>
  </>
}
