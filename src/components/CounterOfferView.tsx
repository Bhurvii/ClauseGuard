import React, { useState } from 'react';
import {
  ChevronLeft,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';
import { AnalysisResult } from '../types/contract';
import { Sidebar } from './Sidebar';

interface CounterOfferViewProps {
  result: AnalysisResult;
  onBackToResults: () => void;
  onNewAudit: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export const CounterOfferView: React.FC<CounterOfferViewProps> = ({
  result,
  onBackToResults,
  onNewAudit,
  onOpenHistory,
  onOpenSettings,
  hasApiKey,
}) => {
  const [tone, setTone] = useState<'polite' | 'firm'>('polite');
  const [emailContent, setEmailContent] = useState<string>(
    result.counterOfferEmail[tone] || result.counterOfferEmail.polite
  );
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  // Switch tone and populate corresponding email template
  const handleToneChange = (newTone: 'polite' | 'firm') => {
    setTone(newTone);
    setEmailContent(result.counterOfferEmail[newTone]);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailContent);
      setHasCopied(true);
      setShowToast(true);
      setTimeout(() => setHasCopied(false), 2500);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleResetToDefault = () => {
    setEmailContent(result.counterOfferEmail[tone]);
  };

  const flaggedCount = result.clauses.filter((c) => c.riskLevel !== 'safe').length;

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      {/* Slim Left Rail */}
      <Sidebar
        onNewAudit={onNewAudit}
        onOpenHistory={onOpenHistory}
        onOpenSettings={onOpenSettings}
        activeView="counterOffer"
        hasApiKey={hasApiKey}
      />

      {/* Main Composer Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Utility Bar */}
        <header className="h-14 bg-white border-b border-hairline px-6 flex items-center justify-between shrink-0 z-10">
          <button
            onClick={onBackToResults}
            className="flex items-center space-x-1.5 text-xs font-semibold text-ink-subtle hover:text-ink px-2.5 py-1.5 rounded border border-hairline hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Back to Audit</span>
          </button>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-ink-muted">
              Document: <span className="font-semibold text-ink">{result.filename}</span>
            </span>
          </div>
        </header>

        {/* Composer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex justify-center">
          <div className="w-full max-w-3xl space-y-6">
            {/* Main Composer Card */}
            <div className="bg-white border border-hairline rounded-lg p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
                    Personalized Counter-Offer
                  </h1>
                  <p className="text-xs text-ink-muted mt-1">
                    Review, edit, and copy this professional revision request to send before signing.
                  </p>
                </div>

                {/* Tone Segmented Switch */}
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-hairline self-start sm:self-auto">
                  <button
                    onClick={() => handleToneChange('polite')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded transition-all ${
                      tone === 'polite'
                        ? 'bg-white text-ink shadow-xs'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Collaborative & Polite
                  </button>
                  <button
                    onClick={() => handleToneChange('firm')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded transition-all ${
                      tone === 'firm'
                        ? 'bg-white text-ink shadow-xs'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Firm & Direct
                  </button>
                </div>
              </div>

              {/* Action Toolbar above textarea */}
              <div className="flex items-center justify-between pt-4 pb-2">
                <span className="text-xs font-bold text-ink">
                  {tone === 'polite' ? 'Collaborative Redline Email' : 'Assertive Negotiation Email'}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleResetToDefault}
                    className="flex items-center space-x-1 text-xs text-ink-muted hover:text-ink px-2 py-1 rounded hover:bg-slate-50 transition-colors"
                    title="Reset to generated draft"
                  >
                    <RotateCcw className="w-3 h-3" strokeWidth={1.75} />
                    <span>Reset</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded bg-ink hover:bg-ink-hover text-white transition-colors"
                  >
                    {hasCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-300" strokeWidth={2} />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Editable Letter Surface */}
              <div className="mt-2">
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  rows={14}
                  className="w-full text-xs font-mono leading-relaxed p-4 sm:p-5 rounded border border-hairline bg-slate-50/50 text-slate-800 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors resize-y"
                  placeholder="Drafting counter-offer letter..."
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-ink-muted">
                <span>Feel free to customize names, dates, or specific clauses directly in the editor.</span>
                <span className="font-mono">{emailContent.length} chars</span>
              </div>
            </div>

            {/* Bottom Summary Strip */}
            <div className="p-4 rounded-lg border border-hairline bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-ink shrink-0">
                  <ShieldAlert className="w-4 h-4 text-ink-subtle" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-xs font-bold text-ink">
                    Audit Summary: Safety Score {result.safetyScore}/100
                  </div>
                  <div className="text-[11px] text-ink-muted">
                    {flaggedCount} high risk & caution clause{flaggedCount === 1 ? '' : 's'} addressed in this counter-offer.
                  </div>
                </div>
              </div>

              <button
                onClick={onNewAudit}
                className="flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 rounded bg-ink hover:bg-ink-hover text-white transition-colors self-end sm:self-auto"
              >
                <span>Start New Audit</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom-Right Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-white px-4 py-3 rounded-md shadow-lg border border-slate-700 flex items-center space-x-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-green-400" strokeWidth={2} />
          <span>Copied to clipboard</span>
        </div>
      )}
    </div>
  );
};
