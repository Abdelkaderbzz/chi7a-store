"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Banner {
  id: string;
  title: string;
  titleAr: string | null;
  subtitle: string | null;
  subtitleAr: string | null;
  image: string;
  link: string | null;
}

const AUTOPLAY_MS = 6000;

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (index === current || isAnimating) return;
      setIsAnimating(true);
      setCurrent(index);
      window.setTimeout(() => setIsAnimating(false), 700);
    },
    [current, isAnimating]
  );

  const next = useCallback(() => {
    goTo((current + 1) % banners.length);
  }, [banners.length, current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + banners.length) % banners.length);
  }, [banners.length, current, goTo]);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const timer = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [banners.length, isPaused, next]);

  if (banners.length === 0) return null;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="relative h-[390px] w-full overflow-hidden rounded-2xl border border-border bg-ink/5">
        {banners.map((banner, index) => {
          const isActive = index === current;
          const slide = (
            <div className="relative h-full w-full">
              <Image
                src={banner.image}
                alt={banner.titleAr || banner.title}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className={cn(
                  "object-cover object-center transition-transform duration-[900ms] ease-out",
                  isActive ? "scale-100" : "scale-105"
                )}
                priority={index === 0}
              />
              {(banner.titleAr || banner.subtitleAr) && (
                <>
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-l from-black/75 via-black/25 to-transparent transition-opacity duration-700",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 max-w-md p-6 text-right text-white transition-all duration-700 md:p-8",
                      isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    )}
                  >
                    {banner.titleAr && (
                      <h2 className="text-2xl font-bold leading-tight md:text-4xl">{banner.titleAr}</h2>
                    )}
                    {banner.subtitleAr && (
                      <p className="mt-2 text-sm text-gray-200 md:text-lg">{banner.subtitleAr}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          );

          return (
            <div
              key={banner.id}
              aria-hidden={!isActive}
              className={cn(
                "banner-slide absolute inset-0 transition-all duration-700 ease-in-out",
                isActive ? "z-10 opacity-100" : "z-0 pointer-events-none opacity-0"
              )}
            >
              {banner.link ? (
                <Link href={banner.link} className="block h-full w-full" tabIndex={isActive ? 0 : -1}>
                  {slide}
                </Link>
              ) : (
                slide
              )}
            </div>
          );
        })}

        {banners.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-black/20">
            <div
              key={current}
              className={cn(
                "banner-progress h-full bg-gold",
                isPaused && "banner-progress-paused"
              )}
            />
          </div>
        )}
      </div>

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/95 p-2 text-ink opacity-0 shadow-lg backdrop-blur transition-all duration-300 hover:bg-white group-hover:opacity-100"
            aria-label="السابق"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/95 p-2 text-ink opacity-0 shadow-lg backdrop-blur transition-all duration-300 hover:bg-white group-hover:opacity-100"
            aria-label="التالي"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`الشريحة ${index + 1}`}
                aria-current={index === current ? "true" : undefined}
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  index === current ? "w-8 bg-gold shadow-sm" : "w-2 bg-white/70 hover:bg-white"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
