import { Home, BookOpen, Briefcase, Star, Map, User, Beaker, Trophy } from "lucide-react";
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

const iconMap: Record<string, React.ElementType> = {
  dashboard: Home,
  path: Map,
  modules: BookOpen,
  areas: Briefcase,
  lab: Beaker,
  achievements: Trophy,
  areas: Briefcase,
  profile: User,
};

const emojiMap: Record<string, string> = {
  dashboard: "🏠",
  path: "🗺️",
  modules: "📚",
  areas: "💼",
  lab: "🧪",
  profile: "👤",
};

export const Navigation = ({ activeSection, setActiveSection, navItems }: NavigationProps) => {
  const items = navItems || [
    { id: "dashboard", label: "Inicio" },
    { id: "path", label: "Trilha" },
    { id: "modules", label: "Modulos" },
    { id: "areas", label: "Areas de Atuacao" },
    { id: "lab", label: "Laboratorio" },
    { id: "profile", label: "Meu Perfil" },
  ];

  return (
    <nav className="w-64 bg-white/80 backdrop-blur-md border-r border-purple-100 h-screen sticky top-0 hidden md:block">
      <div className="p-4 pt-6">
        <ul className="space-y-1.5">
          {items.map((item) => {
            const Icon = iconMap[item.id] || Home;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200 scale-[1.02]"
                      : "text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:scale-[1.01]"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                    isActive
                      ? "bg-white/20"
                      : "bg-gray-100 group-hover:bg-purple-100"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
