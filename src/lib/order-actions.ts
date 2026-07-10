"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ORDER_STATUSES } from "@/lib/order-status";

export type CartItemInput = {
  productId: string;
  quantity: number;
};

export type CheckoutInput = {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  items: CartItemInput[];
};

const VALID_STATUSES = new Set(ORDER_STATUSES.map((s) => s.value));

function generateOrderNumber() {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CH-${ymd}-${rand}`;
}

async function requireAdmin() {
  const { getAdminSession } = await import("@/lib/auth");
  const adminId = await getAdminSession();
  if (!adminId) throw new Error("Unauthorized");
}

export async function placeOrderAction(input: CheckoutInput) {
  const { customerName, phone, city, address, items } = input;

  if (!customerName?.trim()) return { error: "الاسم مطلوب" };
  if (!phone?.trim()) return { error: "رقم الهاتف مطلوب" };
  if (!city?.trim()) return { error: "المدينة مطلوبة" };
  if (!address?.trim()) return { error: "العنوان مطلوب" };
  if (!items?.length) return { error: "السلة فارغة" };

  const productIds = items.map((i) => i.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds }, inStock: true },
  });

  if (products.length !== items.length) {
    return { error: "بعض المنتجات غير متوفرة" };
  }

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  let total = 0;
  const orderItems = items.map((item) => {
    const product = productMap[item.productId];
    total += product.price * item.quantity;
    return {
      productId: product.id,
      productName: product.name,
      productNameAr: product.nameAr,
      price: product.price,
      quantity: item.quantity,
      image: product.image,
    };
  });

  const order = await db.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      total,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  revalidatePath("/admin/orders");

  return { success: true, orderNumber: order.orderNumber, orderId: order.id };
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    await requireAdmin();
    if (!VALID_STATUSES.has(status as never)) return { error: "حالة غير صالحة" };

    await db.order.update({ where: { id: orderId }, data: { status } });
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/admin/orders/${orderId}/edit`);
    return { success: true, message: "تم تحديث حالة الطلب بنجاح" };
  } catch (error) {
    return { error: "حدث خطأ أثناء تحديث الحالة" };
  }
}

export async function updateOrderAction(formData: FormData) {
  try {
    await requireAdmin();

    const orderId = formData.get("orderId") as string;
    const customerName = (formData.get("customerName") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const city = (formData.get("city") as string)?.trim();
    const address = (formData.get("address") as string)?.trim();
    const status = formData.get("status") as string;
    const note = (formData.get("note") as string)?.trim() || null;

    if (!orderId || !customerName || !phone || !city || !address) return { error: "بيانات ناقصة" };
    if (!VALID_STATUSES.has(status as never)) return { error: "حالة غير صالحة" };

    await db.order.update({
      where: { id: orderId },
      data: { customerName, phone, city, address, status, note },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true, message: "تم تحديث الطلب بنجاح" };
  } catch (error) {
    return { error: "حدث خطأ أثناء تحديث الطلب" };
  }
}

export async function deleteOrderAction(orderId: string, prevState?: any, formData?: FormData) {
  try {
    await requireAdmin();
    await db.order.delete({ where: { id: orderId } });
    revalidatePath("/admin/orders");
    return { success: true, message: "تم حذف الطلب بنجاح" };
  } catch (error) {
    return { error: "حدث خطأ أثناء حذف الطلب" };
  }
}
