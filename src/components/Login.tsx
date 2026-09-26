import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { AuthShell, AuthTitle, FormError, inputClass, primaryButtonClass } from "./auth/AuthShell";
import { PasswordField } from "./auth/PasswordField";

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
  onGoToRegister: () => void;
  onForgotPassword: () => void;
}

export const Login = ({ onLogin, onBack, onGoToRegister, onForgotPassword }: LoginProps) => {
  const { signIn, resendConfirmation } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [resent, setResent] = useState(false);

  const canSubmit = email.trim().length > 3 && password.length > 0 && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    setUnconfirmed(false);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.message ?? "Não foi possível entrar.");
      setUnconfirmed(!!result.unconfirmed);
      return;
    }
    onLogin();
  };

  const handleResend = async () => {
    setLoading(true);
    const ok = await resendConfirmation(email);
    setLoading(false);
    setResent(ok);
    if (!ok) setError("Não foi possível reenviar agora. Aguarde alguns minutos e tente de novo.");
  };

  return (
    <AuthShell
      onBack={onBack}
      footer={
        <p className="text-center text-gray-500 dark:text-gray-400">
          Ainda não tem conta?{" "}
          <button type="button" onClick={onGoToRegister} className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
            Criar conta grátis
          </button>
        </p>
      }
    >
      <AuthTitle title="Bem-vinda de volta!" subtitle="Entre para continuar sua jornada científica." />

      <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up stagger-1" noValidate>
        <div className="space-y-2">
          <Label htmlFor="login-email" className="font-semibold">Email</Label>
          <Input
            id="login-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            className={inputClass}
            disabled={loading}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password" className="font-semibold">Senha</Label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              Esqueci minha senha
            </button>
          </div>
          <PasswordField
            id="login-password"
            autoComplete="current-password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            disabled={loading}
          />
        </div>

        {error && (
          <FormError>
            {error}
            {unconfirmed && !resent && (
              <button type="button" onClick={handleResend} className="block mt-2 font-bold underline">
                Reenviar email de confirmação
              </button>
            )}
          </FormError>
        )}

        {resent && (
          <div className="flex items-start gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
            <MailCheck className="w-4 h-4 mt-0.5 shrink-0" />
            Enviamos um novo link para {email.trim()}. Confira também o spam.
          </div>
        )}

        <Button type="submit" className={primaryButtonClass} disabled={!canSubmit}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
        </Button>
      </form>
    </AuthShell>
  );
};
