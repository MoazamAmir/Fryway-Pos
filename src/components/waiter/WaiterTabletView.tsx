import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tablet,
  ChefHat,
  Bell,
  CheckCircle2,
  Clock,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  Search,
  User,
  LogOut,
  Flame,
  Droplets,
  ArrowRight,
  ShieldCheck,
  Send,
  Coffee,
  Check,
  Volume2,
} from 'lucide-react';
import {
  Order,
  CartItem,
  FriesSize,
  FriesStyle,
  FlavourItem,
  SauceItem,
  SelectedExtra,
  WaiterStaff,
} from '../../types';
import {
  WAITER_STAFF,
  DINE_IN_TABLES,
  getOrders,
  addOrder,
  updateOrderStatus,
  getWaiterNotifications,
  markNotificationRead,
  getMenuItems,
} from '../../lib/restaurantStore';
import {
  FLAVOURS,
  SAUCES,
  EXTRAS,
  SIZE_PRICING,
} from '../../data/menuData';
import { calculateItemPrice, formatPKR } from '../../lib/pricing';
import { audioAlerts } from '../../lib/audioAlerts';

interface WaiterTabletViewProps {
  onExitMode: () => void;
}

export const WaiterTabletView: React.FC<WaiterTabletViewProps> = ({ onExitMode }) => {
  // Current logged in waiter
  const [selectedStaff, setSelectedStaff] = useState<WaiterStaff>(() => {
    const savedId = localStorage.getItem('fryway_active_waiter_id');
    return WAITER_STAFF.find((s) => s.id === savedId) || WAITER_STAFF[0];
  });

  // Selected Table
  const [selectedTable, setSelectedTable] = useState<string>('Table 1');

  // Customer name on table (optional)
  const [customerName, setCustomerName] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');

  // Tablet ordering state
  const [activeSize, setActiveSize] = useState<FriesSize>('medium');
  const [activeStyle, setActiveStyle] = useState<FriesStyle>('masala_sauce');
  const [selectedFlavour, setSelectedFlavour] = useState<FlavourItem>(FLAVOURS[0]);
  const [selectedSauce, setSelectedSauce] = useState<SauceItem>(SAUCES[0]);
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtra[]>([]);
  const [itemQty, setItemQty] = useState<number>(1);

  // Table Ticket Cart
  const [ticketItems, setTicketItems] = useState<CartItem[]>([]);

  // Active Orders for this waiter
  const [allOrders, setAllOrders] = useState<Order[]>(() => getOrders());
  const [activeTab, setActiveTab] = useState<'create_order' | 'active_tables'>('create_order');

  // Notifications
  const [notifications, setNotifications] = useState(() => getWaiterNotifications());
  const [unreadModalNotif, setUnreadModalNotif] = useState<any | null>(null);
  const [flavourFilter, setFlavourFilter] = useState<'all' | 'spicy' | 'cheesy' | 'tangy' | 'savory' | 'herbal'>('all');

  // Real-time synchronization
  useEffect(() => {
    const refreshData = () => {
      setAllOrders(getOrders());
      const notifs = getWaiterNotifications();
      setNotifications(notifs);

      // Check if there is a new unread notification for this waiter
      const forMe = notifs.filter((n) => n.waiterId === selectedStaff.id && !n.read);
      if (forMe.length > 0) {
        setUnreadModalNotif(forMe[0]);
      }
    };

    window.addEventListener('fryway_order_update', refreshData);
    window.addEventListener('fryway_notification_update', refreshData);

    return () => {
      window.removeEventListener('fryway_order_update', refreshData);
      window.removeEventListener('fryway_notification_update', refreshData);
    };
  }, [selectedStaff.id]);

  const handleSwitchStaff = (staff: WaiterStaff) => {
    setSelectedStaff(staff);
    localStorage.setItem('fryway_active_waiter_id', staff.id);
  };

  // Price for current item in builder
  const currentItemPrice = calculateItemPrice(
    activeSize,
    activeStyle,
    selectedFlavour,
    selectedSauce,
    selectedExtras
  );

  // Extra quantity adjustment
  const handleToggleExtra = (extraId: string, name: string, price: number) => {
    setSelectedExtras((prev) => {
      const idx = prev.findIndex((e) => e.extraId === extraId);
      if (idx > -1) {
        return prev.filter((e) => e.extraId !== extraId);
      }
      return [...prev, { extraId, name, price, quantity: 1 }];
    });
  };

  // Add constructed item to Table ticket
  const handleAddItemToTicket = () => {
    const sizeConfig = SIZE_PRICING[activeSize];
    const newItem: CartItem = {
      id: 'table_item_' + Date.now() + Math.random().toString(36).slice(2, 6),
      productId: `fries_${activeSize}`,
      name: `${sizeConfig.label}`,
      size: activeSize,
      sizeLabel: sizeConfig.label,
      style: activeStyle,
      flavour: activeStyle === 'plain' || activeStyle === 'sauce' ? undefined : selectedFlavour,
      sauce: activeStyle === 'plain' || activeStyle === 'masala' ? undefined : selectedSauce,
      extras: [...selectedExtras],
      specialInstructions: customerNotes || undefined,
      unitPrice: currentItemPrice,
      quantity: itemQty,
      totalPrice: currentItemPrice * itemQty,
      image: '',
    };

    setTicketItems((prev) => [...prev, newItem]);
    setItemQty(1);
    setSelectedExtras([]);
    audioAlerts.playSuccessTone();
  };

  const handleRemoveTicketItem = (id: string) => {
    setTicketItems((prev) => prev.filter((it) => it.id !== id));
  };

  const ticketSubtotal = ticketItems.reduce((acc, it) => acc + it.totalPrice, 0);

  // Send order directly to Kitchen KDS
  const handleSendToKitchen = () => {
    if (ticketItems.length === 0) return;

    const orderNum = `FW-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: 'ord_table_' + Date.now(),
      orderNumber: orderNum,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      placedAtTimestamp: Date.now(),
      orderType: 'dine_in',
      tableNumber: selectedTable,
      waiterId: selectedStaff.id,
      waiterName: selectedStaff.name,
      customer: {
        name: customerName || `${selectedTable} Dine-in Guest`,
        phone: 'Dine-In',
        deliveryNotes: customerNotes || undefined,
      },
      items: ticketItems,
      subtotal: ticketSubtotal,
      deliveryFee: 0,
      grandTotal: ticketSubtotal,
      paymentMethod: 'cash_at_table',
      status: 'received',
      estimatedMinutes: 15,
      statusUpdates: [
        {
          status: 'received',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Order sent to Kitchen KDS by Waiter ${selectedStaff.name}`,
        },
      ],
    };

    addOrder(newOrder);
    setTicketItems([]);
    setCustomerName('');
    setCustomerNotes('');
    setActiveTab('active_tables');
  };

  // Mark order served at table
  const handleMarkServed = (orderId: string) => {
    updateOrderStatus(orderId, 'completed', `Served to table by Waiter ${selectedStaff.name}`);
    audioAlerts.playSuccessTone();
  };

  // Filter flavours
  const filteredFlavours =
    flavourFilter === 'all'
      ? FLAVOURS
      : FLAVOURS.filter((f) => f.category === flavourFilter);

  // Waiter's table orders
  const myTableOrders = allOrders.filter(
    (o) => o.orderType === 'dine_in' && (o.waiterId === selectedStaff.id || !o.waiterId)
  );

  const unreadCount = notifications.filter((n) => n.waiterId === selectedStaff.id && !n.read).length;

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Waiter Tablet Navigation Bar */}
      <header className="bg-neutral-950 border-b border-neutral-800 px-4 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-amber-300 flex items-center justify-center font-black shadow-lg">
            <Tablet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                FRYWAY TABLET POS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 text-[10px] font-bold border border-emerald-700/50">
                Dine-In System
              </span>
            </div>
            <div className="text-xs text-neutral-400">
              Active Waiter:{' '}
              <strong className="text-white font-semibold">{selectedStaff.name}</strong> ({selectedStaff.shift})
            </div>
          </div>
        </div>

        {/* Center Tabs: Builder vs Active Orders */}
        <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('create_order')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'create_order'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Table Order Builder</span>
          </button>

          <button
            onClick={() => setActiveTab('active_tables')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 relative ${
              activeTab === 'active_tables'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Active Table Orders ({myTableOrders.length})</span>
            {unreadCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping absolute -top-1 -right-1" />
            )}
          </button>
        </div>

        {/* Waiter Switcher & Exit Button */}
        <div className="flex items-center gap-2">
          {/* Waiter Staff Selector */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
            {WAITER_STAFF.map((staff) => (
              <button
                key={staff.id}
                onClick={() => handleSwitchStaff(staff)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  selectedStaff.id === staff.id
                    ? 'bg-emerald-700 text-white'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {staff.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={onExitMode}
            className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Return to Customer Website"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Mode</span>
          </button>
        </div>
      </header>

      {/* ALERT NOTIFICATION MODAL: WHEN KITCHEN MARKS ORDER READY */}
      <AnimatePresence>
        {unreadModalNotif && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-18 inset-x-4 sm:max-w-lg sm:mx-auto z-50 p-4 rounded-3xl bg-amber-400 text-neutral-950 shadow-2xl border-4 border-amber-300 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-black text-amber-300 flex items-center justify-center shrink-0 shadow-md">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                Kitchen Alert • Order Ready!
              </div>
              <h3 className="text-base font-black uppercase font-['Syne',sans-serif] leading-tight">
                {unreadModalNotif.message}
              </h3>
              <p className="text-xs text-neutral-800 mt-1">
                Please collect from the kitchen pickup counter and serve to customer table immediately.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    markNotificationRead(unreadModalNotif.id);
                    setUnreadModalNotif(null);
                    setActiveTab('active_tables');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-neutral-950 text-white hover:bg-neutral-900 text-xs font-black uppercase tracking-wider shadow-md"
                >
                  View Active Tables & Mark Served
                </button>
                <button
                  onClick={() => {
                    markNotificationRead(unreadModalNotif.id);
                    setUnreadModalNotif(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-300 hover:bg-amber-200 text-neutral-900 text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'create_order' ? (
          /* TABLET BUILDER SPLIT VIEW */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Area: Tables & Menu Options */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* 1. Select Table */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                    <Coffee className="w-4 h-4 text-amber-400" />
                    Step 1: Select Customer Table
                  </span>
                  <span className="text-[11px] text-neutral-400">Tap table to assign order</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                  {DINE_IN_TABLES.map((table) => {
                    const isSelected = selectedTable === table.name;
                    return (
                      <button
                        key={table.id}
                        onClick={() => setSelectedTable(table.name)}
                        className={`p-2.5 rounded-xl text-center border transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-emerald-800 text-white border-emerald-500 shadow-lg shadow-emerald-950/50 scale-105'
                            : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                        }`}
                      >
                        <div className="text-xs font-black uppercase leading-tight">{table.name}</div>
                        <div className="text-[9px] text-neutral-400 mt-0.5">{table.capacity} Seats</div>
                      </button>
                    );
                  })}
                </div>

                {/* Customer name & notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-neutral-800/80">
                  <input
                    type="text"
                    placeholder="Guest Name (e.g. Dr. Salman / Family)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600"
                  />
                  <input
                    type="text"
                    placeholder="Kitchen instructions (e.g. extra crispy / less spicy)"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* 2. Select Portion Size */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs font-black uppercase text-amber-300 tracking-wider block mb-3">
                  Step 2: Choose Fries Portion
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['regular', 'medium', 'large'] as FriesSize[]).map((size) => {
                    const cfg = SIZE_PRICING[size];
                    const isSelected = activeSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setActiveSize(size)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-emerald-900/60 border-emerald-500 text-white shadow-md'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black uppercase">{cfg.label}</span>
                          <span className="text-xs font-black text-amber-300">
                            From {formatPKR(cfg.prices.plain)}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400">{cfg.portionWeight}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Select Preparation Style */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs font-black uppercase text-amber-300 tracking-wider block mb-3">
                  Step 3: Preparation Style
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'plain', label: 'Plain Salted', desc: 'Light sea salt' },
                    { id: 'masala', label: 'Add Masala', desc: '+1 Seasoning powder' },
                    { id: 'sauce', label: 'Add Sauce', desc: '+1 Signature sauce' },
                    { id: 'masala_sauce', label: 'Masala & Sauce', desc: 'Fully loaded combo' },
                  ].map((style) => {
                    const isSelected = activeStyle === style.id;
                    const price = SIZE_PRICING[activeSize].prices[style.id as FriesStyle];
                    return (
                      <button
                        key={style.id}
                        onClick={() => setActiveStyle(style.id as FriesStyle)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-emerald-800 text-white border-emerald-400 shadow-md'
                            : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="text-xs font-black uppercase">{style.label}</div>
                        <div className="text-[10px] text-neutral-400">{style.desc}</div>
                        <div className="text-xs font-bold text-amber-300 mt-1">{formatPKR(price)}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Seasoning Flavours (if applicable) */}
              {(activeStyle === 'masala' || activeStyle === 'masala_sauce') && (
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400" />
                      Step 4: Select 1 Seasoning Flavour ({FLAVOURS.length} Available)
                    </span>
                    {/* Flavour filter tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1">
                      {(['all', 'spicy', 'cheesy', 'tangy', 'savory'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setFlavourFilter(cat)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                            flavourFilter === cat
                              ? 'bg-amber-400 text-neutral-950'
                              : 'bg-neutral-900 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1">
                    {filteredFlavours.map((flavour) => {
                      const isSelected = selectedFlavour.id === flavour.id;
                      return (
                        <button
                          key={flavour.id}
                          onClick={() => setSelectedFlavour(flavour)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-md font-bold'
                              : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <div className="text-xs font-bold truncate">{flavour.name}</div>
                          <div className="text-[10px] opacity-75 capitalize">{flavour.category}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. Artisan Sauces (if applicable) */}
              {(activeStyle === 'sauce' || activeStyle === 'masala_sauce') && (
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <span className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5 mb-3">
                    <Droplets className="w-4 h-4 text-amber-400" />
                    Step 5: Select Signature Gourmet Sauce ({SAUCES.length} Choices)
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-52 overflow-y-auto p-1">
                    {SAUCES.map((sauce) => {
                      const isSelected = selectedSauce.id === sauce.id;
                      return (
                        <button
                          key={sauce.id}
                          onClick={() => setSelectedSauce(sauce)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-emerald-700 text-white border-emerald-400 shadow-md font-bold'
                              : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <div className="text-xs font-bold truncate">{sauce.name}</div>
                          <div className="text-[10px] opacity-75 capitalize">{sauce.profile}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. Extras & Dips */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs font-black uppercase text-amber-300 tracking-wider block mb-2">
                  Optional: Add Extra Dipping Cups & Sachets
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {EXTRAS.map((extra) => {
                    const isSelected = selectedExtras.some((e) => e.extraId === extra.id);
                    return (
                      <button
                        key={extra.id}
                        onClick={() => handleToggleExtra(extra.id, extra.name, extra.price)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-emerald-900/60 border-emerald-500 text-white'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{extra.name}</div>
                          <div className="text-[10px] text-amber-300">+{formatPKR(extra.price)}</div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                            isSelected ? 'bg-emerald-500 text-white' : 'bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {isSelected ? '✓' : '+'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Add to Ticket Button */}
              <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1">
                    <button
                      onClick={() => setItemQty((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-black text-sm text-white">{itemQty}</span>
                    <button
                      onClick={() => setItemQty((q) => q + 1)}
                      className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold text-emerald-300">Price for this item</div>
                    <div className="text-lg font-black text-amber-300">
                      {formatPKR(currentItemPrice * itemQty)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddItemToTicket}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Item to {selectedTable} Ticket</span>
                </button>
              </div>
            </div>

            {/* Right Area: Table Ticket Summary & Send to Kitchen */}
            <div className="w-full lg:w-96 bg-neutral-950 border-t lg:border-t-0 lg:border-l border-neutral-800 p-4 sm:p-5 flex flex-col shrink-0">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                    Active Ticket
                  </span>
                  <h3 className="text-lg font-black font-['Syne',sans-serif] text-white">
                    {selectedTable}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block">Waiter</span>
                  <span className="text-xs font-bold text-white">{selectedStaff.name}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2.5 my-2">
                {ticketItems.length === 0 ? (
                  <div className="h-44 flex flex-col items-center justify-center text-center text-neutral-500">
                    <Tablet className="w-8 h-8 mb-2 opacity-40 text-emerald-400" />
                    <p className="text-xs">No items added to this ticket yet.</p>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      Select size, flavours and click "Add Item to Ticket".
                    </p>
                  </div>
                ) : (
                  ticketItems.map((it) => (
                    <div
                      key={it.id}
                      className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start justify-between gap-2"
                    >
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white">
                          {it.quantity}× {it.name}
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          {it.style.replace('_', ' & ')}
                          {it.flavour ? ` • ${it.flavour.name}` : ''}
                          {it.sauce ? ` • ${it.sauce.name}` : ''}
                        </div>
                        {it.extras.length > 0 && (
                          <div className="text-[10px] text-amber-300/90 mt-0.5">
                            +{it.extras.map((e) => e.name).join(', ')}
                          </div>
                        )}
                        <div className="text-xs font-black text-amber-300 mt-1">
                          {formatPKR(it.totalPrice)}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveTicketItem(it.id)}
                        className="text-neutral-500 hover:text-red-400 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Ticket Footer */}
              <div className="pt-3 border-t border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Items Count</span>
                  <span className="font-bold text-white">
                    {ticketItems.reduce((sum, it) => sum + it.quantity, 0)} portions
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-neutral-300">Total Due</span>
                  <span className="text-xl font-black text-amber-300 font-['Syne',sans-serif]">
                    {formatPKR(ticketSubtotal)}
                  </span>
                </div>

                {/* Direct Send to Kitchen Button */}
                <button
                  onClick={handleSendToKitchen}
                  disabled={ticketItems.length === 0}
                  className={`w-full py-3.5 rounded-xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
                    ticketItems.length > 0
                      ? 'bg-emerald-700 hover:bg-emerald-600 text-white active:scale-95 shadow-emerald-950/60 cursor-pointer'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Send Ticket Direct to Kitchen (KDS)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE TABLE ORDERS TAB FOR WAITER */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black font-['Syne',sans-serif] uppercase text-white">
                  Active Dine-In Table Orders
                </h2>
                <p className="text-xs text-neutral-400">
                  Monitor live cooking stages and receive immediate notifications when orders are packed ready.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Active Tables:</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-900 text-emerald-200 text-xs font-bold">
                  {myTableOrders.length} In Progress
                </span>
              </div>
            </div>

            {myTableOrders.length === 0 ? (
              <div className="p-12 text-center bg-neutral-950 rounded-3xl border border-neutral-800">
                <ChefHat className="w-12 h-12 mx-auto text-neutral-600 mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Active Dine-In Orders</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
                  Take the tablet to a customer table, select their fries flavours and send the ticket to the kitchen!
                </p>
                <button
                  onClick={() => setActiveTab('create_order')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Open Order Builder
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myTableOrders.map((order) => {
                  const isReady = order.status === 'ready';
                  const isPreparing = order.status === 'preparing';

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                        isReady
                          ? 'bg-amber-950/40 border-amber-400 shadow-xl shadow-amber-950/30 ring-2 ring-amber-400/50'
                          : 'bg-neutral-950 border-neutral-800'
                      }`}
                    >
                      <div>
                        {/* Header: Table & Status */}
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-neutral-800">
                          <div>
                            <span className="text-base font-black font-['Syne',sans-serif] text-white">
                              {order.tableNumber || 'Table'}
                            </span>
                            <span className="text-xs text-neutral-400 ml-2">#{order.orderNumber}</span>
                          </div>

                          <div
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                              isReady
                                ? 'bg-amber-400 text-neutral-950 animate-pulse'
                                : isPreparing
                                ? 'bg-emerald-900 text-emerald-200'
                                : 'bg-neutral-800 text-neutral-300'
                            }`}
                          >
                            {isReady && <Bell className="w-3 h-3" />}
                            <span>{order.status.replace('_', ' ')}</span>
                          </div>
                        </div>

                        {/* Guest & Waiter info */}
                        <div className="text-xs text-neutral-400 mb-3 space-y-0.5">
                          <div>
                            Guest: <strong className="text-white">{order.customer.name}</strong>
                          </div>
                          <div>
                            Waiter: <strong className="text-neutral-200">{order.waiterName}</strong> • {order.createdAt}
                          </div>
                          {order.customer.deliveryNotes && (
                            <div className="text-[11px] text-amber-300/90 italic">
                              Note: {order.customer.deliveryNotes}
                            </div>
                          )}
                        </div>

                        {/* Items list */}
                        <div className="space-y-1.5 py-2 border-t border-neutral-850">
                          {order.items.map((it) => (
                            <div key={it.id} className="text-xs flex justify-between">
                              <span className="text-neutral-300">
                                {it.quantity}× {it.name}
                                <span className="text-neutral-500 ml-1">
                                  ({it.flavour?.name || it.style})
                                </span>
                              </span>
                              <span className="font-bold text-white">{formatPKR(it.totalPrice)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom action */}
                      <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                        <div className="text-xs">
                          <span className="text-neutral-400 block text-[10px]">Total Bill</span>
                          <span className="font-black text-amber-300 text-sm">
                            {formatPKR(order.grandTotal)}
                          </span>
                        </div>

                        {isReady ? (
                          <button
                            onClick={() => handleMarkServed(order.id)}
                            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Mark Served to Table</span>
                          </button>
                        ) : (
                          <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            <span>In Kitchen Fryers</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
