import type { ServiceOption } from '../types'

export const navigation = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Projets', href: '#projets' },
  { label: 'Services', href: '#services' },
  { label: 'À propos', href: '#apropos' },
  { label: 'Contact', href: '#contact' },
] as const

export const cases = [
  {
    id: 'stockpro',
    num: '01',
    kind: 'Produit SaaS · En production',
    title: 'StockPro',
    subtitle: 'La gestion commerciale, plus simplement.',
    description: 'Conception, développement et mise en production d’un logiciel pour centraliser les stocks, les fournisseurs, les crédits clients et le suivi d’activité. Interface responsive, multi-utilisateurs et multilingue.',
    tags: ['SaaS', 'Gestion commerciale', 'Développement full stack'],
    href: 'https://stockpro.ma',
    image: '/images/stockpro.webp',
    domain: 'stockpro.ma',
  },
  {
    id: 'toolkit',
    num: '02',
    kind: 'Réalisation client · Site vitrine',
    title: 'Toolkit Hub',
    subtitle: 'Une vitrine claire pour un métier technique.',
    description: 'Réalisation d’un site web pour une entreprise spécialisée dans la climatisation, dans le cadre de mon activité freelance.',
    tags: ['Site entreprise', 'Web design', 'Développement web'],
    href: 'https://toolkit-hub.com',
    image: '/images/toolkit-hub.webp',
    domain: 'toolkit-hub.com',
  },
  {
    id: 'myprestataire',
    num: '03',
    kind: 'Plateforme · Marketplace',
    title: 'MyPrestataire',
    subtitle: 'Mettre en relation les bons profils.',
    description: 'Marketplace organisée par catégories et recherche ciblée, avec authentification selon les rôles et tableaux de bord adaptés à chaque profil.',
    tags: ['Marketplace', 'Authentification', 'Tableaux de bord'],
    href: 'https://myprestataire.com',
    image: '/images/myprestataire.webp',
    domain: 'myprestataire.com',
  },
  {
    id: 'gymflow',
    num: '04',
    kind: 'Projet personnel · En développement',
    title: 'GymFlow',
    subtitle: 'Une plateforme pensée pour les salles de sport.',
    description: 'Développement en cours d’un SaaS multi-tenant visant à isoler les données par salle et à gérer rôles, abonnements, facturation et check-in par QR code. Fonctionnalités en cours de réalisation.',
    tags: ['Multi-tenant', 'SaaS', 'Projet en cours'],
    href: '',
    image: '/images/gymflow.webp',
    domain: 'GymFlow · Projet personnel',
  },
  {
    id: 'riad',
    num: '05',
    kind: 'MVP · Réservation directe pour riad',
    title: 'Riad Lokman',
    subtitle: 'Un site de réservation directe pour l’hospitalité à Marrakech.',
    description: 'Développement d’un MVP Laravel pour présenter les chambres d’un riad, calculer les tarifs et recevoir des demandes de réservation sans compte client. Back-office privé pour gérer chambres, demandes et contenus. Les réservations sont confirmées manuellement ; aucun paiement en ligne n’est intégré dans le MVP.',
    tags: ['Laravel 12', 'Blade / MySQL', 'Réservation directe', 'Back-office'],
    href: 'https://mediumspringgreen-aardvark-475557.hostingersite.com/',
    image: '/images/riad-lokman.webp',
    domain: 'Riad Lokman · Démonstration web',
  },
] as const

