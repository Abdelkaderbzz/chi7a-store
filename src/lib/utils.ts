import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(price);
}

export function calculateDiscountPercentage(price: number, priceBeforeDiscount: number | null | undefined): number {
  if (!priceBeforeDiscount || priceBeforeDiscount <= 0) return 0;
  const discount = ((priceBeforeDiscount - price) / priceBeforeDiscount) * 100;
  return Math.round(discount);
}

export function slugify(text: string): string {
  if (!text) return Math.random().toString(36).substring(2, 9);
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-\u0600-\u06FF]/g, "") // Allow Arabic characters
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
  
  return slug || Math.random().toString(36).substring(2, 9);
}

export function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
