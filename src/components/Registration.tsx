
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar } from "lucide-react";

interface RegistrationProps {
  onComplete: (userData: {
    name: string;
    email: string;
    age: number;
  }) => void;
}

export const Registration = ({ onComplete }: RegistrationProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.age) {
      onComplete({
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age)
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-white shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Bem-vinda ao ScienceGirls!
          </h1>
          <p className="text-gray-600">
            Vamos começar sua jornada científica!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3"
          >
            Continuar
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Ao continuar, você concorda com nossos termos de uso
          </p>
        </div>
      </Card>
    </div>
  );
};
