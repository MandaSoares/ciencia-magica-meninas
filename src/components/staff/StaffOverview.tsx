import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BookOpen, Briefcase, FlaskConical, Map, MessageSquare, Newspaper, Plus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AREAS, areaByStem } from "./areas";
import { Lumi } from "@/components/Lumi";
import type { StaffSection } from "./StaffWorkspace";

type Table = "learning_path_content" | "modules_content" | "experiments_content" | "career_areas_content";

const CONTENT: { table: Table; section: StaffSection; label: string; icon: typeof Map; color: string }[] = [
  { table: "learning_path_content", section: "trilhas", label: "Níveis de trilha", icon: Map, color: "from-fuchsia-400 to-violet-500" },
  { table: "modules_content", section: "modulos", label: "Módulos", icon: BookOpen, color: "from-blue-500 to-indigo-500" },
  { table: "experiments_content", section: "laboratorio", label: "Experimentos", icon: FlaskConical, color: "from-emerald-500 to-teal-500" },
  { table: "career_areas_content", section: "carreiras", label: "Carreiras", icon: Briefcase, color: "from-orange-500 to-amber-500" },
];

const count = async (query: PromiseLike<{ count: number | null }>) => (await query).count ?? 0;

export const StaffOverview = ({
  isAdmin,
  userName,
  onNavigate,
}: {
  isAdmin: boolean;
  userName: string;
  onNavigate: (s: StaffSection) => void;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["staff-overview", isAdmin],
    queryFn: async () => {
      const perArea = await Promise.all(
        CONTENT.map(async (c) => {
          const { data } = await supabase.from(c.table).select("stem_area");
          const byArea: Record<string, number> = {};
          ((data || []) as { stem_area: string }[]).forEach((r) => {
            byArea[r.stem_area] = (byArea[r.stem_area] || 0) + 1;
          });
          return { table: c.table, total: (data || []).length, byArea };
        })
      );

      const [women, blog, comments, hidden, reports] = await Promise.all([
        supabase.from("career_areas_content").select("women"),
        count(supabase.from("blog_posts").select("id", { count: "exact", head: true })),
        count(supabase.from("experiment_comments").select("id", { count: "exact", head: true })),
        count(supabase.from("experiment_comments").select("id", { count: "exact", head: true }).eq("hidden", true)),
        count(supabase.from("comment_reports" as never).select("id", { count: "exact", head: true }).eq("status", "open")),
      ]);

      const womenCount = ((women.data || []) as { women: unknown }[]).reduce(
        (sum, r) => sum + (Array.isArray(r.women) ? r.women.length : 0),
        0
      );

      let people: { students: number; staff: number } | null = null;
      if (isAdmin) {
        const [profiles, roles] = await Promise.all([
          count(supabase.from("profiles").select("id", { count: "exact", head: true })),
          supabase.from("user_roles").select("user_id"),
        ]);
        const staff = new Set(((roles.data || []) as { user_id: string }[]).map((r) => r.user_id)).size;
        people = { students: Math.max(0, profiles - staff), staff };
      }

      const { data: recent } = await supabase
        .from("experiment_comments")
        .select("id, content, created_at, user_id, hidden")
        .order("created_at", { ascending: false })
        .limit(5);

      return { perArea, blog, comments, hidden, reports, womenCount, people, recent: recent || [] };
    },
  });

  const firstName = userName.split(" ")[0];
  const pending = (data?.reports || 0) + (data?.hidden || 0);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-500 p-6 sm:p-8 text-white shadow-xl shadow-pink-300/40 dark:shadow-none">
        <div aria-hidden className="stem-doodles absolute inset-0 opacity-20 mix-blend-overlay" />
        <div aria-hidden className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex items-center gap-5">
          <Lumi size={96} mood="cheer" className="hidden shrink-0 drop-shadow-lg sm:block" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-medium uppercase tracking-widest text-white/80">Painel da equipe</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Olá, {firstName}! 👋</h2>
            <p className="mt-1 text-white/90">O que vamos criar hoje para as meninas?</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {([
                ["trilhas", "Nova lição"],
                ["laboratorio", "Novo experimento"],
                ["blog", "Novo post"],
              ] as [StaffSection, string][]).map(([s, label]) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onNavigate(s)}
                  style={{ ["--btn-shadow" as string]: "#fbcfe8" }}
                  className="btn-3d inline-flex h-10 items-center gap-1.5 rounded-xl bg-white px-4 font-display text-sm font-bold text-pink-600"
                >
                  <Plus className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {pending > 0 && (
        <button
          type="button"
          onClick={() => onNavigate("comentarios")}
          className="w-full flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left transition hover:bg-amber-100 dark:border-amber-900/60 dark:bg-amber-950/30 dark:hover:bg-amber-950/50"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="text-sm text-amber-900 dark:text-amber-200">
            <strong>{data?.reports || 0} denúncia(s) aberta(s)</strong> e <strong>{data?.hidden || 0} comentário(s) oculto(s)</strong> aguardando revisão.
          </span>
          <span className="ml-auto text-sm font-semibold text-amber-700 dark:text-amber-300">Revisar →</span>
        </button>
      )}

      {/* Conteúdo */}
      <section>
        <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-pink-500">Conteúdo</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {CONTENT.map((c) => {
            const stats = data?.perArea.find((p) => p.table === c.table);
            const Icon = c.icon;
            return (
              <button
                key={c.table}
                type="button"
                onClick={() => onNavigate(c.section)}
                className="group rounded-3xl border-2 border-pink-100 bg-white/90 p-5 text-left shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-100 dark:border-white/10 dark:bg-white/[0.04] dark:hover:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-display text-4xl font-bold text-gray-900 dark:text-white">{isLoading ? "–" : stats?.total ?? 0}</span>
                </div>
                <p className="mt-3 font-semibold text-gray-800 dark:text-gray-100">
                  {c.label}
                  {c.table === "career_areas_content" && data ? (
                    <span className="block text-xs font-normal text-gray-500">{data.womenCount} mulheres inspiradoras</span>
                  ) : null}
                </p>
                <div className="mt-3 flex gap-1.5">
                  {AREAS.map((a) => (
                    <span
                      key={a.key}
                      title={`${a.label}: ${stats?.byArea[a.stem] || 0}`}
                      className="flex-1 rounded-lg bg-pink-50/80 py-1 text-center text-xs font-semibold text-gray-600 dark:bg-white/5 dark:text-gray-300"
                    >
                      {a.emoji} {stats?.byArea[a.stem] || 0}
                    </span>
                  ))}
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-pink-600 opacity-0 transition group-hover:opacity-100 dark:text-pink-300">
                  <Plus className="w-4 h-4" /> Gerenciar
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Comunidade */}
        <section className="lg:col-span-2 rounded-3xl border-2 border-pink-100 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-pink-500" /> Últimos comentários
            </h3>
            <button type="button" onClick={() => onNavigate("comentarios")} className="text-sm font-semibold text-pink-600 hover:underline dark:text-pink-300">
              Ver todos ({data?.comments ?? 0})
            </button>
          </div>
          {data && data.recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">Nenhum comentário ainda.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {(data?.recent || []).map((c) => (
                <li key={c.id} className="py-3 flex items-start gap-3">
                  <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${c.hidden ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{c.content}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(c.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                      {c.hidden ? " · oculto" : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Blog e pessoas */}
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => onNavigate("blog")}
            className="w-full rounded-3xl border-2 border-pink-100 bg-white/90 p-5 text-left shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-pink-300 dark:border-white/10 dark:bg-white/[0.04]"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{data?.blog ?? "–"}</p>
                <p className="text-sm text-gray-500">posts no blog</p>
              </div>
            </div>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => onNavigate("pessoas")}
              className="w-full rounded-3xl border-2 border-pink-100 bg-white/90 p-5 text-left shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-pink-300 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{data?.people?.students ?? "–"}</p>
                  <p className="text-sm text-gray-500">estudantes · {data?.people?.staff ?? 0} na equipe</p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export { areaByStem };
