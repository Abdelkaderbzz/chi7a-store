"use client";

import { useTransition, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, type ProductValues } from "@/lib/validations";
import { updateProductAction } from "@/lib/actions";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";
import { FormSelect } from "@/components/ui/form-select";
import { toast } from "sonner";
import { X } from "lucide-react";

interface Category {
  id: string;
  nameAr: string;
}

interface Product {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string | null;
  descriptionAr: string | null;
  sku: string | null;
  price: number;
  priceBeforeDiscount: number | null;
  cost: number | null;
  deliveryPrice: number | null;
  deliveryCost: number | null;
  stock: number;
  image: string | null;
  images: string;
  featured: boolean;
  inStock: boolean;
  relatedProductIds: string;
  categoryId: string;
}

interface EditProductFormDrawerProps {
  product: Product;
  categories: Category[];
  allProducts: Product[];
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditProductFormDrawer({
  product,
  categories,
  allProducts,
  onOpenChange,
  onSuccess,
}: EditProductFormDrawerProps) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  let relatedIds: string[] = [];
  try {
    relatedIds = JSON.parse(product.relatedProductIds);
  } catch {
    relatedIds = [];
  }

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductValues>({
    // @ts-expect-error - Zod coercion types mismatch
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: product.name,
      nameAr: product.nameAr,
      categoryId: product.categoryId,
      price: product.price,
      priceBeforeDiscount: product.priceBeforeDiscount ?? undefined,
      cost: product.cost ?? undefined,
      deliveryPrice: product.deliveryPrice ?? undefined,
      deliveryCost: product.deliveryCost ?? undefined,
      stock: product.stock,
      sku: product.sku ?? undefined,
      description: product.description ?? undefined,
      descriptionAr: product.descriptionAr ?? undefined,
      featured: product.featured,
      inStock: product.inStock,
      relatedProductIds: JSON.stringify(relatedIds),
    },
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("nameAr", data.nameAr);
      formData.append("categoryId", data.categoryId);
      formData.append("price", data.price.toString());
      if (data.priceBeforeDiscount) formData.append("priceBeforeDiscount", data.priceBeforeDiscount.toString());
      if (data.cost) formData.append("cost", data.cost.toString());
      if (data.deliveryPrice) formData.append("deliveryPrice", data.deliveryPrice.toString());
      if (data.deliveryCost) formData.append("deliveryCost", data.deliveryCost.toString());
      formData.append("stock", data.stock.toString());
      if (data.sku) formData.append("sku", data.sku);
      if (data.description) formData.append("description", data.description);
      if (data.descriptionAr) formData.append("descriptionAr", data.descriptionAr);

      const imagesInput = formRef.current?.querySelector('input[name="images"]') as HTMLInputElement | null;
      if (imagesInput) {
        formData.append("images", imagesInput.value);
      }

      if (data.featured) formData.append("featured", "on");
      if (data.inStock) formData.append("inStock", "on");

      formData.append("relatedProductIds", data.relatedProductIds || "[]");

      const result = await updateProductAction(product.id, null, formData);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(result.message);
        onSuccess();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
          <h2 className="font-semibold text-lg">تحرير: {product.nameAr}</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4 pb-6 border-b">
              <h3 className="font-semibold text-sm">المعلومات الأساسية</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">الاسم (إنجليزي)</label>
                  <input
                    {...register("name")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الاسم (عربي)</label>
                  <input
                    {...register("nameAr")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  {errors.nameAr && <p className="text-xs text-red-500 mt-1">{errors.nameAr.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">التصنيف</label>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        options={categories.map((c) => ({ value: c.id, label: c.nameAr }))}
                      />
                    )}
                  />
                  {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <input
                    {...register("sku")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">الوصف (عربي)</label>
                <textarea
                  {...register("descriptionAr")}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4 pb-6 border-b">
              <h3 className="font-semibold text-sm">تفاصيل الأسعار</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">السعر قبل الخصم (د.ت)</label>
                  <input
                    {...register("priceBeforeDiscount")}
                    type="number"
                    step="0.001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">السعر (د.ت) *</label>
                  <input
                    {...register("price")}
                    type="number"
                    step="0.001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">تكلفة المنتج (د.ت)</label>
                  <input
                    {...register("cost")}
                    type="number"
                    step="0.001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">سعر التوصيل (د.ت)</label>
                  <input
                    {...register("deliveryPrice")}
                    type="number"
                    step="0.001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">تكلفة التوصيل (د.ت)</label>
                <input
                  {...register("deliveryCost")}
                  type="number"
                  step="0.001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Inventory */}
            <div className="space-y-4 pb-6 border-b">
              <h3 className="font-semibold text-sm">المخزون</h3>

              <div>
                <label className="block text-sm font-medium mb-1">الكمية في المخزون *</label>
                <input
                  {...register("stock")}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock.message}</p>}
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...register("featured")} className="rounded" />
                  مرئي (مميز)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...register("inStock")} className="rounded" />
                  متوفر
                </label>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4 pb-6 border-b">
              <h3 className="font-semibold text-sm">الصور</h3>
              <MultiImageUpload maxImages={5} defaultImages={product.images} />
            </div>

            {/* Related Products */}
            <div className="space-y-4 pb-6">
              <h3 className="font-semibold text-sm">المنتجات ذات الصلة</h3>

              <div>
                <label className="block text-sm font-medium mb-2">اختر المنتجات ذات الصلة</label>
                <div className="space-y-2 overflow-y-auto border border-gray-200 rounded-lg p-3" style={{ maxHeight: "200px" }}>
                  {allProducts
                    .filter((p) => p.id !== product.id)
                    .map((p) => (
                      <label key={p.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          value={p.id}
                          defaultChecked={relatedIds.includes(p.id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const currentInput = formRef.current?.querySelector('input[name="relatedProductIds"]') as HTMLInputElement | null;
                            if (currentInput) {
                              try {
                                const ids = JSON.parse(currentInput.value);
                                if (isChecked) {
                                  ids.push(p.id);
                                } else {
                                  ids.splice(ids.indexOf(p.id), 1);
                                }
                                currentInput.value = JSON.stringify(ids);
                              } catch {
                                currentInput.value = isChecked ? JSON.stringify([p.id]) : "[]";
                              }
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{p.nameAr}</span>
                      </label>
                    ))}
                </div>
                <input
                  type="hidden"
                  {...register("relatedProductIds")}
                  defaultValue={JSON.stringify(relatedIds)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-gold text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gold-dark disabled:opacity-50 transition-opacity"
            >
              {pending ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
