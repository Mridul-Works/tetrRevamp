"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { v2Contact, v2Lead } from "@/data/v2";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "h-12 w-full border border-snow/20 bg-snow/5 px-4 text-[15px] text-snow placeholder:text-snow/40 outline-none transition-colors focus:border-mint";

/**
 * Phone-first lead form. Captures UTMs from the landing URL, carries a honeypot,
 * and fires the Meta + GTM conversion events only after the API answers 2xx.
 * On failure it hands the visitor to WhatsApp / phone so the lead is never lost.
 */
export default function LeadForm({ compact, className, placement = "hero" }: { compact?: boolean; className?: string; placement?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [trap, setTrap] = useState("");
  const [utm, setUtm] = useState("");
  const [interest, setInterest] = useState(v2Lead.interests[0]);
  const done = useRef<HTMLDivElement>(null);

  // attribution: utm_* / gclid / fbclid from the landing URL, as one string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keep: string[] = [];
    params.forEach((v, k) => {
      if (/^utm_|^gclid$|^fbclid$/i.test(k)) keep.push(`${k}=${v}`);
    });
    setUtm(keep.join("&").slice(0, 500));
  }, []);

  useEffect(() => {
    if (status === "sent") done.current?.focus();
  }, [status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    // bot filled the hidden field: pretend it worked, send nothing, count nothing
    if (trap) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    const eventId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    try {
      const res = await fetch(v2Lead.endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          interest,
          source: utm,
          page: "/v2",
          placement,
          eventId,
        }),
      });
      if (res.ok) {
        // both events or neither, and only on a confirmed 2xx
        if (typeof window.fbq === "function") window.fbq("track", "Lead", { content_name: interest }, { eventID: eventId });
        (window.dataLayer = window.dataLayer || []).push({ event: "lead_submit", interest, placement, event_id: eventId });
      }
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div ref={done} tabIndex={-1} role="status" className={cn("flex flex-col gap-5 bg-forest p-7 text-cream outline-none", className)}>
        <p className="v2-mono text-mint">✓ Received</p>
        <p className="v2-display text-[34px] leading-none text-snow">{v2Lead.success.title}</p>
        <p className="text-[15px] leading-[1.55] text-cream/70">{v2Lead.success.body}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a href={v2Lead.success.brochure.href} target="_blank" rel="noreferrer" className="v2-mono inline-flex h-12 items-center justify-center bg-gold px-5 font-semibold text-gold-ink">
            {v2Lead.success.brochure.label}
          </a>
          <a
            href={v2Contact.whatsapp}
            target="_blank"
            rel="noreferrer"
            onClick={() => (window.dataLayer = window.dataLayer || []).push({ event: "whatsapp_followup", placement })}
            className="v2-mono inline-flex h-12 items-center justify-center border border-snow/25 px-5 text-snow"
          >
            {v2Lead.success.whatsapp}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("relative flex flex-col gap-4 bg-forest p-6 text-cream md:p-7", className)} noValidate={false}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="v2-mono text-mint">{v2Lead.eyebrow}</p>
          <p className={cn("v2-display mt-2 leading-none text-snow", compact ? "text-[30px]" : "text-[clamp(30px,2.6vw,40px)]")}>{v2Lead.title}</p>
        </div>
      </div>
      {!compact && <p className="text-[14px] leading-[1.5] text-cream/70">{v2Lead.sub}</p>}

      {/* honeypot: humans never see it */}
      <input
        type="text"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        placeholder="Company"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="v2-mono text-cream/60">Full name</span>
          <input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="v2-mono text-cream/60">Phone (with country code)</span>
          <input name="phone" type="tel" required inputMode="tel" autoComplete="tel" pattern="^\+?[0-9 \(\)\-]{8,20}$" placeholder="+91 98765 43210" className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="v2-mono text-cream/60">Email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@example.com" className={field} />
        </label>
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="v2-mono mb-1.5 text-cream/60">I’m looking at</legend>
        <div className="flex flex-wrap gap-1.5">
          {v2Lead.interests.map((it) => (
            <button
              key={it}
              type="button"
              aria-pressed={interest === it}
              onClick={() => setInterest(it)}
              className={cn(
                "v2-mono h-9 border px-3 transition-colors",
                interest === it ? "border-gold bg-gold text-gold-ink" : "border-snow/20 text-cream/80 hover:border-snow/50",
              )}
            >
              {it}
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={status === "sending"}
        className="v2-mono mt-1 inline-flex h-13 items-center justify-center bg-gold px-6 text-[12.5px] font-semibold text-gold-ink transition-colors hover:bg-[#ffd75e] disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : v2Lead.submit}
      </button>

      <div aria-live="polite">
        {status === "error" && (
          <div className="border border-gold/50 p-4">
            <p className="font-medium text-snow">{v2Lead.error.title}</p>
            <p className="mt-1 text-[13.5px] text-cream/70">{v2Lead.error.body}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={v2Contact.whatsapp} target="_blank" rel="noreferrer" className="v2-mono border border-snow/30 px-3 py-2 text-snow">
                {v2Lead.error.whatsapp}
              </a>
              <a href={v2Contact.tel} className="v2-mono border border-snow/30 px-3 py-2 text-snow">
                {v2Lead.error.call}
              </a>
            </div>
          </div>
        )}
      </div>
      <p className="text-[11.5px] leading-[1.5] text-cream/45">{v2Lead.fine}</p>
    </form>
  );
}
