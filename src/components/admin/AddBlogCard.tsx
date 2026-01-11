import { useState, useEffect } from "react";
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
import { useAuth } from "@/hooks/useAuth";

interface AddBlogCardProps {
  onPostAdded: () => void;
}

const CATEGORIES = ["Tecnologia", "Ciência", "Engenharia", "Matemática", "Educação"];

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
    color_class: "bg-purple-500"
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

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          author_name: profile?.name || "Admin",
          read_time: formData.read_time,
          emoji: formData.emoji,
          color_class: formData.color_class,
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
        color_class: "bg-purple-500"
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
              <Label>Título *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título do post"
              />
            </div>
            <div>
              <Label>Resumo</Label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Breve resumo do post"
                rows={2}
              />
            </div>
            <div>
              <Label>Conteúdo *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Conteúdo completo do post"
                rows={10}
              />
            </div>
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
                <Input
                  value={formData.read_time}
                  onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                  placeholder="Ex: 5 min"
                />
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
                <Label>Cor (classe Tailwind)</Label>
                <Input
                  value={formData.color_class}
                  onChange={(e) => setFormData({ ...formData, color_class: e.target.value })}
                  placeholder="bg-purple-500"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !formData.title.trim()}
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
