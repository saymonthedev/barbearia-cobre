import { testimonials } from "@/data/testimonials";
import { cn, delay } from "@/lib/style";

const layout = [
  { tilt: "-rotate-[3deg]", tape: "rotate-[-6deg] left-8", paper: "bg-[#f3ebdd]" },
  { tilt: "rotate-[2deg] md:translate-y-10", tape: "rotate-[4deg] right-10", paper: "bg-[#efe2c4]" },
  { tilt: "-rotate-[1.5deg]", tape: "rotate-[-2deg] left-1/2 -translate-x-1/2", paper: "bg-[#e9e1d3]" },
];

/** Depoimentos como bilhetes colados no canto do espelho. */
export function Notes() {
  return (
    <section aria-labelledby="recados-title" className="relative overflow-hidden border-y border-(--line) bg-ink-900 py-24 sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 [background:repeating-linear-gradient(90deg,rgb(255_255_255/0.015)_0_1px,transparent_1px_88px)]" />
      <div className="container-page relative">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow" data-reveal>
              Recados no espelho
            </p>
            <h2 id="recados-title" className="display mt-6 text-[clamp(2.75rem,6vw,4.75rem)]" data-reveal style={delay(80)}>
              Quem senta, <span className="display-italic">volta.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-bone-subtle md:text-right" data-reveal style={delay(140)}>
            Depoimentos fictícios, escritos para este projeto conceitual.
          </p>
        </div>

        <ul className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {testimonials.map((item, index) => (
            <li key={item.name} data-reveal style={delay(index * 120)}>
              <figure
                className={cn(
                  "relative px-7 pt-10 pb-7 text-paper-ink shadow-[0_26px_50px_-22px_rgb(0_0_0/0.9)] transition-transform duration-700 ease-out-expo hover:rotate-0",
                  layout[index].tilt,
                  layout[index].paper,
                )}
              >
                <span aria-hidden="true" className={cn("absolute -top-3 h-7 w-24 bg-bone/45 shadow-sm", layout[index].tape)} />
                {/* pauta do bloco de recados */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-8 bottom-16 [background:repeating-linear-gradient(180deg,transparent_0_33px,rgb(28_23_17/0.1)_33px_34px)]"
                />
                <blockquote className="relative font-(family-name:--font-hand) text-[1.7rem] leading-[34px] text-[#2a2118]">
                  {item.quote}
                </blockquote>
                <figcaption className="relative mt-6 flex items-center justify-between gap-4 border-t border-dashed border-paper-ink/25 pt-4">
                  <span className="font-semibold">{item.name}</span>
                  <span className="sign text-right text-[0.625rem] text-paper-muted">{item.detail}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
