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
import { Experiment } from "@/hooks/useExperimentsContent";

interface EditExperimentInlineProps {
  experiment: Experiment;
  onClose: () => void;
  onContentChange: () => void;
}

interface ExperimentStep {
  text: string;
  emoji: string;
}

const TIME_OPTIONS = [
  "5 min", "10 min", "15 min", "20 min", "25 min", "30 min", "45 min", "1 hora", "1h30", "2 horas"
];

const EMOJI_OPTIONS = [
  "📝", "🔬", "🧪", "⚗️", "🔭", "🌡️", "💡", "⚡", "🔋", "🧲",
  "🔥", "💧", "🌪️", "🌈", "✨", "🎨", "📊", "🔢", "🎯", "🚀"
];

export const EditExperimentInline = ({ experiment, onClose, onContentChange }: EditExperimentInlineProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Experiment info
  const [title, setTitle] = useState(experiment.title);
  const [description, setDescription] = useState(experiment.description);
  const [difficulty, setDifficulty] = useState(experiment.difficulty);
  const [time, setTime] = useState(experiment.time);
  const [emoji, setEmoji] = useState(experiment.image);
  const [materials, setMaterials] = useState<string[]>(experiment.materials);
  const [materialInput, setMaterialInput] = useState("");
  
  // Steps with individual emojis
  const [steps, setSteps] = useState<ExperimentStep[]>(
    experiment.steps.map((step, i) => ({
      text: step,
      emoji: experiment.stepImages?.[i] || "📝"
    }))
  );
  const [stepInput, setStepInput] = useState("");
  const [stepEmoji, setStepEmoji] = useState("📝");
  
  const stepLabels = ['Informações', 'Materiais', 'Passos'];

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
      const { error } = await supabase
        .from('experiments_content')
        .update({
          title,
          description,
          difficulty,
          time,
          materials,
          steps: steps.map(s => s.text),
          image: emoji,
          step_images: steps.map(s => s.emoji),
        })
        .eq('id', experiment.id);
      
      if (error) throw error;

      toast({ title: "Experimento atualizado com sucesso!" });
      onContentChange();
      onClose();
    } catch (error: any) {
      console.error('Error updating experiment:', error);
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
            <h3 className="text-xl font-bold text-gray-800">Editar Experimento</h3>
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
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {currentStepIndex === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Título do Experimento *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="col-span-2">
                <Label>Descrição *</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
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
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
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
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
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
                Salvar Alterações
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
