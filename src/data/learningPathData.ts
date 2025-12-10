export interface LessonStep {
  type: 'video' | 'reading' | 'practice' | 'quiz';
  title: string;
  content: string;
  videoUrl?: string;
}

export interface PathLevel {
  id: number;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  points: number;
  color: string;
  position: { x: number; y: number };
  lessons: LessonStep[];
}

export const sciencePathLevels: PathLevel[] = [
  {
    id: 1,
    title: "Introdução ao Método Científico",
    description: "Aprenda a pensar como uma cientista",
    icon: "Star",
    difficulty: "Iniciante",
    points: 50,
    color: "bg-green-500",
    position: { x: 50, y: 95 },
    lessons: [
      {
        type: 'video',
        title: "O que é Ciência?",
        content: "A ciência é uma forma de entender o mundo através da observação, experimentação e análise. Cientistas fazem perguntas sobre tudo ao nosso redor e buscam respostas usando o método científico.",
        videoUrl: "https://www.youtube.com/embed/oXZWE29Lv5U"
      },
      {
        type: 'reading',
        title: "As Etapas do Método Científico",
        content: "1. OBSERVAÇÃO: Observe algo interessante no mundo ao seu redor.\n\n2. PERGUNTA: Faça uma pergunta sobre o que você observou.\n\n3. HIPÓTESE: Crie uma explicação possível (uma suposição educada).\n\n4. EXPERIMENTO: Teste sua hipótese com um experimento.\n\n5. ANÁLISE: Estude os resultados do seu experimento.\n\n6. CONCLUSÃO: Sua hipótese estava correta? O que você aprendeu?"
      },
      {
        type: 'practice',
        title: "Pratique: Sua Primeira Observação",
        content: "Olhe pela janela por 5 minutos. Anote 3 coisas interessantes que você observou. Para cada observação, escreva uma pergunta que você gostaria de responder.\n\nExemplo:\n- Observação: As formigas estão caminhando em fila.\n- Pergunta: Por que as formigas caminham em fila?"
      },
      {
        type: 'quiz',
        title: "Teste seus Conhecimentos",
        content: "Qual é a primeira etapa do método científico?\n\nA) Fazer um experimento\nB) Observar algo interessante\nC) Tirar uma conclusão\nD) Criar uma hipótese"
      }
    ]
  },
  {
    id: 2,
    title: "O Mundo dos Átomos",
    description: "Descubra do que tudo é feito",
    icon: "Atom",
    difficulty: "Iniciante",
    points: 75,
    color: "bg-blue-500",
    position: { x: 20, y: 85 },
    lessons: [
      {
        type: 'video',
        title: "O que são Átomos?",
        content: "Átomos são as menores partículas que formam toda a matéria no universo. Tudo que você vê, toca e sente é feito de átomos!",
        videoUrl: "https://www.youtube.com/embed/2HdNBjG7Kf4"
      },
      {
        type: 'reading',
        title: "Estrutura do Átomo",
        content: "Um átomo é formado por três partículas principais:\n\n🔴 PRÓTONS: Partículas com carga positiva, ficam no núcleo.\n\n⚪ NÊUTRONS: Partículas sem carga, também ficam no núcleo.\n\n🔵 ELÉTRONS: Partículas com carga negativa, orbitam ao redor do núcleo.\n\nO núcleo fica no centro do átomo, e os elétrons 'dançam' ao seu redor como planetas ao redor do Sol!"
      },
      {
        type: 'practice',
        title: "Construa seu Átomo",
        content: "Vamos construir um modelo de átomo!\n\nMateriais: Massinha de modelar ou bolinhas de papel, palitos\n\n1. Faça bolinhas vermelhas (prótons) e brancas (nêutrons)\n2. Junte-as para formar o núcleo\n3. Faça bolinhas azuis menores (elétrons)\n4. Coloque os elétrons ao redor do núcleo"
      },
      {
        type: 'quiz',
        title: "Teste seus Conhecimentos",
        content: "Qual partícula tem carga negativa?\n\nA) Próton\nB) Nêutron\nC) Elétron\nD) Núcleo"
      }
    ]
  },
  {
    id: 3,
    title: "Explorando Células",
    description: "As unidades básicas da vida",
    icon: "Microscope",
    difficulty: "Iniciante",
    points: 100,
    color: "bg-purple-500",
    position: { x: 80, y: 75 },
    lessons: [
      {
        type: 'video',
        title: "O que é uma Célula?",
        content: "Células são as menores unidades da vida. Todo ser vivo é formado por células - desde uma bactéria minúscula até uma baleia gigante!",
        videoUrl: "https://www.youtube.com/embed/URUJD5NEXC8"
      },
      {
        type: 'reading',
        title: "Partes da Célula",
        content: "Imagine a célula como uma cidade microscópica:\n\n🏛️ NÚCLEO: O 'prefeito' da célula, guarda o DNA com todas as instruções.\n\n🧱 MEMBRANA: A 'muralha' que protege a célula e controla o que entra e sai.\n\n🏭 MITOCÔNDRIA: A 'usina de energia' que produz energia para a célula.\n\n🚚 RIBOSSOMOS: As 'fábricas' que produzem proteínas.\n\n💧 CITOPLASMA: O 'gel' onde todas as partes flutuam."
      },
      {
        type: 'practice',
        title: "Desenhe uma Célula",
        content: "Pegue papel e lápis coloridos!\n\n1. Desenhe um círculo grande (a membrana)\n2. Desenhe um círculo menor dentro (o núcleo)\n3. Adicione formas ovais (mitocôndrias)\n4. Coloque pontinhos (ribossomos)\n5. Preencha com cor clara (citoplasma)\n\nRotule cada parte!"
      },
      {
        type: 'quiz',
        title: "Quiz: Partes da Célula",
        content: "Qual parte da célula produz energia?\n\nA) Núcleo\nB) Membrana\nC) Mitocôndria\nD) Ribossomo"
      }
    ]
  },
  {
    id: 4,
    title: "DNA: O Código da Vida",
    description: "Desvende os segredos genéticos",
    icon: "Dna",
    difficulty: "Intermediário",
    points: 125,
    color: "bg-pink-500",
    position: { x: 30, y: 65 },
    lessons: [
      {
        type: 'video',
        title: "O que é DNA?",
        content: "DNA é como um livro de receitas que diz ao seu corpo como construir você! Cada célula do seu corpo contém esse código especial.",
        videoUrl: "https://www.youtube.com/embed/fV3dq6e5DLE"
      },
      {
        type: 'reading',
        title: "A Estrutura da Dupla Hélice",
        content: "O DNA parece uma escada em espiral torcida!\n\n🧬 BASES: São as 'letras' do código - A, T, C e G\n- A sempre se liga com T\n- C sempre se liga com G\n\n📏 FOSFATO E AÇÚCAR: Formam os 'corrimãos' da escada\n\nSe você esticasse todo o DNA de uma célula, teria quase 2 metros de comprimento!"
      },
      {
        type: 'practice',
        title: "Construa seu DNA",
        content: "Vamos fazer um modelo de DNA com materiais simples!\n\nMateriais: Barbante, clips coloridos ou contas\n\n1. Corte dois pedaços de barbante (os corrimãos)\n2. Use clips de 4 cores para as bases:\n   - Vermelho = A\n   - Verde = T\n   - Azul = C\n   - Amarelo = G\n3. Conecte A-T e C-G entre os barbantes\n4. Torça suavemente para formar a hélice!"
      },
      {
        type: 'quiz',
        title: "Quiz: DNA",
        content: "Com qual base a Adenina (A) sempre se conecta?\n\nA) Citosina (C)\nB) Guanina (G)\nC) Timina (T)\nD) Uracila (U)"
      }
    ]
  },
  {
    id: 5,
    title: "Forças e Movimento",
    description: "Física em ação no dia a dia",
    icon: "Zap",
    difficulty: "Intermediário",
    points: 150,
    color: "bg-yellow-500",
    position: { x: 70, y: 55 },
    lessons: [
      {
        type: 'video',
        title: "O que são Forças?",
        content: "Forças são empurrões e puxões que fazem as coisas se moverem, pararem ou mudarem de direção!",
        videoUrl: "https://www.youtube.com/embed/DEHqpNbQTTE"
      },
      {
        type: 'reading',
        title: "As Leis de Newton",
        content: "Isaac Newton descobriu três leis do movimento:\n\n1️⃣ PRIMEIRA LEI (Inércia): Objetos parados ficam parados, objetos em movimento continuam em movimento, a menos que uma força atue sobre eles.\n\n2️⃣ SEGUNDA LEI (F=ma): Quanto mais força você aplica, mais rápido algo acelera.\n\n3️⃣ TERCEIRA LEI (Ação e Reação): Para toda ação, existe uma reação igual e oposta."
      },
      {
        type: 'practice',
        title: "Experimento: Inércia",
        content: "Veja a primeira lei de Newton em ação!\n\nMateriais: Copo, carta de baralho, moeda\n\n1. Coloque a carta sobre o copo\n2. Coloque a moeda sobre a carta\n3. Com um movimento rápido, puxe a carta horizontalmente\n4. A moeda cai dentro do copo!\n\nIsso acontece porque a moeda tende a ficar parada (inércia)!"
      },
      {
        type: 'quiz',
        title: "Quiz: Forças",
        content: "Se você empurra uma parede, o que a terceira lei de Newton diz?\n\nA) A parede se move\nB) A parede empurra você de volta\nC) Nada acontece\nD) Você fica mais forte"
      }
    ]
  },
  {
    id: 6,
    title: "Ecossistemas e Meio Ambiente",
    description: "Conexões na natureza",
    icon: "Leaf",
    difficulty: "Intermediário",
    points: 175,
    color: "bg-green-600",
    position: { x: 40, y: 45 },
    lessons: [
      {
        type: 'video',
        title: "O que é um Ecossistema?",
        content: "Um ecossistema é uma comunidade de seres vivos interagindo entre si e com o ambiente onde vivem.",
        videoUrl: "https://www.youtube.com/embed/oV_g9N5xCCM"
      },
      {
        type: 'reading',
        title: "Cadeias Alimentares",
        content: "Todos os seres vivos precisam de energia para sobreviver!\n\n🌱 PRODUTORES: Plantas que fazem seu próprio alimento através da fotossíntese.\n\n🐛 CONSUMIDORES PRIMÁRIOS: Herbívoros que comem plantas.\n\n🐍 CONSUMIDORES SECUNDÁRIOS: Carnívoros que comem herbívoros.\n\n🦅 CONSUMIDORES TERCIÁRIOS: Predadores de topo.\n\n🍂 DECOMPOSITORES: Fungos e bactérias que reciclam nutrientes."
      },
      {
        type: 'practice',
        title: "Crie uma Cadeia Alimentar",
        content: "Escolha um ecossistema (floresta, oceano, deserto) e desenhe uma cadeia alimentar com pelo menos 4 níveis.\n\nExemplo da Floresta:\n🌿 Folha → 🐛 Lagarta → 🐦 Pássaro → 🦊 Raposa → 🍄 Fungo\n\nPense: O que aconteceria se um elo da cadeia desaparecesse?"
      },
      {
        type: 'quiz',
        title: "Quiz: Ecossistemas",
        content: "Quem são os produtores em um ecossistema?\n\nA) Animais que caçam\nB) Plantas que fazem fotossíntese\nC) Fungos que decompõem\nD) Animais que comem plantas"
      }
    ]
  },
  {
    id: 7,
    title: "Química das Reações",
    description: "Transformações mágicas da matéria",
    icon: "Beaker",
    difficulty: "Intermediário",
    points: 200,
    color: "bg-orange-500",
    position: { x: 60, y: 35 },
    lessons: [
      {
        type: 'video',
        title: "Reações Químicas",
        content: "Uma reação química acontece quando substâncias se transformam em outras substâncias diferentes!",
        videoUrl: "https://www.youtube.com/embed/8m6RtOpqvtU"
      },
      {
        type: 'reading',
        title: "Sinais de Reação Química",
        content: "Como saber se uma reação química está acontecendo?\n\n🔥 MUDANÇA DE TEMPERATURA: Fica mais quente ou mais frio\n\n💨 FORMAÇÃO DE GÁS: Bolhas aparecem\n\n🎨 MUDANÇA DE COR: A cor muda\n\n�ite FORMAÇÃO DE PRECIPITADO: Um sólido aparece em um líquido\n\n💡 EMISSÃO DE LUZ: Brilha ou produz luz"
      },
      {
        type: 'practice',
        title: "Experimento: Reação Ácido-Base",
        content: "Faça uma reação química segura em casa!\n\nMateriais: Vinagre, bicarbonato de sódio, copo\n\n1. Coloque 2 colheres de bicarbonato no copo\n2. Adicione vinagre lentamente\n3. Observe as bolhas!\n\nO que aconteceu? O ácido (vinagre) reagiu com a base (bicarbonato) produzindo gás carbônico!"
      },
      {
        type: 'quiz',
        title: "Quiz: Reações",
        content: "Qual NÃO é um sinal de reação química?\n\nA) Mudança de cor\nB) Formação de bolhas\nC) Objeto ficando mais pesado\nD) Mudança de temperatura"
      }
    ]
  },
  {
    id: 8,
    title: "O Sistema Solar",
    description: "Viagem pelo espaço",
    icon: "Sun",
    difficulty: "Avançado",
    points: 225,
    color: "bg-indigo-500",
    position: { x: 25, y: 25 },
    lessons: [
      {
        type: 'video',
        title: "Nosso Sistema Solar",
        content: "O Sistema Solar é nossa vizinhança cósmica, com o Sol no centro e oito planetas orbitando ao seu redor!",
        videoUrl: "https://www.youtube.com/embed/libKVRa01L8"
      },
      {
        type: 'reading',
        title: "Os Planetas",
        content: "Conheça os 8 planetas em ordem:\n\n☿ MERCÚRIO: O menor e mais próximo do Sol\n♀ VÊNUS: O mais quente, gira ao contrário\n🌍 TERRA: Nosso lar, único com vida conhecida\n♂ MARTE: O planeta vermelho\n♃ JÚPITER: O maior planeta, tem a Grande Mancha Vermelha\n♄ SATURNO: Famoso pelos anéis\n♅ URANO: Gira 'deitado'\n♆ NETUNO: O mais distante e ventoso\n\nDica para lembrar: 'Minha Vó Tem Muitas Joias, Só Usa No Natal'"
      },
      {
        type: 'practice',
        title: "Modelo do Sistema Solar",
        content: "Crie um modelo em escala!\n\nUse frutas ou bolas de tamanhos diferentes:\n- Sol: Melancia\n- Mercúrio: Pimenta\n- Vênus: Uva\n- Terra: Uva\n- Marte: Ervilha\n- Júpiter: Laranja\n- Saturno: Limão\n- Urano: Ameixa\n- Netuno: Ameixa\n\nColoque-os em ordem de distância!"
      },
      {
        type: 'quiz',
        title: "Quiz: Sistema Solar",
        content: "Qual é o maior planeta do Sistema Solar?\n\nA) Saturno\nB) Júpiter\nC) Netuno\nD) Terra"
      }
    ]
  },
  {
    id: 9,
    title: "Eletricidade e Magnetismo",
    description: "Poderes invisíveis da natureza",
    icon: "Zap",
    difficulty: "Avançado",
    points: 250,
    color: "bg-cyan-500",
    position: { x: 75, y: 15 },
    lessons: [
      {
        type: 'video',
        title: "O que é Eletricidade?",
        content: "Eletricidade é o fluxo de partículas minúsculas chamadas elétrons. Ela alimenta nossas casas, celulares e muito mais!",
        videoUrl: "https://www.youtube.com/embed/ru032Mfsfig"
      },
      {
        type: 'reading',
        title: "Circuitos Elétricos",
        content: "Um circuito é um caminho fechado por onde a eletricidade flui.\n\n🔋 FONTE DE ENERGIA: Bateria ou tomada\n💡 CARGA: O que usa a energia (lâmpada, motor)\n🔌 CONDUTORES: Fios que transportam eletricidade\n🔘 INTERRUPTOR: Liga e desliga o circuito\n\nTipos de circuitos:\n- SÉRIE: Componentes em linha (se um quebra, todos param)\n- PARALELO: Componentes lado a lado (cada um funciona independente)"
      },
      {
        type: 'practice',
        title: "Eletricidade Estática",
        content: "Experimento com balão!\n\n1. Encha um balão\n2. Esfregue-o no seu cabelo por 30 segundos\n3. Aproxime de pedacinhos de papel\n4. O papel 'pula' para o balão!\n\nPor quê? Ao esfregar, elétrons passam do cabelo para o balão, criando carga estática que atrai o papel!"
      },
      {
        type: 'quiz',
        title: "Quiz: Eletricidade",
        content: "Em qual tipo de circuito, se uma lâmpada queima, as outras continuam funcionando?\n\nA) Circuito em série\nB) Circuito paralelo\nC) Circuito aberto\nD) Circuito fechado"
      }
    ]
  },
  {
    id: 10,
    title: "Mestra da Ciência",
    description: "Projeto final: Sua descoberta!",
    icon: "Rocket",
    difficulty: "Avançado",
    points: 300,
    color: "bg-red-500",
    position: { x: 50, y: 5 },
    lessons: [
      {
        type: 'reading',
        title: "Seu Projeto de Ciências",
        content: "Parabéns por chegar até aqui! 🎉\n\nAgora é hora de criar SEU próprio projeto de ciências!\n\nEscolha um tema que você ama:\n- Plantas e crescimento\n- Animais e comportamento\n- Física e movimento\n- Química e reações\n- Astronomia e espaço"
      },
      {
        type: 'practice',
        title: "Planeje seu Experimento",
        content: "Use o método científico:\n\n1. PERGUNTA: O que você quer descobrir?\n\n2. HIPÓTESE: O que você ACHA que vai acontecer?\n\n3. MATERIAIS: O que você precisa?\n\n4. PROCEDIMENTO: Passo a passo do experimento\n\n5. RESULTADOS: O que aconteceu?\n\n6. CONCLUSÃO: Sua hipótese estava certa?"
      },
      {
        type: 'practice',
        title: "Execute e Documente",
        content: "Agora faça seu experimento!\n\n📝 Anote tudo que observar\n📸 Tire fotos de cada etapa\n📊 Faça gráficos se puder medir algo\n🎥 Grave um vídeo explicando\n\nLembre-se: Na ciência, erros são aprendizados!"
      },
      {
        type: 'reading',
        title: "Celebre sua Conquista!",
        content: "🏆 VOCÊ É UMA CIENTISTA! 🏆\n\nVocê completou toda a trilha de ciências e provou que pode pensar, questionar e descobrir como uma verdadeira cientista.\n\nO mundo precisa de mais meninas na ciência - e você é uma delas!\n\nContinue curiosa, continue perguntando, continue experimentando. O futuro é seu! 💜"
      }
    ]
  }
];

