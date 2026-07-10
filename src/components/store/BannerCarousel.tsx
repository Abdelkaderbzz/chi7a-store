"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  titleAr: string | null;
  subtitle: string | null;
  subtitleAr: string | null;
  image: string;
  link: string | null;
}

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  const content = (
    <div className="relative h-[260px] w-full overflow-hidden rounded-2xl border border-border md:h-[400px]">
      <Image src={banner.image} alt={banner.titleAr || banner.title} fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div className="absolute bottom-0 right-0 left-0 p-6 text-white md:p-10">
        <span className="mb-3 inline-block rounded-full bg-gold px-3 py-1 text-xs font-semibold text-white">
          Chi7a Store
        </span>
        <h2 className="mb-2 text-2xl font-bold md:text-4xl">{banner.titleAr || banner.title}</h2>
        {(banner.subtitleAr || banner.subtitle) && (
          <p className="text-sm text-gray-200 md:text-lg">{banner.subtitleAr || banner.subtitle}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      {banner.link ? <Link href={banner.link}>{content}</Link> : content}

      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-ink shadow-md backdrop-blur transition-colors hover:bg-white"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % banners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-ink shadow-md backdrop-blur transition-colors hover:bg-white"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-gold" : "w-2 bg-white/60"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
