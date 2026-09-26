import { forwardRef, useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { inputClass } from "./AuthShell";

export const PASSWORD_RULES = [
  { id: "len", label: "8 caracteres ou mais", test: (p: string) => p.length >= 8 },
  { id: "upper", label: "1 letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower", label: "1 letra minúscula", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "1 número", test: (p: string) => /[0-9]/.test(p) },
];

export const isStrongPassword = (p: string) => PASSWORD_RULES.every((r) => r.test(p));

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  showRules?: boolean;
};

/** Campo de senha com botão de mostrar/ocultar e checklist opcional. */
export const PasswordField = forwardRef<HTMLInputElement, Props>(({ showRules, value, className, ...props }, ref) => {
  const [visible, setVisible] = useState(false);
  const text = String(value ?? "");

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          value={value}
          className={cn(inputClass, "pr-14", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {showRules && (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm" aria-label="Requisitos da senha">
          {PASSWORD_RULES.map((rule) => {
            const ok = rule.test(text);
            return (
              <li
                key={rule.id}
                className={cn(
                  "flex items-center gap-1.5 transition-colors",
                  ok ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"
                )}
              >
                <span
                  className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center border",
                    ok ? "bg-emerald-500 border-emerald-500" : "border-gray-300 dark:border-gray-600"
                  )}
                >
                  {ok && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </span>
                {rule.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});
PasswordField.displayName = "PasswordField";
