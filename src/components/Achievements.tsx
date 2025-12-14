import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Medal, Crown, Target, Zap, BookOpen, Beaker, Code, Cpu, Wrench, Calculator, Microscope, Brain, Rocket, Shapes } from "lucide-react";

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
  "science": "Ciência",
  "technology": "Tecnologia",
  "engineering": "Engenharia",
  "math": "Matemática",
};

const achievementsByArea: Record<string, Array<{
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  unlockCondition: (stats: UserStats, level: number) => boolean;
  points: number;
  rarity: string;
}>> = {
  science: [
    { id: 1, title: "Primeira Descoberta", description: "Complete sua primeira lição de Ciência", icon: Star, color: "bg-yellow-500", unlockCondition: (s) => s.lessonsCompleted >= 1, points: 100, rarity: "comum" },
    { id: 2, title: "Exploradora Curiosa", description: "Complete 5 lições de Ciência", icon: BookOpen, color: "bg-blue-500", unlockCondition: (s) => s.lessonsCompleted >= 5, points: 150, rarity: "comum" },
    { id: 3, title: "Cientista Iniciante", description: "Complete seu primeiro experimento", icon: Beaker, color: "bg-green-500", unlockCondition: (s) => s.experimentsCompleted >= 1, points: 150, rarity: "comum" },
    { id: 4, title: "Mestre de Laboratório", description: "Complete 5 experimentos", icon: Microscope, color: "bg-purple-500", unlockCondition: (s) => s.experimentsCompleted >= 5, points: 200, rarity: "raro" },
    { id: 5, title: "Nível 5 Alcançado", description: "Chegue ao nível 5 em Ciência", icon: Medal, color: "bg-orange-500", unlockCondition: (s, l) => l >= 5, points: 250, rarity: "raro" },
    { id: 6, title: "Módulo Completo", description: "Termine um módulo de Ciência", icon: Trophy, color: "bg-pink-500", unlockCondition: (s) => s.modulesCompleted >= 1, points: 300, rarity: "raro" },
    { id: 7, title: "Streak de 7 Dias", description: "Estude Ciência por 7 dias", icon: Target, color: "bg-red-500", unlockCondition: (s) => s.daysStreak >= 7, points: 300, rarity: "épico" },
    { id: 8, title: "Mestre da Ciência", description: "Complete 3 módulos de Ciência", icon: Crown, color: "bg-indigo-500", unlockCondition: (s) => s.modulesCompleted >= 3, points: 500, rarity: "épico" },
  ],
  technology: [
    { id: 1, title: "Hello World", description: "Complete sua primeira lição de Tecnologia", icon: Star, color: "bg-yellow-500", unlockCondition: (s) => s.lessonsCompleted >= 1, points: 100, rarity: "comum" },
    { id: 2, title: "Debug Master", description: "Complete 5 lições de Tecnologia", icon: Code, color: "bg-blue-500", unlockCondition: (s) => s.lessonsCompleted >= 5, points: 150, rarity: "comum" },
    { id: 3, title: "Primeiro Programa", description: "Complete seu primeiro experimento tech", icon: Cpu, color: "bg-green-500", unlockCondition: (s) => s.experimentsCompleted >= 1, points: 150, rarity: "comum" },
    { id: 4, title: "Hacker do Bem", description: "Complete 5 experimentos", icon: Brain, color: "bg-purple-500", unlockCondition: (s) => s.experimentsCompleted >= 5, points: 200, rarity: "raro" },
    { id: 5, title: "Nível 5 Tech", description: "Chegue ao nível 5 em Tecnologia", icon: Medal, color: "bg-orange-500", unlockCondition: (s, l) => l >= 5, points: 250, rarity: "raro" },
    { id: 6, title: "Full Stack Girl", description: "Termine um módulo de Tecnologia", icon: Trophy, color: "bg-pink-500", unlockCondition: (s) => s.modulesCompleted >= 1, points: 300, rarity: "raro" },
    { id: 7, title: "Streak de 7 Dias", description: "Estude Tecnologia por 7 dias", icon: Target, color: "bg-red-500", unlockCondition: (s) => s.daysStreak >= 7, points: 300, rarity: "épico" },
    { id: 8, title: "Mestre da Tecnologia", description: "Complete 3 módulos de Tech", icon: Crown, color: "bg-indigo-500", unlockCondition: (s) => s.modulesCompleted >= 3, points: 500, rarity: "épico" },
  ],
  engineering: [
    { id: 1, title: "Primeira Construção", description: "Complete sua primeira lição de Engenharia", icon: Star, color: "bg-yellow-500", unlockCondition: (s) => s.lessonsCompleted >= 1, points: 100, rarity: "comum" },
    { id: 2, title: "Projetista", description: "Complete 5 lições de Engenharia", icon: BookOpen, color: "bg-blue-500", unlockCondition: (s) => s.lessonsCompleted >= 5, points: 150, rarity: "comum" },
    { id: 3, title: "Primeiro Protótipo", description: "Complete seu primeiro experimento", icon: Wrench, color: "bg-green-500", unlockCondition: (s) => s.experimentsCompleted >= 1, points: 150, rarity: "comum" },
    { id: 4, title: "Inventora", description: "Complete 5 experimentos", icon: Rocket, color: "bg-purple-500", unlockCondition: (s) => s.experimentsCompleted >= 5, points: 200, rarity: "raro" },
    { id: 5, title: "Nível 5 Eng", description: "Chegue ao nível 5 em Engenharia", icon: Medal, color: "bg-orange-500", unlockCondition: (s, l) => l >= 5, points: 250, rarity: "raro" },
    { id: 6, title: "Projeto Completo", description: "Termine um módulo de Engenharia", icon: Trophy, color: "bg-pink-500", unlockCondition: (s) => s.modulesCompleted >= 1, points: 300, rarity: "raro" },
    { id: 7, title: "Streak de 7 Dias", description: "Estude Engenharia por 7 dias", icon: Target, color: "bg-red-500", unlockCondition: (s) => s.daysStreak >= 7, points: 300, rarity: "épico" },
    { id: 8, title: "Mestre da Engenharia", description: "Complete 3 módulos de Eng", icon: Crown, color: "bg-indigo-500", unlockCondition: (s) => s.modulesCompleted >= 3, points: 500, rarity: "épico" },
  ],
  math: [
    { id: 1, title: "Primeiro Cálculo", description: "Complete sua primeira lição de Matemática", icon: Star, color: "bg-yellow-500", unlockCondition: (s) => s.lessonsCompleted >= 1, points: 100, rarity: "comum" },
    { id: 2, title: "Calculadora Humana", description: "Complete 5 lições de Matemática", icon: Calculator, color: "bg-blue-500", unlockCondition: (s) => s.lessonsCompleted >= 5, points: 150, rarity: "comum" },
    { id: 3, title: "Primeira Equação", description: "Complete seu primeiro experimento", icon: Shapes, color: "bg-green-500", unlockCondition: (s) => s.experimentsCompleted >= 1, points: 150, rarity: "comum" },
    { id: 4, title: "Gênio dos Números", description: "Complete 5 experimentos", icon: Zap, color: "bg-purple-500", unlockCondition: (s) => s.experimentsCompleted >= 5, points: 200, rarity: "raro" },
    { id: 5, title: "Nível 5 Math", description: "Chegue ao nível 5 em Matemática", icon: Medal, color: "bg-orange-500", unlockCondition: (s, l) => l >= 5, points: 250, rarity: "raro" },
    { id: 6, title: "Teorema Provado", description: "Termine um módulo de Matemática", icon: Trophy, color: "bg-pink-500", unlockCondition: (s) => s.modulesCompleted >= 1, points: 300, rarity: "raro" },
    { id: 7, title: "Streak de 7 Dias", description: "Estude Matemática por 7 dias", icon: Target, color: "bg-red-500", unlockCondition: (s) => s.daysStreak >= 7, points: 300, rarity: "épico" },
    { id: 8, title: "Mestre da Matemática", description: "Complete 3 módulos de Math", icon: Crown, color: "bg-indigo-500", unlockCondition: (s) => s.modulesCompleted >= 3, points: 500, rarity: "épico" },
  ],
};

export const Achievements = ({ userPoints, userLevel, stats, selectedArea }: AchievementsProps) => {
  const areaKey = selectedArea || "science";
  const achievements = (achievementsByArea[areaKey] || achievementsByArea.science).map(a => ({
    ...a,
    unlocked: a.unlockCondition(stats, userLevel)
  }));

  const areaDisplayName = areaNames[areaKey] || "Ciência";
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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Conquistas de {areaDisplayName}</h2>
        <p className="text-gray-600">Celebre suas vitórias em {areaDisplayName}!</p>
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
