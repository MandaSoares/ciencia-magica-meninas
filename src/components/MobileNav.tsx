import { cn } from "@/lib/utils";
import { NAV_STYLE } from "./Navigation";

interface MobileNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const items = [
  { id: "dashboard", label: "Início" },
  { id: "path", label: "Trilha" },
  { id: "modules", label: "Módulos" },
  { id: "lab", label: "Lab" },
  { id: "achievements", label: "Medalhas" },
  { id: "profile", label: "Perfil" },
];

export const MobileNav = ({ activeSection, setActiveSection }: MobileNavProps) => (
  <nav
    className="safe-area-bottom fixed bottom-0 left-0 right-0 z-40 border-t-2 border-pink-100 bg-white/95 backdrop-blur-md transition-colors md:hidden dark:border-white/5 dark:bg-[#170b1c]/95"
    aria-label="Menu principal"
  >
    <div className="flex items-center justify-around px-1 py-1.5">
      {items.map((item) => {
        const isActive = activeSection === item.id;
        const style = NAV_STYLE[item.id];
        const Icon = style.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            aria-current={isActive ? "page" : undefined}
            className="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1"
          >
            <span
              className={cn(
                "grid h-9 w-9 place-items-center rounded-xl transition-all",
                isActive ? cn("scale-110 bg-gradient-to-br text-white shadow-md", style.color) : "text-gray-400"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <span className={cn("truncate text-[10px] font-bold", isActive ? "text-pink-600 dark:text-pink-300" : "text-gray-400")}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  </nav>
);
