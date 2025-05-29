
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, BookOpen, Target, Zap } from "lucide-react";

interface DashboardProps {
  userPoints: number;
  userLevel: number;
}

export const Dashboard = ({ userPoints, userLevel }: DashboardProps) => {
  const nextLevelPoints = userLevel * 500;
  const progressPercentage = (userPoints % 500) / 5;

  const stats = [
    { label: "Módulos Concluídos", value: "12", icon: BookOpen, color: "bg-blue-500" },
    { label: "Experimentos Feitos", value: "8", icon: Zap, color: "bg-green-500" },
    { label: "Conquistas", value: "15", icon: Trophy, color: "bg-yellow-500" },
    { label: "Streak Diário", value: "7 dias", icon: Target, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Olá, Maria! 👋</h2>
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
            <span>{nextLevelPoints - (userPoints % 500)} pontos restantes</span>
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
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium">Física Quântica Básica</p>
                <p className="text-sm text-gray-600">3 de 5 lições completas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium">Programação com Python</p>
                <p className="text-sm text-gray-600">Novo módulo disponível!</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Cientista da Semana</h3>
          <div className="flex items-center space-x-4">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face"
              alt="Marie Curie"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold text-lg">Marie Curie</h4>
              <p className="text-gray-600 text-sm">Primeira mulher a ganhar um Nobel</p>
              <p className="text-purple-600 text-sm font-medium">Descubra sua história →</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
