import { useMemo, useState } from 'react'
import type { ChangeEvent as ReactChangeEvent, FormEvent as ReactFormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ClipboardCopy, MessageCircle, Pencil, RotateCcw, Sparkles } from 'lucide-react'
import { assistantServices, budgetOptions, featureOptions, timelineOptions } from '../content/fr'
import { whatsappUrl } from '../config/site'
import EmailComposer from './EmailComposer'
import { createInquiryMessage, emptyInquiry, inquirySteps, validateStep } from '../lib/inquiry'
import type { InquiryAnswers, InquiryStepId, ServiceId } from '../types'
import Reveal from './Reveal'

const stepTitles: Record<InquiryStepId, string> = {
  service: 'Votre besoin', business: 'Votre activité', goal: 'Votre objectif', hasSite: 'Site existant', siteUrl: 'Adresse du site', features: 'Fonctionnalités', budget: 'Budget', timeline: 'Délai',
}
const prompts: Record<InquiryStepId, string> = {
  service: 'Que souhaitez-vous réaliser ?',
  business: 'Parlez-moi de votre activité.',
  goal: 'Quel résultat souhaitez-vous obtenir ?',
  hasSite: 'Avez-vous déjà un site internet ?',
  siteUrl: 'Quelle est l’adresse de votre site ?',
  features: 'Quelles fonctionnalités vous intéressent ?',
  budget: 'Quelle enveloppe avez-vous en tête ?',
  timeline: 'Quand aimeriez-vous lancer votre projet ?',
}
const serviceGoalPrompts: Partial<Record<ServiceId, string>> = {
  vitrine: 'Que doit accomplir votre futur site ?',
  reservation: 'Comment souhaitez-vous recevoir des réservations ?',
  ecommerce: 'Que voulez-vous vendre et à qui ?',
  maintenance: 'De quelles interventions votre site a-t-il besoin ?',
  bug: 'Quel problème souhaitez-vous résoudre ?',
  performance: 'Que souhaitez-vous améliorer sur votre site ?',
  automation: 'Quelle tâche ou quel processus voulez-vous automatiser ?',
}
const serviceGoalExamples: Partial<Record<ServiceId, string>> = {
  vitrine: 'Ex. Présenter mon activité, montrer mes réalisations et générer des contacts…',
  reservation: 'Ex. Recevoir des demandes directes pour mon riad et présenter les chambres…',
  ecommerce: 'Ex. Vendre des produits artisanaux et gérer les commandes en ligne…',
  maintenance: 'Ex. Mettre à jour mon site WordPress, sécuriser les pages et corriger le menu…',
  bug: 'Ex. Le formulaire n’envoie plus les messages sur mobile depuis la dernière mise à jour…',
  performance: 'Ex. Mon site est lent sur téléphone et mes pages chargent trop longtemps…',
  automation: 'Ex. Transférer mes demandes clients vers un tableau de suivi et notifier mon équipe…',
}
const descriptions: Record<InquiryStepId, string> = {
  service: 'Choisissez l’option qui se rapproche le plus de votre projet.',
  business: 'Riad, maison d’hôtes, commerce, entreprise, indépendant…',
  goal: 'Quelques phrases suffisent. Cela m’aidera à comprendre votre priorité.',
  hasSite: 'Cela permet de distinguer une création de site d’une amélioration de l’existant.',
  siteUrl: 'Facultatif, mais utile pour comprendre votre contexte technique.',
  features: 'Vous pouvez en choisir plusieurs, ou passer cette question.',
  budget: 'Une indication suffit ; il ne s’agit pas d’un devis ou d’un tarif annoncé.',
  timeline: 'Cette information aide à envisager un planning réaliste.',
}

