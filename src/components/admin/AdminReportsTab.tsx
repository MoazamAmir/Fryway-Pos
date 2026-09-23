import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Sparkles,
  TrendingUp,
  Flame,
  Droplets,
  Store,
  Bike,
  Utensils,
  Printer,
} from 'lucide-react';
import { Order, Expense } from '../../types';
import {
  getPopularProductsStats,
  getPopularFlavoursStats,
  getPopularSaucesStats,
  getPopularExtrasStats,
} from '../../lib/restaurantStore';
import { formatPKR } from '../../lib/pricing';

interface AdminReportsTabProps {
  orders: Order[];
  expenses: Expense[];
}

export const AdminReportsTab: React.FC<AdminReportsTabProps> = ({ orders, expenses }) => {
  const [reportType, setReportType] = useState<
    'sales_orders' | 'product_perf' | 'flavours_perf' | 'sauces_perf' | 'channel_split'
  >('sales_orders');

  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('month');

  // Dynamic ranking from actual order data
  const popularProducts = getPopularProductsStats();
  const popularFlavours = getPopularFlavoursStats();
  const popularSauces = getPopularSaucesStats();
  const popularExtras = getPopularExtrasStats();

  const totalSales = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + o.grandTotal, 0);

  const totalOrders = orders.length;
  const takeawayCount = orders.filter((o) => o.orderType === 'takeaway').length;
  const deliveryCount = orders.filter((o) => o.orderType === 'delivery').length;

  const takeawaySales = orders
    .filter((o) => o.orderType === 'takeaway' && o.status !== 'cancelled')
    .reduce((s, o) => s + o.grandTotal, 0);

  const deliverySales = orders
    .filter((o) => o.orderType === 'delivery' && o.status !== 'cancelled')
    .reduce((s, o) => s + o.grandTotal, 0);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'sales_orders') {
      csvContent += 'OrderNumber,Date,Customer,Type,Status,GrandTotal\n';
      orders.forEach((o) => {
        csvContent += `${o.orderNumber},"${o.createdAt}","${o.customer.name}",${o.orderType},${o.status},${o.grandTotal}\n`;
      });
    } else if (reportType === 'flavours_perf') {
      csvContent += 'FlavourName,OrdersCount,EstimatedRevenue\n';
      popularFlavours.forEach((f) => {
        csvContent += `"${f.name}",${f.count},${f.revenue}\n`;
      });
    } else if (reportType === 'sauces_perf') {
      csvContent += 'SauceName,OrdersCount,EstimatedRevenue\n';
      popularSauces.forEach((s) => {
        csvContent += `"${s.name}",${s.count},${s.revenue}\n`;
      });
    } else {
      csvContent += 'ItemName,QuantitySold,TotalRevenue\n';
      popularProducts.forEach((p) => {
        csvContent += `"${p.name}",${p.count},${p.revenue}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fryway_report_${reportType}_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
            Analytics & Operations Reports
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Verified performance reports, ranking metrics, and CSV export for Fryway Bahria Town.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Filter */}
          <div className="flex items-center bg-neutral-100/80 p-1 rounded-xl border border-neutral-200 text-xs">
            {(['today', 'week', 'month', 'all'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDateRange(d)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  dateRange === d
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {d === 'all' ? 'All Time' : d}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Categories Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'sales_orders', label: 'Sales & Channel Report', icon: BarChart3 },
          { id: 'product_perf', label: 'Portion Performance', icon: Utensils },
          { id: 'flavours_perf', label: '17 Flavours Popularity', icon: Flame },
          { id: 'sauces_perf', label: '13 Sauces Popularity', icon: Droplets },
          { id: 'channel_split', label: 'Takeaway vs Delivery Split', icon: Store },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = reportType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-sm font-extrabold'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. SALES & ORDERS REPORT */}
      {reportType === 'sales_orders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs space-y-1">
              <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                Total Gross Sales
              </span>
              <div className="text-2xl font-black text-neutral-900">{formatPKR(totalSales)}</div>
              <span className="text-[11px] text-emerald-800 font-semibold">
                Across {totalOrders} total recorded orders
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs space-y-1">
              <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                Takeaway Counter Sales
              </span>
              <div className="text-2xl font-black text-neutral-900">{formatPKR(takeawaySales)}</div>
              <span className="text-[11px] text-neutral-500 font-semibold">
                {takeawayCount} counter pickup tickets
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs space-y-1">
              <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                Home Delivery Sales
              </span>
              <div className="text-2xl font-black text-neutral-900">{formatPKR(deliverySales)}</div>
              <span className="text-[11px] text-neutral-500 font-semibold">
                {deliveryCount} Bahria Town home deliveries
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-neutral-100 font-bold text-xs text-neutral-700">
              Recent Orders Audit Log
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-500 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-4">Ticket</th>
                    <th className="py-2.5 px-4">Time</th>
                    <th className="py-2.5 px-4">Channel</th>
                    <th className="py-2.5 px-4">Customer</th>
                    <th className="py-2.5 px-4">Total</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {orders.slice(0, 10).map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-50/50">
                      <td className="py-2.5 px-4 font-bold font-mono">#{o.orderNumber}</td>
                      <td className="py-2.5 px-4 text-neutral-500">{o.createdAt}</td>
                      <td className="py-2.5 px-4 uppercase text-[10px] font-bold">{o.orderType}</td>
                      <td className="py-2.5 px-4 font-semibold">{o.customer.name}</td>
                      <td className="py-2.5 px-4 font-black">{formatPKR(o.grandTotal)}</td>
                      <td className="py-2.5 px-4 capitalize text-emerald-900 font-bold">
                        {o.status.replace(/_/g, ' ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCT PORTION BREAKDOWN */}
      {reportType === 'product_perf' && (
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
            Most Ordered Fries Portions & Extras
          </h3>
          <p className="text-xs text-neutral-500">
            Calculated from all customer and counter orders. Ranked by total quantity prepared.
          </p>

          <div className="space-y-3 pt-2">
            {popularProducts.map((p, idx) => (
              <div
                key={p.name}
                className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-800 text-white font-black text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-black text-neutral-900 text-sm block">{p.name}</span>
                    <span className="text-[11px] text-neutral-500 font-medium">
                      {p.count} portions sold
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-emerald-900 block">
                    {formatPKR(p.revenue)}
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                    Gross Volume
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. 17 FLAVOURS RANKING */}
      {reportType === 'flavours_perf' && (
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
            17 Seasoning Flavours Ranking
          </h3>
          <p className="text-xs text-neutral-500">
            Ranked by customer requests in order tickets (Tikka, Mexican, Pizza, Butter Garlic, etc.).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {popularFlavours.map((flav, idx) => (
              <div
                key={flav.name}
                className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-amber-500 text-neutral-950 font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-neutral-900 text-xs truncate max-w-[140px]">
                    {flav.name}
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-800">
                  {flav.count} orders
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. 13 SAUCES RANKING */}
      {reportType === 'sauces_perf' && (
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
            13 Gourmet Sauces Popularity
          </h3>
          <p className="text-xs text-neutral-500">
            Ranked by requests in order configurations and extra dipping cup add-ons.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {popularSauces.map((sauce, idx) => (
              <div
                key={sauce.name}
                className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-neutral-900 text-xs truncate max-w-[140px]">
                    {sauce.name}
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-800">
                  {sauce.count} dips
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CHANNEL COMPARISON */}
      {reportType === 'channel_split' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-neutral-900 text-base">Takeaway Counter</h4>
                <p className="text-xs text-neutral-500">Counter walk-ins & tablet pickup orders</p>
              </div>
            </div>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500">Total Orders:</span>
                <span className="font-bold text-neutral-900">{takeawayCount} orders</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500">Total Volume:</span>
                <span className="font-bold text-emerald-900 text-sm">
                  {formatPKR(takeawaySales)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-500">Average Ticket:</span>
                <span className="font-bold text-neutral-900">
                  {takeawayCount > 0 ? formatPKR(Math.round(takeawaySales / takeawayCount)) : 'Rs 0'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-neutral-900 text-base">Home Delivery</h4>
                <p className="text-xs text-neutral-500">Bahria Town Lahore door-to-door dispatch</p>
              </div>
            </div>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500">Total Orders:</span>
                <span className="font-bold text-neutral-900">{deliveryCount} orders</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-500">Total Volume:</span>
                <span className="font-bold text-emerald-900 text-sm">
                  {formatPKR(deliverySales)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-500">Average Ticket:</span>
                <span className="font-bold text-neutral-900">
                  {deliveryCount > 0 ? formatPKR(Math.round(deliverySales / deliveryCount)) : 'Rs 0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
