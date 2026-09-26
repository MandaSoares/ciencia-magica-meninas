import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthShell, AuthTitle, FormError, inputClass, primaryButtonClass } from "./auth/AuthShell";
import { PasswordField, isStrongPassword } from "./auth/PasswordField";

interface ForgotPasswordProps {
  onBack: () => void;
  onGoToLogin: () => void;
  /** 'newPassword' quando a usuária chega pelo link de recuperação do email */
  initialStep?: "email" | "newPassword";
  onPasswordUpdated?: () => void;
}

type Step = "email" | "sent" | "newPassword";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const ForgotPassword = ({ onBack, onGoToLogin, initialStep = "email", onPasswordUpdated }: ForgotPasswordProps) => {
  const [step, setStep] = useState<Step>(initialStep);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) return;

    setLoading(true);
    setError(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/`,
    });
    setLoading(false);

    // Mesma resposta exista ou não a conta (não revela emails cadastrados).
    if (resetError && (resetError.status === 429 || resetError.message.toLowerCase().includes("rate limit"))) {
      setError("Muitas tentativas. Aguarde alguns minutos e tente de novo.");
      return;
    }
    setStep("sent");
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStrongPassword(newPassword)) return;

    setLoading(true);
    setError(null);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (updateError) {
      setError(
        updateError.message.toLowerCase().includes("different from the old")
          ? "A nova senha precisa ser diferente da anterior."
          : "Não foi possível trocar a senha. O link pode ter expirado: peça um novo."
      );
      return;
    }

    toast.success("Senha atualizada! Você já está conectada.");
    if (onPasswordUpdated) onPasswordUpdated();
    else onGoToLogin();
  };

  if (step === "sent") {
    return (
      <AuthShell onBack={onGoToLogin}>
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-slide-up">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mb-6 shadow-lg shadow-green-200 dark:shadow-green-900/30">
            <MailCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Confira seu email</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Se existir uma conta com <strong className="text-gray-800 dark:text-gray-200">{email.trim()}</strong>, enviamos um link para criar uma nova senha.
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-8">O link vale por pouco tempo. Não achou? Olhe no spam.</p>
          <div className="w-full space-y-3">
            <Button onClick={onGoToLogin} className={primaryButtonClass}>Voltar para o login</Button>
            <Button variant="ghost" onClick={() => setStep("email")} className="w-full h-12 rounded-2xl font-semibold">
              Usar outro email
            </Button>
          </div>
        </div>
      </AuthShell>
    );
  }

  if (step === "newPassword") {
    return (
      <AuthShell>
        <AuthTitle title="Crie uma nova senha" subtitle="Escolha uma senha que você não usa em outros sites." />
        <form onSubmit={handleUpdatePassword} className="flex-1 flex flex-col" noValidate>
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
      <AuthTitle title="Esqueceu a senha?" subtitle="Tudo bem! Digite seu email e enviamos um link para criar outra." />
      <form onSubmit={handleSendResetEmail} className="flex-1 flex flex-col" noValidate>
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
          <Button type="submit" className={primaryButtonClass} disabled={!EMAIL_RE.test(email.trim()) || loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar link"}
          </Button>
          <Button type="button" variant="ghost" onClick={onGoToLogin} className="w-full h-12 rounded-2xl font-semibold">
            Lembrei a senha
          </Button>
        </div>
      </form>
    </AuthShell>
  );
};
