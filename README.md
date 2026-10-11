# Portfolio cinématique — Anas Ait Daoud

Site professionnel **React + TypeScript + Vite + Tailwind CSS + Motion**, entièrement statique et éditable. Direction visuelle éditoriale en deux variantes : **cinématique noire & dorée** et **ivoire lumineux & champagne/bronze**, inspirées de la même référence. Le changement de thème est disponible dans la navigation sur ordinateur et sur mobile. L’assistant de projet suit un arbre de décisions local ; **aucune clé API, base de données ni connexion** n’est nécessaire.

## 1. Prérequis & installation

- Node.js **20.19+** ou 22.12+
- npm
- Connexion Internet lors de la **première installation** des dépendances npm

```bash
npm install
npm run dev
```

Ouvrez l’URL indiquée dans le terminal (généralement `http://localhost:5173`).

```bash
npm run typecheck     # Vérification TypeScript
npm run test:flows    # Scénarios de la logique assistant
npm run test:email    # Liens et boutons e-mail (sans envoi réel)
npm run test:theme    # Contrôles du bouton clair/sombre et pages légales
npm run test:layout   # Régression alignement du hero et du bouton thème
npm run build         # TypeScript + build Vite optimisé -> dist/
npm run preview       # Prévisualisation du build
```

**Remarque sur l’environnement de génération :** le registre npm n'était pas accessible depuis l'environnement de construction. Le dossier `node_modules` et le lockfile n'ont pas pu être créés, et la compilation complète Vite n'a pas pu y être effectuée. Le code source est livré intégralement ; exécutez les commandes ci-dessus dans un environnement connecté. Des tests locaux sans dépendances supplémentaires ont été effectués sur la logique de l’assistant. Aucun build non réalisé n’est annoncé comme validé.

## 2. Modifier les informations publiques

Fichier unique : **`src/config/site.ts`**.

| Champ | Usage |
| --- | --- |
| `name`, `title`, `location` | Identité affichée |
| `email` | Lien e-mail & brouillon généré |
| `whatsapp` | Lien `wa.me/` (chiffres, indicatif international compris) |
| `socials.linkedin` | URL du profil LinkedIn (vide = lien non affiché) |
| `socials.github` | URL du GitHub (vide = lien non affiché) |
| `src/content/fr.ts` | Données des cinq projets et textes éditoriaux |

Le téléphone `+212 605 816 821` et l’e-mail `anasaitdd37@gmail.com` proviennent du CV fourni. **Ils ne sont pas inventés.** LinkedIn/GitHub sont volontairement vides et masqués jusqu’à renseignement des vraies URL. Pour modifier les textes éditoriaux, consultez **`src/content/fr.ts`** ; les chaînes de l’assistant sont dans **`src/components/ProjectAssistant.tsx`** et peuvent être externalisées pour ajouter une autre langue.

## 3. Portrait fixe et véritables captures des projets

Le visuel de la première section utilise **`public/images/cinematic-portrait.webp`** (portrait stylisé déjà fourni). Il est **fixe** : aucune vidéo ni séquence d'images n'est chargée ou nécessaire.

Les **cinq images** de la rubrique « Projets » sont des captures réelles fournies par le propriétaire, converties en WebP sans ajouter d'interfaces inventées :

| Projet | Image à remplacer si besoin |
| --- | --- |
| StockPro | `public/images/stockpro.webp` |
| Toolkit Hub | `public/images/toolkit-hub.webp` |
| MyPrestataire | `public/images/myprestataire.webp` |
| GymFlow | `public/images/gymflow.webp` |
| Riad Lokman | `public/images/riad-lokman.webp` |

Les fiches éditoriales et leurs liens sont dans **`src/content/fr.ts`**. Le composant `src/components/ProjectScreenshot.tsx` affiche ces fichiers dans un cadre discret rappelant un navigateur ; aucune capture n'est générée dynamiquement depuis les sites externes.

**Riad Lokman** est présenté comme un MVP Laravel de réservation directe pour un riad : fiches de chambres, demandes clients, confirmation manuelle, back-office, et **sans paiement en ligne dans le MVP**. La description provient du README transmis avec le projet ; elle n'implique pas que toutes les fonctions sont vérifiées sur le déploiement public.

## 4. Mode clair / mode sombre

Le portfolio **démarre en mode sombre** afin de conserver l'ambiance cinématique originale. Le bouton « Clair » dans l'en-tête permet de passer à un mode lumineux premium : fond ivoire chaud (`#f7f4ee`), texte charbon (`#24221d`), détails doré/bronze (`#936825`), cartes légèrement contrastées. La photographie du hero, les captures des cinq projets, les textes et les fonctionnalités restent identiques.

