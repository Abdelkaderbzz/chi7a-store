import { db } from "@/lib/db";
import { Package, FolderOpen, ImageIcon, Star } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [productCount, categoryCount, bannerCount, featuredCount] = await Promise.all([
    db.product.count(),
    db.category.count(),
    db.banner.count(),
    db.product.count({ where: { featured: true } }),
  ]);

  const stats = [
    { label: "المنتجات", value: productCount, icon: Package, href: "/admin/products", color: "bg-blue-500" },
    { label: "التصنيفات", value: categoryCount, icon: FolderOpen, href: "/admin/categories", color: "bg-green-500" },
    { label: "البانرات", value: bannerCount, icon: ImageIcon, href: "/admin/banners", color: "bg-purple-500" },
    { label: "منتجات مميزة", value: featuredCount, icon: Star, href: "/admin/products", color: "bg-gold" },
  ];

  const recentProducts = await db.product.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">لوحة التحكم</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.color} text-white p-2 rounded-lg`}>
                  <Icon size={20} />
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold">آخر المنتجات</h2>
          <Link href="/admin/products" className="text-sm text-gold hover:underline">
            عرض الكل
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentProducts.map((product) => (
            <div key={product.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{product.nameAr}</p>
                <p className="text-xs text-gray-500">{product.category.nameAr}</p>
              </div>
              <span className="text-sm font-medium text-gold-dark">{product.price} د.ت</span>
            </div>
          ))}
          {recentProducts.length === 0 && (
            <p className="p-5 text-center text-gray-500 text-sm">لا توجد منتجات بعد</p>
          )}
        </div>
      </div>
    </div>
  );
}
