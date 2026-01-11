import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddContentCardProps {
  type: 'experiment' | 'career' | 'learning_path' | 'module';
  selectedArea: string;
  onContentChange: () => void;
  isAdmin?: boolean;
  isModerator?: boolean;
  // Style props to match the parent cards
  cardClassName?: string;
  iconClassName?: string;
}

const areaMap: Record<string, string> = {
  science: "Ciência",
  technology: "Tecnologia",
  engineering: "Engenharia",
  math: "Matemática",
};

export const AddContentCard = ({ 
  type, 
  selectedArea, 
  onContentChange, 
  isAdmin, 
  isModerator,
  cardClassName = "",
  iconClassName = "bg-gradient-to-r from-purple-500 to-pink-500"
}: AddContentCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const stemArea = areaMap[selectedArea] || "Ciência";
  const canAdd = type === 'career' ? (isAdmin || isModerator) : isAdmin;

  if (!canAdd) return null;

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      if (type === 'experiment') {
        const { error } = await supabase.from('experiments_content').insert({
          stem_area: stemArea,
          experiment_id: formData.id || `exp-${Date.now()}`,
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty || 'Fácil',
          time: formData.time || '15 min',
          materials: formData.materials?.split(',').map((m: string) => m.trim()) || [],
          steps: formData.steps?.split('\n').filter((s: string) => s.trim()) || [],
          icon: formData.icon || 'Beaker',
          color: formData.color || 'bg-purple-500',
          image: formData.image || '🧪',
        });
        if (error) throw error;
      } else if (type === 'career') {
        const { error } = await supabase.from('career_areas_content').insert({
          stem_area: stemArea,
          career_id: formData.id || `career-${Date.now()}`,
          career_name: formData.name,
          career_description: formData.description,
          salary_range: formData.salaryRange,
          icon: formData.icon || 'Briefcase',
          women: [],
        });
        if (error) throw error;
      } else if (type === 'learning_path') {
        const maxOrder = await supabase
          .from('learning_path_content')
          .select('sort_order')
          .eq('stem_area', stemArea)
          .order('sort_order', { ascending: false })
          .limit(1);
        
        const nextOrder = (maxOrder.data?.[0]?.sort_order || 0) + 1;
        
        const { error } = await supabase.from('learning_path_content').insert({
          stem_area: stemArea,
          level_number: nextOrder,
          title: formData.title,
          description: formData.description,
          icon: formData.icon || 'Star',
          difficulty: formData.difficulty || 'Iniciante',
          points: parseInt(formData.points) || 30,
          color: formData.color || 'bg-purple-500',
          lessons: [],
          sort_order: nextOrder,
        });
        if (error) throw error;
      } else if (type === 'module') {
        const { error } = await supabase.from('modules_content').insert({
          stem_area: stemArea,
          module_id: formData.id || `mod-${Date.now()}`,
          title: formData.title,
          description: formData.description,
          category: stemArea,
          icon: formData.icon || 'BookOpen',
          color: formData.color || 'bg-purple-500',
          total_lessons: parseInt(formData.totalLessons) || 5,
          estimated_time: formData.estimatedTime || '3 horas',
          lessons: [],
          final_project: { title: "", description: "", steps: [] },
        });
        if (error) throw error;
      }

      toast({
        title: "Conteúdo adicionado!",
        description: "O conteúdo foi criado com sucesso.",
      });
      
      setIsOpen(false);
      setFormData({});
      onContentChange();
    } catch (error: any) {
      console.error('Error adding content:', error);
      toast({
        title: "Erro ao adicionar",
        description: error.message || "Não foi possível adicionar o conteúdo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'experiment': return 'Adicionar Experimento';
      case 'career': return 'Adicionar Carreira';
      case 'learning_path': return 'Adicionar Nível na Trilha';
      case 'module': return 'Adicionar Módulo';
      default: return 'Adicionar';
    }
  };

  const getCardLabel = () => {
    switch (type) {
      case 'experiment': return 'Novo Experimento';
      case 'career': return 'Nova Carreira';
      case 'learning_path': return 'Novo Nível';
      case 'module': return 'Novo Módulo';
      default: return 'Adicionar';
    }
  };

  return (
    <>
      <Card 
        onClick={() => setIsOpen(true)}
        className={`p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-dashed border-purple-300 bg-purple-50/50 flex flex-col items-center justify-center min-h-[200px] ${cardClassName}`}
      >
        <div className={`w-16 h-16 ${iconClassName} rounded-full flex items-center justify-center mb-4`}>
          <Plus className="w-8 h-8 text-white" />
        </div>
        <span className="text-purple-600 font-semibold text-lg">{getCardLabel()}</span>
        <span className="text-purple-400 text-sm mt-1">Clique para adicionar</span>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getTitle()}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {type === 'experiment' && (
              <>
                <div>
                  <Label>Título *</Label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nome do experimento"
                  />
                </div>
                <div>
                  <Label>Descrição *</Label>
                  <Textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição curta"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Dificuldade</Label>
                    <Select value={formData.difficulty || 'Fácil'} onValueChange={(v) => setFormData({ ...formData, difficulty: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fácil">Fácil</SelectItem>
                        <SelectItem value="Médio">Médio</SelectItem>
                        <SelectItem value="Avançado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tempo</Label>
                    <Input
                      value={formData.time || ''}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      placeholder="15 min"
                    />
                  </div>
                </div>
                <div>
                  <Label>Materiais (separados por vírgula)</Label>
                  <Textarea
                    value={formData.materials || ''}
                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                    placeholder="Material 1, Material 2, Material 3"
                  />
                </div>
                <div>
                  <Label>Passos (um por linha)</Label>
                  <Textarea
                    value={formData.steps || ''}
                    onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                    placeholder="Passo 1&#10;Passo 2&#10;Passo 3"
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Emoji/Imagem</Label>
                  <Input
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="🧪"
                  />
                </div>
              </>
            )}

            {type === 'career' && (
              <>
                <div>
                  <Label>Nome da Carreira *</Label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Cientista de Dados"
                  />
                </div>
                <div>
                  <Label>Descrição *</Label>
                  <Textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva a carreira"
                  />
                </div>
                <div>
                  <Label>Faixa Salarial</Label>
                  <Input
                    value={formData.salaryRange || ''}
                    onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                    placeholder="R$ 5.000 - R$ 15.000"
                  />
                </div>
              </>
            )}

            {type === 'learning_path' && (
              <>
                <div>
                  <Label>Título do Nível *</Label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Introdução à Ciência"
                  />
                </div>
                <div>
                  <Label>Descrição *</Label>
                  <Textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição do nível"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Dificuldade</Label>
                    <Select value={formData.difficulty || 'Iniciante'} onValueChange={(v) => setFormData({ ...formData, difficulty: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Iniciante">Iniciante</SelectItem>
                        <SelectItem value="Intermediário">Intermediário</SelectItem>
                        <SelectItem value="Avançado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Pontos</Label>
                    <Input
                      type="number"
                      value={formData.points || 30}
                      onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {type === 'module' && (
              <>
                <div>
                  <Label>Título do Módulo *</Label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Programação Básica"
                  />
                </div>
                <div>
                  <Label>Descrição *</Label>
                  <Textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição do módulo"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Total de Lições</Label>
                    <Input
                      type="number"
                      value={formData.totalLessons || 5}
                      onChange={(e) => setFormData({ ...formData, totalLessons: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Tempo Estimado</Label>
                    <Input
                      value={formData.estimatedTime || ''}
                      onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                      placeholder="3 horas"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !formData.title && !formData.name}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
