import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";

export default function Hero({ genTotal }: { genTotal: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const controls = animate(count, genTotal, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [genTotal]);

  return (
    <section className="relative text-center pt-[130px] pb-[70px] px-6 overflow-hidden z-[2] md:pt-[130px] md:pb-[70px] pt-[90px] pb-12">
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />

      <div className="inline-flex items-center gap-2 text-[0.72rem] tracking-[3px] uppercase text-accent border border-accent/30 px-4.5 py-1.5 rounded-full mb-7.5 bg-accent/5 opacity-0 animate-[heroFadeUp_0.8s_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-[dotBlink_2s_ease-in-out_infinite]" />
        أداة تدريب الممثلين بالذكاء الاصطناعي
      </div>

      <h1 className="font-serif text-[clamp(2.6rem,6vw,4.5rem)] font-black leading-[1.12] max-w-[800px] mx-auto mb-5.5 opacity-0 animate-[heroFadeUp_0.8s_0.45s_cubic-bezier(0.16,1,0.3,1)_forwards]">
        اصنع{" "}
        <em className="not-italic text-accent relative inline-block">
          سيناريوهات
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent animate-[underlineSlide_2s_ease-in-out_infinite] scale-x-0" />
        </em>
        <br />
        تدريبية لا تُنسى
      </h1>

      <p className="text-[1.05rem] text-text-muted max-w-[500px] mx-auto mb-12 font-light opacity-0 animate-[heroFadeUp_0.8s_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
        مشاهد درامية احترافية تُولَّد لحظياً — للممثلين، المخرجين، ومدربي الأداء.
      </p>

      <div className="hidden md:inline-flex border border-border rounded-xl overflow-hidden opacity-0 animate-[heroFadeUp_0.8s_0.75s_cubic-bezier(0.16,1,0.3,1)_forwards]">
        <div className="px-7 py-3.5 bg-surface text-center transition-colors hover:bg-surface2 border-l border-border last:border-l-0">
          <motion.span className="font-serif text-2xl font-bold text-accent leading-none mb-1 block">
            {rounded}
          </motion.span>
          <span className="text-[0.72rem] text-text-dim tracking-wide">
            سيناريو مولَّد
          </span>
        </div>
        <div className="px-7 py-3.5 bg-surface text-center transition-colors hover:bg-surface2 border-l border-border last:border-l-0">
          <span className="font-serif text-2xl font-bold text-accent leading-none mb-1 block">
            8
          </span>
          <span className="text-[0.72rem] text-text-dim tracking-wide">
            نوع دراما
          </span>
        </div>
        <div className="px-7 py-3.5 bg-surface text-center transition-colors hover:bg-surface2 border-l border-border last:border-l-0">
          <span className="font-serif text-2xl font-bold text-accent leading-none mb-1 block">
            ∞
          </span>
          <span className="text-[0.72rem] text-text-dim tracking-wide">
            إمكانيات
          </span>
        </div>
      </div>
    </section>
  );
}
