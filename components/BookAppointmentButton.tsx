"use client";

import { useRouter } from "next/navigation";

type BookAppointmentButtonProps = {
  serviceId: string;
  label?: string;
  className?: string;
};

export function BookAppointmentButton({
  serviceId,
  label = "Book Appointment",
  className,
}: BookAppointmentButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/pay?service=${encodeURIComponent(serviceId)}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        "inline-flex items-center justify-center rounded-xl bg-blue-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 active:bg-blue-900"
      }
    >
      {label}
    </button>
  );
} 