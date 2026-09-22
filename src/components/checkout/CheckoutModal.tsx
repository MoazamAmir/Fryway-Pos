import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, ShieldCheck, MapPin, Phone, User, Store, Bike, AlertCircle, Banknote } from 'lucide-react';
import { CartItem, Order, OrderType } from '../../types';
import { calculateCartSubtotal, calculateDeliveryFee, calculateGrandTotal, formatPKR } from '../../lib/pricing';
import { RESTAURANT_INFO } from '../../data/menuData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
  onSubmitOrder: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  onChangeOrderType,
  onSubmitOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = calculateCartSubtotal(items);
  const deliveryFee = calculateDeliveryFee(orderType, subtotal);
  const grandTotal = calculateGrandTotal(subtotal, deliveryFee);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!customerName.trim()) {
      errs.name = 'Please enter your full name.';
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please provide a valid Pakistani phone number (e.g. 0312-4424505).';
    }

    if (orderType === 'delivery' && (!deliveryAddress.trim() || deliveryAddress.trim().length < 8)) {
      errs.address = 'Please specify your full Bahria Town delivery address (Sector, Street, House No).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Generate readable random order reference #FW-XXXX
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `FW-${randomNum}`;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      placedAtTimestamp: Date.now(),
      orderType,
      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        address: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
        deliveryNotes: deliveryNotes.trim() || undefined,
      },
      items: [...items],
      subtotal,
      deliveryFee,
      grandTotal,
      paymentMethod: orderType === 'delivery' ? 'cash_on_delivery' : 'cash_on_pickup',
      status: 'received',
      estimatedMinutes: orderType === 'delivery' ? 30 : 18,
      statusUpdates: [
        {
          status: 'received',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: 'Order placed and sent to Fryway kitchen',
        },
      ],
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitOrder(newOrder);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-6 bg-emerald-950 text-white flex items-center justify-between shrink-0">
            <div>
              <span className="text-xs font-extrabold uppercase text-amber-300 tracking-wider">
                Fast & Hot Checkout
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif] uppercase tracking-tight text-white leading-tight break-words">
                FINALIZE YOUR ORDER
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all focus:outline-none"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
            {/* Order Type Selector */}
            <div>
              <label className="text-xs font-black uppercase text-neutral-800 tracking-wider block mb-2">
                Select Order Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="checkout-select-delivery"
                  onClick={() => onChangeOrderType('delivery')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                    orderType === 'delivery'
                      ? 'border-emerald-800 bg-emerald-50/80 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      orderType === 'delivery' ? 'bg-emerald-800 text-white' : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">Home Delivery</div>
                    <div className="text-[11px] text-neutral-500">Bahria Town Lahore (30-40 mins)</div>
                  </div>
                </button>

                <button
                  type="button"
                  id="checkout-select-takeaway"
                  onClick={() => onChangeOrderType('takeaway')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                    orderType === 'takeaway'
                      ? 'border-emerald-800 bg-emerald-50/80 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      orderType === 'takeaway' ? 'bg-emerald-800 text-white' : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">Takeaway Pickup</div>
                    <div className="text-[11px] text-neutral-500">Ready in 15-20 mins</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <label className="text-xs font-black uppercase text-neutral-800 tracking-wider block">
                Contact Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="checkout-customer-name"
                      type="text"
                      placeholder="Your Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-neutral-50/50 ${
                        errors.name ? 'border-red-400 bg-red-50/30' : 'border-neutral-200'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-[11px] text-red-600 mt-1 font-semibold">{errors.name}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="checkout-customer-phone"
                      type="tel"
                      placeholder="Phone (e.g. 0312-4424505) *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-neutral-50/50 ${
                        errors.phone ? 'border-red-400 bg-red-50/30' : 'border-neutral-200'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-red-600 mt-1 font-semibold">{errors.phone}</p>}
                </div>
              </div>

              {/* Delivery Address (only if Home Delivery) */}
              {orderType === 'delivery' && (
                <div className="space-y-2">
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-4" />
                    <textarea
                      id="checkout-delivery-address"
                      rows={2}
                      placeholder="House No, Street, Sector / Block, Bahria Town Lahore *"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-neutral-50/50 ${
                        errors.address ? 'border-red-400 bg-red-50/30' : 'border-neutral-200'
                      }`}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-[11px] text-red-600 font-semibold">{errors.address}</p>
                  )}
                </div>
              )}

              {/* Delivery Notes */}
              <div>
                <input
                  id="checkout-delivery-notes"
                  type="text"
                  placeholder="Order or Delivery notes (e.g., Gate code, ring bell, extra tissues)..."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-neutral-50/50"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-xs font-black uppercase text-neutral-800 tracking-wider block mb-2">
                Payment Method
              </label>
              <div className="p-4 rounded-2xl border-2 border-emerald-800 bg-emerald-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">
                      {orderType === 'delivery' ? 'Cash on Delivery (COD)' : 'Cash at Counter Pickup'}
                    </div>
                    <div className="text-[11px] text-neutral-500">Pay safely upon receiving your fresh order</div>
                  </div>
                </div>
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              </div>
            </div>

            {/* Order Summary Box */}
            <div className="p-4 rounded-2xl bg-neutral-100 border border-neutral-200 space-y-2 text-xs">
              <div className="font-bold text-neutral-900 text-xs uppercase tracking-wider mb-1">
                Order Items ({items.length})
              </div>
              {items.map((it) => (
                <div key={it.id} className="flex justify-between text-neutral-700">
                  <span>
                    {it.quantity}× {it.name} ({it.style.replace('_', ' & ')})
                  </span>
                  <span className="font-bold text-neutral-900">{formatPKR(it.totalPrice)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-neutral-200 space-y-1">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-neutral-900">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Fee:</span>
                  <span className="font-bold text-emerald-900">
                    {deliveryFee === 0 ? 'FREE' : formatPKR(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-neutral-900 pt-1 border-t border-neutral-300">
                  <span>Grand Total to Pay:</span>
                  <span className="text-emerald-900 text-base">{formatPKR(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              id="checkout-submit-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-bold text-base shadow-xl shadow-emerald-950/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Placing Order with Kitchen...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                  <span>CONFIRM ORDER ({formatPKR(grandTotal)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
