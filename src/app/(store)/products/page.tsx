import { db } from "@/lib/db";
import { getCategories } from "@/lib/queries";
import { ProductCard } from "@/components/store/ProductCard";
import { CategoryIcon } from "@/components/store/CategoryIcon";
import Link from "next/link";
import { PackageSearch } from "lucide-react";

export const metadata = { title: "المنتجات" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;

  // categories come from cache; products fetched in parallel
  const categories = await getCategories();

  const where: Record<string, unknown> = {};
  const activeCat = params.category
    ? categories.find((c) => c.slug === params.category)
    : null;
  if (activeCat) where.categoryId = activeCat.id;
  if (params.q) {
    where.OR = [
      { name: { contains: params.q } },
      { nameAr: { contains: params.q } },
    ];
  }

  const products = await db.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {params.q ? `نتائج البحث: "${params.q}"` : activeCat ? activeCat.nameAr : "جميع المنتجات"}
        </h1>
        <p className="mt-1 text-sm text-muted">{products.length} منتج</p>
      </div>

      {/* Category chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            !params.category
              ? "border-gold bg-gold text-white"
              : "border-border bg-white hover:border-gold/50 hover:text-gold-dark"
          }`}
        >
          الكل
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              params.category === cat.slug
                ? "border-gold bg-gold text-white"
                : "border-border bg-white hover:border-gold/50 hover:text-gold-dark"
            }`}
          >
            <CategoryIcon
              slug={cat.slug}
              size={15}
              className={params.category === cat.slug ? "text-white" : "text-gold-dark"}
            />
            {cat.nameAr}
          </Link>
        ))}
      </div>

      {products.length > 0 ? (
        <div className="stagger grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              categoryName={product.category.nameAr}
              categorySlug={product.category.slug}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <PackageSearch size={48} className="text-gray-300" strokeWidth={1.5} />
          <p className="text-muted">لا توجد منتجات مطابقة</p>
          <Link href="/products" className="text-sm font-medium text-gold-dark hover:underline">
            عرض كل المنتجات
          </Link>
        </div>
      )}
    </div>
  );
}
