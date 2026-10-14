"use client";

import { useState } from "react";
import { siteConfig } from "../config/site";

export function ResumeForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessage(data.message);
    } catch (err) {
      setError(`${(err as Error).message} You can also call ${siteConfig.phoneDisplay}.`);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="resume-email" className="block text-sm font-semibold">
          Email
        </label>
        <input
          id="resume-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "resume-error" : undefined}
          className="mt-2 w-full rounded-2xl border border-blue-200 px-4 py-3 text-base focus:border-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/30"
        />
      </div>
      <div aria-live="polite">
        {message && <p className="text-sm text-emerald-800">{message}</p>}
        {error && (
          <p id="resume-error" className="text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={sending}
        className="rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-900 disabled:bg-slate-500"
      >
        {sending ? "Sending…" : "Email my scheduling link"}
      </button>
    </form>
  );
}
