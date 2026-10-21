import { ArrowUpRight, CalendarCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { navItems } from "@/components/nav";
import { site } from "@/config/site";
import { hoursTable } from "@/data/hours";

/**
 * Rodapé em três faixas: convite final para agendar, informações úteis
 * (endereço, horário, navegação) e a linha de créditos.
 * `base` permite usar o rodapé fora do site completo (ex.: "/site" na landing page).
 */
export function Footer({ base = "", bookingHref = "#agendar" }: { base?: string; bookingHref?: string }) {
  const { street, district, city, state } = site.address;
  return (
    <footer className="relative isolate overflow-hidden border-t border-(--line) bg-ink-950 pb-24 sm:pb-0">
      {/* Convite final */}
      <div className="border-b border-(--line)">
        <div className="container-page flex flex-col gap-8 py-14 md:flex-row md:items-end md:justify-between md:py-16">
          <p className="display max-w-2xl text-[clamp(2.25rem,5vw,3.75rem)] text-balance">
            Sua cadeira <span className="display-italic">está separada.</span>
          </p>
          <a href={bookingHref} className="btn btn-copper shrink-0">
            <CalendarCheck aria-hidden="true" className="size-[18px]" />
            Agendar horário
          </a>
        </div>
      </div>

      {/* Informações */}
      <div className="relative">
        <div className="container-page grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-bone-muted">{site.tagline}</p>
          </div>

          <div className="lg:col-span-3">
            <h2 className="sign text-[0.6875rem] text-copper-300">Endereço</h2>
            <address className="mt-4 text-[0.9375rem] leading-relaxed text-bone-soft not-italic">
              {street}
              <br />
              {district}, {city} · {state}
            </address>
          </div>

          <div className="lg:col-span-3">
            <h2 className="sign text-[0.6875rem] text-copper-300">Horário</h2>
            <dl className="mt-4 grid max-w-[18rem] gap-2 text-[0.9375rem]">
              {hoursTable.map((row) => (
                <div key={row.days} className="flex justify-between gap-4">
                  <dt className="text-bone-muted">{row.days}</dt>
                  <dd className={row.hours === "Fechado" ? "text-bone-subtle" : "text-bone-soft"}>{row.hours}</dd>
                </div>
              ))}
            </dl>
          </div>

          <nav aria-label="Rodapé" className="lg:col-span-2 lg:justify-self-end">
            <h2 className="sign text-[0.6875rem] text-copper-300">Navegue</h2>
            <ul className="mt-4 grid gap-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={`${base}${item.href}`}
                    className="group inline-flex items-center gap-1.5 text-[0.9375rem] text-bone-soft transition-colors hover:text-copper-300"
                  >
                    {item.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5 -translate-x-1 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Créditos */}
      <div className="border-t border-(--line) bg-ink-950/80">
        <div className="container-page flex flex-col gap-3 py-6 text-xs leading-relaxed text-bone-subtle md:flex-row md:items-center md:justify-between">
          <p>Projeto conceitual de portfólio: marca, equipe, endereço e depoimentos são fictícios. Fotos geradas por IA.</p>
          <p className="shrink-0">
            Desenvolvido por{" "}
            <a
              href={site.author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone-soft underline decoration-copper/60 underline-offset-4 transition-colors hover:text-copper-300"
            >
              {site.author.name}
              <span className="sr-only"> (abre em uma nova aba)</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
