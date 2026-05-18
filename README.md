# LIZA - Lebensmittel-Intoleranz- & Zutaten-Analyse

LIZA hilft Menschen mit Lebensmittelunverträglichkeiten, Allergien oder persönlichen Lebensmittel-Einschränkungen dabei, Zutatenlisten von Verpackungen schneller einzuschätzen.

## Lokales Setup

LIZA wurde mit Next.js, Tailwind CSS und shadcn/ui entwickelt.

1. Dependencies installieren (falls nicht bereits geschehen):
   ```bash
   npm install
   ```

2. Entwicklungs-Server starten:
   ```bash
   npm run dev
   ```
   Die App ist danach unter `http://localhost:3000` erreichbar.

## MVP Funktionen
- **Landingpage** mit Einführung in LIZA.
- **Demo-Modus**: Teste die App mit generierten Mock-Daten.
- **Nutzer-Profil**: Eigene Lebensmittel-Einschränkungen anlegen, bearbeiten und löschen (inkl. Schweregrad und Spuren-Handling).
- **Lisa-Profil**: Ein vordefiniertes Profil zur Erkennung kritischer Lebensmittel.
- **Zutaten scannen**: Mock-OCR-Eingabe von Zutatenlisten zur Risiko-Bewertung.
- **Scan-Ergebnis**: Bewertung mit Ampelsystem (Rot, Gelb, Grün) und Ausweisung von problematischen Zutaten.
- **Historie**: Speicherung von durchgeführten Scans.

## Supabase & Authentifizierung
Die App wurde auf Supabase umgestellt. Die Datenbank-Struktur findest du in `supabase/schema.sql`.

**Wichtige Testanleitung:**
1. Öffne `http://localhost:3000/login` in deinem Browser.
2. Registriere dir einen neuen Account (z.B. mit `test@liza-app.de` und Passwort `Test1234!`).
3. **Wichtig:** Supabase schickt standardmäßig eine Bestätigungs-E-Mail ("Confirm Email").
   Um das lokale Testen deutlich zu erleichtern, gehe in dein **Supabase Dashboard -> Authentication -> Providers -> Email** und deaktiviere den Schalter bei **"Confirm email"**. So kannst du dich direkt nach der Registrierung einloggen.
4. **Hinweis zum Rate-Limit:** Im kostenlosen Supabase-Tarif (ohne eigenen SMTP-Server) sind Registrierungen auf **ca. 3 pro Stunde** limitiert. Wundere dich also nicht, falls beim massenhaften Anlegen von Test-Accounts ein Fehler auftritt ("email rate limit exceeded").

## LocalStorage Fallback
Teile der App verwenden weiterhin einen LocalStorage-Fallback, wenn du als Gast surfst.

## Wichtiger Medizinischer Disclaimer
LIZA ersetzt keine medizinische Beratung. Die Analyse basiert auf manueller Eingabe oder OCR-Text und den persönlichen Angaben. Es können Fehler in der Erkennung oder Zuordnung auftreten. Besonders bei Allergien oder potenzdiell schweredn Reaktionen müssen die Angaben auf der Originalverpackung immer eigenständig und kritisch geprüft werden.
