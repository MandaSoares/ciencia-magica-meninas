import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Heart, Send } from "lucide-react";

interface Comment {
  id: number;
  userName: string;
  content: string;
  likes: number;
  timeAgo: string;
  image?: string;
}

interface ExperimentCommentsProps {
  experimentId: string;
  experimentTitle: string;
}

export const ExperimentComments = ({ experimentId, experimentTitle }: ExperimentCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      userName: "Ana Clara",
      content: "Meu vulcão ficou gigante! Usei corante vermelho e ficou parecendo lava de verdade! 🌋",
      likes: 15,
      timeAgo: "2 horas atrás",
    },
    {
      id: 2,
      userName: "Beatriz",
      content: "Fiz com minha mãe e foi muito divertido! A reação química é incrível, ficamos impressionadas!",
      likes: 8,
      timeAgo: "5 horas atrás",
    },
    {
      id: 3,
      userName: "Carolina",
      content: "Descobri que quanto mais vinagre, maior a erupção! Vou fazer de novo com mais corante 🧪",
      likes: 12,
      timeAgo: "1 dia atrás",
    },
  ]);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        userName: "Você",
        content: newComment,
        likes: 0,
        timeAgo: "Agora",
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const handleLike = (commentId: number) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    ));
  };

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
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Send className="w-4 h-4 mr-2" />
            Publicar
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">
          {comments.length} comentários
        </h4>
        
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                  {comment.userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-800">{comment.userName}</span>
                  <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                </div>
                <p className="text-gray-700 mb-2">{comment.content}</p>
                <button
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-pink-500 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{comment.likes}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
