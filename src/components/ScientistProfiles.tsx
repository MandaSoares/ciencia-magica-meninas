import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, Calendar } from "lucide-react";
import { getScientistsByArea, getAreaLabel, Scientist } from "@/data/scientistsData";
import { ScientistStoryModal } from "@/components/ScientistStoryModal";

interface ScientistProfilesProps {
  onPointsEarned: (points: number) => void;
  selectedArea?: string;
}

export const ScientistProfiles = ({ onPointsEarned, selectedArea = "Ciência" }: ScientistProfilesProps) => {
  const [selectedScientist, setSelectedScientist] = useState<Scientist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const scientists = getScientistsByArea(selectedArea);
  const areaLabel = getAreaLabel(selectedArea);

  const readMore = (scientist: Scientist) => {
    onPointsEarned(25);
    setSelectedScientist(scientist);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{areaLabel.plural} Inspiradoras</h2>
        <p className="text-gray-600">Conheça mulheres que mudaram o mundo com {selectedArea.toLowerCase()}!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {scientists.map((scientist) => (
          <Card key={scientist.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="h-48 overflow-hidden">
              <img
                src={scientist.image}
                alt={scientist.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="text-purple-600 font-medium text-sm">{scientist.field}</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{scientist.name}</h3>
              
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 text-sm">{scientist.year}</span>
              </div>

              <div className="flex items-start space-x-2 mb-3">
                <Award className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700 text-sm">{scientist.achievement}</p>
              </div>

              <p className="text-gray-600 text-sm mb-4">{scientist.description}</p>

              <Button
                onClick={() => readMore(scientist)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Ler História Completa
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Você Sabia?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-semibold text-purple-700 mb-2">40%</h4>
            <p className="text-gray-600 text-sm">Das pesquisadoras em STEM são mulheres no Brasil</p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-semibold text-pink-700 mb-2">1.5M</h4>
            <p className="text-gray-600 text-sm">Mulheres trabalham em tecnologia no país</p>
          </div>
        </div>
      </Card>

      <ScientistStoryModal
        scientist={selectedScientist}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        areaLabel={areaLabel.singular}
      />
    </div>
  );
};
