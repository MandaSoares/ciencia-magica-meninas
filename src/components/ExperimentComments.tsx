import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Send, AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useComments } from "@/hooks/useComments";
import { toast } from "sonner";

interface ExperimentCommentsProps {
  experimentId: string;
  experimentTitle: string;
}

// Lista de palavras proibidas
const BLOCKED_WORDS = [
  "merda", "bosta", "caralho", "porra", "foder", "foda", "fodase", "pqp", "vsf", "vtnc", "tnc",
  "cacete", "buceta", "piroca", "pau", "rola", "pinto", "cu", "cuzao", "cuzão", "arrombado",
  "macaco", "macaca", "crioulo", "crioula",
  "piranha", "vadia", "vagabunda", "puta", "prostituta", "vaca", "galinha",
  "viado", "veado", "bicha", "sapatao", "sapatão", "boiola",
  "retardado", "retardada", "imbecil", "lixo", "nojento", "nojenta",
  "inutil", "inútil", "estupido", "estúpido", "estupida", "estúpida", "otario", "otário", "otaria", "otária",
  // Termos sexuais
  "sexo", "transar", "foder", "gozar", "punheta", "masturbacao", "masturbação", "porno", "pornografia",
  "bucetinha", "piriquita", "xoxota", "tesao", "tesão"
];

const containsBlockedContent = (text: string): boolean => {
  const normalizedText = text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  
  return BLOCKED_WORDS.some(word => {
    const normalizedWord = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalizedText.includes(normalizedWord);
  });
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "Agora";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
  return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
};

export const ExperimentComments = ({ experimentId, experimentTitle }: ExperimentCommentsProps) => {
  const { comments, loading, addComment, deleteComment, toggleLike, userName, currentUserId } = useComments(experimentId);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    if (containsBlockedContent(newComment)) {
      toast.error("Seu comentário contém palavras inapropriadas. Por favor, revise e tente novamente.");
      return;
    }

    setSubmitting(true);
    await addComment(newComment);
    setNewComment("");
    setSubmitting(false);
    toast.success("Comentário publicado!");
  };

  const handleLike = async (commentId: string) => {
    await toggleLike(commentId);
  };

  const handleDelete = async (commentId: string) => {
    const success = await deleteComment(commentId);
    if (success) {
      toast.success("Comentário excluído!");
    } else {
      toast.error("Erro ao excluir comentário.");
    }
  };

  if (loading) {
    return (
      <Card className="p-6 mt-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
      </Card>
    );
  }

  return (
    <Card className="p-6 mt-6">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="w-6 h-6 text-purple-500" />
        <h3 className="text-xl font-semibold text-gray-800">
          Compartilhe seu Experimento!
        </h3>
      </div>

      <p className="text-gray-600 mb-4">
        Conte como foi sua experiência com o experimento "{experimentTitle}"
      </p>

      {/* New Comment Input */}
      <div className="space-y-3 mb-6">
        <Textarea
          placeholder="Compartilhe seu resultado! Como ficou seu experimento? O que você aprendeu?"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Comentários ofensivos serão bloqueados
          </p>
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || submitting}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Publicar
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">
          {comments.length} comentários
        </h4>
        
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Seja a primeira a comentar!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.user_profile_image || undefined} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                    {(comment.user_name || "U").charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-800">{comment.user_name || "Usuária"}</span>
                    <span className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center space-x-1 transition-colors ${
                        comment.user_liked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${comment.user_liked ? 'fill-pink-500' : ''}`} />
                      <span className="text-sm">{comment.likes || 0}</span>
                    </button>
                    {currentUserId === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Excluir</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
