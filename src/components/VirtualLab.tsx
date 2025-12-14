
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Beaker, Zap, Sparkles, Flame, Droplets, Wind, Magnet } from "lucide-react";
import { ExperimentComments } from "./ExperimentComments";

interface VirtualLabProps {
  onPointsEarned: (points: number) => void;
  onExperimentComplete: () => void;
  selectedArea?: string;
}

interface Experiment {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  time: string;
  materials: string[];
  steps: string[];
  icon: any;
  color: string;
  image: string;
  stepImages: string[];
  area: string;
}

// Experimentos por área
const scienceExperiments: Experiment[] = [
  {
    id: "volcano",
    title: "Vulcão de Bicarbonato",
    description: "Crie uma erupção segura e colorida!",
    difficulty: "Fácil",
    time: "15 min",
    materials: ["Bicarbonato", "Vinagre", "Corante", "Detergente"],
    steps: [
      "Monte uma estrutura em forma de vulcão usando argila ou garrafa plástica cortada",
      "Coloque 3 colheres de bicarbonato de sódio dentro do vulcão",
      "Adicione algumas gotas de corante alimentício (vermelho ou laranja ficam incríveis!)",
      "Coloque uma gota de detergente para criar mais espuma",
      "Despeje lentamente meio copo de vinagre e observe a erupção!"
    ],
    icon: Flame,
    color: "bg-red-500",
    image: "🌋",
    stepImages: ["🏔️", "🥄", "🎨", "🧴", "💥"],
    area: "science"
  },
  {
    id: "slime",
    title: "Slime Mágico",
    description: "Faça um slime que muda de cor com temperatura!",
    difficulty: "Médio",
    time: "20 min",
    materials: ["Cola branca", "Bórax ou solução de lentes", "Água morna", "Corante"],
    steps: [
      "Em um recipiente, despeje 100ml de cola branca",
      "Adicione 50ml de água morna e misture bem",
      "Coloque algumas gotas de corante da sua cor favorita",
      "Prepare a solução ativadora: 1 colher de bórax em 1 copo de água",
      "Adicione a solução ativadora aos poucos, mexendo até formar o slime!"
    ],
    icon: Droplets,
    color: "bg-green-500",
    image: "🟢",
    stepImages: ["🧪", "💧", "🎨", "🥄", "✨"],
    area: "science"
  },
  {
    id: "density",
    title: "Torre de Líquidos",
    description: "Empilhe líquidos de diferentes densidades!",
    difficulty: "Fácil",
    time: "15 min",
    materials: ["Mel", "Xarope de milho", "Detergente", "Água", "Óleo vegetal", "Álcool"],
    steps: [
      "Pegue um copo alto e transparente",
      "Despeje cuidadosamente o mel no fundo",
      "Adicione o xarope de milho lentamente pela lateral",
      "Continue com detergente, água, óleo e álcool (nessa ordem)",
      "Observe as camadas se formarem! Cada líquido tem uma densidade diferente."
    ],
    icon: Beaker,
    color: "bg-amber-500",
    image: "🏺",
    stepImages: ["🥃", "🍯", "🧴", "💧", "🌈"],
    area: "science"
  }
];

