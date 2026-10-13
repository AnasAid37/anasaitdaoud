# Images de la séquence cinématique

Déposez ici les images **réellement différentes** de votre animation :

- `frame-01.webp`
- `frame-02.webp`
- ...
- `frame-15.webp`

L'ordre suit votre storyboard, de 01 à 15. Toutes les images doivent avoir les mêmes dimensions et un cadrage cohérent (idéalement 16:9 ou 4:5 selon votre composition). Le composant charge d'abord le premier cadre, puis précharge les suivants par petits lots. Il ne fabrique aucune animation en répétant la même image.

Modifiez le nombre de cadres, les noms, l'extension et le répertoire via `src/config/site.ts`, clé `cinematic`.

**Important :** aucun cadre n'est fourni dans cette version. La composition photographique recadrée depuis votre référence (`/public/images/cinematic-fallback.webp`) s'affiche jusqu'à l'ajout d'une vraie séquence. Le numéro du cadre est ajustable par la souris, le clavier et le toucher lorsqu'une séquence existe.
