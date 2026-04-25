DROP POLICY IF EXISTS "Roles viewable by everyone" ON public.user_roles;

CREATE POLICY "Users view own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Mods view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin_or_mod(auth.uid()));