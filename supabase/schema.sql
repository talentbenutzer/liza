-- Supabase LIZA Database Schema

-- 1. Tabellen erstellen
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  use_lisa_profile BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.user_food_restrictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  restriction_type TEXT NOT NULL CHECK (restriction_type IN ('allergy', 'intolerance', 'avoidance')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  avoid_traces BOOLEAN DEFAULT false,
  notes TEXT,
  created_at BIGINT NOT NULL
);

CREATE TABLE public.scan_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  original_text TEXT NOT NULL,
  result_status TEXT NOT NULL CHECK (result_status IN ('green', 'yellow', 'red')),
  matches_json JSONB DEFAULT '[]'::jsonb,
  lisa_profile_json JSONB,
  created_at BIGINT NOT NULL
);

CREATE TABLE public.lisa_foods_overrides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  food_id TEXT NOT NULL,
  food_data JSONB, -- null bedeutet "gelöscht"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, food_id)
);


-- 2. RLS (Row Level Security) aktivieren
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_food_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lisa_foods_overrides ENABLE ROW LEVEL SECURITY;


-- 3. RLS Policies erstellen (Nutzer dürfen nur ihre eigenen Daten sehen & bearbeiten)

-- Profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- Restrictions
CREATE POLICY "Users can view own restrictions" ON public.user_food_restrictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own restrictions" ON public.user_food_restrictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own restrictions" ON public.user_food_restrictions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own restrictions" ON public.user_food_restrictions FOR DELETE USING (auth.uid() = user_id);

-- Scan History
CREATE POLICY "Users can view own history" ON public.scan_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON public.scan_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own history" ON public.scan_history FOR DELETE USING (auth.uid() = user_id);

-- Lisa Overrides
CREATE POLICY "Users can view own overrides" ON public.lisa_foods_overrides FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own overrides" ON public.lisa_foods_overrides FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own overrides" ON public.lisa_foods_overrides FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own overrides" ON public.lisa_foods_overrides FOR DELETE USING (auth.uid() = user_id);
