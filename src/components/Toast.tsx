import React from "react";

export default function Toast({ show, msg, icon }: { show: boolean; msg: string; icon: string }) {
  return (
    <div
      className={`fixed bottom-7 left-1/2 -translate-x-1/2 bg-surface border border-border rounded-lg px-5.5 py-3 text-[0.85rem] text-text-main z-[999] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center gap-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ${
        show ? "translate-y-0 opacity-100" : "translate-y-[80px] opacity-0"
      }`}
    >
      <span className="text-green text-base font-bold">{icon}</span>
      <span>{msg}</span>
    </div>
  );
}
