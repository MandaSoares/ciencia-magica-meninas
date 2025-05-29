
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Beaker, Zap, Sparkles } from "lucide-react";

interface VirtualLabProps {
  onPointsEarned: (points: number) => void;
}

export const VirtualLab = ({ onPointsEarned }: VirtualLabProps) => {
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  const [experimentStep, setExperimentStep] = useState(0);

  const experiments = [
    {
      id: "volcano",
      title: "Vulcão de Bicarbonato",
      description: "Crie uma erupção segura e colorida!",
      difficulty: "Fácil",
      time: "15 min",
      materials: ["Bicarbonato", "Vinagre", "Corante", "Detergente"],
      steps: [
        "Misture bicarbonato com algumas gotas de corante",
        "Adicione uma gota de detergente",
        "Despeje o vinagre lentamente",
        "Observe a reação efervescente!"
      ],
      icon: Lightbulb,
      color: "bg-red-500"
    },
    {
      id: "slime",
      title: "Slime Inteligente",
      description: "Faça um slime que muda de cor!",
      difficulty: "Médio",
      time: "20 min",
      materials: ["Cola branca", "Borax", "Água", "Tinta termocromática"],
      steps: [
        "Misture cola com água em proporção 1:1",
        "Adicione algumas gotas de tinta termocromática",
        "Prepare solução de borax (1 colher + 1 copo de água)",
        "Misture tudo devagar até formar o slime!"
      ],
      icon: Beaker,
      color: "bg-green-500"
    },
    {
      id: "circuit",
      title: "Circuito de LED",
      description: "Acenda LEDs com frutas!",
      difficulty: "Avançado",
      time: "30 min",
      materials: ["LEDs", "Fios", "Limões", "Moedas de cobre"],
      steps: [
        "Insira moedas de cobre nos limões",
        "Conecte os fios aos LEDs",
        "Ligue os circuitos usando os limões como bateria",
        "Veja a mágica da eletricidade natural!"
      ],
      icon: Zap,
      color: "bg-yellow-500"
    }
  ];

  const startExperiment = (experimentId: string) => {
    setActiveExperiment(experimentId);
    setExperimentStep(0);
    onPointsEarned(30);
  };

  const nextStep = () => {
    const experiment = experiments.find(exp => exp.id === activeExperiment);
    if (experiment && experimentStep < experiment.steps.length - 1) {
      setExperimentStep(prev => prev + 1);
    } else {
      // Experiment completed
      onPointsEarned(100);
      setActiveExperiment(null);
      setExperimentStep(0);
    }
  };

  const currentExperiment = experiments.find(exp => exp.id === activeExperiment);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Laboratório Virtual</h2>
        <p className="text-gray-600">Experimente, descubra e se divirta com ciência segura!</p>
      </div>

      {!activeExperiment ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments.map((experiment) => {
              const Icon = experiment.icon;
              return (
                <Card key={experiment.id} className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${experiment.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        experiment.difficulty === 'Fácil' ? 'bg-green-100 text-green-700' :
                        experiment.difficulty === 'Médio' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {experiment.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{experiment.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{experiment.description}</p>

                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <span>⏱️ {experiment.time}</span>
                    <span>🧪 {experiment.materials.length} materiais</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-gray-700 text-sm">Materiais:</h4>
                    <div className="flex flex-wrap gap-1">
                      {experiment.materials.map((material, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => startExperiment(experiment.id)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Começar Experimento
                  </Button>
                </Card>
              );
            })}
          </div>

          <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Dicas de Segurança</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Sempre peça ajuda de um adulto</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Use óculos de proteção quando necessário</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Mantenha o ambiente limpo e organizado</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Lave as mãos antes e depois</span>
                </div>
              </div>
            </div>
          </Card>
        </>
      ) : currentExperiment && (
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-12 h-12 ${currentExperiment.color} rounded-lg flex items-center justify-center`}>
              <currentExperiment.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{currentExperiment.title}</h3>
              <p className="text-gray-600">Passo {experimentStep + 1} de {currentExperiment.steps.length}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((experimentStep + 1) / currentExperiment.steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
            <h4 className="font-semibold text-lg mb-3 text-gray-800">
              Passo {experimentStep + 1}:
            </h4>
            <p className="text-gray-700 text-lg">{currentExperiment.steps[experimentStep]}</p>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={() => setActiveExperiment(null)}
              variant="outline"
              className="flex-1"
            >
              Sair do Experimento
            </Button>
            <Button
              onClick={nextStep}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {experimentStep < currentExperiment.steps.length - 1 ? "Próximo Passo" : "Finalizar Experimento"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
