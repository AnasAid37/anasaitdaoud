/** Tests hors-ligne des liens de brouillons, sans envoyer de message. */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript')
const root = path.resolve(import.meta.dirname, '..')
const src = fs.readFileSync(path.join(root,'src/config/site.ts'),'utf8')
const transpiled = ts.transpileModule(src, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText
const exports = {}
new Function('exports', transpiled)(exports)
const {emailComposeLinks,emailUrl, siteConfig} = exports
const subject = 'Demande — Riad & réservation'
const body = 'Bonjour Anas,\nMon projet : riad à Marrakech & réservations.\nMerci !'
const links = emailComposeLinks(subject,body)
assert.ok(links)
assert.equal(siteConfig.email,'anasaitdd37@gmail.com')
assert.ok(links.mailto.startsWith(`mailto:${siteConfig.email}?`))
assert.equal(emailUrl(subject,body), links.mailto)
const gmail = new URL(links.gmail)
assert.equal(gmail.hostname, 'mail.google.com')
assert.equal(gmail.searchParams.get('to'),siteConfig.email)
assert.equal(gmail.searchParams.get('su'),subject)
assert.equal(gmail.searchParams.get('body'),body)
assert.equal(gmail.searchParams.get('view'),'cm')
const outlook = new URL(links.outlook)
assert.equal(outlook.hostname,'outlook.live.com')
assert.equal(outlook.searchParams.get('to'),siteConfig.email)
assert.equal(outlook.searchParams.get('subject'),subject)
assert.equal(outlook.searchParams.get('body'),body)
for (const name of ['Hero','Contact','ProjectAssistant']) {
  const source = fs.readFileSync(path.join(root,'src/components',`${name}.tsx`),'utf8')
  assert.match(source, /<EmailComposer variant=/)
}
console.log('PASS: liens Gmail/Outlook/mailto, accents/sauts de ligne, intégrations hero/contact/assistant (13 assertions).')
