import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, BookOpen, Target, Zap } from "lucide-react";
import { getRandomScientistOfWeek, getAreaLabel } from "@/data/scientistsData";

interface DashboardProps {
  userPoints: number;
  userLevel: number;
  userName?: string;
  selectedArea?: string | null;
}

export const Dashboard = ({ userPoints, userLevel, userName = "Estudante", selectedArea }: DashboardProps) => {
  const nextLevelPoints = userLevel * 500;
  const progressPercentage = (userPoints % 500) / 5;
  const area = selectedArea || "Ciência";
  const scientistOfWeek = getRandomScientistOfWeek(area);
  const areaLabel = getAreaLabel(area);

  const stats = [
    { label: "Módulos Concluídos", value: "0", icon: BookOpen, color: "bg-blue-500" },
    { label: "Experimentos Feitos", value: "0", icon: Zap, color: "bg-green-500" },
    { label: "Conquistas", value: "0", icon: Trophy, color: "bg-yellow-500" },
    { label: "Streak Diário", value: "1 dia", icon: Target, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Olá, {userName}! 👋</h2>
        <p className="text-gray-600">Pronta para mais uma aventura científica hoje?</p>
      </div>

      <Card className="p-6 bg-gradient-to-r from-purple-400 to-pink-400 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">Seu Progresso</h3>
            <p className="opacity-90">Nível {userLevel} • {userPoints} pontos</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Próximo nível</span>
            <span>{Math.max(0, nextLevelPoints - (userPoints % 500))} pontos restantes</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Continue Aprendendo</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium">Comece sua primeira lição!</p>
                <p className="text-sm text-gray-600">Clique em "Trilha" para começar</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{areaLabel.singular} da Semana</h3>
          <div className="flex items-center space-x-4">
            <img
              src={scientistOfWeek.image}
              alt={scientistOfWeek.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold text-lg">{scientistOfWeek.name}</h4>
              <p className="text-gray-600 text-sm">{scientistOfWeek.achievement}</p>
              <p className="text-purple-600 text-sm font-medium">Descubra sua história →</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
