import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

/**
 * Categories are rarely updated, so we cache them for 5 minutes.
 * Tag with "categories" so admin mutations can revalidate on demand.
 */
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

/**
 * Categories with product counts — used on the home page grid.
 */
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

/**
 * Banners change infrequently — cache for 5 minutes.
 */
export const getBanners = unstable_cache(
  async () => {
    return db.banner.findMany({ where: { active: true }, orderBy: { order: "asc" } });
  },
  ["banners"],
  { revalidate: 300, tags: ["banners"] }
);
