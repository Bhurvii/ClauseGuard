import React from 'react';
import {
  Upload,
  FileSearch,
  Zap,
  FileCheck2,
  FileEdit,
  ArrowRight,
  ShieldAlert,
  Building2,
  Briefcase,
  Code2,
  CheckCircle2,
  Scale,
} from 'lucide-react';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';
import { AnalysisResult } from '../types/contract';

interface LandingViewProps {
  onStartUpload: () => void;
  onSelectSample: (sample: AnalysisResult) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartUpload,
  onSelectSample,
}) => {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-hairline overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Authoritative Editorial Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-hairline bg-white text-xs font-semibold text-ink-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-risk-high-accent animate-pulse" />
                <span>B2B Legal-Tech Intelligence for Individuals & Founders</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-[1.08]">
                Don’t Sign Blindly. <br />
                <span className="text-slate-600 font-semibold">
                  Let ClauseGuard Audit Your Contract.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-ink-muted max-w-xl font-normal leading-relaxed">
                Identify predatory clauses, hidden liabilities, and non-standard terms in plain English—before you commit your signature or capital.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onStartUpload}
                  className="inline-flex items-center space-x-2.5 bg-ink hover:bg-ink-hover text-white text-sm font-semibold px-6 py-3 rounded border border-ink transition-colors shadow-sm"
                >
                  <Upload className="w-4 h-4" strokeWidth={1.75} />
                  <span>Upload Contract</span>
                </button>

                <button
                  onClick={() => onSelectSample(SAMPLE_CONTRACTS.internship)}
                  className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-ink text-sm font-semibold px-5 py-3 rounded border border-hairline transition-colors shadow-sm"
                >
                  <FileSearch className="w-4 h-4 text-ink-muted" strokeWidth={1.75} />
                  <span>Inspect Sample Audit</span>
                </button>
              </div>

              <div className="pt-4 flex items-center space-x-6 text-xs text-ink-muted">
                <span className="inline-flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
                  <span>100% Client-Side Privacy</span>
                </span>
                <span className="inline-flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
                  <span>Zero Registration Wall</span>
                </span>
                <span className="inline-flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
                  <span>Instant Redline Output</span>
                </span>
              </div>
            </div>

            {/* Right Column: Clean Architectural Vector Schematic matching attached mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white border border-hairline rounded-lg p-6 shadow-sm select-none">
                {/* Contract Sheet Header */}
                <div className="flex items-center justify-between pb-4 border-b border-hairline mb-5">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-ink" strokeWidth={1.75} />
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-ink">
                      CONTRACT DOCUMENT
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-ink-muted border border-hairline">
                    REV 2.4
                  </span>
                </div>

                {/* Simulated Legal Document Content with High-Risk Callout */}
                <div className="space-y-4 font-mono text-[11px] leading-relaxed text-slate-400">
                  <div className="space-y-1.5">
                    <div className="h-2 bg-slate-200 rounded w-1/3" />
                    <div className="h-1.5 bg-slate-100 rounded w-full" />
                    <div className="h-1.5 bg-slate-100 rounded w-5/6" />
                  </div>

                  {/* Highlighted Predatory Clause in Document */}
                  <div className="relative p-3 rounded bg-risk-high-bg border border-risk-high-border text-risk-high-text">
                    <div className="flex items-center justify-between font-sans text-xs font-bold mb-1">
                      <span>4. Unilateral Termination</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.2 rounded bg-red-100 text-red-800">
                        Critical Risk
                      </span>
                    </div>
                    <p className="font-legal italic text-xs leading-normal text-red-950">
                      "The company may terminate this agreement at any time without cause and without payment of accrued stipend..."
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="h-2 bg-slate-200 rounded w-1/4" />
                    <div className="h-1.5 bg-slate-100 rounded w-11/12" />
                    <div className="h-1.5 bg-slate-100 rounded w-3/4" />
                  </div>

                  {/* Caution Flagged Clause */}
                  <div className="p-2.5 rounded bg-risk-caution-bg border border-risk-caution-border text-risk-caution-text">
                    <div className="font-sans text-[11px] font-bold">
                      7. Non-Compete: 2-year nationwide bar
                    </div>
                  </div>
                </div>

                {/* Magnifying Glass Callout Overlay */}
                <div className="absolute -bottom-6 -right-4 bg-ink text-white p-3.5 rounded-lg border border-slate-700 shadow-xl flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-4 h-4 text-risk-high-border" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold tracking-tight">Clause Flagged</div>
                    <div className="text-[10px] text-slate-300">Unconscionable terms detected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Proof Strip */}
      <section className="bg-white border-b border-hairline py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-hairline">
            <div className="flex items-start space-x-3.5 py-4 md:py-0 md:px-6 first:pl-0">
              <div className="w-9 h-9 rounded bg-slate-50 border border-hairline flex items-center justify-center text-ink shrink-0">
                <Zap className="w-4 h-4 text-ink" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Sub-10s Clause Extraction</h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  Client-side PDF parsing and structured legal risk scoring with zero server roundtrips.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 py-4 md:py-0 md:px-6">
              <div className="w-9 h-9 rounded bg-slate-50 border border-hairline flex items-center justify-center text-ink shrink-0">
                <FileCheck2 className="w-4 h-4 text-ink" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Plain-English Translation</h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  Translates dense legalese and fine-print covenants into quantifiable financial exposure.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 py-4 md:py-0 md:px-6 last:pr-0">
              <div className="w-9 h-9 rounded bg-slate-50 border border-hairline flex items-center justify-center text-ink shrink-0">
                <FileEdit className="w-4 h-4 text-ink" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Ready-to-Send Counter-Offers</h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  Generates balanced, respectful redline language in seconds ready to paste into your email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section: How It Works */}
      <section id="how-it-works" className="py-20 border-b border-hairline bg-canvas">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
              Structured Legal Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mt-1">
              How ClauseGuard Audits Your Document
            </h2>
            <p className="text-sm text-ink-muted mt-2">
              From raw contract to balanced counter-proposal in three deliberate stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-white border border-hairline space-y-3">
              <span className="text-xs font-mono font-bold text-slate-400">01</span>
              <h3 className="text-base font-bold text-ink">Upload or Paste</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Drop your contract PDF or paste raw text. Select jurisdiction norms (Indian Employment/Rent or General Commercial) to calibrate evaluation benchmarks.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white border border-hairline space-y-3">
              <span className="text-xs font-mono font-bold text-slate-400">02</span>
              <h3 className="text-base font-bold text-ink">Clause-Level Risk Audit</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                The engine isolates critical liabilities: unilateral termination, unlawful bonds, and uncapped indemnities with bidirectional highlight navigation.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white border border-hairline space-y-3">
              <span className="text-xs font-mono font-bold text-slate-400">03</span>
              <h3 className="text-base font-bold text-ink">Export Counter-Offer</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Switch tone from polite & collaborative to firm & direct. Copy a ready-to-send revision letter directly to clipboard or export a full audit report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Audited Sample Documents */}
      <section id="samples" className="py-20 border-b border-hairline bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
                Zero Friction
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mt-1">
                Explore Sample Contract Audits
              </h2>
              <p className="text-sm text-ink-muted mt-2">
                Click any pre-evaluated scenario to test the workspace immediately.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sample 1: Internship */}
            <div
              onClick={() => onSelectSample(SAMPLE_CONTRACTS.internship)}
              className="group p-6 rounded-lg border border-hairline bg-surface hover:border-ink hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded bg-slate-50 border border-hairline flex items-center justify-center text-ink">
                    <Briefcase className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-risk-high-bg text-risk-high-text border border-risk-high-border">
                    Score: 44 / 100
                  </span>
                </div>
                <h3 className="text-sm font-bold text-ink group-hover:text-ink-hover">
                  Engineering Internship Offer
                </h3>
                <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                  Tech internship offer featuring unpaid termination at will, a 2-year nationwide non-compete, and a ₹10,000 security bond.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-xs font-semibold text-ink">
                <span>View Full Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.75} />
              </div>
            </div>

            {/* Sample 2: Rental */}
            <div
              onClick={() => onSelectSample(SAMPLE_CONTRACTS.rental)}
              className="group p-6 rounded-lg border border-hairline bg-surface hover:border-ink hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded bg-slate-50 border border-hairline flex items-center justify-center text-ink">
                    <Building2 className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-risk-caution-bg text-risk-caution-text border border-risk-caution-border">
                    Score: 58 / 100
                  </span>
                </div>
                <h3 className="text-sm font-bold text-ink group-hover:text-ink-hover">
                  Residential Tenancy Agreement
                </h3>
                <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                  11-month urban lease with 6-month lock-in total deposit forfeiture and unilateral 15% annual rent hikes.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-xs font-semibold text-ink">
                <span>View Full Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.75} />
              </div>
            </div>

            {/* Sample 3: Freelance */}
            <div
              onClick={() => onSelectSample(SAMPLE_CONTRACTS.freelance)}
              className="group p-6 rounded-lg border border-hairline bg-surface hover:border-ink hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded bg-slate-50 border border-hairline flex items-center justify-center text-ink">
                    <Code2 className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-risk-high-bg text-risk-high-text border border-risk-high-border">
                    Score: 51 / 100
                  </span>
                </div>
                <h3 className="text-sm font-bold text-ink group-hover:text-ink-hover">
                  Master Freelance Contract
                </h3>
                <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                  Software consulting agreement with Pay-if-Paid Net-90 conditions, unlimited revisions, and immediate IP assignment.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-xs font-semibold text-ink">
                <span>View Full Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.75} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-20 bg-canvas">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
              Legal Integrity
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mt-1">
              ClauseGuard Scoring Methodology
            </h2>
            <p className="text-sm text-ink-muted mt-2">
              Our analysis model benchmarks clauses against statutory consumer protection standards, judicial precedents, and equitable B2B norms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-white border border-hairline space-y-3">
              <h3 className="text-sm font-bold text-ink">Statutory & Precedent Analysis</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Clauses are audited for enforceability under relevant statutory codes (such as Section 27 of the Indian Contract Act for non-compete voidance, and commercial fair-dealing doctrines). Clauses violating statutory rights are penalized heavily.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white border border-hairline space-y-3">
              <h3 className="text-sm font-bold text-ink">Reciprocity & Risk Distribution</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                One-sided indemnifications, unilateral termination rights without compensation, and arbitrary penalties score poorly. Balanced contracts feature mutual notice, reasonable cure periods, and bilateral confidentiality protections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-muted space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-ink" strokeWidth={1.75} />
            <span className="font-bold text-ink">ClauseGuard Legal-Tech</span>
            <span>© 2026</span>
          </div>
          <div className="text-[11px] text-slate-400">
            For informational and negotiation preparation purposes. Does not constitute formal attorney-client representation.
          </div>
        </div>
      </footer>
    </div>
  );
};
