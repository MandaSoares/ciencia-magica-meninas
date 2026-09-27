import { lazy, Suspense, useEffect, useState } from "react";
import {
  BookOpen,
  Briefcase,
  Eye,
  FlaskConical,
  LayoutDashboard,
  Loader2,
  LogOut,
  Map,
  MessageSquare,
  Moon,
  Newspaper,
  Sun,
  Users,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { StemBackdrop } from "@/components/StemBackdrop";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { AreaKey } from "./areas";
import { StaffOverview } from "./StaffOverview";
import { AreaTabs, BlogSection, CarreirasSection, LaboratorioSection, ModulosSection, TrilhasSection } from "./ContentSections";

const CommentsModeration = lazy(() => import("@/components/admin/CommentsModeration").then((m) => ({ default: m.CommentsModeration })));
const UserManagement = lazy(() => import("@/components/admin/UserManagement").then((m) => ({ default: m.UserManagement })));

export type StaffSection =
  | "overview"
  | "trilhas"
  | "modulos"
  | "laboratorio"
  | "carreiras"
  | "blog"
  | "comentarios"
  | "pessoas";

interface NavItem {
  id: StaffSection;
  label: string;
  icon: typeof Map;
  description: string;
  adminOnly?: boolean;
  byArea?: boolean;
}

const ICON_COLOR: Record<StaffSection, string> = {
  overview: "from-pink-400 to-rose-500",
  trilhas: "from-fuchsia-400 to-violet-500",
  modulos: "from-sky-400 to-indigo-500",
  laboratorio: "from-emerald-400 to-teal-500",
  carreiras: "from-amber-400 to-orange-500",
  blog: "from-rose-400 to-pink-600",
  comentarios: "from-violet-400 to-purple-600",
  pessoas: "from-yellow-300 to-amber-500",
};

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "",
    items: [{ id: "overview", label: "Visão geral", icon: LayoutDashboard, description: "Resumo do conteúdo e da comunidade." }],
  },
  {
    group: "Conteúdo",
    items: [
      { id: "trilhas", label: "Trilhas", icon: Map, description: "Níveis, lições, vídeos e quizzes de cada área.", byArea: true },
      { id: "modulos", label: "Módulos", icon: BookOpen, description: "Cursos completos com lições e projeto final.", byArea: true },
      { id: "laboratorio", label: "Laboratório", icon: FlaskConical, description: "Experimentos práticos, materiais e passos.", byArea: true },
      { id: "carreiras", label: "Áreas de Atuação", icon: Briefcase, description: "Carreiras e mulheres inspiradoras.", byArea: true },
      { id: "blog", label: "Blog", icon: Newspaper, description: "Artigos publicados e rascunhos." },
    ],
  },
  {
    group: "Comunidade",
    items: [{ id: "comentarios", label: "Comentários", icon: MessageSquare, description: "Modere comentários e denúncias dos fóruns." }],
  },
  {
    group: "Gestão",
    items: [
      { id: "pessoas", label: "Pessoas e equipe", icon: Users, description: "Convide editoras, mude papéis e remova pessoas.", adminOnly: true },
    ],
  },
];

interface StaffWorkspaceProps {
  isAdmin: boolean;
  userName: string;
  userImage?: string;
  onPreviewStudent: () => void;
  onLogout: () => void;
}

const SECTION_KEY = "conscientistas-staff-section";

/**
 * Espaço de trabalho da equipe (administradora e editora).
 * Substitui o app de estudante: sem trilha para escolher, sem XP ou sequência.
 */
