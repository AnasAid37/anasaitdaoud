/** Dependency-free structural regression checks for the cinematic hero and story structure.
 * Visual sign-off is done with browser screenshots (see README, section 3).
 */
import { strict as assert } from 'node:assert'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
const root = resolve(import.meta.dirname, '..')
const read = p => readFileSync(resolve(root, p), 'utf8')
const header = read('src/components/Header.tsx')
const hero = read('src/components/Hero.tsx')
const app = read('src/App.tsx')
const css = read('src/styles/cinematic.css')
const config = read('src/config/cinematic.ts')
const html = read('index.html')
let checks = 0
const check = (value, description) => { assert.ok(value, description); checks++ }
check(header.includes("(active === '#accueil' || active === '#contact') && !menuOpen ? 'is-over-hero'"), 'Header switches to dark glass over the hero and the contact scene')
check(header.indexOf('className="header-availability"') < header.indexOf('className="theme-toggle"'), 'Theme button remains after project CTA')
for (const file of ['plate.webp', 'character.webp', 'poster.webp', 'fog-back.webp', 'fog-front.webp'])
  check(existsSync(resolve(root, 'public/cinematic', file)), `Layer asset present: ${file}`)
check(config.includes("asset('cinematic/character.webp')") && config.includes('import.meta.env.BASE_URL'), 'Assets resolved through the Vite base URL')
check(hero.includes('id="hero-title"') && hero.includes('<span className="sr-only">'), 'Readable h1 for SEO and screen readers despite letter animation')
check(hero.includes('Des sites web qui font grandir') && hero.includes('Discuter de mon projet') && hero.includes('Découvrir mes projets'), 'Original hero copy and CTAs preserved')
check(hero.includes('<EmailComposer variant="hero"'), 'E-mail composer kept in the hero rail')
check(hero.includes("reduce ? 'ready' : 'dark'") && hero.includes('cinematic.poster'), 'Reduced motion starts on a still poster frame')
check(hero.includes('Passer l’intro') && hero.includes("addEventListener('wheel', skip"), 'Title sequence is skippable')
check(hero.includes('sessionStorage'), 'Full intro plays once per session')
check(css.includes('html[data-cine-intro="playing"] .site-header'), 'Navigation hidden only while the opening plays')
check(html.includes("prefers-reduced-motion: reduce)').matches) document.documentElement.dataset.cineIntro"), 'No navigation hiding for reduced-motion users')
check(css.includes('@media (prefers-reduced-motion: reduce)') && css.includes('.cine.is-static'), 'Reduced-motion styles present')
check(css.includes('position: sticky; top: 0; height: 100svh'), 'Pinned stage for the scroll-driven camera')
check(app.indexOf('<Hero/>') < app.indexOf('number="04"') && app.indexOf('number="05"') < app.indexOf('<Contact/>'), 'Scene slates 04 and 05 frame the journey and the connection')
check(!hero.includes('CinematicFrameSequence'), 'No frame sequence dependency')
check(!css.includes('cine-breathe') && !hero.includes('breath'), 'No CSS-simulated human movement (breathing removed)')
check(config.includes("import.meta.glob('../assets/hero-video/character-loop.{mp4,webm,webp}'"), 'Real performance video picked up automatically when present')
check(hero.includes('playsInline') && hero.includes('muted') && hero.includes('loop') && hero.includes('poster={performer.poster}'), 'Video is muted, inline, looping, with a poster')
check(hero.includes('!reduce && heroVideo && !saveData && !videoFailed'), 'No video for reduced motion, Save-Data or playback errors')
check(existsSync(resolve(root, 'scripts/prepare-hero-video.sh')) && existsSync(resolve(root, 'scripts/hero-video/start-frame.jpg')) && existsSync(resolve(root, 'scripts/hero-video/PROMPT.md')), 'Generation kit and processing script shipped')
console.log(`PASS: ${checks} tests structurels — hero cinématique, scènes, accessibilité et assets.`)
