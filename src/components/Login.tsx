import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { AuthShell, AuthTitle, FormError, inputClass, primaryButtonClass } from "./auth/AuthShell";
import { PasswordField } from "./auth/PasswordField";
import { VerifyCode } from "./auth/VerifyCode";
import { formatCountdown, rateLimitSeconds, useCooldown } from "./auth/cooldown";

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
  onGoToRegister: () => void;
  onForgotPassword: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const Login = ({ onLogin, onBack, onGoToRegister, onForgotPassword }: LoginProps) => {
  const { signIn, resendConfirmation, verifyEmailCode, linkNotice, clearLinkNotice } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<"credentials" | "unconfirmed" | "other" | null>(null);
  const [verifying, setVerifying] = useState(false);
  const { remaining: loginCooldown, start: startLoginCooldown } = useCooldown("login");

  const canSubmit = EMAIL_RE.test(email.trim()) && password.length > 0 && !loading && loginCooldown <= 0;

  const clearErrors = () => {
    setError(null);
    setErrorKind(null);
    if (linkNotice) clearLinkNotice();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    clearErrors();
    const result = await signIn(email, password);
    setLoading(false);

    if (result.error) {
      const wait = rateLimitSeconds(result.error as { message?: string; status?: number; code?: string });
      if (wait) startLoginCooldown(wait);
      setError(result.message ?? "Não foi possível entrar.");
      setErrorKind(
        result.unconfirmed ? "unconfirmed" : /incorretos/.test(result.message ?? "") ? "credentials" : "other"
      );
      return;
    }
    onLogin();
  };

  // Email não confirmado: manda um código novo e abre a tela para digitá-lo
  const startVerification = async () => {
    setLoading(true);
    const result = await resendConfirmation(email);
    setLoading(false);
    const wait = rateLimitSeconds(result.error as { message?: string; status?: number; code?: string } | null);
    if (result.error && !wait) {
      setError(result.message ?? "Não foi possível enviar o email.");
      setErrorKind("other");
      return;
    }
    // Se bateu no limite, abre a tela mesmo assim: o email anterior ainda vale,
    // e o botão "Reenviar" mostra a contagem.
    setVerifying(true);
  };

  if (verifying) {
    return (
      <VerifyCode
        email={email.trim().toLowerCase()}
        title="Confirme seu email"
        submitLabel="Confirmar e entrar"
        onVerify={(code) => verifyEmailCode(email, code)}
        onResend={() => resendConfirmation(email)}
        onBack={() => setVerifying(false)}
        cooldownKey="signup"
        justSent
      />
    );
  }

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

      {linkNotice && (
        <div className="mb-5 animate-slide-up">
          {linkNotice.kind === "error" ? (
            <FormError>{linkNotice.message}</FormError>
          ) : (
            <div className="flex items-start gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              {linkNotice.message} Agora é só entrar.
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up stagger-1" noValidate>
        <div className="space-y-2">
          <Label htmlFor="login-email" className="font-semibold">Email</Label>
          <Input
            id="login-email"
            type="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearErrors(); }}
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
            onChange={(e) => { setPassword(e.target.value); clearErrors(); }}
            disabled={loading}
          />
        </div>

        {error && (
          <FormError>
            {error}
            {errorKind === "credentials" && (
              <span className="block mt-1">
                Confira maiúsculas e minúsculas ou{" "}
                <button type="button" onClick={onForgotPassword} className="font-bold underline">
                  crie uma nova senha
                </button>
                .
              </span>
            )}
            {errorKind === "unconfirmed" && (
              <button type="button" onClick={startVerification} className="block mt-2 font-bold underline" disabled={loading}>
                Reenviar email de confirmação
              </button>
            )}
          </FormError>
        )}

        <Button type="submit" className={primaryButtonClass} disabled={!canSubmit}>
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : loginCooldown > 0 ? (
            `Tente de novo em ${formatCountdown(loginCooldown)}`
          ) : (
            "Entrar"
          )}
        </Button>
      </form>
    </AuthShell>
  );
};
