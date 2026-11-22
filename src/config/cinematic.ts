/**
 * Cinematic hero configuration.
 *
 * Every visual layer comes from ONE real portrait (see scripts/build-cinematic-assets.py):
 *  - plate.webp      the photo with the character removed (architecture rebuilt from neighbouring texture)
 *  - character.webp  pixel cut-out of the character: face and proportions are never regenerated
 *  - poster.webp     the untouched original, used as the static / reduced-motion fallback
 *  - fog-*.webp      procedural noise textures
 * No video is generated: all motion (camera, light, fog, dust) is rendered in the browser.
 */

/** Prefix a public/ asset with Vite's base URL so it works on GitHub Pages sub-paths. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export const cinematic = {
  plate: asset('cinematic/plate.webp'),
  character: asset('cinematic/character.webp'),
  poster: asset('cinematic/poster.webp'),
  fogBack: asset('cinematic/fog-back.webp'),
  fogFront: asset('cinematic/fog-front.webp'),
  /** Source image ratio (1672 × 941). */
  ratio: 1672 / 941,
  /** Character box in % of the source frame (generated in public/cinematic/layers.json). */
  character_box: { left: 59.749, top: 3.294, width: 17.644, height: 94.474 },
  /** Horizontal focal point (% of frame) kept on screen on narrow viewports. */
  focusX: 68.5,
  /** The warm wall lamp of the original photo, used as the scene's light source. */
  lamp: { x: 82.5, y: 35 },
  /** On phones the lamp falls outside the crop: the opening light line moves next to the character. */
  mobileLightX: 75.5,
  /** Session key: the full 4 s title sequence plays once per visit, then a short version. */
  sessionKey: 'anas-cine-intro-seen',
} as const

/**
 * REAL CHARACTER PERFORMANCE (generated image-to-video footage).
 * Drop the files produced by scripts/prepare-hero-video.sh into src/assets/hero-video/
 * (character-loop.mp4, optional character-loop.webm, character-loop.webp) and rebuild:
 * the hero switches from the still cut-out to the video automatically.
 * The clip must be the 9:16 crop described by `box` (see scripts/hero-video/PROMPT.md).
 */
const heroVideoFiles = import.meta.glob('../assets/hero-video/character-loop.{mp4,webm,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const pickVideoFile = (ext: string) => Object.entries(heroVideoFiles).find(([path]) => path.endsWith(`.${ext}`))?.[1]
export const heroVideo = pickVideoFile('mp4')
  ? {
      mp4: pickVideoFile('mp4')!,
      webm: pickVideoFile('webm'),
      poster: pickVideoFile('webp'),
      /** Horizontal position of the 9:16 crop inside the 16:9 frame (x 883 → 1412 px of 1672). */
      box: { left: 52.811, width: 31.639 },
    }
  : null

export const sceneLabels = ['Obscurité', 'Révélation', 'Introduction'] as const
