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
    <div className="relative h-[390px] w-full overflow-hidden rounded-2xl border border-border">
      <Image
        src={banner.image}
        alt={banner.titleAr || banner.title}
        fill
        sizes="(max-width: 768px) 100vw, 1200px"
        className="object-cover object-center"
        priority
      />
      {(banner.titleAr || banner.subtitleAr) && (
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/20 to-transparent" />
      )}
      {(banner.titleAr || banner.subtitleAr) && (
        <div className="absolute bottom-0 right-0 max-w-md p-6 text-right text-white md:p-8">
          {banner.titleAr && (
            <h2 className="text-2xl font-bold leading-tight md:text-4xl">{banner.titleAr}</h2>
          )}
          {banner.subtitleAr && (
            <p className="mt-2 text-sm text-gray-200 md:text-lg">{banner.subtitleAr}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      {banner.link ? <Link href={banner.link}>{content}</Link> : content}

      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-ink shadow-md backdrop-blur transition-colors hover:bg-white"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % banners.length)}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-ink shadow-md backdrop-blur transition-colors hover:bg-white"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${i === current ? "w-5 bg-gold" : "w-1.5 bg-white/70"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
