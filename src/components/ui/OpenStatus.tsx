"use client";

import { useEffect, useState } from "react";
import { formatTime, weekdayNames } from "@/data/hours";
import { openStatus } from "@/lib/schedule";
import { cn } from "@/lib/style";

type Status = ReturnType<typeof openStatus>;

function describe(status: Status) {
  if (status.open) return { tone: status.closingSoon ? "soon" : "open", text: `Aberto agora · fecha às ${formatTime(status.closesAt)}` };
  const when = status.inDays === 0 ? "hoje" : status.inDays === 1 ? "amanhã" : weekdayNames[status.nextWeekday].toLowerCase();
  return { tone: "closed", text: `Fechado · abre ${when} às ${formatTime(status.nextOpen)}` };
}

/** Situação da barbearia agora, no fuso de Brasília. Calculada só no navegador. */
export function OpenStatus({ className }: { className?: string }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(openStatus());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const info = status ? describe(status) : null;

  return (
    <p className={cn("inline-flex items-center gap-2.5 text-sm text-bone-soft", className)} aria-live="polite">
      <span
        aria-hidden="true"
        className={cn(
          "relative size-2 rounded-full",
          !info && "bg-bone-subtle",
          info?.tone === "open" && "bg-patina shadow-[0_0_0_4px_rgb(127_179_163/0.18)]",
          info?.tone === "soon" && "bg-copper-300 shadow-[0_0_0_4px_rgb(227_162_122/0.18)]",
          info?.tone === "closed" && "bg-bone-subtle",
        )}
      />
      <span className="min-w-[17ch]">{info ? info.text : "Ter a sáb · 08h às 21h"}</span>
    </p>
  );
}
