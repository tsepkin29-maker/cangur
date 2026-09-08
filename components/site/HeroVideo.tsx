"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Adaptive hero background.
 *
 * - Always paints the poster (part of the visual identity, zero cost).
 * - Desktop, motion allowed, no Save-Data: lazily mounts the looping
 *   muted video and plays it while in view.
 * - Phones use `mobile` video if provided, else poster only.
 * - Reduced-motion / Save-Data: poster only.
 */
export function HeroVideo({
  poster,
  webm,
  mp4,
  mobile,
}: {
  poster: string;
  webm: string | null;
  mp4: string | null;
  mobile?: string | null;
}) {
  const [src, setSrc] = useState<{ webm: string | null; mp4: string | null } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (reduce || conn?.saveData) return;

    let next: { webm: string | null; mp4: string | null } | null = null;
    if (isDesktop && webm) next = { webm, mp4 };
    else if (!isDesktop && mobile) next = { webm: mobile, mp4: null };
    if (!next) return;

    const id = requestAnimationFrame(() => setSrc(next));
    return () => cancelAnimationFrame(id);
  }, [webm, mp4, mobile]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <div className="absolute inset-0 -z-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${poster})` }}
      />
      {src && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover [filter:brightness(0.55)]"
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          aria-hidden
          tabIndex={-1}
        >
          {src.webm ? <source src={src.webm} type="video/webm" /> : null}
          {src.mp4 ? <source src={src.mp4} type="video/mp4" /> : null}
        </video>
      )}
      {/* neutral black darkening for white-text contrast — no colour cast */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.55)_55%,rgba(0,0,0,0.74)_100%)]" />
    </div>
  );
}
