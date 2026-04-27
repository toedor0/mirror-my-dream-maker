CREATE TABLE public.admin_pin_settings (
  id boolean PRIMARY KEY DEFAULT true,
  pin_hash text NOT NULL,
  salt text NOT NULL,
  set_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_pin_singleton CHECK (id = true)
);

ALTER TABLE public.admin_pin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read pin settings"
  ON public.admin_pin_settings FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins insert pin settings"
  ON public.admin_pin_settings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update pin settings"
  ON public.admin_pin_settings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));