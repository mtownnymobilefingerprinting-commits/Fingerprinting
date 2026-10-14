"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileCheck2,
  HeartHandshake,
  UserCheck,
  CalendarCheck,
  Car,
  CheckCircle2,
} from "lucide-react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { ReviewAccordion } from "./ReviewAccordion";
import { ServiceDropdown } from "./ServiceDropdown";
import { siteConfig } from "../config/site";
import { policies } from "../config/policies";

// Step-by-Step process items
const steps = [
  {
    number: "01",
    title: "Choose & Pay",
    description:
      "Pick your service, enter your address, review your exact total, and pay securely online.",
    icon: CheckCircle2,
  },
  {
    number: "02",
    title: "Pick Your Time",
    description:
      "Right after your payment is confirmed, choose the appointment date and time that works for you.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "We Come to You",
    description:
      "Our mobile technician arrives at your home, office, or chosen location and prints your FD-258 or other ink cards on-site.",
    icon: Car,
  },
];

// Specialized Services Data
const specializedServices = [
  {
    id: "immigration-fingerprinting",
    title: "Immigration Fingerprinting",
    subtitle:
      "Immigration law firms, paralegals, and families preparing federal filings.",
    description:
      "Fingerprinting support for immigration petitions, naturalization, and visa-related background checks.",
    price: "$125 per person within 20 miles of Middletown, NY",
    icon: FileCheck2,
    slug: "immigration",
  },
  {
    id: "adoption-fingerprinting",
    title: "Adoption Fingerprinting",
    subtitle:
      "Adoption agencies, families, and attorneys arranging court-ready fingerprinting.",
    description:
      "Confidential fingerprinting for adoption home studies, guardianship filings, and family court requirements.",
    price: "$125 per person within 20 miles of Middletown, NY",
    icon: HeartHandshake,
    slug: "adoption",
  },
  {
    id: "personal-record-review",
    title: "Personal Record Review",
    subtitle:
      "Individuals preparing applications that require a fingerprint-based record review.",
    description:
      "Personal record review and fingerprinting consultation for applicants and record clearance requests.",
    price: "$125 per person within 20 miles of Middletown, NY",
    icon: UserCheck,
    slug: "personal-record-review",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />

      <main id="main" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* HERO SECTION */}
        <section className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* LEFT SIDE */}
          <div className="space-y-8 lg:col-span-7">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-800">
                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                Mobile Fingerprinting
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Mobile Fingerprinting.
                <br />
                <span className="text-blue-900">We Come to You.</span>
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Ink and FD-258 fingerprinting at your home, office, or business
                across Middletown, Orange County, Sullivan County, and the
                Hudson Valley.
              </p>
            </div>

            {/* PRICE + BUTTONS */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-slate-900">
                <p className="text-base font-semibold">{policies.pricingSummary}</p>
                <p className="mt-1">{policies.payFirstNotice}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/pay"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-950 px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-950 focus-visible:ring-offset-2"
                >
                  Pay, then Schedule
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Group or business quote
                </Link>
              </div>
            </div>

            {/* PHONE */}
            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-800">
                Questions? Call us
              </p>

              <a
                href={`tel:${siteConfig.phone}`}
                className="mt-1 inline-block text-2xl font-bold tracking-tight text-blue-950 hover:text-blue-800"
              >
                {siteConfig.phoneDisplay}
              </a>
            </div>
          </div>

          {/* RIGHT SIDE — LOGO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="relative overflow-hidden rounded-3xl bg-blue-950 p-6 shadow-xl sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-6 flex h-64 w-64 items-center justify-center overflow-hidden rounded-3xl bg-white/95 shadow-lg sm:h-72 sm:w-72">
                  <Image
                    src="/images/logo12.jpg"
                    alt="Middletown NY Mobile Fingerprinting"
                    width={500}
                    height={500}
                    className="h-full w-full object-contain mix-blend-multiply"
                    priority
                  />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">
                  Mobile Fingerprinting Services
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Professional. Mobile. Convenient.
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-blue-100">
                  We bring professional fingerprinting services directly to
                  your home, office, business, or organization.
                </p>

                <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                      Service Area
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      Middletown & Orange County
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                      Available For
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      Individuals & Businesses
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="mt-24 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-900">
              Simple 3-Step Process
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              How Mobile Fingerprinting Works
            </h2>
            <p className="text-slate-600 text-base">
              Fast, hassle-free service delivered right to your doorstep.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-900">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-2xl font-black text-slate-300">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SPECIALIZED SERVICES SECTION */}
        <section className="mt-24 space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-900">
                Specialized Solutions
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Dedicated Fingerprinting Services
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <ServiceDropdown />
              <Link
                href="/services"
                className="text-sm font-semibold text-blue-950 hover:underline"
              >
                View all services &rarr;
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {specializedServices.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-8"
                >
                  <div className="space-y-4">
                    {/* Header & Icon */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        Service
                      </span>
                    </div>

                    {/* Title & Audience */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {service.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-blue-900">
                        {service.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-slate-600">
                      {service.description}
                    </p>

                    {/* Pricing Badge */}
                    <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Pricing
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-800">
                        {service.price}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3 pt-4 border-t border-slate-100">
                    <Link
                      href={`/pay?service=${service.slug}`}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-blue-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900"
                    >
                      Pay, then Schedule
                    </Link>

                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center justify-center w-full gap-1 text-xs font-semibold text-blue-900 hover:text-blue-700 pt-1"
                    >
                      Learn more<span className="sr-only"> about {service.title}</span> &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section className="mt-24">
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-900">
                Reviews
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Trusted by businesses and professionals.
              </h2>
              <p className="mt-1 text-slate-600">
                Google reviews from customers across Middletown and the Hudson
                Valley.
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