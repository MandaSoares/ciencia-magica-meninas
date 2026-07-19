import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "./Logo";

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
  onGoToRegister: () => void;
  onForgotPassword: () => void;
}

export const Login = ({ onLogin, onBack, onGoToRegister, onForgotPassword }: LoginProps) => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setLoading(true);
    const { error } = await signIn(formData.email, formData.password);
    setLoading(false);

    if (!error) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-6 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 animate-slide-up">
          <Logo size={56} className="mx-auto mb-3" />
          <h2 className="text-lg font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Conscientistas
          </h2>
        </div>

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
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Bem-vinda de volta!
            </h1>
            <p className="text-muted-foreground">
              Entre na sua conta para continuar aprendendo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full py-5 rounded-xl"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Senha</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full py-5 rounded-xl"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-primary hover:underline mt-1"
              >
                Esqueci minha senha
              </button>
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Não tem uma conta?{" "}
              <button
                onClick={onGoToRegister}
                className="text-primary font-semibold hover:underline"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
