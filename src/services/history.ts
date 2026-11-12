import { AnalysisResult, HistoryItem } from '../types/contract';

const HISTORY_STORAGE_KEY = 'clauseguard_audit_history';

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveToHistory(result: AnalysisResult): void {
  try {
    const history = getHistory();
    // Prevent duplicate entries for same id
    const filtered = history.filter((item) => item.result.id !== result.id);
    const updated: HistoryItem[] = [
      {
        id: result.id,
        timestamp: Date.now(),
        result,
      },
      ...filtered,
    ].slice(0, 20); // Keep last 20
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save audit history:', err);
  }
}

export function deleteFromHistory(id: string): HistoryItem[] {
  try {
    const history = getHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearAllHistory(): void {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}
