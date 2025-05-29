
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Atom, Code, Cog, Calculator, Sparkles } from "lucide-react";

interface STEMInterest {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  examples: string[];
}

interface STEMInterestSelectionProps {
  userName: string;
  onComplete: (interests: string[]) => void;
}

export const STEMInterestSelection = ({ userName, onComplete }: STEMInterestSelectionProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const stemAreas: STEMInterest[] = [
    {
      id: "science",
      title: "Ciência",
      description: "Explore os mistérios do universo",
      icon: Atom,
      color: "bg-blue-500",
      examples: ["Química", "Física", "Biologia", "Astronomia"]
    },
    {
      id: "technology",
      title: "Tecnologia",
      description: "Domine as ferramentas do futuro",
      icon: Code,
      color: "bg-green-500",
      examples: ["Programação", "Apps", "Inteligência Artificial", "Robôs"]
    },
    {
      id: "engineering",
      title: "Engenharia",
      description: "Construa soluções incríveis",
      icon: Cog,
      color: "bg-purple-500",
      examples: ["Mecânica", "Civil", "Eletrônica", "Biomédica"]
    },
    {
      id: "mathematics",
      title: "Matemática",
      description: "Desvende padrões e lógica",
      icon: Calculator,
      color: "bg-pink-500",
      examples: ["Álgebra", "Geometria", "Estatística", "Cálculo"]
    }
  ];

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleComplete = () => {
    if (selectedInterests.length > 0) {
      onComplete(selectedInterests);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Olá, {userName}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Quais áreas de STEM mais despertam sua curiosidade?
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Escolha uma ou mais áreas (você pode mudar depois!)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stemAreas.map((area) => {
            const Icon = area.icon;
            const isSelected = selectedInterests.includes(area.id);
            
            return (
              <Card
                key={area.id}
                className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isSelected 
                    ? 'ring-4 ring-purple-300 bg-gradient-to-br from-purple-50 to-pink-50' 
                    : 'hover:shadow-xl'
                }`}
                onClick={() => toggleInterest(area.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${area.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{area.title}</h3>
                      {isSelected && (
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{area.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {area.examples.map((example, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {selectedInterests.length > 0 
              ? `${selectedInterests.length} área${selectedInterests.length > 1 ? 's' : ''} selecionada${selectedInterests.length > 1 ? 's' : ''}`
              : 'Selecione pelo menos uma área para continuar'
            }
          </p>
          <Button
            onClick={handleComplete}
            disabled={selectedInterests.length === 0}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
          >
            Começar Jornada! 🚀
          </Button>
        </div>
      </div>
    </div>
  );
};
