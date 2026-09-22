import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Phone,
  MapPin,
  Sparkles,
  Bike,
  Store,
  Timer,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { OrderType, AppRole } from '../../types';
import { RESTAURANT_INFO } from '../../data/menuData';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
  onNavigateToSection: (sectionId: string) => void;
  onRequestRoleChange: (role: AppRole) => void;
  onOpenOrderTracker?: () => void;
  hasActiveOrder?: boolean;
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
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
            ? 'bg-white/95 backdrop-blur-md shadow-sm shadow-emerald-950/5 border-b border-emerald-100 py-2.5'
            : 'bg-white/90 backdrop-blur-sm border-b border-emerald-50/80 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <button
              id="header-logo-btn"
              onClick={() => handleNavClick('hero')}
              className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg"
              aria-label="Fryway Home"
            >
              <BrandLogo size="md" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.target}
                  id={`nav-link-${link.target}`}
                  onClick={() => handleNavClick(link.target)}
                  className="text-xs font-bold text-neutral-700 hover:text-emerald-800 transition-colors relative py-1 focus:outline-none uppercase tracking-wider"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Actions: Order Mode Pill + Staff Portal + Cart + Order Now */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Live Order Tracker Trigger (if order placed) */}
              {hasActiveOrder && onOpenOrderTracker && (
                <button
                  onClick={onOpenOrderTracker}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black uppercase tracking-wider shadow-sm transition-all active:scale-95 animate-pulse"
                  title="View live order progress and countdown"
                >
                  <Timer className="w-3.5 h-3.5 text-neutral-950 stroke-[2.5]" />
                  <span className="hidden sm:inline">Track Live Order</span>
                </button>
              )}

              {/* Order Mode Switcher (Takeaway / Delivery) */}
              <div className="hidden sm:flex items-center bg-emerald-50/90 p-1 rounded-full border border-emerald-200/60">
                <button
                  id="header-mode-delivery"
                  onClick={() => onChangeOrderType('delivery')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    orderType === 'delivery'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-emerald-900 hover:text-emerald-950'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Delivery</span>
                </button>
                <button
                  id="header-mode-takeaway"
                  onClick={() => onChangeOrderType('takeaway')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    orderType === 'takeaway'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-emerald-900 hover:text-emerald-950'
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
                className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition-all border border-emerald-200/80 active:scale-95 focus:outline-none"
                aria-label={`View Cart, ${cartCount} items`}
              >
                <ShoppingBag className="w-5 h-5 text-emerald-800" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-emerald-800 text-white text-[11px] font-bold shadow-sm"
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
                className="hidden md:inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-900/15 hover:shadow-emerald-900/25 transition-all active:scale-95 focus:outline-none"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Order Now</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                id="header-mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors focus:outline-none"
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[65px] z-30 bg-white border-b border-emerald-100 shadow-xl lg:hidden max-h-[85vh] overflow-y-auto px-6 py-6"
          >
            {/* Order Mode Toggle on Mobile */}
            <div className="mb-6 p-1.5 bg-emerald-50 rounded-2xl flex border border-emerald-200/70">
              <button
                onClick={() => onChangeOrderType('delivery')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  orderType === 'delivery'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-emerald-900'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>Home Delivery</span>
              </button>
              <button
                onClick={() => onChangeOrderType('takeaway')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  orderType === 'takeaway'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-emerald-900'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Takeaway</span>
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col gap-3 mb-6">
              {navLinks.map((link) => (
                <button
                  key={link.target}
                  onClick={() => handleNavClick(link.target)}
                  className="flex items-center justify-between py-2.5 text-base font-semibold text-neutral-800 hover:text-emerald-800 border-b border-neutral-100 text-left"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-emerald-800 font-bold">→</span>
                </button>
              ))}
            </div>

            {/* Order now button */}
            <button
              onClick={() => handleNavClick('menu')}
              className="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Explore Full Menu & Order</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
