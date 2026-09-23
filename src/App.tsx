/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, AlertTriangle } from 'lucide-react';
import { CartItem, MenuItem, Order, OrderType, AppRole, BusinessSettings } from './types';
import { MENU_PRODUCTS } from './data/menuData';
import { createOrderRecord, getActiveOrder } from './lib/supabase';
import { addOrder, getOrders, getBusinessSettings } from './lib/restaurantStore';
import { Header } from './components/layout/Header';
import { Hero } from './components/hero/Hero';
import { VideoSection } from './components/media/VideoSection';
import { MenuSection } from './components/menu/MenuSection';
import { FlavourSauceShowcase } from './components/menu/FlavourSauceShowcase';
import { WhyFryway } from './components/about/WhyFryway';
import { AboutSection } from './components/about/AboutSection';
import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/layout/Footer';
import { CustomizationModal } from './components/product/CustomizationModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderConfirmationModal } from './components/checkout/OrderConfirmationModal';
import { MobileFloatingBar } from './components/layout/MobileFloatingBar';
import { KitchenDisplaySystem } from './components/kitchen/KitchenDisplaySystem';
import { AdminPortal } from './components/admin/AdminPortal';
import { RoleAuthModal } from './components/auth/RoleAuthModal';
import { AccessRestrictedView } from './components/auth/AccessRestrictedView';

