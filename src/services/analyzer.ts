import { AnalysisResult, Clause, AiConfig } from '../types/contract';
import { GROQ_MODELS, GROQ_MODEL_FALLBACK_CHAIN, GroqModelId } from '../config/models';

export { GROQ_MODELS, GROQ_MODEL_FALLBACK_CHAIN };

export class GroqApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'GroqApiError';
    this.status = status;
  }
}

// Backwards compatibility aliases
export const GrokApiError = GroqApiError;
export const GeminiApiError = GroqApiError;

const GROQ_CONFIG_KEY = 'clauseguard_groq_config';
const LEGACY_AI_KEY = 'clauseguard_ai_config';
const LEGACY_GEMINI_KEY = 'clauseguard_gemini_config';

export function getSavedAiConfig(): AiConfig | null {
  try {
    const raw =
      localStorage.getItem(GROQ_CONFIG_KEY) ||
      localStorage.getItem(LEGACY_AI_KEY) ||
      localStorage.getItem(LEGACY_GEMINI_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const model: GroqModelId =
      parsed.model === GROQ_MODELS.STRONGER_FALLBACK
        ? GROQ_MODELS.STRONGER_FALLBACK
        : GROQ_MODELS.FAST_DEFAULT;
    return {
      apiKey: parsed.apiKey || '',
      model,
    };
  } catch {
    return null;
  }
}

export function saveAiConfig(config: AiConfig): void {
  localStorage.setItem(GROQ_CONFIG_KEY, JSON.stringify(config));
}

export function clearAiConfig(): void {
  localStorage.removeItem(GROQ_CONFIG_KEY);
  localStorage.removeItem(LEGACY_AI_KEY);
  localStorage.removeItem(LEGACY_GEMINI_KEY);
}

// Aliases for component imports
export const getSavedGeminiConfig = getSavedAiConfig;
export const saveGeminiConfig = saveAiConfig;
export const clearGeminiConfig = clearAiConfig;
export const getSavedGroqConfig = getSavedAiConfig;
export const saveGroqConfig = saveAiConfig;
export const clearGroqConfig = clearAiConfig;

/**
 * Smart Contract-Type Auto-Detection:
 * Analyzes document text and filename to dynamically classify the contract type,
 * pairing it with applicable Indian Contract Act & Statutory Norms or International Norms.
 */
export function detectContractType(text: string, filename: string = ''): string {
  const combined = `${filename} ${text.slice(0, 5000)}`.toLowerCase();

  // 1. Tenancy / Lease
  if (
    combined.includes('lease') ||
    combined.includes('tenancy') ||
    combined.includes('landlord') ||
    combined.includes('tenant') ||
    combined.includes('licensor') ||
    combined.includes('licensee') ||
    (combined.includes('rent') && combined.includes('premises')) ||
    combined.includes('apartment')
  ) {
    return 'Residential Tenancy Lease';
  }

  // 2. Employment / Internship
  if (
    combined.includes('intern') ||
    combined.includes('internship') ||
    combined.includes('offer letter') ||
    combined.includes('stipend') ||
    combined.includes('employment') ||
    combined.includes('employee') ||
    combined.includes('employer') ||
    combined.includes('probation') ||
    combined.includes('salary')
  ) {
    return 'Employment / Internship Agreement';
  }

  // 3. Freelance / Contractor / Consulting
  if (
    combined.includes('freelance') ||
    combined.includes('independent contractor') ||
    combined.includes('contractor') ||
    combined.includes('consultant') ||
    combined.includes('statement of work') ||
    combined.includes('sow') ||
    combined.includes('deliverables') ||
    combined.includes('professional services')
  ) {
    return 'Commercial / Freelance Contract';
  }

  // 4. NDA / Confidentiality
  if (
    combined.includes('non-disclosure') ||
    combined.includes('nda') ||
    combined.includes('confidentiality agreement') ||
    combined.includes('proprietary information')
  ) {
    return 'Non-Disclosure Agreement (NDA)';
  }

  return 'Commercial Services Agreement';
}

/**
 * Builds the authoritative display label combining detected contract type and statutory jurisdiction.
 */
export function buildJurisdictionLabel(
  contractType: string,
  frameworkMode: 'indian' | 'international' | string = 'indian'
): string {
  const isIndian =
    typeof frameworkMode === 'string' &&
    (frameworkMode.toLowerCase().includes('india') || frameworkMode.toLowerCase().includes('statutory'));

  if (isIndian) {
    if (contractType.includes('Tenancy') || contractType.includes('Rent')) {
      return `${contractType} • Indian Rent & Tenancy Statutory Norms`;
    }
    return `${contractType} • Indian Contract Act & Statutory Norms`;
  }

  return `${contractType} • General International Commercial Norms`;
}

/**
 * Analyzes contract text using Groq Cloud API (LPU Inference) if key is present,
 * or our comprehensive heuristic legal engine if in offline / demo mode.
 */
export async function analyzeContract(
  text: string,
  filename: string = 'Uploaded_Contract.pdf',
  frameworkChoice: string = 'indian',
  onProgress?: (status: string) => void,
  forceOffline: boolean = false
): Promise<AnalysisResult> {
  const detectedType = detectContractType(text, filename);
  const jurisdictionLabel = buildJurisdictionLabel(detectedType, frameworkChoice);

  const config = getSavedAiConfig();

  if (config?.apiKey && !forceOffline) {
    return await analyzeWithGroq(text, filename, detectedType, jurisdictionLabel, config, onProgress);
  }

  // Built-in offline legal audit engine
  return analyzeWithLocalEngine(text, filename, detectedType, jurisdictionLabel);
}

async function analyzeWithGroq(
  text: string,
  filename: string,
  contractType: string,
  jurisdiction: string,
  config: AiConfig,
  onProgress?: (status: string) => void
): Promise<AnalysisResult> {
  const selectedModel =
    config.model === GROQ_MODELS.STRONGER_FALLBACK
      ? GROQ_MODELS.STRONGER_FALLBACK
      : GROQ_MODELS.FAST_DEFAULT;

  const modelChain: string[] = [
    selectedModel,
    ...GROQ_MODEL_FALLBACK_CHAIN.filter((m) => m !== selectedModel),
  ];

  const backoffDelays = [1000, 2000]; // 1s, 2s exponential backoff
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  let lastError: Error | null = null;
  let lastStatus = 0;

  for (let mIdx = 0; mIdx < modelChain.length; mIdx++) {
    const currentModel = modelChain[mIdx];
    const isFallback = mIdx > 0;

    if (isFallback && onProgress) {
      onProgress(`Switching to fallback model (${currentModel})...`);
    }

    for (let attempt = 0; attempt <= backoffDelays.length; attempt++) {
      try {
        return await callGroqModel(text, filename, contractType, jurisdiction, config.apiKey, currentModel);
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        const status = err instanceof GroqApiError ? err.status : 0;
        lastStatus = status;

        const isRetryable = status === 404 || status === 429 || status === 503;
        if (!isRetryable || attempt >= backoffDelays.length) {
          break;
        }

        const delay = backoffDelays[attempt];
        if (onProgress) {
          onProgress(`Model ${currentModel} returned ${status}, retrying in ${delay / 1000}s (attempt ${attempt + 1}/${backoffDelays.length})...`);
        }
        await sleep(delay);
      }
    }
  }

  if (lastStatus === 404) {
    throw new GroqApiError(404, 'This model is no longer available, update the model list in config');
  }

  if (lastStatus === 503 || lastStatus === 429) {
    throw new GroqApiError(lastStatus, 'Groq Cloud is currently experiencing high load or rate limits. Please try again in a few moments.');
  }

  throw lastError || new Error('Failed to audit contract with Groq.');
}

async function callGroqModel(
  text: string,
  filename: string,
  contractType: string,
  jurisdiction: string,
  apiKey: string,
  model: string
): Promise<AnalysisResult> {
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const systemMessage = `You are ClauseGuard, an elite B2B legal contract risk auditor inspired by Harvey AI and top commercial lawyers.
Audit the contract thoroughly under "${jurisdiction}".
Flag all predatory, unconscionable, or one-sided terms (e.g. bonds, deposits, restrictive covenants, termination without earned pay, pay-if-paid, uncapped liabilities, excessive IP claims, arbitrary penalties).

CRITICAL REQUIREMENT:
Respond ONLY with a valid JSON object strictly matching this schema:
{
  "safetyScore": number (0-100, where 100 is completely safe/fair and <50 is high risk),
  "verdictLabel": string (e.g. "High Risk — 3 Critical Clauses"),
  "summary": string (concise 2-sentence executive summary),
  "clauses": [
    {
      "clauseNumber": string,
      "category": string,
      "riskLevel": "high" | "medium" | "safe",
      "oneLineSummary": string,
      "exactQuote": string (MUST be an exact verbatim substring from the contract text),
      "whyRisky": string (1-2 punchy sentences),
      "financialLegalImpact": string (1 concise sentence),
      "recommendedRevision": string (1-2 sentences with balanced redline language)
    }
  ],
  "counterOfferEmail": {
    "polite": string (polite negotiation letter under 150 words),
    "firm": string (firm assertive negotiation letter under 150 words)
  }
}`;

  const userPrompt = `AUDIT THIS CONTRACT:
Filename: ${filename}
Type: ${contractType}
Jurisdiction: ${jurisdiction}

TEXT:
${text.slice(0, 30000)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 28000);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      }),
    });
  } catch (netErr: unknown) {
    if (controller.signal.aborted) {
      throw new Error('Groq Cloud API request timed out after 28 seconds. Please retry or check network connectivity.');
    }
    throw new Error(
      `Network error connecting to Groq Cloud API: ${
        netErr instanceof Error ? netErr.message : 'Check internet connection.'
      }`
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    console.error('Groq Cloud API Full Error Details:', JSON.stringify(errData, null, 2));
    const apiMsg = errData.error?.message || errData.message || response.statusText;
    throw new GroqApiError(response.status, `Groq API Error (${response.status}): ${apiMsg}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content;
  if (!rawText) {
    throw new Error('Groq Cloud returned an empty response. Verify the document text.');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error('Groq response could not be parsed as structured JSON.');
  }

  // Validate exact quotes exist in text
  const validatedClauses: Clause[] = (parsed.clauses || []).map(
    (c: Partial<Clause>, idx: number) => {
      let quote = c.exactQuote || '';
      if (!text.includes(quote)) {
        const trimmed = quote.trim();
        if (text.includes(trimmed)) {
          quote = trimmed;
        }
      }
      return {
        id: `groq-clause-${idx + 1}`,
        clauseNumber: c.clauseNumber || `${idx + 1}`,
        category: c.category || 'General Term',
        riskLevel: (c.riskLevel === 'high' || c.riskLevel === 'medium' || c.riskLevel === 'safe'
          ? c.riskLevel
          : 'medium') as 'high' | 'medium' | 'safe',
        oneLineSummary: c.oneLineSummary || 'Contract provision requiring attention.',
        exactQuote: quote,
        whyRisky: c.whyRisky || 'Non-standard term that introduces disproportionate liability.',
        financialLegalImpact: c.financialLegalImpact || 'Potential financial or legal exposure.',
        recommendedRevision: c.recommendedRevision || 'Propose mutual and balanced terms.',
      };
    }
  );

  return {
    id: `analysis-${Date.now()}`,
    documentTitle: filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
    filename,
    contractType,
    jurisdiction,
    safetyScore: Math.max(0, Math.min(100, parsed.safetyScore ?? 50)),
    verdictLabel: parsed.verdictLabel || 'Contract Risk Review Complete',
    summary: parsed.summary || 'Audit completed with structured risk breakdown.',
    clauses: validatedClauses,
    counterOfferEmail: {
      polite: parsed.counterOfferEmail?.polite || 'Dear Team,\n\nPlease review our requested revisions...',
      firm: parsed.counterOfferEmail?.firm || 'Dear Team,\n\nWe require the following amendments prior to signing...',
    },
    fullText: text,
    analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    mode: 'live',
  };
}

/**
 * Intelligent local legal auditor used in offline demo mode.
 */
function analyzeWithLocalEngine(
  text: string,
  filename: string,
  contractType: string,
  jurisdiction: string
): AnalysisResult {
  const clauses: Clause[] = [];

  // Pattern 1: Termination without cause/stipend
  const termMatch = text.match(
    /([^.\n]*terminate[^.\n]*(?:without\s+cause|at\s+any\s+time|without\s+notice|without\s+any\s+payment)[^.\n]*\.)/i
  );
  if (termMatch) {
    clauses.push({
      id: 'local-1',
      clauseNumber: 'Termination',
      category: 'Unilateral Termination',
      riskLevel: 'high',
      oneLineSummary: 'Unilateral termination without notice, cause, or earned compensation.',
      exactQuote: termMatch[1].trim(),
      whyRisky:
        'Denying accrued compensation for work already performed violates basic contract law and fair labor standards. You risk dismissal with zero payout.',
      financialLegalImpact:
        'Loss of up to 100% of accumulated earnings and zero notice runway to find alternative engagement.',
      recommendedRevision:
        'Either party may terminate this agreement upon thirty (30) days prior written notice. In the event of early termination, all earned compensation shall be paid pro-rata.',
    });
  }

  // Pattern 2: Non-compete
  const ncMatch = text.match(
    /([^.\n]*(?:not\s+to\s+join|non-compete|competing\s+company|not\s+compete|restrained\s+from)[^.\n]*(?:year|month|territory|india|jurisdiction)[^.\n]*\.)/i
  );
  if (ncMatch) {
    clauses.push({
      id: 'local-2',
      clauseNumber: 'Non-Compete',
      category: 'Restrictive Covenant',
      riskLevel: 'medium',
      oneLineSummary: 'Post-engagement non-compete covenant restricting future career mobility.',
      exactQuote: ncMatch[1].trim(),
      whyRisky:
        'Under Section 27 of the Indian Contract Act, 1872, agreements in restraint of trade or profession are void and unenforceable, yet frequently used as intimidation tactics.',
      financialLegalImpact:
        'Threat of frivolous legal notices and severe hindrance in pursuing career opportunities.',
      recommendedRevision:
        'Restrictive covenants shall only apply during active engagement. Post-engagement non-compete clauses shall be deleted in their entirety.',
    });
  }

  // Pattern 3: Security Deposit / Penalty / Deductions
  const secMatch = text.match(
    /([^.\n]*(?:security\s+deposit|deducted|bond|forfeited|non-refundable|liquidated\s+damages)[^.\n]*(?:withheld|forfeited|penalty|deduct|breach)[^.\n]*\.)/i
  );
  if (secMatch) {
    clauses.push({
      id: 'local-3',
      clauseNumber: 'Security & Deposit',
      category: 'Deposit / Forfeiture',
      riskLevel: 'high',
      oneLineSummary: 'Mandatory deposit deduction or bond subject to discretionary forfeiture.',
      exactQuote: secMatch[1].trim(),
      whyRisky:
        'Imposing upfront monetary deposits or training bonds for employment violates labor guidelines and creates an illegal clawback mechanism.',
      financialLegalImpact:
        'Direct monetary loss and arbitrary deductions with no transparent third-party dispute mechanism.',
      recommendedRevision:
        'Remove upfront monetary deposits or bonds entirely. Engagement cannot be made contingent upon cash deposits.',
    });
  }

  // Pattern 4: Payment terms (Net-60 / Net-90 / Contingent)
  const payMatch = text.match(
    /([^.\n]*(?:payable\s+within|payment\s+terms|invoices\s+shall|contingent\s+upon)[^.\n]*(?:90\s+days|60\s+days|third-party|end-customer|client\s+receiving)[^.\n]*\.)/i
  );
  if (payMatch) {
    clauses.push({
      id: 'local-4',
      clauseNumber: 'Payment Terms',
      category: 'Deferred / Contingent Payment',
      riskLevel: 'high',
      oneLineSummary: 'Extended payment terms or pay-if-paid contingency clause.',
      exactQuote: payMatch[1].trim(),
      whyRisky:
        'Conditioning your payment on third-party client clearance shifts credit and default risk onto you without any control over their billing disputes.',
      financialLegalImpact:
        'Severe cash flow disruption (60-90+ days) and high risk of unrecoverable receivables.',
      recommendedRevision:
        'Invoices shall be payable on standard Net-30 terms upon submission, independent of third-party customer receipts.',
    });
  }

  // Pattern 5: Notice Period
  const noticeMatch = text.match(
    /([^.\n]*(?:notice\s+period|prior\s+written\s+notice|either\s+party\s+may)[^.\n]*(?:30\s+days|14\s+days|written\s+notice)[^.\n]*\.)/i
  );
  if (noticeMatch && (!termMatch || noticeMatch[1] !== termMatch[1])) {
    clauses.push({
      id: 'local-5',
      clauseNumber: 'Notice Period',
      category: 'Notice Protocol',
      riskLevel: 'safe',
      oneLineSummary: 'Standard mutual notice period providing adequate transition time.',
      exactQuote: noticeMatch[1].trim(),
      whyRisky: 'Standard reciprocal term providing balanced notice for both parties.',
      financialLegalImpact: 'Predictable timeline for project handover and final settlement.',
      recommendedRevision: 'Standard clause — acceptable as drafted.',
    });
  }

  // Fallback if no specific regex matched: extract sample provision
  if (clauses.length === 0) {
    const lines = text.split('\n').filter((l) => l.trim().length > 30);
    const sampleLine = lines[0] || text.slice(0, 120);
    clauses.push({
      id: 'local-def-1',
      clauseNumber: '1',
      category: 'General Covenant',
      riskLevel: 'medium',
      oneLineSummary: 'General term requiring alignment with standard statutory protections.',
      exactQuote: sampleLine.trim(),
      whyRisky:
        'Contract provisions should be carefully vetted against jurisdictional consumer and labor standards.',
      financialLegalImpact: 'Ensure all obligations are reciprocal and liabilities capped.',
      recommendedRevision: 'Request standard bilateral provisions.',
    });
  }

  const highCount = clauses.filter((c) => c.riskLevel === 'high').length;
  const medCount = clauses.filter((c) => c.riskLevel === 'medium').length;
  const score = Math.max(25, 100 - highCount * 25 - medCount * 12);

  const verdictLabel =
    highCount > 0
      ? `High Risk — ${highCount} Critical Clause${highCount > 1 ? 's' : ''}`
      : medCount > 0
      ? `Caution — ${medCount} Area${medCount > 1 ? 's' : ''} of Concern`
      : 'Fair & Standard Terms';

  return {
    id: `local-audit-${Date.now()}`,
    documentTitle: filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
    filename,
    contractType,
    jurisdiction,
    safetyScore: score,
    verdictLabel,
    summary: `Audit evaluated under ${jurisdiction}. Identified ${highCount} critical clause${
      highCount === 1 ? '' : 's'
    } and ${medCount} caution item${
      medCount === 1 ? '' : 's'
    }. Key risks center on asymmetric obligations and unilateral remedies.`,
    clauses,
    counterOfferEmail: {
      polite: `Dear Contracting Team,\n\nThank you for sharing the draft agreement. Before signing, we would like to propose a few standard adjustments to ensure mutual clarity:\n\n${clauses
        .filter((c) => c.riskLevel !== 'safe')
        .map((c, i) => `${i + 1}. ${c.category} (Clause ${c.clauseNumber}): ${c.recommendedRevision}`)
        .join('\n\n')}\n\nWe look forward to your confirmation so we can proceed with execution.\n\nBest regards,`,
      firm: `Dear Contracting Team,\n\nWe have reviewed the proposed agreement. Prior to execution, the following non-standard and asymmetric terms must be revised:\n\n${clauses
        .filter((c) => c.riskLevel !== 'safe')
        .map((c, i) => `${i + 1}. Clause ${c.clauseNumber} (${c.category}): Must be replaced with: "${c.recommendedRevision}"`)
        .join('\n\n')}\n\nPlease issue an updated agreement reflecting these changes.\n\nSincerely,`,
    },
    fullText: text,
    analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    mode: 'custom',
  };
}
