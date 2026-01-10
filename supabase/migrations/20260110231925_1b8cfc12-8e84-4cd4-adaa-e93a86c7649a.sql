-- Create a secure RPC function to get only safe profile data for comments
-- This replaces the overly permissive "Anyone can view profiles for comments" policy
CREATE OR REPLACE FUNCTION public.get_comment_user_info(user_ids uuid[])
RETURNS TABLE (id uuid, name text, profile_image text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.name, p.profile_image
  FROM public.profiles p
  WHERE p.id = ANY(user_ids);
$$;

-- Drop the overly permissive policy that exposes email, age, interests, etc.
DROP POLICY IF EXISTS "Anyone can view profiles for comments" ON public.profiles;