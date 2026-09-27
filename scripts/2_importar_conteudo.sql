-- Rodar no SQL editor do projeto NOVO, depois de aplicar as migrations.
-- Substitua COLE_AQUI pelo JSON copiado no passo de exportação.
-- Não precisa mexer em aspas: o texto fica entre $json$ ... $json$.
begin;

create temp table _import (j jsonb) on commit drop;
insert into _import values ($json$COLE_AQUI$json$);

insert into public.career_areas_content
select * from jsonb_populate_recordset(null::public.career_areas_content, (select j->'career_areas_content' from _import))
on conflict do nothing;

insert into public.experiments_content
select * from jsonb_populate_recordset(null::public.experiments_content, (select j->'experiments_content' from _import))
on conflict do nothing;

insert into public.learning_path_content
select * from jsonb_populate_recordset(null::public.learning_path_content, (select j->'learning_path_content' from _import))
on conflict do nothing;

insert into public.modules_content
select * from jsonb_populate_recordset(null::public.modules_content, (select j->'modules_content' from _import))
on conflict do nothing;

-- Posts do blog: a autora vira "sem vínculo" (as contas são recriadas no projeto novo)
insert into public.blog_posts
select * from jsonb_populate_recordset(
  null::public.blog_posts,
  (select jsonb_agg(e - 'author_id') from _import, jsonb_array_elements(j->'blog_posts') e)
)
on conflict do nothing;

commit;

-- Conferência
select 'career_areas_content' tabela, count(*) from public.career_areas_content
union all select 'experiments_content', count(*) from public.experiments_content
union all select 'learning_path_content', count(*) from public.learning_path_content
union all select 'modules_content', count(*) from public.modules_content
union all select 'blog_posts', count(*) from public.blog_posts;

-- Imagens que ainda apontam para o projeto antigo (reenviar pelo painel admin)
select 'experiments_content' tabela, id from public.experiments_content where row_to_json(experiments_content)::text like '%pocdgiysxjipmlmyzfhd%'
union all select 'career_areas_content', id from public.career_areas_content where row_to_json(career_areas_content)::text like '%pocdgiysxjipmlmyzfhd%'
union all select 'modules_content', id from public.modules_content where row_to_json(modules_content)::text like '%pocdgiysxjipmlmyzfhd%'
union all select 'learning_path_content', id from public.learning_path_content where row_to_json(learning_path_content)::text like '%pocdgiysxjipmlmyzfhd%';
