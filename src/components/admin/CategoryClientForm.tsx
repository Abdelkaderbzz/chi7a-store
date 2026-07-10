"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategorySchema, type CategoryValues } from "@/lib/validations";
import { createCategoryAction } from "@/lib/actions";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function CategoryClientForm() {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryValues>({
    // @ts-expect-error - Zod coercion types mismatch
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      order: 0,
    },
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("nameAr", data.nameAr);
      if (data.description) formData.append("description", data.description);
      formData.append("order", (data.order || 0).toString());

      const result = await createCategoryAction(null, formData);
      
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(result.message);
        reset();
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        <Plus size={18} />
        إضافة تصنيف
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
          <label className="block text-sm font-medium mb-1">الوصف</label>
          <textarea 
            {...register("description")} 
            rows={2} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الترتيب</label>
          <input 
            {...register("order")} 
            type="number" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
          />
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
