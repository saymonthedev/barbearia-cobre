import type { CSSProperties } from "react";

/** Atraso da animação de revelação, em ms. */
export const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");
