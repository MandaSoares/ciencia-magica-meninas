import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Experiment {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  time: string;
  materials: string[];
  steps: string[];
  icon: string;
  color: string;
  image: string;
  stepImages: string[];
}

// Map area keys to database stem_area values
const areaToStemArea: Record<string, string> = {
  science: "Ciência",
  technology: "Tecnologia",
  engineering: "Engenharia",
  math: "Matemática",
};

export const getAreaName = (area: string): string => {
  const names: Record<string, string> = {
    science: "Ciências",
    technology: "Tecnologia",
    engineering: "Engenharia",
    math: "Matemática"
  };
  return names[area] || "Ciências";
};

export const useExperimentsContent = (selectedArea: string) => {
  const stemArea = areaToStemArea[selectedArea] || "Ciência";

  return useQuery({
    queryKey: ["experiments-content", stemArea],
    queryFn: async (): Promise<Experiment[]> => {
      const { data, error } = await supabase
        .from("experiments_content")
        .select("*")
        .eq("stem_area", stemArea)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching experiments content:", error);
        throw error;
      }

      return (data || []).map((item) => ({
        id: item.experiment_id,
        title: item.title,
        description: item.description,
        difficulty: item.difficulty || "Fácil",
        time: item.time || "15 min",
        materials: item.materials || [],
        steps: item.steps || [],
        icon: item.icon || "Beaker",
        color: item.color || "bg-purple-500",
        image: item.image || "🧪",
        stepImages: item.step_images || [],
      }));
    },
  });
};
