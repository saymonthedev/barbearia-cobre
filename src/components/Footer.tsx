import { Logo } from "@/components/ui/Logo";
import { navItems } from "@/components/nav";
import { site } from "@/config/site";

/** `base` permite usar o rodapé fora da página inicial (ex.: "/" na landing page). */
export function Footer({ base = "" }: { base?: string }) {
  return (
    <footer className="relative overflow-hidden border-t border-(--line) bg-ink-950 pt-16 pb-28 sm:pb-12">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-bone-muted">{site.tagline}</p>
          </div>
          <nav aria-label="Rodapé">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={`${base}${item.href}`} className="sign text-[0.8125rem] text-bone-soft transition-colors hover:text-copper-300">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          aria-hidden="true"
          data-watermark="Cobre"
          className="display-italic pointer-events-none mt-16 -mb-[0.18em] text-center text-[clamp(7rem,27vw,24rem)] leading-[0.8] text-bone/[0.06] select-none before:content-[attr(data-watermark)]"
        />

        <div className="flex flex-col gap-4 border-t border-(--line) pt-6 text-xs leading-relaxed text-bone-subtle md:flex-row md:items-center md:justify-between">
          <p>
            Projeto conceitual de portfólio: marca, equipe, endereço e depoimentos são fictícios. Fotos geradas por IA.
          </p>
          <p>
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
