"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ImageIcon,
  ClipboardList,
  LogOut,
  Store,
} from "lucide-react";
import { logoutAction } from "@/lib/actions";

const links = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/categories", label: "التصنيفات", icon: FolderOpen },
  { href: "/admin/banners", label: "البانرات", icon: ImageIcon },
  { href: "/admin/orders", label: "الطلبات", icon: ClipboardList },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 min-h-screen flex flex-col shrink-0">
      <div className="p-5 border-b border-gray-800">
        <h2 className="text-white font-bold text-lg">Chi7a Admin</h2>
        <p className="text-xs text-gray-500 mt-1">لوحة الإدارة</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active ? "bg-gold text-white" : "hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Store size={18} />
          عرض المتجر
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-gray-800 transition-colors"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        </form>
      </div>
    </aside>
  );
}
