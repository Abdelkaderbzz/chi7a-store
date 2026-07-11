import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

// ─── Store queries ────────────────────────────────────────────────────────────

/** Lightweight list used in the store header and products filter bar. */
export const getCategories = unstable_cache(
  async () => {
    return db.category.findMany({
      orderBy: { order: "asc" },
      select: { id: true, slug: true, nameAr: true, name: true },
    });
  },
  ["categories"],
  { revalidate: 300, tags: ["categories"] }
);

/** Full list with product counts — used on the home page grid. */
export const getCategoriesWithCount = unstable_cache(
  async () => {
    return db.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    });
  },
  ["categories-with-count"],
  { revalidate: 300, tags: ["categories"] }
);

/** Active banners for the store front. */
export const getBanners = unstable_cache(
  async () => {
    return db.banner.findMany({ where: { active: true }, orderBy: { order: "asc" } });
  },
  ["banners"],
  { revalidate: 300, tags: ["banners"] }
);

// ─── Admin queries ────────────────────────────────────────────────────────────

/**
 * All categories with product counts — admin categories page.
 * Short TTL (30 s) so edits appear quickly; tagged so mutations can
 * call revalidateTag("categories") for an instant refresh.
 */
export const getAdminCategories = unstable_cache(
  async () => {
    return db.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    });
  },
  ["admin-categories"],
  { revalidate: 30, tags: ["categories"] }
);

/**
 * All products with their category — admin products page.
 * Revalidated by the "products" tag whenever a product is saved/deleted.
 */
export const getAdminProducts = unstable_cache(
  async () => {
    return db.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  },
  ["admin-products"],
  { revalidate: 30, tags: ["products"] }
);

/**
 * All banners — admin banners page.
 * Includes inactive banners (unlike the store getBanners).
 */
export const getAdminBanners = unstable_cache(
  async () => {
    return db.banner.findMany({ orderBy: { order: "asc" } });
  },
  ["admin-banners"],
  { revalidate: 30, tags: ["banners"] }
);
