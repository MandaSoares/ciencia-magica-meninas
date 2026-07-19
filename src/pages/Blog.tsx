import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User, CheckCircle, Loader2, Trash2, Edit2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { AddBlogCard } from "@/components/admin/AddBlogCard";
import { EditBlogPostInline } from "@/components/admin/EditBlogPostInline";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  color: string;
  isFromDb?: boolean;
}

const staticBlogPosts: BlogPost[] = [
  {
    id: "static-1",
    title: "Por que meninas devem aprender programação desde cedo?",
    excerpt: "Descubra como a programação desenvolve habilidades essenciais como lógica, criatividade e resolução de problemas.",
    content: `A programação é uma das habilidades mais importantes do século XXI, e quanto mais cedo começamos a aprender, melhor!

**Por que começar cedo?**

1. **Desenvolvimento do raciocínio lógico**: A programação ensina a pensar de forma estruturada e a resolver problemas passo a passo.

2. **Criatividade sem limites**: Com código, você pode criar qualquer coisa que imaginar - desde jogos até aplicativos que ajudam pessoas.

3. **Preparação para o futuro**: A tecnologia está em toda parte, e saber programar abre portas para carreiras incríveis.

**Mulheres na Programação**

Sabia que a primeira programadora da história foi uma mulher? Ada Lovelace escreveu o primeiro algoritmo de computador em 1843! Outras mulheres incríveis como Grace Hopper (criadora do COBOL) e Margaret Hamilton (engenheira do software que levou o homem à lua) mudaram o mundo com código.`,
    category: "Tecnologia",
    author: "Ana Clara",
    date: "10 Dez 2024",
    readTime: "5 min",
    image: "💻",
    color: "bg-blue-500"
  },
  {
    id: "static-2",
    title: "5 Mulheres cientistas que mudaram o mundo",
    excerpt: "Conheça histórias inspiradoras de Marie Curie, Ada Lovelace, Katherine Johnson e outras pioneiras da ciência.",
    content: `A história da ciência foi construída por muitas mulheres brilhantes que enfrentaram desafios e preconceitos para fazer descobertas que mudaram o mundo.

**1. Marie Curie (1867-1934)**
A única pessoa a ganhar dois Prêmios Nobel em áreas científicas diferentes (Física e Química). Descobriu a radioatividade e os elementos polônio e rádio.

**2. Ada Lovelace (1815-1852)**
Considerada a primeira programadora da história! Escreveu o primeiro algoritmo de computador.

**3. Katherine Johnson (1918-2020)**
Matemática afro-americana cujos cálculos foram essenciais para as missões espaciais da NASA.`,
    category: "Ciência",
    author: "Beatriz Santos",
    date: "08 Dez 2024",
    readTime: "7 min",
    image: "🔬",
    color: "bg-green-500"
  },
];

export const Blog = ({ onBack }: BlogProps) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(staticBlogPosts);
  const [isLoading, setIsLoading] = useState(true);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const { isAdmin, isModerator } = useAdminCheck();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const dbPosts: BlogPost[] = (data || []).map((post) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        author: post.author_name,
        date: new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        readTime: post.read_time || '5 min',
        image: post.emoji || '📝',
        color: post.color_class || 'bg-purple-500',
        isFromDb: true,
      }));

      setBlogPosts([...dbPosts, ...staticBlogPosts]);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setBlogPosts(staticBlogPosts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async () => {
    if (!deletePostId) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', deletePostId);

      if (error) throw error;

      toast({ title: "Post deletado com sucesso!" });
      fetchPosts();
    } catch (error: any) {
      toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
    } finally {
      setDeletePostId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

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
            Blog Conscientistas
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Artigos, dicas e histórias inspiradoras sobre o mundo STEM.
          </p>
        </div>

        {editingPost ? (
          <div className="mb-8">
            <EditBlogPostInline
              post={editingPost}
              onSave={() => {
                setEditingPost(null);
                fetchPosts();
              }}
              onCancel={() => setEditingPost(null)}
            />
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card 
              key={post.id} 
              className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group relative"
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
              
              {/* Admin/Moderator controls */}
              {(isAdmin || isModerator) && post.isFromDb && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPost(post);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletePostId(post.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </Card>
          ))}
          
          {/* Card para adicionar novo post - admin ou moderador */}
          {(isAdmin || isModerator) && (
            <AddBlogCard onPostAdded={fetchPosts} />
          )}
        </div>

        <NewsletterSection />
      </div>

      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Blog;
