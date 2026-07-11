"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { formatOrderDate, formatOrderDisplayId } from "@/lib/order-status";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { deleteOrderAction } from "@/lib/order-actions";
import { Eye, Pencil, Truck } from "lucide-react";
import { DeleteButton } from "@/components/admin/ActionForm";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  image: string | null;
  productNameAr: string;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string | null;
  status: string;
  total: number;
  createdAt: Date;
  items: OrderItem[];
}

interface OrdersTableProps {
  orders: Order[];
  repeatPhones: Set<string>;
}

export function OrdersTable({ orders: initialOrders, repeatPhones }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageOrders = orders.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      const formData = new FormData();
      const result = await deleteOrderAction(id, null, formData);
      if (result?.success) {
        const next = orders.filter((o) => o.id !== id);
        setOrders(next);
        const newTotal = Math.max(1, Math.ceil(next.length / pageSize));
        if (safePage > newTotal) setPage(newTotal);
        toast.success(result.message);
      } else {
        toast.error(result?.error || "حدث خطأ");
      }
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-16">لا توجد طلبات</p>
      ) : (
        <>
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
                {pageOrders.map((order) => (
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
                        <DeleteButton action={deleteOrderAction.bind(null, order.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={orders.length}
            itemsLabel="طلب"
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}
    </div>
  );
}
