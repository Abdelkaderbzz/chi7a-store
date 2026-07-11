import { getAdminProducts, getAdminCategories } from "@/lib/queries";
import { ProductFilters } from "@/components/admin/ProductFilters";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { getProductStatusFromProduct } from "@/lib/product-status";

interface SearchParams {
  q?: string;
  categoryId?: string;
  status?: string;
}

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const q = params.q || "";
  const categoryId = params.categoryId || "";
  const status = params.status || "";

  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
  ]);

  // Filter products based on search params
  const filteredProducts = products.filter((product) => {
    // Search filter
    if (q) {
      const searchLower = q.toLowerCase();
      if (!product.nameAr.toLowerCase().includes(searchLower) && !product.name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Category filter
    if (categoryId && product.categoryId !== categoryId) {
      return false;
    }

    // Status filter
    if (status) {
      const productStatus = getProductStatusFromProduct(product.featured, product.inStock);
      if (productStatus !== status) {
        return false;
      }
    }

    return true;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">إدارة المنتجات</h1>

      <ProductFilters q={q} categoryId={categoryId} status={status} categories={categories} />

      <div className="mt-6">
        <ProductsTable products={filteredProducts as any} categories={categories} />
      </div>
    </div>
  );
}
