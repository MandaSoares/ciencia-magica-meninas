export interface LessonStep {
  type: 'video' | 'reading' | 'practice' | 'quiz' | 'inspiration';
  title: string;
  content: string;
  videoUrl?: string;
  correctAnswer?: string;
}

export interface PathLevel {
  id: number;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  points: number;
  color: string;
  lessons: LessonStep[];
}

// Trilha unificada - conteúdo introdutório para todas as áreas STEM
export const introductoryPath: PathLevel[] = [
  {
    id: 1,
    title: "Bem-vinda ao STEM!",
    description: "Descubra o mundo da ciência, tecnologia, engenharia e matemática",
    icon: "Star",
    difficulty: "Iniciante",
    points: 30,
    color: "bg-purple-500",
    lessons: [
      {
        type: 'video',
        title: "O que é STEM?",
        content: "STEM significa Ciência, Tecnologia, Engenharia e Matemática. São áreas que trabalham juntas para resolver problemas e criar coisas incríveis!",
        videoUrl: "https://www.youtube.com/embed/rR9VgGcZz8E"
      },
      {
        type: 'reading',
        title: "Por que STEM é importante?",
        content: "🌟 **STEM está em todo lugar!**\n\nQuando você usa o celular, joga um videogame, vai ao médico ou viaja de avião, está usando coisas criadas por pessoas que estudaram STEM.\n\n**Ciência** nos ajuda a entender o mundo\n**Tecnologia** cria ferramentas úteis\n**Engenharia** constrói coisas incríveis\n**Matemática** resolve problemas\n\nJuntas, essas áreas mudam o mundo! 🚀"
      },
      {
        type: 'inspiration',
        title: "Mulheres que mudaram o mundo",
        content: "**Marie Curie** foi a primeira pessoa a ganhar dois Prêmios Nobel! Ela descobriu elementos químicos que salvam vidas até hoje.\n\n**Katherine Johnson** fez os cálculos que levaram o homem à Lua.\n\n**Ada Lovelace** escreveu o primeiro programa de computador da história!\n\nVocê pode ser a próxima! 💜"
      },
      {
        type: 'quiz',
        title: "Quiz Rápido",
        content: "O que significa a letra 'T' em STEM?\n\nA) Trabalho\nB) Tecnologia\nC) Tempo\nD) Terra",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 2,
    title: "Curiosidades Científicas",
    description: "Fatos incríveis sobre o universo",
    icon: "Sparkles",
    difficulty: "Iniciante",
    points: 35,
    color: "bg-blue-500",
    lessons: [
      {
        type: 'reading',
        title: "Você Sabia?",
        content: "🌍 **Curiosidades incríveis da Ciência:**\n\n⭐ O Sol é tão grande que cabem 1.3 milhões de Terras dentro dele!\n\n🦴 Nosso corpo tem 206 ossos, mas bebês nascem com cerca de 300!\n\n💧 70% do nosso corpo é feito de água\n\n🧠 Seu cérebro produz eletricidade suficiente para acender uma lâmpada\n\n🌈 O arco-íris tem mais de 1 milhão de cores, mas só conseguimos ver 7"
      },
      {
        type: 'video',
        title: "Como funciona nosso corpo?",
        content: "Descubra como seu corpo trabalha 24 horas por dia para te manter viva e saudável!",
        videoUrl: "https://www.youtube.com/embed/RI3fOdMM7ck"
      },
      {
        type: 'practice',
        title: "Experimento: Batimentos do Coração",
        content: "🫀 **Vamos contar seus batimentos!**\n\n1. Coloque dois dedos no seu pulso (abaixo do polegar)\n2. Sinta a pulsação\n3. Conte quantas vezes pulsa em 15 segundos\n4. Multiplique por 4\n\n**Resultado:** Esse é seu batimento por minuto!\n\n💡 Normal em repouso: 60-100 batimentos\nAgora pule por 1 minuto e conte de novo. O que mudou?"
      },
      {
        type: 'quiz',
        title: "Teste sua Memória",
        content: "Quantos ossos tem um bebê quando nasce?\n\nA) 100 ossos\nB) 206 ossos\nC) Cerca de 300 ossos\nD) 500 ossos",
        correctAnswer: "C"
      }
    ]
  },
  {
    id: 3,
    title: "Pensamento Lógico",
    description: "Aprenda a resolver problemas como uma cientista",
    icon: "Brain",
    difficulty: "Iniciante",
    points: 40,
    color: "bg-green-500",
    lessons: [
      {
        type: 'reading',
        title: "O que é Lógica?",
        content: "🧩 **Lógica é a arte de pensar direito!**\n\nQuando você resolve um problema passo a passo, está usando lógica.\n\n**Exemplo:**\n- Se chover, eu levo guarda-chuva\n- Está chovendo\n- Então, eu levo guarda-chuva! ☔\n\nCientistas, programadoras e engenheiras usam lógica todos os dias para criar coisas incríveis!"
      },
      {
        type: 'practice',
        title: "Desafio de Sequência",
        content: "🔢 **Complete as sequências:**\n\n1. 2, 4, 6, 8, __?\n2. A, C, E, G, __?\n3. 🌕 🌖 🌗 🌘 __?\n4. 1, 1, 2, 3, 5, __?\n\n💡 **Dica:** Procure o padrão!\n\n**Respostas:** 10, I, 🌑, 8 (sequência de Fibonacci)"
      },
      {
        type: 'video',
        title: "Pensamento Computacional",
        content: "Aprenda a dividir problemas grandes em partes menores!",
        videoUrl: "https://www.youtube.com/embed/KxMSloKEZFQ"
      },
      {
        type: 'quiz',
        title: "Quiz de Lógica",
        content: "Se todos os gatos têm bigodes, e Tom é um gato, então:\n\nA) Tom não tem bigodes\nB) Tom tem bigodes\nC) Tom é um cachorro\nD) Não sabemos",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 4,
    title: "Matemática do Dia a Dia",
    description: "Descubra a matemática escondida ao seu redor",
    icon: "Calculator",
    difficulty: "Iniciante",
    points: 45,
    color: "bg-pink-500",
    lessons: [
      {
        type: 'reading',
        title: "Matemática Está em Tudo!",
        content: "🔢 **Onde você usa matemática sem perceber:**\n\n🎂 Dividir um bolo igualmente\n💰 Contar seu dinheiro\n⏰ Calcular que horas sair de casa\n🎮 Pontuação em jogos\n📏 Medir ingredientes de uma receita\n\nMatemática não é só sobre números - é sobre resolver problemas!"
      },
      {
        type: 'video',
        title: "Padrões na Natureza",
        content: "A natureza usa matemática! Veja como os padrões aparecem em flores, conchas e girassóis.",
        videoUrl: "https://www.youtube.com/embed/kkGeOWYOFoA"
      },
      {
        type: 'practice',
        title: "Caça aos Padrões",
        content: "🔍 **Encontre padrões na sua casa!**\n\n1. Quantos azulejos tem no banheiro? (conte uma fileira e multiplique)\n2. Encontre algo com formato de círculo\n3. Encontre algo com formato de retângulo\n4. Conte quantas janelas tem na sua casa\n\n📝 Anote seus achados!"
      },
      {
        type: 'quiz',
        title: "Desafio Matemático",
        content: "Se você tem 12 balas e quer dividir igualmente entre 4 amigas, quantas cada uma recebe?\n\nA) 2 balas\nB) 3 balas\nC) 4 balas\nD) 6 balas",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 5,
    title: "Tecnologia no Cotidiano",
    description: "Como a tecnologia mudou nossas vidas",
    icon: "Smartphone",
    difficulty: "Iniciante",
    points: 50,
    color: "bg-cyan-500",
    lessons: [
      {
        type: 'reading',
        title: "O que é Tecnologia?",
        content: "📱 **Tecnologia é qualquer ferramenta que resolve problemas!**\n\n**Tecnologias antigas:**\n- Roda 🛞\n- Fogo 🔥\n- Escrita ✍️\n\n**Tecnologias modernas:**\n- Computadores 💻\n- Internet 🌐\n- Smartphones 📱\n\nCada geração cria novas tecnologias. Qual você vai inventar?"
      },
      {
        type: 'video',
        title: "Como funciona a Internet?",
        content: "Descubra como mensagens viajam pelo mundo em segundos!",
        videoUrl: "https://www.youtube.com/embed/7_LPdttKXPc"
      },
      {
        type: 'practice',
        title: "Inventando Soluções",
        content: "💡 **Seja uma inventora!**\n\nPense em um problema do seu dia a dia e invente uma solução tecnológica.\n\n**Exemplo:**\n- Problema: Esqueço de regar as plantas\n- Solução: Vaso com sensor que avisa quando a planta precisa de água\n\n📝 Desenhe sua invenção e explique como funciona!"
      },
      {
        type: 'quiz',
        title: "Quiz Tecnológico",
        content: "Qual dessas é uma tecnologia antiga?\n\nA) Smartphone\nB) Roda\nC) Computador\nD) Videogame",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 6,
    title: "Engenharia para Iniciantes",
    description: "Construa e crie como uma engenheira",
    icon: "Wrench",
    difficulty: "Iniciante",
    points: 55,
    color: "bg-orange-500",
    lessons: [
      {
        type: 'reading',
        title: "O que faz uma Engenheira?",
        content: "🔧 **Engenheiras resolvem problemas construindo coisas!**\n\n**Tipos de Engenharia:**\n\n🏗️ **Civil:** Pontes, prédios, estradas\n✈️ **Aeroespacial:** Aviões, foguetes\n💻 **Computação:** Software, apps\n🔌 **Elétrica:** Circuitos, energia\n🧪 **Química:** Medicamentos, cosméticos\n\nTodas usam criatividade + matemática + ciência!"
      },
      {
        type: 'video',
        title: "Engenheiras Incríveis",
        content: "Conheça mulheres que construíram coisas extraordinárias!",
        videoUrl: "https://www.youtube.com/embed/FEF6PxWOvsk"
      },
      {
        type: 'practice',
        title: "Desafio de Construção",
        content: "🏗️ **Construa uma torre!**\n\n**Materiais:** 20 palitos de dente + 15 jujubas (ou massinha)\n\n**Regras:**\n1. Use só os materiais listados\n2. A torre deve ficar em pé sozinha\n3. Tente fazer a mais alta possível!\n\n**Dica:** Triângulos são formas muito fortes!"
      },
      {
        type: 'quiz',
        title: "Quiz de Engenharia",
        content: "Qual engenheira projeta aviões e foguetes?\n\nA) Engenheira Civil\nB) Engenheira Aeroespacial\nC) Engenheira Química\nD) Engenheira de Alimentos",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 7,
    title: "Experimentos Fáceis",
    description: "Ciência prática com materiais simples",
    icon: "Beaker",
    difficulty: "Intermediário",
    points: 60,
    color: "bg-yellow-500",
    lessons: [
      {
        type: 'reading',
        title: "O Método Científico",
        content: "🔬 **Como cientistas descobrem coisas:**\n\n1. **Observar:** Ver algo interessante\n2. **Perguntar:** Por que isso acontece?\n3. **Hipótese:** Criar uma explicação\n4. **Testar:** Fazer um experimento\n5. **Analisar:** Ver os resultados\n6. **Concluir:** O que aprendemos?\n\nVamos praticar isso!"
      },
      {
        type: 'practice',
        title: "Experimento: Vulcão de Vinagre",
        content: "🌋 **Crie sua própria erupção!**\n\n**Materiais:**\n- 1 copo\n- 3 colheres de bicarbonato de sódio\n- Vinagre\n- Corante alimentício (opcional)\n\n**Passos:**\n1. Coloque o bicarbonato no copo\n2. Adicione algumas gotas de corante\n3. Despeje vinagre devagar\n4. Observe a reação!\n\n**O que acontece?** O ácido (vinagre) reage com a base (bicarbonato) criando gás carbônico - as bolhas!"
      },
      {
        type: 'video',
        title: "Mais Experimentos Legais",
        content: "Veja mais experimentos que você pode fazer em casa!",
        videoUrl: "https://www.youtube.com/embed/RSgCMx-QTVo"
      },
      {
        type: 'quiz',
        title: "Quiz Científico",
        content: "O que é uma hipótese?\n\nA) O resultado final do experimento\nB) Uma explicação que você vai testar\nC) Os materiais que você usa\nD) Uma pergunta sem resposta",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 8,
    title: "Introdução à Programação",
    description: "Aprenda a falar com computadores",
    icon: "Code",
    difficulty: "Intermediário",
    points: 65,
    color: "bg-indigo-500",
    lessons: [
      {
        type: 'reading',
        title: "O que é Programar?",
        content: "💻 **Programar é dar instruções para o computador!**\n\nComputadores são muito bons em seguir ordens, mas precisam de instruções MUITO detalhadas.\n\n**Exemplo - Fazer um sanduíche:**\n\nPara você: \"Faça um sanduíche\"\nPara computador:\n1. Pegue o pão\n2. Abra o saco\n3. Retire duas fatias\n4. Coloque na mesa\n5. Pegue a manteiga...\n\nProgramadoras escrevem essas instruções em linguagens especiais!"
      },
      {
        type: 'video',
        title: "Programação para Iniciantes",
        content: "Veja como é divertido programar!",
        videoUrl: "https://www.youtube.com/embed/Dv7gLpW91DM"
      },
      {
        type: 'practice',
        title: "Programando uma Amiga",
        content: "🤖 **Seja a programadora!**\n\nPeça para uma amiga ou familiar ser o 'robô'. Dê instruções detalhadas para:\n\n1. Ir da cama até a geladeira\n2. Pegar um copo de água\n3. Trazer para você\n\n**Regras do robô:**\n- Só faz EXATAMENTE o que você manda\n- Se você dizer 'ande', ele anda até bater na parede!\n\nIsso é programação! 🎮"
      },
      {
        type: 'quiz',
        title: "Quiz de Programação",
        content: "Por que computadores precisam de instruções muito detalhadas?\n\nA) Eles são preguiçosos\nB) Eles não pensam sozinhos\nC) Eles são muito inteligentes\nD) Eles não gostam de trabalhar",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 9,
    title: "Mulheres na Ciência",
    description: "Histórias inspiradoras de pioneiras",
    icon: "Heart",
    difficulty: "Intermediário",
    points: 70,
    color: "bg-rose-500",
    lessons: [
      {
        type: 'inspiration',
        title: "Marie Curie - A Rainha da Radioatividade",
        content: "👩‍🔬 **Marie Curie (1867-1934)**\n\nMarie nasceu na Polônia e mudou o mundo da ciência!\n\n🏆 Primeira mulher a ganhar o Nobel\n🏆 Única pessoa a ganhar Nobel em duas áreas diferentes (Física e Química)\n💡 Descobriu dois elementos: Polônio e Rádio\n🏥 Criou ambulâncias de raio-X na guerra\n\n*\"Nada na vida deve ser temido, apenas compreendido.\"*"
      },
      {
        type: 'inspiration',
        title: "Katherine Johnson - A Calculadora Humana",
        content: "🚀 **Katherine Johnson (1918-2020)**\n\nKatherine fez os cálculos que levaram os americanos à Lua!\n\n🧮 Calculou trajetórias de naves espaciais\n🌙 Fundamental para a missão Apollo 11\n🎬 Sua história virou o filme 'Estrelas Além do Tempo'\n\n*\"Meninas são capazes de fazer tudo que os meninos fazem. Às vezes, até melhor.\"*"
      },
      {
        type: 'video',
        title: "Mulheres que Mudaram a Tecnologia",
        content: "Conheça outras mulheres incríveis da história da ciência!",
        videoUrl: "https://www.youtube.com/embed/nN3bBvKJPzM"
      },
      {
        type: 'quiz',
        title: "Quiz das Pioneiras",
        content: "Qual cientista ganhou dois Prêmios Nobel?\n\nA) Katherine Johnson\nB) Marie Curie\nC) Ada Lovelace\nD) Rosalind Franklin",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 10,
    title: "Desafios STEM",
    description: "Teste tudo que aprendeu!",
    icon: "Trophy",
    difficulty: "Intermediário",
    points: 80,
    color: "bg-amber-500",
    lessons: [
      {
        type: 'reading',
        title: "Revisão STEM",
        content: "🎓 **O que você aprendeu:**\n\n✅ O que é STEM e por que é importante\n✅ Curiosidades científicas incríveis\n✅ Pensamento lógico e resolução de problemas\n✅ Matemática no dia a dia\n✅ Como a tecnologia funciona\n✅ O que engenheiras fazem\n✅ Método científico e experimentos\n✅ Básico de programação\n✅ Mulheres inspiradoras na ciência\n\nAgora vamos testar tudo! 🚀"
      },
      {
        type: 'quiz',
        title: "Desafio 1: Ciência",
        content: "Qual é a primeira etapa do método científico?\n\nA) Experimentar\nB) Concluir\nC) Observar\nD) Hipótese",
        correctAnswer: "C"
      },
      {
        type: 'quiz',
        title: "Desafio 2: Tecnologia",
        content: "O que uma programadora faz?\n\nA) Constrói computadores\nB) Escreve instruções para computadores\nC) Conserta celulares\nD) Desenha sites",
        correctAnswer: "B"
      },
      {
        type: 'quiz',
        title: "Desafio 3: Engenharia",
        content: "Qual forma é mais resistente para construções?\n\nA) Círculo\nB) Quadrado\nC) Triângulo\nD) Retângulo",
        correctAnswer: "C"
      }
    ]
  },
  {
    id: 11,
    title: "Robótica Básica",
    description: "Como robôs funcionam",
    icon: "Bot",
    difficulty: "Intermediário",
    points: 85,
    color: "bg-slate-500",
    lessons: [
      {
        type: 'reading',
        title: "O que são Robôs?",
        content: "🤖 **Robôs são máquinas que podem trabalhar sozinhas!**\n\n**Partes de um robô:**\n- 🧠 Controlador: o 'cérebro'\n- 👀 Sensores: para 'ver' e 'sentir'\n- 💪 Atuadores: motores para mover\n- 🔋 Energia: bateria ou eletricidade\n\n**Onde encontramos robôs:**\n- Fábricas de carros\n- Hospitais (cirurgia)\n- Aspiradores de pó\n- Espaço (rovers em Marte!)"
      },
      {
        type: 'video',
        title: "Robôs no Mundo Real",
        content: "Veja robôs incríveis que existem hoje!",
        videoUrl: "https://www.youtube.com/embed/8wHJjLMnikU"
      },
      {
        type: 'practice',
        title: "Desenhe seu Robô",
        content: "🎨 **Projete seu próprio robô!**\n\n1. Decida qual problema seu robô vai resolver\n2. Desenhe o robô e suas partes\n3. Marque onde ficam:\n   - Os sensores (olhos, ouvidos)\n   - Os motores (braços, rodas)\n   - O cérebro (controlador)\n   - A bateria\n\n4. Dê um nome para seu robô!\n\nCompartilhe sua criação! 🌟"
      },
      {
        type: 'quiz',
        title: "Quiz de Robótica",
        content: "O que são os 'sensores' de um robô?\n\nA) A bateria\nB) Os motores\nC) Partes que detectam o ambiente\nD) O corpo do robô",
        correctAnswer: "C"
      }
    ]
  },
  {
    id: 12,
    title: "Matemática Criativa",
    description: "Formas, padrões e arte matemática",
    icon: "Shapes",
    difficulty: "Intermediário",
    points: 90,
    color: "bg-fuchsia-500",
    lessons: [
      {
        type: 'reading',
        title: "Arte e Matemática",
        content: "🎨 **Matemática é linda!**\n\n**Padrões matemáticos na arte:**\n\n🌀 **Espiral de Fibonacci:** Aparece em conchas, girassóis e galáxias\n\n📐 **Proporção Áurea:** Usada por artistas para criar beleza perfeita\n\n🔷 **Simetria:** Quando os dois lados são iguais\n\n🎭 **Fractais:** Padrões que se repetem infinitamente\n\nArtistas famosos como Da Vinci usavam matemática em suas obras!"
      },
      {
        type: 'video',
        title: "Matemática na Natureza",
        content: "Veja como a matemática aparece em flores, animais e estrelas!",
        videoUrl: "https://www.youtube.com/embed/kkGeOWYOFoA"
      },
      {
        type: 'practice',
        title: "Crie Arte Geométrica",
        content: "✏️ **Faça sua arte matemática!**\n\n**Mandala Simples:**\n1. Desenhe um círculo grande\n2. Divida em 8 partes iguais\n3. Desenhe o mesmo padrão em cada parte\n4. Decore com cores\n\n**Dica:** Use compasso ou trace um prato!\n\nSua mandala terá simetria perfeita! 🌸"
      },
      {
        type: 'quiz',
        title: "Quiz Criativo",
        content: "O que é simetria?\n\nA) Quando algo é colorido\nB) Quando os dois lados são iguais\nC) Quando algo é grande\nD) Quando algo é redondo",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 13,
    title: "Meio Ambiente e Sustentabilidade",
    description: "Ciência para salvar o planeta",
    icon: "Leaf",
    difficulty: "Avançado",
    points: 95,
    color: "bg-emerald-500",
    lessons: [
      {
        type: 'reading',
        title: "Nosso Planeta Precisa de Ajuda",
        content: "🌍 **Problemas ambientais:**\n\n🔥 Aquecimento global: a Terra está esquentando\n🗑️ Poluição: ar, água e solo contaminados\n🌳 Desmatamento: florestas sendo destruídas\n🐋 Extinção: animais desaparecendo\n\n**Como STEM pode ajudar:**\n- 🔬 Cientistas estudam os problemas\n- 💡 Engenheiras criam soluções\n- 💻 Tecnologia monitora o planeta\n- 📊 Matemática analisa dados"
      },
      {
        type: 'video',
        title: "Energia Limpa",
        content: "Conheça tecnologias que não poluem o planeta!",
        videoUrl: "https://www.youtube.com/embed/RnvCbquYeIM"
      },
      {
        type: 'practice',
        title: "Projeto Sustentável",
        content: "♻️ **Seja uma eco-cientista!**\n\n**Desafio de uma semana:**\n\n1. Segunda: Separe o lixo reciclável\n2. Terça: Economize água no banho\n3. Quarta: Apague luzes que não usa\n4. Quinta: Use sacola reutilizável\n5. Sexta: Evite desperdício de comida\n\n📊 Anote o que conseguiu fazer!\nCalcule: quantas garrafas você reciclou?"
      },
      {
        type: 'quiz',
        title: "Quiz Ambiental",
        content: "O que é energia renovável?\n\nA) Energia que acaba\nB) Energia do petróleo\nC) Energia que não acaba (sol, vento)\nD) Energia cara",
        correctAnswer: "C"
      }
    ]
  },
  {
    id: 14,
    title: "Saúde e Medicina",
    description: "Como a ciência cuida de nós",
    icon: "Heart",
    difficulty: "Avançado",
    points: 100,
    color: "bg-red-500",
    lessons: [
      {
        type: 'reading',
        title: "Ciência da Saúde",
        content: "🏥 **Como a medicina funciona:**\n\n**Profissionais de saúde:**\n👩‍⚕️ Médicas diagnosticam doenças\n💉 Enfermeiras cuidam dos pacientes\n🔬 Cientistas criam vacinas e remédios\n🧬 Geneticistas estudam o DNA\n\n**Descobertas que salvam vidas:**\n- Antibióticos (contra bactérias)\n- Vacinas (previnem doenças)\n- Raio-X (ver dentro do corpo)\n- Cirurgias (corrigir problemas)"
      },
      {
        type: 'video',
        title: "Como as Vacinas Funcionam",
        content: "Entenda como vacinas protegem nosso corpo!",
        videoUrl: "https://www.youtube.com/embed/rb7TVW77ZCs"
      },
      {
        type: 'practice',
        title: "Diário de Saúde",
        content: "📋 **Monitore sua saúde por uma semana!**\n\nAnote todos os dias:\n- ⏰ Horas de sono\n- 🥗 O que comeu (saudável ou não)\n- 🏃 Exercícios que fez\n- 💧 Copos de água\n- 😊 Como se sentiu\n\nNo final, analise:\n- Dormiu bem? (8-10 horas é ideal)\n- Comeu frutas e verduras?\n- Se movimentou?"
      },
      {
        type: 'quiz',
        title: "Quiz de Saúde",
        content: "O que as vacinas fazem?\n\nA) Curam doenças que já temos\nB) Ensinam nosso corpo a se defender\nC) Dão energia\nD) Fazem crescer",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 15,
    title: "Exploração Espacial",
    description: "Viaje além das estrelas",
    icon: "Rocket",
    difficulty: "Avançado",
    points: 110,
    color: "bg-violet-500",
    lessons: [
      {
        type: 'reading',
        title: "Além da Terra",
        content: "🚀 **Explorando o Universo:**\n\n**Conquistas espaciais:**\n- 1969: Primeiro humano na Lua 🌙\n- 1990: Telescópio Hubble 🔭\n- 2020: Perseverance em Marte 🔴\n\n**Brasileiras no espaço:**\n🇧🇷 Primeira astronauta brasileira está sendo treinada!\n\n**Futuro:**\n- Colonizar Marte\n- Turismo espacial\n- Encontrar vida extraterrestre?"
      },
      {
        type: 'video',
        title: "O Sistema Solar",
        content: "Conheça os planetas vizinhos da Terra!",
        videoUrl: "https://www.youtube.com/embed/libKVRa01L8"
      },
      {
        type: 'practice',
        title: "Projeto: Foguete de Garrafa",
        content: "🚀 **Construa um foguete simples!**\n\n**Materiais:**\n- Garrafa PET vazia\n- Papelão para as asas\n- Fita adesiva\n- Decoração\n\n**Montagem:**\n1. Corte 3-4 triângulos de papelão (asas)\n2. Cole na base da garrafa\n3. Faça um cone de papel para o topo\n4. Decore como quiser!\n\n(Este é só um modelo - não voa de verdade!)"
      },
      {
        type: 'quiz',
        title: "Quiz Espacial",
        content: "Em que ano o primeiro humano pisou na Lua?\n\nA) 1959\nB) 1969\nC) 1979\nD) 1989",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 16,
    title: "Mestra STEM",
    description: "Você completou a trilha introdutória!",
    icon: "Crown",
    difficulty: "Avançado",
    points: 150,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    lessons: [
      {
        type: 'reading',
        title: "Parabéns! 🎉",
        content: "🏆 **VOCÊ É INCRÍVEL!**\n\nVocê completou toda a trilha introdutória de STEM!\n\n**O que você conquistou:**\n✅ Entendeu o que é STEM\n✅ Aprendeu sobre ciência, tecnologia, engenharia e matemática\n✅ Conheceu mulheres inspiradoras\n✅ Fez experimentos\n✅ Desenvolveu pensamento lógico\n✅ Explorou o universo\n\n**Próximo passo:** Escolha um Módulo para se aprofundar!\n\nO futuro precisa de meninas como você! 💜🚀"
      },
      {
        type: 'inspiration',
        title: "Seu Futuro em STEM",
        content: "🌟 **Você pode ser:**\n\n👩‍🔬 Cientista descobrindo curas\n👩‍💻 Programadora criando apps\n👩‍🚀 Astronauta explorando o espaço\n👩‍🔧 Engenheira construindo cidades\n👩‍🏫 Professora inspirando outras meninas\n\n**Lembre-se:**\n*\"O futuro pertence àqueles que acreditam na beleza de seus sonhos.\"*\n- Eleanor Roosevelt\n\nSonhe grande! 🌈"
      },
      {
        type: 'practice',
        title: "Carta para Você Mesma",
        content: "✉️ **Escreva uma carta para você do futuro!**\n\nDaqui a 10 anos, o que você quer ter conquistado?\n\n1. Qual área de STEM mais te interessou?\n2. O que você quer estudar?\n3. Que problema do mundo você quer resolver?\n4. Quem você quer inspirar?\n\nGuarde esta carta e leia novamente no futuro! 💜"
      },
      {
        type: 'quiz',
        title: "Reflexão Final",
        content: "O que STEM pode fazer pelo mundo?\n\nA) Só ganhar dinheiro\nB) Resolver problemas e melhorar vidas\nC) Nada importante\nD) Só criar tecnologia",
        correctAnswer: "B"
      }
    ]
  }
];

// Exportar por área para compatibilidade
export const sciencePathLevels = introductoryPath;
export const technologyPathLevels = introductoryPath;
export const engineeringPathLevels = introductoryPath;
export const mathPathLevels = introductoryPath;
