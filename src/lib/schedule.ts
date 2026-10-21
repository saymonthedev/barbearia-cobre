import { site } from "@/config/site";
import { weeklyHours } from "@/data/hours";

export type Day = {
  /** AAAA-MM-DD */
  key: string;
  weekday: number;
  day: number;
  month: number;
  open: boolean;
};

export type Slot = { minutes: number; label: string; available: boolean };

const STEP = 30;

/** Data e hora atuais no fuso da barbearia. */
export function nowInShop(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: site.timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  const y = Number(parts.year);
  const m = Number(parts.month);
  const d = Number(parts.day);
  return {
    key: `${parts.year}-${parts.month}-${parts.day}`,
    weekday: new Date(Date.UTC(y, m - 1, d)).getUTCDay(),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    y,
    m,
    d,
  };
}

/** Próximos `count` dias a partir de hoje (no fuso da barbearia). */
export function upcomingDays(count = 14, date = new Date()): Day[] {
  const now = nowInShop(date);
  return Array.from({ length: count }, (_, i) => {
    const dt = new Date(Date.UTC(now.y, now.m - 1, now.d + i));
    const weekday = dt.getUTCDay();
    return {
      key: dt.toISOString().slice(0, 10),
      weekday,
      day: dt.getUTCDate(),
      month: dt.getUTCMonth(),
      open: weeklyHours[weekday] !== null,
    };
  });
}

/** Hash simples e estável para simular uma agenda já parcialmente ocupada. */
function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

const label = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/**
 * Horários do dia para um serviço com a duração informada. A ocupação é
 * simulada (projeto conceitual): num sistema real viria da agenda.
 */
export function slotsFor(day: Day, duration: number, barberId: string, date = new Date()): Slot[] {
  const hours = weeklyHours[day.weekday];
  if (!hours) return [];
  const now = nowInShop(date);
  const isToday = day.key === now.key;
  const slots: Slot[] = [];
  for (let t = hours.open; t + duration <= hours.close; t += STEP) {
    const past = isToday && t <= now.minutes + 30;
    const busy = hash(`${day.key}|${barberId}|${t}`) < 0.32;
    slots.push({ minutes: t, label: label(t), available: !past && !busy });
  }
  return slots;
}

/** Situação de agora: aberto, fecha em breve ou fechado (com a próxima abertura). */
export function openStatus(date = new Date()) {
  const now = nowInShop(date);
  const today = weeklyHours[now.weekday];
  if (today && now.minutes >= today.open && now.minutes < today.close) {
    const left = today.close - now.minutes;
    return { open: true as const, closesAt: today.close, closingSoon: left <= 60 };
  }
  for (let i = 0; i < 7; i++) {
    const weekday = (now.weekday + i) % 7;
    const h = weeklyHours[weekday];
    if (!h) continue;
    if (i === 0 && now.minutes >= h.open) continue;
    return { open: false as const, nextWeekday: weekday, nextOpen: h.open, inDays: i };
  }
  return { open: false as const, nextWeekday: 2, nextOpen: 9 * 60, inDays: 1 };
}
