
-- 1. Hidden posts: restrict SELECT
DROP POLICY IF EXISTS "Posts viewable by everyone" ON public.posts;
CREATE POLICY "Posts viewable"
  ON public.posts
  FOR SELECT
  USING (
    hidden = false
    OR auth.uid() = author_id
    OR public.is_admin_or_mod(auth.uid())
  );

-- 2. Notifications: remove broad insert, add trigger-based creation
DROP POLICY IF EXISTS "Authed insert notifs" ON public.notifications;

-- Helper: create notification (SECURITY DEFINER bypasses RLS)
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
  IF _recipient_id IS NULL OR _recipient_id = _actor_id THEN
    RETURN;
  END IF;
  INSERT INTO public.notifications (recipient_id, actor_id, type, post_id)
  VALUES (_recipient_id, _actor_id, _type, _post_id);
END;
$$;

-- Like trigger
CREATE OR REPLACE FUNCTION public.notify_on_like()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _author uuid;
BEGIN
  SELECT author_id INTO _author FROM public.posts WHERE id = NEW.post_id;
  PERFORM public.create_notification(_author, NEW.user_id, 'like'::public.notif_type, NEW.post_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_like ON public.likes;
CREATE TRIGGER trg_notify_on_like
AFTER INSERT ON public.likes
FOR EACH ROW EXECUTE FUNCTION public.notify_on_like();

-- Comment trigger
CREATE OR REPLACE FUNCTION public.notify_on_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _author uuid;
BEGIN
  SELECT author_id INTO _author FROM public.posts WHERE id = NEW.post_id;
  PERFORM public.create_notification(_author, NEW.author_id, 'comment'::public.notif_type, NEW.post_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_comment ON public.comments;
CREATE TRIGGER trg_notify_on_comment
AFTER INSERT ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.notify_on_comment();

-- Follow trigger
CREATE OR REPLACE FUNCTION public.notify_on_follow()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.create_notification(NEW.following_id, NEW.follower_id, 'follow'::public.notif_type, NULL);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_follow ON public.follows;
CREATE TRIGGER trg_notify_on_follow
AFTER INSERT ON public.follows
FOR EACH ROW EXECUTE FUNCTION public.notify_on_follow();

-- Save trigger
CREATE OR REPLACE FUNCTION public.notify_on_save()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _author uuid;
BEGIN
  SELECT author_id INTO _author FROM public.posts WHERE id = NEW.post_id;
  PERFORM public.create_notification(_author, NEW.user_id, 'save'::public.notif_type, NEW.post_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_save ON public.saves;
CREATE TRIGGER trg_notify_on_save
AFTER INSERT ON public.saves
FOR EACH ROW EXECUTE FUNCTION public.notify_on_save();

-- 3. Storage: post-images INSERT must be in user's own folder; add UPDATE policy
DROP POLICY IF EXISTS "Authenticated users can upload post images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload post images" ON storage.objects;
DROP POLICY IF EXISTS "post-images insert" ON storage.objects;

CREATE POLICY "Users upload own post images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'post-images'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users update own post images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'post-images'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'post-images'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- 4. Enforce bans on content creation
DROP POLICY IF EXISTS "Users create own posts" ON public.posts;
CREATE POLICY "Users create own posts"
  ON public.posts
  FOR INSERT
  WITH CHECK (auth.uid() = author_id AND NOT public.is_user_banned(auth.uid()));

DROP POLICY IF EXISTS "Users create comments" ON public.comments;
CREATE POLICY "Users create comments"
  ON public.comments
  FOR INSERT
  WITH CHECK (auth.uid() = author_id AND NOT public.is_user_banned(auth.uid()));

DROP POLICY IF EXISTS "Users like" ON public.likes;
CREATE POLICY "Users like"
  ON public.likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND NOT public.is_user_banned(auth.uid()));

DROP POLICY IF EXISTS "Users save" ON public.saves;
CREATE POLICY "Users save"
  ON public.saves
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND NOT public.is_user_banned(auth.uid()));

DROP POLICY IF EXISTS "Users follow" ON public.follows;
CREATE POLICY "Users follow"
  ON public.follows
  FOR INSERT
  WITH CHECK (auth.uid() = follower_id AND NOT public.is_user_banned(auth.uid()));
