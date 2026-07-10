import { db } from "@/lib/db";
import { deleteProductAction } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { DeleteButton } from "@/components/admin/ActionForm";
import { ProductClientForm } from "@/components/admin/ProductClientForm";

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
        <ProductClientForm categories={categories} />

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
                <DeleteButton action={deleteProductAction.bind(null, product.id)} />
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
