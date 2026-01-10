-- Fix 1: Add DELETE policy to user_progress table for GDPR compliance
CREATE POLICY "Users can delete their own progress"
ON public.user_progress
FOR DELETE
USING (auth.uid() = user_id);

-- Fix 2: Create server-side profanity filter trigger for experiment_comments
CREATE OR REPLACE FUNCTION public.validate_comment_content()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  blocked_words TEXT[] := ARRAY[
    'merda', 'bosta', 'caralho', 'porra', 'foder', 'foda', 'fodase', 'pqp', 'vsf', 'vtnc', 'tnc',
    'cacete', 'buceta', 'piroca', 'pau', 'rola', 'pinto', 'cu', 'cuzao', 'cuzão', 'arrombado',
    'macaco', 'macaca', 'crioulo', 'crioula',
    'piranha', 'vadia', 'vagabunda', 'puta', 'prostituta', 'vaca', 'galinha',
    'viado', 'veado', 'bicha', 'sapatao', 'sapatão', 'boiola',
    'retardado', 'retardada', 'imbecil', 'lixo', 'nojento', 'nojenta',
    'inutil', 'inútil', 'estupido', 'estúpido', 'estupida', 'estúpida', 'otario', 'otário', 'otaria', 'otária',
    'sexo', 'transar', 'gozar', 'punheta', 'masturbacao', 'masturbação', 'porno', 'pornografia',
    'bucetinha', 'piriquita', 'xoxota', 'tesao', 'tesão'
  ];
  word TEXT;
  normalized_content TEXT;
BEGIN
  -- Normalize content for comparison (lowercase and remove accents)
  normalized_content := lower(NEW.content);
  normalized_content := translate(normalized_content, 'áàâãäéèêëíìîïóòôõöúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn');
  
  FOREACH word IN ARRAY blocked_words
  LOOP
    -- Also normalize the blocked word
    IF normalized_content LIKE '%' || translate(lower(word), 'áàâãäéèêëíìîïóòôõöúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn') || '%' THEN
      RAISE EXCEPTION 'Comment contains inappropriate content';
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Create trigger for comment content validation
CREATE TRIGGER check_comment_content
BEFORE INSERT OR UPDATE ON public.experiment_comments
FOR EACH ROW EXECUTE FUNCTION public.validate_comment_content();