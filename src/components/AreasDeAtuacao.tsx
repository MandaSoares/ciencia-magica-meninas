import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Star, Award, Briefcase, Loader2 } from "lucide-react";
import { useCareerAreasContent, Career, WomanProfile, getAreaLabel } from "@/hooks/useCareerAreasContent";
import { ContentManager } from "./admin/ContentManager";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useQueryClient } from "@tanstack/react-query";

interface AreasDeAtuacaoProps {
  onPointsEarned: (points: number) => void;
  selectedArea?: string;
}

// Map area keys to area data
const areaMetadata: Record<string, { name: string; icon: string; color: string; description: string }> = {
  science: {
    name: "Ciências",
    icon: "🔬",
    color: "bg-green-500",
    description: "Explore o mundo através da pesquisa e descoberta"
  },
  technology: {
    name: "Tecnologia",
    icon: "💻",
    color: "bg-blue-500",
    description: "Crie o futuro com código e inovação"
  },
  engineering: {
    name: "Engenharia",
    icon: "⚙️",
    color: "bg-orange-500",
    description: "Construa soluções para problemas do mundo real"
  },
  math: {
    name: "Matemática",
    icon: "📐",
    color: "bg-purple-500",
    description: "A linguagem universal do universo"
  }
};

export const AreasDeAtuacao = ({ onPointsEarned, selectedArea = "science" }: AreasDeAtuacaoProps) => {
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedWoman, setSelectedWoman] = useState<WomanProfile | null>(null);

  const { isAdmin, isModerator } = useAdminCheck();
  const queryClient = useQueryClient();

  // Fetch from database
  const { data: careers, isLoading } = useCareerAreasContent(selectedArea);
  const currentAreaMeta = areaMetadata[selectedArea] || areaMetadata.science;

  const handleContentChange = () => {
    queryClient.invalidateQueries({ queryKey: ["career-areas-content"] });
  };

  const handleSelectCareer = (career: Career) => {
    setSelectedCareer(career);
    setSelectedWoman(null);
    onPointsEarned(15);
  };

  const handleSelectWoman = (woman: WomanProfile) => {
    setSelectedWoman(woman);
    onPointsEarned(20);
  };

  const goBack = () => {
    if (selectedWoman) {
      setSelectedWoman(null);
    } else if (selectedCareer) {
      setSelectedCareer(null);
    }
  };

  // Vista da história de uma mulher
  if (selectedWoman) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" onClick={goBack} className="mb-4">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar para {selectedCareer?.name}
        </Button>

        <Card className="overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <img 
              src={selectedWoman.image} 
              alt={selectedWoman.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-purple-600 font-medium">{selectedCareer?.name}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedWoman.name}</h2>
            <div className="flex items-start gap-2 mb-4 p-3 bg-purple-50 rounded-lg">
              <Award className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
              <p className="text-purple-700 font-medium">{selectedWoman.achievement}</p>
            </div>
            <h3 className="text-lg font-semibold mb-3">História Completa</h3>
            <p className="text-gray-700 leading-relaxed">{selectedWoman.story}</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
          <p className="text-center text-gray-700">
            ✨ Você pode ser a próxima grande inspiração em {selectedCareer?.name}! ✨
          </p>
        </Card>
      </div>
    );
  }

  // Vista das mulheres em uma carreira
  if (selectedCareer) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" onClick={goBack} className="mb-4">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar para {currentAreaMeta.name}
        </Button>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedCareer.name}</h2>
          <p className="text-gray-600 mb-4">{selectedCareer.description}</p>
        </div>

        <h3 className="text-xl font-semibold text-gray-800">{getAreaLabel(selectedArea)} Inspiradoras</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedCareer.women.map((woman, index) => (
            <Card 
              key={index}
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              onClick={() => handleSelectWoman(woman)}
            >
              <div className="h-32 overflow-hidden">
                <img 
                  src={woman.image} 
                  alt={woman.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-800 mb-1">{woman.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{woman.achievement}</p>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                  Ler História Completa
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Vista principal - carreiras da área selecionada
  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`${currentAreaMeta.color} text-white p-6 rounded-xl`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currentAreaMeta.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">Áreas de Atuação em {currentAreaMeta.name}</h2>
              <p className="opacity-90">{currentAreaMeta.description}</p>
            </div>
          </div>
          {(isAdmin || isModerator) && (
            <ContentManager
              type="career"
              selectedArea={selectedArea}
              onContentChange={handleContentChange}
              isAdmin={isAdmin}
              isModerator={isModerator}
            />
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800">Carreiras em {currentAreaMeta.name}</h3>

      {(!careers || careers.length === 0) ? (
        <Card className="p-6 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma carreira cadastrada para esta área ainda.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {careers.map((career, index) => (
            <Card 
              key={index}
              className="p-5 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              onClick={() => handleSelectCareer(career)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${currentAreaMeta.color} rounded-lg flex items-center justify-center`}>
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-gray-800">{career.name}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{career.description}</p>
              <p className="text-xs text-purple-600 font-medium">
                {career.women.length} inspirações
              </p>
              <ChevronRight className="w-5 h-5 text-gray-400 mt-2 ml-auto" />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};