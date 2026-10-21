"use client";

import { CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/style";

/** Barra fixa no celular: aparece depois do topo e some quando a comanda está na tela. */
export function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const booking = document.getElementById("agendar");
    if (!hero || !booking) return;
    const state = { pastHero: false, onBooking: false };
    const update = () => setVisible(state.pastHero && !state.onBooking);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) state.pastHero = !entry.isIntersecting;
        if (entry.target === booking) state.onBooking = entry.isIntersecting;
      }
      update();
    });
    observer.observe(hero);
    observer.observe(booking);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-(--line) bg-ink-950/94 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-500 ease-out-expo sm:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!visible}
    >
      <a href="#agendar" tabIndex={visible ? 0 : -1} className="btn btn-copper w-full">
        <CalendarCheck aria-hidden="true" className="size-[18px]" />
        Agendar horário
      </a>
    </div>
  );
}
