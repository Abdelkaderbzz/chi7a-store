"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { PRODUCT_STATUSES } from "@/lib/product-status";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Category {
  id: string;
  nameAr: string;
}

type ProductFiltersProps = {
  q: string;
  categoryId: string;
  status: string;
  categories: Category[];
};

export function ProductFilters({ q, categoryId, status, categories }: ProductFiltersProps) {
  const router = useRouter();
  const [categoryValue, setCategoryValue] = useState(categoryId || "all");
  const [statusValue, setStatusValue] = useState(status || "all");

  function applyFilters(query: string, nextCategory: string, nextStatus: string) {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (nextCategory && nextCategory !== "all") params.set("categoryId", nextCategory);
    if (nextStatus && nextStatus !== "all") params.set("status", nextStatus);
    router.push(`/admin/products?${params.toString()}`);
  }

  return (
    <form
      className="flex flex-wrap items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 mb-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        applyFilters((data.get("q") as string) ?? "", categoryValue, statusValue);
      }}
    >
      <div className="flex flex-1 min-w-[240px] items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          name="q"
          type="search"
          placeholder="بحث بالاسم..."
          defaultValue={q}
          className="flex-1 text-sm outline-none bg-transparent"
        />
      </div>

      <div className="min-w-[180px]">
        <Select value={categoryValue} onValueChange={setCategoryValue}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="التصنيف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل التصنيفات</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nameAr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[160px]">
        <Select value={statusValue} onValueChange={setStatusValue}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            {PRODUCT_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <button
        type="submit"
        className="text-sm bg-gold text-white rounded-lg px-4 py-2.5 hover:bg-gold-dark transition-colors"
      >
        بحث
      </button>

      <button
        type="button"
        onClick={() => router.push("/admin/products")}
        className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2.5 hover:bg-gray-50"
      >
        <SlidersHorizontal size={16} />
        إعادة تعيين
      </button>
    </form>
  );
}
