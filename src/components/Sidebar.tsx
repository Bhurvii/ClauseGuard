import React from 'react';
import { Scale, Plus, History, SlidersHorizontal, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  onNewAudit: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  activeView: 'results' | 'counterOffer';
  hasApiKey: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onNewAudit,
  onOpenHistory,
  onOpenSettings,
  hasApiKey,
}) => {
  return (
    <aside className="w-16 md:w-48 bg-ink text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-[#242E4C] select-none z-20">
      {/* Top Branding & Main Navigation */}
      <div>
        {/* Brand header */}
        <div className="h-16 flex items-center px-4 md:px-5 border-b border-[#242E4C]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white shrink-0">
              <Scale className="w-4 h-4 text-white" strokeWidth={1.75} />
            </div>
            <span className="hidden md:inline text-sm font-bold tracking-tight text-white">
              ClauseGuard
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="p-3 md:p-4">
          <button
            onClick={onNewAudit}
            className="w-full flex items-center justify-center md:justify-start space-x-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold py-2.5 px-3 rounded border border-white/10 transition-colors"
            title="Start New Contract Audit"
          >
            <Plus className="w-4 h-4 text-white shrink-0" strokeWidth={2} />
            <span className="hidden md:inline">New Audit</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="px-3 md:px-4 space-y-1">
          <button
            onClick={onOpenHistory}
            className="w-full flex items-center justify-center md:justify-start space-x-2.5 text-xs font-medium py-2 px-3 rounded text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            title="Audit History"
          >
            <History className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.75} />
            <span className="hidden md:inline">Audit History</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full flex items-center justify-center md:justify-start space-x-2.5 text-xs font-medium py-2 px-3 rounded text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            title="Groq AI Settings"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.75} />
            <span className="hidden md:inline">Settings</span>
          </button>
        </nav>
      </div>

      {/* Bottom Brand Motto */}
      <div className="p-3 md:p-4 border-t border-[#242E4C]">
        <div className="hidden md:block bg-white/[0.04] border border-white/5 rounded p-3 text-center">
          <div className="flex items-center justify-center space-x-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
            <span className="text-[11px] font-semibold tracking-wide text-slate-200">
              Read Smart.
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Sign Safe.
          </p>
          <div className="mt-2 text-[9px] text-slate-400">
            {hasApiKey ? 'Groq Live' : 'Demo Engine Active'}
          </div>
        </div>

        <div className="md:hidden flex justify-center text-slate-500 py-1" title="Read Smart. Sign Safe.">
          <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
        </div>
      </div>
    </aside>
  );
};
