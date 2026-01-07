import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  MessageSquare, 
  Trash2, 
  AlertTriangle,
  Loader2,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  experiment_id: string;
  user_id: string;
  created_at: string;
  user_name?: string;
  user_image?: string;
}

const STEM_AREAS = [
  { value: "all", label: "Todas as áreas" },
  { value: "science", label: "Ciências" },
  { value: "technology", label: "Tecnologia" },
  { value: "engineering", label: "Engenharia" },
  { value: "math", label: "Matemática" },
];

// Map experiment IDs to their context
const getExperimentContext = (experimentId: string): { area: string; type: string; name: string } => {
  // Science experiments
  if (['volcano', 'slime', 'density'].includes(experimentId)) {
    return { area: 'Ciências', type: 'Laboratório', name: getExperimentName(experimentId) };
  }
  // Technology experiments
  if (['circuit', 'binary', 'algorithm'].includes(experimentId)) {
    return { area: 'Tecnologia', type: 'Laboratório', name: getExperimentName(experimentId) };
  }
  // Engineering experiments
  if (['bridge', 'catapult', 'tornado'].includes(experimentId)) {
    return { area: 'Engenharia', type: 'Laboratório', name: getExperimentName(experimentId) };
  }
  // Math experiments
  if (['fibonacci', 'probability', 'magnet'].includes(experimentId)) {
    return { area: 'Matemática', type: 'Laboratório', name: getExperimentName(experimentId) };
  }
  
  // Check if it's a module forum
  if (experimentId.startsWith('module-')) {
    const moduleId = experimentId.replace('module-', '');
    return { area: getModuleArea(moduleId), type: 'Módulo', name: getModuleName(moduleId) };
  }
  
  // Check if it's a learning path forum
  if (experimentId.startsWith('path-')) {
    const pathParts = experimentId.replace('path-', '').split('-');
    return { area: getAreaName(pathParts[0]), type: 'Trilha', name: `Nível ${pathParts[1] || '?'}` };
  }
  
  return { area: 'Desconhecida', type: 'Fórum', name: experimentId };
};

const getExperimentName = (id: string): string => {
  const names: Record<string, string> = {
    volcano: 'Vulcão de Bicarbonato',
    slime: 'Slime Mágico',
    density: 'Torre de Líquidos',
    circuit: 'Circuito de Limões',
    binary: 'Código Binário',
    algorithm: 'Algoritmo de Ordenação',
    bridge: 'Ponte de Palitos',
    catapult: 'Catapulta Medieval',
    tornado: 'Tornado na Garrafa',
    fibonacci: 'Espiral de Fibonacci',
    probability: 'Jogo de Probabilidades',
    magnet: 'Bússola Caseira',
  };
  return names[id] || id;
};

const getModuleArea = (moduleId: string): string => {
  const techModules = ['programacao-poderosa', 'desenvolvimento-web', 'inteligencia-artificial'];
  const engModules = ['engenharia-mecanica', 'engenharia-aeroespacial'];
  const mathModules = ['matematica-criativa', 'estatistica-visual'];
  const sciModules = ['quimica-cotidiano', 'biologia-divertida'];
  
  if (techModules.includes(moduleId)) return 'Tecnologia';
  if (engModules.includes(moduleId)) return 'Engenharia';
  if (mathModules.includes(moduleId)) return 'Matemática';
  if (sciModules.includes(moduleId)) return 'Ciências';
  return 'STEM';
};

const getModuleName = (moduleId: string): string => {
  const names: Record<string, string> = {
    'programacao-poderosa': 'Programação Poderosa',
    'desenvolvimento-web': 'Desenvolvimento Web',
    'inteligencia-artificial': 'Inteligência Artificial',
    'engenharia-mecanica': 'Engenharia Mecânica',
    'engenharia-aeroespacial': 'Engenharia Aeroespacial',
    'matematica-criativa': 'Matemática Criativa',
    'estatistica-visual': 'Estatística Visual',
    'quimica-cotidiano': 'Química do Cotidiano',
    'biologia-divertida': 'Biologia Divertida',
  };
  return names[moduleId] || moduleId;
};

const getAreaName = (area: string): string => {
  const names: Record<string, string> = {
    science: 'Ciências',
    technology: 'Tecnologia',
    engineering: 'Engenharia',
    math: 'Matemática',
  };
  return names[area] || area;
};

export const CommentsModeration = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterArea, setFilterArea] = useState("all");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('experiment_comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
      return;
    }

    // Fetch user info for each comment
    const userIds = [...new Set((data || []).map(c => c.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, profile_image')
      .in('id', userIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

    const commentsWithUsers = (data || []).map(comment => ({
      ...comment,
      user_name: profileMap.get(comment.user_id)?.name || 'Usuário',
      user_image: profileMap.get(comment.user_id)?.profile_image
    }));

    setComments(commentsWithUsers);
    setLoading(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingId(commentId);
    
    const { error } = await supabase
      .from('experiment_comments')
      .delete()
      .eq('id', commentId);

    setDeletingId(null);

    if (error) {
      toast.error('Erro ao deletar comentário');
      console.error(error);
      return;
    }

    setComments(prev => prev.filter(c => c.id !== commentId));
    toast.success('Comentário deletado com sucesso');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredComments = comments.filter(comment => {
    if (filterArea === "all") return true;
    const context = getExperimentContext(comment.experiment_id);
    return context.area.toLowerCase().includes(filterArea.toLowerCase()) ||
           getAreaName(filterArea) === context.area;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comentários ({filteredComments.length})
        </h3>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por área" />
            </SelectTrigger>
            <SelectContent>
              {STEM_AREAS.map(area => (
                <SelectItem key={area.value} value={area.value}>{area.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredComments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum comentário encontrado</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredComments.map(comment => {
            const context = getExperimentContext(comment.experiment_id);
            return (
              <div 
                key={comment.id} 
                className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.user_image || undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {comment.user_name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-sm">{comment.user_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {context.area}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {context.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {context.name}
                    </span>
                  </div>
                  <p className="text-sm text-foreground break-words">{comment.content}</p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={deletingId === comment.id}
                    >
                      {deletingId === comment.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        Deletar Comentário
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja deletar este comentário? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteComment(comment.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
