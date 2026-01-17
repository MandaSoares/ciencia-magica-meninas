-- Add cover_image column to experiments_content table
ALTER TABLE public.experiments_content 
ADD COLUMN IF NOT EXISTS cover_image TEXT;