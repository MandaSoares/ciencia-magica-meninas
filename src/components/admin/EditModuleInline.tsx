import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Loader2, Video, FileText, Beaker, HelpCircle, Award, X, Save, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Module, ModuleLesson, FinalProject } from "@/hooks/useModulesContent";
import { RichTextEditor } from "./RichTextEditor";
import { QuizOptionsEditor, parseQuizContent, optionsToContent } from "./QuizOptionsEditor";

interface EditModuleInlineProps {
  module: Module;
  onClose: () => void;
  onContentChange: () => void;
}

const lessonTypes = [
  { value: 'video', label: 'Vídeo', icon: Video, color: 'bg-red-500' },
  { value: 'reading', label: 'Leitura', icon: FileText, color: 'bg-blue-500' },
  { value: 'practice', label: 'Desafio', icon: Beaker, color: 'bg-green-500' },
  { value: 'quiz', label: 'Quiz', icon: HelpCircle, color: 'bg-purple-500' },
  { value: 'project', label: 'Projeto', icon: Award, color: 'bg-yellow-500' },
];

const DURATION_OPTIONS = [
  "5 min", "10 min", "15 min", "20 min", "25 min", "30 min", "45 min", "1 hora", "1h30", "2 horas"
];

const ESTIMATED_TIME_OPTIONS = [
  "1 hora", "2 horas", "3 horas", "4 horas", "5 horas", "6 horas", "8 horas", "10 horas"
];

