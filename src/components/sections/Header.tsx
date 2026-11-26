"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { LOGO, aboutMenu, programMenu } from "@/data/content";
import { cn } from "@/lib/cn";
import { ArrowUpRight, ChevronDown, Close, Menu } from "@/components/ui/icons";

/* Nav items: hover draws a mint underline; the item whose section is on screen keeps it (aria-current). */
const navLink =
  "relative py-1 text-[12.5px] uppercase tracking-[0.1em] text-snow/85 transition-colors hover:text-mint " +
  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-mint after:transition-transform after:duration-500 after:ease-out-expo hover:after:scale-x-100 " +
  "aria-[current=true]:text-mint aria-[current=true]:after:scale-x-100 aria-[expanded=true]:text-mint";
/** Sections that light up a nav item while they're on screen. */
const NAV_SECTIONS: Record<string, string> = { programs: "programs", faculty: "faculty" };
const menuRow =
  "group flex items-center justify-between gap-4 border-b border-line py-3 text-[13.5px] text-snow/85 transition-colors last:border-0 hover:text-mint";

export default function Header() {
  const [menu, setMenu] = useState<"programs" | "about" | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const last = useRef(0);

  // which nav item is "current": the section under the middle of the screen, if it has one
  useEffect(() => {
    const els = Object.keys(NAV_SECTIONS)
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setSection(NAV_SECTIONS[e.target.id]);
          else setSection((s) => (s === NAV_SECTIONS[e.target.id] ? null : s));
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  const lenis = useLenis(({ scroll, limit }) => {
    setScrolled(scroll > 24);
    // hide on scroll down, reveal on scroll up
    const dy = scroll - last.current;
    if (Math.abs(dy) > 6) setHidden(dy > 0 && scroll > 400);
    last.current = scroll;
    if (bar.current) bar.current.style.transform = `scaleX(${limit ? scroll / limit : 0})`;
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tell sticky elements on the page how much room the header takes right now (0 while it is tucked away).
  useEffect(() => {
    const shown = !(hidden && !menu && !mobile);
    document.documentElement.style.setProperty("--hdr", shown ? "64px" : "0px");
  }, [hidden, menu, mobile]);

  useEffect(() => {
    if (mobile) lenis?.stop();
    else lenis?.start();
  }, [mobile, lenis]);

  const jump = (hash: string) => {
    setMobile(false);
    const el = document.querySelector(hash);
    if (el) (lenis ? lenis.scrollTo(el as HTMLElement, { offset: -20 }) : el.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[padding,transform] duration-500 ease-out-expo",
        scrolled ? "px-0 py-0" : "px-4 py-3 md:px-[72px] md:py-4",
        hidden && !menu && !mobile ? "-translate-y-full" : "translate-y-0",
      )}
      onMouseLeave={() => setMenu(null)}
    >
      <div
        className={cn(
          "relative mx-auto flex h-16 items-center justify-between gap-6 border backdrop-blur-xl transition-all duration-500",
          scrolled
            ? "max-w-none rounded-none border-x-0 border-t-0 border-line bg-ink/85 px-5 md:px-[72px]"
            : "max-w-[1336px] rounded-sm border-snow/10 bg-ink/40 px-4 md:px-6",
        )}
      >
        <a href="#top" aria-label="Tetr College of Business home" onClick={(e) => (e.preventDefault(), jump("#top"))}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="Tetr College of Business" className="h-9 w-auto md:h-10" />
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-8 lg:flex">
          <button
            type="button"
            className={cn(navLink, "flex items-center gap-1")}
            aria-expanded={menu === "programs"}
            aria-current={section === "programs" || undefined}
            onMouseEnter={() => setMenu("programs")}
            onClick={() => setMenu(menu === "programs" ? null : "programs")}
          >
            Programs <ChevronDown width={14} height={14} className={cn("transition-transform", menu === "programs" && "rotate-180")} />
          </button>
          <a href="https://tetr.com/faculty" className={navLink} aria-current={section === "faculty" || undefined} onMouseEnter={() => setMenu(null)}>
            Faculty
          </a>
          <a href="https://tetr.com/student-life" className={navLink} onMouseEnter={() => setMenu(null)}>
            Student Life
          </a>
          <button
            type="button"
            className={cn(navLink, "flex items-center gap-1")}
            aria-expanded={menu === "about"}
            onMouseEnter={() => setMenu("about")}
            onClick={() => setMenu(menu === "about" ? null : "about")}
          >
            About <ChevronDown width={14} height={14} className={cn("transition-transform", menu === "about" && "rotate-180")} />
          </button>
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href="#scholarships"
            onClick={(e) => (e.preventDefault(), jump("#scholarships"))}
            className="hidden h-10 items-center rounded-sm bg-gold px-4 text-[13.5px] font-semibold text-gold-ink transition-[background-color,color,scale,box-shadow] duration-300 ease-out-expo hover:bg-[#ffd75e] hover:shadow-[0_10px_24px_-10px_rgba(242,201,76,0.7)] active:scale-[0.96] active:duration-100 sm:inline-flex"
          >
            Apply now
          </a>
          <a
            href="https://tetr.com/contact-us"
            className="hidden h-10 items-center rounded-sm border border-snow/25 px-4 text-[13.5px] font-semibold text-snow transition-[background-color,color,border-color,scale] duration-300 ease-out-expo hover:bg-snow hover:text-ink active:scale-[0.96] active:duration-100 sm:inline-flex"
          >
            Contact us
          </a>
          <button
            type="button"
            aria-label={mobile ? "Close menu" : "Open menu"}
            aria-expanded={mobile}
            onClick={() => setMobile((m) => !m)}
            className="grid size-10 place-items-center rounded-sm border border-snow/25 text-snow transition-[border-color,background-color,color] duration-300 hover:border-snow aria-expanded:bg-snow aria-expanded:text-ink lg:hidden"
          >
            {mobile ? <Close /> : <Menu />}
          </button>
        </div>

        {/* scroll progress */}
        <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px overflow-hidden">
          <span ref={bar} className="block h-full origin-left scale-x-0 bg-gradient-to-r from-mint to-gold" />
        </span>

        {/* Mega menus */}
        {menu && (
          <div
            className={cn(
              "absolute left-1/2 top-[calc(100%+10px)] hidden w-[min(1180px,calc(100vw-48px))] -translate-x-1/2 rounded-sm border border-snow/10 bg-ink/95 p-8 shadow-2xl backdrop-blur-xl [animation:rise-in_.35s_var(--ease-out-expo)] lg:block",
              menu === "about" && "w-[min(560px,calc(100vw-48px))]",
            )}
          >
            {menu === "programs" ? (
              <div className="grid grid-cols-5 gap-8">
                {programMenu.map((g) => (
                  <div key={g.label}>
                    <p className="eyebrow mb-3 text-mint">{g.label}</p>
                    {g.items.map((it) => (
                      <a key={it.label} href={it.href} className={menuRow}>
                        <span>{it.label}</span>
                        <ArrowUpRight width={14} height={14} className="shrink-0 opacity-40 transition-opacity group-hover:opacity-100" />
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-8">
                {aboutMenu.map((it) => (
                  <a key={it.label} href={it.href} className={menuRow}>
                    {it.label}
                    <ArrowUpRight width={14} height={14} className="opacity-40 transition-opacity group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile navigation */}
      {mobile && (
        <nav
          aria-label="Mobile navigation"
          data-lenis-prevent
          className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-ink px-5 pb-10 pt-4 [animation:fade-in_.3s_ease] lg:hidden"
        >
          <details open className="border-b border-line py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold uppercase tracking-[0.1em]">
              Programs <ChevronDown width={16} height={16} />
            </summary>
            <div className="mt-2 pl-2">
              {programMenu.map((g) => (
                <details key={g.label} className="py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-[14px] text-mint">
                    {g.label} <ChevronDown width={14} height={14} />
                  </summary>
                  {g.items.map((it) => (
                    <a key={it.label} href={it.href} onClick={() => setMobile(false)} className={menuRow}>
                      <span>{it.label}</span>
                      <ArrowUpRight width={14} height={14} className="shrink-0" />
                    </a>
                  ))}
                </details>
              ))}
            </div>
          </details>
          <a href="https://tetr.com/faculty" className="flex items-center justify-between border-b border-line py-4 text-[15px] font-semibold uppercase tracking-[0.1em]">
            Faculty <ArrowUpRight width={16} height={16} />
          </a>
          <a href="https://tetr.com/student-life" className="flex items-center justify-between border-b border-line py-4 text-[15px] font-semibold uppercase tracking-[0.1em]">
            Student Life <ArrowUpRight width={16} height={16} />
          </a>
          <details className="border-b border-line py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold uppercase tracking-[0.1em]">
              About <ChevronDown width={16} height={16} />
            </summary>
            <div className="mt-2 pl-2">
              {aboutMenu.map((it) => (
                <a key={it.label} href={it.href} className={menuRow}>
                  {it.label}
                  <ArrowUpRight width={14} height={14} />
                </a>
              ))}
            </div>
          </details>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a
              href="#scholarships"
              onClick={(e) => (e.preventDefault(), jump("#scholarships"))}
              className="grid h-12 place-items-center rounded-sm bg-gold font-semibold text-gold-ink"
            >
              Apply now
            </a>
            <a href="https://tetr.com/contact-us" className="grid h-12 place-items-center rounded-sm border border-snow/25 font-semibold">
              Contact us
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
