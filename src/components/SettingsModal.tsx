import React, { useState } from 'react';
import { X, Cpu, Check, AlertCircle, Trash2, ExternalLink, Zap } from 'lucide-react';
import { getSavedAiConfig, saveAiConfig, clearAiConfig } from '../services/analyzer';
import { GROQ_MODELS, GroqModelId } from '../config/models';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const currentConfig = getSavedAiConfig();
  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || '');
  const [model, setModel] = useState<GroqModelId>(
    currentConfig?.model === GROQ_MODELS.STRONGER_FALLBACK
      ? GROQ_MODELS.STRONGER_FALLBACK
      : GROQ_MODELS.FAST_DEFAULT
  );
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!apiKey.trim()) {
      clearAiConfig();
    } else {
      saveAiConfig({
        apiKey: apiKey.trim(),
        model,
      });
    }
    onConfigChanged();
    onClose();
  };

  const handleClear = () => {
    clearAiConfig();
    setApiKey('');
    onConfigChanged();
    setStatusMsg('Saved key removed. Reverting to Built-in Demo Engine.');
    setTestStatus('idle');
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestStatus('error');
      setStatusMsg('Please enter your Groq API key first (starts with gsk_...).');
      return;
    }

    setTestStatus('testing');
    setStatusMsg('Verifying connection with Groq Cloud LPU endpoint...');

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'Say OK' }],
          max_tokens: 5,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg = errorData.error?.message || errorData.message || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      setTestStatus('success');
      setStatusMsg(`Connected successfully to Groq Cloud (${model}). Ultra-fast LPU contract audits ready.`);
    } catch (err: unknown) {
      setTestStatus('error');
      setStatusMsg(err instanceof Error ? err.message : 'Failed to connect to Groq Cloud.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-surface border border-hairline rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded bg-ink/5 border border-hairline flex items-center justify-center text-ink">
              <Zap className="w-3.5 h-3.5 text-amber-500" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Groq Cloud AI Configuration</h3>
              <p className="text-xs text-ink-muted">Ultra-fast LPU inference for instant contract risk audits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-ink-muted hover:text-ink hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Notice Banner */}
          <div className="p-3.5 rounded bg-slate-50 border border-hairline text-xs text-ink-subtle leading-relaxed">
            <span className="font-semibold text-ink">Ultra-Fast & Free Tier:</span> Groq processes open-weight LLMs at 500+ tokens/second. You can get a free API key with generous daily limits in 15 seconds at Groq Console.
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-1.5">
              Groq API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full text-xs font-mono px-3 py-2.5 rounded border border-hairline bg-white text-ink placeholder:text-slate-400 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink-muted">
              <span>Key is stored strictly in your browser's localStorage.</span>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-ink font-semibold hover:underline"
              >
                <span>Get free Groq key</span>
                <ExternalLink className="w-3 h-3" strokeWidth={1.75} />
              </a>
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-1.5">
              Groq Model
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setModel(GROQ_MODELS.FAST_DEFAULT)}
                className={`p-3 rounded border text-left transition-colors ${
                  model === GROQ_MODELS.FAST_DEFAULT
                    ? 'border-ink bg-slate-50 ring-1 ring-ink'
                    : 'border-hairline bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-ink">{GROQ_MODELS.FAST_DEFAULT}</span>
                  <Cpu className="w-3.5 h-3.5 text-ink-muted" strokeWidth={1.75} />
                </div>
                <p className="text-[11px] text-ink-muted">Fast default model for ultra-rapid contract clause auditing.</p>
              </button>

              <button
                type="button"
                onClick={() => setModel(GROQ_MODELS.STRONGER_FALLBACK)}
                className={`p-3 rounded border text-left transition-colors ${
                  model === GROQ_MODELS.STRONGER_FALLBACK
                    ? 'border-ink bg-slate-50 ring-1 ring-ink'
                    : 'border-hairline bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-ink">{GROQ_MODELS.STRONGER_FALLBACK}</span>
                  <Cpu className="w-3.5 h-3.5 text-ink-muted" strokeWidth={1.75} />
                </div>
                <p className="text-[11px] text-ink-muted">Stronger fallback model for comprehensive legal reasoning.</p>
              </button>
            </div>
          </div>

          {/* Test Status feedback */}
          {testStatus !== 'idle' && (
            <div
              className={`p-3 rounded border text-xs flex items-start space-x-2.5 ${
                testStatus === 'success'
                  ? 'bg-risk-safe-bg text-risk-safe-text border-risk-safe-border'
                  : testStatus === 'error'
                  ? 'bg-risk-high-bg text-risk-high-text border-risk-high-border'
                  : 'bg-slate-50 text-ink-subtle border-hairline'
              }`}
            >
              {testStatus === 'success' ? (
                <Check className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2} />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2} />
              )}
              <span className="leading-snug">{statusMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-hairline bg-slate-50/50 flex items-center justify-between">
          <div>
            {apiKey && (
              <button
                onClick={handleClear}
                className="flex items-center space-x-1.5 text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Remove Key</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleTestConnection}
              disabled={testStatus === 'testing' || !apiKey.trim()}
              className="text-xs font-medium px-3 py-1.5 rounded border border-hairline text-ink hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={handleSave}
              className="text-xs font-semibold px-4 py-1.5 rounded bg-ink hover:bg-ink-hover text-white transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
