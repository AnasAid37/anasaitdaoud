export type ServiceId =
  | 'vitrine'
  | 'reservation'
  | 'ecommerce'
  | 'maintenance'
  | 'bug'
  | 'performance'
  | 'automation'
  | 'other'

export type HasSite = 'yes' | 'no' | ''
export type InquiryStepId =
  | 'service'
  | 'business'
  | 'goal'
  | 'hasSite'
  | 'siteUrl'
  | 'features'
  | 'budget'
  | 'timeline'

export interface InquiryAnswers {
  service: ServiceId | ''
  business: string
  goal: string
  hasSite: HasSite
  siteUrl: string
  features: string[]
  featureNotes: string
  budget: string
  timeline: string
}

export interface ServiceOption {
  id: ServiceId
  label: string
  short: string
}
