import { ArrowDownRight, ArrowRight, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { Mirror } from "@/components/hero/Mirror";
import { NextSlotTicket } from "@/components/hero/NextSlotTicket";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { site } from "@/config/site";
import { delay } from "@/lib/style";

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-(--header-h) lg:min-h-[100svh]"
    >
      {/* Parede: lambri escuro e a luz quente da arandela sobre o espelho. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 [background:repeating-linear-gradient(90deg,rgb(255_255_255/0.018)_0_1px,transparent_1px_88px)]"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 right-[8%] -z-10 h-[52rem] w-[52rem] max-w-full bg-[radial-gradient(closest-side,rgb(227_162_122/0.2),rgb(200_121_74/0.06)_55%,transparent)]"
      />
      {/* Rodapé de madeira da parede. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-24 border-t border-(--line) bg-[linear-gradient(180deg,#17120d,#0b0907)]" />

      <div className="container-page grid items-center gap-y-16 pt-8 pb-20 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-12 lg:gap-x-6 lg:pt-6 lg:pb-28">
        <div className="relative z-10 order-2 lg:order-1 lg:col-span-6">
          <p className="eyebrow hero-in">Barbearia · {site.address.city}</p>

          <h1 id="hero-title" className="display mt-7 text-[clamp(3.5rem,11vw,8.25rem)]">
            <span className="hero-in block" style={delay(80)}>
              Corte com
            </span>
            <span className="hero-in block" style={delay(160)}>
              <span className="display-italic pr-1 text-[1.06em] leading-[0.92]">ofício</span>
              <span className="text-copper">.</span>
            </span>
          </h1>

          <p className="hero-in mt-8 max-w-[30rem] text-lg leading-relaxed text-bone-soft text-pretty" style={delay(260)}>
            Degradê, tesoura e barba na navalha com toalha quente. Você escolhe a cadeira e o horário; o café já está passado.
          </p>

          <div className="hero-in mt-10 flex flex-wrap items-center gap-3" style={delay(340)}>
            <a href="#agendar" className="btn btn-copper">
              <CalendarCheck aria-hidden="true" className="size-[18px]" strokeWidth={2} />
              Agendar horário
            </a>
            <a href="#servicos" className="btn btn-ghost">
              Ver o letreiro
              <ArrowDownRight aria-hidden="true" className="size-[18px]" strokeWidth={2} />
            </a>
          </div>

          <OpenStatus className="hero-in mt-9" />

          <Link
            href="/"
            className="hero-in group mt-8 flex max-w-md items-center justify-between gap-4 border-t border-(--line) pt-5 text-sm text-bone-soft"
            style={delay(440)}
          >
            <span>
              <span className="sign mr-2 text-[0.6875rem] text-copper-300">Primeira vez?</span>
              Corte + barba por <span className="font-semibold text-bone">R$ 79</span>
            </span>
            <ArrowRight aria-hidden="true" className="size-4 text-copper-300 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-[min(34rem,86vw)] lg:order-2 lg:col-span-6 lg:max-w-[38rem] lg:justify-self-end">
          {/* Corrente que segura o espelho na parede. */}
          <div aria-hidden="true" className="absolute bottom-full left-1/2 h-[40vh] w-px bg-gradient-to-b from-transparent to-copper/50" />
          <div className="hero-in" style={delay(120)}>
            <Mirror />
          </div>
          <div className="hero-in absolute -bottom-12 -left-1 sm:-left-10 lg:bottom-6 lg:-left-24" style={delay(520)}>
            <div className="-rotate-[5deg]">
              <NextSlotTicket />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
