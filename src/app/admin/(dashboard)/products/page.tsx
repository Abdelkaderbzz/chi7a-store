import { db } from "@/lib/db";
import { createProductAction, deleteProductAction } from "@/lib/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { FormSelect } from "@/components/ui/form-select";
import { formatPrice } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    db.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">إدارة المنتجات</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Add form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Plus size={18} />
            إضافة منتج
          </h2>
          <form action={createProductAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">الاسم (إنجليزي)</label>
              <input name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الاسم (عربي)</label>
              <input name="nameAr" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">التصنيف</label>
              <FormSelect
                name="categoryId"
                options={categories.map((c) => ({ value: c.id, label: c.nameAr }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">السعر (د.ت)</label>
              <input name="price" type="number" step="0.001" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الوصف (عربي)</label>
              <textarea name="descriptionAr" rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <ImageUpload />
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="featured" className="rounded" />
                مميز
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="inStock" defaultChecked className="rounded" />
                متوفر
              </label>
            </div>
            <button type="submit" className="w-full bg-gold text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gold-dark">
              إضافة
            </button>
          </form>
        </div>

        {/* Products list */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold">المنتجات ({products.length})</h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-[700px] overflow-y-auto">
            {products.map((product) => (
              <div key={product.id} className="p-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
                  {product.image ? (
                    <Image src={product.image} alt="" fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xl">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.nameAr}</p>
                  <p className="text-xs text-gray-500">{product.category.nameAr} • {formatPrice(product.price)}</p>
                  <div className="flex gap-2 mt-1">
                    {product.featured && <span className="text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded">مميز</span>}
                    {!product.inStock && <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded">نفذ</span>}
                  </div>
                </div>
                <form action={deleteProductAction.bind(null, product.id)}>
                  <button type="submit" className="text-red-400 hover:text-red-600 p-2">
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            ))}
            {products.length === 0 && (
              <p className="p-8 text-center text-gray-500 text-sm">لا توجد منتجات</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
