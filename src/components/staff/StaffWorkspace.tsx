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
import { Logo } from "@/components/Logo";
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
          "flex items-center gap-3 rounded-xl text-sm font-semibold transition-all",
          compact ? "shrink-0 h-10 px-3" : "w-full h-11 px-3",
          active
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-200/60 dark:shadow-none"
            : "text-gray-600 hover:bg-purple-50 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        )}
      >
        <Icon className="w-4 h-4 shrink-0" />
        {item.label}
      </button>
    );
  };

  const loader = (
    <div className="flex justify-center py-16">
      <Loader2 className="w-7 h-7 animate-spin text-purple-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/70 via-white to-pink-50/60 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 transition-colors">
      {/* Barra lateral (desktop) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-gray-200/80 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-gray-100 dark:border-gray-800">
          <Logo size={32} />
          <span className="text-lg font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Conscientistas</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Painel">
          {NAV.map((g) => {
            const visible = g.items.filter((i) => !i.adminOnly || isAdmin);
            if (!visible.length) return null;
            return (
              <div key={g.group || "top"} className="space-y-1">
                {g.group && <p className="px-3 pb-1 text-xs font-bold uppercase tracking-wide text-gray-400">{g.group}</p>}
                {visible.map((i) => navButton(i))}
              </div>
            );
          })}
        </nav>
        <div className="border-t border-gray-100 p-3 space-y-1 dark:border-gray-800">
          <button
            type="button"
            onClick={onPreviewStudent}
            className="w-full flex items-center gap-3 h-11 px-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-purple-50 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Eye className="w-4 h-4" /> Ver como estudante
          </button>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <Avatar className="w-9 h-9">
              <AvatarImage src={userImage} />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-sm font-bold">
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
      <header className="lg:hidden sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
        <div className="flex items-center gap-2 px-4 h-14">
          <Logo size={28} />
          <span className="font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Conscientistas</span>
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
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">{current.label}</h1>
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
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <Suspense fallback={loader}>
                <CommentsModeration />
              </Suspense>
            </div>
          )}
          {current.id === "pessoas" && isAdmin && (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
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
