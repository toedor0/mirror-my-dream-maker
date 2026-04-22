
DROP POLICY "System inserts notifs" ON public.notifications;
CREATE POLICY "Authed insert notifs" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = actor_id OR actor_id IS NULL);

DROP POLICY "Anyone can view post images" ON storage.objects;
DROP POLICY "Anyone can view avatars" ON storage.objects;
-- Public buckets serve files via direct URL even without SELECT policy.
