import { useCallback, useEffect, useState } from "react";

type AuthErrorLike = { message?: string; status?: number; code?: string } | null | undefined;

/**
 * Quantos segundos esperar depois de um erro de limite do Supabase.
 * - "For security purposes, you can only request this after 42 seconds" → 42
 * - limite de emails por hora (SMTP padrão do Supabase) → 10 min
 * - limite de requisições → 60 s
 * Retorna null se não for erro de limite.
 */
export const rateLimitSeconds = (error: AuthErrorLike): number | null => {
  if (!error) return null;
  const msg = (error.message || "").toLowerCase();
  const code = error.code || "";

  const after = msg.match(/after (\d+) seconds?/);
  if (after) return Math.max(5, Number(after[1]));
  if (code === "over_email_send_rate_limit" || msg.includes("email rate limit")) return 10 * 60;
  if (code === "over_request_rate_limit" || msg.includes("rate limit") || error.status === 429) return 60;
  return null;
};

export const formatCountdown = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
};

const storageKey = (key: string) => `conscientistas-cooldown:${key}`;

const readUntil = (key: string): number => {
  try {
    return Number(localStorage.getItem(storageKey(key)) || 0);
  } catch {
    return 0;
  }
};

/**
 * Contagem regressiva para reenviar emails. Fica salva no navegador, então
 * recarregar a página não "zera" a espera (o limite do servidor continua valendo).
 */
export const useCooldown = (key: string) => {
  const [until, setUntil] = useState<number>(() => readUntil(key));
  const [now, setNow] = useState(() => Date.now());

  const remaining = Math.max(0, Math.ceil((until - now) / 1000));

  useEffect(() => {
    if (remaining <= 0) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [remaining]);

  const start = useCallback(
    (seconds: number) => {
      const next = Date.now() + seconds * 1000;
      setUntil((prev) => Math.max(prev, next));
      setNow(Date.now());
      try {
        localStorage.setItem(storageKey(key), String(next));
      } catch {
        /* sem storage: a contagem vale só nesta tela */
      }
    },
    [key]
  );

  return { remaining, start };
};
