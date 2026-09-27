import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

interface BrandProps {
  size?: number;
  className?: string;
  textClassName?: string;
  /** Esconde o nome em telas pequenas */
  compact?: boolean;
}

/** Logo + nome "Conscientistas" no estilo da marca */
export const Brand = ({ size = 40, className, textClassName, compact }: BrandProps) => (
  <span className={cn("inline-flex items-center gap-2.5", className)}>
    <Logo size={size} className="shrink-0 drop-shadow-sm" />
    <span
      className={cn(
        "font-display font-bold tracking-tight leading-none bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent",
        compact && "hidden sm:inline",
        textClassName ?? "text-xl"
      )}
    >
      Conscientistas
    </span>
  </span>
);
