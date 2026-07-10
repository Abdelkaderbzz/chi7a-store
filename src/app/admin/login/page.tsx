"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";
import { StoreLogo } from "@/components/store/StoreLogo";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return (await loginAction(formData)) ?? null;
    },
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <StoreLogo size={80} />
          </div>
          <h1 className="text-2xl font-bold text-gold-dark">Chi7a Store</h1>
          <p className="text-gray-500 text-sm mt-1">لوحة الإدارة</p>
        </div>

        <form action={formAction} className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">تسجيل الدخول</h2>

          {state?.error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              {state.error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">البريد الإلكتروني</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="admin@chi7astore.tn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">كلمة المرور</label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full mt-6 bg-gold text-white py-2.5 rounded-lg font-medium hover:bg-gold-dark transition-colors disabled:opacity-50"
          >
            {pending ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
