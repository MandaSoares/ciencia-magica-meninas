import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, ChevronLeft, ChevronRight, Loader2, Video, FileText, Beaker, HelpCircle, Award, X, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddModuleInlineProps {
  selectedArea: string;
  onContentChange: () => void;
  isAdmin: boolean;
}

interface ModuleLesson {
  type: 'video' | 'reading' | 'practice' | 'quiz' | 'project';
  title: string;
  content: string;
  duration: string;
  videoUrl?: string;
  correctAnswer?: string;
}

interface FinalProject {
  title: string;
  description: string;
  steps: string[];
}

const areaMap: Record<string, string> = {
  science: "Ciência",
  technology: "Tecnologia",
  engineering: "Engenharia",
  math: "Matemática",
};

const lessonTypes = [
  { value: 'video', label: 'Vídeo', icon: Video, color: 'bg-red-500' },
  { value: 'reading', label: 'Leitura', icon: FileText, color: 'bg-blue-500' },
  { value: 'practice', label: 'Desafio', icon: Beaker, color: 'bg-green-500' },
  { value: 'quiz', label: 'Quiz', icon: HelpCircle, color: 'bg-purple-500' },
  { value: 'project', label: 'Projeto', icon: Award, color: 'bg-yellow-500' },
];

export const AddModuleInline = ({ selectedArea, onContentChange, isAdmin }: AddModuleInlineProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState<'info' | 'lessons' | 'project'>('info');
  const [isLoading, setIsLoading] = useState(false);
  
  // Module info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("3 horas");
  
  // Lessons
  const [lessons, setLessons] = useState<ModuleLesson[]>([]);
  const [lessonType, setLessonType] = useState<ModuleLesson['type']>('video');
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonDuration, setLessonDuration] = useState("10 min");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonCorrectAnswer, setLessonCorrectAnswer] = useState("");
  
  // Final Project
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectSteps, setProjectSteps] = useState("");

  const stemArea = areaMap[selectedArea] || "Ciência";

  if (!isAdmin) return null;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEstimatedTime("3 horas");
    setLessons([]);
    setProjectTitle("");
    setProjectDescription("");
    setProjectSteps("");
    setStep('info');
    setIsEditing(false);
  };

  const addLesson = () => {
    if (!lessonTitle.trim()) {
      toast({ title: "Digite o título da lição", variant: "destructive" });
      return;
    }
    
    const newLesson: ModuleLesson = {
      type: lessonType,
      title: lessonTitle,
      content: lessonContent,
      duration: lessonDuration,
      videoUrl: lessonType === 'video' ? lessonVideoUrl : undefined,
      correctAnswer: lessonType === 'quiz' ? lessonCorrectAnswer : undefined,
    };
    
    setLessons([...lessons, newLesson]);
    setLessonTitle("");
    setLessonContent("");
    setLessonDuration("10 min");
    setLessonVideoUrl("");
    setLessonCorrectAnswer("");
  };

  const removeLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast({ title: "Preencha título e descrição", variant: "destructive" });
      return;
    }
    
    if (lessons.length === 0) {
      toast({ title: "Adicione pelo menos uma lição", variant: "destructive" });
      return;
    }

    if (!projectTitle.trim() || !projectDescription.trim()) {
      toast({ title: "Preencha o desafio final", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    try {
      const finalProject: FinalProject = {
        title: projectTitle,
        description: projectDescription,
        steps: projectSteps.split('\n').filter(s => s.trim()),
      };

      const insertData = {
        stem_area: stemArea,
        module_id: `mod-${Date.now()}`,
        title,
        description,
        category: stemArea,
        icon: 'BookOpen',
        color: 'bg-purple-500',
        total_lessons: lessons.length,
        estimated_time: estimatedTime,
        lessons: lessons as unknown as import('@/integrations/supabase/types').Json,
        final_project: finalProject as unknown as import('@/integrations/supabase/types').Json,
      };

      const { error } = await supabase.from('modules_content').insert(insertData);
      
      if (error) throw error;

      toast({ title: "Módulo adicionado com sucesso!" });
      resetForm();
      onContentChange();
    } catch (error: any) {
      console.error('Error adding module:', error);
      toast({ title: "Erro ao adicionar", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <Card 
        onClick={() => setIsEditing(true)}
        className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-2 border-dashed border-purple-300 bg-purple-50/50"
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold">Novo Módulo</h4>
              <p className="text-sm opacity-90">Clique para adicionar</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-purple-600">Criar curso completo com lições e desafio final</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="col-span-full p-6 border-2 border-purple-300 bg-white animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-gray-800">Novo Módulo</h3>
          <div className="flex gap-2">
            {['info', 'lessons', 'project'].map((s, i) => (
              <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s ? 'bg-purple-500 text-white' : 
                (s === 'info' && step !== 'info') || (s === 'lessons' && step === 'project') 
                  ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={resetForm}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {step === 'info' && (
        <div className="space-y-4">
          <div>
            <Label>Título do Módulo *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Programação Básica" />
          </div>
          <div>
            <Label>Descrição *</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição do módulo" />
          </div>
          <div>
            <Label>Tempo Estimado</Label>
            <Input value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} placeholder="3 horas" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={resetForm}>Cancelar</Button>
            <Button onClick={() => setStep('lessons')} disabled={!title.trim() || !description.trim()}>
              Próximo: Lições
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {step === 'lessons' && (
        <div className="space-y-6">
          {lessons.length > 0 && (
            <div className="space-y-2">
              <Label>Lições adicionadas ({lessons.length})</Label>
              <div className="space-y-2">
                {lessons.map((lesson, index) => {
                  const typeInfo = lessonTypes.find(t => t.value === lesson.type);
                  const Icon = typeInfo?.icon || FileText;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 ${typeInfo?.color} rounded flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{lesson.title}</p>
                        <p className="text-xs text-gray-500">{typeInfo?.label} • {lesson.duration}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeLesson(index)}>
                        <X className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Card className="p-4 bg-purple-50 border-purple-200">
            <h4 className="font-semibold text-gray-800 mb-4">Adicionar Lição</h4>
            
            <div className="grid grid-cols-5 gap-2 mb-4">
              {lessonTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setLessonType(type.value as ModuleLesson['type'])}
                    className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all ${
                      lessonType === type.value 
                        ? `${type.color} text-white` 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{type.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Título da Lição *</Label>
                  <Input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="Título" />
                </div>
                <div>
                  <Label>Duração</Label>
                  <Input value={lessonDuration} onChange={(e) => setLessonDuration(e.target.value)} placeholder="10 min" />
                </div>
              </div>
              
              {lessonType === 'video' && (
                <div>
                  <Label>URL do Vídeo (YouTube embed)</Label>
                  <Input value={lessonVideoUrl} onChange={(e) => setLessonVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
                </div>
              )}
              
              <div>
                <Label>Conteúdo</Label>
                <Textarea 
                  value={lessonContent} 
                  onChange={(e) => setLessonContent(e.target.value)} 
                  placeholder={lessonType === 'quiz' ? "Pergunta?\nA) Opção 1\nB) Opção 2\nC) Opção 3\nD) Opção 4" : "Conteúdo da lição"}
                  rows={4}
                />
              </div>
              
              {lessonType === 'quiz' && (
                <div>
                  <Label>Resposta Correta (A, B, C ou D)</Label>
                  <Input value={lessonCorrectAnswer} onChange={(e) => setLessonCorrectAnswer(e.target.value.toUpperCase())} placeholder="A" maxLength={1} />
                </div>
              )}

              <Button onClick={addLesson} className="w-full" variant="secondary">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Lição
              </Button>
            </div>
          </Card>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep('info')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={() => setStep('project')} disabled={lessons.length === 0}>
              Próximo: Desafio Final
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {step === 'project' && (
        <div className="space-y-4">
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-yellow-600" />
              <h4 className="font-semibold text-gray-800">Desafio Final</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Título do Desafio *</Label>
                <Input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="Ex: Crie seu primeiro programa" />
              </div>
              <div>
                <Label>Descrição *</Label>
                <Textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Descrição do desafio" rows={3} />
              </div>
              <div>
                <Label>Dicas/Passos (um por linha)</Label>
                <Textarea 
                  value={projectSteps} 
                  onChange={(e) => setProjectSteps(e.target.value)} 
                  placeholder="Passo 1: Defina o problema&#10;Passo 2: Planeje a solução&#10;Passo 3: Implemente"
                  rows={4}
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep('lessons')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !projectTitle.trim() || !projectDescription.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              Salvar Módulo
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
