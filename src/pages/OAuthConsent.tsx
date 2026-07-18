import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield } from "lucide-react";

// Minimal typed wrapper around Supabase's beta auth.oauth namespace.
interface AuthOauth {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
}
const oauth = (supabase.auth as unknown as { oauth: AuthOauth }).oauth;

function ConsentInner() {
  const { user, loading: authLoading } = useAuth();
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!authorizationId) {
      setError("Solicitação de autorização inválida (authorization_id ausente).");
      return;
    }
    if (authLoading || !user) return;
    let active = true;
    (async () => {
      try {
        const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
        if (!active) return;
        if (error) {
          setError(error.message ?? "Não foi possível carregar esta autorização.");
          return;
        }
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) {
          window.location.href = immediate;
          return;
        }
        setDetails(data);
      } catch (e: any) {
        setError(e?.message ?? "Erro inesperado ao carregar a autorização.");
      }
    })();
    return () => {
      active = false;
    };
  }, [authorizationId, authLoading, user]);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message ?? "Erro ao registrar sua decisão.");
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("O servidor de autorização não retornou uma URL de retorno.");
      return;
    }
    window.location.href = target;
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setSigningIn(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSigningIn(false);
    if (error) setError(error.message);
  }

  if (authLoading) {
    return (
      <Wrap>
        <Loader2 className="w-6 h-6 animate-spin" />
      </Wrap>
    );
  }

  if (!user) {
    return (
      <Wrap>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <Shield className="w-10 h-10 mx-auto text-purple-600" />
            <h1 className="text-2xl font-bold">Entre para autorizar</h1>
            <p className="text-sm text-gray-600">
              Faça login com sua conta do Ciência Mágica Meninas para conectar este aplicativo.
            </p>
          </div>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={signingIn}>
              {signingIn ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </Wrap>
    );
  }

  if (error) {
    return (
      <Wrap>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-4 text-center">
          <h1 className="text-xl font-bold">Não foi possível carregar a autorização</h1>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </Wrap>
    );
  }

  if (!details) {
    return (
      <Wrap>
        <Loader2 className="w-6 h-6 animate-spin" />
      </Wrap>
    );
  }

  const clientName = details.client?.name ?? details.client?.client_name ?? "Um aplicativo externo";

  return (
    <Wrap>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <Shield className="w-10 h-10 mx-auto text-purple-600" />
          <h1 className="text-2xl font-bold">Conectar {clientName} à sua conta</h1>
          <p className="text-sm text-gray-600">
            {clientName} poderá usar as ferramentas deste app enquanto você estiver conectada.
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
          <p><strong>Conta:</strong> {user.email}</p>
          <p className="text-xs text-gray-500">
            Isto não ignora as permissões do app nem as políticas do backend.
          </p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            disabled={busy}
            onClick={() => decide(false)}
          >
            Cancelar
          </Button>
          <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>
            {busy ? "..." : "Autorizar"}
          </Button>
        </div>
      </div>
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
      {children}
    </div>
  );
}

export default function OAuthConsent() {
  return (
    <AuthProvider>
      <ConsentInner />
    </AuthProvider>
  );
}