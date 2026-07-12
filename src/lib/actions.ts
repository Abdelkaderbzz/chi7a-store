"use server";

import { db } from "@/lib/db";
import { getAdminSession, createToken, verifyPassword, setAdminCookie, clearAdminCookie } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/utils";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
export async function createCategoryAction(prevState: any, formData: FormData) {
  try {
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
    return { success: true, message: "تمت إضافة التصنيف بنجاح" };
  } catch (error: any) {
    console.error("Create Category Error:", error);
    if (error?.code === "P2002") return { error: "هذا التصنيف أو الاسم موجود بالفعل!" };
    return { error: error?.message || "حدث خطأ أثناء الإضافة" };
  }
}

export async function updateCategoryAction(id: string, prevState: any, formData: FormData) {
  try {
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
    return { success: true, message: "تم تحديث التصنيف بنجاح" };
  } catch (error: any) {
    return { error: "حدث خطأ أثناء التحديث" };
  }
}

export async function deleteCategoryAction(id: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin();
    await db.category.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/categories");
    return { success: true, message: "تم حذف التصنيف بنجاح" };
  } catch (error: any) {
    return { error: "حدث خطأ أثناء الحذف" };
  }
}

// Products
export async function createProductAction(prevState: any, formData: FormData) {
  try {
    await requireAdmin();
    const name = formData.get("name") as string;
    const nameAr = formData.get("nameAr") as string;
    const description = (formData.get("description") as string) || null;
    const descriptionAr = (formData.get("descriptionAr") as string) || null;
    const price = parseFloat(formData.get("price") as string);
    const sku = (formData.get("sku") as string) || null;
    const priceBeforeDiscount = formData.get("priceBeforeDiscount") ? parseFloat(formData.get("priceBeforeDiscount") as string) : null;
    const cost = formData.get("cost") ? parseFloat(formData.get("cost") as string) : null;
    const deliveryPrice = formData.get("deliveryPrice") ? parseFloat(formData.get("deliveryPrice") as string) : null;
    const deliveryCost = formData.get("deliveryCost") ? parseFloat(formData.get("deliveryCost") as string) : null;
    const stock = parseInt(formData.get("stock") as string) || 0;
    const relatedProductIds = (formData.get("relatedProductIds") as string) || "[]";
    
    const imagesStr = (formData.get("images") as string) || "[]";
    let imagesArr: string[] = [];
    try {
      imagesArr = JSON.parse(imagesStr);
    } catch {
      imagesArr = [];
    }
    const image = imagesArr.length > 0 ? imagesArr[0] : null;

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
        sku,
        price,
        priceBeforeDiscount,
        cost,
        deliveryPrice,
        deliveryCost,
        stock,
        image,
        images: JSON.stringify(imagesArr),
        categoryId,
        featured,
        inStock,
        relatedProductIds,
      },
    });
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true, message: "تمت إضافة المنتج بنجاح" };
  } catch (error: any) {
    console.error("Create Product Error:", error);
    if (error?.code === "P2002") return { error: "هذا المنتج أو الاسم موجود بالفعل!" };
    return { error: "حدث خطأ أثناء إضافة المنتج" };
  }
}

export async function updateProductAction(id: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin();
    const name = formData.get("name") as string;
    const nameAr = formData.get("nameAr") as string;
    const description = (formData.get("description") as string) || null;
    const descriptionAr = (formData.get("descriptionAr") as string) || null;
    const price = parseFloat(formData.get("price") as string);
    const sku = (formData.get("sku") as string) || null;
    const priceBeforeDiscount = formData.get("priceBeforeDiscount") ? parseFloat(formData.get("priceBeforeDiscount") as string) : null;
    const cost = formData.get("cost") ? parseFloat(formData.get("cost") as string) : null;
    const deliveryPrice = formData.get("deliveryPrice") ? parseFloat(formData.get("deliveryPrice") as string) : null;
    const deliveryCost = formData.get("deliveryCost") ? parseFloat(formData.get("deliveryCost") as string) : null;
    const stock = parseInt(formData.get("stock") as string) || 0;
    const relatedProductIds = (formData.get("relatedProductIds") as string) || "[]";
    
    const imagesStr = (formData.get("images") as string) || "[]";
    let imagesArr: string[] = [];
    try {
      imagesArr = JSON.parse(imagesStr);
    } catch {
      imagesArr = [];
    }
    const image = imagesArr.length > 0 ? imagesArr[0] : null;

    const categoryId = formData.get("categoryId") as string;
    const featured = formData.get("featured") === "on";
    const inStock = formData.get("inStock") !== "off";

    const updatedProduct = await db.product.update({
      where: { id },
      data: { 
        name, 
        nameAr, 
        description, 
        descriptionAr, 
        sku,
        price,
        priceBeforeDiscount,
        cost,
        deliveryPrice,
        deliveryCost,
        stock,
        image, 
        images: JSON.stringify(imagesArr), 
        categoryId, 
        featured, 
        inStock,
        relatedProductIds,
      },
    });
    
    // Revalidate all relevant paths
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${updatedProduct.slug}`);
    revalidatePath("/admin/products");
    
    return { success: true, message: "تم تحديث المنتج بنجاح" };
  } catch (error: any) {
    return { error: "حدث خطأ أثناء تحديث المنتج" };
  }
}

export async function deleteProductAction(id: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin();
    await db.product.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true, message: "تم حذف المنتج بنجاح" };
  } catch (error: any) {
    return { error: "حدث خطأ أثناء الحذف" };
  }
}

// Banners
export async function createBannerAction(prevState: any, formData: FormData) {
  try {
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
    return { success: true, message: "تمت إضافة البانر بنجاح" };
  } catch (error: any) {
    console.error("Create Banner Error:", error);
    return { error: error?.message || "حدث خطأ أثناء الإضافة" };
  }
}

export async function updateBannerAction(id: string, prevState: any, formData: FormData) {
  try {
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
    return { success: true, message: "تم تحديث البانر بنجاح" };
  } catch (error: any) {
    return { error: "حدث خطأ أثناء التحديث" };
  }
}

export async function deleteBannerAction(id: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin();
    await db.banner.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/banners");
    return { success: true, message: "تم حذف البانر بنجاح" };
  } catch (error: any) {
    return { error: "حدث خطأ أثناء الحذف" };
  }
}

// Upload
export async function uploadImageAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return { error: "No file" };

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const response = await cloudinary.uploader.upload(base64Image, {
      folder: "chi7a-store",
    });

    return { url: response.secure_url };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { error: "فشل تحميل الصورة" };
  }
}
