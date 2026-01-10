import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ArrowLeft, MessageSquare, Users } from "lucide-react";
import { CommentsModeration } from "./admin/CommentsModeration";
import { UserManagement } from "./admin/UserManagement";

interface AdminPanelProps {
  onBack: () => void;
}

/**
 * SECURITY NOTE: This admin panel visibility is controlled by client-side role checking (useAdminCheck).
 * 
 * However, ALL admin operations are protected by Row Level Security (RLS) policies at the database level.
 * The client-side check is purely for UX - to show/hide the admin UI.
 * 
 * Even if a malicious user renders this component directly, they cannot:
 * - Modify user roles (RLS on user_roles requires admin role)
 * - Delete comments (RLS requires ownership or admin role)
 * - Modify content tables (RLS requires admin role)
 * 
 * The has_role() database function verifies permissions server-side for every operation.
 */
export const AdminPanel = ({ onBack }: AdminPanelProps) => {
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
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Painel de Administração</h1>
              <p className="text-muted-foreground">Modere comentários e gerencie usuários</p>
            </div>
          </div>

          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="comments" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Comentários
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="w-4 h-4" />
                Usuários
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments">
              <CommentsModeration />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};
