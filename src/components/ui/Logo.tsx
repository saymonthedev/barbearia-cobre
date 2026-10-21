import { cn } from "@/lib/style";

/** Selo: um "C" com o corte de uma navalha atravessando. */
export function Seal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("shrink-0", className)} aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="22.5" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <circle cx="24" cy="24" r="18.5" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeDasharray="1.5 2.5" />
      <path
        d="M31.4 16.6A10.5 10.5 0 1 0 31.4 31.4"
        fill="none"
        stroke="var(--color-copper)"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <path d="M12 33.5 36.5 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M33.3 15.6 36.5 13l-1.2 4.1z" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <Seal className="size-10 text-bone" />
      <span className="flex flex-col leading-none">
        <span className="display-italic text-[1.7rem] leading-[0.8] text-bone">Cobre</span>{" "}
        <span className="sign mt-1.5 text-[0.625rem] tracking-[0.42em] text-bone-muted">Barbearia</span>
      </span>
    </span>
  );
}
