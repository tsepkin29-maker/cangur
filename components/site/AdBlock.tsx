"use client";

import Image from "next/image";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";
import type { AdPlacement } from "@/lib/content/types";

/**
 * The one premium partner block. Dark, restrained red, sporty — matches
 * Cangur, but a small label keeps it distinguishable from own content.
 *
 * Desktop: wide horizontal composition (image left, copy right).
 * Mobile:  vertical card, larger crop, big CTA, no fine print.
 */
export function AdBlock({
  id,
  placement,
  label,
  sponsorName,
  logo,
  desktopImage,
  mobileImage,
  title,
  subtitle,
  ctaLabel,
  targetUrl,
  className,
}: {
  id: string;
  placement: AdPlacement;
  label: string;
  sponsorName: string | null;
  logo: string | null;
  desktopImage: string;
  mobileImage: string | null;
  title: string;
  subtitle: string | null;
  ctaLabel: string | null;
  targetUrl: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fired.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !fired.current) {
          fired.current = true;
          track("ad_impression", { adId: id, placement });
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id, placement]);

  const onClick = () => track("ad_click", { adId: id, placement });

  return (
    <aside
      ref={ref}
      className={clsx("my-4", className)}
      aria-label={sponsorName ? `${label}: ${sponsorName}` : label}
    >
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={onClick}
        data-ad-id={id}
        className="group relative grid overflow-hidden rounded-card border border-line bg-[linear-gradient(120deg,#121212,#0c0c0c)] shadow-[0_0_28px_rgba(237,27,63,0.06)] transition-shadow hover:shadow-[0_0_34px_rgba(237,27,63,0.14)] sm:grid-cols-[minmax(0,42%)_1fr]"
      >
        {/* media — separate mobile/desktop crops when both are provided */}
        <div className="relative aspect-[16/10] w-full sm:aspect-auto sm:h-full sm:min-h-[220px]">
          {mobileImage ? (
            <Image
              src={mobileImage}
              alt={title || sponsorName || label}
              fill
              sizes="100vw"
              className="object-cover sm:hidden"
            />
          ) : null}
          <Image
            src={desktopImage}
            alt={title || sponsorName || label}
            fill
            sizes="(max-width: 639px) 100vw, 42vw"
            className={`object-cover ${mobileImage ? "hidden sm:block" : ""}`}
          />
          <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
            {label}
          </span>
        </div>

        {/* copy */}
        <div className="flex flex-col justify-center gap-2 p-5 sm:p-7">
          {sponsorName ? (
            <div className="flex items-center gap-2">
              {logo ? (
                <Image
                  src={logo}
                  alt={sponsorName}
                  width={22}
                  height={22}
                  className="h-5 w-5 rounded object-contain"
                />
              ) : null}
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-red-soft">
                {sponsorName}
              </span>
            </div>
          ) : null}

          {title ? (
            <p className="font-display text-[clamp(1.4rem,3.4vw,2rem)] font-black uppercase leading-[0.95] tracking-[-0.03em] [overflow-wrap:break-word]">
              {title}
            </p>
          ) : null}

          {subtitle ? (
            <p className="hidden text-sm leading-relaxed text-muted sm:block">
              {subtitle}
            </p>
          ) : null}

          {ctaLabel ? (
            <span className="mt-2 inline-flex w-max items-center rounded-xl bg-red px-4 py-3 text-sm font-black text-white shadow-[0_0_18px_rgba(237,27,63,0.26)] transition-transform group-hover:translate-x-0.5">
              {ctaLabel} →
            </span>
          ) : null}
        </div>
      </a>
    </aside>
  );
}
