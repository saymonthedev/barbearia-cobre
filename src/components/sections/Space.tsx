import { Coffee, Accessibility, Wifi, Beer } from "lucide-react";
import Image from "next/image";
import espaco from "@/assets/photos/espaco.jpg";
import { delay } from "@/lib/style";

const amenities = [
  { icon: Coffee, label: "Café passado na hora" },
  { icon: Beer, label: "Cerveja gelada" },
  { icon: Wifi, label: "Wi-Fi para esperar" },
  { icon: Accessibility, label: "Acesso sem degraus" },
];

export function Space() {
  return (
    <section id="espaco" aria-labelledby="espaco-title" className="relative">
      <div className="relative h-[34rem] overflow-hidden sm:h-[40rem] lg:h-[46rem]">
        <Image
          src={espaco}
          alt="Interior da barbearia: cadeiras de couro em fila, espelhos redondos com moldura dourada, parede de tijolos e luminárias de cobre"
          placeholder="blur"
          sizes="100vw"
          className="h-full w-full object-cover object-[50%_45%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_9_7/0.35)_0%,rgb(11_9_7/0.1)_35%,rgb(11_9_7/0.92)_100%)]" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="container-page pb-12 sm:pb-16">
            <p className="eyebrow" data-reveal>
              O espaço
            </p>
            <h2 id="espaco-title" className="display mt-6 max-w-3xl text-[clamp(2.5rem,6vw,4.75rem)] text-balance" data-reveal style={delay(80)}>
              Um lugar para <span className="display-italic">desacelerar.</span>
            </h2>
          </div>
        </div>
      </div>
      <div className="border-b border-(--line) bg-ink-900">
        <ul className="container-page grid grid-cols-2 md:grid-cols-4">
          {amenities.map(({ icon: Icon, label }, index) => (
            <li
              key={label}
              data-reveal
              style={delay(index * 70)}
              className="flex items-center gap-4 border-(--line) py-7 max-md:odd:border-r max-md:[&:nth-child(-n+2)]:border-b md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"
            >
              <Icon aria-hidden="true" className="size-6 shrink-0 text-copper-300 max-md:ml-1" strokeWidth={1.5} />
              <span className="text-[0.9375rem] text-bone-soft">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
