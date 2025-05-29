
import { Home, BookOpen, Users, Lightbulb, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navigation = ({ activeSection, setActiveSection }: NavigationProps) => {
  const navItems = [
    { id: "dashboard", label: "Início", icon: Home },
    { id: "modules", label: "Módulos", icon: BookOpen },
    { id: "scientists", label: "Cientistas", icon: Users },
    { id: "lab", label: "Laboratório", icon: Lightbulb },
    { id: "achievements", label: "Conquistas", icon: Star },
  ];

  return (
    <nav className="w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
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
