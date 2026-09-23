import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Sparkles,
  Bike,
  Store,
  Timer,
  ChefHat,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { OrderType, AppRole } from '../../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
  onNavigateToSection: (sectionId: string) => void;
  onRequestRoleChange: (role: AppRole) => void;
  onOpenOrderTracker?: () => void;
  hasActiveOrder?: boolean;
  isStoreOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  orderType,
  onChangeOrderType,
  onNavigateToSection,
  onRequestRoleChange,
  onOpenOrderTracker,
  hasActiveOrder,
  isStoreOpen = true,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', target: 'hero' },
    { label: 'Menu', target: 'menu' },
    { label: 'Flavours & Sauces', target: 'flavours-sauces' },
    { label: 'Why Fryway', target: 'why-fryway' },
    { label: 'About', target: 'about' },
    { label: 'Contact', target: 'contact' },
  ];

  const handleNavClick = (target: string) => {
    onNavigateToSection(target);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-emerald-950/5 border-b border-emerald-100 py-2 sm:py-2.5'
            : 'bg-white/90 backdrop-blur-sm border-b border-emerald-100/60 py-3 sm:py-3.5'
        }`}
      >
        <div className="w-full px-3.5 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo & Brand at the start (Left) - Guaranteed Zero Cutoff */}
          <div className="flex items-center justify-start shrink-0">
            <button
              id="header-logo-btn"
              onClick={() => handleNavClick('hero')}
              className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-xl cursor-pointer transition-transform hover:scale-[1.02] p-1 -m-1"
              aria-label="Fryway Home"
            >
              <BrandLogo size="md" />
            </button>
          </div>

          {/* Desktop Navigation Links in the dead center */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1 max-w-2xl mx-auto">
            {navLinks.map((link) => (
              <button
                key={link.target}
                id={`nav-link-${link.target}`}
                onClick={() => handleNavClick(link.target)}
                className="px-3 xl:px-3.5 py-1.5 rounded-full text-xs font-bold text-neutral-600 hover:text-emerald-950 hover:bg-emerald-50/90 transition-all uppercase tracking-wider cursor-pointer whitespace-nowrap hover:-translate-y-0.5"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions at the end (Right): Status + Mode Switcher + Tracker + Cart + CTA */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
            {/* Store Status Indicator pill if closed */}
            {!isStoreOpen && (
              <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>1:00 PM – 2:00 AM</span>
              </span>
            )}

            {/* Live Order Tracker Trigger (if active order) */}
            {hasActiveOrder && onOpenOrderTracker && (
              <button
                onClick={onOpenOrderTracker}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black uppercase tracking-wider shadow-xs transition-all active:scale-95 animate-pulse cursor-pointer"
                title="View live order progress and countdown"
              >
                <Timer className="w-3.5 h-3.5 text-neutral-950 stroke-[2.5]" />
                <span>Track Order</span>
              </button>
            )}

            {/* Order Mode Switcher (Takeaway / Delivery) - visible on tablet & desktop */}
            <div className="hidden md:flex items-center bg-emerald-50/90 p-0.5 rounded-full border border-emerald-200/70 shadow-2xs">
              <button
                id="header-mode-delivery"
                onClick={() => onChangeOrderType('delivery')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/50'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Delivery</span>
              </button>
              <button
                id="header-mode-takeaway"
                onClick={() => onChangeOrderType('takeaway')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  orderType === 'takeaway'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/50'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Takeaway</span>
              </button>
            </div>

            {/* Cart Trigger */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition-all border border-emerald-200/80 active:scale-95 focus:outline-none cursor-pointer group shadow-sm shrink-0 hover:-translate-y-0.5"
              aria-label={`View Cart, ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-emerald-800 group-hover:scale-105 transition-transform" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-emerald-800 text-white text-[11px] font-black shadow-sm ring-2 ring-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Order Now CTA (Desktop) */}
            <button
              id="header-order-now-btn"
              onClick={() => handleNavClick('menu')}
              className="hidden lg:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs sm:text-sm font-black shadow-md shadow-emerald-950/15 hover:shadow-emerald-950/25 transition-all active:scale-95 focus:outline-none cursor-pointer tracking-wide shrink-0 hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Order Now</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="header-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/70 transition-colors focus:outline-none cursor-pointer shadow-2xs shrink-0"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-950" /> : <MenuIcon className="w-5 h-5 text-emerald-950" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu with Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/30 backdrop-blur-xs lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 top-[65px] z-35 bg-white/98 backdrop-blur-xl border-b border-emerald-100 shadow-2xl lg:hidden max-h-[85vh] overflow-y-auto px-5 py-6 rounded-b-3xl"
            >
              {/* Store Status banner if closed */}
              {!isStoreOpen && (
                <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold text-center">
                  Fryway is currently closed. Opening daily from 1:00 PM – 2:00 AM.
                </div>
              )}

              {/* Active Order Tracker on Mobile */}
              {hasActiveOrder && onOpenOrderTracker && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOrderTracker();
                  }}
                  className="mb-4 w-full py-2.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer animate-pulse"
                >
                  <Timer className="w-4 h-4 text-neutral-950 stroke-[2.5]" />
                  <span>Track Live Order In Progress</span>
                </button>
              )}

              {/* Order Mode Toggle on Mobile */}
              <div className="mb-5 p-1 bg-emerald-50 rounded-2xl flex border border-emerald-200/70">
                <button
                  onClick={() => onChangeOrderType('delivery')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    orderType === 'delivery'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-emerald-900'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>Home Delivery</span>
                </button>
                <button
                  onClick={() => onChangeOrderType('takeaway')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    orderType === 'takeaway'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-emerald-900'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Takeaway</span>
                </button>
              </div>

              {/* Navigation links */}
              <div className="flex flex-col gap-1 mb-5">
                {navLinks.map((link) => (
                  <button
                    key={link.target}
                    onClick={() => handleNavClick(link.target)}
                    className="flex items-center justify-between py-3 px-3 rounded-xl text-sm font-bold text-neutral-800 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left cursor-pointer"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-emerald-700" />
                  </button>
                ))}
              </div>

              {/* Order now button */}
              <button
                onClick={() => handleNavClick('menu')}
                className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm shadow-md shadow-emerald-950/15 flex items-center justify-center gap-2 cursor-pointer mb-5 tracking-wide"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Explore Full Menu & Order</span>
              </button>

              {/* Authorized Staff Portals */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span className="font-semibold">Staff Access:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onRequestRoleChange('kitchen');
                    }}
                    className="flex items-center gap-1.5 font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 cursor-pointer"
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Kitchen KDS</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onRequestRoleChange('admin');
                    }}
                    className="flex items-center gap-1.5 font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Portal</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

