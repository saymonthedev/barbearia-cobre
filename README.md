# Barbearia Cobre

> **Projeto conceitual de portfólio.** A marca, a equipe, o endereço, os preços e os depoimentos são fictícios. As fotos foram geradas por IA para este projeto.

Site e landing page para uma barbearia, com **agendamento online em uma comanda de papel**: o cliente escolhe serviço, profissional, dia e horário, e a confirmação sai pronta para o WhatsApp.

**[Ver a landing page](https://barbearia-cobre.vercel.app)** · **[Ver o site completo](https://barbearia-cobre.vercel.app/site)**

![Prévia do site](public/og.jpg)

## A ideia

Em vez das seções genéricas de sempre, cada parte do site é um objeto de dentro da barbearia:

| Seção | Objeto | O que faz |
|---|---|---|
| Topo | **Espelho redondo** com moldura de cobre | O reflexo reage ao mouse. Um bilhete colado mostra o **próximo horário livre**, que dá para reservar em um toque |
| Serviços | **Letreiro de feltro** com letras encaixadas | Cada linha é um botão que leva o serviço direto para a comanda |
| Ritual | **Faixa de etapas** | No computador, a seção fica presa na tela e as 5 etapas passam na horizontal conforme a rolagem. No celular, vira um carrossel |
| Agendamento | **Comanda de papel** serrilhada | Calendário próprio, horários por período, campos "escritos na linha", recibo com carimbo de confirmado |
| Equipe | **Cartas de baralho** em leque | Cada barbeiro tem um "naipe" (máquina, navalha, tesoura) e um botão para agendar com ele |
| Depoimentos | **Recados** colados no espelho | Escritos à mão, com fita adesiva |
| Visite | **Placa pendurada** "Aberto / Fechado" | Mostra o status real de agora, no fuso de Brasília |

A página inicial é uma **landing page** de oferta, que reaproveita a mesma linguagem para uma oferta: carimbo de preço, recibo com o que está incluso, três passos e a comanda já com o combo escolhido. O site institucional completo fica em **/site**.

## Funcionalidades

- **Agendamento em etapas** com estado compartilhado: o letreiro, as cartas da equipe e o bilhete do espelho preenchem a comanda e a comanda pula as etapas já resolvidas.
- **Agenda simulada** e determinística (horários ocupados variam por dia, profissional e hora), respeitando o horário de funcionamento e horários que já passaram.
- **Mensagem pronta para o WhatsApp** com serviço, profissional, data, duração e total.
- **Status ao vivo** (aberto, fecha em breve, fechado e próxima abertura).
- **Componentes 100% próprios:** nada de calendário, checkbox ou sanfona nativos do navegador. Os campos reais ficam acessíveis, mas o visual é todo desenhado.

## Tecnologias

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- `next/image` (AVIF/WebP), `next/font` (Fraunces, Hanken Grotesk, Big Shoulders e Caveat)
- Lucide para ícones
- Sem biblioteca de animação: CSS e um único `IntersectionObserver`

## Qualidade

- **Acessibilidade:** HTML semântico, navegação completa por teclado, foco visível, foco movido para o título a cada etapa da comanda, textos alternativos, contraste AA e respeito a `prefers-reduced-motion`.
- **Responsivo:** testado de 320 a 1440 px, sem rolagem horizontal.
- **SEO:** metadata, Open Graph com imagem própria, sitemap e robots. O JSON-LD descreve o site como projeto conceitual, sem se passar por um negócio real.
- **Lighthouse** (local, `next start`):

| Página | Desempenho (desktop / mobile) | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| Landing page (`/`) | 92 / 72–81 | 100 | 100 | 100 |
| Site completo (`/site`) | 99 / 84 | 100 | 100 | 100 |

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm run start
npm run lint
```

Requer Node.js 22 ou superior.

## Estrutura

```
src/
  app/                 landing page (/), site completo (/site), 404, SEO e estilos globais
  components/
    booking/           a comanda de agendamento
    hero/              espelho e bilhete do próximo horário
    landing/           componentes da landing page
    sections/          seções da página inicial
    ui/                logo, placa pendurada, status e botões
  data/                serviços, equipe, horários e depoimentos (fictícios)
  lib/                 agenda simulada, eventos da comanda e utilitários
```

## Autor

Desenvolvido por **Saymon Oliveira de Castro**, desenvolvedor Full Stack.

[saymonthedev.com](https://saymonthedev.com) · [GitHub](https://github.com/saymonthedev) · [LinkedIn](https://www.linkedin.com/in/saymon-oliveira-de-castro-821b71319)
