import { analyzeLisaProfile } from '../lib/lisa/analyzeLisaProfile';

describe('analyzeLisaProfile', () => {
  it('1. Weizenmehl erkennt Weizen als No-Go.', () => {
    const res = analyzeLisaProfile('Zutaten: Weizenmehl, Zucker');
    expect(res.status).toBe('red');
    expect(res.noGoMatches).toContain('Weizen');
  });

  it('2. Magermilchpulver erkennt Milch (Kuh) als No-Go.', () => {
    const res = analyzeLisaProfile('Magermilchpulver');
    expect(res.status).toBe('red');
    expect(res.noGoMatches).toContain('Milch (Kuh)');
  });

  it('3. Erdnüsse erkennt Erdnuss als No-Go.', () => {
    const res = analyzeLisaProfile('Zutaten: Erdnüsse');
    expect(res.status).toBe('red');
    expect(res.noGoMatches).toContain('Erdnuss');
  });

  it('4. Haselnüsse erkennt Haselnuss als No-Go.', () => {
    const res = analyzeLisaProfile('Haselnüsse');
    expect(res.status).toBe('red');
    expect(res.noGoMatches).toContain('Haselnuss');
  });

  it('5. Mandelmehl erkennt Mandel als No-Go.', () => {
    const res = analyzeLisaProfile('Mandelmehl');
    expect(res.status).toBe('red');
    expect(res.noGoMatches).toContain('Mandel');
  });

  it('6. Sonnenblumenöl erkennt Sonnenblumenöl als No-Go.', () => {
    const res = analyzeLisaProfile('Sonnenblumenöl');
    expect(res.status).toBe('red');
    expect(res.noGoMatches).toContain('Sonnenblumenöl');
  });

  it('7. Ricotta erkennt Ricotte (Kuh) als No-Go.', () => {
    const res = analyzeLisaProfile('Ricotta');
    expect(res.status).toBe('red');
    expect(res.noGoMatches).toContain('Ricotte (Kuh)');
  });

  it('8. Reis, Mais und Quinoa ergeben green.', () => {
    const res = analyzeLisaProfile('Zutaten: Reis, Mais, Quinoa');
    expect(res.status).toBe('green');
    expect(res.happyMatches).toContain('Reis');
    expect(res.happyMatches).toContain('Mais');
    expect(res.happyMatches).toContain('Quinoa');
    expect(res.noGoMatches.length).toBe(0);
  });

  it('9. Kakaobutter löst keinen No-Go-Treffer aus.', () => {
    // Falls Kakaobutter existiert
    const res = analyzeLisaProfile('Kakaobutter');
    expect(res.noGoMatches).not.toContain('Kakaobutter');
  });

  it('10. Guarkernmehl (E 412) wird als Happy erkannt.', () => {
    const res = analyzeLisaProfile('Guarkernmehl');
    expect(res.status).toBe('green');
    expect(res.happyMatches).toContain('Guarkernmehl (E 412)');
  });

  it('11. Wenn Happy und No-Go gemeinsam vorkommen, ist Ergebnis red.', () => {
    const res = analyzeLisaProfile('Zutaten: Reis, Mais, Weizenmehl');
    expect(res.status).toBe('red');
    expect(res.happyMatches).toContain('Reis');
    expect(res.happyMatches).toContain('Mais');
    expect(res.noGoMatches).toContain('Weizen');
  });

  it('12. Wenn keine bekannten Zutaten vorkommen, ist Ergebnis yellow.', () => {
    const res = analyzeLisaProfile('Maltodextrin, Aroma, Farbstoff');
    expect(res.status).toBe('yellow');
    expect(res.happyMatches.length).toBe(0);
    expect(res.noGoMatches.length).toBe(0);
  });
});
