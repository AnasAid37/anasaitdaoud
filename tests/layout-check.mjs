/** Dependency-free structural regression checks for the cinematic hero shared by light/dark themes.
 * A browser screenshot is still required for final visual signoff on target devices.
 */
import { strict as assert } from 'node:assert'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
const root = resolve(import.meta.dirname, '..')
const read = p => readFileSync(resolve(root,p),'utf8')
const theme = read('src/styles/themes.css')
const header = read('src/components/Header.tsx')
const hero = read('src/components/Hero.tsx')
const css = read('src/styles/index.css')
let checks = 0
const check = (value, description) => { assert.ok(value, description); checks++ }
check(header.includes("active === '#accueil' && !menuOpen ? 'is-over-hero'"), 'Header detects when it overlays the hero')
check(header.indexOf('className="header-availability"') < header.indexOf('className="theme-toggle"'), 'Theme button remains after project CTA')
check(theme.includes(':root[data-theme="light"] .site-header.is-over-hero'), 'Light header has a dedicated cinematic hero state')
check(theme.includes('background: rgba(8,8,8,.34);'), 'Light hero header has no ivory/white block')
check(theme.includes(':root[data-theme="light"] .site-header.is-scrolled:not(.is-over-hero)'), 'Light glass returns over light sections below the hero')
check(theme.includes(':root[data-theme="light"] .hero { background: #080809; }'), 'Light theme hero is dark cinematic')
check(theme.includes('left: 29%;') && theme.includes('width: 65%;') && theme.includes('height: 103%;'), 'Light portrait matches dark composition')
check(theme.includes('object-position: center 35%;'), 'Light portrait crop matches dark crop')
check(theme.includes('linear-gradient(90deg, #080809 0%'), 'Light hero uses the dark cinematic overlay')
check(theme.includes(':root[data-theme="light"] .hero h1 { color: #f1eee9; }'), 'Light hero headline remains readable over photo')
check(theme.includes(':root[data-theme="light"] .hero-social { color: #f1eee9;'), 'Hero WhatsApp/email rail remains visible in light mode')
check(theme.includes(':root[data-theme="light"] .hero-index { color: #a6a3a0; }'), 'Hero slide index remains visible in light mode')
check(theme.includes(':root[data-theme="light"] .hero .button-outline'), 'Hero CTA receives cinematic button treatment in light mode')
check(!theme.includes("url('/images/cinematic-portrait.webp') 64% 39% / cover no-repeat"), 'Removed duplicated blurred light-theme background portrait')
check(css.includes('.hero-content { z-index: 3; position: relative'), 'Text remains above the cinematic overlay')
check(hero.includes('cinematic-portrait.webp'), 'Fixed cinematic portrait retained')
check(!hero.includes('CinematicFrameSequence'), 'No video/scroll sequence reintroduced')
console.log(`PASS: ${checks} tests structurels — hero cinématique partagé, nav adaptative et responsive.`)
