#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { countPdfPages } from './pdf-page-count.mjs';

function usage() {
  console.error('Usage: node check-pdf-pages.mjs <pdf-path> [--max-pages=N]');
  console.error('Checks the PDF page count. Default maximum: 1 page.');
  console.error('Exit codes: 0 within limit, 1 over limit, 2 for usage or PDF errors.');
}

async function main(args) {
  let pdfPath;
  let maxPages = 1;
  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      usage();
      return 0;
    }
    if (arg.startsWith('--max-pages=')) {
      const raw = arg.slice('--max-pages='.length);
      if (!/^\d+$/.test(raw) || Number(raw) < 1 || !Number.isSafeInteger(Number(raw))) {
        console.error(`Invalid --max-pages value "${raw}". Use a positive integer.`);
        usage();
        return 2;
      }
      maxPages = Number(raw);
    } else if (arg.startsWith('-')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      return 2;
    } else if (pdfPath === undefined) {
      pdfPath = arg;
    } else {
      console.error(`Unexpected argument: ${arg}`);
      usage();
      return 2;
    }
  }
  if (!pdfPath) {
    console.error('Missing PDF path.');
    usage();
    return 2;
  }

  try {
    const pageCount = countPdfPages(await readFile(pdfPath));
    const exceeds = pageCount > maxPages;
    console.log(`PDF pages: ${pageCount}; maximum: ${maxPages}; ${exceeds ? 'exceeds limit' : 'within limit'}.`);
    return exceeds ? 1 : 0;
  } catch (error) {
    console.error(`Could not check PDF "${pdfPath}": ${error.message}`);
    return 2;
  }
}

main(process.argv.slice(2)).then((code) => { process.exitCode = code; });
