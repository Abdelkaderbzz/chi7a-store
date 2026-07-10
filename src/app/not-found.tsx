import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-gradient-to-b from-gold/10 via-background to-background px-4 py-16 text-center">
      <p className="text-7xl font-bold text-gold">404</p>
      <h1 className="mt-4 text-2xl font-bold">الصفحة غير موجودة</h1>
      <p className="mt-3 max-w-md text-muted">
        عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/">
          <Button variant="primary" size="lg">
            <Home size={18} />
            العودة للرئيسية
          </Button>
        </Link>
        <Link href="/admin">
          <Button variant="outline" size="lg">
            <ArrowLeft size={18} />
            لوحة الإدارة
          </Button>
        </Link>
      </div>
    </div>
  );
}
