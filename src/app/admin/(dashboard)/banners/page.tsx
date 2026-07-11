import { getAdminBanners } from "@/lib/queries";
import { deleteBannerAction } from "@/lib/actions";
import Image from "next/image";
import { DeleteButton } from "@/components/admin/ActionForm";
import { BannerClientForm } from "@/components/admin/BannerClientForm";

export default async function AdminBannersPage() {
  const banners = await getAdminBanners();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">إدارة البانرات</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <BannerClientForm />

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold">البانرات ({banners.length})</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {banners.map((banner) => (
              <div key={banner.id} className="p-4 flex items-center gap-4">
                <div className="w-24 h-14 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
                  <Image src={banner.image} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{banner.titleAr || banner.title}</p>
                  <p className="text-xs text-gray-500">
                    ترتيب: {banner.order} • {banner.active ? "نشط" : "غير نشط"}
                    {banner.link && ` • ${banner.link}`}
                  </p>
                </div>
                <DeleteButton action={deleteBannerAction.bind(null, banner.id)} />
              </div>
            ))}
            {banners.length === 0 && (
              <p className="p-8 text-center text-gray-500 text-sm">لا توجد بانرات</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
