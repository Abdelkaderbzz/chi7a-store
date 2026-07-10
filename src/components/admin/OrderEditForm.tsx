"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";
import { ORDER_STATUSES } from "@/lib/order-status";
import { updateOrderAction } from "@/lib/order-actions";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

type OrderEditFormProps = {
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    phone: string;
    city: string;
    address: string;
    note: string | null;
    status: string;
  };
};

export function OrderEditForm({ order }: OrderEditFormProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      action={(formData) => startTransition(() => updateOrderAction(formData))}
      className="space-y-6"
    >
      <input type="hidden" name="orderId" value={order.id} />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold">تفاصيل الطلب</h2>
          <span className="text-sm text-gray-500">{order.orderNumber}</span>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">الحالة</label>
            <FormSelect
              name="status"
              defaultValue={order.status}
              options={ORDER_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {ORDER_STATUSES.map((s) => (
                <OrderStatusBadge key={s.value} status={s.value} />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input name="customerName" label="الاسم" defaultValue={order.customerName} required />
            <Input name="phone" label="الهاتف" defaultValue={order.phone} required dir="ltr" className="text-left" />
            <Input name="city" label="المدينة" defaultValue={order.city} required />
            <Input name="address" label="العنوان" defaultValue={order.address} required />
          </div>

          <Textarea
            name="note"
            label="ملاحظة"
            defaultValue={order.note ?? ""}
            placeholder="أدخل أي ملاحظات إضافية..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
        <Button type="submit" disabled={pending}>
          <Save size={16} />
          {pending ? "جاري الحفظ..." : "حفظ"}
        </Button>
      </div>
    </form>
  );
}
