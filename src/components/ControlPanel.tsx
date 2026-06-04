import React, { useState } from "react";
import type { ScenarioRequest } from "../types";

const genres = [
  { val: "drama", label: "🎭 دراما عاطفية" },
  { val: "comedy", label: "😄 كوميديا" },
  { val: "thriller", label: "⚡ إثارة وتشويق" },
  { val: "tragedy", label: "💔 مأساة" },
  { val: "romance", label: "🌹 رومانسي" },
  { val: "crime", label: "🔍 جريمة وبوليسي" },
  { val: "social", label: "🏘 اجتماعي" },
  { val: "horror", label: "🌑 رعب نفسي" },
];

export default function ControlPanel({ onGenerate, genCount }: { onGenerate: (req: ScenarioRequest) => void; genCount: number }) {
  const [genre, setGenre] = useState(genres[0].val);
  const [length, setLength] = useState<"short" | "medium" | "long">("short");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [chars, setChars] = useState(2);
  const [setting, setSetting] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Derive labels mapping for generate button
  const lengthMap = { short: "قصير (3-5 دق)", medium: "متوسط (8-12 دق)", long: "طويل (15-20 دق)" };
  const lengthWords = { short: "400-600", medium: "800-1200", long: "1400-2000" };
  const levelMap = { beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم" };

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    
    await onGenerate({
      genreLabel: genres.find((g) => g.val === genre)?.label.replace(/^.+ /, "") || "دراما",
      lengthLabel: lengthMap[length],
      lengthWords: lengthWords[length],
      levelLabel: levelMap[level],
      chars,
      setting: setting.trim(),
      instructions: instructions.trim(),
    });
    
    setIsGenerating(false);
  };

  const popClass = chars ? "animate-[valPop_0.3s_cubic-bezier(0.34,1.56,0.64,1)]" : "";
  const sliderPct = ((chars - 1) / (5 - 1)) * 100;

  return (
    <aside className="bg-surface border border-border rounded-xl p-7 sticky top-[82px] transition-shadow hover:shadow-[0_0_0_1px_rgba(201,168,76,0.1),0_20px_60px_rgba(0,0,0,0.4)] md:static md:w-full lg:sticky">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="text-[0.7rem] tracking-[2.5px] uppercase text-accent font-semibold flex items-center gap-2">
          <div className="w-5.5 h-5.5 bg-accent-glow border border-accent/30 rounded-md grid place-items-center text-[0.7rem]">
            ⚙
          </div>
          إعدادات المشهد
        </div>
        <span className="text-[0.72rem] text-text-dim bg-surface2 border border-border rounded-full px-2.5 py-0.5">
          {genCount} سيناريو
        </span>
      </div>

      <div className="mb-5">
        <label className="flex items-center gap-1.5 text-sm text-text-muted mb-2 font-medium tracking-wide">
          <span className="text-xs opacity-70">🎬</span> النوع الدرامي
        </label>
        <div className="relative">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full bg-surface2 border border-border rounded-lg text-text-main font-sans text-sm px-3.5 py-2.5 outline-none transition-colors appearance-none hover:bg-surface3 hover:border-white/10 focus:border-accent-dim focus:shadow-[0_0_0_3px_rgba(201,168,76,0.06),0_0_16px_rgba(201,168,76,0.08)] cursor-pointer"
          >
            {genres.map((g) => (
              <option key={g.val} value={g.val}>
                {g.label}
              </option>
            ))}
          </select>
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-xs">
            ▾
          </div>
        </div>
      </div>

      <div className="mb-5">
        <label className="flex items-center gap-1.5 text-sm text-text-muted mb-2 font-medium tracking-wide">
          <span className="text-xs opacity-70">⏱</span> طول المشهد
        </label>
        <div className="flex flex-wrap gap-2">
          {(["short", "medium", "long"] as const).map((len) => (
            <Chip
              key={len}
              active={length === len}
              onClick={() => setLength(len)}
              label={len === "short" ? "قصير" : len === "medium" ? "متوسط" : "طويل"}
            />
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="flex items-center gap-1.5 text-sm text-text-muted mb-2 font-medium tracking-wide">
          <span className="text-xs opacity-70">📊</span> مستوى الصعوبة
        </label>
        <div className="flex flex-wrap gap-2">
          {(["beginner", "intermediate", "advanced"] as const).map((lvl) => (
            <Chip
              key={lvl}
              active={level === lvl}
              onClick={() => setLevel(lvl)}
              label={lvl === "beginner" ? "مبتدئ" : lvl === "intermediate" ? "متوسط" : "متقدم"}
            />
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="flex items-center gap-1.5 text-sm text-text-muted mb-2 font-medium tracking-wide">
          <span className="text-xs opacity-70">👥</span> عدد الشخصيات
        </label>
        <div className="relative">
          <div className="flex items-center gap-3.5">
            <input
              type="range"
              min="1"
              max="5"
              value={chars}
              onChange={(e) => setChars(Number(e.target.value))}
              className="flex-1 h-1 bg-border rounded-full outline-none hover:bg-surface3 cursor-pointer"
              style={{
                background: `linear-gradient(90deg, var(--color-accent) ${sliderPct}%, var(--color-border) ${sliderPct}%)`,
              }}
            />
            <div
              key={chars}
              className={`min-w-8 h-8 grid place-items-center rounded-lg bg-accent-glow border border-accent/30 text-sm text-accent font-bold font-serif ${popClass}`}
            >
              {chars}
            </div>
          </div>
          <div className="flex justify-between mt-1.5 px-0.5">
            {["١", "٢", "٣", "٤", "٥"].map((n) => (
              <span key={n} className="text-[0.65rem] text-text-dim cursor-pointer hover:text-accent transition-colors">
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5">
        <label className="flex items-center gap-1.5 text-sm text-text-muted mb-2 font-medium tracking-wide">
          <span className="text-xs opacity-70">🌍</span> الإطار / البيئة
        </label>
        <input
          type="text"
          value={setting}
          onChange={(e) => setSetting(e.target.value)}
          placeholder="مثال: مكتب، سبعينيات، قرية صغيرة..."
          className="w-full bg-surface2 border border-border rounded-lg text-text-main font-sans text-sm px-3.5 py-2.5 outline-none transition-colors hover:bg-surface3 hover:border-white/10 focus:border-accent-dim focus:shadow-[0_0_0_3px_rgba(201,168,76,0.06),0_0_16px_rgba(201,168,76,0.08)]"
        />
      </div>

      <div className="mb-5">
        <label className="flex items-center gap-1.5 text-sm text-text-muted mb-2 font-medium tracking-wide">
          <span className="text-xs opacity-70">✏️</span> تعليمات خاصة
        </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="مثال: مواجهة بين أب وابنه حول قرار مهم..."
          className="w-full bg-surface2 border border-border rounded-lg text-text-main font-sans text-sm px-3.5 py-2.5 outline-none transition-colors hover:bg-surface3 hover:border-white/10 focus:border-accent-dim focus:shadow-[0_0_0_3px_rgba(201,168,76,0.06),0_0_16px_rgba(201,168,76,0.08)] resize-y min-h-[88px] leading-[1.6]"
        />
      </div>

      <button
        onClick={handleGenerateClick}
        disabled={isGenerating}
        className={`btn-generate w-full mt-1.5 p-3.5 bg-gradient-to-br from-accent via-[#d4b05a] to-accent text-bg border-none rounded-lg font-sans text-[0.95rem] font-bold cursor-pointer tracking-wide transition-all duration-300 relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(201,168,76,0.4),0_4px_12px_rgba(0,0,0,0.3)] active:-translate-y-px active:shadow-[0_6px_16px_rgba(201,168,76,0.3)] ${isGenerating ? "opacity-50 cursor-not-allowed transform-none shadow-none" : ""}`}
      >
        <div className="flex items-center justify-center gap-2 relative z-10 w-full h-full">
          {isGenerating ? (
            <div className="w-5 h-5 border-[2.5px] border-black/30 border-t-bg rounded-full animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              <span className="text-sm animate-[starSpin_3s_linear_infinite]">✦</span> توليد السيناريو
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0" />
      </button>
    </aside>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  const [ripples, setRipples] = useState<number[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    setRipples([...ripples, Date.now()]);
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative px-3.5 py-1.5 rounded-full border text-[0.76rem] font-sans cursor-pointer transition-all duration-200 select-none overflow-hidden group ${
        active
          ? "bg-accent-glow border-accent text-accent -translate-y-[1px] shadow-[0_4px_12px_rgba(201,168,76,0.2)]"
          : "bg-surface2 border-border text-text-muted hover:border-accent-dim hover:text-accent hover:-translate-y-[1px] active:scale-95"
      }`}
    >
      <div
        className={`absolute inset-0 bg-accent-glow transition-opacity duration-200 ${active ? "opacity-0" : "opacity-0 group-hover:opacity-100"}`}
      />
      <span className="relative z-10">{label}</span>
      {ripples.map((id) => (
        <span
          key={id}
          className="absolute inset-0 bg-accent/30 rounded-full animate-[rippleAnim_0.4s_ease_forwards] pointer-events-none"
          onAnimationEnd={() => setRipples((r) => r.filter((i) => i !== id))}
        />
      ))}
    </div>
  );
}
