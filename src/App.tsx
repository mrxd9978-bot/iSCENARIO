/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import ControlPanel from "./components/ControlPanel";
import ScenarioOutput from "./components/ScenarioOutput";
import BackgroundLayout from "./components/BackgroundLayout";
import Toast from "./components/Toast";
import type { ScenarioRequest } from "./types";

export default function App() {
  const [scenarios, setScenarios] = useState<
    { id: string; req: ScenarioRequest; content: string; progress: number; status: "generating" | "done" | "error" }[]
  >([]);
  const [genTotal, setGenTotal] = useState(0);
  const [toast, setToast] = useState<{ show: boolean; msg: string; icon: string }>({
    show: false,
    msg: "",
    icon: "",
  });

  const showToast = (icon: string, msg: string) => {
    setToast({ show: true, msg, icon });
    setTimeout(() => setToast({ show: false, msg: "", icon: "" }), 2800);
  };

  const handleGenerate = async (req: ScenarioRequest) => {
    const id = `card-${Date.now()}`;
    const newScenario = { id, req, content: "", progress: 0, status: "generating" as const };
    setScenarios((prev) => [newScenario, ...prev]);

    try {
      const prompt = `أنت كاتب مسرحي وسينمائي محترف متخصص في كتابة المشاهد التدريبية للممثلين.

اكتب مشهداً تدريبياً احترافياً بالمواصفات التالية:
- النوع الدرامي: ${req.genreLabel}
- طول المشهد: ${req.lengthLabel} (حوالي ${req.lengthWords} كلمة)
- مستوى الصعوبة التمثيلية: ${req.levelLabel}
- عدد الشخصيات: ${req.chars}
${req.setting ? `- البيئة والإطار الزمني: ${req.setting}` : ""}
${req.instructions ? `- تعليمات خاصة: ${req.instructions}` : ""}

اكتب المشهد بالتنسيق التالي:

# عنوان المشهد

**الفكرة المحورية:** جملة واحدة تلخص جوهر المشهد

---
## الشخصيات

**[اسم الشخصية 1]** — [وصف الشخصية وحالتها النفسية]

---
## الموقع والمناخ

[وصف الموقع والجو العام]

---
## المشهد

[اسم الشخصية]: (إرشاد أداء) الحوار

---
## ملاحظات المخرج

- ملاحظة 1
- ملاحظة 2
- ملاحظة 3

اكتب بالعربية الفصحى البسيطة.`;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";
      let charCount = 0;

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the last partial line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const raw = line.slice(6).trim();
            if (raw === "[DONE]") break;
            try {
              const obj = JSON.parse(raw);
              if (obj.delta?.text) {
                fullText += obj.delta.text;
                charCount += obj.delta.text.length;
                
                const estProg = Math.min(85 + charCount / 40, 96);

                setScenarios((prev) =>
                  prev.map((s) => (s.id === id ? { ...s, content: fullText, progress: Math.min(s.progress + 3, estProg) } : s))
                );
              }
            } catch (e) {
              // Ignore parse errors on partial chunks
            }
          }
        }
      }

      setScenarios((prev) =>
        prev.map((s) => (s.id === id ? { ...s, content: fullText, progress: 100, status: "done" } : s))
      );
      setGenTotal((prev) => prev + 1);
      showToast("✦", "تم توليد السيناريو بنجاح!");
    } catch (err: any) {
      setScenarios((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "error", content: `⚠ حدث خطأ: ${err.message}` } : s))
      );
    }
  };

  const removeScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <>
      <BackgroundLayout />
      <Nav />
      <Hero genTotal={genTotal} />
      
      <div className="app-shell animate-[heroFadeUp_0.8s_0.9s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 grid grid-cols-1 md:grid-cols-[380px_1fr] gap-6 max-w-7xl mx-auto px-7 pb-24 items-start relative z-10 hidden md:grid mt-10">
        <ControlPanel onGenerate={handleGenerate} genCount={genTotal} />
        <ScenarioOutput
          scenarios={scenarios}
          onRemove={removeScenario}
          onCopy={() => showToast("✓", "تم نسخ السيناريو!")}
        />
      </div>

      <div className="md:hidden opacity-0 animate-[heroFadeUp_0.8s_0.9s_cubic-bezier(0.16,1,0.3,1)_forwards] block max-w-7xl mx-auto px-4 pb-24 items-start relative z-10">
        <ControlPanel onGenerate={handleGenerate} genCount={genTotal} />
        <div className="h-6"></div>
        <ScenarioOutput
          scenarios={scenarios}
          onRemove={removeScenario}
          onCopy={() => showToast("✓", "تم نسخ السيناريو!")}
        />
      </div>

      <Toast {...toast} />
    </>
  );
}
