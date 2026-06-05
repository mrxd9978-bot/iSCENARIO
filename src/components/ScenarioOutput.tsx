import React from "react";
import type { ScenarioRequest } from "../types";

function renderMarkdown(text: string) {
  // Remove <think>...</think> completely (support streaming by matching to end of string if unclosed)
  text = text.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, "").trim();

  // Clean up any remaining <think> or </think> tags just in case
  text = text.replace(/<\/?think.*?>/gi, "");

  // Collapse newlines after colons or closing parentheses in dialogue lines
  // so that the character name, stage direction, and the actual dialogue sit on the same line
  // This helps our line-by-line regex parsing.
  text = text.replace(/^(?:\*\*|\[)([^\]*:\n]+):?(?:\*\*|\]):?\s*\((.+?)\)\s*\n\s*"?(.+?)"?$/gm, "**$1:** ($2) $3");
  text = text.replace(/^(?:\*\*|\[)([^\]*:\n]+):?(?:\*\*|\]):?\s*\n\s*"?(.+?)"?$/gm, "**$1:** $2");

  return text
    .replace(/^#+ (.+)$/gm, '<h2 class="scenario-title">$1</h2>')
    .replace(/^##+ (.+)$/gm, '<div class="scene-section-title">$1</div>')
    .replace(/^---$/gm, '<div style="height:1px;background:var(--color-border);margin:16px 0;"></div>')
    .replace(/\*\*(الفكرة.*?|المحور.*?|القصة.*?):?\*\*:?\s*(.+)/g, '<p style="margin-bottom:8px"><strong style="color:var(--color-accent)">$1:</strong> <span style="color:var(--color-text-muted)">$2</span></p>')
    .replace(/\*\*\[?([^\]\n]+?)\]?\*\*\s*[-—]\s*(.+)/g, '<div class="char-card"><div class="char-name">$1</div><div class="char-desc">$2</div></div>')
    .replace(/^(?:\*\*|\[)([^\]*:\n]+):?(?:\*\*|\]):?\s*\((.+?)\)\s*(.+)$/gm, '<div class="dialogue-block"><div class="dialogue-speaker">$1</div><div class="direction">$2</div><div class="dialogue-line">$3</div></div>')
    .replace(/^(?:\*\*|\[)([^\]*:\n]+):?(?:\*\*|\]):?\s*(.+)$/gm, (match, speaker, line) => {
      if (speaker.includes("الفكرة") || speaker.includes("ملاحظات") || speaker.includes("الشخصيات") || speaker.includes("المشهد")) return match;
      return `<div class="dialogue-block"><div class="dialogue-speaker">${speaker}</div><div class="dialogue-line">${line}</div></div>`;
    })
    .replace(/^- (.+)$/gm, '<div class="note-item">$1</div>')
    .replace(/\n{2,}/g, '<br/>')
    .replace(/\n/g, '<br/>');
}

export default function ScenarioOutput({
  scenarios,
  onRemove,
  onCopy,
}: {
  scenarios: any[];
  onRemove: (id: string) => void;
  onCopy: () => void;
}) {
  return (
    <main className="flex flex-col gap-5 w-full">
      {scenarios.length === 0 ? (
        <div className="bg-surface border border-dashed border-white/5 rounded-2xl py-20 px-10 text-center animate-[heroFadeUp_0.5s_ease_forwards]">
          <span className="text-[3.5rem] mb-5 block drop-shadow-[0_0_20px_rgba(201,168,76,0.3)] animate-[emptyFloat_4s_ease-in-out_infinite]">
            🎭
          </span>
          <div className="font-serif text-[1.3rem] text-text-muted mb-2">
            الستارة لم ترفع بعد
          </div>
          <p className="text-[0.85rem] text-text-dim">
            اختر إعداداتك واضغط توليد لبدء المشهد الأول
          </p>
        </div>
      ) : (
        scenarios.map((s) => (
          <ScenarioCard key={s.id} scenario={s} onRemove={onRemove} onCopy={onCopy} />
        ))
      )}
    </main>
  );
}

