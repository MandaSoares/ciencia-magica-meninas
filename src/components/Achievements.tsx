
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Medal, Crown, Target, Zap } from "lucide-react";

interface AchievementsProps {
  userPoints: number;
  userLevel: number;
}

export const Achievements = ({ userPoints, userLevel }: AchievementsProps) => {
  const achievements = [
    {
      id: 1,
      title: "Primeira Descoberta",
      description: "Complete seu primeiro módulo",
      icon: Star,
      color: "bg-yellow-500",
      unlocked: true,
      points: 100,
      rarity: "comum"
    },
    {
      id: 2,
      title: "Cientista Curiosa",
      description: "Leia sobre 3 cientistas inspiradoras",
      icon: Trophy,
      color: "bg-purple-500",
      unlocked: true,
      points: 150,
      rarity: "comum"
    },
    {
      id: 3,
      title: "Experiente de Laboratório",
      description: "Complete 5 experimentos virtuais",
      icon: Zap,
      color: "bg-blue-500",
      unlocked: true,
      points: 200,
      rarity: "raro"
    },
    {
      id: 4,
      title: "Nível 5 Alcançado",
      description: "Chegue ao nível 5",
      icon: Medal,
      color: "bg-green-500",
      unlocked: false,
      points: 250,
      rarity: "raro"
    },
    {
      id: 5,
      title: "Mestre da Ciência",
      description: "Complete todos os módulos disponíveis",
      icon: Crown,
      color: "bg-red-500",
      unlocked: false,
      points: 500,
      rarity: "épico"
    },
    {
      id: 6,
      title: "Streak de 30 Dias",
      description: "Estude por 30 dias consecutivos",
      icon: Target,
      color: "bg-pink-500",
      unlocked: false,
      points: 300,
      rarity: "épico"
    }
  ];

  const stats = [
    { label: "Total de Pontos", value: userPoints.toLocaleString() },
    { label: "Nível Atual", value: userLevel },
    { label: "Conquistas Desbloqueadas", value: achievements.filter(a => a.unlocked).length },
    { label: "Rank Global", value: "#147" }
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
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600 text-sm">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <Card
              key={achievement.id}
              className={`p-6 transition-all duration-300 ${
                achievement.unlocked
                  ? "bg-white shadow-lg hover:shadow-xl"
                  : "bg-gray-50 opacity-60"
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
                  <span className="text-green-600 text-sm font-medium">Desbloqueado!</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Próximas Conquistas</h3>
        <div className="space-y-4">
          {achievements.filter(a => !a.unlocked).slice(0, 3).map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div key={achievement.id} className="flex items-center space-x-4 p-3 bg-white rounded-lg">
                <div className={`w-10 h-10 ${achievement.color} rounded-lg flex items-center justify-center opacity-70`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">{achievement.points}</div>
                  <div className="text-xs text-gray-500">pontos</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
