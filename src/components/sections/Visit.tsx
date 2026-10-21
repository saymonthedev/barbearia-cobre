import { MapPin } from "lucide-react";
import { HangingSign } from "@/components/ui/HangingSign";
import { site } from "@/config/site";
import { hoursTable } from "@/data/hours";
import { delay } from "@/lib/style";

export function Visit() {
  const { street, district, city, state } = site.address;
  return (
    <section id="visite" aria-labelledby="visite-title" className="py-24 sm:py-32">
      <div className="container-page grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="eyebrow" data-reveal>
            Visite
          </p>
          <h2 id="visite-title" className="display mt-6 text-[clamp(2.75rem,6vw,4.75rem)]" data-reveal style={delay(80)}>
            Passa <span className="display-italic">aqui.</span>
          </h2>

          <div className="mt-12" data-reveal style={delay(140)}>
            <HangingSign />
          </div>

          <address className="mt-12 flex gap-4 not-italic" data-reveal style={delay(200)}>
            <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-copper-300" strokeWidth={1.6} />
            <span className="text-lg leading-relaxed text-bone-soft">
              {street}
              <br />
              {district}, {city} · {state}
            </span>
          </address>
        </div>

        <div className="lg:col-span-7" data-reveal="fade" style={delay(120)}>
          <StreetMap />
          <table className="mt-8 w-full">
            <caption className="sign mb-3 text-left text-[0.6875rem] text-bone-subtle">Horário de funcionamento</caption>
            <tbody className="grid gap-x-10 sm:grid-cols-2">
              {hoursTable.map((row) => (
                <tr key={row.days} className="flex items-baseline justify-between border-b border-(--line) py-4">
                  <th scope="row" className="text-left font-normal text-bone-soft">
                    {row.days}
                  </th>
                  <td className={`sign text-lg normal-case ${row.hours === "Fechado" ? "text-bone-subtle" : "text-bone"}`}>{row.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <a href="#agendar" className="btn btn-copper mt-10 w-full sm:w-auto">
            Agendar horário
          </a>
        </div>
      </div>
    </section>
  );
}

/** Mapa ilustrado (o endereço é fictício). */
function StreetMap() {
  return (
    <figure className="relative overflow-hidden border border-(--line) bg-ink-900">
      <svg viewBox="0 0 640 520" className="block h-auto w-full" role="img" aria-labelledby="mapa-titulo">
        <title id="mapa-titulo">Mapa ilustrado com a localização da Barbearia Cobre no Centro</title>
        <defs>
          <pattern id="quadras" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M0 16 16 0" stroke="rgb(239 230 216 / 0.05)" strokeWidth="1" />
          </pattern>
          <radialGradient id="brilho" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#c8794a" stopOpacity="0.45" />
            <stop offset="1" stopColor="#c8794a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="640" height="520" fill="#120f0c" />
        {/* quadras */}
        {[
          [30, 30, 150, 110], [210, 30, 170, 110], [410, 30, 200, 110],
          [30, 170, 150, 140], [410, 170, 200, 140],
          [30, 340, 150, 150], [210, 340, 170, 150], [410, 340, 200, 150],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill="url(#quadras)" stroke="rgb(239 230 216 / 0.08)" />
        ))}
        {/* praça */}
        <rect x="210" y="170" width="170" height="140" rx="6" fill="rgb(127 179 163 / 0.08)" stroke="rgb(127 179 163 / 0.25)" />
        <circle cx="295" cy="240" r="28" fill="none" stroke="rgb(127 179 163 / 0.35)" strokeDasharray="3 5" />
        {/* rio */}
        <path d="M0 500 C 140 470, 220 520, 360 492 S 560 470, 640 488" fill="none" stroke="rgb(127 179 163 / 0.35)" strokeWidth="10" strokeLinecap="round" />
        {/* rua principal */}
        <path d="M0 325 H640" stroke="rgb(239 230 216 / 0.16)" strokeWidth="18" />
        <path d="M0 325 H640" stroke="rgb(239 230 216 / 0.25)" strokeWidth="1" strokeDasharray="10 10" />
        <path d="M395 0 V520" stroke="rgb(239 230 216 / 0.12)" strokeWidth="14" />
        <path d="M195 0 V520" stroke="rgb(239 230 216 / 0.08)" strokeWidth="10" />
        <path d="M0 155 H640" stroke="rgb(239 230 216 / 0.08)" strokeWidth="10" />
        <g fontFamily="var(--font-sign)" fontWeight="600" letterSpacing="3" fontSize="11" fill="rgb(239 230 216 / 0.45)">
          <text x="24" y="305">RUA DO OFÍCIO</text>
          <text x="295" y="245" textAnchor="middle" fill="rgb(127 179 163 / 0.7)">PRAÇA</text>
          <text x="404" y="470" transform="rotate(-90 404 470)">AV. DAS NAVALHAS</text>
        </g>
        {/* marcador */}
        <circle cx="470" cy="325" r="70" fill="url(#brilho)" />
        <g transform="translate(470 325)">
          <circle r="14" fill="#c8794a" />
          <circle r="5" fill="#0b0907" />
          <circle r="22" fill="none" stroke="#c8794a" strokeOpacity="0.5" className="motion-safe:animate-ping [transform-box:fill-box] [transform-origin:center]" />
        </g>
        <g transform="translate(486 268)">
          <rect width="128" height="38" rx="2" fill="#efe6d8" />
          <text x="14" y="24" fontFamily="var(--font-display)" fontStyle="italic" fontSize="18" fill="#1c1711">
            Cobre
          </text>
          <text x="72" y="24" fontFamily="var(--font-sign)" fontWeight="700" fontSize="10" letterSpacing="2" fill="#6b5f50">
            Nº 118
          </text>
        </g>
      </svg>
      <figcaption className="flex items-center justify-between gap-4 border-t border-(--line) px-5 py-4 text-xs text-bone-subtle">
        <span>Mapa ilustrativo · endereço fictício</span>
        <span className="sign text-[0.6875rem]">2 min da praça central</span>
      </figcaption>
    </figure>
  );
}
