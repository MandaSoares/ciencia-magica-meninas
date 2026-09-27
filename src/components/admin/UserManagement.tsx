import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown, Loader2, Mail, PenLine, Search, Trash2, UserPlus, Users, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Role = "user" | "editor" | "admin";

interface UserRow {
  id: string;
  name: string;
  email: string;
  age: number | null;
  profile_image: string | null;
  created_at: string;
  role: Role;
}

interface Invite {
  id: string;
  email: string;
  role: "editor" | "admin";
  created_at: string;
  accepted_at: string | null;
}

const ROLE_LABEL: Record<Role, string> = {
  user: "Estudante",
  editor: "Editora",
  admin: "Administradora",
};

const ROLE_BADGE: Record<Role, string> = {
  user: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  editor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  admin: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
};

const ROLE_RANK: Record<Role, number> = { user: 1, editor: 2, admin: 3 };

const errorText = (message?: string) => {
  const msg = message || "";
  if (msg.includes("ultima_admin")) return "Não é possível tirar a última administradora.";
  if (msg.includes("nao_pode_remover_a_si_mesma")) return "Você não pode remover a própria conta por aqui. Use Meu Perfil → Excluir minha conta.";
  if (msg.includes("email_invalido")) return "Esse email não parece válido.";
  if (msg.includes("sem_permissao")) return "Só administradoras podem fazer isso.";
  return "Não foi possível concluir. Tente novamente.";
};

/**
 * Gerenciar pessoas (só admin):
 * - convidar editoras/administradoras por email (vale no cadastro ou na hora, se já tiver conta)
 * - mudar o papel de qualquer pessoa
 * - remover uma pessoa da plataforma
 */
