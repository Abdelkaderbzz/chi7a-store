import { db } from "@/lib/db";
import { createBannerAction, deleteBannerAction } from "@/lib/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";

export default async function AdminBannersPage() {
  const banners = await db.banner.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">إدارة البانرات</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Plus size={18} />
            إضافة بانر
          </h2>
          <form action={createBannerAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">العنوان (إنجليزي)</label>
              <input name="title" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">العنوان (عربي)</label>
              <input name="titleAr" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الوصف (عربي)</label>
              <input name="subtitleAr" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الرابط</label>
              <input name="link" placeholder="/products" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الترتيب</label>
              <input name="order" type="number" defaultValue={0} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <ImageUpload label="صورة البانر" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="active" defaultChecked className="rounded" />
              نشط
            </label>
            <button type="submit" className="w-full bg-gold text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gold-dark">
              إضافة
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold">البانرات ({banners.length})</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {banners.map((banner) => (
              <div key={banner.id} className="p-4 flex items-center gap-4">
                <div className="w-24 h-14 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
                  <Image src={banner.image} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{banner.titleAr || banner.title}</p>
                  <p className="text-xs text-gray-500">
                    ترتيب: {banner.order} • {banner.active ? "نشط" : "غير نشط"}
                    {banner.link && ` • ${banner.link}`}
                  </p>
                </div>
                <form action={deleteBannerAction.bind(null, banner.id)}>
                  <button type="submit" className="text-red-400 hover:text-red-600 p-2">
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            ))}
            {banners.length === 0 && (
              <p className="p-8 text-center text-gray-500 text-sm">لا توجد بانرات</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
