import { CategoryIcon } from "@/components/store/CategoryIcon";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  image: string | null;
  _count?: { products: number };
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="stagger grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categories/${cat.slug}`}
          className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[var(--shadow-md)]"
        >
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
            <CategoryIcon slug={cat.slug} size={24} className="text-gold-dark" />
          </div>
          <span className="text-sm font-semibold text-center group-hover:text-gold-dark transition-colors">
            {cat.nameAr}
          </span>
          {cat._count && (
            <span className="text-xs text-muted">{cat._count.products} منتج</span>
          )}
        </Link>
      ))}
    </div>
  );
}
