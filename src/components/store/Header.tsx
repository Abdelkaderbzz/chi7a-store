import Link from "next/link";
import { Phone, Globe, MapPin } from "lucide-react";
import { STORE_INFO } from "@/lib/constants";
import { SearchBar } from "@/components/store/SearchBar";
import { CategoryMenu } from "@/components/store/CategoryMenu";
import { CartButton } from "@/components/store/CartButton";
import { StoreLogo } from "@/components/store/StoreLogo";

interface Category {
  slug: string;
  nameAr: string;
  name: string;
}

const navLinks = [
  { href: "/products", label: "المنتجات" },
  { href: "/contact", label: "اتصل بنا" },
];

export function Header({ categories }: { categories: Category[] }) {
  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top bar — inspired by reference */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <StoreLogo size={52} />
            <div className="hidden sm:block">
              <span className="font-bold text-base leading-tight block text-white">Chi7a Store</span>
              <span className="text-[10px] text-gold-light">{STORE_INFO.slogan}</span>
            </div>
          </Link>

          <SearchBar categories={categories} />

          <div className="flex items-center gap-2 shrink-0">
            <CartButton />
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="bg-white border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <CategoryMenu categories={categories} />

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-gray-700 hover:text-gold-dark transition-colors uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/products?category=iphones"
              className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              عروض خاصة
            </Link>
          </nav>

          <Link href="/" className="md:hidden text-sm font-medium text-gold-dark">
            الرئيسية
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <StoreLogo size={56} />
            <div>
              <h3 className="font-bold text-white text-lg">Chi7a Store</h3>
              <p className="text-sm text-gold-light">{STORE_INFO.slogan}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed">{STORE_INFO.welcome}</p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">روابط سريعة</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-gold-light transition-colors">الرئيسية</Link>
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-gold-light transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">معلومات الاتصال</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={STORE_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold-light"
              >
                <MapPin size={16} className="text-gold shrink-0" />
                {STORE_INFO.location}
              </a>
            </li>
            <li>
              <a href={`tel:${STORE_INFO.phone}`} className="flex items-center gap-2 hover:text-gold-light">
                <Phone size={16} className="text-gold shrink-0" />
                {STORE_INFO.phone}
              </a>
            </li>
            <li>
              <a
                href={STORE_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold-light"
              >
                <Globe size={16} className="text-gold shrink-0" />
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Chi7a Store — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
