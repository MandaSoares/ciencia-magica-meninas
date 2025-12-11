import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Star, Award, Briefcase } from "lucide-react";

interface Career {
  name: string;
  description: string;
  women: WomanProfile[];
}

interface WomanProfile {
  name: string;
  achievement: string;
  story: string;
  image: string;
}

interface AreaData {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  careers: Career[];
}

const areasData: AreaData[] = [
  {
    id: "ciencia",
    name: "Ciências",
    icon: "🔬",
    color: "bg-green-500",
    description: "Explore o mundo através da pesquisa e descoberta",
    careers: [
      {
        name: "Biologia",
        description: "Estudo da vida e dos seres vivos",
        women: [
          {
            name: "Rosalind Franklin",
            achievement: "Descobriu a estrutura do DNA",
            story: "Rosalind Franklin foi uma biofísica britânica que fez contribuições cruciais para a compreensão da estrutura do DNA. Seu trabalho com difração de raios-X produziu a famosa 'Foto 51', que foi fundamental para descobrir a estrutura de dupla hélice do DNA. Infelizmente, ela não recebeu o devido crédito em vida, mas hoje é reconhecida como uma das cientistas mais importantes da história.",
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300"
          },
          {
            name: "Graziela Maciel Barroso",
            achievement: "Maior botânica brasileira",
            story: "Graziela Maciel Barroso foi a maior botânica do Brasil, tendo descrito mais de 30 espécies de plantas. Autodidata, começou como auxiliar de herbário e se tornou referência mundial em taxonomia de plantas. Sua dedicação à ciência brasileira a tornou um símbolo de perseverança e excelência.",
            image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300"
          }
        ]
      },
      {
        name: "Química",
        description: "Estudo da matéria e suas transformações",
        women: [
          {
            name: "Marie Curie",
            achievement: "Primeira mulher a ganhar dois Prêmios Nobel",
            story: "Marie Curie foi uma cientista polonesa-francesa que conduziu pesquisas pioneiras sobre radioatividade. Ela foi a primeira mulher a ganhar um Prêmio Nobel, a primeira pessoa a ganhá-lo duas vezes e a única a ganhar em duas ciências diferentes (Física e Química). Descobriu os elementos polônio e rádio.",
            image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300"
          }
        ]
      },
      {
        name: "Física",
        description: "Estudo das leis do universo",
        women: [
          {
            name: "Chien-Shiung Wu",
            achievement: "Derrubou a lei da conservação da paridade",
            story: "Chien-Shiung Wu foi uma física sino-americana que fez contribuições significativas para a física nuclear. Seu experimento de Wu provou que a paridade não é conservada em interações fracas, derrubando uma lei fundamental da física. Apesar disso, foram seus colegas homens que receberam o Nobel pela teoria.",
            image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=300"
          }
        ]
      }
    ]
  },
  {
    id: "tecnologia",
    name: "Tecnologia",
    icon: "💻",
    color: "bg-blue-500",
    description: "Crie o futuro com código e inovação",
    careers: [
      {
        name: "Desenvolvimento de Software",
        description: "Criação de programas e aplicativos",
        women: [
          {
            name: "Grace Hopper",
            achievement: "Inventou o primeiro compilador",
            story: "Grace Hopper foi uma pioneira da computação que inventou o primeiro compilador para linguagem de programação. Ela popularizou a ideia de linguagens de programação independentes de máquina, o que levou ao desenvolvimento do COBOL. Também é creditada por popularizar o termo 'bug' para erros de computador.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300"
          },
          {
            name: "Margaret Hamilton",
            achievement: "Escreveu o código que levou o homem à Lua",
            story: "Margaret Hamilton liderou a equipe que desenvolveu o software de voo para as missões Apollo da NASA. Seu código à prova de erros salvou a missão Apollo 11 de ser abortada, permitindo que Neil Armstrong pisasse na Lua. Ela também cunhou o termo 'engenharia de software'.",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300"
          }
        ]
      },
      {
        name: "Inteligência Artificial",
        description: "Máquinas que aprendem e pensam",
        women: [
          {
            name: "Fei-Fei Li",
            achievement: "Criadora do ImageNet",
            story: "Fei-Fei Li é uma cientista da computação sino-americana, conhecida por seu trabalho em IA e visão computacional. Ela criou o ImageNet, um banco de dados massivo de imagens que revolucionou o campo de aprendizado profundo. Defende uma IA mais humana e ética.",
            image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300"
          }
        ]
      },
      {
        name: "Segurança da Informação",
        description: "Proteção de dados e sistemas",
        women: [
          {
            name: "Parisa Tabriz",
            achievement: "Chefe de segurança do Google Chrome",
            story: "Parisa Tabriz é engenheira de segurança no Google, onde lidera a equipe de segurança do Chrome. Ela se autodenomina 'Princesa de Segurança' e é conhecida por encontrar e corrigir vulnerabilidades que protegem bilhões de usuários. Inspira meninas a seguirem carreira em cibersegurança.",
            image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300"
          }
        ]
      }
    ]
  },
  {
    id: "engenharia",
    name: "Engenharia",
    icon: "⚙️",
    color: "bg-orange-500",
    description: "Construa soluções para problemas do mundo real",
    careers: [
      {
        name: "Engenharia Civil",
        description: "Construção de estruturas e infraestrutura",
        women: [
          {
            name: "Emily Warren Roebling",
            achievement: "Completou a construção da Ponte do Brooklyn",
            story: "Emily Warren Roebling supervisionou a construção da Ponte do Brooklyn após seu marido ficar doente. Ela estudou engenharia de forma autodidata e gerenciou o projeto por 11 anos, tornando-se a primeira mulher a atravessar a ponte quando foi inaugurada em 1883.",
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300"
          }
        ]
      },
      {
        name: "Engenharia Aeroespacial",
        description: "Aviões, foguetes e exploração espacial",
        women: [
          {
            name: "Katherine Johnson",
            achievement: "Calculou trajetórias que levaram o homem à Lua",
            story: "Katherine Johnson foi uma matemática afro-americana cujos cálculos foram cruciais para o sucesso dos primeiros voos espaciais tripulados dos EUA. Ela calculou as trajetórias do primeiro voo suborbital americano e da Apollo 11. Sua história foi contada no filme 'Estrelas Além do Tempo'.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300"
          }
        ]
      },
      {
        name: "Engenharia Elétrica",
        description: "Circuitos, energia e eletrônica",
        women: [
          {
            name: "Edith Clarke",
            achievement: "Primeira engenheira elétrica profissional dos EUA",
            story: "Edith Clarke foi a primeira mulher a receber um diploma de engenharia elétrica do MIT e a primeira professora de engenharia elétrica nos EUA. Ela inventou a calculadora Clarke, que simplificava cálculos de linhas de transmissão elétrica.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300"
          }
        ]
      }
    ]
  },
  {
    id: "matematica",
    name: "Matemática",
    icon: "📐",
    color: "bg-purple-500",
    description: "A linguagem universal do universo",
    careers: [
      {
        name: "Matemática Pura",
        description: "Teoria e descoberta de novos conceitos",
        women: [
          {
            name: "Emmy Noether",
            achievement: "Considerada a mãe da álgebra moderna",
            story: "Emmy Noether foi uma matemática alemã conhecida por suas contribuições inovadoras à álgebra abstrata. Einstein a descreveu como 'o gênio matemático criativo mais significativo desde que a educação superior foi aberta às mulheres'. O Teorema de Noether é fundamental na física teórica.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300"
          }
        ]
      },
      {
        name: "Estatística",
        description: "Análise de dados e probabilidades",
        women: [
          {
            name: "Florence Nightingale",
            achievement: "Pioneira no uso de estatística para saúde pública",
            story: "Florence Nightingale foi não apenas a fundadora da enfermagem moderna, mas também uma estatística pioneira. Ela usou gráficos inovadores para mostrar as causas de morte de soldados britânicos, provando que higiene salva vidas. Suas visualizações de dados ainda são estudadas hoje.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300"
          }
        ]
      },
      {
        name: "Matemática Aplicada",
        description: "Soluções matemáticas para problemas reais",
        women: [
          {
            name: "Maryam Mirzakhani",
            achievement: "Primeira mulher a ganhar a Medalha Fields",
            story: "Maryam Mirzakhani foi uma matemática iraniana que se tornou a primeira mulher a ganhar a Medalha Fields, o 'Nobel da Matemática'. Ela fez descobertas importantes sobre superfícies geométricas. Faleceu jovem, mas seu legado inspira mulheres em todo o mundo a seguirem a matemática.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300"
          }
        ]
      }
    ]
  }
];