export const technologyPathLevels: PathLevel[] = [
  {
    id: 1,
    title: "Introdução à Computação",
    description: "Como os computadores funcionam",
    icon: "Monitor",
    difficulty: "Iniciante",
    points: 50,
    color: "bg-blue-500",
    position: { x: 50, y: 95 },
    lessons: [
      {
        type: 'video',
        title: "O que é um Computador?",
        content: "Computadores são máquinas que processam informações seguindo instruções. Eles estão em todo lugar!",
        videoUrl: "https://www.youtube.com/embed/AkFi90lZmXA"
      },
      {
        type: 'reading',
        title: "Partes do Computador",
        content: "🧠 CPU: O 'cérebro' que processa tudo\n💾 MEMÓRIA RAM: Onde dados temporários ficam\n💿 HD/SSD: Onde arquivos são guardados\n🖥️ MONITOR: Mostra as imagens\n⌨️ TECLADO: Para digitar\n🖱️ MOUSE: Para clicar e apontar"
      },
      {
        type: 'practice',
        title: "Explore seu Computador",
        content: "Identifique cada parte do seu computador e escreva o que cada uma faz!"
      },
      {
        type: 'quiz',
        title: "Quiz: Computadores",
        content: "Qual parte do computador é considerada o 'cérebro'?\n\nA) Monitor\nB) Teclado\nC) CPU\nD) Mouse"
      }
    ]
  },
  {
    id: 2,
    title: "Lógica de Programação",
    description: "Pense como um programador",
    icon: "Code",
    difficulty: "Iniciante",
    points: 75,
    color: "bg-green-500",
    position: { x: 20, y: 85 },
    lessons: [
      {
        type: 'reading',
        title: "O que é Programação?",
        content: "Programar é dar instruções para o computador. É como escrever uma receita de bolo - cada passo precisa ser claro!"
      },
      {
        type: 'practice',
        title: "Algoritmo do Sanduíche",
        content: "Escreva instruções detalhadas para fazer um sanduíche. Seja específica!"
      },
      {
        type: 'reading',
        title: "Sequência, Decisão e Repetição",
        content: "Os três pilares da programação:\n\n1. SEQUÊNCIA: Passos em ordem\n2. DECISÃO: Se isso, faça aquilo\n3. REPETIÇÃO: Repita até terminar"
      },
      {
        type: 'quiz',
        title: "Quiz: Lógica",
        content: "Qual estrutura usamos para repetir ações?\n\nA) Sequência\nB) Decisão\nC) Repetição\nD) Variável"
      }
    ]
  },
  {
    id: 3,
    title: "HTML: Estrutura Web",
    description: "Crie sua primeira página",
    icon: "Globe",
    difficulty: "Iniciante",
    points: 100,
    color: "bg-orange-500",
    position: { x: 80, y: 75 },
    lessons: [
      {
        type: 'video',
        title: "O que é HTML?",
        content: "HTML é a linguagem que estrutura páginas web. É como o esqueleto de um site!",
        videoUrl: "https://www.youtube.com/embed/uh6FqexxlHg"
      },
      {
        type: 'reading',
        title: "Tags Básicas",
        content: "Tags são comandos HTML:\n\n<h1>Título</h1>\n<p>Parágrafo</p>\n<img src='foto.jpg'>\n<a href='link'>Clique aqui</a>"
      },
      {
        type: 'practice',
        title: "Sua Primeira Página",
        content: "Crie uma página sobre você com título, parágrafos e uma imagem!"
      },
      {
        type: 'quiz',
        title: "Quiz: HTML",
        content: "Qual tag usamos para criar um parágrafo?\n\nA) <h1>\nB) <p>\nC) <img>\nD) <div>"
      }
    ]
  },
  {
    id: 4,
    title: "CSS: Estilizando",
    description: "Deixe tudo bonito",
    icon: "Palette",
    difficulty: "Intermediário",
    points: 125,
    color: "bg-pink-500",
    position: { x: 30, y: 65 },
    lessons: [
      {
        type: 'reading',
        title: "O que é CSS?",
        content: "CSS adiciona cores, fontes e layouts ao HTML. É a 'maquiagem' do site!"
      },
      {
        type: 'practice',
        title: "Cores e Fontes",
        content: "Experimente mudar cores de fundo, cores de texto e tipos de fonte na sua página."
      },
      {
        type: 'reading',
        title: "Seletores e Propriedades",
        content: "h1 { color: purple; }\np { font-size: 16px; }\n\nSeletores escolhem elementos, propriedades definem estilos."
      },
      {
        type: 'quiz',
        title: "Quiz: CSS",
        content: "Qual propriedade muda a cor do texto?\n\nA) background-color\nB) color\nC) font-size\nD) width"
      }
    ]
  },
  {
    id: 5,
    title: "JavaScript Básico",
    description: "Adicione interatividade",
    icon: "Sparkles",
    difficulty: "Intermediário",
    points: 150,
    color: "bg-yellow-500",
    position: { x: 70, y: 55 },
    lessons: [
      {
        type: 'video',
        title: "O que é JavaScript?",
        content: "JavaScript faz as páginas ganharem vida! Botões clicáveis, animações e muito mais.",
        videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk"
      },
      {
        type: 'reading',
        title: "Variáveis e Funções",
        content: "let nome = 'Maria';\n\nfunction saudar() {\n  alert('Olá, ' + nome);\n}"
      },
      {
        type: 'practice',
        title: "Botão Interativo",
        content: "Crie um botão que mostra uma mensagem quando clicado!"
      },
      {
        type: 'quiz',
        title: "Quiz: JavaScript",
        content: "O que 'let' faz em JavaScript?\n\nA) Cria uma função\nB) Cria uma variável\nC) Exibe uma mensagem\nD) Cria um botão"
      }
    ]
  },
  {
    id: 6,
    title: "Banco de Dados",
    description: "Organize informações",
    icon: "Database",
    difficulty: "Intermediário",
    points: 175,
    color: "bg-purple-500",
    position: { x: 40, y: 45 },
    lessons: [
      {
        type: 'reading',
        title: "O que é um Banco de Dados?",
        content: "Bancos de dados armazenam informações de forma organizada, como uma biblioteca digital super eficiente!"
      },
      {
        type: 'reading',
        title: "Tabelas e Registros",
        content: "Dados são organizados em tabelas:\n\n| ID | Nome | Idade |\n| 1  | Ana  | 12    |\n| 2  | Bia  | 13    |"
      },
      {
        type: 'practice',
        title: "Projete seu Banco",
        content: "Desenhe tabelas para um app de sua escolha: que informações você guardaria?"
      },
      {
        type: 'quiz',
        title: "Quiz: Dados",
        content: "Como os dados são organizados em um banco?\n\nA) Em pastas\nB) Em tabelas\nC) Em arquivos\nD) Em listas"
      }
    ]
  },
  {
    id: 7,
    title: "Segurança Digital",
    description: "Proteja-se online",
    icon: "Shield",
    difficulty: "Intermediário",
    points: 200,
    color: "bg-red-500",
    position: { x: 60, y: 35 },
    lessons: [
      {
        type: 'reading',
        title: "Por que Segurança Importa?",
        content: "A internet é incrível, mas precisamos nos proteger de pessoas mal-intencionadas!"
      },
      {
        type: 'reading',
        title: "Senhas Fortes",
        content: "Boas senhas têm:\n✓ 12+ caracteres\n✓ Letras maiúsculas e minúsculas\n✓ Números\n✓ Símbolos especiais"
      },
      {
        type: 'practice',
        title: "Crie uma Senha Forte",
        content: "Crie 3 senhas fortes e memoráveis usando frases que só você conhece."
      },
      {
        type: 'quiz',
        title: "Quiz: Segurança",
        content: "Qual é a senha mais segura?\n\nA) 123456\nB) MinhaCasa123\nC) C@ch0rr0_Fel!z_2024\nD) senha"
      }
    ]
  },
  {
    id: 8,
    title: "Inteligência Artificial",
    description: "Máquinas que aprendem",
    icon: "Brain",
    difficulty: "Avançado",
    points: 225,
    color: "bg-indigo-500",
    position: { x: 25, y: 25 },
    lessons: [
      {
        type: 'video',
        title: "O que é IA?",
        content: "Inteligência Artificial são programas que podem aprender e tomar decisões!",
        videoUrl: "https://www.youtube.com/embed/mJeNghZXtMo"
      },
      {
        type: 'reading',
        title: "Como a IA Aprende?",
        content: "A IA aprende com exemplos:\n\n1. Recebe muitos dados\n2. Encontra padrões\n3. Faz previsões\n\nÉ como ensinar um bebê a reconhecer gatos mostrando milhares de fotos!"
      },
      {
        type: 'practice',
        title: "Treine uma IA",
        content: "Acesse Teachable Machine do Google e treine uma IA para reconhecer seus gestos!"
      },
      {
        type: 'quiz',
        title: "Quiz: IA",
        content: "Como a IA aprende a reconhecer imagens?\n\nA) Mágica\nB) Vendo milhares de exemplos\nC) Lendo livros\nD) Perguntando para humanos"
      }
    ]
  },
  {
    id: 9,
    title: "Desenvolvimento de Apps",
    description: "Crie aplicativos mobile",
    icon: "Smartphone",
    difficulty: "Avançado",
    points: 250,
    color: "bg-cyan-500",
    position: { x: 75, y: 15 },
    lessons: [
      {
        type: 'reading',
        title: "Apps Nativos vs Web",
        content: "Apps podem ser:\n- NATIVOS: Feitos especificamente para iOS ou Android\n- WEB: Funcionam em qualquer navegador\n- HÍBRIDOS: Misturam os dois!"
      },
      {
        type: 'reading',
        title: "Design de Interface",
        content: "Bons apps têm:\n✓ Navegação fácil\n✓ Botões claros\n✓ Cores harmoniosas\n✓ Textos legíveis"
      },
      {
        type: 'practice',
        title: "Desenhe seu App",
        content: "Escolha um problema do seu dia e desenhe as telas de um app que resolva esse problema!"
      },
      {
        type: 'quiz',
        title: "Quiz: Apps",
        content: "Qual tipo de app funciona em qualquer dispositivo com navegador?\n\nA) Nativo iOS\nB) Nativo Android\nC) Web App\nD) Desktop"
      }
    ]
  },
  {
    id: 10,
    title: "Projeto Tech Final",
    description: "Crie seu projeto completo",
    icon: "Rocket",
    difficulty: "Avançado",
    points: 300,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    position: { x: 50, y: 5 },
    lessons: [
      {
        type: 'reading',
        title: "Hora de Brilhar!",
        content: "Você aprendeu muita coisa! Agora crie um projeto que junte tudo:\n\n- Pode ser um site\n- Pode ser um app\n- Pode ser uma automação"
      },
      {
        type: 'practice',
        title: "Planeje seu Projeto",
        content: "1. Escolha um problema para resolver\n2. Desenhe as telas/interface\n3. Liste as funcionalidades\n4. Defina as tecnologias"
      },
      {
        type: 'practice',
        title: "Construa e Apresente",
        content: "Construa seu projeto e prepare uma apresentação de 5 minutos explicando:\n- O problema\n- Sua solução\n- Como você construiu\n- O que você aprendeu"
      },
      {
        type: 'reading',
        title: "Você é uma Desenvolvedora!",
        content: "🎉 PARABÉNS! 🎉\n\nVocê completou a trilha de tecnologia e agora é uma desenvolvedora!\n\nO mundo tech precisa de mais meninas como você. Continue codando, continue criando, continue inovando! 💜"
      }
    ]
  }
];

