-- User roles & profiles for Songbook admin access control
-- Run in Supabase SQL Editor or via: supabase db push

-- ─── Role enum ───────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM (
    'super_admin',
    'admin',
    'editor',
    'viewer'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ─── Profiles (extends auth.users) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role public.user_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- Backfill profiles for existing auth users
INSERT INTO public.profiles (id, email, full_name, role)
SELECT
  u.id,
  COALESCE(u.email, ''),
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''),
  'viewer'::public.user_role
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

-- Auto-create profile on signup (default role: viewer)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    'viewer'::public.user_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Keep email in sync
CREATE OR REPLACE FUNCTION public.handle_user_email_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET email = COALESCE(NEW.email, ''), updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_email_update();

-- ─── Helpers for RLS ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(allowed public.user_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_my_role() = ANY(allowed);
$$;

-- ─── Profiles RLS ──────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own display name only (not role)
DROP POLICY IF EXISTS "profiles_update_own_name" ON public.profiles;
CREATE POLICY "profiles_update_own_name"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
  );

-- ─── Songs RLS (adjust if policies already exist) ─────────────────────────────
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "songs_select_all" ON public.songs;
CREATE POLICY "songs_select_all"
  ON public.songs FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "songs_insert_staff" ON public.songs;
CREATE POLICY "songs_insert_staff"
  ON public.songs FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_any_role(ARRAY['super_admin', 'admin', 'editor']::public.user_role[])
  );

DROP POLICY IF EXISTS "songs_update_staff" ON public.songs;
CREATE POLICY "songs_update_staff"
  ON public.songs FOR UPDATE
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super_admin', 'admin', 'editor']::public.user_role[])
  )
  WITH CHECK (
    public.has_any_role(ARRAY['super_admin', 'admin', 'editor']::public.user_role[])
  );

DROP POLICY IF EXISTS "songs_delete_admin" ON public.songs;
CREATE POLICY "songs_delete_admin"
  ON public.songs FOR DELETE
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super_admin', 'admin']::public.user_role[])
  );
