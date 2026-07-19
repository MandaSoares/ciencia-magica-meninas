export interface LessonStep {
  type: 'video' | 'reading' | 'practice' | 'quiz' | 'inspiration';
  title: string;
  content: string;
  videoUrl?: string;
  correctAnswer?: string;
  explanation?: string;
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

const areaNames: Record<string, string> = {
  science: "Ciência",
  technology: "Tecnologia",
  engineering: "Engenharia",
  math: "Matemática"
};

export const getAreaName = (area: string): string => {
  return areaNames[area] || "STEM";
};

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
        content: "Ciência é a arte de fazer perguntas e descobrir respostas sobre o mundo ao nosso redor! Neste vídeo, você vai ver como a curiosidade de pessoas comuns levou a descobertas que mudaram o mundo.",
        videoUrl: "https://www.youtube.com/embed/RI3fOdMM7ck"
      },
      {
        type: 'reading',
        title: "O Método Científico",
        content: "🔬 O método científico é o superpoder de toda cientista! É como um mapa que nos guia na busca por respostas.\n\n**As 6 etapas:**\n\n1. **Observar** — Tudo começa com curiosidade! Você percebe algo interessante. Por exemplo: \"Por que as folhas mudam de cor no outono?\"\n\n2. **Perguntar** — Transforme sua curiosidade em uma pergunta clara: \"A mudança de temperatura causa a mudança de cor?\"\n\n3. **Hipótese** — Crie uma explicação possível (um palpite educado!): \"Acredito que o frio faz as folhas mudarem de cor.\"\n\n4. **Testar** — Faça um experimento! Compare folhas em ambientes frios e quentes.\n\n5. **Analisar** — Olhe os resultados com atenção. Os dados confirmam sua hipótese?\n\n6. **Concluir** — Compartilhe o que descobriu! Se não funcionou, tudo bem — isso também é ciência!\n\n💡 **Curiosidade:** Muitas das maiores descobertas científicas aconteceram por acidente! A penicilina (que salva milhões de vidas) foi descoberta quando Alexander Fleming percebeu um mofo estranho em suas placas de laboratório. Ele observou, perguntou, testou — e mudou a medicina para sempre!"
      },
      {
        type: 'inspiration',
        title: "Mulheres que Revolucionaram a Ciência",
        content: "**Marie Curie (1867–1934)** nasceu na Polônia em uma época em que mulheres não podiam frequentar universidades. Mesmo assim, ela mudou-se para Paris, estudou em condições difíceis e se tornou a primeira pessoa a ganhar DOIS Prêmios Nobel — um em Física e outro em Química! Ela descobriu o rádio e o polônio, elementos que revolucionaram a medicina e salvam vidas até hoje através da radioterapia.\n\n**Rosalind Franklin (1920–1958)** tirou a famosa \"Foto 51\" usando raios-X, que revelou a estrutura helicoidal do DNA — o código genético de toda a vida! Sem o trabalho dela, a biologia moderna não existiria como conhecemos.\n\n**Jane Goodall (nascida em 1934)** foi para a Tanzânia aos 26 anos, sem diploma universitário, e passou 60 anos estudando chimpanzés. Ela descobriu que eles usam ferramentas, têm emoções complexas e personalidades únicas — revolucionando nossa compreensão sobre os animais.\n\n**Jaqueline Goes de Jesus** é a cientista brasileira que sequenciou o genoma do coronavírus em apenas 48 horas, ajudando o mundo inteiro a combater a pandemia!\n\nVocê pode ser a próxima grande cientista! 💜"
      },
      {
        type: 'quiz',
        title: "Quiz: O Método Científico",
        content: "Qual é a primeira etapa do método científico?\n\nA) Hipótese — criar uma explicação\nB) Observação — notar algo interessante\nC) Experimentação — testar uma ideia\nD) Conclusão — anunciar o resultado",
        correctAnswer: "B",
        explanation: "Perfeito! A observação é sempre o primeiro passo. Toda grande descoberta começa quando alguém observa algo curioso e pensa: \"Hmm, por que isso acontece?\" A curiosidade é o combustível da ciência!"
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
        title: "A Máquina Mais Incrível do Mundo",
        content: "🦴 Seu corpo é mais complexo do que qualquer computador ou foguete já construído! Veja fatos que vão explodir sua mente:\n\n⭐ **Ossos:** Bebês nascem com cerca de 300 ossos, mas adultos têm só 206. Isso acontece porque muitos ossos se fundem conforme crescemos! Seus ossos são mais fortes que concreto — um pedaço de osso do tamanho de uma caixa de fósforo pode suportar 9 toneladas.\n\n💧 **Água:** Cerca de 70% do seu corpo é água. Seu cérebro é 80% água! Por isso beber água ajuda a pensar melhor.\n\n🧠 **Cérebro:** Seu cérebro tem 86 bilhões de neurônios — mais do que o número de estrelas na Via Láctea! Ele produz eletricidade suficiente para acender uma lâmpada de LED e processa informações mais rápido que qualquer supercomputador.\n\n❤️ **Coração:** Bate cerca de 100.000 vezes por dia, 35 milhões de vezes por ano! Em uma vida, ele bombeia sangue suficiente para encher 200 vagões de trem.\n\n👁️ **Olhos:** Distinguem cerca de 10 milhões de cores diferentes! Suas pupilas dilatam até 45% quando você olha para algo que ama.\n\n🫁 **Pulmões:** Se esticássemos todos os vasos sanguíneos dos pulmões, dariam a volta ao mundo! Você respira cerca de 22.000 vezes por dia sem nem pensar nisso."
      },
      {
        type: 'video',
        title: "Sistemas do Corpo Humano",
        content: "Neste vídeo, vamos descobrir como os diferentes sistemas do seu corpo trabalham juntos 24 horas por dia para mantê-la viva e saudável!",
        videoUrl: "https://www.youtube.com/embed/RI3fOdMM7ck"
      },
      {
        type: 'practice',
        title: "Experimento: Medindo seus Batimentos",
        content: "🫀 **Vamos investigar como uma cientista de verdade!**\n\n**Materiais:** Um relógio ou celular com cronômetro, papel e caneta.\n\n**Parte 1 — Batimentos em repouso:**\n1. Sente-se confortavelmente por 2 minutos\n2. Coloque os dedos indicador e médio no pulso (abaixo do polegar)\n3. Sinta a pulsação — cada \"toc\" é seu coração bombeando sangue!\n4. Conte os batimentos por 15 segundos\n5. Multiplique por 4 = seus batimentos por minuto (BPM)\n6. Anote o resultado\n\n**Parte 2 — Batimentos após exercício:**\n1. Pule ou corra no lugar por 1 minuto\n2. Imediatamente conte seus batimentos novamente\n3. Anote o resultado\n\n**Parte 3 — Análise científica:**\n- Qual foi a diferença entre repouso e exercício?\n- Por que o coração bate mais rápido ao se exercitar?\n- Quanto tempo levou para voltar ao normal?\n\n💡 **Resposta:** O exercício exige mais oxigênio nos músculos, então o coração precisa bombear sangue mais rápido! Normal em repouso: 60-100 BPM."
      },
      {
        type: 'quiz',
        title: "Quiz do Corpo Humano",
        content: "Quantos ossos um bebê tem quando nasce?\n\nA) 100 ossos\nB) 206 ossos (igual ao adulto)\nC) Cerca de 300 ossos\nD) 500 ossos",
        correctAnswer: "C",
        explanation: "Isso mesmo! Bebês nascem com cerca de 300 ossos. Conforme crescem, muitos ossos pequenos se fundem, formando ossos maiores. Por isso adultos têm apenas 206. É como peças de um quebra-cabeça que se juntam!"
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
        title: "Química: A Ciência da Transformação",
        content: "🧪 Química é o estudo da matéria — tudo que tem massa e ocupa espaço — e como ela se transforma!\n\n**Tudo é feito de átomos:**\nÁtomos são partículas tão pequenas que um milhão deles caberiam na ponta de um fio de cabelo! Eles se combinam para formar moléculas. Por exemplo, a água (H₂O) é feita de 2 átomos de hidrogênio e 1 de oxigênio.\n\n**Química no seu dia a dia:**\n\n🍳 **Cozinhar** — Quando você frita um ovo, o calor muda a estrutura das proteínas. É por isso que ele fica branco e firme! Essa transformação é irreversível — você não consegue \"desfritar\" um ovo.\n\n🧼 **Lavar as mãos** — O sabão é uma molécula incrível: uma ponta \"gruda\" na sujeira e na gordura, e a outra ponta \"gruda\" na água. Assim, o sabão arrasta a sujeira embora!\n\n🍞 **Pão crescendo** — O fermento produz gás carbônico (CO₂). Essas bolhinhas de gás ficam presas na massa e fazem o pão crescer e ficar fofinho.\n\n🔥 **Fogo** — É uma reação química chamada combustão. O material reage com o oxigênio do ar, produzindo calor e luz.\n\n🌱 **Fotossíntese** — Plantas usam luz solar para transformar água e gás carbônico em açúcar e oxigênio. É a reação química que mantém a vida na Terra!"
      },
      {
        type: 'video',
        title: "Reações Químicas Incríveis",
        content: "Veja experimentos químicos impressionantes e seguros que mostram como a matéria se transforma!",
        videoUrl: "https://www.youtube.com/embed/RSgCMx-QTVo"
      },
      {
        type: 'practice',
        title: "Experimento: Vulcão de Vinagre e Bicarbonato",
        content: "🌋 **Crie sua própria erupção química!**\n\n**Materiais:**\n- 1 copo ou garrafa plástica pequena\n- 3 colheres de sopa de bicarbonato de sódio\n- 1/2 xícara de vinagre\n- Corante alimentício (opcional, para ficar colorido!)\n- Detergente líquido (1 colher — faz mais espuma!)\n- Uma bandeja para não fazer sujeira\n\n**Passo a passo:**\n1. Coloque o copo na bandeja\n2. Adicione o bicarbonato de sódio\n3. Adicione 1 colher de detergente\n4. Coloque algumas gotas de corante\n5. Despeje o vinagre DEVAGAR\n6. Observe a erupção!\n\n**O que está acontecendo? (A ciência!)**\nO vinagre é um ácido (ácido acético) e o bicarbonato é uma base. Quando um ácido reage com uma base, eles se neutralizam e produzem gás carbônico (CO₂). As bolhas que você vê são esse gás escapando! O detergente captura o gás em bolhas, fazendo a espuma subir como lava.\n\n**Para investigar mais:**\n- O que muda se usar mais vinagre?\n- E se usar água quente vs. fria?\n- Diferentes tipos de vinagre fazem diferença?"
      },
      {
        type: 'quiz',
        title: "Quiz de Química",
        content: "O que são átomos?\n\nA) Tipos de células do corpo\nB) As menores partículas que formam a matéria\nC) Tipos de energia renovável\nD) Moléculas grandes encontradas nas plantas",
        correctAnswer: "B",
        explanation: "Exato! Átomos são os blocos fundamentais de tudo que existe. Cada elemento (como ouro, oxigênio, carbono) é feito de um tipo diferente de átomo. Eles são tão pequenos que um milhão caberiam no ponto final desta frase!"
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
        title: "As Leis de Newton: As Regras do Movimento",
        content: "🍎 Em 1687, Isaac Newton publicou três leis que explicam como TUDO se move — de uma bola de futebol a um planeta!\n\n**1ª Lei — Inércia (Lei da Preguiça):**\nObjetos parados querem ficar parados. Objetos em movimento querem continuar se movendo. Só mudam quando uma força atua sobre eles.\n\n💡 **No dia a dia:** É por isso que usamos cinto de segurança! Quando o carro freia de repente, SEU CORPO quer continuar em movimento (inércia). O cinto é a força que te segura. Também é por isso que é difícil parar de escorregar no gelo — seu corpo quer continuar deslizando!\n\n**2ª Lei — Força = Massa × Aceleração (F = m × a):**\nQuanto mais força você aplica, mais rápido algo acelera. Mas quanto mais pesado o objeto, mais força você precisa.\n\n💡 **No dia a dia:** É mais fácil empurrar um carrinho de supermercado vazio do que um cheio! E quando você chuta uma bola com mais força, ela vai mais longe.\n\n**3ª Lei — Ação e Reação:**\nPara toda ação, existe uma reação IGUAL na direção OPOSTA.\n\n💡 **No dia a dia:** Foguetes funcionam assim! O motor empurra gases para BAIXO (ação), e os gases empurram o foguete para CIMA (reação). Quando você pula, seus pés empurram o chão para baixo e o chão empurra você para cima!"
      },
      {
        type: 'video',
        title: "Física na Prática",
        content: "Veja demonstrações incríveis das leis da física em ação — de montanhas-russas a foguetes espaciais!",
        videoUrl: "https://www.youtube.com/embed/KxMSloKEZFQ"
      },
      {
        type: 'practice',
        title: "Experimento: Testando a Gravidade e o Ar",
        content: "🍃 **Galileu fez um experimento parecido há 400 anos!**\n\n**Materiais:** Uma folha de papel, uma moeda e uma régua\n\n**Parte 1 — O desafio:**\n1. Segure a folha aberta em uma mão e a moeda na outra\n2. Solte os dois ao mesmo tempo da MESMA altura\n3. Observe: qual chegou primeiro ao chão?\n4. Anote sua observação\n\n**Parte 2 — Eliminando o ar:**\n1. Agora amasse a folha bem apertada em uma bolinha\n2. Solte a bolinha e a moeda ao mesmo tempo\n3. O que mudou? Eles caem juntos agora?\n\n**Parte 3 — Entendendo:**\nA gravidade puxa tudo com a MESMA força. O que fez a folha cair devagar na Parte 1 foi a resistência do ar! A folha aberta tem mais superfície, então o ar a segura mais. Na Parte 2, a bolinha de papel corta o ar melhor.\n\n🌙 **Curiosidade incrível:** Na Lua, onde não tem ar, o astronauta David Scott soltou um martelo e uma pena — e os dois caíram JUNTOS! Galileu tinha razão 400 anos antes!"
      },
      {
        type: 'quiz',
        title: "Quiz de Física",
        content: "A 3ª Lei de Newton (ação e reação) explica como funcionam:\n\nA) As marés dos oceanos\nB) Foguetes que sobem ao espaço\nC) A velocidade da luz\nD) As estações do ano na Terra",
        correctAnswer: "B",
        explanation: "Isso mesmo! Foguetes são o exemplo perfeito da 3ª Lei. O motor empurra gases para baixo (ação) e os gases empurram o foguete para cima (reação). Não precisa de \"chão\" para se apoiar — funciona até no vácuo do espaço!"
      }
    ]
  },
  {
    id: 5,
    title: "Biologia: A Vida na Terra",
    description: "Explore a incrível diversidade da vida",
    icon: "Leaf",
    difficulty: "Intermediário",
    points: 50,
    color: "bg-emerald-500",
    lessons: [
      {
        type: 'reading',
        title: "O que Torna Algo Vivo?",
        content: "🌱 De bactérias invisíveis a baleias gigantes, a vida na Terra é extraordinariamente diversa. Mas o que todas as formas de vida têm em comum?\n\n**7 características de TODO ser vivo:**\n\n✅ **Organização** — São formados por células (a unidade básica da vida). Uma bactéria tem 1 célula. Você tem cerca de 37 TRILHÕES!\n\n✅ **Metabolismo** — Transformam energia. Plantas usam luz solar (fotossíntese). Animais digerem alimentos.\n\n✅ **Crescimento** — Começam pequenos e se desenvolvem. Você já foi do tamanho de um ponto final!\n\n✅ **Reprodução** — Geram descendentes. Alguns se dividem ao meio, outros põem ovos, outros gestam filhotes.\n\n✅ **Resposta ao ambiente** — Reagem a estímulos. Girassóis giram em direção ao sol. Você fecha os olhos com luz forte.\n\n✅ **Homeostase** — Mantêm equilíbrio interno. Seu corpo mantém a temperatura em ~37°C, esteja frio ou calor.\n\n✅ **Evolução** — Populações mudam ao longo de milhares de anos, adaptando-se ao ambiente.\n\n**Os 5 reinos da vida:**\n- 👑 **Animais** — Mais de 8 milhões de espécies!\n- 🌸 **Plantas** — Cerca de 400.000 espécies\n- 🍄 **Fungos** — De cogumelos a leveduras do pão\n- 🦠 **Bactérias** — Os seres vivos mais antigos (3,5 bilhões de anos!)\n- 🔬 **Protistas** — Amebas, algas e outros organismos simples\n\n💡 **Fato surpreendente:** Existem mais bactérias no seu corpo do que células humanas!"
      },
      {
        type: 'video',
        title: "A Célula: A Unidade da Vida",
        content: "Conheça as células — os tijolos microscópicos que formam TODOS os seres vivos, de uma formiga a uma sequoia gigante!",
        videoUrl: "https://www.youtube.com/embed/RI3fOdMM7ck"
      },
      {
        type: 'practice',
        title: "Seja uma Bióloga de Campo!",
        content: "🔍 **Missão de observação científica — como Jane Goodall fazia!**\n\n**Materiais:** Caderno, lápis, celular (para fotos)\n\n**Missão (30 minutos):**\nVá ao quintal, parque, praça, ou observe pela janela.\n\n**Para cada ser vivo que encontrar, anote:**\n1. Nome (se souber) ou descrição\n2. Reino (animal, planta, fungo?)\n3. O que estava fazendo quando você observou\n4. Características que notou (cor, tamanho, formato)\n5. Desenhe pelo menos 3 organismos!\n\n**Tabela de registro:**\n| Ser vivo | Reino | Comportamento | Desenho |\n|----------|-------|---------------|---------|\n| (preencha) | | | |\n\n**Reflexão científica:**\n- Quantas espécies diferentes encontrou?\n- Quais reinos estão mais representados?\n- Algum ser vivo interagia com outro? (ex: abelha na flor)\n- O que você observou que te surpreendeu?\n\n📝 Parabéns! Você acabou de fazer trabalho de campo — exatamente como biólogas profissionais!"
      },
      {
        type: 'quiz',
        title: "Quiz de Biologia",
        content: "O que TODOS os seres vivos têm em comum?\n\nA) São grandes o suficiente para ver a olho nu\nB) São formados por células\nC) Possuem olhos para enxergar\nD) Conseguem se mover de um lugar para outro",
        correctAnswer: "B",
        explanation: "Perfeito! Todos os seres vivos são formados por células — desde bactérias com 1 única célula até baleias com trilhões! Nem todos são grandes (bactérias são invisíveis), nem todos têm olhos (plantas não têm), e nem todos se movem (árvores ficam fixas). Mas todos têm células!"
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
        title: "Ecossistemas: Tudo Está Conectado",
        content: "🌍 Um ecossistema é como uma teia gigante onde cada ser vivo está conectado a todos os outros!\n\n**Componentes de um ecossistema:**\n- **Bióticos (vivos):** Plantas, animais, fungos, bactérias\n- **Abióticos (não vivos):** Água, luz solar, solo, temperatura, ar\n\n**Ecossistemas brasileiros incríveis:**\n- 🌴 **Amazônia** — A maior floresta tropical do mundo! Abriga 10% de TODAS as espécies do planeta. Produz 20% do oxigênio mundial.\n- 🌿 **Cerrado** — A savana mais biodiversa do mundo, com mais de 12.000 espécies de plantas!\n- 🌊 **Mata Atlântica** — Já cobriu 15% do Brasil. Hoje resta menos de 12%, mas ainda abriga milhares de espécies únicas.\n- 🏜️ **Caatinga** — Único no mundo! Plantas e animais que só existem aqui, adaptados ao clima seco.\n\n**Como a energia flui (cadeia alimentar):**\n☀️ Sol → 🌱 Plantas (produtoras) → 🐛 Herbívoros (consumidores primários) → 🐸 Carnívoros pequenos (secundários) → 🦅 Predadores de topo (terciários) → 🍄 Decompositores (reciclam tudo!)\n\n💡 **Conceito importante — Teia alimentar:** Na vida real, as relações são mais complexas que uma cadeia simples. Um sapo come insetos E minhocas. Uma coruja come sapos E ratos. Isso forma uma TEIA de conexões. Se uma espécie desaparece, toda a teia é afetada!"
      },
      {
        type: 'video',
        title: "Protegendo Nosso Planeta",
        content: "Como nossas ações afetam os ecossistemas e o que podemos fazer para protegê-los?",
        videoUrl: "https://www.youtube.com/embed/RI3fOdMM7ck"
      },
      {
        type: 'practice',
        title: "Projeto Eco-Detetive",
        content: "♻️ **Sua missão: investigar o impacto ambiental da sua família!**\n\n**Semana 1 — Investigação (anote durante 3 dias):**\n1. Quantos sacos de lixo sua família produz por dia?\n2. Quanto desse lixo poderia ser reciclado?\n3. Quanto tempo o chuveiro fica ligado em cada banho?\n4. Quantas luzes ficam acesas em cômodos vazios?\n\n**Semana 2 — Ação (escolha pelo menos 2):**\n- 🗑️ **Reduzir:** Use garrafas reutilizáveis ao invés de descartáveis\n- ♻️ **Reciclar:** Separe o lixo em orgânico, reciclável e rejeito\n- 💧 **Economizar:** Reduza o tempo do banho em 2 minutos\n- 💡 **Poupar energia:** Desligue luzes ao sair dos cômodos\n- 🌱 **Plantar:** Plante uma muda de árvore ou tempero\n\n**Relatório final:**\n- O que você mudou?\n- Quanto lixo/água/energia economizou?\n- Como se sentiu fazendo a diferença?\n\n🌍 Se cada pessoa fizer pequenas mudanças, o impacto global é enorme!"
      },
      {
        type: 'quiz',
        title: "Quiz de Ecologia",
        content: "Na cadeia alimentar, quem são os primeiros a receber energia do sol?\n\nA) Carnívoros como a onça\nB) Decompositores como fungos\nC) Herbívoros como a capivara\nD) Produtores como as plantas",
        correctAnswer: "D",
        explanation: "Isso aí! As plantas são as produtoras — elas capturam energia do sol através da fotossíntese e a transformam em alimento. Toda a energia de um ecossistema começa com elas! Herbívoros comem plantas, carnívoros comem herbívoros, e decompositores reciclam tudo de volta ao solo."
      }
    ]
  }
];

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
        content: "Tecnologia é qualquer ferramenta, técnica ou conhecimento que usamos para resolver problemas e facilitar a vida! De uma pedra lascada a um smartphone, tudo é tecnologia.",
        videoUrl: "https://www.youtube.com/embed/7_LPdttKXPc"
      },
      {
        type: 'reading',
        title: "A Evolução da Tecnologia",
        content: "📱 Tecnologia não é só celular e computador — é qualquer ferramenta criada para resolver um problema!\n\n**Uma linha do tempo fascinante:**\n\n🪨 **3,3 milhões de anos atrás** — Primeiras ferramentas de pedra\n🔥 **1 milhão de anos atrás** — Controle do fogo (a tecnologia mais transformadora da história!)\n🛞 **3500 a.C.** — Invenção da roda na Mesopotâmia\n✍️ **3200 a.C.** — Escrita (a primeira tecnologia de armazenamento de dados!)\n📖 **1440** — Prensa de Gutenberg (permitiu imprimir livros em massa)\n💡 **1879** — Lâmpada elétrica de Thomas Edison\n📞 **1876** — Telefone de Alexander Graham Bell\n💻 **1945** — Primeiro computador eletrônico (ENIAC) — ocupava uma sala inteira!\n🌐 **1991** — World Wide Web (internet como conhecemos)\n📱 **2007** — Primeiro iPhone (computador no bolso!)\n🤖 **2020s** — Inteligência Artificial acessível a todos\n\n💡 **Percebeu algo?** A velocidade das inovações está ACELERANDO. Levou milhões de anos para ir da pedra ao fogo, mas apenas 30 anos para ir da internet ao smartphone. Imagine o que virá nos próximos 10 anos — e VOCÊ pode ser quem cria!"
      },
      {
        type: 'inspiration',
        title: "Mulheres Pioneiras da Tecnologia",
        content: "**Ada Lovelace (1815–1852)** é considerada a primeira programadora da história! Em uma época sem computadores, ela escreveu algoritmos para a \"Máquina Analítica\" de Charles Babbage. Ela previu que máquinas poderiam criar música e arte — 100 anos antes dos computadores existirem!\n\n**Grace Hopper (1906–1992)** era oficial da Marinha americana e inventou o primeiro compilador — programa que traduz linguagem humana para linguagem de máquina. Ela também popularizou o termo \"bug\" (inseto) na computação, quando um inseto de verdade causou erro em um computador!\n\n**Margaret Hamilton (1936–presente)** liderou a equipe que escreveu o software de navegação da Apollo 11. Quando um alarme quase abortou o pouso na Lua, o software DELA salvou a missão! Ela cunhou o termo \"engenharia de software\".\n\n**Radia Perlman (1951–presente)** inventou o protocolo STP, que é a base de como a internet funciona. É chamada de \"Mãe da Internet\".\n\n**Kátia Vega** é uma cientista brasileira que criou tecnologias vestíveis (wearable tech) integradas à beleza e moda, combinando computação com cosméticos condutivos!\n\nVocê pode ser a próxima! 💜"
      },
      {
        type: 'quiz',
        title: "Quiz: História da Tecnologia",
        content: "Qual dessas é considerada uma das tecnologias mais antigas da humanidade?\n\nA) Smartphone\nB) Roda\nC) Computador\nD) Videogame",
        correctAnswer: "B",
        explanation: "Excelente! A roda foi inventada por volta de 3500 a.C. na Mesopotâmia — há mais de 5.000 anos! Mas ferramentas de pedra são ainda mais antigas (3,3 milhões de anos). A roda revolucionou o transporte e continua sendo usada em quase toda máquina até hoje."
      }
    ]
  },
  {
    id: 2,
    title: "Como a Internet Funciona",
    description: "O mundo conectado em milissegundos",
    icon: "Sparkles",
    difficulty: "Iniciante",
    points: 35,
    color: "bg-cyan-500",
    lessons: [
      {
        type: 'video',
        title: "A Viagem dos Dados",
        content: "Quando você envia uma mensagem pelo WhatsApp, ela viaja por cabos, servidores e até pelo fundo do oceano antes de chegar ao destino! Vamos acompanhar essa jornada incrível.",
        videoUrl: "https://www.youtube.com/embed/7_LPdttKXPc"
      },
      {
        type: 'reading',
        title: "A Internet por Dentro",
        content: "🌐 A internet é a maior rede de comunicação já criada — conecta mais de 5 bilhões de pessoas!\n\n**O que acontece quando você acessa um site:**\n\n1. 📱 Você digita \"youtube.com\" no navegador\n2. 🔍 Seu dispositivo pergunta ao servidor DNS: \"Qual o endereço desse site?\" (DNS é como uma lista telefônica gigante!)\n3. 📦 Seu pedido é dividido em \"pacotes\" de dados (como cartas dentro de envelopes)\n4. 🌊 Os pacotes viajam por cabos de fibra óptica — incluindo cabos no FUNDO DO OCEANO!\n5. 🏢 Chegam ao servidor do YouTube (um computador gigante que guarda todos os vídeos)\n6. 📨 O servidor envia os dados de volta pelo mesmo caminho\n7. 📱 Seu navegador monta tudo e mostra o site!\n\n⚡ **Tudo isso em milissegundos!**\n\n**Curiosidades fascinantes:**\n- 🌊 Existem mais de 550 cabos submarinos no fundo dos oceanos, totalizando 1,4 milhão de km!\n- 🦈 Tubarões às vezes mordem esses cabos (por isso têm proteção extra)\n- 📡 Apenas ~5% do tráfego da internet vai por satélites — o resto é por cabos!\n- 🌍 Um dado pode dar a volta ao mundo em menos de 1 segundo\n- 📧 Mais de 300 bilhões de emails são enviados por dia"
      },
      {
        type: 'practice',
        title: "Investigando a Internet",
        content: "🔍 **Descubra o caminho que seus dados percorrem!**\n\n**Atividade 1 — Rastreando dados:**\n1. Peça ajuda a um adulto\n2. Abra o Prompt de Comando (Windows) ou Terminal (Mac/Linux)\n3. Digite: tracert google.com (Windows) ou traceroute google.com (Mac)\n4. Observe cada \"salto\" — cada linha é um servidor diferente!\n\n**Perguntas para investigar:**\n- Quantos \"saltos\" foram necessários?\n- Qual foi o tempo de cada salto (em milissegundos)?\n- Algum servidor está em outro país?\n\n**Atividade 2 — Velocidade da sua internet:**\n1. Acesse um site de teste de velocidade\n2. Anote: velocidade de download e upload\n3. Teste em diferentes horários (manhã, tarde, noite)\n4. A velocidade muda? Por que?\n\n**Atividade 3 — Reflexão:**\nImagine que a internet não existisse. Liste 10 coisas do seu dia que seriam diferentes. Quantas dessas coisas existiam há 30 anos?"
      },
      {
        type: 'quiz',
        title: "Quiz da Internet",
        content: "Por onde viaja a MAIOR PARTE dos dados da internet?\n\nA) Apenas por satélites no espaço\nB) Por cabos submarinos de fibra óptica\nC) Por ondas de rádio pelo ar\nD) Por fios de cobre nas ruas",
        correctAnswer: "B",
        explanation: "Acertou! Cerca de 95% de todo o tráfego da internet viaja por cabos de fibra óptica, muitos deles no fundo dos oceanos! São mais de 550 cabos submarinos conectando continentes. Satélites transportam apenas ~5% dos dados."
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
        title: "Programar é como Dar Instruções",
        content: "💻 Programar é a arte de dar instruções precisas para um computador executar!\n\nComputadores são muito rápidos e nunca se cansam, mas não \"pensam\" — eles seguem instruções EXATAMENTE como você escreve. Se a instrução estiver errada, o resultado será errado (mas o computador não vai reclamar!).\n\n**Exemplo: Receita de Sanduíche**\n\nVocê diria a uma amiga: \"Faz um sanduíche pra mim?\"\nPara um computador, seria:\n1. Vá até a cozinha\n2. Abra o armário\n3. Pegue o pacote de pão\n4. Abra o pacote\n5. Retire duas fatias\n6. Coloque na mesa\n7. Abra a geladeira\n8. Pegue a manteiga\n9. Pegue uma faca\n10. Passe manteiga na fatia...\n\n**Conceitos básicos de programação:**\n\n🔁 **Loops (repetição):** \"Faça isso 10 vezes\" — para não repetir instruções!\n❓ **Condicionais:** \"SE chover, ENTÃO leve guarda-chuva, SENÃO leve óculos de sol\"\n📦 **Variáveis:** Caixinhas que guardam informação. Ex: nome = \"Ana\", idade = 12\n🔧 **Funções:** Grupos de instruções com um nome. Ex: \"fazerSanduiche()\" junta todos os passos acima!\n\n💡 **Saber programar é como ter um superpoder:** você pode criar apps, jogos, sites, e resolver problemas que ninguém conseguiu antes!"
      },
      {
        type: 'video',
        title: "Programação para Iniciantes",
        content: "Veja como é divertido dar vida às suas ideias com código! Programar é como montar blocos de LEGO — mas digitais.",
        videoUrl: "https://www.youtube.com/embed/Dv7gLpW91DM"
      },
      {
        type: 'practice',
        title: "Programando uma Pessoa-Robô",
        content: "🤖 **Hora de programar de verdade (sem computador)!**\n\nEsta atividade simula como programadoras pensam.\n\n**Como jogar:**\nPeça para alguém (amiga, irmão, mãe) ser o \"robô\".\n\n**Regras do robô:**\n- Só faz EXATAMENTE o que você manda\n- Se você disser \"ande\", ele anda reto até bater em algo\n- Se não disser \"pare\", ele não para\n- Ele não interpreta — segue ao pé da letra!\n\n**Desafio 1 — Fácil:**\nPrograme o robô para ir da porta da sala até sentar em uma cadeira.\n\n**Desafio 2 — Médio:**\nPrograme o robô para pegar um copo d'água na cozinha e trazer para você.\n\n**Desafio 3 — Difícil:**\nPrograme o robô para fazer um desenho simples (quadrado) com caneta e papel.\n\n**Reflexão:**\n- Quantas instruções foram necessárias?\n- Seu robô fez algo inesperado? Por quê?\n- O que você mudaria no seu \"código\"?\n\n💡 Isso é EXATAMENTE como programar! Bugs (erros) acontecem quando as instruções não são claras o suficiente."
      },
      {
        type: 'quiz',
        title: "Quiz de Programação",
        content: "Por que computadores precisam de instruções MUITO detalhadas?\n\nA) Eles são preguiçosos e fazem pouco\nB) Eles não pensam sozinhos, só seguem ordens\nC) Eles são superinteligentes e querem desafios\nD) Eles escolhem o que fazer quando estão entediados",
        correctAnswer: "B",
        explanation: "Exato! Computadores são muito rápidos e precisos, mas não \"pensam\" ou \"entendem\". Eles seguem instruções literalmente, passo a passo. Se você escrever uma instrução ambígua ou errada, o computador vai executar exatamente o que você escreveu — mesmo que o resultado seja absurdo!"
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
        title: "Sua Vida Digital Segura",
        content: "🔒 No mundo digital, sua segurança é tão importante quanto no mundo real!\n\n**Senhas — Sua primeira linha de defesa:**\n\n❌ **Senhas fracas (NUNCA use):**\n- 123456, senha123, seu nome, data de nascimento\n- A mesma senha para tudo\n- Palavras simples do dicionário\n\n✅ **Como criar senhas FORTES:**\n- Mínimo 12 caracteres\n- Misture maiúsculas, minúsculas, números e símbolos\n- **Técnica da frase secreta:** Pegue uma frase que só VOCÊ sabe:\n  \"Meu gato Luna adora dormir 3 horas!\" → MgLad3h!\n  Ou melhor ainda: \"LunaGataDorme3Horas!\" (mais longa = mais segura)\n\n**Phishing — O golpe mais comum:**\nCriminosos criam mensagens ou sites FALSOS que parecem reais para roubar seus dados.\n- 📧 Emails dizendo \"sua conta será bloqueada\" com links estranhos\n- 💬 Mensagens de \"prêmios\" que pedem dados pessoais\n- 🌐 Sites que imitam bancos ou redes sociais\n\n**Como se proteger:**\n- 🔍 Verifique o endereço do site (https:// e cadeado)\n- 🤔 Desconfie de urgência (\"clique AGORA ou perde!\")\n- 📱 Ative verificação em duas etapas em tudo\n- 🚫 Nunca compartilhe senhas, nem com amigos\n- 📸 Cuidado com o que posta — a internet não esquece!"
      },
      {
        type: 'video',
        title: "Navegando com Segurança",
        content: "Dicas práticas para manter sua vida digital protegida — desde senhas até redes sociais!",
        videoUrl: "https://www.youtube.com/embed/7_LPdttKXPc"
      },
      {
        type: 'practice',
        title: "Auditoria de Segurança Digital",
        content: "🔍 **Hora de verificar sua segurança online!**\n\n**Checklist de Segurança (marque o que você já faz):**\n\n☐ Minhas senhas têm mais de 12 caracteres\n☐ Uso senhas DIFERENTES para cada serviço\n☐ Tenho verificação em duas etapas ativada\n☐ Sei identificar emails de phishing\n☐ Meus perfis de redes sociais são privados\n☐ Não compartilho localização em tempo real\n☐ Verifico o cadeado (HTTPS) antes de digitar dados\n☐ Não clico em links suspeitos\n\n**Ação imediata:**\n1. Escolha 2 contas com senhas fracas\n2. Crie senhas novas usando a técnica da frase secreta\n3. Ative verificação em duas etapas onde possível\n4. Revise as configurações de privacidade das suas redes sociais\n\n**Teste de phishing:**\nPeça para um adulto te mostrar emails reais e falsos. Consegue identificar quais são golpes? Procure por:\n- Erros de português\n- Endereços de email estranhos\n- Links que não combinam com a empresa\n- Tom de urgência exagerado"
      },
      {
        type: 'quiz',
        title: "Quiz de Segurança Digital",
        content: "Qual dessas senhas é a MAIS segura?\n\nA) senha123\nB) MeuNome2023\nC) Xk9@mP2#qL5!zW\nD) 123456789",
        correctAnswer: "C",
        explanation: "Perfeito! A senha C é a mais segura porque é longa (15 caracteres), combina letras maiúsculas e minúsculas, números e símbolos, e não forma palavras reconhecíveis. As outras são curtas, usam palavras comuns ou sequências óbvias que hackers testam primeiro!"
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
        title: "IA: Máquinas que Aprendem",
        content: "🤖 Inteligência Artificial (IA) são programas de computador que podem aprender com dados e melhorar com a experiência — sem serem explicitamente programados para cada situação!\n\n**Como a IA aprende (simplificado):**\n\n1. **Dados** — Mostramos milhares (ou milhões!) de exemplos. Ex: \"Estas 10.000 fotos são gatos. Estas 10.000 são cachorros.\"\n2. **Padrões** — A IA descobre características. Ex: \"Gatos tendem a ter focinho menor, orelhas pontudas...\"\n3. **Previsão** — Agora ela consegue classificar fotos novas que nunca viu!\n\n**Tipos de IA no seu dia a dia:**\n- 📱 **Filtros de fotos** — Reconhecem seu rosto e aplicam efeitos\n- 🎵 **Spotify/YouTube** — Aprendem seus gostos e recomendam conteúdo\n- 🗣️ **Alexa/Siri/Google** — Entendem sua voz e respondem\n- 🔍 **Google** — Entende o que você quer mesmo com erros de digitação\n- 🚗 **Carros autônomos** — Veem a estrada e tomam decisões\n- 🏥 **Medicina** — Ajudam médicos a diagnosticar doenças em exames\n- 💬 **ChatGPT/Claude** — Conversam e criam textos\n\n**IA NÃO é:**\n- ❌ Um cérebro humano artificial (é muito diferente!)\n- ❌ Consciente ou com sentimentos\n- ❌ Infalível (pode errar e tem vieses!)\n- ❌ Substituição para humanos (é uma FERRAMENTA)\n\n💡 **Reflexão:** A IA é tão boa quanto os dados que recebe. Se os dados têm preconceitos, a IA reproduz esses preconceitos. Por isso precisamos de DIVERSIDADE nas equipes que criam IA — incluindo mais mulheres!"
      },
      {
        type: 'video',
        title: "IA na Prática",
        content: "Veja como a Inteligência Artificial funciona no dia a dia — de recomendações do YouTube a diagnósticos médicos!",
        videoUrl: "https://www.youtube.com/embed/2ePf9rue1Ao"
      },
      {
        type: 'practice',
        title: "Treine sua Própria IA!",
        content: "🤖 **Experiência prática: crie um modelo de IA!**\n\n**Atividade 1 — Teachable Machine (com computador):**\n1. Acesse teachablemachine.withgoogle.com\n2. Escolha \"Image Project\" → \"Standard image model\"\n3. **Classe 1:** Tire 30 fotos suas sorrindo (webcam)\n4. **Classe 2:** Tire 30 fotos suas séria\n5. Clique em \"Train Model\" e espere\n6. Teste com novas expressões! A IA acerta?\n\n**Atividade 2 — Seja a IA (sem computador):**\nPeça para alguém desenhar 20 formas em papéis:\n- 10 triângulos (de tamanhos diferentes)\n- 10 círculos (de tamanhos diferentes)\n\n1. Olhe as 20 formas e encontre PADRÕES\n2. Agora peça para desenharem 5 formas NOVAS\n3. Classifique: triângulo ou círculo?\n4. Você acabou de fazer o que uma IA faz!\n\n**Reflexão:**\n- Quantos exemplos você precisou para aprender?\n- E se alguém mostrasse formas ambíguas (tipo um oval)?\n- Isso acontece com IAs de verdade! É por isso que mais dados = IA melhor."
      },
      {
        type: 'quiz',
        title: "Quiz de Inteligência Artificial",
        content: "O que uma IA precisa para aprender a reconhecer gatos em fotos?\n\nA) Apenas um computador muito rápido\nB) Muitos exemplos de fotos de gatos (e não-gatos)\nC) Uma pessoa muito inteligente explicando cada foto\nD) Uma câmera especial de alta resolução",
        correctAnswer: "B",
        explanation: "Isso! IAs aprendem por EXEMPLOS. Para reconhecer gatos, ela precisa ver milhares de fotos de gatos (e de coisas que NÃO são gatos) para descobrir os padrões sozinha. Quanto mais exemplos variados, melhor ela fica! Isso se chama \"aprendizado de máquina\" (machine learning)."
      }
    ]
  },
  {
    id: 6,
    title: "Criando com Código",
    description: "Seus primeiros projetos de verdade",
    icon: "Code",
    difficulty: "Intermediário",
    points: 55,
    color: "bg-pink-500",
    lessons: [
      {
        type: 'reading',
        title: "Linguagens de Programação: Escolha sua Ferramenta",
        content: "💻 Assim como existem diferentes idiomas (português, inglês, japonês), existem diferentes linguagens de programação — cada uma boa para algo!\n\n**Linguagens para começar:**\n\n🧩 **Scratch** — Visual, com blocos coloridos que se encaixam. Perfeita para aprender lógica sem se preocupar com sintaxe. Crie jogos, animações e histórias interativas!\n\n🐍 **Python** — A queridinha dos iniciantes! Fácil de ler (parece inglês), usada em IA, ciência de dados, automação. É a linguagem mais popular do mundo!\n\n**Linguagens profissionais:**\n\n🌐 **JavaScript** — Faz sites ganharem vida! Animações, botões que funcionam, jogos no navegador. ESTE SITE usa JavaScript!\n\n☕ **Java** — Apps Android, sistemas bancários. Usada por grandes empresas.\n\n🍎 **Swift** — Cria apps para iPhone e iPad. Criada pela Apple.\n\n🎮 **C#** — Jogos! Usada na Unity (motor de jogos).\n\n**Qual escolher?** Depende do que você quer criar:\n- Jogos e animações → Scratch (depois C# ou Python)\n- Sites e apps web → JavaScript\n- IA e ciência → Python\n- Apps de celular → Swift (iOS) ou Java/Kotlin (Android)\n\n💡 **Segredo:** A linguagem importa menos do que a LÓGICA. Uma vez que você aprende a pensar como programadora, trocar de linguagem fica fácil!"
      },
      {
        type: 'video',
        title: "Seu Primeiro Projeto no Scratch",
        content: "Vamos criar um projeto interativo no Scratch passo a passo! Você vai ver como blocos de código se transformam em criações incríveis.",
        videoUrl: "https://www.youtube.com/embed/Dv7gLpW91DM"
      },
      {
        type: 'practice',
        title: "Desafio: Crie seu Primeiro Jogo!",
        content: "🎮 **Projeto prático no Scratch!**\n\n**Acesse:** scratch.mit.edu → Criar\n\n**Projeto: Jogo de Pegar Estrelas**\n\n1. **Personagem:** Escolha um sprite (personagem)\n2. **Movimento:** Faça ele se mover com as setas do teclado:\n   - Quando seta direita pressionada → mude x por 10\n   - Quando seta esquerda pressionada → mude x por -10\n3. **Estrelas:** Adicione um sprite de estrela que:\n   - Aparece em posição aleatória\n   - Quando tocada pelo personagem → some e reaparece em outro lugar\n4. **Pontuação:** Crie uma variável \"pontos\":\n   - Quando tocar na estrela → mude pontos por 1\n5. **Tempo:** Adicione um cronômetro de 30 segundos\n6. **Final:** Quando o tempo acabar, mostre a pontuação!\n\n**Extras para desafiar:**\n- Adicione obstáculos que tiram pontos\n- Mude a velocidade conforme o tempo passa\n- Adicione sons e efeitos visuais\n\n📤 Compartilhe seu jogo na comunidade do Scratch!"
      },
      {
        type: 'quiz',
        title: "Quiz de Linguagens de Programação",
        content: "Qual linguagem de programação é usada para criar apps de iPhone?\n\nA) Python — popular para IA e dados\nB) Java — comum em apps Android\nC) Swift — criada pela Apple para iOS\nD) Scratch — linguagem visual com blocos",
        correctAnswer: "C",
        explanation: "Correto! Swift foi criada pela Apple especificamente para desenvolver apps para iPhone, iPad, Mac e Apple Watch. É uma linguagem moderna, segura e relativamente fácil de aprender. Java/Kotlin são usadas para Android, Python para IA e ciência, e Scratch é ótima para aprender lógica!"
      }
    ]
  }
];

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
        title: "O que Faz uma Engenheira?",
        content: "Engenheiras usam ciência, matemática e criatividade para resolver problemas reais — de pontes a foguetes, de apps a medicamentos! Veja como elas mudam o mundo.",
        videoUrl: "https://www.youtube.com/embed/FEF6PxWOvsk"
      },
      {
        type: 'reading',
        title: "O Mundo da Engenharia",
        content: "🔧 Engenharia é a arte de transformar conhecimento científico em soluções práticas! Engenheiras projetam, constroem e melhoram TUDO ao nosso redor.\n\n**Principais tipos de Engenharia:**\n\n🏗️ **Civil** — Projeta e constrói pontes, prédios, estradas, barragens. A engenheira civil garante que as estruturas sejam seguras e durem décadas.\n\n✈️ **Aeroespacial** — Projeta aviões, helicópteros, foguetes e satélites. Sem engenheiras aeroespaciais, não teríamos GPS nem viagens de avião!\n\n💻 **Computação** — Cria software, apps, sistemas operacionais. É o tipo de engenharia que mais cresce no mundo!\n\n🔌 **Elétrica** — Trabalha com circuitos, energia, telecomunicações. Tudo que usa eletricidade passou por uma engenheira elétrica.\n\n🧪 **Química** — Desenvolve medicamentos, cosméticos, alimentos processados, materiais novos. Sua pasta de dente foi projetada por engenheiras químicas!\n\n🤖 **Mecatrônica** — Combina mecânica, eletrônica e computação. Cria robôs, drones, carros autônomos.\n\n🌱 **Ambiental** — Cuida do planeta! Trata água e esgoto, controla poluição, desenvolve energias limpas.\n\n💡 **O que todas têm em comum?** O Processo de Design de Engenharia:\n1. Identificar o problema\n2. Pesquisar soluções existentes\n3. Imaginar possibilidades\n4. Planejar a melhor solução\n5. Criar um protótipo\n6. Testar e melhorar\n7. Compartilhar com o mundo!"
      },
      {
        type: 'inspiration',
        title: "Engenheiras que Mudaram o Mundo",
        content: "**Emily Warren Roebling (1843–1903)** assumiu a supervisão da construção da Ponte do Brooklyn em Nova York quando seu marido adoeceu. Por 11 anos, ela estudou engenharia por conta própria e liderou centenas de trabalhadores. A ponte é um dos monumentos mais famosos do mundo!\n\n**Hedy Lamarr (1914–2000)** era uma famosa atriz de Hollywood, mas secretamente era uma inventora brilhante! Durante a Segunda Guerra Mundial, ela inventou um sistema de comunicação por salto de frequência para evitar que torpedos fossem interceptados. Essa mesma tecnologia é a BASE do WiFi, Bluetooth e GPS que usamos hoje!\n\n**Katherine Johnson (1918–2020)** era uma matemática e engenheira negra que calculou as trajetórias dos voos espaciais da NASA. O astronauta John Glenn se recusou a voar até que Katherine verificasse pessoalmente os cálculos do computador. Ela foi essencial para levar o homem à Lua!\n\n**Neri Oxman (1976–presente)** combina biologia, engenharia e design para criar materiais inspirados na natureza. Ela projetou pavilhões feitos por bichos-da-seda de verdade!\n\n**Joana D'Arc Félix de Souza** é engenheira química brasileira, sendo uma das poucas mulheres negras com doutorado em engenharia no Brasil. Ela luta para que mais meninas negras entrem na engenharia.\n\nVocê pode ser a próxima! 💜"
      },
      {
        type: 'quiz',
        title: "Quiz: Tipos de Engenharia",
        content: "Qual tipo de engenheira projeta aviões e foguetes?\n\nA) Engenheira Civil\nB) Engenheira Aeroespacial\nC) Engenheira Química\nD) Engenheira de Alimentos",
        correctAnswer: "B",
        explanation: "Perfeito! Engenheiras Aeroespaciais projetam tudo que voa — aviões, helicópteros, foguetes, satélites e sondas espaciais. Elas usam conhecimentos de física, matemática e materiais para vencer a gravidade e explorar o espaço!"
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
        content: "🔧 Toda máquina complexa — de uma bicicleta a um foguete — é feita de combinações de apenas 6 máquinas simples! Elas multiplicam nossa força ou mudam sua direção.\n\n**1. Alavanca** 🎚️\nUm barra rígida que gira em torno de um ponto (fulcro).\nExemplos: gangorra, tesoura, pinça, abridor de garrafa, martelo.\nSuperpoder: multiplica a força! É por isso que você consegue levantar uma pessoa na gangorra.\n\n**2. Polia** 🎡\nUma roda com um sulco por onde passa uma corda.\nExemplos: mastro de bandeira, guindaste, elevador, cortinas.\nSuperpoder: muda a direção da força! Você puxa para baixo e o objeto sobe.\n\n**3. Roda e Eixo** 🛞\nUma roda grande conectada a um eixo menor.\nExemplos: maçaneta, volante, chave de fenda, roda de bicicleta.\nSuperpoder: uma pequena rotação no eixo gera uma grande rotação na roda!\n\n**4. Plano Inclinado** 📐\nUma superfície inclinada (rampa).\nExemplos: escorregador, rampa de acessibilidade, escada.\nSuperpoder: distribui o esforço por uma distância maior, fazendo parecer mais leve!\n\n**5. Cunha** 🔪\nDois planos inclinados juntos formando uma ponta.\nExemplos: faca, machado, prego, dentes da frente.\nSuperpoder: concentra força em uma área pequena para cortar ou separar.\n\n**6. Parafuso** 🔩\nUm plano inclinado enrolado em espiral!\nExemplos: tampa de garrafa, parafuso, saca-rolhas.\nSuperpoder: converte rotação em movimento reto com muita força.\n\n💡 **Conexão:** Uma bicicleta usa TODAS as 6 máquinas simples! Consegue identificar cada uma?"
      },
      {
        type: 'video',
        title: "Máquinas Simples em Ação",
        content: "Veja como as 6 máquinas simples funcionam no mundo real — desde construções antigas até tecnologias modernas!",
        videoUrl: "https://www.youtube.com/embed/fvOmaf2GfCY"
      },
      {
        type: 'practice',
        title: "Caça às Máquinas na sua Casa!",
        content: "🔍 **Missão de engenheira: encontre máquinas simples escondidas ao seu redor!**\n\n**Preencha a tabela:**\n\n| Máquina Simples | Encontrei onde? | Como ela ajuda? |\n|-----------------|-----------------|------------------|\n| 3 Alavancas | | |\n| 2 Polias | | |\n| 3 Rodas e Eixos | | |\n| 2 Planos Inclinados | | |\n| 2 Cunhas | | |\n| 2 Parafusos | | |\n\n**Dicas para procurar:**\n- Cozinha: gavetas, facas, abridores\n- Banheiro: torneiras, registros\n- Escritório: grampeadores, tesouras\n- Garagem: ferramentas, bicicleta\n- Playground: gangorra, escorregador\n\n**Desafio bônus:** Encontre um objeto que combine DUAS ou mais máquinas simples!\nExemplo: Tesoura = duas alavancas + duas cunhas\n\n📸 Tire fotos e faça um álbum de \"Máquinas Simples ao Meu Redor\"!"
      },
      {
        type: 'quiz',
        title: "Quiz de Máquinas Simples",
        content: "Uma tesoura é um exemplo de qual máquina simples?\n\nA) Polia — muda a direção da força\nB) Alavanca — gira em torno de um ponto fixo\nC) Parafuso — plano inclinado em espiral\nD) Roda e eixo — roda conectada a um eixo",
        correctAnswer: "B",
        explanation: "Isso! A tesoura é formada por duas alavancas conectadas no parafuso central (que é o fulcro/ponto de apoio). Quando você fecha a tesoura, as lâminas funcionam como alavancas que multiplicam sua força para cortar. Na verdade, ela combina alavanca + cunha (as lâminas afiadas)!"
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
        title: "A Ciência das Estruturas",
        content: "🏗️ Por que prédios ficam de pé, pontes suportam caminhões e estádios não desabam com milhares de pessoas? A resposta está nas FORÇAS e FORMAS!\n\n**Forças que atuam nas estruturas:**\n\n💪 **Compressão** — Aperta/esmaga o material. Exemplo: as colunas de um prédio são comprimidas pelo peso dos andares acima.\n\n↔️ **Tensão** — Estica/puxa o material. Exemplo: os cabos de uma ponte suspensa estão em tensão, segurando a pista.\n\n🌀 **Torção** — Torce o material. Exemplo: quando você torce uma toalha para secar.\n\n✂️ **Cisalhamento** — Corta em direções opostas. Exemplo: uma tesoura aplica cisalhamento no papel.\n\n**Formas que resistem às forças:**\n\n🔺 **Triângulo** — A forma mais forte da engenharia! Quando você empurra o topo de um triângulo, a força se distribui igualmente pelos três lados. Por isso pontes e torres usam tantos triângulos (chamados \"treliças\").\n\n⭕ **Arco** — Distribui o peso para os dois lados. Os romanos construíram aquedutos com arcos há 2.000 anos que AINDA estão de pé!\n\n⬡ **Hexágono** — Super eficiente (usa menos material). As abelhas já sabiam disso — favos de mel são hexagonais!\n\n🥚 **Forma de ovo/cúpula** — Distribui pressão uniformemente. É por isso que é tão difícil quebrar um ovo apertando os dois extremos!\n\n💡 **Curiosidade:** A Torre Eiffel usa 18.038 peças de ferro formando triângulos. Se todo o ferro fosse derretido, formaria apenas uma camada de 6 cm sobre a base!"
      },
      {
        type: 'video',
        title: "Engenharia de Pontes e Estruturas",
        content: "Descubra como engenheiras projetam pontes que suportam milhares de toneladas sem desabar!",
        videoUrl: "https://www.youtube.com/embed/FEF6PxWOvsk"
      },
      {
        type: 'practice',
        title: "Desafio de Engenharia: Torre de Palitos",
        content: "🏗️ **Construa a torre mais alta e resistente!**\n\n**Materiais:**\n- 30 palitos de dente (ou palitos de picolé)\n- 20 jujubas (ou bolinhas de massinha/massa de modelar)\n- Uma régua para medir\n- Um livro para testar resistência\n\n**Regras:**\n1. Use APENAS os materiais listados\n2. A torre deve ficar em pé sozinha por 30 segundos\n3. Tente fazer a mais ALTA possível\n\n**Etapas de engenharia:**\n1. **Planeje:** Desenhe 2-3 designs possíveis antes de construir\n2. **Construa:** Monte seu melhor design\n3. **Teste:** Consegue apoiar o peso de um livro fino no topo?\n4. **Analise:** O que funcionou e o que não funcionou?\n5. **Melhore:** Reconstrua com as lições aprendidas\n\n**Dicas de engenheira:**\n- Use triângulos! São as formas mais estáveis\n- Base larga = mais estabilidade\n- Simetria ajuda a distribuir o peso\n\n**Registre:**\n- Altura da torre (cm)\n- Peso máximo que suportou\n- O que você mudaria no próximo projeto"
      },
      {
        type: 'quiz',
        title: "Quiz de Estruturas",
        content: "Qual forma geométrica é considerada a mais resistente para construções?\n\nA) Círculo\nB) Quadrado\nC) Triângulo\nD) Retângulo",
        correctAnswer: "C",
        explanation: "Excelente! O triângulo é a forma mais estável na engenharia. Diferente do quadrado (que pode se deformar em um losango), o triângulo mantém sua forma quando submetido a forças. É por isso que pontes, torres, telhados e estruturas metálicas são cheios de triângulos!"
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
        content: "✈️ Desde os tempos antigos, humanos sonham em voar. Em 1903, os irmãos Wright realizaram o primeiro voo motorizado (12 segundos!). Hoje, aviões cruzam oceanos em horas. Como isso funciona?\n\n**As 4 forças que atuam em um avião:**\n\n⬆️ **Sustentação (Lift)**\nEmpurra o avião para CIMA. É gerada pelas asas! O formato especial da asa (mais curvada em cima, mais plana embaixo) faz o ar passar mais rápido por cima, criando menor pressão — e o avião é \"sugado\" para cima.\n\n⬇️ **Peso (Weight)**\nPuxa o avião para BAIXO. É a gravidade! Quanto mais pesado o avião, mais sustentação precisa.\n\n➡️ **Empuxo (Thrust)**\nEmpurra o avião para FRENTE. Vem dos motores a jato (que funcionam pela 3ª Lei de Newton — empurram ar para trás, e o avião vai para frente).\n\n⬅️ **Arrasto (Drag)**\nPuxa o avião para TRÁS. É a resistência do ar. Quanto mais aerodinâmico (liso e pontiagudo), menor o arrasto.\n\n**Para voar em linha reta:**\nSustentação = Peso E Empuxo = Arrasto\n\n**Para subir:** Sustentação > Peso\n**Para acelerar:** Empuxo > Arrasto\n\n**E os foguetes?** No espaço não tem ar, então asas não funcionam! Foguetes usam a 3ª Lei de Newton: expelem gases em altíssima velocidade para baixo, e a reação os empurra para cima. O foguete Falcon 9 da SpaceX queima 2.500 kg de combustível POR SEGUNDO!\n\n💡 **Santos-Dumont:** O brasileiro Alberto Santos-Dumont realizou em 1906 o primeiro voo público de um avião que decolou sem auxílio externo!"
      },
      {
        type: 'video',
        title: "Como Aviões Realmente Voam",
        content: "Entenda a física por trás do voo — desde as asas de um avião até os motores de um foguete espacial!",
        videoUrl: "https://www.youtube.com/embed/Gg0TXNXgz-w"
      },
      {
        type: 'practice',
        title: "Laboratório de Aviões de Papel",
        content: "✈️ **Experimento científico com aviões de papel!**\n\n**Objetivo:** Descobrir qual design de avião voa mais longe.\n\n**Materiais:** 4 folhas de papel A4, régua ou fita métrica, caneta\n\n**Método científico em ação:**\n\n1. **Hipótese:** Qual design você ACHA que vai voar mais longe? Por quê?\n\n2. **Construa 4 modelos diferentes:**\n   - Modelo A: Avião clássico (pontiagudo)\n   - Modelo B: Avião de asas largas\n   - Modelo C: Avião com dobras nas asas (winglets)\n   - Modelo D: Seu próprio design!\n\n3. **Teste (3 lançamentos cada):**\n   Numere cada avião e lance todos do MESMO ponto.\n\n| Modelo | Lanc. 1 | Lanc. 2 | Lanc. 3 | Média |\n|--------|---------|---------|---------|-------|\n| A | | | | |\n| B | | | | |\n| C | | | | |\n| D | | | | |\n\n4. **Análise:**\n   - Qual voou mais longe? Sua hipótese estava certa?\n   - Qual voou mais RETO?\n   - Como o formato das asas afetou o voo?\n   - O que acontece se adicionar um clipe de papel no nariz?"
      },
      {
        type: 'quiz',
        title: "Quiz Aeroespacial",
        content: "Qual força é responsável por fazer o avião subir?\n\nA) Arrasto — resistência do ar\nB) Peso — atração da gravidade\nC) Sustentação — criada pelas asas\nD) Empuxo — força dos motores para frente",
        correctAnswer: "C",
        explanation: "Perfeito! A sustentação é a força que empurra o avião para cima, e é gerada pelas asas. O formato especial da asa faz o ar passar mais rápido por cima do que por baixo, criando diferença de pressão que \"suga\" o avião para cima. Para voar, a sustentação precisa ser maior que o peso!"
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
        title: "Anatomia de um Robô",
        content: "🤖 Robôs são máquinas programáveis que podem realizar tarefas automaticamente! De fábricas a hospitais, de oceanos a Marte — robôs estão em toda parte.\n\n**Os 4 componentes de todo robô:**\n\n🧠 **Controlador (cérebro):**\nO computador que processa informações e toma decisões. Pode ser um microcontrolador simples (Arduino) ou um computador poderoso. É onde fica o \"programa\" que diz ao robô o que fazer.\n\n👀 **Sensores (sentidos):**\nPermitem que o robô \"perceba\" o mundo:\n- Câmeras = visão\n- Microfones = audição\n- Sensor ultrassônico = medir distâncias (como morcegos!)\n- Acelerômetro = sentir movimento (seu celular tem!)\n- Sensor de temperatura, pressão, umidade...\n\n💪 **Atuadores (músculos):**\nPermitem que o robô interaja com o mundo:\n- Motores = girar rodas, mover braços\n- Servomotores = movimentos precisos\n- LEDs = indicar estados\n- Alto-falantes = emitir sons\n\n🔋 **Fonte de energia:**\nBaterias, eletricidade, ou até energia solar!\n\n**Robôs incríveis que existem hoje:**\n- 🏭 Robôs industriais montam carros em segundos\n- 🏥 Robô Da Vinci faz cirurgias com precisão milimétrica\n- 🌊 ROVs exploram o fundo do oceano\n- 🪐 Perseverance explora Marte desde 2021\n- 🏠 Roomba aspira sua casa sozinho\n- 🐕 Spot da Boston Dynamics anda como um cachorro\n\n💡 O Brasil tem competições de robótica para jovens como a OBR (Olimpíada Brasileira de Robótica)!"
      },
      {
        type: 'video',
        title: "Robôs Incríveis do Mundo Real",
        content: "Veja robôs que caminham, nadam, voam e até fazem cirurgias! A robótica está transformando o mundo.",
        videoUrl: "https://www.youtube.com/embed/8wHJjLMnikU"
      },
      {
        type: 'practice',
        title: "Projete seu Próprio Robô!",
        content: "🎨 **Engenharia de Robôs: do problema ao projeto!**\n\n**Passo 1 — Identifique um problema:**\nPense em algo que incomoda você ou sua comunidade:\n- Lixo na praia?\n- Plantas que precisam de água?\n- Pessoas com dificuldade de mobilidade?\n- Outro problema? ________________\n\n**Passo 2 — Projete a solução:**\nDesenhe seu robô incluindo:\n- Formato e tamanho\n- Onde ficam os sensores (e quais tipos)\n- Onde ficam os motores\n- Onde fica o controlador\n- Como se move (rodas, pernas, hélices?)\n- Fonte de energia\n\n**Passo 3 — Ficha técnica:**\n- Nome do robô: ________________\n- Problema que resolve: ________________\n- Sensores usados: ________________\n- Tipo de movimento: ________________\n- Fonte de energia: ________________\n\n**Passo 4 — Apresentação:**\nExplique seu robô para alguém como se fosse uma engenheira apresentando para investidores:\n- Qual problema ele resolve?\n- Por que ele é necessário?\n- Como ele funciona?\n- Quanto custaria (chute!)?"
      },
      {
        type: 'quiz',
        title: "Quiz de Robótica",
        content: "Os 'sensores' de um robô servem para:\n\nA) Fornecer energia para o robô funcionar\nB) Mover as partes mecânicas do robô\nC) Detectar e perceber o ambiente ao redor\nD) Armazenar os programas e instruções",
        correctAnswer: "C",
        explanation: "Exato! Sensores são como os \"sentidos\" do robô — eles captam informações do ambiente (luz, som, distância, temperatura, pressão) e enviam para o controlador, que decide o que fazer. Sem sensores, o robô seria \"cego\" e \"surdo\"!"
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
        title: "Engenharia Verde: Construindo sem Destruir",
        content: "🌱 Engenharia sustentável é projetar soluções que atendam às necessidades de hoje sem comprometer o futuro do planeta!\n\n**Fontes de energia renovável (projetadas por engenheiras!):**\n\n☀️ **Solar:** Painéis convertem luz do sol em eletricidade. O Brasil tem potencial gigantesco! Um painel de 1m² pode gerar energia suficiente para 2-3 lâmpadas LED o dia todo.\n\n💨 **Eólica:** Turbinas transformam vento em eletricidade. Uma única turbina moderna pode alimentar 500 casas! O Nordeste brasileiro é perfeito para isso.\n\n💧 **Hidrelétrica:** Usa a força da água em queda para gerar energia. É a principal fonte de energia do Brasil (60%)! A Usina de Itaipu é uma das maiores do mundo.\n\n🌊 **Maremotriz:** Usa a força das ondas e marés. Tecnologia nova e promissora!\n\n**Construções inteligentes:**\n- 🏠 Telhados verdes (com plantas!) regulam temperatura e absorvem chuva\n- 🪟 Vidros inteligentes que escurecem com o sol\n- 💧 Sistemas de captação de água da chuva\n- ♻️ Materiais reciclados na construção\n- 🌡️ Isolamento térmico que reduz uso de ar-condicionado\n\n**Economia circular — o futuro da engenharia:**\nEm vez de \"extrair → produzir → descartar\", a ideia é:\n\"extrair → produzir → REUSAR → reciclar → produzir novamente\"\nNada vira lixo — tudo vira matéria-prima!\n\n💡 **No Brasil:** A engenheira Theresa Williamson fundou a Catalytic Communities, que usa tecnologia para melhorar a vida em comunidades sustentáveis no Rio de Janeiro."
      },
      {
        type: 'video',
        title: "O Futuro da Energia Limpa",
        content: "Como engenheiras estão criando tecnologias para gerar energia sem poluir o planeta — do sol ao vento, das ondas ao hidrogênio!",
        videoUrl: "https://www.youtube.com/embed/FEF6PxWOvsk"
      },
      {
        type: 'practice',
        title: "Projeto: Solução Sustentável para sua Comunidade",
        content: "💡 **Desafio de engenharia sustentável!**\n\n**Fase 1 — Pesquisa (observe sua comunidade):**\n- Qual problema ambiental mais incomoda? (lixo, poluição, falta de água, calor excessivo...)\n- Quem é afetado?\n- Já existe alguma solução? Funciona?\n\n**Fase 2 — Brainstorm (gere ideias):**\nEscreva PELO MENOS 5 soluções possíveis, mesmo as malucas! Sem julgar ainda.\n1. ________________\n2. ________________\n3. ________________\n4. ________________\n5. ________________\n\n**Fase 3 — Projeto (escolha a melhor):**\nPara sua melhor ideia, responda:\n- Como funcionaria?\n- Que materiais usaria? (preferencialmente reciclados!)\n- Quanto custaria?\n- Qual o impacto ambiental positivo?\n\n**Fase 4 — Protótipo:**\nDesenhe ou construa um modelo simplificado com materiais recicláveis.\n\n**Fase 5 — Apresentação:**\nCrie um \"pitch\" de 2 minutos explicando sua solução.\n\n🌍 Grandes soluções começam com uma ideia e uma pessoa corajosa!"
      },
      {
        type: 'quiz',
        title: "Quiz de Engenharia Sustentável",
        content: "Qual dessas é uma fonte de energia RENOVÁVEL?\n\nA) Petróleo — combustível fóssil\nB) Carvão mineral — combustível fóssil\nC) Energia solar — vem do sol\nD) Gás natural — combustível fóssil",
        correctAnswer: "C",
        explanation: "Perfeito! Energia solar é renovável porque o sol \"não acaba\" (pelo menos não nos próximos 5 bilhões de anos!). Petróleo, carvão e gás natural são combustíveis fósseis — formados há milhões de anos e que se esgotam quando usados. Além disso, fósseis poluem, enquanto solar é limpa!"
      }
    ]
  }
];

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
        content: "Prepare-se para ver a matemática de um jeito completamente diferente! Ela está escondida em tudo — da música às flores, dos jogos às estrelas.",
        videoUrl: "https://www.youtube.com/embed/kkGeOWYOFoA"
      },
      {
        type: 'reading',
        title: "Matemática: Muito Mais que Números!",
        content: "🔢 Muita gente acha que matemática é só fazer contas. Mas na verdade, matemática é a linguagem do universo — ela está literalmente em TUDO!\n\n**Onde você usa matemática sem perceber:**\n\n🎂 **Dividir um bolo** — Frações em ação! Se são 8 pessoas e 1 bolo, cada pessoa recebe 1/8.\n\n💰 **Mesada** — Se você ganha R$50 e quer comprar algo de R$35, precisa calcular se sobra para o lanche.\n\n⏰ **Chegar na hora** — \"O filme começa às 15h, levo 30 minutos para chegar, então saio às 14h30.\" Isso é álgebra!\n\n🎮 **Jogos** — Todo jogo usa matemática: pontuação, ângulos de tiro, probabilidade de drops, velocidade de personagens.\n\n📏 **Cozinhar** — Receita para 4 pessoas, mas vocês são 6? Precisa usar proporcionalidade!\n\n🎵 **Música** — O ritmo é baseado em frações (semínima = 1/4 do compasso). Acordes são relações matemáticas entre frequências!\n\n🌻 **Natureza** — As pétalas de flores seguem a sequência de Fibonacci. Conchas formam espirais logarítmicas.\n\n💡 **Curiosidade incrível:** A matemática é a ÚNICA linguagem verdadeiramente universal. Se encontrássemos alienígenas, não falaríamos português ou inglês com eles — mas a matemática funcionaria! 2 + 2 = 4 em qualquer lugar do universo."
      },
      {
        type: 'inspiration',
        title: "Matemáticas que Mudaram a História",
        content: "**Hipátia de Alexandria (~360–415 d.C.)** foi uma das primeiras matemáticas e filósofas da história. Ela era professora respeitadíssima na antiga Alexandria (Egito), ensinando matemática, astronomia e filosofia. Seus alunos vinham de toda parte do mundo romano para ouvi-la!\n\n**Emmy Noether (1882–1935)** é considerada a mãe da álgebra abstrata moderna. Einstein disse que ela era \"o gênio matemático mais importante desde que as mulheres começaram a ter educação superior\". O Teorema de Noether é fundamental para a física moderna — ele conecta simetria e leis de conservação!\n\n**Maryam Mirzakhani (1977–2017)** foi uma matemática iraniana que se tornou a PRIMEIRA mulher a ganhar a Medalha Fields — o prêmio mais importante da matemática (equivalente ao Nobel)! Ela estudava superfícies geométricas complexas e adorava desenhar seus problemas em folhas gigantes no chão.\n\n**Artur Avila (1979–presente)** é um matemático brasileiro que também ganhou a Medalha Fields em 2014! Ele mostrou que o Brasil pode estar no topo da matemática mundial.\n\n**Carolina Araujo** é uma matemática brasileira que estuda geometria algébrica e trabalha no IMPA (Instituto de Matemática Pura e Aplicada), no Rio de Janeiro. Ela luta para aumentar a participação de mulheres na matemática!\n\nVocê pode ser a próxima! 💜"
      },
      {
        type: 'quiz',
        title: "Quiz: Matemática no Dia a Dia",
        content: "Qual dessas atividades do dia a dia usa matemática?\n\nA) Dividir pizza igualmente com amigos\nB) Calcular a pontuação em um jogo\nC) Seguir uma receita de bolo\nD) Todas as anteriores!",
        correctAnswer: "D",
        explanation: "Isso aí! TUDO usa matemática! Dividir pizza = frações. Pontuação em jogos = operações e estatística. Receita de bolo = medidas e proporções. A matemática está tão presente no nosso dia a dia que usamos sem nem perceber!"
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
        title: "A Matemática dos Padrões",
        content: "🔢 Padrões são regras que se repetem — e o universo inteiro é feito deles! Encontrar padrões é o superpoder das matemáticas.\n\n**Tipos de padrões numéricos:**\n\n**Aritmético (soma constante):**\n2, 4, 6, 8, 10... (+2 cada vez)\n5, 10, 15, 20... (+5 cada vez)\n\n**Geométrico (multiplicação constante):**\n2, 4, 8, 16, 32... (×2 cada vez)\n3, 9, 27, 81... (×3 cada vez)\n\n**Fibonacci (soma dos dois anteriores):**\n1, 1, 2, 3, 5, 8, 13, 21, 34...\n(1+1=2, 1+2=3, 2+3=5, 3+5=8...)\n\n**Por que Fibonacci é especial?**\nEssa sequência aparece em toda a natureza!\n- 🌻 Girassóis têm 34, 55 ou 89 espirais de sementes\n- 🐚 Conchas de nautilus formam espirais de Fibonacci\n- 🌸 Flores têm 3, 5, 8, 13 ou 21 pétalas (quase sempre números de Fibonacci!)\n- 🍍 Abacaxis têm espirais em números de Fibonacci\n- 🌀 Até galáxias formam espirais parecidas!\n\n**Padrões na vida real:**\n- 📈 Cientistas usam padrões para prever o clima\n- 💰 Economistas usam para prever mercados\n- 🧬 Biólogos encontram padrões no DNA\n- 🔐 Criptografia (segurança digital) é baseada em padrões matemáticos\n\n💡 **Pensar em padrões é pensar como uma cientista!** Quando você encontra um padrão, pode PREVER o que vem a seguir."
      },
      {
        type: 'video',
        title: "Fibonacci e a Natureza",
        content: "Veja como os números de Fibonacci aparecem magicamente em girassóis, conchas, galáxias e até no seu próprio corpo!",
        videoUrl: "https://www.youtube.com/embed/kkGeOWYOFoA"
      },
      {
        type: 'practice',
        title: "Desafio dos Padrões",
        content: "🔢 **Exercite seu cérebro matemático!**\n\n**Nível 1 — Descubra o padrão e complete:**\n1. 2, 4, 6, 8, __, __ (dica: soma)\n2. 3, 6, 12, 24, __, __ (dica: multiplicação)\n3. A, C, E, G, __, __ (dica: pule uma)\n4. 1, 1, 2, 3, 5, 8, __, __ (dica: Fibonacci!)\n\n**Nível 2 — Mais desafiador:**\n5. 1, 4, 9, 16, 25, __ (dica: quadrados perfeitos)\n6. 2, 6, 12, 20, 30, __ (dica: n × (n+1))\n7. 1, 3, 6, 10, 15, __ (dica: triângulos)\n\n**Nível 3 — Caça ao padrão na natureza:**\n8. Encontre uma flor e conte as pétalas. É um número de Fibonacci? (1, 1, 2, 3, 5, 8, 13, 21, 34...)\n9. Encontre uma pinha ou abacaxi e tente contar as espirais em cada direção.\n\n**Respostas Nível 1:** 10, 12 | 48, 96 | I, K | 13, 21\n**Respostas Nível 2:** 36 | 42 | 21\n\n💡 Criar seus próprios padrões também é ótimo! Invente 3 sequências e desafie alguém a descobrir a regra."
      },
      {
        type: 'quiz',
        title: "Quiz de Sequências",
        content: "Qual é o próximo número na sequência: 3, 6, 9, 12, __?\n\nA) 13 — somando 1\nB) 14 — somando 2\nC) 15 — somando 3\nD) 16 — somando 4",
        correctAnswer: "C",
        explanation: "Acertou! O padrão é somar 3 a cada vez: 3+3=6, 6+3=9, 9+3=12, 12+3=15. Essa é uma sequência aritmética com razão 3. Também são os múltiplos de 3! Na tabuada do 3, o próximo seria 15."
      }
    ]
  },
  {
    id: 3,
    title: "Pensamento Lógico",
    description: "Resolva problemas como uma matemática",
    icon: "Brain",
    difficulty: "Iniciante",
    points: 40,
    color: "bg-green-500",
    lessons: [
      {
        type: 'reading',
        title: "Lógica: A Arte de Pensar Direito",
        content: "🧩 Lógica é a base de todo pensamento matemático — e também da programação, da ciência, e até das boas decisões no dia a dia!\n\n**O que é pensar logicamente?**\nÉ tirar conclusões corretas a partir de informações que você tem.\n\n**Exemplo simples:**\n- Premissa 1: Todos os mamíferos têm sangue quente\n- Premissa 2: Golfinhos são mamíferos\n- Conclusão: Golfinhos têm sangue quente! ✅\n\n**Tipos de raciocínio lógico:**\n\n🔽 **Dedução (do geral para o específico):**\n\"Todos os gatos têm bigodes. Luna é uma gata. Logo, Luna tem bigodes.\"\nSe as premissas são verdadeiras, a conclusão SEMPRE é verdadeira.\n\n🔼 **Indução (do específico para o geral):**\n\"Todas as vezes que esquentei água ela ferveu a 100°C. Logo, água SEMPRE ferve a 100°C.\"\nProvavelmente verdade, mas não garantido (no topo de uma montanha, ferve a menos!).\n\n**Conectivos lógicos (usados em programação!):**\n- **E (AND):** \"Preciso de chuva E sol para ter arco-íris\" (os dois precisam ser verdade)\n- **OU (OR):** \"Vou de ônibus OU de metrô\" (pelo menos um)\n- **NÃO (NOT):** \"NÃO está chovendo\" (inverte)\n- **SE...ENTÃO:** \"SE chover, ENTÃO levo guarda-chuva\"\n\n💡 **Pensamento computacional** é lógica aplicada! Programadoras usam lógica o tempo todo para criar softwares. Se você gosta de resolver enigmas, provavelmente seria uma ótima programadora!"
      },
      {
        type: 'video',
        title: "Pensamento Computacional e Lógica",
        content: "Aprenda a dividir problemas grandes em partes menores e resolvê-los passo a passo — a técnica usada por matemáticas e programadoras!",
        videoUrl: "https://www.youtube.com/embed/KxMSloKEZFQ"
      },
      {
        type: 'practice',
        title: "Desafios de Lógica para Treinar o Cérebro",
        content: "🧠 **Resolva estes enigmas lógicos!**\n\n**Nível 1 — Aquecimento:**\n1. Se todos os gatos têm bigodes, e Tom é um gato, Tom tem bigodes? (Sim/Não)\n\n2. Maria é mais alta que João. João é mais alto que Pedro. Quem é o mais alto dos três?\n\n**Nível 2 — Intermediário:**\n3. Em uma corrida, Ana ultrapassou a pessoa em 2º lugar. Em que posição Ana ficou?\n(Dica: NÃO é 1º lugar!)\n\n4. Um fazendeiro tem galinhas e coelhos. Ele contou 10 cabeças e 34 patas. Quantas galinhas e quantos coelhos?\n(Dica: galinhas = 2 patas, coelhos = 4 patas)\n\n**Nível 3 — Desafio:**\n5. Três caixas estão rotuladas: \"Maçãs\", \"Laranjas\" e \"Misturada\". TODOS os rótulos estão ERRADOS. Você pode tirar UMA fruta de UMA caixa. De qual caixa você tira para descobrir o conteúdo de TODAS?\n(Dica: comece pela caixa rotulada \"Misturada\")\n\n**Respostas:**\n1. Sim! (dedução lógica)\n2. Maria (Maria > João > Pedro)\n3. 2º lugar! (ela substituiu quem estava em 2º)\n4. 3 galinhas e 7 coelhos (3×2 + 7×4 = 6+28 = 34)\n5. Tire da \"Misturada\" — como o rótulo está errado, só tem um tipo. Se sair maçã, é a caixa de maçãs. A que diz \"Maçãs\" (errada) é de laranjas, e a que diz \"Laranjas\" é a misturada!"
      },
      {
        type: 'quiz',
        title: "Quiz de Lógica",
        content: "Se TODOS os gatos têm bigodes, e Tom é um gato, então:\n\nA) Tom não tem bigodes\nB) Tom com certeza tem bigodes\nC) Tom é na verdade um cachorro\nD) Não temos informação suficiente",
        correctAnswer: "B",
        explanation: "Perfeito! Isso é raciocínio dedutivo — se a regra geral é verdadeira (\"todos os gatos têm bigodes\") e Tom pertence ao grupo (\"Tom é um gato\"), a conclusão é GARANTIDA: Tom tem bigodes. Programadoras usam esse tipo de lógica SE/ENTÃO o tempo todo!"
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
        title: "O Mundo das Formas Geométricas",
        content: "📐 Geometria é o estudo das formas, tamanhos e posições das coisas no espaço. É uma das áreas mais antigas da matemática — os egípcios já usavam geometria há 4.000 anos para construir as pirâmides!\n\n**Formas 2D e suas propriedades:**\n\n🔺 **Triângulo** — 3 lados, 3 ângulos que SEMPRE somam 180°\n- Equilátero: 3 lados iguais (perfeito!)\n- Isósceles: 2 lados iguais\n- Escaleno: todos diferentes\n\n⬜ **Quadrado** — 4 lados IGUAIS, 4 ângulos de 90°\n\n🟫 **Retângulo** — 4 ângulos de 90°, lados opostos iguais\n\n⭕ **Círculo** — Sem lados! Todos os pontos estão à mesma distância do centro. O número Pi (π ≈ 3,14159...) é a razão entre a circunferência e o diâmetro — ele nunca acaba e nunca se repete!\n\n⬡ **Hexágono** — 6 lados. As abelhas constroem favos hexagonais porque é a forma que usa menos material para cobrir uma área!\n\n**Ângulos — como medir \"aberturas\":**\n- ∟ **Reto** = 90° (canto de uma folha de papel)\n- **Agudo** < 90° (pontudo, como uma fatia fina de pizza)\n- **Obtuso** > 90° (aberto, como um livro quase fechado)\n- **Raso** = 180° (uma linha reta)\n- **Completo** = 360° (uma volta inteira)\n\n**Área — medindo superfícies:**\n- Retângulo: base × altura\n- Triângulo: (base × altura) ÷ 2\n- Círculo: π × raio²\n\n💡 **Curiosidade:** A geometria é essencial em videogames! Cada personagem, cenário e movimento é calculado usando formas geométricas e coordenadas."
      },
      {
        type: 'video',
        title: "Geometria na Arte e na Natureza",
        content: "Veja como artistas e a própria natureza usam formas geométricas para criar beleza — de vitrais medievais a cristais de neve!",
        videoUrl: "https://www.youtube.com/embed/kkGeOWYOFoA"
      },
      {
        type: 'practice',
        title: "Caça às Formas + Medição",
        content: "🔍 **Missão de geometria no mundo real!**\n\n**Parte 1 — Encontre e registre:**\n\n| Forma | Onde encontrei | Medidas (se possível) |\n|-------|----------------|----------------------|\n| 5 Retângulos | | |\n| 5 Círculos | | |\n| 3 Triângulos | | |\n| 1 Hexágono | | |\n| 2 Ângulos retos | | |\n| 1 Ângulo agudo | | |\n\n**Dicas de onde procurar:**\n- Porta = retângulo. Meça e calcule a área!\n- Relógio = círculo. Meça o diâmetro!\n- Cabide = triângulo\n- Parafuso/porca = hexágono\n- Canto da mesa = ângulo reto\n\n**Parte 2 — Cálculos:**\nPara 3 retângulos que encontrou, meça e calcule:\n- Perímetro (soma de todos os lados)\n- Área (base × altura)\n\n**Parte 3 — Mosaico geométrico:**\nCom papel, régua e lápis de cor:\n1. Desenhe um quadrado de 15cm\n2. Divida em triângulos, quadrados e retângulos menores\n3. Pinte cada forma de uma cor diferente\n4. Calcule a área de cada peça do mosaico\n5. A soma deve dar 225cm² (15 × 15)!"
      },
      {
        type: 'quiz',
        title: "Quiz de Geometria",
        content: "Quantos lados tem um hexágono?\n\nA) 4 lados\nB) 5 lados\nC) 6 lados\nD) 8 lados",
        correctAnswer: "C",
        explanation: "Acertou! \"Hexa\" vem do grego e significa 6. Hexágono = 6 lados. As abelhas constroem seus favos de mel em formato hexagonal porque é a forma mais eficiente — cobre a maior área usando a menor quantidade de cera! A natureza é uma matemática perfeita."
      }
    ]
  },
  {
    id: 5,
    title: "Frações e Porcentagens",
    description: "Partes de um todo — na vida real!",
    icon: "Calculator",
    difficulty: "Intermediário",
    points: 50,
    color: "bg-orange-500",
    lessons: [
      {
        type: 'reading',
        title: "Frações e Porcentagens: Partes do Todo",
        content: "🍕 Frações e porcentagens estão em TUDO — descontos em lojas, receitas, notas na escola, gráficos nas notícias... Vamos dominar esse assunto!\n\n**O que é uma fração?**\nÉ uma parte de um todo. O número de cima (numerador) diz quantas partes temos. O de baixo (denominador) diz em quantas partes o todo foi dividido.\n\n**Exemplo com pizza (8 fatias):**\n- 1/8 = 1 fatia de 8\n- 3/8 = 3 fatias de 8\n- 8/8 = pizza inteira = 1\n\n**Frações equivalentes (parecem diferentes, mas são iguais):**\n- 1/2 = 2/4 = 3/6 = 4/8 = 50/100\n- 1/4 = 2/8 = 25/100\n\n**Porcentagens = frações de 100:**\nPorcentagem significa \"por cento\" (a cada 100).\n- 50% = 50/100 = 1/2 (metade)\n- 25% = 25/100 = 1/4 (um quarto)\n- 10% = 10/100 = 1/10\n- 100% = 100/100 = tudo!\n- 200% = o dobro!\n\n**Como calcular porcentagens (truque rápido!):**\n- 10% de qualquer número: divida por 10\n  10% de R$80 = R$8\n- 5% = metade de 10%\n  5% de R$80 = R$4\n- 15% = 10% + 5%\n  15% de R$80 = R$8 + R$4 = R$12\n- 20% = 10% × 2\n  20% de R$80 = R$16\n\n💡 **Na vida real:** Desconto de 30% em uma blusa de R$100? Você economiza R$30 e paga R$70! Simples assim."
      },
      {
        type: 'video',
        title: "Frações e Porcentagens no Dia a Dia",
        content: "Como usamos frações e porcentagens sem perceber — desde dividir uma pizza até entender descontos em promoções!",
        videoUrl: "https://www.youtube.com/embed/kkGeOWYOFoA"
      },
      {
        type: 'practice',
        title: "Desafios do Mundo Real com Frações",
        content: "🍫 **Problemas práticos que matemáticas resolvem!**\n\n**Desafio 1 — Chocolate:**\nVocê tem uma barra de chocolate com 12 quadradinhos.\n- Se comer 1/4, quantos quadradinhos come? ___\n- Se der 1/3 para sua amiga, quantos ela recebe? ___\n- Se guardar 50%, quantos guarda? ___\nDesenhe a barra e pinte cada parte de uma cor!\n\n**Desafio 2 — Compras:**\nVocê tem R$120 para gastar.\n- Caderno custa R$30. Que fração da mesada é? ___\n- Livro com 25% de desconto de R$80. Quanto paga? ___\n- Sobrou que porcentagem da mesada? ___\n\n**Desafio 3 — Receita:**\nReceita de bolo para 8 pessoas:\n- 2 xícaras de farinha\n- 1 xícara de açúcar\n- 3 ovos\n- 1/2 xícara de leite\n\nVocê precisa fazer para 4 pessoas (METADE). Calcule:\n- Farinha: ___\n- Açúcar: ___\n- Ovos: ___\n- Leite: ___\n\nE para 12 pessoas (1,5x)?\n\n**Respostas:**\n1: 3, 4, 6 | 2: 1/4, R$60, ~25% | 3: 1 xíc., 1/2 xíc., 1,5 ovos, 1/4 xíc."
      },
      {
        type: 'quiz',
        title: "Quiz de Frações e Porcentagens",
        content: "Quanto é 1/2 (metade) de 20?\n\nA) 5\nB) 10\nC) 15\nD) 20",
        correctAnswer: "B",
        explanation: "Exatamente! 1/2 de 20 = 20 ÷ 2 = 10. Metade de 20 é 10. Isso é o mesmo que 50% de 20. Sempre que quiser calcular metade de algo, basta dividir por 2!"
      }
    ]
  },
  {
    id: 6,
    title: "Matemática Criativa",
    description: "Arte, beleza e magia nos números",
    icon: "Shapes",
    difficulty: "Intermediário",
    points: 55,
    color: "bg-fuchsia-500",
    lessons: [
      {
        type: 'reading',
        title: "A Proporção Áurea: O Número mais Belo",
        content: "✨ Existe um número especial que aparece na natureza, na arte, na arquitetura e até no seu rosto: a Proporção Áurea, representada pela letra grega Phi (φ) ≈ 1,618...\n\n**O que é?**\nDois valores estão na proporção áurea quando a razão do todo para a parte maior é IGUAL à razão da parte maior para a menor.\n\n**Onde aparece na natureza:**\n- 🌻 **Girassóis** — As sementes formam espirais em números de Fibonacci (21, 34, 55...). A razão entre números consecutivos de Fibonacci se aproxima de φ!\n- 🐚 **Nautilus** — A concha cresce em uma espiral logarítmica baseada em φ\n- 🌀 **Galáxias** — A Via Láctea forma uma espiral com proporções áureas\n- 🌿 **Folhas** — Muitas plantas posicionam folhas em ângulos de ~137,5° (o \"ângulo áureo\") para captar máxima luz solar\n- 🧬 **DNA** — A dupla hélice do DNA tem proporções próximas a φ\n\n**Na arte e arquitetura:**\n- 🖼️ **Mona Lisa** — O rosto de La Gioconda segue retângulos áureos\n- 🏛️ **Partenon** — O templo grego tem proporções de φ na fachada\n- 📱 **Design moderno** — Logotipos da Apple, Twitter e Google usam espirais áureas\n\n**Conexão com Fibonacci:**\n1, 1, 2, 3, 5, 8, 13, 21, 34, 55...\nDivida cada número pelo anterior:\n1/1=1, 2/1=2, 3/2=1,5, 5/3=1,667, 8/5=1,6, 13/8=1,625...\nViu? Os resultados se aproximam cada vez mais de 1,618...! 🤯\n\n💡 **A matemática não é fria e sem graça — ela é a linguagem mais bonita do universo!**"
      },
      {
        type: 'video',
        title: "A Beleza Escondida da Matemática",
        content: "Descubra como artistas, músicos, arquitetos e até a natureza usam matemática para criar beleza — de pinturas renascentistas a fractais psicodélicos!",
        videoUrl: "https://www.youtube.com/embed/kkGeOWYOFoA"
      },
      {
        type: 'practice',
        title: "Criando Arte com Matemática",
        content: "🎨 **Três projetos de arte matemática!**\n\n**Projeto 1 — Espiral de Fibonacci:**\n1. Desenhe quadrados lado a lado seguindo Fibonacci: 1, 1, 2, 3, 5, 8 cm\n2. Em cada quadrado, desenhe um arco de 1/4 de círculo\n3. Conecte os arcos — você criou a espiral de Fibonacci!\n4. Pinte cada quadrado de uma cor diferente\n\n**Projeto 2 — Mosaico Geométrico (estilo islâmico):**\n1. Desenhe uma grade de triângulos equiláteros\n2. Conecte centros de triângulos para formar estrelas de 6 pontas\n3. Preencha com padrões repetitivos\n4. Use 3-4 cores seguindo uma regra (nenhuma cor toca a mesma cor)\n\n**Projeto 3 — Fractal simples (Triângulo de Sierpinski):**\n1. Desenhe um triângulo grande\n2. Marque os pontos médios de cada lado\n3. Conecte os pontos — você tem 4 triângulos menores!\n4. No triângulo do MEIO, pinte de preto\n5. Repita os passos 2-4 nos 3 triângulos restantes\n6. Continue até não conseguir mais!\n\n💡 Um fractal é um padrão que se repete infinitamente em escalas cada vez menores — como um brócolis romanesco ou a costa do Brasil!\n\n📸 Tire foto da sua obra e compartilhe!"
      },
      {
        type: 'quiz',
        title: "Quiz: Matemática na Natureza",
        content: "Onde encontramos a sequência de Fibonacci na natureza?\n\nA) No formato das nuvens\nB) Nas espirais de sementes dos girassóis\nC) Na velocidade da chuva caindo\nD) Na direção dos ventos",
        correctAnswer: "B",
        explanation: "Isso mesmo! Girassóis são um dos exemplos mais bonitos de Fibonacci na natureza. Suas sementes formam espirais em duas direções, e o número de espirais são SEMPRE números de Fibonacci consecutivos (como 34 e 55). A natureza \"escolheu\" essa organização porque é a mais eficiente para empacotar o máximo de sementes!"
      }
    ]
  }
];

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

export const introductoryPath = sciencePath;
