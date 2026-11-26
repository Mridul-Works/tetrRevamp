"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { Close } from "./icons";

export type Video = { title: string; youtube?: string; instagram?: string; mp4?: string };

const Ctx = createContext<(v: Video) => void>(() => {});

/** Opens the shared video lightbox from anywhere on the page. */
export const usePlayVideo = () => useContext(Ctx);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [video, setVideo] = useState<Video | null>(null);
  const lenis = useLenis();
  const close = useCallback(() => setVideo(null), []);

  useEffect(() => {
    if (!video) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [video, lenis, close]);

  const vertical = !!video?.instagram || !!video?.mp4;

  return (
    <Ctx.Provider value={setVideo}>
      {children}
      {video && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
          className="fixed inset-0 z-[100] grid place-items-center bg-ink/85 p-4 backdrop-blur-xl [animation:fade-in_.3s_ease]"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Close video"
            onClick={close}
            className="absolute right-5 top-5 grid size-12 place-items-center rounded-sm border border-snow/25 text-snow transition-colors hover:bg-snow hover:text-ink"
          >
            <Close />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className={
              vertical
                ? "relative h-[min(86vh,820px)] aspect-[9/16] max-w-full overflow-hidden rounded-2xl bg-black"
                : "relative aspect-video w-[min(1100px,100%)] overflow-hidden rounded-2xl bg-black"
            }
          >
            {video.youtube ? (
              <iframe
                className="size-full"
                src={`https://www.youtube.com/embed/${video.youtube}?autoplay=1`}
                title={video.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : video.instagram ? (
              <iframe
                className="size-full bg-white"
                src={`https://www.instagram.com/reel/${video.instagram}/embed/`}
                title={video.title}
                allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
                allowFullScreen
              />
            ) : video.mp4 ? (
              <video className="size-full object-cover" src={video.mp4} controls autoPlay playsInline />
            ) : (
              <div className="grid size-full place-items-center p-8 text-center">
                <div>
                  <p className="eyebrow text-mint">Coming soon</p>
                  <p className="mt-3 text-xl font-semibold">{video.title}</p>
                  <p className="mt-2 text-sm text-byline">This video will play here once its link is added.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

/** Frosted round play button. */
export function PlayButton({ label, onClick, size = 56, className }: { label: string; onClick: () => void; size?: number; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{ width: size, height: size }}
      className={
        "grid place-items-center rounded-sm border border-white/25 bg-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,.35)] backdrop-blur-md transition-transform duration-300 hover:scale-110 hover:bg-white hover:text-ink " +
        (className ?? "")
      }
    >
      <svg width={size * 0.32} height={size * 0.32} viewBox="0 0 24 24" fill="currentColor" aria-hidden className="translate-x-[1px]">
        <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
      </svg>
    </button>
  );
}
