import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ChevronLeft, ChevronRight, Loader2, X, Save, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddExperimentInlineProps {
  selectedArea: string;
  onContentChange: () => void;
  isAdmin: boolean;
}

interface ExperimentStep {
  text: string;
  emoji: string;
}

const areaMap: Record<string, string> = {
  science: "Ciência",
  technology: "Tecnologia",
  engineering: "Engenharia",
  math: "Matemática",
};

const TIME_OPTIONS = [
  "5 min", "10 min", "15 min", "20 min", "25 min", "30 min", "45 min", "1 hora", "1h30", "2 horas"
];

const EMOJI_OPTIONS = [
  "📝", "🔬", "🧪", "⚗️", "🔭", "🌡️", "💡", "⚡", "🔋", "🧲",
  "🔥", "💧", "🌪️", "🌈", "✨", "🎨", "📊", "🔢", "🎯", "🚀"
];

export const AddExperimentInline = ({ selectedArea, onContentChange, isAdmin }: AddExperimentInlineProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Experiment info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Fácil");
  const [time, setTime] = useState("15 min");
  const [emoji, setEmoji] = useState("🧪");
  const [materials, setMaterials] = useState<string[]>([]);
  const [materialInput, setMaterialInput] = useState("");
  
  // Steps with individual emojis
  const [steps, setSteps] = useState<ExperimentStep[]>([]);
  const [stepInput, setStepInput] = useState("");
  const [stepEmoji, setStepEmoji] = useState("📝");

  const stemArea = areaMap[selectedArea] || "Ciência";
  
  // Steps: 0 = info, 1 = materials, 2 = steps
  const stepLabels = ['Informações', 'Materiais', 'Passos'];

  if (!isAdmin) return null;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDifficulty("Fácil");
    setTime("15 min");
    setEmoji("🧪");
    setMaterials([]);
    setMaterialInput("");
    setSteps([]);
    setStepInput("");
    setStepEmoji("📝");
    setCurrentStepIndex(0);
    setIsEditing(false);
  };

  const addMaterial = () => {
    if (materialInput.trim()) {
      setMaterials([...materials, materialInput.trim()]);
      setMaterialInput("");
    }
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const addStep = () => {
    if (stepInput.trim()) {
      setSteps([...steps, { text: stepInput.trim(), emoji: stepEmoji }]);
      setStepInput("");
      setStepEmoji("📝");
    }
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const validateInfo = (): boolean => {
    if (!title.trim()) {
      toast({ title: "Digite o título do experimento", variant: "destructive" });
      return false;
    }
    if (!description.trim()) {
      toast({ title: "Digite a descrição", variant: "destructive" });
      return false;
    }
    if (!difficulty) {
      toast({ title: "Selecione a dificuldade", variant: "destructive" });
      return false;
    }
    if (!time) {
      toast({ title: "Selecione o tempo", variant: "destructive" });
      return false;
    }
    if (!emoji.trim()) {
      toast({ title: "Digite o emoji do experimento", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleNextFromInfo = () => {
    if (validateInfo()) {
      setCurrentStepIndex(1);
    }
  };

  const handleSubmit = async () => {
    if (!validateInfo()) {
      setCurrentStepIndex(0);
      return;
    }
    
    if (materials.length === 0) {
      toast({ title: "Adicione pelo menos um material", variant: "destructive" });
      setCurrentStepIndex(1);
      return;
    }

    if (steps.length === 0) {
      toast({ title: "Adicione pelo menos um passo", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.from('experiments_content').insert({
        stem_area: stemArea,
        experiment_id: `exp-${Date.now()}`,
        title,
        description,
        difficulty,
        time,
        materials,
        steps: steps.map(s => s.text),
        icon: 'Beaker',
        color: 'bg-purple-500',
        image: emoji,
        step_images: steps.map(s => s.emoji),
      });
      
      if (error) throw error;

      toast({ title: "Experimento adicionado com sucesso!" });
      resetForm();
      onContentChange();
    } catch (error: any) {
      console.error('Error adding experiment:', error);
      toast({ title: "Erro ao adicionar", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <Card 
        onClick={() => setIsEditing(true)}
        className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-dashed border-purple-300 bg-purple-50/50 flex flex-col items-center justify-center min-h-[280px]"
      >
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <span className="text-purple-600 font-semibold text-lg">Novo Experimento</span>
        <span className="text-purple-400 text-sm mt-1">Clique para adicionar</span>
      </Card>
    );
  }

  return (
    <Card className="col-span-full p-6 border-2 border-purple-300 bg-white animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-gray-800">Novo Experimento</h3>
          <div className="flex gap-2">
            {stepLabels.map((label, i) => (
              <div 
                key={label} 
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  currentStepIndex === i ? 'bg-purple-500 text-white' : 
                  currentStepIndex > i ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={resetForm}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {currentStepIndex === 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Título do Experimento *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Vulcão de Bicarbonato" />
            </div>
            <div className="col-span-2">
              <Label>Descrição *</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição curta e empolgante" />
            </div>
            <div>
              <Label>Dificuldade *</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fácil">Fácil</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Avançado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tempo *</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Emoji do Experimento *</Label>
              <Input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🧪" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={resetForm}>Cancelar</Button>
            <Button onClick={handleNextFromInfo}>
              Próximo: Materiais
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {currentStepIndex === 1 && (
        <div className="space-y-4">
          <div className="text-center text-6xl mb-4">{emoji}</div>
          <h4 className="font-semibold text-gray-800">Materiais necessários para: {title}</h4>
          
          {materials.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {materials.map((material, index) => (
                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full flex items-center gap-2">
                  {material}
                  <button onClick={() => removeMaterial(index)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input 
              value={materialInput} 
              onChange={(e) => setMaterialInput(e.target.value)} 
              placeholder="Digite um material e clique em adicionar"
              onKeyDown={(e) => e.key === 'Enter' && addMaterial()}
            />
            <Button onClick={addMaterial} variant="secondary">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setCurrentStepIndex(0)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={() => setCurrentStepIndex(2)} disabled={materials.length === 0}>
              Próximo: Passos
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {currentStepIndex === 2 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Passos do experimento: {title}</h4>
          
          {steps.length > 0 && (
            <div className="space-y-2 mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-xl flex-shrink-0">{step.emoji}</span>
                  <p className="flex-1 text-gray-700">{step.text}</p>
                  <Button variant="ghost" size="sm" onClick={() => removeStep(index)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="w-24">
                <Label>Emoji</Label>
                <Select value={stepEmoji} onValueChange={setStepEmoji}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMOJI_OPTIONS.map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label>Adicionar Passo {steps.length + 1}</Label>
                <Textarea 
                  value={stepInput} 
                  onChange={(e) => setStepInput(e.target.value)} 
                  placeholder="Descreva o que fazer neste passo..."
                  rows={2}
                />
              </div>
            </div>
            <Button onClick={addStep} variant="secondary" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Passo
            </Button>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setCurrentStepIndex(1)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || steps.length === 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              Salvar Experimento
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};