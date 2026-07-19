import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog, ArrowLeft, MessageSquare } from "lucide-react";
import { CommentsModeration } from "./admin/CommentsModeration";

interface ModeratorPanelProps {
  onBack: () => void;
}

export const ModeratorPanel = ({ onBack }: ModeratorPanelProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 p-6 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>

        <Card className="p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl border-0 dark:border dark:border-gray-700 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <UserCog className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Painel de Moderação</h1>
              <p className="text-muted-foreground">Modere os comentários da plataforma</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Comentários</h2>
          </div>

          <CommentsModeration />
        </Card>
      </div>
    </div>
  );
};
