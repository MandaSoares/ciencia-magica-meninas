
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, Lock, CheckCircle } from "lucide-react";

interface ScienceModulesProps {
  onPointsEarned: (points: number) => void;
}

export const ScienceModules = ({ onPointsEarned }: ScienceModulesProps) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules = [
    {
      id: "physics",
      title: "Física Fascinante",
      description: "Descubra os segredos do universo",
      progress: 60,
      lessons: 8,
      completedLessons: 5,
      color: "bg-blue-500",
      unlocked: true,
    },
    {
      id: "chemistry",
      title: "Química Criativa",
      description: "Experimentos incríveis aguardam você",
      progress: 30,
      lessons: 10,
      completedLessons: 3,
      color: "bg-green-500",
      unlocked: true,
    },
    {
      id: "biology",
      title: "Biologia Brilhante",
      description: "Explore a vida em todas as suas formas",
      progress: 90,
      lessons: 6,
      completedLessons: 5,
      color: "bg-purple-500",
      unlocked: true,
    },
    {
      id: "programming",
      title: "Programação Poderosa",
      description: "Crie o futuro com código",
      progress: 0,
      lessons: 12,
      completedLessons: 0,
      color: "bg-pink-500",
      unlocked: true,
    },
    {
      id: "astronomy",
      title: "Astronomia Admirável",
      description: "Viaje pelas estrelas",
      progress: 0,
      lessons: 8,
      completedLessons: 0,
      color: "bg-indigo-500",
      unlocked: false,
    },
    {
      id: "robotics",
      title: "Robótica Revolucionária",
      description: "Construa robôs do futuro",
      progress: 0,
      lessons: 10,
      completedLessons: 0,
      color: "bg-orange-500",
      unlocked: false,
    },
  ];

  const startLesson = (moduleId: string) => {
    onPointsEarned(50);
    console.log(`Iniciando lição do módulo: ${moduleId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Módulos de Ciência</h2>
        <p className="text-gray-600">Escolha um módulo e comece sua jornada científica!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              {!module.unlocked && <Lock className="w-5 h-5 text-gray-400" />}
              {module.progress === 100 && <CheckCircle className="w-5 h-5 text-green-500" />}
            </div>

            <h3 className="text-xl font-semibold mb-2 text-gray-800">{module.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{module.description}</p>

            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{module.completedLessons} de {module.lessons} lições</span>
                <span>{module.progress}%</span>
              </div>
              <Progress value={module.progress} className="h-2" />
            </div>

            <Button
              onClick={() => startLesson(module.id)}
              disabled={!module.unlocked}
              className={`w-full mt-4 ${
                module.unlocked
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  : "bg-gray-300"
              }`}
            >
              {module.unlocked ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {module.progress > 0 ? "Continuar" : "Começar"}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Bloqueado
                </>
              )}
            </Button>
          </Card>
        ))}
      </div>

      {selectedModule && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
          <h3 className="text-xl font-semibold mb-4">Lição Interativa</h3>
          <p className="text-gray-600 mb-4">
            Conteúdo da lição seria exibido aqui com vídeos, textos interativos e quizzes!
          </p>
          <Button onClick={() => setSelectedModule(null)}>
            Fechar Lição
          </Button>
        </Card>
      )}
    </div>
  );
};