export const services = [
  { number: '01', title: 'Sites vitrines & sur mesure', icon: 'layout', detail: 'Des sites modernes, rapides et adaptés à votre identité, pour transformer vos visites en prises de contact.', labels: ['Entreprises', 'Indépendants', 'Riads'] },
  { number: '02', title: 'Réservation & hôtellerie', icon: 'calendar', detail: 'Un parcours clair pour présenter votre établissement, rassurer vos voyageurs et faciliter leurs demandes de réservation.', labels: ['Riads', 'Maisons d’hôtes', 'Hospitalité'] },
  { number: '03', title: 'Boutiques e-commerce', icon: 'shopping', detail: 'Catalogues, parcours d’achat et expériences mobiles conçus pour simplifier la vente en ligne.', labels: ['E-commerce', 'Parcours d’achat'] },
  { number: '04', title: 'Laravel & applications métiers', icon: 'code', detail: 'Applications web personnalisées, interfaces administratives, bases de données et intégrations d’API REST.', labels: ['Laravel / PHP', 'API REST', 'Back-office'] },
  { number: '05', title: 'Maintenance & dépannage', icon: 'shield', detail: 'Suivi WordPress, corrections d’anomalies, améliorations techniques et résolution de problèmes sur l’existant.', labels: ['WordPress', 'Bugs', 'Maintenance'] },
  { number: '06', title: 'Performance & automatisation', icon: 'zap', detail: 'Optimisation des pages et workflows n8n pour réduire les tâches répétitives et fluidifier vos opérations.', labels: ['Vitesse', 'SEO technique', 'n8n'] },
] as const

export const skills = [
  { title: 'Mon socle principal', subtitle: 'Les outils au cœur de ma pratique', tech: ['Laravel', 'PHP', 'React', 'JavaScript', 'HTML / CSS', 'SQL', 'MySQL'] },
  { title: 'Projets & collaboration', subtitle: 'Technologies déjà utilisées en contexte projet', tech: ['Next.js', 'NestJS', 'Prisma', 'Keycloak', 'PostgreSQL', 'API REST'] },
  { title: 'Production & maintenance', subtitle: 'Des fondations solides pour le quotidien', tech: ['Git / GitLab', 'Docker (intermédiaire)', 'WordPress', 'Postman', 'Sécurité web', 'Optimisation'] },
  { title: 'Automatisation & visibilité', subtitle: 'L’expérience web au service du business', tech: ['n8n', 'SEO', 'Google Analytics', 'Google Ads', 'Meta Ads'] },
] as const

export const assistantServices: ServiceOption[] = [
  { id: 'vitrine', label: 'Site vitrine / sur mesure', short: 'Un nouveau site pour mon activité' },
  { id: 'reservation', label: 'Site de réservation', short: 'Riad, hôtel, maison d’hôtes…' },
  { id: 'ecommerce', label: 'Boutique e-commerce', short: 'Vendre mes produits en ligne' },
  { id: 'maintenance', label: 'Maintenance web', short: 'Suivi ou mise à jour d’un site' },
  { id: 'bug', label: 'Correction de bugs', short: 'Résoudre un problème existant' },
  { id: 'performance', label: 'Optimisation / performance', short: 'Améliorer un site existant' },
  { id: 'automation', label: 'Automatisation', short: 'Simplifier mes processus' },
  { id: 'other', label: 'Autre projet', short: 'Une idée différente à discuter' },
]

export const featureOptions: Record<string, string[]> = {
  vitrine: ['Présentation des services', 'Formulaire de contact', 'WhatsApp', 'Multilingue', 'Blog', 'SEO'],
  reservation: ['Demande de réservation', 'Calendrier', 'Paiement en ligne', 'Galerie photos', 'Multilingue', 'WhatsApp'],
  ecommerce: ['Catalogue produits', 'Panier et paiement', 'Livraison', 'Gestion des commandes', 'Promotions', 'WhatsApp'],
  maintenance: ['Mises à jour', 'Sauvegardes', 'Sécurité', 'Modification de pages', 'Maintenance WordPress'],
  bug: ['Erreur d’affichage', 'Formulaire défaillant', 'Problème de connexion', 'Bug mobile', 'Erreur serveur'],
  performance: ['Vitesse de chargement', 'Expérience mobile', 'SEO technique', 'Images lourdes', 'Problème de stabilité'],
  automation: ['Formulaires / CRM', 'E-mails automatiques', 'Synchronisation d’outils', 'Workflows n8n', 'API / intégrations'],
  other: ['Conception', 'Développement', 'Conseil', 'Maintenance'],
}

export const budgetOptions = [
  'Moins de 3 000 MAD',
  '3 000 – 7 000 MAD',
  '7 000 – 15 000 MAD',
  'Plus de 15 000 MAD',
  'À définir ensemble',
]

export const timelineOptions = [
  'Dès que possible',
  'Dans le mois',
  'Sous 1 à 3 mois',
  'Je suis flexible',
]