const technologyExperiments: Experiment[] = [
  {
    id: "circuit",
    title: "Circuito de Limões",
    description: "Acenda LEDs usando frutas como bateria!",
    difficulty: "Avançado",
    time: "30 min",
    materials: ["4 Limões", "4 Moedas de cobre", "4 Pregos de zinco", "Fios", "LED"],
    steps: [
      "Espete uma moeda de cobre em cada limão (ela será o polo positivo)",
      "Espete um prego de zinco em cada limão (ele será o polo negativo)",
      "Conecte a moeda do primeiro limão ao prego do segundo com um fio",
      "Continue conectando todos os limões em série",
      "Conecte a ponta do fio livre ao LED e veja a mágica acontecer!"
    ],
    icon: Zap,
    color: "bg-yellow-500",
    image: "🍋",
    stepImages: ["🪙", "🔩", "🔌", "⛓️", "💡"],
    area: "technology"
  },
  {
    id: "binary",
    title: "Código Binário com Lanternas",
    description: "Aprenda a linguagem dos computadores!",
    difficulty: "Médio",
    time: "20 min",
    materials: ["2 Lanternas", "Papel", "Caneta", "Tabela de código binário"],
    steps: [
      "Imprima ou desenhe a tabela de código binário (onde cada letra = 8 bits)",
      "Combine com uma amiga: lanterna ligada = 1, desligada = 0",
      "Escolha uma palavra curta para enviar (ex: OI = 01001111 01001001)",
      "Pratique piscar a lanterna no ritmo certo para cada bit",
      "Tente enviar mensagens secretas usando o código binário!"
    ],
    icon: Lightbulb,
    color: "bg-blue-500",
    image: "💡",
    stepImages: ["📄", "🔦", "✏️", "0️⃣1️⃣", "💬"],
    area: "technology"
  },
  {
    id: "algorithm",
    title: "Algoritmo de Ordenação",
    description: "Aprenda a pensar como um computador!",
    difficulty: "Fácil",
    time: "15 min",
    materials: ["10 Cartas de baralho", "Mesa", "Cronômetro"],
    steps: [
      "Embaralhe 10 cartas de baralho numeradas",
      "Coloque as cartas em fileira sobre a mesa",
      "Use o algoritmo 'bolha': compare cartas adjacentes e troque se estiverem fora de ordem",
      "Continue passando pela fileira até que todas estejam ordenadas",
      "Cronometre quanto tempo levou e tente novamente para melhorar!"
    ],
    icon: Beaker,
    color: "bg-purple-500",
    image: "🃏",
    stepImages: ["🎴", "📊", "↔️", "🔄", "⏱️"],
    area: "technology"
  }
];

const engineeringExperiments: Experiment[] = [
  {
    id: "bridge",
    title: "Ponte de Palitos",
    description: "Construa uma ponte resistente com palitos!",
    difficulty: "Médio",
    time: "45 min",
    materials: ["50 Palitos de picolé", "Cola quente", "Linha", "Peso para teste"],
    steps: [
      "Desenhe o projeto da ponte em papel (formato triangular é mais resistente)",
      "Monte a base usando palitos colados lado a lado",
      "Construa as estruturas laterais com triângulos de palitos",
      "Una as laterais com travessas horizontais",
      "Teste a resistência colocando peso gradualmente no centro!"
    ],
    icon: Beaker,
    color: "bg-orange-500",
    image: "🌉",
    stepImages: ["📝", "📏", "🔺", "🔗", "⚖️"],
    area: "engineering"
  },
  {
    id: "catapult",
    title: "Catapulta Medieval",
    description: "Construa uma máquina de lançamento!",
    difficulty: "Avançado",
    time: "40 min",
    materials: ["Palitos de churrasco", "Elásticos", "Colher de plástico", "Tampinha", "Pompom"],
    steps: [
      "Monte uma base estável com 4 palitos formando um quadrado",
      "Adicione estruturas verticais nos cantos traseiros",
      "Prenda a colher como braço da catapulta usando elásticos",
      "Adicione mais elásticos para criar a tensão de lançamento",
      "Teste diferentes ângulos e tensões para otimizar o alcance!"
    ],
    icon: Wind,
    color: "bg-red-600",
    image: "🏰",
    stepImages: ["📐", "🔧", "🥄", "➰", "🎯"],
    area: "engineering"
  },
  {
    id: "tornado",
    title: "Tornado na Garrafa",
    description: "Crie um vórtice impressionante!",
    difficulty: "Fácil",
    time: "10 min",
    materials: ["2 Garrafas PET", "Conector de garrafas (ou fita adesiva forte)", "Água", "Glitter"],
    steps: [
      "Encha uma garrafa PET com água até 2/3",
      "Adicione um pouco de glitter ou corante para visualizar melhor",
      "Conecte a segunda garrafa vazia na primeira usando o conector",
      "Vire as garrafas para que a cheia fique em cima",
      "Gire em movimentos circulares e observe o tornado se formar!"
    ],
    icon: Wind,
    color: "bg-cyan-500",
    image: "🌪️",
    stepImages: ["🍶", "✨", "🔗", "🔄", "🌀"],
    area: "engineering"
  }
];

