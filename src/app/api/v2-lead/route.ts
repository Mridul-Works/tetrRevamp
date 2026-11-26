import { NextResponse } from "next/server";

/**
 * Lead intake for /v2. Validates, rate-limits loosely, forwards to LEAD_WEBHOOK_URL.
 * Returns 502 when the webhook fails so the client fires no conversion event for a
 * lead the CRM never received. Error bodies are fixed strings, never the input.
 */

// Loose on purpose: Indian mobile traffic sits behind carrier NAT, so many real
// clicks share one IP. Validation and the honeypot are the bot filters, not this.
const LIMIT = 30;
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = str(body.name, 100);
  const phone = str(body.phone, 20).replace(/[^\d+ ()-]/g, "");
  const email = str(body.email, 200);
  const interest = str(body.interest, 40);
  const source = str(body.source, 600);
  const placement = str(body.placement, 40);
  const eventId = str(body.eventId, 64);

  if (name.length < 2 || phone.replace(/\D/g, "").length < 8) {
    return NextResponse.json({ error: "Invalid name or phone" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const lead = {
    name,
    phone,
    email,
    interest,
    source,
    page: "/v2",
    placement,
    eventId,
    receivedAt: new Date().toISOString(),
  };

  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) {
    // No CRM wired yet: accept so the page is testable, and make the gap visible in logs.
    console.warn("[v2-lead] LEAD_WEBHOOK_URL is not set; lead was NOT stored:", { ...lead, phone: "***", email: "***" });
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
  } catch (err) {
    console.error("[v2-lead] webhook failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Could not store lead" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, stored: true });
}