export default function ProjectAssistant() {
  const [answers, setAnswers] = useState<InquiryAnswers>({ ...emptyInquiry, features: [] })
  const [stepIndex, setStepIndex] = useState(0)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [handoff, setHandoff] = useState('')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const reducedMotion = useReducedMotion()
  const steps = useMemo(() => inquirySteps(answers), [answers])
  const step = steps[stepIndex]
  const isReview = !step
  const progress = isReview ? 100 : Math.round((stepIndex / steps.length) * 100)
  const message = useMemo(() => createInquiryMessage(answers, assistantServices), [answers])
  const subject = `Demande de projet web — ${assistantServices.find(item => item.id === answers.service)?.label ?? 'Prise de contact'}`
  const whatsAppHref = whatsappUrl(message)

  function update<K extends keyof InquiryAnswers>(key: K, value: InquiryAnswers[K]) {
    setAnswers(prev => ({ ...prev, [key]: value }))
    setError(''); setHandoff(''); setCopyStatus('idle')
  }
  function changeService(service: ServiceId) {
    setAnswers(prev => ({ ...prev, service, features: [], featureNotes: '' }))
    setError('')
  }
  function toggleFeature(value: string) {
    setAnswers(prev => ({ ...prev, features: prev.features.includes(value) ? prev.features.filter(x => x !== value) : [...prev.features, value] }))
    setError('')
  }
  function next() {
    if (!step) return
    const problem = validateStep(step, answers)
    if (problem) { setError(problem); return }
    setError('')
    if (editing) { setEditing(false); setStepIndex(inquirySteps(answers).length) }
    else setStepIndex(n => n + 1)
  }
  function back() {
    setError('')
    if (editing) { setEditing(false); setStepIndex(steps.length) }
    else setStepIndex(n => Math.max(0, n - 1))
  }
  function edit(stepId: InquiryStepId) {
    setEditing(true)
    setStepIndex(steps.indexOf(stepId))
    setError(''); setHandoff('')
  }
  function reset() {
    setAnswers({ ...emptyInquiry, features: [] }); setStepIndex(0)
    setEditing(false); setError(''); setHandoff(''); setCopyStatus('idle')
  }
  async function copyMessage() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(message)
      setCopyStatus('copied')
    } catch { setCopyStatus('error') }
  }
  function renderQuestion() {
    switch (step) {
      case 'service': return <div className="assistant-service-grid" role="group" aria-label="Type de projet">{assistantServices.map(option => <button type="button" key={option.id} className={`assistant-choice ${answers.service === option.id ? 'selected' : ''}`} onClick={() => changeService(option.id)} aria-pressed={answers.service === option.id}><span className="choice-check">{answers.service === option.id ? <Check size={14}/> : <span/>}</span><span><strong>{option.label}</strong><small>{option.short}</small></span></button>)}</div>
      case 'business': return <div className="assistant-field"><label htmlFor="assistant-business">Votre secteur ou type d’entreprise</label><input id="assistant-business" maxLength={160} autoComplete="organization" value={answers.business} onChange={(e: ReactChangeEvent<HTMLInputElement>) => update('business',e.target.value)} placeholder="Ex. Riad de 8 chambres à Marrakech" /><span className="input-help">Pas besoin de fournir votre nom ou vos coordonnées à cette étape.</span></div>
      case 'goal': return <div className="assistant-field"><label htmlFor="assistant-goal">Décrivez votre projet et ce que vous voulez améliorer</label><textarea id="assistant-goal" rows={5} maxLength={1200} value={answers.goal} onChange={(e: ReactChangeEvent<HTMLTextAreaElement>) => update('goal',e.target.value)} placeholder={serviceGoalExamples[answers.service as ServiceId] ?? 'Ex. Décrivez ce que vous voulez créer ou améliorer…'} /><span className="input-help">{answers.goal.trim().length} / 1 200 caractères</span></div>
      case 'hasSite': return <div className="assistant-binary">{([{ id:'yes',label:'Oui, j’ai déjà un site',hint:'Je souhaite le modifier ou l’améliorer' },{ id:'no',label:'Non, je pars de zéro',hint:'J’ai besoin d’une nouvelle solution' }] as const).map(item => <button type="button" key={item.id} className={`assistant-choice ${answers.hasSite === item.id ? 'selected' : ''}`} aria-pressed={answers.hasSite === item.id} onClick={() => { update('hasSite', item.id); if (item.id === 'no') update('siteUrl','') }}><span className="choice-check">{answers.hasSite === item.id ? <Check size={14}/> : <span/>}</span><span><strong>{item.label}</strong><small>{item.hint}</small></span></button>)}</div>
      case 'siteUrl': return <div className="assistant-field"><label htmlFor="assistant-url">URL de votre site actuel (facultatif)</label><input id="assistant-url" type="text" inputMode="url" autoComplete="url" maxLength={250} value={answers.siteUrl} onChange={(e: ReactChangeEvent<HTMLInputElement>) => update('siteUrl',e.target.value)} placeholder="https://www.monsite.ma"/><span className="input-help">Vous pouvez continuer sans renseigner ce champ.</span></div>
      case 'features': return <><div className="assistant-feature-grid" role="group" aria-label="Fonctionnalités souhaitées">{(featureOptions[answers.service] ?? featureOptions.other).map(item => <button type="button" className={`assistant-feature ${answers.features.includes(item) ? 'selected' : ''}`} aria-pressed={answers.features.includes(item)} key={item} onClick={() => toggleFeature(item)}><span>{answers.features.includes(item) ? <Check size={14}/> : '+'}</span> {item}</button>)}</div><div className="assistant-field assistant-field--after"><label htmlFor="assistant-feature-extra">Autres besoins (facultatif)</label><input id="assistant-feature-extra" maxLength={350} value={answers.featureNotes} onChange={(e: ReactChangeEvent<HTMLInputElement>) => update('featureNotes',e.target.value)} placeholder="Autre fonctionnalité, contrainte ou idée…" /></div></>
      case 'budget': return <div className="assistant-vertical-choices">{budgetOptions.map(budget => <button type="button" key={budget} className={`assistant-choice ${answers.budget === budget ? 'selected' : ''}`} aria-pressed={answers.budget === budget} onClick={() => update('budget',budget)}><span className="choice-check">{answers.budget === budget ? <Check size={14}/> : <span/>}</span><strong>{budget}</strong></button>)}</div>
      case 'timeline': return <div className="assistant-vertical-choices">{timelineOptions.map(timeline => <button type="button" key={timeline} className={`assistant-choice ${answers.timeline === timeline ? 'selected' : ''}`} aria-pressed={answers.timeline === timeline} onClick={() => update('timeline',timeline)}><span className="choice-check">{answers.timeline === timeline ? <Check size={14}/> : <span/>}</span><strong>{timeline}</strong></button>)}</div>
      default: return null
    }
  }

  const summaryItems: Array<{ label: string; value: string; stepId: InquiryStepId }> = [
    { label: 'Type de projet', value: assistantServices.find(service => service.id === answers.service)?.label ?? 'Non précisé', stepId:'service' },
    { label: 'Activité', value: answers.business, stepId:'business' },
    { label: 'Objectif', value: answers.goal, stepId:'goal' },
    { label: 'Site existant', value: answers.hasSite === 'yes' ? 'Oui' : 'Non', stepId:'hasSite' },
    ...(answers.hasSite === 'yes' ? [{ label:'Adresse du site', value: answers.siteUrl || 'Non renseignée', stepId:'siteUrl' as InquiryStepId }] : []),
    { label: 'Fonctionnalités', value: [...answers.features, answers.featureNotes.trim()].filter(Boolean).join(' · ') || 'À préciser ensemble', stepId:'features' },
    { label: 'Budget indicatif', value: answers.budget, stepId:'budget' },
    { label: 'Délai envisagé', value: answers.timeline, stepId:'timeline' },
  ]

  return <section id="assistant" className="section assistant-section" aria-labelledby="assistant-title">
    <div className="site-container"><Reveal className="assistant-intro"><span className="eyebrow"><span className="eyebrow-line"/> UN PREMIER ÉCHANGE, SANS ENGAGEMENT</span><h2 id="assistant-title">Parlons de <em>votre projet.</em></h2><p>Quelques questions simples pour clarifier votre idée. À la fin, un message personnalisé sera prêt à envoyer par WhatsApp ou e-mail.</p></Reveal>
      <Reveal className="assistant-shell"><aside className="assistant-sidebar"><div className="assistant-sidebar__top"><span className="assistant-avatar"><Sparkles size={21}/></span><span><strong>Assistant projet</strong><small>Par Anas Ait Daoud · 100 % local</small></span></div><div className="assistant-welcome">Bonjour ! 👋<br/>Je suis là pour vous aider à mettre votre idée au clair, à votre rythme.</div>
        <div className="assistant-progress"><div className="assistant-progress__label"><span>VOTRE AVANCEMENT</span><b>{progress}%</b></div><div className="assistant-progress__track"><div style={{width:`${progress}%`}}/></div></div>
        <div className="assistant-steps" aria-label="Étapes du questionnaire">{steps.map((item,i) => <div key={item} className={`assistant-step ${stepIndex === i ? 'current' : ''} ${stepIndex > i || isReview ? 'completed' : ''}`}><span>{stepIndex > i || isReview ? <Check size={12}/> : String(i+1).padStart(2,'0')}</span><p>{stepTitles[item]}</p></div>)}</div>
        <div className="assistant-sidebar__note"><span className="availability-dot"/> Aucune donnée transmise pendant le questionnaire.</div>
      </aside>
      <div className="assistant-main"><div className="assistant-main__eyebrow">{isReview ? 'DERNIÈRE ÉTAPE · RÉCAPITULATIF' : `QUESTION ${String(stepIndex+1).padStart(2,'0')} / ${String(steps.length).padStart(2,'0')}`}</div>
        <AnimatePresence mode="wait" initial={false}><motion.div key={isReview ? 'review' : step} initial={reducedMotion ? false : {opacity:0,x:15}} animate={{opacity:1,x:0}} exit={reducedMotion ? undefined : {opacity:0,x:-12}} transition={{duration:.2}}>
          {isReview ? <div className="assistant-review"><div className="assistant-review__heading"><CheckCircle2 size={29}/><h3>Votre projet prend forme.</h3><p>Vérifiez les informations ci-dessous. Vous pouvez tout modifier avant de préparer votre message.</p></div><div className="assistant-review__grid">{summaryItems.map(item => <div key={item.stepId} className="assistant-review__item"><div><small>{item.label}</small><p>{item.value}</p></div><button type="button" onClick={() => edit(item.stepId)} aria-label={`Modifier : ${item.label}`}><Pencil size={15}/></button></div>)}</div><div className="assistant-message-preview"><div><strong>Message prêt à envoyer</strong><button type="button" onClick={copyMessage}><ClipboardCopy size={16}/> Copier</button></div><pre>{message}</pre></div>
            {copyStatus !== 'idle' && <p role="status" className={`assistant-feedback ${copyStatus === 'error' ? 'is-error' : ''}`}>{copyStatus === 'copied' ? 'Message copié dans le presse-papiers.' : 'Copie non autorisée par votre navigateur. Sélectionnez le texte pour le copier manuellement.'}</p>}
            <div className="assistant-submit"><a href={whatsAppHref ?? undefined} className={`button button-gold ${!whatsAppHref ? 'button-disabled' : ''}`} target="_blank" rel="noopener noreferrer" aria-disabled={!whatsAppHref} onClick={() => setHandoff('WhatsApp va s’ouvrir avec votre message prérempli. Vous devrez confirmer son envoi dans l’application.')}><MessageCircle size={18}/> Ouvrir WhatsApp <ArrowRight size={17}/></a><EmailComposer variant="assistant" subject={subject} body={message}/></div>
            {handoff && <p className="assistant-feedback" role="status">{handoff}</p>}
            <p className="assistant-privacy">Ce site n’envoie rien automatiquement. Aucune demande n’est enregistrée sur un serveur ; vous contrôlez l’envoi.</p>
            <button type="button" className="assistant-reset" onClick={reset}><RotateCcw size={15}/> Recommencer une nouvelle demande</button>
          </div> : <form className="assistant-question" onSubmit={(e: ReactFormEvent<HTMLFormElement>) => { e.preventDefault(); next() }} noValidate>
            <div className="assistant-question__header"><h3>{step === 'goal' ? serviceGoalPrompts[answers.service as ServiceId] ?? prompts.goal : prompts[step]}</h3><p>{descriptions[step]}</p></div>
            {renderQuestion()}
            {error && <p className="assistant-error" role="alert">{error}</p>}
            <div className="assistant-action-row"><button type="button" className="assistant-back" onClick={back} disabled={stepIndex===0 && !editing}><ArrowLeft size={16}/> {editing ? 'Annuler' : 'Précédent'}</button><button type="submit" className="button button-gold">{editing ? 'Enregistrer' : stepIndex === steps.length-1 ? 'Voir mon récapitulatif' : 'Continuer'} <ArrowRight size={17}/></button></div>
          </form>}
        </motion.div></AnimatePresence>
      </div></Reveal>
    </div>
  </section>
}
