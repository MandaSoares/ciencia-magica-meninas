-- =====================================================================
-- Hardening de segurança para lançamento (set/2026)
-- Público-alvo são meninas menores de idade: o foco é proteger dados
-- pessoais, impedir manipulação de dados via API e dar ferramentas de
-- moderação.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. BLOG: visitantes não logadas (anon) não têm EXECUTE em has_role().
-- A policy de admin/moderadora sem "TO authenticated" fazia o SELECT
-- anônimo falhar. Restringe a policy a usuárias autenticadas.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins and moderators can view all blog posts" ON public.blog_posts;
CREATE POLICY "Admins and moderators can view all blog posts"
ON public.blog_posts FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- ---------------------------------------------------------------------
-- 2. PERFIS
-- ---------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS guardian_consent_at timestamptz;

-- A usuária só pode alterar estes campos (email, id e consentimentos ficam protegidos).
REVOKE INSERT, UPDATE ON public.profiles FROM anon;
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (name, age, interests, profile_image) ON public.profiles TO authenticated;

-- Validação server-side dos campos editáveis.
CREATE OR REPLACE FUNCTION public.validate_profile()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.name IS DISTINCT FROM OLD.name THEN
    NEW.name := trim(regexp_replace(coalesce(NEW.name, ''), '[<>{}\[\]"`\\]', '', 'g'));
    IF char_length(NEW.name) < 1 OR char_length(NEW.name) > 100 THEN
      RAISE EXCEPTION 'nome_invalido' USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  IF NEW.age IS NOT NULL AND (NEW.age < 4 OR NEW.age > 120) THEN
    RAISE EXCEPTION 'idade_invalida' USING ERRCODE = 'check_violation';
  END IF;

  IF NEW.interests IS NOT NULL
     AND NOT (NEW.interests <@ ARRAY['science','technology','engineering','math']::text[]) THEN
    RAISE EXCEPTION 'interesse_invalido' USING ERRCODE = 'check_violation';
  END IF;

  -- Foto de perfil: só aceita arquivo da própria pasta no bucket profile-images
  -- (impede apontar para URLs externas/rastreadores ou imagens de outras pessoas).
  IF (TG_OP = 'INSERT' OR NEW.profile_image IS DISTINCT FROM OLD.profile_image)
     AND NEW.profile_image IS NOT NULL AND NEW.profile_image <> '' THEN
    IF NEW.profile_image !~ ('^https://[a-z0-9]+\.supabase\.co/storage/v1/object/public/profile-images/'
                             || NEW.id::text || '/[A-Za-z0-9._-]+(\?v=[0-9]+)?$') THEN
      RAISE EXCEPTION 'imagem_invalida' USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.validate_profile() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS validate_profile_trigger ON public.profiles;
CREATE TRIGGER validate_profile_trigger
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.validate_profile();

-- Admins precisam listar usuárias no painel (antes só viam o próprio perfil).
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Cadastro: grava idade e consentimentos vindos do signUp (funciona mesmo
-- com confirmação de email ligada, quando ainda não há sessão).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_name text;
  user_age integer;
BEGIN
  user_name := trim(COALESCE(NEW.raw_user_meta_data ->> 'name', ''));
  user_name := regexp_replace(user_name, '[<>{}\[\]"`\\]', '', 'g');
  IF char_length(user_name) > 100 THEN
    user_name := substring(user_name, 1, 100);
  END IF;
  IF char_length(user_name) = 0 THEN
    user_name := split_part(NEW.email, '@', 1);
  END IF;

  BEGIN
    user_age := (NEW.raw_user_meta_data ->> 'age')::integer;
    IF user_age < 4 OR user_age > 120 THEN user_age := NULL; END IF;
  EXCEPTION WHEN others THEN
    user_age := NULL;
  END;

  INSERT INTO public.profiles (id, name, email, age, terms_accepted_at, guardian_consent_at)
  VALUES (
    NEW.id,
    user_name,
    NEW.email,
    user_age,
    CASE WHEN (NEW.raw_user_meta_data ->> 'terms_accepted') = 'true' THEN now() END,
    CASE WHEN (NEW.raw_user_meta_data ->> 'guardian_consent') = 'true' THEN now() END
  );
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------
-- 3. COMENTÁRIOS
-- ---------------------------------------------------------------------
ALTER TABLE public.experiment_comments
  ADD COLUMN IF NOT EXISTS hidden boolean NOT NULL DEFAULT false;

