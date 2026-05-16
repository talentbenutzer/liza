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

## LocalStorage Hinweise
In der MVP-Version werden alle Daten ausschließlich lokal im Browser gespeichert (kein Backend, keine Datenbank).
Folgende Keys werden im LocalStorage verwendet:
- `liza_demo_mode`
- `liza_food_restrictions`
- `liza_scan_history`
- `liza_use_lisa_profile`

## Wichtiger Medizinischer Disclaimer
LIZA ersetzt keine medizinische Beratung. Die Analyse basiert auf manueller Eingabe oder OCR-Text und den persönlichen Angaben. Es können Fehler in der Erkennung oder Zuordnung auftreten. Besonders bei Allergien oder potenziell schweren Reaktionen müssen die Angaben auf der Originalverpackung immer eigenständig und kritisch geprüft werden.
