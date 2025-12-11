import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, BookOpen, Target, Zap, ArrowRight, Sparkles } from "lucide-react";

interface DashboardProps {
  userPoints: number;
  userLevel: number;
  userName?: string;
  selectedAreas?: string[];
  onAreaChange?: (area: string) => void;
  currentActiveArea?: string;
}

const areaInfo: Record<string, { icon: string; color: string; name: string }> = {
  science: { icon: "🔬", color: "bg-green-500", name: "Ciência" },
  technology: { icon: "💻", color: "bg-blue-500", name: "Tecnologia" },
  engineering: { icon: "⚙️", color: "bg-orange-500", name: "Engenharia" },
  math: { icon: "📐", color: "bg-purple-500", name: "Matemática" },
};

export const Dashboard = ({ 
  userPoints, 
  userLevel, 
  userName = "Estudante", 
  selectedAreas = ["science"],
  onAreaChange,
  currentActiveArea = "science"
}: DashboardProps) => {
  const nextLevelPoints = userLevel * 500;
  const progressPercentage = (userPoints % 500) / 5;

  const stats = [
    { label: "Lições Completadas", value: "0", icon: BookOpen, color: "bg-blue-500" },
    { label: "Experimentos Feitos", value: "0", icon: Zap, color: "bg-green-500" },
    { label: "Conquistas", value: "0", icon: Trophy, color: "bg-yellow-500" },
    { label: "Streak Diário", value: "1 dia", icon: Target, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Olá, {userName}! 👋</h2>
        <p className="text-gray-600">Pronta para mais uma aventura em STEM hoje?</p>
      </div>

      {/* Seletor de Área - Estilo Duolingo */}
      {selectedAreas.length > 1 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Suas Áreas de Estudo
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
                    flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200
                    ${isActive 
                      ? `${info.color} text-white shadow-lg scale-105` 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                  `}
                >
                  <span className="text-xl">{info.icon}</span>
                  <span className="font-medium">{info.name}</span>
                  {isActive && <ArrowRight className="w-4 h-4 ml-1" />}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Clique para alternar entre as áreas. Seu progresso é salvo separadamente!
          </p>
        </Card>
      )}

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
                <p className="font-medium">Comece pela Trilha!</p>
                <p className="text-sm text-gray-600">Conteúdo introdutório rápido e gamificado</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium">Depois, explore os Módulos</p>
                <p className="text-sm text-gray-600">Cursos completos com projetos e certificados</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Diferença: Trilha vs Módulos</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-1">📚 Trilha</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Introdutória</li>
                <li>• Rápida e linear</li>
                <li>• Gamificada</li>
                <li>• Despertar interesse</li>
              </ul>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-700 mb-1">🎓 Módulos</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Cursos completos</li>
                <li>• Mais profundos</li>
                <li>• Projeto final</li>
                <li>• Certificado!</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
