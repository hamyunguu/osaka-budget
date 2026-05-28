import { STORAGE_KEYS, DEFAULT_CONFIG } from "./constants";
import type { Entry, BudgetConfig } from "./types";

export function getEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.entries);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setEntries(entries: Entry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries));
  } catch {
    // storage full or unavailable
  }
}

export function getConfig(): BudgetConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.config);
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : { ...DEFAULT_CONFIG };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function setConfig(config: BudgetConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
  } catch {
    // storage full or unavailable
  }
}

export function clearAll(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.entries);
    localStorage.removeItem(STORAGE_KEYS.config);
  } catch {
    // ignore
  }
}

export function exportData(): string {
  return JSON.stringify({
    entries: getEntries(),
    config: getConfig(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}
