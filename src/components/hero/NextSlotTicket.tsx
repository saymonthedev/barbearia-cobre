"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { barbers } from "@/data/barbers";
import { weekdayNames } from "@/data/hours";
import { requestBooking } from "@/lib/booking-events";
import { nextFreeSlot } from "@/lib/next-slot";
import { nowInShop } from "@/lib/schedule";
import { cn } from "@/lib/style";

type Next = ReturnType<typeof nextFreeSlot>;

/** Bilhete preso na moldura do espelho com o próximo horário livre. */
export function NextSlotTicket({ className }: { className?: string }) {
  const [next, setNext] = useState<{ value: Next; todayKey: string } | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setNext({ value: nextFreeSlot(now), todayKey: nowInShop(now).key });
    };
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const value = next?.value;
  const barber = value ? barbers.find((b) => b.id === value.barberId) : null;
  const when = value ? (value.day.key === next?.todayKey ? "hoje" : weekdayNames[value.day.weekday].toLowerCase()) : "";

  return (
    <div className={cn("paper relative w-[15.5rem] p-4 pb-3.5 shadow-[0_24px_50px_-18px_rgb(0_0_0/0.9)]", className)}>
      <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[3deg] bg-bone/50" />
      <p className="sign flex items-center gap-2 text-[0.625rem] tracking-[0.26em] text-paper-muted">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-copper-700 motion-safe:animate-pulse" />
        Próximo horário livre
      </p>
      <p className="mt-2.5 flex items-baseline gap-2" aria-live="polite">
        <span className="display text-[2.6rem] leading-none">{value ? value.label : "--:--"}</span>
        <span className="display-italic text-xl text-copper-700">{when}</span>
      </p>
      <p className="mt-1.5 text-sm text-paper-muted">{barber ? `com ${barber.nickname} · 45 min` : "Consultando a agenda…"}</p>
      <button
        type="button"
        disabled={!value}
        onClick={() => value && requestBooking({ barberId: value.barberId, dayKey: value.day.key, slot: value.minutes })}
        className="sign mt-3.5 flex w-full items-center justify-between border-t border-dashed border-paper-ink/30 pt-3 text-[0.75rem] text-paper-ink transition-colors hover:text-copper-700 disabled:opacity-40"
      >
        Reservar esse horário
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
