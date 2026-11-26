"use client";

import { useCallback, useEffect, useRef } from "react";

/** True for a mouse/trackpad with motion allowed; the pointer effects below no-op otherwise. */
export function finePointer() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
}

/**
 * 3D tilt toward the pointer with a glare highlight. Sets --rx/--ry (deg) and --gx/--gy (%)
 * on the element; pair with the `.tilt` class in globals.css.
 */
export function useTilt<T extends HTMLElement>(max = 7) {
  const ref = useRef<T>(null);
  const frame = useRef(0);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      const el = ref.current;
      if (!el || e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.setProperty("--rx", `${((0.5 - py) * max * 2).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${((px - 0.5) * max * 2).toFixed(2)}deg`);
        el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      });
    },
    [max],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return { ref, onPointerMove, onPointerLeave };
}

/**
 * Pointer-tracking radial glow. Sets --mx/--my (px) on the element; pair with `.spotlight`.
 * Works on a container: the glow follows the pointer across the whole panel.
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--spot", "1");
  }, []);
  const onPointerLeave = useCallback(() => ref.current?.style.setProperty("--spot", "0"), []);
  return { ref, onPointerMove, onPointerLeave };
}

/**
 * Parallax layers inside a container: children with data-depth="0.4" drift toward the pointer
 * by that fraction of `range` px. Eases via CSS transition on the layer.
 */
export function usePointerParallax<T extends HTMLElement>(ref: React.RefObject<T | null>, range = 24) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer()) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"));
    if (!layers.length) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        for (const l of layers) {
          const d = parseFloat(l.dataset.depth || "0");
          l.style.translate = `${(nx * range * d).toFixed(1)}px ${(ny * range * d).toFixed(1)}px`;
        }
      });
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      for (const l of layers) l.style.translate = "0px 0px";
    };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [ref, range]);
}
