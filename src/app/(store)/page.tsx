import { db } from "@/lib/db";
import { BannerCarousel } from "@/components/store/BannerCarousel";
import { CategoryGrid } from "@/components/store/CategoryGrid";
import { ProductCard } from "@/components/store/ProductCard";
import { STORE_INFO } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Phone, MessageCircle, ShieldCheck, Truck, Headset } from "lucide-react";

const perks = [
  { icon: ShieldCheck, title: "ضمان أصلي", desc: "منتجات موثوقة" },
  { icon: Truck, title: "توصيل سريع", desc: "لكل تونس" },
  { icon: Headset, title: "دعم دائم", desc: "متميزون في خدمتكم" },
];

export default async function HomePage() {
  const [banners, categories, featuredProducts] = await Promise.all([
    db.banner.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    db.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    db.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: 12,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-gold/10 via-background to-background">
        <div className="container-page py-8">
          <BannerCarousel banners={banners} />

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {perks.map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/10">
                    <Icon size={20} className="text-gold-dark" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{perk.title}</p>
                    <p className="text-xs text-muted">{perk.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="rule-gold text-lg font-bold">تسوّق حسب التصنيف</h2>
        </div>
        <CategoryGrid categories={categories} />
      </section>

      {/* Featured Products */}
      <section className="container-page pb-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="rule-gold text-lg font-bold">منتجات مميزة</h2>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-medium text-gold-dark transition-colors hover:text-gold"
          >
            عرض الكل
            <ArrowLeft size={16} />
          </Link>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="stagger grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                categoryName={product.category.nameAr}
                categorySlug={product.category.slug}
              />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-muted">لا توجد منتجات حالياً</p>
        )}
      </section>

      {/* CTA */}
      <section className="bg-ink text-white">
        <div className="container-page flex flex-col items-center gap-6 py-14 text-center">
          <div>
            <h2 className="text-2xl font-bold">هل تحتاج مساعدة في الاختيار؟</h2>
            <p className="mt-2 text-gray-300">
              تواصل معنا عبر الهاتف أو واتساب وسنساعدك في إيجاد ما يناسبك
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={STORE_INFO.whatsapp} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="lg">
                <MessageCircle size={18} />
                راسلنا على واتساب
              </Button>
            </a>
            <a href={`tel:${STORE_INFO.phone}`}>
              <Button variant="primary" size="lg">
                <Phone size={18} />
                {STORE_INFO.phone}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
