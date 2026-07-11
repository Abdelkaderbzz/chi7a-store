import { getAdminCategories } from "@/lib/queries";
import { deleteCategoryAction } from "@/lib/actions";
import { CategoryIcon } from "@/components/store/CategoryIcon";
import { DeleteButton } from "@/components/admin/ActionForm";
import { CategoryClientForm } from "@/components/admin/CategoryClientForm";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">إدارة التصنيفات</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <CategoryClientForm />

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
                <DeleteButton action={deleteCategoryAction.bind(null, cat.id)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
