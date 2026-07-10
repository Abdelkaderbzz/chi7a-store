import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { CategoryIcon } from "@/components/store/CategoryIcon";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await db.category.findUnique({ where: { slug } });
  return { title: category?.nameAr || "تصنيف" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await db.category.findUnique({
    where: { slug },
    include: {
      products: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!category) notFound();

  return (
    <div className="container-page py-8">
      <div className="mb-8 flex items-center gap-4 rounded-2xl border border-border bg-gradient-to-l from-gold/10 to-card p-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold/15">
          <CategoryIcon slug={category.slug} size={32} className="text-gold-dark" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{category.nameAr}</h1>
          <p className="mt-0.5 text-sm text-muted">
            {category.description || `${category.products.length} منتج متوفر`}
          </p>
        </div>
      </div>

      {category.products.length > 0 ? (
        <div className="stagger grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {category.products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              categoryName={category.nameAr}
              categorySlug={category.slug}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-muted">لا توجد منتجات في هذا التصنيف حالياً</p>
          <Link href="/products" className="text-sm font-medium text-gold-dark hover:underline">
            تصفح كل المنتجات
          </Link>
        </div>
      )}
    </div>
  );
}
