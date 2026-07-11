import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { DirectOrderModal } from "@/components/store/DirectOrderModal";
import { ProductCard } from "@/components/store/ProductCard";
import { CategoryIcon } from "@/components/store/CategoryIcon";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = true; // fallback to SSR for newly added products

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug }, select: { nameAr: true } });
  return { title: product?.nameAr || "منتج" };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // fetch product and related in parallel
  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    include: { category: true },
    take: 4,
  });

  return (
    <div className="container-page py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-gold-dark">الرئيسية</Link>
        <ArrowRight size={13} />
        <Link href={`/categories/${product.category.slug}`} className="hover:text-gold-dark">
          {product.category.nameAr}
        </Link>
        <ArrowRight size={13} />
        <span className="text-foreground">{product.nameAr}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery
          imagesString={product.images}
          fallbackImage={product.image}
          productName={product.nameAr}
          categorySlug={product.category.slug}
        />

        <div className="flex flex-col">
          <Link
            href={`/categories/${product.category.slug}`}
            className="flex items-center gap-1.5 text-sm font-medium text-gold"
          >
            <CategoryIcon slug={product.category.slug} size={15} className="text-gold" />
            {product.category.nameAr}
          </Link>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">{product.nameAr}</h1>
          <p className="mt-4 text-3xl font-bold text-ink">{formatPrice(product.price)}</p>

          <div className="mt-4">
            {product.inStock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                <CheckCircle2 size={15} />
                متوفر
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
                <XCircle size={15} />
                نفذت الكمية
              </span>
            )}
          </div>

          {(product.descriptionAr || product.description) && (
            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold">الوصف</h3>
              <p className="leading-relaxed text-muted">
                {product.descriptionAr || product.description}
              </p>
            </div>
          )}

          <div className="mt-8 space-y-3">
            <AddToCartButton
              id={product.id}
              slug={product.slug}
              nameAr={product.nameAr}
              price={product.price}
              image={product.image}
              deliveryPrice={product.deliveryPrice || undefined}
              inStock={product.inStock}
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <DirectOrderModal 
                  product={{
                    id: product.id,
                    nameAr: product.nameAr,
                    price: product.price,
                    image: product.image
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="rule-gold mb-6 text-lg font-bold">منتجات مشابهة</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                {...p}
                categoryName={p.category.nameAr}
                categorySlug={p.category.slug}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
