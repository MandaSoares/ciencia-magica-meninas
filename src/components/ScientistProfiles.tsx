
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, Calendar } from "lucide-react";

interface ScientistProfilesProps {
  onPointsEarned: (points: number) => void;
}

export const ScientistProfiles = ({ onPointsEarned }: ScientistProfilesProps) => {
  const scientists = [
    {
      id: 1,
      name: "Marie Curie",
      field: "Física e Química",
      achievement: "Primeira mulher a ganhar um Prêmio Nobel",
      year: "1867-1934",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop&crop=face",
      description: "Pioneira no estudo da radioatividade e duas vezes ganhadora do Nobel.",
      facts: [
        "Primeira mulher professora na Universidade de Paris",
        "Descobriu os elementos polônio e rádio",
        "Única pessoa a ganhar Nobel em duas áreas diferentes"
      ]
    },
    {
      id: 2,
      name: "Katherine Johnson",
      field: "Matemática e Física",
      achievement: "Calculou trajetórias para missões espaciais da NASA",
      year: "1918-2020",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=300&fit=crop&crop=face",
      description: "Matemática brilhante que ajudou a levar o homem à lua.",
      facts: [
        "Seus cálculos foram essenciais para o sucesso da Apollo 11",
        "Trabalhou na NASA por mais de 30 anos",
        "Recebeu a Medalha Presidencial da Liberdade"
      ]
    },
    {
      id: 3,
      name: "Rosalind Franklin",
      field: "Química e Biologia",
      achievement: "Contribuições fundamentais para descoberta do DNA",
      year: "1920-1958",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop&crop=face",
      description: "Suas fotografias de raio-X foram cruciais para entender a estrutura do DNA.",
      facts: [
        "Pioneira na cristalografia de raio-X",
        "Estudou a estrutura do RNA e vírus",
        "Suas pesquisas foram fundamentais para a medicina moderna"
      ]
    }
  ];

  const readMore = (scientistName: string) => {
    onPointsEarned(25);
    console.log(`Lendo mais sobre: ${scientistName}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Cientistas Inspiradoras</h2>
        <p className="text-gray-600">Conheça mulheres que mudaram o mundo com a ciência!</p>
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

              <div className="space-y-2 mb-4">
                <h4 className="font-semibold text-gray-800 text-sm">Fatos Interessantes:</h4>
                <ul className="space-y-1">
                  {scientist.facts.map((fact, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => readMore(scientist.name)}
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
    </div>
  );
};
