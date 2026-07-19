import { Flame, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/hooks/useTheme";
import { StudyReminder } from "./StudyReminder";
import { Logo } from "./Logo";

interface HeaderProps {
  userPoints: number;
  userLevel: number;
  userName?: string;
  userProfileImage?: string;
}

export const Header = ({ userPoints, userLevel, userName = "Estudante", userProfileImage }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-purple-100 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Conscientistas
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/30 px-3 py-1.5 rounded-full">
            <span className="text-sm font-bold text-purple-600 dark:text-purple-300">{userPoints}</span>
            <span className="text-xs text-purple-400 dark:text-purple-500 font-semibold">XP</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-700">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-300">Nv {userLevel}</span>
          </div>

          <StudyReminder />

          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Alternar tema"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="w-4 h-4 text-yellow-500" />
            )}
          </button>

          <Avatar className="w-9 h-9 ring-2 ring-purple-200 dark:ring-purple-700 ring-offset-2 ring-offset-white dark:ring-offset-gray-900">
            <AvatarImage src={userProfileImage} />
            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white font-bold text-sm">
              {getUserInitials(userName)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
