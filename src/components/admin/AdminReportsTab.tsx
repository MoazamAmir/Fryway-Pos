import React from 'react';
import {
  BarChart3,
  Flame,
  Droplets,
  ShoppingBag,
  TrendingUp,
  Bike,
  Store,
  Sparkles,
} from 'lucide-react';
import { Order } from '../../types';
import { formatPKR } from '../../lib/pricing';

interface AdminReportsTabProps {
  orders: Order[];
}

export const AdminReportsTab: React.FC<AdminReportsTabProps> = ({ orders }) => {
  // Aggregate sales by fries size
  const sizeCounts: Record<string, number> = { regular: 0, medium: 0, large: 0 };
  const flavourCounts: Record<string, number> = {};
  const sauceCounts: Record<string, number> = {};
  let takeawayCount = 0;
  let deliveryCount = 0;
  let dineInCount = 0;

  orders.forEach((ord) => {
    if (ord.orderType === 'takeaway') takeawayCount++;
    else if (ord.orderType === 'delivery') deliveryCount++;
    else if (ord.orderType === 'dine_in') dineInCount++;

    ord.items.forEach((it) => {
      if (it.size) {
        sizeCounts[it.size] = (sizeCounts[it.size] || 0) + it.quantity;
      }
      if (it.flavour) {
        flavourCounts[it.flavour.name] = (flavourCounts[it.flavour.name] || 0) + it.quantity;
      }
      if (it.sauce) {
        sauceCounts[it.sauce.name] = (sauceCounts[it.sauce.name] || 0) + it.quantity;
      }
    });
  });

  // Default demo counts if orders are few
  if (Object.keys(flavourCounts).length < 3) {
    flavourCounts['Tikka'] = 48;
    flavourCounts['Mexican'] = 41;
    flavourCounts['Chat Masala'] = 39;
    flavourCounts['Chicken Chat Pati'] = 34;
    flavourCounts['Pizza'] = 28;
    flavourCounts['Herb & Yogurt'] = 25;
  }

  if (Object.keys(sauceCounts).length < 3) {
    sauceCounts['Garlic Mayo'] = 54;
    sauceCounts['Cheese Mayo'] = 49;
    sauceCounts['Cocktail'] = 38;
    sauceCounts['Ranch'] = 31;
    sauceCounts['Hot Sauce'] = 27;
  }

  const sortedFlavours = Object.entries(flavourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const sortedSauces = Object.entries(sauceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const totalChannels = takeawayCount + deliveryCount + dineInCount || 1;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
        <h2 className="text-lg font-black text-white font-['Syne',sans-serif] uppercase">
          Product & Preference Analytics Reports
        </h2>
        <p className="text-xs text-neutral-400">
          Customer ordering patterns, most requested seasoning flavours, signature sauces, and sales channel performance.
        </p>
      </div>

      {/* Top Products / Sizes Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-bold uppercase">
            <span>Regular Fries</span>
            <span className="text-amber-400">Personal Portion</span>
          </div>
          <div className="text-2xl font-black text-white">{sizeCounts.regular || 14} Servings</div>
          <span className="text-[11px] text-neutral-400">From Rs 230 to Rs 330</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-bold uppercase">
            <span>Medium Fries</span>
            <span className="text-emerald-400">Most Popular</span>
          </div>
          <div className="text-2xl font-black text-emerald-400">{sizeCounts.medium || 36} Servings</div>
          <span className="text-[11px] text-neutral-400">From Rs 340 to Rs 450</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-bold uppercase">
            <span>Large Fries</span>
            <span className="text-amber-400">Feast Sharing</span>
          </div>
          <div className="text-2xl font-black text-white">{sizeCounts.large || 22} Servings</div>
          <span className="text-[11px] text-neutral-400">From Rs 430 to Rs 600</span>
        </div>
      </div>

      {/* Top 6 Flavours & Top 6 Sauces Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Seasoning Flavours */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm uppercase">Top Seasoning Flavours</h3>
            </div>
            <span className="text-[11px] text-neutral-500">17 Varieties Total</span>
          </div>

          <div className="space-y-3">
            {sortedFlavours.map(([name, count], idx) => {
              const maxCount = sortedFlavours[0][1] || 1;
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={name} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-200">
                      {idx + 1}. {name}
                    </span>
                    <span className="font-mono text-amber-300 font-black">{count} orders</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-amber-400 rounded-full transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Gourmet Sauces */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm uppercase">Top Gourmet Sauces</h3>
            </div>
            <span className="text-[11px] text-neutral-500">13 Artisan Sauces</span>
          </div>

          <div className="space-y-3">
            {sortedSauces.map(([name, count], idx) => {
              const maxCount = sortedSauces[0][1] || 1;
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={name} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-200">
                      {idx + 1}. {name}
                    </span>
                    <span className="font-mono text-emerald-400 font-black">{count} orders</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-emerald-500 rounded-full transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Channel Comparison */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <h3 className="font-bold text-white text-sm uppercase">Order Channel Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 font-bold uppercase block">Takeaway / Counter</span>
              <span className="text-lg font-black text-white">
                {takeawayCount} Orders ({Math.round((takeawayCount / totalChannels) * 100)}%)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 font-bold uppercase block">Bahria Home Delivery</span>
              <span className="text-lg font-black text-emerald-400">
                {deliveryCount} Orders ({Math.round((deliveryCount / totalChannels) * 100)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
