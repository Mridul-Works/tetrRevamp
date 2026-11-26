"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "./icons";

const pill =
  "group/btn relative inline-flex h-12 items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-sm px-6 text-[12.5px] font-semibold uppercase tracking-[0.14em] transition-[color,background-color,border-color,transform] duration-300";

type Common = { children: React.ReactNode; className?: string; icon?: React.ReactNode | false };
type AsLink = Common & { href: string; onClick?: never; external?: boolean };
type AsButton = Common & { href?: never; onClick: () => void; external?: never };

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

function Inner({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode | false }) {
  return (
    <>
      <span className="relative z-10">{children}</span>
      {icon !== false && (
        <span className="relative z-10 grid size-8 place-items-center rounded-xs bg-black/10 transition-transform duration-300 group-hover/btn:rotate-45">
          {icon ?? <ArrowUpRight width={16} height={16} />}
        </span>
      )}
    </>
  );
}

export function GoldButton(props: AsLink | AsButton) {
  const m = useMagnet<HTMLAnchorElement & HTMLButtonElement>();
  const cls = cn(pill, "bg-gold text-gold-ink hover:bg-[#ffd75e]", props.icon !== false && "pr-2", props.className);
  if (props.href)
    return (
      <a {...m} href={props.href} target={props.external === false ? undefined : "_blank"} rel="noopener noreferrer" className={cls}>
        <Inner icon={props.icon}>{props.children}</Inner>
      </a>
    );
  return (
    <button {...m} type="button" onClick={props.onClick} className={cls}>
      <Inner icon={props.icon}>{props.children}</Inner>
    </button>
  );
}

export function OutlineButton(props: (AsLink | AsButton) & { tone?: "dark" | "light" }) {
  const m = useMagnet<HTMLAnchorElement & HTMLButtonElement>();
  const cls = cn(
    pill,
    props.tone === "light" ? "border border-ink/25 text-ink hover:bg-ink hover:text-snow" : "border border-snow/35 text-snow hover:border-snow hover:bg-snow hover:text-ink",
    props.className,
  );
  const content = (
    <>
      {props.icon}
      <span>{props.children}</span>
    </>
  );
  if (props.href)
    return (
      <a {...m} href={props.href} target="_blank" rel="noopener noreferrer" className={cls}>
        {content}
      </a>
    );
  return (
    <button {...m} type="button" onClick={props.onClick} className={cls}>
      {content}
    </button>
  );
}

/** Prev / next pair used by every carousel. */
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
  const btn = "grid size-12 shrink-0 place-items-center rounded-sm transition-all duration-300 disabled:pointer-events-none disabled:opacity-30";
  return (
    <div className={cn("flex gap-3", className)}>
      <button
        type="button"
        aria-label={`Previous ${name}`}
        disabled={prevDisabled}
        onClick={onPrev}
        className={cn(btn, tone === "light" ? "border border-ink/15 text-ink hover:border-ink" : "border border-snow/25 text-snow hover:border-snow")}
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        aria-label={`Next ${name}`}
        disabled={nextDisabled}
        onClick={onNext}
        className={cn(btn, "bg-deep text-snow hover:bg-mint hover:text-ink")}
      >
        <ChevronRight />
      </button>
    </div>
  );
}

/** Pill tab button. */
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
        "inline-flex h-11 items-center whitespace-nowrap rounded-sm px-5 text-[14px] transition-colors duration-300",
        tone === "dark"
          ? active
            ? "bg-mint text-ink"
            : "border border-snow/20 text-snow hover:bg-snow/10"
          : active
            ? "bg-ink text-snow"
            : "border border-ink/15 text-ink hover:bg-ink/5",
      )}
    >
      {children}
    </button>
  );
}
