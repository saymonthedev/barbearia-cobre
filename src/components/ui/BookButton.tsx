"use client";

import type { ReactNode } from "react";
import { requestBooking, type BookingRequest } from "@/lib/booking-events";

/** Link para a comanda que, com JS, já deixa o serviço ou o barbeiro escolhido. */
export function BookButton({
  request,
  className,
  children,
  label,
}: {
  request: BookingRequest;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <a
      href="#agendar"
      aria-label={label}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        requestBooking(request);
      }}
    >
      {children}
    </a>
  );
}
