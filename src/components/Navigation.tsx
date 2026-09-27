import { Home, BookOpen, Briefcase, Map, User, FlaskConical, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
}

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  navItems?: NavItem[];
}

export const NAV_STYLE: Record<string, { icon: React.ElementType; color: string }> = {
  dashboard: { icon: Home, color: "from-pink-400 to-rose-500" },
  path: { icon: Map, color: "from-fuchsia-400 to-violet-500" },
  modules: { icon: BookOpen, color: "from-sky-400 to-indigo-500" },
  areas: { icon: Briefcase, color: "from-amber-400 to-orange-500" },
  lab: { icon: FlaskConical, color: "from-emerald-400 to-teal-500" },
  achievements: { icon: Trophy, color: "from-yellow-300 to-amber-500" },
  profile: { icon: User, color: "from-rose-400 to-pink-600" },
};

export const Navigation = ({ activeSection, setActiveSection, navItems }: NavigationProps) => {
  const items = navItems || [
    { id: "dashboard", label: "Início" },
    { id: "path", label: "Trilha" },
    { id: "modules", label: "Módulos" },
    { id: "areas", label: "Áreas de Atuação" },
    { id: "lab", label: "Laboratório" },
    { id: "profile", label: "Meu Perfil" },
  ];

  return (
    <nav
      className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r-2 border-pink-100 bg-white/70 backdrop-blur-md transition-colors md:block dark:border-white/5 dark:bg-[#170b1c]/70"
      aria-label="Menu principal"
    >
      <ul className="space-y-1.5 p-4 pt-6">
        {items.map((item) => {
          const style = NAV_STYLE[item.id] || NAV_STYLE.dashboard;
          const Icon = style.icon;
          const isActive = activeSection === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-2xl border-2 px-3 py-2.5 transition-all",
                  isActive
                    ? "border-pink-300 bg-pink-50 text-pink-600 dark:border-pink-500/50 dark:bg-pink-500/10 dark:text-pink-300"
                    : "border-transparent text-gray-600 hover:bg-pink-50/70 hover:text-pink-600 dark:text-gray-300 dark:hover:bg-white/5"
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform group-hover:scale-110",
                    style.color
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="font-display text-base font-semibold whitespace-nowrap">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
