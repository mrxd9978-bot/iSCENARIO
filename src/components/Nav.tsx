import React from "react";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-4 px-10 bg-[rgba(10,11,14,0.8)] backdrop-blur-[24px] saturate-[1.6] border-b border-white/[0.04] -translate-y-full animate-[navDrop_0.7s_0.1s_cubic-bezier(0.16,1,0.3,1)_forwards] md:px-10 px-5">
      <div className="font-serif font-black text-2xl tracking-wide flex items-center gap-2 text-text-main">
        <img src="/logo.svg" alt="iSCENARIO Logo" className="w-8 h-8 rounded-lg animate-[logoPulse_3s_ease-in-out_infinite]" />
        i<span className="text-accent">SCENARIO</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[0.72rem] tracking-[1.5px] text-text-muted border border-border px-3.5 py-1 rounded-full whitespace-nowrap">
          AI · v2.0
        </span>
        <button className="relative overflow-hidden bg-accent-glow border border-accent/40 text-accent font-sans text-sm px-4 py-1.5 rounded-full cursor-pointer tracking-wide transition-all duration-[250ms] group hover:text-bg hover:border-accent hover:scale-105">
          <span className="relative z-10">✦ ابدأ الآن</span>
          <div className="absolute inset-0 bg-accent scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 z-0 rounded-full" />
        </button>
      </div>
    </nav>
  );
}
