"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import barba from "@/assets/photos/barba.jpg";
import degrade from "@/assets/photos/degrade.jpg";
import espaco from "@/assets/photos/espaco.jpg";
import ferramentas from "@/assets/photos/ferramentas.jpg";
import navalha from "@/assets/photos/navalha.jpg";
import { cn } from "@/lib/style";

type Beat = { title: string; text: string; time: string; photo: StaticImageData; alt: string; position?: string };

const beats: Beat[] = [
  {
    title: "Conversa",
    text: "Antes da máquina, a pergunta: o que você quer, como costuma pentear, quanto tempo entre um corte e outro.",
    time: "5 min",
    photo: espaco,
    alt: "Cadeiras de couro e espelhos redondos da barbearia",
    position: "40% 50%",
  },
  {
    title: "Preparo",
    text: "Lavagem com água morna, toalha no ombro e as ferramentas esterilizadas na sua frente.",
    time: "10 min",
    photo: ferramentas,
    alt: "Tesoura, navalha, pente e pincel sobre uma mesa de madeira",
  },
  {
    title: "Corte",
    text: "Máquina e tesoura no seu ritmo. O degradê é feito em etapas, conferindo no espelho a cada passada.",
    time: "30 min",
    photo: degrade,
    alt: "Perfil de um cliente com degradê baixo recém-feito",
    position: "50% 35%",
  },
  {
    title: "Navalha",
    text: "Toalha quente para abrir os poros, espuma no pincel e a navalha no fio. Sem pressa e sem ardência.",
    time: "25 min",
    photo: navalha,
    alt: "Barbeiro passando a navalha com espuma no rosto de um cliente",
  },
  {
    title: "Acabamento",
    text: "Desenho da barba, óleo, finalização no cabelo e o espelho de mão para você aprovar de todos os ângulos.",
    time: "15 min",
    photo: barba,
    alt: "Barbeiro aparando uma barba cheia com tesoura e pente",
    position: "60% 50%",
  },
];

/**
 * No desktop, a seção fica presa na tela e as etapas passam na horizontal
 * conforme a rolagem. No celular (ou com movimento reduzido), vira um
 * carrossel de arrastar com indicador próprio.
 */
export function Ritual() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const apply = () => setPinned(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = section.current;
      const tr = track.current;
      if (!el || !tr) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      const distance = tr.scrollWidth - window.innerWidth;
      tr.style.transform = `translate3d(${-progress * distance}px,0,0)`;
      el.style.setProperty("--progress", progress.toFixed(4));
      setActive(Math.min(beats.length - 1, Math.round(progress * (beats.length - 1))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pinned]);

  const onSwipe = () => {
    const el = scroller.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    setActive(Math.round(el.scrollLeft / (card.offsetWidth + 16)));
  };

  const goTo = (index: number) => {
    const el = scroller.current;
    const card = el?.children[index] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  const heading = (
    <div className="max-w-md">
      <p className="eyebrow">O ritual</p>
      <h2 id="ritual-title" className="display mt-6 text-[clamp(2.75rem,5.5vw,4.75rem)]">
        Cinco tempos, <span className="display-italic">sem pular nenhum.</span>
      </h2>
      <p className="mt-6 leading-relaxed text-bone-muted text-pretty">
        É o que acontece no Ritual Cobre, nosso serviço completo. Cada etapa tem o seu tempo, e nenhuma é pulada.
      </p>
    </div>
  );

  if (pinned) {
    return (
      <section ref={section} id="ritual" aria-labelledby="ritual-title" className="relative h-[460vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div ref={track} className="flex w-max items-center gap-10 pr-[8vw] pl-[max(3rem,calc((100vw-82rem)/2+3rem))] will-change-transform">
            <div className="w-[28rem] shrink-0">{heading}</div>
            {beats.map((beat, index) => (
              <BeatCard key={beat.title} beat={beat} index={index} active={active === index} />
            ))}
          </div>
          {/* Linha do tempo do ritual. */}
          <div className="container-page mt-12">
            <div className="relative h-px bg-(--line-strong)" aria-hidden="true">
              <div className="absolute inset-y-0 left-0 w-full origin-left bg-copper" style={{ transform: "scaleX(var(--progress, 0))" }} />
            </div>
            <ol className="mt-4 grid grid-cols-5">
              {beats.map((beat, index) => (
                <li key={beat.title} className={cn("sign text-[0.6875rem] transition-colors", active >= index ? "text-copper-300" : "text-bone-subtle")}>
                  {String(index + 1).padStart(2, "0")} · {beat.title}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="ritual" aria-labelledby="ritual-title" className="py-24 sm:py-32">
      <div className="container-page">{heading}</div>
      <div
        ref={scroller}
        onScroll={onSwipe}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:scroll-px-8 sm:px-8"
      >
        {beats.map((beat, index) => (
          <div key={beat.title} className="w-[82vw] max-w-[24rem] shrink-0 snap-start">
            <BeatCard beat={beat} index={index} active={active === index} compact />
          </div>
        ))}
      </div>
      <div className="container-page mt-6 flex items-center gap-2" role="group" aria-label="Etapas do ritual">
        {beats.map((beat, index) => (
          <button
            key={beat.title}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Etapa ${index + 1}: ${beat.title}`}
            aria-current={active === index ? "step" : undefined}
            className="group grid h-8 flex-1 place-items-center"
          >
            <span className={cn("h-0.5 w-full rounded-full transition-colors duration-500", active >= index ? "bg-copper" : "bg-(--line-strong)")} />
          </button>
        ))}
      </div>
    </section>
  );
}

function BeatCard({ beat, index, active, compact }: { beat: Beat; index: number; active: boolean; compact?: boolean }) {
  return (
    <article
      className={cn(
        "group relative shrink-0 transition-[opacity,transform] duration-700 ease-out-expo",
        compact ? "w-full" : "w-[min(30rem,38vw)]",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-ink-800 transition-[filter,opacity] duration-700",
          compact ? "aspect-[4/5]" : "aspect-[4/5] max-h-[58svh] w-full",
          !compact && !active && "opacity-45 grayscale-[0.6]",
        )}
      >
        <Image
          src={beat.photo}
          alt={beat.alt}
          placeholder="blur"
          sizes="(min-width: 1024px) 30rem, 82vw"
          className={cn("h-full w-full object-cover transition-transform duration-[1.6s] ease-out-expo", active && "scale-[1.04]")}
          style={{ objectPosition: beat.position }}
        />
        <div className="photo-grade" />
        <span className="display absolute top-4 left-5 text-[5.5rem] leading-none text-bone/90 [text-shadow:0_10px_40px_rgb(0_0_0/0.6)]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="sign absolute right-5 bottom-5 bg-ink-950/85 px-3 py-2 text-[0.6875rem] normal-case text-bone-soft">
          {beat.time}
        </span>
      </div>
      <h3 className="display mt-6 text-[2rem] leading-none">{beat.title}</h3>
      <p className="mt-3 max-w-[26rem] text-[0.9375rem] leading-relaxed text-bone-muted text-pretty">{beat.text}</p>
    </article>
  );
}
