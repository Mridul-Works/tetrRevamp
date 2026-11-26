import { cn } from "@/lib/cn";

/** Seamless CSS marquee: content is rendered twice and the track slides by 50%. */
export default function Marquee({
  children,
  duration = 40,
  reverse,
  className,
  pauseOnHover = true,
}: {
  children: React.ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
  pauseOnHover?: boolean;
}) {
  return (
    <div className={cn("group/marquee mask-fade-x overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max animate-marquee",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
