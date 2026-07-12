"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  nameAr: string;
  image: string | null;
  categoryId: string;
}

interface Category {
  id: string;
  nameAr: string;
}

interface RelatedProductsSelectorProps {
  products: Product[];
  categories: Category[];
  currentProductId: string;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function RelatedProductsSelector({
  products,
  categories,
  currentProductId,
  selectedIds,
  onChange,
}: RelatedProductsSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.id !== currentProductId) // Exclude current product
      .filter((p) => {
        // Category filter
        if (selectedCategoryId !== "all" && p.categoryId !== selectedCategoryId) {
          return false;
        }
        
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          return (
            p.nameAr.toLowerCase().includes(query) ||
            p.name.toLowerCase().includes(query)
          );
        }
        
        return true;
      });
  }, [products, currentProductId, searchQuery, selectedCategoryId]);

  const toggleProduct = (productId: string) => {
    if (selectedIds.includes(productId)) {
      onChange(selectedIds.filter((id) => id !== productId));
    } else {
      onChange([...selectedIds, productId]);
    }
  };

  const clearSelection = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">
          المنتجات ذات الصلة {selectedIds.length > 0 && `(${selectedIds.length})`}
        </label>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs text-red-600 hover:text-red-700 font-medium"
          >
            مسح الكل
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="space-y-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="البحث عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
        >
          <option value="all">جميع التصنيفات</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nameAr}
            </option>
          ))}
        </select>
      </div>

      {/* Products List */}
      <div
        className="space-y-2 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50"
        style={{ maxHeight: "300px" }}
      >
        {filteredProducts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            {searchQuery || selectedCategoryId !== "all"
              ? "لا توجد منتجات مطابقة"
              : "لا توجد منتجات"}
          </p>
        ) : (
          filteredProducts.map((product) => {
            const isSelected = selectedIds.includes(product.id);
            return (
              <label
                key={product.id}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-gold/10 border border-gold"
                    : "bg-white hover:bg-gray-50 border border-transparent"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleProduct(product.id)}
                  className="rounded border-gray-300 text-gold focus:ring-gold"
                />
                
                {/* Product Image */}
                <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.nameAr}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Search size={20} />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.nameAr}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {product.name}
                  </p>
                </div>
              </label>
            );
          })
        )}
      </div>

      {/* Info text */}
      <p className="text-xs text-gray-500">
        سيتم عرض هذه المنتجات في قسم "منتجات مشابهة" بصفحة تفاصيل المنتج
      </p>
    </div>
  );
}
