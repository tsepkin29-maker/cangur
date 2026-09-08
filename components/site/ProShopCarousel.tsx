"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

type Product = {
  id: string;
  title: string;
  spec: string;
  price: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
};

export function ProShopCarousel({
  products,
  kicker,
  title,
  viewLabel,
  closeLabel,
  prevLabel,
  nextLabel,
}: {
  products: Product[];
  kicker: string;
  title: string;
  viewLabel: string;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<Product | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("li");
    const amount = card ? card.offsetWidth + 14 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const open = (p: Product, e: React.MouseEvent) => {
    lastFocused.current = e.currentTarget as HTMLElement;
    setActive(p);
    track("shop_product_open", { id: p.id });
  };
  const close = () => setActive(null);

  useEffect(() => {
    if (!active) {
      lastFocused.current?.focus();
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled])',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.17em] text-red-soft">
            {kicker}
          </p>
          <h2 className="mt-2 font-display text-[clamp(2.4rem,7vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.05em] [overflow-wrap:break-word]">
            {title}
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label={prevLabel}
            onClick={() => scrollByCards(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-panel-2 text-lg hover:border-red/50"
          >
            {prevLabel}
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => scrollByCards(1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-panel-2 text-lg hover:border-red/50"
          >
            {nextLabel}
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="snap-x -mx-[var(--site-gutter)] px-[var(--site-gutter)] pb-2 sm:mx-0 sm:px-0"
      >
        {products.map((p) => (
          <li
            key={p.id}
            className="edge-glow hover-lift w-[78%] shrink-0 overflow-hidden rounded-card border border-line bg-panel sm:w-[min(46%,360px)]"
          >
            <button
              type="button"
              onClick={(e) => open(p, e)}
              className="block w-full text-left"
            >
              <Image
                src={p.image}
                alt={p.title}
                width={p.imageWidth}
                height={p.imageHeight}
                sizes="(max-width: 640px) 78vw, 360px"
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              <div className="flex min-h-[150px] flex-col p-4">
                <h3 className="text-xl font-black">{p.title}</h3>
                <p className="mt-1 text-[13px] text-faint">{p.spec}</p>
                <p className="mt-auto pt-4 text-[1.35rem] font-black">
                  {p.price}
                </p>
                <span className="mt-2 text-[13px] font-black text-red-soft">
                  {viewLabel}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label={closeLabel}
            onClick={close}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            className="relative w-full max-w-[560px] overflow-hidden rounded-card border border-line bg-[#111] shadow-[0_24px_70px_rgba(0,0,0,0.68),0_0_44px_rgba(237,27,63,0.18)]"
          >
            <Image
              src={active.image}
              alt={active.title}
              width={active.imageWidth}
              height={active.imageHeight}
              className="max-h-[360px] w-full object-cover"
            />
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-black">{active.title}</h3>
                <button
                  type="button"
                  onClick={close}
                  aria-label={closeLabel}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-panel-2"
                >
                  ✕
                </button>
              </div>
              <p className="mt-2 text-muted">
                {active.spec} · {active.price}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
