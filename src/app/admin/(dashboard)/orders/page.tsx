import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { formatOrderDate, formatOrderDisplayId } from "@/lib/order-status";
import { OrdersFilters } from "@/components/admin/OrdersFilters";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { deleteOrderAction } from "@/lib/order-actions";
import { Eye, Pencil, Trash2, Truck, ClipboardList } from "lucide-react";
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-16">لا توجد طلبات</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-gray-500">
                  <th className="px-4 py-3 text-right font-medium">الرقم</th>
                  <th className="px-4 py-3 text-right font-medium">المنتجات</th>
                  <th className="px-4 py-3 text-right font-medium">العميل</th>
                  <th className="px-4 py-3 text-right font-medium">التاريخ</th>
                  <th className="px-4 py-3 text-right font-medium">التوصيل</th>
                  <th className="px-4 py-3 text-right font-medium">الحالة</th>
                  <th className="px-4 py-3 text-right font-medium">المجموع</th>
                  <th className="px-4 py-3 text-center font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gold-dark whitespace-nowrap">
                      {formatOrderDisplayId(order.orderNumber)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-1">
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                              {item.image ? (
                                <Image src={item.image} alt={item.productNameAr} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">📦</div>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">×{item.quantity}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-xs text-gray-400">+{order.items.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{order.customerName}</span>
                        {repeatPhones.has(order.phone) && (
                          <span className="text-[10px] bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full">
                            عميل متكرر
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5" dir="ltr">{order.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {formatOrderDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Truck size={14} className="text-gray-400" />
                        <span>{order.city || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-2 text-gray-400 hover:text-gold-dark hover:bg-gold/5 rounded-lg transition-colors"
                          title="عرض"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/admin/orders/${order.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Pencil size={16} />
                        </Link>
                        <form action={deleteOrderAction.bind(null, order.id)}>
                          <button
                            type="submit"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {orders.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>عرض {orders.length} طلب</span>
            <span>الصفحة 1 من 1</span>
          </div>
        )}
      </div>
    </div>
  );
}
