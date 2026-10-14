"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

// Disclosure-style menu (not a modal): a button toggles a list of ordinary links.
export function MobileNav({ items }: { items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close after client-side navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          {open ? (
            <path d="M5.3 4.3a1 1 0 0 0-1.4 1.4L8.6 10l-4.7 4.3a1 1 0 1 0 1.4 1.4L10 11.4l4.7 4.3a1 1 0 0 0 1.4-1.4L11.4 10l4.7-4.3a1 1 0 0 0-1.4-1.4L10 8.6 5.3 4.3Z" />
          ) : (
            <path d="M3 5h14a1 1 0 1 0 0-2H3a1 1 0 0 0 0 2Zm14 4H3a1 1 0 0 0 0 2h14a1 1 0 1 0 0-2Zm0 6H3a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2Z" />
          )}
        </svg>
        Menu
      </button>
      <nav
        id={panelId}
        aria-label="Main"
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-blue-900 bg-blue-950 px-4 pb-6 pt-2 shadow-xl sm:px-6"
      >
        <ul className="grid gap-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="block rounded-xl px-3 py-3 text-base text-white hover:bg-white/10 aria-[current=page]:bg-white/10"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link href="/pay" className="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-blue-950">
            Pay, then Schedule
          </Link>
          <Link href="/contact" className="rounded-full bg-orange-700 px-5 py-3 text-center text-sm font-semibold text-white">
            Request a quote
          </Link>
        </div>
      </nav>
    </div>
  );
}
