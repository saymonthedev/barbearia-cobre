export type ServiceCategory = "cabelo" | "barba" | "combos" | "extras";

export type Service = {
  id: string;
  category: ServiceCategory;
  name: string;
  /** Nome curto, como vai no letreiro de feltro. */
  board: string;
  description: string;
  /** Duração em minutos. */
  duration: number;
  /** Preço em reais. */
  price: number;
  featured?: boolean;
};

export const categories: { id: ServiceCategory; label: string; note: string }[] = [
  { id: "cabelo", label: "Cabelo", note: "Lavagem e finalização inclusas" },
  { id: "barba", label: "Barba", note: "Toalha quente em todas" },
  { id: "combos", label: "Combos", note: "Mais tempo na cadeira, menos no relógio" },
  { id: "extras", label: "Extras", note: "Para somar a qualquer serviço" },
];

export const services: Service[] = [
  { id: "corte-classico", category: "cabelo", name: "Corte clássico", board: "CORTE CLÁSSICO", description: "Máquina e tesoura, do jeito que você pedir.", duration: 45, price: 55 },
  { id: "degrade", category: "cabelo", name: "Degradê", board: "DEGRADÊ", description: "Fade do zero ao alto, com transição limpa.", duration: 50, price: 60, featured: true },
  { id: "tesoura", category: "cabelo", name: "Corte na tesoura", board: "NA TESOURA", description: "Para quem quer volume, textura e movimento.", duration: 55, price: 65 },
  { id: "infantil", category: "cabelo", name: "Corte infantil", board: "INFANTIL", description: "Até 10 anos, com paciência de sobra.", duration: 35, price: 45 },
  { id: "barba-completa", category: "barba", name: "Barba completa", board: "BARBA", description: "Desenho, aparo e hidratação com óleo.", duration: 30, price: 45 },
  { id: "navalha", category: "barba", name: "Navalha e toalha quente", board: "NAVALHA + TOALHA", description: "O barbear tradicional, devagar e no fio.", duration: 40, price: 55, featured: true },
  { id: "acabamento", category: "barba", name: "Pezinho e contorno", board: "PEZINHO", description: "Para manter o corte em dia entre as visitas.", duration: 15, price: 25 },
  { id: "corte-barba", category: "combos", name: "Corte + barba", board: "CORTE + BARBA", description: "O combo de sempre, sem pressa.", duration: 75, price: 95 },
  { id: "ritual", category: "combos", name: "Ritual Cobre", board: "RITUAL COBRE", description: "Corte, barba na navalha, toalha quente e massagem facial.", duration: 100, price: 135, featured: true },
  { id: "sobrancelha", category: "extras", name: "Sobrancelha", board: "SOBRANCELHA", description: "Na navalha ou na pinça.", duration: 10, price: 20 },
  { id: "pigmentacao", category: "extras", name: "Pigmentação", board: "PIGMENTAÇÃO", description: "Preenche falhas de barba ou do degradê.", duration: 20, price: 40 },
  { id: "hidratacao", category: "extras", name: "Hidratação", board: "HIDRATAÇÃO", description: "Tratamento para cabelo e couro cabeludo.", duration: 20, price: 35 },
];

export const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
};
