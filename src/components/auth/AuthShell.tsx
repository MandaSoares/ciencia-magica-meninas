import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";

interface AuthShellProps {
  children: ReactNode;
  onBack?: () => void;
  /** 0–1: barra de progresso no topo (cadastro em etapas) */
  progress?: number;
  footer?: ReactNode;
}

/**
 * Layout único das telas de conta (login, cadastro, recuperação).
 * Fica FORA dos componentes de tela: definido dentro deles, o React
 * remontaria o layout a cada tecla e o campo perderia o foco.
 */
export const AuthShell = ({ children, onBack, progress, footer }: AuthShellProps) => (
  <div className="min-h-[100dvh] bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 flex flex-col transition-colors">
    <header className="w-full max-w-md mx-auto px-5 pt-5 flex items-center gap-3 h-16">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-white/70 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      ) : (
        <span className="w-8" />
      )}
      {typeof progress === "number" ? (
        <div
          className="flex-1 h-3 rounded-full bg-purple-100 dark:bg-gray-800 overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${Math.max(6, progress * 100)}%` }}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center gap-2">
          <Logo size={32} />
          <span className="text-base font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Conscientistas
          </span>
        </div>
      )}
      <span className="w-8" />
    </header>

    <main className="flex-1 w-full max-w-md mx-auto px-5 pb-8 pt-4 flex flex-col">{children}</main>

    {footer && <footer className="w-full max-w-md mx-auto px-5 pb-8">{footer}</footer>}
  </div>
);

export const AuthTitle = ({ title, subtitle }: { title: string; subtitle?: ReactNode }) => (
  <div className="mb-6 animate-slide-up">
    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">{title}</h1>
    {subtitle && <p className="mt-2 text-gray-500 dark:text-gray-400">{subtitle}</p>}
  </div>
);

/** Mensagem de erro dentro do formulário (substitui toast em inglês no canto). */
export const FormError = ({ children }: { children: ReactNode }) => (
  <div
    role="alert"
    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
  >
    {children}
  </div>
);

export const primaryButtonClass =
  "w-full h-14 rounded-2xl text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/30 disabled:opacity-50 disabled:shadow-none transition-all";

export const inputClass =
  "h-14 rounded-2xl border-2 border-gray-200 bg-white px-4 text-base focus-visible:ring-0 focus-visible:border-purple-400 dark:border-gray-700 dark:bg-gray-900";
