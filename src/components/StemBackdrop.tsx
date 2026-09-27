import { cn } from "@/lib/utils";

/** Fundo rosado com rabiscos de STEM. Colocar como primeiro filho de um container `relative`. */
export const StemBackdrop = ({ className, fixed = true }: { className?: string; fixed?: boolean }) => (
  <div aria-hidden className={cn("pointer-events-none inset-0 -z-10 overflow-hidden", fixed ? "fixed" : "absolute", className)}>
    <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50/60 to-violet-50 dark:from-[#1a0b1f] dark:via-[#140a1a] dark:to-[#120d24]" />
    <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-pink-300/30 blur-3xl dark:bg-pink-600/10" />
    <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-violet-300/25 blur-3xl dark:bg-violet-600/10" />
    <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-3xl dark:bg-fuchsia-700/10" />
    <div className="absolute inset-0 stem-doodles opacity-[0.07] dark:opacity-[0.08]" />
  </div>
);
