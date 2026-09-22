import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Bike, Store, Sparkles } from 'lucide-react';
import { CartItem, OrderType } from '../../types';
import { calculateCartSubtotal, calculateDeliveryFee, calculateGrandTotal, formatPKR } from '../../lib/pricing';
import { RESTAURANT_INFO } from '../../data/menuData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  orderType,
  onChangeOrderType,
  onProceedToCheckout,
}) => {
  const subtotal = calculateCartSubtotal(items);
  const deliveryFee = calculateDeliveryFee(orderType, subtotal);
  const grandTotal = calculateGrandTotal(subtotal, deliveryFee);

  const freeDeliveryRemaining = RESTAURANT_INFO.freeDeliveryThreshold - subtotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-neutral-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black font-['Syne',sans-serif] uppercase text-neutral-900 text-lg">
                    YOUR FRYWAY CART
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-semibold">
                    {items.length} {items.length === 1 ? 'item' : 'items'} selected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="text-[11px] font-bold text-neutral-400 hover:text-red-600 transition-colors px-2 py-1"
                  >
                    Clear All
                  </button>
                )}
                <button
                  id="cart-drawer-close-btn"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-all focus:outline-none"
                  aria-label="Close cart"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Order Mode Switcher */}
            <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 shrink-0">
              <div className="flex bg-white p-1 rounded-2xl border border-emerald-200/80 shadow-xs">
                <button
                  id="cart-order-type-delivery"
                  onClick={() => onChangeOrderType('delivery')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                    orderType === 'delivery'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>Home Delivery</span>
                </button>
                <button
                  id="cart-order-type-takeaway"
                  onClick={() => onChangeOrderType('takeaway')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                    orderType === 'takeaway'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Takeaway</span>
                </button>
              </div>

              {orderType === 'delivery' && (
                <div className="mt-2 text-[11px] text-emerald-900 text-center font-medium">
                  {freeDeliveryRemaining > 0 ? (
                    <span>
                      Add <strong>{formatPKR(freeDeliveryRemaining)}</strong> more for{' '}
                      <strong>FREE Delivery</strong> in Bahria Town!
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Free delivery applied on your order!
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-neutral-100">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 opacity-60" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-base">Your Cart is Empty</h4>
                    <p className="text-xs text-neutral-500 max-w-xs mt-1">
                      Looks like you haven't added any fresh hand-cut fries yet. Pick your favorite size and loaded toppings!
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                  >
                    Browse Menu Now
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-black uppercase text-neutral-900 leading-tight">
                          {item.name}
                        </h4>
                        <div className="text-xs font-semibold text-emerald-800 capitalize mt-0.5">
                          {item.style.replace('_', ' & ')}
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Modifiers Pill tags */}
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      {item.flavour && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
                          Spice: {item.flavour.name}
                        </span>
                      )}
                      {item.sauce && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold">
                          Sauce: {item.sauce.name}
                        </span>
                      )}
                      {item.extras.map((extra, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200"
                        >
                          +{extra.quantity}× {extra.name}
                        </span>
                      ))}
                    </div>

                    {item.specialInstructions && (
                      <div className="text-[11px] text-neutral-500 italic bg-neutral-50 p-2 rounded-lg">
                        "{item.specialInstructions}"
                      </div>
                    )}

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center bg-neutral-100 rounded-xl p-1 border border-neutral-200">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-neutral-700 shadow-2xs hover:bg-neutral-50 active:scale-95"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-2xs hover:bg-emerald-900 active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-neutral-900">
                          {formatPKR(item.totalPrice)}
                        </span>
                        <span className="text-[10px] text-neutral-400 block">
                          {formatPKR(item.unitPrice)} each
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Calculation and Checkout Action */}
            {items.length > 0 && (
              <div className="p-5 border-t border-neutral-200 bg-neutral-50 space-y-3 shrink-0">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal:</span>
                    <span className="font-bold text-neutral-900">{formatPKR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Delivery Fee ({orderType === 'takeaway' ? 'Takeaway Pickup' : 'Bahria Town'}):</span>
                    <span className="font-bold text-emerald-900">
                      {deliveryFee === 0 ? 'FREE' : formatPKR(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>Grand Total:</span>
                    <span className="text-emerald-900">{formatPKR(grandTotal)}</span>
                  </div>
                </div>

                <button
                  id="cart-proceed-checkout-btn"
                  onClick={onProceedToCheckout}
                  className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 active:scale-98 transition-all"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