- **Choix conservé** dans `localStorage` sous la clé `anas-portfolio-theme` (pas de cookie, pas de serveur).
- **Sans flash au démarrage** : un court script dans `index.html` applique le thème choisi avant l'affichage React.
- **Navigation accessible** : bouton avec titre, étiquette alternative adaptée et `aria-pressed`, utilisable au clavier et sur mobile.
- **Toutes les sections concernées** : navigation, hero, projets, services, à propos, compétences, assistant, contact, fenêtre e-mail, footer et pages légales.
- **Pages légales synchronisées** : `public/legal-theme.js` réutilise la préférence et permet le changement de thème sur ces pages.
- **Hero mode clair fusionné** : la photographie participe désormais à toute la largeur du hero. Une copie très douce et floutée crée l’atmosphère derrière la zone de texte, tandis que le portrait net reste ancré à droite. Un dégradé ivoire `#f7f4ee` protège la lisibilité du texte sans créer de séparation verticale nette. Le mode sombre conserve son atmosphère cinématique originale.
- **Bouton de thème repositionné** : placé **tout à droite** de la navigation sur ordinateur, après « Discutons de votre projet » ; sur tablette/mobile, il est rangé à droite à côté du menu.
- **Mise en page cohérente** : le CSS principal conserve les styles sombres (`src/styles/index.css`), et les variantes ainsi que la finition professionnelle se trouvent dans `src/styles/themes.css`. Le hook `src/hooks/useTheme.ts` centralise la persistance.
- **Personnalisation** : ajuster les variables `:root[data-theme="light"]` au début de `themes.css` puis les styles spécifiques ; conserver suffisamment de contraste sur les textes et les champs.

Aucune API externe n'est utilisée par le changement de thème. Pour une remise à zéro, effacer la clé `anas-portfolio-theme` dans le stockage du navigateur.

## 5. Assistant conversationnel

La version 1 utilise les fonctions de **`src/lib/inquiry.ts`**, fortement typées via `src/types.ts`. Elle propose :

1. Sélection du service : site vitrine, réservation, e-commerce, maintenance, bug, performance, automatisation ou autre.
2. Type d’activité et objectif concret.
3. Présence d’un site existant ; champ URL **conditionnel et facultatif**.
4. Fonctionnalités spécifiques au service (multi-sélection, optionnelles).
5. Budget indicatif et délai.
6. Récapitulatif modifiable, génération d’un message français personnalisé.
7. Ouverture WhatsApp ou e-mail **avec un brouillon prérempli**. L’utilisateur effectue lui-même l’envoi. Une copie du texte est proposée.

### Fonctionnement de l'e-mail (correctif)

Un lien `mailto:` seul ne fonctionne pas si le navigateur n'a pas de client e-mail configuré. Le composant commun **`src/components/EmailComposer.tsx`** remplace désormais le lien direct dans l'assistant, la rubrique Contact et l'icône e-mail du hero. Il ouvre une fenêtre accessible avec quatre solutions : **Gmail web**, **Outlook web**, **application e-mail locale**, ou **copie manuelle** du message. Le destinataire et l'objet sont pris dans **`src/config/site.ts`**. Les liens sont encodés correctement (accents, caractères spéciaux, sauts de ligne) via `emailComposeLinks`.

**Important :** cette version statique ne peut pas envoyer des messages toute seule. L'utilisateur doit se connecter à sa messagerie, vérifier le brouillon puis cliquer sur « Envoyer ». Pour un **envoi automatique depuis un formulaire**, il faut un service d'envoi transactionnel ou un endpoint serveur sécurisé avec contrôle anti-spam ; aucun secret ne doit être mis dans React.

