-- Fix increment_likes function to validate that user actually liked the comment
CREATE OR REPLACE FUNCTION public.increment_likes(comment_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Verify that user has actually inserted a like record
  IF NOT EXISTS (
    SELECT 1 FROM public.comment_likes cl
    WHERE cl.comment_id = increment_likes.comment_id
      AND cl.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'No like record found for this user';
  END IF;
  
  UPDATE public.experiment_comments
  SET likes = likes + 1
  WHERE id = increment_likes.comment_id;
END;
$$;

-- Fix decrement_likes function to validate that user is removing their own like
CREATE OR REPLACE FUNCTION public.decrement_likes(comment_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only decrement if user doesn't have a like record (meaning they just removed it)
  IF EXISTS (
    SELECT 1 FROM public.comment_likes cl
    WHERE cl.comment_id = decrement_likes.comment_id
      AND cl.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Like record still exists';
  END IF;
  
  UPDATE public.experiment_comments
  SET likes = GREATEST(0, likes - 1)
  WHERE id = decrement_likes.comment_id;
END;
$$;