import { UserFoodRestriction } from '../analyzer/types';

const RESTRICTIONS_KEY = 'liza_food_restrictions';
const DEMO_MODE_KEY = 'liza_demo_mode';

export function getDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DEMO_MODE_KEY) === 'true';
}

export function setDemoMode(value: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEMO_MODE_KEY, String(value));
  }
}

export function getFoodRestrictions(): UserFoodRestriction[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(RESTRICTIONS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function setFoodRestrictions(restrictions: UserFoodRestriction[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(RESTRICTIONS_KEY, JSON.stringify(restrictions));
  }
}

export function initializeDemoData(): void {
  if (typeof window === 'undefined') return;
  const demoData: UserFoodRestriction[] = [
    {
      id: 'demo-1',
      name: 'Laktose',
      restrictionType: 'intolerance',
      severity: 'medium',
      avoidTraces: false,
      notes: 'Demo Eintrag',
      createdAt: Date.now(),
    },
    {
      id: 'demo-2',
      name: 'Erdnuss',
      restrictionType: 'allergy',
      severity: 'high',
      avoidTraces: true,
      notes: 'Demo Eintrag',
      createdAt: Date.now(),
    },
    {
      id: 'demo-3',
      name: 'Gluten',
      restrictionType: 'intolerance',
      severity: 'high',
      avoidTraces: true,
      notes: 'Demo Eintrag',
      createdAt: Date.now(),
    }
  ];
  setFoodRestrictions(demoData);
  setDemoMode(true);
}
