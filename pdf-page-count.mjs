/**
 * Read a PDF's page count from its catalog's root /Pages dictionary.
 * Following the catalog reference avoids counting page-like text in streams
 * or metadata. This intentionally supports the uncompressed object structure
 * emitted by Chromium, as used by generate-pdf.mjs.
 *
 * @param {Buffer|Uint8Array} pdfBuffer
 * @returns {number}
 */
export function countPdfPages(pdfBuffer) {
  if (!Buffer.isBuffer(pdfBuffer) && !(pdfBuffer instanceof Uint8Array)) {
    throw new TypeError('PDF data must be a Buffer or Uint8Array.');
  }
  const pdf = Buffer.from(pdfBuffer).toString('latin1');
  if (!pdf.startsWith('%PDF-')) {
    throw new Error('File does not have a PDF header.');
  }

  const objects = new Map();
  const objectPattern = /(?:^|[\r\n])(\d+)\s+(\d+)\s+obj\b([\s\S]*?)\bendobj\b/g;
  for (const match of pdf.matchAll(objectPattern)) {
    const streamIndex = match[3].search(/\bstream(?:\r?\n|\r)/);
    const dictionary = streamIndex === -1 ? match[3] : match[3].slice(0, streamIndex);
    objects.set(`${match[1]} ${match[2]}`, dictionary);
  }

  const catalog = [...objects.values()].find((body) => /\/Type\s*\/Catalog\b/.test(body));
  const pagesRef = catalog?.match(/\/Pages\s+(\d+)\s+(\d+)\s+R\b/);
  const pages = pagesRef ? objects.get(`${pagesRef[1]} ${pagesRef[2]}`) : null;
  const count = pages && /\/Type\s*\/Pages\b/.test(pages)
    ? pages.match(/\/Count\s+(\d+)\b/)
    : null;
  const pageCount = count ? Number(count[1]) : 0;

  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error('Could not determine the PDF page count from its page tree.');
  }
  return pageCount;
}
