import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar, ArrowLeft, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Bem-vinda ao ScienceGirls!
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
              className="w-full"
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
              className="w-full"
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
              placeholder="Crie uma senha"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full"
              required
              disabled={loading}
            />
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
              className="w-full"
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
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
  );
};
