"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Adaptive hero background.
 *
 * - Always paints the poster (part of the visual identity, zero cost).
 * - Desktop, motion allowed, no Save-Data: lazily mounts the looping
 *   muted video and plays it while in view.
 * - Phones / reduced-motion / Save-Data: poster only.
 */
export function HeroVideo({
  poster,
  webm,
  mp4,
}: {
  poster: string;
  webm: string;
  mp4: string;
}) {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (reduce || !isDesktop || conn?.saveData) return;
    // defer one frame so we don't setState synchronously in the effect body
    const id = requestAnimationFrame(() => setShowVideo(true));
    return () => cancelAnimationFrame(id);
  }, []);

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
  }, [showVideo]);

  return (
    <div className="absolute inset-0 -z-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${poster})` }}
      />
      {showVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover [filter:brightness(0.5)_saturate(1.05)]"
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          aria-hidden
          tabIndex={-1}
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(237,27,63,0.28),transparent_34%),linear-gradient(180deg,rgba(8,8,8,0.35),rgba(6,6,6,0.82))]" />
    </div>
  );
}
