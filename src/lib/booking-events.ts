export type BookingRequest = { serviceId?: string; barberId?: string; dayKey?: string; slot?: number };

export const BOOKING_EVENT = "cobre:agendar";

/** Pré-seleciona serviço ou barbeiro na comanda e leva o visitante até ela. */
export function requestBooking(detail: BookingRequest) {
  window.dispatchEvent(new CustomEvent<BookingRequest>(BOOKING_EVENT, { detail }));
  const target = document.getElementById("agendar");
  if (!target) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
