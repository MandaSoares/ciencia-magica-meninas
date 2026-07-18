import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";

function db(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "get_my_progress",
  title: "Ver meu progresso",
  description:
    "Retorna o progresso da usuária autenticada: perfil, pontos/nível por área STEM, lições, módulos e experimentos concluídos.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const client = db(ctx);
    const userId = ctx.getUserId();
    const [profile, progress, lessons, modules, experiments] = await Promise.all([
      client.from("profiles").select("id,name,email,age,interests").eq("id", userId).maybeSingle(),
      client.from("user_progress").select("*").eq("user_id", userId),
      client.from("completed_lessons").select("*").eq("user_id", userId),
      client.from("completed_modules").select("*").eq("user_id", userId),
      client.from("completed_experiments").select("*").eq("user_id", userId),
    ]);
    const payload = {
      profile: profile.data,
      progress_by_area: progress.data ?? [],
      completed_lessons: lessons.data ?? [],
      completed_modules: modules.data ?? [],
      completed_experiments: experiments.data ?? [],
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  },
});