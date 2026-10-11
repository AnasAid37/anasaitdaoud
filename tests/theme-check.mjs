/** Offline smoke tests for the theme preference and static legal-page toggle.
 * Does not claim to replace a rendered browser test.
 */
import { strict as assert } from 'node:assert'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import vm from 'node:vm'
const root = resolve(import.meta.dirname, '..')
const read = name => readFileSync(resolve(root, name), 'utf8')
const html = read('index.html')
const app = read('src/App.tsx')
const header = read('src/components/Header.tsx')
const hook = read('src/hooks/useTheme.ts')
const css = read('src/styles/themes.css')
const legalJs = read('public/legal-theme.js')
let checks = 0
function check(condition, message) { assert.ok(condition, message); checks++ }
check(html.includes("localStorage.getItem('anas-portfolio-theme')"), 'Theme initialized before React')
check(html.includes("document.documentElement.dataset.theme = theme"), 'Theme prepaint applied')
check(app.includes('useTheme()') && app.includes('onToggleTheme={toggleTheme}'), 'App owns theme state')
check(header.includes('aria-pressed={theme === \'light\'}'), 'Accessible theme toggle')
check(header.includes('Activer le mode clair') && header.includes('Activer le mode sombre'), 'Accessible toggle labels')
check(hook.includes('window.localStorage.setItem(STORAGE_KEY, theme)'), 'Preference persisted')
check(hook.includes("window.addEventListener('storage', onStorage)"), 'Cross-tab synchronization')
check(read('src/main.tsx').includes("import './styles/themes.css'"), 'Styles imported')
for (const section of ['.hero ', '.projects-section', '.services-section', '.about-section', '.skills-section', '.assistant-section', '.contact-section', '.footer ', '.email-dialog']) {
  check(css.includes(':root[data-theme="light"] ' + section), `Light styling exists for ${section}`)
}
check(css.includes('@media (max-width: 700px)'), 'Responsive light hero')
check(css.includes('prefers-reduced-motion: reduce'), 'Reduced-motion support')
for (const page of ['mentions-legales.html', 'confidentialite.html']) {
  check(read('public/'+page).includes('legal-theme.js'), `${page} inherits the preference`)
}
// Functional check of legal pages with a minimal DOM stub (no dependency).
const listeners = new Map()
const rootElement = { dataset: {}, style: {} }
const data = new Map([['anas-portfolio-theme','light']])
const storage = { getItem:key=>data.get(key), setItem:(key,val)=>data.set(key,val) }
const headerEl = { append:button=>{ globalThis.__testButton = button } }
const doc = {
  documentElement: rootElement,
  querySelector(selector) { return selector === 'header' ? headerEl : selector === '.legal-theme-toggle' ? globalThis.__testButton : null },
  createElement() { return { attributes:{}, addEventListener:(kind,fn)=>{globalThis.__toggleHandler=fn}, setAttribute(name,val){this.attributes[name]=val} } },
}
const win = { addEventListener(name, handler) { listeners.set(name, handler) } }
vm.runInNewContext(legalJs, { document:doc, window:win, localStorage:storage })
check(rootElement.dataset.theme === 'light', 'Legal page starts with stored light theme')
listeners.get('DOMContentLoaded')()
check(globalThis.__testButton.textContent.includes('Mode sombre'), 'Legal-page button reflects active mode')
globalThis.__toggleHandler()
check(rootElement.dataset.theme === 'dark' && storage.getItem('anas-portfolio-theme') === 'dark', 'Legal-page toggle persists dark mode')
console.log(`PASS: ${checks} vérifications hors ligne du mode clair/sombre et de sa persistance.`)
