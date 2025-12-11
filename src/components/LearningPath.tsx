
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
  Award,
  Calculator,
  Wrench,
  Lightbulb,
  Code,
  Palette
} from "lucide-react";
import { sciencePathLevels, technologyPathLevels, engineeringPathLevels, mathPathLevels, PathLevel } from "@/data/learningPathData";
import { LessonContent } from "./LessonContent";

interface LearningPathProps {
  onPointsEarned: (points: number) => void;
  selectedArea: string;
  onLessonComplete: () => void;
}

const learningPaths: Record<string, PathLevel[]> = {
  science: sciencePathLevels,
  technology: technologyPathLevels,
  engineering: engineeringPathLevels,
  math: mathPathLevels,
};

const areaIcons: Record<string, any> = {
  science: [Star, Atom, Microscope, Dna, Zap, Cpu, Rocket, Lightbulb, Palette, Code],
  technology: [Star, Cpu, Code, Zap, Rocket, Lightbulb, Atom, Microscope, Dna, Palette],
  engineering: [Star, Wrench, Cpu, Zap, Rocket, Lightbulb, Atom, Microscope, Dna, Palette],
  math: [Star, Calculator, Atom, Cpu, Zap, Rocket, Lightbulb, Microscope, Dna, Palette],
};

const areaColors: Record<string, string[]> = {
  science: ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-yellow-500", "bg-indigo-500", "bg-red-500", "bg-cyan-500", "bg-orange-500", "bg-teal-500"],
  technology: ["bg-cyan-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-orange-500", "bg-teal-500"],
  engineering: ["bg-orange-500", "bg-yellow-500", "bg-red-500", "bg-purple-500", "bg-blue-500", "bg-green-500", "bg-pink-500", "bg-indigo-500", "bg-cyan-500", "bg-teal-500"],
  math: ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-yellow-500", "bg-indigo-500", "bg-red-500", "bg-cyan-500", "bg-orange-500", "bg-teal-500"],
};

const areaTitles: Record<string, string> = {
  science: "Trilha da Descoberta Científica",
  technology: "Trilha da Tecnologia",
  engineering: "Trilha da Engenharia",
  math: "Trilha da Matemática",
};

export const LearningPath = ({ onPointsEarned, selectedArea, onLessonComplete }: LearningPathProps) => {
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [showLesson, setShowLesson] = useState(false);

  const pathData = learningPaths[selectedArea] || learningPaths.science;
  const icons = areaIcons[selectedArea] || areaIcons.science;
  const colors = areaColors[selectedArea] || areaColors.science;

  const pathLevels = pathData.map((level, index) => ({
    ...level,
    icon: icons[index % icons.length],
    color: colors[index % colors.length],
    position: {
      x: index % 2 === 0 ? 30 + (index * 5) % 40 : 70 - (index * 5) % 40,
      y: 95 - (index * (90 / pathData.length))
    }
  }));

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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{areaTitles[selectedArea]}</h2>
        <p className="text-gray-600 mb-4">Complete cada nível para desbloquear o próximo!</p>
        
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
      <div className="relative min-h-[600px] bg-gradient-to-b from-blue-50 to-green-50 rounded-2xl overflow-hidden border-4 border-purple-200 p-4">
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
                      unlocked ? `${level.color} text-white hover:shadow-xl cursor-pointer` : 
                      'bg-gray-300 text-gray-500 cursor-not-allowed'}
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
                
                <div className="text-center bg-white px-3 py-1 rounded-full shadow-md border-2 border-purple-200 max-w-[120px]">
                  <p className="text-xs font-semibold text-gray-700 truncate">{level.title}</p>
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

      {/* Lista de Níveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pathLevels.map((level) => {
          const Icon = level.icon;
          const unlocked = isLevelUnlocked(level.id);
          const completed = isLevelCompleted(level.id);
          
          return (
            <Card 
              key={level.id} 
              className={`p-4 transition-all ${unlocked ? 'hover:shadow-lg cursor-pointer' : 'opacity-60'}`}
              onClick={() => unlocked && startLevel(level.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${completed ? 'bg-green-500' : level.color} rounded-xl flex items-center justify-center`}>
                  {completed ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : unlocked ? (
                    <Icon className="w-6 h-6 text-white" />
                  ) : (
                    <Lock className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{level.title}</h3>
                  <p className="text-sm text-gray-600">{level.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                      {level.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">
                      {level.lessons.length} lições
                    </span>
                    <span className="text-xs text-yellow-600 font-medium">
                      +{level.points}pts
                    </span>
                  </div>
                </div>
                {completed && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
