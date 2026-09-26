import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { authErrorMessage, useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { AuthShell, AuthTitle, FormError, inputClass, primaryButtonClass } from "./auth/AuthShell";
import { PasswordField, isStrongPassword } from "./auth/PasswordField";
import { VerifyCode } from "./auth/VerifyCode";

interface ForgotPasswordProps {
  onBack: () => void;
  onGoToLogin: () => void;
  /** 'newPassword' quando a usuária já validou o código ou abriu o link do email */
  initialStep?: "email" | "newPassword";
  onPasswordUpdated?: () => void;
}

type Step = "email" | "code" | "newPassword";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Recuperação de senha:
 * 1. email → 2. código de 6 dígitos (ou link do email) → 3. nova senha.
 * Ao validar o código, o Supabase dispara PASSWORD_RECOVERY e a Index
 * renderiza este componente já na etapa "newPassword".
 */
export const ForgotPassword = ({ onBack, onGoToLogin, initialStep = "email", onPasswordUpdated }: ForgotPasswordProps) => {
  const { sendPasswordReset, verifyRecoveryCode, signOut, user } = useAuth();
  const [step, setStep] = useState<Step>(initialStep);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const emailValid = EMAIL_RE.test(email.trim());

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid) return;
    setLoading(true);
    setError(null);
    const result = await sendPasswordReset(email);
    setLoading(false);
    if (result.error) {
      setError(result.message ?? "Não foi possível enviar agora.");
      return;
    }
    setStep("code");
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStrongPassword(newPassword)) return;

    setLoading(true);
    setError(null);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (updateError) {
      const msg = authErrorMessage(updateError);
      setError(
        /session|jwt|auth session missing/i.test(updateError.message)
          ? "Sua sessão de recuperação expirou. Peça um novo código."
          : msg
      );
      return;
    }

    toast.success("Senha atualizada! Você já está conectada.");
    if (onPasswordUpdated) onPasswordUpdated();
    else onGoToLogin();
  };

  if (step === "code") {
    return (
      <VerifyCode
        email={email.trim().toLowerCase()}
        title="Digite o código"
        subtitle={
          <>
            Se existir uma conta com <strong className="text-gray-800 dark:text-gray-200">{email.trim()}</strong>, enviamos um código para criar uma nova senha. Olhe também no spam.
          </>
        }
        submitLabel="Continuar"
        onVerify={(code) => verifyRecoveryCode(email, code)}
        onResend={() => sendPasswordReset(email)}
        onBack={() => setStep("email")}
      />
    );
  }

  if (step === "newPassword") {
    return (
      <AuthShell
        onBack={async () => {
          // Sair do fluxo sem trocar a senha: encerra a sessão temporária
          await signOut();
          onGoToLogin();
        }}
      >
        <AuthTitle title="Crie uma nova senha" subtitle="Escolha uma senha que você não usa em outros sites." />
        <form onSubmit={handleUpdatePassword} className="flex-1 flex flex-col" noValidate>
          {/* ajuda o gerenciador de senhas do navegador a salvar a nova senha */}
          <input type="email" autoComplete="username" value={email || user?.email || ""} readOnly hidden />
          <div className="space-y-2 animate-slide-up stagger-1">
            <Label htmlFor="new-password" className="font-semibold">Nova senha</Label>
            <PasswordField
              id="new-password"
              autoComplete="new-password"
              placeholder="Nova senha"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setError(null); }}
              disabled={loading}
              showRules
              autoFocus
            />
            {error && <div className="pt-3"><FormError>{error}</FormError></div>}
          </div>
          <div className="mt-auto pt-8">
            <Button type="submit" className={primaryButtonClass} disabled={!isStrongPassword(newPassword) || loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar nova senha"}
            </Button>
          </div>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell onBack={onBack}>
      <AuthTitle title="Esqueceu a senha?" subtitle="Tudo bem! Digite seu email e enviamos um código para criar outra." />
      <form onSubmit={handleSendCode} className="flex-1 flex flex-col" noValidate>
        <div className="space-y-2 animate-slide-up stagger-1">
          <Label htmlFor="reset-email" className="font-semibold">Email</Label>
          <Input
            id="reset-email"
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
          {error && <div className="pt-3"><FormError>{error}</FormError></div>}
        </div>
        <div className="mt-auto pt-8 space-y-3">
          <Button type="submit" className={primaryButtonClass} disabled={!emailValid || loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar código"}
          </Button>
          <Button type="button" variant="ghost" onClick={onGoToLogin} className="w-full h-12 rounded-2xl font-semibold">
            Lembrei a senha
          </Button>
        </div>
      </form>
    </AuthShell>
  );
};
