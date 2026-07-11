import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

// ─── Store queries ────────────────────────────────────────────────────────────

/** Lightweight list used in the store header and products filter bar. */
export const getCategories = unstable_cache(
  async () => {
    try {
      return await db.category.findMany({
        orderBy: { order: "asc" },
        select: { id: true, slug: true, nameAr: true, name: true },
      });
    } catch (error) {
      console.warn('Failed to fetch categories, returning empty array:', error);
      return [];
    }
  },
  ["categories"],
  { revalidate: 300, tags: ["categories"] }
);

/** Full list with product counts — used on the home page grid. */
export const getCategoriesWithCount = unstable_cache(
  async () => {
    try {
      return await db.category.findMany({
        orderBy: { order: "asc" },
        include: { _count: { select: { products: true } } },
      });
    } catch (error) {
      console.warn('Failed to fetch categories with count, returning empty array:', error);
      return [];
    }
  },
  ["categories-with-count"],
  { revalidate: 300, tags: ["categories"] }
);

/** Active banners for the store front. */
export const getBanners = unstable_cache(
  async () => {
    try {
      return await db.banner.findMany({ where: { active: true }, orderBy: { order: "asc" } });
    } catch (error) {
      console.warn('Failed to fetch banners, returning empty array:', error);
      return [];
    }
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
    try {
      return await db.category.findMany({
        orderBy: { order: "asc" },
        include: { _count: { select: { products: true } } },
      });
    } catch (error) {
      console.warn('Failed to fetch admin categories, returning empty array:', error);
      return [];
    }
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
    try {
      return await db.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.warn('Failed to fetch admin products, returning empty array:', error);
      return [];
    }
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
    try {
      return await db.banner.findMany({ orderBy: { order: "asc" } });
    } catch (error) {
      console.warn('Failed to fetch admin banners, returning empty array:', error);
      return [];
    }
  },
  ["admin-banners"],
  { revalidate: 30, tags: ["banners"] }
);