const mathExperiments: Experiment[] = [
  {
    id: "fibonacci",
    title: "Espiral de Fibonacci na Natureza",
    description: "Descubra a matemática escondida nas plantas!",
    difficulty: "Fácil",
    time: "20 min",
    materials: ["Girassol ou pinha", "Lupa", "Papel quadriculado", "Lápis de cor"],
    steps: [
      "Observe o centro de um girassol ou as escamas de uma pinha",
      "Conte quantas espirais vão para a esquerda e quantas para a direita",
      "Anote os números - eles fazem parte da sequência de Fibonacci!",
      "No papel quadriculado, desenhe quadrados seguindo a sequência: 1, 1, 2, 3, 5, 8...",
      "Conecte os cantos dos quadrados para criar sua própria espiral dourada!"
    ],
    icon: Beaker,
    color: "bg-green-600",
    image: "🌻",
    stepImages: ["🔍", "🌀", "✏️", "📊", "✨"],
    area: "math"
  },
  {
    id: "probability",
    title: "Jogo de Probabilidades",
    description: "Aprenda probabilidade com dados e moedas!",
    difficulty: "Médio",
    time: "25 min",
    materials: ["2 Dados", "1 Moeda", "Papel", "Caneta", "Calculadora"],
    steps: [
      "Jogue a moeda 20 vezes e anote quantas vezes deu cara e coroa",
      "Compare com a probabilidade teórica de 50% para cada lado",
      "Agora jogue 2 dados 30 vezes e anote a soma de cada jogada",
      "Faça um gráfico de barras com as somas que apareceram",
      "Descubra por que a soma 7 aparece mais vezes que as outras!"
    ],
    icon: Beaker,
    color: "bg-purple-600",
    image: "🎲",
    stepImages: ["🪙", "📊", "🎯", "📈", "🧮"],
    area: "math"
  },
  {
    id: "magnet",
    title: "Geometria com Bússola Caseira",
    description: "Construa uma bússola e explore ângulos!",
    difficulty: "Médio",
    time: "15 min",
    materials: ["Agulha", "Ímã", "Rolha ou isopor", "Recipiente com água", "Transferidor"],
    steps: [
      "Magnetize a agulha esfregando-a no ímã sempre na mesma direção (30 vezes)",
      "Corte um pedaço pequeno de rolha ou isopor",
      "Espete a agulha no centro da rolha/isopor",
      "Coloque água no recipiente e flutue a rolha com a agulha",
      "Use o transferidor para medir os ângulos e direções - a agulha aponta para o Norte magnético!"
    ],
    icon: Magnet,
    color: "bg-indigo-500",
    image: "🧭",
    stepImages: ["📍", "🧲", "✂️", "💧", "📐"],
    area: "math"
  }
];

const getExperimentsByArea = (area: string): Experiment[] => {
  switch (area) {
    case "science":
      return scienceExperiments;
    case "technology":
      return technologyExperiments;
    case "engineering":
      return engineeringExperiments;
    case "math":
      return mathExperiments;
    default:
      return scienceExperiments;
  }
};

const getAreaName = (area: string): string => {
  const names: Record<string, string> = {
    science: "Ciências",
    technology: "Tecnologia",
    engineering: "Engenharia",
    math: "Matemática"
  };
  return names[area] || "Ciências";
};

