import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      toast({
        title: "Inscrição confirmada! 🎉",
        description: "Você receberá nossas novidades sobre STEM no seu email.",
      });
      setEmail("");
    } else {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="text-center mt-12">
      <Card className="p-8 bg-gradient-to-r from-purple-100 to-pink-100">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Quer receber novidades?
        </h3>
        <p className="text-gray-600 mb-4">
          Inscreva-se para receber artigos e dicas sobre STEM diretamente no seu email.
        </p>
        {subscribed ? (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Você está inscrita! Obrigada!</span>
          </div>
        ) : (
          <div className="flex justify-center gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Seu melhor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button 
              onClick={handleSubscribe}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              Inscrever
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

interface BlogProps {
  onBack: () => void;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  color: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Por que meninas devem aprender programação desde cedo?",
    excerpt: "Descubra como a programação desenvolve habilidades essenciais como lógica, criatividade e resolução de problemas.",
    content: `A programação é uma das habilidades mais importantes do século XXI, e quanto mais cedo começamos a aprender, melhor!

**Por que começar cedo?**

1. **Desenvolvimento do raciocínio lógico**: A programação ensina a pensar de forma estruturada e a resolver problemas passo a passo.

2. **Criatividade sem limites**: Com código, você pode criar qualquer coisa que imaginar - desde jogos até aplicativos que ajudam pessoas.

3. **Preparação para o futuro**: A tecnologia está em toda parte, e saber programar abre portas para carreiras incríveis.

**Mulheres na Programação**

Sabia que a primeira programadora da história foi uma mulher? Ada Lovelace escreveu o primeiro algoritmo de computador em 1843! Outras mulheres incríveis como Grace Hopper (criadora do COBOL) e Margaret Hamilton (engenheira do software que levou o homem à lua) mudaram o mundo com código.

**Como começar?**

- Use plataformas visuais como Scratch para aprender os conceitos básicos
- Experimente fazer pequenos projetos divertidos
- Participe de comunidades de programação para meninas
- Não tenha medo de errar - programar é sobre tentativa e erro!

Lembre-se: não existe idade certa para começar, e você pode ser a próxima grande programadora que vai mudar o mundo!`,
    category: "Tecnologia",
    author: "Ana Clara",
    date: "10 Dez 2024",
    readTime: "5 min",
    image: "💻",
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "5 Mulheres cientistas que mudaram o mundo",
    excerpt: "Conheça histórias inspiradoras de Marie Curie, Ada Lovelace, Katherine Johnson e outras pioneiras da ciência.",
    content: `A história da ciência foi construída por muitas mulheres brilhantes que enfrentaram desafios e preconceitos para fazer descobertas que mudaram o mundo.

**1. Marie Curie (1867-1934)**
A única pessoa a ganhar dois Prêmios Nobel em áreas científicas diferentes (Física e Química). Descobriu a radioatividade e os elementos polônio e rádio. Sua pesquisa ajudou a desenvolver tratamentos contra o câncer.

**2. Ada Lovelace (1815-1852)**
Considerada a primeira programadora da história! Escreveu o primeiro algoritmo de computador, imaginando possibilidades para as máquinas que só se realizariam um século depois.

**3. Katherine Johnson (1918-2020)**
Matemática afro-americana cujos cálculos foram essenciais para as missões espaciais da NASA. Seu trabalho ajudou a levar o primeiro americano ao espaço e, mais tarde, à Lua.

**4. Rosalind Franklin (1920-1958)**
Biofísica que produziu a famosa "Foto 51", imagem crucial para descobrir a estrutura do DNA. Sem seu trabalho, essa descoberta não teria sido possível.

**5. Tu Youyou (1930-)**
Farmacêutica chinesa que descobriu a artemisinina, tratamento que salvou milhões de vidas de malária. Ganhou o Prêmio Nobel de Medicina em 2015.

**O que podemos aprender com elas?**

Essas mulheres nos ensinam que a curiosidade, a persistência e a paixão pela descoberta podem superar qualquer obstáculo. Você também pode ser uma cientista que muda o mundo!`,
    category: "Ciência",
    author: "Beatriz Santos",
    date: "08 Dez 2024",
    readTime: "7 min",
    image: "🔬",
    color: "bg-green-500"
  },
  {
    id: 3,
    title: "Engenharia para crianças: projetos divertidos para fazer em casa",
    excerpt: "Atividades práticas e seguras que ensinam conceitos de engenharia usando materiais simples.",
    content: `A engenharia está em toda parte, e você pode começar a explorar conceitos incríveis com materiais simples que provavelmente já tem em casa!

**Projeto 1: Ponte de Palitos de Sorvete**
- Materiais: palitos de sorvete, cola branca
- Objetivo: construir uma ponte que suporte o maior peso possível
- Conceito: estruturas e distribuição de forças

**Projeto 2: Catapulta com Pregadores**
- Materiais: pregadores de roupa, palitos de picolé, elásticos, tampinha de garrafa
- Objetivo: lançar pequenos objetos
- Conceito: energia potencial e cinética

**Projeto 3: Carro Movido a Elástico**
- Materiais: caixa de fósforos vazia, tampinhas, palitos e elásticos
- Objetivo: criar um carrinho que anda sozinho
- Conceito: energia elástica e movimento

**Projeto 4: Torre de Espaguete**
- Materiais: espaguete cru e marshmallows
- Objetivo: construir a torre mais alta que fique de pé
- Conceito: equilíbrio e geometria estrutural

**Dicas importantes:**
- Sempre peça ajuda de um adulto quando usar tesoura ou cola quente
- Faça testes e não desista na primeira tentativa
- Anote o que funcionou e o que não funcionou
- Divirta-se experimentando!

A engenharia é sobre criar soluções para problemas reais. Cada projeto que você faz te ensina algo novo!`,
    category: "Engenharia",
    author: "Carolina Lima",
    date: "05 Dez 2024",
    readTime: "6 min",
    image: "🔧",
    color: "bg-orange-500"
  },
  {
    id: 4,
    title: "Matemática divertida: jogos que ensinam sem você perceber",
    excerpt: "Aprenda como tornar a matemática mais acessível e divertida através de jogos e desafios.",
    content: `Quem disse que matemática precisa ser chata? Existem muitas formas divertidas de aprender e praticar matemática no dia a dia!

**Jogos de Tabuleiro**

1. **Banco Imobiliário**: Ensina sobre dinheiro, juros e negociação
2. **Rummikub**: Desenvolve raciocínio lógico com sequências numéricas
3. **Sudoku**: Exercita lógica e reconhecimento de padrões

**Jogos do Dia a Dia**

- **Desafio do Supermercado**: Calcule mentalmente quanto vai gastar antes de passar no caixa
- **Corrida dos Números**: No carro, some as placas que você vê
- **Chef Matemático**: Ajude na cozinha medindo ingredientes e calculando porções

**Matemática na Natureza**

Sabia que a matemática está na natureza? O padrão espiral das conchas, a simetria das flores e até as ondas do mar seguem padrões matemáticos!

**Desafios para você:**

1. Descubra a sequência de Fibonacci nos girassóis
2. Encontre formas geométricas em prédios e construções
3. Calcule quantos passos você dá para chegar à escola

**Dica de ouro:**

Não tenha medo de errar! Na matemática, os erros nos ajudam a entender melhor os conceitos. Cada problema resolvido é uma vitória!

A matemática é como um quebra-cabeça gigante esperando para ser descoberto. Quanto mais você pratica, mais fácil e divertido fica!`,
    category: "Matemática",
    author: "Diana Oliveira",
    date: "02 Dez 2024",
    readTime: "4 min",
    image: "🧮",
    color: "bg-purple-500"
  },
  {
    id: 5,
    title: "Como despertar a curiosidade científica nas crianças",
    excerpt: "Dicas práticas para pais e educadores incentivarem o interesse pela ciência desde a infância.",
    content: `A curiosidade é a semente da ciência. Toda grande descoberta começou com uma pergunta simples: "Por quê?"

**Incentivando Perguntas**

Quando uma criança pergunta "Por que o céu é azul?" ou "Para onde vai a água quando seca?", ela está fazendo ciência! Incentive essas perguntas:

- Responda com outras perguntas: "O que você acha?"
- Pesquisem juntos a resposta
- Faça experiências para descobrir

**Transforme o Cotidiano em Laboratório**

- **Cozinha**: Observe fermento em ação, misture cores com alimentos
- **Jardim**: Plante sementes e acompanhe o crescimento
- **Banho**: Explore flutuação com diferentes objetos
- **Céu noturno**: Observe estrelas e fases da lua

**Livros e Vídeos Inspiradores**

Biografi as de cientistas, documentários da natureza e livros de experimentos são ótimos companheiros. Mostre que cientistas são pessoas normais que seguiram sua curiosidade.

**Visite Museus e Feiras de Ciência**

Experiências práticas em museus de ciência são memoráveis. Muitos oferecem atividades interativas que fascinam crianças de todas as idades.

**O Mais Importante**

Nunca diga "isso é muito difícil para você". Crianças são capazes de compreender conceitos complexos quando apresentados de forma adequada. Acredite no potencial delas!`,
    category: "Educação",
    author: "Elena Martins",
    date: "28 Nov 2024",
    readTime: "8 min",
    image: "🌟",
    color: "bg-pink-500"
  },
  {
    id: 6,
    title: "Inteligência Artificial explicada para crianças",
    excerpt: "Uma introdução simples e divertida ao mundo da IA, com exemplos do cotidiano.",
    content: `Você já conversou com a Alexa ou pediu para a Siri tocar uma música? Isso é Inteligência Artificial em ação!

**O que é Inteligência Artificial?**

IA são computadores que aprendem a fazer tarefas que normalmente precisariam de inteligência humana, como:
- Reconhecer rostos em fotos
- Entender o que você fala
- Traduzir idiomas
- Jogar xadrez

**Como os Computadores Aprendem?**

Imagine ensinar um robô a reconhecer gatos. Você mostraria milhares de fotos de gatos dizendo "isso é um gato". Depois de ver muitas fotos, o robô começa a perceber padrões: orelhas pontudas, bigodes, olhos brilhantes...

É assim que a IA aprende: vendo muitos exemplos!

**IA no Seu Dia a Dia**

- **YouTube**: Sugere vídeos que você pode gostar
- **Jogos**: Personagens que jogam contra você
- **Filtros de Fotos**: Transformam seu rosto em animais
- **Corretor Ortográfico**: Sugere correções enquanto você digita

**O Futuro da IA**

No futuro, a IA pode ajudar médicos a diagnosticar doenças, carros a dirigirem sozinhos e robôs a ajudarem em casa. Quem sabe você não cria a próxima grande IA?

**Como Aprender Mais?**

Existem ferramentas divertidas para crianças aprenderem sobre IA:
- Teachable Machine do Google
- Scratch com extensões de IA
- Quick Draw do Google

Lembre-se: a IA é uma ferramenta criada por pessoas. O mais importante é usar essa tecnologia para fazer o bem!`,
    category: "Tecnologia",
    author: "Fernanda Costa",
    date: "25 Nov 2024",
    readTime: "6 min",
    image: "🤖",
    color: "bg-cyan-500"
  }
];

export const Blog = ({ onBack }: BlogProps) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-3xl mx-auto p-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedPost(null)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Blog
          </Button>

          <Card className="overflow-hidden">
            <div className={`${selectedPost.color} p-12 text-center text-6xl`}>
              {selectedPost.image}
            </div>
            <div className="p-8">
              <Badge variant="secondary" className="mb-4">
                {selectedPost.category}
              </Badge>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {selectedPost.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedPost.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {selectedPost.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedPost.readTime} de leitura
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none">
                {selectedPost.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h2 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3">
                        {paragraph.replace(/\*\*/g, '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('**')) {
                    return (
                      <h3 key={index} className="text-lg font-semibold text-gray-700 mt-4 mb-2">
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('-') || paragraph.startsWith('1.')) {
                    const items = paragraph.split('\n');
                    return (
                      <ul key={index} className="list-disc list-inside space-y-1 my-3 text-gray-600">
                        {items.map((item, i) => (
                          <li key={i}>{item.replace(/^[-\d.]\s*/, '').replace(/\*\*/g, '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={index} className="text-gray-600 my-3 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-5xl mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Blog ScienceGirls
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Artigos, dicas e histórias inspiradoras sobre o mundo STEM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card 
              key={post.id} 
              className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => setSelectedPost(post)}
            >
              <div className={`${post.color} p-8 text-center text-5xl group-hover:scale-105 transition-transform`}>
                {post.image}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
                
                <h2 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <NewsletterSection />
      </div>
    </div>
  );
};

export default Blog;