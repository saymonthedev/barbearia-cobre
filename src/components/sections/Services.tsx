import type { CSSProperties } from "react";
import { BookButton } from "@/components/ui/BookButton";
import { categories, formatDuration, formatPrice, services, type ServiceCategory } from "@/data/services";
import { delay } from "@/lib/style";

/** Pequena imperfeição estável por letra: no letreiro de feltro nada fica 100% alinhado. */
function jitter(seed: string, i: number) {
  let h = 2166136261;
  const text = `${seed}:${i}`;
  for (let k = 0; k < text.length; k++) h = Math.imul(h ^ text.charCodeAt(k), 16777619);
  const r = ((h >>> 0) % 1000) / 1000;
  const r2 = ((h >>> 10) % 1000) / 1000;
  return { "--rot": `${((r - 0.5) * 4.2).toFixed(2)}deg`, "--y": `${((r2 - 0.5) * 2.2).toFixed(2)}px` } as CSSProperties;
}

function Letters({ text, seed, className }: { text: string; seed: string; className?: string }) {
  return (
    <span aria-hidden="true" className={className}>
      {[...text].map((char, i) =>
        char === " " ? (
          <span key={i} className="inline-block w-[0.42em]" />
        ) : (
          <span key={i} className="board-letter" style={jitter(seed, i)}>
            {char}
          </span>
        ),
      )}
    </span>
  );
}

const columns: ServiceCategory[][] = [
  ["cabelo", "barba"],
  ["combos", "extras"],
];

export function Services() {
  return (
    <section id="servicos" aria-labelledby="servicos-title" className="relative py-24 sm:py-32">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow" data-reveal>
              O letreiro
            </p>
            <h2 id="servicos-title" className="display mt-6 text-[clamp(2.75rem,6vw,4.75rem)]" data-reveal style={delay(80)}>
              Serviços <span className="display-italic">da casa.</span>
            </h2>
          </div>
          <p className="max-w-sm leading-relaxed text-bone-muted text-pretty md:text-right" data-reveal style={delay(140)}>
            Preço fechado, pago no Pix, cartão ou dinheiro. Toque numa linha do letreiro e ela vai direto para a sua comanda.
          </p>
        </div>

        <div className="board-frame mt-14" data-reveal="fade" style={delay(120)}>
          <div className="board grid gap-x-16 px-4 py-6 xs:px-6 sm:px-10 sm:py-10 lg:grid-cols-2">
            {columns.map((column, c) => (
              <div key={c} className={c === 1 ? "mt-(--row) lg:mt-0" : ""}>
                {column.map((id) => {
                  const category = categories.find((cat) => cat.id === id)!;
                  return (
                    <div key={id} className="mb-(--row) last:mb-0">
                      <h3 className="board-row justify-center text-copper-300">
                        <Letters text={`· ${category.label.toUpperCase()} ·`} seed={id} />
                        <span className="sr-only">{category.label}</span>
                      </h3>
                      <ul>
                        {services
                          .filter((s) => s.category === id)
                          .map((service) => (
                            <li key={service.id}>
                              <BookButton
                                request={{ serviceId: service.id }}
                                label={`${service.name}, ${formatPrice(service.price)}, ${formatDuration(service.duration)}. ${service.description} Adicionar à comanda.`}
                                className="board-row board-line justify-between"
                              >
                                <Letters text={service.board} seed={service.id} />
                                <Letters text={String(service.price)} seed={`${service.id}$`} className="text-copper-200" />
                              </BookButton>
                            </li>
                          ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="board-plate sign">Valores em reais · toque para agendar</p>
        </div>

        <ul className="mt-16 grid gap-px border border-(--line) bg-(--line) sm:grid-cols-3">
          {services
            .filter((s) => s.featured)
            .map((service, index) => (
              <li key={service.id} className="bg-ink-950 p-6 sm:p-7" data-reveal style={delay(index * 80)}>
                <p className="sign text-[0.6875rem] text-copper-300">
                  Da casa · <span className="normal-case">{formatDuration(service.duration)}</span>
                </p>
                <p className="display mt-3 text-[1.75rem] leading-tight">{service.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-bone-muted">{service.description}</p>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
