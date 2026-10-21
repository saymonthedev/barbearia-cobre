"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/style";

/** Sanfona própria: uma pergunta aberta por vez, com altura animada via grid. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="border-t border-(--line-strong)">
      {items.map((item, index) => {
        const expanded = open === index;
        const panel = `${uid}-panel-${index}`;
        const button = `${uid}-button-${index}`;
        return (
          <li key={item.q} className="border-b border-(--line-strong)">
            <h3>
              <button
                id={button}
                type="button"
                aria-expanded={expanded}
                aria-controls={panel}
                onClick={() => setOpen(expanded ? null : index)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="flex items-baseline gap-5">
                  <span className="sign text-xs text-copper-300">{String(index + 1).padStart(2, "0")}</span>
                  <span className="display text-[1.5rem] leading-tight transition-colors group-hover:text-copper-200 sm:text-[1.75rem]">
                    {item.q}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-500 ease-out-expo",
                    expanded ? "rotate-45 border-copper bg-copper text-ink-950" : "border-(--line-strong) text-bone",
                  )}
                >
                  <Plus className="size-4" strokeWidth={2.2} />
                </span>
              </button>
            </h3>
            <div
              id={panel}
              role="region"
              aria-labelledby={button}
              inert={!expanded}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo",
                expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 pl-10 leading-relaxed text-bone-muted text-pretty">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
