import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Send } from "lucide-react";

interface Comment {
  id: string;
  userName: string;
  content: string;
  likes: number;
  timeAgo: string;
  replies: Reply[];
  liked: boolean;
}

interface Reply {
  id: string;
  userName: string;
  content: string;
  timeAgo: string;
}

interface ForumSectionProps {
  moduleId: string;
}

export const ForumSection = ({ moduleId }: ForumSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      userName: "Maria S.",
      content: "Adorei esse desafio! Fiz usando materiais reciclados e ficou incrível.",
      likes: 12,
      timeAgo: "há 2 dias",
      replies: [
        {
          id: "1-1",
          userName: "Ana P.",
          content: "Que legal! Pode compartilhar fotos?",
          timeAgo: "há 1 dia",
        }
      ],
      liked: false,
    },
    {
      id: "2",
      userName: "Julia M.",
      content: "Tive dificuldade no início mas consegui terminar! A dica do instrutor ajudou muito.",
      likes: 8,
      timeAgo: "há 1 dia",
      replies: [],
      liked: false,
    },
    {
      id: "3",
      userName: "Beatriz L.",
      content: "Alguém mais está fazendo esse módulo? Podemos trocar ideias!",
      likes: 5,
      timeAgo: "há 5 horas",
      replies: [],
      liked: false,
    },
  ]);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        userName: "Você",
        content: newComment,
        likes: 0,
        timeAgo: "agora",
        replies: [],
        liked: false,
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const handleLike = (commentId: string) => {
    setComments(comments.map(c => 
      c.id === commentId 
        ? { ...c, likes: c.liked ? c.likes - 1 : c.likes + 1, liked: !c.liked } 
        : c
    ));
  };

  const handleSubmitReply = (commentId: string) => {
    if (replyContent.trim()) {
      const reply: Reply = {
        id: `${commentId}-${Date.now()}`,
        userName: "Você",
        content: replyContent,
        timeAgo: "agora",
      };
      setComments(comments.map(c =>
        c.id === commentId
          ? { ...c, replies: [...c.replies, reply] }
          : c
      ));
      setReplyContent("");
      setReplyingTo(null);
    }
  };

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
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Send className="w-4 h-4 mr-2" />
            Publicar
          </Button>
        </div>
      </div>

      {/* Lista de comentários */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="p-3 bg-white rounded-lg border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {comment.userName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-800">{comment.userName}</span>
                  <span className="text-xs text-gray-400">• {comment.timeAgo}</span>
                </div>
                <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                
                {/* Ações do comentário */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      comment.liked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${comment.liked ? 'fill-pink-500' : ''}`} />
                    <span>{comment.likes}</span>
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
                {comment.replies.length > 0 && (
                  <div className="mt-3 ml-4 border-l-2 border-purple-100 pl-3 space-y-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="p-2 bg-purple-50 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                            {reply.userName.charAt(0)}
                          </div>
                          <span className="font-medium text-sm text-gray-800">{reply.userName}</span>
                          <span className="text-xs text-gray-400">• {reply.timeAgo}</span>
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
                      disabled={!replyContent.trim()}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};