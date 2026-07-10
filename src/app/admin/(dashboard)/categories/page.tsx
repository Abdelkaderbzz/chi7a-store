import { db } from "@/lib/db";
import { createCategoryAction, deleteCategoryAction } from "@/lib/actions";
import { Plus, Trash2 } from "lucide-react";
import { CategoryIcon } from "@/components/store/CategoryIcon";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">إدارة التصنيفات</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Plus size={18} />
            إضافة تصنيف
          </h2>
          <form action={createCategoryAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">الاسم (إنجليزي)</label>
              <input name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الاسم (عربي)</label>
              <input name="nameAr" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الوصف</label>
              <textarea name="description" rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الترتيب</label>
              <input name="order" type="number" defaultValue={0} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <button type="submit" className="w-full bg-gold text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gold-dark">
              إضافة
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold">التصنيفات ({categories.length})</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <CategoryIcon slug={cat.slug} size={20} className="text-gold-dark" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{cat.nameAr}</p>
                  <p className="text-xs text-gray-500">{cat.name} • {cat._count.products} منتج • ترتيب: {cat.order}</p>
                </div>
                <form action={deleteCategoryAction.bind(null, cat.id)}>
                  <button type="submit" className="text-red-400 hover:text-red-600 p-2">
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
