import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  MessageSquare, 
  Trash2, 
  ArrowLeft,
  AlertTriangle,
  Loader2,
  UserCog,
  Crown
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface AdminPanelProps {
  onBack: () => void;
}

interface Comment {
  id: string;
  content: string;
  experiment_id: string;
  user_id: string;
  created_at: string;
  user_name?: string;
  user_image?: string;
}

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  profile_image: string | null;
  role: string;
}

export const AdminPanel = ({ onBack }: AdminPanelProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchComments(), fetchUsers()]);
    setLoading(false);
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('experiment_comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching comments:', error);
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
  };

  const fetchUsers = async () => {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, email, profile_image')
      .order('name');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return;
    }

    // Fetch roles for all users using raw query approach
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles' as any)
      .select('user_id, role') as { data: { user_id: string; role: string }[] | null; error: any };

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
    }

    const roleMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);

    const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => ({
      ...profile,
      role: roleMap.get(profile.id) || 'user'
    }));

    setUsers(usersWithRoles);
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

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);

    // First check if user has a role
    const { data: existingRole } = await supabase
      .from('user_roles' as any)
      .select('id')
      .eq('user_id', userId)
      .maybeSingle() as { data: { id: string } | null; error: any };

    let error;

    if (existingRole) {
      // Update existing role
      const result = await supabase
        .from('user_roles' as any)
        .update({ role: newRole })
        .eq('user_id', userId);
      error = result.error;
    } else {
      // Insert new role
      const result = await supabase
        .from('user_roles' as any)
        .insert({ user_id: userId, role: newRole });
      error = result.error;
    }

    setUpdatingUserId(null);

    if (error) {
      toast.error('Erro ao atualizar função');
      console.error(error);
      return;
    }

    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    toast.success('Função atualizada com sucesso');
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'moderator':
        return 'Moderador';
      default:
        return 'Usuário';
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
              <p className="text-muted-foreground">Gerencie usuários e modere comentários</p>
            </div>
          </div>

          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="comments" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Comentários ({comments.length})
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="w-4 h-4" />
                Usuários ({users.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum comentário encontrado</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {comments.map(comment => (
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
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.user_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.created_at)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {comment.experiment_id}
                          </Badge>
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
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              {users.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum usuário encontrado</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {users.map(user => (
                    <div 
                      key={user.id} 
                      className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.profile_image || undefined} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.name}</span>
                          {user.role === 'admin' && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>

                        <Select
                          value={user.role}
                          onValueChange={(value) => handleUpdateRole(user.id, value)}
                          disabled={updatingUserId === user.id}
                        >
                          <SelectTrigger className="w-[140px]">
                            {updatingUserId === user.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Usuário
                              </div>
                            </SelectItem>
                            <SelectItem value="moderator">
                              <div className="flex items-center gap-2">
                                <UserCog className="w-4 h-4" />
                                Moderador
                              </div>
                            </SelectItem>
                            <SelectItem value="admin">
                              <div className="flex items-center gap-2">
                                <Crown className="w-4 h-4" />
                                Administrador
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};
