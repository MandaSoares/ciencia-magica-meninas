import { useMemo } from "react";
import { ArrowRight, Check, Clock, Flame, Lock, Plus, Sparkles, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Lumi, LumiMood } from "./Lumi";
import { useLearningPathContent } from "@/hooks/useLearningPathContent";
import { getPathByArea } from "@/data/learningPathData";

interface DashboardProps {
  userPoints: number;
  userLevel: number;
  userName?: string;
  selectedAreas?: string[];
  onAreaChange?: (area: string) => void;
  currentActiveArea?: string;
  onAddArea?: () => void;
  onNavigate?: (section: string) => void;
  completedLessons?: Set<number>;
  modulesCompleted?: number;
  experimentsCompleted?: number;
  lessonsCompleted?: number;
  studyHours?: number;
  /** Sequência real de dias (servidor) */
  streak?: number;
  longestStreak?: number;
  studiedToday?: boolean;
  /** XP ganho hoje, para a meta diária */
  todayXp?: number;
}

/** Meta diária de XP (estilo Duolingo) */
export const DAILY_XP_GOAL = 100;

const AREA: Record<string, { emoji: string; name: string; chip: string; node: string; shadow: string }> = {
  science: { emoji: "🔬", name: "Ciências", chip: "from-emerald-400 to-teal-500", node: "from-pink-400 to-fuchsia-500", shadow: "#a21caf" },
  technology: { emoji: "💻", name: "Tecnologia", chip: "from-sky-400 to-indigo-500", node: "from-pink-400 to-fuchsia-500", shadow: "#a21caf" },
  engineering: { emoji: "⚙️", name: "Engenharia", chip: "from-amber-400 to-orange-500", node: "from-pink-400 to-fuchsia-500", shadow: "#a21caf" },
  math: { emoji: "📐", name: "Matemática", chip: "from-violet-400 to-purple-600", node: "from-pink-400 to-fuchsia-500", shadow: "#a21caf" },
};

const levelXpThresholds = [0, 100, 250, 500, 800, 1200, 1700, 2500, 3500, 5000];
const LEVEL_TITLES = ["Curiosa", "Exploradora", "Descobridora", "Investigadora", "Pesquisadora", "Inventora", "Cientista", "Mestra", "Gênio", "Lenda"];
const getLevelTitle = (level: number) => LEVEL_TITLES[Math.min(Math.max(level, 1) - 1, LEVEL_TITLES.length - 1)];
const getLevelProgress = (points: number, level: number) => {
  const cur = levelXpThresholds[level - 1] || 0;
  const next = levelXpThresholds[level] || cur + 500;
  return { pct: Math.min(Math.max(((points - cur) / (next - cur)) * 100, 0), 100), missing: Math.max(next - points, 0) };
};

/** Curiosidades sobre mulheres na ciência — uma por dia */
const CURIOSIDADES = [
  { who: "Marie Curie", emoji: "☢️", text: "Foi a primeira pessoa a ganhar dois prêmios Nobel em ciências diferentes: Física (1903) e Química (1911)." },
  { who: "Ada Lovelace", emoji: "💻", text: "Em 1843 publicou o que é considerado o primeiro algoritmo pensado para ser executado por uma máquina." },
  { who: "Katherine Johnson", emoji: "🚀", text: "Calculou trajetórias da NASA; em 1962, o astronauta John Glenn pediu que ela conferisse os números do computador antes de voar." },
  { who: "Margaret Hamilton", emoji: "🌙", text: "Liderou a equipe que criou o software de bordo das missões Apollo, que levaram humanos à Lua." },
  { who: "Jaqueline Goes de Jesus", emoji: "🧬", text: "Coordenou o sequenciamento do genoma do coronavírus no Brasil em cerca de 48 horas após o primeiro caso confirmado, em 2020." },
  { who: "Johanna Döbereiner", emoji: "🌱", text: "Suas pesquisas sobre bactérias que fixam nitrogênio ajudaram o Brasil a cultivar soja usando muito menos adubo químico." },
  { who: "Maryam Mirzakhani", emoji: "📐", text: "Em 2014 se tornou a primeira mulher a ganhar a Medalha Fields, um dos prêmios mais importantes da matemática." },
  { who: "Grace Hopper", emoji: "🐞", text: "Criou um dos primeiros compiladores e ajudou a desenvolver a linguagem COBOL, usada até hoje em bancos." },
  { who: "Hedy Lamarr", emoji: "📡", text: "Atriz e inventora, patenteou em 1942 um sistema de salto de frequência, ideia que está na base de tecnologias sem fio." },
  { who: "Mae Jemison", emoji: "🛰️", text: "Em 1992 se tornou a primeira mulher negra a ir ao espaço, a bordo do ônibus espacial Endeavour." },
  { who: "Rosalind Franklin", emoji: "🔬", text: "A \"Foto 51\", feita em seu laboratório, foi essencial para descobrir que o DNA tem forma de dupla hélice." },
  { who: "Emmy Noether", emoji: "⚛️", text: "Seu teorema mostra que cada simetria da natureza está ligada a uma lei de conservação, como a da energia." },
  { who: "Sônia Guimarães", emoji: "🔭", text: "Foi a primeira mulher negra brasileira a se tornar doutora em Física e é professora do ITA." },
  { who: "Marcelle Soares-Santos", emoji: "🌌", text: "Astrofísica brasileira, ajudou a observar a luz da primeira fusão de estrelas de nêutrons detectada também por ondas gravitacionais." },
];

