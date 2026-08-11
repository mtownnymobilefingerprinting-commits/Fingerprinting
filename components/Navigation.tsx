import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "../config/site";

const navItems = [
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
    <header className="sticky top-0 z-40 border-b border-brand-900 bg-brand-900/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-white">
          <Image src={siteConfig.logo} alt={`${siteConfig.title} logo`} width={44} height={44} className="rounded-2xl bg-white/10 p-1" />
          <span>{siteConfig.title}</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-white transition hover:text-brand-200">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/appointments"
            className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/20"
          >
            Book Fingerprinting
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
          >
            Request a quote
          </Link>
        </div>
      </div>
    </header>
  );
}
