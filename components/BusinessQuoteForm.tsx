"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

function downloadCsv(data: QuoteFormValues) {
  const headers = [
    "Company Name / Individual Name",
    "Contact Name",
    "Email",
    "Phone",
    "Industry",
    "Number of Employees",
    "Service Needed",
    "Fingerprint Type",
    "Location Address",
    "Preferred Date",
    "Notes"
  ];
  const companyLabel = data.companyName?.trim() || "quote";
  const rows = [
    [
      data.companyName || "",
      data.contactName,
      data.email,
      data.phone,
      data.industry,
      data.employees,
      data.serviceNeeded,
      data.fingerprintType,
      data.businessAddress,
      data.preferredDate || "",
      data.notes || ""
    ]
  ];
  const csvContent = [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `quote-request-${companyLabel.replace(/\s+/g, "-").toLowerCase()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function BusinessQuoteForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<QuoteFormValues>({ resolver: zodResolver(quoteSchema) });

  const onSubmit = async (data: QuoteFormValues) => {
    setError(null);

    try {
      localStorage.setItem("fingerprintQuoteRequest", JSON.stringify(data));
      downloadCsv(data);
      router.push("/checkout");
    } catch (err) {
      setError("Unable to submit quote request. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Request a quote</p>
        <h2 className="text-3xl font-semibold text-slate-950">Need on-site fingerprinting at your home or business?</h2>
        <p className="text-sm leading-7 text-slate-600">
          Request a quote and we’ll coordinate a mobile appointment at your location, whether it’s an individual visit or a small group.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Company or Name</span>
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register("companyName")} placeholder="Business or individual" />
          {errors.companyName && <span className="text-xs text-red-600">{errors.companyName.message}</span>}
        </label>
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Contact Name</span>
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register("contactName")} />
          {errors.contactName && <span className="text-xs text-red-600">{errors.contactName.message}</span>}
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Email</span>
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" type="email" {...register("email")} />
          {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
        </label>
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Phone</span>
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" type="tel" {...register("phone")} />
          {errors.phone && <span className="text-xs text-red-600">{errors.phone.message}</span>}
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Industry</span>
          <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register("industry")}>
            <option value="">Select industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          {errors.industry && <span className="text-xs text-red-600">{errors.industry.message}</span>}
        </label>
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Number of people</span>
          <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register("employees")}>
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
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Service Needed</span>
          <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register("serviceNeeded")}>
            <option value="">Select service</option>
            {services.map((service) => (
              <option key={service.id} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
          {errors.serviceNeeded && <span className="text-xs text-red-600">{errors.serviceNeeded.message}</span>}
        </label>
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Fingerprint Type</span>
          <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register("fingerprintType")}>
            <option value="">Select fingerprint type</option>
            {fingerprintTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.fingerprintType && <span className="text-xs text-red-600">{errors.fingerprintType.message}</span>}
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Location Address</span>
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register("businessAddress")} placeholder="We come to you" />
          {errors.businessAddress && <span className="text-xs text-red-600">{errors.businessAddress.message}</span>}
        </label>
        <label className="block space-y-2 text-sm text-slate-700">
          <span>Preferred Date</span>
          <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" type="date" {...register("preferredDate")} />
        </label>
      </div>
      <label className="block space-y-2 text-sm text-slate-700">
        <span>Notes</span>
        <textarea className="min-h-[120px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" {...register("notes")} />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Submitting..." : "Request a quote"}
      </button>
    </form>
  );
}
