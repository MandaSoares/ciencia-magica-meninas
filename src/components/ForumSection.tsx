import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Send, AlertTriangle, Loader2 } from "lucide-react";
import { useComments } from "@/hooks/useComments";
import { toast } from "sonner";

interface ForumSectionProps {
  moduleId: string;
}

// Lista de palavras proibidas (palavrões, ofensas racistas, machistas, sexuais, etc.)
const BLOCKED_WORDS = [
  // Palavrões
  "merda", "bosta", "caralho", "porra", "foder", "foda", "fodase", "pqp", "vsf", "vtnc", "tnc",
  "cacete", "buceta", "piroca", "pau", "rola", "pinto", "cu", "cuzao", "cuzão", "arrombado",
  // Ofensas racistas
  "negro", "negra", "preto", "preta", "macaco", "macaca", "crioulo", "crioula",
  // Ofensas machistas
  "piranha", "vadia", "vagabunda", "puta", "prostituta", "vaca", "galinha",
  // Ofensas homofóbicas
  "viado", "veado", "bicha", "sapatao", "sapatão", "boiola", "gay" + "sujo",
  // Outras ofensas
  "retardado", "retardada", "imbecil", "idiota", "burro", "burra", "lixo", "nojento", "nojenta",
  "inutil", "inútil", "estupido", "estúpido", "estupida", "estúpida", "otario", "otário", "otaria", "otária"
];

const containsBlockedContent = (text: string): boolean => {
  const normalizedText = text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove acentos
  
  return BLOCKED_WORDS.some(word => {
    const normalizedWord = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalizedText.includes(normalizedWord);
  });
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "agora";
  if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} horas`;
  return `há ${Math.floor(diffInSeconds / 86400)} dias`;
};

export const ForumSection = ({ moduleId }: ForumSectionProps) => {
  const { comments, loading, addComment, toggleLike, userName } = useComments(moduleId);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
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

  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim()) return;
    
    if (containsBlockedContent(replyContent)) {
      toast.error("Sua resposta contém palavras inapropriadas. Por favor, revise e tente novamente.");
      return;
    }

    setSubmitting(true);
    await addComment(replyContent, commentId);
    setReplyContent("");
    setReplyingTo(null);
    setSubmitting(false);
    toast.success("Resposta publicada!");
  };

  if (loading) {
    return (
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
      <h4 className="text-lg font-bold mb-3 text-purple-800">Fórum de Discussão</h4>
      <p className="text-gray-600 mb-4">Compartilhe suas ideias e veja o que outras meninas estão criando!</p>
      
      {/* Campo para novo comentário */}
      <div className="mb-4 p-3 bg-white rounded-lg border border-purple-100">
        <Textarea
          placeholder="Escreva seu comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-2 resize-none border-gray-200"
          rows={3}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Comentários ofensivos serão bloqueados
          </p>
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || submitting}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Publicar
          </Button>
        </div>
      </div>

      {/* Lista de comentários */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Seja a primeira a comentar!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-3 bg-white rounded-lg border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {(comment.user_name || "U").charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800">{comment.user_name || "Usuária"}</span>
                    <span className="text-xs text-gray-400">• {formatTimeAgo(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                  
                  {/* Ações do comentário */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        comment.user_liked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${comment.user_liked ? 'fill-pink-500' : ''}`} />
                      <span>{comment.likes || 0}</span>
                    </button>
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-purple-500 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Responder</span>
                    </button>
                  </div>

                  {/* Respostas */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 ml-4 border-l-2 border-purple-100 pl-3 space-y-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="p-2 bg-purple-50 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                              {(reply.user_name || "U").charAt(0)}
                            </div>
                            <span className="font-medium text-sm text-gray-800">{reply.user_name || "Usuária"}</span>
                            <span className="text-xs text-gray-400">• {formatTimeAgo(reply.created_at)}</span>
                          </div>
                          <p className="text-gray-700 text-sm ml-8">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Campo de resposta */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 flex gap-2">
                      <Textarea
                        placeholder="Escreva sua resposta..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="flex-1 resize-none text-sm"
                        rows={2}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyContent.trim() || submitting}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};