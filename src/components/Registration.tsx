import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar, ArrowLeft, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "./Logo";

interface RegistrationProps {
  onComplete: () => void;
  onBack: () => void;
  onGoToLogin: () => void;
}

export const Registration = ({ onComplete, onBack, onGoToLogin }: RegistrationProps) => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.age || !formData.password) return;

    if (formData.password.length < 8) {
      return;
    }

    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    if (!hasUpperCase || !hasNumber) {
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      passwordInput?.setCustomValidity('A senha deve conter pelo menos uma letra maiúscula e um número');
      passwordInput?.reportValidity();
      return;
    }

    setLoading(true);
    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.name,
      parseInt(formData.age)
    );
    setLoading(false);

    if (!error) {
      onComplete();
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
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Bem-vinda ao Conscientistas!
            </h1>
            <p className="text-muted-foreground">
              Vamos começar sua jornada científica!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Seu nome</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-xl"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Seu email</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-xl"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Sua senha</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Crie uma senha forte"
                value={formData.password}
                onChange={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.setCustomValidity('');
                  setFormData(prev => ({ ...prev, password: e.target.value }));
                }}
                className="w-full rounded-xl"
                required
                disabled={loading}
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 8 caracteres, incluindo letra maiúscula e número
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Sua idade</span>
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Digite sua idade"
                min="6"
                max="18"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className="w-full rounded-xl"
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
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Já tem uma conta?{" "}
              <button
                onClick={onGoToLogin}
                className="text-primary font-semibold hover:underline"
              >
                Entrar
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Ao continuar, você concorda com nossos termos de uso
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
