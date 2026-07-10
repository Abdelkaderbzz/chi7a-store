import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminId = await getAdminSession();
  if (!adminId) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}
