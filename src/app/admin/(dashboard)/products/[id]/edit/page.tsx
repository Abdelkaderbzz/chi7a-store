import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditProductForm } from "@/components/admin/EditProductForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [product, categories, allProducts] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: { category: true },
    }),
    db.category.findMany({ orderBy: { order: "asc" } }),
    db.product.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  if (!product) {
    notFound();
  }

  // Parse images string
  let images = "[]";
  try {
    const parsedImages = JSON.parse(product.images);
    images = JSON.stringify(parsedImages);
  } catch {
    images = "[]";
  }

  const productData = {
    ...product,
    images,
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/products" className="text-gray-600 hover:text-gray-900">
          <ArrowRight size={20} />
        </Link>
        <h1 className="text-2xl font-bold">تحرير المنتج</h1>
      </div>

      <div className="grid lg:grid-cols-1 gap-8">
        <EditProductForm product={productData as any} categories={categories} allProducts={allProducts as any} />
      </div>
    </div>
  );
}
