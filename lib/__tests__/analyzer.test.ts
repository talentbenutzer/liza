import { describe, it, expect } from 'vitest';
import { normalizeText } from '../analyzer/normalizeText';
import { getHighestRisk } from '../utils/getHighestRisk';
import { analyzeIngredients } from '../analyzer/analyzeIngredients';
import { UserFoodRestriction } from '../analyzer/types';

describe('normalizeText', () => {
  it('handles case, umlauts, special chars, multiple spaces', () => {
    const input = 'Zutaten: ZUCKER, Weizenmehl,   Magermilchpulver! (Erdnüsse)';
    const result = normalizeText(input);
    expect(result).toBe('zutaten zucker weizenmehl magermilchpulver! erdnüsse');
  });
});

describe('getHighestRisk', () => {
  it('green + yellow = yellow', () => {
    expect(getHighestRisk(['green', 'yellow'])).toBe('yellow');
  });
  it('yellow + red = red', () => {
    expect(getHighestRisk(['yellow', 'red', 'green'])).toBe('red');
  });
  it('no hits = green', () => {
    expect(getHighestRisk([])).toBe('green');
  });
});

describe('analyzeIngredients', () => {
  const restrictions: UserFoodRestriction[] = [
    { id: '1', name: 'Erdnuss', restrictionType: 'allergy', severity: 'high', avoidTraces: true, createdAt: 1 },
    { id: '2', name: 'Haselnuss', restrictionType: 'allergy', severity: 'medium', avoidTraces: false, createdAt: 2 },
    { id: '3', name: 'Laktose', restrictionType: 'intolerance', severity: 'high', avoidTraces: false, createdAt: 3 },
    { id: '4', name: 'Fruktose', restrictionType: 'intolerance', severity: 'medium', avoidTraces: false, createdAt: 4 },
    { id: '5', name: 'Milch', restrictionType: 'intolerance', severity: 'medium', avoidTraces: false, createdAt: 5 },
  ];

  it('Allergie direkter Treffer ergibt red', () => {
    const res = analyzeIngredients('Zutaten: Zucker, Erdnuss', restrictions);
    expect(res.status).toBe('red');
    expect(res.matches[0].matchedText).toBe('Erdnuss');
  });

  it('Allergie Spurenhinweis mit avoidTraces true ergibt red', () => {
    const res = analyzeIngredients('Zutaten: Zucker. Kann Spuren von Erdnuss enthalten.', restrictions);
    expect(res.status).toBe('red');
    expect(res.matches[0].isTraceWarning).toBe(true);
  });

  it('Allergie Spurenhinweis mit avoidTraces false ergibt yellow', () => {
    const res = analyzeIngredients('Zutaten: Zucker. Kann Spuren von Haselnuss enthalten.', restrictions);
    expect(res.status).toBe('yellow');
    expect(res.matches[0].isTraceWarning).toBe(true);
  });

  it('Unverträglichkeit high ergibt red', () => {
    const res = analyzeIngredients('Zutaten: Laktose', restrictions);
    expect(res.status).toBe('red');
  });

  it('Unverträglichkeit medium ergibt yellow', () => {
    const res = analyzeIngredients('Zutaten: Fruktose', restrictions);
    expect(res.status).toBe('yellow');
  });

  it('Kakaobutter wird nicht als Milch/Butter-Risiko gewertet', () => {
    const res = analyzeIngredients('Zutaten: Kakaobutter', restrictions);
    // Because 'Milch' is the restriction, and 'Kakaobutter' doesn't contain 'Milch'
    expect(res.status).toBe('green');
  });
});
