import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ChevronLeft, ChevronRight, Loader2, X, Save, Trash2, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Career, WomanProfile } from "@/hooks/useCareerAreasContent";
import { ImageUpload } from "./ImageUpload";

interface EditCareerInlineProps {
  career: Career;
  onClose: () => void;
  onContentChange: () => void;
}

const SALARY_OPTIONS = [
  "R$ 2.000 - R$ 4.000",
  "R$ 3.000 - R$ 6.000",
  "R$ 4.000 - R$ 8.000",
  "R$ 5.000 - R$ 10.000",
  "R$ 6.000 - R$ 12.000",
  "R$ 8.000 - R$ 15.000",
  "R$ 10.000 - R$ 20.000",
  "R$ 15.000 - R$ 30.000",
  "R$ 20.000 - R$ 40.000",
  "R$ 25.000+"
];

export const EditCareerInline = ({ career, onClose, onContentChange }: EditCareerInlineProps) => {
  const [currentStep, setCurrentStep] = useState<'info' | 'women'>('info');
  const [isLoading, setIsLoading] = useState(false);
  
  // Career info
  const [name, setName] = useState(career.name);
  const [description, setDescription] = useState(career.description);
  const [salaryRange, setSalaryRange] = useState(career.salaryRange || "");
  
  // Women profiles
  const [women, setWomen] = useState<WomanProfile[]>(career.women || []);
  const [womanName, setWomanName] = useState("");
  const [womanAchievement, setWomanAchievement] = useState("");
  const [womanStory, setWomanStory] = useState("");
  const [womanImage, setWomanImage] = useState("");

  const resetWomanForm = () => {
    setWomanName("");
    setWomanAchievement("");
    setWomanStory("");
    setWomanImage("");
  };

  const addWoman = () => {
    if (!womanName.trim() || !womanAchievement.trim() || !womanStory.trim()) {
      toast({ title: "Preencha nome, conquista e história da mulher inspiradora", variant: "destructive" });
      return;
    }
    
    const newWoman: WomanProfile = {
      name: womanName,
      achievement: womanAchievement,
      story: womanStory,
      image: womanImage || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300",
    };
    
    setWomen([...women, newWoman]);
    resetWomanForm();
  };

  const removeWoman = (index: number) => {
    setWomen(women.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      toast({ title: "Preencha nome e descrição da carreira", variant: "destructive" });
      setCurrentStep('info');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('career_areas_content')
        .update({
          career_name: name,
          career_description: description,
          salary_range: salaryRange,
          women: women as unknown as import('@/integrations/supabase/types').Json,
        })
        .eq('career_id', career.id);
      
      if (error) throw error;

      toast({ title: "Carreira atualizada com sucesso!" });
      onContentChange();
      onClose();
    } catch (error: any) {
      console.error('Error updating career:', error);
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
            <h3 className="text-xl font-bold text-gray-800">Editar Carreira</h3>
            <div className="flex gap-2">
              {['info', 'women'].map((s, i) => (
                <div key={s} className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  currentStep === s ? 'bg-purple-500 text-white' : 
                  currentStep === 'women' && s === 'info' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s === 'info' ? 'Informações' : 'Mulheres Inspiradoras'}
                </div>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {currentStep === 'info' && (
          <div className="space-y-4">
            <div>
              <Label>Nome da Carreira *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Descrição *</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
            <div>
              <Label>Faixa Salarial</Label>
              <Select value={salaryRange} onValueChange={setSalaryRange}>
                <SelectTrigger><SelectValue placeholder="Selecione a faixa salarial" /></SelectTrigger>
                <SelectContent>
                  {SALARY_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button onClick={() => setCurrentStep('women')} disabled={!name.trim() || !description.trim()}>
                Próximo: Mulheres Inspiradoras
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'women' && (
          <div className="space-y-6">
            {women.length > 0 && (
              <div className="space-y-2">
                <Label>Mulheres ({women.length})</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {women.map((woman, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{woman.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{woman.achievement}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeWoman(index)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Card className="p-4 bg-purple-50 border-purple-200">
              <h4 className="font-semibold text-gray-800 mb-4">Adicionar Mulher Inspiradora</h4>
              
              <div className="space-y-3">
                <div>
                  <Label>Nome *</Label>
                  <Input value={womanName} onChange={(e) => setWomanName(e.target.value)} placeholder="Nome completo" />
                </div>
                <div>
                  <Label>Principal Conquista *</Label>
                  <Input value={womanAchievement} onChange={(e) => setWomanAchievement(e.target.value)} placeholder="Ex: Primeira mulher a..." />
                </div>
                <div>
                  <Label>História *</Label>
                  <Textarea value={womanStory} onChange={(e) => setWomanStory(e.target.value)} placeholder="Conte a história inspiradora..." rows={3} />
                </div>
                
                <ImageUpload
                  value={womanImage}
                  onChange={setWomanImage}
                  label="Foto da Mulher Inspiradora"
                  folder="women-profiles"
                />

                <Button onClick={addWoman} className="w-full" variant="secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Mulher
                </Button>
              </div>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep('info')}>
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
