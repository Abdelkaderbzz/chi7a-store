"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronLeft, Menu, X } from "lucide-react";
import { CategoryIcon } from "@/components/store/CategoryIcon";
import { CATEGORY_GROUPS, CATEGORY_BADGES } from "@/lib/category-icons";

interface Category {
  slug: string;
  nameAr: string;
  name: string;
}

export function CategoryMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c]));

  return (
    <>
      {/* Desktop browse button + mega menu */}
      <div
        className="relative hidden lg:block"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          type="button"
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
          onClick={() => setOpen(!open)}
        >
          <Menu size={18} />
          تصفح التصنيفات
          <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute top-full right-0 pt-2 z-50">
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-6 w-[720px] grid grid-cols-3 gap-6">
              {CATEGORY_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                    {group.title}
                  </h3>
                  <ul className="space-y-1">
                    {group.slugs.map((slug) => {
                      const cat = categoryMap[slug];
                      if (!cat) return null;
                      const badge = CATEGORY_BADGES[slug];
                      return (
                        <li key={slug}>
                          <Link
                            href={`/categories/${slug}`}
                            className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm hover:bg-gold/10 hover:text-gold-dark transition-colors group"
                            onClick={() => setOpen(false)}
                          >
                            <CategoryIcon slug={slug} size={16} className="text-gray-400 group-hover:text-gold-dark shrink-0" />
                            <span className="flex-1">{cat.nameAr}</span>
                            {badge && (
                              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-medium">
                                {badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile categories toggle */}
      <button
        type="button"
        className="lg:hidden flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        التصنيفات
      </button>

      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 max-h-[70vh] overflow-y-auto">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gold/5"
              onClick={() => setMobileOpen(false)}
            >
              <CategoryIcon slug={cat.slug} size={20} className="text-gold-dark" />
              <span className="flex-1 text-sm font-medium">{cat.nameAr}</span>
              <ChevronLeft size={16} className="text-gray-300" />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