const WEEK_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];
/** Deslocamento horizontal dos nós da trilha (zigue-zague do Duolingo) */
const OFFSETS = [0, 48, 72, 48, 0, -48, -72, -48];

const card =
  "rounded-3xl border-2 border-pink-100 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]";

export const Dashboard = ({
  userPoints,
  userLevel,
  userName = "Estudante",
  selectedAreas = ["science"],
  onAreaChange,
  currentActiveArea = "science",
  onAddArea,
  onNavigate,
  completedLessons = new Set(),
  modulesCompleted = 0,
  experimentsCompleted = 0,
  lessonsCompleted = 0,
  studyHours = 0,
  streak = 0,
  longestStreak = 0,
  studiedToday = false,
  todayXp = 0,
}: DashboardProps) => {
  const area = AREA[currentActiveArea] || AREA.science;
  const firstName = userName.split(" ")[0];
  const go = (s: string) => onNavigate?.(s);

  // Trilha da área atual (banco, ou conteúdo padrão)
  const { data: dbLevels } = useLearningPathContent(currentActiveArea);
  const levels = dbLevels && dbLevels.length > 0 ? dbLevels : getPathByArea(currentActiveArea);
  const currentIdx = levels.findIndex((l) => !completedLessons.has(l.id));
  const allDone = levels.length > 0 && currentIdx === -1;
  const doneCount = levels.filter((l) => completedLessons.has(l.id)).length;
  const windowStart = Math.max(0, Math.min((currentIdx === -1 ? levels.length : currentIdx) - 2, levels.length - 6));
  const visible = levels.slice(windowStart, windowStart + 6);
  const currentLevel = currentIdx >= 0 ? levels[currentIdx] : null;

  const goalPct = Math.min(100, Math.round((todayXp / DAILY_XP_GOAL) * 100));
  const lvl = getLevelProgress(userPoints, userLevel);

  const curiosidade = useMemo(() => {
    const now = new Date();
    const day = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    return CURIOSIDADES[day % CURIOSIDADES.length];
  }, []);

  // Últimos 7 dias; marcados conforme a ofensiva atual
  const week = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const daysAgo = 6 - i;
      const d = new Date(today);
      d.setDate(today.getDate() - daysAgo);
      const active = studiedToday ? daysAgo < streak : daysAgo >= 1 && daysAgo <= streak;
      return { label: WEEK_LABELS[d.getDay()], active, today: daysAgo === 0 };
    });
  }, [streak, studiedToday]);

  let mood: LumiMood = "happy";
  let message: string;
  if (allDone) {
    mood = "cheer";
    message = `Você completou a trilha de ${area.name}! Que tal explorar outra área? ✨`;
  } else if (goalPct >= 100) {
    mood = "cheer";
    message = "Meta do dia batida! Você está arrasando! 🎉";
  } else if (studiedToday) {
    message = `Mandou bem hoje! Faltam ${DAILY_XP_GOAL - todayXp} XP para a meta do dia.`;
  } else if (streak > 0) {
    message = `Sua ofensiva de ${streak} ${streak === 1 ? "dia" : "dias"} está esperando! Uma lição rapidinha mantém o fogo aceso 🔥`;
  } else {
    mood = "sleepy";
    message = `Bora começar? Cada lição te deixa mais perto de virar ${getLevelTitle(userLevel + 1)}!`;
  }

  const quests = [
    { label: "Ganhe 20 XP", value: Math.min(todayXp, 20), total: 20, emoji: "⚡" },
    { label: `Bata a meta de ${DAILY_XP_GOAL} XP`, value: Math.min(todayXp, DAILY_XP_GOAL), total: DAILY_XP_GOAL, emoji: "🎯" },
    { label: "Mantenha a ofensiva", value: studiedToday ? 1 : 0, total: 1, emoji: "🔥" },
  ];

  const badges = [
    { icon: "🌟", label: "Primeira aula", unlocked: lessonsCompleted > 0 || modulesCompleted > 0 || experimentsCompleted > 0 },
    { icon: "🔥", label: "3 dias", unlocked: longestStreak >= 3 },
    { icon: "🧪", label: "Cientista júnior", unlocked: experimentsCompleted >= 3 },
    { icon: "📚", label: "Leitora voraz", unlocked: modulesCompleted >= 2 },
    { icon: "⚡", label: "7 dias", unlocked: longestStreak >= 7 },
    { icon: "👑", label: "Mestra", unlocked: userLevel >= 5 },
  ];

  const hours = studyHours < 1 ? `${Math.round(studyHours * 60)}min` : `${studyHours.toFixed(1)}h`;

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* ===== Coluna principal ===== */}
      <div className="min-w-0 space-y-6">
        {/* Boas-vindas com a Lumi */}
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-500 p-5 text-white shadow-xl shadow-pink-300/40 sm:p-7 dark:shadow-none animate-slide-up">
          <div aria-hidden className="stem-doodles absolute inset-0 opacity-20 mix-blend-overlay" />
          <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-end">
            <Lumi size={112} mood={mood} className="shrink-0 drop-shadow-lg" />
            <div className="flex-1 text-center sm:text-left">
              <p className="font-display text-sm font-medium uppercase tracking-widest text-white/80">{getLevelTitle(userLevel)} · nível {userLevel}</p>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Oi, {firstName}!</h2>
              <div className="relative mt-3 inline-block max-w-md rounded-2xl bg-white px-4 py-3 text-left text-[15px] font-semibold text-fuchsia-900 shadow-md">
                <span aria-hidden className="absolute -left-2 top-4 hidden h-4 w-4 rotate-45 bg-white sm:block" />
                <span aria-hidden className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white sm:hidden" />
                <span className="relative">{message}</span>
              </div>
            </div>
          </div>
          <div className="relative mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => go("path")}
              style={{ ["--btn-shadow" as string]: "#fbcfe8" }}
              className="btn-3d inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-7 font-display text-lg font-bold uppercase tracking-wide text-pink-600"
            >
              {allDone ? "Rever trilha" : doneCount > 0 ? "Continuar" : "Começar"} <ArrowRight className="h-5 w-5" />
            </button>
            {currentLevel && (
              <p className="text-center text-sm font-semibold text-white/90 sm:text-left">
                Próxima lição: <span className="text-white">{currentLevel.title}</span>
              </p>
            )}
          </div>
        </section>

        {/* Áreas */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedAreas.map((key) => {
            const a = AREA[key] || AREA.science;
            const active = key === currentActiveArea;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onAreaChange?.(key)}
                aria-pressed={active}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-2xl border-2 px-4 font-display font-semibold transition-all",
                  active
                    ? cn("border-transparent bg-gradient-to-r text-white shadow-md", a.chip)
                    : "border-pink-100 bg-white/80 text-gray-600 hover:-translate-y-0.5 hover:border-pink-300 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                )}
              >
                <span className="text-lg">{a.emoji}</span>
                {a.name}
              </button>
            );
          })}
          {selectedAreas.length < 4 && (
            <button
              type="button"
              onClick={onAddArea}
              className="inline-flex h-11 items-center gap-1.5 rounded-2xl border-2 border-dashed border-pink-300 px-4 font-display font-semibold text-pink-500 transition hover:bg-pink-50 dark:border-pink-500/40 dark:hover:bg-pink-500/10"
            >
              <Plus className="h-4 w-4" /> Área
            </button>
          )}
        </div>

        {/* Trilha estilo Duolingo */}
        <section className={cn(card, "relative overflow-hidden p-0")}>
          <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-pink-50 to-violet-50 px-5 py-4 dark:from-pink-500/10 dark:to-violet-500/10">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-widest text-pink-500">Trilha de {area.name}</p>
              <p className="font-display text-lg font-bold text-gray-800 dark:text-white">
                {doneCount} de {levels.length} níveis concluídos
              </p>
            </div>
            <button
              type="button"
              onClick={() => go("path")}
              className="shrink-0 rounded-xl border-2 border-pink-200 bg-white px-3 py-2 text-sm font-bold text-pink-600 transition hover:bg-pink-50 dark:border-white/10 dark:bg-white/5 dark:text-pink-300"
            >
              Ver trilha
            </button>
          </div>
          <div className="h-2 bg-pink-100 dark:bg-white/5">
            <div
              className="h-full rounded-r-full bg-gradient-to-r from-pink-400 to-fuchsia-500 transition-all duration-700"
              style={{ width: `${levels.length ? (doneCount / levels.length) * 100 : 0}%` }}
            />
          </div>

          <ol className="relative flex flex-col items-center gap-5 px-4 py-8">
            {visible.map((level, i) => {
              const idx = windowStart + i;
              const done = completedLessons.has(level.id);
              const current = idx === currentIdx;
              const offset = OFFSETS[idx % OFFSETS.length];
              return (
                <li key={level.id} className="relative flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }}>
                  {current && (
                    <span className="mb-2 animate-bounce rounded-xl border-2 border-pink-200 bg-white px-3 py-1 font-display text-sm font-bold uppercase tracking-wide text-pink-500 shadow-sm dark:border-pink-500/40 dark:bg-[#1f0f25]">
                      {doneCount === 0 ? "Começar" : "Continuar"}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => (done || current) && go("path")}
                    disabled={!done && !current}
                    title={level.title}
                    aria-label={`Nível ${level.id}: ${level.title}${done ? " (concluído)" : current ? " (atual)" : " (bloqueado)"}`}
                    style={{ ["--btn-shadow" as string]: done ? "#b45309" : current ? area.shadow : "#d1d5db" }}
                    className={cn(
                      "btn-3d relative grid h-[72px] w-[72px] place-items-center rounded-full",
                      done && "bg-gradient-to-br from-amber-300 to-yellow-400 text-white",
                      current && cn("bg-gradient-to-br text-white", area.node),
                      !done && !current && "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-white/10 dark:text-gray-500"
                    )}
                  >
                    {current && <span aria-hidden className="animate-ping-soft absolute inset-0 rounded-full bg-pink-400" />}
                    {done ? (
                      <Check className="relative h-8 w-8" strokeWidth={3.5} />
                    ) : current ? (
                      <Star className="relative h-8 w-8 fill-white" />
                    ) : (
                      <Lock className="relative h-7 w-7" />
                    )}
                  </button>
                  <span
                    className={cn(
                      "mt-2 max-w-[150px] text-center text-xs font-bold leading-tight",
                      current ? "text-pink-600 dark:text-pink-300" : done ? "text-amber-600 dark:text-amber-300" : "text-gray-400"
                    )}
                  >
                    {level.title}
                  </span>
                </li>
              );
            })}
            {allDone && (
              <li className="flex flex-col items-center gap-1 pt-2">
                <Trophy className="h-12 w-12 text-amber-400" />
                <span className="font-display font-bold text-amber-600">Trilha completa!</span>
              </li>
            )}
          </ol>
        </section>

        {/* Atalhos */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[
            { id: "modules", emoji: "📚", title: "Módulos", desc: `${modulesCompleted} concluído(s)`, color: "from-sky-400 to-indigo-500", sh: "#4338ca" },
            { id: "lab", emoji: "🧪", title: "Laboratório", desc: `${experimentsCompleted} experimento(s)`, color: "from-emerald-400 to-teal-500", sh: "#0f766e" },
            { id: "areas", emoji: "👩‍🔬", title: "Carreiras", desc: "Mulheres que inspiram", color: "from-amber-400 to-orange-500", sh: "#c2410c" },
            { id: "achievements", emoji: "🏆", title: "Conquistas", desc: `${badges.filter((b) => b.unlocked).length} de ${badges.length} medalhas`, color: "from-fuchsia-400 to-pink-500", sh: "#be185d" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => go(t.id)}
              style={{ ["--btn-shadow" as string]: t.sh }}
              className={cn("btn-3d relative overflow-hidden rounded-3xl bg-gradient-to-br p-4 text-left text-white sm:p-5", t.color)}
            >
              <span aria-hidden className="absolute -bottom-3 -right-2 text-6xl opacity-25 sm:text-7xl">{t.emoji}</span>
              <span className="text-3xl">{t.emoji}</span>
              <p className="mt-2 font-display text-lg font-bold">{t.title}</p>
              <p className="text-sm font-semibold text-white/85">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ===== Coluna lateral ===== */}
      <aside className="space-y-5">
        {/* Ofensiva */}
        <section className={card}>
          <div className="flex items-center gap-3">
            <div className={cn("grid h-14 w-14 place-items-center rounded-2xl", studiedToday ? "bg-orange-100 dark:bg-orange-500/15" : "bg-gray-100 dark:bg-white/5")}>
              <Flame className={cn("h-8 w-8", studiedToday ? "animate-streak-fire fill-orange-400 text-orange-500" : "text-gray-400")} />
            </div>
            <div>
              <p className="font-display text-3xl font-bold leading-none text-gray-800 dark:text-white">{streak}</p>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{streak === 1 ? "dia de ofensiva" : "dias de ofensiva"}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {week.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className={cn("text-[11px] font-bold", d.today ? "text-pink-500" : "text-gray-400")}>{d.label}</span>
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full text-sm",
                    d.active
                      ? "bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-sm"
                      : d.today
                        ? "border-2 border-dashed border-pink-300 dark:border-pink-500/50"
                        : "bg-gray-100 dark:bg-white/5"
                  )}
                >
                  {d.active ? "🔥" : ""}
                </span>
              </div>
            ))}
          </div>
          {longestStreak > 0 && <p className="mt-3 text-xs font-semibold text-gray-400">Recorde: {longestStreak} dias</p>}
        </section>

        {/* Missões do dia */}
        <section className={card}>
          <h3 className="mb-3 font-display text-lg font-bold text-gray-800 dark:text-white">Missões do dia</h3>
          <ul className="space-y-4">
            {quests.map((q) => {
              const pct = (q.value / q.total) * 100;
              const done = pct >= 100;
              return (
                <li key={q.label} className="flex items-center gap-3">
                  <span className="text-2xl">{q.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{q.label}</p>
                    <div className="relative mt-1 h-4 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", done ? "bg-gradient-to-r from-amber-300 to-yellow-400" : "bg-gradient-to-r from-pink-400 to-fuchsia-500")}
                        style={{ width: `${pct}%` }}
                      />
                      <span className="absolute inset-0 grid place-items-center text-[10px] font-black text-gray-600 dark:text-gray-200">
                        {q.total === 1 ? (done ? "feito!" : "0 / 1") : `${q.value} / ${q.total}`}
                      </span>
                    </div>
                  </div>
                  <span className={cn("text-xl", !done && "opacity-30 grayscale")}>🎁</span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Nível */}
        <section className={card}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-gray-800 dark:text-white">{getLevelTitle(userLevel)}</h3>
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-black text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">Nv {userLevel}</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-violet-100 dark:bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-pink-500 transition-all duration-700" style={{ width: `${lvl.pct}%` }} />
          </div>
          <p className="mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
            {userPoints} XP · faltam {lvl.missing} XP para virar <strong className="text-pink-500">{getLevelTitle(userLevel + 1)}</strong>
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { v: lessonsCompleted, l: "lições" },
              { v: experimentsCompleted, l: "experimentos" },
              { v: hours, l: "de estudo", icon: true },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-pink-50/80 px-1 py-2 dark:bg-white/5">
                <p className="font-display text-lg font-bold text-gray-800 dark:text-white">{s.v}</p>
                <p className="flex items-center justify-center gap-0.5 text-[10px] font-bold uppercase text-gray-400">
                  {s.icon && <Clock className="h-3 w-3" />}
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Curiosidade do dia */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-5 text-white shadow-lg shadow-violet-300/30 dark:shadow-none">
          <span aria-hidden className="absolute -right-3 -top-4 text-7xl opacity-25">{curiosidade.emoji}</span>
          <p className="flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-widest text-white/80">
            <Sparkles className="h-4 w-4" /> Curiosidade do dia
          </p>
          <p className="mt-2 font-display text-xl font-bold">{curiosidade.who}</p>
          <p className="mt-1 text-sm leading-relaxed text-white/90">{curiosidade.text}</p>
          <button type="button" onClick={() => go("areas")} className="mt-3 text-sm font-bold text-white underline-offset-4 hover:underline">
            Conhecer mais mulheres na ciência →
          </button>
        </section>

        {/* Medalhas */}
        <section className={card}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-gray-800 dark:text-white">Medalhas</h3>
            <button type="button" onClick={() => go("achievements")} className="text-sm font-bold text-pink-500 hover:underline">
              Ver todas
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {badges.map((b) => (
              <div
                key={b.label}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl p-2 text-center",
                  b.unlocked ? "bg-gradient-to-b from-amber-50 to-yellow-100 dark:from-amber-500/15 dark:to-yellow-500/10" : "bg-gray-50 opacity-50 grayscale dark:bg-white/5"
                )}
              >
                <span className="text-2xl">{b.icon}</span>
                <span className={cn("text-[10px] font-bold leading-tight", b.unlocked ? "text-amber-700 dark:text-amber-300" : "text-gray-400")}>{b.label}</span>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
};
