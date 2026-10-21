import { CalendarPlus } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { BookButton } from "@/components/ui/BookButton";
import { barbers } from "@/data/barbers";
import { cn, delay } from "@/lib/style";

/** "Naipes" da casa: cada profissional é representado pela ferramenta que mais usa. */
const suits: Record<string, ReactNode> = {
  rafael: (
    // máquina
    <path d="M8 3h8v4l-1 1v11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V8L8 7zM8 5h8M10 11h4" />
  ),
  jorge: (
    // navalha
    <path d="M4 18 16 6l3 1-1 3L6 20H4zM14 8l2 2" />
  ),
  bruna: (
    // tesoura
    <path d="M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.5 7.5 20 19M8.5 16.5 20 5" />
  ),
};

function Suit({ id, className }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {suits[id]}
    </svg>
  );
}

const fan = ["lg:-rotate-[6deg] lg:translate-y-8 lg:hover:translate-y-4", "lg:z-10 lg:-translate-y-2 lg:hover:-translate-y-4", "lg:rotate-[6deg] lg:translate-y-8 lg:hover:translate-y-4"];

export function Team() {
  return (
    <section id="equipe" aria-labelledby="equipe-title" className="relative overflow-hidden py-24 sm:py-32">
      {/* Feltro verde da mesa de carteado, bem escurecido. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-1/3 bottom-0 -z-10 bg-[radial-gradient(60rem_30rem_at_50%_30%,rgb(127_179_163/0.08),transparent_70%)]" />
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center" data-reveal>
            A equipe
          </p>
          <h2 id="equipe-title" className="display mt-6 text-[clamp(2.75rem,6vw,4.75rem)]" data-reveal style={delay(80)}>
            Escolha a sua <span className="display-italic">carta.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-bone-muted text-pretty" data-reveal style={delay(140)}>
            Três profissionais, três mãos diferentes. Cada carta mostra o naipe de quem a carrega: a ferramenta preferida.
          </p>
        </div>

        <ul className="no-scrollbar -mx-5 mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-8 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:justify-center lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0">
          {barbers.map((barber, index) => (
            <li
              key={barber.id}
              className={cn(
                "w-[78vw] max-w-[22rem] shrink-0 snap-center transition-[transform] duration-700 ease-out-expo lg:w-[21rem] lg:max-w-none lg:mx-3",
                "lg:hover:z-20 lg:hover:rotate-0 lg:focus-within:z-20 lg:focus-within:rotate-0",
                fan[index],
              )}
            >
              <div data-reveal style={delay(index * 110)}>
              <article className="card-face relative rounded-[18px] p-3 pb-5">
                {/* Índices de canto, como numa carta. */}
                <div aria-hidden="true" className="absolute top-4 left-4 z-10 flex flex-col items-center text-paper-ink">
                  <span className="display text-2xl leading-none">{barber.name[0]}</span>
                  <Suit id={barber.id} className="mt-1 size-4 text-copper-700" />
                </div>
                <div aria-hidden="true" className="absolute right-4 bottom-4 z-10 flex rotate-180 flex-col items-center text-paper-ink">
                  <span className="display text-2xl leading-none">{barber.name[0]}</span>
                  <Suit id={barber.id} className="mt-1 size-4 text-copper-700" />
                </div>

                <div className="relative mx-7 mt-7 aspect-[4/5] overflow-hidden rounded-[10px] bg-ink-800 ring-1 ring-paper-ink/20">
                  <Image
                    src={barber.photo}
                    alt={`${barber.name}, ${barber.role.toLowerCase()} da Barbearia Cobre`}
                    placeholder="blur"
                    sizes="(min-width: 1024px) 18rem, 70vw"
                    className="h-full w-full object-cover"
                    style={{ objectPosition: barber.focus }}
                  />
                  <span className="sign absolute top-3 right-3 rounded-full bg-paper px-2.5 py-1 text-[0.625rem] text-paper-ink">
                    {barber.role}
                  </span>
                </div>

                <div className="mx-7 mt-5 text-paper-ink">
                  <h3 className="display text-[1.875rem] leading-none">
                    {barber.name.split(" ")[0]} <span className="display-italic text-copper-700">{barber.name.split(" ").slice(1).join(" ")}</span>
                  </h3>
                  <p className="sign mt-2.5 flex items-center gap-2 text-[0.6875rem] text-paper-muted">
                    <Suit id={barber.id} className="size-3.5 text-copper-700" />
                    {barber.specialty}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-paper-muted text-pretty">{barber.bio}</p>
                  <BookButton
                    request={{ barberId: barber.id }}
                    className="btn mt-5 min-h-12 w-full bg-paper-ink text-[0.8125rem] text-paper hover:bg-copper-700"
                  >
                    <CalendarPlus aria-hidden="true" className="size-4" />
                    Agendar com {barber.nickname}
                  </BookButton>
                </div>
              </article>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
