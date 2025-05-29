
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Atom, 
  Microscope, 
  Dna, 
  Rocket, 
  Cpu, 
  Zap, 
  Star, 
  Lock, 
  CheckCircle,
  Crown,
  Award
} from "lucide-react";

interface LearningPathProps {
  onPointsEarned: (points: number) => void;
}

export const LearningPath = ({ onPointsEarned }: LearningPathProps) => {
  const [completedLevels, setCompletedLevels] = useState(new Set([1]));
  const [currentLevel, setCurrentLevel] = useState(1);

  const pathLevels = [
    {
      id: 1,
      title: "Primeiros Passos",
      description: "Método científico básico",
      icon: Star,
      difficulty: "Iniciante",
      points: 50,
      color: "bg-green-500",
      position: { x: 50, y: 90 }
    },
    {
      id: 2,
      title: "Átomos Mágicos",
      description: "Estrutura da matéria",
      icon: Atom,
      difficulty: "Iniciante",
      points: 75,
      color: "bg-blue-500",
      position: { x: 20, y: 75 }
    },
    {
      id: 3,
      title: "Microscópio Aventura",
      description: "Mundo microscópico",
      icon: Microscope,
      difficulty: "Iniciante",
      points: 100,
      color: "bg-purple-500",
      position: { x: 80, y: 60 }
    },
    {
      id: 4,
      title: "DNA Secreto",
      description: "Genética divertida",
      icon: Dna,
      difficulty: "Intermediário",
      points: 125,
      color: "bg-pink-500",
      position: { x: 30, y: 45 }
    },
    {
      id: 5,
      title: "Energia Elétrica",
      description: "Circuitos e eletricidade",
      icon: Zap,
      difficulty: "Intermediário",
      points: 150,
      color: "bg-yellow-500",
      position: { x: 70, y: 30 }
    },
    {
      id: 6,
      title: "Programação Básica",
      description: "Primeiros códigos",
      icon: Cpu,
      difficulty: "Intermediário",
      points: 175,
      color: "bg-indigo-500",
      position: { x: 40, y: 15 }
    },
    {
      id: 7,
      title: "Missão Espacial",
      description: "Astronomia e foguetes",
      icon: Rocket,
      difficulty: "Avançado",
      points: 200,
      color: "bg-red-500",
      position: { x: 50, y: 5 }
    }
  ];

  const startLevel = (levelId: number) => {
    const level = pathLevels.find(l => l.id === levelId);
    if (level && (completedLevels.has(levelId - 1) || levelId === 1)) {
      setCurrentLevel(levelId);
      setCompletedLevels(prev => new Set([...prev, levelId]));
      onPointsEarned(level.points);
      console.log(`Nível ${levelId} iniciado: ${level.title}`);
    }
  };

  const isLevelUnlocked = (levelId: number) => {
    return levelId === 1 || completedLevels.has(levelId - 1);
  };

  const isLevelCompleted = (levelId: number) => {
    return completedLevels.has(levelId);
  };

  const getOverallProgress = () => {
    return (completedLevels.size / pathLevels.length) * 100;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Trilha da Descoberta</h2>
        <p className="text-gray-600 mb-4">Siga o caminho e descubra os segredos da ciência!</p>
        
        <Card className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-700">Progresso Geral</span>
            <span className="text-sm font-medium text-purple-600">
              {completedLevels.size} de {pathLevels.length} níveis
            </span>
          </div>
          <Progress value={getOverallProgress()} className="h-3" />
        </Card>
      </div>

      {/* Trilha Visual */}
      <div className="relative h-96 bg-gradient-to-b from-blue-50 to-green-50 rounded-2xl overflow-hidden border-4 border-purple-200">
        {/* Linha conectora */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {pathLevels.slice(0, -1).map((level, index) => {
            const nextLevel = pathLevels[index + 1];
            return (
              <line
                key={`line-${level.id}`}
                x1={`${level.position.x}%`}
                y1={`${level.position.y}%`}
                x2={`${nextLevel.position.x}%`}
                y2={`${nextLevel.position.y}%`}
                stroke={isLevelCompleted(nextLevel.id) ? "#10b981" : "#d1d5db"}
                strokeWidth="4"
                strokeDasharray={isLevelCompleted(nextLevel.id) ? "0" : "8,4"}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {/* Níveis */}
        {pathLevels.map((level) => {
          const Icon = level.icon;
          const unlocked = isLevelUnlocked(level.id);
          const completed = isLevelCompleted(level.id);
          
          return (
            <div
              key={level.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `${level.position.x}%`, 
                top: `${level.position.y}%`,
                zIndex: 2
              }}
            >
              <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => startLevel(level.id)}
                  disabled={!unlocked}
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center
                    transition-all duration-300 hover:scale-110 shadow-lg
                    ${completed ? 'bg-green-500 text-white ring-4 ring-green-200' : 
                      unlocked ? `${level.color} text-white hover:shadow-xl` : 
                      'bg-gray-300 text-gray-500'}
                  `}
                >
                  {completed ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : unlocked ? (
                    <Icon className="w-8 h-8" />
                  ) : (
                    <Lock className="w-6 h-6" />
                  )}
                </button>
                
                <div className="text-center bg-white px-3 py-1 rounded-full shadow-md border-2 border-purple-200">
                  <p className="text-xs font-semibold text-gray-700">{level.title}</p>
                  <p className="text-xs text-gray-500">{level.points}pts</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Decorações */}
        <div className="absolute top-4 right-4">
          <Crown className="w-8 h-8 text-yellow-500" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Award className="w-6 h-6 text-purple-500" />
        </div>
      </div>

      {/* Detalhes do Nível Atual */}
      {currentLevel && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center space-x-4">
            {(() => {
              const level = pathLevels.find(l => l.id === currentLevel);
              if (!level) return null;
              const Icon = level.icon;
              return (
                <>
                  <div className={`w-16 h-16 ${level.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{level.title}</h3>
                    <p className="text-gray-600">{level.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {level.difficulty}
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        +{level.points} pontos
                      </span>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Continuar Lição
                  </Button>
                </>
              );
            })()}
          </div>
        </Card>
      )}
    </div>
  );
};
