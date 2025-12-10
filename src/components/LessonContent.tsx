import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  BookOpen, 
  PenTool, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Award
} from "lucide-react";

interface LessonStep {
  type: 'video' | 'reading' | 'practice' | 'quiz';
  title: string;
  content: string;
  videoUrl?: string;
}

interface LessonContentProps {
  lessonTitle: string;
  lessonSteps: LessonStep[];
  onComplete: () => void;
  onBack: () => void;
}

export const LessonContent = ({ lessonTitle, lessonSteps, onComplete, onBack }: LessonContentProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const progress = ((completedSteps.size) / lessonSteps.length) * 100;

  const handleNextStep = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setQuizAnswer(null);
    } else {
      onComplete();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const step = lessonSteps[currentStep];

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'video': return Play;
      case 'reading': return BookOpen;
      case 'practice': return PenTool;
      case 'quiz': return CheckCircle;
      default: return BookOpen;
    }
  };

  const StepIcon = getStepIcon(step.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Trilha
        </Button>

        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{lessonTitle}</h1>
            <span className="text-sm text-gray-600">
              Passo {currentStep + 1} de {lessonSteps.length}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </Card>

        {/* Step indicators */}
        <div className="flex justify-center mb-6 space-x-2">
          {lessonSteps.map((s, index) => {
            const Icon = getStepIcon(s.type);
            return (
              <div
                key={index}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  completedSteps.has(index)
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {completedSteps.has(index) ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
            );
          })}
        </div>

        <Card className="p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              step.type === 'video' ? 'bg-red-500' :
              step.type === 'reading' ? 'bg-blue-500' :
              step.type === 'practice' ? 'bg-green-500' : 'bg-purple-500'
            }`}>
              <StepIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-sm text-gray-500 uppercase">
                {step.type === 'video' && 'Vídeo'}
                {step.type === 'reading' && 'Leitura'}
                {step.type === 'practice' && 'Prática'}
                {step.type === 'quiz' && 'Quiz'}
              </span>
              <h2 className="text-xl font-bold text-gray-800">{step.title}</h2>
            </div>
          </div>

          {/* Video content */}
          {step.type === 'video' && step.videoUrl && (
            <div className="mb-6">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <iframe
                  src={step.videoUrl}
                  title={step.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Reading/Practice content */}
          <div className="prose max-w-none mb-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line">{step.content}</p>
            </div>
          </div>

          {/* Quiz options */}
          {step.type === 'quiz' && (
            <div className="space-y-3 mb-6">
              {['A', 'B', 'C', 'D'].map((option, index) => (
                <button
                  key={option}
                  onClick={() => setQuizAnswer(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    quizAnswer === index
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <span className="font-bold text-purple-600 mr-2">{option})</span>
                  Opção de resposta {index + 1}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <Button
              onClick={handleNextStep}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              disabled={step.type === 'quiz' && quizAnswer === null}
            >
              {currentStep < lessonSteps.length - 1 ? (
                <>
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Concluir Lição
                  <Award className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
