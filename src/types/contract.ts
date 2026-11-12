import type { GroqModelId } from '../config/models';

export type RiskLevel = 'high' | 'medium' | 'safe';

export interface Clause {
  id: string;
  clauseNumber: string;
  category: string;
  riskLevel: RiskLevel;
  oneLineSummary: string;
  exactQuote: string;
  whyRisky: string;
  financialLegalImpact: string;
  recommendedRevision: string;
}

export interface AnalysisResult {
  id: string;
  documentTitle: string;
  filename: string;
  contractType?: string;
  jurisdiction: string;
  safetyScore: number; // 0 - 100
  verdictLabel: string;
  summary: string;
  clauses: Clause[];
  counterOfferEmail: {
    polite: string;
    firm: string;
  };
  fullText: string;
  analyzedAt: string;
  mode: 'sample' | 'live' | 'custom';
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  result: AnalysisResult;
}

export type AppScreen = 'landing' | 'upload' | 'results' | 'counterOffer';

export interface AiConfig {
  apiKey: string;
  model: GroqModelId;
}

export type GeminiConfig = AiConfig;
export type GroqConfig = AiConfig;
