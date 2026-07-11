import { AdminSidebar } from "@/components/admin/AdminSidebar";

// Auth is handled by middleware — no per-request DB/JWT cost here
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto mr-64">{children}</main>
    </div>
  );
}
