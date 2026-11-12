import React from 'react';
import { Scale, ArrowRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onStartAnalysis: () => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartAnalysis,
  onOpenSettings,
  hasApiKey,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur border-b border-hairline">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded bg-ink flex items-center justify-center text-white">
            <Scale className="w-4 h-4" strokeWidth={1.75} />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-lg font-bold tracking-tight text-ink">ClauseGuard</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted border border-hairline px-1.5 py-0.5 rounded">
              v1.0
            </span>
          </div>
        </div>

        {/* Center Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-ink-subtle">
          <button
            onClick={() => scrollTo('how-it-works')}
            className="hover:text-ink transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo('samples')}
            className="hover:text-ink transition-colors"
          >
            Sample Audits
          </button>
          <button
            onClick={() => scrollTo('methodology')}
            className="hover:text-ink transition-colors"
          >
            Methodology
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenSettings}
            className="hidden sm:flex items-center space-x-1.5 text-xs font-medium px-2.5 py-1.5 rounded border border-hairline text-ink-subtle hover:text-ink hover:bg-slate-50 transition-colors"
            title="Configure Groq API Key"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-ink-muted" strokeWidth={1.75} />
            <span>{hasApiKey ? 'Groq Live Active' : 'Demo Mode (Offline)'}</span>
          </button>

          <button
            onClick={onStartAnalysis}
            className="flex items-center space-x-2 bg-ink hover:bg-ink-hover text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
          >
            <span>Analyze a Contract</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
};