function ScenarioCard({
  scenario,
  onRemove,
  onCopy,
}: {
  scenario: any;
  onRemove: (id: string) => void;
  onCopy: () => void;
}) {
  const { id, req, content, progress, status } = scenario;
  const isDone = status === "done";
  const isError = status === "error";

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(onCopy);
  };

  const renderedContent = isError
    ? `<div style="color:var(--color-red);padding:8px 0">${content}</div>`
    : renderMarkdown(content) + (!isDone ? '<span class="cursor inline-block w-0.5 h-[1.1em] bg-accent mr-0.5 align-middle rounded-[1px] animate-[cursorBlink_0.6s_step-end_infinite] shadow-[0_0_6px_rgba(201,168,76,0.6)]"></span>' : "");

  const handlePdfExport = () => {
    const printWindow = window.open('', '', 'width=800,height=900');
    if (!printWindow) return;
    
    // Strip the blinking cursor and apply standard script formatting
    const cleanContent = renderedContent.replace(/<span class="cursor.*?<\/span>/g, '');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Export Scenario</title>
          <style>
            @page { margin: 1in; }
            body { 
              font-family: "Courier New", Courier, monospace; 
              color: black;
              background: white;
              line-height: 1.2;
              font-size: 12pt;
              max-width: 6.5in;
              margin: 0 auto;
            }
            .scenario-title {
              text-align: center;
              text-transform: uppercase;
              font-size: 16pt;
              font-weight: bold;
              text-decoration: underline;
              margin-bottom: 2em;
            }
            .scene-section-title {
              margin-top: 1.5em;
              text-transform: uppercase;
              font-weight: bold;
              margin-bottom: 0.5em;
            }
            .char-card {
              margin-bottom: 1em;
            }
            .char-name {
              font-weight: bold;
              text-transform: uppercase;
              display: inline;
            }
            .char-desc {
              display: inline;
              margin-left: 0.5em;
            }
            .dialogue-block {
              margin-top: 1em;
              margin-bottom: 1em;
            }
            .dialogue-speaker {
              text-align: center;
              width: 100%;
              text-transform: uppercase;
              margin-bottom: 0;
            }
            .direction {
              text-align: center;
              font-style: italic;
              width: 50%;
              margin: 0 auto;
            }
            .dialogue-line {
              margin-left: 1in;
              margin-right: 1in;
            }
            .note-item {
              margin-bottom: 0.5em;
            }
            .note-item::before {
              content: '- ';
            }
            strong {
              font-weight: bold;
            }
          </style>
        </head>
        <body dir="auto">
          ${cleanContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  return (
    <div className="bg-surface border border-border rounded-[28px] overflow-hidden animate-[cardEntrance_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] origin-top hover:shadow-[0_0_0_1px_rgba(201,168,76,0.12),0_24px_60px_rgba(0,0,0,0.5)] hover:border-accent/15 transition-all duration-300 w-full mb-6 relative">
      <div className="h-0.5 bg-border relative overflow-hidden">
        <div
          className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r from-accent-dim to-accent rounded-sm transition-all duration-300 ${
            isDone ? "" : "animate-[progressPulse_2s_ease-in-out_infinite]"
          }`}
          style={{
            width: `${progress}%`,
            background: isError ? "var(--color-red)" : undefined,
          }}
        />
      </div>

      <div className="flex items-center justify-between p-4.5 px-5.5 border-b border-border gap-3 bg-surface2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[0.68rem] tracking-[1.2px] uppercase px-2.5 py-1 rounded-full font-bold transition-transform hover:scale-105 bg-accent/10 border border-accent/20 text-accent">
            {req.genreLabel}
          </span>
          <span className="text-[0.68rem] tracking-[1.2px] uppercase px-2.5 py-1 rounded-full font-bold transition-transform hover:scale-105 bg-green/10 border border-green/20 text-green">
            {req.lengthLabel}
          </span>
          <span className="text-[0.68rem] tracking-[1.2px] uppercase px-2.5 py-1 rounded-full font-bold transition-transform hover:scale-105 bg-red/10 border border-red/20 text-red">
            {req.levelLabel}
          </span>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={handlePdfExport}
            className="w-8 h-8 rounded-lg border border-border bg-surface text-text-muted cursor-pointer grid place-items-center text-sm transition-all duration-200 hover:border-accent-dim hover:text-accent hover:bg-accent-glow hover:scale-110 active:scale-95"
            title="تصدير PDF"
          >
            ⎙
          </button>
          <button
            onClick={handleCopy}
            className="w-8 h-8 rounded-lg border border-border bg-surface text-text-muted cursor-pointer grid place-items-center text-sm transition-all duration-200 hover:border-accent-dim hover:text-accent hover:bg-accent-glow hover:scale-110 active:scale-95"
            title="نسخ"
          >
            ⎘
          </button>
          <button
            onClick={() => onRemove(id)}
            className="w-8 h-8 rounded-lg border border-border bg-surface text-text-muted cursor-pointer grid place-items-center text-sm transition-all duration-200 hover:border-accent-dim hover:text-accent hover:bg-accent-glow hover:scale-110 active:scale-95"
            title="حذف"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="text-[0.88rem] leading-[1.85] text-text-main custom-markdown" dangerouslySetInnerHTML={{ __html: renderedContent }} />
      </div>
    </div>
  );
}
