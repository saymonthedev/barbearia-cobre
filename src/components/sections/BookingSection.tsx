import { Booking } from "@/components/booking/Booking";
import { delay } from "@/lib/style";

const notes = [
  { title: "Sem cadastro", text: "Nada de criar conta ou baixar aplicativo." },
  { title: "Preço fechado", text: "Você vê o total antes de confirmar." },
  { title: "Pelo WhatsApp", text: "A confirmação chega por mensagem." },
];

export function BookingSection() {
  return (
    <section
      id="agendar"
      aria-labelledby="agendar-title"
      tabIndex={-1}
      className="relative overflow-hidden border-y border-(--line) bg-ink-900 py-24 sm:py-32"
    >
      {/* Tampo do balcão: veios de madeira escura sugeridos por gradientes. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60 [background:repeating-linear-gradient(92deg,rgb(255_255_255/0.012)_0_2px,transparent_2px_9px),radial-gradient(60rem_40rem_at_80%_30%,rgb(200_121_74/0.12),transparent_70%)]"
      />
      <div className="container-page relative grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5 lg:pt-6">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
          <p className="eyebrow" data-reveal>
            Agendamento
          </p>
          <h2 id="agendar-title" className="display mt-6 text-[clamp(2.75rem,6vw,4.75rem)] text-balance" data-reveal style={delay(80)}>
            Sua cadeira, <span className="display-italic">no seu horário.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-bone-soft text-pretty" data-reveal style={delay(140)}>
            Quatro toques e pronto: serviço, profissional, dia e hora. A comanda calcula o tempo e o valor enquanto você escolhe.
          </p>

          <ul className="mt-12 grid gap-px overflow-hidden border border-(--line) bg-(--line) sm:grid-cols-3 lg:grid-cols-1">
            {notes.map((note, index) => (
              <li key={note.title} className="bg-ink-900 px-5 py-5" data-reveal style={delay(180 + index * 60)}>
                <p className="sign text-sm text-copper-300">
                  {String(index + 1).padStart(2, "0")} · {note.title}
                </p>
                <p className="mt-2 text-sm text-bone-muted">{note.text}</p>
              </li>
            ))}
          </ul>
          </div>
        </div>

        <div className="lg:col-span-7" data-reveal="fade" style={delay(120)}>
          <Booking />
        </div>
      </div>
    </section>
  );
}
