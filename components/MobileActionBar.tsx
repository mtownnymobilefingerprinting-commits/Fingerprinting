import Link from "next/link";
import { siteConfig } from "../config/site";

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-xl sm:hidden">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2">
        <Link href="/" className="flex-1 rounded-2xl bg-slate-100 px-3 py-2 text-center text-sm font-medium text-slate-800">
          Home
        </Link>
        <Link href="/services" className="flex-1 rounded-2xl bg-slate-100 px-3 py-2 text-center text-sm font-medium text-slate-800">
          Services
        </Link>
        <Link href="/appointments" className="flex-1 rounded-2xl bg-brand-700 px-3 py-2 text-center text-sm font-medium text-white">
          Book
        </Link>
        <a href={`tel:${siteConfig.phone}`} className="flex-1 rounded-2xl bg-slate-100 px-3 py-2 text-center text-sm font-medium text-slate-800">
          Call
        </a>
      </div>
    </div>
  );
}
