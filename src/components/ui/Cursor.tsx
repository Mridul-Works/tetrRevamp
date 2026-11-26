"use client";

import { useEffect, useRef } from "react";
import { finePointer } from "@/lib/pointer";

/** Anything the ring should react to as clickable. */
const HOT = "a, button, [role='button'], [role='tab'], summary, input, select, textarea, label";

/**
 * A mint ring that trails the mouse pointer. It grows over anything clickable, dips while the
 * button is held, and turns into a solid badge with a word (Play, Watch, Drag) over elements
 * that carry `data-cursor`. The native cursor stays, so nothing is lost inside iframes.
 * Mouse-only: on touch screens and with reduced motion it never renders anything visible.
 */
export default function Cursor() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = el.current;
    if (!c || !finePointer()) return;
    const label = c.querySelector<HTMLElement>(".cur__label");

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let raf = 0;
    let running = false;

    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      c.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      if (Math.abs(tx - x) > 0.15 || Math.abs(ty - y) > 0.15) raf = requestAnimationFrame(tick);
      else running = false;
    };
    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      c.classList.add("is-in");
      kick();
    };
    const over = (e: PointerEvent) => {
      const t = e.target instanceof Element ? e.target : null;
      const hot = t?.closest(HOT);
      c.classList.toggle("is-link", !!hot && !hot.matches(":disabled"));
      const word = t?.closest("[data-cursor]")?.getAttribute("data-cursor") ?? "";
      if (label) label.textContent = word;
      c.classList.toggle("is-label", !!word);
    };
    const down = () => c.classList.add("is-down");
    const up = () => c.classList.remove("is-down");
    // relatedTarget is null when the pointer leaves the window or enters an iframe
    const out = (e: PointerEvent) => {
      if (!e.relatedTarget) c.classList.remove("is-in", "is-link", "is-label");
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerout", out);
    };
  }, []);

  return (
    <div ref={el} aria-hidden className="cur">
      <span className="cur__ring" />
      <span className="cur__dot" />
      <span className="cur__label" />
    </div>
  );
}
