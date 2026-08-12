"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { services } from "../config/services";

const industries = [
  "Healthcare",
  "Education",
  "Law",
  "Staffing",
  "Government",
  "Real Estate",
  "Financial Services",
  "Other"
];

const fingerprintTypes = [
  "Mobile Ink Fingerprinting",
  "FD-258 Fingerprint Cards",
  "FBI Fingerprint Cards",
  "Immigration Fingerprinting",
  "Adoption Fingerprinting",
  "Employment Fingerprinting",
  "Corporate Fingerprinting"
];

const quoteSchema = z.object({
  companyName: z.string().optional(),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  industry: z.string().min(2, "Industry is required"),
  employees: z.string().optional(),
  serviceNeeded: z.string().min(2, "Service needed is required"),
  fingerprintType: z.string().min(2, "Fingerprint type is required"),
  businessAddress: z.string().min(5, "Location address is required"),
  preferredDate: z.string().optional(),
  notes: z.string().optional()
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export function BusinessQuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<QuoteFormValues>({ resolver: zodResolver(quoteSchema) });

const onSubmit = async (data: QuoteFormValues) => {
  setServerError(null);

  try {
    const formData = new FormData();
    formData.append("companyName", data.companyName || "");
    formData.append("contactName", data.contactName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("industry", data.industry);
    formData.append("numberOfPeople", data.employees || "");
    formData.append("serviceNeeded", data.serviceNeeded);
    formData.append("fingerprintType", data.fingerprintType);
    formData.append("locationAddress", data.businessAddress);
    formData.append("preferredDate", data.preferredDate || "");
    formData.append("notes", data.notes || "");

    const response = await fetch("https://formspree.io/f/mqpzbpvd", {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      setSubmitted(true);
      reset();
    } else {
      const errorData = await response.json();
      console.error("Formspree Response Error:", errorData);
      setServerError(
        errorData?.error || "Submission rejected by Formspree. Check reCAPTCHA/Domain settings in Formspree."
      );
    }
  } catch (err) {
    console.error("Network Error:", err);
    setServerError("Unable to connect to submission server. Please try calling us directly.");
  }
};

  if (submitted) {
    return (
      <div className="rounded-3xl border border-blue-200 bg-blue-50/80 p-8 text-center shadow-sm space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-950 text-xl">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-slate-950">Quote Request Received!</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Thank you! We have received your details and sent an automated confirmation email to your inbox. Our team will review your request and get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 inline-flex items-center justify-center rounded-2xl bg-blue-950 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-900"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Request a quote</p>
        <h2 className="text-3xl font-semibold text-slate-950">Need on-site fingerprinting at your home or business?</h2>
        <p className="text-sm leading-7 text-slate-600">
          Request a quote and we’ll coordinate a mobile appointment at your location, whether it’s an individual visit or a small group.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-xs font-semibold text-slate-700">
          <span>Company or Name</span>
          <input className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-950 focus:bg-white focus:outline-none" {...register("companyName")} placeholder="Business or individual" />
          {errors.companyName && <span className="text-xs font-normal text-red-600">{errors.companyName.message}</span>}
        </label>
        <label className="block space-y-2 text-xs font-semibold text-slate-700">
          <span>Contact Name</span>
          <input className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-950 focus:bg-white focus:outline-none" {...register("contactName")} />
          {errors.contactName && <span className="text-xs font-normal text-red-600">{errors.contactName.message}</span>}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-xs font-semibold text-slate-700">
          <span>Email</span>
          <input className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-950 focus:bg-white focus:outline-none" type="email" {...register("email")} />
          {errors.email && <span className="text-xs font-normal text-red-600">{errors.email.message}</span>}
        </label>
        <label className="block space-y-2 text-xs font-semibold text-slate-700">
          <span>Phone</span>
          <input className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-950 focus:bg-white focus:outline-none" type="tel" {...register("phone")} />
          {errors.phone && <span className="text-xs font-normal text-red-600">{errors.phone.message}</span>}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-xs font-semibold text-slate-700">
          <span>Industry</span>
          <select className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-950 focus:bg-white focus:outline-none" {...register("industry")}>
            <option value="">Select industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          {errors.industry && <span className="text-xs font-normal text-red-600">{errors.industry.message}</span>}
        </label>
        <label className="block space-y-2 text-xs font-semibold text-slate-700">
          <span>Number of people</span>
          <select className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-950 focus:bg-white focus:outline-none" {...register("employees")}>
            <option value="">Optional</option>
            <option value="1">1</option>
            <option value="2-5">2–5</option>
            <option value="6-10">6–10</option>
            <option value="11-25">11–25</option>
            <option value="25+">25+</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-xs font-semibold text-slate-700">
          <span>Service Needed</span>
          <select className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-950 focus:bg-white focus:outline-none" {...register("serviceNeeded")}>
            <option value="">Select service</option>
            {services.map((service) => (
              <option key={service.id} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
          {errors.serviceNeeded && <span className="text-xs font-normal text-red-600">{errors.serviceNeeded.message}</span>}
        </label>
        <label className="block space-y-2 text-xs font-semibold text-slate-700">
          <span>Fingerprint Type</span>
          <select className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-950 focus:bg-white focus:outline-none" {...register("fingerprintType")}>
            <option value="">Select fingerprint type</option>
            {fingerprintTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.fingerprintType && <span className="text-xs font-normal text-red-600">{errors.fingerprintType.message}</span>}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-xs font-semibold text-slate-700">
          <span>Location Address</span>
          <input className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-950 focus:bg-white focus:outline-none" {...register("businessAddress")} placeholder="We come to you" />
          {errors.businessAddress && <span className="text-xs font-normal text-red-600">{errors.businessAddress.message}</span>}
        </label>
        <label className="block space-y-2 text-xs font-semibold text-slate-700">
          <span>Preferred Date</span>
          <input className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-950 focus:bg-white focus:outline-none" type="date" {...register("preferredDate")} />
        </label>
      </div>

      <label className="block space-y-2 text-xs font-semibold text-slate-700">
        <span>Notes</span>
        <textarea className="min-h-[120px] w-full rounded-3xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-950 focus:bg-white focus:outline-none" {...register("notes")} />
      </label>

      {serverError && <p className="text-xs font-medium text-red-600">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Submitting..." : "Request a quote"}
      </button>
    </form>
  );
}