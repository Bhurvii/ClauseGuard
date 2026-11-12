import React, { useEffect, useState } from 'react';
import { X, History, Trash2, ArrowUpRight, FileText } from 'lucide-react';
import { AnalysisResult, HistoryItem } from '../types/contract';
import { getHistory, deleteFromHistory, clearAllHistory } from '../services/history';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAudit: (result: AnalysisResult) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectAudit,
}) => {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setItems(getHistory());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = deleteFromHistory(id);
    setItems(updated);
  };

  const handleClearAll = () => {
    clearAllHistory();
    setItems([]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-hairline shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded bg-ink/5 border border-hairline flex items-center justify-center text-ink">
                <History className="w-3.5 h-3.5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Audit History</h3>
                <p className="text-[11px] text-ink-muted">Saved contract evaluations</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-ink-muted hover:text-ink hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <FileText className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <p className="text-xs font-semibold text-ink">No saved audits yet</p>
                <p className="text-[11px] text-ink-muted mt-1 max-w-xs mx-auto">
                  Audit any contract or inspect a sample to automatically persist findings in your browser.
                </p>
              </div>
            ) : (
              items.map((item) => {
                const { result } = item;
                const isHighRisk = result.safetyScore < 50;
                const isCaution = result.safetyScore >= 50 && result.safetyScore < 75;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectAudit(result);
                      onClose();
                    }}
                    className="group p-4 rounded border border-hairline bg-white hover:border-ink hover:shadow-sm cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-ink group-hover:text-ink-hover line-clamp-1">
                            {result.documentTitle}
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-muted mt-0.5 line-clamp-1">
                          {result.filename}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span
                          className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                            isHighRisk
                              ? 'bg-risk-high-bg text-risk-high-text border-risk-high-border'
                              : isCaution
                              ? 'bg-risk-caution-bg text-risk-caution-text border-risk-caution-border'
                              : 'bg-risk-safe-bg text-risk-safe-text border-risk-safe-border'
                          }`}
                        >
                          {result.safetyScore}/100
                        </span>
                        <button
                          onClick={(e) => handleDelete(e, item.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete audit"
                        >
                          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-ink-muted pt-2 border-t border-slate-100">
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      <span className="inline-flex items-center space-x-1 font-medium text-ink group-hover:underline">
                        <span>Load Audit</span>
                        <ArrowUpRight className="w-3 h-3" strokeWidth={1.75} />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-hairline bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs text-ink-muted">
                {items.length} cached audit{items.length === 1 ? '' : 's'}
              </span>
              <button
                onClick={handleClearAll}
                className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
