import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Target, Zap, Sparkles, Plus, Play } from "lucide-react";

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
  currentActiveArea = "science",
  onAddArea,
  trilhaProgress,
  moduloProgress,
  onContinueTrilha,
  onContinueModulo,
  modulesCompleted = 0,
  experimentsCompleted = 0
}: DashboardProps) => {

  const stats = [
    { label: "Módulos Completos", value: modulesCompleted.toString(), icon: BookOpen, color: "bg-blue-500" },
    { label: "Experimentos Feitos", value: experimentsCompleted.toString(), icon: Zap, color: "bg-green-500" },
  ];


  const hasAnyProgress = trilhaProgress || moduloProgress;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Olá, {userName}! 👋</h2>
        <p className="text-gray-600">Pronta para mais uma aventura em STEM hoje?</p>
      </div>

      {/* Seletor de Área - Estilo Duolingo */}
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
              </button>
            );
          })}
          
          {/* Botão de adicionar área */}
          <button
            onClick={onAddArea}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-purple-400 hover:text-purple-500 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Adicionar</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Clique para alternar entre as áreas. Seu progresso é salvo separadamente!
        </p>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Continue Aprendendo - Só aparece se tiver progresso */}
      {hasAnyProgress && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Continue Aprendendo</h3>
          
          <div className="space-y-4">
            {/* Progresso da Trilha */}
            {trilhaProgress && (
              <div className="border-l-4 border-purple-500 bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <Progress value={trilhaProgress.progress} className="flex-1 h-2 mr-4" />
                  <span className="text-sm text-gray-500">{trilhaProgress.progress}%</span>
                </div>
                
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-7 h-7 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-purple-600 uppercase font-medium">TRILHA</p>
                      <h4 className="font-bold text-gray-800">{trilhaProgress.courseName}</h4>
                      <p className="text-sm text-gray-600">
                        Aula atual: {trilhaProgress.currentLesson} - {trilhaProgress.estimatedTime}
                      </p>
                    </div>
                  </div>
                  
                  <Button onClick={onContinueTrilha} className="bg-purple-500 hover:bg-purple-600 text-white px-6">
                    <Play className="w-4 h-4 mr-2" />
                    Continuar Trilha
                  </Button>
                </div>
              </div>
            )}

            {/* Progresso do Módulo */}
            {moduloProgress && (
              <div className="border-l-4 border-pink-500 bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <Progress value={moduloProgress.progress} className="flex-1 h-2 mr-4" />
                  <span className="text-sm text-gray-500">{moduloProgress.progress}%</span>
                </div>
                
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-7 h-7 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-xs text-pink-600 uppercase font-medium">MÓDULO</p>
                      <h4 className="font-bold text-gray-800">{moduloProgress.courseName}</h4>
                      <p className="text-sm text-gray-600">
                        Aula atual: {moduloProgress.currentLesson} - {moduloProgress.estimatedTime}
                      </p>
                    </div>
                  </div>
                  
                  <Button onClick={onContinueModulo} className="bg-pink-500 hover:bg-pink-600 text-white px-6">
                    <Play className="w-4 h-4 mr-2" />
                    Continuar Módulo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
