import { siteConfig } from '../config/site'

export default function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a className="brand" href="#accueil" aria-label={`${siteConfig.name} — retour à l’accueil`}>
      <svg className="brand-monogram" viewBox="0 0 48 50" fill="none" aria-hidden="true">
        <path d="M4 41 21.5 8 39 41" stroke="currentColor" strokeWidth="3.2" strokeLinecap="square" />
        <path d="M20 26 27.5 41" stroke="currentColor" strokeWidth="3.2" />
        <path d="M26 5 44 41" stroke="currentColor" strokeWidth="2.2" />
      </svg>
      {!compact && <span className="brand-name">ANAS AIT DAOUD</span>}
    </a>
  )
}
