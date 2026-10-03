#!/usr/bin/env node
// Prevent the CV workflows from regressing to keyword-only bullet tailoring.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pdfMode = readFileSync(resolve(root, 'modes/pdf.md'), 'utf8');
const textMode = readFileSync(resolve(root, 'modes/text.md'), 'utf8');
const tailor = readFileSync(resolve(root, 'openai-tailor.mjs'), 'utf8');

let failures = 0;
function assert(condition, message) {
  if (condition) console.log(`✓ ${message}`);
  else {
    console.error(`✗ ${message}`);
    failures += 1;
  }
}

for (const [name, mode] of [['pdf', pdfMode], ['text', textMode]]) {
  assert(mode.includes('Experience-evidence standard'), `${name} mode requires experience evidence, not only keyword ordering`);
  assert(/3[–-]5 concise bullets/.test(mode), `${name} mode sets a useful bullet-depth target`);
  assert(mode.includes('source fact'), `${name} mode requires every bullet to trace to a source fact`);
  assert(mode.includes('JD requirement'), `${name} mode connects bullets to role requirements`);
  assert(mode.includes('Do not pad a role'), `${name} mode prohibits generic filler`);
}

assert(tailor.includes('Experience-evidence standard'), 'OpenAI tailoring prompt carries the experience-evidence standard');
assert(tailor.includes('article-digest.md'), 'OpenAI tailoring receives primary proof points outside cv.md when available');

if (failures) process.exit(1);
