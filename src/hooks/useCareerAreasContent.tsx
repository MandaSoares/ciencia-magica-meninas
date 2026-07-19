import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WomanProfile {
  name: string;
  achievement: string;
  story: string;
  image: string;
}

export interface Career {
  id: string;
  dbId: string; // UUID from database
  name: string;
  description: string;
  salaryRange?: string;
  icon?: string;
  women: WomanProfile[];
}

// Map area keys to database stem_area values
const areaToStemArea: Record<string, string> = {
  science: "Ciência",
  technology: "Tecnologia",
  engineering: "Engenharia",
  math: "Matemática",
};

export const getAreaLabel = (areaId: string): string => {
  const labels: Record<string, string> = {
    science: "Cientistas",
    technology: "Tecnólogas",
    engineering: "Engenheiras",
    math: "Matemáticas",
  };
  return labels[areaId] || "Profissionais";
};

// ---------------------------------------------------------------------------
// Static fallback data – used when the Supabase fetch fails or returns empty
// ---------------------------------------------------------------------------

const defaultContent: Record<string, Career[]> = {
  "Ciência": [
    {
      id: "biology",
      dbId: "fallback-biology",
      name: "Biologia",
      description:
        "A Biologia é a ciência que estuda os seres vivos e seus processos vitais, abrangendo desde moléculas e células até ecossistemas inteiros. Biólogas trabalham em áreas como genética, microbiologia, ecologia, botânica, zoologia e biotecnologia. Elas podem atuar em laboratórios de pesquisa, universidades, hospitais, indústrias farmacêuticas, órgãos ambientais e organizações de conservação. O campo oferece oportunidades para descobertas que transformam a medicina, a agricultura e a preservação ambiental.",
      icon: "Microscope",
      women: [
        {
          name: "Barbara McClintock",
          achievement: "Prêmio Nobel de Fisiologia ou Medicina em 1983 pela descoberta dos transposons (elementos genéticos móveis).",
          story:
            "Barbara McClintock dedicou décadas ao estudo da genética do milho na Universidade de Cornell e no Cold Spring Harbor Laboratory. Nos anos 1940 e 1950, ela identificou os transposons — segmentos de DNA que podem mudar de posição dentro do genoma — uma ideia tão revolucionária que a comunidade científica levou anos para reconhecê-la. Sua perseverança diante do ceticismo é um exemplo inspirador de como a curiosidade e a determinação podem levar a descobertas que redefinem a biologia.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Bertha Lutz",
          achievement: "Bióloga, zoóloga e uma das maiores líderes do movimento feminista brasileiro no século XX.",
          story:
            "Bertha Maria Júlia Lutz nasceu em São Paulo em 1894 e formou-se em Ciências Naturais na Sorbonne, em Paris. Ao retornar ao Brasil, ingressou no Museu Nacional do Rio de Janeiro, onde se tornou especialista em anfíbios — tendo várias espécies nomeadas em sua homenagem. Paralelamente à carreira científica, Bertha foi fundamental na conquista do voto feminino no Brasil em 1932, demonstrando que ciência e ativismo social podem caminhar juntos.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Graziela Maciel Barroso",
          achievement: "A maior botânica do Brasil, responsável pela classificação de mais de 25 mil espécies de plantas.",
          story:
            "Graziela Maciel Barroso nasceu em Corumbá, Mato Grosso do Sul, em 1912. Autodidata, começou a trabalhar no Jardim Botânico do Rio de Janeiro e se tornou a principal taxonomista de plantas do Brasil. Ao longo de sua carreira, classificou mais de 25 mil espécies, publicou obras de referência como 'Sistemática de Angiospermas do Brasil' e formou gerações de botânicos. Recebeu o título de doutora honoris causa por diversas universidades brasileiras e é considerada a 'primeira-dama da botânica brasileira'.",
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
        },
        {
          name: "Jane Goodall",
          achievement: "Primatóloga pioneira no estudo de chimpanzés em seu habitat natural na Tanzânia.",
          story:
            "Jane Goodall viajou para a Reserva de Gombe, na Tanzânia, em 1960, onde revolucionou a primatologia ao observar que chimpanzés fabricam e utilizam ferramentas — uma capacidade que até então se acreditava ser exclusivamente humana. Seus mais de 60 anos de pesquisa de campo são o estudo contínuo mais longo sobre animais selvagens já realizado. Hoje, através do Instituto Jane Goodall, ela inspira milhões de jovens ao redor do mundo a se engajarem na conservação ambiental e na ciência.",
          image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
        },
      ],
    },
    {
      id: "chemistry",
      dbId: "fallback-chemistry",
      name: "Química",
      description:
        "A Química é a ciência central que estuda a composição, estrutura, propriedades e transformações da matéria. Químicas atuam em pesquisa fundamental e aplicada, desenvolvendo novos materiais, medicamentos, cosméticos, alimentos e soluções para problemas ambientais. O campo inclui especialidades como química orgânica, inorgânica, analítica, físico-química e bioquímica. Profissionais da área trabalham em indústrias, universidades, laboratórios de análises e centros de pesquisa.",
      icon: "FlaskConical",
      women: [
        {
          name: "Marie Curie",
          achievement: "Primeira pessoa a receber dois Prêmios Nobel em áreas científicas diferentes: Física (1903) e Química (1911).",
          story:
            "Maria Salomea Skłodowska, conhecida como Marie Curie, nasceu na Polônia em 1867 e mudou-se para Paris para estudar na Sorbonne. Junto com seu marido Pierre, descobriu os elementos polônio e rádio, e cunhou o termo 'radioatividade'. Mesmo enfrentando preconceito por ser mulher e imigrante, tornou-se a primeira professora da Sorbonne e a primeira mulher a receber um Prêmio Nobel. Seu trabalho pioneiro lançou as bases da física nuclear e da radioterapia no tratamento do câncer.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Dorothy Hodgkin",
          achievement: "Prêmio Nobel de Química em 1964 pela determinação da estrutura de biomoléculas essenciais por cristalografia de raios X.",
          story:
            "Dorothy Crowfoot Hodgkin foi uma química britânica que aperfeiçoou a técnica de cristalografia de raios X para determinar a estrutura tridimensional de moléculas biológicas complexas. Ela elucidou as estruturas da penicilina, da vitamina B12 e da insulina — contribuições fundamentais para a medicina e a bioquímica. Apesar de sofrer de artrite reumatoide severa durante grande parte de sua carreira, manteve-se ativa na pesquisa e na defesa da paz mundial.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Joana D'Arc Félix de Souza",
          achievement: "Química brasileira que desenvolveu um método inovador para produzir carvão ativado a partir de bagaço de cana.",
          story:
            "Joana D'Arc Félix de Souza nasceu em Minas Gerais e é uma das cientistas negras mais destacadas do Brasil. Formada em Química pela Universidade de São Paulo (USP), desenvolveu pesquisas sobre carvão ativado produzido a partir de resíduos agroindustriais, contribuindo tanto para o aproveitamento de subprodutos da indústria canavieira quanto para soluções de purificação de água e tratamento de efluentes. Sua trajetória é um exemplo de como a ciência brasileira pode unir inovação tecnológica e sustentabilidade.",
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
        },
      ],
    },
    {
      id: "physics",
      dbId: "fallback-physics",
      name: "Física",
      description:
        "A Física é a ciência que investiga as leis fundamentais que governam o universo, desde partículas subatômicas até galáxias distantes. Físicas trabalham com mecânica, termodinâmica, eletromagnetismo, óptica, física quântica, astrofísica e física de partículas. Atuam em universidades, centros de pesquisa como o CERN e o LNLS (Laboratório Nacional de Luz Síncrotron), indústrias de alta tecnologia, hospitais (física médica) e agências espaciais.",
      icon: "Atom",
      women: [
        {
          name: "Chien-Shiung Wu",
          achievement: "Refutou experimentalmente a lei da conservação da paridade, um dos experimentos mais importantes da física do século XX.",
          story:
            "Chien-Shiung Wu nasceu na China em 1912 e emigrou para os Estados Unidos, onde se tornou professora na Universidade de Columbia. Em 1956, ela projetou e conduziu o famoso 'Experimento de Wu', que demonstrou que a paridade não é conservada em interações fracas — confirmando a teoria proposta por Tsung-Dao Lee e Chen-Ning Yang, que receberam o Prêmio Nobel por esse trabalho. Embora Wu não tenha sido incluída no prêmio, ela é amplamente reconhecida como uma das maiores físicas experimentais da história, apelidada de 'a Primeira Dama da Física'.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Elisa Frota-Pessôa",
          achievement: "Pioneira da física nuclear experimental no Brasil e pesquisadora do Centro Brasileiro de Pesquisas Físicas (CBPF).",
          story:
            "Elisa Frota-Pessôa foi uma das primeiras mulheres a se destacar na física brasileira. Formada pela Universidade do Brasil (atual UFRJ), ela se especializou em física nuclear e trabalhou no CBPF desde sua fundação em 1949. Realizou pesquisas sobre raios cósmicos e espectroscopia nuclear, contribuindo para o estabelecimento da tradição de pesquisa em física no Brasil. Sua dedicação à ciência em um período em que pouquíssimas mulheres brasileiras atuavam na área abriu caminho para as gerações seguintes.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Lise Meitner",
          achievement: "Forneceu a primeira explicação teórica da fissão nuclear, uma das descobertas mais transformadoras da física moderna.",
          story:
            "Lise Meitner, nascida em Viena em 1878, foi uma física austríaca de origem judaica que trabalhou por décadas em Berlim com o químico Otto Hahn. Em 1938, exilada na Suécia após a ascensão do nazismo, ela e seu sobrinho Otto Frisch explicaram teoricamente os resultados experimentais de Hahn — o processo que chamaram de 'fissão nuclear'. Apesar de sua contribuição fundamental, o Prêmio Nobel de Química de 1944 foi concedido apenas a Hahn. Meitner é hoje reconhecida como uma das cientistas mais injustamente negligiadas pela história, e o elemento 109 da tabela periódica, o meitnério, foi nomeado em sua homenagem.",
          image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
        },
        {
          name: "Márcia Barbosa",
          achievement: "Física brasileira reconhecida internacionalmente por suas pesquisas sobre as propriedades anômalas da água.",
          story:
            "Márcia Cristina Bernardes Barbosa é professora da Universidade Federal do Rio Grande do Sul (UFRGS) e uma das físicas mais premiadas do Brasil. Suas pesquisas sobre as anomalias termodinâmicas e dinâmicas da água — como o fato de o gelo flutuar e da água ter densidade máxima a 4°C — têm aplicações em áreas que vão da nanotecnologia à biologia. Em 2013, ela recebeu o Prêmio L'Oréal-UNESCO Para Mulheres na Ciência e foi eleita membra da Academia Brasileira de Ciências e da Academia Mundial de Ciências (TWAS).",
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
        },
      ],
    },
    {
      id: "environmental-science",
      dbId: "fallback-environmental-science",
      name: "Ciência Ambiental",
      description:
        "A Ciência Ambiental é um campo interdisciplinar que integra conhecimentos de biologia, química, geologia, física e ciências sociais para compreender e resolver problemas ambientais. Profissionais da área estudam mudanças climáticas, poluição, perda de biodiversidade, gestão de recursos hídricos e desenvolvimento sustentável. Atuam em órgãos governamentais como o IBAMA, ONGs ambientais, empresas de consultoria, universidades e organizações internacionais.",
      icon: "TreePine",
      women: [
        {
          name: "Rachel Carson",
          achievement: "Bióloga marinha cujo livro 'Primavera Silenciosa' (1962) deu início ao movimento ambientalista moderno.",
          story:
            "Rachel Louise Carson foi uma bióloga marinha e escritora norte-americana que transformou a consciência ambiental global. Seu livro 'Silent Spring' (Primavera Silenciosa) documentou os efeitos devastadores do uso indiscriminado de pesticidas, especialmente o DDT, sobre os ecossistemas e a saúde humana. Apesar de enfrentar campanhas de difamação financiadas pela indústria química, seu trabalho levou à proibição do DDT nos Estados Unidos e à criação da Agência de Proteção Ambiental (EPA). Carson é considerada a mãe do ambientalismo moderno.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Wangari Maathai",
          achievement: "Prêmio Nobel da Paz em 2004 por sua contribuição ao desenvolvimento sustentável, democracia e paz através do Movimento Cinturão Verde.",
          story:
            "Wangari Muta Maathai, nascida no Quênia em 1940, foi a primeira mulher da África Oriental a obter um doutorado. Em 1977, fundou o Movimento Cinturão Verde (Green Belt Movement), que mobilizou mulheres rurais para plantar mais de 51 milhões de árvores, combatendo o desmatamento, a erosão do solo e a pobreza. Seu trabalho demonstrou que a proteção ambiental, o empoderamento feminino e o desenvolvimento econômico estão profundamente interligados. Em 2004, tornou-se a primeira mulher africana a receber o Prêmio Nobel da Paz.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Mercedes Bustamante",
          achievement: "Ecóloga brasileira especialista em biogeoquímica do Cerrado e autora principal do IPCC.",
          story:
            "Mercedes Maria da Cunha Bustamante é professora da Universidade de Brasília (UnB) e uma das maiores autoridades mundiais em ecologia do Cerrado. Sua pesquisa se concentra nos ciclos de carbono e nitrogênio nos ecossistemas tropicais, e ela tem sido fundamental na compreensão de como as mudanças no uso da terra afetam as emissões de gases de efeito estufa no Brasil. Foi autora principal do Quinto Relatório de Avaliação do IPCC (Painel Intergovernamental sobre Mudanças Climáticas) e membra da Academia Brasileira de Ciências.",
          image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
        },
      ],
    },
    {
      id: "neuroscience",
      dbId: "fallback-neuroscience",
      name: "Neurociência",
      description:
        "A Neurociência é o estudo do sistema nervoso, incluindo o cérebro, a medula espinhal e os nervos periféricos. Neurocientistas investigam como o cérebro processa informações, forma memórias, gera emoções e controla o comportamento. O campo abrange neurociência molecular, celular, cognitiva, computacional e clínica. Profissionais atuam em universidades, hospitais, indústrias farmacêuticas e empresas de neurotecnologia, contribuindo para o tratamento de doenças como Alzheimer, Parkinson e depressão.",
      icon: "Brain",
      women: [
        {
          name: "Rita Levi-Montalcini",
          achievement: "Prêmio Nobel de Fisiologia ou Medicina em 1986 pela descoberta do Fator de Crescimento Nervoso (NGF).",
          story:
            "Rita Levi-Montalcini nasceu em Turim, Itália, em 1909. Durante a Segunda Guerra Mundial, como judia sob o regime fascista, montou um laboratório clandestino em seu quarto para continuar suas pesquisas. Após a guerra, emigrou para os Estados Unidos, onde, na Universidade Washington em St. Louis, descobriu o Fator de Crescimento Nervoso (NGF) — uma proteína essencial para o desenvolvimento e a sobrevivência dos neurônios. Essa descoberta abriu novos caminhos para a compreensão de doenças neurodegenerativas. Levi-Montalcini permaneceu cientificamente ativa até os 103 anos de idade.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Suzana Herculano-Houzel",
          achievement: "Neurocientista brasileira que revolucionou a contagem de neurônios no cérebro humano, provando que temos cerca de 86 bilhões — e não 100 bilhões como se acreditava.",
          story:
            "Suzana Herculano-Houzel é uma neurocientista carioca que desenvolveu um método inovador de dissolver cérebros para contar seus neurônios com precisão — uma técnica que ela chamou de 'sopa de cérebro'. Sua pesquisa mostrou que o cérebro humano tem aproximadamente 86 bilhões de neurônios, corrigindo a estimativa de 100 bilhões que era repetida há décadas sem base empírica. Atualmente professora na Universidade Vanderbilt, nos EUA, ela também é uma grande divulgadora científica no Brasil, com livros como 'O Cérebro Nosso de Cada Dia' e uma coluna no jornal Folha de S.Paulo.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "May-Britt Moser",
          achievement: "Prêmio Nobel de Fisiologia ou Medicina em 2014 pela descoberta das células de grade no cérebro, que formam o sistema de posicionamento interno.",
          story:
            "May-Britt Moser é uma neurocientista norueguesa que, junto com seu então marido Edvard Moser, descobriu as 'células de grade' (grid cells) no córtex entorrinal — neurônios que criam um sistema de coordenadas interno, funcionando como um GPS cerebral. Essa descoberta, combinada com o trabalho anterior de John O'Keefe sobre 'células de lugar', revelou como o cérebro cria mapas do ambiente e nos permite navegar no espaço. May-Britt é cofundadora e diretora do Centro Kavli de Neurociência de Sistemas na NTNU, na Noruega.",
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
        },
      ],
    },
  ],

  "Tecnologia": [
    {
      id: "software-engineering",
      dbId: "fallback-software-engineering",
      name: "Engenharia de Software",
      description:
        "A Engenharia de Software é a disciplina que aplica princípios de engenharia ao design, desenvolvimento, teste e manutenção de sistemas de software. Engenheiras de software criam desde aplicativos móveis e websites até sistemas operacionais e infraestruturas de nuvem. O campo exige habilidades em programação, arquitetura de sistemas, metodologias ágeis, controle de versão e resolução de problemas complexos. É uma das áreas com maior demanda no mercado de trabalho atual, com oportunidades em startups, grandes empresas de tecnologia, bancos e organizações governamentais.",
      icon: "Code",
      women: [
        {
          name: "Grace Hopper",
          achievement: "Pioneira da programação de computadores, criadora do primeiro compilador e codesenvolvera da linguagem COBOL.",
          story:
            "Grace Murray Hopper (1906–1992) foi uma contra-almirante da Marinha dos Estados Unidos e uma das pioneiras da ciência da computação. Ela desenvolveu o primeiro compilador, um programa que traduz código escrito em linguagem humana para linguagem de máquina, e foi fundamental na criação da linguagem COBOL, uma das mais utilizadas na história da computação comercial. Hopper também popularizou o termo 'bug' para designar erros de programação, após encontrar uma mariposa presa em um relé do computador Mark II. Sua visão de que os computadores deveriam ser acessíveis a não-especialistas moldou a computação moderna.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Margaret Hamilton",
          achievement: "Liderou a equipe que desenvolveu o software de navegação do programa Apollo da NASA, que levou os primeiros humanos à Lua.",
          story:
            "Margaret Heafield Hamilton é uma cientista da computação e engenheira de sistemas que liderou a equipe de desenvolvimento do software de bordo das missões Apollo no MIT Instrumentation Laboratory. Seu software foi projetado com mecanismos de detecção e recuperação de erros que se mostraram essenciais durante o pouso da Apollo 11 na Lua em 1969. Hamilton cunhou o termo 'engenharia de software' para conferir à disciplina o mesmo respeito dado a outras áreas da engenharia. Em 2016, recebeu a Medalha Presidencial da Liberdade, a mais alta honraria civil dos Estados Unidos.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Cláudia Bauzer Medeiros",
          achievement: "Cientista da computação brasileira, pioneira em bancos de dados e referência internacional em ciência de dados geoespaciais.",
          story:
            "Cláudia Bauzer Medeiros é professora titular do Instituto de Computação da Universidade Estadual de Campinas (Unicamp) e uma das mais influentes cientistas da computação do Brasil. Sua pesquisa se concentra em bancos de dados, sistemas de informações geográficas e e-Science (ciência computacionalmente intensiva). Foi presidente da Sociedade Brasileira de Computação (SBC) e membra do Conselho Científico do CNPq. Ela é uma defensora ativa da participação feminina na computação e tem contribuído para políticas de inclusão na ciência e tecnologia no Brasil.",
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
        },
      ],
    },
    {
      id: "data-science",
      dbId: "fallback-data-science",
      name: "Ciência de Dados",
      description:
        "A Ciência de Dados combina estatística, matemática, programação e conhecimento de domínio para extrair insights e conhecimento a partir de grandes volumes de dados. Cientistas de dados utilizam técnicas de aprendizado de máquina, visualização de dados, mineração de dados e análise preditiva para resolver problemas complexos em saúde, finanças, marketing, logística e políticas públicas. É uma das profissões mais valorizadas do século XXI, com demanda crescente em todos os setores da economia.",
      icon: "BarChart3",
      women: [
        {
          name: "Florence Nightingale",
          achievement: "Pioneira no uso de estatística e visualização de dados para reformar a saúde pública, inventora do diagrama de área polar.",
          story:
            "Florence Nightingale (1820–1910) é conhecida como a fundadora da enfermagem moderna, mas seu impacto na ciência de dados é igualmente revolucionário. Durante a Guerra da Crimeia, ela coletou e analisou meticulosamente dados sobre mortalidade de soldados, criando gráficos inovadores — incluindo o diagrama de área polar (ou 'diagrama da rosa') — para demonstrar que a maioria das mortes era causada por condições sanitárias precárias, não por ferimentos de batalha. Suas visualizações persuadiram o governo britânico a reformar os hospitais militares, salvando incontáveis vidas e estabelecendo o uso de dados como ferramenta de mudança social.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Daphne Koller",
          achievement: "Cofundadora do Coursera, pioneira em aprendizado de máquina probabilístico e fundadora da Insitro, empresa que usa dados para descoberta de medicamentos.",
          story:
            "Daphne Koller é uma cientista da computação israelense-americana que foi professora em Stanford, onde realizou pesquisas fundamentais em modelos gráficos probabilísticos e aprendizado de máquina. Em 2012, cofundou o Coursera, uma das maiores plataformas de educação online do mundo, democratizando o acesso ao ensino superior. Em 2018, fundou a Insitro, uma empresa que aplica ciência de dados e aprendizado de máquina ao processo de descoberta e desenvolvimento de novos medicamentos. Koller foi eleita membra da Academia Nacional de Engenharia e da Academia Americana de Artes e Ciências dos EUA.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Fernanda Viégas",
          achievement: "Cientista da computação brasileira, líder do Google PAIR (People + AI Research), reconhecida mundialmente por suas visualizações de dados artísticas.",
          story:
            "Fernanda Bertini Viégas é uma cientista da computação e artista visual brasileira, nascida em Recife. Junto com Martin Wattenberg, ela lidera o grupo PAIR (People + AI Research) no Google, focado em tornar a inteligência artificial mais acessível e compreensível. Seus trabalhos de visualização de dados, como 'Wind Map' (mapa de ventos em tempo real dos EUA) e 'Web Seer', são expostos em museus como o MoMA de Nova York e o Museu de Ciência de Londres. Viégas demonstra como a ciência de dados pode se tornar uma forma de arte que engaja e informa o público.",
          image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
        },
      ],
    },
    {
      id: "cybersecurity",
      dbId: "fallback-cybersecurity",
      name: "Segurança Cibernética",
      description:
        "A Segurança Cibernética é o campo dedicado à proteção de sistemas, redes e dados contra ataques digitais, acessos não autorizados e outras ameaças. Profissionais da área trabalham com criptografia, análise de vulnerabilidades, resposta a incidentes, segurança de redes, testes de penetração e forense digital. Com o aumento constante de ataques cibernéticos, a demanda por especialistas em segurança é altíssima em bancos, empresas de tecnologia, governos e organizações de saúde.",
      icon: "Shield",
      women: [
        {
          name: "Radia Perlman",
          achievement: "Inventora do protocolo Spanning Tree (STP), fundamental para o funcionamento das redes de computadores modernas.",
          story:
            "Radia Joy Perlman é uma engenheira de redes e cientista da computação americana frequentemente chamada de 'Mãe da Internet'. Nos anos 1980, enquanto trabalhava na Digital Equipment Corporation, ela inventou o protocolo Spanning Tree (STP), que resolve o problema de loops em redes Ethernet e é essencial para a operação confiável de redes locais até hoje. Perlman também fez contribuições significativas em segurança de redes, autenticação e criptografia. Ela detém mais de 100 patentes e é autora de livros de referência em redes de computadores.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Parisa Tabriz",
          achievement: "Vice-presidente de engenharia do Google Chrome, conhecida como a 'Princesa da Segurança' do Google.",
          story:
            "Parisa Tabriz é uma engenheira de segurança irano-americana que lidera a equipe de engenharia do Google Chrome, o navegador mais utilizado do mundo. Começou no Google em 2007 como 'hacker de segurança', encontrando e corrigindo vulnerabilidades no navegador e nos serviços da empresa. Ela é responsável pela segurança de mais de 3 bilhões de usuários e liderou iniciativas como a marcação de sites HTTP como 'não seguros', o que acelerou a adoção do HTTPS em toda a web. Tabriz é uma defensora ativa da diversidade na tecnologia e mentora de jovens mulheres em segurança cibernética.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Cristine Hoepers",
          achievement: "Gerente geral do CERT.br (Centro de Estudos, Resposta e Tratamento de Incidentes de Segurança no Brasil).",
          story:
            "Cristine Hoepers é uma cientista da computação brasileira que lidera o CERT.br, o centro de referência nacional para tratamento de incidentes de segurança cibernética, vinculado ao NIC.br e ao Comitê Gestor da Internet no Brasil (CGI.br). Sob sua gestão, o CERT.br monitora ameaças, coordena respostas a incidentes em todo o país, e desenvolve materiais educativos sobre segurança na internet. Hoepers representa o Brasil em fóruns internacionais de segurança cibernética e é uma das vozes mais respeitadas na área de segurança digital na América Latina.",
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
        },
      ],
    },
    {
      id: "ai-ml",
      dbId: "fallback-ai-ml",
      name: "Inteligência Artificial e Aprendizado de Máquina",
      description:
        "A Inteligência Artificial (IA) e o Aprendizado de Máquina (Machine Learning) envolvem o desenvolvimento de sistemas computacionais capazes de realizar tarefas que normalmente requerem inteligência humana, como reconhecimento de imagens, processamento de linguagem natural, tomada de decisões e condução autônoma. Profissionais da área trabalham com redes neurais, aprendizado profundo (deep learning), processamento de linguagem natural, visão computacional e sistemas de recomendação. É um dos campos mais dinâmicos e transformadores da tecnologia atual.",
      icon: "Cpu",
      women: [
        {
          name: "Fei-Fei Li",
          achievement: "Criadora do ImageNet, o maior banco de dados de imagens rotuladas do mundo, que revolucionou a visão computacional e a IA moderna.",
          story:
            "Fei-Fei Li é uma cientista da computação chinesa-americana e professora em Stanford, onde dirige o Stanford Human-Centered AI Institute (HAI). Em 2009, lançou o ImageNet — um banco de dados com mais de 14 milhões de imagens classificadas em 20 mil categorias — e o desafio ImageNet Large Scale Visual Recognition Challenge (ILSVRC), que catalisou a revolução do deep learning em visão computacional. Sua competição é considerada um dos marcos mais importantes da história recente da IA. Li também foi vice-presidente e cientista-chefe de IA no Google Cloud e é uma defensora de IA centrada no ser humano, ética e inclusiva.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Timnit Gebru",
          achievement: "Pesquisadora de ética em IA, cofundadora do Black in AI e autora de estudos influentes sobre vieses em sistemas de reconhecimento facial.",
          story:
            "Timnit Gebru é uma cientista da computação eritreia-americana reconhecida por seu trabalho fundamental em ética e equidade em inteligência artificial. Ela coautorou o estudo 'Gender Shades', que revelou que sistemas comerciais de reconhecimento facial tinham taxas de erro muito maiores para mulheres de pele escura do que para homens de pele clara. Cofundou a comunidade Black in AI para aumentar a representação de pessoas negras no campo. Atualmente dirige o Distributed AI Research Institute (DAIR), focado em pesquisa de IA que beneficie comunidades marginalizadas. Seu trabalho tem influenciado políticas públicas e regulamentações sobre IA em todo o mundo.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Virgínia Fernandes Mota",
          achievement: "Pesquisadora brasileira em visão computacional e aprendizado de máquina, com contribuições em reconhecimento de ações humanas.",
          story:
            "Virgínia Fernandes Mota é professora e pesquisadora brasileira que trabalha na interseção entre visão computacional e aprendizado de máquina. Sua pesquisa se concentra em reconhecimento de ações e atividades humanas em vídeos, utilizando técnicas de deep learning para permitir que sistemas computacionais compreendam o que pessoas estão fazendo em sequências de imagens. Esse trabalho tem aplicações em vigilância inteligente, assistência a idosos, interfaces humano-computador e veículos autônomos. Ela é uma das vozes ativas na promoção da participação de mulheres brasileiras em IA e ciência da computação.",
          image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
        },
      ],
    },
    {
      id: "game-development",
      dbId: "fallback-game-development",
      name: "Desenvolvimento de Jogos",
      description:
        "O Desenvolvimento de Jogos é uma área criativa e técnica que envolve programação, design, arte, áudio e narrativa para criar experiências interativas. Desenvolvedoras de jogos trabalham com engines como Unity e Unreal, linguagens como C++ e C#, e técnicas de computação gráfica, física simulada e inteligência artificial para jogos. A indústria de games movimenta mais de 180 bilhões de dólares por ano e oferece oportunidades em estúdios de jogos, empresas de realidade virtual/aumentada e no crescente mercado de jogos educativos e serious games.",
      icon: "Gamepad2",
      women: [
        {
          name: "Carol Shaw",
          achievement: "Considerada a primeira desenvolvedora profissional de jogos eletrônicos, criadora de 'River Raid' para o Atari 2600.",
          story:
            "Carol Shaw é uma engenheira e programadora americana reconhecida como a primeira mulher a trabalhar profissionalmente como desenvolvedora de jogos eletrônicos. Começou sua carreira na Atari em 1978 e depois trabalhou na Activision, onde criou 'River Raid' (1982), um dos jogos mais aclamados e vendidos do Atari 2600. River Raid é considerado inovador por seu sistema de geração procedural de conteúdo, que criava um cenário praticamente infinito. Shaw abriu caminho para gerações de mulheres na indústria de jogos, demonstrando excelência técnica e criativa em uma época em que a participação feminina no setor era praticamente inexistente.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Roberta Williams",
          achievement: "Cofundadora da Sierra On-Line e criadora da série King's Quest, pioneira dos jogos de aventura gráfica.",
          story:
            "Roberta Williams é uma designer de jogos americana que, junto com seu marido Ken Williams, cofundou a Sierra On-Line, uma das mais influentes empresas de jogos da história. Em 1980, criou 'Mystery House', o primeiro jogo de aventura com gráficos, e depois desenvolveu a série 'King's Quest' (1984–1998), que definiu o gênero de aventura gráfica e vendeu milhões de cópias. Williams também criou 'Phantasmagoria' (1995), um dos primeiros jogos a usar atores reais filmados. Ela demonstrou que narrativa e storytelling são elementos tão importantes quanto a tecnologia no design de jogos.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Aura Munoz",
          achievement: "Game designer brasileira e cofundadora da Aquiris (agora Wildlife Studios), um dos maiores estúdios de jogos da América Latina.",
          story:
            "A indústria brasileira de jogos tem crescido significativamente, e mulheres desenvolvedoras estão na linha de frente dessa expansão. Profissionais como as cofundadoras de estúdios independentes brasileiros têm criado jogos que alcançam audiências globais, demonstrando a criatividade e a competência técnica das desenvolvedoras brasileiras. O Brasil possui uma comunidade vibrante de mulheres em games, com eventos como o Women in Games Brazil (WIG Brazil) promovendo a inclusão e o networking. Estúdios brasileiros como Aquiris, Behold Studios e JoyMasher contam com mulheres em posições de liderança criativa e técnica.",
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
        },
      ],
    },
  ],

  "Engenharia": [
    {
      id: "civil-engineering",
      dbId: "fallback-civil-engineering",
      name: "Engenharia Civil",
      description:
        "A Engenharia Civil é uma das mais antigas e abrangentes áreas da engenharia, responsável pelo projeto, construção e manutenção de infraestruturas essenciais: pontes, edifícios, estradas, barragens, sistemas de água e esgoto, portos e aeroportos. Engenheiras civis trabalham com cálculo estrutural, geotecnia, hidráulica, transportes e gestão de obras. No Brasil, a área é regulamentada pelo CREA e oferece oportunidades em construtoras, escritórios de engenharia, órgãos públicos e empresas de consultoria.",
      icon: "Building2",
      women: [
        {
          name: "Emily Warren Roebling",
          achievement: "Supervisionou a construção da Ponte do Brooklyn em Nova York, uma das obras de engenharia mais icônicas do século XIX.",
          story:
            "Emily Warren Roebling (1843–1903) assumiu a supervisão da construção da Ponte do Brooklyn depois que seu marido, Washington Roebling, engenheiro-chefe do projeto, ficou gravemente doente devido à doença descompressiva adquirida nos caixões pneumáticos subaquáticos. Emily estudou engenharia, matemática, cálculo de catenárias e resistência dos materiais para comunicar instruções técnicas entre seu marido e os engenheiros da obra. Durante 14 anos, ela foi a presença diária no canteiro de obras, efetivamente gerenciando um dos maiores projetos de engenharia da história. Foi a primeira pessoa a cruzar a ponte em sua inauguração em 1883.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Enedina Alves Marques",
          achievement: "Primeira mulher negra a se formar em engenharia no Brasil, em 1945, pela Universidade Federal do Paraná.",
          story:
            "Enedina Alves Marques (1913–1981) nasceu em Curitiba, Paraná, em uma família de origem humilde. Trabalhou como empregada doméstica para financiar seus estudos e, em 1945, formou-se em engenharia civil pela Universidade Federal do Paraná (UFPR), tornando-se a primeira mulher negra engenheira do Brasil. Atuou no Departamento de Águas e Energia Elétrica do Paraná, onde trabalhou em projetos de usinas hidrelétricas, incluindo a Usina Capivari-Cachoeira. Sua trajetória de superação diante do racismo e do machismo é um símbolo de resistência e inspiração para mulheres negras brasileiras em STEM.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Nora Stanton Blatch Barney",
          achievement: "Primeira mulher a obter um diploma de engenharia civil nos Estados Unidos, formada pela Cornell University em 1905.",
          story:
            "Nora Stanton Blatch Barney (1883–1971) foi a primeira mulher a receber um diploma em engenharia civil nos Estados Unidos, pela Cornell University em 1905, e a primeira mulher aceita na Sociedade Americana de Engenheiros Civis (ASCE) como membra júnior. Trabalhou com engenharia hidráulica, projeto de pontes e inspeção de estações de tratamento de água. Além de sua carreira na engenharia, foi uma ativa sufragista, seguindo os passos de sua avó, Elizabeth Cady Stanton, líder do movimento pelo voto feminino. Barney demonstrou que mulheres podiam se destacar tanto na engenharia quanto na luta por direitos civis.",
          image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
        },
      ],
    },
    {
      id: "aerospace-engineering",
      dbId: "fallback-aerospace-engineering",
      name: "Engenharia Aeroespacial",
      description:
        "A Engenharia Aeroespacial envolve o projeto, desenvolvimento e teste de aeronaves, espaçonaves, satélites, foguetes e sistemas de propulsão. Engenheiras aeroespaciais trabalham com aerodinâmica, estruturas, propulsão, controle de voo e sistemas de navegação. No Brasil, o setor é forte graças a empresas como a Embraer (terceira maior fabricante de aviões comerciais do mundo), o INPE (Instituto Nacional de Pesquisas Espaciais) e o ITA (Instituto Tecnológico de Aeronáutica). É uma área que combina alta tecnologia com a emoção de explorar os limites do céu e do espaço.",
      icon: "Plane",
      women: [
        {
          name: "Mary Jackson",
          achievement: "Primeira engenheira negra da NASA, pioneira em testes de túnel de vento e aerodinâmica supersônica.",
          story:
            "Mary Winston Jackson (1921–2005) foi uma matemática e engenheira aeroespacial americana que se tornou a primeira mulher negra engenheira da NASA. Inicialmente contratada como 'computadora' (calculista humana) no Langley Research Center, ela lutou judicialmente pelo direito de frequentar cursos de pós-graduação em uma escola segregada da Virgínia. Após obter sua qualificação, trabalhou em pesquisas de aerodinâmica, analisando dados de testes em túneis de vento que contribuíram para o programa espacial americano. Sua história, junto com a de Katherine Johnson e Dorothy Vaughan, foi contada no livro e filme 'Estrelas Além do Tempo' (Hidden Figures).",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Wanda Sigaud",
          achievement: "Primeira mulher a se formar em engenharia aeronáutica pelo ITA (Instituto Tecnológico de Aeronáutica) no Brasil.",
          story:
            "Wanda Sigaud foi uma das pioneiras da engenharia aeronáutica no Brasil. Ao se formar pelo ITA, uma das instituições de ensino mais prestigiadas do país, ela abriu caminho para a participação feminina em um campo tradicionalmente masculino. Sua formação no ITA — a mesma escola que formou os engenheiros fundadores da Embraer — a colocou na vanguarda da engenharia aeroespacial brasileira. A trajetória de Sigaud inspirou gerações de mulheres a ingressarem no ITA e na indústria aeronáutica brasileira, que hoje emprega milhares de engenheiras.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Gwynne Shotwell",
          achievement: "Presidente e COO da SpaceX, responsável pelas operações comerciais e pelo crescimento da empresa que revolucionou a indústria espacial.",
          story:
            "Gwynne Shotwell é uma engenheira mecânica e empresária americana que ocupa o cargo de presidente e diretora de operações (COO) da SpaceX desde 2008. Formada em engenharia mecânica e matemática aplicada, ela supervisiona as operações diárias da empresa, incluindo o desenvolvimento e lançamento dos foguetes Falcon 9 e Falcon Heavy, e da cápsula Dragon. Sob sua liderança, a SpaceX conquistou contratos bilionários com a NASA e o Departamento de Defesa dos EUA, e realizou o primeiro voo tripulado privado à Estação Espacial Internacional. Shotwell é frequentemente citada como uma das mulheres mais poderosas do mundo dos negócios e da tecnologia.",
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
        },
      ],
    },
    {
      id: "biomedical-engineering",
      dbId: "fallback-biomedical-engineering",
      name: "Engenharia Biomédica",
      description:
        "A Engenharia Biomédica aplica princípios de engenharia e ciências exatas à medicina e à biologia para criar soluções que melhorem a saúde humana. Engenheiras biomédicas desenvolvem equipamentos médicos (como ressonância magnética e próteses), biomateriais, órgãos artificiais, sistemas de monitoramento de pacientes e tecnologias de diagnóstico. O campo combina conhecimentos de eletrônica, mecânica, computação e biologia, e oferece oportunidades em hospitais, indústrias de dispositivos médicos, centros de pesquisa e startups de saúde digital.",
      icon: "HeartPulse",
      women: [
        {
          name: "Nina Tandon",
          achievement: "Engenheira biomédica, CEO da EpiBone, empresa que cultiva ossos personalizados a partir de células-tronco do próprio paciente.",
          story:
            "Nina Tandon é uma engenheira biomédica americana e CEO da EpiBone, uma startup que desenvolveu uma tecnologia revolucionária para cultivar substitutos ósseos personalizados a partir de células-tronco do próprio paciente. Formada em engenharia elétrica pela Cooper Union e com doutorado em engenharia biomédica pela Columbia University, ela combina conhecimento em eletrofisiologia, engenharia de tecidos e empreendedorismo. Seu trabalho tem o potencial de transformar a cirurgia ortopédica, eliminando a necessidade de enxertos ósseos de doadores e reduzindo rejeições. Tandon é também autora do livro 'Super Cells: Building with Biology'.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Zilda Arns Neumann",
          achievement: "Médica e sanitarista brasileira, fundadora da Pastoral da Criança, que reduziu dramaticamente a mortalidade infantil no Brasil.",
          story:
            "Zilda Arns Neumann (1934–2010) foi uma médica pediatra e sanitarista paranaense que fundou a Pastoral da Criança em 1983. Embora sua formação fosse em medicina, ela aplicou princípios de engenharia de sistemas à saúde pública, criando uma metodologia replicável e escalável que capacitou voluntárias comunitárias a acompanhar a saúde de gestantes e crianças em comunidades carentes. A Pastoral da Criança atendeu mais de 2 milhões de famílias por mês em todo o Brasil e em outros 20 países, contribuindo para a redução da mortalidade infantil em 50% nas comunidades assistidas. Zilda foi indicada ao Prêmio Nobel da Paz e faleceu no terremoto do Haiti em 2010.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Ann Tsukamoto",
          achievement: "Coinventora do processo de isolamento de células-tronco hematopoiéticas humanas, fundamental para a medicina regenerativa.",
          story:
            "Ann Tsukamoto é uma cientista e inventora americana que, em 1991, coinventou e patenteou o processo de isolamento de células-tronco hematopoiéticas humanas — as células precursoras de todas as células do sangue. Essa descoberta foi fundamental para o avanço da compreensão do sistema sanguíneo e abriu novos caminhos para o tratamento de leucemias, linfomas e outras doenças do sangue através de transplantes de medula óssea mais eficientes. Tsukamoto detém diversas patentes relacionadas a células-tronco e continua pesquisando aplicações em regeneração de tecidos e terapias celulares para câncer.",
          image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
        },
      ],
    },
    {
      id: "environmental-engineering",
      dbId: "fallback-environmental-engineering",
      name: "Engenharia Ambiental",
      description:
        "A Engenharia Ambiental é dedicada ao desenvolvimento de soluções tecnológicas para proteger o meio ambiente e a saúde pública. Engenheiras ambientais projetam sistemas de tratamento de água e esgoto, gestão de resíduos sólidos, controle de poluição do ar, remediação de solos contaminados e avaliação de impacto ambiental. No Brasil, a área é especialmente relevante dado os desafios de saneamento básico, desmatamento e gestão dos recursos hídricos. Profissionais atuam em empresas de saneamento, consultorias ambientais, órgãos públicos e indústrias.",
      icon: "Leaf",
      women: [
        {
          name: "Ellen Swallow Richards",
          achievement: "Pioneira da engenharia ambiental e da ciência sanitária, primeira mulher admitida no MIT (Massachusetts Institute of Technology).",
          story:
            "Ellen Henrietta Swallow Richards (1842–1911) foi a primeira mulher admitida no MIT, em 1871, onde posteriormente se tornou a primeira instrutora feminina. Ela é considerada a fundadora da engenharia sanitária (precursora da engenharia ambiental) nos Estados Unidos. Richards conduziu extensos estudos sobre a qualidade da água no estado de Massachusetts, desenvolvendo métodos de análise que levaram aos primeiros padrões de qualidade da água nos EUA. Também foi pioneira na aplicação de princípios científicos à nutrição e ao ambiente doméstico, fundando o campo que chamou de 'euthenics' (ciência da melhoria das condições de vida).",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Sueli Corrêa de Faria",
          achievement: "Engenheira ambiental brasileira, especialista em gestão de recursos hídricos e saneamento ambiental no Cerrado.",
          story:
            "No Brasil, engenheiras ambientais têm desempenhado papéis fundamentais na gestão dos recursos naturais, especialmente no Cerrado — o segundo maior bioma do país e um dos mais ameaçados. Profissionais como Sueli Corrêa de Faria trabalham na interface entre engenharia e conservação, desenvolvendo soluções para o tratamento de água, gestão de bacias hidrográficas e recuperação de áreas degradadas. O saneamento básico permanece um dos maiores desafios do Brasil, com quase 100 milhões de pessoas sem acesso a coleta de esgoto, o que torna o trabalho de engenheiras ambientais essencial para a saúde pública e a qualidade de vida.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Mária Teresa de Alvarenga Crespo",
          achievement: "Pesquisadora brasileira em microbiologia ambiental e tratamento biológico de resíduos da Embrapa.",
          story:
            "Mária Teresa de Alvarenga Crespo é uma pesquisadora da Embrapa (Empresa Brasileira de Pesquisa Agropecuária) especializada em microbiologia ambiental. Seu trabalho se concentra no tratamento biológico de resíduos agroindustriais, utilizando microorganismos para transformar poluentes em subprodutos úteis como biogás e biofertilizantes. Essa abordagem combina engenharia ambiental e biotecnologia para resolver problemas de poluição na agroindústria brasileira, que é uma das maiores do mundo. Suas pesquisas contribuem para um modelo de agricultura mais sustentável e para a economia circular no setor agropecuário.",
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
        },
      ],
    },
    {
      id: "robotics",
      dbId: "fallback-robotics",
      name: "Robótica",
      description:
        "A Robótica é um campo interdisciplinar que combina engenharia mecânica, eletrônica, ciência da computação e inteligência artificial para projetar, construir e programar robôs. Engenheiras de robótica criam máquinas que podem realizar tarefas de forma autônoma ou semiautônoma em ambientes como fábricas, hospitais, fazendas, oceanos e até outros planetas. O campo abrange robótica industrial, robótica móvel, drones, próteses robóticas, robótica social e veículos autônomos. A demanda por especialistas em robótica cresce à medida que a automação se expande para novos setores.",
      icon: "Bot",
      women: [
        {
          name: "Cynthia Breazeal",
          achievement: "Pioneira da robótica social, criadora do robô Kismet e do assistente robótico Jibo, professora do MIT Media Lab.",
          story:
            "Cynthia Lynn Breazeal é uma roboticista americana e professora do MIT Media Lab, onde dirige o grupo de Robôs Pessoais. Nos anos 1990, ela desenvolveu Kismet, um dos primeiros robôs capazes de reconhecer e simular emoções humanas, inaugurando o campo da robótica social — robôs projetados para interagir naturalmente com pessoas. Mais tarde, criou o Jibo, um dos primeiros robôs sociais comerciais para uso doméstico. Breazeal investiga como robôs podem ser companheiros eficazes em educação, saúde e assistência a idosos, e seu trabalho influencia o design de assistentes virtuais e robôs interativos em todo o mundo.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Yoky Matsuoka",
          achievement: "Cofundadora do Google X e da Nest Labs, pioneira em neurorobótica e mãos robóticas controladas pelo cérebro.",
          story:
            "Yoky Matsuoka é uma engenheira e neurocientista japonesa-americana que combinou suas paixões por tênis e tecnologia para criar o campo da neurorobótica — a interseção entre neurociência e robótica. Como professora na Universidade de Washington, desenvolveu mãos robóticas controladas por sinais cerebrais para pessoas com amputações. Ela foi cofundadora do laboratório Google X (agora X, the moonshot factory), onde liderou projetos de tecnologia transformadora, e da Nest Labs, adquirida pelo Google por 3,2 bilhões de dólares. Matsuoka recebeu uma bolsa MacArthur ('Genius Grant') por suas contribuições à ciência e à tecnologia.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Graziela Tonin",
          achievement: "Pesquisadora brasileira em robótica colaborativa e interação humano-robô na Universidade Federal do Rio Grande do Sul.",
          story:
            "No Brasil, pesquisadoras como Graziela Tonin da UFRGS trabalham no campo da robótica colaborativa — robôs que operam lado a lado com trabalhadores humanos em fábricas e hospitais. A robótica brasileira tem se destacado internacionalmente, com equipes universitárias conquistando prêmios em competições como a RoboCup e a Latin American Robotics Competition. Universidades como USP, UNICAMP, UFMG e UFRGS possuem laboratórios de robótica de ponta, e engenheiras brasileiras lideram pesquisas em áreas como drones para agricultura de precisão, robôs para cirurgia minimamente invasiva e sistemas autônomos para exploração submarina do pré-sal.",
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
        },
      ],
    },
  ],

  "Matemática": [
    {
      id: "statistics",
      dbId: "fallback-statistics",
      name: "Estatística",
      description:
        "A Estatística é a ciência da coleta, organização, análise, interpretação e apresentação de dados. Estatísticas trabalham com modelagem probabilística, testes de hipóteses, análise de regressão, planejamento de experimentos, amostragem e inferência estatística. Profissionais da área são essenciais em saúde pública (epidemiologia), pesquisas eleitorais, controle de qualidade industrial, finanças, seguros, esportes e pesquisa científica. No Brasil, o IBGE (Instituto Brasileiro de Geografia e Estatística) é um dos maiores empregadores de estatísticos do país.",
      icon: "PieChart",
      women: [
        {
          name: "Gertrude Mary Cox",
          achievement: "Fundadora do primeiro departamento de estatística experimental dos Estados Unidos e pioneira no planejamento de experimentos.",
          story:
            "Gertrude Mary Cox (1900–1978) foi uma estatística americana que revolucionou o planejamento de experimentos e a estatística aplicada. Em 1940, ela se tornou a primeira mulher chefe de departamento na North Carolina State University, onde fundou o Departamento de Estatística Experimental — o primeiro dedicado a essa área nos EUA. Seu livro 'Experimental Designs' (coautorado com William Cochran) tornou-se a referência padrão na área por décadas. Cox também fundou o Instituto de Estatística da Universidade da Carolina do Norte e foi instrumental na criação do Research Triangle Park, um dos maiores centros de pesquisa do mundo.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "C. R. Rao (colaboradora: Bhama Srinivasan)",
          achievement: "Bhama Srinivasan — matemática indiana radicada nos EUA, contribuições fundamentais em teoria de representações de grupos finitos.",
          story:
            "Bhama Srinivasan é uma matemática indo-americana que fez contribuições fundamentais para a teoria de representações de grupos finitos, uma área que conecta álgebra abstrata e estatística. Nascida em Madurai, Índia, formou-se pela Universidade de Madras e obteve seu doutorado na Universidade de Manchester. Seu trabalho sobre representações modulares de grupos finitos — estruturas algébricas com um número finito de elementos — tem aplicações em criptografia, design de experimentos e teoria da codificação. Srinivasan foi professora na Universidade de Illinois em Chicago por décadas e uma defensora ativa da participação feminina na matemática.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Elza Furtado Gomide",
          achievement: "Primeira mulher brasileira a obter um doutorado em Matemática, formada pela Universidade de São Paulo em 1950.",
          story:
            "Elza Furtado Gomide (1925–2013) foi a primeira mulher brasileira a obter um título de doutora em Matemática, pela USP, em 1950. Sua tese foi orientada por André Weil, um dos mais importantes matemáticos do século XX. Ao longo de sua carreira, dedicou-se ao ensino e à pesquisa na USP, formando gerações de matemáticos brasileiros. Gomide foi fundamental para o desenvolvimento da matemática no Brasil e para a abertura de espaços para mulheres em uma área que, na época, era quase exclusivamente masculina. Sua trajetória demonstra a importância de pioneiras que desbravam caminhos em campos dominados por homens.",
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
        },
      ],
    },
    {
      id: "applied-math",
      dbId: "fallback-applied-math",
      name: "Matemática Aplicada",
      description:
        "A Matemática Aplicada utiliza métodos matemáticos para resolver problemas práticos em ciência, engenharia, economia, medicina e tecnologia. Profissionais da área trabalham com modelagem matemática, simulação computacional, otimização, equações diferenciais, análise numérica e teoria do controle. Atuam em indústrias de petróleo e gás, empresas de tecnologia, bancos, seguradoras, centros de pesquisa e agências governamentais, desenvolvendo modelos que ajudam a prever o tempo, otimizar rotas de logística, simular reações químicas e analisar mercados financeiros.",
      icon: "Calculator",
      women: [
        {
          name: "Katherine Johnson",
          achievement: "Matemática da NASA cujos cálculos de mecânica orbital foram essenciais para os voos espaciais de John Glenn e Apollo 11.",
          story:
            "Katherine Coleman Goble Johnson (1918–2020) foi uma matemática afro-americana que trabalhou na NASA (e sua predecessora, a NACA) por mais de 30 anos. Seus cálculos de trajetórias orbitais foram fundamentais para o sucesso das primeiras missões espaciais dos Estados Unidos. O astronauta John Glenn recusou-se a voar até que Katherine verificasse pessoalmente os cálculos feitos pelo computador eletrônico para sua órbita ao redor da Terra em 1962. Ela também calculou a trajetória da missão Apollo 11 à Lua. Sua história, retratada no filme 'Estrelas Além do Tempo', inspirou milhões de meninas ao redor do mundo a seguirem carreiras em matemática e ciências.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Sofia Kovalevskaya",
          achievement: "Primeira mulher a obter um doutorado em Matemática na Europa e primeira mulher professora catedrática em uma universidade europeia.",
          story:
            "Sofia Vasilyevna Kovalevskaya (1850–1891) foi uma matemática russa que superou enormes barreiras sociais para se tornar uma das maiores matemáticas do século XIX. Como as universidades russas não admitiam mulheres, ela contraiu um casamento de conveniência para poder estudar na Alemanha, onde obteve seu doutorado na Universidade de Göttingen em 1874. Seus trabalhos sobre equações diferenciais parciais, a rotação de corpos rígidos e os anéis de Saturno são marcos da matemática aplicada. Em 1884, tornou-se professora na Universidade de Estocolmo — a primeira mulher a ocupar essa posição na Europa. Em 1888, ganhou o prestigioso Prêmio Bordin da Academia Francesa de Ciências.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Maria Gaetana Agnesi",
          achievement: "Primeira mulher a escrever um livro-texto de matemática e primeira mulher nomeada professora de matemática em uma universidade.",
          story:
            "Maria Gaetana Agnesi (1718–1799) foi uma matemática, filósofa e filantropa italiana reconhecida como uma das mulheres mais extraordinárias do século XVIII. Em 1748, publicou 'Instituzioni analitiche ad uso della gioventù italiana', um tratado de dois volumes que cobria álgebra, geometria analítica e cálculo diferencial e integral — considerado um dos melhores livros-texto de matemática de sua época. A obra foi traduzida para inglês e francês e incluía o estudo da curva que ficou conhecida como 'Curva de Agnesi'. O Papa Bento XIV a nomeou professora de matemática na Universidade de Bolonha, tornando-a a primeira mulher a receber essa honra.",
          image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
        },
      ],
    },
    {
      id: "cryptography",
      dbId: "fallback-cryptography",
      name: "Criptografia",
      description:
        "A Criptografia é a ciência de proteger informações através de técnicas matemáticas que tornam dados ilegíveis para pessoas não autorizadas. Criptógrafas desenvolvem algoritmos de encriptação, protocolos de segurança, assinaturas digitais, funções hash e sistemas de autenticação que protegem transações bancárias, comunicações privadas, votações eletrônicas e dados governamentais sigilosos. O campo requer conhecimentos profundos de teoria dos números, álgebra abstrata, probabilidade e ciência da computação. Com o avanço da computação quântica, a criptografia pós-quântica é uma das áreas de pesquisa mais urgentes da atualidade.",
      icon: "Lock",
      women: [
        {
          name: "Joan Clarke",
          achievement: "Criptoanalista britânica que trabalhou em Bletchley Park na quebra do código Enigma nazista durante a Segunda Guerra Mundial.",
          story:
            "Joan Elisabeth Lowther Clarke (1917–1996) foi uma matemática e criptoanalista britânica que trabalhou em Bletchley Park durante a Segunda Guerra Mundial, no grupo liderado por Alan Turing dedicado à decifração da máquina Enigma, usada pela Marinha alemã. Clarke foi uma das poucas mulheres a trabalhar diretamente na análise criptoanalítica (e não apenas em funções administrativas) e se tornou vice-chefe de sua seção. Seu trabalho contribuiu para a quebra das comunicações navais nazistas, o que encurtou a guerra e salvou milhões de vidas. Apesar de suas contribuições extraordinárias, o trabalho em Bletchley Park permaneceu secreto por décadas.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Elizebeth Smith Friedman",
          achievement: "Pioneira da criptoanálise americana, decodificou mensagens de contrabandistas, espiões nazistas e cartéis de narcotráfico.",
          story:
            "Elizebeth Smith Friedman (1892–1980) foi uma criptoanalista americana considerada uma das maiores decodificadoras da história. Na década de 1930, trabalhou para o Departamento do Tesouro dos EUA, onde decodificou mensagens de redes internacionais de contrabando de álcool e drogas, levando a centenas de condenações. Durante a Segunda Guerra Mundial, liderou uma equipe que quebrou os códigos de espiões nazistas operando na América do Sul, neutralizando redes de inteligência alemãs. Seu trabalho foi mantido em segredo por décadas, e o crédito por muitas de suas conquistas foi erroneamente atribuído ao FBI. Friedman demonstrou que a criptografia é tão poderosa quanto a mente que a analisa.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Sueli Irene Rodrigues Costa",
          achievement: "Matemática brasileira especializada em geometria aplicada à criptografia e códigos para comunicação digital.",
          story:
            "Sueli Irene Rodrigues Costa é professora da Universidade Estadual de Campinas (Unicamp) e uma das principais pesquisadoras brasileiras na interseção entre geometria, teoria da informação e criptografia. Sua pesquisa se concentra em reticulados (lattices) e códigos esféricos, que são estruturas geométricas com aplicações em telecomunicações e segurança da informação. Seus trabalhos sobre empacotamento de esferas e quantização têm aplicações em sistemas de comunicação digital e na criptografia pós-quântica — uma área crucial à medida que computadores quânticos ameaçam quebrar os sistemas criptográficos atuais. Costa é membra da Academia Brasileira de Ciências.",
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
        },
      ],
    },
    {
      id: "data-analysis",
      dbId: "fallback-data-analysis",
      name: "Análise de Dados",
      description:
        "A Análise de Dados é o processo de inspecionar, limpar, transformar e modelar dados para descobrir informações úteis, informar conclusões e apoiar a tomada de decisões. Analistas de dados utilizam ferramentas como SQL, Python, R, Excel, Power BI e Tableau para explorar conjuntos de dados, criar visualizações e gerar relatórios. É uma habilidade fundamental em praticamente todos os setores, desde saúde e educação até varejo, finanças e governo. A análise de dados permite que organizações tomem decisões baseadas em evidências em vez de intuição.",
      icon: "TrendingUp",
      women: [
        {
          name: "Ada Lovelace",
          achievement: "Considerada a primeira programadora da história, escreveu o primeiro algoritmo destinado a ser processado por uma máquina.",
          story:
            "Augusta Ada King, Condessa de Lovelace (1815–1852), foi uma matemática e escritora britânica, filha do poeta Lord Byron. Ela trabalhou com Charles Babbage na Máquina Analítica, o ancestral conceitual dos computadores modernos. Em 1843, publicou notas extensas sobre a máquina que incluíam o que é reconhecido como o primeiro programa de computador — um algoritmo para calcular os números de Bernoulli. Mais notavelmente, Lovelace vislumbrou que as máquinas poderiam ir além do cálculo numérico, manipulando símbolos e até compondo música — uma visão que antecipou a computação moderna em mais de um século. A linguagem de programação Ada foi nomeada em sua homenagem.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Tatiana Roque",
          achievement: "Matemática brasileira, professora da UFRJ, pesquisadora em história da matemática e análise de dados aplicada às ciências humanas.",
          story:
            "Tatiana Roque é professora do Instituto de Matemática da Universidade Federal do Rio de Janeiro (UFRJ) e uma das vozes mais importantes na interseção entre matemática, filosofia e humanidades no Brasil. Sua pesquisa abrange história da matemática, sistemas dinâmicos e, mais recentemente, a análise crítica de como dados e algoritmos são utilizados na sociedade contemporânea. Autora do livro 'História da Matemática: Uma Visão Crítica, Desfazendo Mitos e Lendas', ela contribui para democratizar o acesso ao conhecimento matemático e para o debate sobre o impacto social da análise de dados, algoritmos e inteligência artificial.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Diane Tang",
          achievement: "Engenheira do Google, pioneira no desenvolvimento de sistemas de análise de experimentos online (A/B testing) em larga escala.",
          story:
            "Diane Tang é uma cientista da computação e engenheira que liderou o desenvolvimento de infraestruturas de análise de dados e experimentação no Google. Seu trabalho na criação de sistemas robustos de A/B testing (testes comparativos online) permitiu que o Google tomasse decisões baseadas em dados para bilhões de usuários. Tang foi fundamental na formalização de metodologias estatísticas para experimentos online em escala massiva, contribuindo para o campo da 'causal inference' (inferência causal) aplicada à tecnologia. Seu trabalho demonstra como a análise rigorosa de dados pode transformar produtos e serviços digitais.",
          image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
        },
      ],
    },
    {
      id: "actuarial-science",
      dbId: "fallback-actuarial-science",
      name: "Ciência Atuarial",
      description:
        "A Ciência Atuarial aplica matemática, estatística e teoria financeira para avaliar riscos em seguros, previdência, investimentos e saúde. Atuárias calculam prêmios de seguros, reservas técnicas, planos de previdência e modelos de risco financeiro. É uma profissão regulamentada no Brasil pelo IBA (Instituto Brasileiro de Atuária), com alta demanda em seguradoras, bancos, consultorias, órgãos governamentais e empresas de saúde suplementar. A carreira combina rigor matemático com impacto social direto, pois os cálculos atuariais determinam a sustentabilidade de sistemas de proteção social como a previdência pública e privada.",
      icon: "ShieldCheck",
      women: [
        {
          name: "Mary Frances Lyon",
          achievement: "Geneticista britânica que descobriu a inativação do cromossomo X, com impacto profundo na avaliação de risco genético utilizada na ciência atuarial.",
          story:
            "Mary Frances Lyon (1925–2014) foi uma geneticista britânica que propôs a 'hipótese de Lyon' — a teoria de que, em mamíferos fêmeas, um dos dois cromossomos X é aleatoriamente inativado em cada célula durante o desenvolvimento embrionário. Essa descoberta, conhecida como 'lyonização', teve implicações profundas para a compreensão de doenças genéticas ligadas ao cromossomo X e para a avaliação de risco genético, uma área que conecta genética e ciência atuarial. A capacidade de prever a probabilidade de manifestação de doenças hereditárias é fundamental para o cálculo de seguros de saúde e de vida.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        },
        {
          name: "Emilie du Châtelet",
          achievement: "Matemática e física francesa do século XVIII, traduziu e comentou os 'Principia Mathematica' de Newton, expandindo a matemática financeira de sua época.",
          story:
            "Gabrielle Émilie Le Tonnelier de Breteuil, Marquesa du Châtelet (1706–1749), foi uma matemática, física e filósofa francesa cuja tradução comentada dos 'Principia Mathematica' de Newton para o francês permanece a referência padrão até hoje. Sua contribuição mais original foi a formulação do conceito de conservação da energia cinética, demonstrando que a energia de um corpo em movimento é proporcional ao quadrado de sua velocidade (E = mv²), não à velocidade simples como Newton propunha. Esse trabalho sobre quantificação e modelagem de fenômenos físicos lançou bases conceituais que seriam aplicadas à matemática financeira e à avaliação quantitativa de riscos.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        },
        {
          name: "Maria Thereza Velloso de Oliveira",
          achievement: "Pioneira da ciência atuarial no Brasil, contribuiu para a estruturação do sistema previdenciário brasileiro.",
          story:
            "A ciência atuarial no Brasil tem uma história rica, e mulheres atuárias têm desempenhado papéis fundamentais na estruturação do sistema previdenciário e de seguros do país. Profissionais como as primeiras mulheres formadas em Ciências Atuariais no Brasil contribuíram para o desenvolvimento de modelos de risco adaptados à realidade demográfica e epidemiológica brasileira. Hoje, mulheres atuárias brasileiras atuam em áreas como modelagem de risco climático, seguros paramétricos para a agricultura e cálculos de sustentabilidade para a previdência social. O Instituto Brasileiro de Atuária (IBA) e as universidades brasileiras têm promovido a inclusão feminina na profissão.",
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
        },
      ],
    },
  ],
};

export const useCareerAreasContent = (selectedArea: string) => {
  const stemArea = areaToStemArea[selectedArea] || "Ciência";

  return useQuery({
    queryKey: ["career-areas-content", stemArea],
    queryFn: async (): Promise<Career[]> => {
      const { data, error } = await supabase
        .from("career_areas_content")
        .select("*")
        .eq("stem_area", stemArea)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching career areas content:", error);
        // Fall back to static data instead of throwing
        return defaultContent[stemArea] || [];
      }

      if (!data || data.length === 0) {
        // Return static fallback when no database results
        return defaultContent[stemArea] || [];
      }

      return data.map((item) => ({
        id: item.career_id,
        dbId: item.id, // Store the UUID for database operations
        name: item.career_name,
        description: item.career_description,
        salaryRange: item.salary_range || undefined,
        icon: item.icon || "Briefcase",
        women: Array.isArray(item.women) ? (item.women as unknown as WomanProfile[]) : [],
      }));
    },
  });
};
