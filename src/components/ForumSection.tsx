import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send, AlertTriangle, Loader2, Trash2, Flag } from "lucide-react";
import { useComments } from "@/hooks/useComments";
import { toast } from "sonner";
import { checkComment, commentErrorMessage, MAX_COMMENT_LENGTH } from "@/lib/moderation";

interface ForumSectionProps {
  moduleId: string;
}

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
  const { comments, loading, addComment, deleteComment, toggleLike, reportComment, currentUserId } = useComments(moduleId);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    const check = checkComment(newComment);
    if (!check.ok) {
      toast.error(check.message);
      return;
    }

    setSubmitting(true);
    const { error } = await addComment(newComment.trim());
    setSubmitting(false);
    if (error) {
      toast.error(commentErrorMessage(error));
      return;
    }
    setNewComment("");
    toast.success("Comentário publicado!");
  };

  const handleReport = async (commentId: string) => {
    if (!window.confirm("Denunciar este comentário para a moderação? Ele será revisado por uma moderadora.")) return;
    const result = await reportComment(commentId);
    if (result === "ok") toast.success("Obrigada! A moderação vai revisar esse comentário.");
    else if (result === "duplicate") toast.info("Você já denunciou esse comentário.");
    else toast.error("Não foi possível enviar a denúncia. Tente novamente.");
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

  const handleSubmitReply = async (commentId: string) => {
    const check = checkComment(replyContent);
    if (!check.ok) {
      toast.error(check.message);
      return;
    }

    setSubmitting(true);
    const { error } = await addComment(replyContent.trim(), commentId);
    setSubmitting(false);
    if (error) {
      toast.error(commentErrorMessage(error));
      return;
    }
    setReplyContent("");
    setReplyingTo(null);
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
          maxLength={MAX_COMMENT_LENGTH}
          className="mb-2 resize-none border-gray-200"
          rows={3}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Seja gentil. Não compartilhe links, telefone, email ou redes sociais.
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
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={comment.user_profile_image || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-sm font-bold">
                    {(comment.user_name || "U").charAt(0)}
                  </AvatarFallback>
                </Avatar>
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
{currentUserId && currentUserId !== comment.user_id && (
                      <button
                        onClick={() => handleReport(comment.id)}
                        className="flex items-center gap-1 text-sm text-gray-400 hover:text-orange-500 transition-colors"
                        aria-label="Denunciar comentário"
                        title="Denunciar"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    )}
                    {currentUserId === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Excluir</span>
                      </button>
                    )}
                  </div>

                  {/* Respostas */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 ml-4 border-l-2 border-purple-100 pl-3 space-y-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="p-2 bg-purple-50 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={reply.user_profile_image || undefined} />
                              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white text-xs font-bold">
                                {(reply.user_name || "U").charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm text-gray-800">{reply.user_name || "Usuária"}</span>
                            <span className="text-xs text-gray-400">• {formatTimeAgo(reply.created_at)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-gray-700 text-sm ml-8">{reply.content}</p>
                            {currentUserId && currentUserId !== reply.user_id && (
                              <button
                                onClick={() => handleReport(reply.id)}
                                className="text-gray-400 hover:text-orange-500 transition-colors"
                                aria-label="Denunciar resposta"
                                title="Denunciar"
                              >
                                <Flag className="w-3 h-3" />
                              </button>
                            )}
                            {currentUserId === reply.user_id && (
                              <button
                                onClick={() => handleDelete(reply.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
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
