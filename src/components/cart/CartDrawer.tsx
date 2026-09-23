import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Bike, Store, Sparkles, Info, Beef, Flame } from 'lucide-react';
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
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-emerald-100"
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
                items.map((item) => {
                  const totalNutrition = item.nutrition
                    ? {
                        calories: item.nutrition.calories * item.quantity,
                        protein: item.nutrition.protein * item.quantity,
                        fat: item.nutrition.fat * item.quantity,
                        carbs: item.nutrition.carbs * item.quantity,
                        sodium: item.nutrition.sodium * item.quantity,
                      }
                    : null;

                  return (
                  <div key={item.id} className="pt-4 first:pt-0 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-20 h-20 rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-200 shrink-0 hot-food-media cart-steam">
                        {item.image ? (
                          <><img src={item.image} alt={item.name} className="w-full h-full object-cover" /><div className="steam-wisps" aria-hidden="true"><span /><span /><span /><span /></div><span className="image-sheen" /></>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-emerald-800">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-black uppercase text-neutral-900 leading-tight break-words">
                              {item.name}
                            </h4>
                            <div className="text-xs font-semibold text-emerald-800 capitalize mt-0.5">
                              {item.style.replace('_', ' & ')} - {item.sizeLabel}
                            </div>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-neutral-400 hover:text-red-500 p-1 transition-colors shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.details && item.details.length > 0 && (
                          <div className="mt-2 grid grid-cols-1 gap-1">
                            {item.details.slice(0, 2).map((detail) => (
                              <div key={detail.label} className="flex items-start gap-1.5 text-[11px] text-neutral-600">
                                <Info className="w-3 h-3 text-emerald-700 mt-0.5 shrink-0" />
                                <span><strong className="text-neutral-800">{detail.label}:</strong> {detail.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
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


                    {totalNutrition && (
                      <div className="grid grid-cols-5 gap-1.5 rounded-2xl bg-neutral-50 border border-neutral-200 p-2">
                        <div className="text-center">
                          <Flame className="w-3.5 h-3.5 mx-auto text-amber-500" />
                          <div className="text-[10px] font-black text-neutral-900">{totalNutrition.calories}</div>
                          <div className="text-[9px] uppercase text-neutral-400 font-bold">kcal</div>
                        </div>
                        <div className="text-center">
                          <Beef className="w-3.5 h-3.5 mx-auto text-emerald-700" />
                          <div className="text-[10px] font-black text-neutral-900">{totalNutrition.protein}g</div>
                          <div className="text-[9px] uppercase text-neutral-400 font-bold">protein</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] font-black text-neutral-900 mt-0.5">{totalNutrition.fat}g</div>
                          <div className="text-[9px] uppercase text-neutral-400 font-bold">fat</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] font-black text-neutral-900 mt-0.5">{totalNutrition.carbs}g</div>
                          <div className="text-[9px] uppercase text-neutral-400 font-bold">carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] font-black text-neutral-900 mt-0.5">{totalNutrition.sodium}</div>
                          <div className="text-[9px] uppercase text-neutral-400 font-bold">sodium</div>
                        </div>
                      </div>
                    )}

                    {(item.ingredients?.length || item.allergenNote) && (
                      <div className="rounded-xl bg-white border border-neutral-200 p-2.5 text-[11px] text-neutral-600 space-y-1">
                        {item.ingredients?.length ? (
                          <div><strong className="text-neutral-800">Ingredients:</strong> {item.ingredients.join(', ')}</div>
                        ) : null}
                        {item.allergenNote && (
                          <div><strong className="text-neutral-800">Allergen note:</strong> {item.allergenNote}</div>
                        )}
                      </div>
                    )}
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
                  );
                })
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