export const VirtualLab = ({ onPointsEarned, onExperimentComplete, selectedArea = "science" }: VirtualLabProps) => {
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  const [experimentStep, setExperimentStep] = useState(0);
  const [completedExperiments, setCompletedExperiments] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState(false);

  const experiments = getExperimentsByArea(selectedArea);
  const areaName = getAreaName(selectedArea);

  const [showSafetyWarning, setShowSafetyWarning] = useState(true);

  const startExperiment = (experimentId: string) => {
    setActiveExperiment(experimentId);
    setExperimentStep(0);
    setShowComments(false);
    setShowSafetyWarning(true);
    onPointsEarned(30);
  };

  const dismissSafetyWarning = () => {
    setShowSafetyWarning(false);
  };

  const nextStep = () => {
    const experiment = experiments.find(exp => exp.id === activeExperiment);
    if (experiment && experimentStep < experiment.steps.length - 1) {
      setExperimentStep(prev => prev + 1);
      onPointsEarned(20);
    } else {
      // Experiment completed - show comments
      setShowComments(true);
      setCompletedExperiments(prev => new Set([...prev, activeExperiment!]));
      onPointsEarned(100);
      onExperimentComplete();
    }
  };

  const finishExperiment = () => {
    setActiveExperiment(null);
    setExperimentStep(0);
    setShowComments(false);
  };

  const currentExperiment = experiments.find(exp => exp.id === activeExperiment);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Laboratório de {areaName}</h2>
        <p className="text-gray-600">Experimentos práticos e divertidos para explorar {areaName.toLowerCase()}!</p>
      </div>

      {!activeExperiment ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments.map((experiment) => {
              const Icon = experiment.icon;
              const isCompleted = completedExperiments.has(experiment.id);
              return (
                <Card key={experiment.id} className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${experiment.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      {isCompleted && (
                        <span className="text-green-500 text-sm font-medium">✓ Concluído</span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        experiment.difficulty === 'Fácil' ? 'bg-green-100 text-green-700' :
                        experiment.difficulty === 'Médio' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {experiment.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="text-center text-6xl mb-4">{experiment.image}</div>

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
                    {isCompleted ? "Refazer Experimento" : "Começar Experimento"}
                  </Button>
                </Card>
              );
            })}
          </div>

          <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">🛡️ Dicas de Segurança</h3>
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
        <div className="space-y-6">
          {/* Aviso de Segurança */}
          {showSafetyWarning && (
            <Card className="p-6 bg-yellow-50 border-2 border-yellow-400">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-yellow-800 mb-2">Aviso de Segurança</h3>
                  <ul className="space-y-2 text-yellow-700">
                    <li>✅ Sempre peça ajuda de um adulto antes de começar</li>
                    <li>✅ Use óculos de proteção quando necessário</li>
                    <li>✅ Mantenha o ambiente limpo e organizado</li>
                    <li>✅ Lave as mãos antes e depois do experimento</li>
                    <li>✅ Não leve materiais à boca</li>
                  </ul>
                  <Button 
                    onClick={dismissSafetyWarning}
                    className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Entendi! Vamos começar
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {!showSafetyWarning && (
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className={`w-12 h-12 ${currentExperiment.color} rounded-lg flex items-center justify-center`}>
                <currentExperiment.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800">{currentExperiment.title}</h3>
                <p className="text-gray-600">
                  {showComments ? "Experimento concluído!" : `Passo ${experimentStep + 1} de ${currentExperiment.steps.length}`}
                </p>
              </div>
              <Button variant="outline" onClick={finishExperiment}>
                Sair
              </Button>
            </div>

            {!showComments && (
              <>
                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${((experimentStep + 1) / currentExperiment.steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                  <div className="text-center mb-4">
                    <span className="text-6xl">{currentExperiment.stepImages[experimentStep]}</span>
                  </div>
                  <h4 className="font-semibold text-lg mb-3 text-gray-800">
                    Passo {experimentStep + 1}:
                  </h4>
                  <p className="text-gray-700 text-lg">{currentExperiment.steps[experimentStep]}</p>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={finishExperiment}
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
              </>
            )}

            {showComments && (
              <div className="space-y-6">
                <div className="text-center py-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <span className="text-6xl mb-4 block">🎉</span>
                  <h4 className="text-xl font-bold text-green-700 mb-2">Parabéns!</h4>
                  <p className="text-gray-600">Você concluiu o experimento "{currentExperiment.title}"!</p>
                  <p className="text-purple-600 font-semibold mt-2">+100 pontos ganhos!</p>
                </div>

                <ExperimentComments experimentId={currentExperiment.id} experimentTitle={currentExperiment.title} />

                <Button
                  onClick={finishExperiment}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Voltar ao Laboratório
                </Button>
              </div>
            )}
          </Card>
          )}
        </div>
      )}
    </div>
  );
};