export const UserManagement = () => {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "admin">("editor");
  const [inviting, setInviting] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: profiles, error: profilesError }, { data: roles }, { data: inviteRows }] = await Promise.all([
      supabase.from("profiles").select("id, name, email, age, profile_image, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("staff_invites" as never).select("id, email, role, created_at, accepted_at").order("created_at", { ascending: false }),
    ]);

    if (profilesError) {
      toast.error("Não foi possível carregar as pessoas.");
      setLoading(false);
      return;
    }

    const roleMap = new Map<string, Role>();
    ((roles || []) as { user_id: string; role: string }[]).forEach((r) => {
      const role = (r.role === "admin" || r.role === "editor" ? r.role : "user") as Role;
      const current = roleMap.get(r.user_id) || "user";
      if (ROLE_RANK[role] > ROLE_RANK[current]) roleMap.set(r.user_id, role);
    });

    setUsers(
      ((profiles || []) as Omit<UserRow, "role">[]).map((p) => ({ ...p, role: roleMap.get(p.id) || "user" }))
    );
    setInvites(((inviteRows || []) as Invite[]).filter((i) => !i.accepted_at));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inviteEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      toast.error("Digite um email válido.");
      return;
    }
    setInviting(true);
    const { data, error } = await supabase.rpc("invite_staff" as never, { _email: email, _role: inviteRole } as never);
    setInviting(false);
    if (error) {
      toast.error(errorText(error.message));
      return;
    }
    toast.success(
      data === "promovida"
        ? `${email} já tinha conta e agora é ${ROLE_LABEL[inviteRole].toLowerCase()}.`
        : `Convite registrado. Quando ${email} se cadastrar, vira ${ROLE_LABEL[inviteRole].toLowerCase()} automaticamente.`
    );
    setInviteEmail("");
    load();
  };

  const cancelInvite = async (invite: Invite) => {
    const { error } = await supabase.from("staff_invites" as never).delete().eq("id", invite.id);
    if (error) {
      toast.error("Não foi possível cancelar o convite.");
      return;
    }
    setInvites((prev) => prev.filter((i) => i.id !== invite.id));
    toast.success("Convite cancelado.");
  };

  const changeRole = async (target: UserRow, role: Role) => {
    if (role === target.role) return;
    setBusyId(target.id);
    const { error } = await supabase.rpc("set_user_role" as never, { _user_id: target.id, _role: role } as never);
    setBusyId(null);
    if (error) {
      toast.error(errorText(error.message));
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === target.id ? { ...u, role } : u)));
    toast.success(`${target.name} agora é ${ROLE_LABEL[role].toLowerCase()}.`);
  };

  const removeUser = async (target: UserRow) => {
    setBusyId(target.id);
    const { error } = await supabase.rpc("admin_remove_user" as never, { _user_id: target.id } as never);
    setBusyId(null);
    if (error) {
      toast.error(errorText(error.message));
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== target.id));
    toast.success(`${target.name} foi removida da plataforma.`);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter(
      (u) =>
        (roleFilter === "all" || u.role === roleFilter) &&
        (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    );
  }, [users, search, roleFilter]);

  const counts = useMemo(
    () => ({
      user: users.filter((u) => u.role === "user").length,
      editor: users.filter((u) => u.role === "editor").length,
      admin: users.filter((u) => u.role === "admin").length,
    }),
    [users]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Convidar */}
      <section className="rounded-2xl border p-4 sm:p-5 bg-muted/20">
        <h3 className="font-semibold flex items-center gap-2 mb-1">
          <UserPlus className="w-5 h-5" /> Convidar para a equipe
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          <strong>Editora</strong> cria e edita conteúdo e modera comentários. <strong>Administradora</strong> faz tudo isso e gerencia pessoas.
          Se o email ainda não tem conta, o papel é aplicado assim que a pessoa se cadastrar.
        </p>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="email@exemplo.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="sm:flex-1 rounded-xl"
            autoComplete="off"
          />
          <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as "editor" | "admin")}>
            <SelectTrigger className="sm:w-[170px] rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="editor">Editora</SelectItem>
              <SelectItem value="admin">Administradora</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={inviting || !inviteEmail.trim()} className="rounded-xl">
            {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Convidar"}
          </Button>
        </form>

        {invites.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Convites aguardando cadastro</p>
            {invites.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3 rounded-xl bg-background px-3 py-2 border">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm flex-1 truncate">{inv.email}</span>
                <Badge className={`${ROLE_BADGE[inv.role]} border-0`}>{ROLE_LABEL[inv.role]}</Badge>
                <Button variant="ghost" size="icon" title="Cancelar convite" onClick={() => cancelInvite(inv)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lista de pessoas */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h3 className="font-semibold flex items-center gap-2 sm:flex-1">
            <Users className="w-5 h-5" /> Pessoas ({users.length})
            <span className="text-xs font-normal text-muted-foreground">
              {counts.user} estudantes · {counts.editor} editoras · {counts.admin} administradoras
            </span>
          </h3>
          <div className="relative sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar nome ou email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as "all" | Role)}>
            <SelectTrigger className="sm:w-[160px] rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os papéis</SelectItem>
              <SelectItem value="user">Estudantes</SelectItem>
              <SelectItem value="editor">Editoras</SelectItem>
              <SelectItem value="admin">Administradoras</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Ninguém encontrado</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((u) => {
              const isMe = u.id === me?.id;
              return (
                <div key={u.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 rounded-xl border bg-muted/20">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="w-11 h-11">
                      <AvatarImage src={u.profile_image || undefined} />
                      <AvatarFallback className="bg-primary/15 text-primary font-semibold">
                        {u.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{u.name}</span>
                        {u.role === "admin" && <Crown className="w-4 h-4 text-amber-500 shrink-0" />}
                        {u.role === "editor" && <PenLine className="w-4 h-4 text-blue-500 shrink-0" />}
                        {isMe && <span className="text-xs text-muted-foreground">(você)</span>}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {u.email}
                        {u.age ? ` · ${u.age} anos` : ""}
                        {` · desde ${new Date(u.created_at).toLocaleDateString("pt-BR")}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:justify-end">
                    <Select value={u.role} onValueChange={(v) => changeRole(u, v as Role)} disabled={busyId === u.id}>
                      <SelectTrigger className="w-[160px] rounded-xl">
                        {busyId === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <SelectValue />}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Estudante</SelectItem>
                        <SelectItem value="editor">Editora</SelectItem>
                        <SelectItem value="admin">Administradora</SelectItem>
                      </SelectContent>
                    </Select>

                    {!isMe && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            title="Remover da plataforma"
                            disabled={busyId === u.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover {u.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              A conta de {u.email} e todos os dados dela (progresso, comentários, curtidas) serão apagados. Não dá para desfazer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeUser(u)} className="bg-destructive hover:bg-destructive/90">
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
