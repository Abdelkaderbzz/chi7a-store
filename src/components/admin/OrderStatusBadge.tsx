import { getOrderStatusColor, getOrderStatusLabel } from "@/lib/order-status";
import { cn } from "@/lib/utils";

export function OrderStatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        getOrderStatusColor(status),
        className
      )}
    >
      {getOrderStatusLabel(status)}
    </span>
  );
}
