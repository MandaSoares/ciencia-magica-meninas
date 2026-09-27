export type AreaKey = "science" | "technology" | "engineering" | "math";

export const AREAS: { key: AreaKey; label: string; emoji: string; stem: string; pill: string; dot: string }[] = [
  { key: "science", label: "Ciências", emoji: "🔬", stem: "Ciência", pill: "from-emerald-500 to-teal-500", dot: "bg-emerald-500" },
  { key: "technology", label: "Tecnologia", emoji: "💻", stem: "Tecnologia", pill: "from-blue-500 to-indigo-500", dot: "bg-blue-500" },
  { key: "engineering", label: "Engenharia", emoji: "⚙️", stem: "Engenharia", pill: "from-orange-500 to-amber-500", dot: "bg-orange-500" },
  { key: "math", label: "Matemática", emoji: "📐", stem: "Matemática", pill: "from-purple-500 to-violet-500", dot: "bg-purple-500" },
];

export const areaByStem = (stem: string) => AREAS.find((a) => a.stem === stem);

/** Remove marcações simples de markdown (**negrito**) para mostrar em cards */
export const plainText = (text?: string | null) => (text || "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
