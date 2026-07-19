import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Beaker, Zap, Sparkles, Flame, Droplets, Wind, Magnet, Loader2, Trash2, Edit2, CheckCircle2, Clock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExperimentComments } from "./ExperimentComments";
import { useExperimentsContent, Experiment as DbExperiment, getAreaName } from "@/hooks/useExperimentsContent";
import { AddExperimentInline } from "./admin/AddExperimentInline";
import { EditExperimentInline } from "./admin/EditExperimentInline";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VirtualLabProps {
  onPointsEarned: (points: number) => void;
  onExperimentComplete: (experimentId: string) => void;
  selectedArea?: string;
  completedExperimentIds?: Set<string>;
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

// Icon mapping for dynamic icons from database
const iconMap: Record<string, any> = {
  Beaker,
  Flame,
  Droplets,
  Wind,
  Magnet,
  Zap,
  Lightbulb,
  Sparkles,
};

const mapDbExperimentToLocal = (exp: DbExperiment, area: string): Experiment => ({
  id: exp.id,
  title: exp.title,
  description: exp.description,
  difficulty: exp.difficulty,
  time: exp.time,
  materials: exp.materials,
  steps: exp.steps,
  icon: iconMap[exp.icon] || Beaker,
  color: exp.color,
  image: exp.image,
  stepImages: exp.stepImages,
  area: area,
});

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

// Static fallback experiments - all areas with complete content
const staticExperiments: Record<string, Experiment[]> = {
  science: scienceExperiments,
  technology: technologyExperiments,
  engineering: engineeringExperiments,
  math: mathExperiments,
};

const getExperimentsByArea = (area: string, dbExperiments: DbExperiment[]): Experiment[] => {
  if (dbExperiments && dbExperiments.length > 0) {
    return dbExperiments.map(exp => mapDbExperimentToLocal(exp, area));
  }
  return staticExperiments[area] || staticExperiments.science;
};

const areaThemes: Record<string, { gradient: string; light: string; accent: string; emoji: string }> = {
  science: { gradient: "from-emerald-500 to-teal-500", light: "from-emerald-50 to-teal-50", accent: "text-emerald-600", emoji: "🔬" },
  technology: { gradient: "from-blue-500 to-indigo-500", light: "from-blue-50 to-indigo-50", accent: "text-blue-600", emoji: "💻" },
  engineering: { gradient: "from-orange-500 to-amber-500", light: "from-orange-50 to-amber-50", accent: "text-orange-600", emoji: "⚙️" },
  math: { gradient: "from-purple-500 to-violet-500", light: "from-purple-50 to-violet-50", accent: "text-purple-600", emoji: "📐" },
};

export const VirtualLab = ({ onPointsEarned, onExperimentComplete, selectedArea = "science", completedExperimentIds = new Set() }: VirtualLabProps) => {
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  const [experimentStep, setExperimentStep] = useState(0);
  const [completedExperiments, setCompletedExperiments] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState(false);
  const [showSafetyWarning, setShowSafetyWarning] = useState(true);
  const [deleteExperimentId, setDeleteExperimentId] = useState<string | null>(null);
  const [editingExperiment, setEditingExperiment] = useState<Experiment | null>(null);
  
  const { isAdmin } = useAdminCheck();
  const queryClient = useQueryClient();

  // Fetch from database with fallback to static data
  const { data: dbExperiments, isLoading } = useExperimentsContent(selectedArea);
  const experiments = getExperimentsByArea(selectedArea, dbExperiments || []);
  const areaName = getAreaName(selectedArea);
  const theme = areaThemes[selectedArea] || areaThemes.science;

  const handleContentChange = () => {
    queryClient.invalidateQueries({ queryKey: ["experiments-content"] });
  };

  const handleDeleteExperiment = async () => {
    if (!deleteExperimentId) return;
    
    try {
      const { error } = await supabase
        .from('experiments_content')
        .delete()
        .eq('id', deleteExperimentId);

      if (error) throw error;

      toast({ title: "Experimento deletado com sucesso!" });
      handleContentChange();
    } catch (error: any) {
      toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
    } finally {
      setDeleteExperimentId(null);
    }
  };

  // Sync completed experiments from database
  useEffect(() => {
    setCompletedExperiments(completedExperimentIds);
  }, [completedExperimentIds]);

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
      onExperimentComplete(activeExperiment!);
    }
  };

  const finishExperiment = () => {
    setActiveExperiment(null);
    setExperimentStep(0);
    setShowComments(false);
  };

  const currentExperiment = experiments.find(exp => exp.id === activeExperiment);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`bg-gradient-to-r ${theme.gradient} rounded-2xl p-6 text-white animate-slide-up shadow-lg`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm animate-float">
            {theme.emoji}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Laboratorio de {areaName}</h2>
            <p className="opacity-90 text-sm">Experimentos praticos e divertidos para explorar!</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
            <Beaker className="w-4 h-4" />
            <span className="text-sm font-semibold">{experiments.length} experimentos</span>
          </div>
        </div>
      </div>

      {!activeExperiment ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments.map((experiment, idx) => {
              const Icon = experiment.icon;
              const isCompleted = completedExperiments.has(experiment.id);
              const isFromDb = dbExperiments?.some(e => e.id === experiment.id);
              return (
                <Card
                  key={experiment.id}
                  className={cn(
                    "overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.03] relative group animate-pop-in",
                    isCompleted && "ring-2 ring-green-400/60"
                  )}
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`} />

                  <div className="p-5 pb-3 flex justify-center">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${theme.light} flex items-center justify-center text-4xl animate-float shadow-inner`}>
                      {experiment.image}
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{experiment.title}</h3>
                      {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                    </div>

                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{experiment.description}</p>

                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-semibold",
                        experiment.difficulty === 'Fácil' ? 'bg-green-100 text-green-700' :
                        experiment.difficulty === 'Médio' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      )}>
                        {experiment.difficulty}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {experiment.time}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-600">
                        {experiment.materials.length} materiais
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {experiment.materials.slice(0, 3).map((material, index) => (
                        <span key={index} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-600">
                          {material}
                        </span>
                      ))}
                      {experiment.materials.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-400">
                          +{experiment.materials.length - 3}
                        </span>
                      )}
                    </div>

                    <Button
                      onClick={() => startExperiment(experiment.id)}
                      className={`w-full bg-gradient-to-r ${theme.gradient} hover:opacity-90 transition-opacity`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isCompleted ? "Refazer Experimento" : "Iniciar Experimento"}
                    </Button>
                  </div>

                  {isAdmin && isFromDb && (
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingExperiment(experiment);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteExperimentId(experiment.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
            
            {/* Card para adicionar novo experimento - apenas admin */}
            <AddExperimentInline
              selectedArea={selectedArea}
              onContentChange={handleContentChange}
              isAdmin={isAdmin}
            />
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-lg">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-amber-800">Dicas de Seguranca</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["Peca ajuda de um adulto", "Use oculos de protecao", "Mantenha tudo organizado", "Lave as maos"].map((tip, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs text-gray-700 font-medium">{tip}</span>
                </div>
              ))}
            </div>
          </div>
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
          <Card className="overflow-hidden">
            <div className={`bg-gradient-to-r ${theme.gradient} p-5`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <currentExperiment.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-white">
                  <h3 className="text-xl font-bold">{currentExperiment.title}</h3>
                  <p className="text-sm opacity-90">
                    {showComments ? "Experimento concluido!" : `Passo ${experimentStep + 1} de ${currentExperiment.steps.length}`}
                  </p>
                </div>
                <Button variant="outline" onClick={finishExperiment} className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  Sair
                </Button>
              </div>
            </div>

            <div className="p-6">
            {!showComments && (
              <>
                <div className="flex items-center justify-center gap-0 mb-8 overflow-x-auto py-2">
                  {currentExperiment.steps.map((_, i) => (
                    <div key={i} className="flex items-center flex-shrink-0">
                      <div className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                        i < experimentStep
                          ? `bg-gradient-to-r ${theme.gradient} text-white shadow-md`
                          : i === experimentStep
                            ? `bg-gradient-to-r ${theme.gradient} text-white ring-4 ring-purple-200 animate-pulse-glow shadow-lg scale-110`
                            : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                      )}>
                        {i < experimentStep ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </div>
                      {i < currentExperiment.steps.length - 1 && (
                        <div className={cn(
                          "w-8 h-1 rounded-full transition-all duration-300 mx-0.5",
                          i < experimentStep ? `bg-gradient-to-r ${theme.gradient}` : "bg-gray-200"
                        )} />
                      )}
                    </div>
                  ))}
                </div>

                <div className={`bg-gradient-to-br ${theme.light} p-6 rounded-2xl mb-6 border border-gray-100`}>
                  <div className="text-center mb-4">
                    <div className="inline-flex w-20 h-20 rounded-full bg-white shadow-md items-center justify-center text-5xl animate-pop-in">
                      {currentExperiment.stepImages[experimentStep]}
                    </div>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r ${theme.gradient} text-white`}>
                    Passo {experimentStep + 1}
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">{currentExperiment.steps[experimentStep]}</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={finishExperiment}
                    variant="outline"
                    className="flex-1 rounded-xl"
                  >
                    Sair
                  </Button>
                  <Button
                    onClick={nextStep}
                    className={`flex-1 bg-gradient-to-r ${theme.gradient} hover:opacity-90 rounded-xl`}
                  >
                    {experimentStep < currentExperiment.steps.length - 1 ? "Proximo Passo" : "Finalizar!"}
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            )}

            {showComments && (
              <div className="space-y-6">
                <div className="text-center py-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                  <div className="text-6xl mb-4 animate-pop-in">🎉</div>
                  <h4 className="text-2xl font-bold text-green-700 mb-2">Parabens!</h4>
                  <p className="text-gray-600 mb-3">Voce concluiu o experimento "{currentExperiment.title}"!</p>
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-white px-4 py-2 rounded-full font-bold animate-pop-in shadow-md">
                    <Sparkles className="w-4 h-4" />
                    +100 XP
                  </div>
                </div>

                <ExperimentComments experimentId={currentExperiment.id} experimentTitle={currentExperiment.title} />

                <Button
                  onClick={finishExperiment}
                  className={`w-full bg-gradient-to-r ${theme.gradient} hover:opacity-90 rounded-xl`}
                >
                  Voltar ao Laboratorio
                </Button>
              </div>
            )}
            </div>
          </Card>
          )}
        </div>
      )}

      <AlertDialog open={!!deleteExperimentId} onOpenChange={() => setDeleteExperimentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este experimento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteExperiment} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editingExperiment && (
        <EditExperimentInline
          experiment={editingExperiment as unknown as import("@/hooks/useExperimentsContent").Experiment}
          onClose={() => setEditingExperiment(null)}
          onContentChange={handleContentChange}
        />
      )}
    </div>
  );
};
