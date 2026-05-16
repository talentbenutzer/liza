import { ScanHistoryItem } from '../analyzer/types';

const HISTORY_KEY = 'liza_scan_history';

export function getScanHistory(): ScanHistoryItem[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(HISTORY_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveScanResult(item: ScanHistoryItem): void {
  const history = getScanHistory();
  history.unshift(item);
  if (typeof window !== 'undefined') {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
}

export function deleteScanResult(id: string): void {
  const history = getScanHistory();
  const newHistory = history.filter(item => item.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  }
}
