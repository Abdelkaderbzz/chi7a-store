"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { ORDER_STATUSES } from "@/lib/order-status";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type OrdersFiltersProps = {
  q: string;
  status: string;
};

export function OrdersFilters({ q, status }: OrdersFiltersProps) {
  const router = useRouter();
  const [statusValue, setStatusValue] = useState(status || "all");

  function applyFilters(query: string, nextStatus: string) {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (nextStatus && nextStatus !== "all") params.set("status", nextStatus);
    router.push(`/admin/orders?${params.toString()}`);
  }

  return (
    <form
      className="flex flex-wrap items-center gap-3 bg-white border border-gray-200 rounded-xl p-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        applyFilters((data.get("q") as string) ?? "", statusValue);
      }}
    >
      <div className="flex flex-1 min-w-[220px] items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          name="q"
          type="search"
          placeholder="بحث برقم الهاتف أو اسم العميل..."
          defaultValue={q}
          className="flex-1 text-sm outline-none bg-transparent"
        />
      </div>

      <div className="min-w-[160px]">
        <Select value={statusValue} onValueChange={setStatusValue}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="كل الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            {ORDER_STATUSES.map((s) => (
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
        onClick={() => router.push("/admin/orders")}
        className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2.5 hover:bg-gray-50"
      >
        <SlidersHorizontal size={16} />
        إعادة تعيين
      </button>
    </form>
  );
}
