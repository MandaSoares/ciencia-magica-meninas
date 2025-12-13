import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Video, 
  FileText, 
  Beaker, 
  HelpCircle, 
  Award,
  ChevronLeft,
  ChevronRight,
  Code,
  Globe,
  Brain,
  Cog,
  Plane,
  Shapes,
  Shield,
  Leaf,
  Zap,
  MessageCircle,
  Lightbulb,
  X,
  type LucideIcon
} from "lucide-react";
import { CertificateModal } from "./CertificateModal";
import { allModules, Module, ModuleLesson } from "@/data/modulesData";

interface ScienceModulesProps {
  onPointsEarned: (points: number) => void;
  selectedArea: string;
  userName: string;
  onModuleComplete: (moduleId: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Code,
  Globe,
  Brain,
  Cog,
  Plane,
  Shapes,
  Beaker,
  Shield,
  Leaf,
  Zap,
};

const contentIcons: Record<string, LucideIcon> = {
  video: Video,
  reading: FileText,
  practice: Beaker,
  quiz: HelpCircle,
  project: Award,
};

// Map area keys to category names
const areaToCategory: Record<string, string> = {
  technology: "Tecnologia",
  science: "Ciência",
  engineering: "Engenharia",
  math: "Matemática",
};

export const ScienceModules = ({ onPointsEarned, selectedArea, userName, onModuleComplete }: ScienceModulesProps) => {
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({});
  const [showCertificate, setShowCertificate] = useState(false);
  const [completedModuleName, setCompletedModuleName] = useState("");
  const [showProject, setShowProject] = useState(false);
  const [showForumComments, setShowForumComments] = useState(false);
  const [showInstructorOpinion, setShowInstructorOpinion] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Filter modules by selected area
  const categoryName = areaToCategory[selectedArea] || "Ciência";
  const modules = allModules.filter(m => m.category === categoryName);

  const startModule = (module: Module) => {
    setActiveModule(module);
    setActiveContentIndex(moduleProgress[module.id] || 0);
    setShowProject(false);
    setQuizAnswer(null);
    setAnswerSubmitted(false);
    setIsCorrect(null);
    onPointsEarned(20);
  };

  const previousContent = () => {
    if (activeContentIndex > 0) {
      setActiveContentIndex(prev => prev - 1);
      setQuizAnswer(null);
      setAnswerSubmitted(false);
      setIsCorrect(null);
    }
  };

  const nextContent = () => {
    if (!activeModule) return;

    // Can't proceed if quiz was wrong
    if (activeModule.lessons[activeContentIndex]?.type === 'quiz' && !isCorrect) {
      return;
    }

    if (activeContentIndex < activeModule.lessons.length - 1) {
      setActiveContentIndex(prev => prev + 1);
      setModuleProgress(prev => ({
        ...prev,
        [activeModule.id]: activeContentIndex + 1
      }));
      setQuizAnswer(null);
      setAnswerSubmitted(false);
      setIsCorrect(null);
      onPointsEarned(30);
    } else {
      setShowProject(true);
    }
  };

  const completeModule = () => {
    if (!activeModule) return;
    
    setCompletedModules(prev => new Set([...prev, activeModule.id]));
    setCompletedModuleName(activeModule.title);
    onPointsEarned(200);
    onModuleComplete(activeModule.id);
    setActiveModule(null);
    setActiveContentIndex(0);
    setShowProject(false);
    setShowCertificate(true);
  };

  const getModuleProgress = (moduleId: string) => {
    if (completedModules.has(moduleId)) return 100;
    const module = allModules.find(m => m.id === moduleId);
    if (!module) return 0;
    const progress = moduleProgress[moduleId] || 0;
    return Math.round((progress / module.lessons.length) * 100);
  };

  // Parse quiz options from content
  const parseQuizOptions = (content: string): { question: string; options: { letter: string; text: string }[] } => {
    const lines = content.split('\n').filter(line => line.trim());
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
    
    return { question: questionLines.join('\n'), options };
  };

  const handleSelectAnswer = (letter: string) => {
    const currentContent = activeModule?.lessons[activeContentIndex];
    const correct = currentContent?.correctAnswer === letter;
    
    setQuizAnswer(letter);
    setAnswerSubmitted(true);
    setIsCorrect(correct);
    
    // Se errou, permite tentar novamente
    if (!correct) {
      setTimeout(() => {
        setAnswerSubmitted(false);
      }, 1500);
    }
  };

  const currentContent = activeModule?.lessons[activeContentIndex];

  // Vista do projeto final (Desafio)
  if (showProject && activeModule) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button 
          variant="ghost" 
          onClick={() => setShowProject(false)}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        <Card className="p-6 bg-white border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-10 h-10 text-purple-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Desafio Final</h2>
              <p className="text-gray-600">{activeModule.title}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200">
          <h3 className="text-xl font-bold mb-2 text-gray-800">{activeModule.finalProject.title}</h3>
          <p className="text-gray-600 mb-6">{activeModule.finalProject.description}</p>

          <p className="text-gray-500 mb-4">
            Para entender melhor como elaborar uma solução para esse desafio, clique na <em>Opinião da Pessoa Instrutora</em>.
          </p>

          {showInstructorOpinion && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
              <h4 className="text-lg font-bold mb-3 text-gray-800">Opinião do instrutor</h4>
              <div className="space-y-4">
                {activeModule.finalProject.steps.map((step, index) => (
                  <p key={index} className="text-gray-700">{step}</p>
                ))}
              </div>
            </div>
          )}

