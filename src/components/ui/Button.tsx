"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { ArrowUpRight, Check, ChevronLeft, ChevronRight } from "./icons";

/**
 * One state model for every button on the site:
 *   rest → hover (a fill sweeps in from the left, the icon nudges) → pressed (scales down)
 *   → done (link buttons flash a tick for a moment after they open their target).
 * Pressed uses the `scale` property, so it stacks with the magnet's `transform`.
 */
const pill =
  "group/btn relative inline-flex h-12 items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-sm px-6 text-[12.5px] font-semibold uppercase tracking-[0.14em] " +
  "transition-[color,background-color,border-color,box-shadow,scale] duration-300 ease-out-expo " +
  "active:scale-[0.97] active:duration-100 disabled:pointer-events-none disabled:opacity-40 " +
  "before:absolute before:inset-0 before:origin-left before:scale-x-0 before:transition-transform before:duration-500 before:ease-out-expo hover:before:scale-x-100 focus-visible:before:scale-x-100";

type Common = {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode | false;
  /** Label the page cursor shows while over this button, e.g. "Play". */
  cursor?: string;
};
type AsLink = Common & { href: string; onClick?: never; external?: boolean; disabled?: never };
type AsButton = Common & { href?: never; onClick: () => void; external?: never; disabled?: boolean };

/** Subtle magnetic pull toward the pointer. */
function useMagnet<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.28;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return { ref, onPointerMove: move, onPointerLeave: leave };
}

/** "Done" flash: true for a moment after a link button is used. */
function useDone() {
  const [done, setDone] = useState(false);
  const t = useRef(0);
  useEffect(() => () => window.clearTimeout(t.current), []);
  const flash = () => {
    setDone(true);
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setDone(false), 1800);
  };
  return { done, flash };
}

function Inner({ children, icon, done }: { children: React.ReactNode; icon?: React.ReactNode | false; done?: boolean }) {
  return (
    <>
      <span className="relative z-10 transition-transform duration-300 ease-out-expo group-hover/btn:-translate-y-px">{children}</span>
      {icon !== false && (
        <span
          className={cn(
            "relative z-10 grid size-8 place-items-center overflow-hidden rounded-xs transition-[background-color,color] duration-300",
            done ? "bg-mint text-ink" : "bg-current/10",
          )}
        >
          {/* the icon slides out and a tick slides in once the link has opened */}
          <span
            className={cn(
              "absolute inset-0 grid place-items-center transition-transform duration-300 ease-out-expo",
              done ? "-translate-y-full" : "group-hover/btn:translate-x-px group-hover/btn:-translate-y-px",
            )}
          >
            {icon ?? <ArrowUpRight width={16} height={16} />}
          </span>
          <span className={cn("absolute inset-0 grid place-items-center transition-transform duration-300 ease-out-expo", done ? "translate-y-0" : "translate-y-full")}>
            <Check width={16} height={16} />
          </span>
        </span>
      )}
    </>
  );
}

export function GoldButton(props: AsLink | AsButton) {
  const m = useMagnet<HTMLAnchorElement & HTMLButtonElement>();
  const { done, flash } = useDone();
  const cls = cn(
    pill,
    "bg-gold text-gold-ink before:bg-ink hover:text-gold hover:shadow-[0_16px_34px_-14px_rgba(242,201,76,0.55)] focus-visible:text-gold",
    props.icon !== false && "pr-2",
    done && "text-gold before:scale-x-100",
    props.className,
  );
  if (props.href)
    return (
      <a
        {...m}
        href={props.href}
        target={props.external === false ? undefined : "_blank"}
        rel="noopener noreferrer"
        data-cursor={props.cursor}
        onClick={flash}
        className={cls}
      >
        <Inner icon={props.icon} done={done}>
          {props.children}
        </Inner>
      </a>
    );
  return (
    <button {...m} type="button" onClick={props.onClick} disabled={props.disabled} data-cursor={props.cursor} className={cls}>
      <Inner icon={props.icon}>{props.children}</Inner>
    </button>
  );
}