export default function App() {
  // Business settings state (Store OPEN/CLOSED, delivery fee, etc.)
  const [settings, setSettings] = useState<BusinessSettings>(() => getBusinessSettings());

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSettings(getBusinessSettings());
    };
    window.addEventListener('fryway_settings_update', handleSettingsUpdate);
    return () => window.removeEventListener('fryway_settings_update', handleSettingsUpdate);
  }, []);

  // Determine role based on URL pathname/hash
  const getRouteFromUrl = (): AppRole => {
    try {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path.includes('/kitchen') ||
        path.includes('/kinche') ||
        hash.includes('#kitchen') ||
        hash.includes('#kinche')
      )
        return 'kitchen';
      if (path.includes('/admin') || hash.includes('#admin')) return 'admin';
    } catch {}
    return 'customer';
  };

  // Current active role
  const [currentRole, setCurrentRole] = useState<AppRole>(() => getRouteFromUrl());
  const [authModalTarget, setAuthModalTarget] = useState<AppRole | null>(null);

  // Authentication states
  const [isKitchenAuthed, setIsKitchenAuthed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('fryway_auth_kitchen') === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('fryway_auth_admin') === 'true';
    } catch {
      return false;
    }
  });

  // Keep route in sync with browser URL
  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentRole(getRouteFromUrl());
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateToRole = (role: AppRole) => {
    setCurrentRole(role);
    const targetPath = role === 'customer' ? '/' : `/${role}`;
    try {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    } catch {
      window.location.hash = role === 'customer' ? '' : `#${role}`;
    }
  };

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('fryway_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Order type preference: Delivery vs Takeaway
  const [orderType, setOrderType] = useState<OrderType>('delivery');

  // Modals state
  const [customizationProduct, setCustomizationProduct] = useState<MenuItem | null>(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(() => {
    const active = getActiveOrder();
    if (active) return active;
    const all = getOrders();
    return all.length > 0 ? all[0] : null;
  });
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('fryway_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not persist cart locally', e);
    }
  }, [cartItems]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Navigation smoothly scrolls to anchor
  const handleNavigateToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const yOffset = -75;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Open customization modal
  const handleOpenCustomization = (item: MenuItem) => {
    setCustomizationProduct(item);
    setIsCustomizationOpen(true);
  };

  // Add customized item to cart
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) =>
          it.productId === item.productId &&
          it.size === item.size &&
          it.style === item.style &&
          it.flavour?.id === item.flavour?.id &&
          it.sauce?.id === item.sauce?.id &&
          it.specialInstructions === item.specialInstructions &&
          JSON.stringify(it.extras) === JSON.stringify(item.extras)
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const updatedQty = updated[existingIdx].quantity + item.quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updatedQty,
          totalPrice: updated[existingIdx].unitPrice * updatedQty,
        };
        return updated;
      }

      return [...prev, item];
    });

    showToast(`Added ${item.name} (${item.size}) to cart!`);
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? {
              ...it,
              quantity: newQty,
              totalPrice: it.unitPrice * newQty,
            }
          : it
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== itemId));
    showToast('Item removed from cart.');
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('Cart cleared.');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSubmitted = async (order: Order) => {
    await createOrderRecord(order);
    addOrder(order);
    setConfirmedOrder(order);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsConfirmationOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Role routing & Protected Access
  if (currentRole === 'kitchen') {
    if (!isKitchenAuthed) {
      return (
        <AccessRestrictedView
          portal="kitchen"
          onAuthenticate={(pin) => {
            if (pin === '5555') {
              setIsKitchenAuthed(true);
              sessionStorage.setItem('fryway_auth_kitchen', 'true');
              return true;
            }
            return false;
          }}
          onReturnHome={() => navigateToRole('customer')}
        />
      );
    }
    return (
      <KitchenDisplaySystem
        onExitMode={() => {
          setIsKitchenAuthed(false);
          sessionStorage.removeItem('fryway_auth_kitchen');
          navigateToRole('customer');
        }}
      />
    );
  }

  if (currentRole === 'admin') {
    if (!isAdminAuthed) {
      return (
        <AccessRestrictedView
          portal="admin"
          onAuthenticate={(pin) => {
            if (pin === '7777') {
              setIsAdminAuthed(true);
              sessionStorage.setItem('fryway_auth_admin', 'true');
              return true;
            }
            return false;
          }}
          onReturnHome={() => navigateToRole('customer')}
        />
      );
    }
    return (
      <AdminPortal
        onExitMode={() => {
          setIsAdminAuthed(false);
          sessionStorage.removeItem('fryway_auth_admin');
          navigateToRole('customer');
        }}
      />
    );
  }

  // Customer Mode
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-800 selection:text-white flex flex-col">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-950 text-white px-5 py-2.5 rounded-full shadow-xl border border-emerald-700/80 flex items-center gap-2.5 text-xs font-bold pointer-events-none"
          >
            <span className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center text-amber-300">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Sticky Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        orderType={orderType}
        onChangeOrderType={setOrderType}
        onNavigateToSection={handleNavigateToSection}
        onRequestRoleChange={(role) => setAuthModalTarget(role)}
        hasActiveOrder={Boolean(confirmedOrder)}
        onOpenOrderTracker={() => setIsConfirmationOpen(true)}
      />

      {/* Store Closed Banner Notice if closed by admin */}
      {!settings.isOpen && (
        <div className="bg-amber-500 text-neutral-950 px-4 py-2.5 shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm font-black sticky top-16 md:top-20 z-30">
          <AlertTriangle className="w-4 h-4 text-neutral-950 shrink-0 animate-bounce" />
          <span>Fryway Bahria Town is currently closed for new orders. Regular Hours: {settings.openingHours}</span>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Banner Section */}
        <Hero
          onOrderNow={() => {
            const defaultProduct = MENU_PRODUCTS[1]; // Medium fries
            handleOpenCustomization(defaultProduct);
          }}
          onExploreMenu={() => handleNavigateToSection('menu')}
        />

        {/* Video / Kitchen Craft Section */}
        <VideoSection />

        {/* Menu Section */}
        <MenuSection onCustomizeItem={handleOpenCustomization} />

        {/* 17 Flavours & 13 Sauces Interactive Showcase */}
        <FlavourSauceShowcase
          onSelectCustomize={() => {
            const defaultProduct = MENU_PRODUCTS[0];
            handleOpenCustomization(defaultProduct);
          }}
        />

        {/* Why Fryway Pillars */}
        <WhyFryway />

        {/* About Section */}
        <AboutSection />

        {/* Contact & Hours Section */}
        <ContactSection
          onOrderNow={() => {
            handleNavigateToSection('menu');
          }}
        />
      </main>

      {/* Footer */}
      <Footer onNavigateToSection={handleNavigateToSection} />

      {/* Mobile Sticky Floating Bar */}
      <MobileFloatingBar
        items={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Modals */}
      <CustomizationModal
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        product={customizationProduct}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        orderType={orderType}
        onChangeOrderType={setOrderType}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        orderType={orderType}
        onChangeOrderType={setOrderType}
        onSubmitOrder={handleOrderSubmitted}
      />

      <OrderConfirmationModal
        isOpen={isConfirmationOpen}
        order={confirmedOrder}
        onClose={() => setIsConfirmationOpen(false)}
      />

      {/* Role PIN Authentication Modal */}
      {authModalTarget && (
        <RoleAuthModal
          isOpen={Boolean(authModalTarget)}
          targetRole={authModalTarget}
          onClose={() => setAuthModalTarget(null)}
          onSuccessRoleChange={(role) => {
            if (role === 'kitchen') {
              setIsKitchenAuthed(true);
              sessionStorage.setItem('fryway_auth_kitchen', 'true');
            } else if (role === 'admin') {
              setIsAdminAuthed(true);
              sessionStorage.setItem('fryway_auth_admin', 'true');
            }
            navigateToRole(role);
            setAuthModalTarget(null);
          }}
        />
      )}
    </div>
  );
}
