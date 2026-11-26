import { cn } from "@/lib/cn";

/** Shared bits for the country toys: a readout cell, a small button, a status line. */

export function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "accent" | "warn" }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="v2-mono whitespace-nowrap text-cream/50">{label}</span>
      <span
        className={cn("v2-display text-[28px] leading-none tabular-nums", tone === "warn" && "text-[#ff7a6b]")}
        style={tone === "accent" ? { color: "var(--c)" } : undefined}
      >
        {value}
      </span>
    </div>
  );
}

export function ToyButton({ children, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "v2-mono inline-flex h-11 items-center justify-center border border-snow/25 px-4 text-cream transition-colors select-none hover:border-[var(--c)] hover:text-[var(--c)] disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function PrimaryToyButton({ children, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "v2-mono inline-flex h-12 items-center justify-center px-6 font-semibold text-ink transition-transform select-none active:scale-[0.97] disabled:opacity-50",
        className,
      )}
      style={{ background: "var(--c)" }}
    >
      {children}
    </button>
  );
}

/** The line under a toy that reacts to what you just did. */
export function Verdict({ children }: { children: React.ReactNode }) {
  return (
    <p aria-live="polite" className="min-h-[2.8em] text-[14px] leading-[1.4] text-cream/80">
      {children}
    </p>
  );
}