ALTER TABLE public.experiment_comments
  DROP CONSTRAINT IF EXISTS comment_content_length;
ALTER TABLE public.experiment_comments
  ADD CONSTRAINT comment_content_length
  CHECK (char_length(btrim(content)) BETWEEN 1 AND 1000) NOT VALID;

-- Só autenticadas leem comentários (evita raspagem de nomes de crianças).
-- Comentários ocultados por denúncia só aparecem para a autora e moderação.
DROP POLICY IF EXISTS "Anyone can view comments" ON public.experiment_comments;
DROP POLICY IF EXISTS "Authenticated can view visible comments" ON public.experiment_comments;
DROP POLICY IF EXISTS "Authors and moderators can view hidden comments" ON public.experiment_comments;
CREATE POLICY "Authenticated can view visible comments"
ON public.experiment_comments FOR SELECT TO authenticated
USING (hidden = false);
CREATE POLICY "Authors and moderators can view hidden comments"
ON public.experiment_comments FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'moderator')
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Anyone can view likes" ON public.comment_likes;
DROP POLICY IF EXISTS "Authenticated can view likes" ON public.comment_likes;
CREATE POLICY "Authenticated can view likes"
ON public.comment_likes FOR SELECT TO authenticated USING (true);

-- Moderadoras podem apagar comentários (o painel de moderação já existia,
-- mas o DELETE falhava silenciosamente por falta de policy).
DROP POLICY IF EXISTS "Moderators can delete any comment" ON public.experiment_comments;
CREATE POLICY "Moderators can delete any comment"
ON public.experiment_comments FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'moderator'));

-- INSERT só com as colunas necessárias (antes era possível criar comentário
-- já com likes = 999999).
REVOKE INSERT, UPDATE, DELETE ON public.experiment_comments FROM anon;
REVOKE INSERT ON public.experiment_comments FROM authenticated;
GRANT INSERT (user_id, experiment_id, parent_id, content) ON public.experiment_comments TO authenticated;
REVOKE UPDATE ON public.experiment_comments FROM authenticated;
GRANT UPDATE (content) ON public.experiment_comments TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.comment_likes FROM anon;
REVOKE UPDATE ON public.comment_likes FROM authenticated;

