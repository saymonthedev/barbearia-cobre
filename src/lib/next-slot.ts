import { barbers } from "@/data/barbers";
import { slotsFor, upcomingDays } from "@/lib/schedule";

/** Próximo horário livre de 45 min entre todos os profissionais. */
export function nextFreeSlot(date = new Date()) {
  for (const day of upcomingDays(14, date)) {
    if (!day.open) continue;
    let best: { minutes: number; label: string; barberId: string } | null = null;
    for (const barber of barbers) {
      const slot = slotsFor(day, 45, barber.id, date).find((s) => s.available);
      if (slot && (!best || slot.minutes < best.minutes)) best = { minutes: slot.minutes, label: slot.label, barberId: barber.id };
    }
    if (best) return { day, ...best };
  }
  return null;
}
