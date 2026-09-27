import { useEffect, useRef, useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AuthResult } from "@/hooks/useAuth";
import { AuthShell, AuthTitle, FormError, inputClass, primaryButtonClass } from "./AuthShell";

const RESEND_COOLDOWN = 60;

interface VerifyCodeProps {
  email: string;
  title: string;
  subtitle?: React.ReactNode;
  submitLabel?: string;
  onVerify: (code: string) => Promise<AuthResult>;
  onResend: () => Promise<AuthResult>;
  onBack?: () => void;
  /** true se o email acabou de ser enviado (inicia a contagem para reenviar) */
  justSent?: boolean;
  footer?: React.ReactNode;
}

/**
 * Tela de código enviado por email (confirmação de conta ou recuperação de senha).
 * O código evita os problemas do link: aberto em outro aparelho, expirado por
 * antivírus que "clica" antes, ou URL de redirecionamento mal configurada.
 */
export const VerifyCode = ({
  email,
  title,
  subtitle,
  submitLabel = "Confirmar",
  onVerify,
  onResend,
  onBack,
  justSent = true,
  footer,
}: VerifyCodeProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(justSent ? RESEND_COOLDOWN : 0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const digits = code.replace(/\D/g, "");
  const canSubmit = digits.length >= 6 && !loading;

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    const result = await onVerify(digits);
    setLoading(false);
    if (result.error) {
      setError(result.message ?? "Código incorreto.");
      setCode("");
      inputRef.current?.focus();
    }
  };

  const resend = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    setError(null);
    setInfo(null);
    const result = await onResend();
    setLoading(false);
    if (result.error) {
      setError(result.message ?? "Não foi possível reenviar.");
      return;
    }
    setInfo("Enviamos um novo código.");
    setCooldown(RESEND_COOLDOWN);
  };

  return (
    <AuthShell onBack={onBack} footer={footer}>
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-5 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 animate-slide-up">
        <MailCheck className="w-8 h-8 text-white" />
      </div>
      <AuthTitle
        title={title}
        subtitle={
          subtitle ?? (
            <>
              Enviamos um email para <strong className="text-gray-800 dark:text-gray-200">{email}</strong>. Clique no link do email ou digite aqui o código de 6 dígitos. Olhe também no spam.
            </>
          )
        }
      />

      <form onSubmit={submit} className="flex-1 flex flex-col" noValidate>
        <div className="space-y-2 animate-slide-up stagger-1">
          <Label htmlFor="otp-code" className="font-semibold">Código</Label>
          <Input
            ref={inputRef}
            id="otp-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={10}
            placeholder="––––––"
            value={code}
            onChange={(e) => {
              setError(null);
              setCode(e.target.value.replace(/\D/g, "").slice(0, 10));
            }}
            className={cn(inputClass, "text-center text-2xl font-bold tracking-[0.5em] placeholder:tracking-[0.5em]")}
            disabled={loading}
            autoFocus
          />
          {error && <div className="pt-2"><FormError>{error}</FormError></div>}
          {info && !error && (
            <p className="pt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">{info}</p>
          )}
        </div>

        <div className="mt-auto pt-8 space-y-3">
          <Button type="submit" className={primaryButtonClass} disabled={!canSubmit}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : submitLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={resend}
            disabled={cooldown > 0 || loading}
            className="w-full h-12 rounded-2xl font-semibold"
          >
            {cooldown > 0 ? `Reenviar código em ${cooldown}s` : "Reenviar código"}
          </Button>
        </div>
      </form>
    </AuthShell>
  );
};
