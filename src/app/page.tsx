import { ArrowRight, Check, Scissors } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import barba from "@/assets/photos/barba.jpg";
import { Booking, type BookingPreset } from "@/components/booking/Booking";
import { Footer } from "@/components/Footer";
import { Faq } from "@/components/landing/Faq";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/config/site";
import { formatPrice } from "@/data/services";
import { delay } from "@/lib/style";

const title = "Primeira visita: corte + barba por R$ 79 · Barbearia Cobre";
const description =
  "Primeira vez na Barbearia Cobre? Corte, barba completa e toalha quente por R$ 79. Agende online em menos de um minuto. Projeto conceitual de portfólio.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    images: [{ url: "/og-primeira-visita.jpg", width: 1200, height: 630, alt: "Primeira visita: corte + barba por R$ 79" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-primeira-visita.jpg"] },
};

const preset: BookingPreset = {
  serviceIds: ["corte-barba"],
  title: "Primeira visita · corte + barba",
  price: 79,
  originalPrice: 95,
};

const included = [
  { item: "Corte à sua escolha", note: "máquina, tesoura ou degradê" },
  { item: "Barba completa", note: "desenho, aparo e óleo" },
  { item: "Toalha quente", note: "antes e depois da navalha" },
  { item: "Café ou cerveja", note: "por conta da casa" },
];

const steps = [
  { title: "Reserve aqui", text: "Escolha o profissional, o dia e o horário na comanda logo abaixo." },
  { title: "Confirme no WhatsApp", text: "A mensagem sai pronta. Sem cadastro, sem aplicativo, sem senha." },
  { title: "Sente e relaxe", text: "Chegue no horário: a sua cadeira está separada e o café, passado." },
];

const faq = [
  {
    q: "Quem pode usar a oferta?",
    a: "Qualquer pessoa que ainda não foi atendida na Cobre. Vale para o primeiro agendamento de cada cliente.",
  },
  {
    q: "Posso escolher o barbeiro?",
    a: "Pode. Na comanda você escolhe entre Rafa, Seu Jorge e Bruna, ou deixa a agenda decidir quem estiver livre.",
  },
  {
    q: "E se eu precisar desmarcar?",
    a: "Sem problema: é só responder a mensagem de confirmação no WhatsApp com até duas horas de antecedência.",
  },
  {
    q: "Como pago?",
    a: "No dia, depois do atendimento: Pix, cartão de débito ou crédito, ou dinheiro.",
  },
];

