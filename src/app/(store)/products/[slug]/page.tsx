import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { STORE_INFO } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { ProductCard } from "@/components/store/ProductCard";
import { CategoryIcon } from "@/components/store/CategoryIcon";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ArrowRight, Phone, MessageCircle, CheckCircle2, XCircle } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  return { title: product?.nameAr || "منتج" };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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

  const whatsappMsg = encodeURIComponent(
    `مرحبا، أريد الاستفسار عن: ${product.nameAr} - ${formatPrice(product.price)}`
  );

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
              inStock={product.inStock}
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`${STORE_INFO.whatsapp}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="whatsapp" size="lg" className="w-full">
                  <MessageCircle size={18} />
                  اطلب عبر واتساب
                </Button>
              </a>
              <a href={`tel:${STORE_INFO.phone}`} className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  <Phone size={18} />
                  اتصل بنا
                </Button>
              </a>
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
