import { Button } from "@/components/ui/button";
import { Sparkles, Rocket, Star, Heart, Atom, Code, Calculator, Microscope } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage = ({ onGetStarted, onLogin }: LandingPageProps) => {
  const stemAreas = [
    { icon: Atom, label: "Ciências", color: "text-purple-500" },
    { icon: Calculator, label: "Matemática", color: "text-pink-500" },
    { icon: Code, label: "Tecnologia", color: "text-blue-500" },
    { icon: Microscope, label: "Engenharia", color: "text-green-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Conscientistas</span>
        </div>
        <Button variant="ghost" onClick={onLogin} className="text-muted-foreground hover:text-foreground">
          Entrar na conta
        </Button>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-12 md:px-12 lg:px-20 min-h-[calc(100vh-180px)]">
        {/* Illustration Side */}
        <div className="relative w-full max-w-md lg:max-w-lg">
          <div className="relative">
            {/* Background decorative elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-purple-200 rounded-full opacity-60 animate-pulse" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-pink-200 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-1/2 -right-8 w-16 h-16 bg-blue-200 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Main illustration container */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-border">
              <div className="grid grid-cols-2 gap-6">
                {/* Character cards */}
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-4 flex flex-col items-center gap-2 transform hover:scale-105 transition-transform">
                  <div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center">
                    <Atom className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-medium text-purple-700">Cientista</span>
                </div>
                
                <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl p-4 flex flex-col items-center gap-2 transform hover:scale-105 transition-transform">
                  <div className="w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-medium text-pink-700">Programadora</span>
                </div>
                
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-4 flex flex-col items-center gap-2 transform hover:scale-105 transition-transform">
                  <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
                    <Calculator className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-medium text-blue-700">Matemática</span>
                </div>
                
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-4 flex flex-col items-center gap-2 transform hover:scale-105 transition-transform">
                  <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
                    <Microscope className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-700">Engenheira</span>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 right-8">
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-bounce" />
              </div>
              <div className="absolute -bottom-3 left-12">
                <Heart className="w-6 h-6 text-pink-400 fill-pink-400 animate-pulse" />
              </div>
              <div className="absolute top-1/2 -left-4">
                <Rocket className="w-8 h-8 text-primary transform -rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="flex flex-col items-center lg:items-start gap-6 text-center lg:text-left max-w-md">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            O jeito <span className="text-primary">divertido</span> e{" "}
            <span className="text-secondary">empoderador</span> de aprender STEM!
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Descubra ciência, tecnologia, engenharia e matemática de forma interativa e gamificada. 
            Feito especialmente para meninas que querem conquistar o mundo!
          </p>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button 
              onClick={onGetStarted}
              className="w-full py-6 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Comece Agora
            </Button>
            
            <Button 
              variant="outline"
              onClick={onLogin}
              className="w-full py-6 text-lg font-semibold rounded-xl border-2 border-primary text-primary hover:bg-primary/10"
            >
              Já tenho uma conta
            </Button>
          </div>
        </div>
      </main>

      {/* Footer with STEM areas */}
      <footer className="px-6 py-8 border-t border-border bg-white/50 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {stemAreas.map((area, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <area.icon className={`w-5 h-5 ${area.color}`} />
              <span className="font-medium">{area.label}</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};
