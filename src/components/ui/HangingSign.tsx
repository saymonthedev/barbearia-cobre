"use client";

import { useEffect, useState } from "react";
import { formatTime, weekdayNames } from "@/data/hours";
import { openStatus } from "@/lib/schedule";
import { cn } from "@/lib/style";

type Status = ReturnType<typeof openStatus>;

/** Placa de porta pendurada num prego, que mostra se a barbearia está aberta agora. */
export function HangingSign() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(openStatus());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const open = status?.open ?? false;
  const detail = !status
    ? "Ter a sáb"
    : status.open
      ? `fecha às ${formatTime(status.closesAt)}`
      : `abre ${status.inDays === 0 ? "hoje" : status.inDays === 1 ? "amanhã" : weekdayNames[status.nextWeekday].toLowerCase()} às ${formatTime(status.nextOpen)}`;

  return (
    <div className="relative mx-auto flex w-[17rem] flex-col items-center" role="status" aria-live="polite">
      {/* prego */}
      <span aria-hidden="true" className="relative z-10 size-3.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f3c9a8,#6e371d)] shadow-[0_2px_3px_rgb(0_0_0/0.7)]" />
      <div className="sign-swing -mt-1.5 flex w-full flex-col items-center">
        {/* cordão */}
        <svg viewBox="0 0 200 60" className="h-14 w-[12.5rem]" aria-hidden="true">
          <path d="M100 4 L22 58 M100 4 L178 58" stroke="#b9a68b" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
        <div
          className={cn(
            "relative -mt-1 w-full rounded-[6px] px-6 pt-5 pb-6 text-center shadow-[0_30px_50px_-20px_rgb(0_0_0/0.95)] transition-colors duration-700",
            open ? "bg-[linear-gradient(180deg,#d48a5c,#a85d35)] text-ink-950" : "bg-[linear-gradient(180deg,#2c241c,#18140f)] text-bone",
          )}
        >
          <span aria-hidden="true" className="absolute top-2.5 left-4 size-2 rounded-full bg-black/40" />
          <span aria-hidden="true" className="absolute top-2.5 right-4 size-2 rounded-full bg-black/40" />
          <span className="sign block text-[0.625rem] tracking-[0.42em] opacity-70">Barbearia Cobre</span>
          <span className="display mt-2 block text-[3.25rem] leading-none tracking-[-0.02em]">{status ? (open ? "Aberto" : "Fechado") : "· · ·"}</span>
          <span className={cn("display-italic mt-2 block text-xl", open ? "text-ink-950/80" : "text-copper-300")}>{detail}</span>
        </div>
      </div>
    </div>
  );
}
