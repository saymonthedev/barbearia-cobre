"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import barba from "@/assets/photos/barba.jpg";
import conversa from "@/assets/photos/conversa.jpg";
import degrade from "@/assets/photos/degrade.jpg";
import ferramentas from "@/assets/photos/ferramentas.jpg";
import navalha from "@/assets/photos/navalha.jpg";
import { cn } from "@/lib/style";

type Beat = { title: string; text: string; time: string; photo: StaticImageData; alt: string; position?: string };

const beats: Beat[] = [
  {
    title: "Conversa",
    text: "Antes da máquina, a pergunta: o que você quer, como costuma pentear, quanto tempo entre um corte e outro.",
    time: "5 min",
    photo: conversa,
    alt: "Barbeiro conversando com o cliente pelo espelho antes do corte",
    position: "40% 45%",
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

/** Largura que a foto precisa ter para cobrir o cartão 4:5 sem ser ampliada (fotos horizontais são cortadas nas laterais). */
function sizesFor(photo: StaticImageData) {
  const scale = Math.max(1, photo.width / photo.height / (4 / 5));
  return `(min-width: 1024px) ${Math.round(26 * scale)}rem, ${Math.round(82 * scale)}vw`;
}

/**
 * Carrossel de arrastar: com o mouse (clicar e puxar), com o dedo, pelas
 * setas ou pelo teclado. A rolagem da página nunca é sequestrada.
 */
export function Ritual() {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });

  const cards = () => Array.from(scroller.current?.children ?? []) as HTMLElement[];

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const list = Array.from(el.children) as HTMLElement[];
    const anchor = el.scrollLeft + 1;
    let index = 0;
    list.forEach((card, i) => {
      if (card.offsetLeft - list[0].offsetLeft <= anchor) index = i;
    });
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setActive(end ? list.length - 1 : index);
    setEdges({ start: el.scrollLeft <= 2, end });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const goTo = (index: number) => {
    const el = scroller.current;
    const list = cards();
    const card = list[Math.max(0, Math.min(list.length - 1, index))];
    if (!el || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: card.offsetLeft - list[0].offsetLeft, behavior: reduce ? "auto" : "smooth" });
  };

  // Arrastar com o mouse. No toque, a rolagem nativa (com snap) já faz isso.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || !scroller.current) return;
    drag.current = { x: event.clientX, left: scroller.current.scrollLeft, moved: false };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const el = scroller.current;
    if (!state || !el) return;
    const dx = event.clientX - state.x;
    if (!state.moved && Math.abs(dx) > 4) {
      state.moved = true;
      setDragging(true);
      el.setPointerCapture(event.pointerId);
    }
    if (state.moved) el.scrollLeft = state.left - dx;
  };

  const endDrag = () => {
    const state = drag.current;
    drag.current = null;
    if (!state?.moved) return;
    setDragging(false);
    // Encaixa no cartão mais próximo ao soltar.
    const el = scroller.current;
    if (!el) return;
    const list = cards();
    const base = list[0]?.offsetLeft ?? 0;
    let nearest = 0;
    list.forEach((card, i) => {
      if (Math.abs(card.offsetLeft - base - el.scrollLeft) < Math.abs(list[nearest].offsetLeft - base - el.scrollLeft)) nearest = i;
    });
    goTo(nearest);
  };

  return (
    <section id="ritual" aria-labelledby="ritual-title" className="overflow-hidden py-24 sm:py-32">
      <div className="container-page flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-xl">
          <p className="eyebrow" data-reveal>
            O ritual
          </p>
          <h2 id="ritual-title" className="display mt-6 text-[clamp(2.75rem,5.5vw,4.75rem)]" data-reveal>
            Cinco tempos, <span className="display-italic">sem pular nenhum.</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-bone-muted text-pretty" data-reveal>
            É o que acontece no Ritual Cobre, nosso serviço completo. Cada etapa tem o seu tempo, e nenhuma é pulada.
          </p>
        </div>
        <div className="flex items-center gap-4" data-reveal>
          <p className="sign hidden text-[0.6875rem] text-bone-subtle lg:block">Arraste para o lado</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={edges.start}
              aria-label="Etapa anterior"
              aria-controls="ritual-trilho"
              className="grid size-12 place-items-center rounded-full border border-(--line-strong) text-bone transition-[background-color,color,border-color,opacity] hover:border-copper hover:text-copper-200 disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={edges.end}
              aria-label="Próxima etapa"
              aria-controls="ritual-trilho"
              className="grid size-12 place-items-center rounded-full border border-copper bg-copper text-ink-950 transition-[background-color,opacity] hover:bg-copper-300 disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        id="ritual-trilho"
        ref={scroller}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Etapas do Ritual Cobre"
        tabIndex={0}
        onScroll={update}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(event) => dragging && event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
        className={cn(
          "no-scrollbar mt-14 flex gap-5 overflow-x-auto overscroll-x-contain px-(--edge) pb-2 [--edge:1.25rem] sm:[--edge:2rem] lg:[--edge:max(3rem,calc((100vw-82rem)/2+3rem))]",
          "scroll-px-(--edge) select-none focus-visible:outline-offset-[-2px]",
          dragging ? "cursor-grabbing" : "cursor-grab snap-x snap-mandatory",
        )}
      >
        {beats.map((beat, index) => (
          <article
            key={beat.title}
            aria-roledescription="etapa"
            aria-label={`${index + 1} de ${beats.length}: ${beat.title}`}
            className="w-[82vw] max-w-[24rem] shrink-0 snap-start lg:w-[26rem] lg:max-w-none"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-ink-800">
              <Image
                src={beat.photo}
                alt={beat.alt}
                placeholder="blur"
                quality={85}
                draggable={false}
                sizes={sizesFor(beat.photo)}
                className={cn(
                  "pointer-events-none h-full w-full object-cover transition-transform duration-[1.6s] ease-out-expo",
                  active === index && "scale-[1.03]",
                )}
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
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-bone-muted text-pretty">{beat.text}</p>
          </article>
        ))}
      </div>

      {/* Linha do tempo: mostra onde você está e leva direto a cada etapa. */}
      <div className="container-page mt-10">
        <ol className="grid grid-cols-5 gap-2">
          {beats.map((beat, index) => (
            <li key={beat.title}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-current={active === index ? "step" : undefined}
                aria-controls="ritual-trilho"
                className="group flex w-full flex-col gap-3 pt-2 text-left"
              >
                <span className={cn("h-0.5 w-full rounded-full transition-colors duration-500", active >= index ? "bg-copper" : "bg-(--line-strong)")} />
                <span
                  className={cn(
                    "sign hidden text-[0.6875rem] transition-colors sm:block",
                    active === index ? "text-copper-300" : "text-bone-subtle group-hover:text-bone-soft",
                  )}
                >
                  {String(index + 1).padStart(2, "0")} · {beat.title}
                </span>
                <span className="sr-only sm:hidden">Etapa {index + 1}: {beat.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
