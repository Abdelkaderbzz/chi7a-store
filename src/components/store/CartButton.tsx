"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/store/CartProvider";

export function CartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-xs font-medium transition-colors hover:border-gold/50 hover:text-gold-light"
    >
      <ShoppingCart size={18} />
      <span className="hidden sm:inline">السلة</span>
      {count > 0 && (
        <span className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
