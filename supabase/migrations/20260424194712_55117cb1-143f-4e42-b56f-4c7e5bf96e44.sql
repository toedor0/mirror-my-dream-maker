CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'oklch(0.7 0.12 60)',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories viewable by everyone"
ON public.categories FOR SELECT
USING (true);

INSERT INTO public.categories (slug, label, emoji, color, sort_order) VALUES
  ('orgu-tig', 'Örgü & Tığ', '🧶', 'oklch(0.72 0.15 30)', 1),
  ('dikis-nakis', 'Dikiş & Nakış', '🪡', 'oklch(0.65 0.18 250)', 2),
  ('makrome', 'Makrome', '🪢', 'oklch(0.75 0.10 80)', 3),
  ('diger', 'Diğer El İşleri', '✂️', 'oklch(0.7 0.12 30)', 4),
  ('kanavice', 'Kanaviçe', '🧵', 'oklch(0.68 0.15 25)', 5),
  ('amigurumi', 'Amigurumi', '🧸', 'oklch(0.7 0.14 50)', 6);