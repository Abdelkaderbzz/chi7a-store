"use server";

import { db } from "@/lib/db";

export type AbandonedInput = {
  customerName?: string;
  phone?: string;
  city?: string;
  address?: string;
  productId: string;
  productName: string;
  productPrice: number;
};

export async function saveAbandonedOrderAction(input: AbandonedInput) {
  try {
    await db.abandonedOrder.create({
      data: {
        customerName: input.customerName || null,
        phone: input.phone || null,
        city: input.city || null,
        address: input.address || null,
        productId: input.productId,
        productName: input.productName,
        productPrice: input.productPrice,
      },
    });
    return { success: true };
  } catch {
    return { error: "Failed to save" };
  }
}

export async function markAbandonedAsConverted(productId: string, phone: string) {
  try {
    await db.abandonedOrder.updateMany({
      where: {
        productId,
        phone,
        converted: false,
      },
      data: { converted: true },
    });
  } catch {
    // Silently fail — not critical
  }
}
