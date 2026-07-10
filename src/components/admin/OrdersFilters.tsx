"use client";

import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { ORDER_STATUSES } from "@/lib/order-status";

type OrdersFiltersProps = {
  q: string;
  status: string;
};

export function OrdersFilters({ q, status }: OrdersFiltersProps) {
  const router = useRouter();

  return (
    <form
      className="flex flex-wrap items-center gap-3 bg-white border border-gray-200 rounded-xl p-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const params = new URLSearchParams();
        const query = (data.get("q") as string)?.trim();
        const statusVal = data.get("status") as string;
        if (query) params.set("q", query);
        if (statusVal) params.set("status", statusVal);
        router.push(`/admin/orders?${params.toString()}`);
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

      <select
        name="status"
        defaultValue={status}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white min-w-[140px]"
      >
        <option value="">كل الحالات</option>
        {ORDER_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

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