          {showForumComments && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="text-lg font-bold mb-3 text-purple-800">Fórum de Discussão</h4>
              <p className="text-gray-600 mb-4">Compartilhe suas ideias e veja o que outras meninas estão criando!</p>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded border">
                  <p className="text-sm text-gray-500">Maria S. • há 2 dias</p>
                  <p className="text-gray-700">Adorei esse desafio! Fiz usando materiais reciclados.</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="text-sm text-gray-500">Ana P. • há 1 dia</p>
                  <p className="text-gray-700">Tive dificuldade no início mas consegui terminar!</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <Button 
              variant="outline"
              className="bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
              onClick={() => setShowForumComments(!showForumComments)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              DISCUTIR NO FÓRUM
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => setShowInstructorOpinion(!showInstructorOpinion)}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              VER OPINIÃO DO INSTRUTOR
            </Button>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button 
            variant="outline"
            onClick={() => {
              setActiveModule(null);
              setShowProject(false);
            }}
          >
            Terminar Depois
          </Button>
          <Button
            className="bg-gradient-to-r from-purple-500 to-pink-500"
            onClick={completeModule}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Completei o Desafio!
          </Button>
        </div>
      </div>
    );
  }

  // Vista de uma lição
  if (activeModule && currentContent) {
    const ContentIcon = contentIcons[currentContent.type];
    const quizData = currentContent.type === 'quiz' ? parseQuizOptions(currentContent.content) : null;
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => {
              setActiveModule(null);
              setActiveContentIndex(0);
              setQuizAnswer(null);
              setAnswerSubmitted(false);
              setIsCorrect(null);
            }}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar aos Módulos
          </Button>
          <span className="text-sm text-gray-500">
            Lição {activeContentIndex + 1} de {activeModule.lessons.length}
          </span>
        </div>

        <Card className={`p-4 ${activeModule.color} text-white`}>
          <h2 className="text-xl font-bold">{activeModule.title}</h2>
          <Progress 
            value={(activeContentIndex / activeModule.lessons.length) * 100} 
            className="h-2 mt-2 bg-white/20"
          />
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ContentIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <span className="text-xs text-purple-600 font-medium uppercase">
                {currentContent.type === 'video' ? 'Vídeo' : 
                 currentContent.type === 'reading' ? 'Leitura' :
                 currentContent.type === 'practice' ? 'Desafio' :
                 currentContent.type === 'quiz' ? 'Quiz' : 'Projeto'}
              </span>
              <h3 className="text-xl font-bold text-gray-800">{currentContent.title}</h3>
              <p className="text-sm text-gray-500">{currentContent.duration}</p>
            </div>
          </div>

          {currentContent.type === 'video' && currentContent.videoUrl && (
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <iframe
                src={currentContent.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {currentContent.type !== 'quiz' && (
            <div className="prose max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {currentContent.content.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return <h2 key={i} className="text-2xl font-bold mt-6 mb-3">{line.slice(2)}</h2>;
                  }
                  if (line.startsWith('## ')) {
                    return <h3 key={i} className="text-xl font-semibold mt-4 mb-2">{line.slice(3)}</h3>;
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-bold mt-2">{line.slice(2, -2)}</p>;
                  }
                  if (line.startsWith('- ')) {
                    return <p key={i} className="ml-4">• {line.slice(2)}</p>;
                  }
                  if (line.trim() === '') {
                    return <br key={i} />;
                  }
                  return <p key={i} className="mb-2">{line}</p>;
                })}
              </div>
            </div>
          )}

          {/* Quiz with feedback - fundo branco */}
          {currentContent.type === 'quiz' && quizData && (
            <>
              <div className="prose max-w-none mb-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-line font-medium">{quizData.question}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {quizData.options.map((option) => {
                  const isSelected = quizAnswer === option.letter;
                  const showCorrect = answerSubmitted && isCorrect && isSelected;
                  const showIncorrect = answerSubmitted && isSelected && !isCorrect;
                  
                  return (
                    <button
                      key={option.letter}
                      onClick={() => handleSelectAnswer(option.letter)}
                      disabled={showCorrect}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        showCorrect
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : showIncorrect
                          ? 'bg-red-100 border-red-500 text-red-800'
                          : isSelected && !answerSubmitted
                          ? 'border-purple-500 bg-purple-50 text-gray-800'
                          : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {showCorrect && (
                          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        )}
                        {showIncorrect && (
                          <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                            <X className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <span className={showCorrect || showIncorrect ? '' : 'ml-11'}>
                          <span className="font-bold mr-2">{option.letter})</span>
                          {option.text}
                        </span>
                      </div>
                      
                      {showCorrect && (
                        <div className="mt-3 p-3 bg-green-200 rounded border border-green-400 ml-11">
                          <p className="text-green-800 text-sm font-medium">
                            Correta! Parabéns, você acertou!
                          </p>
                        </div>
                      )}
                      {showIncorrect && (
                        <div className="mt-3 p-3 bg-red-200 rounded border border-red-400 ml-11">
                          <p className="text-red-800 text-sm font-medium">
                            Incorreta. Tente novamente!
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Botões Forum e Instrutor para Desafios */}
          {currentContent.type === 'practice' && (
            <div className="flex justify-end gap-4 mt-6 border-t pt-4">
              <Button 
                variant="outline"
                className="bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                DISCUTIR NO FÓRUM
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                VER OPINIÃO DO INSTRUTOR
              </Button>
            </div>
          )}
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={previousContent}
            disabled={activeContentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <Button
            className="bg-gradient-to-r from-purple-500 to-pink-500"
            onClick={nextContent}
            disabled={currentContent.type === 'quiz' && (!answerSubmitted || !isCorrect)}
          >
            {activeContentIndex < activeModule.lessons.length - 1 ? (
              <>
                Próxima Lição
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Ver Desafio Final
                <Award className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Vista principal - lista de módulos filtrada por área
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Módulos de {categoryName}</h2>
        <p className="text-gray-600">
          Cursos completos com 3-6 lições, desafio final e certificado de conclusão!
        </p>
      </div>

      {modules.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            Ainda não há módulos disponíveis para {categoryName}. Em breve teremos novos conteúdos!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => {
            const ModuleIcon = iconMap[module.icon] || BookOpen;
            const completed = completedModules.has(module.id);
            const progress = getModuleProgress(module.id);

            return (
              <Card 
                key={module.id}
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={() => startModule(module)}
              >
                <div className={`${module.color} p-4 text-white`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      {completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <ModuleIcon className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold">{module.title}</h4>
                      <p className="text-sm opacity-90">{module.estimatedTime}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{module.totalLessons} lições + desafio</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />

                  {completed && (
                    <div className="mt-3 flex items-center gap-2 text-green-600 text-sm">
                      <Award className="w-4 h-4" />
                      Certificado Conquistado!
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        userName={userName}
        moduleName={completedModuleName}
        completionDate={new Date().toLocaleDateString('pt-BR')}
      />
    </div>
  );
};
