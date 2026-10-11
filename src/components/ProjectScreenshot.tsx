/** Real, user-supplied screenshots — never illustrative mock UI. */
export default function ProjectScreenshot({src,name,domain,priority=false}:{src:string;name:string;domain:string;priority?:boolean}) {
  return <figure className="project-shot" aria-label={`Capture réelle du projet ${name}`}>
    <div className="project-shot__halo" aria-hidden="true" />
    <div className="project-shot__browser">
      <div className="project-shot__toolbar" aria-hidden="true">
        <span className="project-shot__dots"><i/><i/><i/></span>
        <span className="project-shot__address">{domain}</span>
        <span className="project-shot__browser-mark">↗</span>
      </div>
      <div className="project-shot__viewport">
        <img className="project-shot__image" src={src} alt={`Capture d’écran réelle de la page d’accueil de ${name}`} loading={priority?'eager':'lazy'} decoding="async" />
      </div>
    </div>
    <span className="project-shot__caption">CAPTURE DU PROJET <span aria-hidden="true">↗</span></span>
  </figure>
}
