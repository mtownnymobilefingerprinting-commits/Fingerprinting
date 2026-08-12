"use client";

import Link from "next/link";
import type { ServiceConfig } from "../config/services";

type ServicePayButtonProps = {
  service: ServiceConfig;
  className?: string;
};

export function ServicePayButton({ service, className }: ServicePayButtonProps) {
  return (
    <Link
      href={`/pay?service=${service.id}`}
      className={
        className ||
        "inline-flex w-full items-center justify-center rounded-full bg-blue-950 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-900"
      }
    >
      Pay Now
    </Link>
  );
}