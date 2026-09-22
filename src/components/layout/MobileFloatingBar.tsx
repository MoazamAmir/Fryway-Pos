import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../../types';
import { calculateCartSubtotal, formatPKR } from '../../lib/pricing';

interface MobileFloatingBarProps {
  items: CartItem[];
  onOpenCart: () => void;
}

export const MobileFloatingBar: React.FC<MobileFloatingBarProps> = ({ items, onOpenCart }) => {
  const totalCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = calculateCartSubtotal(items);

  if (totalCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-4 inset-x-4 z-30 sm:hidden"
      >
        <button
          id="mobile-floating-cart-btn"
          onClick={onOpenCart}
          className="w-full p-3.5 rounded-2xl bg-emerald-800 text-white flex items-center justify-between shadow-xl shadow-emerald-950/30 border border-emerald-700/60 active:scale-98 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-amber-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalCount}
              </span>
            </div>
            <div className="text-left">
              <div className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold">
                View Order
              </div>
              <div className="text-sm font-black text-white">{formatPKR(subtotal)}</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-black uppercase text-amber-300">
            <span>Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
