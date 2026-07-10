"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BannerSchema, type BannerValues } from "@/lib/validations";
import { createBannerAction } from "@/lib/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function BannerClientForm() {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BannerValues>({
    // @ts-expect-error - Zod coercion types mismatch
    resolver: zodResolver(BannerSchema),
    defaultValues: {
      order: 0,
      active: true,
    },
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.titleAr) formData.append("titleAr", data.titleAr);
      if (data.subtitle) formData.append("subtitle", data.subtitle);
      if (data.subtitleAr) formData.append("subtitleAr", data.subtitleAr);
      if (data.link) formData.append("link", data.link);
      formData.append("order", (data.order || 0).toString());

      const imageInput = document.querySelector('input[name="image"]') as HTMLInputElement;
      if (imageInput && imageInput.value) {
        formData.append("image", imageInput.value);
      } else {
        toast.error("صورة البانر مطلوبة");
        return;
      }

      if (data.active) formData.append("active", "on");

      const result = await createBannerAction(null, formData);
      
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(result.message);
        reset();
        if (imageInput) imageInput.value = "";
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        <Plus size={18} />
        إضافة بانر
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">العنوان (إنجليزي)</label>
          <input 
            {...register("title")} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">العنوان (عربي)</label>
          <input 
            {...register("titleAr")} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الوصف (عربي)</label>
          <input 
            {...register("subtitleAr")} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الرابط</label>
          <input 
            {...register("link")} 
            placeholder="/products" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
            dir="ltr"
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
        
        <ImageUpload label="صورة البانر" />
        
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("active")} className="rounded" />
          نشط
        </label>
        
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
