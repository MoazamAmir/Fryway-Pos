import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  X,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Sparkles,
  Bike,
  Store,
  RefreshCw,
  Flame,
  ChefHat,
  PackageCheck,
  Timer,
  AlertCircle,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatPKR } from '../../lib/pricing';
import { RESTAURANT_INFO } from '../../data/menuData';
import { updateOrderStatus, getOrders } from '../../lib/restaurantStore';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  order,
  onClose,
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(order);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    if (!order) return 20 * 60;
    const est = (order.estimatedMinutes || (order.orderType === 'delivery' ? 30 : 18)) * 60;
    const elapsed = Math.floor((Date.now() - (order.placedAtTimestamp || Date.now())) / 1000);
    return Math.max(0, est - elapsed);
  });

  // Sync order when it changes
  useEffect(() => {
    if (!order) return;
    setCurrentOrder(order);

    const est = (order.estimatedMinutes || (order.orderType === 'delivery' ? 30 : 18)) * 60;
    const elapsed = Math.floor((Date.now() - (order.placedAtTimestamp || Date.now())) / 1000);
    setSecondsRemaining(Math.max(0, est - elapsed));

    const handleUpdate = () => {
      const all = getOrders();
      const match = all.find((o) => o.id === order.id);
      if (match) {
        setCurrentOrder(match);
      }
    };

    window.addEventListener('fryway_order_update', handleUpdate);
    return () => window.removeEventListener('fryway_order_update', handleUpdate);
  }, [order]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Live countdown timer ticking every second
  useEffect(() => {
    if (!isOpen || !currentOrder || currentOrder.status === 'delivered' || currentOrder.status === 'completed') {
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, currentOrder?.status]);

  if (!isOpen || !order || !currentOrder) return null;

  const totalEstSeconds = (currentOrder.estimatedMinutes || (currentOrder.orderType === 'delivery' ? 30 : 18)) * 60;
  const timeElapsedSeconds = Math.max(0, totalEstSeconds - secondsRemaining);
  const progressPercent = Math.min(100, Math.max(8, Math.round((timeElapsedSeconds / totalEstSeconds) * 100)));

  // Delivery status steps vs Takeaway vs Dine-in
  const deliverySteps: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
    { status: 'received', label: 'Order Confirmed', desc: 'Order received by Fryway kitchen system', icon: Clock },
    { status: 'preparing', label: 'Hand-Cutting & Double Frying', desc: 'Fresh potatoes cut and frying at 180°C', icon: Flame },
    { status: 'ready', label: 'Seasoned & Packed Hot', desc: 'Tossed in seasoning and sealed in thermal box', icon: PackageCheck },
    { status: 'out_for_delivery', label: 'Rider on the Way', desc: 'Bike dispatched across Bahria Town', icon: Bike },
    { status: 'delivered', label: 'Delivered', desc: 'Delivered to your door. Enjoy hot & crispy!', icon: CheckCircle2 },
  ];

  const takeawaySteps: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
    { status: 'received', label: 'Order Confirmed', desc: 'Kitchen received your takeaway ticket', icon: Clock },
    { status: 'preparing', label: 'Fresh Frying', desc: 'Sizzling hot in our signature double-fryers', icon: Flame },
    { status: 'ready', label: 'Ready for Counter Pickup', desc: 'Packed hot and waiting at pickup counter', icon: Store },
    { status: 'completed', label: 'Picked Up', desc: 'Collected at counter. Have a wonderful meal!', icon: CheckCircle2 },
  ];

  const dineInSteps: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
    { status: 'received', label: 'Table Order Sent', desc: `Sent by ${currentOrder.waiterName || 'Waiter'} to Kitchen`, icon: Clock },
    { status: 'preparing', label: 'Frying Sizzle', desc: 'Double-frying and seasoning in wok', icon: Flame },
    { status: 'ready', label: 'Fresh at Counter', desc: `Ready for ${currentOrder.waiterName || 'Waiter'} table service`, icon: ChefHat },
    { status: 'completed', label: 'Served at Table', desc: `Served at ${currentOrder.tableNumber || 'Table'}. Enjoy!`, icon: CheckCircle2 },
  ];

  const activeSteps =
    currentOrder.orderType === 'delivery'
      ? deliverySteps
      : currentOrder.orderType === 'dine_in'
      ? dineInSteps
      : takeawaySteps;

  const currentStepIndex = activeSteps.findIndex((s) => s.status === currentOrder.status);

  // Time format helper
  const minutesDisplay = Math.floor(secondsRemaining / 60);
  const secondsDisplay = secondsRemaining % 60;
  const formattedCountdown = `${String(minutesDisplay).padStart(2, '0')}:${String(secondsDisplay).padStart(2, '0')}`;

  // Interactive fast-forward simulation so owner/user can demo all stages
  const handleAdvanceStatus = () => {
    const nextIndex = (currentStepIndex + 1) % activeSteps.length;
    const nextStatus = activeSteps[nextIndex].status;
    const updated = updateOrderStatus(currentOrder.id, nextStatus, `Simulated status transition to ${nextStatus}`);
    if (updated) {
      setCurrentOrder(updated);
      if (nextStatus === 'delivered' || nextStatus === 'completed') {
        setSecondsRemaining(0);
      } else {
        // adjust time remaining downwards
        setSecondsRemaining((prev) => Math.max(60, Math.floor(prev * 0.5)));
      }
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Fryway! Inquiring about my Order #${currentOrder.orderNumber} (${currentOrder.customer.name}).`
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-6 flex flex-col max-h-[95vh] border border-neutral-200"
        >
          {/* Top Success Header */}
          <div className="p-6 sm:p-8 bg-emerald-950 text-white text-center relative shrink-0">
            <button
              id="order-modal-close-icon-btn"
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/30 text-white flex items-center justify-center transition-all focus:outline-none cursor-pointer"
              aria-label="Close order tracker"
              title="Close modal"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-emerald-800 text-amber-300 border-2 border-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-lg"
            >
              <CheckCircle2 className="w-9 h-9 text-amber-300 stroke-[2.5]" />
            </motion.div>

            <span className="text-xs font-black uppercase text-amber-300 tracking-widest block mb-1">
              Order Confirmed & Logged
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] uppercase tracking-tight text-white mb-3 leading-snug sm:leading-tight break-words max-w-lg mx-auto">
              THANK YOU FOR CHOOSING FRYWAY!
            </h2>
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/90 border border-emerald-700 text-xs font-bold text-emerald-100">
              <span>Order Reference:</span>
              <span className="font-extrabold text-amber-300 tracking-wider">
                #{currentOrder.orderNumber}
              </span>
              <span className="ml-1 bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wide">
                {currentOrder.orderType === 'delivery' ? 'Home Delivery' : 'Takeaway Counter'}
              </span>
            </div>
          </div>

          {/* Scrollable Tracker Body */}
          <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1">
            {/* LIVE DYNAMIC COUNTDOWN & PROGRESS BAR */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-neutral-950 text-white shadow-xl relative overflow-hidden">
              {/* Background ambient glow */}
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-300 flex items-center gap-1.5 mb-1">
                    <Timer className="w-4 h-4 animate-pulse text-amber-400" />
                    Live Estimated Time Remaining
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight text-white flex items-baseline gap-2">
                    <span>{formattedCountdown}</span>
                    <span className="text-xs font-semibold text-emerald-300 uppercase tracking-normal font-sans">
                      minutes left
                    </span>
                  </div>
                </div>

                <div className="text-center sm:text-right bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 block">Current Status</span>
                  <span className="text-xs sm:text-sm font-black text-amber-300 capitalize">
                    {currentOrder.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Progress Bar & Percentage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-200">
                  <span>Preparation & Dispatch Progress</span>
                  <span className="text-amber-300 font-extrabold">{progressPercent}%</span>
                </div>
                <div className="w-full h-3.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-emerald-300/80 font-medium pt-0.5">
                  <span>Kitchen Fryers</span>
                  <span>Hot Packaging</span>
                  <span>{currentOrder.orderType === 'delivery' ? 'Bahria Rider' : 'Pickup Desk'}</span>
                </div>
              </div>
            </div>

            {/* Live Order Status Stepper */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-950 tracking-wider">
                  <Clock className="w-4 h-4 text-emerald-800" />
                  <span>Real-Time Stage Timeline</span>
                </div>
                {/* Fast-Forward Simulation Control */}
                <button
                  onClick={handleAdvanceStatus}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 bg-white hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs transition-all active:scale-95"
                  title="Simulate advancing to next order status"
                >
                  <RefreshCw className="w-3 h-3 text-emerald-700" />
                  <span>Simulate Next Stage</span>
                </button>
              </div>

              {/* Steps timeline */}
              <div className="space-y-4">
                {activeSteps.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.status} className="flex items-start gap-3">
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-emerald-800 text-amber-300 ring-4 ring-emerald-200 scale-110 shadow-md'
                              : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-neutral-200 text-neutral-400'
                          }`}
                        >
                          <StepIcon className="w-3.5 h-3.5" />
                        </div>
                        {idx < activeSteps.length - 1 && (
                          <div
                            className={`w-0.5 h-8 mt-1 transition-colors ${
                              idx < currentStepIndex ? 'bg-emerald-600' : 'bg-neutral-200'
                            }`}
                          />
                        )}
                      </div>

                      <div className="flex-1 pt-0.5">
                        <div
                          className={`text-xs sm:text-sm font-bold flex items-center gap-2 ${
                            isCurrent
                              ? 'text-emerald-950 font-black'
                              : isDone
                              ? 'text-neutral-800'
                              : 'text-neutral-400'
                          }`}
                        >
                          <span>{step.label}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-pulse">
                              In Progress
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-500">{step.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details Breakdown */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2">
                  {currentOrder.orderType === 'delivery' ? (
                    <Bike className="w-5 h-5 text-emerald-800" />
                  ) : currentOrder.orderType === 'dine_in' ? (
                    <ChefHat className="w-5 h-5 text-emerald-800" />
                  ) : (
                    <Store className="w-5 h-5 text-emerald-800" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-neutral-900 capitalize block">
                      {currentOrder.orderType === 'delivery'
                        ? 'Home Delivery'
                        : currentOrder.orderType === 'dine_in'
                        ? `Dine-in (${currentOrder.tableNumber || 'Table'})`
                        : 'Takeaway Counter Pickup'}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Payment:{' '}
                      {currentOrder.paymentMethod === 'cash_on_delivery'
                        ? 'Cash on Delivery'
                        : currentOrder.paymentMethod === 'cash_at_table'
                        ? 'Pay at Table'
                        : 'Cash at Counter'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-neutral-400 block">Total Amount</span>
                  <span className="text-base font-black text-emerald-900">
                    {formatPKR(currentOrder.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Customer info */}
              <div className="text-xs space-y-1 text-neutral-700">
                <div>
                  <strong>Customer:</strong> {currentOrder.customer.name} ({currentOrder.customer.phone})
                </div>
                {currentOrder.customer.address && (
                  <div>
                    <strong>Delivery Address:</strong> {currentOrder.customer.address}
                  </div>
                )}
                {currentOrder.customer.deliveryNotes && (
                  <div>
                    <strong>Notes:</strong> {currentOrder.customer.deliveryNotes}
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="pt-2 border-t border-neutral-200 space-y-2">
                <div className="text-[11px] font-bold uppercase text-neutral-400">Items Ordered</div>
                {currentOrder.items.map((it) => (
                  <div key={it.id} className="text-xs flex justify-between">
                    <div>
                      <span className="font-bold text-neutral-900">
                        {it.quantity}× {it.name}
                      </span>
                      <span className="text-neutral-500 ml-1">
                        ({it.style.replace('_', ' & ')}
                        {it.flavour ? ` • ${it.flavour.name}` : ''}
                        {it.sauce ? ` • ${it.sauce.name}` : ''})
                      </span>
                    </div>
                    <span className="font-bold text-neutral-900">{formatPKR(it.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 text-xs font-bold transition-all active:scale-95 shadow-2xs"
              >
                <Phone className="w-4 h-4 text-emerald-800" />
                <span>Call Kitchen ({RESTAURANT_INFO.phoneDisplay})</span>
              </a>

              <a
                href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all active:scale-95 shadow-md shadow-emerald-950/10"
              >
                <MessageSquare className="w-4 h-4 text-amber-300" />
                <span>WhatsApp Fryway Support</span>
              </a>
            </div>
          </div>

          {/* Footer Close */}
          <div className="p-4 bg-neutral-100 border-t border-neutral-200 text-center shrink-0">
            <button
              id="order-modal-close-footer-btn"
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm hover:shadow"
            >
              Close & Keep Tracking in Background
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