interface AreasDeAtuacaoProps {
  onPointsEarned: (points: number) => void;
}

export const AreasDeAtuacao = ({ onPointsEarned }: AreasDeAtuacaoProps) => {
  const [selectedArea, setSelectedArea] = useState<AreaData | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedWoman, setSelectedWoman] = useState<WomanProfile | null>(null);

  const handleSelectArea = (area: AreaData) => {
    setSelectedArea(area);
    setSelectedCareer(null);
    setSelectedWoman(null);
    onPointsEarned(10);
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
    } else if (selectedArea) {
      setSelectedArea(null);
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
          Voltar para {selectedArea?.name}
        </Button>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedCareer.name}</h2>
          <p className="text-gray-600 mb-4">{selectedCareer.description}</p>
        </div>

        <h3 className="text-xl font-semibold text-gray-800">Mulheres Inspiradoras</h3>

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

  // Vista das carreiras em uma área
  if (selectedArea) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" onClick={goBack} className="mb-4">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar para Áreas de Atuação
        </Button>

        <div className={`${selectedArea.color} text-white p-6 rounded-xl`}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{selectedArea.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{selectedArea.name}</h2>
              <p className="opacity-90">{selectedArea.description}</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800">Carreiras em {selectedArea.name}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedArea.careers.map((career, index) => (
            <Card 
              key={index}
              className="p-5 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              onClick={() => handleSelectCareer(career)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${selectedArea.color} rounded-lg flex items-center justify-center`}>
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-gray-800">{career.name}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">{career.description}</p>
              <p className="text-xs text-purple-600 font-medium">
                {career.women.length} {career.women.length === 1 ? 'mulher inspiradora' : 'mulheres inspiradoras'}
              </p>
              <ChevronRight className="w-5 h-5 text-gray-400 mt-2 ml-auto" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Vista principal - todas as áreas
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Áreas de Atuação</h2>
        <p className="text-gray-600">Explore carreiras em STEM e conheça mulheres que fizeram história!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {areasData.map((area) => (
          <Card 
            key={area.id}
            className="overflow-hidden hover:shadow-xl transition-all cursor-pointer hover:scale-105"
            onClick={() => handleSelectArea(area)}
          >
            <div className={`${area.color} p-6 text-white`}>
              <div className="flex items-center gap-3">
                <span className="text-5xl">{area.icon}</span>
                <div>
                  <h3 className="text-xl font-bold">{area.name}</h3>
                  <p className="text-sm opacity-90">{area.description}</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-2">
                {area.careers.length} carreiras disponíveis
              </p>
              <div className="flex flex-wrap gap-2">
                {area.careers.slice(0, 3).map((career, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700"
                  >
                    {career.name}
                  </span>
                ))}
              </div>
              <Button variant="link" className="mt-3 p-0 text-purple-600">
                Explorar carreiras
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 Você Sabia?</h3>
        <p className="text-gray-700">
          Meninas em STEM estão mudando o mundo! Cada área oferece oportunidades incríveis 
          para fazer a diferença. Explore, descubra e inspire-se!
        </p>
      </Card>
    </div>
  );
};
