"use client";

import { useTransition, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, type ProductValues } from "@/lib/validations";
import { createProductAction } from "@/lib/actions";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";
import { FormSelect } from "@/components/ui/form-select";
import { RelatedProductsSelector } from "@/components/admin/RelatedProductsSelector";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface Category {
  id: string;
  nameAr: string;
}

interface Product {
  id: string;
  name: string;
  nameAr: string;
  image: string | null;
  categoryId: string;
}

interface ProductClientFormProps {
  categories: Category[];
  allProducts?: Product[];
  onSuccess?: () => void;
}

export function ProductClientForm({ categories, allProducts = [], onSuccess }: ProductClientFormProps) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [relatedProductIds, setRelatedProductIds] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductValues>({
    // @ts-expect-error - Zod coercion types mismatch
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      featured: false,
      inStock: true,
      stock: 0,
      relatedProductIds: "[]",
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
      formData.append("relatedProductIds", JSON.stringify(relatedProductIds));

      const result = await createProductAction(null, formData);
      
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(result.message);
        reset();
        setRelatedProductIds([]);
        const imagesInput = formRef.current?.querySelector('input[name="images"]') as HTMLInputElement | null;
        if (imagesInput) imagesInput.value = "[]";
        if (onSuccess) {
          onSuccess();
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        <Plus size={18} />
        إضافة منتج
      </h2>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4 pb-4 border-b">
          <h3 className="font-semibold text-sm">المعلومات الأساسية</h3>
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
            <label className="block text-sm font-medium mb-1">SKU (اختياري)</label>
            <input 
              {...register("sku")} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
            />
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
        <div className="space-y-4 pb-4 border-b">
          <h3 className="font-semibold text-sm">تفاصيل الأسعار والتكاليف</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">السعر قبل الخصم (د.ت)</label>
              <input 
                {...register("priceBeforeDiscount")} 
                type="number" 
                step="0.001" 
                placeholder="السعر الأصلي"
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">تكلفة المنتج (د.ت)</label>
              <input 
                {...register("cost")} 
                type="number" 
                step="0.001" 
                placeholder="التكلفة الفعلية"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">سعر التوصيل (د.ت)</label>
              <input 
                {...register("deliveryPrice")} 
                type="number" 
                step="0.001" 
                placeholder="رسم التوصيل"
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
              placeholder="تكلفة التوصيل الفعلية"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
            />
          </div>
        </div>

        {/* Inventory */}
        <div className="space-y-4 pb-4 border-b">
          <h3 className="font-semibold text-sm">المخزون</h3>
          <div>
            <label className="block text-sm font-medium mb-1">الكمية في المخزون</label>
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
        
        <MultiImageUpload maxImages={5} />

        {/* Related Products - only show if we have products */}
        {allProducts.length > 0 && (
          <div className="space-y-4 pb-4 border-b">
            <h3 className="font-semibold text-sm">المنتجات ذات الصلة</h3>
            <RelatedProductsSelector
              products={allProducts}
              categories={categories}
              currentProductId=""
              selectedIds={relatedProductIds}
              onChange={setRelatedProductIds}
            />
          </div>
        )}

        <button 
          type="submit" 
          disabled={pending}
          className="w-full bg-gold text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gold-dark disabled:opacity-50 transition-opacity"
        >
          {pending ? "جاري الإضافة..." : "إضافة"}
        </button>
      </form>
    </div>
  );
}
