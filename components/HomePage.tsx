"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ServiceCard } from "./ServiceCard";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { ReviewAccordion } from "./ReviewAccordion";
import { ServiceDropdown } from "./ServiceDropdown";
import { services } from "../config/services";
import { siteConfig } from "../config/site";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
       {/* HERO SECTION */}
<section className="grid gap-12 lg:grid-cols-12 lg:items-center">

  {/* Left Column - Main Copy & CTAs */}
  <div className="space-y-8 lg:col-span-7">

    <Image
      src="/images/logo12.jpg"
      alt="Middletown NY Mobile Fingerprinting"
      width={500}
      height={180}
      priority
      className="h-auto w-full max-w-md object-contain"
    />

    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-800">
        <span className="h-2 w-2 rounded-full bg-blue-600"></span>
        Mobile Fingerprinting
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
        Mobile Fingerprinting. <br className="hidden sm:inline" />
        <span className="text-blue-900">We Come to You.</span>
      </h1>

      <p className="max-w-2xl text-lg text-slate-600">
        Professional mobile ink fingerprinting, FD-258 fingerprint cards,
        employment fingerprinting, and group services for businesses and
        professionals throughout Middletown, Orange County, Sullivan County,
        and the Hudson Valley.
      </p>
    </div>

  <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-800">
                <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                Mobile Fingerprinting
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Mobile Fingerprinting. <br className="hidden sm:inline" />
                <span className="text-blue-900">We Come to You.</span>
              </h1>
              
              <p className="max-w-2xl text-lg text-slate-600">
                Professional mobile ink fingerprinting, FD-258 fingerprint cards, employment fingerprinting, and group services for businesses and professionals throughout Middletown, Orange County, Sullivan County, and the Hudson Valley.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/appointments"
                className="inline-flex items-center justify-center rounded-xl bg-blue-950 px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:ring-offset-2"
              >
                Book an Appointment
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
              >
                Request a Quote
              </Link>
              <Link
                href="/pay"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-600 underline hover:text-blue-950"
              >
                Pay Now →
              </Link>
            </div>

            {/* Call Direct Box */}
            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-800">Call for fastest scheduling</p>
              <a
                href={`tel:${siteConfig.phone}`}
                className="mt-1 inline-block text-2xl font-bold tracking-tight text-blue-950 hover:text-blue-800"
              >
                {siteConfig.phone}
              </a>
              <p className="mt-1 text-xs text-slate-500">
                Secure checkout is available on service pages for prepaid appointments.
              </p>
            </div>
          </div>

          {/* Right Column - Highlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="relative overflow-hidden rounded-3xl border-2 border-blue-100/40 bg-blue-950 p-8 text-white shadow-xl sm:p-10">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-200">
                    Business-Grade Service
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Premium fingerprinting that adapts to your team.
                  </h2>
                  <p className="text-sm leading-relaxed text-blue-100/90">
                    Secure, mobile, and professional fingerprinting for HR teams, recruiters, healthcare organizations, schools, law firms, and government contractors.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">Service Area</p>
                    <p className="mt-1 text-sm font-medium text-white">Middletown, Orange & Sullivan County</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">Industries</p>
                    <p className="mt-1 text-sm font-medium text-white">Healthcare, Education, Law, Government</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FEATURED SERVICES SECTION */}
        <section className="mt-20 space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-900">Featured Services</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Fingerprinting solutions for businesses and professionals.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <ServiceDropdown />
              <Link href="/services" className="text-sm font-semibold text-blue-950 hover:underline">
                View all services &rarr;
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section className="mt-20">
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-900">Reviews</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Trusted by businesses and professionals.
              </h2>
              <p className="mt-1 text-slate-600">
                Real Google reviews from customers who chose reliable mobile fingerprinting across Middletown and the Hudson Valley.
              </p>
            </div>
            <ReviewAccordion />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 