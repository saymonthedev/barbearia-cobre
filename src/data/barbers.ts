import type { StaticImageData } from "next/image";
import bruna from "@/assets/photos/barbeira-bruna.jpg";
import jorge from "@/assets/photos/barbeiro-jorge.jpg";
import rafael from "@/assets/photos/barbeiro-rafael.jpg";

export type Barber = {
  id: string;
  name: string;
  nickname: string;
  role: string;
  specialty: string;
  bio: string;
  photo: StaticImageData;
  /** Ponto focal da foto (object-position). */
  focus: string;
};

/** Profissionais fictícios; as fotos foram geradas por IA para este projeto. */
export const barbers: Barber[] = [
  {
    id: "rafael",
    name: "Rafael Teixeira",
    nickname: "Rafa",
    role: "Barbeiro",
    specialty: "Degradê e cortes modernos",
    bio: "Mão leve na máquina e olho clínico para transição. Se o seu fade nunca ficou do jeito que você queria, comece por ele.",
    photo: rafael,
    focus: "50% 28%",
  },
  {
    id: "jorge",
    name: "Jorge Almeida",
    nickname: "Seu Jorge",
    role: "Mestre barbeiro",
    specialty: "Barba e navalha clássica",
    bio: "Aprendeu o ofício com o pai e trata cada barba como uma peça. A toalha quente dele é motivo de fila.",
    photo: jorge,
    focus: "50% 22%",
  },
  {
    id: "bruna",
    name: "Bruna Costa",
    nickname: "Bruna",
    role: "Barbeira",
    specialty: "Tesoura e cabelos texturizados",
    bio: "Especialista em cachos, crespos e cortes com volume. Conversa sobre o seu cabelo antes de pegar a tesoura.",
    photo: bruna,
    focus: "50% 20%",
  },
];
