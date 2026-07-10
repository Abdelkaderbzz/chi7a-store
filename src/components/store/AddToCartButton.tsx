"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/store/CartProvider";

interface AddToCartButtonProps {
  id: string;
  slug: string;
  nameAr: string;
  price: number;
  image: string | null;
  inStock: boolean;
}

export function AddToCartButton({ id, slug, nameAr, price, image, inStock }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!inStock) {
    return (
      <Button variant="outline" size="lg" className="w-full" disabled>
        نفذت الكمية
      </Button>
    );
  }

  function handleAdd() {
    addItem({ id, slug, nameAr, price, image }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-muted">الكمية</label>
        <div className="flex items-center rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-lg hover:bg-gold/10 transition-colors"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-2 text-lg hover:bg-gold/10 transition-colors"
          >
            +
          </button>
        </div>
      </div>
      <Button variant="primary" size="lg" className="w-full" onClick={handleAdd}>
        {added ? (
          <>
            <Check size={18} />
            تمت الإضافة
          </>
        ) : (
          <>
            <ShoppingCart size={18} />
            أضف إلى السلة
          </>
        )}
      </Button>
    </div>
  );
}
