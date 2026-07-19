import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Zap,
  Sparkles,
  Plus,
  Play,
  Clock,
  Flame,
  Trophy,
  Star,
  Target,
  TrendingUp,
  Award,
} from "lucide-react";

interface ProgressData {
  courseName: string;
  currentLesson: string;
  progress: number;
  estimatedTime: string;
  type: 'trilha' | 'modulo';
}

interface DashboardProps {
  userPoints: number;
  userLevel: number;
  userName?: string;
  selectedAreas?: string[];
  onAreaChange?: (area: string) => void;
  currentActiveArea?: string;
  onAddArea?: () => void;
  trilhaProgress?: ProgressData | null;
  moduloProgress?: ProgressData | null;
  onContinueTrilha?: () => void;
  onContinueModulo?: () => void;
  modulesCompleted?: number;
  experimentsCompleted?: number;
  studyHours?: number;
}

const areaInfo: Record<string, { icon: string; color: string; bgColor: string; name: string }> = {
  science: { icon: "🔬", color: "bg-emerald-500", bgColor: "bg-emerald-50", name: "Ciencia" },
  technology: { icon: "💻", color: "bg-blue-500", bgColor: "bg-blue-50", name: "Tecnologia" },
  engineering: { icon: "⚙️", color: "bg-amber-500", bgColor: "bg-amber-50", name: "Engenharia" },
  math: { icon: "📐", color: "bg-violet-500", bgColor: "bg-violet-50", name: "Matematica" },
};

const levelXpThresholds = [0, 100, 250, 500, 800, 1200, 1700, 2500, 3500, 5000];

