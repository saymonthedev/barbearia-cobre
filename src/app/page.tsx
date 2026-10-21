import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCta } from "@/components/MobileCta";
import { BookingSection } from "@/components/sections/BookingSection";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Services } from "@/components/sections/Services";
import { Space } from "@/components/sections/Space";
import { Team } from "@/components/sections/Team";
import { Notes } from "@/components/sections/Notes";
import { Ritual } from "@/components/sections/Ritual";
import { Visit } from "@/components/sections/Visit";
import { Suspense } from "react";
import { site, siteUrl } from "@/config/site";

/** O site descreve uma marca fictícia: o JSON-LD diz isso, em vez de se passar por um negócio real. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: `${siteUrl}/`,
  inLanguage: "pt-BR",
  description: site.description,
  genre: "Projeto conceitual de portfólio",
  creator: { "@type": "Person", name: site.author.name, url: site.author.url, sameAs: [site.author.github] },
};

export default function Home() {
  return (
    <>
      <a
        href="#conteudo"
        className="btn btn-copper fixed top-3 left-3 z-[70] -translate-y-24 focus-visible:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Marquee />
        {/* Cada seção hidrata separadamente: o topo fica interativo sem esperar o resto da página. */}
        <Suspense>
          <Services />
        </Suspense>
        <Suspense>
          <Ritual />
        </Suspense>
        <Suspense>
          <BookingSection />
        </Suspense>
        <Suspense>
          <Team />
        </Suspense>
        <Suspense>
          <Space />
        </Suspense>
        <Suspense>
          <Notes />
        </Suspense>
        <Suspense>
          <Visit />
        </Suspense>
      </main>
      <Footer />
      <MobileCta />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