-- Triggers de conteúdo e updated_at só disparam quando o texto muda
-- (não em curtidas/ocultação).
DROP TRIGGER IF EXISTS update_experiment_comments_updated_at ON public.experiment_comments;
CREATE TRIGGER update_experiment_comments_updated_at
BEFORE UPDATE OF content ON public.experiment_comments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Normalização usada pelo filtro: minúsculas, sem acento, leetspeak,
-- pontuação vira espaço, letras repetidas colapsadas ("porrraaa" -> "pora").
CREATE OR REPLACE FUNCTION public.normalize_for_filter(input text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT regexp_replace(
           regexp_replace(
             translate(
               lower(coalesce(input, '')),
               'áàâãäéèêëíìîïóòôõöúùûüçñ0134579@$',
               'aaaaaeeeeiiiiooooouuuucnoieastgas'
             ),
             '[^a-z0-9]+', ' ', 'g'),
           '([a-z])\1+', '\1', 'g');
$$;
REVOKE EXECUTE ON FUNCTION public.normalize_for_filter(text) FROM PUBLIC, anon;

-- Filtro por PALAVRA INTEIRA. A versão anterior usava LIKE '%cu%' e
-- bloqueava "circuito", "cálculo", "curiosidade", "Paulo", "computador"...
-- Também bloqueia troca de contatos (links, email, telefone, redes sociais),
-- prática recomendada em plataformas para crianças.
CREATE OR REPLACE FUNCTION public.validate_comment_content()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  blocked_words text[] := ARRAY[
    'merda','bosta','caralho','krl','porra','foder','foda','fodase','fodasse','fdp','pqp','vsf','vtnc','tnc',
    'cacete','buceta','bucetinha','piroca','cu','cuzao','arrombado','arrombada',
    'crioulo','crioula',
    'vadia','vagabunda','vagabundo','puta','putinha','prostituta',
    'viado','bicha','sapatao','boiola',
    'retardado','retardada','imbecil','idiota','nojento','nojenta',
    'otario','otaria','desgracado','desgracada',
    'transar','punheta','masturbacao','porno','pornografia',
    'piriquita','xoxota','tesao'
  ];
  contact_words text[] := ARRAY[
    'whatsapp','whats','wpp','zap','zapzap','telegram','discord','instagram','insta','tiktok',
    'snapchat','facebook','kwai','twitter'
  ];
  normalized text;
  raw_lower text;
BEGIN
  IF NEW.content IS NULL OR char_length(btrim(NEW.content)) = 0 THEN
    RAISE EXCEPTION 'comentario_vazio' USING ERRCODE = 'check_violation';
  END IF;
  IF char_length(NEW.content) > 1000 THEN
    RAISE EXCEPTION 'comentario_longo' USING ERRCODE = 'check_violation';
  END IF;

  raw_lower := lower(NEW.content);
  normalized := ' ' || public.normalize_for_filter(NEW.content) || ' ';

  IF normalized ~ ('\m(' || array_to_string(
       ARRAY(SELECT public.normalize_for_filter(w) FROM unnest(blocked_words) w), '|') || ')\M') THEN
    RAISE EXCEPTION 'conteudo_inapropriado' USING ERRCODE = 'check_violation';
  END IF;

  IF raw_lower ~ '(https?://|www\.|[a-z0-9-]+\.(com|net|org|br|io|gg|me|ly)(\M|/))'
     OR raw_lower ~ '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}'
     OR raw_lower ~ '(^|\s)@[a-z0-9._]{3,}'
     OR raw_lower ~ '\m9[0-9]{4}[\s.-][0-9]{4}\M'
     OR raw_lower ~ '\m[0-9]{10,13}\M'
     OR raw_lower ~ '\([0-9]{2}\)\s*[0-9]{4,5}[\s.-]?[0-9]{4}\M'
     OR raw_lower ~ '\m[0-9]{2}\s[0-9]{4,5}[\s.-]?[0-9]{4}\M'
     OR normalized ~ ('\m(' || array_to_string(contact_words, '|') || ')\M') THEN
    RAISE EXCEPTION 'dados_de_contato' USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.validate_comment_content() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS check_comment_content ON public.experiment_comments;
CREATE TRIGGER check_comment_content
BEFORE INSERT OR UPDATE OF content ON public.experiment_comments
FOR EACH ROW EXECUTE FUNCTION public.validate_comment_content();

-- Contador de curtidas mantido pelo banco. As RPCs antigas deixavam a
-- mesma pessoa chamar increment_likes infinitas vezes após 1 curtida.
CREATE OR REPLACE FUNCTION public.sync_comment_likes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cid uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN cid := OLD.comment_id; ELSE cid := NEW.comment_id; END IF;
  UPDATE public.experiment_comments
     SET likes = (SELECT count(*) FROM public.comment_likes WHERE comment_id = cid)
   WHERE id = cid;
  RETURN NULL;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.sync_comment_likes() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS sync_comment_likes_trigger ON public.comment_likes;
CREATE TRIGGER sync_comment_likes_trigger
AFTER INSERT OR DELETE ON public.comment_likes
FOR EACH ROW EXECUTE FUNCTION public.sync_comment_likes();

-- RPCs antigas viram "recontagem" idempotente (compatível com versões antigas do front).
CREATE OR REPLACE FUNCTION public.increment_likes(comment_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  UPDATE public.experiment_comments c
     SET likes = (SELECT count(*) FROM public.comment_likes l WHERE l.comment_id = c.id)
   WHERE c.id = increment_likes.comment_id;
$$;
CREATE OR REPLACE FUNCTION public.decrement_likes(comment_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  UPDATE public.experiment_comments c
     SET likes = (SELECT count(*) FROM public.comment_likes l WHERE l.comment_id = c.id)
   WHERE c.id = decrement_likes.comment_id;
$$;
REVOKE EXECUTE ON FUNCTION public.increment_likes(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.decrement_likes(uuid) FROM PUBLIC, anon;

UPDATE public.experiment_comments c
   SET likes = (SELECT count(*) FROM public.comment_likes l WHERE l.comment_id = c.id);

-- Nome/foto só de quem comentou (antes qualquer logada consultava qualquer id).
CREATE OR REPLACE FUNCTION public.get_comment_user_info(user_ids uuid[])
RETURNS TABLE (id uuid, name text, profile_image text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.name, p.profile_image
  FROM public.profiles p
  WHERE p.id = ANY(user_ids[1:200])
    AND EXISTS (SELECT 1 FROM public.experiment_comments c WHERE c.user_id = p.id);
$$;
REVOKE EXECUTE ON FUNCTION public.get_comment_user_info(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_comment_user_info(uuid[]) TO authenticated;

-- ---------------------------------------------------------------------
-- 4. DENÚNCIAS DE COMENTÁRIOS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comment_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.experiment_comments(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text CHECK (reason IS NULL OR char_length(reason) <= 300),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  UNIQUE (comment_id, reporter_id)
);
ALTER TABLE public.comment_reports ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.comment_reports FROM anon;
REVOKE ALL ON public.comment_reports FROM authenticated;
GRANT SELECT ON public.comment_reports TO authenticated;
GRANT INSERT (comment_id, reporter_id, reason) ON public.comment_reports TO authenticated;

DROP POLICY IF EXISTS "Users can report comments" ON public.comment_reports;
CREATE POLICY "Users can report comments"
ON public.comment_reports FOR INSERT TO authenticated
WITH CHECK (reporter_id = auth.uid());

DROP POLICY IF EXISTS "Users see own reports, moderators see all" ON public.comment_reports;
CREATE POLICY "Users see own reports, moderators see all"
ON public.comment_reports FOR SELECT TO authenticated
USING (
  reporter_id = auth.uid()
  OR public.has_role(auth.uid(), 'moderator')
  OR public.has_role(auth.uid(), 'admin')
);

-- 3 denúncias abertas de pessoas diferentes ocultam o comentário
-- automaticamente até a moderação revisar.
CREATE OR REPLACE FUNCTION public.auto_hide_reported_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (SELECT count(*) FROM public.comment_reports
       WHERE comment_id = NEW.comment_id AND status = 'open') >= 3 THEN
    UPDATE public.experiment_comments SET hidden = true WHERE id = NEW.comment_id;
  END IF;
  RETURN NULL;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.auto_hide_reported_comment() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS auto_hide_reported_comment_trigger ON public.comment_reports;
CREATE TRIGGER auto_hide_reported_comment_trigger
AFTER INSERT ON public.comment_reports
FOR EACH ROW EXECUTE FUNCTION public.auto_hide_reported_comment();

-- Ação de moderação: 'restore' (reexibe e descarta denúncias) ou
-- 'hide' (oculta e marca denúncias como resolvidas).
CREATE OR REPLACE FUNCTION public.moderate_comment(_comment_id uuid, _action text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin')) THEN
    RAISE EXCEPTION 'sem_permissao' USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF _action = 'restore' THEN
    UPDATE public.experiment_comments SET hidden = false WHERE id = _comment_id;
    UPDATE public.comment_reports
       SET status = 'dismissed', resolved_by = auth.uid(), resolved_at = now()
     WHERE comment_id = _comment_id AND status = 'open';
  ELSIF _action = 'hide' THEN
    UPDATE public.experiment_comments SET hidden = true WHERE id = _comment_id;
    UPDATE public.comment_reports
       SET status = 'resolved', resolved_by = auth.uid(), resolved_at = now()
     WHERE comment_id = _comment_id AND status = 'open';
  ELSE
    RAISE EXCEPTION 'acao_invalida' USING ERRCODE = 'invalid_parameter_value';
  END IF;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.moderate_comment(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.moderate_comment(uuid, text) TO authenticated;

-- ---------------------------------------------------------------------
-- 5. PROGRESSO: impede "setar" pontos/nível arbitrários com uma chamada.
-- (Anti-trapaça completo exige pontuação calculada no servidor — ver roadmap.)
-- ---------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE ON public.user_progress FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.completed_lessons FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.completed_modules FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.completed_experiments FROM anon;

CREATE OR REPLACE FUNCTION public.validate_progress()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.stem_area NOT IN ('science','technology','engineering','math') THEN
    RAISE EXCEPTION 'area_invalida' USING ERRCODE = 'check_violation';
  END IF;
  IF TG_OP = 'INSERT' THEN
    IF coalesce(NEW.points, 0) <> 0 OR coalesce(NEW.level, 1) <> 1 OR coalesce(NEW.current_lesson, 1) <> 1 THEN
      RAISE EXCEPTION 'progresso_invalido' USING ERRCODE = 'check_violation';
    END IF;
  ELSE
    IF NEW.user_id <> OLD.user_id OR NEW.stem_area <> OLD.stem_area
       OR NEW.points - OLD.points NOT BETWEEN 0 AND 250
       OR NEW.level - OLD.level NOT BETWEEN 0 AND 1
       OR NEW.current_lesson < 1 OR NEW.current_lesson > 500 THEN
      RAISE EXCEPTION 'progresso_invalido' USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.validate_progress() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS validate_progress_trigger ON public.user_progress;
CREATE TRIGGER validate_progress_trigger
BEFORE INSERT OR UPDATE ON public.user_progress
FOR EACH ROW EXECUTE FUNCTION public.validate_progress();

-- ---------------------------------------------------------------------
-- 6. PAPÉIS: nunca remover a última administradora (evita perder o painel).
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_last_admin_removal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.role = 'admin' AND (TG_OP = 'DELETE' OR NEW.role <> 'admin') THEN
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin' AND id <> OLD.id) THEN
      RAISE EXCEPTION 'ultima_admin' USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.prevent_last_admin_removal() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS prevent_last_admin_removal_trigger ON public.user_roles;
CREATE TRIGGER prevent_last_admin_removal_trigger
BEFORE UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.prevent_last_admin_removal();

REVOKE ALL ON public.user_roles FROM anon;

-- ---------------------------------------------------------------------
-- 7. STORAGE: limita tipo/tamanho (bloqueia SVG/HTML, que permitem XSS)
-- e permite à usuária listar a PRÓPRIA pasta (necessário para trocar e
-- apagar a foto ao excluir a conta).
-- ---------------------------------------------------------------------
UPDATE storage.buckets
   SET file_size_limit = 2097152,
       allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp']
 WHERE id = 'profile-images';

UPDATE storage.buckets
   SET file_size_limit = 5242880,
       allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif']
 WHERE id = 'content-images';

DROP POLICY IF EXISTS "Users can view their own profile image folder" ON storage.objects;
CREATE POLICY "Users can view their own profile image folder"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ---------------------------------------------------------------------
-- 8. LGPD: a titular pode excluir a própria conta e todos os dados.
-- (As imagens do storage são apagadas pelo front antes, via Storage API.)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'nao_autenticada' USING ERRCODE = 'insufficient_privilege';
  END IF;
  -- ON DELETE CASCADE remove perfil, progresso, comentários, curtidas, papéis e denúncias.
  DELETE FROM auth.users WHERE id = uid;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.delete_my_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;
