import { db } from "@/lib/db";
import { BarChart, DonutChart } from "@/components/admin/DashboardCharts";
import {
  ShoppingBag,
  TrendingUp,
  CalendarDays,
  Calendar,
  Truck,
  RotateCcw,
  Info,
} from "lucide-react";

function getStartOfDay(d: Date) {
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getStartOfWeek(d: Date) {
  const start = new Date(d);
  const day = start.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday start
  start.setDate(start.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getStartOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function formatShortDate(d: Date) {
  return d.toLocaleDateString("ar-TN", { month: "short", day: "2-digit" });
}

export default async function AdminDashboard() {
  const now = new Date();
  const todayStart = getStartOfDay(now);
  const weekStart = getStartOfWeek(now);
  const monthStart = getStartOfMonth(now);

  // 10 days ago for chart
  const tenDaysAgo = new Date(now);
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 9);
  tenDaysAgo.setHours(0, 0, 0, 0);

  const [
    allOrders,
    todayOrders,
    weekOrders,
    monthOrders,
    deliveredCount,
    returnedCount,
    totalOrderCount,
    last10DaysOrders,
    confirmedOrders,
  ] = await Promise.all([
    // Total revenue
    db.order.aggregate({ _sum: { total: true }, _count: true }),
    // Today
    db.order.aggregate({
      _sum: { total: true },
      _count: true,
      where: { createdAt: { gte: todayStart } },
    }),
    // This week
    db.order.aggregate({
      _sum: { total: true },
      _count: true,
      where: { createdAt: { gte: weekStart } },
    }),
    // This month
    db.order.aggregate({
      _sum: { total: true },
      _count: true,
      where: { createdAt: { gte: monthStart } },
    }),
    // Delivered
    db.order.count({ where: { status: "delivered" } }),
    // Returned
    db.order.count({ where: { status: "returned" } }),
    // Total orders for tracking
    db.order.count(),
    // Last 10 days orders for chart
    db.order.findMany({
      where: { createdAt: { gte: tenDaysAgo } },
      select: { total: true, createdAt: true },
    }),
    // Confirmed orders (not cancelled/returned)
    db.order.count({
      where: { status: { notIn: ["cancelled", "returned"] } },
    }),
  ]);

  // Abandoned order queries — separated to handle gracefully if model not yet available
  let abandonedTotal = 0;
  let abandonedConverted = 0;
  try {
    [abandonedTotal, abandonedConverted] = await Promise.all([
      db.abandonedOrder.count(),
      db.abandonedOrder.count({ where: { converted: true } }),
    ]);
  } catch {
    // Model may not be available yet
  }

  // Build chart data: group orders by day over last 10 days
  const chartDays: { label: string; value: number; amount: number }[] = [];
  for (let i = 0; i < 10; i++) {
    const dayStart = new Date(tenDaysAgo);
    dayStart.setDate(dayStart.getDate() + i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayOrders = last10DaysOrders.filter(
      (o) => o.createdAt >= dayStart && o.createdAt < dayEnd
    );

    chartDays.push({
      label: formatShortDate(dayStart),
      value: dayOrders.length,
      amount: Math.round(dayOrders.reduce((s, o) => s + o.total, 0)),
    });
  }

  const totalRevenue = allOrders._sum.total ?? 0;
  const todayRevenue = todayOrders._sum.total ?? 0;
  const weekRevenue = weekOrders._sum.total ?? 0;
  const monthRevenue = monthOrders._sum.total ?? 0;
  const totalCount = allOrders._count;

  const deliveredPct = totalOrderCount > 0 ? ((deliveredCount / totalOrderCount) * 100).toFixed(1) : "0";
  const returnedPct = totalOrderCount > 0 ? ((returnedCount / totalOrderCount) * 100).toFixed(1) : "0";

  const totalTraffic = confirmedOrders + (abandonedTotal - abandonedConverted);
  const abandonedNet = abandonedTotal - abandonedConverted;

  const statCards = [
    {
      label: "طلبات اليوم",
      revenue: todayRevenue,
      count: todayOrders._count,
      icon: ShoppingBag,
      gradient: false,
    },
    {
      label: "طلبات هذا الأسبوع",
      revenue: weekRevenue,
      count: weekOrders._count,
      icon: CalendarDays,
      gradient: false,
    },
    {
      label: "طلبات هذا الشهر",
      revenue: monthRevenue,
      count: monthOrders._count,
      icon: Calendar,
      gradient: false,
    },
    {
      label: "إجمالي الإيرادات",
      revenue: totalRevenue,
      count: totalCount,
      icon: TrendingUp,
      gradient: true,
    },
  ];

  const totalChartOrders = chartDays.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">لوحة التحكم</h1>

      {/* ── Stat Cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-2xl p-5 ${
                card.gradient
                  ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              {card.gradient && (
                <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
              )}
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Icon
                    size={16}
                    className={card.gradient ? "text-purple-200" : "text-gray-400"}
                  />
                  <span
                    className={`text-sm font-medium ${
                      card.gradient ? "text-purple-100" : "text-gray-500"
                    }`}
                  >
                    {card.label}
                  </span>
                </div>
                <p className="text-2xl font-bold tracking-tight">
                  {card.revenue.toLocaleString("ar-TN", { minimumFractionDigits: 2 })} د.ت
                </p>
                <p
                  className={`text-sm mt-1 ${
                    card.gradient ? "text-purple-200" : "text-gray-400"
                  }`}
                >
                  {card.count} طلب
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Order Tracking Bar ─────────────────────── */}
      <div className="rounded-2xl bg-white border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-800">تتبع الطلبات</h2>
            <Info size={14} className="text-gray-400" />
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-600" />
              تم التوصيل {deliveredPct}%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
              مُرتجع {returnedPct}%
            </span>
          </div>
        </div>

        <div className="relative h-12 rounded-full overflow-hidden bg-gray-100">
          {/* Delivered portion */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center px-5 transition-all duration-700"
            style={{ width: `${Math.max(parseFloat(deliveredPct), 0)}%` }}
          >
            <div className="flex items-center gap-2 text-white text-sm font-semibold whitespace-nowrap">
              <Truck size={16} />
              {deliveredPct}%
            </div>
          </div>
          {/* Returned portion at the end */}
          {parseFloat(returnedPct) > 0 && (
            <div
              className="absolute inset-y-0 right-0 bg-gradient-to-l from-gray-300 to-gray-200 rounded-full flex items-center justify-end px-5"
              style={{ width: `${Math.max(parseFloat(returnedPct), 8)}%` }}
            >
              <div className="flex items-center gap-2 text-gray-600 text-sm font-semibold whitespace-nowrap">
                <RotateCcw size={16} />
                {returnedPct}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Charts Row ─────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar Chart — Orders by Day */}
        <div className="xl:col-span-2 rounded-2xl bg-white border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-800">الطلبات</h2>
              <Info size={14} className="text-gray-400" />
              <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {totalChartOrders} طلب
              </span>
            </div>
          </div>
          <BarChart data={chartDays} accentColor="#7c3aed" />
        </div>

        {/* Donut Chart — Traffic */}
        <div className="rounded-2xl bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="font-semibold text-gray-800">حركة الطلبات</h2>
            <Info size={14} className="text-gray-400" />
          </div>
          <div className="flex items-center justify-center">
            <DonutChart
              confirmed={confirmedOrders}
              abandoned={abandonedNet > 0 ? abandonedNet : 0}
              accentColor="#7c3aed"
              secondaryColor="#facc15"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