export const engineeringPathLevels: PathLevel[] = [
  {
    id: 1,
    title: "O que é Engenharia?",
    description: "Conheça as engenharias",
    icon: "Wrench",
    difficulty: "Iniciante",
    points: 50,
    color: "bg-orange-500",
    position: { x: 50, y: 95 },
    lessons: [
      {
        type: 'reading',
        title: "Engenharia é Resolver Problemas",
        content: "Engenheiras usam matemática e ciência para resolver problemas do mundo real! Desde pontes até celulares, engenheiras constroem o mundo."
      },
      {
        type: 'video',
        title: "Tipos de Engenharia",
        content: "Existem muitos tipos de engenharia: Civil, Mecânica, Elétrica, Química, de Software, Ambiental...",
        videoUrl: "https://www.youtube.com/embed/bipTWWHya8A"
      },
      {
        type: 'practice',
        title: "Engenharia ao seu Redor",
        content: "Olhe ao seu redor e liste 10 coisas que foram criadas por engenheiras!"
      },
      {
        type: 'quiz',
        title: "Quiz: Engenharia",
        content: "O que engenheiras fazem?\n\nA) Só constroem prédios\nB) Resolvem problemas com ciência e matemática\nC) Só trabalham com computadores\nD) Só desenham plantas"
      }
    ]
  },
  {
    id: 2,
    title: "Estruturas e Forças",
    description: "Como as coisas ficam de pé",
    icon: "Building",
    difficulty: "Iniciante",
    points: 75,
    color: "bg-gray-600",
    position: { x: 20, y: 85 },
    lessons: [
      {
        type: 'reading',
        title: "Forças em Estruturas",
        content: "Estruturas precisam resistir a forças:\n\n↓ COMPRESSÃO: Força que esmaga\n↔ TENSÃO: Força que estica\n⤴ TORÇÃO: Força que torce"
      },
      {
        type: 'video',
        title: "Triângulos são Fortes!",
        content: "O triângulo é a forma mais forte em engenharia!",
        videoUrl: "https://www.youtube.com/embed/bpDIGVF2Dc0"
      },
      {
        type: 'practice',
        title: "Ponte de Palitos",
        content: "Construa uma ponte com palitos de picolé que aguente o máximo de peso!"
      },
      {
        type: 'quiz',
        title: "Quiz: Estruturas",
        content: "Qual forma geométrica é mais forte em engenharia?\n\nA) Quadrado\nB) Círculo\nC) Triângulo\nD) Retângulo"
      }
    ]
  },
  {
    id: 3,
    title: "Máquinas Simples",
    description: "Ferramentas geniais",
    icon: "Cog",
    difficulty: "Iniciante",
    points: 100,
    color: "bg-blue-600",
    position: { x: 80, y: 75 },
    lessons: [
      {
        type: 'reading',
        title: "As 6 Máquinas Simples",
        content: "1. ALAVANCA: Gangorra, tesoura\n2. RODA E EIXO: Maçaneta, volante\n3. POLIA: Elevador, cortina\n4. PLANO INCLINADO: Rampa, escada\n5. CUNHA: Faca, machado\n6. PARAFUSO: Tampas, saca-rolhas"
      },
      {
        type: 'practice',
        title: "Caça às Máquinas Simples",
        content: "Encontre exemplos de cada máquina simples na sua casa e tire fotos!"
      },
      {
        type: 'video',
        title: "Vantagem Mecânica",
        content: "Máquinas simples facilitam o trabalho multiplicando a força!",
        videoUrl: "https://www.youtube.com/embed/rRu_k5WZXC8"
      },
      {
        type: 'quiz',
        title: "Quiz: Máquinas",
        content: "Uma gangorra é um exemplo de qual máquina simples?\n\nA) Polia\nB) Alavanca\nC) Cunha\nD) Parafuso"
      }
    ]
  },
  {
    id: 4,
    title: "Engenharia Elétrica",
    description: "O poder da eletricidade",
    icon: "Zap",
    difficulty: "Intermediário",
    points: 125,
    color: "bg-yellow-500",
    position: { x: 30, y: 65 },
    lessons: [
      {
        type: 'reading',
        title: "Circuitos Elétricos",
        content: "Circuitos são caminhos para a eletricidade fluir. Precisam de:\n- Fonte de energia\n- Fios condutores\n- Carga (lâmpada, motor)"
      },
      {
        type: 'practice',
        title: "Circuito com LED",
        content: "Monte um circuito simples com bateria, fios e LED!"
      },
      {
        type: 'reading',
        title: "Série vs Paralelo",
        content: "Em SÉRIE: componentes em linha\nEm PARALELO: componentes lado a lado\n\nParalelo é melhor para casas - se uma lâmpada queima, as outras continuam!"
      },
      {
        type: 'quiz',
        title: "Quiz: Circuitos",
        content: "Se em um circuito em série uma lâmpada queima, o que acontece?\n\nA) As outras ficam mais fortes\nB) Nada muda\nC) Todas apagam\nD) Só metade apaga"
      }
    ]
  },
  {
    id: 5,
    title: "Robótica",
    description: "Construa robôs",
    icon: "Bot",
    difficulty: "Intermediário",
    points: 150,
    color: "bg-purple-500",
    position: { x: 70, y: 55 },
    lessons: [
      {
        type: 'video',
        title: "O que são Robôs?",
        content: "Robôs são máquinas programadas para fazer tarefas automaticamente!",
        videoUrl: "https://www.youtube.com/embed/mQbC0P6m0T0"
      },
      {
        type: 'reading',
        title: "Partes de um Robô",
        content: "🤖 SENSORES: Os 'sentidos' do robô\n⚙️ ATUADORES: Os 'músculos' (motores)\n🧠 CONTROLADOR: O 'cérebro' (microcontrolador)\n🔋 ENERGIA: A 'comida' (bateria)"
      },
      {
        type: 'practice',
        title: "Robô de Papel",
        content: "Desenhe e construa um robô de papel com partes móveis!"
      },
      {
        type: 'quiz',
        title: "Quiz: Robótica",
        content: "Qual parte do robô detecta o ambiente?\n\nA) Motor\nB) Sensor\nC) Bateria\nD) Roda"
      }
    ]
  },
  {
    id: 6,
    title: "Engenharia Ambiental",
    description: "Proteja o planeta",
    icon: "Leaf",
    difficulty: "Intermediário",
    points: 175,
    color: "bg-green-500",
    position: { x: 40, y: 45 },
    lessons: [
      {
        type: 'reading',
        title: "Engenharia Verde",
        content: "Engenheiras ambientais trabalham para:\n- Limpar água e ar\n- Gerenciar resíduos\n- Criar energia limpa\n- Proteger ecossistemas"
      },
      {
        type: 'practice',
        title: "Filtro de Água Caseiro",
        content: "Construa um filtro com garrafa pet, areia, pedras e algodão!"
      },
      {
        type: 'video',
        title: "Energia Renovável",
        content: "Sol, vento e água podem gerar energia limpa!",
        videoUrl: "https://www.youtube.com/embed/RnvCbquYeIM"
      },
      {
        type: 'quiz',
        title: "Quiz: Meio Ambiente",
        content: "Qual energia vem do Sol?\n\nA) Eólica\nB) Hidrelétrica\nC) Solar\nD) Nuclear"
      }
    ]
  },
  {
    id: 7,
    title: "Engenharia Mecânica",
    description: "Movimento e máquinas",
    icon: "Cog",
    difficulty: "Intermediário",
    points: 200,
    color: "bg-red-500",
    position: { x: 60, y: 35 },
    lessons: [
      {
        type: 'reading',
        title: "Engrenagens",
        content: "Engrenagens transferem movimento e força:\n- Engrenagem grande → gira devagar, mais força\n- Engrenagem pequena → gira rápido, menos força"
      },
      {
        type: 'practice',
        title: "Sistema de Engrenagens",
        content: "Use tampinhas de garrafa e palitos para criar um sistema de engrenagens!"
      },
      {
        type: 'reading',
        title: "Motores",
        content: "Motores convertem energia em movimento. Podem ser:\n- Elétricos\n- A combustão\n- A vapor"
      },
      {
        type: 'quiz',
        title: "Quiz: Mecânica",
        content: "Uma engrenagem grande conectada a uma pequena faz a pequena girar:\n\nA) Mais devagar\nB) Mais rápido\nC) Na mesma velocidade\nD) Para trás"
      }
    ]
  },
  {
    id: 8,
    title: "Aeronáutica",
    description: "Voar pelos céus",
    icon: "Plane",
    difficulty: "Avançado",
    points: 225,
    color: "bg-sky-500",
    position: { x: 25, y: 25 },
    lessons: [
      {
        type: 'video',
        title: "Como os Aviões Voam?",
        content: "O formato das asas cria sustentação, empurrando o avião para cima!",
        videoUrl: "https://www.youtube.com/embed/Gg0TXNXgz-w"
      },
      {
        type: 'reading',
        title: "As 4 Forças do Voo",
        content: "↑ SUSTENTAÇÃO: Empurra para cima\n↓ PESO: Puxa para baixo\n→ EMPUXO: Move para frente\n← ARRASTO: Freia o movimento"
      },
      {
        type: 'practice',
        title: "Avião de Papel Perfeito",
        content: "Teste diferentes designs de aviões de papel e meça qual voa mais longe!"
      },
      {
        type: 'quiz',
        title: "Quiz: Aeronáutica",
        content: "Qual força mantém o avião no ar?\n\nA) Empuxo\nB) Arrasto\nC) Sustentação\nD) Peso"
      }
    ]
  },
  {
    id: 9,
    title: "Engenharia Civil",
    description: "Construa o mundo",
    icon: "Building2",
    difficulty: "Avançado",
    points: 250,
    color: "bg-amber-600",
    position: { x: 75, y: 15 },
    lessons: [
      {
        type: 'reading',
        title: "Fundações e Estruturas",
        content: "Toda construção precisa de:\n- FUNDAÇÃO: Base firme no solo\n- PILARES: Sustentam o peso\n- VIGAS: Distribuem as forças\n- LAJE: O piso de cada andar"
      },
      {
        type: 'practice',
        title: "Torre de Espaguete",
        content: "Construa a torre mais alta possível usando apenas espaguete e marshmallows!"
      },
      {
        type: 'video',
        title: "Pontes Incríveis",
        content: "Diferentes tipos de pontes para diferentes necessidades!",
        videoUrl: "https://www.youtube.com/embed/oVOnRPefcno"
      },
      {
        type: 'quiz',
        title: "Quiz: Construção",
        content: "Qual parte da construção fica enterrada no solo?\n\nA) Pilar\nB) Viga\nC) Fundação\nD) Laje"
      }
    ]
  },
  {
    id: 10,
    title: "Projeto de Engenharia",
    description: "Resolva um problema real",
    icon: "Rocket",
    difficulty: "Avançado",
    points: 300,
    color: "bg-gradient-to-r from-orange-500 to-red-500",
    position: { x: 50, y: 5 },
    lessons: [
      {
        type: 'reading',
        title: "O Processo de Design",
        content: "Engenheiras seguem um processo:\n\n1. IDENTIFICAR o problema\n2. PESQUISAR soluções\n3. IMAGINAR possibilidades\n4. PLANEJAR a melhor\n5. CRIAR um protótipo\n6. TESTAR e melhorar"
      },
      {
        type: 'practice',
        title: "Identifique um Problema",
        content: "Escolha um problema da sua comunidade que a engenharia poderia resolver."
      },
      {
        type: 'practice',
        title: "Crie seu Protótipo",
        content: "Construa um modelo da sua solução usando materiais recicláveis!"
      },
      {
        type: 'reading',
        title: "Você é uma Engenheira!",
        content: "🎉 PARABÉNS! 🎉\n\nVocê completou a trilha de engenharia! Agora você sabe que pode construir, criar e resolver problemas!\n\nO mundo precisa de mais engenheiras. Continue construindo o futuro! 💜"
      }
    ]
  }
];

