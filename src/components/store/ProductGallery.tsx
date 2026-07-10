"use client";

import { useState } from "react";
import Image from "next/image";
import { CategoryIcon } from "@/components/store/CategoryIcon";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  imagesString: string;
  fallbackImage?: string | null;
  productName: string;
  categorySlug: string;
}

export function ProductGallery({ imagesString, fallbackImage, productName, categorySlug }: ProductGalleryProps) {
  let images: string[] = [];
  try {
    images = JSON.parse(imagesString);
  } catch {
    images = [];
  }

  // Fallback to single image if array is empty
  if (images.length === 0 && fallbackImage) {
    images = [fallbackImage];
  }

  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex h-full items-center justify-center text-gray-300">
          <CategoryIcon slug={categorySlug} size={80} className="text-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-gray-50 to-gray-100">
        <Image 
          src={images[activeIndex]} 
          alt={`${productName} - صورة ${activeIndex + 1}`} 
          fill 
          className="object-cover transition-opacity duration-300" 
          priority 
        />
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                activeIndex === idx ? "border-gold opacity-100" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image 
                src={img} 
                alt={`${productName} - مصغرة ${idx + 1}`} 
                fill 
                className="object-cover" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