const getLevelProgress = (points: number, level: number) => {
  const currentThreshold = levelXpThresholds[level - 1] || 0;
  const nextThreshold = levelXpThresholds[level] || currentThreshold + 500;
  const progress = ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

const getLevelTitle = (level: number) => {
  const titles = [
    "Curiosa", "Exploradora", "Descobridora", "Investigadora",
    "Pesquisadora", "Inventora", "Cientista", "Mestra", "Genio", "Lenda"
  ];
  return titles[Math.min(level - 1, titles.length - 1)];
};

export const Dashboard = ({
  userPoints,
  userLevel,
  userName = "Estudante",
  selectedAreas = ["science"],
  onAreaChange,
  currentActiveArea = "science",
  onAddArea,
  trilhaProgress,
  moduloProgress,
  onContinueTrilha,
  onContinueModulo,
  modulesCompleted = 0,
  experimentsCompleted = 0,
  studyHours = 0,
}: DashboardProps) => {
  const formatStudyHours = (hours: number) => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}min`;
    }
    return `${hours.toFixed(1)}h`;
  };

  const streak = Math.max(1, Math.floor(studyHours / 0.5));
  const dailyGoalPercent = Math.min(100, Math.round((studyHours % 1) * 100 / 0.5));
  const hasAnyProgress = trilhaProgress || moduloProgress;
  const xpProgress = getLevelProgress(userPoints, userLevel);

  return (
    <div className="space-y-6">
      {/* Greeting + Level */}
      <div className="animate-slide-up">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">
              Ola, {userName}!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Pronta para mais uma aventura em STEM hoje?</p>
          </div>

          {/* XP / Level Badge */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg animate-pulse-glow">
                <span className="text-2xl font-black text-white">{userLevel}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-yellow-900 shadow">
                LVL
              </div>
            </div>
            <div className="min-w-[140px]">
              <p className="text-sm font-bold text-purple-700 dark:text-purple-400">{getLevelTitle(userLevel)}</p>
              <div className="flex items-center gap-2">
                <Progress value={xpProgress} className="h-2.5 flex-1" />
                <span className="text-xs text-gray-500 font-semibold">{userPoints} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Streak + Daily Goal + Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 animate-pop-in stagger-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center animate-streak-fire">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-orange-600">{streak}</p>
              <p className="text-xs text-orange-500 font-semibold">dias seguidos</p>
            </div>
          </div>
        </Card>

        {/* Daily Goal */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 animate-pop-in stagger-2">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#e0e7ff" strokeWidth="4" />
                <circle
                  cx="24" cy="24" r="20" fill="none"
                  stroke="url(#goalGrad)" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(dailyGoalPercent / 100) * 125.6} 125.6`}
                />
                <defs>
                  <linearGradient id="goalGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <Target className="w-5 h-5 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <p className="text-2xl font-black text-blue-600">{dailyGoalPercent}%</p>
              <p className="text-xs text-blue-500 font-semibold">meta do dia</p>
            </div>
          </div>
        </Card>

        {/* Modules completed */}
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-200 animate-pop-in stagger-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-fuchsia-500 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-purple-600">{modulesCompleted}</p>
              <p className="text-xs text-purple-500 font-semibold">modulos completos</p>
            </div>
          </div>
        </Card>

        {/* Experiments */}
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 animate-pop-in stagger-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-600">{experimentsCompleted}</p>
              <p className="text-xs text-emerald-500 font-semibold">experimentos</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Area Selector */}
      <Card className="p-5 animate-slide-up stagger-2">
        <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2 uppercase tracking-wide">
          <Sparkles className="w-4 h-4 text-purple-500" />
          Suas Areas de Estudo
        </h3>
        <div className="flex flex-wrap gap-3">
          {selectedAreas.map((area) => {
            const info = areaInfo[area] || areaInfo.science;
            const isActive = area === currentActiveArea;

            return (
              <button
                key={area}
                onClick={() => onAreaChange?.(area)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 font-bold
                  ${isActive
                    ? `${info.color} text-white shadow-lg scale-105 ring-4 ring-offset-2 ring-purple-300`
                    : `${info.bgColor} text-gray-700 hover:scale-105 hover:shadow-md`}
                `}
              >
                <span className="text-xl">{info.icon}</span>
                <span>{info.name}</span>
              </button>
            );
          })}

          <button
            onClick={onAddArea}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-dashed border-purple-300 text-purple-400 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 font-bold"
          >
            <Plus className="w-5 h-5" />
            <span>Adicionar</span>
          </button>
        </div>
      </Card>

      {/* Continue Learning */}
      {hasAnyProgress && (
        <div className="animate-slide-up stagger-3">
          <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Play className="w-5 h-5 text-purple-500" />
            Continue Aprendendo
          </h3>

          <div className="space-y-4">
            {trilhaProgress && (
              <Card className="p-5 border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    onClick={onContinueTrilha}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-7 h-7 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-purple-600 uppercase font-bold tracking-wider">Trilha</p>
                      <h4 className="font-bold text-gray-800 text-lg">{trilhaProgress.courseName}</h4>
                      <p className="text-sm text-gray-500">
                        {trilhaProgress.currentLesson} · {trilhaProgress.estimatedTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-purple-600">{trilhaProgress.progress}%</p>
                      <Progress value={trilhaProgress.progress} className="h-2 w-24" />
                    </div>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 rounded-xl shadow-lg shadow-purple-200 group-hover:shadow-purple-300 transition-all">
                      <Play className="w-4 h-4 mr-2" />
                      Continuar
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {moduloProgress && (
              <Card className="p-5 border-l-4 border-l-pink-500 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    onClick={onContinueModulo}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Award className="w-7 h-7 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-xs text-pink-600 uppercase font-bold tracking-wider">Modulo</p>
                      <h4 className="font-bold text-gray-800 text-lg">{moduloProgress.courseName}</h4>
                      <p className="text-sm text-gray-500">
                        {moduloProgress.currentLesson} · {moduloProgress.estimatedTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-pink-600">{moduloProgress.progress}%</p>
                      <Progress value={moduloProgress.progress} className="h-2 w-24" />
                    </div>
                    <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 rounded-xl shadow-lg shadow-pink-200 group-hover:shadow-pink-300 transition-all">
                      <Play className="w-4 h-4 mr-2" />
                      Continuar
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions (when no progress) */}
      {!hasAnyProgress && (
        <Card className="p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white text-center animate-slide-up stagger-3">
          <div className="animate-float mb-4">
            <Sparkles className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-2xl font-extrabold mb-2">Comece sua jornada!</h3>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Escolha uma area acima e inicie sua trilha de aprendizado. Cada passo te leva mais perto de se tornar uma {getLevelTitle(userLevel + 1)}!
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <TrendingUp className="w-4 h-4" />
            <span>Ganhe XP, suba de nivel e desbloqueie conquistas</span>
          </div>
        </Card>
      )}

      {/* Achievements Preview */}
      <Card className="p-5 animate-slide-up stagger-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Conquistas Recentes
          </h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { icon: "🌟", label: "Primeira aula", unlocked: modulesCompleted > 0 || experimentsCompleted > 0 },
            { icon: "🔥", label: "3 dias seguidos", unlocked: streak >= 3 },
            { icon: "🧪", label: "Cientista junior", unlocked: experimentsCompleted >= 3 },
            { icon: "📚", label: "Leitora voraz", unlocked: modulesCompleted >= 2 },
            { icon: "⚡", label: "Super streak", unlocked: streak >= 7 },
            { icon: "👑", label: "Mestra", unlocked: userLevel >= 5 },
          ].map((achievement, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-b from-yellow-50 to-amber-50 border border-yellow-200'
                  : 'bg-gray-50 border border-gray-100 opacity-40 grayscale'
              }`}
            >
              <span className="text-3xl">{achievement.icon}</span>
              <span className={`text-[10px] font-bold text-center leading-tight ${
                achievement.unlocked ? 'text-amber-700' : 'text-gray-400'
              }`}>
                {achievement.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Study time */}
      <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 animate-slide-up stagger-5">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-indigo-500" />
          <p className="text-sm text-indigo-700">
            <span className="font-bold">{formatStudyHours(studyHours)}</span> de estudo total
            {studyHours > 0 && " — continue assim, voce esta indo muito bem!"}
          </p>
          <Star className="w-4 h-4 text-yellow-400 ml-auto" />
        </div>
      </Card>
    </div>
  );
};
