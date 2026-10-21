"use client";

import { ArrowLeft, ArrowRight, Check, Moon, RotateCcw, Send, Sun, Sunrise } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Seal } from "@/components/ui/Logo";
import { site } from "@/config/site";
import { barbers } from "@/data/barbers";
import { weekdayNames } from "@/data/hours";
import { categories, formatDuration, formatPrice, services } from "@/data/services";
import { BOOKING_EVENT, type BookingRequest } from "@/lib/booking-events";
import { slotsFor, upcomingDays, type Day, type Slot } from "@/lib/schedule";
import { cn } from "@/lib/style";

const ANY = "qualquer";
const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const WEEK_INITIALS = ["D", "S", "T", "Q", "Q", "S", "S"];

type StepId = "services" | "barber" | "time" | "details";
const STEP_LABELS: Record<StepId, string> = {
  services: "Serviços",
  barber: "Profissional",
  time: "Horário",
  details: "Seus dados",
};

/** Oferta fechada (landing page): o serviço já vem escolhido e com preço especial. */
export type BookingPreset = { serviceIds: string[]; title: string; price: number; originalPrice: number };

const maskPhone = (value: string) => {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const dateLabel = (day: Day) =>
  `${weekdayNames[day.weekday].toLowerCase()}, ${String(day.day).padStart(2, "0")}/${String(day.month + 1).padStart(2, "0")}`;

const timeLabel = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export function Booking({ preset, ticketNumber = "0118" }: { preset?: BookingPreset; ticketNumber?: string }) {
  const uid = useId();
  const steps: StepId[] = preset ? ["barber", "time", "details"] : ["services", "barber", "time", "details"];
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState<string[]>(preset?.serviceIds ?? []);
  const [barber, setBarber] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [slotPick, setSlotPick] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);
  const [pulse, setPulse] = useState<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  const step = steps[stepIndex];
  const chosen = useMemo(() => services.filter((s) => selected.includes(s.id)), [selected]);
  const duration = chosen.reduce((sum, s) => sum + s.duration, 0);
  const listTotal = chosen.reduce((sum, s) => sum + s.price, 0);
  const total = preset ? preset.price : listTotal;
  const days = useMemo(() => (now ? upcomingDays(14, now) : []), [now]);
  const day = days.find((d) => d.key === dayKey) ?? null;
  const slots = useMemo(
    () => (day && now ? slotsFor(day, Math.max(duration, 30), barber ?? ANY, now) : []),
    [day, now, duration, barber],
  );
  // O horário escolhido só vale enquanto continuar livre para a duração atual.
  const slot = slotPick !== null && slots.some((s) => s.minutes === slotPick && s.available) ? slotPick : null;
  const barberInfo = barbers.find((b) => b.id === barber);
  const phoneDigits = phone.replace(/\D/g, "");
  const nameValid = name.trim().length >= 2;
  const phoneValid = phoneDigits.length === 0 || phoneDigits.length >= 10;

  const complete: Record<StepId, boolean> = {
    services: selected.length > 0,
    barber: barber !== null,
    time: slot !== null,
    details: nameValid && phoneValid,
  };
  const reachable = (index: number) => steps.slice(0, index).every((id) => complete[id]);

  const ensureNow = () => setNow((current) => current ?? new Date());

  const goTo = (index: number) => {
    if (steps[index] === "time") ensureNow();
    moved.current = true;
    setStepIndex(index);
  };

  useEffect(() => {
    if (!moved.current) return;
    heading.current?.focus({ preventScroll: true });
  }, [stepIndex, done]);

  // Pedidos vindos do letreiro, das cartas da equipe ou do bilhete do espelho.
  useEffect(() => {
    const onRequest = (event: Event) => {
      const { serviceId, barberId, dayKey: requestedDay, slot: requestedSlot } = (event as CustomEvent<BookingRequest>).detail ?? {};
      if (serviceId && !preset) {
        setSelected((prev) => (prev.includes(serviceId) ? prev : [...prev, serviceId]));
        setPulse(serviceId);
      }
      if (barberId) setBarber(barberId);
      if (requestedDay) {
        setNow(new Date());
        setDayKey(requestedDay);
        setSlotPick(requestedSlot ?? null);
      }
      setDone(false);
      moved.current = true;
      setStepIndex(0);
    };
    window.addEventListener(BOOKING_EVENT, onRequest);
    return () => window.removeEventListener(BOOKING_EVENT, onRequest);
  }, [preset]);

  useEffect(() => {
    if (!pulse) return;
    const id = window.setTimeout(() => setPulse(null), 1600);
    return () => window.clearTimeout(id);
  }, [pulse]);

  const toggleService = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const next = () => {
    if (step === "details") {
      setTouched(true);
      if (!nameValid || !phoneValid) return;
      moved.current = true;
      setDone(true);
      return;
    }
    if (!complete[step]) return;
    // Pula etapas que já vieram preenchidas (ex.: horário reservado pelo bilhete do espelho).
    let target = stepIndex + 1;
    while (target < steps.length - 1 && complete[steps[target]]) target++;
    goTo(target);
  };

  const reset = () => {
    setSelected(preset?.serviceIds ?? []);
    setBarber(null);
    setDayKey(null);
    setSlotPick(null);
    setName("");
    setPhone("");
    setNote("");
    setTouched(false);
    setDone(false);
    goTo(0);
  };

  const time = slot !== null ? timeLabel(slot) : "";
  const barberLabel = barber === ANY ? "Sem preferência" : barberInfo ? barberInfo.nickname : "";
  const serviceLabel = preset ? preset.title : chosen.map((s) => s.name).join(" + ");

  const message = [
    `Olá, ${site.name}! Quero confirmar um agendamento:`,
    "",
    `• Serviço: ${serviceLabel}`,
    `• Profissional: ${barberLabel}`,
    day ? `• Quando: ${dateLabel(day)} às ${time}` : "",
    `• Duração: ${formatDuration(duration)} · Total: ${formatPrice(total)}`,
    "",
    `Nome: ${name.trim()}`,
    phoneDigits ? `WhatsApp: ${phone}` : "",
    note.trim() ? `Observação: ${note.trim()}` : "",
  ]
    .filter((line, i, all) => line !== "" || (all[i - 1] ?? "") !== "")
    .join("\n");
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-x-6 -bottom-6 h-16 rounded-[50%] bg-black/60 blur-2xl" />

      <div className="paper perforated relative px-5 pt-9 pb-8 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] sm:px-9 sm:pt-11 sm:pb-10">
        <div className="flex items-start justify-between gap-4 border-b-2 border-paper-ink pb-5">
          <div className="flex items-center gap-3">
            <Seal className="size-11 text-paper-ink" />
            <div>
              <p className="sign text-[0.6875rem] tracking-[0.3em] text-paper-muted">Comanda</p>
              <p className="display mt-1 text-2xl leading-none">Barbearia Cobre</p>
            </div>
          </div>
          <p className="sign text-right text-[0.6875rem] leading-relaxed tracking-[0.2em] text-paper-muted">
            Nº {ticketNumber}
            <br />
            {preset ? "Primeira visita" : "Agendamento"}
          </p>
        </div>

        {preset && !done && (
          <div className="mt-5 flex items-center justify-between gap-4 rounded-[3px] bg-paper-ink px-4 py-3 text-paper">
            <div className="min-w-0">
              <p className="sign text-[0.625rem] tracking-[0.24em] text-copper-200">Oferta escolhida</p>
              <p className="mt-1 truncate font-semibold">{preset.title}</p>
            </div>
            <p className="shrink-0 text-right">
              <span className="sign block text-xs text-paper/55 line-through">{formatPrice(preset.originalPrice)}</span>
              <span className="sign text-2xl text-copper-200">{formatPrice(preset.price)}</span>
            </p>
          </div>
        )}

        {!done && (
          <ol className={cn("mt-5 grid gap-1.5", steps.length === 4 ? "grid-cols-4" : "grid-cols-3")} aria-label="Etapas do agendamento">
            {steps.map((id, index) => {
              const current = index === stepIndex;
              const enabled = reachable(index);
              return (
                <li key={id}>
                  <button
                    type="button"
                    disabled={!enabled}
                    onClick={() => goTo(index)}
                    aria-current={current ? "step" : undefined}
                    className={cn("flex w-full flex-col gap-2 text-left disabled:cursor-not-allowed", !enabled && "opacity-45")}
                  >
                    <span
                      className={cn(
                        "h-1 w-full rounded-full transition-colors duration-500",
                        current ? "bg-copper-700" : complete[id] && enabled ? "bg-paper-ink" : "bg-paper-ink/15",
                      )}
                    />
                    <span className="flex items-center gap-1.5">
                      <span className="sign text-[0.625rem] text-paper-muted">{String(index + 1).padStart(2, "0")}</span>
                      <span className={cn("sign hidden truncate text-[0.6875rem] xs:inline", current ? "text-paper-ink" : "text-paper-muted")}>
                        {STEP_LABELS[id]}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}

        <div key={done ? "done" : step} className={cn("mt-7", done ? "print-in" : "step-in min-h-[26rem]")}>
          {done && day ? (
            <Receipt
              headingRef={heading}
              lines={preset ? [{ name: preset.title, price: preset.price, duration }] : chosen.map((s) => ({ name: s.name, price: s.price, duration: s.duration }))}
              total={total}
              duration={duration}
              when={`${dateLabel(day)} · ${time}`}
              barber={barberLabel}
              name={name.trim()}
              whatsappHref={whatsappHref}
              onReset={reset}
            />
          ) : step === "services" ? (
            <StepServices headingRef={heading} selected={selected} pulse={pulse} onToggle={toggleService} uid={uid} />
          ) : step === "barber" ? (
            <StepBarber headingRef={heading} barber={barber} onChange={setBarber} uid={uid} />
          ) : step === "time" ? (
            <StepTime
              headingRef={heading}
              days={days}
              dayKey={dayKey}
              slots={slots}
              slot={slot}
              duration={duration}
              onDay={(key) => {
                setDayKey(key);
                setSlotPick(null);
              }}
              onSlot={setSlotPick}
              uid={uid}
            />
          ) : (
            <StepDetails
              headingRef={heading}
              uid={uid}
              name={name}
              phone={phone}
              note={note}
              touched={touched}
              nameValid={nameValid}
              phoneValid={phoneValid}
              onName={setName}
              onPhone={(v) => setPhone(maskPhone(v))}
              onNote={setNote}
              onSubmit={next}
            />
          )}
        </div>

        {!done && (
          <div className="mt-8 border-t border-dashed border-paper-ink/35 pt-5">
            <div className="flex items-end justify-between gap-4" aria-live="polite">
              <div className="min-w-0">
                <p className="sign text-[0.6875rem] tracking-[0.2em] text-paper-muted">
                  {chosen.length
                    ? `${preset ? 1 : chosen.length} ${chosen.length > 1 && !preset ? "serviços" : "serviço"} · `
                    : "Nenhum serviço ainda"}
                  {chosen.length > 0 && <span className="normal-case">{formatDuration(duration)}</span>}
                </p>
                <p className="mt-1.5 truncate text-sm text-paper-muted">
                  {[barberLabel, day ? dateLabel(day) : "", time].filter(Boolean).join(" · ") || "Escolha o que vai fazer hoje"}
                </p>
              </div>
              <p className="sign shrink-0 text-4xl text-paper-ink">{total ? formatPrice(total) : "—"}</p>
            </div>

            <div className="mt-5 flex gap-2.5">
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={() => goTo(stepIndex - 1)}
                  className="btn min-h-13 border border-paper-ink/25 px-4 text-paper-ink hover:border-paper-ink"
                  aria-label="Voltar para a etapa anterior"
                >
                  <ArrowLeft aria-hidden="true" className="size-[18px]" />
                </button>
              )}
              <button
                type="button"
                onClick={next}
                disabled={step !== "details" && !complete[step]}
                className="btn min-h-13 flex-1 bg-paper-ink text-paper hover:bg-copper-700 disabled:cursor-not-allowed disabled:bg-paper-ink/20 disabled:text-paper-ink/45"
              >
                {step === "details" ? "Revisar agendamento" : `Continuar · ${STEP_LABELS[steps[stepIndex + 1]]}`}
                <ArrowRight aria-hidden="true" className="size-[18px]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type HeadingRef = RefObject<HTMLHeadingElement | null>;

function StepTitle({ headingRef, children, hint }: { headingRef: HeadingRef; children: ReactNode; hint: string }) {
  return (
    <div className="mb-6">
      <h3 ref={headingRef} tabIndex={-1} className="display text-[2rem] leading-none sm:text-[2.375rem]">
        {children}
      </h3>
      <p className="mt-2.5 text-sm text-paper-muted">{hint}</p>
    </div>
  );
}

/** Caixa de seleção desenhada à mão: um "x" de caneta. */
function Tick({ checked, round }: { checked: boolean; round?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-5 shrink-0 place-items-center border-[1.5px] transition-colors",
        round ? "rounded-full" : "rounded-[3px]",
        checked ? "border-copper bg-copper text-paper-ink" : "border-paper-ink/40",
      )}
    >
      <Check className={cn("size-3.5 transition-transform duration-300 ease-out-expo", checked ? "scale-100" : "scale-0")} strokeWidth={3} />
    </span>
  );
}

function StepServices({
  headingRef,
  selected,
  pulse,
  onToggle,
  uid,
}: {
  headingRef: HeadingRef;
  selected: string[];
  pulse: string | null;
  onToggle: (id: string) => void;
  uid: string;
}) {
  return (
    <div>
      <StepTitle headingRef={headingRef} hint="Marque um ou mais. O tempo e o valor somam sozinhos.">
        O que vai ser <span className="display-italic text-copper-700">hoje?</span>
      </StepTitle>
      <div className="space-y-6">
        {categories.map((category) => (
          <fieldset key={category.id}>
            <legend className="sign mb-2.5 text-[0.6875rem] tracking-[0.24em] text-paper-muted">{category.label}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {services
                .filter((s) => s.category === category.id)
                .map((service) => {
                  const checked = selected.includes(service.id);
                  const id = `${uid}-svc-${service.id}`;
                  return (
                    <label
                      key={service.id}
                      htmlFor={id}
                      className={cn(
                        "field-focus relative flex cursor-pointer items-center gap-3 rounded-[3px] border px-3.5 py-3 transition-[background-color,border-color,box-shadow] duration-300",
                        checked ? "border-paper-ink bg-paper-ink text-paper" : "border-paper-ink/20 bg-white/30 hover:border-paper-ink/50",
                        pulse === service.id && "ring-4 ring-copper/45",
                      )}
                    >
                      <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={() => onToggle(service.id)} />
                      <Tick checked={checked} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.9375rem] font-semibold">{service.name}</span>
                        <span className={cn("sign mt-1 block text-[0.6875rem] normal-case", checked ? "text-paper/65" : "text-paper-muted")}>
                          {formatDuration(service.duration)}
                        </span>
                      </span>
                      <span className="sign text-lg">{formatPrice(service.price)}</span>
                    </label>
                  );
                })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

function StepBarber({
  headingRef,
  barber,
  onChange,
  uid,
}: {
  headingRef: HeadingRef;
  barber: string | null;
  onChange: (id: string) => void;
  uid: string;
}) {
  const options = [
    ...barbers.map((b) => ({ id: b.id, title: b.nickname, detail: b.specialty, photo: b.photo, focus: b.focus })),
    { id: ANY, title: "Sem preferência", detail: "Quem estiver livre no horário", photo: null, focus: "" },
  ];
  return (
    <fieldset>
      <legend className="contents">
        <StepTitle headingRef={headingRef} hint="Cada um tem a sua mão. Escolha pelo estilo ou deixe com a gente.">
          Com quem você <span className="display-italic text-copper-700">senta?</span>
        </StepTitle>
      </legend>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {options.map((option) => {
          const checked = barber === option.id;
          const id = `${uid}-barber-${option.id}`;
          return (
            <label
              key={option.id}
              htmlFor={id}
              className={cn(
                "field-focus flex cursor-pointer items-center gap-4 rounded-[3px] border p-3 transition-[background-color,border-color] duration-300",
                checked ? "border-paper-ink bg-paper-ink text-paper" : "border-paper-ink/20 bg-white/30 hover:border-paper-ink/50",
              )}
            >
              <input id={id} type="radio" name={`${uid}-barber`} className="sr-only" checked={checked} onChange={() => onChange(option.id)} />
              <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-paper-shade ring-1 ring-paper-ink/15">
                {option.photo ? (
                  <Image src={option.photo} alt="" fill sizes="64px" className="object-cover" style={{ objectPosition: option.focus }} />
                ) : (
                  <span className="grid size-full place-items-center">
                    <Seal className="size-10 text-paper-ink" />
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="display block text-xl leading-tight">{option.title}</span>
                <span className={cn("mt-1 block text-sm", checked ? "text-paper/70" : "text-paper-muted")}>{option.detail}</span>
              </span>
              <Tick checked={checked} round />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

const periods = [
  { id: "manha", label: "Manhã", icon: Sunrise, from: 0, to: 12 * 60 },
  { id: "tarde", label: "Tarde", icon: Sun, from: 12 * 60, to: 18 * 60 },
  { id: "noite", label: "Noite", icon: Moon, from: 18 * 60, to: 24 * 60 },
];

function StepTime({
  headingRef,
  days,
  dayKey,
  slots,
  slot,
  duration,
  onDay,
  onSlot,
  uid,
}: {
  headingRef: HeadingRef;
  days: Day[];
  dayKey: string | null;
  slots: Slot[];
  slot: number | null;
  duration: number;
  onDay: (key: string) => void;
  onSlot: (minutes: number) => void;
  uid: string;
}) {
  const free = slots.filter((s) => s.available).length;
  // Calendário começando no domingo da semana de hoje; dias fora da janela ficam vazios.
  const lead = days[0]?.weekday ?? 0;
  const cells: (Day | null)[] = [...Array.from({ length: lead }, () => null), ...days];
  while (cells.length % 7) cells.push(null);
  const months = [...new Set(days.map((d) => d.month))].map((m) => MONTHS[m]);
  const year = days[0] ? new Date(`${days[0].key}T12:00:00`).getFullYear() : "";

  return (
    <div>
      <StepTitle headingRef={headingRef} hint={`Horários para ${formatDuration(Math.max(duration, 30))} de cadeira. Fechamos domingo e segunda.`}>
        Quando fica <span className="display-italic text-copper-700">bom?</span>
      </StepTitle>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-7">
        <fieldset className="rounded-[4px] border border-paper-ink/15 bg-white/35 p-4">
          <legend className="sr-only">Dia</legend>
          <div className="flex items-baseline justify-between px-1">
            <p className="display text-xl capitalize">{months.join(" / ")}</p>
            <p className="sign text-[0.6875rem] text-paper-muted">{year}</p>
          </div>
          <div aria-hidden="true" className="mt-4 grid grid-cols-7 text-center">
            {WEEK_INITIALS.map((d, i) => (
              <span key={i} className="sign text-[0.625rem] text-paper-muted">
                {d}
              </span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (!day) return <span key={`empty-${i}`} aria-hidden="true" />;
              const checked = dayKey === day.key;
              const isToday = day.key === days[0]?.key;
              const id = `${uid}-day-${day.key}`;
              return (
                <label
                  key={day.key}
                  htmlFor={id}
                  className={cn(
                    "field-focus relative mx-auto grid aspect-square w-full max-w-11 place-items-center rounded-full text-[0.9375rem] transition-[background-color,color]",
                    !day.open && "cursor-not-allowed text-paper-ink/25 [background:repeating-linear-gradient(-45deg,transparent_0_4px,rgb(28_23_17/0.07)_4px_5px)]",
                    day.open && !checked && "cursor-pointer font-semibold hover:bg-paper-ink/10",
                    checked && "bg-paper-ink font-semibold text-paper",
                  )}
                >
                  <input
                    id={id}
                    type="radio"
                    name={`${uid}-day`}
                    className="sr-only"
                    checked={checked}
                    disabled={!day.open}
                    onChange={() => onDay(day.key)}
                  />
                  <span className="sr-only">
                    {isToday ? "Hoje, " : ""}
                    {dateLabel(day)}
                    {day.open ? "" : " (fechado)"}
                  </span>
                  <span aria-hidden="true">{day.day}</span>
                  {isToday && (
                    <span aria-hidden="true" className={cn("absolute bottom-1 size-1 rounded-full", checked ? "bg-copper-200" : "bg-copper-700")} />
                  )}
                </label>
              );
            })}
          </div>
          <p className="mt-3 flex items-center gap-2 px-1 text-xs text-paper-muted">
            <span aria-hidden="true" className="size-1 rounded-full bg-copper-700" /> hoje
            <span aria-hidden="true" className="ml-3 inline-block size-3 rounded-full [background:repeating-linear-gradient(-45deg,transparent_0_2px,rgb(28_23_17/0.25)_2px_3px)]" />{" "}
            fechado
          </p>
        </fieldset>

        <fieldset disabled={!dayKey}>
          <legend className="sign mb-3 flex w-full items-baseline justify-between text-[0.6875rem] tracking-[0.24em] text-paper-muted">
            <span>Horário</span>
            {dayKey && <span className="normal-case tracking-normal">{free ? `${free} livres` : "Sem horários livres"}</span>}
          </legend>
          {!dayKey ? (
            <div className="grid h-full min-h-48 place-items-center rounded-[4px] border border-dashed border-paper-ink/25 px-6 text-center">
              <p className="display-italic text-xl text-paper-muted">Escolha um dia no calendário.</p>
            </div>
          ) : free === 0 ? (
            <div className="grid min-h-48 place-items-center rounded-[4px] border border-dashed border-paper-ink/25 px-6 text-center">
              <p className="display-italic text-xl text-paper-muted">Esse dia lotou. Que tal o próximo?</p>
            </div>
          ) : (
            <div className="space-y-4">
              {periods.map((period) => {
                const list = slots.filter((s) => s.minutes >= period.from && s.minutes < period.to);
                if (!list.length) return null;
                const Icon = period.icon;
                return (
                  <div key={period.id}>
                    <p className="flex items-center gap-2 text-xs text-paper-muted">
                      <Icon aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
                      {period.label}
                    </p>
                    <div className="mt-2 grid grid-cols-4 gap-1.5">
                      {list.map((s) => {
                        const checked = slot === s.minutes;
                        const id = `${uid}-slot-${s.minutes}`;
                        return (
                          <label
                            key={s.minutes}
                            htmlFor={id}
                            className={cn(
                              "field-focus sign grid h-10 place-items-center rounded-[3px] border text-[0.9375rem] transition-[background-color,border-color]",
                              !s.available && "cursor-not-allowed border-transparent text-paper-ink/25 line-through",
                              s.available && !checked && "cursor-pointer border-paper-ink/20 bg-white/40 hover:border-paper-ink/50",
                              checked && "border-copper-700 bg-copper-700 text-paper",
                            )}
                          >
                            <input
                              id={id}
                              type="radio"
                              name={`${uid}-slot`}
                              className="sr-only"
                              checked={checked}
                              disabled={!s.available}
                              onChange={() => onSlot(s.minutes)}
                            />
                            {s.label}
                            {!s.available && <span className="sr-only"> (ocupado)</span>}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </fieldset>
      </div>
    </div>
  );
}

function StepDetails({
  headingRef,
  uid,
  name,
  phone,
  note,
  touched,
  nameValid,
  phoneValid,
  onName,
  onPhone,
  onNote,
  onSubmit,
}: {
  headingRef: HeadingRef;
  uid: string;
  name: string;
  phone: string;
  note: string;
  touched: boolean;
  nameValid: boolean;
  phoneValid: boolean;
  onName: (v: string) => void;
  onPhone: (v: string) => void;
  onNote: (v: string) => void;
  onSubmit: () => void;
}) {
  const nameError = touched && !nameValid;
  const phoneError = touched && !phoneValid;
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <StepTitle headingRef={headingRef} hint="Sem cadastro e sem senha. Só para a barbearia saber quem vem.">
        Quase <span className="display-italic text-copper-700">lá.</span>
      </StepTitle>
      <div className="grid gap-6">
        <LineField id={`${uid}-name`} label="Seu nome" error={nameError ? "Informe seu nome." : undefined}>
          {(props) => (
            <input {...props} value={name} onChange={(e) => onName(e.target.value)} autoComplete="name" placeholder="Como te chamamos?" maxLength={60} />
          )}
        </LineField>
        <LineField id={`${uid}-phone`} label="WhatsApp" optional error={phoneError ? "Confira o número com DDD." : undefined}>
          {(props) => (
            <input
              {...props}
              value={phone}
              onChange={(e) => onPhone(e.target.value)}
              autoComplete="tel-national"
              inputMode="tel"
              placeholder="(47) 90000-0000"
            />
          )}
        </LineField>
        <LineField id={`${uid}-note`} label="Observação" optional>
          {(props) => (
            <textarea
              {...props}
              rows={2}
              value={note}
              onChange={(e) => onNote(e.target.value)}
              placeholder="Ex.: quero manter o comprimento em cima."
              maxLength={240}
            />
          )}
        </LineField>
      </div>
      <button type="submit" tabIndex={-1} aria-hidden="true" className="sr-only">
        Enviar
      </button>
    </form>
  );
}

/** Campo escrito "na linha" da comanda, sem caixa: só a pauta e a tinta. */
function LineField({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: (props: {
    id: string;
    className: string;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
  }) => ReactNode;
}) {
  return (
    <div className="group">
      <label htmlFor={id} className="sign flex items-baseline justify-between text-[0.6875rem] tracking-[0.22em] text-paper-muted">
        {label}
        {optional && <span className="normal-case tracking-normal">opcional</span>}
      </label>
      <div className="relative">
        {children({
          id,
          className:
            "peer mt-1 block w-full resize-none border-0 border-b-[1.5px] border-paper-ink/30 bg-transparent px-0 py-2.5 text-[1.0625rem] text-paper-ink placeholder:text-paper-muted/60 caret-copper-700 outline-none",
          "aria-invalid": Boolean(error),
          "aria-describedby": error ? `${id}-error` : undefined,
        })}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-0 left-0 h-[1.5px] w-full origin-left scale-x-0 transition-transform duration-500 ease-out-expo peer-focus:scale-x-100",
            error ? "scale-x-100 bg-[#9b2c1d]" : "bg-copper-700",
          )}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="display-italic mt-2 text-base text-[#9b2c1d]">
          {error}
        </p>
      )}
    </div>
  );
}

function Receipt({
  headingRef,
  lines,
  total,
  duration,
  when,
  barber,
  name,
  whatsappHref,
  onReset,
}: {
  headingRef: HeadingRef;
  lines: { name: string; price: number; duration: number }[];
  total: number;
  duration: number;
  when: string;
  barber: string;
  name: string;
  whatsappHref: string;
  onReset: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="stamp grid size-12 shrink-0 place-items-center rounded-full border-2 border-copper-700 text-copper-700">
          <Check aria-hidden="true" className="size-6" strokeWidth={2.6} />
        </span>
        <h3 ref={headingRef} tabIndex={-1} className="display text-[2rem] leading-none sm:text-[2.375rem]">
          Tudo pronto, <span className="display-italic text-copper-700">{name.split(" ")[0]}.</span>
        </h3>
      </div>
      <p className="mt-3 text-sm text-paper-muted">Confira e envie. A confirmação chega pelo WhatsApp.</p>

      <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-paper-ink/20 bg-paper-ink/20">
        <div className="bg-paper px-4 py-3.5">
          <dt className="sign text-[0.625rem] tracking-[0.24em] text-paper-muted">Quando</dt>
          <dd className="mt-1.5 font-semibold">{when}</dd>
        </div>
        <div className="bg-paper px-4 py-3.5">
          <dt className="sign text-[0.625rem] tracking-[0.24em] text-paper-muted">Profissional</dt>
          <dd className="mt-1.5 font-semibold">{barber}</dd>
        </div>
      </dl>

      <table className="mt-6 w-full text-left text-[0.9375rem]">
        <caption className="sr-only">Serviços do agendamento</caption>
        <thead>
          <tr className="sign text-[0.625rem] tracking-[0.24em] text-paper-muted">
            <th scope="col" className="pb-2 font-semibold">
              Serviço
            </th>
            <th scope="col" className="pb-2 text-right font-semibold">
              Tempo
            </th>
            <th scope="col" className="pb-2 text-right font-semibold">
              Valor
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.name} className="border-t border-dashed border-paper-ink/25">
              <td className="py-2.5 pr-2">{line.name}</td>
              <td className="sign py-2.5 text-right text-sm text-paper-muted normal-case">{formatDuration(line.duration)}</td>
              <td className="sign py-2.5 pl-3 text-right text-base">{formatPrice(line.price)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-paper-ink">
            <th scope="row" className="sign pt-3 text-sm font-semibold">
              Total
            </th>
            <td className="sign pt-3 text-right text-sm text-paper-muted normal-case">{formatDuration(duration)}</td>
            <td className="sign pt-3 pl-3 text-right text-3xl">{formatPrice(total)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn min-h-13 flex-1 bg-paper-ink text-paper hover:bg-copper-700">
          <Send aria-hidden="true" className="size-[18px]" />
          Enviar pelo WhatsApp
          <span className="sr-only">(abre em uma nova aba)</span>
        </a>
        <button type="button" onClick={onReset} className="btn min-h-13 border border-paper-ink/25 text-paper-ink hover:border-paper-ink">
          <RotateCcw aria-hidden="true" className="size-[18px]" />
          Novo
        </button>
      </div>

      <p className="mt-6 border-t border-dashed border-paper-ink/30 pt-4 text-xs leading-relaxed text-paper-muted">
        Projeto conceitual: aqui você escolhe o contato no WhatsApp. No site de uma barbearia real, a mensagem iria direto para o número dela.
      </p>
      <Barcode />
    </div>
  );
}

function Barcode() {
  const bars = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 2];
  return (
    <div aria-hidden="true" className="mt-5 flex h-10 items-stretch justify-center gap-[2px] opacity-80">
      {bars.map((w, i) => (
        <span key={i} className={i % 2 ? "bg-transparent" : "bg-paper-ink"} style={{ width: w * 1.5 }} />
      ))}
    </div>
  );
}
