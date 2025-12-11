import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Play, 
  Lock, 
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

export const ScienceModules = ({ onPointsEarned, selectedArea, userName, onModuleComplete }: ScienceModulesProps) => {
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({});
  const [showCertificate, setShowCertificate] = useState(false);
  const [completedModuleName, setCompletedModuleName] = useState("");
  const [showProject, setShowProject] = useState(false);

  const modules = allModules;

  const startModule = (module: Module) => {
    setActiveModule(module);
    setActiveContentIndex(moduleProgress[module.id] || 0);
    setShowProject(false);
    onPointsEarned(20);
  };

  const nextContent = () => {
    if (!activeModule) return;

    if (activeContentIndex < activeModule.lessons.length - 1) {
      setActiveContentIndex(prev => prev + 1);
      setModuleProgress(prev => ({
        ...prev,
        [activeModule.id]: activeContentIndex + 1
      }));
      onPointsEarned(30);
    } else {
      // Mostrar projeto final
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
    const module = modules.find(m => m.id === moduleId);
    if (!module) return 0;
    const progress = moduleProgress[moduleId] || 0;
    return Math.round((progress / module.lessons.length) * 100);
  };

  const currentContent = activeModule?.lessons[activeContentIndex];

  // Vista do projeto final
  if (showProject && activeModule) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button 
          variant="ghost" 
          onClick={() => setShowProject(false)}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar para a lição
        </Button>

        <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-10 h-10" />
            <div>
              <h2 className="text-2xl font-bold">Projeto Final</h2>
              <p className="opacity-90">{activeModule.title}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{activeModule.finalProject.title}</h3>
          <p className="text-gray-600 mb-6">{activeModule.finalProject.description}</p>

          <h4 className="font-semibold text-gray-800 mb-3">Passo a Passo:</h4>
          <div className="space-y-3">
            {activeModule.finalProject.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-700 pt-1">{step}</p>
              </div>
            ))}
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
            Completei o Projeto!
          </Button>
        </div>
      </div>
    );
  }

  // Vista de uma lição
  if (activeModule && currentContent) {
    const ContentIcon = contentIcons[currentContent.type];
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => {
              setActiveModule(null);
              setActiveContentIndex(0);
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
                 currentContent.type === 'practice' ? 'Prática' :
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

          {currentContent.type === 'quiz' && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700">
                💡 Pense bem antes de responder! A resposta correta é "{currentContent.correctAnswer}"
              </p>
            </div>
          )}
        </Card>

        <div className="flex justify-end">
          <Button
            className="bg-gradient-to-r from-purple-500 to-pink-500"
            onClick={nextContent}
          >
            {activeContentIndex < activeModule.lessons.length - 1 ? (
              <>
                Próxima Lição
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Ver Projeto Final
                <Award className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Vista principal - lista de módulos
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Módulos de Aprendizado</h2>
        <p className="text-gray-600">
          Cursos completos com 3-6 lições, projeto final e certificado de conclusão!
        </p>
      </div>

      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <p className="text-sm text-gray-700">
          💡 <strong>Diferença entre Trilha e Módulos:</strong> A Trilha é introdutória e rápida. 
          Os Módulos são cursos mais profundos sobre temas específicos, com projeto final e certificado!
        </p>
      </Card>

      {/* Agrupar por categoria */}
      {['Tecnologia', 'Engenharia', 'Ciência', 'Matemática'].map(category => {
        const categoryModules = modules.filter(m => m.category === category);
        if (categoryModules.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {categoryModules.map((module) => {
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
                        <span>{module.totalLessons} lições + projeto</span>
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
          </div>
        );
      })}

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
