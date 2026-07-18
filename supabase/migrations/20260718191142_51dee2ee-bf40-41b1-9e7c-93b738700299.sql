
-- 1) Remove broad listing policies on storage.objects for content-images bucket
-- The bucket stays public so file URLs continue to work via the CDN, but clients
-- can no longer enumerate/list files through the storage API.
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND cmd = 'SELECT'
      AND (qual ILIKE '%content-images%' OR policyname ILIKE '%content-images%' OR policyname ILIKE '%content_images%')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- 2) Lock down SECURITY DEFINER function execution to only what the app needs.
-- Trigger-only functions: revoke from all client roles.
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_comment_content() FROM PUBLIC, anon, authenticated;

-- RPC/RLS helpers: revoke anon (anon has no need for these); keep authenticated.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.increment_likes(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.decrement_likes(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_comment_user_info(uuid[]) FROM PUBLIC, anon;

-- 3) Prevent users from tampering with the comment `likes` counter directly.
-- Column-level UPDATE grant so authenticated can only edit their own content/text.
REVOKE UPDATE ON public.experiment_comments FROM authenticated;
GRANT UPDATE (content, updated_at) ON public.experiment_comments TO authenticated;
