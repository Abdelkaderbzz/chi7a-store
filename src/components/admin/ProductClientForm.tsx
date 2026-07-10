"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, type ProductValues } from "@/lib/validations";
import { createProductAction } from "@/lib/actions";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";
import { FormSelect } from "@/components/ui/form-select";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface Category {
  id: string;
  nameAr: string;
}

export function ProductClientForm({ categories }: { categories: Category[] }) {
  const [pending, startTransition] = useTransition();

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
    },
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("nameAr", data.nameAr);
      formData.append("categoryId", data.categoryId);
      formData.append("price", data.price.toString());
      if (data.description) formData.append("description", data.description);
      if (data.descriptionAr) formData.append("descriptionAr", data.descriptionAr);
      
      // We will handle images differently because MultiImageUpload uses a hidden input
      // However, we can just grab it from the DOM for simplicity or manage it in React state.
      // Since MultiImageUpload generates a hidden input with name="images",
      // the easiest way is to let the user submit the form natively OR read it via DOM.
      const imagesInput = document.querySelector('input[name="images"]') as HTMLInputElement;
      if (imagesInput) {
        formData.append("images", imagesInput.value);
      }

      if (data.featured) formData.append("featured", "on");
      if (data.inStock) formData.append("inStock", "on");

      const result = await createProductAction(null, formData);
      
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(result.message);
        reset();
        // Also reset images
        if (imagesInput) imagesInput.value = "[]";
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        <Plus size={18} />
        إضافة منتج
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <label className="block text-sm font-medium mb-1">السعر (د.ت)</label>
          <input 
            {...register("price")} 
            type="number" 
            step="0.001" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
          />
          {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الوصف (عربي)</label>
          <textarea 
            {...register("descriptionAr")} 
            rows={2} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
          />
        </div>
        
        <MultiImageUpload maxImages={5} />
        
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("featured")} className="rounded" />
            مميز
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("inStock")} className="rounded" />
            متوفر
          </label>
        </div>
        
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
