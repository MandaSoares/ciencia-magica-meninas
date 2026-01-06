-- Add policy for admins to delete any comment (only if the has_role function exists)
-- First check if user_roles table and has_role exist from previous partial migration

-- Only add admin delete policy if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'experiment_comments' 
    AND policyname = 'Admins can delete any comment'
  ) AND EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'has_role'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can delete any comment"
    ON public.experiment_comments
    FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END
$$;

-- Add policy to allow users to view all profiles (for displaying profile images in comments)
CREATE POLICY "Anyone can view profiles for comments"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);