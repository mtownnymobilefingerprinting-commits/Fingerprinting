"use client";

import { reviews } from "../config/reviews";

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1 text-brand-700">
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          fill={index < value ? "currentColor" : "none"}
          stroke="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.85 5.77 6.36.93-4.6 4.49 1.08 6.31L10 15.77l-5.69 2.99 1.08-6.31-4.6-4.49 6.36-.93L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewAccordion() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {reviews.map((review) => (
        <div key={review.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-slate-950">{review.name}</p>
              <p className="mt-1 text-sm text-slate-500">{review.date}</p>
            </div>
            <StarRating value={review.rating} />
          </div>
          <p className="mt-4 text-slate-700">{review.quote}</p>
          {review.verified && <p className="mt-4 text-xs uppercase tracking-[0.24em] text-brand-700">Verified review</p>}
        </div>
      ))}
    </div>
  );
}
