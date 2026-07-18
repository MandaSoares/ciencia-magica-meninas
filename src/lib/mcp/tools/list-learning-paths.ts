import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function db(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_learning_paths",
  title: "Listar trilhas de aprendizagem",
  description:
    "Lista as trilhas de aprendizagem (learning paths) do app, opcionalmente filtradas por área STEM (science, technology, engineering, math).",
  inputSchema: {
    stem_area: z
      .enum(["science", "technology", "engineering", "math"])
      .optional()
      .describe("Filtra por área STEM."),
    limit: z.number().int().min(1).max(100).optional().describe("Máximo de itens (padrão 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ stem_area, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    let q = db(ctx).from("learning_path_content").select("*").order("sort_order", { ascending: true });
    if (stem_area) q = q.eq("stem_area", stem_area);
    q = q.limit(limit ?? 50);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { items: data ?? [] },
    };
  },
});