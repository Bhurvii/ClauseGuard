export const GROQ_MODELS = {
  FAST_DEFAULT: 'openai/gpt-oss-20b',
  STRONGER_FALLBACK: 'openai/gpt-oss-120b',
} as const;

export type GroqModelId = (typeof GROQ_MODELS)[keyof typeof GROQ_MODELS];

export const GROQ_MODEL_FALLBACK_CHAIN: readonly GroqModelId[] = [
  GROQ_MODELS.FAST_DEFAULT,
  GROQ_MODELS.STRONGER_FALLBACK,
];
