import { z } from "zod";

const requiredString = (message: string) => z.string().min(1, { message });

// Phone strictly 8 digits
export const phoneRegex = /^\d{8}$/;

export const CheckoutSchema = z.object({
  name: requiredString("الاسم الكامل مطلوب"),
  phone: z.string().regex(phoneRegex, { message: "رقم الهاتف يجب أن يتكون من 8 أرقام فقط" }),
  city: z.string().optional(),
  address: z.string().optional(),
});

export type CheckoutValues = z.infer<typeof CheckoutSchema>;

export const LoginSchema = z.object({
  email: z.string().email({ message: "بريد إلكتروني غير صالح" }).min(1, { message: "البريد الإلكتروني مطلوب" }),
  password: requiredString("كلمة المرور مطلوبة"),
});

export type LoginValues = z.infer<typeof LoginSchema>;

export const ProductSchema = z.object({
  name: requiredString("الاسم الإنجليزي مطلوب"),
  nameAr: requiredString("الاسم العربي مطلوب"),
  categoryId: requiredString("التصنيف مطلوب"),
  price: z.coerce.number({ message: "السعر غير صالح" }).positive({ message: "يجب أن يكون السعر أكبر من صفر" }),
  priceBeforeDiscount: z.coerce.number().positive().optional().nullable(),
  cost: z.coerce.number().positive().optional().nullable(),
  deliveryPrice: z.coerce.number().positive().optional().nullable(),
  deliveryCost: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number({ message: "المخزون غير صالح" }).nonnegative().default(0),
  sku: z.string().optional().nullable(),
  descriptionAr: z.string().optional(),
  description: z.string().optional(),
  featured: z.boolean().default(false).optional(),
  inStock: z.boolean().default(true).optional(),
  relatedProductIds: z.string().optional().default("[]"),
});

export type ProductValues = z.infer<typeof ProductSchema>;

export const CategorySchema = z.object({
  name: requiredString("الاسم الإنجليزي مطلوب"),
  nameAr: requiredString("الاسم العربي مطلوب"),
  description: z.string().optional(),
  order: z.coerce.number().default(0).optional(),
});

export type CategoryValues = z.infer<typeof CategorySchema>;

export const BannerSchema = z.object({
  title: requiredString("العنوان (إنجليزي) مطلوب"),
  titleAr: z.string().optional(),
  subtitle: z.string().optional(),
  subtitleAr: z.string().optional(),
  link: z.string().optional(),
  order: z.coerce.number().default(0).optional(),
  active: z.boolean().default(true).optional(),
});

export type BannerValues = z.infer<typeof BannerSchema>;

export const OrderEditSchema = z.object({
  customerName: requiredString("الاسم الكامل مطلوب"),
  phone: z.string().regex(phoneRegex, { message: "رقم الهاتف يجب أن يتكون من 8 أرقام فقط" }),
  city: requiredString("المدينة مطلوبة"),
  address: requiredString("العنوان مطلوب"),
  status: requiredString("الحالة مطلوبة"),
  note: z.string().optional(),
});

export type OrderEditValues = z.infer<typeof OrderEditSchema>;
