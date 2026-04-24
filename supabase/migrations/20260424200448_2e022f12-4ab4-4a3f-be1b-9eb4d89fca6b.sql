
-- 1. Roles enum + user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. user_bans table (BEFORE is_user_banned function)
CREATE TABLE public.user_bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  reason TEXT,
  banned_by UUID,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;

-- 3. weekly_themes table
CREATE TABLE public.weekly_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  hashtag TEXT NOT NULL,
  image_url TEXT,
  starts_at DATE NOT NULL,
  ends_at DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.weekly_themes ENABLE ROW LEVEL SECURITY;

-- 4. Security definer functions (now that tables exist)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_mod(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin', 'moderator'))
$$;

CREATE OR REPLACE FUNCTION public.is_user_banned(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_bans WHERE user_id = _user_id AND (expires_at IS NULL OR expires_at > now()))
$$;

-- 5. Add hidden to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT false;

-- 6. RLS policies
CREATE POLICY "Roles viewable by everyone" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Bans viewable by mods" ON public.user_bans FOR SELECT
  USING (public.is_admin_or_mod(auth.uid()));
CREATE POLICY "Admins manage bans" ON public.user_bans FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Themes viewable by everyone" ON public.weekly_themes FOR SELECT USING (true);
CREATE POLICY "Admins manage themes" ON public.weekly_themes FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage categories" ON public.categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Mods update any post" ON public.posts FOR UPDATE
  USING (public.is_admin_or_mod(auth.uid()));
CREATE POLICY "Mods delete any post" ON public.posts FOR DELETE
  USING (public.is_admin_or_mod(auth.uid()));

CREATE POLICY "Mods delete any comment" ON public.comments FOR DELETE
  USING (public.is_admin_or_mod(auth.uid()));

CREATE POLICY "Admins update any profile" ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- 7. Bootstrap trigger: first user = admin
CREATE OR REPLACE FUNCTION public.handle_first_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_assign_role
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_first_user_admin();

-- 8. Backfill existing users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user' FROM public.profiles ON CONFLICT DO NOTHING;

WITH oldest AS (SELECT id FROM public.profiles ORDER BY created_at ASC LIMIT 1)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM oldest ON CONFLICT DO NOTHING;
