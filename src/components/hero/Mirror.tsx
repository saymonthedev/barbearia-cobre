"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import hero from "@/assets/photos/hero-corte.jpg";

/**
 * Espelho redondo de barbearia. Com o mouse, a "reflexão" desliza para o lado
 * oposto e o brilho do vidro acompanha o cursor, como num espelho de verdade.
 */
export function Mirror() {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.setProperty("--mx", x.toFixed(3));
    ref.current.style.setProperty("--my", y.toFixed(3));
  };

  const onLeave = () => {
    ref.current?.style.setProperty("--mx", "0");
    ref.current?.style.setProperty("--my", "0");
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="mirror relative aspect-square w-full">
      {/* Moldura de cobre com bisel. */}
      <div aria-hidden="true" className="mirror-frame absolute inset-0 rounded-full" />
      <div className="absolute inset-[4.2%] overflow-hidden rounded-full bg-ink-800 shadow-[inset_0_0_60px_rgb(0_0_0/0.85)]">
        <div className="mirror-reflection absolute -inset-[6%]">
          <Image
            src={hero}
            alt="Reflexo no espelho: barbeiro finalizando um degradê em um cliente na cadeira de couro"
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 40rem, 92vw"
            className="hero-photo h-full w-full object-cover object-[48%_38%]"
          />
        </div>
        {/* Vidro: vinheta, tom quente e o brilho que segue o cursor. */}
        <div aria-hidden="true" className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_45%,transparent_52%,rgb(11_9_7/0.65)_100%)]" />
        <div aria-hidden="true" className="mirror-glare absolute inset-0 rounded-full" />
      </div>
      {/* Parafusos da moldura. */}
      {[0, 90, 180, 270].map((deg) => (
        <span
          key={deg}
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -mt-1 -ml-1 size-2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f3c9a8,#7a3f22)] shadow-[0_1px_2px_rgb(0_0_0/0.7)]"
          style={{ transform: `rotate(${deg + 45}deg) translateY(calc(-50cqw + 2.1cqw))` }}
        />
      ))}
    </div>
  );
}
