-- Rodar no SQL editor do projeto ANTIGO (Lovable Cloud → Cloud → SQL editor).
-- Resultado: uma célula com um JSON. Copie o valor inteiro.
select json_build_object(
  'career_areas_content',  (select coalesce(json_agg(t), '[]') from public.career_areas_content t),
  'experiments_content',   (select coalesce(json_agg(t), '[]') from public.experiments_content t),
  'learning_path_content', (select coalesce(json_agg(t), '[]') from public.learning_path_content t),
  'modules_content',       (select coalesce(json_agg(t), '[]') from public.modules_content t),
  'blog_posts',            (select coalesce(json_agg(t), '[]') from public.blog_posts t)
)::text as dados;
