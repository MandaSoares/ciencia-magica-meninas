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

// Área para nome legível
const areaNames: Record<string, string> = {
  science: "Ciência",
  technology: "Tecnologia",
  engineering: "Engenharia",
  math: "Matemática"
};

export const getAreaName = (area: string): string => {
  return areaNames[area] || "STEM";
};

// Trilha específica para Ciência
export const sciencePath: PathLevel[] = [
  {
    id: 1,
    title: "Bem-vinda à Ciência!",
    description: "Descubra os segredos do mundo natural",
    icon: "Star",
    difficulty: "Iniciante",
    points: 30,
    color: "bg-green-500",
    lessons: [
      {
        type: 'video',
        title: "O que é Ciência?",
        content: "Ciência é a arte de fazer perguntas e descobrir respostas sobre o mundo ao nosso redor!",
        videoUrl: "https://www.youtube.com/embed/RI3fOdMM7ck"
      },
      {
        type: 'reading',
        title: "O Método Científico",
        content: "🔬 **Como cientistas descobrem coisas:**\n\n1. **Observar:** Ver algo interessante\n2. **Perguntar:** Por que isso acontece?\n3. **Hipótese:** Criar uma explicação\n4. **Testar:** Fazer um experimento\n5. **Analisar:** Ver os resultados\n6. **Concluir:** O que aprendemos?\n\nTodo conhecimento científico começa com curiosidade!"
      },
      {
        type: 'inspiration',
        title: "Mulheres que revolucionaram a Ciência",
        content: "**Marie Curie** foi a primeira pessoa a ganhar dois Prêmios Nobel! Ela descobriu elementos químicos que salvam vidas até hoje.\n\n**Rosalind Franklin** descobriu a estrutura do DNA.\n\n**Jane Goodall** revolucionou nossa compreensão sobre chimpanzés.\n\nVocê pode ser a próxima! 💜"
      },
      {
        type: 'quiz',
        title: "Quiz Rápido",
        content: "Qual é a primeira etapa do método científico?\n\nA) Hipótese\nB) Observação\nC) Experimentação\nD) Conclusão",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 2,
    title: "O Corpo Humano",
    description: "Como funciona a máquina mais incrível: você!",
    icon: "Heart",
    difficulty: "Iniciante",
    points: 35,
    color: "bg-red-500",
    lessons: [
      {
        type: 'reading',
        title: "Curiosidades sobre o Corpo",
        content: "🦴 **Fatos incríveis sobre seu corpo:**\n\n⭐ Nosso corpo tem 206 ossos, mas bebês nascem com cerca de 300!\n\n💧 70% do nosso corpo é feito de água\n\n🧠 Seu cérebro produz eletricidade suficiente para acender uma lâmpada\n\n❤️ Seu coração bate cerca de 100.000 vezes por dia\n\n👁️ Seus olhos podem distinguir cerca de 10 milhões de cores"
      },
      {
        type: 'video',
        title: "Como funciona nosso corpo?",
        content: "Descubra como seu corpo trabalha 24 horas por dia!",
        videoUrl: "https://www.youtube.com/embed/RI3fOdMM7ck"
      },
      {
        type: 'practice',
        title: "Experimento: Batimentos do Coração",
        content: "🫀 **Vamos contar seus batimentos!**\n\n1. Coloque dois dedos no seu pulso (abaixo do polegar)\n2. Sinta a pulsação\n3. Conte quantas vezes pulsa em 15 segundos\n4. Multiplique por 4\n\n**Resultado:** Esse é seu batimento por minuto!\n\n💡 Normal em repouso: 60-100 batimentos\nAgora pule por 1 minuto e conte de novo. O que mudou?"
      },
      {
        type: 'quiz',
        title: "Quiz do Corpo Humano",
        content: "Quantos ossos tem um bebê quando nasce?\n\nA) 100 ossos\nB) 206 ossos\nC) Cerca de 300 ossos\nD) 500 ossos",
        correctAnswer: "C"
      }
    ]
  },
  {
    id: 3,
    title: "Química do Cotidiano",
    description: "Descubra as reações químicas ao seu redor",
    icon: "Beaker",
    difficulty: "Iniciante",
    points: 40,
    color: "bg-purple-500",
    lessons: [
      {
        type: 'reading',
        title: "O que é Química?",
        content: "🧪 **Química é o estudo da matéria e suas transformações!**\n\nTudo ao seu redor é feito de átomos - as menores partículas!\n\n**Química no dia a dia:**\n- 🍳 Cozinhar é química\n- 🧼 Sabão limpando é química\n- 🔥 Fogo é uma reação química\n- 🌱 Fotossíntese das plantas\n\nReações químicas acontecem quando substâncias se transformam em outras!"
      },
      {
        type: 'video',
        title: "Reações Químicas Incríveis",
        content: "Veja experimentos químicos impressionantes e seguros!",
        videoUrl: "https://www.youtube.com/embed/RSgCMx-QTVo"
      },
      {
        type: 'practice',
        title: "Experimento: Vulcão de Vinagre",
        content: "🌋 **Crie sua própria erupção!**\n\n**Materiais:**\n- 1 copo\n- 3 colheres de bicarbonato de sódio\n- Vinagre\n- Corante alimentício (opcional)\n\n**Passos:**\n1. Coloque o bicarbonato no copo\n2. Adicione algumas gotas de corante\n3. Despeje vinagre devagar\n4. Observe a reação!\n\n**O que acontece?** O ácido (vinagre) reage com a base (bicarbonato) criando gás carbônico - as bolhas!"
      },
      {
        type: 'quiz',
        title: "Quiz de Química",
        content: "O que são átomos?\n\nA) Tipos de células\nB) As menores partículas da matéria\nC) Tipos de energia\nD) Moléculas grandes",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 4,
    title: "Física Divertida",
    description: "Entenda as leis que governam o universo",
    icon: "Sparkles",
    difficulty: "Intermediário",
    points: 45,
    color: "bg-blue-500",
    lessons: [
      {
        type: 'reading',
        title: "As Leis de Newton",
        content: "🍎 **Isaac Newton descobriu como as coisas se movem!**\n\n**1ª Lei - Inércia:**\nCoisas paradas querem ficar paradas. Coisas em movimento continuam em movimento.\nPor isso usamos cinto de segurança!\n\n**2ª Lei - Força:**\nQuanto mais força, mais rápido acelera. Quanto mais pesado, mais força precisa.\n\n**3ª Lei - Ação e Reação:**\nPara toda ação, há uma reação igual e oposta. É assim que foguetes funcionam!"
      },
      {
        type: 'video',
        title: "Física na Prática",
        content: "Veja demonstrações das leis da física!",
        videoUrl: "https://www.youtube.com/embed/KxMSloKEZFQ"
      },
      {
        type: 'practice',
        title: "Experimento: Gravidade",
        content: "🍃 **Testando a gravidade!**\n\n**Materiais:** Uma folha de papel e uma moeda\n\n**Parte 1:**\n1. Solte os dois ao mesmo tempo da mesma altura\n2. Qual chegou primeiro?\n\n**Parte 2:**\n1. Amasse a folha em uma bolinha\n2. Solte novamente\n3. O que mudou?\n\n**Por quê?** A resistência do ar afeta objetos leves. Sem ar (no vácuo), cairiam juntos!"
      },
      {
        type: 'quiz',
        title: "Quiz de Física",
        content: "O que a 3ª Lei de Newton explica?\n\nA) Por que coisas caem\nB) Por que foguetes sobem\nC) Por que a luz viaja rápido\nD) Por que temos estações do ano",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 5,
    title: "Biologia: Seres Vivos",
    description: "Explore a incrível diversidade da vida",
    icon: "Leaf",
    difficulty: "Intermediário",
    points: 50,
    color: "bg-emerald-500",
    lessons: [
      {
        type: 'reading',
        title: "O que é Vida?",
        content: "🌱 **Características dos seres vivos:**\n\n✅ Nascem, crescem, se reproduzem e morrem\n✅ São formados por células\n✅ Precisam de energia (comida ou luz)\n✅ Respondem ao ambiente\n✅ Evoluem ao longo do tempo\n\n**Reinos dos seres vivos:**\n- 👑 Animais\n- 🌸 Plantas\n- 🍄 Fungos\n- 🦠 Bactérias\n- 🔬 Protistas"
      },
      {
        type: 'video',
        title: "A Célula - Unidade da Vida",
        content: "Conheça as células, os tijolos de todos os seres vivos!",
        videoUrl: "https://www.youtube.com/embed/RI3fOdMM7ck"
      },
      {
        type: 'practice',
        title: "Observando a Natureza",
        content: "🔍 **Seja uma bióloga de campo!**\n\n**Missão:** Observe e registre seres vivos por 30 minutos\n\n1. Vá ao quintal, parque ou observe pela janela\n2. Liste todos os seres vivos que encontrar\n3. Para cada um, anote:\n   - Nome (se souber)\n   - Descrição\n   - O que estava fazendo\n\n📝 Desenhe pelo menos 3 que você observou!"
      },
      {
        type: 'quiz',
        title: "Quiz de Biologia",
        content: "O que TODOS os seres vivos têm em comum?\n\nA) São grandes\nB) São formados por células\nC) Têm olhos\nD) Se movem",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 6,
    title: "Ecologia e Meio Ambiente",
    description: "Como os seres vivos interagem com a natureza",
    icon: "Leaf",
    difficulty: "Intermediário",
    points: 55,
    color: "bg-teal-500",
    lessons: [
      {
        type: 'reading',
        title: "Ecossistemas",
        content: "🌍 **Um ecossistema é onde seres vivos e ambiente interagem!**\n\n**Componentes:**\n- **Bióticos:** Seres vivos (plantas, animais, fungos)\n- **Abióticos:** Não vivos (água, luz, solo, ar)\n\n**Exemplos de ecossistemas:**\n- 🌴 Floresta tropical\n- 🏜️ Deserto\n- 🌊 Oceano\n- 🏔️ Tundra\n\n**Cadeia alimentar:**\nPlantas → Herbívoros → Carnívoros → Decompositores"
      },
      {
        type: 'video',
        title: "Protegendo o Planeta",
        content: "Como podemos cuidar melhor do nosso planeta?",
        videoUrl: "https://www.youtube.com/embed/RI3fOdMM7ck"
      },
      {
        type: 'practice',
        title: "Projeto Sustentável",
        content: "♻️ **Faça a diferença!**\n\n**Escolha um desafio:**\n\n1. **Reduzir:** Liste 5 coisas que você pode usar menos\n2. **Reutilizar:** Crie algo novo com materiais recicláveis\n3. **Reciclar:** Organize a coleta seletiva em casa\n\n**Documente:**\n- O que você fez\n- Quanto impacto teve\n- Como você se sentiu\n\n🌱 Pequenas ações, grande impacto!"
      },
      {
        type: 'quiz',
        title: "Quiz de Ecologia",
        content: "Na cadeia alimentar, quem vem depois das plantas?\n\nA) Carnívoros\nB) Decompositores\nC) Herbívoros\nD) Bactérias",
        correctAnswer: "C"
      }
    ]
  }
];

// Trilha específica para Tecnologia
export const technologyPath: PathLevel[] = [
  {
    id: 1,
    title: "Bem-vinda à Tecnologia!",
    description: "Descubra como a tecnologia muda o mundo",
    icon: "Star",
    difficulty: "Iniciante",
    points: 30,
    color: "bg-blue-500",
    lessons: [
      {
        type: 'video',
        title: "O que é Tecnologia?",
        content: "Tecnologia é qualquer ferramenta ou conhecimento que usamos para resolver problemas!",
        videoUrl: "https://www.youtube.com/embed/7_LPdttKXPc"
      },
      {
        type: 'reading',
        title: "Tecnologia Através do Tempo",
        content: "📱 **Tecnologia é qualquer ferramenta que resolve problemas!**\n\n**Tecnologias antigas:**\n- Roda 🛞\n- Fogo 🔥\n- Escrita ✍️\n\n**Tecnologias modernas:**\n- Computadores 💻\n- Internet 🌐\n- Smartphones 📱\n\nCada geração cria novas tecnologias. Qual você vai inventar?"
      },
      {
        type: 'inspiration',
        title: "Mulheres Pioneiras da Tecnologia",
        content: "**Ada Lovelace** escreveu o primeiro programa de computador da história!\n\n**Grace Hopper** inventou o primeiro compilador.\n\n**Margaret Hamilton** escreveu o código que levou o homem à Lua.\n\nVocê pode ser a próxima! 💜"
      },
      {
        type: 'quiz',
        title: "Quiz Rápido",
        content: "Qual dessas é uma tecnologia antiga?\n\nA) Smartphone\nB) Roda\nC) Computador\nD) Videogame",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 2,
    title: "Como a Internet Funciona",
    description: "O mundo conectado em segundos",
    icon: "Sparkles",
    difficulty: "Iniciante",
    points: 35,
    color: "bg-cyan-500",
    lessons: [
      {
        type: 'video',
        title: "A Viagem dos Dados",
        content: "Como mensagens viajam pelo mundo em segundos!",
        videoUrl: "https://www.youtube.com/embed/7_LPdttKXPc"
      },
      {
        type: 'reading',
        title: "Entendendo a Internet",
        content: "🌐 **A Internet é uma rede de computadores conectados!**\n\n**Como funciona:**\n1. Você digita um endereço\n2. Seu pedido viaja por cabos e satélites\n3. Chega ao servidor do site\n4. O servidor envia as informações de volta\n5. Tudo em milissegundos!\n\n**Curiosidades:**\n- A internet usa cabos no fundo do oceano\n- Seu pedido pode viajar milhares de km\n- Milhões de pessoas conectadas ao mesmo tempo"
      },
      {
        type: 'practice',
        title: "Rastreando a Internet",
        content: "🔍 **Descubra o caminho dos dados!**\n\n1. Peça a um adulto para abrir o Prompt de Comando\n2. Digite: tracert google.com\n3. Veja todos os servidores pelos quais sua mensagem passa!\n\n**Perguntas:**\n- Quantos 'saltos' foram necessários?\n- Qual foi o tempo total?\n- Algum servidor está em outro país?"
      },
      {
        type: 'quiz',
        title: "Quiz da Internet",
        content: "Por onde passa a maior parte dos dados da internet?\n\nA) Apenas satélites\nB) Cabos submarinos\nC) Ondas de rádio\nD) Fios de cobre aéreos",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 3,
    title: "Introdução à Programação",
    description: "Aprenda a falar com computadores",
    icon: "Code",
    difficulty: "Iniciante",
    points: 40,
    color: "bg-indigo-500",
    lessons: [
      {
        type: 'reading',
        title: "O que é Programar?",
        content: "💻 **Programar é dar instruções para o computador!**\n\nComputadores precisam de instruções MUITO detalhadas.\n\n**Exemplo - Fazer um sanduíche:**\n\nPara você: \"Faça um sanduíche\"\nPara computador:\n1. Pegue o pão\n2. Abra o saco\n3. Retire duas fatias\n4. Coloque na mesa\n5. Pegue a manteiga...\n\nProgramadoras escrevem essas instruções em linguagens especiais!"
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
    id: 4,
    title: "Segurança Digital",
    description: "Proteja-se no mundo online",
    icon: "Shield",
    difficulty: "Intermediário",
    points: 45,
    color: "bg-red-500",
    lessons: [
      {
        type: 'reading',
        title: "Senhas Fortes",
        content: "🔒 **Como criar senhas seguras:**\n\n**Regras de ouro:**\n- Mínimo 12 caracteres\n- Letras maiúsculas e minúsculas\n- Números e símbolos\n- Nada óbvio (nome, aniversário)\n\n**Técnica da frase:**\nEscolha uma frase: 'Meu gato Mimi tem 3 vidas!'\nSenha: MgMt3v!\n\n**Nunca:**\n- Use a mesma senha em tudo\n- Compartilhe senhas\n- Anote em papel visível"
      },
      {
        type: 'video',
        title: "Navegando com Segurança",
        content: "Dicas para se proteger online!",
        videoUrl: "https://www.youtube.com/embed/7_LPdttKXPc"
      },
      {
        type: 'practice',
        title: "Auditoria de Segurança",
        content: "🔍 **Verifique sua segurança online!**\n\n**Checklist:**\n✅ Suas senhas são fortes?\n✅ Você usa senhas diferentes?\n✅ Sabe o que é phishing?\n✅ Cuidado com links estranhos?\n✅ Perfis de redes são privados?\n\n**Ação:** Escolha 2 senhas fracas e mude hoje!"
      },
      {
        type: 'quiz',
        title: "Quiz de Segurança",
        content: "Qual dessas senhas é mais segura?\n\nA) senha123\nB) MeuNome2023\nC) Xk9@mP2#qL5!\nD) 123456789",
        correctAnswer: "C"
      }
    ]
  },
  {
    id: 5,
    title: "Inteligência Artificial",
    description: "Como máquinas podem aprender",
    icon: "Bot",
    difficulty: "Intermediário",
    points: 50,
    color: "bg-purple-500",
    lessons: [
      {
        type: 'reading',
        title: "O que é IA?",
        content: "🤖 **Inteligência Artificial são programas que aprendem!**\n\n**Como funciona:**\n1. Mostre muitos exemplos à IA\n2. Ela encontra padrões\n3. Agora ela reconhece coisas novas!\n\n**IAs que você usa:**\n- 📱 Filtros de fotos\n- 🎵 Recomendações do Spotify\n- 🗣️ Alexa/Siri\n- 🔍 Busca do Google"
      },
      {
        type: 'video',
        title: "IA na Prática",
        content: "Veja como a IA funciona no dia a dia!",
        videoUrl: "https://www.youtube.com/embed/2ePf9rue1Ao"
      },
      {
        type: 'practice',
        title: "Treine sua Própria IA",
        content: "🤖 **Vamos treinar uma IA!**\n\n1. Acesse teachablemachine.withgoogle.com\n2. Escolha 'Image Project'\n\n**Ensinando a IA:**\n1. Classe 1: 30 fotos suas sorrindo\n2. Classe 2: 30 fotos suas séria\n3. Clique em 'Train Model'\n4. Teste! A IA sabe se você está sorrindo?"
      },
      {
        type: 'quiz',
        title: "Quiz de IA",
        content: "O que é necessário para treinar uma IA?\n\nA) Apenas um computador rápido\nB) Muitos exemplos para ela aprender\nC) Uma pessoa muito inteligente\nD) Mágica",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 6,
    title: "Criando com Código",
    description: "Seus primeiros programas de verdade",
    icon: "Code",
    difficulty: "Intermediário",
    points: 55,
    color: "bg-pink-500",
    lessons: [
      {
        type: 'reading',
        title: "Linguagens de Programação",
        content: "💻 **Linguagens que programadoras usam:**\n\n**Scratch** - Visual, ótimo para começar\n**Python** - Fácil de ler, muito versátil\n**JavaScript** - Cria sites interativos\n**Java** - Apps Android\n**Swift** - Apps iPhone\n\nCada linguagem é boa para algo diferente!"
      },
      {
        type: 'video',
        title: "Programando no Scratch",
        content: "Crie seu primeiro jogo!",
        videoUrl: "https://www.youtube.com/embed/Dv7gLpW91DM"
      },
      {
        type: 'practice',
        title: "Jogo no Scratch",
        content: "🎮 **Crie um jogo simples!**\n\n1. Acesse scratch.mit.edu\n2. Crie um novo projeto\n\n**Desafio:**\n- Faça um personagem que anda\n- Adicione obstáculos\n- Crie um sistema de pontos\n- Teste e compartilhe!"
      },
      {
        type: 'quiz',
        title: "Quiz de Código",
        content: "Qual linguagem é usada para criar apps de iPhone?\n\nA) Python\nB) Java\nC) Swift\nD) Scratch",
        correctAnswer: "C"
      }
    ]
  }
];

// Trilha específica para Engenharia
export const engineeringPath: PathLevel[] = [
  {
    id: 1,
    title: "Bem-vinda à Engenharia!",
    description: "Construa soluções para o mundo real",
    icon: "Star",
    difficulty: "Iniciante",
    points: 30,
    color: "bg-orange-500",
    lessons: [
      {
        type: 'video',
        title: "O que faz uma Engenheira?",
        content: "Engenheiras resolvem problemas construindo coisas incríveis!",
        videoUrl: "https://www.youtube.com/embed/FEF6PxWOvsk"
      },
      {
        type: 'reading',
        title: "Tipos de Engenharia",
        content: "🔧 **Engenheiras resolvem problemas construindo coisas!**\n\n**Tipos de Engenharia:**\n\n🏗️ **Civil:** Pontes, prédios, estradas\n✈️ **Aeroespacial:** Aviões, foguetes\n💻 **Computação:** Software, apps\n🔌 **Elétrica:** Circuitos, energia\n🧪 **Química:** Medicamentos, cosméticos\n\nTodas usam criatividade + matemática + ciência!"
      },
      {
        type: 'inspiration',
        title: "Engenheiras Incríveis",
        content: "**Emily Roebling** completou a construção da Ponte do Brooklyn.\n\n**Hedy Lamarr** inventou a tecnologia base do WiFi.\n\n**Katherine Johnson** calculou trajetórias que levaram o homem à Lua.\n\nVocê pode ser a próxima! 💜"
      },
      {
        type: 'quiz',
        title: "Quiz Rápido",
        content: "Qual engenheira projeta aviões e foguetes?\n\nA) Engenheira Civil\nB) Engenheira Aeroespacial\nC) Engenheira Química\nD) Engenheira de Alimentos",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 2,
    title: "Máquinas Simples",
    description: "Os blocos de construção de toda máquina",
    icon: "Wrench",
    difficulty: "Iniciante",
    points: 35,
    color: "bg-amber-500",
    lessons: [
      {
        type: 'reading',
        title: "As 6 Máquinas Simples",
        content: "🔧 **Toda máquina complexa é feita de máquinas simples!**\n\n**1. Alavanca** 🎚️ (gangorra, tesoura)\n**2. Polia** 🎡 (mastro de bandeira)\n**3. Roda e Eixo** 🛞 (maçaneta, volante)\n**4. Plano Inclinado** 📐 (rampa)\n**5. Cunha** 🔪 (faca, machado)\n**6. Parafuso** 🔩 (tampa de garrafa)"
      },
      {
        type: 'video',
        title: "Máquinas em Ação",
        content: "Veja como máquinas simples funcionam!",
        videoUrl: "https://www.youtube.com/embed/fvOmaf2GfCY"
      },
      {
        type: 'practice',
        title: "Caça às Máquinas",
        content: "🔍 **Encontre máquinas simples na sua casa!**\n\n**Procure e anote:**\n1. 3 Alavancas\n2. 3 Rodas e Eixos\n3. 2 Planos Inclinados\n4. 2 Cunhas\n5. 2 Parafusos\n\n📸 Tire fotos de cada uma!\n\n**Bônus:** Encontre uma máquina que usa DUAS ou mais máquinas simples juntas!"
      },
      {
        type: 'quiz',
        title: "Quiz de Máquinas",
        content: "Qual máquina simples é uma tesoura?\n\nA) Polia\nB) Alavanca\nC) Parafuso\nD) Roda e eixo",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 3,
    title: "Estruturas e Forças",
    description: "Por que prédios ficam de pé?",
    icon: "Sparkles",
    difficulty: "Iniciante",
    points: 40,
    color: "bg-rose-500",
    lessons: [
      {
        type: 'reading',
        title: "Forças nas Estruturas",
        content: "🏗️ **Por que prédios não caem?**\n\n**Forças que atuam:**\n- **Compressão:** Aperta/Esmaga\n- **Tensão:** Estica/Puxa\n- **Torção:** Torce\n- **Cisalhamento:** Corta\n\n**Formas resistentes:**\n- 🔺 Triângulos são MUITO fortes\n- 🌀 Arcos distribuem o peso\n- ⬡ Hexágonos são eficientes\n\nPor isso pontes usam tantos triângulos!"
      },
      {
        type: 'video',
        title: "Engenharia de Pontes",
        content: "Como pontes suportam tanto peso?",
        videoUrl: "https://www.youtube.com/embed/FEF6PxWOvsk"
      },
      {
        type: 'practice',
        title: "Desafio de Construção",
        content: "🏗️ **Construa uma torre!**\n\n**Materiais:** 20 palitos de dente + 15 jujubas (ou massinha)\n\n**Regras:**\n1. Use só os materiais listados\n2. A torre deve ficar em pé sozinha\n3. Tente fazer a mais alta possível!\n\n**Dica:** Triângulos são formas muito fortes!"
      },
      {
        type: 'quiz',
        title: "Quiz de Estruturas",
        content: "Qual forma é mais resistente para construções?\n\nA) Círculo\nB) Quadrado\nC) Triângulo\nD) Retângulo",
        correctAnswer: "C"
      }
    ]
  },
  {
    id: 4,
    title: "Engenharia Aeroespacial",
    description: "Como aviões e foguetes funcionam",
    icon: "Rocket",
    difficulty: "Intermediário",
    points: 45,
    color: "bg-sky-500",
    lessons: [
      {
        type: 'reading',
        title: "As 4 Forças do Voo",
        content: "✈️ **Quatro forças atuam em um avião:**\n\n**1. Sustentação** ⬆️ - Empurra para cima (asas)\n**2. Peso** ⬇️ - Puxa para baixo (gravidade)\n**3. Empuxo** ➡️ - Empurra para frente (motores)\n**4. Arrasto** ⬅️ - Puxa para trás (ar)\n\n**Para voar:** Sustentação > Peso E Empuxo > Arrasto"
      },
      {
        type: 'video',
        title: "Como Aviões Voam",
        content: "Entenda a física do voo!",
        videoUrl: "https://www.youtube.com/embed/Gg0TXNXgz-w"
      },
      {
        type: 'practice',
        title: "Avião de Papel Científico",
        content: "✈️ **Experimente com aviões de papel!**\n\n1. Faça 4 aviões DIFERENTES\n2. Numere cada um (1-4)\n3. Lance cada um 3 vezes do MESMO lugar\n4. Meça a distância\n\n**Conclusão:** Qual voou mais longe? Por quê?"
      },
      {
        type: 'quiz',
        title: "Quiz Aeroespacial",
        content: "Qual força faz o avião subir?\n\nA) Arrasto\nB) Peso\nC) Sustentação\nD) Empuxo",
        correctAnswer: "C"
      }
    ]
  },
  {
    id: 5,
    title: "Robótica Básica",
    description: "Como robôs funcionam",
    icon: "Bot",
    difficulty: "Intermediário",
    points: 50,
    color: "bg-slate-500",
    lessons: [
      {
        type: 'reading',
        title: "Partes de um Robô",
        content: "🤖 **Robôs são máquinas que podem trabalhar sozinhas!**\n\n**Partes:**\n- 🧠 **Controlador:** O 'cérebro'\n- 👀 **Sensores:** Para 'ver' e 'sentir'\n- 💪 **Atuadores:** Motores para mover\n- 🔋 **Energia:** Bateria ou eletricidade\n\n**Onde encontramos:**\n- Fábricas\n- Hospitais\n- Aspiradores de pó\n- Rovers em Marte!"
      },
      {
        type: 'video',
        title: "Robôs Incríveis",
        content: "Veja robôs que existem hoje!",
        videoUrl: "https://www.youtube.com/embed/8wHJjLMnikU"
      },
      {
        type: 'practice',
        title: "Desenhe seu Robô",
        content: "🎨 **Projete seu próprio robô!**\n\n1. Decida qual problema seu robô vai resolver\n2. Desenhe o robô e suas partes\n3. Marque:\n   - Sensores\n   - Motores\n   - Controlador\n   - Bateria\n4. Dê um nome para seu robô!"
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
    id: 6,
    title: "Engenharia Sustentável",
    description: "Construindo um futuro melhor",
    icon: "Leaf",
    difficulty: "Intermediário",
    points: 55,
    color: "bg-green-500",
    lessons: [
      {
        type: 'reading',
        title: "Engenharia Verde",
        content: "🌱 **Engenharia sustentável cuida do planeta!**\n\n**Exemplos:**\n- ☀️ Painéis solares\n- 💨 Turbinas eólicas\n- ♻️ Materiais recicláveis\n- 🏠 Prédios eficientes\n\n**Princípios:**\n- Usar energia renovável\n- Reduzir desperdício\n- Reutilizar materiais\n- Proteger a natureza"
      },
      {
        type: 'video',
        title: "Energia Renovável",
        content: "Como geramos energia limpa?",
        videoUrl: "https://www.youtube.com/embed/FEF6PxWOvsk"
      },
      {
        type: 'practice',
        title: "Projeto Sustentável",
        content: "💡 **Crie uma solução sustentável!**\n\n1. Identifique um problema ambiental na sua cidade\n2. Pense em uma solução de engenharia\n3. Desenhe seu projeto\n4. Liste os materiais necessários\n5. Explique como funcionaria\n\nCompartilhe sua ideia!"
      },
      {
        type: 'quiz',
        title: "Quiz de Sustentabilidade",
        content: "Qual dessas é uma fonte de energia renovável?\n\nA) Petróleo\nB) Carvão\nC) Energia solar\nD) Gás natural",
        correctAnswer: "C"
      }
    ]
  }
];

// Trilha específica para Matemática
export const mathPath: PathLevel[] = [
  {
    id: 1,
    title: "Bem-vinda à Matemática!",
    description: "A linguagem universal do universo",
    icon: "Star",
    difficulty: "Iniciante",
    points: 30,
    color: "bg-purple-500",
    lessons: [
      {
        type: 'video',
        title: "Matemática Está em Tudo!",
        content: "Descubra como a matemática aparece em lugares inesperados!",
        videoUrl: "https://www.youtube.com/embed/kkGeOWYOFoA"
      },
      {
        type: 'reading',
        title: "Matemática no Dia a Dia",
        content: "🔢 **Onde você usa matemática sem perceber:**\n\n🎂 Dividir um bolo igualmente\n💰 Contar seu dinheiro\n⏰ Calcular que horas sair de casa\n🎮 Pontuação em jogos\n📏 Medir ingredientes de uma receita\n\nMatemática não é só sobre números - é sobre resolver problemas!"
      },
      {
        type: 'inspiration',
        title: "Matemáticas que Fizeram História",
        content: "**Emmy Noether** é considerada a mãe da álgebra moderna.\n\n**Maryam Mirzakhani** foi a primeira mulher a ganhar a Medalha Fields (Nobel da Matemática).\n\n**Hypátia de Alexandria** foi uma das primeiras matemáticas da história.\n\nVocê pode ser a próxima! 💜"
      },
      {
        type: 'quiz',
        title: "Quiz Rápido",
        content: "Qual dessas atividades usa matemática?\n\nA) Dividir pizza com amigos\nB) Jogar videogame\nC) Seguir uma receita de bolo\nD) Todas as anteriores",
        correctAnswer: "D"
      }
    ]
  },
  {
    id: 2,
    title: "Padrões e Sequências",
    description: "Encontre a ordem escondida nos números",
    icon: "Sparkles",
    difficulty: "Iniciante",
    points: 35,
    color: "bg-pink-500",
    lessons: [
      {
        type: 'reading',
        title: "O que são Padrões?",
        content: "🔢 **Padrões são regras que se repetem!**\n\n**Exemplos:**\n- 2, 4, 6, 8, 10... (somando 2)\n- A, C, E, G... (pulando uma letra)\n- 🌕🌖🌗🌘🌑... (fases da lua)\n\n**Por que importam?**\n- Ajudam a prever o futuro\n- Estão em toda a natureza\n- São a base da programação"
      },
      {
        type: 'video',
        title: "Fibonacci na Natureza",
        content: "Veja padrões matemáticos incríveis na natureza!",
        videoUrl: "https://www.youtube.com/embed/kkGeOWYOFoA"
      },
      {
        type: 'practice',
        title: "Desafio de Sequências",
        content: "🔢 **Complete as sequências:**\n\n1. 2, 4, 6, 8, __?\n2. A, C, E, G, __?\n3. 🌕 🌖 🌗 🌘 __?\n4. 1, 1, 2, 3, 5, __?\n\n💡 **Dica:** Procure o padrão!\n\n**Respostas:** 10, I, 🌑, 8 (sequência de Fibonacci)"
      },
      {
        type: 'quiz',
        title: "Quiz de Sequências",
        content: "Qual é o próximo número: 3, 6, 9, 12, __?\n\nA) 13\nB) 14\nC) 15\nD) 16",
        correctAnswer: "C"
      }
    ]
  },
  {
    id: 3,
    title: "Pensamento Lógico",
    description: "Aprenda a resolver problemas como uma matemática",
    icon: "Brain",
    difficulty: "Iniciante",
    points: 40,
    color: "bg-green-500",
    lessons: [
      {
        type: 'reading',
        title: "O que é Lógica?",
        content: "🧩 **Lógica é a arte de pensar direito!**\n\nQuando você resolve um problema passo a passo, está usando lógica.\n\n**Exemplo:**\n- Se chover, eu levo guarda-chuva\n- Está chovendo\n- Então, eu levo guarda-chuva! ☔\n\nMatemáticas usam lógica todos os dias!"
      },
      {
        type: 'video',
        title: "Pensamento Computacional",
        content: "Aprenda a dividir problemas grandes em partes menores!",
        videoUrl: "https://www.youtube.com/embed/KxMSloKEZFQ"
      },
      {
        type: 'practice',
        title: "Desafios de Lógica",
        content: "🧠 **Resolva estes enigmas:**\n\n1. Se todos os gatos têm bigodes, e Tom é um gato, Tom tem bigodes?\n\n2. Maria é mais alta que João. João é mais alto que Pedro. Quem é mais alto?\n\n3. Uma fazenda tem galinhas e coelhos. Há 10 cabeças e 34 patas. Quantas galinhas e quantos coelhos?"
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
    title: "Geometria Básica",
    description: "Formas, ângulos e medidas",
    icon: "Shapes",
    difficulty: "Intermediário",
    points: 45,
    color: "bg-blue-500",
    lessons: [
      {
        type: 'reading',
        title: "Formas Geométricas",
        content: "📐 **Formas básicas e suas propriedades:**\n\n**Triângulo** 🔺 - 3 lados\n**Quadrado** ⬜ - 4 lados iguais\n**Retângulo** 🟫 - 4 lados, 2 pares iguais\n**Círculo** ⭕ - sem lados!\n**Hexágono** ⬡ - 6 lados\n\n**Ângulos:**\n- Reto = 90° (canto de folha)\n- Agudo < 90° (pontudo)\n- Obtuso > 90° (aberto)"
      },
      {
        type: 'video',
        title: "Geometria na Arte",
        content: "Veja como artistas usam formas geométricas!",
        videoUrl: "https://www.youtube.com/embed/kkGeOWYOFoA"
      },
      {
        type: 'practice',
        title: "Caça às Formas",
        content: "🔍 **Encontre formas na sua casa!**\n\n1. Encontre 5 retângulos\n2. Encontre 5 círculos\n3. Encontre 3 triângulos\n4. Encontre 1 hexágono\n\n📸 Tire fotos e faça um mosaico!"
      },
      {
        type: 'quiz',
        title: "Quiz de Geometria",
        content: "Quantos lados tem um hexágono?\n\nA) 4\nB) 5\nC) 6\nD) 8",
        correctAnswer: "C"
      }
    ]
  },
  {
    id: 5,
    title: "Frações e Porcentagens",
    description: "Partes de um todo",
    icon: "Calculator",
    difficulty: "Intermediário",
    points: 50,
    color: "bg-orange-500",
    lessons: [
      {
        type: 'reading',
        title: "Entendendo Frações",
        content: "🍕 **Frações são partes de um todo!**\n\n**Exemplo com pizza:**\n- 1/2 = metade da pizza\n- 1/4 = um pedaço de 4\n- 3/4 = três pedaços de 4\n\n**Porcentagens são frações de 100:**\n- 50% = 1/2\n- 25% = 1/4\n- 100% = tudo!"
      },
      {
        type: 'video',
        title: "Frações no Dia a Dia",
        content: "Como usamos frações sem perceber!",
        videoUrl: "https://www.youtube.com/embed/kkGeOWYOFoA"
      },
      {
        type: 'practice',
        title: "Desafio de Frações",
        content: "🍫 **Problema real:**\n\nVocê tem uma barra de chocolate com 12 quadradinhos.\n\n1. Se comer 1/4, quantos quadradinhos come?\n2. Se der 1/3 para sua amiga, quantos sobram?\n3. Se guardar 50%, quantos guarda?\n\nDesenhe e resolva!"
      },
      {
        type: 'quiz',
        title: "Quiz de Frações",
        content: "1/2 de 20 é igual a:\n\nA) 5\nB) 10\nC) 15\nD) 20",
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 6,
    title: "Matemática Criativa",
    description: "Arte e beleza nos números",
    icon: "Shapes",
    difficulty: "Intermediário",
    points: 55,
    color: "bg-fuchsia-500",
    lessons: [
      {
        type: 'reading',
        title: "A Proporção Áurea",
        content: "✨ **Um número especial: 1.618...**\n\nA Proporção Áurea aparece em:\n- 🌻 Espirais de girassóis\n- 🐚 Conchas de caracol\n- 🖼️ Obras de arte famosas\n- 🏛️ Arquitetura antiga\n\nÉ considerada a proporção mais bela da natureza!"
      },
      {
        type: 'video',
        title: "Matemática na Arte",
        content: "Como artistas usam matemática para criar beleza!",
        videoUrl: "https://www.youtube.com/embed/kkGeOWYOFoA"
      },
      {
        type: 'practice',
        title: "Arte Geométrica",
        content: "🎨 **Crie arte com matemática!**\n\n**Materiais:** Papel, régua, compasso, lápis de cor\n\n**Desafio:**\n1. Desenhe um padrão usando só triângulos\n2. Desenhe um padrão usando só círculos\n3. Combine formas para criar um mosaico\n\nPinte com cores que seguem um padrão!"
      },
      {
        type: 'quiz',
        title: "Quiz Criativo",
        content: "Onde encontramos a sequência de Fibonacci na natureza?\n\nA) Nas nuvens\nB) Nas espirais de girassóis\nC) Na chuva\nD) No vento",
        correctAnswer: "B"
      }
    ]
  }
];

// Função para obter a trilha correta baseada na área
export const getPathByArea = (area: string): PathLevel[] => {
  switch (area) {
    case 'science':
      return sciencePath;
    case 'technology':
      return technologyPath;
    case 'engineering':
      return engineeringPath;
    case 'math':
      return mathPath;
    default:
      return sciencePath;
  }
};

// Mantém introductoryPath para compatibilidade
export const introductoryPath = sciencePath;
