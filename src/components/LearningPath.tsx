import { useState, useEffect } from "react";
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
  onLessonComplete: (lessonId: number) => void;
  completedLessons?: Set<number>;
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

export const LearningPath = ({ onPointsEarned, selectedArea, onLessonComplete, completedLessons = new Set() }: LearningPathProps) => {
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [showLesson, setShowLesson] = useState(false);

  const pathLevels = getPathByArea(selectedArea);
  const areaName = getAreaName(selectedArea);

  // Sync completed lessons from database
  useEffect(() => {
    setCompletedLevels(completedLessons);
  }, [completedLessons]);

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
        onLessonComplete(currentLevel);
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

      {/* Trilha Visual estilo Duolingo com zigue-zague */}
      <div className="relative bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-8 border-4 border-purple-200">
        <div className="relative">
          {pathLevels.map((level, index) => {
            const IconComponent = iconMap[level.icon] || Star;
            const unlocked = isLevelUnlocked(level.id);
            const completed = isLevelCompleted(level.id);
            const isLeft = index % 2 === 0;
            
            return (
              <div key={level.id} className="relative">
                {/* Linha conectora */}
                {index < pathLevels.length - 1 && (
                  <svg className="absolute w-full h-24 top-16 left-0 z-0" style={{ overflow: 'visible' }}>
                    <path
                      d={isLeft 
                        ? "M 200 20 Q 350 60 500 20" 
                        : "M 500 20 Q 350 60 200 20"}
                      fill="none"
                      stroke="#E9D5FF"
                      strokeWidth="4"
                      strokeDasharray="8,4"
                    />
                  </svg>
                )}
                
                <div className={`flex items-center gap-6 mb-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Card de conteúdo */}
                  <Card 
                    className={`flex-1 p-4 cursor-pointer transition-all hover:shadow-lg ${
                      completed ? 'bg-green-50 border-green-200' : 
                      unlocked ? 'bg-white border-purple-200 hover:border-purple-400' : 
                      'bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => unlocked && startLevel(level.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        completed ? 'bg-green-100' : unlocked ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        {completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <IconComponent className={`w-5 h-5 ${unlocked ? 'text-purple-600' : 'text-gray-400'}`} />
                        )}
                      </div>
                      <div>
                        <h4 className={`font-bold ${completed ? 'text-green-700' : unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                          {level.title}
                        </h4>
                        <p className={`text-sm ${completed ? 'text-green-600' : unlocked ? 'text-gray-500' : 'text-gray-400'}`}>
                          {level.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        completed ? 'bg-green-100 text-green-700' :
                        unlocked ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {level.difficulty}
                      </span>
                      <span className={`text-xs font-medium ${
                        completed ? 'text-green-600' : unlocked ? 'text-pink-600' : 'text-gray-400'
                      }`}>
                        +{level.points}pts
                      </span>
                    </div>
                  </Card>
                  
                  {/* Círculo numerado */}
                  <div 
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-lg flex-shrink-0 ${
                      completed ? 'bg-green-500 text-white' : 
                      unlocked ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : 
                      'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {completed ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : unlocked ? (
                      level.id
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Topo da trilha - Mestra */}
          <div className="flex justify-center mt-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
              <Crown className="w-6 h-6" />
              <span className="font-bold">Mestra em {areaName}</span>
            </div>
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
