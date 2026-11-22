# Kit de génération — animation réelle du personnage

Objectif : un plan de 8 s où **tu** respires, clignes des yeux, souris doucement, regardes la caméra et fais un geste de la main, puis reviens exactement à la pose de départ (boucle parfaite).

## 1. Image de départ

`start-frame.jpg` (720×1280, format 9:16). C'est un recadrage **exact** de ton portrait (x 883 → 1412 px sur 1672). Ne pas le recadrer ni le retoucher : le site recale la vidéo sur le décor à cet endroit précis.

## 2. Réglages (testés sur Higgsfield)

| Réglage | Valeur |
| --- | --- |
| Modèle | **Seedance 2.0 Mini** (`seedance_2_0_mini`) |
| Image de début (start frame) | `start-frame.jpg` |
| Image de fin (end frame) | **la même** `start-frame.jpg` (boucle parfaite) |
| Durée | 8 s |
| Résolution | 720p si possible (480p acceptable) |
| Format | 9:16 |
| Audio | désactivé |
| Genre | drama |

Coût estimé par Higgsfield le 21/11/2026 : **4 crédits en 480p, 8 crédits en 720p** pour 8 s. La génération nécessite **au minimum le plan Basic** (le plan gratuit est refusé, même avec des crédits).

Alternatives possibles si tu préfères un autre outil : tout modèle image-vers-vidéo qui accepte **une image de début ET une image de fin** (ex. Kling, ou le modèle « Cinema Studio » de Higgsfield). Sans image de fin, utilise le fondu de boucle du script (étape 4).

## 3. Prompt (à coller tel quel, en anglais)

```
Locked-off cinematic shot, completely static camera, no zoom, no pan. The exact same young man from the first frame stands in the dark architectural corridor: identical face, identical black rectangular glasses, identical curly dark hair, identical black suit and black sweater, identical warm amber wall lighting. He comes alive as a real person: he breathes naturally, chest and shoulders rising softly; he blinks naturally two or three times; his eyes move from slightly off-camera to look directly into the lens; his head turns and tilts very slightly; a subtle, genuine closed-mouth smile forms slowly. Around the middle of the shot he calmly raises the hand that hangs at his side toward the camera in an elegant, welcoming open-palm gesture, holds it for a moment, then lowers it back to his side. His other hand stays in his trouser pocket the whole time. A small, natural shift of weight in his posture. By the end he settles back into exactly the starting pose. Restrained, slow, realistic human micro-movements, never exaggerated, never robotic. Photorealistic live-action footage, 35mm film look, consistent identity and proportions, feet stay planted.
```

Prompt négatif (si l'outil en propose un) :
```
camera movement, zoom, morphing face, different person, extra fingers, distorted hands, exaggerated smile, talking, lip sync, cartoon, avatar, plastic skin, flicker, changing clothes, changing background
```

## 4. Intégration (2 commandes)

```bash
bash scripts/prepare-hero-video.sh ~/Téléchargements/ma-video.mp4
```
(Ajoute `0.8` à la fin si la vidéo n'a PAS été générée avec la même image de fin : fondu de boucle de 0,8 s.)

```bash
npm run build
```

Le hero détecte `src/assets/hero-video/character-loop.mp4` et remplace automatiquement le personnage fixe par la vidéo. Taille attendue : environ 0,5 à 1,5 Mo pour 8 s.

## 5. Contrôle qualité avant de publier

- Le visage, les lunettes, les cheveux et le costume sont-ils identiques à la photo ?
- Les mains ont-elles 5 doigts et un mouvement naturel ?
- Aucun mouvement de caméra (sinon le décor « glisse » par rapport au site) ?
- La boucle est-elle invisible (fin = début) ?

Si un seul point échoue, regénère : une vidéo ratée est pire qu'une belle image fixe.
