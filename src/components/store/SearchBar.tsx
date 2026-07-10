"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Category {
  slug: string;
  nameAr: string;
}

export function SearchBar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category && category !== "all") params.set("category", category);
    router.push(`/products${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-4 hidden max-w-2xl flex-1 md:flex">
      <div className="flex w-full items-center gap-1 rounded-xl bg-white p-1 shadow-[var(--shadow-sm)] ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-gold/40">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن هاتف، حاسوب، ساعة..."
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-muted"
        />
        <div className="w-40 shrink-0">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 rounded-lg border-0 bg-gray-50 text-xs">
              <SelectValue placeholder="كل التصنيفات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل التصنيفات</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {cat.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button
          type="submit"
          className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-gold px-4 text-white transition-colors hover:bg-gold-dark"
          aria-label="بحث"
        >
          <Search size={17} />
        </button>
      </div>
    </form>
  );
}
