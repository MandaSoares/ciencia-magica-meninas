-- Fix Issue #2: Add input validation to handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Extract and validate name
  user_name := COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email);
  
  -- Enforce length limit (max 100 characters)
  IF length(user_name) > 100 THEN
    user_name := substring(user_name, 1, 100);
  END IF;
  
  -- Ensure minimum length (at least 1 character after trimming)
  user_name := trim(user_name);
  IF length(user_name) = 0 THEN
    user_name := NEW.email;
  END IF;
  
  -- Strip potentially problematic characters (allow letters, numbers, spaces, hyphens, dots, @, accented chars)
  user_name := regexp_replace(user_name, '[^\w\s\-\.@áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ]', '', 'g');
  
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, user_name, NEW.email);
  
  RETURN NEW;
END;
$$;

-- Fix Issue #3: Create profile-images storage bucket for proper image storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to profile images
CREATE POLICY "Profile images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

-- Allow users to upload their own profile image (user-specific folder)
CREATE POLICY "Users can upload their own profile image"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own profile image
CREATE POLICY "Users can update their own profile image"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own profile image
CREATE POLICY "Users can delete their own profile image"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);