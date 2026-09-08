"use client";

import Image from "next/image";
import { useRef } from "react";

type Img = { id: string; src: string; alt: string; caption: string | null };

export function GalleryScroller({
  images,
  prevLabel,
  nextLabel,
}: {
  images: Img[];
  prevLabel: string;
  nextLabel: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollByCards = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("li");
    const amount = card ? card.offsetWidth + 14 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-4 hidden justify-end gap-2 sm:flex">
        <button
          type="button"
          aria-label={prevLabel}
          onClick={() => scrollByCards(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-panel-2 text-lg hover:border-red/50"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          onClick={() => scrollByCards(1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-panel-2 text-lg hover:border-red/50"
        >
          ›
        </button>
      </div>

      <ul
        ref={trackRef}
        className="snap-x -mx-[var(--site-gutter)] px-[var(--site-gutter)] pb-2 sm:mx-0 sm:px-0"
      >
        {images.map((img, i) => (
          <li
            key={img.id}
            className="edge-glow relative aspect-[4/3] w-[86%] shrink-0 overflow-hidden rounded-card border border-line bg-[#0b0b0b] sm:w-[62%] lg:w-[calc((100%-14px)/2)]"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 86vw, (max-width: 1024px) 62vw, 583px"
              loading={i === 0 ? "eager" : "lazy"}
              className="object-cover"
            />
            {img.caption ? (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-[13px] font-bold">
                {img.caption}
              </figcaption>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
