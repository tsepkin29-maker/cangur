"use client";

import { useEffect, useState } from "react";

/** Thin red scroll indicator down the left edge (legacy `.scroll-laser`). */
export function ScrollProgress({ label }: { label: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="pointer-events-none fixed left-0 top-0 z-[100] w-[3px] bg-gradient-to-b from-red-soft to-red shadow-[0_0_10px_rgba(237,27,63,0.95),0_0_22px_rgba(237,27,63,0.45)] sm:w-[3px] max-sm:w-[2px]"
      style={{ height: `${progress * 100}vh` }}
    />
  );
}
