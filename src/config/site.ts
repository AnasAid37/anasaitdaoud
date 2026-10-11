/**
 * POINT CENTRAL DE CONFIGURATION
 * Les coordonnées téléphone/e-mail proviennent du CV fourni par le propriétaire.
 * Remplacez les chaînes vides par vos véritables liens sociaux avant publication.
 * Ne placez JAMAIS de jeton/API key dans ce fichier : il est envoyé au navigateur.
 */
export const siteConfig = {
  name: 'Anas Ait Daoud',
  title: 'Développeur web freelance',
  location: 'Marrakech, Maroc',
  locale: 'fr-MA',
  email: 'anasaitdd37@gmail.com',
  whatsapp: '212605816821', // Chiffres uniquement, indicatif international compris.
  socials: {
    linkedin: '', // TODO: ex. https://www.linkedin.com/in/identifiant/ ; vide = masqué
    github: '', // TODO: ex. https://github.com/identifiant ; vide = masqué
  },
} as const

export const whatsappUrl = (message: string): string | null => {
  const number = siteConfig.whatsapp.replace(/\D/g, '')
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null
}

export const emailUrl = (subject: string, message: string): string | null => {
  const address = siteConfig.email.trim()
  return address ? `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}` : null
}


/** Liens de composition navigateur + client natif, sans envoi côté site. */
export const emailComposeLinks = (subject: string, message: string) => {
  const address = siteConfig.email.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) return null
  const to = encodeURIComponent(address)
  const su = encodeURIComponent(subject)
  const body = encodeURIComponent(message)
  return {
    mailto: `mailto:${address}?subject=${su}&body=${body}`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${body}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${su}&body=${body}`,
  }
}
