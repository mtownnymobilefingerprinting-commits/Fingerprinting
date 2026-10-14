import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { siteConfig } from "../config/site";
import { MobileNav } from "./MobileNav";
import { PendingBookingBanner } from "./PendingBookingBanner";

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Business Solutions", href: "/business-solutions" },
  { label: "Industries", href: "/industries" },
  { label: "Appointments", href: "/appointments" },
  { label: "Service Areas", href: "/service-areas" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export function Navigation() {
  return (
    <>
    <header className="sticky top-0 z-40 border-b border-blue-900/40 bg-blue-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 xl:py-4">
        <Link href="/" className="flex min-w-0 items-center gap-3 text-base font-semibold text-white sm:text-lg">
          <Image src={siteConfig.logo} alt="" width={44} height={44} className="shrink-0 rounded-2xl bg-white/10 p-1" />
          <span className="min-w-0">{siteConfig.title}</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 xl:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-white transition hover:text-blue-200">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <Link
            href="/pay"
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Pay, then Schedule
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800"
          >
            Request a quote
          </Link>
        </div>
        <MobileNav items={navItems} />
      </div>
    </header>
    <Suspense fallback={null}>
      <PendingBookingBanner />
    </Suspense>
    </>
  );
}