export const mathPathLevels: PathLevel[] = [
  {
    id: 1,
    title: "Números e Padrões",
    description: "A matemática está em toda parte",
    icon: "Hash",
    difficulty: "Iniciante",
    points: 50,
    color: "bg-purple-500",
    position: { x: 50, y: 95 },
    lessons: [
      {
        type: 'reading',
        title: "Matemática é Linguagem Universal",
        content: "A matemática é a mesma em qualquer país! 2 + 2 = 4 no Brasil, no Japão e em Marte!"
      },
      {
        type: 'video',
        title: "Padrões na Natureza",
        content: "A natureza está cheia de matemática!",
        videoUrl: "https://www.youtube.com/embed/4Rk1eiLQ4G0"
      },
      {
        type: 'practice',
        title: "Caça aos Padrões",
        content: "Encontre 5 padrões matemáticos na natureza: em flores, folhas, frutas..."
      },
      {
        type: 'quiz',
        title: "Quiz: Padrões",
        content: "Qual número vem depois: 2, 4, 8, 16, ?\n\nA) 20\nB) 24\nC) 32\nD) 18"
      }
    ]
  },
  {
    id: 2,
    title: "Geometria Básica",
    description: "Formas e espaço",
    icon: "Triangle",
    difficulty: "Iniciante",
    points: 75,
    color: "bg-blue-500",
    position: { x: 20, y: 85 },
    lessons: [
      {
        type: 'reading',
        title: "Formas Geométricas",
        content: "Formas 2D:\n▲ Triângulo: 3 lados\n■ Quadrado: 4 lados iguais\n⬡ Hexágono: 6 lados\n⬤ Círculo: sem lados\n\nFormas 3D:\n- Cubo, esfera, pirâmide, cilindro"
      },
      {
        type: 'practice',
        title: "Arte Geométrica",
        content: "Crie uma obra de arte usando apenas formas geométricas!"
      },
      {
        type: 'reading',
        title: "Perímetro e Área",
        content: "PERÍMETRO: Soma de todos os lados (contorno)\nÁREA: Espaço dentro da forma\n\nQuadrado 4x4:\n- Perímetro = 4+4+4+4 = 16\n- Área = 4x4 = 16"
      },
      {
        type: 'quiz',
        title: "Quiz: Geometria",
        content: "Quantos lados tem um hexágono?\n\nA) 4\nB) 5\nC) 6\nD) 8"
      }
    ]
  },
  {
    id: 3,
    title: "Frações Divertidas",
    description: "Partes do todo",
    icon: "PieChart",
    difficulty: "Iniciante",
    points: 100,
    color: "bg-pink-500",
    position: { x: 80, y: 75 },
    lessons: [
      {
        type: 'reading',
        title: "O que são Frações?",
        content: "Frações representam partes de um todo!\n\n1/2 = uma de duas partes (metade)\n1/4 = uma de quatro partes (um quarto)\n3/4 = três de quatro partes"
      },
      {
        type: 'practice',
        title: "Pizza Matemática",
        content: "Desenhe pizzas divididas em partes iguais e pinte as frações: 1/2, 1/4, 3/8"
      },
      {
        type: 'video',
        title: "Somando Frações",
        content: "Para somar frações, os denominadores precisam ser iguais!",
        videoUrl: "https://www.youtube.com/embed/NxiNV9wz0fs"
      },
      {
        type: 'quiz',
        title: "Quiz: Frações",
        content: "Quanto é 1/4 + 1/4?\n\nA) 2/8\nB) 1/2\nC) 2/4\nD) B e C estão certas"
      }
    ]
  },
  {
    id: 4,
    title: "Porcentagens",
    description: "Partes de 100",
    icon: "Percent",
    difficulty: "Intermediário",
    points: 125,
    color: "bg-green-500",
    position: { x: 30, y: 65 },
    lessons: [
      {
        type: 'reading',
        title: "Porcentagem = Por Cem",
        content: "50% = 50 de 100 = metade\n25% = 25 de 100 = um quarto\n100% = tudo\n\nPorcentagem é fração com denominador 100!"
      },
      {
        type: 'practice',
        title: "Descontos",
        content: "Um produto custa R$100. Calcule o preço com:\n- 10% de desconto\n- 25% de desconto\n- 50% de desconto"
      },
      {
        type: 'reading',
        title: "Calculando Porcentagens",
        content: "Para calcular X% de um número:\n1. Divida o número por 100\n2. Multiplique por X\n\n20% de 150 = 150 ÷ 100 × 20 = 30"
      },
      {
        type: 'quiz',
        title: "Quiz: Porcentagens",
        content: "Quanto é 10% de 200?\n\nA) 10\nB) 20\nC) 100\nD) 2"
      }
    ]
  },
  {
    id: 5,
    title: "Álgebra Básica",
    description: "Letras na matemática",
    icon: "Variable",
    difficulty: "Intermediário",
    points: 150,
    color: "bg-indigo-500",
    position: { x: 70, y: 55 },
    lessons: [
      {
        type: 'reading',
        title: "O que é Álgebra?",
        content: "Álgebra usa letras para representar números desconhecidos!\n\nx + 5 = 10\nQual é o valor de x?\nx = 5 ✓"
      },
      {
        type: 'practice',
        title: "Resolva as Equações",
        content: "Encontre o valor de x:\n1. x + 3 = 7\n2. x - 4 = 6\n3. 2x = 10\n4. x/2 = 5"
      },
      {
        type: 'video',
        title: "Equações do 1º Grau",
        content: "Isole a variável para encontrar o resultado!",
        videoUrl: "https://www.youtube.com/embed/R9I2v6zCzfg"
      },
      {
        type: 'quiz',
        title: "Quiz: Álgebra",
        content: "Se 3x = 15, quanto vale x?\n\nA) 3\nB) 5\nC) 12\nD) 45"
      }
    ]
  },
  {
    id: 6,
    title: "Probabilidade",
    description: "Chances e sorte",
    icon: "Dices",
    difficulty: "Intermediário",
    points: 175,
    color: "bg-red-500",
    position: { x: 40, y: 45 },
    lessons: [
      {
        type: 'reading',
        title: "O que é Probabilidade?",
        content: "Probabilidade mede a chance de algo acontecer!\n\nProbabilidade = Casos favoráveis ÷ Casos possíveis\n\nMoeda: Chance de cara = 1/2 = 50%\nDado: Chance de tirar 6 = 1/6 ≈ 17%"
      },
      {
        type: 'practice',
        title: "Experimento com Dados",
        content: "Jogue um dado 30 vezes e anote os resultados. Compare com a teoria!"
      },
      {
        type: 'reading',
        title: "Eventos Compostos",
        content: "Duas moedas: Chances de duas caras?\n\nPossibilidades: CC, CK, KC, KK\nChance de CC = 1/4 = 25%"
      },
      {
        type: 'quiz',
        title: "Quiz: Probabilidade",
        content: "Qual a chance de tirar um número par em um dado?\n\nA) 1/6\nB) 1/3\nC) 1/2\nD) 2/3"
      }
    ]
  },
  {
    id: 7,
    title: "Estatística",
    description: "Dados e análises",
    icon: "BarChart",
    difficulty: "Intermediário",
    points: 200,
    color: "bg-teal-500",
    position: { x: 60, y: 35 },
    lessons: [
      {
        type: 'reading',
        title: "Média, Mediana e Moda",
        content: "MÉDIA: Soma ÷ Quantidade\nMEDIANA: Valor do meio\nMODA: Valor que mais aparece\n\nNotas: 7, 8, 8, 9, 10\n- Média = 42÷5 = 8,4\n- Mediana = 8\n- Moda = 8"
      },
      {
        type: 'practice',
        title: "Pesquisa de Dados",
        content: "Faça uma pesquisa com 10 pessoas sobre algo (idade, cor favorita, altura) e calcule média, mediana e moda!"
      },
      {
        type: 'video',
        title: "Gráficos",
        content: "Gráficos ajudam a visualizar dados!",
        videoUrl: "https://www.youtube.com/embed/B9JH1RzQJxI"
      },
      {
        type: 'quiz',
        title: "Quiz: Estatística",
        content: "No conjunto 2, 3, 3, 4, 5, qual é a moda?\n\nA) 2\nB) 3\nC) 3,4\nD) 4"
      }
    ]
  },
  {
    id: 8,
    title: "Sequência de Fibonacci",
    description: "A proporção áurea",
    icon: "Infinity",
    difficulty: "Avançado",
    points: 225,
    color: "bg-yellow-500",
    position: { x: 25, y: 25 },
    lessons: [
      {
        type: 'reading',
        title: "A Sequência Mágica",
        content: "1, 1, 2, 3, 5, 8, 13, 21, 34...\n\nCada número é a soma dos dois anteriores!\n\nEssa sequência aparece em:\n- Pétalas de flores\n- Conchas de caracol\n- Galáxias espirais"
      },
      {
        type: 'video',
        title: "Fibonacci na Natureza",
        content: "A natureza ama Fibonacci!",
        videoUrl: "https://www.youtube.com/embed/SjSHVDfXHQ4"
      },
      {
        type: 'practice',
        title: "Espiral de Fibonacci",
        content: "Desenhe quadrados com lados 1, 1, 2, 3, 5, 8... e conecte-os formando uma espiral!"
      },
      {
        type: 'quiz',
        title: "Quiz: Fibonacci",
        content: "Qual o próximo número: 8, 13, 21, ?\n\nA) 28\nB) 32\nC) 34\nD) 42"
      }
    ]
  },
  {
    id: 9,
    title: "Lógica Matemática",
    description: "Pense logicamente",
    icon: "Brain",
    difficulty: "Avançado",
    points: 250,
    color: "bg-orange-500",
    position: { x: 75, y: 15 },
    lessons: [
      {
        type: 'reading',
        title: "Proposições e Conectivos",
        content: "Lógica usa:\n- E (∧): Ambos verdadeiros\n- OU (∨): Pelo menos um verdadeiro\n- NÃO (¬): Inverte\n- SE...ENTÃO (→): Implicação"
      },
      {
        type: 'practice',
        title: "Enigmas Lógicos",
        content: "Ana, Bia e Carol têm camisas vermelha, azul e verde.\n- Ana não usa vermelho\n- Bia não usa azul nem vermelho\nQual a cor de cada uma?"
      },
      {
        type: 'reading',
        title: "Provas Matemáticas",
        content: "Matemáticas provam verdades usando lógica!\n\nTipo de provas:\n- Direta\n- Por contradição\n- Por indução"
      },
      {
        type: 'quiz',
        title: "Quiz: Lógica",
        content: "Se 'A E B' é verdadeiro, o que sabemos?\n\nA) A é verdadeiro\nB) B é verdadeiro\nC) Ambos são verdadeiros\nD) Pelo menos um é verdadeiro"
      }
    ]
  },
  {
    id: 10,
    title: "Projeto Matemático",
    description: "Matemática no mundo real",
    icon: "Rocket",
    difficulty: "Avançado",
    points: 300,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    position: { x: 50, y: 5 },
    lessons: [
      {
        type: 'reading',
        title: "Matemática Resolve Problemas",
        content: "Matemática está em todo lugar:\n- Finanças pessoais\n- Jogos\n- Música\n- Arte\n- Esportes\n- Medicina"
      },
      {
        type: 'practice',
        title: "Escolha seu Projeto",
        content: "Escolha um tema e use matemática:\n- Planeje uma festa (orçamento)\n- Analise seu time (estatísticas)\n- Crie arte geométrica\n- Componha música com frações"
      },
      {
        type: 'practice',
        title: "Apresente sua Descoberta",
        content: "Crie uma apresentação mostrando como você usou matemática para resolver um problema real!"
      },
      {
        type: 'reading',
        title: "Você é uma Matemática!",
        content: "🎉 PARABÉNS! 🎉\n\nVocê completou a trilha de matemática! Agora você vê números e padrões por toda parte!\n\nO mundo precisa de mais meninas na matemática. Continue calculando, analisando e descobrindo! 💜"
      }
    ]
  }
];

export const getPathLevelsForArea = (area: string): PathLevel[] => {
  switch (area) {
    case "Ciência":
      return sciencePathLevels;
    case "Tecnologia":
      return technologyPathLevels;
    case "Engenharia":
      return engineeringPathLevels;
    case "Matemática":
      return mathPathLevels;
    default:
      return sciencePathLevels;
  }
};
