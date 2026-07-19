import { Home, Map, BookOpen, Beaker, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const items = [
  { id: "dashboard", label: "Inicio", icon: Home },
  { id: "path", label: "Trilha", icon: Map },
  { id: "modules", label: "Modulos", icon: BookOpen },
  { id: "lab", label: "Lab", icon: Beaker },
  { id: "achievements", label: "Medalhas", icon: Trophy },
  { id: "profile", label: "Perfil", icon: User },
];

export const MobileNav = ({ activeSection, setActiveSection }: MobileNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-purple-100 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-1 py-1">
        {items.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-2 rounded-xl transition-all min-w-0 flex-1",
                isActive
                  ? "text-purple-600"
                  : "text-gray-400"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                isActive
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md scale-110"
                  : ""
              )}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className={cn(
                "text-[10px] font-bold truncate",
                isActive ? "text-purple-600" : "text-gray-400"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
