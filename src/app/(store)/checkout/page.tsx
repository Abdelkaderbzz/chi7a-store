"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/components/store/CartProvider";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";
import { formatPrice } from "@/lib/utils";
import { getCartTotal } from "@/lib/cart";
import { placeOrderAction } from "@/lib/order-actions";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutSchema, type CheckoutValues } from "@/lib/validations";

import { tunisianStates } from "@/lib/constants";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const total = getCartTotal(items);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      city: "قبلي",
    },
  });

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-muted mb-4">السلة فارغة</p>
        <Link href="/products">
          <Button variant="primary">تصفح المنتجات</Button>
        </Link>
      </div>
    );
  }

  async function onSubmit(data: CheckoutValues) {
    setLoading(true);
    setError("");

    const result = await placeOrderAction({
      customerName: data.name,
      phone: data.phone,
      city: data.city,
      address: data.address,
      items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    clearCart();
    router.push(`/order/${result.orderNumber}`);
  }

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold">إتمام الطلب</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-bold">معلومات التوصيل</h2>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            <Input
              {...register("name")}
              label="الاسم الكامل"
              placeholder="مثال: أحمد بن علي"
              error={errors.name?.message}
            />
            <Input
              {...register("phone")}
              label="رقم الهاتف"
              type="tel"
              placeholder="مثال: 26321100"
              dir="ltr"
              className="text-left"
              error={errors.phone?.message}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">المدينة</label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="اختر المدينة"
                    options={tunisianStates.map((c) => ({ value: c.arabic, label: c.arabic }))}
                  />
                )}
              />
              {errors.city?.message && <p className="text-xs text-red-500">{errors.city.message}</p>}
            </div>
            <Textarea
              {...register("address")}
              label="العنوان"
              placeholder="الشارع، الحي، رقم المنزل..."
              rows={3}
              error={errors.address?.message}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                جاري إرسال الطلب...
              </>
            ) : (
              <>
                تأكيد الطلب — {formatPrice(total)}
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </form>

        <div className="rounded-2xl border border-border bg-card p-6 h-fit">
          <h2 className="mb-4 font-bold">طلبك ({items.length} منتج)</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                  {item.image && (
                    <Image src={item.image} alt={item.nameAr} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.nameAr}</p>
                  <p className="text-xs text-muted">× {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-bold">
            <span>المجموع</span>
            <span className="text-gold-dark">{formatPrice(total)}</span>
          </div>
          <p className="mt-3 text-xs text-muted">
            سيتواصل معك فريق Chi7a Store لتأكيد الطلب والتوصيل
          </p>
        </div>
      </div>
    </div>
  );
}
