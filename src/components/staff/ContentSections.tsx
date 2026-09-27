import { ReactNode, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AREAS, AreaKey, plainText } from "./areas";

import { useLearningPathContent, PathLevel } from "@/hooks/useLearningPathContent";
import { useModulesContent, Module } from "@/hooks/useModulesContent";
import { useExperimentsContent, Experiment } from "@/hooks/useExperimentsContent";
import { useCareerAreasContent, Career } from "@/hooks/useCareerAreasContent";

import { AddLearningPathInline } from "@/components/admin/AddLearningPathInline";
import { EditLearningPathInline } from "@/components/admin/EditLearningPathInline";
import { AddModuleInline } from "@/components/admin/AddModuleInline";
import { EditModuleInline } from "@/components/admin/EditModuleInline";
import { AddExperimentInline } from "@/components/admin/AddExperimentInline";
import { EditExperimentInline } from "@/components/admin/EditExperimentInline";
import { AddCareerInline } from "@/components/admin/AddCareerInline";
import { EditCareerInline } from "@/components/admin/EditCareerInline";
import { AddBlogCard } from "@/components/admin/AddBlogCard";
import { EditBlogPostInline } from "@/components/admin/EditBlogPostInline";

/* ------------------------------------------------------------------ */
/* Peças compartilhadas                                               */
/* ------------------------------------------------------------------ */

export const AreaTabs = ({ value, onChange }: { value: AreaKey; onChange: (a: AreaKey) => void }) => (
  <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="tablist" aria-label="Área">
    {AREAS.map((a) => {
      const active = a.key === value;
      return (
        <button
          key={a.key}
          type="button"
          role="tab"
          aria-selected={active}
          onClick={() => onChange(a.key)}
          className={cn(
            "shrink-0 flex items-center gap-2 h-11 px-4 rounded-2xl border-2 font-display text-[15px] font-semibold transition-all",
            active
              ? `border-transparent bg-gradient-to-r ${a.pill} text-white shadow-md`
              : "border-pink-100 bg-white/80 text-gray-600 hover:-translate-y-0.5 hover:border-pink-300 hover:text-gray-900 dark:bg-white/5 dark:text-gray-300 dark:border-white/10"
          )}
        >
          <span>{a.emoji}</span>
          {a.label}
        </button>
      );
    })}
  </div>
);

export interface BoardItem {
  key: string;
  dbId?: string;
  title: string;
  description?: string;
  badge?: string;
  meta: string[];
  visual?: string;
  image?: string;
  extra?: ReactNode;
  locked?: boolean;
}

const deleteRow = async (table: string, id: string) => {
  const { data, error } = await supabase.from(table as never).delete().eq("id", id).select("id");
  if (error || !data || (data as unknown[]).length === 0) {
    toast.error("Não foi possível apagar. Verifique sua permissão e tente de novo.");
    return false;
  }
  toast.success("Apagado.");
  return true;
};

