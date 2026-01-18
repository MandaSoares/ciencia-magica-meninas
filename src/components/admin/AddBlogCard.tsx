import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { RichTextEditor } from "./RichTextEditor";

interface AddBlogCardProps {
  onPostAdded: () => void;
}

const CATEGORIES = ["Tecnologia", "Ciência", "Engenharia", "Matemática", "Educação"];

const COLOR_OPTIONS = [
  { value: "purple", label: "Roxo", hex: "#8B5CF6" },
  { value: "pink", label: "Rosa", hex: "#EC4899" },
  { value: "blue", label: "Azul", hex: "#3B82F6" },
  { value: "green", label: "Verde", hex: "#22C55E" },
  { value: "orange", label: "Laranja", hex: "#F97316" },
  { value: "red", label: "Vermelho", hex: "#EF4444" },
  { value: "cyan", label: "Ciano", hex: "#06B6D4" },
  { value: "amber", label: "Âmbar", hex: "#F59E0B" },
  { value: "indigo", label: "Índigo", hex: "#6366F1" },
  { value: "teal", label: "Teal", hex: "#14B8A6" },
  { value: "rose", label: "Rose", hex: "#F43F5E" },
  { value: "violet", label: "Violeta", hex: "#8B5CF6" },
];

const READ_TIME_OPTIONS = [
  "2 min", "3 min", "5 min", "7 min", "10 min", "15 min", "20 min", "30 min"
];

export const AddBlogCard = ({ onPostAdded }: AddBlogCardProps) => {
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Tecnologia",
    read_time: "5 min",
    emoji: "📝",
    color: "purple",
    author_name: ""
  });

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Erro",
        description: "Preencha o título e o conteúdo",
        variant: "destructive"
      });
      return;
    }

    if (!formData.author_name.trim()) {
      toast({
        title: "Erro",
        description: "Preencha o nome do autor",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const colorClass = `bg-${formData.color}-500`;
      
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          author_name: formData.author_name,
          read_time: formData.read_time,
          emoji: formData.emoji,
          color_class: colorClass,
          published: true
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Post criado com sucesso.",
      });
      
      setIsOpen(false);
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "Tecnologia",
        read_time: "5 min",
        emoji: "📝",
        color: "purple",
        author_name: ""
      });
      onPostAdded();
    } catch (error: any) {
      console.error('Error adding post:', error);
      toast({
        title: "Erro ao adicionar",
        description: error.message || "Não foi possível criar o post.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card 
        onClick={() => setIsOpen(true)}
        className="overflow-hidden hover:shadow-xl transition-all cursor-pointer border-2 border-dashed border-purple-300 bg-purple-50/50 flex flex-col items-center justify-center min-h-[280px]"
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <span className="text-purple-600 font-semibold text-lg">Novo Post</span>
        <span className="text-purple-400 text-sm mt-1">Clique para adicionar</span>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Post</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Nome do Autor *</Label>
              <Input
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="Digite o nome do autor"
              />
            </div>
            <div>
              <Label>Título *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título do post"
              />
            </div>
            <div>
              <Label>Resumo</Label>
              <Input
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Breve resumo do post"
              />
            </div>
            
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              label="Conteúdo *"
              placeholder="Escreva o conteúdo do post..."
              rows={10}
              showImageUpload
              imageFolder="blog"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tempo de Leitura</Label>
                <Select
                  value={formData.read_time}
                  onValueChange={(value) => setFormData({ ...formData, read_time: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {READ_TIME_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Emoji</Label>
                <Input
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  placeholder="📝"
                />
              </div>
              <div>
                <Label>Cor do Post</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) => setFormData({ ...formData, color: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_OPTIONS.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !formData.title.trim() || !formData.author_name.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Criar Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};