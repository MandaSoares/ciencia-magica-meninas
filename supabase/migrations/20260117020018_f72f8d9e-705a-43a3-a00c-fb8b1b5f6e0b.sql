-- Add cover_image column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS cover_image TEXT;