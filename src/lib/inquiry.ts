import type { InquiryAnswers, InquiryStepId, ServiceId } from '../types'

export const emptyInquiry: InquiryAnswers = {
  service: '', business: '', goal: '', hasSite: '', siteUrl: '',
  features: [], featureNotes: '', budget: '', timeline: '',
}

export const inquirySteps = (answers: InquiryAnswers): InquiryStepId[] => [
  'service', 'business', 'goal', 'hasSite',
  ...(answers.hasSite === 'yes' ? (['siteUrl'] as InquiryStepId[]) : []),
  'features', 'budget', 'timeline',
]

export function isValidUrl(value: string): boolean {
  if (!value.trim()) return true // optional
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
    return (url.protocol === 'https:' || url.protocol === 'http:') && url.hostname.includes('.')
  } catch { return false }
}

export function validateStep(step: InquiryStepId, data: InquiryAnswers): string | null {
  switch (step) {
    case 'service': return data.service ? null : 'Choisissez le type de projet.'
    case 'business': return data.business.trim().length >= 2 ? null : 'Décrivez votre activité en quelques mots.'
    case 'goal': return data.goal.trim().length >= 10 ? null : 'Ajoutez au moins 10 caractères pour préciser votre objectif.'
    case 'hasSite': return data.hasSite ? null : 'Sélectionnez une réponse.'
    case 'siteUrl': return isValidUrl(data.siteUrl) ? null : 'Indiquez une URL valide ou laissez ce champ vide.'
    case 'features': return null // volontairement facultatif
    case 'budget': return data.budget ? null : 'Sélectionnez une fourchette, même indicative.'
    case 'timeline': return data.timeline ? null : 'Choisissez votre horizon de lancement.'
  }
}

export function getServiceLabel(id: ServiceId | '', options: ReadonlyArray<{ id: ServiceId; label: string }>): string {
  return options.find(option => option.id === id)?.label ?? 'Projet web'
}

/** Message généré localement : aucune donnée n'est envoyée à un serveur. */
export function createInquiryMessage(
  data: InquiryAnswers,
  options: ReadonlyArray<{ id: ServiceId; label: string }>,
): string {
  const label = getServiceLabel(data.service, options)
  const trim = (v: string) => v.trim().replace(/\s+/g, ' ')
  const features = [...data.features, ...(trim(data.featureNotes) ? [trim(data.featureNotes)] : [])]
  const lines = [
    'Bonjour Anas,',
    '',
    `Je vous contacte pour discuter d’un projet : ${label.toLowerCase()}.`,
    '',
    `Mon activité : ${trim(data.business)}.`,
    `Mon objectif : ${trim(data.goal)}.`,
    `Site existant : ${data.hasSite === 'yes' ? 'Oui' : 'Non'}.`,
  ]
  if (data.hasSite === 'yes' && trim(data.siteUrl)) {
    lines.push(`Adresse du site : ${trim(data.siteUrl)}.`)
  }
  if (features.length) lines.push(`Fonctionnalités / besoins : ${features.join(', ')}.`)
  lines.push(`Budget indicatif : ${data.budget}.`)
  lines.push(`Délai souhaité : ${data.timeline}.`)
  lines.push('', 'Pourrions-nous échanger sur la faisabilité et les prochaines étapes ?', '', 'Merci et à bientôt !')
  return lines.join('\n')
}
