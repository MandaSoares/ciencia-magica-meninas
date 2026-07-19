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
  Loader2,
  Trash2,
  Edit2,
  Play,
  type LucideIcon,
} from "lucide-react";
import { useLearningPathContent, getAreaName, PathLevel } from "@/hooks/useLearningPathContent";
import { LessonContent } from "./LessonContent";
import { LevelCompleteScreen } from "./LevelCompleteScreen";
import { AddLearningPathInline } from "./admin/AddLearningPathInline";
import { EditLearningPathInline } from "./admin/EditLearningPathInline";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getPathByArea } from "@/data/learningPathData";

interface LearningPathProps {
  onPointsEarned: (points: number) => void;
  selectedArea: string;
  onLessonComplete: (lessonId: number) => void;
  completedLessons?: Set<number>;
}

const iconMap: Record<string, LucideIcon> = {
  Star, Sparkles, Brain, Calculator, Smartphone, Wrench,
  Beaker, Code, Heart, Trophy, Bot, Shapes, Leaf, Rocket, Crown,
};

export const LearningPath = ({
  onPointsEarned,
  selectedArea,
  onLessonComplete,
  completedLessons = new Set(),
}: LearningPathProps) => {
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [showLesson, setShowLesson] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [completedLevelData, setCompletedLevelData] = useState<PathLevel | null>(null);
  const [deleteLevelId, setDeleteLevelId] = useState<string | null>(null);
  const [editingLevel, setEditingLevel] = useState<PathLevel | null>(null);

  const { isAdmin } = useAdminCheck();
  const queryClient = useQueryClient();

  const { data: dbPathLevels, isLoading } = useLearningPathContent(selectedArea);
  const staticPathLevels = getPathByArea(selectedArea);
  const pathLevels: PathLevel[] =
    dbPathLevels && dbPathLevels.length > 0 ? dbPathLevels : staticPathLevels;
  const areaName = getAreaName(selectedArea);

  const handleContentChange = () => {
    queryClient.invalidateQueries({ queryKey: ["learning-path-content"] });
  };

  const handleDeleteLevel = async () => {
    if (!deleteLevelId) return;
    try {
      const { error } = await supabase
        .from("learning_path_content")
        .delete()
        .eq("id", deleteLevelId);
      if (error) throw error;
      toast({ title: "Nivel deletado com sucesso!" });
      handleContentChange();
    } catch (error: any) {
      toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
    } finally {
      setDeleteLevelId(null);
    }
  };

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

  const isLevelCompleted = (levelId: number) => completedLevels.has(levelId);

  const getOverallProgress = () =>
    pathLevels.length > 0 ? (completedLevels.size / pathLevels.length) * 100 : 0;

  const handleLessonComplete = () => {
    if (currentLevel) {
      const level = pathLevels.find((l) => l.id === currentLevel);
      if (level) {
        setCompletedLevels((prev) => new Set([...prev, currentLevel]));
        onPointsEarned(level.points);
        setShowLesson(false);
        setCompletedLevelData(level);
        setShowLevelComplete(true);
        onLessonComplete(currentLevel);
      }
    }
  };

  const handleLevelCompleteDismiss = () => {
    setShowLevelComplete(false);
    setCompletedLevelData(null);
    setCurrentLevel(null);
  };

  const currentLevelData = currentLevel ? pathLevels.find((l) => l.id === currentLevel) : null;

  if (showLevelComplete && completedLevelData) {
    return (
      <LevelCompleteScreen
        levelTitle={completedLevelData.title}
        pointsEarned={completedLevelData.points}
        totalCompleted={completedLevels.size}
        totalLevels={pathLevels.length}
        onContinue={handleLevelCompleteDismiss}
      />
    );
  }

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const isTrailComplete = completedLevels.size >= pathLevels.length && pathLevels.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center animate-slide-up">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-1">
          Trilha de {areaName}
        </h2>
        <p className="text-gray-500">
          Complete cada nível para desbloquear o próximo!
        </p>
      </div>

      {/* Progress bar */}
      <Card className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200 animate-slide-up stagger-1">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-gray-700 text-sm">Progresso Geral</span>
          <span className="text-sm font-bold text-purple-600">
            {completedLevels.size}/{pathLevels.length}
          </span>
        </div>
        <Progress value={getOverallProgress()} className="h-3" />
        <p className="text-xs text-gray-500 mt-2">
          Complete a trilha para desbloquear os Modulos avancados!
        </p>
      </Card>

      {/* Trail Visual - Duolingo style */}
      <div className="relative bg-gradient-to-b from-purple-50/80 via-pink-50/80 to-blue-50/80 rounded-3xl p-4 sm:p-8 border-2 border-purple-100">
        <div className="max-w-lg mx-auto">
          {pathLevels.map((level, index) => {
            const IconComponent = iconMap[level.icon] || Star;
            const unlocked = isLevelUnlocked(level.id);
            const completed = isLevelCompleted(level.id);
            const isNext = unlocked && !completed;

            const offsets = [0, 50, 80, 50, 0, -50, -80, -50];
            const offset = offsets[index % offsets.length];

            return (
              <div key={level.id} className="relative">
                {/* Connector line */}
                {index > 0 && (
                  <div className="flex justify-center -mt-1 mb-1">
                    <div className={`w-1 h-8 rounded-full ${
                      completed ? "bg-green-300" :
                      unlocked ? "bg-purple-200" :
                      "bg-gray-200"
                    }`} />
                  </div>
                )}

                {/* Level node */}
                <div
                  className="flex justify-center mb-2"
                  style={{ transform: `translateX(${offset * 0.6}px)` }}
                >
                  <button
                    onClick={() => unlocked && startLevel(level.id)}
                    disabled={!unlocked}
                    className={`
                      relative group flex flex-col items-center gap-2 p-1 transition-all duration-300
                      ${unlocked ? "cursor-pointer" : "cursor-not-allowed"}
                      ${isNext ? "animate-pulse-glow rounded-full" : ""}
                    `}
                  >
                    {/* Circle */}
                    <div
                      className={`
                        w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center
                        shadow-lg transition-all duration-300 border-4
                        ${completed
                          ? "bg-gradient-to-br from-green-400 to-emerald-500 border-green-300 scale-100"
                          : isNext
                          ? "bg-gradient-to-br from-purple-500 to-pink-500 border-purple-300 hover:scale-110"
                          : "bg-gray-200 border-gray-300"
                        }
                        ${isNext ? "ring-4 ring-purple-200 ring-offset-2" : ""}
                      `}
                    >
                      {completed ? (
                        <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      ) : unlocked ? (
                        <IconComponent className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
                      ) : (
                        <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                      )}

                      {isNext && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow animate-bounce">
                          <Play className="w-3 h-3 text-yellow-900 ml-0.5" />
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    <div className={`text-center max-w-[160px] transition-all ${
                      unlocked ? "opacity-100" : "opacity-50"
                    }`}>
                      <p className={`text-xs sm:text-sm font-bold leading-tight ${
                        completed ? "text-green-700" :
                        unlocked ? "text-gray-800" :
                        "text-gray-400"
                      }`}>
                        {level.title}
                      </p>
                      <p className={`text-[10px] sm:text-xs mt-0.5 ${
                        completed ? "text-green-500" :
                        unlocked ? "text-gray-500" :
                        "text-gray-300"
                      }`}>
                        {level.difficulty} · {level.points} XP
                      </p>
                    </div>

                    {/* Admin controls */}
                    {isAdmin && level.dbId && (
                      <div className="absolute -top-2 -right-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm" variant="outline" className="h-7 w-7 p-0"
                          onClick={(e) => { e.stopPropagation(); setEditingLevel(level); }}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm" variant="destructive" className="h-7 w-7 p-0"
                          onClick={(e) => { e.stopPropagation(); setDeleteLevelId(level.dbId!); }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {isAdmin && (
            <div className="mt-4">
              <AddLearningPathInline
                selectedArea={selectedArea}
                onContentChange={handleContentChange}
                isAdmin={isAdmin}
              />
            </div>
          )}

          {/* End badge */}
          <div className="flex justify-center mt-6">
            <div className={`px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition-all ${
              isTrailComplete
                ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white animate-pop-in"
                : "bg-gray-200 text-gray-400"
            }`}>
              <Crown className="w-6 h-6" />
              <span className="font-extrabold">Mestra em {areaName}</span>
              {isTrailComplete && <span className="text-xl">🎉</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Tip */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <p className="text-sm text-gray-700 text-center">
          <span className="font-bold">Dica:</span> A Trilha e introdutoria e rapida! Complete para desbloquear os Modulos,
          que sao cursos mais completos com projetos finais e certificados.
        </p>
      </Card>

      <AlertDialog open={!!deleteLevelId} onOpenChange={() => setDeleteLevelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este nível? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLevel} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editingLevel && (
        <EditLearningPathInline
          level={editingLevel}
          onClose={() => setEditingLevel(null)}
          onContentChange={handleContentChange}
        />
      )}
    </div>
  );
};
