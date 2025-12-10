import { Home, BookOpen, Users, Lightbulb, Star, Map, User } from "lucide-react";
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
  scientists: Users,
  lab: Lightbulb,
  achievements: Star,
  profile: User,
};

export const Navigation = ({ activeSection, setActiveSection, navItems }: NavigationProps) => {
  const items = navItems || [
    { id: "dashboard", label: "Início" },
    { id: "path", label: "Trilha" },
    { id: "modules", label: "Módulos" },
    { id: "scientists", label: "Cientistas" },
    { id: "lab", label: "Laboratório" },
    { id: "achievements", label: "Conquistas" },
    { id: "profile", label: "Meu Perfil" },
  ];

  return (
    <nav className="w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-6">
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = iconMap[item.id] || Home;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-purple-50",
                    activeSection === item.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-700 hover:text-purple-600"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
