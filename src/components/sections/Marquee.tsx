const words = ["Degradê", "Navalha", "Toalha quente", "Tesoura", "Barba", "Pigmentação", "Ritual Cobre", "Pezinho"];

function Razor() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-copper" aria-hidden="true">
      <path d="M3 17 17 3l4 1-1 4L6 21H3z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Marquee() {
  const row = [...words, ...words];
  return (
    <div aria-hidden="true" className="relative overflow-hidden border-y border-(--line) bg-ink-900 py-5">
      <div className="marquee-track flex w-max items-center gap-8">
        {row.map((word, index) => (
          <span key={index} className="flex items-center gap-8">
            <span className={index % 2 ? "sign text-2xl text-bone-soft" : "display-italic text-3xl text-bone"}>{word}</span>
            <Razor />
          </span>
        ))}
      </div>
    </div>
  );
}