export const EditModuleInline = ({ module, onClose, onContentChange }: EditModuleInlineProps) => {
  const [step, setStep] = useState<'info' | 'lessons' | 'project'>('info');
  const [isLoading, setIsLoading] = useState(false);
  
  // Module info
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description);
  const [estimatedTime, setEstimatedTime] = useState(module.estimatedTime);
  
  // Lessons
  const [lessons, setLessons] = useState<ModuleLesson[]>(module.lessons || []);
  const [lessonType, setLessonType] = useState<ModuleLesson['type']>('video');
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonDuration, setLessonDuration] = useState("10 min");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonCorrectAnswer, setLessonCorrectAnswer] = useState("");
  
  // Quiz editor state
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState<{letter: string; text: string}[]>([
    { letter: "A", text: "" },
    { letter: "B", text: "" }
  ]);
  
  // Editing existing lesson
  const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(null);
  
  // Final Project
  const [projectTitle, setProjectTitle] = useState(module.finalProject?.title || "");
  const [projectDescription, setProjectDescription] = useState(module.finalProject?.description || "");
  const [projectSteps, setProjectSteps] = useState(module.finalProject?.steps?.join('\n') || "");

  const resetLessonForm = () => {
    setLessonTitle("");
    setLessonContent("");
    setLessonDuration("10 min");
    setLessonVideoUrl("");
    setLessonCorrectAnswer("");
    setQuizQuestion("");
    setQuizOptions([{ letter: "A", text: "" }, { letter: "B", text: "" }]);
    setEditingLessonIndex(null);
  };

  const validateLesson = (): boolean => {
    if (!lessonTitle.trim()) {
      toast({ title: "Digite o título da lição", variant: "destructive" });
      return false;
    }
    if (!lessonDuration) {
      toast({ title: "Selecione a duração", variant: "destructive" });
      return false;
    }
    if (lessonType === 'video' && !lessonVideoUrl.trim()) {
      toast({ title: "Digite a URL do vídeo", variant: "destructive" });
      return false;
    }
    if (lessonType === 'quiz') {
      if (!quizQuestion.trim()) {
        toast({ title: "Digite a pergunta do quiz", variant: "destructive" });
        return false;
      }
      const validOptions = quizOptions.filter(o => o.text.trim());
      if (validOptions.length < 2) {
        toast({ title: "Adicione pelo menos 2 opções", variant: "destructive" });
        return false;
      }
      if (!lessonCorrectAnswer) {
        toast({ title: "Selecione a resposta correta", variant: "destructive" });
        return false;
      }
    } else if (!lessonContent.trim()) {
      toast({ title: "Digite o conteúdo da lição", variant: "destructive" });
      return false;
    }
    return true;
  };

  const addOrUpdateLesson = () => {
    if (!validateLesson()) return;
    
    const content = lessonType === 'quiz' 
      ? optionsToContent(quizQuestion, quizOptions.filter(o => o.text.trim()))
      : lessonContent;
    
    const newLesson: ModuleLesson = {
      type: lessonType,
      title: lessonTitle,
      content: content,
      duration: lessonDuration,
      videoUrl: lessonType === 'video' ? lessonVideoUrl : undefined,
      correctAnswer: lessonType === 'quiz' ? lessonCorrectAnswer.toUpperCase() : undefined,
    };
    
    if (editingLessonIndex !== null) {
      const updated = [...lessons];
      updated[editingLessonIndex] = newLesson;
      setLessons(updated);
      toast({ title: "Lição atualizada!" });
    } else {
      setLessons([...lessons, newLesson]);
    }
    resetLessonForm();
  };

  const editLesson = (index: number) => {
    const lesson = lessons[index];
    setLessonType(lesson.type);
    setLessonTitle(lesson.title);
    setLessonDuration(lesson.duration);
    setLessonVideoUrl(lesson.videoUrl || "");
    setLessonCorrectAnswer(lesson.correctAnswer || "");
    setEditingLessonIndex(index);
    
    if (lesson.type === 'quiz') {
      const parsed = parseQuizContent(lesson.content);
      setQuizQuestion(parsed.question);
      setQuizOptions(parsed.options.length >= 2 ? parsed.options : [{ letter: "A", text: "" }, { letter: "B", text: "" }]);
    } else {
      setLessonContent(lesson.content);
    }
  };

  const removeLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
    if (editingLessonIndex === index) {
      resetLessonForm();
    }
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
    const steps = projectSteps.split('\n').filter(s => s.trim());
    if (steps.length === 0) {
      toast({ title: "Adicione pelo menos uma dica/passo no desafio final", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    try {
      const finalProject: FinalProject = {
        title: projectTitle,
        description: projectDescription,
        steps: steps,
      };

      const { error } = await supabase
        .from('modules_content')
        .update({
          title,
          description,
          estimated_time: estimatedTime,
          total_lessons: lessons.length,
          lessons: lessons as unknown as import('@/integrations/supabase/types').Json,
          final_project: finalProject as unknown as import('@/integrations/supabase/types').Json,
        })
        .eq('id', module.dbId);
      
      if (error) throw error;

      toast({ title: "Módulo atualizado com sucesso!" });
      onContentChange();
      onClose();
    } catch (error: any) {
      console.error('Error updating module:', error);
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-gray-800">Editar Módulo</h3>
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
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {step === 'info' && (
          <div className="space-y-4">
            <div>
              <Label>Título do Módulo *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                label="Descrição *"
                placeholder="Descrição do módulo..."
                rows={3}
              />
            </div>
            <div>
              <Label>Tempo Estimado *</Label>
              <Select value={estimatedTime} onValueChange={setEstimatedTime}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ESTIMATED_TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
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
                <Label>Lições ({lessons.length})</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {lessons.map((lesson, index) => {
                    const typeInfo = lessonTypes.find(t => t.value === lesson.type);
                    const Icon = typeInfo?.icon || FileText;
                    return (
                      <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${editingLessonIndex === index ? 'bg-purple-100 border-2 border-purple-300' : 'bg-gray-50'}`}>
                        <div className={`w-8 h-8 ${typeInfo?.color} rounded flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{lesson.title}</p>
                          <p className="text-xs text-gray-500">{typeInfo?.label} • {lesson.duration}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => editLesson(index)}>
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeLesson(index)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Card className="p-4 bg-purple-50 border-purple-200">
              <h4 className="font-semibold text-gray-800 mb-4">
                {editingLessonIndex !== null ? "Editar Lição" : "Adicionar Lição"}
              </h4>
              
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
                    <Label>Duração *</Label>
                    <Select value={lessonDuration} onValueChange={setLessonDuration}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DURATION_OPTIONS.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {lessonType === 'video' && (
                  <div>
                    <Label>URL do Vídeo *</Label>
                    <Input value={lessonVideoUrl} onChange={(e) => setLessonVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
                  </div>
                )}
                
                {lessonType === 'quiz' ? (
                  <QuizOptionsEditor
                    question={quizQuestion}
                    onQuestionChange={setQuizQuestion}
                    options={quizOptions}
                    onOptionsChange={setQuizOptions}
                    correctAnswer={lessonCorrectAnswer}
                    onCorrectAnswerChange={setLessonCorrectAnswer}
                  />
                ) : (
                  <RichTextEditor
                    value={lessonContent}
                    onChange={setLessonContent}
                    label="Conteúdo *"
                    placeholder="Conteúdo da lição"
                    rows={4}
                    showImageUpload={lessonType === 'reading' || lessonType === 'practice' || lessonType === 'project'}
                  />
                )}

                <Button onClick={addOrUpdateLesson} className="w-full" variant="secondary">
                  {editingLessonIndex !== null ? "Atualizar Lição" : "Adicionar Lição"}
                </Button>
                {editingLessonIndex !== null && (
                  <Button onClick={resetLessonForm} className="w-full" variant="outline">
                    Cancelar Edição
                  </Button>
                )}
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
                  <Input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
                </div>
                <RichTextEditor
                  value={projectDescription}
                  onChange={setProjectDescription}
                  label="Descrição *"
                  placeholder="Descrição do desafio..."
                  rows={3}
                  showImageUpload
                />
                <RichTextEditor
                  value={projectSteps}
                  onChange={setProjectSteps}
                  label="Dicas/Passos (um por linha) *"
                  placeholder="Passo 1: ..."
                  rows={4}
                />
              </div>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep('lessons')}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};