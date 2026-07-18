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
  name: "list_blog_posts",
  title: "Listar posts do blog",
  description: "Lista posts publicados do blog do app, do mais recente para o mais antigo.",
  inputSchema: {
    category: z.string().optional().describe("Filtra por categoria."),
    limit: z.number().int().min(1).max(50).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    let q = db(ctx)
      .from("blog_posts")
      .select("id,title,excerpt,category,author_name,emoji,read_time,cover_image,published,created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (category) q = q.eq("category", category);
    q = q.limit(limit ?? 20);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { items: data ?? [] },
    };
  },
});