const ItemGrid = ({
  items,
  loading,
  emptyText,
  onEdit,
  onDelete,
  deleteLabel,
}: {
  items: BoardItem[];
  loading: boolean;
  emptyText: string;
  onEdit: (item: BoardItem) => void;
  onDelete: (item: BoardItem) => Promise<void>;
  deleteLabel: string;
}) => {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => `${i.title} ${i.description || ""}`.toLowerCase().includes(q));
  }, [items, search]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-7 h-7 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.length > 4 && (
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar" className="pl-9 rounded-xl" />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-pink-200 bg-white/50 dark:border-white/10 dark:bg-white/[0.02] py-12 text-center text-gray-500">
          {search ? "Nada encontrado com essa busca." : emptyText}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.key}
              className="group relative flex flex-col rounded-3xl border-2 border-pink-100 bg-white/90 p-4 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-100 dark:border-white/10 dark:bg-white/[0.04] dark:hover:shadow-none"
            >
              <div className="flex items-start gap-3">
                {item.image ? (
                  <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" loading="lazy" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-violet-100 dark:from-pink-500/15 dark:to-violet-500/15 flex items-center justify-center text-2xl shrink-0">
                    {item.visual || "📘"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-[17px] font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">{item.title}</h3>
                  {item.badge && (
                    <span className="mt-1 inline-block rounded-full bg-pink-50 px-2 py-0.5 text-xs font-semibold text-pink-700 dark:bg-pink-500/15 dark:text-pink-200">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>

              {item.description && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{item.description}</p>
              )}
              {item.extra}

              <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                  {item.meta.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
                {item.locked ? (
                  <span className="text-xs text-gray-400">Exemplo</span>
                ) : (
                  <div className="flex gap-1 opacity-100 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={() => onEdit(item)} title="Editar" aria-label={`Editar ${item.title}`}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40" title="Apagar" aria-label={`Apagar ${item.title}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Apagar “{item.title}”?</AlertDialogTitle>
                          <AlertDialogDescription>{deleteLabel} Não dá para desfazer.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => onDelete(item)}>
                            Apagar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

const difficultyEmoji = (d?: string) => (d === "Avançado" ? "🚀" : d === "Intermediário" ? "🧩" : "🌱");

/* ------------------------------------------------------------------ */
/* Trilhas                                                            */
/* ------------------------------------------------------------------ */

export const TrilhasSection = ({ area }: { area: AreaKey }) => {
  const qc = useQueryClient();
  const { data = [], isLoading } = useLearningPathContent(area);
  const [editing, setEditing] = useState<PathLevel | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["learning-path-content"] });

  const items: BoardItem[] = data.map((l) => ({
    key: l.dbId || String(l.id),
    dbId: l.dbId,
    title: `Nível ${l.id} · ${l.title}`,
    description: plainText(l.description),
    badge: l.difficulty,
    visual: difficultyEmoji(l.difficulty),
    meta: [`${l.lessons.length} lições`, `${l.points} XP`],
  }));

  return (
    <div className="space-y-6">
      <AddLearningPathInline selectedArea={area} onContentChange={refresh} canEditContent />
      <ItemGrid
        items={items}
        loading={isLoading}
        emptyText="Nenhum nível nesta área ainda."
        deleteLabel="O nível e todas as lições dele serão apagados."
        onEdit={(i) => setEditing(data.find((l) => l.dbId === i.dbId) || null)}
        onDelete={async (i) => {
          if (i.dbId && (await deleteRow("learning_path_content", i.dbId))) refresh();
        }}
      />
      {editing && <EditLearningPathInline level={editing} onClose={() => setEditing(null)} onContentChange={refresh} />}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Módulos                                                            */
/* ------------------------------------------------------------------ */

export const ModulosSection = ({ area }: { area: AreaKey }) => {
  const qc = useQueryClient();
  const { data = [], isLoading } = useModulesContent(area);
  const [editing, setEditing] = useState<Module | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["modules-content"] });

  const items: BoardItem[] = data.map((m) => ({
    key: m.dbId || m.id,
    dbId: m.dbId,
    title: m.title,
    description: plainText(m.description),
    visual: "📚",
    meta: [`${m.lessons.length} lições`, m.estimatedTime],
  }));

  return (
    <div className="space-y-6">
      <AddModuleInline selectedArea={area} onContentChange={refresh} canEditContent />
      <ItemGrid
        items={items}
        loading={isLoading}
        emptyText="Nenhum módulo nesta área ainda."
        deleteLabel="O módulo, as lições e o projeto final serão apagados."
        onEdit={(i) => setEditing(data.find((m) => m.dbId === i.dbId) || null)}
        onDelete={async (i) => {
          if (i.dbId && (await deleteRow("modules_content", i.dbId))) refresh();
        }}
      />
      {editing && <EditModuleInline module={editing} onClose={() => setEditing(null)} onContentChange={refresh} />}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Laboratório                                                        */
/* ------------------------------------------------------------------ */

export const LaboratorioSection = ({ area }: { area: AreaKey }) => {
  const qc = useQueryClient();
  const { data = [], isLoading } = useExperimentsContent(area);
  const [editing, setEditing] = useState<Experiment | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["experiments-content"] });

  const items: BoardItem[] = data.map((e) => ({
    key: e.dbId,
    dbId: e.dbId,
    title: e.title,
    description: plainText(e.description),
    badge: e.difficulty,
    visual: e.image || "🧪",
    image: e.coverImage,
    meta: [e.time, `${e.steps.length} passos`, `${e.materials.length} materiais`],
  }));

  return (
    <div className="space-y-6">
      <AddExperimentInline selectedArea={area} onContentChange={refresh} canEditContent />
      <ItemGrid
        items={items}
        loading={isLoading}
        emptyText="Nenhum experimento nesta área ainda."
        deleteLabel="O experimento e os passos dele serão apagados."
        onEdit={(i) => setEditing(data.find((e) => e.dbId === i.dbId) || null)}
        onDelete={async (i) => {
          if (i.dbId && (await deleteRow("experiments_content", i.dbId))) refresh();
        }}
      />
      {editing && <EditExperimentInline experiment={editing} onClose={() => setEditing(null)} onContentChange={refresh} />}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Áreas de Atuação + mulheres inspiradoras                           */
/* ------------------------------------------------------------------ */

export const CarreirasSection = ({ area }: { area: AreaKey }) => {
  const qc = useQueryClient();
  const { data = [], isLoading } = useCareerAreasContent(area);
  const [editing, setEditing] = useState<Career | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["career-areas-content"] });

  const items: BoardItem[] = data.map((c) => ({
    key: c.dbId,
    dbId: c.dbId,
    title: c.name,
    description: plainText(c.description),
    visual: "💼",
    meta: [c.salaryRange || "Salário não informado"],
    locked: c.dbId.startsWith("fallback-"),
    extra:
      c.women.length > 0 ? (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex -space-x-2">
            {c.women.slice(0, 4).map((w) => (
              <img
                key={w.name}
                src={w.image}
                alt=""
                title={w.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 bg-gray-100"
                loading="lazy"
                onError={(ev) => ((ev.target as HTMLImageElement).style.visibility = "hidden")}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {c.women.length} {c.women.length === 1 ? "mulher inspiradora" : "mulheres inspiradoras"}:{" "}
            {c.women.map((w) => w.name).join(", ")}
          </span>
        </div>
      ) : (
        <p className="mt-3 text-xs text-amber-600">Sem mulheres inspiradoras. Edite para adicionar.</p>
      ),
  }));

  return (
    <div className="space-y-6">
      <AddCareerInline selectedArea={area} onContentChange={refresh} canEditContent />
      <ItemGrid
        items={items}
        loading={isLoading}
        emptyText="Nenhuma carreira nesta área ainda."
        deleteLabel="A carreira e as mulheres inspiradoras dela serão apagadas."
        onEdit={(i) => setEditing(data.find((c) => c.dbId === i.dbId) || null)}
        onDelete={async (i) => {
          if (i.dbId && (await deleteRow("career_areas_content", i.dbId))) refresh();
        }}
      />
      {editing && <EditCareerInline career={editing} onClose={() => setEditing(null)} onContentChange={refresh} />}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Blog                                                               */
/* ------------------------------------------------------------------ */

interface BlogRow {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author_name: string;
  read_time: string | null;
  emoji: string | null;
  color_class: string | null;
  cover_image: string | null;
  published: boolean | null;
  created_at: string;
}

export const BlogSection = () => {
  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["staff-blog-posts"],
    queryFn: async (): Promise<BlogRow[]> => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as BlogRow[];
    },
  });
  const [editing, setEditing] = useState<BlogRow | null>(null);

  const items: BoardItem[] = data.map((p) => ({
    key: p.id,
    dbId: p.id,
    title: p.title,
    description: plainText(p.excerpt),
    badge: p.published ? "Publicado" : "Rascunho",
    visual: p.emoji || "📝",
    image: p.cover_image || undefined,
    meta: [p.category, p.author_name, new Date(p.created_at).toLocaleDateString("pt-BR")],
  }));

  return (
    <div className="space-y-6">
      <AddBlogCard onPostAdded={() => refetch()} />
      <ItemGrid
        items={items}
        loading={isLoading}
        emptyText="Nenhum post no blog ainda."
        deleteLabel="O post será apagado do blog."
        onEdit={(i) => setEditing(data.find((p) => p.id === i.dbId) || null)}
        onDelete={async (i) => {
          if (i.dbId && (await deleteRow("blog_posts", i.dbId))) refetch();
        }}
      />
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <EditBlogPostInline
          post={{
            id: editing.id,
            title: editing.title,
            excerpt: editing.excerpt,
            content: editing.content,
            category: editing.category,
            author: editing.author_name,
            readTime: editing.read_time || "5 min",
            image: editing.emoji || "📝",
            color: editing.color_class || "bg-purple-500",
            coverImage: editing.cover_image || undefined,
          }}
          onSave={() => {
            setEditing(null);
            refetch();
          }}
          onCancel={() => setEditing(null)}
        />
          </div>
        </div>
      )}
    </div>
  );
};
