import { ArrowRight, Heart } from "lucide-react";
import { Brand } from "./Brand";
import { Lumi } from "./Lumi";
import { StemBackdrop } from "./StemBackdrop";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const AREAS = [
  { emoji: "🔬", label: "Ciências", desc: "Química, biologia, física e o universo", color: "from-emerald-400 to-teal-500", sh: "#0f766e" },
  { emoji: "💻", label: "Tecnologia", desc: "Programação, apps e inteligência artificial", color: "from-sky-400 to-indigo-500", sh: "#4338ca" },
  { emoji: "⚙️", label: "Engenharia", desc: "Robôs, pontes, energia e invenções", color: "from-amber-400 to-orange-500", sh: "#c2410c" },
  { emoji: "📐", label: "Matemática", desc: "Padrões, lógica, jogos e desafios", color: "from-violet-400 to-purple-600", sh: "#6b21a8" },
];

const FEATURES = [
  { emoji: "🗺️", title: "Trilhas curtinhas", desc: "Lições rápidas com vídeo, leitura e quiz, no seu ritmo." },
  { emoji: "🔥", title: "Ofensiva e XP", desc: "Estude um pouquinho por dia, ganhe XP e suba de nível." },
  { emoji: "🧪", title: "Experimentos", desc: "Ciência para fazer em casa com materiais simples." },
  { emoji: "👩‍🔬", title: "Mulheres que inspiram", desc: "Conheça cientistas incríveis e as carreiras de STEM." },
];

const STICKERS = [
  { t: "⚛️", c: "left-2 top-6 sm:-left-6", d: "0s" },
  { t: "π", c: "right-4 top-2 sm:-right-2 font-display font-bold text-violet-500", d: ".6s" },
  { t: "⚙️", c: "left-0 bottom-16 sm:-left-10", d: "1.2s" },
  { t: "</>", c: "right-0 bottom-24 sm:-right-10 font-display font-bold text-sky-500 text-2xl", d: ".3s" },
  { t: "🧬", c: "left-1/2 -top-4 -translate-x-1/2", d: ".9s" },
];

export const LandingPage = ({ onGetStarted, onLogin }: LandingPageProps) => (
  <div className="relative isolate min-h-screen overflow-hidden">
    <StemBackdrop />

    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
      <Brand size={40} />
      <button
        type="button"
        onClick={onLogin}
        className="h-10 rounded-2xl border-2 border-pink-200 bg-white/80 px-5 font-display text-sm font-bold uppercase tracking-wide text-pink-600 backdrop-blur transition hover:border-pink-400 hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
      >
        Entrar
      </button>
    </header>

    <main className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-5 pb-16 pt-6 sm:px-8 lg:flex-row lg:gap-16 lg:pt-14">
      {/* Mascote com adesivos de STEM */}
      <div className="relative flex w-full max-w-sm justify-center py-8 animate-slide-up">
        <div aria-hidden className="absolute inset-6 rounded-full bg-gradient-to-br from-pink-300/60 via-fuchsia-300/50 to-violet-300/60 blur-2xl" />
        <div className="relative grid h-72 w-72 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-pink-100 to-violet-100 shadow-2xl shadow-pink-300/40 sm:h-80 sm:w-80">
          <Lumi size={190} mood="cheer" />
        </div>
        {STICKERS.map((s) => (
          <span
            key={s.t}
            aria-hidden
            className={`absolute grid h-14 w-14 place-items-center rounded-2xl border-2 border-white bg-white/90 text-3xl shadow-lg animate-float ${s.c}`}
            style={{ animationDelay: s.d }}
          >
            {s.t}
          </span>
        ))}
      </div>

      <div className="flex max-w-xl flex-col items-center gap-6 text-center lg:items-start lg:text-left animate-slide-up stagger-2">
        <span className="rounded-full bg-white/80 px-4 py-1.5 font-display text-sm font-semibold text-pink-600 shadow-sm">
          ✨ Feito para meninas curiosas
        </span>
        <h1 className="font-display text-4xl font-bold leading-[1.1] text-gray-900 sm:text-5xl lg:text-6xl">
          O jeito{" "}
          <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">divertido</span> de
          aprender STEM!
        </h1>
        <p className="text-lg leading-relaxed text-gray-600">
          Ciência, tecnologia, engenharia e matemática em lições curtinhas, desafios, experimentos e muitas conquistas. Com a Lumi, você aprende um pouquinho por dia.
        </p>

        <div className="flex w-full max-w-sm flex-col gap-4">
          <button
            type="button"
            onClick={onGetStarted}
            style={{ ["--btn-shadow" as string]: "#a21caf" }}
            className="btn-3d flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-500 font-display text-lg font-bold uppercase tracking-wide text-white"
          >
            Começar agora — é grátis <ArrowRight className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onLogin}
            style={{ ["--btn-shadow" as string]: "#fbcfe8" }}
            className="btn-3d h-14 w-full rounded-2xl border-2 border-pink-200 bg-white font-display text-lg font-bold uppercase tracking-wide text-pink-600"
          >
            Já tenho uma conta
          </button>
        </div>
        <p className="flex items-center gap-1 text-sm text-gray-500">
          <Heart className="h-4 w-4 fill-pink-400 text-pink-400" /> 100% gratuito, para sempre
        </p>
      </div>
    </main>

    <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
      <h2 className="mb-8 text-center font-display text-3xl font-bold text-gray-900">Escolha sua aventura</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {AREAS.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={onGetStarted}
            style={{ ["--btn-shadow" as string]: a.sh }}
            className={`btn-3d relative overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-left text-white ${a.color}`}
          >
            <span aria-hidden className="absolute -bottom-4 -right-2 text-7xl opacity-25">{a.emoji}</span>
            <span className="text-4xl">{a.emoji}</span>
            <p className="mt-3 font-display text-xl font-bold">{a.label}</p>
            <p className="text-sm font-semibold text-white/90">{a.desc}</p>
          </button>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <h2 className="mb-8 text-center font-display text-3xl font-bold text-gray-900">Por que as meninas amam o Conscientistas?</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-3xl border-2 border-pink-100 bg-white/85 p-6 text-center shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-pink-300">
            <span className="text-4xl">{f.emoji}</span>
            <h3 className="mt-3 font-display text-lg font-bold text-gray-900">{f.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <footer className="border-t-2 border-pink-100 bg-white/60 px-6 py-8 backdrop-blur">
      <div className="flex justify-center">
        <Brand size={32} textClassName="text-lg" />
      </div>
      <nav className="mt-5 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
        <a href="/privacidade" className="hover:text-pink-600">Política de Privacidade</a>
        <a href="/termos" className="hover:text-pink-600">Termos de Uso</a>
      </nav>
      <p className="mt-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Conscientistas. Inspirando meninas a descobrir o mundo STEM.
      </p>
    </footer>
  </div>
);
