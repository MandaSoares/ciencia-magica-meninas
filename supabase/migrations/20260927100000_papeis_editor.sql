-- =====================================================================
-- Três perfis de acesso:
--   estudante (sem linha em user_roles) → faz os cursos
--   editor  → cria/edita conteúdo (trilhas, módulos, experimentos,
--             carreiras, blog) e modera comentários
--   admin   → tudo do editor + gerencia pessoas (convida, muda papel, remove)
-- O papel "moderator" passa a se chamar "editor".
-- =====================================================================

-- 1. Renomeia o papel (policies já existentes continuam valendo: elas guardam o valor, não o texto)
ALTER TYPE public.app_role RENAME VALUE 'moderator' TO 'editor';

-- Um papel por pessoa: remove duplicados, mantendo o mais alto
DELETE FROM public.user_roles r
USING public.user_roles r2
WHERE r.user_id = r2.user_id
  AND r.id <> r2.id
  AND (CASE r.role WHEN 'admin' THEN 3 WHEN 'editor' THEN 2 ELSE 1 END)
    < (CASE r2.role WHEN 'admin' THEN 3 WHEN 'editor' THEN 2 ELSE 1 END);
DELETE FROM public.user_roles WHERE role = 'user';

-- 2. Função auxiliar: é equipe (admin ou editor)?
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'editor')
  )
$$;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated;

-- 3. Editores podem criar, editar e apagar conteúdo
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['learning_path_content','modules_content','experiments_content','career_areas_content']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Editors can insert %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Editors can update %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Editors can delete %1$s" ON public.%1$I', t);
    EXECUTE format('CREATE POLICY "Editors can insert %1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''editor''))', t);
    EXECUTE format('CREATE POLICY "Editors can update %1$s" ON public.%1$I FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''editor''))', t);
    EXECUTE format('CREATE POLICY "Editors can delete %1$s" ON public.%1$I FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''editor''))', t);
  END LOOP;
END $$;

-- Blog: editores editam e apagam qualquer post (antes só os próprios / só admin apagava)
DROP POLICY IF EXISTS "Editors can update any blog post" ON public.blog_posts;
CREATE POLICY "Editors can update any blog post"
ON public.blog_posts FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'editor'));

DROP POLICY IF EXISTS "Editors can delete blog posts" ON public.blog_posts;
CREATE POLICY "Editors can delete blog posts"
ON public.blog_posts FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'editor'));

-- 4. Moderação de comentários usa o novo nome do papel
CREATE OR REPLACE FUNCTION public.moderate_comment(_comment_id uuid, _action text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
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

-- 5. Convites para a equipe
-- A admin convida um email como editor ou admin. Se a pessoa já tem conta,
-- o papel vale na hora; se não, vale assim que ela se cadastrar com esse email.
CREATE TABLE IF NOT EXISTS public.staff_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (email = lower(btrim(email)) AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  role public.app_role NOT NULL CHECK (role IN ('admin', 'editor')),
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz
);
ALTER TABLE public.staff_invites ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.staff_invites FROM anon, authenticated;
GRANT SELECT, DELETE ON public.staff_invites TO authenticated;

DROP POLICY IF EXISTS "Admins manage invites" ON public.staff_invites;
DROP POLICY IF EXISTS "Admins view invites" ON public.staff_invites;
CREATE POLICY "Admins view invites" ON public.staff_invites
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins delete invites" ON public.staff_invites;
CREATE POLICY "Admins delete invites" ON public.staff_invites
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Define o papel de uma pessoa (admin apenas). 'user' = estudante (sem papel).
CREATE OR REPLACE FUNCTION public.set_user_role(_user_id uuid, _role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'sem_permissao' USING ERRCODE = 'insufficient_privilege';
  END IF;
  IF _role NOT IN ('user', 'editor', 'admin') THEN
    RAISE EXCEPTION 'papel_invalido' USING ERRCODE = 'invalid_parameter_value';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = _user_id) THEN
    RAISE EXCEPTION 'usuario_nao_encontrado' USING ERRCODE = 'no_data_found';
  END IF;

  -- Promove primeiro e só depois remove o papel antigo, para o gatilho
  -- de "última admin" enxergar a situação final corretamente.
  IF _role <> 'user' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, _role::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  DELETE FROM public.user_roles
   WHERE user_id = _user_id AND (_role = 'user' OR role <> _role::public.app_role);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.set_user_role(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_user_role(uuid, text) TO authenticated;

-- Convida (ou promove, se a conta já existir)
CREATE OR REPLACE FUNCTION public.invite_staff(_email text, _role text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_email text := lower(btrim(_email));
  existing uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'sem_permissao' USING ERRCODE = 'insufficient_privilege';
  END IF;
  IF _role NOT IN ('editor', 'admin') THEN
    RAISE EXCEPTION 'papel_invalido' USING ERRCODE = 'invalid_parameter_value';
  END IF;
  IF clean_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'email_invalido' USING ERRCODE = 'invalid_parameter_value';
  END IF;

  SELECT id INTO existing FROM auth.users WHERE lower(email) = clean_email;

  IF existing IS NOT NULL THEN
    PERFORM public.set_user_role(existing, _role);
    INSERT INTO public.staff_invites (email, role, invited_by, accepted_at)
    VALUES (clean_email, _role::public.app_role, auth.uid(), now())
    ON CONFLICT (email) DO UPDATE
      SET role = EXCLUDED.role, invited_by = EXCLUDED.invited_by, accepted_at = now(), created_at = now();
    RETURN 'promovida';
  END IF;

  INSERT INTO public.staff_invites (email, role, invited_by)
  VALUES (clean_email, _role::public.app_role, auth.uid())
  ON CONFLICT (email) DO UPDATE
    SET role = EXCLUDED.role, invited_by = EXCLUDED.invited_by, accepted_at = NULL, created_at = now();
  RETURN 'convidada';
END;
$$;
REVOKE EXECUTE ON FUNCTION public.invite_staff(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.invite_staff(text, text) TO authenticated;

-- Remove uma pessoa da plataforma (admin apenas; não remove a si mesma)
CREATE OR REPLACE FUNCTION public.admin_remove_user(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'sem_permissao' USING ERRCODE = 'insufficient_privilege';
  END IF;
  IF _user_id = auth.uid() THEN
    RAISE EXCEPTION 'nao_pode_remover_a_si_mesma' USING ERRCODE = 'check_violation';
  END IF;
  DELETE FROM auth.users WHERE id = _user_id;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.admin_remove_user(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_remove_user(uuid) TO authenticated;

-- Cadastro: aplica convite pendente para o email
CREATE OR REPLACE FUNCTION public.apply_staff_invite()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv public.staff_invites%ROWTYPE;
BEGIN
  SELECT * INTO inv FROM public.staff_invites
   WHERE email = lower(NEW.email) AND accepted_at IS NULL;
  IF FOUND THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, inv.role)
    ON CONFLICT (user_id, role) DO NOTHING;
    UPDATE public.staff_invites SET accepted_at = now() WHERE id = inv.id;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.apply_staff_invite() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created_apply_invite ON auth.users;
CREATE TRIGGER on_auth_user_created_apply_invite
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.apply_staff_invite();

-- Escrita direta em user_roles fica só pelas funções acima
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated;
