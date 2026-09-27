import { useId } from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Marca Conscientistas: um "C" com anel de órbita (ciência/espaço),
 * brilho no centro (ideia/descoberta) e um elétron.
 */
export const Logo = ({ size = 40, className = "" }: LogoProps) => {
  const id = useId().replace(/:/g, "");
  const bg = `lg-bg-${id}`;
  const st = `lg-st-${id}`;
  const front = `lg-fr-${id}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Conscientistas"
    >
      <defs>
        <linearGradient id={bg} x1="10" y1="0" x2="110" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ff8cc6" />
          <stop offset=".5" stopColor="#ec4899" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id={st} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff9d6" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
        <clipPath id={front}>
          <rect x="0" y="60" width="120" height="60" />
        </clipPath>
      </defs>
      <rect width="120" height="120" rx="32" fill={`url(#${bg})`} />
      <ellipse cx="60" cy="60" rx="46" ry="16" stroke="#fff" strokeOpacity=".5" strokeWidth="4" transform="rotate(-24 60 60)" />
      <path d="M82.6 37.4 A32 32 0 1 0 82.6 82.6" stroke="#fff" strokeWidth="14" strokeLinecap="round" />
      <g transform="rotate(-24 60 60)" clipPath={`url(#${front})`}>
        <ellipse cx="60" cy="60" rx="46" ry="16" stroke="#fff" strokeWidth="4" />
      </g>
      <path
        d="M60 43 C61.7 54.3 65.7 58.3 77 60 C65.7 61.7 61.7 65.7 60 77 C58.3 65.7 54.3 61.7 43 60 C54.3 58.3 58.3 54.3 60 43Z"
        fill={`url(#${st})`}
      />
      <circle cx="102" cy="41.5" r="6.5" fill={`url(#${st})`} stroke="#fff" strokeWidth="3" />
    </svg>
  );
};
