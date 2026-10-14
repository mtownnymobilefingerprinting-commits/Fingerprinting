import Link from "next/link";

/** The single booking CTA. Booking always starts with payment. */
export function PayThenScheduleLink({ serviceSlug, className }: { serviceSlug?: string; className?: string }) {
  return (
    <Link
      href={serviceSlug ? `/pay?service=${encodeURIComponent(serviceSlug)}` : "/pay"}
      className={
        className ||
        "inline-flex w-full items-center justify-center rounded-xl bg-blue-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900"
      }
    >
      Pay, then Schedule
    </Link>
  );
}
