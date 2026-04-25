
-- 1. Restrict create_notification to triggers only
REVOKE EXECUTE ON FUNCTION public.create_notification(uuid, uuid, public.notif_type, uuid) FROM PUBLIC, anon, authenticated;

-- Add defensive identity check inside the function as well
CREATE OR REPLACE FUNCTION public.create_notification(
  _recipient_id uuid,
  _actor_id uuid,
  _type public.notif_type,
  _post_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow invocation from within trigger context (no direct user calls)
  IF TG_OP IS NULL AND auth.uid() IS NOT NULL AND _actor_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  IF _recipient_id IS NULL OR _recipient_id = _actor_id THEN
    RETURN;
  END IF;
  INSERT INTO public.notifications (recipient_id, actor_id, type, post_id)
  VALUES (_recipient_id, _actor_id, _type, _post_id);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_notification(uuid, uuid, public.notif_type, uuid) FROM PUBLIC, anon, authenticated;

-- 2. Drop the overly broad post-images upload policy
DROP POLICY IF EXISTS "Authed upload post images" ON storage.objects;
