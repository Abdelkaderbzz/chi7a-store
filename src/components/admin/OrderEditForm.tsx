"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";
import { ORDER_STATUSES } from "@/lib/order-status";
import { updateOrderAction } from "@/lib/order-actions";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderEditSchema, type OrderEditValues } from "@/lib/validations";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderEditValues>({
    resolver: zodResolver(OrderEditSchema),
    defaultValues: {
      customerName: order.customerName,
      phone: order.phone,
      city: order.city,
      address: order.address,
      status: order.status,
      note: order.note || undefined,
    },
  });

  const onSubmit = (data: OrderEditValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("orderId", order.id);
      formData.append("customerName", data.customerName);
      formData.append("phone", data.phone);
      formData.append("city", data.city);
      formData.append("address", data.address);
      formData.append("status", data.status);
      if (data.note) formData.append("note", data.note);

      const result = await updateOrderAction(formData);
      if (result?.success) {
        toast.success(result.message);
        router.push(`/admin/orders/${order.id}`);
      } else if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold">تفاصيل الطلب</h2>
          <span className="text-sm text-gray-500">{order.orderNumber}</span>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">الحالة</label>
            <FormSelect
              {...register("status")}
              options={ORDER_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
            />
            {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>}
            <div className="flex flex-wrap gap-2 mt-3">
              {ORDER_STATUSES.map((s) => (
                <OrderStatusBadge key={s.value} status={s.value} />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input {...register("customerName")} label="الاسم" error={errors.customerName?.message} />
            <Input {...register("phone")} label="الهاتف" dir="ltr" className="text-left" error={errors.phone?.message} />
            <Input {...register("city")} label="المدينة" error={errors.city?.message} />
            <Input {...register("address")} label="العنوان" error={errors.address?.message} />
          </div>

          <Textarea
            {...register("note")}
            label="ملاحظة"
            placeholder="أدخل أي ملاحظات إضافية..."
            error={errors.note?.message}
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
