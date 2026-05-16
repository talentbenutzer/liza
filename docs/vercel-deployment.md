# Vercel Deployment

## 1. GitHub Repository erstellen
1. Erstelle ein neues, privates Repository auf GitHub (z.B. `liza-web`).
2. Verbinde dein lokales Projekt mit GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - MVP Version"
   git branch -M main
   git remote add origin <dein-github-repo-url>
   git push -u origin main
   ```

## 2. Projekt zu Vercel verbinden
1. Logge dich bei [Vercel](https://vercel.com) ein.
2. Klicke auf "Add New..." -> "Project".
3. Wähle das GitHub Repository `liza-web` aus und klicke auf "Import".
4. Vercel erkennt Next.js automatisch. Die Build-Settings (`npm run build`) müssen in der Regel nicht angepasst werden.

## 3. ENV-Variablen setzen
Falls du in Zukunft Supabase anbindest, musst du unter "Settings" -> "Environment Variables" in Vercel folgende Werte hinterlegen:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Für den aktuellen MVP (nur LocalStorage) werden keine Umgebungsvariablen benötigt.

## 4. Deployment testen
1. Klicke auf "Deploy".
2. Vercel baut die App (ca. 1-2 Minuten).
3. Nach erfolgreichem Build erhältst du eine Live-URL (z.B. `liza-web.vercel.app`).
4. Öffne die URL und teste auf einem Smartphone, ob das Design "mobile-first" optimal reagiert und der LocalStorage wie erwartet funktioniert.
