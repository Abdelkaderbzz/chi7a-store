"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/components/store/CartProvider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { getCartTotal } from "@/lib/cart";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const total = getCartTotal(items);

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-20 text-center">
        <ShoppingBag size={56} className="text-gray-300" strokeWidth={1.5} />
        <h1 className="text-xl font-bold">السلة فارغة</h1>
        <p className="text-muted">أضف منتجات لتتمكن من الطلب</p>
        <Link href="/products">
          <Button variant="primary">تصفح المنتجات</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold">سلة التسوق</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                {item.image ? (
                  <Image src={item.image} alt={item.nameAr} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl text-gray-300">📦</div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <Link href={`/products/${item.slug}`} className="font-semibold hover:text-gold-dark line-clamp-2">
                    {item.nameAr}
                  </Link>
                  <p className="mt-1 text-sm font-bold text-ink">{formatPrice(item.price)}</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-2.5 py-1.5 hover:bg-gold/10 disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1.5 hover:bg-gold/10"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                    aria-label="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="shrink-0 text-sm font-bold text-gold-dark self-start">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 h-fit sticky top-24">
          <h2 className="mb-4 font-bold">ملخص الطلب</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <span>عدد المنتجات</span>
              <span>{items.reduce((s, i) => s + i.quantity, 0)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
              <span>المجموع</span>
              <span className="text-gold-dark">{formatPrice(total)}</span>
            </div>
          </div>
          <Link href="/checkout" className="mt-6 block">
            <Button variant="primary" size="lg" className="w-full">
              إتمام الطلب
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <Link href="/products" className="mt-3 block text-center text-sm text-muted hover:text-gold-dark">
            متابعة التسوق
          </Link>
        </div>
      </div>
    </div>
  );
}
