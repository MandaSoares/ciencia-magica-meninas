import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ModuleLesson {
  type: 'video' | 'reading' | 'practice' | 'quiz' | 'project';
  title: string;
  content: string;
  duration: string;
  videoUrl?: string;
  correctAnswer?: string;
}

export interface FinalProject {
  title: string;
  description: string;
  steps: string[];
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
  finalProject: FinalProject;
}

// Map area keys to category names
const areaToCategory: Record<string, string> = {
  technology: "Tecnologia",
  science: "Ciência",
  engineering: "Engenharia",
  math: "Matemática",
};

export const useModulesContent = (selectedArea: string) => {
  const stemArea = areaToCategory[selectedArea] || "Ciência";

  return useQuery({
    queryKey: ["modules-content", stemArea],
    queryFn: async (): Promise<Module[]> => {
      const { data, error } = await supabase
        .from("modules_content")
        .select("*")
        .eq("stem_area", stemArea)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching modules content:", error);
        throw error;
      }

      return (data || []).map((item) => ({
        id: item.module_id,
        title: item.title,
        description: item.description,
        category: item.category,
        color: item.color || "bg-purple-500",
        icon: item.icon || "BookOpen",
        totalLessons: item.total_lessons || 5,
        estimatedTime: item.estimated_time || "3 horas",
        lessons: Array.isArray(item.lessons) ? (item.lessons as unknown as ModuleLesson[]) : [],
        finalProject: (item.final_project as unknown as FinalProject) || { title: "", description: "", steps: [] },
      }));
    },
  });
};
