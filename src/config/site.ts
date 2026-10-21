/** Dados da marca. Tudo aqui é fictício: este é um projeto conceitual de portfólio. */
export const site = {
  name: "Barbearia Cobre",
  shortName: "Cobre",
  tagline: "Corte, barba e conversa boa.",
  description:
    "Barbearia Cobre: corte, barba na navalha e toalha quente, com agendamento online em menos de um minuto. Projeto conceitual de portfólio.",
  address: {
    street: "Rua do Ofício, 118",
    district: "Centro",
    city: "Jaraguá do Sul",
    state: "SC",
  },
  timeZone: "America/Sao_Paulo",
  author: {
    name: "Saymon Oliveira de Castro",
    url: "https://saymonthedev.com",
    github: "https://github.com/saymonthedev",
  },
} as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://barbearia-cobre.vercel.app").replace(/\/+$/, "");
