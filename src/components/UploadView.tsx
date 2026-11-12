import React, { useState, useRef, useMemo } from 'react';
import {
  Scale,
  FileText,
  Upload,
  Briefcase,
  Building2,
  Code2,
  ShieldCheck,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Sparkles,
  SlidersHorizontal,
  Clock,
  Zap,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { extractTextFromPdf } from '../services/pdfExtractor';
import { analyzeContract, detectContractType, buildJurisdictionLabel, GroqApiError, clearGroqConfig } from '../services/analyzer';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';
import { AnalysisResult } from '../types/contract';
import { saveToHistory } from '../services/history';

interface UploadViewProps {
  onBackToLanding: () => void;
  onAnalysisComplete: (result: AnalysisResult) => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onBackToLanding,
  onAnalysisComplete,
  onOpenSettings,
  hasApiKey,
}) => {
  const [mode, setMode] = useState<'pdf' | 'text'>('pdf');
  const [legalFramework, setLegalFramework] = useState<'indian' | 'international'>('indian');
  const [pastedText, setPastedText] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastFailedPayload = useRef<{ text: string; filename: string } | null>(null);

  // Live auto-detected contract type preview for pasted text
  const liveDetectedType = useMemo(() => {
    if (pastedText.trim().length > 30) {
      return detectContractType(pastedText);
    }
    return null;
  }, [pastedText]);

  const handleSelectSample = (sample: AnalysisResult) => {
    setIsProcessing(true);
    setProgressStep(`Loading pre-audited ${sample.documentTitle}...`);
    setTimeout(() => {
      saveToHistory(sample);
      setIsProcessing(false);
      onAnalysisComplete(sample);
    }, 500);
  };

  const handleFileChosen = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Please upload a standard PDF contract document.');
      return;
    }

    setErrorMessage(null);
    setErrorStatus(null);
    setIsProcessing(true);
    setProgressStep('Extracting text and cleaning PDF ligatures client-side...');

    try {
      const extractedText = await extractTextFromPdf(file);
      if (!extractedText || extractedText.trim().length < 40) {
        throw new Error('Extracted PDF text is empty or image-only scanned without OCR text layer.');
      }

      lastFailedPayload.current = { text: extractedText, filename: file.name };
      const detected = detectContractType(extractedText, file.name);
      setProgressStep(`Auditing ${detected} under ${legalFramework === 'indian' ? 'Indian Contract Act & Statutory Norms' : 'International Norms'}...`);

      const result = await analyzeContract(
        extractedText,
        file.name,
        legalFramework,
        (step) => setProgressStep(step)
      );
      saveToHistory(result);
      onAnalysisComplete(result);
    } catch (err: unknown) {
      console.error('Audit failed:', err);
      if (err instanceof GroqApiError) {
        setErrorStatus(err.status);
      } else if (err instanceof Error && (err.message.includes('503') || err.message.includes('busy'))) {
        setErrorStatus(503);
      } else if (err instanceof Error && (err.message.includes('401') || err.message.includes('403'))) {
        setErrorStatus(401);
      } else if (err instanceof Error && (err.message.includes('404') || err.message.includes('does not exist') || err.message.includes('no longer available'))) {
        setErrorStatus(404);
      } else {
        setErrorStatus(null);
      }
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Could not complete contract audit. Check network connection or document format.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasteSubmit = async () => {
    if (!pastedText.trim() || pastedText.trim().length < 50) {
      setErrorMessage('Please paste at least one or two complete contract clauses (minimum 50 characters).');
      return;
    }

    setErrorMessage(null);
    setErrorStatus(null);
    setIsProcessing(true);
    lastFailedPayload.current = { text: pastedText.trim(), filename: 'Pasted_Contract.txt' };
    const detected = detectContractType(pastedText);
    setProgressStep(`Auditing ${detected} clauses...`);

    try {
      const result = await analyzeContract(
        pastedText.trim(),
        'Pasted_Contract.txt',
        legalFramework,
        (step) => setProgressStep(step)
      );
      saveToHistory(result);
      onAnalysisComplete(result);
    } catch (err: unknown) {
      console.error('Audit failed:', err);
      if (err instanceof GroqApiError) {
        setErrorStatus(err.status);
      } else if (err instanceof Error && (err.message.includes('503') || err.message.includes('busy'))) {
        setErrorStatus(503);
      } else if (err instanceof Error && (err.message.includes('401') || err.message.includes('403'))) {
        setErrorStatus(401);
      } else if (err instanceof Error && (err.message.includes('404') || err.message.includes('does not exist') || err.message.includes('no longer available'))) {
        setErrorStatus(404);
      } else {
        setErrorStatus(null);
      }
      setErrorMessage(
        err instanceof Error ? err.message : 'Audit failed. Check input contract text or API key.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunOffline = async () => {
    const payload = lastFailedPayload.current || (pastedText.trim().length >= 40 ? { text: pastedText.trim(), filename: 'Pasted_Contract.txt' } : null);
    if (!payload) return;

    setErrorMessage(null);
    setErrorStatus(null);
    setIsProcessing(true);
    setProgressStep('Running intelligent local legal audit engine (offline)...');

    try {
      const result = await analyzeContract(
        payload.text,
        payload.filename,
        legalFramework,
        undefined,
        true // force offline!
      );
      saveToHistory(result);
      onAnalysisComplete(result);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Offline audit failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveKeyAndSwitchOffline = () => {
    clearGroqConfig();
    setErrorMessage(null);
    setErrorStatus(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-hairline py-3.5 px-6 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToLanding}
              className="flex items-center space-x-1 text-xs font-semibold text-ink-subtle hover:text-ink px-2 py-1 rounded hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
              <span>Back</span>
            </button>

            <div className="h-4 w-[1px] bg-hairline" />

            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-ink flex items-center justify-center text-white">
                <Scale className="w-3.5 h-3.5" strokeWidth={1.75} />
              </div>
              <span className="text-sm font-bold tracking-tight text-ink">ClauseGuard</span>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-full border border-hairline bg-slate-50 hover:bg-slate-100 text-ink-subtle transition-colors"
          >
            <ShieldCheck
              className={`w-3.5 h-3.5 ${hasApiKey ? 'text-green-600' : 'text-slate-500'}`}
              strokeWidth={2}
            />
            <span>{hasApiKey ? 'Groq Live LPU' : 'Built-in Demo Mode'}</span>
          </button>
        </div>
      </header>

      {/* Main Upload Body */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        {/* Central Upload Card */}
        <div className="bg-white border border-hairline rounded-lg p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-md mx-auto mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              Upload Your Contract
            </h1>
            <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
              Drop a PDF document below or paste raw contract text for immediate clause-level review.
            </p>
          </div>

          {/* Segmented Control Tabs */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-hairline">
              <button
                type="button"
                onClick={() => {
                  setMode('pdf');
                  setErrorMessage(null);
                }}
                className={`text-xs font-semibold px-4 py-1.5 rounded-md transition-all ${
                  mode === 'pdf'
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Upload PDF
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('text');
                  setErrorMessage(null);
                }}
                className={`text-xs font-semibold px-4 py-1.5 rounded-md transition-all ${
                  mode === 'text'
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Paste Text
              </button>
            </div>
          </div>

          {/* Smart Contract-Type Auto-Detection & Statutory Framework Bar */}
          <div className="pb-4 mb-5 border-b border-hairline space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-ink-subtle">
                Statutory Benchmark Norms:
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setLegalFramework('indian')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors border ${
                    legalFramework === 'indian'
                      ? 'bg-ink text-white border-ink font-semibold'
                      : 'bg-white text-ink-muted border-hairline hover:text-ink'
                  }`}
                >
                  Indian Contract Act & Statutory Norms
                </button>
                <button
                  type="button"
                  onClick={() => setLegalFramework('international')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors border ${
                    legalFramework === 'international'
                      ? 'bg-ink text-white border-ink font-semibold'
                      : 'bg-white text-ink-muted border-hairline hover:text-ink'
                  }`}
                >
                  General International Norms
                </button>
              </div>
            </div>

            {/* Dynamic Contract Type Tag preview */}
            <div className="flex items-center justify-between text-[11px] text-ink-muted bg-slate-50 px-3 py-1.5 rounded border border-hairline">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-ink-muted" strokeWidth={1.75} />
                <span>
                  Classification:{' '}
                  <strong className="text-ink font-semibold">
                    {liveDetectedType || 'Auto-Detected upon Document Load'}
                  </strong>
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">
                {buildJurisdictionLabel(liveDetectedType || 'Contract', legalFramework)}
              </span>
            </div>
          </div>

          {/* Explicit Error Banner (No Silent Fallback!) */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-lg bg-risk-high-bg border border-risk-high-border text-xs text-risk-high-text space-y-2">
              <div className="flex items-start space-x-2.5">
                {errorStatus === 503 || errorStatus === 429 ? (
                  <Clock className="w-4 h-4 shrink-0 mt-0.5 text-risk-high-accent" strokeWidth={2} />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-risk-high-accent" strokeWidth={2} />
                )}
                <div className="flex-1">
                  <span className="font-bold block">
                    {errorStatus === 503 || errorStatus === 429
                      ? 'Groq is busy or rate limited, please try again in a few moments'
                      : errorStatus === 401 || errorStatus === 403
                      ? 'Check your Groq API key'
                      : errorStatus === 404
                      ? 'This model is no longer available, update the model list in config'
                      : 'Contract Audit Failed'}
                  </span>
                  <p className="mt-0.5 leading-relaxed font-mono text-[11px] break-all">{errorMessage}</p>
                </div>
              </div>
              {(errorStatus === 401 || errorStatus === 403) && (
                <div className="pt-2 border-t border-risk-high-border/40 flex items-center justify-between text-[11px]">
                  <span>The Groq API key (starts with gsk_...) was rejected or unauthorized.</span>
                  <button
                    onClick={onOpenSettings}
                    className="inline-flex items-center space-x-1 font-semibold text-risk-high-text hover:underline"
                  >
                    <SlidersHorizontal className="w-3 h-3" strokeWidth={1.75} />
                    <span>Open Groq Settings</span>
                  </button>
                </div>
              )}
              {/* Action Toolbar for Recovering from Key / Model Issues */}
              <div className="pt-3 border-t border-risk-high-border/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleRunOffline}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-ink hover:bg-ink-hover text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-300" strokeWidth={2} />
                  <span>Audit Offline Now (Zero Setup)</span>
                </button>

                <div className="flex items-center space-x-2 text-[11px]">
                  {errorStatus !== 404 && (
                    <button
                      type="button"
                      onClick={handleRemoveKeyAndSwitchOffline}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded border border-risk-high-border bg-white hover:bg-red-50 text-risk-high-text font-medium transition-colors"
                    >
                      <Trash2 className="w-3 h-3" strokeWidth={1.75} />
                      <span>Clear Dead Key</span>
                    </button>
                  )}

                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-slate-600 hover:text-ink hover:underline font-medium px-2 py-1"
                  >
                    <span>Get Free Groq Key</span>
                    <ExternalLink className="w-3 h-3" strokeWidth={1.75} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Mode 1: PDF Dropzone */}
          {mode === 'pdf' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChosen(file);
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileChosen(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-ink bg-slate-50'
                    : 'border-slate-300 hover:border-slate-400 bg-white'
                }`}
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-50 border border-hairline flex items-center justify-center text-ink-subtle mb-3">
                  <FileText className="w-6 h-6 text-ink" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-semibold text-ink">
                  Drag and drop your PDF here, or <span className="underline text-ink">browse files</span>
                </div>
                <p className="text-xs text-ink-muted mt-1">
                  Includes automatic font ligature repair and mid-word line-break normalization.
                </p>
              </div>
            </div>
          )}

          {/* Mode 2: Paste Raw Text */}
          {mode === 'text' && (
            <div className="space-y-4">
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste contract clauses, terms of service, or full agreement text here..."
                rows={9}
                className="w-full text-xs font-mono p-4 rounded border border-hairline bg-slate-50/50 text-ink placeholder:text-slate-400 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-ink-muted">
                  {pastedText.length} characters
                </span>
                <button
                  type="button"
                  onClick={handlePasteSubmit}
                  disabled={isProcessing || pastedText.length < 50}
                  className="inline-flex items-center space-x-2 bg-ink hover:bg-ink-hover disabled:opacity-40 text-white text-xs font-semibold px-5 py-2.5 rounded transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Run Risk Audit</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading Progress State */}
          {isProcessing && (
            <div className="mt-6 p-4 rounded border border-hairline bg-slate-50 flex items-center space-x-3 animate-in fade-in">
              <Loader2 className="w-4 h-4 animate-spin text-ink shrink-0" strokeWidth={2} />
              <div className="flex-1">
                <p className="text-xs font-semibold text-ink">{progressStep}</p>
                <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-ink h-full w-2/3 animate-pulse" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sample Contracts Bar Below Dropzone */}
        <div className="mt-8">
          <div className="text-center mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Or load a pre-audited sample document:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleSelectSample(SAMPLE_CONTRACTS.internship)}
              className="flex items-center justify-center space-x-2 p-3 rounded border border-hairline bg-white hover:border-ink hover:bg-slate-50/50 transition-colors text-xs font-semibold text-ink shadow-2xs"
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span>Internship Offer Letter</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectSample(SAMPLE_CONTRACTS.rental)}
              className="flex items-center justify-center space-x-2 p-3 rounded border border-hairline bg-white hover:border-ink hover:bg-slate-50/50 transition-colors text-xs font-semibold text-ink shadow-2xs"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span>Residential Rental</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectSample(SAMPLE_CONTRACTS.freelance)}
              className="flex items-center justify-center space-x-2 p-3 rounded border border-hairline bg-white hover:border-ink hover:bg-slate-50/50 transition-colors text-xs font-semibold text-ink shadow-2xs"
            >
              <Code2 className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span>Freelance Contract</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-hairline bg-white text-center text-xs text-ink-muted">
        <span>Confidential & Private. All processing remains client-side.</span>
      </footer>
    </div>
  );
};
