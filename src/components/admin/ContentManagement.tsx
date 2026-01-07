import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  BookOpen, 
  Map, 
  Beaker, 
  Briefcase,
  FileText,
  Loader2,
  Save
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContentManagementProps {
  activeTab?: string;
}

const STEM_AREAS = [
  { value: "science", label: "Ciências" },
  { value: "technology", label: "Tecnologia" },
  { value: "engineering", label: "Engenharia" },
  { value: "math", label: "Matemática" },
];

export const ContentManagement = ({ activeTab = "blog" }: ContentManagementProps) => {
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState("science");

  // Form states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    setLoading(true);
    await Promise.all([
      fetchBlogPosts(),
      fetchLearningPaths(),
      fetchModules(),
      fetchExperiments(),
      fetchCareers(),
    ]);
    setLoading(false);
  };

  const fetchBlogPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setBlogPosts(data);
  };

  const fetchLearningPaths = async () => {
    const { data, error } = await supabase
      .from('learning_path_content')
      .select('*')
      .order('stem_area', { ascending: true })
      .order('level_number', { ascending: true });
    if (!error && data) setLearningPaths(data);
  };

  const fetchModules = async () => {
    const { data, error } = await supabase
      .from('modules_content')
      .select('*')
      .order('stem_area', { ascending: true })
      .order('sort_order', { ascending: true });
    if (!error && data) setModules(data);
  };

  const fetchExperiments = async () => {
    const { data, error } = await supabase
      .from('experiments_content')
      .select('*')
      .order('stem_area', { ascending: true })
      .order('sort_order', { ascending: true });
    if (!error && data) setExperiments(data);
  };

  const fetchCareers = async () => {
    const { data, error } = await supabase
      .from('career_areas_content')
      .select('*')
      .order('stem_area', { ascending: true })
      .order('sort_order', { ascending: true });
    if (!error && data) setCareers(data);
  };

  const handleDelete = async (table: string, id: string) => {
    const { error } = await supabase.from(table as any).delete().eq('id', id);
    if (error) {
      toast.error('Erro ao deletar');
      return;
    }
    toast.success('Deletado com sucesso');
    fetchAllContent();
  };

  const getAreaLabel = (area: string) => {
    return STEM_AREAS.find(a => a.value === area)?.label || area;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-6">
        <TabsTrigger value="blog" className="gap-2 text-xs md:text-sm">
          <FileText className="w-4 h-4" />
          <span className="hidden md:inline">Blog</span>
        </TabsTrigger>
        <TabsTrigger value="paths" className="gap-2 text-xs md:text-sm">
          <Map className="w-4 h-4" />
          <span className="hidden md:inline">Trilhas</span>
        </TabsTrigger>
        <TabsTrigger value="modules" className="gap-2 text-xs md:text-sm">
          <BookOpen className="w-4 h-4" />
          <span className="hidden md:inline">Módulos</span>
        </TabsTrigger>
        <TabsTrigger value="lab" className="gap-2 text-xs md:text-sm">
          <Beaker className="w-4 h-4" />
          <span className="hidden md:inline">Lab</span>
        </TabsTrigger>
        <TabsTrigger value="careers" className="gap-2 text-xs md:text-sm">
          <Briefcase className="w-4 h-4" />
          <span className="hidden md:inline">Áreas</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="blog" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Posts do Blog ({blogPosts.length})</h3>
          <BlogPostDialog onSave={fetchBlogPosts} />
        </div>
        
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {blogPosts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum post ainda</p>
          ) : (
            blogPosts.map(post => (
              <Card key={post.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{post.emoji}</span>
                      <h4 className="font-medium">{post.title}</h4>
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Publicado" : "Rascunho"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Por {post.author_name} • {post.category}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <BlogPostDialog post={post} onSave={fetchBlogPosts} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete('blog_posts', post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="paths" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Trilhas de Aprendizado ({learningPaths.length})</h3>
          <LearningPathDialog onSave={fetchLearningPaths} />
        </div>

        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione a área" />
          </SelectTrigger>
          <SelectContent>
            {STEM_AREAS.map(area => (
              <SelectItem key={area.value} value={area.value}>{area.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {learningPaths.filter(p => p.stem_area === selectedArea).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma trilha para esta área</p>
          ) : (
            learningPaths.filter(p => p.stem_area === selectedArea).map(path => (
              <Card key={path.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge>{path.difficulty}</Badge>
                      <h4 className="font-medium">Nível {path.level_number}: {path.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{path.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {path.points} pontos • {(path.lessons as any[])?.length || 0} lições
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <LearningPathDialog path={path} onSave={fetchLearningPaths} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete('learning_path_content', path.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="modules" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Módulos ({modules.length})</h3>
          <ModuleDialog onSave={fetchModules} />
        </div>

        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione a área" />
          </SelectTrigger>
          <SelectContent>
            {STEM_AREAS.map(area => (
              <SelectItem key={area.value} value={area.value}>{area.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {modules.filter(m => m.stem_area === selectedArea).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum módulo para esta área</p>
          ) : (
            modules.filter(m => m.stem_area === selectedArea).map(mod => (
              <Card key={mod.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{mod.title}</h4>
                    <p className="text-sm text-muted-foreground">{mod.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {mod.category} • {mod.estimated_time} • {mod.total_lessons} lições
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <ModuleDialog module={mod} onSave={fetchModules} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete('modules_content', mod.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="lab" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Experimentos ({experiments.length})</h3>
          <ExperimentDialog onSave={fetchExperiments} />
        </div>

        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione a área" />
          </SelectTrigger>
          <SelectContent>
            {STEM_AREAS.map(area => (
              <SelectItem key={area.value} value={area.value}>{area.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {experiments.filter(e => e.stem_area === selectedArea).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum experimento para esta área</p>
          ) : (
            experiments.filter(e => e.stem_area === selectedArea).map(exp => (
              <Card key={exp.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <span className="text-3xl">{exp.image}</span>
                    <div>
                      <h4 className="font-medium">{exp.title}</h4>
                      <p className="text-sm text-muted-foreground">{exp.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {exp.difficulty} • {exp.time} • {(exp.materials as string[])?.length || 0} materiais
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <ExperimentDialog experiment={exp} onSave={fetchExperiments} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete('experiments_content', exp.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="careers" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Áreas de Atuação ({careers.length})</h3>
          <CareerDialog onSave={fetchCareers} />
        </div>

        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione a área" />
          </SelectTrigger>
          <SelectContent>
            {STEM_AREAS.map(area => (
              <SelectItem key={area.value} value={area.value}>{area.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {careers.filter(c => c.stem_area === selectedArea).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma carreira para esta área</p>
          ) : (
            careers.filter(c => c.stem_area === selectedArea).map(career => (
              <Card key={career.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{career.career_name}</h4>
                    <p className="text-sm text-muted-foreground">{career.career_description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {career.salary_range} • {(career.women as any[])?.length || 0} mulheres inspiradoras
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <CareerDialog career={career} onSave={fetchCareers} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete('career_areas_content', career.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

// Blog Post Dialog Component
function BlogPostDialog({ post, onSave }: { post?: any; onSave: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category: post?.category || 'STEM',
    author_name: post?.author_name || '',
    emoji: post?.emoji || '📚',
    read_time: post?.read_time || '5 min',
    published: post?.published || false,
  });

  const handleSave = async () => {
    setSaving(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const payload = {
      ...formData,
      author_id: user?.id,
    };

    let error;
    if (post) {
      const result = await supabase.from('blog_posts').update(payload).eq('id', post.id);
      error = result.error;
    } else {
      const result = await supabase.from('blog_posts').insert(payload);
      error = result.error;
    }

    setSaving(false);
    
    if (error) {
      toast.error('Erro ao salvar post');
      console.error(error);
      return;
    }
    
    toast.success(post ? 'Post atualizado!' : 'Post criado!');
    setOpen(false);
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {post ? (
          <Button variant="ghost" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? 'Editar Post' : 'Novo Post'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
              <label className="text-sm font-medium">Título</label>
              <Input
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Título do post"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Emoji</label>
              <Input
                value={formData.emoji}
                onChange={e => setFormData(prev => ({ ...prev, emoji: e.target.value }))}
                placeholder="📚"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Resumo</label>
            <Textarea
              value={formData.excerpt}
              onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Breve descrição do post"
              rows={2}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Conteúdo</label>
            <Textarea
              value={formData.content}
              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Conteúdo completo do post (suporta Markdown)"
              rows={10}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <Input
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="STEM"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Autor</label>
              <Input
                value={formData.author_name}
                onChange={e => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                placeholder="Nome do autor"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tempo de leitura</label>
              <Input
                value={formData.read_time}
                onChange={e => setFormData(prev => ({ ...prev, read_time: e.target.value }))}
                placeholder="5 min"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={e => setFormData(prev => ({ ...prev, published: e.target.checked }))}
            />
            <label htmlFor="published" className="text-sm">Publicado</label>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Learning Path Dialog
function LearningPathDialog({ path, onSave }: { path?: any; onSave: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    stem_area: path?.stem_area || 'science',
    level_number: path?.level_number || 1,
    title: path?.title || '',
    description: path?.description || '',
    difficulty: path?.difficulty || 'Iniciante',
    points: path?.points || 30,
    color: path?.color || 'bg-purple-500',
    lessons: JSON.stringify(path?.lessons || [], null, 2),
  });

  const handleSave = async () => {
    setSaving(true);
    
    let lessons;
    try {
      lessons = JSON.parse(formData.lessons);
    } catch {
      toast.error('JSON de lições inválido');
      setSaving(false);
      return;
    }

    const payload = {
      ...formData,
      level_number: Number(formData.level_number),
      points: Number(formData.points),
      lessons,
    };

    let error;
    if (path) {
      const result = await supabase.from('learning_path_content').update(payload).eq('id', path.id);
      error = result.error;
    } else {
      const result = await supabase.from('learning_path_content').insert(payload);
      error = result.error;
    }

    setSaving(false);
    
    if (error) {
      toast.error('Erro ao salvar trilha');
      console.error(error);
      return;
    }
    
    toast.success(path ? 'Trilha atualizada!' : 'Trilha criada!');
    setOpen(false);
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {path ? (
          <Button variant="ghost" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Trilha
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{path ? 'Editar Trilha' : 'Nova Trilha'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Área STEM</label>
              <Select value={formData.stem_area} onValueChange={v => setFormData(p => ({ ...p, stem_area: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STEM_AREAS.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Nível</label>
              <Input
                type="number"
                value={formData.level_number}
                onChange={e => setFormData(p => ({ ...p, level_number: Number(e.target.value) }))}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
          </div>
          
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={2} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Dificuldade</label>
              <Input value={formData.difficulty} onChange={e => setFormData(p => ({ ...p, difficulty: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Pontos</label>
              <Input type="number" value={formData.points} onChange={e => setFormData(p => ({ ...p, points: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Cor</label>
              <Input value={formData.color} onChange={e => setFormData(p => ({ ...p, color: e.target.value }))} placeholder="bg-purple-500" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Lições (JSON)</label>
            <Textarea value={formData.lessons} onChange={e => setFormData(p => ({ ...p, lessons: e.target.value }))} rows={10} className="font-mono text-xs" />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Module Dialog
function ModuleDialog({ module, onSave }: { module?: any; onSave: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    stem_area: module?.stem_area || 'science',
    module_id: module?.module_id || '',
    title: module?.title || '',
    description: module?.description || '',
    category: module?.category || '',
    color: module?.color || 'bg-purple-500',
    icon: module?.icon || 'BookOpen',
    total_lessons: module?.total_lessons || 5,
    estimated_time: module?.estimated_time || '3 horas',
    lessons: JSON.stringify(module?.lessons || [], null, 2),
    final_project: JSON.stringify(module?.final_project || {}, null, 2),
  });

  const handleSave = async () => {
    setSaving(true);
    
    let lessons, final_project;
    try {
      lessons = JSON.parse(formData.lessons);
      final_project = JSON.parse(formData.final_project);
    } catch {
      toast.error('JSON inválido');
      setSaving(false);
      return;
    }

    const payload = {
      ...formData,
      total_lessons: Number(formData.total_lessons),
      lessons,
      final_project,
    };

    let error;
    if (module) {
      const result = await supabase.from('modules_content').update(payload).eq('id', module.id);
      error = result.error;
    } else {
      const result = await supabase.from('modules_content').insert(payload);
      error = result.error;
    }

    setSaving(false);
    
    if (error) {
      toast.error('Erro ao salvar módulo');
      console.error(error);
      return;
    }
    
    toast.success(module ? 'Módulo atualizado!' : 'Módulo criado!');
    setOpen(false);
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {module ? (
          <Button variant="ghost" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Módulo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{module ? 'Editar Módulo' : 'Novo Módulo'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Área STEM</label>
              <Select value={formData.stem_area} onValueChange={v => setFormData(p => ({ ...p, stem_area: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STEM_AREAS.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">ID do Módulo</label>
              <Input value={formData.module_id} onChange={e => setFormData(p => ({ ...p, module_id: e.target.value }))} placeholder="modulo-id" />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
          </div>
          
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={2} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <Input value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Total de Lições</label>
              <Input type="number" value={formData.total_lessons} onChange={e => setFormData(p => ({ ...p, total_lessons: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Tempo estimado</label>
              <Input value={formData.estimated_time} onChange={e => setFormData(p => ({ ...p, estimated_time: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Lições (JSON)</label>
            <Textarea value={formData.lessons} onChange={e => setFormData(p => ({ ...p, lessons: e.target.value }))} rows={8} className="font-mono text-xs" />
          </div>

          <div>
            <label className="text-sm font-medium">Projeto Final (JSON)</label>
            <Textarea value={formData.final_project} onChange={e => setFormData(p => ({ ...p, final_project: e.target.value }))} rows={4} className="font-mono text-xs" />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Experiment Dialog
function ExperimentDialog({ experiment, onSave }: { experiment?: any; onSave: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    stem_area: experiment?.stem_area || 'science',
    experiment_id: experiment?.experiment_id || '',
    title: experiment?.title || '',
    description: experiment?.description || '',
    difficulty: experiment?.difficulty || 'Fácil',
    time: experiment?.time || '15 min',
    materials: (experiment?.materials || []).join('\n'),
    steps: (experiment?.steps || []).join('\n'),
    image: experiment?.image || '🧪',
  });

  const handleSave = async () => {
    setSaving(true);
    
    const payload = {
      ...formData,
      materials: formData.materials.split('\n').filter(Boolean),
      steps: formData.steps.split('\n').filter(Boolean),
    };

    let error;
    if (experiment) {
      const result = await supabase.from('experiments_content').update(payload).eq('id', experiment.id);
      error = result.error;
    } else {
      const result = await supabase.from('experiments_content').insert(payload);
      error = result.error;
    }

    setSaving(false);
    
    if (error) {
      toast.error('Erro ao salvar experimento');
      console.error(error);
      return;
    }
    
    toast.success(experiment ? 'Experimento atualizado!' : 'Experimento criado!');
    setOpen(false);
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {experiment ? (
          <Button variant="ghost" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Experimento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{experiment ? 'Editar Experimento' : 'Novo Experimento'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Área STEM</label>
              <Select value={formData.stem_area} onValueChange={v => setFormData(p => ({ ...p, stem_area: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STEM_AREAS.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">ID</label>
              <Input value={formData.experiment_id} onChange={e => setFormData(p => ({ ...p, experiment_id: e.target.value }))} placeholder="experiment-id" />
            </div>
            <div>
              <label className="text-sm font-medium">Emoji</label>
              <Input value={formData.image} onChange={e => setFormData(p => ({ ...p, image: e.target.value }))} />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
          </div>
          
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Dificuldade</label>
              <Select value={formData.difficulty} onValueChange={v => setFormData(p => ({ ...p, difficulty: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fácil">Fácil</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Avançado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Tempo</label>
              <Input value={formData.time} onChange={e => setFormData(p => ({ ...p, time: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Materiais (um por linha)</label>
            <Textarea value={formData.materials} onChange={e => setFormData(p => ({ ...p, materials: e.target.value }))} rows={4} />
          </div>

          <div>
            <label className="text-sm font-medium">Passos (um por linha)</label>
            <Textarea value={formData.steps} onChange={e => setFormData(p => ({ ...p, steps: e.target.value }))} rows={6} />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Career Dialog
function CareerDialog({ career, onSave }: { career?: any; onSave: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    stem_area: career?.stem_area || 'science',
    career_id: career?.career_id || '',
    career_name: career?.career_name || '',
    career_description: career?.career_description || '',
    salary_range: career?.salary_range || '',
    women: JSON.stringify(career?.women || [], null, 2),
  });

  const handleSave = async () => {
    setSaving(true);
    
    let women;
    try {
      women = JSON.parse(formData.women);
    } catch {
      toast.error('JSON de mulheres inválido');
      setSaving(false);
      return;
    }

    const payload = {
      ...formData,
      women,
    };

    let error;
    if (career) {
      const result = await supabase.from('career_areas_content').update(payload).eq('id', career.id);
      error = result.error;
    } else {
      const result = await supabase.from('career_areas_content').insert(payload);
      error = result.error;
    }

    setSaving(false);
    
    if (error) {
      toast.error('Erro ao salvar carreira');
      console.error(error);
      return;
    }
    
    toast.success(career ? 'Carreira atualizada!' : 'Carreira criada!');
    setOpen(false);
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {career ? (
          <Button variant="ghost" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Carreira
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{career ? 'Editar Carreira' : 'Nova Carreira'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Área STEM</label>
              <Select value={formData.stem_area} onValueChange={v => setFormData(p => ({ ...p, stem_area: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STEM_AREAS.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">ID da Carreira</label>
              <Input value={formData.career_id} onChange={e => setFormData(p => ({ ...p, career_id: e.target.value }))} placeholder="carreira-id" />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Nome da Carreira</label>
            <Input value={formData.career_name} onChange={e => setFormData(p => ({ ...p, career_name: e.target.value }))} />
          </div>
          
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Textarea value={formData.career_description} onChange={e => setFormData(p => ({ ...p, career_description: e.target.value }))} rows={3} />
          </div>

          <div>
            <label className="text-sm font-medium">Faixa Salarial</label>
            <Input value={formData.salary_range} onChange={e => setFormData(p => ({ ...p, salary_range: e.target.value }))} placeholder="R$ 5.000 - R$ 15.000" />
          </div>

          <div>
            <label className="text-sm font-medium">Mulheres Inspiradoras (JSON)</label>
            <Textarea value={formData.women} onChange={e => setFormData(p => ({ ...p, women: e.target.value }))} rows={10} className="font-mono text-xs" placeholder='[{"name": "Nome", "story": "História inspiradora..."}]' />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
