import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Sparkles, ArrowRight } from "lucide-react";

interface LevelCompleteScreenProps {
  levelTitle: string;
  pointsEarned: number;
  totalCompleted: number;
  totalLevels: number;
  onContinue: () => void;
}

const CONFETTI_COLORS = [
  "#a855f7", "#ec4899", "#f59e0b", "#10b981",
  "#3b82f6", "#f43f5e", "#8b5cf6", "#06b6d4",
];

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  rotation: number;
  duration: number;
}

export const LevelCompleteScreen = ({
  levelTitle,
  pointsEarned,
  totalCompleted,
  totalLevels,
  onContinue,
}: LevelCompleteScreenProps) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const pieces: ConfettiPiece[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 1.5,
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
      duration: 2 + Math.random() * 2,
    }));
    setConfetti(pieces);

    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 overflow-hidden">
      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 pointer-events-none"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-fall ${piece.duration}s ease-in ${piece.delay}s forwards`,
          }}
        />
      ))}

      {/* Content */}
      <div className={`text-center text-white px-6 max-w-md transition-all duration-700 ${
        showContent ? "opacity-100 scale-100" : "opacity-0 scale-75"
      }`}>
        {/* Stars */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2].map((i) => (
            <Star
              key={i}
              className="w-12 h-12 text-yellow-300 fill-yellow-300 animate-pop-in"
              style={{ animationDelay: `${0.5 + i * 0.2}s` }}
            />
          ))}
        </div>

        <h1 className="text-4xl sm:text-5xl font-black mb-4 animate-pop-in" style={{ animationDelay: "0.3s" }}>
          Nivel Completo!
        </h1>

        <p className="text-xl text-white/90 mb-2 font-bold animate-slide-up" style={{ animationDelay: "0.6s" }}>
          {levelTitle}
        </p>

        {/* XP earned */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 mb-6 animate-pop-in" style={{ animationDelay: "0.8s" }}>
          <Sparkles className="w-6 h-6 text-yellow-300" />
          <span className="text-2xl font-black">+{pointsEarned} XP</span>
        </div>

        {/* Progress */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: "1s" }}>
          <div className="flex justify-center gap-2 mb-2">
            {Array.from({ length: totalLevels }, (_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all ${
                  i < totalCompleted
                    ? "bg-yellow-300 shadow-lg"
                    : "bg-white/30"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-white/70">
            {totalCompleted} de {totalLevels} niveis completos
          </p>
        </div>

        <Button
          onClick={onContinue}
          className="bg-white text-purple-600 hover:bg-white/90 px-8 py-6 text-lg font-bold rounded-2xl shadow-xl animate-pop-in"
          style={{ animationDelay: "1.2s" }}
        >
          Continuar
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
