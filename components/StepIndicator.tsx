const STEPS = ["Details", "Payment", "Schedule", "Confirmation"] as const;
export type Step = (typeof STEPS)[number];

export function StepIndicator({ current }: { current: Step }) {
  const index = STEPS.indexOf(current);
  return (
    <ol aria-label="Booking progress" className="flex flex-wrap gap-2 text-xs font-semibold sm:text-sm">
      {STEPS.map((step, i) => (
        <li
          key={step}
          aria-current={i === index ? "step" : undefined}
          className={
            i === index
              ? "rounded-full bg-blue-950 px-3 py-1.5 text-white"
              : i < index
                ? "rounded-full bg-blue-100 px-3 py-1.5 text-blue-950"
                : "rounded-full border border-blue-200 bg-white px-3 py-1.5 text-slate-700"
          }
        >
          <span className="sr-only">{i < index ? "Completed: " : i === index ? "Current: " : "Upcoming: "}</span>
          {i + 1}. {step}
        </li>
      ))}
    </ol>
  );
}
