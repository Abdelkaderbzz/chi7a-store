import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { CategoryIcon } from "@/components/store/CategoryIcon";

interface ProductCardProps {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  price: number;
  image: string | null;
  inStock: boolean;
  categoryName?: string;
  categorySlug?: string;
}

export function ProductCard({
  nameAr,
  slug,
  price,
  image,
  inStock,
  categoryName,
  categorySlug,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-md)]"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {image ? (
          <Image
            src={image}
            alt={nameAr}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            {categorySlug ? (
              <CategoryIcon slug={categorySlug} size={44} className="text-gray-300" />
            ) : (
              <span className="text-5xl">📦</span>
            )}
          </div>
        )}
        {!inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm">
            نفذت الكمية
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {categoryName && (
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gold">
            {categoryName}
          </p>
        )}
        <h3 className="line-clamp-2 flex-1 text-sm font-semibold leading-snug transition-colors group-hover:text-gold-dark">
          {nameAr}
        </h3>
        <p className="mt-3 text-base font-bold text-ink">{formatPrice(price)}</p>
      </div>
    </Link>
  );
}
