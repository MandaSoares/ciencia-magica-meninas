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
    math: "Matemáticas"
  };
  return labels[areaId] || "Profissionais";
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
        throw error;
      }

      return (data || []).map((item) => ({
        id: item.career_id,
        name: item.career_name,
        description: item.career_description,
        salaryRange: item.salary_range || undefined,
        icon: item.icon || "Briefcase",
        women: Array.isArray(item.women) ? (item.women as unknown as WomanProfile[]) : [],
      }));
    },
  });
};
