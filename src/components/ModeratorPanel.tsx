import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog, ArrowLeft, MessageSquare, FileText } from "lucide-react";
import { CommentsModeration } from "./admin/CommentsModeration";
import { ContentManagement } from "./admin/ContentManagement";

interface ModeratorPanelProps {
  onBack: () => void;
}

export const ModeratorPanel = ({ onBack }: ModeratorPanelProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>

        <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-xl border-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <UserCog className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Painel de Moderação</h1>
              <p className="text-muted-foreground">Modere comentários e escreva posts no blog</p>
            </div>
          </div>

          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="comments" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Comentários
              </TabsTrigger>
              <TabsTrigger value="blog" className="gap-2">
                <FileText className="w-4 h-4" />
                Blog
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments">
              <CommentsModeration />
            </TabsContent>

            <TabsContent value="blog">
              <ContentManagement activeTab="blog" />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};
