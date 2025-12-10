export interface Scientist {
  id: number;
  name: string;
  field: string;
  achievement: string;
  year: string;
  image: string;
  description: string;
  facts: string[];
  fullStory: string;
  area: string;
}

export const scientists: Scientist[] = [
  // CIÊNCIA
  {
    id: 1,
    name: "Marie Curie",
    field: "Física e Química",
    achievement: "Primeira mulher a ganhar um Prêmio Nobel",
    year: "1867-1934",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop&crop=face",
    description: "Pioneira no estudo da radioatividade e duas vezes ganhadora do Nobel.",
    facts: [
      "Primeira mulher professora na Universidade de Paris",
      "Descobriu os elementos polônio e rádio",
      "Única pessoa a ganhar Nobel em duas áreas diferentes"
    ],
    fullStory: `Marie Curie nasceu Maria Sklodowska em Varsóvia, Polônia, em 1867. Desde pequena, demonstrou uma inteligência extraordinária e amor pelo conhecimento.

Na época, mulheres não podiam frequentar universidades na Polônia, então Marie estudou secretamente na "Universidade Volante" - aulas clandestinas organizadas por intelectuais poloneses.

Aos 24 anos, mudou-se para Paris para estudar na Sorbonne, onde vivia em condições muito humildes, às vezes passando fome para comprar livros. Mesmo assim, formou-se em primeiro lugar em física!

Conheceu Pierre Curie, um cientista brilhante, e juntos começaram a pesquisar misteriosas radiações. Marie cunhou o termo "radioatividade" e descobriu dois novos elementos: polônio (em homenagem à Polônia) e rádio.

Em 1903, tornou-se a primeira mulher a ganhar um Nobel, em Física. Em 1911, ganhou outro Nobel, desta vez em Química - sendo a única pessoa na história a conquistar o prêmio em duas ciências diferentes!

Durante a Primeira Guerra Mundial, Marie criou unidades móveis de raio-X para ajudar médicos a localizar balas em soldados feridos, salvando milhares de vidas.

Infelizmente, a exposição prolongada à radiação afetou sua saúde. Marie faleceu em 1934, mas seu legado continua inspirando cientistas no mundo todo. Seus cadernos de pesquisa ainda são tão radioativos que precisam ser guardados em caixas de chumbo!`,
    area: "Ciência"
  },
  {
    id: 2,
    name: "Rosalind Franklin",
    field: "Química e Biologia Molecular",
    achievement: "Fotografou a estrutura do DNA com raio-X",
    year: "1920-1958",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop&crop=face",
    description: "Suas fotografias de raio-X foram cruciais para entender a estrutura do DNA.",
    facts: [
      "A 'Foto 51' que tirou foi essencial para descobrir a estrutura do DNA",
      "Pioneira em cristalografia de raio-X",
      "Também fez pesquisas importantes sobre vírus"
    ],
    fullStory: `Rosalind Franklin nasceu em Londres em 1920, em uma família que valorizava muito a educação. Desde cedo, mostrou talento excepcional para ciências.

Estudou química em Cambridge, onde enfrentou preconceito por ser mulher em um campo dominado por homens. Mesmo assim, obteve resultados brilhantes e ganhou uma bolsa para pesquisar em Paris.

Em Paris, Rosalind aprendeu técnicas avançadas de cristalografia de raio-X - uma forma de "fotografar" a estrutura de moléculas. Voltou à Inglaterra para trabalhar no King's College, em Londres.

Foi lá que, em 1952, Rosalind tirou a famosa "Foto 51" - uma imagem de raio-X do DNA que revelava claramente sua estrutura em dupla hélice. Esta foto é considerada uma das mais importantes da história da ciência!

Infelizmente, sua foto foi mostrada a outros cientistas sem seu conhecimento ou permissão. James Watson e Francis Crick usaram essas informações para criar seu modelo do DNA, ganhando o Nobel em 1962. Rosalind não foi creditada adequadamente.

Rosalind faleceu de câncer de ovário em 1958, aos 37 anos, provavelmente devido à exposição à radiação em suas pesquisas. Ela nunca soube da importância total de suas descobertas.

Hoje, Rosalind Franklin é reconhecida como uma das cientistas mais importantes do século XX. Sua história nos lembra da importância de dar crédito justo às mulheres na ciência.`,
    area: "Ciência"
  },
  {
    id: 3,
    name: "Jane Goodall",
    field: "Primatologia e Etologia",
    achievement: "Maior especialista mundial em chimpanzés",
    year: "1934-presente",
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&h=300&fit=crop&crop=face",
    description: "Revolucionou nosso entendimento sobre os chimpanzés e a conservação animal.",
    facts: [
      "Passou mais de 60 anos estudando chimpanzés na Tanzânia",
      "Descobriu que chimpanzés usam ferramentas",
      "Fundou o Jane Goodall Institute para conservação"
    ],
    fullStory: `Jane Goodall nasceu em Londres em 1934. Desde criança, sonhava em ir à África estudar animais. Seu brinquedo favorito era um chimpanzé de pelúcia chamado Jubilee.

Sem dinheiro para faculdade, Jane trabalhou como secretária e garçonete para economizar. Aos 23 anos, finalmente viajou para o Quênia, onde conheceu o famoso paleontólogo Louis Leakey.

Leakey ficou impressionado com a paixão e dedicação de Jane e a enviou para estudar chimpanzés selvagens na Tanzânia, em 1960. Ela tinha apenas 26 anos e nenhum treinamento formal.

No início, os chimpanzés fugiam dela. Jane foi paciente e, aos poucos, ganhou a confiança deles. Fez descobertas revolucionárias: chimpanzés usam ferramentas (galhos para "pescar" cupins), têm personalidades distintas, e formam laços familiares complexos.

Uma de suas descobertas mais importantes abalou a ciência: os chimpanzés não eram sempre pacíficos. Eles podiam ser violentos e até fazer "guerras" entre grupos. Isso mudou como entendemos a evolução humana.

Jane deu nomes aos chimpanzés (David Greybeard, Flo, Frodo) em vez de números, algo criticado na época, mas que humanizou os animais aos olhos do público.

Hoje, aos 90 anos, Jane viaja o mundo promovendo conservação ambiental. Seu programa "Roots & Shoots" inspira jovens em mais de 60 países a proteger o planeta.`,
    area: "Ciência"
  },
  
  // TECNOLOGIA
  {
    id: 4,
    name: "Ada Lovelace",
    field: "Matemática e Computação",
    achievement: "Primeira programadora da história",
    year: "1815-1852",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
    description: "Escreveu o primeiro algoritmo de computador da história.",
    facts: [
      "Filha do poeta Lord Byron",
      "Previu que computadores poderiam criar música e arte",
      "O Dia de Ada Lovelace celebra mulheres na tecnologia"
    ],
    fullStory: `Augusta Ada King, Condessa de Lovelace, nasceu em Londres em 1815. Ela era filha do famoso poeta Lord Byron, mas nunca conheceu o pai, que deixou a família quando ela era bebê.

Sua mãe, Lady Byron, temia que Ada herdasse a natureza "louca" do pai e a criou com rigoroso estudo de matemática e lógica. O que parecia uma restrição se tornou um presente!

Aos 17 anos, Ada conheceu Charles Babbage, inventor da "Máquina Analítica" - o primeiro design de computador do mundo. Ada ficou fascinada e começou a trabalhar com ele.

Babbage a chamava de "A Encantadora de Números". Ada não apenas entendia a máquina, mas via seu potencial além dos cálculos matemáticos.

Em 1843, Ada publicou notas sobre a Máquina Analítica que incluíam o que é considerado o primeiro programa de computador da história - um algoritmo para calcular números de Bernoulli.

Mais impressionante: Ada previu que computadores poderiam um dia compor música, criar arte e fazer muito mais que cálculos. Isso, 100 anos antes dos primeiros computadores existirem!

Infelizmente, Ada morreu de câncer aos 36 anos, antes de ver suas ideias se tornarem realidade. Hoje, a linguagem de programação "Ada" leva seu nome, e o "Dia de Ada Lovelace" (outubro) celebra mulheres na tecnologia.`,
    area: "Tecnologia"
  },
  {
    id: 5,
    name: "Grace Hopper",
    field: "Ciência da Computação",
    achievement: "Criou o primeiro compilador e popularizou COBOL",
    year: "1906-1992",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
    description: "Pioneira da programação, tornou computadores mais acessíveis.",
    facts: [
      "Almirante da Marinha dos EUA",
      "Cunhou o termo 'bug' para erros de computador",
      "Trabalhou até os 79 anos!"
    ],
    fullStory: `Grace Murray Hopper nasceu em Nova York em 1906. Curiosa desde pequena, aos 7 anos desmontou 7 despertadores para ver como funcionavam (seus pais não ficaram felizes!).

Formou-se em matemática e física em Yale, tornando-se professora universitária. Quando a Segunda Guerra Mundial começou, Grace queria servir seu país e entrou para a Marinha aos 37 anos.

Foi designada para trabalhar com o Mark I, um dos primeiros computadores. Aprendeu a programar do zero e descobriu uma paixão por máquinas.

Um dia, o computador parou de funcionar. Investigando, Grace encontrou uma mariposa presa nos circuitos! Ela colou o inseto no livro de registros, escrevendo: "Primeiro caso real de bug encontrado." Nascia o termo "bug" para erros de computador!

Grace acreditava que programar deveria ser mais fácil. Criou o primeiro "compilador" - um programa que traduz linguagem humana para linguagem de máquina. As pessoas acharam impossível, mas ela provou que estavam erradas.

Também liderou a criação do COBOL, uma linguagem de programação usada até hoje em bancos e empresas. "Se é uma boa ideia, vá em frente e faça!", dizia.

Grace trabalhou até os 79 anos, sendo a pessoa mais velha em serviço ativo na Marinha. Morreu aos 85, coberta de honrarias. O destroyer USS Hopper foi batizado em sua homenagem.`,
    area: "Tecnologia"
  },
  {
    id: 6,
    name: "Katherine Johnson",
    field: "Matemática e Computação",
    achievement: "Calculou trajetórias para missões espaciais da NASA",
    year: "1918-2020",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=300&fit=crop&crop=face",
    description: "Matemática brilhante que ajudou a levar o homem à lua.",
    facts: [
      "Seus cálculos foram essenciais para o sucesso da Apollo 11",
      "Trabalhou na NASA por mais de 30 anos",
      "Recebeu a Medalha Presidencial da Liberdade"
    ],
    fullStory: `Katherine Coleman Goble Johnson nasceu em 1918 na Virgínia, EUA, em uma época de forte segregação racial. Negros e brancos eram separados em escolas, restaurantes e até bebedouros.

Katherine era um prodígio matemático. Com 10 anos, já estava no ensino médio. Aos 18, formou-se com honras na faculdade.

Em 1953, começou a trabalhar na NACA (futura NASA) como "computador humano" - pessoas que faziam cálculos complexos manualmente. Trabalhava em uma seção separada para mulheres negras.

Katherine não aceitou limitações. Pediu para participar de reuniões técnicas (proibidas para mulheres), questionou regras injustas e provou sua genialidade com trabalho excepcional.

Em 1961, calculou a trajetória do primeiro americano no espaço, Alan Shepard. Em 1962, quando a NASA começou a usar computadores eletrônicos, o astronauta John Glenn pediu: "Chame a garota para verificar os números." Katherine conferiu os cálculos da máquina à mão. Só então ele decolou.

Para a Apollo 11, Katherine calculou as trajetórias que levaram Neil Armstrong à Lua em 1969. Seus cálculos precisavam estar perfeitos - um erro mínimo significaria astronautas perdidos no espaço.

Katherine trabalhou na NASA até 1986. Em 2015, aos 97 anos, recebeu a Medalha Presidencial da Liberdade. O filme "Estrelas Além do Tempo" (2016) conta sua história inspiradora.`,
    area: "Tecnologia"
  },

  // ENGENHARIA
  {
    id: 7,
    name: "Emily Warren Roebling",
    field: "Engenharia Civil",
    achievement: "Supervisionou a construção da Ponte do Brooklyn",
    year: "1843-1903",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop&crop=face",
    description: "Engenheira-chefe não-oficial que completou uma das pontes mais icônicas do mundo.",
    facts: [
      "Estudou engenharia por conta própria",
      "Foi a primeira a cruzar a Ponte do Brooklyn",
      "Enfrentou preconceito por ser mulher na construção"
    ],
    fullStory: `Emily Warren nasceu em 1843 em Nova York. Era curiosa e inteligente, mas na época, mulheres não podiam estudar engenharia formalmente.

Casou-se com Washington Roebling, cujo pai havia projetado a Ponte do Brooklyn. Quando o sogro morreu e Washington ficou gravemente doente (descompressão por trabalhar em câmaras de alta pressão), Emily assumiu o projeto.

Estudou engenharia sozinha: matemática, resistência de materiais, cálculos de cabos, análise de estresse. Tornou-se a ligação entre Washington (preso em casa, observando com binóculos) e os trabalhadores.

Por 11 anos, Emily supervisionou a construção, negociou com políticos, resolveu problemas técnicos e enfrentou homens que duvidavam de sua capacidade. "Ela é mais engenheira que todos vocês juntos", disse um trabalhador.

Em 1883, quando a ponte foi inaugurada, Emily foi a primeira a cruzá-la de carruagem, carregando um galo (símbolo de vitória). A placa da ponte homenageia "Emily Warren Roebling" por sua contribuição essencial.

A Ponte do Brooklyn foi uma das maiores obras de engenharia do século XIX, e Emily provou que mulheres eram totalmente capazes de liderar projetos complexos de engenharia.`,
    area: "Engenharia"
  },
  {
    id: 8,
    name: "Hedy Lamarr",
    field: "Engenharia de Comunicações",
    achievement: "Inventou tecnologia base do Wi-Fi e Bluetooth",
    year: "1914-2000",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
    description: "Atriz de Hollywood que revolucionou as comunicações sem fio.",
    facts: [
      "Estrela de cinema famosa em Hollywood",
      "Inventou o 'salto de frequência' durante a Segunda Guerra",
      "Sua tecnologia é usada em celulares até hoje"
    ],
    fullStory: `Hedy Lamarr (nascida Hedwig Eva Maria Kiesler) tinha duas vidas extraordinárias. Nascida em Viena em 1914, tornou-se uma das atrizes mais famosas de Hollywood nos anos 1930-40.

Mas Hedy tinha uma mente científica brilhante. Durante a Segunda Guerra Mundial, ficou revoltada ao saber que torpedos guiados por rádio podiam ser facilmente interceptados pelos inimigos.

Junto com o compositor George Antheil, inventou o "salto de frequência" - uma forma de mudar rapidamente as frequências de rádio para que mensagens não pudessem ser interceptadas. Patentearam a ideia em 1942.

A Marinha dos EUA ignorou a invenção na época (afinal, vinha de uma "atriz"!). A patente expirou sem que Hedy ganhasse um centavo.

Décadas depois, quando a tecnologia digital evoluiu, cientistas perceberam que a ideia de Hedy era genial. O "salto de frequência" se tornou a base do Wi-Fi, Bluetooth e comunicações por celular!

Aos 83 anos, Hedy finalmente recebeu reconhecimento, ganhando um prêmio de inovação. "Já era hora", disse ela. Morreu em 2000.

Hoje, Hedy Lamarr é lembrada não apenas por sua beleza na tela, mas como uma inventora que mudou o mundo. "Qualquer garota pode ser glamorosa", disse Hedy. "Basta ficar parada e parecer estúpida. Mas eu queria ser conhecida por algo mais."`,
    area: "Engenharia"
  },
  {
    id: 9,
    name: "Mae C. Jemison",
    field: "Engenharia e Medicina Aeroespacial",
    achievement: "Primeira mulher negra a ir ao espaço",
    year: "1956-presente",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=300&fit=crop&crop=face",
    description: "Astronauta, médica e engenheira que quebrou barreiras.",
    facts: [
      "Fala russo, japonês, suaíli e inglês",
      "Apareceu em Star Trek após sua missão espacial",
      "Formada em engenharia química e medicina"
    ],
    fullStory: `Mae Carol Jemison nasceu em 1956 no Alabama, mas cresceu em Chicago. Desde pequena, sabia que queria ir ao espaço. Quando assistia Star Trek, imaginava-se lá.

Era uma estudante excepcional, entrando na Universidade Stanford aos 16 anos! Formou-se em engenharia química e depois em medicina.

Como médica, trabalhou no Corpo da Paz na África Ocidental, cuidando de pessoas em áreas pobres. Mas o sonho espacial persistia.

Em 1987, após ser rejeitada uma vez, Mae foi aceita no programa de astronautas da NASA - a primeira mulher negra a conseguir isso. "Eu pertencia ao espaço tanto quanto qualquer outra pessoa", disse ela.

Em 12 de setembro de 1992, Mae voou no ônibus espacial Endeavour, tornando-se a primeira mulher negra no espaço. Durante a missão de 8 dias, conduziu experimentos sobre enjoo espacial e fertilização de ovos de sapo em gravidade zero.

Mae levou consigo uma foto de Bessie Coleman (primeira aviadora negra) e uma bandeira africana, honrando sua herança.

Após deixar a NASA, Mae fundou empresas de tecnologia e educação. Lidera o projeto "100 Year Starship" para desenvolver viagem interestelar. Seu lema: "Nunca se limite por conta da imaginação limitada dos outros."`,
    area: "Engenharia"
  },

  // MATEMÁTICA
  {
    id: 10,
    name: "Maryam Mirzakhani",
    field: "Matemática",
    achievement: "Primeira mulher a ganhar a Medalha Fields",
    year: "1977-2017",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
    description: "Matemática iraniana que revolucionou a geometria.",
    facts: [
      "A Medalha Fields é o 'Nobel da Matemática'",
      "Estudava superfícies de Riemann e geometria hiperbólica",
      "Inspirou milhões de meninas a seguir matemática"
    ],
    fullStory: `Maryam Mirzakhani nasceu em Teerã, Irã, em 1977. Curiosamente, na escola, não gostava de matemática no início - preferia ler romances e sonhava ser escritora!

Tudo mudou quando seu irmão mais velho contou sobre um problema matemático fascinante. Maryam ficou viciada em resolver problemas!

Em 1994 e 1995, Maryam competiu nas Olimpíadas Internacionais de Matemática, ganhando medalhas de ouro e, no segundo ano, obteve pontuação perfeita. Era uma das primeiras mulheres iranianas a conseguir isso.

Estudou em Harvard e depois tornou-se professora em Stanford. Seu trabalho envolvia superfícies complexas chamadas "superfícies de Riemann" - formas geométricas que parecem saídas de sonhos.

Maryam trabalhava de forma única: desenhava em enormes folhas de papel no chão, enquanto sua filha brincava ao lado. "Minha filha pensa que eu pinto", ria Maryam.

Em 2014, ganhou a Medalha Fields, o prêmio mais prestigioso da matemática, equivalente ao Nobel. Era a primeira mulher (e primeira iraniana) a receber essa honra em quase 80 anos de história do prêmio!

Tragicamente, Maryam morreu de câncer de mama em 2017, aos 40 anos. O Irã declarou seu aniversário como "Dia Nacional da Matemática". Seu legado inspira meninas no mundo todo: "A beleza da matemática só se revela para seguidores mais pacientes."`,
    area: "Matemática"
  },
  {
    id: 11,
    name: "Emmy Noether",
    field: "Matemática e Física",
    achievement: "Revolucionou a álgebra abstrata",
    year: "1882-1935",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop&crop=face",
    description: "Considerada uma das matemáticas mais importantes da história.",
    facts: [
      "Einstein a chamou de 'gênio matemático mais significativo'",
      "Trabalhou sem salário por anos por ser mulher",
      "O 'Teorema de Noether' é fundamental na física moderna"
    ],
    fullStory: `Amalie Emmy Noether nasceu na Alemanha em 1882. Seu pai era professor de matemática, mas na época, mulheres não podiam se matricular oficialmente na universidade.

Emmy assistiu às aulas como "ouvinte" e, quando as regras mudaram, finalmente obteve seu doutorado em 1907. Mesmo assim, não podia dar aulas porque era mulher!

Trabalhou sem salário por anos, dando aulas sob o nome de colegas homens. Finalmente, em 1919, conseguiu uma posição oficial - ainda assim, mal paga.

Em 1918, Emmy provou o "Teorema de Noether", que conecta simetrias na natureza com leis de conservação da física. Parece complicado, mas é profundamente importante: explica por que energia e momento são conservados!

Albert Einstein ficou impressionado: "Noether era o gênio matemático criativo mais significativo desde que as mulheres começaram a ter educação superior."

Emmy também revolucionou a álgebra abstrata, criando estruturas matemáticas que são usadas até hoje em computação e criptografia.

Quando os nazistas subiram ao poder em 1933, Emmy (que era judia) fugiu para os Estados Unidos, onde ensinou em Princeton. Morreu em 1935, após uma cirurgia.

O impacto de Emmy continua enorme. O Teorema de Noether é essencial para a física de partículas e a compreensão do universo.`,
    area: "Matemática"
  },
  {
    id: 12,
    name: "Sophie Germain",
    field: "Matemática e Física",
    achievement: "Pioneira na teoria dos números e elasticidade",
    year: "1776-1831",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
    description: "Autodidata que fez contribuições importantes mesmo sendo excluída da academia.",
    facts: [
      "Estudou matemática escondida dos pais",
      "Usou pseudônimo masculino para ser levada a sério",
      "Trabalhou na teoria da elasticidade e no último teorema de Fermat"
    ],
    fullStory: `Sophie Germain nasceu em Paris em 1776, durante uma época turbulenta - a Revolução Francesa explodiria quando ela tinha 13 anos.

Confinada em casa durante a violência, Sophie descobriu a matemática na biblioteca do pai. Leu sobre Arquimedes, que foi morto por um soldado romano porque estava tão concentrado em um problema de geometria que se recusou a sair. Sophie pensou: "Se a matemática é tão fascinante, preciso aprender!"

Seus pais achavam que estudar matemática era perigoso para a saúde de uma menina. Confiscaram suas velas e roupas para impedi-la de estudar à noite. Sophie estudava escondida, embrulhada em cobertores, usando velas contrabandeadas!

Aos 18 anos, Sophie queria estudar na École Polytechnique, mas mulheres eram proibidas. Ela obteve notas de aula e, usando o nome "Monsieur LeBlanc", começou a enviar trabalhos a professores famosos.

O matemático Joseph-Louis Lagrange ficou impressionado com "Monsieur LeBlanc" e pediu para conhecê-lo. Quando descobriu que era uma mulher, ficou ainda mais impressionado e tornou-se seu mentor.

Sophie correspondeu-se com Carl Friedrich Gauss sobre teoria dos números, ainda como "LeBlanc". Quando a verdade foi revelada, Gauss escreveu: "Uma mulher que supera todos os obstáculos para estudar ciências merece a maior admiração."

Sophie fez contribuições importantes para a teoria da elasticidade e o último teorema de Fermat. Morreu de câncer de mama em 1831, mas seu nome vive nos "números primos de Sophie Germain".`,
    area: "Matemática"
  }
];

export const getScientistsByArea = (area: string): Scientist[] => {
  return scientists.filter(s => s.area === area);
};

export const getRandomScientistOfWeek = (area: string): Scientist => {
  const areaScientists = getScientistsByArea(area);
  if (areaScientists.length === 0) {
    return scientists[0];
  }
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return areaScientists[weekNumber % areaScientists.length];
};

export const getAreaLabel = (area: string): { singular: string; plural: string } => {
  switch (area) {
    case "Ciência":
      return { singular: "Cientista", plural: "Cientistas" };
    case "Tecnologia":
      return { singular: "Tecnóloga", plural: "Tecnólogas" };
    case "Engenharia":
      return { singular: "Engenheira", plural: "Engenheiras" };
    case "Matemática":
      return { singular: "Matemática", plural: "Matemáticas" };
    default:
      return { singular: "Cientista", plural: "Cientistas" };
  }
};
