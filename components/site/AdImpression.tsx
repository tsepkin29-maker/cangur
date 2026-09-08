"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import type { AdPlacement } from "@/lib/content/types";

/** Fires one `ad_impression` when the slot first enters the viewport. */
export function AdImpression({
  adId,
  placement,
}: {
  adId: string;
  placement: AdPlacement;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fired.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !fired.current) {
          fired.current = true;
          track("ad_impression", { adId, placement });
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [adId, placement]);

  return <span ref={ref} aria-hidden className="block h-0 w-0" />;
}
