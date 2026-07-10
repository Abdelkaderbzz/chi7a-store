"use server";

import { db } from "@/lib/db";
import { getAdminSession, createToken, verifyPassword, setAdminCookie, clearAdminCookie } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const adminId = await getAdminSession();
  if (!adminId) throw new Error("Unauthorized");
  return adminId;
}

// Auth
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const admin = await db.admin.findUnique({ where: { email } });
  if (!admin || !(await verifyPassword(password, admin.password))) {
    return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
  }

  const token = await createToken(admin.id);
  await setAdminCookie(token);
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminCookie();
  redirect("/admin/login");
}

// Categories
export async function createCategoryAction(formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const nameAr = formData.get("nameAr") as string;
  const description = (formData.get("description") as string) || null;
  const image = (formData.get("image") as string) || null;
  const order = parseInt(formData.get("order") as string) || 0;

  await db.category.create({
    data: { name, nameAr, slug: slugify(name), description, image, order },
  });
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const nameAr = formData.get("nameAr") as string;
  const description = (formData.get("description") as string) || null;
  const image = (formData.get("image") as string) || null;
  const order = parseInt(formData.get("order") as string) || 0;

  await db.category.update({
    where: { id },
    data: { name, nameAr, description, image, order },
  });
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  await db.category.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

// Products
export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const nameAr = formData.get("nameAr") as string;
  const description = (formData.get("description") as string) || null;
  const descriptionAr = (formData.get("descriptionAr") as string) || null;
  const price = parseFloat(formData.get("price") as string);
  const image = (formData.get("image") as string) || null;
  const categoryId = formData.get("categoryId") as string;
  const featured = formData.get("featured") === "on";
  const inStock = formData.get("inStock") !== "off";

  await db.product.create({
    data: {
      name,
      nameAr,
      slug: slugify(name),
      description,
      descriptionAr,
      price,
      image,
      categoryId,
      featured,
      inStock,
    },
  });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const nameAr = formData.get("nameAr") as string;
  const description = (formData.get("description") as string) || null;
  const descriptionAr = (formData.get("descriptionAr") as string) || null;
  const price = parseFloat(formData.get("price") as string);
  const image = (formData.get("image") as string) || null;
  const categoryId = formData.get("categoryId") as string;
  const featured = formData.get("featured") === "on";
  const inStock = formData.get("inStock") !== "off";

  await db.product.update({
    where: { id },
    data: { name, nameAr, description, descriptionAr, price, image, categoryId, featured, inStock },
  });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await db.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

// Banners
export async function createBannerAction(formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const titleAr = (formData.get("titleAr") as string) || null;
  const subtitle = (formData.get("subtitle") as string) || null;
  const subtitleAr = (formData.get("subtitleAr") as string) || null;
  const image = formData.get("image") as string;
  const link = (formData.get("link") as string) || null;
  const order = parseInt(formData.get("order") as string) || 0;
  const active = formData.get("active") !== "off";

  await db.banner.create({
    data: { title, titleAr, subtitle, subtitleAr, image, link, order, active },
  });
  revalidatePath("/");
  revalidatePath("/admin/banners");
}

export async function updateBannerAction(id: string, formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const titleAr = (formData.get("titleAr") as string) || null;
  const subtitle = (formData.get("subtitle") as string) || null;
  const subtitleAr = (formData.get("subtitleAr") as string) || null;
  const image = formData.get("image") as string;
  const link = (formData.get("link") as string) || null;
  const order = parseInt(formData.get("order") as string) || 0;
  const active = formData.get("active") !== "off";

  await db.banner.update({
    where: { id },
    data: { title, titleAr, subtitle, subtitleAr, image, link, order, active },
  });
  revalidatePath("/");
  revalidatePath("/admin/banners");
}

export async function deleteBannerAction(id: string) {
  await requireAdmin();
  await db.banner.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/banners");
}

// Upload
export async function uploadImageAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return { error: "No file" };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const fs = await import("fs/promises");
  const path = await import("path");
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  return { url: `/uploads/${filename}` };
}
