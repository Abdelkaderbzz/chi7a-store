import { getCategories } from "@/lib/queries";
import { Header, Footer } from "@/components/store/Header";
import { CartProvider } from "@/components/store/CartProvider";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <CartProvider>
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}
