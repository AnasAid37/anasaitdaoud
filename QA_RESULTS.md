# QA results — version cinématique

## Automatisé

- PASS — `npm run typecheck` et `npm run build` (Vite 6, base `/anasaitdaoud/`).
- PASS — 20 contrôles structurels du hero cinématique et des scènes (`test:layout`).
- PASS — 24 contrôles du thème clair/sombre et des pages légales (`test:theme`).
- PASS — 13 assertions e-mail (`test:email`, chemin TypeScript corrigé pour fonctionner partout).
- PASS — 13 validations de l'assistant de projet (`test:flows`).

## Navigateur (Chromium / Playwright, build de production)

- Séquence d'ouverture capturée à 0,2 s / 0,9 s / 1,9 s / 3,2 s / 5,2 s : noir → ligne dorée → révélation → titre.
- Scroll du hero capturé à 15 %, 45 %, 80 % et 100 % : zoom caméra, citations, sortie vers le noir.
- Formats : 1440×900, 1920×1080, 768×1024 (tablette portrait), 844×390 (paysage), 390×844 (mobile). Aucun débordement horizontal.
- Thème clair : transition hero → sections claires, titres de section, carton « La connexion ».
- Mouvement réduit : image fixe, hauteur = 1 écran, navigation visible, aucun canvas.
- Clavier : Tab pendant l'intro → intro terminée immédiatement, focus sur le lien d'évitement.
- Seconde visite (même session) : séquence raccourcie.
- Aucune erreur console.

## Vidéo de performance (intégration)

- Chaîne testée de bout en bout avec un clip synthétique (non livré) : script de préparation → build → lecture WebM dans Chromium, boucle (fondu de 0,8 s), pause hors écran, absence de vidéo en mouvement réduit, lecture sur mobile 390×844, calage sans couture sur le décor.
- Aucune vraie vidéo générée : Higgsfield refuse la génération sur le plan gratuit.
- `test:layout` : 25 contrôles (dont : aucun mouvement humain simulé en CSS, détection automatique de la vidéo, replis).

## Correctifs au passage

- Les titres de section affichaient un « \n » littéral (chaîne d'attribut JSX) : corrigé.
- Images des projets, pages légales et liens du footer : chemins adaptés à la base `/anasaitdaoud/` (ils cassaient sur GitHub Pages).

## Limites

- Les tests sont faits sous Chromium headless (sans GPU). Vérifier la fluidité sur un vrai téléphone d'entrée de gamme, ainsi que Safari et Firefox.
- `@property` (rayon de révélation de l'obscurité) : sans support, l'obscurité se retire en fondu simple.