export const StaffWorkspace = ({ isAdmin, userName, userImage, onPreviewStudent, onLogout }: StaffWorkspaceProps) => {
  const { theme, toggleTheme } = useTheme();
  const [section, setSection] = useState<StaffSection>(() => {
    try {
      return (localStorage.getItem(SECTION_KEY) as StaffSection) || "overview";
    } catch {
      return "overview";
    }
  });
  const [area, setArea] = useState<AreaKey>("science");

  const items = NAV.flatMap((g) => g.items).filter((i) => !i.adminOnly || isAdmin);
  const current = items.find((i) => i.id === section) || items[0];

  useEffect(() => {
    try {
      localStorage.setItem(SECTION_KEY, current.id);
    } catch {
      /* ignora */
    }
    window.scrollTo({ top: 0 });
  }, [current.id]);

  const roleLabel = isAdmin ? "Administradora" : "Editora";
  const roleClass = isAdmin
    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200";

  const navButton = (item: NavItem, compact = false) => {
    const Icon = item.icon;
    const active = item.id === current.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => setSection(item.id)}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group flex items-center gap-3 rounded-2xl border-2 font-display text-[15px] font-semibold transition-all",
          compact ? "shrink-0 h-11 pl-1.5 pr-3" : "w-full h-12 px-2",
          active
            ? "border-pink-300 bg-pink-50 text-pink-600 dark:border-pink-500/50 dark:bg-pink-500/10 dark:text-pink-300"
            : "border-transparent text-gray-600 hover:bg-pink-50/70 hover:text-pink-600 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
        )}
      >
        <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform group-hover:scale-110", ICON_COLOR[item.id])}>
          <Icon className="w-4 h-4" />
        </span>
        {item.label}
      </button>
    );
  };

  const loader = (
    <div className="flex justify-center py-16">
      <Loader2 className="w-7 h-7 animate-spin text-pink-500" />
    </div>
  );

  return (
    <div className="relative isolate min-h-screen transition-colors">
      <StemBackdrop />
      {/* Barra lateral (desktop) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r-2 border-pink-100 bg-white/80 backdrop-blur-md dark:border-white/5 dark:bg-[#170b1c]/80">
        <div className="flex items-center px-5 h-16 border-b-2 border-pink-100 dark:border-white/5">
          <Brand size={36} />
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Painel">
          {NAV.map((g) => {
            const visible = g.items.filter((i) => !i.adminOnly || isAdmin);
            if (!visible.length) return null;
            return (
              <div key={g.group || "top"} className="space-y-1">
                {g.group && <p className="px-3 pb-1 font-display text-xs font-semibold uppercase tracking-widest text-pink-400/90">{g.group}</p>}
                {visible.map((i) => navButton(i))}
              </div>
            );
          })}
        </nav>
        <div className="border-t-2 border-pink-100 p-3 space-y-1 dark:border-white/5">
          <button
            type="button"
            onClick={onPreviewStudent}
            className="w-full flex items-center gap-3 h-11 px-3 rounded-2xl border-2 border-dashed border-pink-200 font-display text-[15px] font-semibold text-pink-600 hover:bg-pink-50 dark:border-pink-500/30 dark:text-pink-300 dark:hover:bg-pink-500/10"
          >
            <Eye className="w-4 h-4" /> Ver como estudante
          </button>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <Avatar className="w-9 h-9">
              <AvatarImage src={userImage} />
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-violet-500 text-white text-sm font-bold">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{userName}</p>
              <span className={cn("inline-block rounded-full px-2 py-0.5 text-[11px] font-bold", roleClass)}>{roleLabel}</span>
            </div>
            <button type="button" onClick={toggleTheme} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Alternar tema">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button type="button" onClick={onLogout} className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40" aria-label="Sair" title="Sair">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Topo (celular/tablet) */}
      <header className="lg:hidden sticky top-0 z-40 border-b-2 border-pink-100 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-[#170b1c]/90">
        <div className="flex items-center gap-2 px-4 h-14">
          <Brand size={30} textClassName="text-lg" compact />
          <span className={cn("ml-1 rounded-full px-2 py-0.5 text-[11px] font-bold", roleClass)}>{roleLabel}</span>
          <div className="ml-auto flex items-center">
            <button type="button" onClick={onPreviewStudent} className="p-2 rounded-lg text-gray-500" aria-label="Ver como estudante">
              <Eye className="w-5 h-5" />
            </button>
            <button type="button" onClick={toggleTheme} className="p-2 rounded-lg text-gray-500" aria-label="Alternar tema">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button type="button" onClick={onLogout} className="p-2 rounded-lg text-gray-500" aria-label="Sair">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3" aria-label="Painel">
          {items.map((i) => navButton(i, true))}
        </nav>
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {current.id !== "overview" && (
            <div className="mb-6 space-y-4">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{current.label}</h1>
                <p className="mt-1 text-gray-500 dark:text-gray-400">{current.description}</p>
              </div>
              {current.byArea && <AreaTabs value={area} onChange={setArea} />}
            </div>
          )}

          {current.id === "overview" && <StaffOverview isAdmin={isAdmin} userName={userName} onNavigate={setSection} />}
          {current.id === "trilhas" && <TrilhasSection key={area} area={area} />}
          {current.id === "modulos" && <ModulosSection key={area} area={area} />}
          {current.id === "laboratorio" && <LaboratorioSection key={area} area={area} />}
          {current.id === "carreiras" && <CarreirasSection key={area} area={area} />}
          {current.id === "blog" && <BlogSection />}
          {current.id === "comentarios" && (
            <div className="rounded-3xl border-2 border-pink-100 bg-white/90 p-4 sm:p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
              <Suspense fallback={loader}>
                <CommentsModeration />
              </Suspense>
            </div>
          )}
          {current.id === "pessoas" && isAdmin && (
            <div className="rounded-3xl border-2 border-pink-100 bg-white/90 p-4 sm:p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
              <Suspense fallback={loader}>
                <UserManagement />
              </Suspense>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
