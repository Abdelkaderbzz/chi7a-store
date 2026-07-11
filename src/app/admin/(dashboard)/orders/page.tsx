import { db } from "@/lib/db";
import { OrdersFilters } from "@/components/admin/OrdersFilters";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { ClipboardList } from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";

type SearchParams = Promise<{ q?: string; status?: string }>;

function buildWhere(q?: string, status?: string): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status;
  if (q?.trim()) {
    where.OR = [
      { phone: { contains: q.trim() } },
      { customerName: { contains: q.trim() } },
      { orderNumber: { contains: q.trim() } },
    ];
  }
  return where;
}

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, status } = await searchParams;
  const where = buildWhere(q, status);

  const [orders, phoneCounts] = await Promise.all([
    db.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    db.order.groupBy({
      by: ["phone"],
      _count: { phone: true },
    }),
  ]);

  const repeatPhones = new Set(
    phoneCounts.filter((p) => p._count.phone > 1).map((p) => p.phone)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">الطلبات / الطلبات</p>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList size={24} />
            الطلبات
            <span className="text-base font-normal text-gray-500">({orders.length})</span>
          </h1>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        <button className="px-4 py-2.5 text-sm font-medium border-b-2 border-gold text-gold-dark">
          الطلبات
        </button>
        <button className="px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed" disabled>
          مهجورة
        </button>
        <button className="px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed" disabled>
          محذوفة
        </button>
        <button className="px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed" disabled>
          مؤرشفة
        </button>
      </div>

      <OrdersFilters q={q ?? ""} status={status ?? ""} />

      <OrdersTable orders={orders} repeatPhones={repeatPhones} />
    </div>
  );
}
