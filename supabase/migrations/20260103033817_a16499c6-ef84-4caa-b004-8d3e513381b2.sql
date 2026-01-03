
-- Create function to increment likes
CREATE OR REPLACE FUNCTION public.increment_likes(comment_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.experiment_comments
  SET likes = likes + 1
  WHERE id = comment_id;
END;
$$;

-- Create function to decrement likes
CREATE OR REPLACE FUNCTION public.decrement_likes(comment_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.experiment_comments
  SET likes = GREATEST(0, likes - 1)
  WHERE id = comment_id;
END;
$$;