export function OutlineButton(props: (AsLink | AsButton) & { tone?: "dark" | "light" }) {
  const m = useMagnet<HTMLAnchorElement & HTMLButtonElement>();
  const { done, flash } = useDone();
  const cls = cn(
    pill,
    props.tone === "light"
      ? "border border-ink/25 text-ink before:bg-ink hover:border-ink hover:text-snow focus-visible:text-snow"
      : "border border-snow/35 text-snow before:bg-snow hover:border-snow hover:text-ink focus-visible:text-ink",
    done && (props.tone === "light" ? "text-snow before:scale-x-100" : "text-ink before:scale-x-100"),
    props.className,
  );
  const content = (
    <>
      {props.icon && (
        <span className="relative z-10 grid place-items-center overflow-hidden">
          <span className={cn("transition-transform duration-300 ease-out-expo", done ? "-translate-y-6" : "group-hover/btn:scale-110")}>{props.icon}</span>
          <span className={cn("absolute transition-transform duration-300 ease-out-expo", done ? "translate-y-0" : "translate-y-6")}>
            <Check width={15} height={15} />
          </span>
        </span>
      )}
      <span className="relative z-10 transition-transform duration-300 ease-out-expo group-hover/btn:-translate-y-px">{props.children}</span>
    </>
  );
  if (props.href)
    return (
      <a {...m} href={props.href} target="_blank" rel="noopener noreferrer" data-cursor={props.cursor} onClick={flash} className={cls}>
        {content}
      </a>
    );
  return (
    <button {...m} type="button" onClick={props.onClick} disabled={props.disabled} data-cursor={props.cursor} className={cls}>
      {content}
    </button>
  );
}

/** Prev / next pair used by every carousel. Disabled at the ends, fills on hover, dips when pressed. */
export function NavArrows({
  onPrev,
  onNext,
  name,
  tone = "dark",
  prevDisabled,
  nextDisabled,
  className,
}: {
  onPrev: () => void;
  onNext: () => void;
  name: string;
  tone?: "dark" | "light";
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  className?: string;
}) {
  const btn =
    "group/arrow grid size-12 shrink-0 place-items-center rounded-sm transition-[background-color,border-color,color,scale,opacity] duration-300 ease-out-expo active:scale-90 active:duration-100 disabled:pointer-events-none disabled:opacity-30";
  const ico = "transition-transform duration-300 ease-out-expo";
  return (
    <div className={cn("flex gap-3", className)}>
      <button
        type="button"
        aria-label={`Previous ${name}`}
        disabled={prevDisabled}
        onClick={onPrev}
        className={cn(btn, tone === "light" ? "border border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-snow" : "border border-snow/25 text-snow hover:border-snow hover:bg-snow hover:text-ink")}
      >
        <ChevronLeft className={cn(ico, "group-hover/arrow:-translate-x-0.5")} />
      </button>
      <button type="button" aria-label={`Next ${name}`} disabled={nextDisabled} onClick={onNext} className={cn(btn, "bg-deep text-snow hover:bg-mint hover:text-ink")}>
        <ChevronRight className={cn(ico, "group-hover/arrow:translate-x-0.5")} />
      </button>
    </div>
  );
}

/** Pill tab button: the selected one is filled, the rest are outlined and lift on hover. */
export function Pill({
  active,
  onClick,
  children,
  tone = "dark",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-sm px-5 text-[14px] transition-[color,background-color,border-color,translate,scale,box-shadow] duration-300 ease-out-expo active:scale-95 active:duration-100",
        !active && "hover:-translate-y-px",
        tone === "dark"
          ? active
            ? "bg-mint font-semibold text-ink shadow-[0_10px_26px_-12px_rgba(122,209,156,0.7)]"
            : "border border-snow/20 text-snow hover:border-snow/50 hover:bg-snow/10"
          : active
            ? "bg-ink font-semibold text-snow shadow-[0_10px_26px_-12px_rgba(8,18,14,0.5)]"
            : "border border-ink/15 text-ink hover:border-ink/40 hover:bg-ink/5",
      )}
    >
      <span className={cn("size-1.5 rounded-full transition-[scale,opacity] duration-300", active ? "scale-100 bg-current opacity-100" : "scale-0 opacity-0")} aria-hidden />
      {children}
    </button>
  );
}
