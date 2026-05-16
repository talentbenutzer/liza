# Supabase Live Plan

## Migration von LocalStorage zu Supabase

Aktuell liegen alle Daten im `LocalStorage` des Browsers. Für die Live-Version werden diese in eine relationale PostgreSQL-Datenbank (Supabase) migriert.

### Benötigte Tabellen

1. **`users`** (Gemanagt durch Supabase Auth)
   - `id` (uuid, primary key)
   - `email` (text)
   - `created_at` (timestamp)

2. **`user_profiles`**
   - `id` (uuid, primary key, references users.id)
   - `use_lisa_profile` (boolean)
   - `created_at` (timestamp)

3. **`user_food_restrictions`** (Ersetzt `liza_food_restrictions`)
   - `id` (uuid, primary key)
   - `user_id` (uuid, references users.id)
   - `name` (text)
   - `restriction_type` (enum: allergy, intolerance, avoidance)
   - `severity` (enum: low, medium, high)
   - `avoid_traces` (boolean)
   - `notes` (text)
   - `created_at` (timestamp)

4. **`scan_history`** (Ersetzt `liza_scan_history`)
   - `id` (uuid, primary key)
   - `user_id` (uuid, references users.id)
   - `original_text` (text)
   - `result_status` (enum: green, yellow, red)
   - `matches_json` (jsonb)
   - `created_at` (timestamp)

## Auth-Konzept
- Nutzung von `@supabase/ssr` im Next.js App Router.
- Login via Magic Link (Email) oder OAuth (z.B. Google/Apple), da die Zielgruppe schnelle Einstiege bevorzugt.
- Middleware sichert `/profile`, `/history` und `/settings` ab.

## RLS (Row Level Security) Konzept
Jede Tabelle, die nutzerspezifische Daten hält (Restrictions, History), erhält eine RLS Policy:
- `SELECT`, `INSERT`, `UPDATE`, `DELETE` nur erlaubt, wenn `auth.uid() = user_id`.
Das garantiert, dass niemand die Lebensmittel-Allergien oder Scans anderer Nutzer einsehen kann.

## Benötigte ENV-Variablen
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
