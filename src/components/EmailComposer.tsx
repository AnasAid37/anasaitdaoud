import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Check, ClipboardCopy, ExternalLink, Mail, X } from 'lucide-react'
import { emailComposeLinks, siteConfig } from '../config/site'

interface EmailComposerProps {
  subject: string
  body: string
  variant: 'assistant' | 'contact' | 'hero'
}

/**
 * Un mailto: dépend d'un client e-mail installé / associé au navigateur.
 * Cette fenêtre propose Gmail, Outlook et la copie manuelle sans backend.
 * Les boutons préparent un BROUILLON : aucun message n'est envoyé par le site.
 */
export default function EmailComposer({ subject, body, variant }: EmailComposerProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [copyState, setCopyState] = useState<'idle' | 'success' | 'error'>('idle')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const id = useId()
  const links = emailComposeLinks(subject, body)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); return }
      if (event.key !== 'Tab') return
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], textarea:not([disabled])'
      )
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      triggerRef.current?.focus()
    }
  }, [open])

  if (!links) return null

  function showModal() { setStatus(''); setCopyState('idle'); setOpen(true) }

  async function copy() {
    const content = `À : ${siteConfig.email}\nObjet : ${subject}\n\n${body}`
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard indisponible')
      await navigator.clipboard.writeText(content)
      setCopyState('success')
      setStatus('Les informations ont été copiées. Collez-les dans votre messagerie et envoyez vous-même le message.')
    } catch {
      setCopyState('error')
      messageRef.current?.focus()
      messageRef.current?.select()
      setStatus('Copie automatique indisponible. Le message est sélectionné ci-dessous : copiez-le manuellement.')
    }
  }

  const trigger = variant === 'hero'
    ? <button ref={triggerRef} type="button" className="email-trigger--hero" aria-label="Écrire un e-mail à Anas" aria-haspopup="dialog" aria-expanded={open} onClick={showModal}><Mail size={19} strokeWidth={1.5}/></button>
    : variant === 'contact'
      ? <button ref={triggerRef} type="button" className="email-trigger--contact" aria-haspopup="dialog" aria-expanded={open} onClick={showModal}><Mail size={20}/><span><strong>E-mail</strong><small>{siteConfig.email}</small></span><ArrowUpRight size={18}/></button>
      : <button ref={triggerRef} type="button" className="button button-outline" aria-haspopup="dialog" aria-expanded={open} onClick={showModal}><Mail size={18}/> Préparer un e-mail</button>

  return <>
    {trigger}
    {open && createPortal(
      <div className="email-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false) }}>
        <div className="email-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}>
          <div className="email-dialog__top">
            <span className="email-dialog__icon"><Mail size={22}/></span>
            <button ref={closeRef} type="button" aria-label="Fermer la fenêtre de messagerie" className="email-dialog__close" onClick={() => setOpen(false)}><X size={21}/></button>
          </div>
          <h2 id={`${id}-title`}>Envoyer votre <em>demande.</em></h2>
          <p id={`${id}-description`}>Choisissez votre messagerie pour ouvrir un <strong>brouillon prérempli</strong>. Le site n'envoie aucun e-mail automatiquement.</p>
          <div className="email-dialog__meta"><span>Destinataire</span><strong>{siteConfig.email}</strong><span>Objet</span><strong>{subject}</strong></div>
          <div className="email-dialog__actions">
            <a className="email-dialog__option" href={links.gmail} target="_blank" rel="noopener noreferrer" onClick={() => setStatus('Gmail s’ouvre dans un nouvel onglet. Connectez-vous si nécessaire, vérifiez le brouillon puis cliquez sur Envoyer.')}><span><strong>Ouvrir Gmail</strong><small>Dans votre navigateur</small></span><ExternalLink size={18}/></a>
            <a className="email-dialog__option" href={links.outlook} target="_blank" rel="noopener noreferrer" onClick={() => setStatus('Outlook s’ouvre dans un nouvel onglet. Connectez-vous si nécessaire, vérifiez le brouillon puis cliquez sur Envoyer.')}><span><strong>Ouvrir Outlook</strong><small>Dans votre navigateur</small></span><ExternalLink size={18}/></a>
            <a className="email-dialog__option" href={links.mailto} onClick={() => setStatus('Si rien ne s’ouvre, aucune application e-mail n’est peut-être configurée. Utilisez Gmail, Outlook ou la copie ci-dessous.')}><span><strong>Application e-mail</strong><small>Mail, Thunderbird, Outlook installé…</small></span><ExternalLink size={18}/></a>
          </div>
          <div className="email-dialog__preview"><div><strong>Votre message</strong><button type="button" onClick={copy}>{copyState === 'success' ? <Check size={16}/> : <ClipboardCopy size={16}/>} {copyState === 'success' ? 'Copié' : 'Copier le message'}</button></div><textarea ref={messageRef} value={body} aria-label="Texte du brouillon" readOnly rows={5}/></div>
          {status && <p role="status" className={`email-dialog__status ${copyState === 'error' ? 'email-dialog__status--error' : ''}`}>{status}</p>}
          <p className="email-dialog__notice">L’envoi doit être confirmé dans votre messagerie. Aucune donnée n’est transmise par ce site.</p>
        </div>
      </div>, document.body
    )}
  </>
}
