/** Horário de funcionamento por dia da semana (0 = domingo). Horas em minutos desde 00:00. */
export type DayHours = { open: number; close: number } | null;

export const weeklyHours: DayHours[] = [
  null, // domingo
  null, // segunda
  { open: 9 * 60, close: 20 * 60 },
  { open: 9 * 60, close: 20 * 60 },
  { open: 9 * 60, close: 20 * 60 },
  { open: 9 * 60, close: 21 * 60 },
  { open: 8 * 60, close: 17 * 60 },
];

export const weekdayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
export const weekdayShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const formatTime = (minutes: number) =>
  `${Math.floor(minutes / 60)}h${minutes % 60 ? String(minutes % 60).padStart(2, "0") : ""}`;

/** Linhas da tabela de horário, juntando dias com o mesmo horário. */
export const hoursTable = [
  { days: "Terça a quinta", hours: "9h às 20h" },
  { days: "Sexta", hours: "9h às 21h" },
  { days: "Sábado", hours: "8h às 17h" },
  { days: "Domingo e segunda", hours: "Fechado" },
];
