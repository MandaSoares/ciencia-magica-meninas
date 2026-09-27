# Migrar do Lovable Cloud para um projeto Supabase próprio

Tempo estimado: 40–60 min. Nada é apagado do Lovable: ele continua como backup até o fim.

## 1. Criar o projeto
1. supabase.com → **New project** → organização `MandaSoares's Org`.
2. Nome: `conscientistas`. Senha do banco: gere uma forte e guarde num gerenciador de senhas.
3. Região: **South America (São Paulo)**.
4. Anote o **Project ref** (o código no endereço: `supabase.com/dashboard/project/<REF>`).

O plano grátis permite poucos projetos ativos; se reclamar do limite, apague o projeto pausado antigo (`uboezrtcztmpghahuwad`), que não é usado pelo site.

## 2. Aplicar o banco (migrations)
No terminal, dentro da pasta do repositório:

```bash
npx supabase login
npx supabase link --project-ref <REF>
npx supabase db push
```

Sem terminal: SQL editor do projeto novo → cole e rode cada arquivo de `supabase/migrations/` **em ordem de nome**.

## 3. Configurar login e emails
Edite a primeira linha de `supabase/config.toml` para `project_id = "<REF>"` e rode:

```bash
npx supabase config push
```

Isso aplica Site URL, Redirect URLs, confirmação de email, código de 6 dígitos e os templates em português.
Confira no painel: **Authentication → URL Configuration** e **Authentication → Emails**.

Pelo painel (sem CLI):
- URL Configuration → Site URL `https://ciencia-magica-meninas.vercel.app`; Redirect URLs `https://ciencia-magica-meninas.vercel.app/**` e `http://localhost:8080/**`
- Emails → Templates → Confirm signup: `supabase/templates/confirmation.html`; Reset password: `supabase/templates/recovery.html`
- Sign In / Providers → Email: Confirm email ligado; OTP length 6; OTP expiration 3600; senha mínima 8 com maiúscula, minúscula e número

## 4. Copiar o conteúdo do Lovable
1. Lovable → Cloud → SQL editor → rode `scripts/1_exportar_conteudo.sql` → copie o JSON da célula `dados`.
2. Supabase novo → SQL editor → abra `scripts/2_importar_conteudo.sql`, troque `COLE_AQUI` pelo JSON e rode.
3. A última consulta lista itens com imagem do projeto antigo: reenvie essas imagens pelo painel admin.

Contas de usuárias **não** são copiadas (senhas ficam no projeto antigo). Cada pessoa se cadastra de novo.

## 5. Apontar o site para o projeto novo (Vercel)
Supabase → **Project Settings → API Keys**: copie a chave **publishable** (ou `anon`). Nunca use a `service_role`/secret no site.

Vercel → projeto → **Settings → Environment Variables** (Production, Preview e Development):

| Nome | Valor |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://<REF>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | a chave publishable/anon |
| `VITE_SUPABASE_PROJECT_ID` | `<REF>` |

Depois: **Deployments → ⋯ → Redeploy**. Atualize também o `.env` do repositório com os mesmos valores.

## 6. Criar a conta de admin
1. Cadastre `amanda_silvasoares@hotmail.com` pelo site e confirme o código.
2. SQL editor:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'amanda_silvasoares@hotmail.com'
on conflict do nothing;
```

## 7. Email de verdade (antes de abrir para o público)
O envio padrão do Supabase é só para testes (pouquíssimos emails por hora, entrega limitada).
Configure SMTP em **Authentication → Emails → SMTP Settings** com Resend ou Brevo. O Resend exige um domínio próprio (ex.: `conscientistas.com.br`).

## 8. Desligar o Lovable
Só depois que tudo funcionar:
- Lovable → projeto → **Settings → GitHub → Disconnect** (evita que o Lovable envie commits ao repositório).
- Mantenha o projeto no Lovable por algumas semanas como backup; depois pode excluir.

## 9. Teste final
- [ ] Cadastro → código chega → entra no app
- [ ] Sair → entrar de novo
- [ ] Esqueci minha senha → código → nova senha
- [ ] Completar uma lição → XP e 🔥 aparecem
- [ ] Conta admin vê o Painel Admin; conta de estudante não
