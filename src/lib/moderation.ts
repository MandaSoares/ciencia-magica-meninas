/**
 * Filtro de comentários (feedback imediato na interface).
 * A regra que VALE é a do banco (trigger validate_comment_content). Esta
 * cópia só evita a viagem ao servidor e deve ficar em sincronia com ela.
 *
 * Correspondência por PALAVRA INTEIRA: a versão anterior usava includes()
 * e bloqueava "circuito", "cálculo", "curiosidade", "Paulo", "computador".
 */

const BLOCKED_WORDS = [
  "merda", "bosta", "caralho", "krl", "porra", "foder", "foda", "fodase", "fodasse", "fdp", "pqp", "vsf", "vtnc", "tnc",
  "cacete", "buceta", "bucetinha", "piroca", "cu", "cuzao", "arrombado", "arrombada",
  "crioulo", "crioula",
  "vadia", "vagabunda", "vagabundo", "puta", "putinha", "prostituta",
  "viado", "bicha", "sapatao", "boiola",
  "retardado", "retardada", "imbecil", "idiota", "nojento", "nojenta",
  "otario", "otaria", "desgracado", "desgracada",
  "transar", "punheta", "masturbacao", "porno", "pornografia",
  "piriquita", "xoxota", "tesao",
];

const CONTACT_WORDS = [
  "whatsapp", "whats", "wpp", "zap", "zapzap", "telegram", "discord", "instagram", "insta", "tiktok",
  "snapchat", "facebook", "kwai", "twitter",
];

const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "9": "g", "@": "a", $: "s" };

export const normalizeForFilter = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[0134579@$]/g, (c) => LEET[c] ?? c)
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/([a-z])\1+/g, "$1");

const wordsRegex = (words: string[]) =>
  new RegExp(`(^|\\s)(${words.map(normalizeForFilter).join("|")})(?=\\s|$)`);

const BLOCKED_RE = wordsRegex(BLOCKED_WORDS);
const CONTACT_RE = wordsRegex(CONTACT_WORDS);

const CONTACT_PATTERNS = [
  /(https?:\/\/|www\.|[a-z0-9-]+\.(com|net|org|br|io|gg|me|ly)\b)/i,
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,
  /(^|\s)@[a-z0-9._]{3,}/i,
  /\b9\d{4}[\s.-]\d{4}\b/,
  /\b\d{10,13}\b/,
  /\(\d{2}\)\s*\d{4,5}[\s.-]?\d{4}\b/,
  /\b\d{2}\s\d{4,5}[\s.-]?\d{4}\b/,
];

export const MAX_COMMENT_LENGTH = 1000;

export type CommentCheck = { ok: boolean; message?: string };

export const MESSAGES = {
  inappropriate: "Seu comentário tem palavras que não são permitidas aqui. Revise e tente de novo 💜",
  contact:
    "Por segurança, não é permitido compartilhar links, email, telefone ou redes sociais nos comentários.",
  tooLong: `O comentário pode ter no máximo ${MAX_COMMENT_LENGTH} caracteres.`,
  empty: "Escreva algo antes de enviar.",
  generic: "Não foi possível publicar o comentário. Tente novamente.",
};

export const checkComment = (text: string): CommentCheck => {
  if (!text.trim()) return { ok: false, message: MESSAGES.empty };
  if (text.length > MAX_COMMENT_LENGTH) return { ok: false, message: MESSAGES.tooLong };
  const normalized = normalizeForFilter(text);
  if (BLOCKED_RE.test(normalized)) return { ok: false, message: MESSAGES.inappropriate };
  if (CONTACT_RE.test(normalized) || CONTACT_PATTERNS.some((re) => re.test(text))) {
    return { ok: false, message: MESSAGES.contact };
  }
  return { ok: true };
};

/** Traduz o erro do banco (trigger) para uma mensagem amigável. */
export const commentErrorMessage = (error: { message?: string } | null | undefined): string => {
  const msg = error?.message ?? "";
  if (msg.includes("conteudo_inapropriado")) return MESSAGES.inappropriate;
  if (msg.includes("dados_de_contato")) return MESSAGES.contact;
  if (msg.includes("comentario_longo") || msg.includes("comment_content_length")) return MESSAGES.tooLong;
  if (msg.includes("comentario_vazio")) return MESSAGES.empty;
  return MESSAGES.generic;
};
