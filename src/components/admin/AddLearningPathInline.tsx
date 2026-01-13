import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ChevronLeft, ChevronRight, Loader2, Video, BookOpen, PenTool, CheckCircle, Award, X, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddLearningPathInlineProps {
  selectedArea: string;
  onContentChange: () => void;
  isAdmin: boolean;
}

interface LessonStep {
  type: 'video' | 'reading' | 'practice' | 'quiz' | 'inspiration';
  title: string;
  content: string;
  duration?: string;
  videoUrl?: string;
  correctAnswer?: string;
}

const areaMap: Record<string, string> = {
  science: "Ciência",
  technology: "Tecnologia",
  engineering: "Engenharia",
  math: "Matemática",
};

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

export const AddLearningPathInline = ({ selectedArea, onContentChange, isAdmin }: AddLearningPathInlineProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState<'info' | 'lessons'>('info');
  const [isLoading, setIsLoading] = useState(false);
  
  // Level info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Iniciante");
  
  // Lessons
  const [lessons, setLessons] = useState<LessonStep[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(-1);
  const [lessonType, setLessonType] = useState<LessonStep['type']>('video');
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonDuration, setLessonDuration] = useState("10 min");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonCorrectAnswer, setLessonCorrectAnswer] = useState("");

  const stemArea = areaMap[selectedArea] || "Ciência";

  if (!isAdmin) return null;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDifficulty("Iniciante");
    setLessons([]);
    setCurrentLessonIndex(-1);
    setStep('info');
    setIsEditing(false);
    resetLessonForm();
  };

  const resetLessonForm = () => {
    setLessonTitle("");
    setLessonContent("");
    setLessonDuration("10 min");
    setLessonVideoUrl("");
    setLessonCorrectAnswer("");
  };

  // Parse quiz options from content
  const parseQuizOptions = (content: string): string[] => {
    const lines = content.split('\n').filter(line => line.trim());
    const optionPattern = /^([A-D])\)/;
    const options: string[] = [];
    
    for (const line of lines) {
      const match = line.match(optionPattern);
      if (match) {
        options.push(match[1]);
      }
    }
    
    return options;
  };

  const validateLesson = (): boolean => {
    // Validate title
    if (!lessonTitle.trim()) {
      toast({ title: "Digite o título da lição", variant: "destructive" });
      return false;
    }

    // Validate content
    if (!lessonContent.trim()) {
      toast({ title: "Digite o conteúdo da lição", variant: "destructive" });
      return false;
    }

    // Validate duration
    if (!lessonDuration) {
      toast({ title: "Selecione a duração", variant: "destructive" });
      return false;
    }

    // Validate video URL for video type
    if (lessonType === 'video' && !lessonVideoUrl.trim()) {
      toast({ title: "Digite a URL do vídeo", variant: "destructive" });
      return false;
    }

    // Validate quiz answer
    if (lessonType === 'quiz') {
      if (!lessonCorrectAnswer.trim()) {
        toast({ title: "Digite a resposta correta", variant: "destructive" });
        return false;
      }

      // Check if answer is in options
      const options = parseQuizOptions(lessonContent);
      if (options.length === 0) {
        toast({ title: "Adicione as opções do quiz (A), B), C), D))", variant: "destructive" });
        return false;
      }

      if (!options.includes(lessonCorrectAnswer.toUpperCase())) {
        toast({ 
          title: "Resposta inválida", 
          description: `A resposta correta "${lessonCorrectAnswer}" não está entre as opções disponíveis: ${options.join(', ')}`,
          variant: "destructive" 
        });
        return false;
      }
    }

    return true;
  };

  const addLesson = () => {
    if (!validateLesson()) return;
    
    const newLesson: LessonStep = {
      type: lessonType,
      title: lessonTitle,
      content: lessonContent,
      duration: lessonDuration,
      videoUrl: lessonType === 'video' ? lessonVideoUrl : undefined,
      correctAnswer: lessonType === 'quiz' ? lessonCorrectAnswer.toUpperCase() : undefined,
    };
    
    setLessons([...lessons, newLesson]);
    resetLessonForm();
    setCurrentLessonIndex(-1);
  };

  const removeLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
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
      const maxOrder = await supabase
        .from('learning_path_content')
        .select('sort_order')
        .eq('stem_area', stemArea)
        .order('sort_order', { ascending: false })
        .limit(1);
      
      const nextOrder = (maxOrder.data?.[0]?.sort_order || 0) + 1;

      const insertData = {
        stem_area: stemArea,
        level_number: nextOrder,
        title,
        description,
        icon: 'Star',
        difficulty,
        points: 30,
        color: 'bg-purple-500',
        lessons: lessons as unknown as import('@/integrations/supabase/types').Json,
        sort_order: nextOrder,
      };

      const { error } = await supabase.from('learning_path_content').insert(insertData);
      
      if (error) throw error;

      toast({ title: "Nível adicionado com sucesso!" });
      resetForm();
      onContentChange();
    } catch (error: any) {
      console.error('Error adding level:', error);
      toast({ title: "Erro ao adicionar", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex justify-center mb-8">
        <Card 
          onClick={() => setIsEditing(true)}
          className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-dashed border-purple-300 bg-purple-50/50 flex flex-col items-center justify-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <span className="text-purple-600 font-semibold text-lg">Novo Nível</span>
          <span className="text-purple-400 text-sm mt-1">Clique para adicionar</span>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8 animate-fade-in">
      <Card className="p-6 border-2 border-purple-300 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {step === 'info' ? 'Informações do Nível' : 'Lições do Nível'}
          </h3>
          <Button variant="ghost" size="sm" onClick={resetForm}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {step === 'info' ? (
          <div className="space-y-4">
            <div>
              <Label>Título do Nível *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Introdução à Ciência" />
            </div>
            <div>
              <Label>Descrição *</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição do nível" />
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
              <Button variant="outline" onClick={resetForm}>Cancelar</Button>
              <Button onClick={() => setStep('lessons')} disabled={!title.trim() || !description.trim()}>
                Próximo: Adicionar Lições
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Lições adicionadas */}
            {lessons.length > 0 && (
              <div className="space-y-2">
                <Label>Lições adicionadas ({lessons.length})</Label>
                <div className="space-y-2">
                  {lessons.map((lesson, index) => {
                    const typeInfo = lessonTypes.find(t => t.value === lesson.type);
                    const Icon = typeInfo?.icon || BookOpen;
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

            {/* Formulário para nova lição */}
            <Card className="p-4 bg-purple-50 border-purple-200">
              <h4 className="font-semibold text-gray-800 mb-4">Adicionar Nova Lição</h4>
              
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
                
                <div>
                  <Label>Conteúdo *</Label>
                  <Textarea 
                    value={lessonContent} 
                    onChange={(e) => setLessonContent(e.target.value)} 
                    placeholder={lessonType === 'quiz' ? "Pergunta?\nA) Opção 1\nB) Opção 2\nC) Opção 3\nD) Opção 4" : "Conteúdo da lição"}
                    rows={4}
                  />
                </div>
                
                {lessonType === 'quiz' && (
                  <div>
                    <Label>Resposta Correta (A, B, C ou D) *</Label>
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
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || lessons.length === 0}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Save className="w-4 h-4 mr-2" />
                Salvar Nível
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};