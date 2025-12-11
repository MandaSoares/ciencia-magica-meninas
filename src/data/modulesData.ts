export interface ModuleLesson {
  type: 'video' | 'reading' | 'practice' | 'quiz' | 'project';
  title: string;
  content: string;
  duration: string;
  videoUrl?: string;
  correctAnswer?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  icon: string;
  totalLessons: number;
  estimatedTime: string;
  lessons: ModuleLesson[];
  finalProject: {
    title: string;
    description: string;
    steps: string[];
  };
}

export const allModules: Module[] = [
  {
    id: "programacao-poderosa",
    title: "Programação Poderosa",
    description: "Aprenda a programar do zero e crie seus próprios programas",
    category: "Tecnologia",
    color: "bg-pink-500",
    icon: "Code",
    totalLessons: 5,
    estimatedTime: "3 horas",
    lessons: [
      {
        type: 'video',
        title: "O que é Programação?",
        content: "Aprenda o básico sobre como computadores entendem instruções.",
        videoUrl: "https://www.youtube.com/embed/Dv7gLpW91DM",
        duration: "12 min"
      },
      {
        type: 'reading',
        title: "Algoritmos - O Coração da Programação",
        content: "# O que é um Algoritmo?\n\nUm **algoritmo** é como uma receita de bolo para o computador. São instruções passo a passo para resolver um problema.\n\n## Exemplo: Fazer um Milkshake\n\n1. Pegue o copo\n2. Adicione 2 bolas de sorvete\n3. Adicione leite até a metade\n4. Ligue o liquidificador por 30 segundos\n5. Despeje no copo\n6. Sirva!\n\n## Características de um bom algoritmo:\n- ✅ Tem início e fim claros\n- ✅ Cada passo é simples\n- ✅ A ordem importa\n- ✅ Resolve o problema\n\n## Linguagens de Programação\nProgramadoras escrevem algoritmos em linguagens especiais:\n- **Scratch** - Visual, ótimo para começar\n- **Python** - Fácil de ler\n- **JavaScript** - Cria sites interativos",
        duration: "15 min"
      },
      {
        type: 'practice',
        title: "Seu Primeiro Programa no Scratch",
        content: "🎮 **Vamos programar!**\n\n1. Acesse **scratch.mit.edu**\n2. Clique em 'Criar'\n3. Siga estes passos:\n\n**Faça o gato andar:**\n- Arraste o bloco 'mova 10 passos'\n- Clique para ver o gato andar!\n\n**Faça o gato falar:**\n- Arraste 'diga Olá por 2 segundos'\n- Mude a mensagem para seu nome\n\n**Faça o gato girar:**\n- Use 'gire 15 graus'\n- Coloque 'repita 24 vezes' ao redor\n\n🎯 **Desafio:** Faça o gato dar uma volta completa dizendo 'Eu sei programar!'",
        duration: "30 min"
      },
      {
        type: 'reading',
        title: "Variáveis e Condições",
        content: "# Variáveis - Caixinhas de Memória\n\nVariáveis guardam informações que podem mudar.\n\n```\nidade = 12\nnome = \"Maria\"\npontos = 0\n```\n\n# Condições - Tomando Decisões\n\nO computador pode tomar decisões usando SE/ENTÃO:\n\n```\nSE idade >= 18 ENTÃO\n    diga \"Pode dirigir\"\nSENÃO\n    diga \"Ainda não pode dirigir\"\n```\n\n# Loops - Repetindo Ações\n\nPara repetir algo várias vezes:\n\n```\nREPITA 5 vezes\n    diga \"Olá!\"\n```\n\nIsso faz o computador dizer 'Olá!' cinco vezes!",
        duration: "20 min"
      },
      {
        type: 'quiz',
        title: "Quiz Final de Programação",
        content: "O que é uma variável na programação?\n\nA) Um erro no código\nB) Um lugar para guardar informações\nC) Uma linguagem de programação\nD) Um tipo de computador",
        correctAnswer: "B",
        duration: "10 min"
      }
    ],
    finalProject: {
      title: "Jogo de Perguntas no Scratch",
      description: "Crie um quiz interativo sobre o tema que você quiser!",
      steps: [
        "Escolha um tema (animais, ciência, esportes)",
        "Crie 5 perguntas sobre o tema",
        "No Scratch, faça o personagem fazer as perguntas",
        "Use 'pergunte' e 'resposta' para verificar",
        "Adicione pontos para respostas certas",
        "Teste com amigos e família!"
      ]
    }
  },
  {
    id: "desenvolvimento-web",
    title: "Desenvolvimento Web",
    description: "Construa sites incríveis do zero",
    category: "Tecnologia",
    color: "bg-cyan-500",
    icon: "Globe",
    totalLessons: 5,
    estimatedTime: "4 horas",
    lessons: [
      {
        type: 'video',
        title: "Como a Internet Funciona",
        content: "Entenda como sites chegam até você através da internet.",
        videoUrl: "https://www.youtube.com/embed/7_LPdttKXPc",
        duration: "10 min"
      },
      {
        type: 'reading',
        title: "HTML - A Estrutura do Site",
        content: "# O que é HTML?\n\nHTML significa **HyperText Markup Language**. É o esqueleto de todo site!\n\n## Tags Básicas\n\n```html\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>Meu Site</title>\n  </head>\n  <body>\n    <h1>Olá, Mundo!</h1>\n    <p>Este é meu primeiro site.</p>\n  </body>\n</html>\n```\n\n## Tags Importantes:\n\n- `<h1>` a `<h6>` - Títulos\n- `<p>` - Parágrafo\n- `<img>` - Imagem\n- `<a>` - Link\n- `<ul>` e `<li>` - Listas\n- `<div>` - Divisão/Seção",
        duration: "20 min"
      },
      {
        type: 'reading',
        title: "CSS - Deixando Bonito",
        content: "# O que é CSS?\n\nCSS significa **Cascading Style Sheets**. É o que deixa os sites bonitos!\n\n## Exemplo Básico\n\n```css\nbody {\n  background-color: pink;\n  font-family: Arial;\n}\n\nh1 {\n  color: purple;\n  font-size: 30px;\n}\n\np {\n  color: gray;\n}\n```\n\n## O que você pode mudar:\n\n- 🎨 **Cores:** `color`, `background-color`\n- 📏 **Tamanhos:** `font-size`, `width`, `height`\n- 📍 **Posição:** `margin`, `padding`\n- 🔤 **Fonte:** `font-family`, `font-weight`",
        duration: "20 min"
      },
      {
        type: 'practice',
        title: "Crie sua Primeira Página",
        content: "💻 **Hora de criar!**\n\n1. Abra o Bloco de Notas\n2. Digite este código:\n\n```html\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Sobre Mim</title>\n  <style>\n    body { background: #fce4ec; font-family: Arial; }\n    h1 { color: #e91e63; }\n  </style>\n</head>\n<body>\n  <h1>Meu Nome</h1>\n  <p>Olá! Eu estou aprendendo a criar sites!</p>\n  <h2>Coisas que eu gosto:</h2>\n  <ul>\n    <li>Item 1</li>\n    <li>Item 2</li>\n  </ul>\n</body>\n</html>\n```\n\n3. Salve como 'meussite.html'\n4. Abra no navegador!\n\n✨ Personalize com suas informações!",
        duration: "40 min"
      },
      {
        type: 'quiz',
        title: "Quiz de Web",
        content: "Qual tag HTML é usada para criar um link?\n\nA) <link>\nB) <a>\nC) <url>\nD) <href>",
        correctAnswer: "B",
        duration: "10 min"
      }
    ],
    finalProject: {
      title: "Portfólio Pessoal",
      description: "Crie um site sobre você para mostrar ao mundo!",
      steps: [
        "Crie uma página com seu nome e foto",
        "Adicione uma seção 'Sobre Mim'",
        "Liste suas habilidades e hobbies",
        "Adicione links para suas redes sociais",
        "Use CSS para deixar colorido e bonito",
        "Peça feedback de amigos!"
      ]
    }
  },
  {
    id: "inteligencia-artificial",
    title: "Inteligência Artificial",
    description: "Entenda como máquinas aprendem",
    category: "Tecnologia",
    color: "bg-purple-500",
    icon: "Brain",
    totalLessons: 5,
    estimatedTime: "3 horas",
    lessons: [
      {
        type: 'video',
        title: "O que é Inteligência Artificial?",
        content: "Descubra como computadores podem 'pensar' e aprender.",
        videoUrl: "https://www.youtube.com/embed/2ePf9rue1Ao",
        duration: "15 min"
      },
      {
        type: 'reading',
        title: "Como Máquinas Aprendem",
        content: "# Machine Learning - Aprendizado de Máquina\n\n## Como funciona?\n\nImagine ensinar um robô a reconhecer gatos:\n\n1. **Mostre muitas fotos de gatos** 🐱🐱🐱\n2. **Mostre fotos que NÃO são gatos** 🐕🌳🚗\n3. **O computador encontra padrões**\n4. **Agora ele reconhece gatos novos!**\n\n## Tipos de IA que você usa:\n\n- 📱 **Filtros de fotos** - Reconhecem rostos\n- 🎵 **Spotify/YouTube** - Recomendam músicas\n- 🗣️ **Alexa/Siri** - Entendem sua voz\n- 🔍 **Google** - Entende o que você procura\n- 🎮 **Jogos** - Inimigos inteligentes",
        duration: "18 min"
      },
      {
        type: 'practice',
        title: "Treine sua Própria IA",
        content: "🤖 **Vamos treinar uma IA!**\n\n1. Acesse **teachablemachine.withgoogle.com**\n2. Clique em 'Get Started'\n3. Escolha 'Image Project'\n\n**Ensinando a IA:**\n1. Crie Classe 1: Tire 30 fotos suas sorrindo\n2. Crie Classe 2: Tire 30 fotos suas séria\n3. Clique em 'Train Model'\n4. Teste! A IA sabe se você está sorrindo?\n\n🎯 **Ideias:** Ensine a reconhecer:\n- Mão aberta vs fechada\n- Diferentes objetos\n- Você vs outra pessoa",
        duration: "40 min"
      },
      {
        type: 'reading',
        title: "IA Responsável",
        content: "# Usando IA com Responsabilidade\n\n## IA pode ter problemas:\n\n- ⚠️ **Preconceitos:** Se aprender com dados ruins, pode ser injusta\n- ⚠️ **Privacidade:** Usa muitos dados pessoais\n- ⚠️ **Fake News:** Pode criar textos e imagens falsas\n\n## Como ser uma criadora de IA responsável:\n\n✅ Sempre verifique se sua IA é justa\n✅ Respeite a privacidade das pessoas\n✅ Seja transparente sobre como funciona\n✅ Pense no impacto na sociedade\n\n*\"Com grandes poderes vêm grandes responsabilidades\"*",
        duration: "15 min"
      },
      {
        type: 'quiz',
        title: "Quiz de IA",
        content: "O que é necessário para treinar uma IA?\n\nA) Apenas um computador rápido\nB) Muitos exemplos para ela aprender\nC) Uma pessoa muito inteligente\nD) Magia",
        correctAnswer: "B",
        duration: "10 min"
      }
    ],
    finalProject: {
      title: "Classificador de Objetos",
      description: "Crie uma IA que reconhece objetos do seu quarto!",
      steps: [
        "Use Teachable Machine",
        "Escolha 3-5 objetos diferentes",
        "Tire 50 fotos de cada objeto",
        "Treine o modelo",
        "Teste com objetos reais",
        "Grave um vídeo mostrando funcionando!"
      ]
    }
  },
  {
    id: "engenharia-mecanica",
    title: "Engenharia Mecânica para Iniciantes",
    description: "Aprenda sobre máquinas e como as coisas funcionam",
    category: "Engenharia",
    color: "bg-orange-500",
    icon: "Cog",
    totalLessons: 5,
    estimatedTime: "3 horas",
    lessons: [
      {
        type: 'video',
        title: "As 6 Máquinas Simples",
        content: "Descubra as máquinas que mudaram a humanidade!",
        videoUrl: "https://www.youtube.com/embed/fvOmaf2GfCY",
        duration: "12 min"
      },
      {
        type: 'reading',
        title: "Máquinas Simples Explicadas",
        content: "# As 6 Máquinas Simples\n\nToda máquina complexa é feita de máquinas simples!\n\n## 1. Alavanca 🎚️\nUma barra que gira em um ponto.\n- Exemplos: gangorra, abridor de garrafa, tesoura\n\n## 2. Polia 🎡\nRoda com corda para mover coisas.\n- Exemplos: mastro de bandeira, elevador\n\n## 3. Roda e Eixo 🛞\nRoda presa a um bastão.\n- Exemplos: maçaneta, volante, bicicleta\n\n## 4. Plano Inclinado 📐\nRampa que facilita subir.\n- Exemplos: escorregador, rampa de skate\n\n## 5. Cunha 🔪\nDois planos inclinados juntos.\n- Exemplos: faca, machado, pregos\n\n## 6. Parafuso 🔩\nPlano inclinado enrolado.\n- Exemplos: tampa de garrafa, saca-rolhas",
        duration: "20 min"
      },
      {
        type: 'practice',
        title: "Caça às Máquinas",
        content: "🔍 **Encontre máquinas simples na sua casa!**\n\n**Procure e anote:**\n\n1. **Alavancas** (3 exemplos)\n   - Onde encontrou?\n   - Como funciona?\n\n2. **Rodas e Eixos** (3 exemplos)\n\n3. **Planos Inclinados** (2 exemplos)\n\n4. **Cunhas** (2 exemplos)\n\n5. **Parafusos** (2 exemplos)\n\n📸 Tire fotos de cada uma!\n\n**Bônus:** Encontre uma máquina que usa DUAS ou mais máquinas simples juntas!",
        duration: "30 min"
      },
      {
        type: 'reading',
        title: "Força e Movimento",
        content: "# As Leis de Newton\n\nIsaac Newton descobriu como as coisas se movem!\n\n## 1ª Lei - Inércia\n- Coisas paradas querem ficar paradas\n- Coisas em movimento querem continuar\n- Por isso usamos cinto de segurança!\n\n## 2ª Lei - F = m × a\n- Quanto mais força, mais rápido acelera\n- Quanto mais pesado, mais força precisa\n\n## 3ª Lei - Ação e Reação\n- Para toda ação, há uma reação igual\n- É assim que foguetes funcionam!\n- Você empurra o chão, ele empurra você",
        duration: "15 min"
      },
      {
        type: 'quiz',
        title: "Quiz de Mecânica",
        content: "Qual máquina simples é uma tesoura?\n\nA) Polia\nB) Alavanca\nC) Parafuso\nD) Roda e eixo",
        correctAnswer: "B",
        duration: "10 min"
      }
    ],
    finalProject: {
      title: "Máquina de Reação em Cadeia",
      description: "Construa uma sequência de máquinas que funcionam uma após a outra!",
      steps: [
        "Planeje 5 etapas de reação em cadeia",
        "Use pelo menos 3 máquinas simples diferentes",
        "Materiais: dominós, bolas, rampas, copos",
        "Teste cada etapa separadamente",
        "Monte tudo junto",
        "Grave um vídeo da máquina funcionando!"
      ]
    }
  },
  {
    id: "engenharia-aeroespacial",
    title: "Engenharia Aeroespacial Básica",
    description: "Descubra como aviões e foguetes funcionam",
    category: "Engenharia",
    color: "bg-sky-500",
    icon: "Plane",
    totalLessons: 5,
    estimatedTime: "3 horas",
    lessons: [
      {
        type: 'video',
        title: "Como Aviões Voam",
        content: "Entenda a física por trás do voo!",
        videoUrl: "https://www.youtube.com/embed/Gg0TXNXgz-w",
        duration: "12 min"
      },
      {
        type: 'reading',
        title: "As 4 Forças do Voo",
        content: "# Por que aviões voam?\n\nQuatro forças atuam em um avião:\n\n## 1. Sustentação ⬆️\n- Empurra o avião para CIMA\n- Vem do formato das asas\n- O ar passa mais rápido por cima da asa\n\n## 2. Peso ⬇️\n- Puxa o avião para BAIXO\n- É a gravidade!\n- Aviões precisam ser leves\n\n## 3. Empuxo ➡️\n- Empurra para FRENTE\n- Vem dos motores\n- Hélices ou turbinas\n\n## 4. Arrasto ⬅️\n- Puxa para TRÁS\n- É a resistência do ar\n- Por isso aviões são aerodinâmicos\n\n**Para voar:** Sustentação > Peso E Empuxo > Arrasto",
        duration: "18 min"
      },
      {
        type: 'practice',
        title: "Avião de Papel Científico",
        content: "✈️ **Experimente com aviões de papel!**\n\n**Hipótese:** Qual formato voa mais longe?\n\n**Materiais:** 4 folhas de papel iguais\n\n**Experimento:**\n1. Faça 4 aviões DIFERENTES\n2. Numere cada um (1-4)\n3. Lance cada um 3 vezes do MESMO lugar\n4. Meça a distância\n\n**Tabela:**\n| Avião | Tentativa 1 | Tentativa 2 | Tentativa 3 | Média |\n|-------|-------------|-------------|-------------|-------|\n| 1     |             |             |             |       |\n| 2     |             |             |             |       |\n\n**Conclusão:** Qual voou mais longe? Por quê?",
        duration: "35 min"
      },
      {
        type: 'reading',
        title: "Foguetes e o Espaço",
        content: "# Como Foguetes Funcionam\n\n## 3ª Lei de Newton em Ação!\n- Gases saem com força para BAIXO\n- Foguete sobe com força para CIMA\n\n## Estágios do Foguete\n1. **1º Estágio:** Mais potente, sai da Terra\n2. **2º Estágio:** Continua no espaço\n3. **Cápsula:** Leva astronautas\n\n## Brasileiras na Exploração Espacial\n🇧🇷 O Brasil tem programa espacial!\n- Centro de Lançamento de Alcântara\n- Satélites brasileiros no espaço\n- Futuras astronautas brasileiras!\n\n## Desafios do Espaço\n- Sem ar para respirar\n- Temperaturas extremas\n- Sem gravidade (flutuando!)",
        duration: "20 min"
      },
      {
        type: 'quiz',
        title: "Quiz Aeroespacial",
        content: "Qual força faz o avião subir?\n\nA) Arrasto\nB) Peso\nC) Sustentação\nD) Empuxo",
        correctAnswer: "C",
        duration: "10 min"
      }
    ],
    finalProject: {
      title: "Foguete de Garrafa PET",
      description: "Construa um foguete que realmente lança!",
      steps: [
        "Materiais: garrafa PET, papelão, rolha, bomba de bicicleta",
        "Corte asas de papelão e cole na garrafa",
        "Faça um cone para o topo",
        "Encha 1/3 com água",
        "Use a bomba para pressurizar (CUIDADO!)",
        "Lance ao ar livre com adulto supervisionando!"
      ]
    }
  },
  {
    id: "matematica-criativa",
    title: "Matemática Criativa",
    description: "Descubra a beleza escondida nos números",
    category: "Matemática",
    color: "bg-fuchsia-500",
    icon: "Shapes",
    totalLessons: 5,
    estimatedTime: "3 horas",
    lessons: [
      {
        type: 'video',
        title: "Matemática na Arte",
        content: "Veja como artistas usam matemática para criar obras incríveis!",
        videoUrl: "https://www.youtube.com/embed/kkGeOWYOFoA",
        duration: "12 min"
      },
      {
        type: 'reading',
        title: "Padrões Mágicos",
        content: "# A Sequência de Fibonacci\n\n## Os Números Mágicos\n1, 1, 2, 3, 5, 8, 13, 21, 34, 55...\n\nCada número é a soma dos dois anteriores!\n\n## Fibonacci na Natureza\n- 🌻 Espirais de girassóis\n- 🐚 Caracóis de conchas\n- 🌀 Galáxias espirais\n- 🌿 Folhas nas plantas\n\n## A Proporção Áurea (φ)\n- Número especial: 1.618...\n- Considerado 'perfeito' pelos artistas\n- Usado em logos, arte, arquitetura\n- Seu rosto pode ter essa proporção!",
        duration: "18 min"
      },
      {
        type: 'practice',
        title: "Arte com Matemática",
        content: "🎨 **Crie arte matemática!**\n\n**1. Espiral de Fibonacci:**\n- Desenhe quadrados com lados: 1, 1, 2, 3, 5, 8 cm\n- Encaixe um do lado do outro\n- Desenhe um arco em cada quadrado\n- Resultado: espiral perfeita!\n\n**2. Mandala Geométrica:**\n- Trace um círculo com compasso\n- Divida em 6 ou 8 partes iguais\n- Desenhe padrões repetidos em cada parte\n- Pinte com cores que combinam!\n\n📸 Compartilhe sua arte matemática!",
        duration: "40 min"
      },
      {
        type: 'reading',
        title: "Formas e Simetria",
        content: "# Tipos de Simetria\n\n## Simetria de Reflexão (Espelho)\n- Os dois lados são iguais\n- Exemplos: borboleta, rosto humano\n\n## Simetria de Rotação\n- Parece igual ao girar\n- Exemplos: flor, estrela do mar\n\n## Simetria de Translação\n- Padrão que se repete\n- Exemplos: papel de parede, azulejos\n\n## Formas na Natureza\n- 🐝 Favos de mel: hexágonos perfeitos\n- ❄️ Flocos de neve: simetria 6x\n- 🌊 Ondas: padrões repetidos\n- 🕸️ Teias de aranha: espirais simétricas",
        duration: "15 min"
      },
      {
        type: 'quiz',
        title: "Quiz de Matemática Criativa",
        content: "Qual é o próximo número de Fibonacci: 1, 1, 2, 3, 5, 8, ?\n\nA) 11\nB) 12\nC) 13\nD) 14",
        correctAnswer: "C",
        duration: "10 min"
      }
    ],
    finalProject: {
      title: "Mural de Arte Matemática",
      description: "Crie um pôster combinando arte e matemática!",
      steps: [
        "Escolha um tema: natureza, espaço, abstrato",
        "Inclua pelo menos uma espiral de Fibonacci",
        "Adicione formas geométricas simétricas",
        "Use a proporção áurea para o layout",
        "Escreva curiosidades matemáticas no mural",
        "Exponha na escola ou em casa!"
      ]
    }
  },
  {
    id: "laboratorio-cientifico",
    title: "Laboratório Científico em Casa",
    description: "Experimentos seguros e divertidos",
    category: "Ciência",
    color: "bg-green-500",
    icon: "Beaker",
    totalLessons: 6,
    estimatedTime: "4 horas",
    lessons: [
      {
        type: 'video',
        title: "Seja uma Cientista",
        content: "Aprenda a fazer experimentos como uma cientista de verdade!",
        videoUrl: "https://www.youtube.com/embed/RSgCMx-QTVo",
        duration: "10 min"
      },
      {
        type: 'reading',
        title: "Segurança no Laboratório",
        content: "# Regras Importantes ⚠️\n\n## Antes de começar:\n✅ Peça ajuda de um adulto\n✅ Leia todo o experimento antes\n✅ Separe todos os materiais\n✅ Use roupas que podem sujar\n\n## Durante o experimento:\n✅ Nunca prove substâncias\n✅ Cuidado com coisas quentes\n✅ Proteja os olhos\n✅ Trabalhe em local ventilado\n\n## Depois:\n✅ Limpe tudo\n✅ Lave as mãos\n✅ Guarde os materiais\n✅ Descarte corretamente",
        duration: "10 min"
      },
      {
        type: 'practice',
        title: "Experimento: Lava de Lâmpada",
        content: "🌋 **Faça uma lâmpada de lava caseira!**\n\n**Materiais:**\n- Garrafa transparente\n- Água (1/4 da garrafa)\n- Óleo de cozinha (resto da garrafa)\n- Corante alimentício\n- Pastilha efervescente\n\n**Passos:**\n1. Coloque água na garrafa\n2. Complete com óleo\n3. Espere separar (óleo fica em cima)\n4. Adicione gotas de corante\n5. Quebre a pastilha e jogue dentro\n6. Observe a magia! ✨\n\n**Ciência:** O gás carbônico da pastilha sobe levando gotas de água colorida!",
        duration: "30 min"
      },
      {
        type: 'practice',
        title: "Experimento: Leite Colorido",
        content: "🎨 **Arte com reação química!**\n\n**Materiais:**\n- Prato fundo\n- Leite integral\n- Corantes alimentícios (várias cores)\n- Detergente\n- Cotonete\n\n**Passos:**\n1. Cubra o fundo do prato com leite\n2. Pingue gotas de corante (várias cores)\n3. Molhe o cotonete no detergente\n4. Toque o leite com o cotonete\n5. As cores explodem! 💥\n\n**Ciência:** O detergente quebra a gordura do leite, causando movimento!",
        duration: "25 min"
      },
      {
        type: 'practice',
        title: "Experimento: Ovo Quicante",
        content: "🥚 **Transforme um ovo em borracha!**\n\n**Materiais:**\n- 1 ovo cru\n- 1 copo alto\n- Vinagre\n\n**Passos:**\n1. Coloque o ovo no copo\n2. Cubra com vinagre\n3. Observe bolhas se formando\n4. Espere 24-48 horas\n5. Retire e enxágue delicadamente\n6. O ovo quica! (de pequenas alturas)\n\n**Ciência:** O ácido do vinagre dissolve a casca de cálcio, deixando só a membrana!\n\n⚠️ Cuidado: ainda é frágil!",
        duration: "5 min (+48h de espera)"
      },
      {
        type: 'quiz',
        title: "Quiz do Laboratório",
        content: "Por que o ovo fica 'quicante' no vinagre?\n\nA) O vinagre cozinha o ovo\nB) O ácido dissolve a casca\nC) O ovo fica mais velho\nD) É mágica",
        correctAnswer: "B",
        duration: "10 min"
      }
    ],
    finalProject: {
      title: "Feira de Ciências Caseira",
      description: "Organize uma mini feira de ciências em casa!",
      steps: [
        "Escolha 3 experimentos favoritos",
        "Prepare os materiais para cada um",
        "Faça cartazes explicando a ciência",
        "Convide família/amigos",
        "Apresente como uma cientista!",
        "Responda perguntas da 'plateia'"
      ]
    }
  },
  {
    id: "seguranca-digital",
    title: "Segurança Digital",
    description: "Aprenda a se proteger na internet",
    category: "Tecnologia",
    color: "bg-red-500",
    icon: "Shield",
    totalLessons: 5,
    estimatedTime: "2.5 horas",
    lessons: [
      {
        type: 'video',
        title: "Internet Segura",
        content: "Aprenda a navegar na internet com segurança!",
        videoUrl: "https://www.youtube.com/embed/rWLwD_Z-RI8",
        duration: "12 min"
      },
      {
        type: 'reading',
        title: "Senhas Fortes",
        content: "# Como Criar Senhas Seguras\n\n## Senha RUIM ❌\n- 123456\n- senha\n- seu nome\n- data de nascimento\n\n## Senha BOA ✅\n- Mais de 12 caracteres\n- Letras maiúsculas E minúsculas\n- Números\n- Símbolos (@#$%)\n\n## Truque Fácil:\nTransforme uma frase em senha!\n\n\"Minha gata Luna tem 3 anos!\"\n→ **MgLt3a!**\n\n## Regras de Ouro:\n🔒 Nunca compartilhe senhas\n🔒 Use senhas diferentes\n🔒 Troque regularmente\n🔒 Não escreva em papel",
        duration: "15 min"
      },
      {
        type: 'reading',
        title: "Perigos Online",
        content: "# Cuidado com:\n\n## Phishing 🎣\n- E-mails/mensagens falsas\n- Fingem ser bancos ou lojas\n- Querem suas informações\n\n**Como identificar:**\n- Erros de português\n- Links estranhos\n- Pede dados pessoais\n\n## Cyberbullying 😢\n- Agressões pela internet\n- Mensagens maldosas\n- Compartilhar fotos sem permissão\n\n**O que fazer:**\n- Conte para um adulto\n- Bloqueie a pessoa\n- Guarde as provas\n\n## Pessoas Estranhas 👤\n- Nunca encontre desconhecidos\n- Não compartilhe onde mora\n- Cuidado com perfis falsos",
        duration: "18 min"
      },
      {
        type: 'practice',
        title: "Auditoria de Segurança",
        content: "🔐 **Verifique sua segurança!**\n\n**Checklist:**\n\n□ Minhas senhas têm mais de 12 caracteres?\n□ Uso senhas diferentes em cada site?\n□ Meu perfil de redes sociais é privado?\n□ Só aceito amigos que conheço pessoalmente?\n□ Tenho um adulto de confiança para contar problemas?\n□ Sei identificar links suspeitos?\n\n**Ação:**\n1. Mude uma senha fraca hoje\n2. Revise as configurações de privacidade\n3. Converse com um adulto sobre segurança online",
        duration: "20 min"
      },
      {
        type: 'quiz',
        title: "Quiz de Segurança",
        content: "Qual é uma senha FORTE?\n\nA) senha123\nB) 12345678\nC) MeuG@to2024!\nD) maria",
        correctAnswer: "C",
        duration: "10 min"
      }
    ],
    finalProject: {
      title: "Guia de Segurança para Amigas",
      description: "Crie um guia ilustrado de segurança digital!",
      steps: [
        "Escolha 5 dicas importantes",
        "Ilustre cada dica com desenhos",
        "Use linguagem fácil de entender",
        "Adicione exemplos práticos",
        "Compartilhe com amigas e família",
        "Ajude mais meninas a ficarem seguras!"
      ]
    }
  },
  {
    id: "ciencias-natureza",
    title: "Ciências da Natureza Aplicada",
    description: "Explore os segredos do mundo natural",
    category: "Ciência",
    color: "bg-emerald-500",
    icon: "Leaf",
    totalLessons: 5,
    estimatedTime: "3 horas",
    lessons: [
      {
        type: 'video',
        title: "Ecossistemas Incríveis",
        content: "Descubra como a natureza funciona em harmonia!",
        videoUrl: "https://www.youtube.com/embed/oV_g9N5xCCM",
        duration: "12 min"
      },
      {
        type: 'reading',
        title: "Cadeias Alimentares",
        content: "# Como a Energia Flui na Natureza\n\n## Níveis da Cadeia:\n\n🌱 **Produtores**\n- Plantas fazem fotossíntese\n- Transformam luz solar em energia\n\n🐛 **Consumidores Primários**\n- Herbívoros\n- Comem plantas\n\n🐍 **Consumidores Secundários**\n- Carnívoros\n- Comem herbívoros\n\n🦅 **Consumidores Terciários**\n- Predadores de topo\n- Poucos inimigos naturais\n\n🍂 **Decompositores**\n- Fungos e bactérias\n- Reciclam nutrientes\n\n## Exemplo:\n☀️ Sol → 🌿 Grama → 🐰 Coelho → 🦊 Raposa → 🦠 Bactérias",
        duration: "18 min"
      },
      {
        type: 'practice',
        title: "Diário da Natureza",
        content: "🌿 **Seja uma naturalista por uma semana!**\n\n**Materiais:**\n- Caderno\n- Lápis de cor\n- Celular para fotos (opcional)\n\n**Missão Diária:**\n1. Observe a natureza por 15 minutos\n2. Desenhe ou fotografe algo interessante\n3. Anote:\n   - O que viu (animal/planta)\n   - Onde encontrou\n   - O que estava fazendo\n   - Data e hora\n\n**Ao final da semana:**\n- Quantas espécies diferentes você observou?\n- O que te surpreendeu?\n- Qual foi sua descoberta favorita?",
        duration: "30 min/dia"
      },
      {
        type: 'reading',
        title: "Ciclos da Natureza",
        content: "# Ciclos que Mantêm a Vida\n\n## Ciclo da Água 💧\n1. Sol aquece água (evaporação)\n2. Vapor sobe e esfria (condensação)\n3. Forma nuvens e chove (precipitação)\n4. Água volta ao solo (infiltração)\n5. Recomeça!\n\n## Ciclo do Carbono 🌍\n- Plantas absorvem CO₂\n- Animais respiram e soltam CO₂\n- Decompositores liberam carbono\n- Equilíbrio natural!\n\n## Problema Atual:\n- Humanos queimam combustíveis\n- Muito CO₂ na atmosfera\n- Terra aquecendo demais\n- Precisamos de soluções!",
        duration: "15 min"
      },
      {
        type: 'quiz',
        title: "Quiz de Ciências Naturais",
        content: "Quem são os produtores em uma cadeia alimentar?\n\nA) Animais carnívoros\nB) Plantas\nC) Fungos\nD) Animais herbívoros",
        correctAnswer: "B",
        duration: "10 min"
      }
    ],
    finalProject: {
      title: "Mini-Ecossistema em Garrafa",
      description: "Crie um terrário auto-sustentável!",
      steps: [
        "Garrafa PET grande ou pote de vidro",
        "Camadas: pedras, carvão, terra",
        "Plante pequenas plantas ou musgos",
        "Adicione água (pouca!)",
        "Feche e observe por semanas",
        "Documente as mudanças com fotos e anotações"
      ]
    }
  },
  {
    id: "fisica-divertida",
    title: "Física Divertida",
    description: "Descubra as leis que governam o universo",
    category: "Ciência",
    color: "bg-indigo-500",
    icon: "Zap",
    totalLessons: 5,
    estimatedTime: "3 horas",
    lessons: [
      {
        type: 'video',
        title: "Física no Dia a Dia",
        content: "A física está em tudo que você faz - até andar de bicicleta!",
        videoUrl: "https://www.youtube.com/embed/ZM8ECpBuQYE",
        duration: "12 min"
      },
      {
        type: 'reading',
        title: "Leis de Newton na Prática",
        content: "# Newton Explica seu Dia!\n\n## Acordando (1ª Lei - Inércia)\nVocê quer ficar na cama porque seu corpo prefere ficar parado!\n\n## Indo para a Escola (2ª Lei - F=ma)\n- Pedalar mais rápido = bicicleta acelera\n- Subir morro = precisa mais força\n- Mochila pesada = mais difícil correr\n\n## Jogando Bola (3ª Lei - Ação e Reação)\n- Você chuta a bola (ação)\n- A bola 'chuta' seu pé de volta (reação)\n- Por isso pode doer se chutar muito forte!\n\n## Na Piscina\n- Você empurra a água para trás\n- A água te empurra para frente\n- Assim você nada!",
        duration: "18 min"
      },
      {
        type: 'practice',
        title: "Experimento: Inércia do Ovo",
        content: "🥚 **Veja a inércia em ação!**\n\n**Materiais:**\n- Copo com água (3/4 cheio)\n- Bandeja de alumínio\n- Rolo de papel higiênico vazio\n- Ovo cru\n\n**Montagem:**\n1. Coloque o copo na mesa\n2. Bandeja em cima do copo\n3. Rolo de pé em cima da bandeja\n4. Ovo em cima do rolo\n\n**Ação:**\n1. Bata na bandeja com força HORIZONTAL\n2. A bandeja voa\n3. O rolo cai\n4. O ovo CAI DENTRO DO COPO! 🎉\n\n**Por quê?** O ovo quer ficar parado (inércia)!",
        duration: "25 min"
      },
      {
        type: 'reading',
        title: "Energia e Transformação",
        content: "# Tipos de Energia\n\n## Energia Cinética 🏃\n- Energia do movimento\n- Quanto mais rápido, mais energia\n\n## Energia Potencial 📍\n- Energia 'guardada'\n- Gravidade: quanto mais alto, mais energia\n- Elástico: esticado, tem energia\n\n## Transformações:\n- Montanha-russa no topo: potencial\n- Descendo: potencial → cinética\n- Subindo: cinética → potencial\n\n## Conservação de Energia\n- Energia não é criada nem destruída\n- Apenas muda de forma!\n- Som, luz, calor são formas de energia",
        duration: "15 min"
      },
      {
        type: 'quiz',
        title: "Quiz de Física",
        content: "Por que uma bola rolando para eventualmente?\n\nA) A gravidade puxa para baixo\nB) O atrito 'rouba' energia\nC) A bola fica cansada\nD) A energia desaparece",
        correctAnswer: "B",
        duration: "10 min"
      }
    ],
    finalProject: {
      title: "Montanha-Russa de Bolinha",
      description: "Construa uma montanha-russa que demonstra física!",
      steps: [
        "Materiais: tubos de papel toalha, papelão, fita, bolinha de gude",
        "Planeje um trajeto com subidas e descidas",
        "A primeira descida deve ser a mais alta",
        "Inclua pelo menos um loop",
        "Teste e ajuste para a bolinha completar o trajeto",
        "Explique a física envolvida em cada parte!"
      ]
    }
  }
];

export const getModulesByCategory = (category: string): Module[] => {
  return allModules.filter(m => m.category === category);
};

export const getAllCategories = (): string[] => {
  return [...new Set(allModules.map(m => m.category))];
};
