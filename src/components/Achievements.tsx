import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Medal, Crown, Target, Zap, BookOpen, Beaker } from "lucide-react";

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
}

export const Achievements = ({ userPoints, userLevel, stats }: AchievementsProps) => {
  const achievements = [
    {
      id: 1,
      title: "Primeira Descoberta",
      description: "Complete sua primeira lição",
      icon: Star,
      color: "bg-yellow-500",
      unlocked: stats.lessonsCompleted >= 1,
      points: 100,
      rarity: "comum"
    },
    {
      id: 2,
      title: "Exploradora Curiosa",
      description: "Complete 5 lições",
      icon: BookOpen,
      color: "bg-blue-500",
      unlocked: stats.lessonsCompleted >= 5,
      points: 150,
      rarity: "comum"
    },
    {
      id: 3,
      title: "Cientista Iniciante",
      description: "Complete seu primeiro experimento",
      icon: Beaker,
      color: "bg-green-500",
      unlocked: stats.experimentsCompleted >= 1,
      points: 150,
      rarity: "comum"
    },
    {
      id: 4,
      title: "Mestre de Laboratório",
      description: "Complete 5 experimentos",
      icon: Zap,
      color: "bg-purple-500",
      unlocked: stats.experimentsCompleted >= 5,
      points: 200,
      rarity: "raro"
    },
    {
      id: 5,
      title: "Nível 5 Alcançado",
      description: "Chegue ao nível 5",
      icon: Medal,
      color: "bg-orange-500",
      unlocked: userLevel >= 5,
      points: 250,
      rarity: "raro"
    },
    {
      id: 6,
      title: "Módulo Completo",
      description: "Termine um módulo inteiro",
      icon: Trophy,
      color: "bg-pink-500",
      unlocked: stats.modulesCompleted >= 1,
      points: 300,
      rarity: "raro"
    },
    {
      id: 7,
      title: "Streak de 7 Dias",
      description: "Estude por 7 dias consecutivos",
      icon: Target,
      color: "bg-red-500",
      unlocked: stats.daysStreak >= 7,
      points: 300,
      rarity: "épico"
    },
    {
      id: 8,
      title: "Mestre da Ciência",
      description: "Complete 3 módulos",
      icon: Crown,
      color: "bg-indigo-500",
      unlocked: stats.modulesCompleted >= 3,
      points: 500,
      rarity: "épico"
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const displayStats = [
    { label: "Total de Pontos", value: userPoints.toLocaleString() },
    { label: "Nível Atual", value: userLevel },
    { label: "Conquistas", value: `${unlockedCount}/${achievements.length}` },
    { label: "Lições Completas", value: stats.lessonsCompleted }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "comum": return "bg-gray-100 text-gray-700";
      case "raro": return "bg-blue-100 text-blue-700";
      case "épico": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Conquistas</h2>
        <p className="text-gray-600">Celebre suas vitórias científicas!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => (
          <Card key={index} className="p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600 text-sm">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <Card
              key={achievement.id}
              className={`p-6 transition-all duration-300 ${
                achievement.unlocked ? "bg-white shadow-lg" : "bg-gray-50 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${achievement.color} rounded-lg flex items-center justify-center ${
                  !achievement.unlocked && "grayscale"
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <Badge className={getRarityColor(achievement.rarity)}>
                  {achievement.rarity}
                </Badge>
              </div>

              <h3 className={`text-lg font-semibold mb-2 ${
                achievement.unlocked ? "text-gray-800" : "text-gray-500"
              }`}>
                {achievement.title}
              </h3>

              <p className={`text-sm mb-4 ${
                achievement.unlocked ? "text-gray-600" : "text-gray-400"
              }`}>
                {achievement.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className={`w-4 h-4 ${
                    achievement.unlocked ? "text-yellow-500" : "text-gray-400"
                  }`} />
                  <span className={`text-sm font-medium ${
                    achievement.unlocked ? "text-yellow-600" : "text-gray-400"
                  }`}>
                    {achievement.points} pts
                  </span>
                </div>
                {achievement.unlocked && (
                  <span className="text-green-600 text-sm font-medium">✓</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
