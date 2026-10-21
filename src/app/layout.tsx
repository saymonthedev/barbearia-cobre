import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { fontVariables } from "@/config/fonts";
import { site, siteUrl } from "@/config/site";
import "./globals.css";

const title = `${site.name} — ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author.name, url: site.author.url }],
  creator: site.author.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Barbearia Cobre: corte com ofício" }],
  },
  twitter: { card: "summary_large_image", title, description: site.description, images: ["/og.jpg"] },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0907",
  colorScheme: "dark",
};

/** Liga as animações de revelação antes da primeira pintura; desliga em 4s se o JS falhar. */
const boot = `(function(){var d=document.documentElement;d.classList.add("js");setTimeout(function(){if(!("revealReady" in d.dataset))d.classList.remove("js")},4000)})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body className="grain">
        <RevealObserver />
        {children}
      </body>
    </html>
  );
}
