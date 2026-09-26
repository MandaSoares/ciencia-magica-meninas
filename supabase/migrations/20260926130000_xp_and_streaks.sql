-- =====================================================================
-- XP calculado no servidor + sequência de dias (streak)
-- O navegador só informa O QUE a usuária fez (tipo + referência).
-- O banco decide quantos pontos vale, impede repetir a mesma atividade,
-- aplica teto diário e atualiza a sequência de dias.
-- Depende de 20260926120000_security_hardening.sql.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tabelas
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.xp_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stem_area text NOT NULL CHECK (stem_area IN ('science','technology','engineering','math')),
  kind text NOT NULL,
  ref text NOT NULL CHECK (char_length(ref) BETWEEN 1 AND 120),
  xp integer NOT NULL CHECK (xp >= 0),
  day date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, stem_area, kind, ref)
);
CREATE INDEX IF NOT EXISTS xp_events_user_day_idx ON public.xp_events (user_id, day);

CREATE TABLE IF NOT EXISTS public.user_streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak integer NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
  last_activity_date date,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- Somente leitura dos próprios dados; escrita só pela função award_activity.
REVOKE ALL ON public.xp_events FROM anon, authenticated;
REVOKE ALL ON public.user_streaks FROM anon, authenticated;
GRANT SELECT ON public.xp_events TO authenticated;
GRANT SELECT ON public.user_streaks TO authenticated;

