import { Big_Shoulders, Caveat, Fraunces, Hanken_Grotesk } from "next/font/google";

/** Títulos: serifa com eixo ótico (desenho muda com o tamanho), calorosa sem ser rústica. */
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

/** Texto corrido. */
export const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

/** Rótulos, preços e botões: condensada, com cara de letreiro. */
export const shoulders = Big_Shoulders({
  subsets: ["latin"],
  variable: "--font-shoulders",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "sans-serif"],
});

/** Letra de mão, só nos recados colados no espelho. */
export const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  preload: false,
});

export const fontVariables = [fraunces.variable, hanken.variable, shoulders.variable, caveat.variable].join(" ");
