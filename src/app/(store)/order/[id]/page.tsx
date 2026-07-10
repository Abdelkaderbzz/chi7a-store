import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, Phone, MessageCircle } from "lucide-react";
import { STORE_INFO } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `طلب ${id}` };
}

const STATUS_LABELS: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  delivered: "تم التوصيل",
  cancelled: "ملغى",
};

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { orderNumber: id },
    include: { items: true },
  });

  if (!order) notFound();

  const whatsappMsg = encodeURIComponent(
    `مرحبا، أريد الاستفسار عن طلبي رقم: ${order.orderNumber}`
  );

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle2 size={64} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold">تم إرسال طلبك بنجاح!</h1>
        <p className="mt-2 text-muted">شكراً {order.customerName}، سنتواصل معك قريباً</p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-right space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted">رقم الطلب</span>
            <span className="font-bold text-gold-dark">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">الحالة</span>
            <span className="font-medium">{STATUS_LABELS[order.status] || order.status}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">الهاتف</span>
            <span dir="ltr">{order.phone}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">المدينة</span>
            <span>{order.city}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted">العنوان: </span>
            <span>{order.address}</span>
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                  {item.image && (
                    <Image src={item.image} alt={item.productNameAr} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.productNameAr}</p>
                  <p className="text-muted">× {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t border-border pt-4 font-bold text-lg">
            <span>المجموع</span>
            <span className="text-gold-dark">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href={`${STORE_INFO.whatsapp}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="lg">
              <MessageCircle size={18} />
              تابع عبر واتساب
            </Button>
          </a>
          <a href={`tel:${STORE_INFO.phone}`}>
            <Button variant="outline" size="lg">
              <Phone size={18} />
              اتصل بنا
            </Button>
          </a>
        </div>

        <Link href="/products" className="mt-4 inline-block text-sm text-gold-dark hover:underline">
          متابعة التسوق
        </Link>
      </div>
    </div>
  );
}
