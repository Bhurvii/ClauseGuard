import * as pdfjsLib from 'pdfjs-dist';
// Vite URL worker import
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const STOP_WORDS_THREE_LETTER = new Set([
  'the', 'and', 'for', 'not', 'but', 'you', 'all', 'any', 'can', 'had', 'her',
  'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man',
  'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let',
  'put', 'say', 'she', 'too', 'use', 'off', 'per', 'act', 'law', 'fee', 'due',
  'pay', 'sum', 'tax', 'job', 'end', 'via', 'sub', 'may'
]);

/**
 * Normalizes broken font ligatures and cleans up mid-word line breaks & glyph splits
 * commonly produced by PDF text extraction tools (e.g. font encoding shifts, kerning).
 */
export function cleanAndNormalizePdfText(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Specific font encoding ligature substitutions with surrounding space stripping:
  // \s*Θ\s* / \u0398 -> ti (e.g. "S Θ pend" -> "Stipend")
  cleaned = cleaned.replace(/\s*[\u0398\u03b8Θθ]\s*/g, 'ti');
  // \s*Σ\s* / \u03a3 -> tt (e.g. "U Σ ar" -> "Uttar")
  cleaned = cleaned.replace(/\s*[\u03a3\u03c3Σσ]\s*/g, 'tt');
  // \s*Ō\s* / \u014c -> ft (e.g. "o Ō en" -> "often")
  cleaned = cleaned.replace(/\s*[\u014c\u014dŌō]\s*/g, 'ft');

  // Standard Unicode ligatures:
  cleaned = cleaned.replace(/\s*\ufb01\s*/g, 'fi');
  cleaned = cleaned.replace(/\s*\ufb02\s*/g, 'fl');
  cleaned = cleaned.replace(/\s*\ufb00\s*/g, 'ff');
  cleaned = cleaned.replace(/\s*\ufb03\s*/g, 'ffi');
  cleaned = cleaned.replace(/\s*\ufb04\s*/g, 'ffl');
  // Soft hyphens
  cleaned = cleaned.replace(/\u00ad/g, '');

  // 2. Collapse single spaces inside broken words where PDF glyph positioning split letters:
  // (e.g., "s ecurity" -> "security", "p roject" -> "project", "d ocument" -> "document")
  cleaned = cleaned.replace(/\b([b-hj-zB-HJ-Z])\s+([a-zA-Z]{3,})\b/g, (match, prefix, stem) => {
    if (stem.length === 3 && STOP_WORDS_THREE_LETTER.has(stem.toLowerCase())) {
      return match;
    }
    return `${prefix}${stem}`;
  });

  // Handle words split after drop-caps or capitals with 4+ letter stems (e.g. "S ecurity" -> "Security", "P roject" -> "Project")
  cleaned = cleaned.replace(/\b([a-zA-Z])\s+([a-zA-Z]{4,})\b/g, (match, prefix, stem) => {
    if (prefix.toLowerCase() === 'a') {
      const legalStemsWithA = ['greement', 'ssignment', 'rbitration', 'pplicable', 'uthority', 'pproval', 'mendment'];
      if (legalStemsWithA.some(s => stem.toLowerCase().startsWith(s))) {
        return `${prefix}${stem}`;
      }
      return match; // preserve standard indefinite article (e.g. "a security guard")
    }
    return `${prefix}${stem}`;
  });

  // 3. Clean trailing split letters at word boundaries (e.g. "agreemen t" -> "agreement", "contrac t" -> "contract")
  cleaned = cleaned.replace(/([a-zA-Z]{3,})\s+([b-df-hj-np-tv-z])(?=[\s\.,;:!?\)\"\'\-]|$)/g, (match, stem, suffix, offset, fullStr) => {
    const rest = fullStr.slice(offset + match.length);
    if (/^\s+[a-zA-Z]/.test(rest)) {
      const commonIncomplete = ['agreemen', 'contrac', 'paymen', 'employmen', 'settlemen', 'tenan', 'defaul', 'interes'];
      if (commonIncomplete.some(ci => stem.toLowerCase().endsWith(ci))) {
        return `${stem}${suffix}`;
      }
      return match;
    }
    return `${stem}${suffix}`;
  });

  // 4. Clean mid-word hyphenated line breaks:
  // e.g. "termi-\nnation" -> "termination", "compen-\nsation" -> "compensation"
  cleaned = cleaned.replace(/(\b[A-Za-z]+)-\s*[\r\n]+\s*([A-Za-z]+\b)/g, '$1$2');

  // 5. Clean line breaks inside fragmented words (e.g., pdf text item splits)
  cleaned = cleaned.replace(/([a-zA-Z])\s*[\r\n]\s*([a-z])/g, '$1 $2');

  // 6. Normalize multiple horizontal spaces
  cleaned = cleaned.replace(/[ \t]+/g, ' ');

  // 7. Clean up excessive consecutive newlines while preserving paragraph separation
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

/**
 * Extracts plain text from an uploaded PDF file using pdfjs-dist,
 * then cleans broken ligatures and line breaks.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdfDocument = await loadingTask.promise;

  const totalPages = pdfDocument.numPages;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Group text items by line
    let lastY: number | null = null;
    let pageString = '';

    for (const item of textContent.items) {
      if ('str' in item) {
        const itemY = item.transform[5];
        if (lastY !== null && Math.abs(itemY - lastY) > 5) {
          pageString += '\n';
        } else if (pageString.length > 0 && !pageString.endsWith(' ') && !pageString.endsWith('\n')) {
          pageString += ' ';
        }
        pageString += item.str;
        lastY = itemY;
      }
    }

    // Normalize each page's extracted text
    pageTexts.push(cleanAndNormalizePdfText(pageString));
  }

  const fullRaw = pageTexts.join('\n\n--- Page Break ---\n\n');
  return cleanAndNormalizePdfText(fullRaw);
}