Test local : `npm run test:email` (aucun mail n'est envoyé).

Retour arrière, modification à partir du résumé, réinitialisation, erreurs de validation, état de copie et indications d’ouverture des applications sont gérés dans l’interface. **Aucune donnée du formulaire n’est envoyée ni stockée à distance** ; recharger la page efface les réponses.

**Évolution IA réelle :** créer plus tard un endpoint serveur protégé, p. ex. `/api/project-assistant`, qui valide/limite les requêtes et appelle un modèle avec une clé stockée **uniquement côté serveur**. Ne jamais utiliser une variable `VITE_` pour une clé secrète. Garder le flux déterministe comme option de secours en cas d’indisponibilité du service.

## 6. Architecture

```text
anas-portfolio/
├── index.html                   # SEO, OG, métadonnées et montage React
├── public/
│   ├── images/cinematic-portrait.webp # Portrait fixe
│   ├── images/{stockpro,myprestataire,toolkit-hub,gymflow,riad-lokman}.webp
│   ├── og-cover.jpg, favicon.svg
│   ├── legal.css, legal-theme.js
│   ├── mentions-legales.html
│   └── confidentialite.html
├── src/
│   ├── main.tsx, App.tsx
│   ├── config/site.ts           # Configuration unique des coordonnées
│   ├── hooks/useTheme.ts       # Thème sombre/clair et persistance
│   ├── content/fr.ts            # Données éditoriales en français
│   ├── lib/inquiry.ts           # Arbre de décisions & génération de message
│   ├── components/EmailComposer.tsx # Gmail/Outlook/mailto/copie
│   ├── types.ts
│   ├── components/              # Sections et éléments réutilisables
│   └── styles/index.css        # Tailwind + direction artistique sombre
│   └── styles/themes.css       # Finition UI et thème clair
├── tests/flow-check.mjs
├── tests/theme-check.mjs
├── tests/layout-check.mjs
├── .env.example
└── vite.config.ts, tailwind.config.ts, tsconfig*.json, package.json
```

Les cinq visuels de la galerie sont les **véritables captures fournies**, et non des interfaces recréées. Les images sont compressées au format WebP pour accélérer le chargement.

## 7. Déploiement statique

Exécuter `npm run build` et envoyer **le contenu de `dist/`** à l’hébergeur : cPanel/FTP, Netlify, Vercel, Cloudflare Pages ou équivalent. Le portfolio est une page d’accueil à ancres ; les deux pages légales sont des fichiers HTML statiques, sans routing serveur particulier.

**Avant publication :**

- Remplacer / compléter les champs juridiques et les informations d’hébergeur dans `public/mentions-legales.html`.
- Confirmer que les coordonnées affichées et le statut professionnel conviennent à la publication.
- Renseigner LinkedIn et GitHub dans `src/config/site.ts` si souhaité.
- Définir un véritable domaine, puis convertir `og:image` en URL **absolue** et définir si pertinent une URL canonique (`index.html`).
- Vérifier les liens externes des projets, la performance des images, les informations de confidentialité et le rendu sur mobiles.
- Mettre à jour la politique de confidentialité si un outil d’analytics, des cookies, une IA distante ou un formulaire envoyé au serveur sont ajoutés.

## 8. Vérifications recommandées avant lancement

- Ordinateur/tablette/téléphone : navigation, menu mobile, scroll, liens externes.
- Clavier seul : lien d’évitement, boutons, champs du questionnaire et commande du thème.
- Mode « réduire les animations », navigation clavier et affichage responsive des cinq captures.
- Passer de sombre à clair depuis le header (desktop et mobile), recharger la page, revenir aux pages légales et vérifier la persistance de la préférence.
- Tester le mode clair sur les formulaires, messages de validation, boutons Gmail/Outlook et menu mobile.
- Assistant : parcours site vitrine et réservation, parcours de maintenance avec URL, retours en arrière, modifications depuis le résumé, copie et liens WhatsApp/email.
- `npm run build`, `npm run typecheck`, `npm run test:flows`, `npm run test:email`, `npm run test:theme`, `npm run test:layout` dans l’environnement cible.

**Sources du contenu :** exclusivement les informations professionnelles et les projets communiqués dans le CV joint, le brief, le README de Riad Lokman et les captures transmises. Le CV PDF lui-même n’est pas inclus pour éviter la distribution involontaire d’informations personnelles hors du portfolio.

### Mise à jour finale — hero clair fusionné (11/10/2026)

- `src/styles/themes.css` : le hero clair utilise désormais le portrait comme ambiance sur toute la zone, avec une copie arrière-plan très légèrement floutée et désaturée.
- Le portrait principal reste net et visible à droite ; il n’utilise aucun masque d’opacité.
- Un dégradé ivoire progressif protège la zone de texte et disparaît avant le visage : il n’y a plus de coupure blanche verticale.
- Sur mobile, le même principe est repris avec un fondu vertical vers l’ivoire afin de garder le texte lisible sans séparer brutalement la photo du contenu.
- Le mode sombre n’est pas modifié.

## Hero partagé entre les deux thèmes

Le Hero conserve désormais la même direction cinématique en mode sombre et en mode clair : portrait, composition, rail de contact et navigation vitrée restent identiques sur l’accueil. Le mode clair s’applique aux sections situées après le Hero. Le header détecte automatiquement lorsqu’il est au-dessus du Hero pour utiliser un verre sombre transparent, puis repasse sur un verre ivoire sur les sections claires.
