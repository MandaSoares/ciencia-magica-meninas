import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Microscope, Cpu, Wrench, Calculator, ArrowLeft } from "lucide-react";

interface AreaSelectionProps {
  interests: string[];
  onSelectArea: (area: string) => void;
  onBack?: () => void;
}

const areaConfig: Record<string, { icon: React.ElementType; iconBgColor: string; gradient: string; description: string }> = {
  "science": { 
    icon: Microscope, 
    iconBgColor: "bg-blue-100", 
    gradient: "from-blue-400 to-cyan-500",
    description: "Descubra os segredos do universo"
  },
  "technology": { 
    icon: Cpu, 
    iconBgColor: "bg-green-100", 
    gradient: "from-green-400 to-emerald-500",
    description: "Explore o mundo digital"
  },
  "engineering": { 
    icon: Wrench, 
    iconBgColor: "bg-orange-100", 
    gradient: "from-orange-400 to-amber-500",
    description: "Construa o futuro"
  },
  "math": { 
    icon: Calculator, 
    iconBgColor: "bg-pink-100", 
    gradient: "from-pink-400 to-rose-500",
    description: "Desvende os números"
  },
  // Fallback for legacy keys
  "Ciência": { 
    icon: Microscope, 
    iconBgColor: "bg-blue-100", 
    gradient: "from-blue-400 to-cyan-500",
    description: "Descubra os segredos do universo"
  },
  "Tecnologia": { 
    icon: Cpu, 
    iconBgColor: "bg-green-100", 
    gradient: "from-green-400 to-emerald-500",
    description: "Explore o mundo digital"
  },
  "Engenharia": { 
    icon: Wrench, 
    iconBgColor: "bg-orange-100", 
    gradient: "from-orange-400 to-amber-500",
    description: "Construa o futuro"
  },
  "Matemática": { 
    icon: Calculator, 
    iconBgColor: "bg-pink-100", 
    gradient: "from-pink-400 to-rose-500",
    description: "Desvende os números"
  },
};

const areaNames: Record<string, string> = {
  "science": "Ciência",
  "technology": "Tecnologia",
  "engineering": "Engenharia",
  "math": "Matemática",
};

export const AreaSelection = ({ interests, onSelectArea, onBack }: AreaSelectionProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {onBack && (
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        )}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Escolha sua Trilha</h1>
          <p className="text-xl text-gray-600">Qual área você quer explorar hoje?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interests.map((interest) => {
            const config = areaConfig[interest] || areaConfig["science"];
            const Icon = config.icon;
            const displayName = areaNames[interest] || interest;
            
            return (
              <Card 
                key={interest}
                className="p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-purple-300 bg-white"
                onClick={() => onSelectArea(interest)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-20 h-20 ${config.iconBgColor} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-10 h-10 text-gray-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{displayName}</h2>
                  <p className="text-gray-600 mb-4">{config.description}</p>
                  <Button className={`bg-gradient-to-r ${config.gradient} hover:opacity-90`}>
                    Começar Trilha
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
