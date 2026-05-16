import { LisaFoodItem } from '../lisa/types';
import { predefinedLisaFoods } from '../lisa/lisaFoods';

const USE_LISA_PROFILE_KEY = 'liza_use_lisa_profile';
const CUSTOM_OVERRIDES_KEY = 'liza_lisa_foods_custom_overrides';

export function getUseLisaProfile(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(USE_LISA_PROFILE_KEY) === 'true';
}

export function setUseLisaProfile(value: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USE_LISA_PROFILE_KEY, String(value));
  }
}

export function getLisaFoodOverrides(): Record<string, LisaFoodItem | null> {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(CUSTOM_OVERRIDES_KEY);
  if (!data) return {};
  try { return JSON.parse(data); } catch { return {}; }
}

export function saveLisaFoodOverride(id: string, item: LisaFoodItem | null): void {
  const overrides = getLisaFoodOverrides();
  overrides[id] = item;
  if (typeof window !== 'undefined') {
    localStorage.setItem(CUSTOM_OVERRIDES_KEY, JSON.stringify(overrides));
  }
}

export function getMergedLisaFoods(): LisaFoodItem[] {
  const overrides = getLisaFoodOverrides();
  const merged: LisaFoodItem[] = [];
  
  for (const pf of predefinedLisaFoods) {
    if (overrides[pf.id] === null) continue; // deleted
    if (overrides[pf.id]) {
      merged.push(overrides[pf.id]!); // edited
    } else {
      merged.push(pf); // untouched
    }
  }

  for (const id in overrides) {
    const item = overrides[id];
    if (item && !predefinedLisaFoods.find(pf => pf.id === id)) {
      merged.push(item);
    }
  }

  return merged;
}
