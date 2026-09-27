import { Flame, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { StudyReminder } from "./StudyReminder";
import { Brand } from "./Brand";

interface HeaderProps {
  userPoints: number;
  userLevel: number;
  userName?: string;
  userProfileImage?: string;
  streak?: number;
  studiedToday?: boolean;
}

export const Header = ({ userPoints, userLevel, userName = "Estudante", userProfileImage, streak = 0, studiedToday = false }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const initials = userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <header className="sticky top-0 z-50 h-16 border-b-2 border-pink-100 bg-white/85 backdrop-blur-md transition-colors dark:border-white/5 dark:bg-[#170b1c]/85">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Brand size={38} compact />

        <div className="flex items-center gap-1.5 sm:gap-3">
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1.5",
              studiedToday ? "bg-orange-50 dark:bg-orange-500/10" : "bg-gray-100 dark:bg-white/5"
            )}
            title={studiedToday ? `${streak} dia(s) seguidos` : "Estude hoje para manter sua ofensiva"}
            aria-label={`Ofensiva: ${streak} dia(s) seguidos`}
          >
            <Flame className={cn("h-5 w-5", studiedToday ? "fill-orange-400 text-orange-500" : "text-gray-400")} />
            <span className={cn("font-display text-base font-bold", studiedToday ? "text-orange-500" : "text-gray-400")}>{streak}</span>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-pink-50 px-2.5 py-1.5 dark:bg-pink-500/10" title="Pontos de experiência">
            <span aria-hidden className="grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br from-pink-400 to-fuchsia-500 text-[10px] font-black text-white">XP</span>
            <span className="font-display text-base font-bold text-pink-600 dark:text-pink-300">{userPoints}</span>
          </div>

          <div className="hidden items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1.5 sm:flex dark:bg-violet-500/10" title="Seu nível">
            <span aria-hidden className="text-base leading-none">⭐</span>
            <span className="font-display text-base font-bold text-violet-600 dark:text-violet-300">Nv {userLevel}</span>
          </div>

          <StudyReminder />

          <button
            onClick={toggleTheme}
            className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 transition-colors hover:bg-pink-100 dark:bg-white/5 dark:hover:bg-white/10"
            aria-label="Alternar tema"
          >
            {theme === "light" ? <Moon className="h-4 w-4 text-gray-600" /> : <Sun className="h-4 w-4 text-yellow-400" />}
          </button>

          <Avatar className="h-9 w-9 ring-2 ring-pink-300 ring-offset-2 ring-offset-white dark:ring-pink-500/60 dark:ring-offset-[#170b1c]">
            <AvatarImage src={userProfileImage} />
            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-violet-500 text-sm font-bold text-white">{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
