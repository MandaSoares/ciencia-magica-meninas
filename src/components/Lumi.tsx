import { useId } from "react";
import { cn } from "@/lib/utils";

export type LumiMood = "happy" | "cheer" | "sleepy";

interface LumiProps {
  size?: number;
  mood?: LumiMood;
  className?: string;
  animated?: boolean;
}

/** Lumi, a mascote do Conscientistas: um frasco de laboratório com laço. */
export const Lumi = ({ size = 120, mood = "happy", className, animated = true }: LumiProps) => {
  const id = useId().replace(/:/g, "");
  const liq = `lumi-liq-${id}`;
  const glass = `lumi-glass-${id}`;
  const body = `lumi-body-${id}`;
  const flask = "M47 30 V52 L20 100 a12 12 0 0 0 10.5 18 h59 a12 12 0 0 0 10.5 -18 L73 52 V30Z";
  const ink = "#3b0764";

  return (
    <svg
      width={size}
      height={(size * 130) / 120}
      viewBox="0 0 120 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(animated && "animate-bob", className)}
      role="img"
      aria-label="Lumi, a mascote"
    >
      <defs>
        <linearGradient id={liq} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8cc6" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
        <linearGradient id={glass} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#fdf2f8" />
        </linearGradient>
        <clipPath id={body}>
          <path d={flask} />
        </clipPath>
      </defs>

      <ellipse cx="60" cy="125" rx="34" ry="4" fill="#000" opacity=".08" />
      <path d={flask} fill={`url(#${glass})`} />
      <g clipPath={`url(#${body})`}>
        <path d="M0 76 Q30 68 60 76 T120 76 V130 H0Z" fill={`url(#${liq})`} />
        <circle cx="38" cy="106" r="3" fill="#fff" opacity=".55" />
        <circle cx="85" cy="100" r="2.2" fill="#fff" opacity=".55" />
        <path d="M46 58 l-4 9" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".9" />
      </g>
      <path d={flask} stroke="#9d174d" strokeWidth="3.5" strokeLinejoin="round" />
      <rect x="42" y="24" width="36" height="9" rx="4.5" fill="#fff" stroke="#9d174d" strokeWidth="3.5" />

      {/* Rosto */}
      {mood === "happy" && (
        <>
          <ellipse cx="50" cy="88" rx="4.2" ry="5.2" fill={ink} />
          <ellipse cx="70" cy="88" rx="4.2" ry="5.2" fill={ink} />
          <circle cx="51.5" cy="86" r="1.6" fill="#fff" />
          <circle cx="71.5" cy="86" r="1.6" fill="#fff" />
          <path d="M55 97 q5 5 10 0" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
        </>
      )}
      {mood === "cheer" && (
        <>
          <path d="M45.5 89 q4.5 -6 9 0 M65.5 89 q4.5 -6 9 0" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M53 95 h14 q0 8 -7 8 q-7 0 -7 -8Z" fill={ink} />
          <path d="M56.5 100.5 q3.5 2.5 7 0" stroke="#fb7185" strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}
      {mood === "sleepy" && (
        <>
          <path d="M45.5 88 q4.5 4 9 0 M65.5 88 q4.5 4 9 0" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <circle cx="60" cy="98" r="2.6" fill={ink} />
        </>
      )}
      <ellipse cx="42" cy="97" rx="4.5" ry="2.8" fill="#fb7185" opacity=".7" />
      <ellipse cx="78" cy="97" rx="4.5" ry="2.8" fill="#fb7185" opacity=".7" />

      {/* Laço */}
      <g transform="rotate(-18 44 26)">
        <path d="M44 26 L30 17 Q26 26 30 35Z M44 26 L58 17 Q62 26 58 35Z" fill="#f472b6" stroke="#9d174d" strokeWidth="2.6" strokeLinejoin="round" />
        <circle cx="44" cy="26" r="4.2" fill="#ec4899" stroke="#9d174d" strokeWidth="2.6" />
      </g>

      {/* Bolhas e brilho */}
      {mood === "sleepy" ? (
        <text x="80" y="22" fontSize="16" fontWeight="700" fill="#a855f7" fontFamily="system-ui">z</text>
      ) : (
        <>
          <circle cx="68" cy="13" r="4" stroke="#f472b6" strokeWidth="2.5" />
          <circle cx="78" cy="4.5" r="2.6" stroke="#c084fc" strokeWidth="2.2" />
        </>
      )}
      <path
        d="M96 30 c1 5 2.5 6.5 7.5 7.5 c-5 1 -6.5 2.5 -7.5 7.5 c-1 -5 -2.5 -6.5 -7.5 -7.5 c5 -1 6.5 -2.5 7.5 -7.5Z"
        fill="#fbbf24"
      />
    </svg>
  );
};
