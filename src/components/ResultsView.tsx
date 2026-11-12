import React, { useState, useRef, useMemo } from 'react';
import {
  ChevronLeft,
  ArrowRight,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ShieldCheck,
  AlertCircle,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { AnalysisResult, Clause, RiskLevel } from '../types/contract';
import { Sidebar } from './Sidebar';

interface ResultsViewProps {
  result: AnalysisResult;
  onBackToUpload: () => void;
  onNewAudit: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onGoToCounterOffer: () => void;
  hasApiKey: boolean;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onBackToUpload,
  onNewAudit,
  onOpenHistory,
  onOpenSettings,
  onGoToCounterOffer,
  hasApiKey,
}) => {
  const [activeClauseId, setActiveClauseId] = useState<string | null>(null);
  const [expandedClauseIds, setExpandedClauseIds] = useState<Set<string>>(
    new Set(result.clauses.map((c) => c.id)) // Expand all initially
  );
  const [filterLevel, setFilterLevel] = useState<'all' | RiskLevel>('all');
  const [fontScale, setFontScale] = useState<number>(100); // 90%, 100%, 115%

  const documentViewerRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: string) => {
    setExpandedClauseIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCardClick = (clause: Clause) => {
    setActiveClauseId(clause.id);
    // Smooth scroll to the highlighted clause inside document viewer
    const targetElement = document.getElementById(`doc-quote-${clause.id}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleHighlightClick = (clauseId: string) => {
    setActiveClauseId(clauseId);
    setExpandedClauseIds((prev) => new Set(prev).add(clauseId));
    const cardElement = document.getElementById(`clause-card-${clauseId}`);
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Filtered clauses
  const filteredClauses = useMemo(() => {
    if (filterLevel === 'all') return result.clauses;
    return result.clauses.filter((c) => c.riskLevel === filterLevel);
  }, [result.clauses, filterLevel]);

  // Word count of contract
  const wordCount = useMemo(() => {
    return result.fullText.trim().split(/\s+/).filter(Boolean).length;
  }, [result.fullText]);

  // Segment full text into highlighted and plain fragments
  const textSegments = useMemo(() => {
    const text = result.fullText;
    interface Segment {
      text: string;
      clause?: Clause;
    }

    // Map each quote to start and end index in fullText
    const matches: { start: number; end: number; clause: Clause }[] = [];

    result.clauses.forEach((clause) => {
      if (!clause.exactQuote) return;
      const quote = clause.exactQuote.trim();
      let idx = text.indexOf(quote);
      
      // If not exact verbatim match, try finding first 40 chars
      if (idx === -1 && quote.length > 30) {
        idx = text.indexOf(quote.slice(0, 30));
      }

      if (idx !== -1) {
        matches.push({
          start: idx,
          end: idx + (text.includes(quote) ? quote.length : Math.min(quote.length, 60)),
          clause,
        });
      }
    });

    // Sort by start index ascending and avoid overlaps
    matches.sort((a, b) => a.start - b.start);

    const segments: Segment[] = [];
    let currentIdx = 0;

    for (const match of matches) {
      if (match.start > currentIdx) {
        segments.push({
          text: text.slice(currentIdx, match.start),
        });
      }
      if (match.start >= currentIdx) {
        segments.push({
          text: text.slice(match.start, match.end),
          clause: match.clause,
        });
        currentIdx = match.end;
      }
    }

    if (currentIdx < text.length) {
      segments.push({
        text: text.slice(currentIdx),
      });
    }

    return segments;
  }, [result.fullText, result.clauses]);

  // Download / Export report
  const handleExportReport = () => {
    const reportText = `=====================================================
CLAUSEGUARD LEGAL RISK AUDIT REPORT
Document: ${result.documentTitle} (${result.filename})
Jurisdiction: ${result.jurisdiction}
Safety Score: ${result.safetyScore} / 100
Verdict: ${result.verdictLabel}
Audited At: ${result.analyzedAt}
=====================================================

EXECUTIVE SUMMARY:
${result.summary}

-----------------------------------------------------
FLAGGED CLAUSES (${result.clauses.length} TOTAL):
-----------------------------------------------------

${result.clauses
  .map(
    (c, i) => `[${i + 1}] CLAUSE ${c.clauseNumber} — ${c.category.toUpperCase()} (${c.riskLevel.toUpperCase()})
Summary: ${c.oneLineSummary}
Quote: "${c.exactQuote}"
Why Risky: ${c.whyRisky}
Financial / Legal Impact: ${c.financialLegalImpact}
Recommended Redline Revision: ${c.recommendedRevision}
`
  )
  .join('\n-----------------------------------------------------\n\n')}

-----------------------------------------------------
RECOMMENDED COUNTER-OFFER LETTER (POLITE):
-----------------------------------------------------
${result.counterOfferEmail.polite}

-----------------------------------------------------
RECOMMENDED COUNTER-OFFER LETTER (FIRM):
-----------------------------------------------------
${result.counterOfferEmail.firm}

Generated by ClauseGuard B2B Contract Intelligence.
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.filename.replace(/\.[^/.]+$/, '')}_ClauseGuard_Audit.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isHighRisk = result.safetyScore < 50;
  const isCaution = result.safetyScore >= 50 && result.safetyScore < 75;

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      {/* Slim Left Rail */}
      <Sidebar
        onNewAudit={onNewAudit}
        onOpenHistory={onOpenHistory}
        onOpenSettings={onOpenSettings}
        activeView="results"
        hasApiKey={hasApiKey}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Utility Bar */}
        <header className="h-14 bg-white border-b border-hairline px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToUpload}
              className="flex items-center space-x-1.5 text-xs font-semibold text-ink-subtle hover:text-ink px-2.5 py-1.5 rounded border border-hairline hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Back to Upload</span>
            </button>

            <div className="h-4 w-[1px] bg-hairline" />

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-ink max-w-[180px] sm:max-w-xs truncate" title={result.filename}>
                {result.filename}
              </span>
              <span
                className="hidden md:inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-ink-subtle border border-hairline max-w-sm truncate"
                title={result.jurisdiction}
              >
                {result.jurisdiction}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportReport}
              className="flex items-center space-x-1.5 text-xs font-semibold text-ink px-3 py-1.5 rounded border border-hairline hover:bg-slate-50 transition-colors"
              title="Download formatted audit text report"
            >
              <Download className="w-3.5 h-3.5 text-ink-muted" strokeWidth={1.75} />
              <span className="hidden sm:inline">Export Report</span>
            </button>

            <button
              onClick={onGoToCounterOffer}
              className="flex items-center space-x-1.5 bg-ink hover:bg-ink-hover text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors"
            >
              <span>Draft Counter-Offer</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </header>

        {/* 55 / 45 Split-Screen Workspace */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Pane: Legal Document Viewer (55%) */}
          <div className="flex-1 lg:basis-[55%] flex flex-col border-b lg:border-b-0 lg:border-r border-hairline bg-slate-100/60 overflow-hidden">
            {/* Document Viewer Toolbar */}
            <div className="h-10 bg-white border-b border-hairline px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2 text-xs text-ink-muted">
                <FileText className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span className="font-medium text-ink">Contract Document Viewer</span>
                <span>•</span>
                <span>{wordCount} words</span>
              </div>

              {/* Working Zoom Controls */}
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setFontScale((s) => Math.max(85, s - 10))}
                  disabled={fontScale <= 85}
                  className="p-1 rounded text-ink-muted hover:text-ink hover:bg-slate-100 disabled:opacity-30"
                  title="Decrease font size"
                >
                  <ZoomOut className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
                <span className="text-[11px] font-mono font-medium text-ink-subtle w-10 text-center">
                  {fontScale}%
                </span>
                <button
                  onClick={() => setFontScale((s) => Math.min(130, s + 10))}
                  disabled={fontScale >= 130}
                  className="p-1 rounded text-ink-muted hover:text-ink hover:bg-slate-100 disabled:opacity-30"
                  title="Increase font size"
                >
                  <ZoomIn className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => setFontScale(100)}
                  className="p-1 rounded text-ink-muted hover:text-ink hover:bg-slate-100 ml-1"
                  title="Reset zoom"
                >
                  <RotateCcw className="w-3 h-3" strokeWidth={1.75} />
                </button>
              </div>
            </div>

            {/* Document Sheet Container */}
            <div
              ref={documentViewerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start"
            >
              <div
                style={{ fontSize: `${(14 * fontScale) / 100}px` }}
                className="w-full max-w-2xl h-auto min-h-full bg-white border border-hairline rounded shadow-xs p-8 sm:p-12 font-legal leading-relaxed text-slate-800 whitespace-pre-wrap break-words selection:bg-ink selection:text-white transition-all"
              >
                {textSegments.map((segment, idx) => {
                  if (!segment.clause) {
                    return <span key={idx}>{segment.text}</span>;
                  }

                  const c = segment.clause;
                  const isActive = activeClauseId === c.id;

                  // High risk: #FEF2F2 bg, #991B1B text, #DC2626 border
                  // Caution: #FFFBEB bg, #92400E text, #D97706 border
                  // Safe: #F0FDF4 bg, #166534 text, #16A34A border
                  const tintClasses =
                    c.riskLevel === 'high'
                      ? 'bg-risk-high-bg text-risk-high-text border-b-2 border-risk-high-accent'
                      : c.riskLevel === 'medium'
                      ? 'bg-risk-caution-bg text-risk-caution-text border-b-2 border-risk-caution-accent'
                      : 'bg-risk-safe-bg text-risk-safe-text border-b-2 border-risk-safe-accent';

                  return (
                    <mark
                      key={idx}
                      id={`doc-quote-${c.id}`}
                      onClick={() => handleHighlightClick(c.id)}
                      className={`inline cursor-pointer px-1 py-0.5 rounded transition-all ${tintClasses} ${
                        isActive ? 'ring-2 ring-ink ring-offset-1 clause-pulse-ring font-medium' : 'hover:opacity-85'
                      }`}
                      title={`Clause ${c.clauseNumber}: ${c.category} (${c.riskLevel.toUpperCase()}) — Click to view risk details`}
                    >
                      {segment.text}
                    </mark>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Pane: Risk Audit Dashboard (45%) */}
          <div className="flex-1 lg:basis-[45%] flex flex-col bg-white overflow-hidden">
            {/* Scrollable Dashboard Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Safety Score Header Card */}
              <div className="p-5 rounded-lg border border-hairline bg-slate-50/50 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-ink-muted">
                      CONTRACT SAFETY SCORE
                    </span>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-4xl font-extrabold font-mono tabular-nums text-ink">
                        {result.safetyScore}
                      </span>
                      <span className="text-sm font-mono text-ink-muted">/ 100</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-bold border ${
                      isHighRisk
                        ? 'bg-risk-high-bg text-risk-high-text border-risk-high-border'
                        : isCaution
                        ? 'bg-risk-caution-bg text-risk-caution-text border-risk-caution-border'
                        : 'bg-risk-safe-bg text-risk-safe-text border-risk-safe-border'
                    }`}
                  >
                    {isHighRisk ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-risk-high-accent" strokeWidth={2} />
                    ) : isCaution ? (
                      <AlertCircle className="w-3.5 h-3.5 text-risk-caution-accent" strokeWidth={2} />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5 text-risk-safe-accent" strokeWidth={2} />
                    )}
                    <span>{result.verdictLabel}</span>
                  </span>
                </div>

                {/* Score Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${result.safetyScore}%` }}
                      className={`h-full transition-all duration-500 ${
                        isHighRisk
                          ? 'bg-risk-high-accent'
                          : isCaution
                          ? 'bg-risk-caution-accent'
                          : 'bg-risk-safe-accent'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>0 Predatory</span>
                    <span>50 Caution</span>
                    <span>100 Standard</span>
                  </div>
                </div>

                {/* Executive Summary */}
                <p className="text-xs text-ink-subtle leading-relaxed border-t border-hairline pt-3">
                  {result.summary}
                </p>
              </div>

              {/* Filter Bar */}
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <span className="text-xs font-bold text-ink">
                  Flagged Clauses ({result.clauses.length})
                </span>

                <div className="flex items-center space-x-1 text-xs">
                  <button
                    onClick={() => setFilterLevel('all')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      filterLevel === 'all'
                        ? 'bg-ink text-white'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    All ({result.clauses.length})
                  </button>
                  <button
                    onClick={() => setFilterLevel('high')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      filterLevel === 'high'
                        ? 'bg-risk-high-accent text-white'
                        : 'text-risk-high-text hover:bg-risk-high-bg'
                    }`}
                  >
                    High ({result.clauses.filter((c) => c.riskLevel === 'high').length})
                  </button>
                  <button
                    onClick={() => setFilterLevel('medium')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      filterLevel === 'medium'
                        ? 'bg-risk-caution-accent text-white'
                        : 'text-risk-caution-text hover:bg-risk-caution-bg'
                    }`}
                  >
                    Caution ({result.clauses.filter((c) => c.riskLevel === 'medium').length})
                  </button>
                  <button
                    onClick={() => setFilterLevel('safe')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      filterLevel === 'safe'
                        ? 'bg-risk-safe-accent text-white'
                        : 'text-risk-safe-text hover:bg-risk-safe-bg'
                    }`}
                  >
                    Standard ({result.clauses.filter((c) => c.riskLevel === 'safe').length})
                  </button>
                </div>
              </div>

              {/* Flagged Clause Cards */}
              <div className="space-y-3.5">
                {filteredClauses.map((clause) => {
                  const isExpanded = expandedClauseIds.has(clause.id);
                  const isSelected = activeClauseId === clause.id;

                  const dotColor =
                    clause.riskLevel === 'high'
                      ? 'bg-risk-high-accent'
                      : clause.riskLevel === 'medium'
                      ? 'bg-risk-caution-accent'
                      : 'bg-risk-safe-accent';

                  const badgeBorder =
                    clause.riskLevel === 'high'
                      ? 'border-l-4 border-l-risk-high-accent'
                      : clause.riskLevel === 'medium'
                      ? 'border-l-4 border-l-risk-caution-accent'
                      : 'border-l-4 border-l-risk-safe-accent';

                  return (
                    <div
                      key={clause.id}
                      id={`clause-card-${clause.id}`}
                      onClick={() => handleCardClick(clause)}
                      className={`p-4 rounded-lg border bg-white transition-all cursor-pointer ${badgeBorder} ${
                        isSelected
                          ? 'border-ink shadow-sm ring-1 ring-ink'
                          : 'border-hairline hover:border-slate-300'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                          <span className="text-xs font-bold text-ink">
                            Clause {clause.clauseNumber} — {clause.category}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(clause.id);
                          }}
                          className="flex items-center space-x-1 text-[11px] font-semibold text-ink-subtle hover:text-ink px-1.5 py-0.5 rounded hover:bg-slate-100"
                        >
                          <span>{isExpanded ? 'Hide' : 'Why risky?'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" strokeWidth={1.75} />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.75} />
                          )}
                        </button>
                      </div>

                      {/* 1-Line Summary */}
                      <p className="text-xs text-ink-subtle mt-2 font-medium">
                        {clause.oneLineSummary}
                      </p>

                      {/* Verbatim quote snippet */}
                      <div className="mt-2 text-[11px] font-legal italic text-slate-500 bg-slate-50 p-2 rounded border border-hairline line-clamp-2">
                        "{clause.exactQuote}"
                      </div>

                      {/* Expandable Disclosure */}
                      {isExpanded && (
                        <div className="mt-3.5 pt-3 border-t border-hairline space-y-3 text-xs animate-in fade-in duration-150">
                          {/* Financial/Legal Impact */}
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                              Financial & Legal Exposure
                            </span>
                            <p className="text-ink-subtle mt-0.5 leading-relaxed">
                              {clause.financialLegalImpact}
                            </p>
                          </div>

                          {/* Recommended Revision */}
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                              Recommended Redline Counter-Proposal
                            </span>
                            <div className="mt-1 p-2.5 rounded bg-slate-50 border border-hairline font-mono text-[11px] text-ink leading-relaxed">
                              {clause.recommendedRevision}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="p-4 border-t border-hairline bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="text-xs text-ink-muted">
                Click any clause card to jump to its location in the document text.
              </div>

              <button
                onClick={onGoToCounterOffer}
                className="flex items-center space-x-2 bg-ink hover:bg-ink-hover text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
              >
                <span>Draft Counter-Offer</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
