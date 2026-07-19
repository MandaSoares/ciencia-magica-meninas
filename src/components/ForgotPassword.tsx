import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2, KeyRound, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Logo } from "./Logo";

interface ForgotPasswordProps {
  onBack: () => void;
  onGoToLogin: () => void;
}

type Step = 'email' | 'sent' | 'newPassword';

export const ForgotPassword = ({ onBack, onGoToLogin }: ForgotPasswordProps) => {
  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const redirectUrl = `${window.location.origin}/?reset=true`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
    setStep('sent');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasUpperCase || !hasNumber) {
      toast.error('A senha deve conter pelo menos uma letra maiúscula e um número');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Senha atualizada com sucesso!');
    onGoToLogin();
  };

  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-6 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 animate-slide-up">
          <Logo size={56} className="mx-auto mb-3" />
          <h2 className="text-lg font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Conscientistas
          </h2>
        </div>
        {children}
      </div>
    </div>
  );

  if (step === 'sent') {
    return (
      <PageWrapper>
        <Card className="p-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl border-0 dark:border dark:border-gray-700 rounded-3xl animate-slide-up stagger-1">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200 dark:shadow-green-900/30">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Email Enviado!
            </h1>
            <p className="text-muted-foreground mb-6">
              Enviamos um link de recuperação para <strong>{email}</strong>.
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Não recebeu? Verifique a pasta de spam ou tente novamente.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => setStep('email')}
                variant="outline"
                className="w-full rounded-xl"
              >
                Tentar novamente
              </Button>
              <Button
                onClick={onGoToLogin}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl"
              >
                Voltar ao Login
              </Button>
            </div>
          </div>
        </Card>
      </PageWrapper>
    );
  }

  if (step === 'newPassword') {
    return (
      <PageWrapper>
        <Card className="p-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl border-0 dark:border dark:border-gray-700 rounded-3xl animate-slide-up stagger-1">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200 dark:shadow-purple-900/30">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Nova Senha
            </h1>
            <p className="text-muted-foreground">
              Digite sua nova senha
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Digite sua nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full py-5 rounded-xl"
                required
                disabled={loading}
                minLength={8}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Mínimo 8 caracteres, incluindo letra maiúscula e número
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-5 rounded-xl"
                required
                disabled={loading}
                minLength={8}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Atualizando...
                </>
              ) : (
                'Atualizar Senha'
              )}
            </Button>
          </form>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Card className="p-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl border-0 dark:border dark:border-gray-700 rounded-3xl animate-slide-up stagger-1">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200 dark:shadow-purple-900/30">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Recuperar Senha
          </h1>
          <p className="text-muted-foreground">
            Digite seu email para receber o link de recuperação
          </p>
        </div>

        <form onSubmit={handleSendResetEmail} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email cadastrado"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-5 rounded-xl"
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 rounded-xl"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Link de Recuperação'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Lembrou a senha?{" "}
            <button
              onClick={onGoToLogin}
              className="text-primary font-semibold hover:underline"
            >
              Voltar ao Login
            </button>
          </p>
        </div>
      </Card>
    </PageWrapper>
  );
};
