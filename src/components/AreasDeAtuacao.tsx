import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Star, Award, Briefcase, Loader2, Trash2, Edit2, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCareerAreasContent, Career, WomanProfile, getAreaLabel } from "@/hooks/useCareerAreasContent";
import { AddCareerInline } from "./admin/AddCareerInline";
import { EditCareerInline } from "./admin/EditCareerInline";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
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

interface AreasDeAtuacaoProps {
  onPointsEarned: (points: number) => void;
  selectedArea?: string;
}

// Map area keys to area data
const areaMetadata: Record<string, { name: string; icon: string; color: string; gradient: string; light: string; description: string }> = {
  science: {
    name: "Ciencias",
    icon: "🔬",
    color: "bg-green-500",
    gradient: "from-emerald-500 to-teal-500",
    light: "from-emerald-50 to-teal-50",
    description: "Explore o mundo atraves da pesquisa e descoberta"
  },
  technology: {
    name: "Tecnologia",
    icon: "💻",
    color: "bg-blue-500",
    gradient: "from-blue-500 to-indigo-500",
    light: "from-blue-50 to-indigo-50",
    description: "Crie o futuro com código e inovação"
  },
  engineering: {
    name: "Engenharia",
    icon: "⚙️",
    color: "bg-orange-500",
    gradient: "from-orange-500 to-amber-500",
    light: "from-orange-50 to-amber-50",
    description: "Construa solucoes para problemas do mundo real"
  },
  math: {
    name: "Matematica",
    icon: "📐",
    color: "bg-purple-500",
    gradient: "from-purple-500 to-violet-500",
    light: "from-purple-50 to-violet-50",
    description: "A linguagem universal do universo"
  }
};

export const AreasDeAtuacao = ({ onPointsEarned, selectedArea = "science" }: AreasDeAtuacaoProps) => {
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedWoman, setSelectedWoman] = useState<WomanProfile | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);

  const { isAdmin, isModerator } = useAdminCheck();
  const queryClient = useQueryClient();

  // Fetch from database
  const { data: careers, isLoading } = useCareerAreasContent(selectedArea);
  const currentAreaMeta = areaMetadata[selectedArea] || areaMetadata.science;

  const handleContentChange = () => {
    queryClient.invalidateQueries({ queryKey: ["career-areas-content"] });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from('career_areas_content').delete().eq('id', deleteId);
      if (error) throw error;
      toast({ title: "Carreira deletada com sucesso!" });
      handleContentChange();
    } catch (error: any) {
      toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  const handleSelectCareer = (career: Career) => {
    setSelectedCareer(career);
    setSelectedWoman(null);
    onPointsEarned(15);
  };

  const handleSelectWoman = (woman: WomanProfile) => {
    setSelectedWoman(woman);
    onPointsEarned(20);
  };

  const goBack = () => {
    if (selectedWoman) {
      setSelectedWoman(null);
    } else if (selectedCareer) {
      setSelectedCareer(null);
    }
  };

  if (selectedWoman) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={goBack} className="mb-2 animate-slide-up">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar para {selectedCareer?.name}
        </Button>

        <Card className="overflow-hidden animate-pop-in">
          <div className={`h-52 bg-gradient-to-br ${currentAreaMeta.gradient} flex items-center justify-center relative`}>
            <div className="absolute inset-0 bg-black/10" />
            <img
              src={selectedWoman.image}
              alt={selectedWoman.name}
              className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-2xl relative z-10 animate-pop-in"
            />
          </div>
          <div className="p-6 -mt-4 relative">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${currentAreaMeta.gradient} text-white`}>
                {selectedCareer?.name}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{selectedWoman.name}</h2>
            <div className={`flex items-start gap-3 mb-5 p-4 bg-gradient-to-r ${currentAreaMeta.light} rounded-2xl border border-gray-100`}>
              <Award className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 font-semibold text-sm">{selectedWoman.achievement}</p>
            </div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Historia Completa
            </h3>
            <p className="text-gray-600 leading-relaxed">{selectedWoman.story}</p>
          </div>
        </Card>

        <div className={`bg-gradient-to-r ${currentAreaMeta.gradient} rounded-2xl p-5 text-white text-center animate-slide-up`}>
          <Sparkles className="w-6 h-6 mx-auto mb-2 animate-float" />
          <p className="font-semibold">
            Você pode ser a próxima grande inspiração em {selectedCareer?.name}!
          </p>
        </div>
      </div>
    );
  }

  if (selectedCareer) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={goBack} className="mb-2 animate-slide-up">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar para {currentAreaMeta.name}
        </Button>

        <div className={`bg-gradient-to-r ${currentAreaMeta.gradient} rounded-2xl p-6 text-white animate-slide-up`}>
          <h2 className="text-2xl font-bold mb-1">{selectedCareer.name}</h2>
          <p className="opacity-90 text-sm">{selectedCareer.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-800">{getAreaLabel(selectedArea)} Inspiradoras</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {selectedCareer.women.map((woman, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] group animate-pop-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleSelectWoman(woman)}
            >
              <div className="h-36 overflow-hidden relative">
                <img
                  src={woman.image}
                  alt={woman.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-800 mb-1">{woman.name}</h4>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{woman.achievement}</p>
                <Button className={`w-full bg-gradient-to-r ${currentAreaMeta.gradient} hover:opacity-90 rounded-xl`}>
                  Ler Historia
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`bg-gradient-to-r ${currentAreaMeta.gradient} text-white p-6 rounded-2xl animate-slide-up shadow-lg`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm animate-float">
            {currentAreaMeta.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Areas de Atuacao em {currentAreaMeta.name}</h2>
            <p className="opacity-90 text-sm">{currentAreaMeta.description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-bold text-gray-800">Carreiras em {currentAreaMeta.name}</h3>
      </div>

      {(!careers || careers.length === 0) ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Nenhuma carreira cadastrada para esta área ainda.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {careers.map((career, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] relative group animate-pop-in"
              style={{ animationDelay: `${index * 0.08}s` }}
              onClick={() => handleSelectCareer(career)}
            >
              <div className={`h-1.5 bg-gradient-to-r ${currentAreaMeta.gradient}`} />
              <div className="p-5">
                {(isAdmin || isModerator) && career.dbId && (
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCareer(career);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(career.dbId);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 bg-gradient-to-br ${currentAreaMeta.gradient} rounded-xl flex items-center justify-center shadow-sm`}>
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800">{career.name}</h4>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{career.description}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full">
                    <Users className="w-3.5 h-3.5" />
                    {career.women.length} inspiracoes
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentAreaMeta.light} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {/* Card para adicionar nova carreira - admin ou moderador */}
          <AddCareerInline
            selectedArea={selectedArea}
            onContentChange={handleContentChange}
            isAdmin={isAdmin}
            isModerator={isModerator}
            iconClassName={currentAreaMeta.color}
          />
        </div>
      )}

      {/* Modal de edição de carreira */}
      {editingCareer && (
        <EditCareerInline
          career={editingCareer}
          onClose={() => setEditingCareer(null)}
          onContentChange={handleContentChange}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta carreira? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};