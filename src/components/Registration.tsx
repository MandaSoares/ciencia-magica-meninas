import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { AuthShell, AuthTitle, FormError, inputClass, primaryButtonClass } from "./auth/AuthShell";
import { PasswordField, isStrongPassword } from "./auth/PasswordField";
import { VerifyCode } from "./auth/VerifyCode";
import { formatCountdown, rateLimitSeconds, useCooldown } from "./auth/cooldown";

interface RegistrationProps {
  onComplete: () => void;
  onBack: () => void;
  onGoToLogin: () => void;
  onForgotPassword?: () => void;
}

type Step = "age" | "name" | "account" | "consent" | "checkEmail";
const STEPS: Step[] = ["age", "name", "account", "consent"];

const AGES = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const ADULT = 18;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Cadastro em etapas (estilo Duolingo): idade → nome → email/senha → autorização.
 * A idade vem primeiro porque define se precisamos do consentimento de
 * um responsável (LGPD art. 14: menores de 12 anos).
 */
export const Registration = ({ onComplete, onBack, onGoToLogin, onForgotPassword }: RegistrationProps) => {
  const { signUp, verifyEmailCode, resendConfirmation } = useAuth();
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const { remaining: cooldown, start: startCooldown } = useCooldown("signup");
  const [step, setStep] = useState<Step>("age");
  const [age, setAge] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [guardianConsent, setGuardianConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false });

  const isChild = age !== null && age < 12;
  const isMinor = age !== null && age < 18;
  const stepIndex = STEPS.indexOf(step as (typeof STEPS)[number]);

  const trimmedName = name.trim();
  const nameValid = trimmedName.length >= 2 && trimmedName.length <= 40;
  const emailValid = EMAIL_RE.test(email.trim());
  const passwordValid = isStrongPassword(password);
  const consentValid = acceptedTerms && (!isChild || guardianConsent);

  const goBack = () => {
    setError(null);
    if (stepIndex <= 0) return onBack();
    setStep(STEPS[stepIndex - 1]);
  };

  const next = () => {
    setError(null);
    setStep(STEPS[stepIndex + 1]);
  };

  const handleCreate = async () => {
    if (!consentValid || age === null) return;
    setLoading(true);
    setError(null);
    const result = await signUp(email, password, trimmedName, age, {
      terms: acceptedTerms,
      guardian: guardianConsent,
    });
    setLoading(false);

    if (result.error) {
      const wait = rateLimitSeconds(result.error as { message?: string; status?: number; code?: string });
      if (wait) {
        startCooldown(wait);
        setError("Muitos cadastros seguidos. Aguarde a contagem no botão e tente de novo.");
        return;
      }
      setError(result.message ?? "Não foi possível criar a conta.");
      setAlreadyRegistered(!!result.alreadyRegistered);
      // Problema de email/senha: volta para a etapa onde dá para corrigir
      if (result.alreadyRegistered || /email|senha/i.test(result.message ?? "")) setStep("account");
      return;
    }
    if (result.needsConfirmation) {
      setStep("checkEmail");
    } else {
      onComplete();
    }
  };

  if (step === "checkEmail") {
    return (
      <VerifyCode
        email={email.trim().toLowerCase()}
        title="Confirme seu email"
        submitLabel="Confirmar e entrar"
        onVerify={(code) => verifyEmailCode(email, code)}
        onResend={() => resendConfirmation(email)}
        onBack={() => setStep("account")}
        footer={
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Digitou o email errado?{" "}
            <button type="button" onClick={() => setStep("account")} className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
              Corrigir
            </button>
          </p>
        }
      />
    );
  }

  return (
    <AuthShell
      onBack={goBack}
      progress={(stepIndex + 1) / STEPS.length}
      footer={
        stepIndex === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Já tem conta?{" "}
            <button type="button" onClick={onGoToLogin} className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
              Entrar
            </button>
          </p>
        ) : null
      }
    >
      {/* 1. Idade */}
      {step === "age" && (
        <div key="age" className="flex-1 flex flex-col">
          <AuthTitle title="Quantos anos você tem?" subtitle="Assim mostramos o conteúdo certo para você." />
          <div className="grid grid-cols-4 gap-3 animate-slide-up stagger-1" role="radiogroup" aria-label="Sua idade">
            {AGES.map((a) => (
              <button
                key={a}
                type="button"
                role="radio"
                aria-checked={age === a}
                onClick={() => setAge(a)}
                className={cn(
                  "h-14 rounded-2xl border-2 text-lg font-bold transition-all",
                  age === a
                    ? "border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200 scale-[1.03]"
                    : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                )}
              >
                {a}
              </button>
            ))}
            <button
              type="button"
              role="radio"
              aria-checked={age === ADULT}
              onClick={() => setAge(ADULT)}
              className={cn(
                "col-span-4 h-14 rounded-2xl border-2 font-bold transition-all",
                age === ADULT
                  ? "border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200"
                  : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              )}
            >
              18 anos ou mais
            </button>
          </div>
          <div className="mt-auto pt-8">
            <Button type="button" className={primaryButtonClass} disabled={age === null} onClick={next}>
              Continuar
            </Button>
          </div>
        </div>
      )}

      {/* 2. Nome */}
      {step === "name" && (
        <form
          key="name"
          className="flex-1 flex flex-col"
          onSubmit={(e) => { e.preventDefault(); if (nameValid) next(); }}
        >
          <AuthTitle title="Como quer ser chamada?" subtitle="Esse nome aparece no seu perfil e nos comentários." />
          <div className="space-y-2 animate-slide-up stagger-1">
            <Label htmlFor="reg-name" className="font-semibold">Nome ou apelido</Label>
            <Input
              id="reg-name"
              autoComplete="nickname"
              placeholder="Ex.: Ana, Cientista Bia"
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              autoFocus
            />
            <div className="flex items-start gap-2 rounded-2xl bg-purple-50 dark:bg-purple-900/20 px-4 py-3 text-sm text-purple-800 dark:text-purple-200">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
              Use só o primeiro nome ou um apelido. Não coloque sobrenome, escola ou cidade.
            </div>
          </div>
          <div className="mt-auto pt-8">
            <Button type="submit" className={primaryButtonClass} disabled={!nameValid}>Continuar</Button>
          </div>
        </form>
      )}

      {/* 3. Email e senha */}
      {step === "account" && (
        <form
          key="account"
          className="flex-1 flex flex-col"
          onSubmit={(e) => { e.preventDefault(); if (emailValid && passwordValid) next(); }}
          noValidate
        >
          <AuthTitle
            title="Crie seu acesso"
            subtitle={isChild ? "Se preferir, use o email da sua mãe, pai ou responsável." : "Você vai usar isso para entrar."}
          />
          <div className="space-y-5 animate-slide-up stagger-1">
            <div className="space-y-2">
              <Label htmlFor="reg-email" className="font-semibold">Email</Label>
              <Input
                id="reg-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); setAlreadyRegistered(false); }}
                onBlur={() => setTouched({ email: true })}
                className={cn(inputClass, touched.email && email && !emailValid && "border-red-300 focus-visible:border-red-400")}
                aria-invalid={touched.email && !!email && !emailValid}
                autoFocus
              />
              {touched.email && email && !emailValid && (
                <p className="text-sm text-red-600 dark:text-red-400">Confira o email: parece que falta alguma parte.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password" className="font-semibold">Senha</Label>
              <PasswordField
                id="reg-password"
                autoComplete="new-password"
                placeholder="Crie uma senha"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                showRules
              />
            </div>

            {error && (
              <FormError>
                {error}
                {alreadyRegistered && (
                  <span className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <button type="button" onClick={onGoToLogin} className="font-bold underline">Entrar</button>
                    {onForgotPassword && (
                      <button type="button" onClick={onForgotPassword} className="font-bold underline">Esqueci minha senha</button>
                    )}
                  </span>
                )}
              </FormError>
            )}
          </div>
          <div className="mt-auto pt-8">
            <Button type="submit" className={primaryButtonClass} disabled={!emailValid || !passwordValid}>
              Continuar
            </Button>
          </div>
        </form>
      )}

      {/* 4. Consentimentos */}
      {step === "consent" && (
        <div key="consent" className="flex-1 flex flex-col">
          <AuthTitle
            title={isChild ? "Chame um adulto" : "Quase lá!"}
            subtitle={
              isChild
                ? "Como você tem menos de 12 anos, sua mãe, pai ou responsável precisa ler e autorizar."
                : "Leia e confirme para criar sua conta."
            }
          />

          <div className="space-y-3 animate-slide-up stagger-1">
            <ConsentItem checked={acceptedTerms} onChange={setAcceptedTerms} disabled={loading}>
              Li e aceito os{" "}
              <a href="/termos" target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-600 dark:text-purple-400 underline">
                Termos de Uso
              </a>{" "}
              e a{" "}
              <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-600 dark:text-purple-400 underline">
                Política de Privacidade
              </a>
              .
            </ConsentItem>

            {isMinor && (
              <ConsentItem checked={guardianConsent} onChange={setGuardianConsent} disabled={loading}>
                {isChild ? (
                  <>
                    <strong>Sou mãe, pai ou responsável</strong> desta criança, li a Política de Privacidade e autorizo o cadastro.
                  </>
                ) : (
                  <>Minha mãe, pai ou responsável sabe que estou criando esta conta.</>
                )}
              </ConsentItem>
            )}

            {error && <FormError>{error}</FormError>}
          </div>

          <div className="mt-auto pt-8">
            <Button type="button" className={primaryButtonClass} disabled={!consentValid || loading || cooldown > 0} onClick={handleCreate}>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : cooldown > 0 ? (
                `Tente de novo em ${formatCountdown(cooldown)}`
              ) : (
                "Criar minha conta"
              )}
            </Button>
          </div>
        </div>
      )}
    </AuthShell>
  );
};

const ConsentItem = ({
  checked,
  onChange,
  disabled,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <label
    className={cn(
      "flex items-start gap-3 rounded-2xl border-2 p-4 cursor-pointer transition-colors",
      checked
        ? "border-purple-400 bg-purple-50 dark:bg-purple-900/30"
        : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
    )}
  >
    <Checkbox
      checked={checked}
      onCheckedChange={(v) => onChange(v === true)}
      disabled={disabled}
      className="mt-0.5 h-5 w-5 rounded-md"
    />
    <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{children}</span>
  </label>
);
