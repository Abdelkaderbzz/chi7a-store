"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";
import { placeOrderAction } from "@/lib/order-actions";
import { saveAbandonedOrderAction } from "@/lib/abandoned-actions";
import { tunisianStates } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutSchema, type CheckoutValues } from "@/lib/validations";

type DirectOrderModalProps = {
  product: {
    id: string;
    nameAr: string;
    price: number;
    image: string | null;
  };
};

export function DirectOrderModal({ product }: DirectOrderModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const completedRef = useRef(false);
  const interactedRef = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      city: "تونس",
    },
  });

  const trackAbandoned = useCallback(() => {
    if (completedRef.current || !interactedRef.current) return;
    const values = getValues();
    // Only save if user typed something
    if (values.name || values.phone || values.address) {
      saveAbandonedOrderAction({
        customerName: values.name,
        phone: values.phone,
        city: values.city,
        address: values.address,
        productId: product.id,
        productName: product.nameAr,
        productPrice: product.price,
      });
    }
  }, [getValues, product]);

  function handleClose() {
    trackAbandoned();
    setIsOpen(false);
  }

  // Track if user leaves the page with the modal open
  useEffect(() => {
    if (!isOpen) return;
    const handleBeforeUnload = () => trackAbandoned();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isOpen, trackAbandoned]);

  async function onSubmit(data: CheckoutValues) {
    setLoading(true);
    setError("");

    const result = await placeOrderAction({
      customerName: data.name,
      phone: data.phone,
      city: data.city ?? "",
      address: data.address ?? "",
      items: [{ productId: product.id, quantity: 1 }],
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    completedRef.current = true;
    setIsOpen(false);
    router.push(`/order/${result.orderNumber}`);
  }

  return (
    <>
      <Button 
        variant="primary" 
        size="lg" 
        className="w-full bg-black hover:bg-black/90 text-white" 
        onClick={() => {
          completedRef.current = false;
          interactedRef.current = false;
          setIsOpen(true);
        }}
      >
        اطلب الآن
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleClose}
              className="absolute left-4 top-4 text-muted hover:text-foreground"
            >
              <X size={20} />
            </button>
            
            <h2 className="mb-4 text-xl font-bold">إتمام الطلب - {product.nameAr}</h2>
            
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4 font-bold text-lg">
              <span>المجموع:</span>
              <span className="text-gold-dark">{formatPrice(product.price)}</span>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              onChange={() => { interactedRef.current = true; }}
            >
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
                      onValueChange={(v) => {
                        field.onChange(v);
                        interactedRef.current = true;
                      }}
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

              <Button type="submit" variant="primary" size="lg" className="w-full mt-6" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    جاري إرسال الطلب...
                  </>
                ) : (
                  <>
                    تأكيد الطلب
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
