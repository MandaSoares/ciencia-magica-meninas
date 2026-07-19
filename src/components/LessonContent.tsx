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
  Award,
  X,
  Sparkles,
  Lightbulb,
  Heart,
} from "lucide-react";

interface LessonStep {
  type: "video" | "reading" | "practice" | "quiz" | "inspiration";
  title: string;
  content: string;
  videoUrl?: string;
  correctAnswer?: string;
  explanation?: string;
}

interface LessonContentProps {
  lessonTitle: string;
  lessonSteps: LessonStep[];
  onComplete: () => void;
  onBack: () => void;
}

const stepColors: Record<string, { bg: string; text: string; icon: string }> = {
  video: { bg: "bg-red-500", text: "text-red-600", icon: "bg-red-100" },
  reading: { bg: "bg-blue-500", text: "text-blue-600", icon: "bg-blue-100" },
  practice: { bg: "bg-emerald-500", text: "text-emerald-600", icon: "bg-emerald-100" },
  quiz: { bg: "bg-purple-500", text: "text-purple-600", icon: "bg-purple-100" },
  inspiration: { bg: "bg-amber-500", text: "text-amber-600", icon: "bg-amber-100" },
};

const stepLabels: Record<string, string> = {
  video: "Video",
  reading: "Leitura",
  practice: "Prática",
  quiz: "Quiz",
  inspiration: "Inspiração",
};

