import { Button } from "@/components/ui/button";
import { Sparkles, Rocket, Star, Heart, Atom, Code, Calculator, Microscope, ArrowRight, Users, Trophy, BookOpen } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage = ({ onGetStarted, onLogin }: LandingPageProps) => {
  const stemAreas = [
    { icon: Atom, label: "Ciencias", color: "from-purple-400 to-purple-600", bg: "bg-purple-100", emoji: "🔬" },
    { icon: Calculator, label: "Matematica", color: "from-pink-400 to-pink-600", bg: "bg-pink-100", emoji: "📐" },
    { icon: Code, label: "Tecnologia", color: "from-blue-400 to-blue-600", bg: "bg-blue-100", emoji: "💻" },
    { icon: Microscope, label: "Engenharia", color: "from-emerald-400 to-emerald-600", bg: "bg-emerald-100", emoji: "⚙️" },
  ];

  const features = [
    { icon: BookOpen, title: "Trilhas interativas", desc: "Aprenda passo a passo, no seu ritmo", color: "text-purple-500", bg: "bg-purple-50" },
    { icon: Trophy, title: "Ganhe conquistas", desc: "Desbloqueie badges e suba de nivel", color: "text-amber-500", bg: "bg-amber-50" },
    { icon: Users, title: "Comunidade", desc: "Conecte-se com outras meninas em STEM", color: "text-pink-500", bg: "bg-pink-50" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Conscientistas
          </span>
        </div>
        <Button variant="ghost" onClick={onLogin} className="text-gray-600 hover:text-purple-600 font-semibold">
          Entrar na conta
        </Button>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row items-center justify-center gap-16 px-6 py-12 md:px-12 lg:px-20 min-h-[calc(100vh-260px)]">
        {/* Illustration Side */}
        <div className="relative w-full max-w-md lg:max-w-lg animate-slide-up">
          {/* Floating decorative elements */}
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-purple-200/60 rounded-full animate-float" />
          <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-pink-200/60 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 -right-8 w-14 h-14 bg-blue-200/60 rounded-full animate-float" style={{ animationDelay: '2s' }} />

          {/* Main card grid */}
          <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/80">
            <div className="grid grid-cols-2 gap-5">
              {stemAreas.map((area, i) => (
                <div
                  key={i}
                  className={`${area.bg} rounded-2xl p-5 flex flex-col items-center gap-3 transform hover:scale-110 hover:-rotate-2 transition-all duration-300 cursor-pointer animate-pop-in`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${area.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <area.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">{area.label}</span>
                </div>
              ))}
            </div>

            {/* Floating accent elements */}
            <div className="absolute -top-5 right-10">
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-float" />
            </div>
            <div className="absolute -bottom-4 left-14">
              <Heart className="w-7 h-7 text-pink-400 fill-pink-400 animate-float" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute top-1/2 -left-5">
              <Rocket className="w-8 h-8 text-purple-500 transform -rotate-45 animate-float" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="flex flex-col items-center lg:items-start gap-8 text-center lg:text-left max-w-lg animate-slide-up stagger-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight">
            O jeito{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              divertido
            </span>{" "}
            de aprender STEM!
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed">
            Descubra ciencia, tecnologia, engenharia e matematica de forma interativa e gamificada.
            Feito especialmente para meninas que querem conquistar o mundo!
          </p>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button
              onClick={onGetStarted}
              className="w-full py-6 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-xl shadow-purple-300/40 transition-all hover:shadow-2xl hover:shadow-purple-400/50 hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Comece Agora — e gratis!
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              variant="outline"
              onClick={onLogin}
              className="w-full py-6 text-lg font-bold rounded-2xl border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
            >
              Ja tenho uma conta
            </Button>
          </div>

          <p className="text-sm text-gray-400 flex items-center gap-1">
            <Heart className="w-4 h-4 text-pink-400" />
            100% gratuito, para sempre
          </p>
        </div>
      </main>

      {/* Features Section */}
      <section className="px-6 py-16 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-10">
            Por que as meninas amam o Conscientistas?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`${feature.bg} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <feature.icon className={`w-10 h-10 ${feature.color} mx-auto mb-3`} />
                <h3 className="font-bold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-purple-100 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {stemAreas.map((area, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <span className="text-xl">{area.emoji}</span>
              <span className="font-semibold text-sm">{area.label}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          © 2025 Conscientistas. Inspirando meninas a descobrir o mundo STEM.
        </p>
      </footer>
    </div>
  );
};
