interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 40, className = "" }: LogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoBg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        <linearGradient id="atomRing" x1="20" y1="30" x2="100" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fce7f3" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="sparkle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>

      <rect width="120" height="120" rx="28" fill="url(#logoBg)" />

      {/* Atom orbits */}
      <ellipse cx="60" cy="60" rx="32" ry="14" stroke="url(#atomRing)" strokeWidth="2.5" fill="none" transform="rotate(-30 60 60)" />
      <ellipse cx="60" cy="60" rx="32" ry="14" stroke="url(#atomRing)" strokeWidth="2.5" fill="none" transform="rotate(30 60 60)" />
      <ellipse cx="60" cy="60" rx="32" ry="14" stroke="url(#atomRing)" strokeWidth="2.5" fill="none" transform="rotate(90 60 60)" />

      {/* Center nucleus */}
      <circle cx="60" cy="60" r="8" fill="white" />
      <circle cx="60" cy="60" r="5" fill="#e879f9" opacity="0.7" />

      {/* Orbiting electrons */}
      <circle cx="88" cy="48" r="4" fill="white" />
      <circle cx="32" cy="72" r="4" fill="white" />
      <circle cx="60" cy="28" r="4" fill="white" />

      {/* Sparkle decorations */}
      <path d="M95 22L97 28L103 30L97 32L95 38L93 32L87 30L93 28Z" fill="url(#sparkle)" />
      <path d="M25 85L26.5 89L30.5 90.5L26.5 92L25 96L23.5 92L19.5 90.5L23.5 89Z" fill="url(#sparkle)" opacity="0.8" />
    </svg>
  );
};
