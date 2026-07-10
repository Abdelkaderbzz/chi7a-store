import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { formatOrderDisplayId } from "@/lib/order-status";
import { OrderEditForm } from "@/components/admin/OrderEditForm";
import { ArrowRight } from "lucide-react";

export default async function OrderEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 mb-1">الطلبات / تعديل الطلب</p>
        <h1 className="text-2xl font-bold">
          تعديل الطلب {formatOrderDisplayId(order.orderNumber)}
        </h1>
      </div>

      <OrderEditForm order={order} />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold">ملخص الطلب</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {order.items.map((item) => (
            <div key={item.id} className="px-5 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.productNameAr} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs">📦</div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{item.productNameAr}</p>
                  <p className="text-xs text-gray-500">× {item.quantity}</p>
                </div>
              </div>
              <span className="font-medium text-sm shrink-0">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-gray-100 flex justify-between font-bold">
          <span>المجموع</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gold-dark">
        <ArrowRight size={16} />
        العودة إلى تفاصيل الطلب
      </Link>
    </div>
  );
}
