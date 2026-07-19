import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Star,
  Medal,
  Crown,
  Target,
  Zap,
  BookOpen,
  Beaker,
  Code,
  Cpu,
  Wrench,
  Calculator,
  Microscope,
  Brain,
  Rocket,
  Shapes,
  Flame,
  Heart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface UserStats {
  modulesCompleted: number;
  experimentsCompleted: number;
  lessonsCompleted: number;
  daysStreak: number;
  completedLevels: Set<string>;
  completedModules: Set<string>;
}

interface AchievementsProps {
  userPoints: number;
  userLevel: number;
  stats: UserStats;
  selectedArea: string;
}

const areaNames: Record<string, string> = {
  science: "Ciência",
  technology: "Tecnologia",
  engineering: "Engenharia",
  math: "Matemática",
};

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  emoji: string;
  color: string;
  unlockCondition: (stats: UserStats, level: number) => boolean;
  progressFn: (stats: UserStats, level: number) => { current: number; target: number };
  points: number;
  rarity: "comum" | "raro" | "épico" | "lendário";
}

const achievementsByArea: Record<string, Achievement[]> = {
  science: [
    { id: 1, title: "Primeira Descoberta", description: "Complete sua primeira lição", icon: Star, emoji: "🌟", color: "from-yellow-400 to-amber-500", unlockCondition: (s) => s.lessonsCompleted >= 1, progressFn: (s) => ({ current: Math.min(s.lessonsCompleted, 1), target: 1 }), points: 100, rarity: "comum" },
    { id: 2, title: "Exploradora Curiosa", description: "Complete 5 lições", icon: BookOpen, emoji: "📖", color: "from-blue-400 to-blue-600", unlockCondition: (s) => s.lessonsCompleted >= 5, progressFn: (s) => ({ current: Math.min(s.lessonsCompleted, 5), target: 5 }), points: 150, rarity: "comum" },
    { id: 3, title: "Cientista Iniciante", description: "Complete seu primeiro experimento", icon: Beaker, emoji: "🧪", color: "from-emerald-400 to-green-600", unlockCondition: (s) => s.experimentsCompleted >= 1, progressFn: (s) => ({ current: Math.min(s.experimentsCompleted, 1), target: 1 }), points: 150, rarity: "comum" },
    { id: 4, title: "Mestre de Laboratório", description: "Complete 3 experimentos", icon: Microscope, emoji: "🔬", color: "from-purple-400 to-purple-600", unlockCondition: (s) => s.experimentsCompleted >= 3, progressFn: (s) => ({ current: Math.min(s.experimentsCompleted, 3), target: 3 }), points: 200, rarity: "raro" },
    { id: 5, title: "Nível 5 Alcançado", description: "Chegue ao nível 5", icon: Medal, emoji: "🏅", color: "from-orange-400 to-orange-600", unlockCondition: (_, l) => l >= 5, progressFn: (_, l) => ({ current: Math.min(l, 5), target: 5 }), points: 250, rarity: "raro" },
    { id: 6, title: "Módulo Completo", description: "Termine um módulo", icon: Trophy, emoji: "🏆", color: "from-pink-400 to-pink-600", unlockCondition: (s) => s.modulesCompleted >= 1, progressFn: (s) => ({ current: Math.min(s.modulesCompleted, 1), target: 1 }), points: 300, rarity: "raro" },
    { id: 7, title: "Super Streak", description: "Estude por 7 dias seguidos", icon: Flame, emoji: "🔥", color: "from-red-400 to-red-600", unlockCondition: (s) => s.daysStreak >= 7, progressFn: (s) => ({ current: Math.min(s.daysStreak, 7), target: 7 }), points: 300, rarity: "épico" },
    { id: 8, title: "Mestra da Ciência", description: "Complete 3 módulos", icon: Crown, emoji: "👑", color: "from-indigo-400 to-indigo-600", unlockCondition: (s) => s.modulesCompleted >= 3, progressFn: (s) => ({ current: Math.min(s.modulesCompleted, 3), target: 3 }), points: 500, rarity: "lendário" },
  ],
  technology: [
    { id: 1, title: "Hello World", description: "Complete sua primeira lição", icon: Star, emoji: "💡", color: "from-yellow-400 to-amber-500", unlockCondition: (s) => s.lessonsCompleted >= 1, progressFn: (s) => ({ current: Math.min(s.lessonsCompleted, 1), target: 1 }), points: 100, rarity: "comum" },
    { id: 2, title: "Debug Master", description: "Complete 5 lições", icon: Code, emoji: "🐛", color: "from-blue-400 to-blue-600", unlockCondition: (s) => s.lessonsCompleted >= 5, progressFn: (s) => ({ current: Math.min(s.lessonsCompleted, 5), target: 5 }), points: 150, rarity: "comum" },
    { id: 3, title: "Primeiro Programa", description: "Complete seu primeiro experimento tech", icon: Cpu, emoji: "💻", color: "from-emerald-400 to-green-600", unlockCondition: (s) => s.experimentsCompleted >= 1, progressFn: (s) => ({ current: Math.min(s.experimentsCompleted, 1), target: 1 }), points: 150, rarity: "comum" },
    { id: 4, title: "Hacker do Bem", description: "Complete 3 experimentos", icon: Brain, emoji: "🧠", color: "from-purple-400 to-purple-600", unlockCondition: (s) => s.experimentsCompleted >= 3, progressFn: (s) => ({ current: Math.min(s.experimentsCompleted, 3), target: 3 }), points: 200, rarity: "raro" },
    { id: 5, title: "Nível 5 Tech", description: "Chegue ao nível 5", icon: Medal, emoji: "🏅", color: "from-orange-400 to-orange-600", unlockCondition: (_, l) => l >= 5, progressFn: (_, l) => ({ current: Math.min(l, 5), target: 5 }), points: 250, rarity: "raro" },
    { id: 6, title: "Full Stack Girl", description: "Termine um módulo", icon: Trophy, emoji: "🚀", color: "from-pink-400 to-pink-600", unlockCondition: (s) => s.modulesCompleted >= 1, progressFn: (s) => ({ current: Math.min(s.modulesCompleted, 1), target: 1 }), points: 300, rarity: "raro" },
    { id: 7, title: "Super Streak", description: "Estude por 7 dias seguidos", icon: Flame, emoji: "🔥", color: "from-red-400 to-red-600", unlockCondition: (s) => s.daysStreak >= 7, progressFn: (s) => ({ current: Math.min(s.daysStreak, 7), target: 7 }), points: 300, rarity: "épico" },
    { id: 8, title: "Mestra da Tecnologia", description: "Complete 3 módulos", icon: Crown, emoji: "👑", color: "from-indigo-400 to-indigo-600", unlockCondition: (s) => s.modulesCompleted >= 3, progressFn: (s) => ({ current: Math.min(s.modulesCompleted, 3), target: 3 }), points: 500, rarity: "lendário" },
  ],
  engineering: [
    { id: 1, title: "Primeira Construção", description: "Complete sua primeira lição", icon: Star, emoji: "🔧", color: "from-yellow-400 to-amber-500", unlockCondition: (s) => s.lessonsCompleted >= 1, progressFn: (s) => ({ current: Math.min(s.lessonsCompleted, 1), target: 1 }), points: 100, rarity: "comum" },
    { id: 2, title: "Projetista", description: "Complete 5 lições", icon: BookOpen, emoji: "📐", color: "from-blue-400 to-blue-600", unlockCondition: (s) => s.lessonsCompleted >= 5, progressFn: (s) => ({ current: Math.min(s.lessonsCompleted, 5), target: 5 }), points: 150, rarity: "comum" },
    { id: 3, title: "Primeiro Protótipo", description: "Complete seu primeiro experimento", icon: Wrench, emoji: "⚙️", color: "from-emerald-400 to-green-600", unlockCondition: (s) => s.experimentsCompleted >= 1, progressFn: (s) => ({ current: Math.min(s.experimentsCompleted, 1), target: 1 }), points: 150, rarity: "comum" },
    { id: 4, title: "Inventora", description: "Complete 3 experimentos", icon: Rocket, emoji: "🚀", color: "from-purple-400 to-purple-600", unlockCondition: (s) => s.experimentsCompleted >= 3, progressFn: (s) => ({ current: Math.min(s.experimentsCompleted, 3), target: 3 }), points: 200, rarity: "raro" },
    { id: 5, title: "Nível 5 Eng", description: "Chegue ao nível 5", icon: Medal, emoji: "🏅", color: "from-orange-400 to-orange-600", unlockCondition: (_, l) => l >= 5, progressFn: (_, l) => ({ current: Math.min(l, 5), target: 5 }), points: 250, rarity: "raro" },
    { id: 6, title: "Projeto Completo", description: "Termine um módulo", icon: Trophy, emoji: "🏗️", color: "from-pink-400 to-pink-600", unlockCondition: (s) => s.modulesCompleted >= 1, progressFn: (s) => ({ current: Math.min(s.modulesCompleted, 1), target: 1 }), points: 300, rarity: "raro" },
    { id: 7, title: "Super Streak", description: "Estude por 7 dias seguidos", icon: Flame, emoji: "🔥", color: "from-red-400 to-red-600", unlockCondition: (s) => s.daysStreak >= 7, progressFn: (s) => ({ current: Math.min(s.daysStreak, 7), target: 7 }), points: 300, rarity: "épico" },
    { id: 8, title: "Mestra da Engenharia", description: "Complete 3 módulos", icon: Crown, emoji: "👑", color: "from-indigo-400 to-indigo-600", unlockCondition: (s) => s.modulesCompleted >= 3, progressFn: (s) => ({ current: Math.min(s.modulesCompleted, 3), target: 3 }), points: 500, rarity: "lendário" },
  ],
  math: [
    { id: 1, title: "Primeiro Cálculo", description: "Complete sua primeira lição", icon: Star, emoji: "✨", color: "from-yellow-400 to-amber-500", unlockCondition: (s) => s.lessonsCompleted >= 1, progressFn: (s) => ({ current: Math.min(s.lessonsCompleted, 1), target: 1 }), points: 100, rarity: "comum" },
    { id: 2, title: "Calculadora Humana", description: "Complete 5 lições", icon: Calculator, emoji: "🧮", color: "from-blue-400 to-blue-600", unlockCondition: (s) => s.lessonsCompleted >= 5, progressFn: (s) => ({ current: Math.min(s.lessonsCompleted, 5), target: 5 }), points: 150, rarity: "comum" },
    { id: 3, title: "Primeira Equação", description: "Complete seu primeiro experimento", icon: Shapes, emoji: "📊", color: "from-emerald-400 to-green-600", unlockCondition: (s) => s.experimentsCompleted >= 1, progressFn: (s) => ({ current: Math.min(s.experimentsCompleted, 1), target: 1 }), points: 150, rarity: "comum" },
    { id: 4, title: "Gênio dos Números", description: "Complete 3 experimentos", icon: Zap, emoji: "⚡", color: "from-purple-400 to-purple-600", unlockCondition: (s) => s.experimentsCompleted >= 3, progressFn: (s) => ({ current: Math.min(s.experimentsCompleted, 3), target: 3 }), points: 200, rarity: "raro" },
    { id: 5, title: "Nível 5 Math", description: "Chegue ao nível 5", icon: Medal, emoji: "🏅", color: "from-orange-400 to-orange-600", unlockCondition: (_, l) => l >= 5, progressFn: (_, l) => ({ current: Math.min(l, 5), target: 5 }), points: 250, rarity: "raro" },
    { id: 6, title: "Teorema Provado", description: "Termine um módulo", icon: Trophy, emoji: "🎯", color: "from-pink-400 to-pink-600", unlockCondition: (s) => s.modulesCompleted >= 1, progressFn: (s) => ({ current: Math.min(s.modulesCompleted, 1), target: 1 }), points: 300, rarity: "raro" },
    { id: 7, title: "Super Streak", description: "Estude por 7 dias seguidos", icon: Flame, emoji: "🔥", color: "from-red-400 to-red-600", unlockCondition: (s) => s.daysStreak >= 7, progressFn: (s) => ({ current: Math.min(s.daysStreak, 7), target: 7 }), points: 300, rarity: "épico" },
    { id: 8, title: "Mestra da Matemática", description: "Complete 3 módulos", icon: Crown, emoji: "👑", color: "from-indigo-400 to-indigo-600", unlockCondition: (s) => s.modulesCompleted >= 3, progressFn: (s) => ({ current: Math.min(s.modulesCompleted, 3), target: 3 }), points: 500, rarity: "lendário" },
  ],
};

