import { describe, it, expect } from 'vitest';
import { analyzeLisaProfile } from '../lisa/analyzeLisaProfile';

describe('analyzeLisaProfile', () => {
  it('Weizenmehl wird als Weizen / No-Go erkannt', () => {
    const res = analyzeLisaProfile('Zutaten: Wasser, Weizenmehl');
    expect(res.noGoMatches).toContain('Weizen');
    expect(res.status).toBe('red');
  });

  it('Magermilchpulver wird als Milch (Kuh) / No-Go erkannt', () => {
    const res = analyzeLisaProfile('Zutaten: Magermilchpulver');
    expect(res.noGoMatches).toContain('Milch (Kuh)');
    expect(res.status).toBe('red');
  });

  it('Erdnüsse wird als Erdnuss / No-Go erkannt', () => {
    const res = analyzeLisaProfile('Zutaten: Erdnüsse');
    expect(res.noGoMatches).toContain('Erdnuss');
    expect(res.status).toBe('red');
  });

  it('Haselnüsse wird als Haselnuss / No-Go erkannt', () => {
    const res = analyzeLisaProfile('Zutaten: Haselnüsse');
    expect(res.noGoMatches).toContain('Haselnuss');
    expect(res.status).toBe('red');
  });

  it('Sonnenblumenöl wird als No-Go erkannt', () => {
    const res = analyzeLisaProfile('Zutaten: Sonnenblumenöl');
    expect(res.noGoMatches).toContain('Sonnenblumenöl');
    expect(res.status).toBe('red');
  });

  it('Wenn No-Go und Happy gemeinsam vorkommen, ist Ergebnis red', () => {
    const res = analyzeLisaProfile('Zutaten: Zucker, Weizenmehl');
    expect(res.happyMatches).toContain('Zucker');
    expect(res.noGoMatches).toContain('Weizen');
    expect(res.status).toBe('red');
  });

  it('Wenn nur Happy-Foods vorkommen, ist Ergebnis green', () => {
    const res = analyzeLisaProfile('Zutaten: Zucker, Kakaobutter, Sojalecithin');
    expect(res.happyMatches.length).toBeGreaterThan(0);
    expect(res.noGoMatches.length).toBe(0);
    expect(res.status).toBe('green');
  });

  it('Wenn keine bekannten Treffer vorkommen, ist Ergebnis yellow', () => {
    const res = analyzeLisaProfile('Zutaten: UnbekanntesDingsbums');
    expect(res.happyMatches.length).toBe(0);
    expect(res.noGoMatches.length).toBe(0);
    expect(res.status).toBe('yellow');
  });
});
