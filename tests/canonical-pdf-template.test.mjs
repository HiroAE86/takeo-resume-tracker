import * as pdf from '../generate-pdf.mjs';
import { pass, fail } from './helpers.mjs';

console.log('\ncanonical PDF template — legacy career-ops HTML is restyled before rendering');

const legacy = `<!doctype html>
<html lang="pt-BR"><head><style>
:root { --secondary-color: hsl(270, 70%, 45%); }
.header-gradient { height: 2px; background: linear-gradient(to right, red, blue); }
</style></head><body>
<!-- HEADER --><div class="header"><h1>Candidate</h1><div class="header-gradient"></div></div>
<!-- PROFESSIONAL SUMMARY --><div class="section"><div class="section-title">Summary</div></div>
<!-- WORK EXPERIENCE --><div class="section">Experience</div>
</body></html>`;

const canonicalize = pdf.canonicalizeLegacyCareerOpsCv || ((html) => html);
const rendered = await canonicalize(legacy, 'letter');

if (
  rendered.includes('font-family: "Liberation Serif"') &&
  rendered.includes('--page-margin: 0.5in') &&
  !rendered.includes('background: linear-gradient(to right, red, blue)') &&
  rendered.includes('<div class="header-gradient"></div>') &&
  rendered.includes('max-width: 8.5in')
) {
  pass('legacy career-ops HTML receives the canonical FAANGPath/Jake styles while preserving its body');
} else {
  fail('legacy career-ops HTML kept its old styles instead of receiving the canonical FAANGPath/Jake styles');
  process.exitCode = 1;
}

const untouched = '<html><head><style>body { color: red; }</style></head><body>External document</body></html>';
if (await canonicalize(untouched, 'a4') === untouched) {
  pass('unrecognized HTML remains unchanged');
} else {
  fail('unrecognized HTML was restyled');
  process.exitCode = 1;
}
