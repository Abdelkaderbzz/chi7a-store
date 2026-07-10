import Link from "next/link";
import { Home, Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundView() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-7xl font-bold text-gold md:text-8xl">404</p>
      <h1 className="mt-4 text-2xl font-bold md:text-3xl">الصفحة غير موجودة</h1>
      <p className="mt-3 max-w-md text-muted">
        عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/">
          <Button variant="primary" size="lg">
            <Home size={18} />
            العودة للرئيسية
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" size="lg">
            <Package size={18} />
            تصفح المنتجات
          </Button>
        </Link>
      </div>

      <Link
        href="/contact"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-gold-dark hover:underline"
      >
        تحتاج مساعدة؟ اتصل بنا
        <ArrowLeft size={14} />
      </Link>
    </div>
  );
}
