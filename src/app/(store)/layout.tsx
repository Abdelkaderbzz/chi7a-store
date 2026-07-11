import { db } from "@/lib/db";
import { Header, Footer } from "@/components/store/Header";
import { CartProvider } from "@/components/store/CartProvider";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const categories = await db.category.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, nameAr: true, name: true },
  });

  return (
    <CartProvider>
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}
