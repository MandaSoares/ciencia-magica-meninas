import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Microscope, Cpu, Wrench, Calculator } from "lucide-react";

interface AreaSelectionProps {
  interests: string[];
  onSelectArea: (area: string) => void;
}

const areaConfig: Record<string, { icon: React.ElementType; color: string; gradient: string }> = {
  "Ciência": { icon: Microscope, color: "bg-green-500", gradient: "from-green-400 to-emerald-500" },
  "Tecnologia": { icon: Cpu, color: "bg-blue-500", gradient: "from-blue-400 to-cyan-500" },
  "Engenharia": { icon: Wrench, color: "bg-orange-500", gradient: "from-orange-400 to-amber-500" },
  "Matemática": { icon: Calculator, color: "bg-purple-500", gradient: "from-purple-400 to-violet-500" },
};

export const AreaSelection = ({ interests, onSelectArea }: AreaSelectionProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Escolha sua Trilha</h1>
          <p className="text-xl text-gray-600">Qual área você quer explorar hoje?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interests.map((interest) => {
            const config = areaConfig[interest] || areaConfig["Ciência"];
            const Icon = config.icon;
            
            return (
              <Card 
                key={interest}
                className="p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-purple-300"
                onClick={() => onSelectArea(interest)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${config.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{interest}</h2>
                  <p className="text-gray-600 mb-4">
                    {interest === "Ciência" && "Descubra os segredos do universo"}
                    {interest === "Tecnologia" && "Explore o mundo digital"}
                    {interest === "Engenharia" && "Construa o futuro"}
                    {interest === "Matemática" && "Desvende os números"}
                  </p>
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
