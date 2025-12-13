import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Star, 
  Lock, 
  CheckCircle,
  Crown,
  Sparkles,
  Brain,
  Calculator,
  Smartphone,
  Wrench,
  Beaker,
  Code,
  Heart,
  Trophy,
  Bot,
  Shapes,
  Leaf,
  Rocket,
  type LucideIcon
} from "lucide-react";
import { getPathByArea, getAreaName, PathLevel } from "@/data/learningPathData";
import { LessonContent } from "./LessonContent";

interface LearningPathProps {
  onPointsEarned: (points: number) => void;
  selectedArea: string;
  onLessonComplete: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  Star,
  Sparkles,
  Brain,
  Calculator,
  Smartphone,
  Wrench,
  Beaker,
  Code,
  Heart,
  Trophy,
  Bot,
  Shapes,
  Leaf,
  Rocket,
  Crown,
};

export const LearningPath = ({ onPointsEarned, selectedArea, onLessonComplete }: LearningPathProps) => {
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [showLesson, setShowLesson] = useState(false);

  const pathLevels = getPathByArea(selectedArea);
  const areaName = getAreaName(selectedArea);

  const startLevel = (levelId: number) => {
    if (isLevelUnlocked(levelId)) {
      setCurrentLevel(levelId);
      setShowLesson(true);
    }
  };

  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    return completedLevels.has(levelId - 1);
  };

  const isLevelCompleted = (levelId: number) => {
    return completedLevels.has(levelId);
  };

  const getOverallProgress = () => {
    return (completedLevels.size / pathLevels.length) * 100;
  };

  const handleLessonComplete = () => {
    if (currentLevel) {
      const level = pathLevels.find(l => l.id === currentLevel);
      if (level) {
        setCompletedLevels(prev => new Set([...prev, currentLevel]));
        onPointsEarned(level.points);
        setShowLesson(false);
        setCurrentLevel(null);
        onLessonComplete();
      }
    }
  };

  const currentLevelData = currentLevel ? pathLevels.find(l => l.id === currentLevel) : null;

  if (showLesson && currentLevelData) {
    return (
      <LessonContent
        lessonTitle={currentLevelData.title}
        lessonSteps={currentLevelData.lessons}
        onComplete={handleLessonComplete}
        onBack={() => {
          setShowLesson(false);
          setCurrentLevel(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Trilha de {areaName}</h2>
        <p className="text-gray-600 mb-4">Conteúdo introdutório para despertar seu interesse em {areaName.toLowerCase()}!</p>
        
        <Card className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-700">Progresso Geral</span>
            <span className="text-sm font-medium text-purple-600">
              {completedLevels.size} de {pathLevels.length} níveis
            </span>
          </div>
          <Progress value={getOverallProgress()} className="h-3" />
          <p className="text-xs text-gray-500 mt-2">Complete a trilha para desbloquear os Módulos avançados!</p>
        </Card>
      </div>

      {/* Trilha Visual Linear */}
      <div className="relative bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 rounded-2xl overflow-hidden border-4 border-purple-200 p-6">
        {/* Linha central */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-300 via-pink-300 to-blue-300 transform -translate-x-1/2" />

        <div className="relative space-y-4">
          {pathLevels.map((level, index) => {
            const IconComponent = iconMap[level.icon] || Star;
            const unlocked = isLevelUnlocked(level.id);
            const completed = isLevelCompleted(level.id);
            const isLeft = index % 2 === 0;
            
            return (
              <div
                key={level.id}
                className={`flex items-center gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Card de conteúdo */}
                <div className={`flex-1 ${isLeft ? 'text-right pr-4' : 'text-left pl-4'}`}>
                  <Card 
                    className={`inline-block p-4 max-w-sm transition-all ${
                      unlocked ? 'hover:shadow-lg cursor-pointer' : 'opacity-60'
                    } ${completed ? 'bg-green-50 border-green-200' : ''}`}
                    onClick={() => unlocked && startLevel(level.id)}
                  >
                    <div className={`flex items-start gap-3 ${isLeft ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        completed ? 'bg-green-500' : unlocked ? level.color : 'bg-gray-300'
                      }`}>
                        {completed ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : unlocked ? (
                          <IconComponent className="w-6 h-6 text-white" />
                        ) : (
                          <Lock className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className={isLeft ? 'text-right' : 'text-left'}>
                        <h3 className="font-bold text-gray-800 text-sm">{level.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{level.description}</p>
                        <div className={`flex items-center gap-2 mt-2 ${isLeft ? 'justify-end' : ''}`}>
                          <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                            {level.difficulty}
                          </span>
                          <span className="text-xs text-yellow-600 font-medium">
                            +{level.points}pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Círculo central */}
                <div className="relative z-10">
                  <button
                    onClick={() => unlocked && startLevel(level.id)}
                    disabled={!unlocked}
                    className={`
                      w-14 h-14 rounded-full flex items-center justify-center
                      transition-all duration-300 shadow-lg
                      ${completed ? 'bg-green-500 text-white ring-4 ring-green-200' : 
                        unlocked ? `${level.color} text-white hover:scale-110 cursor-pointer` : 
                        'bg-gray-300 text-gray-500 cursor-not-allowed'}
                    `}
                  >
                    {completed ? (
                      <CheckCircle className="w-7 h-7" />
                    ) : unlocked ? (
                      <span className="text-xl font-bold">{level.id}</span>
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Espaço vazio para balanceamento */}
                <div className="flex-1" />
              </div>
            );
          })}
        </div>

        {/* Topo da trilha */}
        <div className="flex justify-center mt-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
            <Crown className="w-6 h-6" />
            <span className="font-bold">Mestra STEM</span>
          </div>
        </div>
      </div>

      {/* Lista de Níveis Simplificada */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Sobre a Trilha</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{pathLevels.length}</p>
            <p className="text-xs text-gray-600">Níveis</p>
          </div>
          <div className="p-3 bg-pink-50 rounded-lg">
            <p className="text-2xl font-bold text-pink-600">{completedLevels.size}</p>
            <p className="text-xs text-gray-600">Completados</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {pathLevels.reduce((sum, l) => sum + l.points, 0)}
            </p>
            <p className="text-xs text-gray-600">Pontos Totais</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {Array.from(completedLevels).reduce((sum, id) => {
                const level = pathLevels.find(l => l.id === id);
                return sum + (level?.points || 0);
              }, 0)}
            </p>
            <p className="text-xs text-gray-600">Seus Pontos</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <p className="text-sm text-gray-700 text-center">
          💡 <strong>Dica:</strong> A Trilha é introdutória e rápida! Complete para desbloquear os Módulos, 
          que são cursos mais completos com projetos finais e certificados.
        </p>
      </Card>
    </div>
  );
};
