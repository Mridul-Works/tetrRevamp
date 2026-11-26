"use client";

import { useTilt } from "@/lib/pointer";
import { cn } from "@/lib/cn";

/**
 * Wraps a card so it leans toward the pointer, with a glare sweeping across it.
 * Keep it a wrapper: cards that enter with a keyframe animation hold their own transform.
 */
export default function Tilt({
  children,
  className,
  max = 7,
  glare = true,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  style?: React.CSSProperties;
}) {
  const t = useTilt<HTMLDivElement>(max);
  return (
    <div ref={t.ref} onPointerMove={t.onPointerMove} onPointerLeave={t.onPointerLeave} className={cn("tilt relative", glare && "tilt-glare", className)} style={style}>
      {children}
    </div>
  );
}
