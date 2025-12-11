
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, Lock, CheckCircle, Video, FileText, Beaker, HelpCircle, Award } from "lucide-react";
import { CertificateModal } from "./CertificateModal";

interface ScienceModulesProps {
  onPointsEarned: (points: number) => void;
  selectedArea: string;
  userName: string;
  onModuleComplete: (moduleId: string) => void;
}

interface ModuleContent {
  type: 'video' | 'reading' | 'practice' | 'quiz';
  title: string;
  content: string;
  duration: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessons: number;
  completedLessons: number;
  color: string;
  unlocked: boolean;
  contents: ModuleContent[];
}

const modulesByArea: Record<string, Module[]> = {
  science: [
    {
      id: "physics",
      title: "Física Fascinante",
      description: "Descubra os segredos do universo",
      progress: 0,
      lessons: 8,
      completedLessons: 0,
      color: "bg-blue-500",
      unlocked: true,
      contents: [
        { type: 'video', title: 'Introdução à Física', content: 'https://www.youtube.com/embed/ZM8ECpBuQYE', duration: '10 min' },
        { type: 'reading', title: 'O que é Física?', content: 'A Física é a ciência que estuda os fenômenos naturais e as propriedades da matéria e energia. Ela nos ajuda a entender como o universo funciona, desde as menores partículas até as maiores galáxias. Os físicos buscam descobrir as leis fundamentais que governam tudo ao nosso redor.\n\nA Física está dividida em várias áreas:\n\n1. **Mecânica**: Estuda o movimento dos corpos\n2. **Termodinâmica**: Estuda o calor e a temperatura\n3. **Eletromagnetismo**: Estuda a eletricidade e o magnetismo\n4. **Óptica**: Estuda a luz\n5. **Física Moderna**: Estuda átomos e partículas subatômicas', duration: '15 min' },
        { type: 'practice', title: 'Experimento: Gravidade', content: 'Solte objetos diferentes da mesma altura e observe qual cai primeiro. Anote suas observações!', duration: '20 min' },
        { type: 'quiz', title: 'Quiz de Física Básica', content: 'Teste seus conhecimentos sobre física!', duration: '10 min' },
      ]
    },
    {
      id: "chemistry",
      title: "Química Criativa",
      description: "Experimentos incríveis aguardam você",
      progress: 0,
      lessons: 10,
      completedLessons: 0,
      color: "bg-green-500",
      unlocked: true,
      contents: [
        { type: 'video', title: 'Mundo da Química', content: 'https://www.youtube.com/embed/bka20Q9TN6M', duration: '12 min' },
        { type: 'reading', title: 'Átomos e Moléculas', content: 'A Química é a ciência que estuda a composição, estrutura e transformação da matéria. Tudo ao nosso redor é feito de átomos - desde o ar que respiramos até os alimentos que comemos.\n\n**Átomos** são as menores unidades da matéria. Eles são formados por:\n- **Prótons**: partículas positivas no núcleo\n- **Nêutrons**: partículas neutras no núcleo\n- **Elétrons**: partículas negativas que orbitam o núcleo\n\n**Moléculas** são grupos de átomos ligados. A água (H₂O) é uma molécula formada por 2 átomos de hidrogênio e 1 de oxigênio.', duration: '15 min' },
        { type: 'practice', title: 'Experimento: Reação Química', content: 'Misture vinagre com bicarbonato de sódio e observe a reação efervescente!', duration: '25 min' },
        { type: 'quiz', title: 'Quiz de Química', content: 'Teste seus conhecimentos sobre química!', duration: '10 min' },
      ]
    },
    {
      id: "biology",
      title: "Biologia Brilhante",
      description: "Explore a vida em todas as suas formas",
      progress: 0,
      lessons: 6,
      completedLessons: 0,
      color: "bg-purple-500",
      unlocked: true,
      contents: [
        { type: 'video', title: 'A Vida na Terra', content: 'https://www.youtube.com/embed/QImCld9YubE', duration: '15 min' },
        { type: 'reading', title: 'Células: A Base da Vida', content: 'A Biologia é o estudo da vida e dos seres vivos. A unidade básica de todos os seres vivos é a célula.\n\n**Tipos de células:**\n\n1. **Células Procariontes**: Simples, sem núcleo definido (bactérias)\n2. **Células Eucariontes**: Complexas, com núcleo (animais, plantas, fungos)\n\n**Partes da célula:**\n- **Membrana celular**: Protege a célula\n- **Citoplasma**: Gel onde ficam as organelas\n- **Núcleo**: Contém o DNA\n- **Mitocôndrias**: Produzem energia', duration: '20 min' },
        { type: 'practice', title: 'Observando Células', content: 'Use uma lupa para observar a casca de uma cebola e desenhe o que você vê!', duration: '30 min' },
        { type: 'quiz', title: 'Quiz de Biologia', content: 'Teste seus conhecimentos sobre células!', duration: '10 min' },
      ]
    },
    {
      id: "astronomy",
      title: "Astronomia Admirável",
      description: "Viaje pelas estrelas",
      progress: 0,
      lessons: 8,
      completedLessons: 0,
      color: "bg-indigo-500",
      unlocked: false,
      contents: [
        { type: 'video', title: 'O Sistema Solar', content: 'https://www.youtube.com/embed/libKVRa01L8', duration: '12 min' },
        { type: 'reading', title: 'Planetas e Estrelas', content: 'A Astronomia estuda os corpos celestes: planetas, estrelas, galáxias e todo o universo.\n\n**Nosso Sistema Solar tem 8 planetas:**\n1. Mercúrio - o mais próximo do Sol\n2. Vênus - o mais quente\n3. Terra - nosso lar\n4. Marte - o planeta vermelho\n5. Júpiter - o maior\n6. Saturno - tem anéis\n7. Urano - gira de lado\n8. Netuno - o mais frio', duration: '18 min' },
        { type: 'practice', title: 'Mapa do Céu', content: 'Observe o céu à noite e tente identificar constelações!', duration: '30 min' },
        { type: 'quiz', title: 'Quiz de Astronomia', content: 'Teste seus conhecimentos sobre o espaço!', duration: '10 min' },
      ]
    },
  ],
  technology: [
    {
      id: "programming",
      title: "Programação Poderosa",
      description: "Crie o futuro com código",
      progress: 0,
      lessons: 12,
      completedLessons: 0,
      color: "bg-pink-500",
      unlocked: true,
      contents: [
        { type: 'video', title: 'O que é Programação?', content: 'https://www.youtube.com/embed/Dv7gLpW91DM', duration: '10 min' },
        { type: 'reading', title: 'Algoritmos', content: 'Programação é a arte de dar instruções a um computador. Um **algoritmo** é uma sequência de passos para resolver um problema.\n\n**Exemplo de algoritmo - Fazer um sanduíche:**\n1. Pegar duas fatias de pão\n2. Passar manteiga em uma fatia\n3. Colocar queijo e presunto\n4. Fechar com a outra fatia\n\nOs computadores seguem algoritmos escritos em **linguagens de programação** como Python, JavaScript e Scratch.', duration: '15 min' },
        { type: 'practice', title: 'Primeiro Código', content: 'Acesse scratch.mit.edu e crie uma animação simples!', duration: '30 min' },
        { type: 'quiz', title: 'Quiz de Programação', content: 'Teste seus conhecimentos sobre programação!', duration: '10 min' },
      ]
    },
    {
      id: "web",
      title: "Desenvolvimento Web",
      description: "Construa sites incríveis",
      progress: 0,
      lessons: 10,
      completedLessons: 0,
      color: "bg-cyan-500",
      unlocked: true,
      contents: [
        { type: 'video', title: 'Como a Internet Funciona', content: 'https://www.youtube.com/embed/7_LPdttKXPc', duration: '12 min' },
        { type: 'reading', title: 'HTML Básico', content: 'HTML é a linguagem usada para criar páginas web. HTML significa HyperText Markup Language.\n\n**Tags básicas:**\n- `<html>` - Define o documento HTML\n- `<head>` - Contém metadados\n- `<body>` - Contém o conteúdo visível\n- `<h1>` - Título principal\n- `<p>` - Parágrafo\n- `<img>` - Imagem\n- `<a>` - Link', duration: '20 min' },
        { type: 'practice', title: 'Minha Primeira Página', content: 'Crie uma página HTML simples sobre você!', duration: '30 min' },
        { type: 'quiz', title: 'Quiz de HTML', content: 'Teste seus conhecimentos sobre HTML!', duration: '10 min' },
      ]
    },
    {
      id: "ai",
      title: "Inteligência Artificial",
      description: "Entenda como as máquinas aprendem",
      progress: 0,
      lessons: 8,
      completedLessons: 0,
      color: "bg-purple-500",
      unlocked: false,
      contents: [
        { type: 'video', title: 'O que é IA?', content: 'https://www.youtube.com/embed/2ePf9rue1Ao', duration: '15 min' },
        { type: 'reading', title: 'Machine Learning', content: 'Inteligência Artificial é quando computadores simulam a inteligência humana.\n\n**Tipos de IA:**\n1. **Machine Learning**: A máquina aprende com dados\n2. **Deep Learning**: Redes neurais complexas\n3. **Visão Computacional**: Reconhecer imagens\n4. **Processamento de Linguagem**: Entender texto e fala', duration: '18 min' },
        { type: 'practice', title: 'Treinando uma IA', content: 'Use teachablemachine.withgoogle.com para treinar sua própria IA!', duration: '40 min' },
        { type: 'quiz', title: 'Quiz de IA', content: 'Teste seus conhecimentos sobre IA!', duration: '10 min' },
      ]
    },
  ],
  engineering: [
    {
      id: "mechanics",
      title: "Mecânica Mágica",
      description: "Aprenda sobre máquinas e movimento",
      progress: 0,
      lessons: 10,
      completedLessons: 0,
      color: "bg-orange-500",
      unlocked: true,
      contents: [
        { type: 'video', title: 'Máquinas Simples', content: 'https://www.youtube.com/embed/fvOmaf2GfCY', duration: '12 min' },
        { type: 'reading', title: 'Alavancas e Polias', content: 'A Engenharia Mecânica estuda máquinas e seus movimentos.\n\n**6 Máquinas Simples:**\n1. **Alavanca**: Uma barra que gira em um ponto (gangorra)\n2. **Polia**: Roda com corda para levantar peso\n3. **Roda e Eixo**: Facilita o movimento (porta)\n4. **Plano Inclinado**: Rampa para subir objetos\n5. **Cunha**: Divide materiais (faca)\n6. **Parafuso**: Plano inclinado enrolado', duration: '15 min' },
        { type: 'practice', title: 'Construindo uma Alavanca', content: 'Use uma régua e um lápis para criar uma alavanca!', duration: '25 min' },
        { type: 'quiz', title: 'Quiz de Mecânica', content: 'Teste seus conhecimentos!', duration: '10 min' },
      ]
    },
    {
      id: "robotics",
      title: "Robótica Revolucionária",
      description: "Construa robôs do futuro",
      progress: 0,
      lessons: 10,
      completedLessons: 0,
      color: "bg-red-500",
      unlocked: true,
      contents: [
        { type: 'video', title: 'Introdução à Robótica', content: 'https://www.youtube.com/embed/8wHJjLMnikU', duration: '14 min' },
        { type: 'reading', title: 'Partes de um Robô', content: 'Um robô é uma máquina programável que pode realizar tarefas.\n\n**Componentes principais:**\n- **Sensores**: "olhos e ouvidos" do robô\n- **Atuadores**: motores e servos para movimento\n- **Controlador**: o "cérebro" que processa informações\n- **Fonte de energia**: baterias ou eletricidade\n- **Estrutura**: corpo do robô', duration: '18 min' },
        { type: 'practice', title: 'Robô de Papel', content: 'Construa um modelo de robô usando papelão e materiais recicláveis!', duration: '45 min' },
        { type: 'quiz', title: 'Quiz de Robótica', content: 'Teste seus conhecimentos sobre robôs!', duration: '10 min' },
      ]
    },
    {
      id: "civil",
      title: "Engenharia Civil",
      description: "Projete estruturas incríveis",
      progress: 0,
      lessons: 8,
      completedLessons: 0,
      color: "bg-yellow-500",
      unlocked: false,
      contents: [
        { type: 'video', title: 'Construções Famosas', content: 'https://www.youtube.com/embed/oVW8Nv_s5-4', duration: '15 min' },
        { type: 'reading', title: 'Estruturas e Forças', content: 'Engenharia Civil projeta e constrói estruturas como prédios, pontes e estradas.\n\n**Tipos de estruturas:**\n- **Vigas**: Barras horizontais\n- **Pilares**: Suportes verticais\n- **Arcos**: Distribuem peso para os lados\n- **Treliças**: Triângulos conectados\n\n**Forças nas estruturas:**\n- **Compressão**: Empurra\n- **Tração**: Puxa\n- **Torção**: Gira', duration: '20 min' },
        { type: 'practice', title: 'Ponte de Palitos', content: 'Construa uma ponte usando palitos de sorvete!', duration: '40 min' },
        { type: 'quiz', title: 'Quiz de Engenharia Civil', content: 'Teste seus conhecimentos!', duration: '10 min' },
      ]
    },
  ],
  math: [
    {
      id: "geometry",
      title: "Geometria Genial",
      description: "Explore formas e espaços",
      progress: 0,
      lessons: 10,
      completedLessons: 0,
      color: "bg-blue-500",
      unlocked: true,
      contents: [
        { type: 'video', title: 'Mundo das Formas', content: 'https://www.youtube.com/embed/WsQQvHm4lSw', duration: '10 min' },
        { type: 'reading', title: 'Formas Geométricas', content: 'Geometria é o estudo das formas, tamanhos e posições.\n\n**Formas 2D:**\n- **Círculo**: Todos os pontos à mesma distância do centro\n- **Triângulo**: 3 lados, soma dos ângulos = 180°\n- **Quadrado**: 4 lados iguais, 4 ângulos de 90°\n- **Retângulo**: 4 ângulos de 90°, lados opostos iguais\n\n**Formas 3D:**\n- **Esfera**: Bola\n- **Cubo**: 6 faces quadradas\n- **Pirâmide**: Base com faces triangulares', duration: '15 min' },
        { type: 'practice', title: 'Caça às Formas', content: 'Encontre 10 formas geométricas diferentes na sua casa!', duration: '20 min' },
        { type: 'quiz', title: 'Quiz de Geometria', content: 'Teste seus conhecimentos!', duration: '10 min' },
      ]
    },
    {
      id: "algebra",
      title: "Álgebra Aventureira",
      description: "Desvende os mistérios dos números",
      progress: 0,
      lessons: 12,
      completedLessons: 0,
      color: "bg-purple-500",
      unlocked: true,
      contents: [
        { type: 'video', title: 'Introdução à Álgebra', content: 'https://www.youtube.com/embed/NybHckSEQBI', duration: '12 min' },
        { type: 'reading', title: 'Variáveis e Equações', content: 'Álgebra usa letras para representar números desconhecidos.\n\n**Conceitos básicos:**\n- **Variável**: Letra que representa um número (x, y)\n- **Expressão**: Combinação de números e variáveis (2x + 3)\n- **Equação**: Expressão com sinal de igual (x + 5 = 10)\n\n**Resolvendo equações:**\nPara encontrar x em x + 5 = 10:\n1. Subtraia 5 dos dois lados\n2. x = 10 - 5\n3. x = 5', duration: '18 min' },
        { type: 'practice', title: 'Resolvendo Equações', content: 'Resolva: x + 3 = 7, 2x = 10, x - 4 = 6', duration: '25 min' },
        { type: 'quiz', title: 'Quiz de Álgebra', content: 'Teste seus conhecimentos!', duration: '10 min' },
      ]
    },
    {
      id: "statistics",
      title: "Estatística Surpreendente",
      description: "Analise dados do mundo real",
      progress: 0,
      lessons: 8,
      completedLessons: 0,
      color: "bg-green-500",
      unlocked: false,
      contents: [
        { type: 'video', title: 'O Poder dos Dados', content: 'https://www.youtube.com/embed/xxpc-HPKN28', duration: '11 min' },
        { type: 'reading', title: 'Média, Mediana e Moda', content: 'Estatística ajuda a entender dados e tomar decisões.\n\n**Medidas centrais:**\n- **Média**: Soma dos valores ÷ quantidade\n- **Mediana**: Valor do meio quando ordenados\n- **Moda**: Valor mais frequente\n\n**Exemplo com notas: 7, 8, 8, 9, 10**\n- Média: (7+8+8+9+10)÷5 = 8.4\n- Mediana: 8 (valor do meio)\n- Moda: 8 (aparece 2 vezes)', duration: '15 min' },
        { type: 'practice', title: 'Pesquisa de Opinião', content: 'Faça uma pesquisa com 10 pessoas sobre cor favorita e crie um gráfico!', duration: '30 min' },
        { type: 'quiz', title: 'Quiz de Estatística', content: 'Teste seus conhecimentos!', duration: '10 min' },
      ]
    },
  ],
};

