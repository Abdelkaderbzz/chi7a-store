"use client";

import { useState } from "react";
import { Plus, Edit2, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { deleteProductAction } from "@/lib/actions";
import { getProductStatusFromProduct, getProductStatusLabel, getProductStatusColor } from "@/lib/product-status";
import { ProductClientForm } from "@/components/admin/ProductClientForm";
import { EditProductFormDrawer } from "@/components/admin/EditProductFormDrawer";
import { toast } from "sonner";
import Link from "next/link";

interface Category {
  id: string;
  nameAr: string;
}

interface Product {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string | null;
  descriptionAr: string | null;
  sku: string | null;
  price: number;
  priceBeforeDiscount: number | null;
  cost: number | null;
  deliveryPrice: number | null;
  deliveryCost: number | null;
  stock: number;
  image: string | null;
  images: string;
  featured: boolean;
  inStock: boolean;
  relatedProductIds: string;
  categoryId: string;
  category: Category;
}

interface ProductsTableProps {
  products: Product[];
  categories: Category[];
}

export function ProductsTable({ products: initialProducts, categories }: ProductsTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      const formData = new FormData();
      const result = await deleteProductAction(id, null, formData);
      if (result?.success) {
        setProducts(products.filter((p) => p.id !== id));
        toast.success(result.message);
      } else {
        toast.error(result?.error || "حدث خطأ");
      }
    }
  };

  const handleAddSuccess = () => {
    setShowAddDrawer(false);
    // Trigger page reload to fetch updated products
    window.location.reload();
  };

  const handleEditSuccess = () => {
    setEditingProduct(null);
    window.location.reload();
  };

  return (
    <>
      {/* Add Product Drawer */}
      {showAddDrawer && (
        <AddProductDrawer
          open={showAddDrawer}
          onOpenChange={setShowAddDrawer}
          categories={categories}
          onSuccess={handleAddSuccess}
        />
      )}

      {/* Edit Product Drawer */}
      {editingProduct && (
        <EditProductFormDrawer
          product={editingProduct}
          categories={categories}
          allProducts={products}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">المنتجات ({products.length})</h2>
        <button
          onClick={() => setShowAddDrawer(true)}
          className="flex items-center gap-2 bg-gold text-white px-3 py-2 rounded-lg text-sm hover:bg-gold-dark transition-colors"
        >
          <Plus size={16} />
          إضافة منتج
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-right font-semibold">الصورة</th>
                <th className="px-4 py-3 text-right font-semibold">الاسم</th>
                <th className="px-4 py-3 text-right font-semibold">SKU</th>
                <th className="px-4 py-3 text-right font-semibold">التصنيف</th>
                <th className="px-4 py-3 text-right font-semibold">السعر</th>
                <th className="px-4 py-3 text-right font-semibold">المخزون</th>
                <th className="px-4 py-3 text-right font-semibold">الحالة</th>
                <th className="px-4 py-3 text-right font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    لا توجد منتجات
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const status = getProductStatusFromProduct(product.featured, product.inStock);
                  const statusColor = getProductStatusColor(status);
                  const statusLabel = getProductStatusLabel(status);

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden relative">
                          {product.image ? (
                            <Image src={product.image} alt="" fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full">📦</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{product.nameAr}</p>
                          <p className="text-xs text-gray-500">{product.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {product.sku || "-"}
                      </td>
                      <td className="px-4 py-3 text-xs">{product.category.nameAr}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{formatPrice(product.price)}</p>
                          {product.priceBeforeDiscount && (
                            <p className="text-xs text-gray-500 line-through">
                              {formatPrice(product.priceBeforeDiscount)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          product.stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded border text-xs ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="تحرير"
                          >
                            <Edit2 size={16} />
                          </button>
                          <a
                            href={`/products/${product.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="معاينة"
                          >
                            <Eye size={16} />
                          </a>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

interface AddProductDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSuccess: () => void;
}

function AddProductDrawer({ open, onOpenChange, categories, onSuccess }: AddProductDrawerProps) {
  return (
    <div
      className={`fixed inset-0 z-50 ${!open && "hidden"}`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* Drawer */}
      <div
        className={`absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="font-semibold text-lg">إضافة منتج جديد</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <ProductClientForm categories={categories} onSuccess={onSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}
