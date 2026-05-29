-- Media references on songs + service setlists for worship flow

-- ─── Song media columns ──────────────────────────────────────────────────────
ALTER TABLE public.songs
  ADD COLUMN IF NOT EXISTS youtube_url TEXT,
  ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- ─── Service setlists ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.service_setlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  service_date DATE,
  notes TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS service_setlists_slug_idx ON public.service_setlists(slug);
CREATE INDEX IF NOT EXISTS service_setlists_service_date_idx ON public.service_setlists(service_date DESC);

ALTER TABLE public.service_setlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "setlists_select_all" ON public.service_setlists;
CREATE POLICY "setlists_select_all"
  ON public.service_setlists FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "setlists_insert_staff" ON public.service_setlists;
CREATE POLICY "setlists_insert_staff"
  ON public.service_setlists FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_any_role(ARRAY['super_admin', 'admin', 'editor']::public.user_role[])
  );

DROP POLICY IF EXISTS "setlists_update_staff" ON public.service_setlists;
CREATE POLICY "setlists_update_staff"
  ON public.service_setlists FOR UPDATE
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super_admin', 'admin', 'editor']::public.user_role[])
  )
  WITH CHECK (
    public.has_any_role(ARRAY['super_admin', 'admin', 'editor']::public.user_role[])
  );

DROP POLICY IF EXISTS "setlists_delete_admin" ON public.service_setlists;
CREATE POLICY "setlists_delete_admin"
  ON public.service_setlists FOR DELETE
  TO authenticated
  USING (
    public.has_any_role(ARRAY['super_admin', 'admin']::public.user_role[])
  );
