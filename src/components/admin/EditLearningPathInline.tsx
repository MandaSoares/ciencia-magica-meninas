import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Loader2, Video, BookOpen, PenTool, CheckCircle, Award, X, Save, Plus, Edit2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PathLevel, LessonStep } from "@/hooks/useLearningPathContent";
import { RichTextEditor } from "./RichTextEditor";
import { QuizOptionsEditor, parseQuizContent, optionsToContent } from "./QuizOptionsEditor";

interface EditLearningPathInlineProps {
  level: PathLevel;
  onClose: () => void;
  onContentChange: () => void;
}

const lessonTypes = [
  { value: 'video', label: 'Vídeo', icon: Video, color: 'bg-red-500' },
  { value: 'reading', label: 'Leitura', icon: BookOpen, color: 'bg-blue-500' },
  { value: 'practice', label: 'Prática', icon: PenTool, color: 'bg-green-500' },
  { value: 'quiz', label: 'Quiz', icon: CheckCircle, color: 'bg-purple-500' },
  { value: 'inspiration', label: 'Inspiração', icon: Award, color: 'bg-yellow-500' },
];

const DURATION_OPTIONS = [
  "5 min", "10 min", "15 min", "20 min", "25 min", "30 min", "45 min", "1 hora"
];

export const EditLearningPathInline = ({ level, onClose, onContentChange }: EditLearningPathInlineProps) => {
  const [step, setStep] = useState<'info' | 'lessons'>('info');
  const [isLoading, setIsLoading] = useState(false);
  
  // Level info
  const [title, setTitle] = useState(level.title);
  const [description, setDescription] = useState(level.description);
  const [difficulty, setDifficulty] = useState(level.difficulty);
  
  // Lessons
  const [lessons, setLessons] = useState<LessonStep[]>(level.lessons || []);
  const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(null);
  const [lessonType, setLessonType] = useState<LessonStep['type']>('video');
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonDuration, setLessonDuration] = useState("10 min");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonCorrectAnswer, setLessonCorrectAnswer] = useState("");
  
  // Quiz specific state
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState<{letter: string; text: string}[]>([
    { letter: "A", text: "" },
    { letter: "B", text: "" }
  ]);

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

  const loadLessonForEdit = (lesson: LessonStep, index: number) => {
    setEditingLessonIndex(index);
    setLessonType(lesson.type);
    setLessonTitle(lesson.title);
    setLessonDuration(lesson.duration || "10 min");
    setLessonVideoUrl(lesson.videoUrl || "");
    setLessonCorrectAnswer(lesson.correctAnswer || "");
    
    if (lesson.type === 'quiz') {
      const parsed = parseQuizContent(lesson.content);
      setQuizQuestion(parsed.question);
      setQuizOptions(parsed.options.length > 0 ? parsed.options : [{ letter: "A", text: "" }, { letter: "B", text: "" }]);
    } else {
      setLessonContent(lesson.content);
    }
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
      if (quizOptions.some(opt => !opt.text.trim())) {
        toast({ title: "Preencha todas as opções do quiz", variant: "destructive" });
        return false;
      }
      if (!lessonCorrectAnswer) {
        toast({ title: "Selecione a resposta correta", variant: "destructive" });
        return false;
      }
    } else {
      if (!lessonContent.trim()) {
        toast({ title: "Digite o conteúdo da lição", variant: "destructive" });
        return false;
      }
    }
    
    return true;
  };

  const saveLesson = () => {
    if (!validateLesson()) return;
    
    const content = lessonType === 'quiz' 
      ? optionsToContent(quizQuestion, quizOptions)
      : lessonContent;
    
    const newLesson: LessonStep = {
      type: lessonType,
      title: lessonTitle,
      content,
      duration: lessonDuration,
      videoUrl: lessonType === 'video' ? lessonVideoUrl : undefined,
      correctAnswer: lessonType === 'quiz' ? lessonCorrectAnswer.toUpperCase() : undefined,
    };
    
    if (editingLessonIndex !== null) {
      const newLessons = [...lessons];
      newLessons[editingLessonIndex] = newLesson;
      setLessons(newLessons);
    } else {
      setLessons([...lessons, newLesson]);
    }
    
    resetLessonForm();
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
    if (!difficulty) {
      toast({ title: "Selecione a dificuldade", variant: "destructive" });
      return;
    }
    if (lessons.length === 0) {
      toast({ title: "Adicione pelo menos uma lição", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('learning_path_content')
        .update({
          title,
          description,
          difficulty,
          lessons: lessons as unknown as import('@/integrations/supabase/types').Json,
        })
        .eq('id', level.dbId);
      
      if (error) throw error;

      toast({ title: "Nível atualizado com sucesso!" });
      onContentChange();
      onClose();
    } catch (error: any) {
      console.error('Error updating level:', error);
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Editar Nível: {level.title}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {step === 'info' ? (
          <div className="space-y-4">
            <div>
              <Label>Título do Nível *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label>Descrição *</Label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                label=""
                placeholder="Descrição do nível"
                rows={3}
              />
            </div>
            <div>
              <Label>Dificuldade *</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Iniciante">Iniciante</SelectItem>
                  <SelectItem value="Intermediário">Intermediário</SelectItem>
                  <SelectItem value="Avançado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button onClick={() => setStep('lessons')} disabled={!title.trim() || !description.trim()}>
                Próximo: Editar Lições
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {lessons.length > 0 && (
              <div className="space-y-2">
                <Label>Lições ({lessons.length})</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {lessons.map((lesson, index) => {
                    const typeInfo = lessonTypes.find(t => t.value === lesson.type);
                    const Icon = typeInfo?.icon || BookOpen;
                    const isEditing = editingLessonIndex === index;
                    return (
                      <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${isEditing ? 'bg-purple-100 ring-2 ring-purple-500' : 'bg-gray-50'}`}>
                        <div className={`w-8 h-8 ${typeInfo?.color} rounded flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{lesson.title}</p>
                          <p className="text-xs text-gray-500">{typeInfo?.label} • {lesson.duration || "10 min"}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => loadLessonForEdit(lesson, index)}>
                          <Edit2 className="w-4 h-4 text-blue-500" />
                        </Button>
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
              <h4 className="font-semibold text-gray-800 mb-4">
                {editingLessonIndex !== null ? `Editando Lição ${editingLessonIndex + 1}` : 'Adicionar Nova Lição'}
              </h4>
              
              <div className="grid grid-cols-5 gap-2 mb-4">
                {lessonTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setLessonType(type.value as LessonStep['type'])}
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
                    <Label>URL do Vídeo (YouTube embed) *</Label>
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
                  />
                )}

                <div className="flex gap-2">
                  {editingLessonIndex !== null && (
                    <Button onClick={resetLessonForm} variant="outline" className="flex-1">
                      Cancelar Edição
                    </Button>
                  )}
                  <Button onClick={saveLesson} variant="secondary" className="flex-1">
                    {editingLessonIndex !== null ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Lição
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Lição
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep('info')}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || lessons.length === 0}
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