export const LessonContent = ({
  lessonTitle,
  lessonSteps,
  onComplete,
  onBack,
}: LessonContentProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showEncouragement, setShowEncouragement] = useState(false);

  const progress = ((completedSteps.size) / lessonSteps.length) * 100;

  const parseQuizOptions = (
    content: string
  ): { question: string; options: { letter: string; text: string }[] } => {
    const lines = content.split("\n").filter((line) => line.trim());
    const optionPattern = /^([A-D])\)\s*(.+)/;
    const options: { letter: string; text: string }[] = [];
    const questionLines: string[] = [];

    for (const line of lines) {
      const match = line.match(optionPattern);
      if (match) {
        options.push({ letter: match[1], text: match[2] });
      } else {
        questionLines.push(line);
      }
    }
    return { question: questionLines.join("\n"), options };
  };

  const handleSelectAnswer = (letter: string) => {
    if (answerSubmitted && isCorrect) return;

    const step = lessonSteps[currentStep];
    const correct = step.correctAnswer === letter;

    setQuizAnswer(letter);
    setAnswerSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 2000);
    } else {
      setTimeout(() => {
        setAnswerSubmitted(false);
        setQuizAnswer(null);
        setIsCorrect(null);
      }, 1500);
    }
  };

  const handleNextStep = () => {
    if (!isCorrect && lessonSteps[currentStep].type === "quiz") return;

    setCompletedSteps((prev) => new Set([...prev, currentStep]));

    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setQuizAnswer(null);
      setAnswerSubmitted(false);
      setIsCorrect(null);
    } else {
      onComplete();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setQuizAnswer(null);
      setAnswerSubmitted(false);
      setIsCorrect(null);
    }
  };

  const step = lessonSteps[currentStep];
  const colors = stepColors[step.type] || stepColors.reading;

  const getStepIcon = (type: string) => {
    switch (type) {
      case "video": return Play;
      case "reading": return BookOpen;
      case "practice": return PenTool;
      case "quiz": return Lightbulb;
      case "inspiration": return Heart;
      default: return BookOpen;
    }
  };

  const StepIcon = getStepIcon(step.type);
  const quizData = step.type === "quiz" ? parseQuizOptions(step.content) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-6">
      {/* Encouragement overlay */}
      {showEncouragement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl animate-pop-in flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            <span className="text-2xl font-black">Arrasou!</span>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl">
            <X className="w-5 h-5" />
          </Button>
          <Progress value={progress} className="h-3 flex-1" />
          <span className="text-sm font-bold text-gray-500 min-w-[40px] text-right">
            {currentStep + 1}/{lessonSteps.length}
          </span>
        </div>

        {/* Step indicators (mobile-friendly) */}
        <div className="flex justify-center mb-6 gap-1.5">
          {lessonSteps.map((s, index) => {
            const sColors = stepColors[s.type] || stepColors.reading;
            return (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  completedSteps.has(index)
                    ? "bg-green-400 w-8"
                    : index === currentStep
                    ? `${sColors.bg} w-8`
                    : "bg-gray-200 w-4"
                }`}
              />
            );
          })}
        </div>

        {/* Step type label */}
        <div className="flex items-center gap-3 mb-4 animate-slide-up">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
            <StepIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
              {stepLabels[step.type]}
            </span>
            <h2 className="text-xl font-bold text-gray-800">{step.title}</h2>
          </div>
        </div>

        {/* Content card */}
        <Card className="p-5 sm:p-8 mb-6 animate-slide-up stagger-1">
          {/* Video content */}
          {step.type === "video" && step.videoUrl && (
            <div className="mb-6">
              <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
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

          {/* Reading/Practice/Inspiration content */}
          {step.type !== "quiz" && (
            <div className="prose max-w-none">
              <div className={`${
                step.type === "inspiration"
                  ? "bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200"
                  : "bg-gray-50 border border-gray-100"
              } p-5 sm:p-6 rounded-2xl`}>
                {step.type === "inspiration" && (
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <span className="text-sm font-bold text-pink-600">História inspiradora</span>
                  </div>
                )}
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{step.content}</p>
              </div>
            </div>
          )}

          {/* Quiz */}
          {step.type === "quiz" && quizData && (
            <>
              <div className="bg-purple-50 border border-purple-200 p-5 sm:p-6 rounded-2xl mb-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-800 whitespace-pre-line font-medium text-lg">
                    {quizData.question}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {quizData.options.map((option) => {
                  const isSelected = quizAnswer === option.letter;
                  const showCorrectResult = answerSubmitted && isCorrect && isSelected;
                  const showIncorrect = answerSubmitted && isSelected && !isCorrect;

                  return (
                    <button
                      key={option.letter}
                      onClick={() => handleSelectAnswer(option.letter)}
                      disabled={answerSubmitted && isCorrect === true}
                      className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-300 ${
                        showCorrectResult
                          ? "bg-green-50 border-green-400 shadow-lg shadow-green-100 scale-[1.02]"
                          : showIncorrect
                          ? "bg-red-50 border-red-400 animate-wiggle"
                          : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          showCorrectResult
                            ? "bg-green-500 text-white"
                            : showIncorrect
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {showCorrectResult ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : showIncorrect ? (
                            <X className="w-5 h-5" />
                          ) : (
                            option.letter
                          )}
                        </div>
                        <span className={`font-medium ${
                          showCorrectResult ? "text-green-800" :
                          showIncorrect ? "text-red-800" :
                          "text-gray-700"
                        }`}>
                          {option.text}
                        </span>
                      </div>

                      {showCorrectResult && (
                        <div className="mt-3 p-3 bg-green-100 rounded-xl ml-13">
                          <p className="text-green-700 text-sm font-bold flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            {step.explanation || "Perfeito! Você acertou!"}
                          </p>
                        </div>
                      )}
                      {showIncorrect && (
                        <div className="mt-3 p-3 bg-red-100 rounded-xl ml-13">
                          <p className="text-red-700 text-sm font-bold">
                            Quase lá! Tente novamente.
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
            className="rounded-xl px-5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>

          <Button
            onClick={handleNextStep}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl px-6 py-5 text-base font-bold shadow-lg shadow-purple-200"
            disabled={
              (step.type === "quiz" && !answerSubmitted) ||
              (step.type === "quiz" && !isCorrect)
            }
          >
            {currentStep < lessonSteps.length - 1 ? (
              <>
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                <Award className="w-5 h-5 mr-2" />
                Concluir Lição
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
