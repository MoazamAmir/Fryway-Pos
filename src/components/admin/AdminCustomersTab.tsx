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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
            Customer Directory & Profiles
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Automated customer profiling compiled dynamically from all takeaway and Bahria Town delivery orders.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3.5 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Total Clients</span>
            <span className="font-black text-neutral-900 text-sm">{customers.length}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-800 block text-[10px] uppercase font-bold">Combined Spend</span>
            <span className="font-black text-emerald-900 text-sm">{formatPKR(totalRevenueFromCustomers)}</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, phone number, or delivery sector..."
          className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs"
        />
      </div>

      {/* Customers List & Selected Customer Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Cards Column */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-400 text-xs">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40 text-neutral-400" />
              <span className="font-bold text-neutral-700 block text-sm">No Customer Records</span>
              <span>No customer records matching "{search}". Customer profiles are generated automatically when orders are placed.</span>
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
                      ? 'bg-emerald-50/60 border-emerald-700 shadow-sm'
                      : 'bg-white border-neutral-200/90 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-sm">
                        {cust.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900 text-sm">{cust.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-neutral-100 text-neutral-700">
                            {cust.orderCount} {cust.orderCount === 1 ? 'Order' : 'Orders'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-neutral-400" />
                            {cust.phone}
                          </span>
                          {cust.address && (
                            <span className="flex items-center gap-1 line-clamp-1">
                              <MapPin className="w-3 h-3 text-neutral-400" />
                              {cust.address}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-neutral-400 uppercase font-bold block">Total Spend</span>
                      <span className="font-black text-emerald-900 text-sm">{formatPKR(cust.totalSpent)}</span>
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
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs sticky top-24 space-y-4">
              <div className="flex items-start justify-between border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">{selectedCustomer.name}</h3>
                  <span className="text-xs text-neutral-500 font-mono">{selectedCustomer.phone}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 uppercase block font-bold">Spent</span>
                  <span className="text-emerald-900 font-black text-sm">{formatPKR(selectedCustomer.totalSpent)}</span>
                </div>
              </div>

              {selectedCustomer.address && (
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-0.5">Delivery Address</span>
                  {selectedCustomer.address}
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-neutral-700 block mb-2">
                  Order History ({selectedCustomer.orderHistory.length})
                </span>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {selectedCustomer.orderHistory.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-neutral-900">#{ord.orderNumber}</span>
                        <span className="text-[10px] font-bold uppercase text-emerald-800">
                          {ord.orderType}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-600">
                        {ord.items.map((it) => `${it.quantity}× ${it.sizeLabel || it.name}`).join(', ')}
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-neutral-200/80 text-[11px]">
                        <span className="text-neutral-500">{ord.createdAt}</span>
                        <span className="font-bold text-neutral-900">{formatPKR(ord.grandTotal)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 text-center text-xs text-neutral-400">
              Select a customer to inspect their delivery addresses and past order history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
