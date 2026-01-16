import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BlogPostData {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  image: string;
  color: string;
}

interface EditBlogPostInlineProps {
  post: BlogPostData;
  onSave: () => void;
  onCancel: () => void;
}

const CATEGORIES = ["Tecnologia", "Ciência", "Engenharia", "Matemática", "Educação"];

const COLOR_OPTIONS = [
  { value: "bg-purple-500", label: "Roxo", hex: "#8B5CF6" },
  { value: "bg-pink-500", label: "Rosa", hex: "#EC4899" },
  { value: "bg-blue-500", label: "Azul", hex: "#3B82F6" },
  { value: "bg-green-500", label: "Verde", hex: "#22C55E" },
  { value: "bg-orange-500", label: "Laranja", hex: "#F97316" },
  { value: "bg-red-500", label: "Vermelho", hex: "#EF4444" },
  { value: "bg-cyan-500", label: "Ciano", hex: "#06B6D4" },
  { value: "bg-amber-500", label: "Âmbar", hex: "#F59E0B" },
  { value: "bg-indigo-500", label: "Índigo", hex: "#6366F1" },
  { value: "bg-teal-500", label: "Teal", hex: "#14B8A6" },
  { value: "bg-rose-500", label: "Rose", hex: "#F43F5E" },
  { value: "bg-violet-500", label: "Violeta", hex: "#8B5CF6" },
];

const READ_TIME_OPTIONS = [
  "2 min", "3 min", "5 min", "7 min", "10 min", "15 min", "20 min", "30 min"
];

export const EditBlogPostInline = ({ post, onSave, onCancel }: EditBlogPostInlineProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    author_name: post.author,
    read_time: post.readTime,
    emoji: post.image,
    color_class: post.color,
  });

  const handleSave = async () => {
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
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          author_name: formData.author_name,
          read_time: formData.read_time,
          emoji: formData.emoji,
          color_class: formData.color_class,
        })
        .eq('id', post.id);

      if (error) throw error;

      toast({ title: "Post atualizado com sucesso!" });
      onSave();
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o post.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 border-2 border-purple-300 bg-purple-50/30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Editar Post</h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
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
            rows={8}
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
              value={formData.color_class}
              onValueChange={(value) => setFormData({ ...formData, color_class: value })}
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

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || !formData.title.trim() || !formData.author_name.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>
    </Card>
  );
};