export default function FirstVisit() {
  const savings = preset.originalPrice - preset.price;
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="container-page flex h-(--header-h) items-center justify-between">
          <Link href="/site" className="rounded-sm">
            <Logo />
            <span className="sr-only">, ir para o site completo</span>
          </Link>
          <Link href="/site" className="sign flex items-center gap-2 text-[0.8125rem] text-bone-soft transition-colors hover:text-copper-300">
            Ver o site completo
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </header>

      <main id="conteudo">
        {/* HERO: o preço é o protagonista, carimbado sobre a foto. */}
        <section aria-labelledby="oferta-title" className="relative isolate min-h-[100svh] overflow-hidden">
          <Image
            src={barba}
            alt=""
            loading="eager"
            fetchPriority="low"
            placeholder="blur"
            sizes="100vw"
            className="hero-photo absolute inset-0 -z-20 h-full w-full object-cover object-[72%_22%]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(11_9_7/0.55)_0%,rgb(11_9_7/0.88)_55%,rgb(11_9_7/0.75)_100%)] lg:bg-[linear-gradient(90deg,rgb(11_9_7/0.96)_0%,rgb(11_9_7/0.82)_45%,rgb(11_9_7/0.25)_100%)]" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-ink-950 to-transparent" />

          <div className="container-page grid min-h-[100svh] items-center gap-12 pt-28 pb-20 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow hero-in">Primeira vez na Cobre</p>
              <h1 id="oferta-title" className="display mt-7 text-[clamp(3.4rem,10vw,8rem)]">
                <span className="hero-in block" style={delay(80)}>
                  Sente na
                </span>
                <span className="hero-in display-italic block" style={delay(160)}>
                  nossa cadeira.
                </span>
              </h1>
              <p className="hero-in mt-8 max-w-lg text-lg leading-relaxed text-bone-soft text-pretty" style={delay(260)}>
                Corte, barba completa e toalha quente por um preço de boas-vindas. A gente quer que a primeira vez seja a melhor.
              </p>
              <div className="hero-in mt-10 flex flex-wrap items-center gap-5" style={delay(340)}>
                <a href="#reservar" className="btn btn-copper">
                  Garantir meu horário
                </a>
                <p className="text-sm text-bone-muted">
                  Você economiza <span className="font-semibold text-bone">{formatPrice(savings)}</span>
                </p>
              </div>
            </div>

            <div className="relative flex justify-center lg:col-span-5 lg:mb-[-2rem] lg:justify-end lg:self-end">
              <PriceStamp price={preset.price} original={preset.originalPrice} />
            </div>
          </div>
        </section>

        {/* O QUE ESTÁ INCLUSO: uma fita de recibo. */}
        <section aria-labelledby="incluso-title" className="relative py-24 sm:py-32">
          <div className="container-page grid items-center gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow" data-reveal>
                O que está incluso
              </p>
              <h2 id="incluso-title" className="display mt-6 text-[clamp(2.75rem,6vw,4.5rem)]" data-reveal style={delay(80)}>
                Uma hora e quinze <span className="display-italic">só sua.</span>
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-bone-muted" data-reveal style={delay(140)}>
                O combo completo da casa, sem letra miúda. O que está na fita é o que você recebe.
              </p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7" data-reveal="fade">
              <div className="paper perforated mx-auto max-w-md -rotate-[1.5deg] px-7 pt-10 pb-9 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.85)]">
                <p className="sign text-center text-[0.6875rem] tracking-[0.3em] text-paper-muted">Barbearia Cobre · boas-vindas</p>
                <ul className="mt-6">
                  {included.map((row) => (
                    <li key={row.item} className="flex items-start gap-3 border-t border-dashed border-paper-ink/25 py-3.5">
                      <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-copper-700" strokeWidth={2.4} />
                      <span>
                        <span className="block font-semibold">{row.item}</span>
                        <span className="text-sm text-paper-muted">{row.note}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-end justify-between border-t-2 border-paper-ink pt-4">
                  <span className="sign text-sm">Total</span>
                  <span className="text-right">
                    <span className="sign mr-3 text-base text-paper-muted line-through">{formatPrice(preset.originalPrice)}</span>
                    <span className="sign text-4xl">{formatPrice(preset.price)}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA: linha pontilhada de "recorte" com a tesoura. */}
        <section aria-labelledby="como-title" className="border-y border-(--line) bg-ink-900 py-24 sm:py-28">
          <div className="container-page">
            <h2 id="como-title" className="display text-[clamp(2.5rem,5vw,4rem)]" data-reveal>
              Três passos, <span className="display-italic">nenhuma fila.</span>
            </h2>
            <div className="relative mt-16">
              <div aria-hidden="true" className="absolute top-6 right-0 left-0 hidden border-t-2 border-dashed border-copper/40 md:block" />
              <div aria-hidden="true" className="cut-scissors pointer-events-none absolute inset-x-0 top-[0.7rem] hidden md:block">
                <Scissors className="size-6 -rotate-90 text-copper" strokeWidth={1.6} />
              </div>
              <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
                {steps.map((step, index) => (
                  <li key={step.title} className="relative" data-reveal style={delay(index * 100)}>
                    <span className="display relative z-10 grid size-12 place-items-center rounded-full border border-copper/60 bg-ink-900 text-xl text-copper-300">
                      {index + 1}
                    </span>
                    <h3 className="display mt-6 text-[1.875rem] leading-none">{step.title}</h3>
                    <p className="mt-3 max-w-xs leading-relaxed text-bone-muted">{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* RESERVA */}
        <section id="reservar" tabIndex={-1} aria-labelledby="reservar-title" className="py-24 sm:py-32">
          <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-12">
                <p className="eyebrow" data-reveal>
                  Reserva
                </p>
                <h2 id="reservar-title" className="display mt-6 text-[clamp(2.75rem,6vw,4.5rem)]" data-reveal style={delay(80)}>
                  Escolha <span className="display-italic">o seu horário.</span>
                </h2>
                <p className="mt-6 leading-relaxed text-bone-muted" data-reveal style={delay(140)}>
                  O combo já está na comanda com o preço de boas-vindas. Falta só dizer quando.
                </p>
              </div>
            </div>
            <div className="lg:col-span-8 xl:col-span-7 xl:col-start-6" data-reveal="fade">
              <Suspense>
                <Booking preset={preset} ticketNumber="0001" />
              </Suspense>
            </div>
          </div>
        </section>

        {/* PERGUNTAS */}
        <section aria-labelledby="faq-title" className="pb-24 sm:pb-32">
          <div className="container-page grid gap-12 lg:grid-cols-12">
            <h2 id="faq-title" className="display text-[clamp(2.5rem,5vw,4rem)] lg:col-span-4" data-reveal>
              Ficou <span className="display-italic">alguma dúvida?</span>
            </h2>
            <div className="lg:col-span-8" data-reveal style={delay(100)}>
              <Suspense>
                <Faq items={faq} />
              </Suspense>
              <p className="mt-8 text-xs leading-relaxed text-bone-subtle">
                Oferta fictícia, criada para este projeto conceitual de portfólio. Válida para o primeiro agendamento por pessoa.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer base="/site" />
    </>
  );
}

/** Carimbo de preço: selo serrilhado girando bem devagar, com o valor fixo no centro. */
function PriceStamp({ price, original }: { price: number; original: number }) {
  const teeth = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2;
    const r = i % 2 ? 46 : 50;
    return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`;
  }).join(" ");
  return (
    <div className="hero-in relative size-[17rem] sm:size-[21rem]" style={delay(420)}>
      <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 size-full motion-safe:animate-[spin_40s_linear_infinite]">
        <polygon points={teeth} fill="var(--color-copper)" />
        <circle cx="50" cy="50" r="41" fill="none" stroke="var(--color-ink-950)" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center text-ink-950">
        <div>
          <p className="sign text-[0.6875rem] tracking-[0.3em]">Corte + barba</p>
          <p className="sign mt-2 text-base line-through opacity-60">{formatPrice(original)}</p>
          <p className="display -mt-1 text-[5.5rem] leading-none tracking-[-0.04em] sm:text-[7rem]">
            <span className="mr-1.5 align-top text-[0.3em] tracking-normal">R$</span>
            {price}
          </p>
          <p className="display-italic text-lg text-ink-950/80">na primeira visita</p>
        </div>
      </div>
    </div>
  );
}