const contentIcons = {
  video: Video,
  reading: FileText,
  practice: Beaker,
  quiz: HelpCircle,
};

export const ScienceModules = ({ onPointsEarned, selectedArea, userName, onModuleComplete }: ScienceModulesProps) => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({});
  const [showCertificate, setShowCertificate] = useState(false);
  const [completedModuleName, setCompletedModuleName] = useState("");

  const modules = modulesByArea[selectedArea] || modulesByArea.science;

  const startModule = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module && module.unlocked) {
      setActiveModule(moduleId);
      setActiveContentIndex(moduleProgress[moduleId] || 0);
      onPointsEarned(20);
    }
  };

  const nextContent = () => {
    const module = modules.find(m => m.id === activeModule);
    if (module) {
      if (activeContentIndex < module.contents.length - 1) {
        setActiveContentIndex(prev => prev + 1);
        setModuleProgress(prev => ({
          ...prev,
          [activeModule!]: activeContentIndex + 1
        }));
        onPointsEarned(30);
      } else {
        // Module completed
        setCompletedModules(prev => new Set([...prev, activeModule!]));
        setCompletedModuleName(module.title);
        onPointsEarned(150);
        onModuleComplete(activeModule!);
        setActiveModule(null);
        setActiveContentIndex(0);
        setShowCertificate(true);
      }
    }
  };

  const currentModule = modules.find(m => m.id === activeModule);
  const currentContent = currentModule?.contents[activeContentIndex];

  const getModuleProgress = (moduleId: string) => {
    if (completedModules.has(moduleId)) return 100;
    const module = modules.find(m => m.id === moduleId);
    if (!module) return 0;
    const progress = moduleProgress[moduleId] || 0;
    return Math.round((progress / module.contents.length) * 100);
  };

  if (activeModule && currentModule && currentContent) {
    const ContentIcon = contentIcons[currentContent.type];
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{currentModule.title}</h2>
            <p className="text-gray-600">Conteúdo {activeContentIndex + 1} de {currentModule.contents.length}</p>
          </div>
          <Button variant="outline" onClick={() => setActiveModule(null)}>
            Voltar aos Módulos
          </Button>
        </div>

        <Progress 
          value={(activeContentIndex / currentModule.contents.length) * 100} 
          className="h-3" 
        />

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-12 h-12 ${currentModule.color} rounded-lg flex items-center justify-center`}>
              <ContentIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{currentContent.title}</h3>
              <p className="text-sm text-gray-500">
                {currentContent.type === 'video' ? '📹 Vídeo' : 
                 currentContent.type === 'reading' ? '📖 Leitura' :
                 currentContent.type === 'practice' ? '🔬 Prática' : '❓ Quiz'} • {currentContent.duration}
              </p>
            </div>
          </div>

          {currentContent.type === 'video' ? (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
              <iframe
                src={currentContent.content}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-6">
              <div className="prose prose-purple max-w-none">
                {currentContent.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-2">{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              onClick={nextContent}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {activeContentIndex < currentModule.contents.length - 1 ? (
                "Próximo Conteúdo"
              ) : (
                <>
                  <Award className="w-4 h-4 mr-2" />
                  Concluir Módulo
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Módulos de Estudo</h2>
        <p className="text-gray-600">Escolha um módulo e comece sua jornada!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className={`p-6 hover:shadow-xl transition-all duration-300 ${module.unlocked ? 'hover:scale-105' : 'opacity-60'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              {!module.unlocked && <Lock className="w-5 h-5 text-gray-400" />}
              {completedModules.has(module.id) && <CheckCircle className="w-5 h-5 text-green-500" />}
            </div>

            <h3 className="text-xl font-semibold mb-2 text-gray-800">{module.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{module.description}</p>

            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{module.contents.length} conteúdos</span>
                <span>{getModuleProgress(module.id)}%</span>
              </div>
              <Progress value={getModuleProgress(module.id)} className="h-2" />
            </div>

            <Button
              onClick={() => startModule(module.id)}
              disabled={!module.unlocked}
              className={`w-full mt-4 ${
                module.unlocked
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  : "bg-gray-300"
              }`}
            >
              {module.unlocked ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {completedModules.has(module.id) ? "Revisar" : 
                   moduleProgress[module.id] ? "Continuar" : "Começar"}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Bloqueado
                </>
              )}
            </Button>
          </Card>
        ))}
      </div>

      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        userName={userName}
        moduleName={completedModuleName}
        completionDate={new Date().toLocaleDateString('pt-BR')}
      />
    </div>
  );
};
