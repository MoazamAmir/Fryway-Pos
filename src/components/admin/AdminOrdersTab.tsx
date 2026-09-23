import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Bike,
  Store,
  Phone,
  MapPin,
  Flame,
  PackageCheck,
  XCircle,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { Order, OrderStatus, OrderType } from '../../types';
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
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);

  const filteredOrders = orders.filter((ord) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      ord.orderNumber.toLowerCase().includes(q) ||
      ord.customer.name.toLowerCase().includes(q) ||
      ord.customer.phone.includes(q) ||
      (ord.customer.address && ord.customer.address.toLowerCase().includes(q));

    let matchesStatus = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        matchesStatus = ord.status === 'received' || ord.status === 'confirmed';
      } else {
        matchesStatus = ord.status === statusFilter;
      }
    }

    let matchesType = true;
    if (typeFilter !== 'all') {
      matchesType = ord.orderType === typeFilter;
    }

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, `Updated via Admin Console`);
    if (onOrderUpdated) onOrderUpdated();
    if (selectedOrderDetail && selectedOrderDetail.id === orderId) {
      setSelectedOrderDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
            Orders Management
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time tracking, customer dispatch, and instant status updates for Takeaway & Home Delivery orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-semibold">Total Filtered:</span>
          <span className="px-3 py-1 rounded-xl bg-emerald-800 text-white font-black text-xs shadow-xs">
            {filteredOrders.length} Orders
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # (e.g. FW-1024), customer name, phone, address..."
            className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-neutral-100/80 p-1 rounded-xl border border-neutral-200 shrink-0">
          {[
            { id: 'all', label: 'All Status' },
            { id: 'pending', label: 'Pending' },
            { id: 'preparing', label: 'Preparing' },
            { id: 'ready', label: 'Ready' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Channel Filters */}
        <div className="flex items-center gap-1.5 bg-neutral-100/80 p-1 rounded-xl border border-neutral-200 shrink-0">
          {[
            { id: 'all', label: 'All Channels' },
            { id: 'takeaway', label: 'Takeaway' },
            { id: 'delivery', label: 'Delivery' },
          ].map((tp) => (
            <button
              key={tp.id}
              onClick={() => setTypeFilter(tp.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                typeFilter === tp.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white'
              }`}
            >
              {tp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/90 text-neutral-500 font-bold border-b border-neutral-200">
                <th className="py-3 px-4 uppercase text-[10px] tracking-wider">Order</th>
                <th className="py-3 px-4 uppercase text-[10px] tracking-wider">Type</th>
                <th className="py-3 px-4 uppercase text-[10px] tracking-wider">Customer</th>
                <th className="py-3 px-4 uppercase text-[10px] tracking-wider">Items Summary</th>
                <th className="py-3 px-4 uppercase text-[10px] tracking-wider">Total</th>
                <th className="py-3 px-4 uppercase text-[10px] tracking-wider">Status</th>
                <th className="py-3 px-4 uppercase text-[10px] tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40 text-neutral-400" />
                    <span className="font-bold text-sm block text-neutral-700">No Orders Found</span>
                    <span className="text-xs text-neutral-500">
                      No matching takeaway or delivery orders match your filters.
                    </span>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isReady = order.status === 'ready';
                  const isPrep = order.status === 'preparing';
                  const isReceived = order.status === 'received' || order.status === 'confirmed';
                  const isCompleted = order.status === 'completed' || order.status === 'delivered';
                  const isCancelled = order.status === 'cancelled';

                  return (
                    <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Order Number & Placed Time */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-neutral-900 font-mono text-sm">
                          #{order.orderNumber}
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          <span>{order.createdAt}</span>
                        </div>
                      </td>

                      {/* Order Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            order.orderType === 'delivery'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {order.orderType === 'delivery' ? (
                            <>
                              <Bike className="w-3 h-3" />
                              <span>Delivery</span>
                            </>
                          ) : (
                            <>
                              <Store className="w-3 h-3" />
                              <span>Takeaway</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-900">{order.customer.name}</div>
                        <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-neutral-400" />
                          <span>{order.customer.phone}</span>
                        </div>
                        {order.customer.address && (
                          <div className="text-[11px] text-neutral-500 truncate max-w-[200px] mt-0.5" title={order.customer.address}>
                            <MapPin className="w-3 h-3 inline text-neutral-400 mr-1" />
                            {order.customer.address}
                          </div>
                        )}
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 max-w-[240px]">
                        <div className="truncate font-medium text-neutral-800">
                          {order.items
                            .map((it) => `${it.quantity}× ${it.sizeLabel || it.name}`)
                            .join(', ')}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {order.items
                            .map((it) => [it.flavour?.name, it.sauce?.name].filter(Boolean).join(' + '))
                            .filter(Boolean)
                            .join(' | ')}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-black text-neutral-900 text-sm">
                          {formatPKR(order.grandTotal)}
                        </div>
                        <div className="text-[10px] text-neutral-400 capitalize">
                          {order.paymentMethod.replace(/_/g, ' ')}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isCompleted
                              ? 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                              : isReady
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isPrep
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : isCancelled
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          }`}
                        >
                          {isPrep && <Flame className="w-3 h-3 text-amber-600" />}
                          {isReady && <PackageCheck className="w-3 h-3 text-emerald-700" />}
                          {isCompleted && <CheckCircle2 className="w-3 h-3 text-neutral-600" />}
                          {isCancelled && <XCircle className="w-3 h-3 text-rose-600" />}
                          <span>{order.status.replace(/_/g, ' ')}</span>
                        </span>
                      </td>

                      {/* Quick Status Action Controls */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrderDetail(order)}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                            title="View Full Ticket Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {isReceived && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'preparing')}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-bold text-[11px] transition-all cursor-pointer"
                            >
                              Prep
                            </button>
                          )}

                          {isPrep && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'ready')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] transition-all cursor-pointer"
                            >
                              Ready
                            </button>
                          )}

                          {isReady && (
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  order.id,
                                  order.orderType === 'delivery' ? 'delivered' : 'completed'
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-black text-white font-bold text-[11px] transition-all cursor-pointer"
                            >
                              Complete
                            </button>
                          )}

                          {!isCompleted && !isCancelled && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'cancelled')}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Cancel Order"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                  Ticket Details
                </span>
                <h3 className="text-lg font-black text-neutral-900 font-mono">
                  #{selectedOrderDetail.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Customer & Address */}
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between font-bold text-neutral-900">
                <span>{selectedOrderDetail.customer.name}</span>
                <span className="font-mono text-emerald-800">{selectedOrderDetail.customer.phone}</span>
              </div>
              {selectedOrderDetail.customer.address && (
                <div className="text-neutral-600">
                  <strong>Delivery Address:</strong> {selectedOrderDetail.customer.address}
                </div>
              )}
              {selectedOrderDetail.customer.deliveryNotes && (
                <div className="text-amber-800 bg-amber-50 p-2 rounded-lg mt-2">
                  <strong>Special Note:</strong> "{selectedOrderDetail.customer.deliveryNotes}"
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
              <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                Ordered Items
              </div>
              {selectedOrderDetail.items.map((item, i) => (
                <div key={i} className="p-3 rounded-xl border border-neutral-100 bg-white space-y-1">
                  <div className="flex justify-between font-bold text-neutral-900">
                    <span>
                      {item.quantity} × {item.name} ({item.size})
                    </span>
                    <span>{formatPKR(item.totalPrice)}</span>
                  </div>
                  {item.flavour && (
                    <div className="text-neutral-600">🌶️ Seasoning: {item.flavour.name}</div>
                  )}
                  {item.sauce && (
                    <div className="text-neutral-600">🥣 Sauce: {item.sauce.name}</div>
                  )}
                  {item.extras.length > 0 && (
                    <div className="text-neutral-500">
                      Extras: {item.extras.map((ex) => `${ex.name} (×${ex.quantity})`).join(', ')}
                    </div>
                  )}
                  {item.specialInstructions && (
                    <div className="text-amber-700 italic">"{item.specialInstructions}"</div>
                  )}
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-neutral-100 pt-3 flex justify-between items-center text-sm font-black text-neutral-900">
              <span>Grand Total</span>
              <span className="text-emerald-900 text-base font-black">
                {formatPKR(selectedOrderDetail.grandTotal)}
              </span>
            </div>

            {/* Status Switcher in Modal */}
            <div className="pt-2 flex flex-wrap gap-2 justify-end">
              {(['received', 'preparing', 'ready', 'completed', 'cancelled'] as OrderStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedOrderDetail.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      selectedOrderDetail.status === st
                        ? 'bg-emerald-800 text-white font-black'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
