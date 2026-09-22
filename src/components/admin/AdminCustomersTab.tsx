import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  MapPin,
  ShoppingBag,
  Clock,
  ChevronRight,
  UserCheck,
  Calendar,
} from 'lucide-react';
import { CustomerSummary } from '../../lib/restaurantStore';
import { Order } from '../../types';
import { formatPKR } from '../../lib/pricing';

interface AdminCustomersTabProps {
  customers: CustomerSummary[];
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({ customers }) => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.address && c.address.toLowerCase().includes(search.toLowerCase()))
  );

  const totalRevenueFromCustomers = customers.reduce((acc, c) => acc + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
        <div>
          <h2 className="text-lg font-black text-white font-['Syne',sans-serif] uppercase">
            Customer Directory & Profiles
          </h2>
          <p className="text-xs text-neutral-400">
            Automated customer profiling tracked from live takeaway, dine-in, and Bahria Town delivery orders.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Total Clients</span>
            <span className="font-black text-white text-sm">{customers.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Lifetime Value</span>
            <span className="font-black text-emerald-400 text-sm">{formatPKR(totalRevenueFromCustomers)}</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, phone number, or delivery sector..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* Customers List & Selected Customer Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Cards Column */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800 text-neutral-400 text-xs">
              No customer records matching "{search}". Customer profiles are generated automatically when orders are placed.
            </div>
          ) : (
            filtered.map((cust) => {
              const isSelected = selectedCustomer?.phone === cust.phone;
              return (
                <div
                  key={cust.phone || cust.name}
                  onClick={() => setSelectedCustomer(cust)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 border-amber-400/80 shadow-md shadow-amber-400/10'
                      : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-black text-sm">
                        {cust.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{cust.name}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-neutral-800 text-neutral-300">
                            {cust.totalOrders} {cust.totalOrders === 1 ? 'Order' : 'Orders'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-neutral-500" />
                            {cust.phone}
                          </span>
                          {cust.address && (
                            <span className="flex items-center gap-1 line-clamp-1">
                              <MapPin className="w-3 h-3 text-neutral-500" />
                              {cust.address}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-neutral-500 uppercase font-bold block">Total Spend</span>
                      <span className="font-black text-amber-300 text-sm">{formatPKR(cust.totalSpent)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Customer Order History Sidebar */}
        <div className="lg:col-span-1">
          {selectedCustomer ? (
            <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 sticky top-24 space-y-4">
              <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
                <div>
                  <h3 className="font-bold text-white text-sm">{selectedCustomer.name}</h3>
                  <span className="text-xs text-neutral-400">{selectedCustomer.phone}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 uppercase block font-bold">Spent</span>
                  <span className="text-emerald-400 font-black text-sm">{formatPKR(selectedCustomer.totalSpent)}</span>
                </div>
              </div>

              {selectedCustomer.address && (
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-0.5">Delivery Address</span>
                  {selectedCustomer.address}
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-neutral-400 block mb-2">
                  Order History ({selectedCustomer.orders.length})
                </span>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {selectedCustomer.orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-amber-300">{ord.orderNumber}</span>
                        <span className="text-[10px] text-neutral-400 capitalize">
                          {ord.orderType.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {ord.items.map((it) => `${it.quantity}x ${it.sizeLabel}`).join(', ')}
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-neutral-900 text-[11px]">
                        <span className="text-neutral-500">
                          {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="font-bold text-white">{formatPKR(ord.grandTotal)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800/80 text-center text-xs text-neutral-500">
              Select a customer to view their delivery addresses and past orders history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
