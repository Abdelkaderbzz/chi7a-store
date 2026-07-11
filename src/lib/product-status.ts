export const PRODUCT_STATUSES = [
  { value: "shown", label: "مرئي", labelEn: "Shown", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "hidden", label: "مخفي", labelEn: "Hidden", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { value: "out-of-stock", label: "نفذ المخزون", labelEn: "Out of Stock", color: "bg-red-100 text-red-700 border-red-200" },
] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number]["value"];

const statusMap = Object.fromEntries(PRODUCT_STATUSES.map((s) => [s.value, s]));

export function getProductStatusLabel(status: string) {
  return statusMap[status]?.label ?? status;
}

export function getProductStatusColor(status: string) {
  return statusMap[status]?.color ?? "bg-gray-100 text-gray-700 border-gray-200";
}

export function getProductStatusFromProduct(featured: boolean, inStock: boolean): ProductStatus {
  if (!inStock) return "out-of-stock";
  if (!featured) return "hidden";
  return "shown";
}
