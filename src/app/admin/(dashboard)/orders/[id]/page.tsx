import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { formatOrderDate, formatOrderDisplayId } from "@/lib/order-status";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pencil, FileText } from "lucide-react";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  const previousOrders = await db.order.count({
    where: { phone: order.phone, id: { not: order.id } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">الطلبات / تفاصيل الطلب</p>
          <h1 className="text-2xl font-bold">تفاصيل الطلب</h1>
        </div>
        <Link href={`/admin/orders/${order.id}/edit`}>
          <Button>
            <Pencil size={16} />
            تعديل
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold mb-4">طلب {formatOrderDisplayId(order.orderNumber)}</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">تاريخ الإضافة</dt>
              <dd>{formatOrderDate(order.createdAt)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">شركة التوصيل</dt>
              <dd>—</dd>
            </div>
            <div className="flex justify-between gap-4 items-center">
              <dt className="text-gray-500">الحالة</dt>
              <dd><OrderStatusBadge status={order.status} /></dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">بيانات العميل</h2>
            {previousOrders > 0 && (
              <span className="text-xs bg-gold/10 text-gold-dark px-2.5 py-1 rounded-full flex items-center gap-1">
                <FileText size={12} />
                {previousOrders} طلب سابق
              </span>
            )}
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">الاسم</dt>
              <dd className="font-medium">{order.customerName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">الهاتف</dt>
              <dd dir="ltr">{order.phone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">المدينة</dt>
              <dd>{order.city}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">العنوان</dt>
              <dd className="text-left">{order.address}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">ملاحظة</dt>
              <dd>{order.note || "—"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gold/5 flex items-center gap-4">
          <span className="text-sm font-semibold text-gold-dark px-3 py-1.5 bg-white rounded-lg border border-gold/20">
            الملخص
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="px-5 py-3 text-right font-medium">المنتج</th>
                <th className="px-5 py-3 text-right font-medium">الكمية</th>
                <th className="px-5 py-3 text-right font-medium">سعر الوحدة</th>
                <th className="px-5 py-3 text-right font-medium">المجموع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.productNameAr} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">📦</div>
                        )}
                      </div>
                      <span className="font-medium">{item.productNameAr}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">{item.quantity}</td>
                  <td className="px-5 py-4">{formatPrice(item.price)}</td>
                  <td className="px-5 py-4 font-medium">{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-100">
                <td colSpan={3} className="px-5 py-3 text-left text-gray-500">المجموع الفرعي</td>
                <td className="px-5 py-3 font-medium">{formatPrice(order.total)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="px-5 py-3 text-left text-gray-500">سعر التوصيل</td>
                <td className="px-5 py-3">—</td>
              </tr>
              <tr className="bg-gold/5">
                <td colSpan={3} className="px-5 py-4 text-left font-semibold">المجموع الكلي</td>
                <td className="px-5 py-4 font-bold text-lg">{formatPrice(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gold-dark">
        <ArrowRight size={16} />
        العودة إلى الطلبات
      </Link>
    </div>
  );
}
