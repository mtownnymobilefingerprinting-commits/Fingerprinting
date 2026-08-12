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
    <header className="sticky top-0 z-40 border-b border-blue-900/40 bg-blue-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-white">
          <Image src={siteConfig.logo} alt={`${siteConfig.title} logo`} width={44} height={44} className="rounded-2xl bg-white/10 p-1" />
          <span>{siteConfig.title}</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-white transition hover:text-blue-200">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link
  href="/pay"
  className="rounded-full bg-blue-950 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-900"
>
  Book Fingerprinting
</Link>
          <Link
            href="/contact"
            className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
          >
            Request a quote
          </Link>
        </div>
      </div>
    </header>
  );
}