DROP POLICY IF EXISTS "Users view own xp events" ON public.xp_events;
CREATE POLICY "Users view own xp events" ON public.xp_events
FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users view own streak" ON public.user_streaks;
CREATE POLICY "Users view own streak" ON public.user_streaks
FOR SELECT TO authenticated USING (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- 2. Progresso e conclusões deixam de ser graváveis pelo navegador
-- (a linha inicial de user_progress ainda pode ser criada, com zeros).
-- ---------------------------------------------------------------------
REVOKE UPDATE, DELETE ON public.user_progress FROM authenticated;
REVOKE INSERT ON public.completed_lessons FROM authenticated;
REVOKE INSERT ON public.completed_modules FROM authenticated;
REVOKE INSERT ON public.completed_experiments FROM authenticated;

-- Exclusão de conta continua apagando tudo via ON DELETE CASCADE.

-- ---------------------------------------------------------------------
-- 3. Dia de referência: fuso de Brasília (a meia-noite da usuária).
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.local_today()
RETURNS date
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT (now() AT TIME ZONE 'America/Sao_Paulo')::date;
$$;

-- ---------------------------------------------------------------------
-- 4. Registrar atividade
-- kind:
--   lesson            ref = número do nível da trilha     XP = pontos do nível
--   module_start      ref = id do módulo                  20
--   module_step       ref = "<modulo>:<indice>"           30
--   module            ref = id do módulo (conclusão)      200 + sobe 1 nível
--   experiment_start  ref = id do experimento             30
--   experiment_step   ref = "<experimento>:<passo>"       20
--   experiment        ref = id do experimento (conclusão) 100 + sobe 1 nível
--   scientist         ref = id da cientista               25
--   career            ref = id da carreira                15
--   woman             ref = "<carreira>:<nome>"           20
-- Cada (área, kind, ref) rende XP uma única vez. Teto: 2000 XP por dia.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.award_activity(_stem_area text, _kind text, _ref text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  today date := public.local_today();
  daily_cap constant integer := 2000;
  base_xp integer;
  today_xp integer;
  granted integer := 0;
  inserted_id uuid;
  lesson_no integer;
  s public.user_streaks%ROWTYPE;
  p public.user_progress%ROWTYPE;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'nao_autenticada' USING ERRCODE = 'insufficient_privilege';
  END IF;
  IF _stem_area NOT IN ('science','technology','engineering','math') THEN
    RAISE EXCEPTION 'area_invalida' USING ERRCODE = 'invalid_parameter_value';
  END IF;
  _ref := btrim(coalesce(_ref, ''));
  IF _ref !~ '^[A-Za-z0-9_.:\- ]{1,120}$' THEN
    RAISE EXCEPTION 'referencia_invalida' USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- XP definido pelo servidor
  IF _kind = 'lesson' THEN
    IF _ref !~ '^[0-9]{1,3}$' THEN
      RAISE EXCEPTION 'referencia_invalida' USING ERRCODE = 'invalid_parameter_value';
    END IF;
    lesson_no := _ref::integer;
    IF lesson_no < 1 OR lesson_no > 100 THEN
      RAISE EXCEPTION 'referencia_invalida' USING ERRCODE = 'invalid_parameter_value';
    END IF;
    SELECT least(greatest(coalesce(lc.points, 0), 10), 100) INTO base_xp
      FROM public.learning_path_content lc
     WHERE lc.stem_area = _stem_area AND lc.level_number = lesson_no;
    base_xp := coalesce(base_xp, least(25 + 5 * lesson_no, 100));
  ELSE
    base_xp := CASE _kind
      WHEN 'module_start' THEN 20
      WHEN 'module_step' THEN 30
      WHEN 'module' THEN 200
      WHEN 'experiment_start' THEN 30
      WHEN 'experiment_step' THEN 20
      WHEN 'experiment' THEN 100
      WHEN 'scientist' THEN 25
      WHEN 'career' THEN 15
      WHEN 'woman' THEN 20
    END;
    IF base_xp IS NULL THEN
      RAISE EXCEPTION 'tipo_invalido' USING ERRCODE = 'invalid_parameter_value';
    END IF;
  END IF;

  -- Serializa as chamadas da mesma usuária (evita corrida no teto diário/streak)
  PERFORM pg_advisory_xact_lock(hashtextextended(uid::text, 42));

  SELECT coalesce(sum(xp), 0) INTO today_xp
    FROM public.xp_events WHERE user_id = uid AND day = today;
  granted := greatest(0, least(base_xp, daily_cap - today_xp));

  INSERT INTO public.xp_events (user_id, stem_area, kind, ref, xp, day)
  VALUES (uid, _stem_area, _kind, _ref, granted, today)
  ON CONFLICT (user_id, stem_area, kind, ref) DO NOTHING
  RETURNING id INTO inserted_id;

  IF inserted_id IS NULL THEN
    granted := 0;  -- atividade já registrada antes
  ELSE
    -- Conclusões (mantém as tabelas usadas pelo resto do app)
    IF _kind = 'lesson' THEN
      INSERT INTO public.completed_lessons (user_id, stem_area, lesson_id)
      VALUES (uid, _stem_area, lesson_no) ON CONFLICT DO NOTHING;
    ELSIF _kind = 'module' THEN
      INSERT INTO public.completed_modules (user_id, stem_area, module_id)
      VALUES (uid, _stem_area, _ref) ON CONFLICT DO NOTHING;
    ELSIF _kind = 'experiment' THEN
      INSERT INTO public.completed_experiments (user_id, stem_area, experiment_id)
      VALUES (uid, _stem_area, _ref) ON CONFLICT DO NOTHING;
    END IF;

    -- Pontos e nível da área
    INSERT INTO public.user_progress (user_id, stem_area)
    VALUES (uid, _stem_area) ON CONFLICT (user_id, stem_area) DO NOTHING;

    UPDATE public.user_progress
       SET points = points + granted,
           level = level + CASE WHEN _kind IN ('module', 'experiment') THEN 1 ELSE 0 END,
           current_lesson = CASE WHEN _kind = 'lesson'
                                 THEN greatest(current_lesson, lesson_no + 1)
                                 ELSE current_lesson END
     WHERE user_id = uid AND stem_area = _stem_area;

    -- Sequência de dias: qualquer atividade nova conta o dia
    INSERT INTO public.user_streaks (user_id) VALUES (uid) ON CONFLICT DO NOTHING;
    SELECT * INTO s FROM public.user_streaks WHERE user_id = uid;
    IF s.last_activity_date IS DISTINCT FROM today THEN
      IF s.last_activity_date = today - 1 THEN
        s.current_streak := s.current_streak + 1;
      ELSE
        s.current_streak := 1;
      END IF;
      UPDATE public.user_streaks
         SET current_streak = s.current_streak,
             longest_streak = greatest(longest_streak, s.current_streak),
             last_activity_date = today,
             updated_at = now()
       WHERE user_id = uid;
    END IF;
  END IF;

  SELECT * INTO p FROM public.user_progress WHERE user_id = uid AND stem_area = _stem_area;

  RETURN jsonb_build_object(
    'awarded', granted,
    'already_done', inserted_id IS NULL,
    'daily_cap_reached', inserted_id IS NOT NULL AND granted < base_xp,
    'points', coalesce(p.points, 0),
    'level', coalesce(p.level, 1),
    'current_lesson', coalesce(p.current_lesson, 1)
  ) || public.get_my_streak();
END;
$$;

-- ---------------------------------------------------------------------
-- 5. Sequência atual (0 se ela pulou um dia) + XP de hoje
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_my_streak()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'streak', CASE
                WHEN s.last_activity_date >= public.local_today() - 1 THEN s.current_streak
                ELSE 0
              END,
    'longest_streak', coalesce(s.longest_streak, 0),
    'studied_today', coalesce(s.last_activity_date = public.local_today(), false),
    'today_xp', (SELECT coalesce(sum(xp), 0) FROM public.xp_events
                  WHERE user_id = auth.uid() AND day = public.local_today())
  )
  FROM (SELECT auth.uid() AS uid) u
  LEFT JOIN public.user_streaks s ON s.user_id = u.uid;
$$;

REVOKE EXECUTE ON FUNCTION public.award_activity(text, text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_my_streak() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.local_today() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.award_activity(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_streak() TO authenticated;
GRANT EXECUTE ON FUNCTION public.local_today() TO authenticated;