const rarityConfig = {
  "comum": { label: "Comum", bg: "bg-gray-100 dark:bg-gray-700", text: "text-gray-600 dark:text-gray-300", border: "border-gray-200 dark:border-gray-600" },
  "raro": { label: "Raro", bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-300", border: "border-blue-200 dark:border-blue-700" },
  "épico": { label: "Épico", bg: "bg-purple-50 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-300", border: "border-purple-200 dark:border-purple-700" },
  "lendário": { label: "Lendário", bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-300", border: "border-amber-200 dark:border-amber-700" },
};

export const Achievements = ({ userPoints, userLevel, stats, selectedArea }: AchievementsProps) => {
  const areaKey = selectedArea || "science";
  const achievements = (achievementsByArea[areaKey] || achievementsByArea.science).map((a) => ({
    ...a,
    unlocked: a.unlockCondition(stats, userLevel),
    progress: a.progressFn(stats, userLevel),
  }));

  const areaDisplayName = areaNames[areaKey] || "Ciência";
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalPoints = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      <div className="animate-slide-up">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">Conquistas</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Suas medalhas em {areaDisplayName} — continue desbloqueando!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up stagger-1">
        <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-amber-200 dark:border-amber-700">
          <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-1" />
          <p className="text-2xl font-black text-amber-600 dark:text-amber-300">{unlockedCount}/{achievements.length}</p>
          <p className="text-xs text-amber-500 dark:text-amber-400 font-semibold">Desbloqueadas</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
          <Sparkles className="w-6 h-6 text-purple-500 mx-auto mb-1" />
          <p className="text-2xl font-black text-purple-600 dark:text-purple-300">{totalPoints}</p>
          <p className="text-xs text-purple-500 dark:text-purple-400 font-semibold">Pontos ganhos</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700">
          <Star className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <p className="text-2xl font-black text-blue-600 dark:text-blue-300">{userLevel}</p>
          <p className="text-xs text-blue-500 dark:text-blue-400 font-semibold">Nível atual</p>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
          <p className="text-2xl font-black text-orange-600 dark:text-orange-300">{stats.daysStreak}</p>
          <p className="text-xs text-orange-500 dark:text-orange-400 font-semibold">Dias seguidos</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((achievement, i) => {
          const rarity = rarityConfig[achievement.rarity];
          const progressPercent = (achievement.progress.current / achievement.progress.target) * 100;

          return (
            <Card
              key={achievement.id}
              className={`p-5 transition-all duration-300 animate-pop-in border-2 dark:bg-gray-800/50 ${
                achievement.unlocked
                  ? `${rarity.border} shadow-lg hover:shadow-xl hover:scale-[1.01]`
                  : "border-gray-100 dark:border-gray-700 opacity-60"
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                  achievement.unlocked
                    ? `bg-gradient-to-br ${achievement.color}`
                    : "bg-gray-200 dark:bg-gray-700"
                }`}>
                  <span className={`text-2xl ${!achievement.unlocked ? "grayscale" : ""}`}>
                    {achievement.emoji}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`font-bold truncate ${
                      achievement.unlocked ? "text-gray-800 dark:text-white" : "text-gray-400 dark:text-gray-500"
                    }`}>
                      {achievement.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${rarity.bg} ${rarity.text}`}>
                      {rarity.label}
                    </span>
                  </div>

                  <p className={`text-sm mb-2 ${
                    achievement.unlocked ? "text-gray-500 dark:text-gray-400" : "text-gray-300 dark:text-gray-600"
                  }`}>
                    {achievement.description}
                  </p>

                  {!achievement.unlocked && (
                    <div className="flex items-center gap-2">
                      <Progress value={progressPercent} className="h-2 flex-1" />
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-bold">
                        {achievement.progress.current}/{achievement.progress.target}
                      </span>
                    </div>
                  )}

                  {achievement.unlocked && (
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                        +{achievement.points} XP ganhos
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {unlockedCount < achievements.length && (
        <Card className="p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white text-center animate-slide-up rounded-2xl">
          <Heart className="w-8 h-8 mx-auto mb-2 animate-float" />
          <p className="font-bold text-lg mb-1">
            Faltam {achievements.length - unlockedCount} conquistas!
          </p>
          <p className="text-white/80 text-sm">
            Continue estudando e desbloqueie todas as medalhas.
            Você consegue!
          </p>
        </Card>
      )}
    </div>
  );
};
