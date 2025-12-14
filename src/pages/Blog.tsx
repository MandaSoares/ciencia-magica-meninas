import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

interface BlogProps {
  onBack: () => void;
}

const blogPosts = [
  {
    id: 1,
    title: "Por que meninas devem aprender programação desde cedo?",
    excerpt: "Descubra como a programação desenvolve habilidades essenciais como lógica, criatividade e resolução de problemas.",
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
    category: "Tecnologia",
    author: "Fernanda Costa",
    date: "25 Nov 2024",
    readTime: "6 min",
    image: "🤖",
    color: "bg-cyan-500"
  }
];

export const Blog = ({ onBack }: BlogProps) => {
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

        <div className="text-center mt-12">
          <Card className="p-8 bg-gradient-to-r from-purple-100 to-pink-100">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Quer receber novidades?
            </h3>
            <p className="text-gray-600 mb-4">
              Inscreva-se para receber artigos e dicas sobre STEM diretamente no seu email.
            </p>
            <div className="flex justify-center gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Seu melhor email"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                Inscrever
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Blog;
