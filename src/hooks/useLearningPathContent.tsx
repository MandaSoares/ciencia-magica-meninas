import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LessonStep {
  type: 'video' | 'reading' | 'practice' | 'quiz' | 'inspiration';
  title: string;
  content: string;
  videoUrl?: string;
  correctAnswer?: string;
}

export interface PathLevel {
  id: number;
  dbId?: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  points: number;
  color: string;
  lessons: LessonStep[];
}

// Map area keys to database stem_area values
const areaToStemArea: Record<string, string> = {
  science: "Ciência",
  technology: "Tecnologia",
  engineering: "Engenharia",
  math: "Matemática",
};

export const getAreaName = (area: string): string => {
  return areaToStemArea[area] || "STEM";
};

export const useLearningPathContent = (selectedArea: string) => {
  const stemArea = areaToStemArea[selectedArea] || "Ciência";

  return useQuery({
    queryKey: ["learning-path-content", stemArea],
    queryFn: async (): Promise<PathLevel[]> => {
      const { data, error } = await supabase
        .from("learning_path_content")
        .select("*")
        .eq("stem_area", stemArea)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching learning path content:", error);
        throw error;
      }

      return (data || []).map((item) => ({
        id: item.level_number,
        dbId: item.id,
        title: item.title,
        description: item.description,
        icon: item.icon || "Star",
        difficulty: item.difficulty || "Iniciante",
        points: item.points || 30,
        color: item.color || "bg-purple-500",
        lessons: Array.isArray(item.lessons) ? (item.lessons as unknown as LessonStep[]) : [],
      }));
    },
  });
};
