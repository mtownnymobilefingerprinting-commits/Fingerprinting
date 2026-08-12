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
    <div className="min-h-screen bg-brand-50 text-blue-950">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="max-w-xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-900">Mobile Fingerprinting</p>
              <h1 className="text-4xl font-semibold tracking-tight text-blue-950 sm:text-5xl">
                Mobile Fingerprinting. We Come to You.
              </h1>
              <p className="text-lg leading-8 text-blue-800">
                Professional mobile ink fingerprinting, FD-258 fingerprint cards, employment fingerprinting, and group fingerprinting services for businesses and professionals throughout Middletown, Orange County, Sullivan County, and the Hudson Valley.
              </p>
              <div className="mt-6 rounded-3xl border border-blue-100 bg-white p-5 text-sm text-blue-900 shadow-sm">
                <span className="font-semibold text-blue-950">Pricing:</span> $125 per person within 20 miles of Middletown, NY.
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/appointments"
                className="inline-flex items-center justify-center rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-800"
              >
                Book an Appointment
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white bg-white px-6 py-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-50"
              >
                Request a quote
              </Link>
              <Link
                href="/pay"
                className="inline-flex items-center justify-center rounded-full border border-blue-950 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-100"
              >
                Pay Now
              </Link>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.18em] text-blue-700">Call for fastest scheduling</p>
              <a href={`tel:${siteConfig.phone}`} className="mt-2 inline-block text-3xl font-semibold text-blue-950">
                {siteConfig.phone}
              </a>
              <p className="mt-3 text-sm text-blue-800">
                Secure checkout is available on service pages for prepaid appointments.
              </p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-[2rem] bg-brand-900 p-10 text-white shadow-2xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.1),_transparent_20%)]" />
            <div className="relative z-10 grid gap-6">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.28em] text-brand-200">Business-grade service</p>
                <h2 className="text-3xl font-semibold sm:text-4xl">Premium fingerprinting that adapts to your team.</h2>
                <p className="max-w-xl text-sm leading-7 text-brand-100">
                  Secure, mobile, and professional fingerprinting for HR teams, recruiters, healthcare organizations, schools, law firms, and government contractors.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/10 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-brand-200">Service Area</p>
                  <p className="mt-2 text-lg font-semibold">Middletown, Orange County, Sullivan County</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-brand-200">Industries</p>
                  <p className="mt-2 text-lg font-semibold">Healthcare, Education, Law, Government, Staffing</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-16 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-900">Featured services</p>
              <h2 className="text-3xl font-semibold text-blue-950">Fingerprinting solutions for businesses and professionals.</h2>
            </div>
            <div className="flex items-center gap-3">
              <ServiceDropdown />
              <Link href="/services" className="text-sm font-medium text-blue-950 hover:text-blue-800">
                View all services
              </Link>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
        <section className="mt-16">
          <div className="space-y-6 rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-900">Reviews</p>
            <h2 className="text-3xl font-semibold text-blue-950">Trusted by businesses and professionals.</h2>
            <p className="text-blue-800">Real Google reviews from customers who chose reliable mobile fingerprinting across Middletown and the Hudson Valley.</p>
            <ReviewAccordion />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
