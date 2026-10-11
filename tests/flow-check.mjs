/** Offline deterministic tests for the rules-based inquiry flow. */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createRequire } from 'node:module'

const root = resolve(import.meta.dirname, '..')
const output = mkdtempSync(join(tmpdir(), 'anas-inquiry-test-'))
const localTsc = join(root, 'node_modules', '.bin', 'tsc')
try {
  execFileSync(existsSync(localTsc) ? localTsc : 'tsc', [
    join(root,'src/lib/inquiry.ts'), join(root,'src/types.ts'),
    '--target','ES2022','--module','commonjs', '--moduleResolution','node',
    '--strict', '--skipLibCheck', '--lib','ES2022,DOM', '--outDir',output,
  ], { cwd: root, stdio: 'pipe' })
  const require = createRequire(import.meta.url)
  const { emptyInquiry, inquirySteps, validateStep, createInquiryMessage, isValidUrl } = require(join(output, 'lib/inquiry.js'))
  const selections = [{id:'reservation',label:'Site de réservation'}]
  const answers = { ...emptyInquiry, service:'reservation', business:'Riad à Marrakech', goal:'Créer une solution de réservation directe', hasSite:'yes', siteUrl:'https://riad.example', features:['Calendrier','Multilingue'], featureNotes:'Paiement en ligne', budget:'7 000 – 15 000 MAD', timeline:'Sous 1 à 3 mois' }
  assert.equal(inquirySteps(emptyInquiry).length, 7)
  assert.equal(inquirySteps(answers).length, 8)
  assert.ok(inquirySteps(answers).includes('siteUrl'))
  assert.ok(!inquirySteps({...answers,hasSite:'no'}).includes('siteUrl'))
  assert.equal(validateStep('service', emptyInquiry), 'Choisissez le type de projet.')
  assert.ok(validateStep('goal', {...answers, goal:'Court'}))
  assert.equal(validateStep('goal', answers), null)
  assert.equal(validateStep('features', {...answers,features:[]}), null)
  assert.ok(isValidUrl('https://stockpro.ma'))
  assert.ok(isValidUrl('stockpro.ma'))
  assert.ok(!isValidUrl('not a domain'))
  const message = createInquiryMessage(answers, selections)
  assert.match(message,/site de réservation/)
  assert.match(message,/Riad à Marrakech/)
  assert.match(message,/https:\/\/riad\.example/)
  assert.match(message,/Calendrier, Multilingue, Paiement en ligne/)
  assert.match(message,/7 000 – 15 000 MAD/)
  assert.ok(!createInquiryMessage({...answers,hasSite:'no'}, selections).includes('Adresse du site'))
  console.log('PASS: 13 validations — conversation, questions conditionnelles, URL et message personnalisé.')
} finally { rmSync(output, {recursive:true, force:true}) }
