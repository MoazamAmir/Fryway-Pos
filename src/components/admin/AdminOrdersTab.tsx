import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Bike,
  Store,
  ChefHat,
  XCircle,
  Phone,
  MapPin,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { updateOrderStatus } from '../../lib/restaurantStore';
import { formatPKR } from '../../lib/pricing';

interface AdminOrdersTabProps {
  orders: Order[];
  onOrderUpdated?: () => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({ orders, onOrderUpdated }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredOrders = orders.filter((ord) => {
    // Search filter
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      ord.orderNumber.toLowerCase().includes(q) ||
      ord.customer.name.toLowerCase().includes(q) ||
      ord.customer.phone.includes(q) ||
      (ord.customer.address && ord.customer.address.toLowerCase().includes(q));

    // Status filter
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        matchesStatus = ord.status === 'received' || ord.status === 'confirmed';
      } else {
        matchesStatus = ord.status === statusFilter;
      }
    }

    // Type filter
    let matchesType = true;
    if (typeFilter !== 'all') {
      matchesType = ord.orderType === typeFilter;
    }

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, `Updated via Admin Console`);
    if (onOrderUpdated) onOrderUpdated();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
        <div>
          <h2 className="text-lg font-black text-white font-['Syne',sans-serif] uppercase">
            Order Management & Live Queue
          </h2>
          <p className="text-xs text-neutral-400">
            Real-time tracking, customer details, and instant status progression for all counter takeaway and delivery orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Total Filtered:</span>
          <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-neutral-950 font-black text-xs">
            {filteredOrders.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # (e.g. FW-1024), customer name, phone, address..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-neutral-900 p-1 rounded-xl border border-neutral-800 shrink-0">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'preparing', label: 'Preparing' },
            { id: 'ready', label: 'Ready' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === st.id
                  ? 'bg-amber-400 text-neutral-950 font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Channel Filters */}
        <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800 shrink-0">
          {[
            { id: 'all', label: 'All Types' },
            { id: 'takeaway', label: 'Takeaway' },
            { id: 'delivery', label: 'Delivery' },
          ].map((tp) => (
            <button
              key={tp.id}
              onClick={() => setTypeFilter(tp.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                typeFilter === tp.id
                  ? 'bg-emerald-500 text-neutral-950 font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Cards Grid */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800 text-neutral-400 text-xs">
          No orders found matching the selected search query and filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOrders.map((ord) => {
            const isDelivery = ord.orderType === 'delivery';
            const isCompleted = ord.status === 'completed' || ord.status === 'delivered';
            const isCancelled = ord.status === 'cancelled';

            return (
              <div
                key={ord.id}
                className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  isCompleted
                    ? 'bg-neutral-900/50 border-neutral-800/80 opacity-80'
                    : isCancelled
                    ? 'bg-rose-950/20 border-rose-900/40 opacity-70'
                    : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 shadow-lg'
                }`}
              >
                {/* Order Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-amber-300 text-base">
                        #{ord.orderNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                          isDelivery
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {isDelivery ? <Bike className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                        {isDelivery ? 'Delivery' : 'Takeaway'}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">
                      Placed at: {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                      {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        ord.status === 'ready'
                          ? 'bg-amber-400 text-neutral-950 animate-pulse'
                          : ord.status === 'preparing'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : ord.status === 'received' || ord.status === 'confirmed'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : ord.status === 'cancelled'
                          ? 'bg-rose-900/40 text-rose-300'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-black text-white block mt-1">
                      {formatPKR(ord.grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{ord.customer.name}</span>
                    <a
                      href={`tel:${ord.customer.phone}`}
                      className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Phone className="w-3 h-3" />
                      {ord.customer.phone}
                    </a>
                  </div>
                  {ord.customer.address && (
                    <div className="text-neutral-400 text-[11px] flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-neutral-500 shrink-0 mt-0.5" />
                      <span>{ord.customer.address}</span>
                    </div>
                  )}
                  {ord.customer.deliveryNotes && (
                    <div className="text-amber-200/90 text-[10px] italic">
                      Note: "{ord.customer.deliveryNotes}"
                    </div>
                  )}
                </div>

                {/* Itemized Basket */}
                <div className="space-y-1.5 text-xs">
                  {ord.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-2 p-2 rounded-lg bg-neutral-950/60 border border-neutral-900"
                    >
                      <div>
                        <div className="font-bold text-neutral-200">
                          {item.quantity}x {item.sizeLabel}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {item.style === 'plain'
                            ? 'Plain Salted'
                            : `${item.flavour?.name || 'No Flavour'} + ${item.sauce?.name || 'No Sauce'}`}
                          {item.extras && item.extras.length > 0 && (
                            <span className="text-amber-300 ml-1">
                              • +{item.extras.map((e) => `${e.quantity}x ${e.name}`).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-neutral-300 text-xs">{formatPKR(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>

                {/* Status Progression Buttons */}
                {!isCompleted && !isCancelled && (
                  <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap gap-2">
                    {ord.status === 'received' || ord.status === 'confirmed' ? (
                      <button
                        onClick={() => handleStatusChange(ord.id, 'preparing')}
                        className="flex-1 py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all"
                      >
                        Start Preparing
                      </button>
                    ) : null}

                    {ord.status === 'preparing' ? (
                      <button
                        onClick={() => handleStatusChange(ord.id, 'ready')}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all"
                      >
                        Mark Ready For Pickup
                      </button>
                    ) : null}

                    {ord.status === 'ready' ? (
                      <button
                        onClick={() =>
                          handleStatusChange(ord.id, isDelivery ? 'delivered' : 'completed')
                        }
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all"
                      >
                        Complete Order
                      </button>
                    ) : null}

                    <button
                      onClick={() => handleStatusChange(ord.id, 'cancelled')}
                      className="py-2 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-bold text-xs transition-colors border border-rose-900/60"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
