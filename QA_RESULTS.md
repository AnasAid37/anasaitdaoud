# QA results — dernière révision

## Hero / thèmes

- PASS — 17 contrôles structurels du Hero et de la navigation.
- Le Hero reste volontairement cinématique dans **les deux thèmes** : fond sombre, même crop du portrait, index 01–04 et rail de contact visibles.
- En mode clair, le header utilise un verre sombre transparent lorsqu’il survole le Hero, puis revient à un verre ivoire sur les sections claires.
- Aucun panneau blanc/ivoire n’est injecté dans le Hero en mode clair.
- Aucune séquence vidéo/frames n’a été réintroduite.

## Fonctions existantes

- PASS — 24 contrôles hors ligne du thème et de sa persistance.
- PASS — 13 assertions e-mail (Gmail, Outlook, mailto + intégrations).
- PASS — 13 validations de l’assistant de projet.
- PASS — syntaxe TypeScript/TSX validée hors ligne.

## Limite de l’environnement

Le build Vite complet reste à vérifier localement après `npm install`, l’accès au registre npm n’ayant pas été fiable dans cet environnement. Les contrôles ci-dessus ne remplacent pas une validation visuelle finale dans les navigateurs cibles.
