export const ORDER_STATUSES = [
  { value: "pending", label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "attempt1", label: "محاولة 1", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { value: "confirmed", label: "مؤكد", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "rejected", label: "مرفوض", color: "bg-red-100 text-red-700 border-red-200" },
  { value: "packed", label: "مُغلّف", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { value: "delivered", label: "تم التوصيل", color: "bg-teal-100 text-teal-800 border-teal-200" },
  { value: "returned", label: "مُرتجع", color: "bg-pink-100 text-pink-800 border-pink-200" },
  { value: "cancelled", label: "ملغى", color: "bg-gray-100 text-gray-700 border-gray-200" },
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number]["value"];

const statusMap = Object.fromEntries(ORDER_STATUSES.map((s) => [s.value, s]));

export function getOrderStatusLabel(status: string) {
  return statusMap[status]?.label ?? status;
}

export function getOrderStatusColor(status: string) {
  return statusMap[status]?.color ?? "bg-gray-100 text-gray-700 border-gray-200";
}

export function formatOrderDate(date: Date) {
  return new Intl.DateTimeFormat("ar-TN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatOrderDisplayId(orderNumber: string) {
  const suffix = orderNumber.split("-").pop() ?? orderNumber;
  return `#${suffix}`;
}
