"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { navItems } from "@/components/nav";
import { cn } from "@/lib/style";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
        scrolled || open ? "border-b border-(--line) bg-ink-950/92 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <div className="container-page flex h-(--header-h) items-center justify-between gap-6">
        <a href="#inicio" className="rounded-sm">
          <Logo />
          <span className="sr-only">, voltar ao início</span>
        </a>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="sign relative py-2 text-[0.8125rem] text-bone-soft transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-copper after:transition-transform after:duration-500 hover:text-bone hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a href="#agendar" className="btn btn-copper hidden min-h-11 px-5 text-[0.8125rem] sm:inline-flex">
            Agendar horário
          </a>
          <button
            ref={menuButton}
            type="button"
            className="grid size-11 place-items-center rounded-sm border border-(--line-strong) text-bone lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        ref={panel}
        hidden={!open}
        className="h-[calc(100dvh-var(--header-h))] overflow-y-auto border-t border-(--line) bg-ink-950 lg:hidden"
      >
        <nav aria-label="Navegação principal" className="container-page flex min-h-full flex-col pt-8 pb-10">
          <ol className="flex flex-col">
            {navItems.map((item, index) => (
              <li key={item.href} className="border-b border-(--line)">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-5 py-5"
                >
                  <span className="sign text-xs text-copper-300">{String(index + 1).padStart(2, "0")}</span>
                  <span className="display text-4xl">{item.label}</span>
                </a>
              </li>
            ))}
          </ol>
          <a href="#agendar" onClick={() => setOpen(false)} className="btn btn-copper mt-auto w-full">
            Agendar horário
          </a>
        </nav>
      </div>
    </header>
  );
}
