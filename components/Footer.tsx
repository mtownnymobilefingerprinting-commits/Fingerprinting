import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "../config/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Image src={siteConfig.logo} alt={`${siteConfig.title} logo`} width={48} height={48} className="rounded-2xl bg-brand-900 p-2" />
            <div>
              <p className="text-xl font-semibold">{siteConfig.title}</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Mobile fingerprinting for businesses and professionals across Middletown, Orange County, Sullivan County,
                and the Hudson Valley.
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-slate-300">
            <p>Call: <a href={`tel:${siteConfig.phone}`} className="text-brand-300 hover:text-brand-100">{siteConfig.phone}</a></p>
            <p>Email: <a href={`mailto:${siteConfig.email}`} className="text-brand-300 hover:text-brand-100">{siteConfig.email}</a></p>
            <p>{siteConfig.hours}</p>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="font-semibold text-slate-100">Navigation</p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400">
              <Link href="/services">Services</Link>
              <Link href="/appointments">Appointments</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-slate-100">Service Areas</p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400">
              <Link href="/service-areas/middletown-ny">Middletown, NY</Link>
              <Link href="/service-areas/orange-county-ny">Orange County</Link>
              <Link href="/service-areas/sullivan-county-ny">Sullivan County</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-slate-100">Industries</p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400">
              <Link href="/industries/healthcare">Healthcare</Link>
              <Link href="/industries/schools-daycares">Schools & Daycares</Link>
              <Link href="/industries/law-firms">Law Firms</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-slate-100">Connect</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <a href={siteConfig.googleBusinessUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-brand-100">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-950">
                  G
                </span>
                Google Business
              </a>
              <a href={siteConfig.facebookUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-brand-100">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-slate-100">
                  f
                </span>
                Facebook
              </a>
              <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-brand-100">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 text-white">
                  I
                </span>
                Instagram
              </a>
            </div>
          </div>
        </div>
        <p className="border-t border-slate-800 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Middletown NY Mobile Fingerprinting. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
