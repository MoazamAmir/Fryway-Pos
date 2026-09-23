import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChefHat,
  Flame,
  CheckCircle2,
  Clock,
  Bell,
  Volume2,
  VolumeX,
  LogOut,
  Bike,
  Store,
  AlertCircle,
  PackageCheck,
  Search,
  Maximize2,
  Minimize2,
  Columns3,
  LayoutGrid,
  Check,
  Printer,
  PlusCircle,
  Phone,
  MapPin,
  Power,
  RotateCcw,
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  History,
  Timer,
  UtensilsCrossed,
  Filter,
  Receipt,
  X,
  Calendar,
  DollarSign,
  Tag,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import {
  getOrders,
  updateOrderStatus,
  addOrder,
  getBusinessSettings,
  updateBusinessSettings,
} from '../../lib/restaurantStore';
import { BrandLogo } from '../common/BrandLogo';
import { audioAlerts } from '../../lib/audioAlerts';
import { formatPKR } from '../../lib/pricing';

interface KitchenDisplaySystemProps {
  onExitMode: () => void;
}

export const KitchenDisplaySystem: React.FC<KitchenDisplaySystemProps> = ({ onExitMode }) => {
  const [orders, setOrders] = useState<Order[]>(() => getOrders());
  const [businessSettings, setBusinessSettings] = useState(() => getBusinessSettings());
  const [isKitchenOpen, setIsKitchenOpen] = useState(() => businessSettings.isOpen);

  // PRIMARY TABS: 'pending' (Active Frying Queue) vs 'completed' (Completed Orders List)
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  // Filters & display preferences
  const [filterType, setFilterType] = useState<'all' | 'takeaway' | 'delivery'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [viewMode, setViewMode] = useState<'columns' | 'grid'>('columns');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ticketToPrint, setTicketToPrint] = useState<Order | null>(null);

  // Live real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Listen to order store changes
  useEffect(() => {
    const handleOrderUpdate = () => {
      setOrders(getOrders());
    };
    window.addEventListener('fryway_order_update', handleOrderUpdate);
    return () => window.removeEventListener('fryway_order_update', handleOrderUpdate);
  }, []);

  // Listen to business settings changes
  useEffect(() => {
    const handleSettingsUpdate = () => {
      const s = getBusinessSettings();
      setBusinessSettings(s);
      setIsKitchenOpen(s.isOpen);
    };
    window.addEventListener('fryway_settings_update', handleSettingsUpdate);
    return () => window.removeEventListener('fryway_settings_update', handleSettingsUpdate);
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(!isFullscreen);
    }
  };

  // Toggle Kitchen Status (OPEN / PAUSED)
  const handleToggleKitchenStatus = () => {
    const nextStatus = !isKitchenOpen;
    setIsKitchenOpen(nextStatus);
    updateBusinessSettings({ isOpen: nextStatus });
    if (soundEnabled) {
      if (nextStatus) {
        audioAlerts.playOrderReadyBell();
      } else {
        audioAlerts.playSuccessTone();
      }
    }
  };

  // Kitchen Quick Actions
  const handleStartPreparing = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing', 'Fresh double-frying started at fryer station');
    if (soundEnabled) audioAlerts.playSuccessTone();
  };

  const handleMarkReady = (order: Order) => {
    updateOrderStatus(
      order.id,
      'ready',
      order.orderType === 'delivery'
        ? 'Packed piping hot in thermal box for Bahria Town rider'
        : 'Packed piping hot and placed at takeaway pickup counter'
    );
    if (soundEnabled) audioAlerts.playOrderReadyBell();
  };

  const handleCompleteOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'completed', 'Order handed over successfully to customer / rider');
    if (soundEnabled) audioAlerts.playSuccessTone();
  };

  // Recall / Reopen accidentally completed order back to pending
  const handleRecallOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing', 'Recalled back to active kitchen frying queue');
    if (soundEnabled) audioAlerts.playOrderReadyBell();
  };

  // Inject a mock test ticket for kitchen testing
  const handleSimulateTestOrder = () => {
    const randomOrderNumber = Math.floor(1000 + Math.random() * 9000);
    const isDelivery = Math.random() > 0.4;
    const flavours = [
      { id: 'tikka', name: 'Tikka BBQ', description: 'Smokey spices', category: 'spicy' as const, heatLevel: 2 as const },
      { id: 'cheddar', name: 'Cheddar Cheese', description: 'Real melted cheddar', category: 'cheesy' as const, heatLevel: 0 as const },
      { id: 'peri', name: 'Peri Peri', description: 'Zesty chili burst', category: 'spicy' as const, heatLevel: 3 as const },
      { id: 'sour_cream', name: 'Sour Cream & Onion', description: 'Herbed savory cream', category: 'savory' as const, heatLevel: 0 as const },
    ];
    const sauces = [
      { id: 'garlic_mayo', name: 'Garlic Mayo', description: 'Creamy roasted garlic', profile: 'creamy' as const, heatLevel: 0 as const },
      { id: 'fryway_sig', name: 'Fryway Signature Sauce', description: 'House secret blend', profile: 'tangy' as const, heatLevel: 1 as const },
      { id: 'chipotle', name: 'Chipotle Aioli', description: 'Smokey chipotle pepper', profile: 'smokey' as const, heatLevel: 2 as const },
    ];
    const selectedFlavour = flavours[Math.floor(Math.random() * flavours.length)];
    const selectedSauce = sauces[Math.floor(Math.random() * sauces.length)];
    const sizes = ['regular', 'medium', 'large'] as const;
    const selectedSize = sizes[Math.floor(Math.random() * sizes.length)];
    const prices = { regular: 330, medium: 450, large: 600 };

    const mockOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: `FW-${randomOrderNumber}`,
      items: [
        {
          id: `item_${Date.now()}_1`,
          productId: `fries_${selectedSize}`,
          name: `${selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1)} Hand-Cut Fries`,
          size: selectedSize,
          sizeLabel: `${selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1)} Fries`,
          style: 'masala_sauce',
          flavour: selectedFlavour,
          sauce: selectedSauce,
          extras: [
            { extraId: 'extra_dip', name: 'Extra Dip (Cheese Mayo)', price: 80, quantity: 1 },
          ],
          specialInstructions: Math.random() > 0.5 ? 'Make it extra crisp and golden!' : undefined,
          unitPrice: prices[selectedSize],
          quantity: Math.floor(1 + Math.random() * 2),
          totalPrice: prices[selectedSize],
          image: '',
        },
      ],
      orderType: isDelivery ? 'delivery' : 'takeaway',
      subtotal: prices[selectedSize],
      deliveryFee: isDelivery ? 120 : 0,
      grandTotal: prices[selectedSize] + (isDelivery ? 120 : 0),
      paymentMethod: isDelivery ? 'cash_on_delivery' : 'cash_on_pickup',
      estimatedMinutes: 15,
      customer: {
        name: isDelivery ? 'Zainab Qureshi' : 'Bilal Akhtar',
        phone: '0312-4455667',
        address: isDelivery ? 'House #42, Sector C, Jasmine Block, Bahria Town' : undefined,
        deliveryNotes: isDelivery ? 'Please call upon reaching security barrier gate.' : undefined,
      },
      status: 'received',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      placedAtTimestamp: Date.now(),
      statusUpdates: [
        {
          status: 'received',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: 'Ticket printed to kitchen frying line',
        },
      ],
    };

    addOrder(mockOrder);
    if (soundEnabled) audioAlerts.playNewOrderChime();
  };

  // Order status segregation
  const newOrders = useMemo(
    () => orders.filter((o) => o.status === 'received' || o.status === 'confirmed'),
    [orders]
  );
  const preparingOrders = useMemo(
    () => orders.filter((o) => o.status === 'preparing'),
    [orders]
  );
  const readyOrders = useMemo(
    () => orders.filter((o) => o.status === 'ready'),
    [orders]
  );
  const completedOrders = useMemo(
    () =>
      orders
        .filter((o) => o.status === 'completed' || o.status === 'delivered')
        .sort((a, b) => (b.placedAtTimestamp || 0) - (a.placedAtTimestamp || 0)),
    [orders]
  );

  // Filter orders by channel and search query
  const filterList = (list: Order[]) => {
    return list.filter((o) => {
      const matchesType = filterType === 'all' || o.orderType === filterType;
      const matchesSearch =
        !searchQuery ||
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.customer.phone && o.customer.phone.includes(searchQuery));
      return matchesType && matchesSearch;
    });
  };

  const filteredNew = filterList(newOrders);
  const filteredPreparing = filterList(preparingOrders);
  const filteredReady = filterList(readyOrders);
  const filteredCompleted = filterList(completedOrders);

  // Total counts
  const allPendingFiltered = [...filteredNew, ...filteredPreparing, ...filteredReady];
  const totalPendingCount = newOrders.length + preparingOrders.length + readyOrders.length;
  const totalCompletedCount = completedOrders.length;

  // Real-time Aggregated Fry Basket Summary (Chefs' fry queue helper)
  const fryBasketSummary = useMemo(() => {
    const summary = { regular: 0, medium: 0, large: 0 };
    [...newOrders, ...preparingOrders].forEach((order) => {
      order.items.forEach((item) => {
        if (item.size === 'regular') summary.regular += item.quantity;
        else if (item.size === 'medium') summary.medium += item.quantity;
        else if (item.size === 'large') summary.large += item.quantity;
      });
    });
    return summary;
  }, [newOrders, preparingOrders]);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Calculate elapsed time formatted (e.g. "Waiting 04:12" or "Frying 08:15")
  const getTimerDisplay = (order: Order) => {
    const start = order.placedAtTimestamp || Date.now();
    const elapsedSecs = Math.max(0, Math.floor((currentTime.getTime() - start) / 1000));
    const mins = Math.floor(elapsedSecs / 60);
    const secs = elapsedSecs % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (order.status === 'preparing') {
      return { label: `Frying ${timeStr}`, isRush: mins >= 12, mins, isWarning: mins >= 8 };
    }
    if (order.status === 'ready') {
      return { label: `Ready ${timeStr}`, isRush: false, mins, isWarning: false };
    }
    return { label: `Queued ${timeStr}`, isRush: mins >= 10, mins, isWarning: mins >= 6 };
  };

  // ----------------------------------------------------
  // Render High-Readability Aesthetic Kitchen Ticket Card (White & Green Theme)
  // ----------------------------------------------------
  const renderKitchenCard = (order: Order, isCompletedArchive = false) => {
    const timerInfo = getTimerDisplay(order);
    const isNew = order.status === 'received' || order.status === 'confirmed';
    const isPrep = order.status === 'preparing';
    const isRdy = order.status === 'ready';
    const isDone = order.status === 'completed' || order.status === 'delivered';

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: -10 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        key={order.id}
        id={`kds-card-${order.id}`}
        className={`group relative rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md ${
          isDone
            ? 'bg-neutral-50/90 border-neutral-200'
            : isRdy
            ? 'bg-white border-emerald-400 ring-2 ring-emerald-500/25 shadow-emerald-900/5'
            : isPrep
            ? timerInfo.isRush
              ? 'bg-white border-rose-500 ring-2 ring-rose-500/30 animate-pulse'
              : 'bg-white border-amber-400 ring-2 ring-amber-500/25 shadow-amber-900/5'
            : timerInfo.isRush
            ? 'bg-white border-rose-500 ring-2 ring-rose-500/40 animate-pulse'
            : 'bg-white border-emerald-200/90 hover:border-emerald-400'
        }`}
      >
        {/* Urgent Rush Top Glowing Bar */}
        {timerInfo.isRush && !isDone && (
          <div className="bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest text-center py-1 flex items-center justify-center gap-1.5 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-200" />
            <span>RUSH TICKET — {timerInfo.mins} MINS ELAPSED!</span>
          </div>
        )}

        {/* Card Header with Ticket #, Channel & Live Timer */}
        <div
          className={`p-3.5 flex items-center justify-between border-b ${
            isDone
              ? 'bg-neutral-100/90 border-neutral-200'
              : isRdy
              ? 'bg-emerald-50/90 border-emerald-200'
              : isPrep
              ? 'bg-amber-50/90 border-amber-200'
              : timerInfo.isRush
              ? 'bg-rose-50 border-rose-200'
              : 'bg-emerald-50/60 border-emerald-100'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl text-neutral-900 tracking-wider font-mono">
                #{order.orderNumber}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs ${
                  order.orderType === 'delivery'
                    ? 'bg-blue-600 text-white'
                    : 'bg-emerald-700 text-white'
                }`}
              >
                {order.orderType === 'delivery' ? (
                  <>
                    <Bike className="w-3.5 h-3.5" />
                    <span>DELIVERY</span>
                  </>
                ) : (
                  <>
                    <Store className="w-3.5 h-3.5" />
                    <span>TAKEAWAY</span>
                  </>
                )}
              </span>
            </div>

            <div className="text-[11px] text-neutral-600 flex items-center gap-2 font-medium">
              <span>Time: {order.createdAt}</span>
              <span className="text-neutral-300">•</span>
              {!isDone ? (
                <span
                  className={`font-mono font-bold flex items-center gap-1 ${
                    timerInfo.isRush
                      ? 'text-rose-700 font-black'
                      : isPrep
                      ? 'text-amber-800'
                      : 'text-emerald-800'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  {timerInfo.label}
                </span>
              ) : (
                <span className="text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Fulfilled & Handed Over
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTicketToPrint(order)}
              className="p-1.5 rounded-lg bg-white hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 transition-all cursor-pointer border border-neutral-200 active:scale-95 shadow-2xs"
              title="Print Kitchen Chit"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 shadow-xs ${
                isRdy
                  ? 'bg-emerald-600 text-white font-black'
                  : isPrep
                  ? 'bg-amber-400 text-neutral-950 font-black'
                  : isDone
                  ? 'bg-neutral-200 text-neutral-700 font-bold'
                  : 'bg-blue-600 text-white font-black'
              }`}
            >
              {isPrep && <Flame className="w-3 h-3 text-orange-950 fill-orange-950 animate-bounce" />}
              {isRdy && <PackageCheck className="w-3 h-3 text-white" />}
              <span>{order.status.replace(/_/g, ' ')}</span>
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5 flex-1 space-y-3 bg-white">
          {/* Customer & Location */}
          <div className="text-xs pb-2.5 border-b border-neutral-100 flex items-start justify-between gap-2">
            <div>
              <div className="text-neutral-900 font-black text-sm tracking-wide flex items-center gap-1.5">
                <span>{order.customer.name}</span>
              </div>
              {order.customer.phone && (
                <div className="text-[11px] text-neutral-500 font-mono mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-700" />
                  <span>{order.customer.phone}</span>
                </div>
              )}
            </div>

            {order.orderType === 'delivery' && order.customer.address && (
              <div className="text-right max-w-[55%]">
                <span className="text-[10px] uppercase font-black text-blue-700 flex items-center justify-end gap-1">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  Bahria Town
                </span>
                <span
                  className="text-[11px] text-neutral-700 block truncate font-medium"
                  title={order.customer.address}
                >
                  {order.customer.address}
                </span>
              </div>
            )}
          </div>

          {/* Items To Prepare */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-emerald-800">
              <span className="flex items-center gap-1">
                <UtensilsCrossed className="w-3 h-3 text-emerald-700" />
                Frying Line Prep ({order.items.reduce((acc, it) => acc + it.quantity, 0)} Items)
              </span>
              <span className="font-mono text-neutral-500">Total: {formatPKR(order.grandTotal)}</span>
            </div>

            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-emerald-50/30 border border-emerald-100 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-black text-neutral-900">
                  <span className="text-emerald-950 text-sm tracking-wide font-extrabold">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100/80 border border-emerald-200 text-emerald-900">
                    {item.size}
                  </span>
                </div>

                {/* Seasoning Shaker */}
                {item.flavour && (
                  <div className="text-[11px] text-amber-950 font-bold flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <span className="text-amber-700 font-extrabold">🌶️ Shake:</span>
                    <span className="text-neutral-900 font-extrabold tracking-wide">
                      {item.flavour.name}
                    </span>
                  </div>
                )}

                {/* Gourmet Sauce Dip */}
                {item.sauce && (
                  <div className="text-[11px] text-emerald-950 font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <span className="text-emerald-700 font-extrabold">🥣 Dip:</span>
                    <span className="text-neutral-900 font-extrabold tracking-wide">
                      {item.sauce.name}
                    </span>
                  </div>
                )}

                {/* Extra Add-ons */}
                {item.extras && item.extras.length > 0 && (
                  <div className="text-[11px] text-neutral-600 font-medium pl-1">
                    <span className="text-neutral-400 font-bold">Extras: </span>
                    {item.extras.map((ex) => `${ex.name} (×${ex.quantity})`).join(', ')}
                  </div>
                )}

                {/* Special Instructions Note */}
                {item.specialInstructions && (
                  <div className="text-[11px] text-amber-950 font-semibold bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>"{item.specialInstructions}"</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Delivery Special Instructions */}
          {order.customer.deliveryNotes && (
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase text-[10px] text-blue-700 block">
                  Delivery Driver Note:
                </span>
                "{order.customer.deliveryNotes}"
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex gap-2">
          {isNew && (
            <button
              id={`kds-prep-btn-${order.id}`}
              onClick={() => handleStartPreparing(order.id)}
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <Flame className="w-4 h-4 text-orange-950 fill-orange-950" />
              <span>START PREPARING / DROP FRIES</span>
            </button>
          )}

          {isPrep && (
            <button
              id={`kds-ready-btn-${order.id}`}
              onClick={() => handleMarkReady(order)}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <PackageCheck className="w-4 h-4" />
              <span>MARK READY & PACK HOT</span>
            </button>
          )}

          {isRdy && (
            <button
              id={`kds-complete-btn-${order.id}`}
              onClick={() => handleCompleteOrder(order.id)}
              className="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>COMPLETE & HAND OVER</span>
            </button>
          )}

          {isDone && (
            <div className="w-full flex items-center justify-between gap-2">
              <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Completed</span>
              </div>
              <button
                onClick={() => handleRecallOrder(order.id)}
                className="py-2 px-3 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
                title="Recall this order back into active kitchen frying queue"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Recall to Pending</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-neutral-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-800 selection:text-white overflow-x-hidden">
      {/* ----------------------------------------------------
          1. MASTER KITCHEN HEADER (White & Fryway Green)
          ---------------------------------------------------- */}
      <header className="bg-white/95 border-b border-emerald-100 px-4 sm:px-6 py-3 shrink-0 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xs backdrop-blur-md">
        {/* Brand & Kitchen Station Identity */}
        <div className="flex items-center gap-3.5">
          <BrandLogo size="md" variant="dark" showTagline={false} />
          <div className="border-l border-emerald-200 pl-3.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-base sm:text-lg font-black uppercase text-emerald-950 tracking-wider flex items-center gap-2">
                <span>KITCHEN DISPLAY (KDS)</span>
              </h1>

              {/* Kitchen Open/Close Status Indicator Button */}
              <button
                id="kds-status-toggle"
                onClick={handleToggleKitchenStatus}
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 border transition-all cursor-pointer active:scale-95 shadow-2xs ${
                  isKitchenOpen
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-500/20 hover:bg-emerald-100'
                    : 'bg-rose-50 border-rose-300 text-rose-800 ring-2 ring-rose-500/20 hover:bg-rose-100'
                }`}
                title={isKitchenOpen ? 'Click to pause kitchen orders' : 'Click to resume kitchen orders'}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isKitchenOpen ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'
                  }`}
                />
                <Power className="w-3 h-3" />
                <span>{isKitchenOpen ? 'KITCHEN OPEN' : 'KITCHEN PAUSED'}</span>
              </button>
            </div>
            <div className="text-xs text-neutral-500 font-medium">
              Sector C, Bahria Town Lahore Fryer Station
            </div>
          </div>
        </div>

        {/* Live Date & Time Clock with Glowing Container */}
        <div className="hidden md:flex items-center gap-3 bg-emerald-50/70 px-4 py-2 rounded-2xl border border-emerald-200/80 shadow-2xs">
          <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
          <div className="text-left">
            <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              {formattedDate}
            </div>
            <div className="text-sm font-black text-emerald-950 font-mono tabular-nums leading-none">
              {formattedTime}
            </div>
          </div>
        </div>

        {/* Header Quick Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Mock Order Simulator for Kitchen testing */}
          <button
            onClick={handleSimulateTestOrder}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            title="Inject a realistic test order to test kitchen ticket sounds and workflow"
          >
            <PlusCircle className="w-4 h-4 text-emerald-700" />
            <span className="hidden lg:inline">+ Test Ticket</span>
          </button>

          {/* Audio Chime Toggle */}
          <button
            id="kds-sound-toggle"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) audioAlerts.playOrderReadyBell();
            }}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs ${
              soundEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-neutral-100 border-neutral-200 text-neutral-500'
            }`}
            title="Toggle kitchen sound chime"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{soundEnabled ? 'Chime ON' : 'Muted'}</span>
          </button>

          {/* Test Kitchen Bell Ring */}
          <button
            onClick={() => audioAlerts.playOrderReadyBell()}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-xs font-bold text-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Test order ready pickup bell"
          >
            <Bell className="w-4 h-4 text-amber-500" />
            <span className="hidden xl:inline">Ring Bell</span>
          </button>

          {/* Full Screen Mode */}
          <button
            onClick={toggleFullscreen}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-xs font-bold text-neutral-700 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Full Screen Kitchen Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden xl:inline">{isFullscreen ? 'Normal' : 'Full Screen'}</span>
          </button>

          {/* Exit / Lock */}
          <button
            onClick={onExitMode}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
            title="Lock Kitchen Terminal"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Lock</span>
          </button>
        </div>
      </header>

      {/* ----------------------------------------------------
          2. KITCHEN PAUSED WARNING BANNER (When Closed)
          ---------------------------------------------------- */}
      {!isKitchenOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-amber-500 text-neutral-950 px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm font-bold shadow-sm"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-neutral-950 animate-bounce shrink-0" />
            <span>
              <strong>KITCHEN IS CURRENTLY PAUSED / ORDERS ON HOLD.</strong> Fryers are at holding
              temp. Customer & counter ordering indicates kitchen pause.
            </span>
          </div>
          <button
            onClick={handleToggleKitchenStatus}
            className="px-3.5 py-1 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm shrink-0"
          >
            REOPEN KITCHEN
          </button>
        </motion.div>
      )}

      {/* ----------------------------------------------------
          3. AESTHETIC KITCHEN KPI METRICS & LIVE BASKET SUMMARY (White & Green)
          ---------------------------------------------------- */}
      <section className="bg-white/80 border-b border-emerald-100 px-4 sm:px-6 py-3.5 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 items-center">
          {/* Card 1: Total Pending */}
          <div
            onClick={() => setActiveTab('pending')}
            className={`p-3.5 rounded-2xl bg-white border flex items-center gap-3 shadow-xs hover:border-emerald-400 transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                : 'border-emerald-100/90'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block">
                Pending Queue
              </span>
              <div className="text-xl font-black text-neutral-900 font-mono">{totalPendingCount}</div>
            </div>
          </div>

          {/* Card 2: In Fryer Now */}
          <div className="p-3.5 rounded-2xl bg-white border border-emerald-100/90 flex items-center gap-3 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block">
                In Fryer Now
              </span>
              <div className="text-xl font-black text-amber-700 font-mono">
                {preparingOrders.length}
              </div>
            </div>
          </div>

          {/* Card 3: Ready for Handover */}
          <div className="p-3.5 rounded-2xl bg-white border border-emerald-100/90 flex items-center gap-3 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block">
                Ready at Counter
              </span>
              <div className="text-xl font-black text-emerald-800 font-mono">
                {readyOrders.length}
              </div>
            </div>
          </div>

          {/* Card 4: Completed Dispatched (Clickable to switch tab) */}
          <div
            onClick={() => setActiveTab('completed')}
            className={`p-3.5 rounded-2xl bg-white border flex items-center gap-3 shadow-xs hover:border-emerald-400 transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                : 'border-emerald-100/90'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block">
                Completed Today
              </span>
              <div className="text-xl font-black text-neutral-900 font-mono">{totalCompletedCount}</div>
            </div>
          </div>

          {/* Card 5 & 6: Active Fry Basket Drops (Span 2 on lg) */}
          <div className="col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-white to-amber-50/70 border border-emerald-200 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🍟</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block">
                  Active Fry Baskets To Drop
                </span>
                <span className="text-[11px] text-neutral-600">
                  Total queue volume required right now
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="px-2 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-black shadow-2xs">
                {fryBasketSummary.regular} Reg
              </span>
              <span className="px-2 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-black shadow-2xs">
                {fryBasketSummary.medium} Med
              </span>
              <span className="px-2 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-black shadow-2xs">
                {fryBasketSummary.large} Lrg
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          4. PROMINENT TABS NAVIGATION BAR (Pending vs Completed)
          ---------------------------------------------------- */}
      <div className="bg-white border-b border-emerald-100 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* The Two Main Tabs */}
        <div className="flex items-center gap-2">
          {/* TAB 1: PENDING ORDERS */}
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer shadow-xs ${
              activeTab === 'pending'
                ? 'bg-emerald-800 text-white shadow-emerald-800/25 ring-2 ring-emerald-800/20'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Timer className={`w-4 h-4 ${activeTab === 'pending' ? 'text-amber-300' : 'text-neutral-500'}`} />
            <span>PENDING ORDERS</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                activeTab === 'pending'
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-200 text-neutral-700'
              }`}
            >
              {totalPendingCount}
            </span>
          </button>

          {/* TAB 2: COMPLETED ORDERS */}
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer shadow-xs ${
              activeTab === 'completed'
                ? 'bg-emerald-800 text-white shadow-emerald-800/25 ring-2 ring-emerald-800/20'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${activeTab === 'completed' ? 'text-emerald-300' : 'text-neutral-500'}`} />
            <span>COMPLETED ORDERS</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                activeTab === 'completed'
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-200 text-neutral-700'
              }`}
            >
              {totalCompletedCount}
            </span>
          </button>
        </div>

        {/* Filters and View Controls within Current Tab */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Channel Filters */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200">
            {[
              { id: 'all', label: 'All Channels' },
              { id: 'takeaway', label: 'Takeaway' },
              { id: 'delivery', label: 'Delivery' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilterType(btn.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  filterType === btn.id
                    ? 'bg-emerald-700 text-white font-black shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle (Only on Pending tab) */}
          {activeTab === 'pending' && (
            <div className="hidden sm:flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200">
              <button
                onClick={() => setViewMode('columns')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'columns'
                    ? 'bg-emerald-700 text-white font-black shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="Kanban Columns View"
              >
                <Columns3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-emerald-700 text-white font-black shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticket # or customer..."
              className="w-full bg-neutral-50 border border-emerald-200/90 rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          5. MAIN WORKSPACE BASED ON ACTIVE TAB
          ---------------------------------------------------- */}
      <main className="flex-1 p-4 sm:p-6 overflow-hidden">
        {/* ====================================================
            TAB 1: PENDING ORDERS (Active Kitchen Pipeline)
            ==================================================== */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                <h2 className="text-sm sm:text-base font-black uppercase text-emerald-950 tracking-wider">
                  ACTIVE FRYING PIPELINE ({totalPendingCount} Pending Orders)
                </h2>
              </div>
              <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Target Turnaround: &lt;10 mins
              </span>
            </div>

            {/* Empty State for Pending */}
            {totalPendingCount === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="min-h-[420px] rounded-3xl bg-white border border-emerald-200/90 p-8 flex flex-col items-center justify-center text-center shadow-xs"
              >
                <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-700 shadow-2xs">
                  <ChefHat className="w-10 h-10" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-emerald-950 uppercase tracking-wider mb-2">
                  NO PENDING ORDERS IN KITCHEN
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-md mb-6">
                  All active takeaway and delivery orders have been fulfilled! New tickets will appear
                  automatically with chime notifications.
                </p>
                <button
                  onClick={handleSimulateTestOrder}
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider shadow-sm cursor-pointer transition-all active:scale-95"
                >
                  + Drop Simulation Ticket
                </button>
              </motion.div>
            ) : viewMode === 'columns' ? (
              /* Kanban 3-Column Pipeline */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 min-h-[500px] items-start">
                {/* Column 1: New / Received */}
                <div className="bg-white rounded-2xl border border-emerald-100 p-4 flex flex-col gap-3 min-h-[350px] shadow-xs">
                  <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 px-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="font-black uppercase tracking-wider text-xs text-neutral-900">
                        1. NEW ORDERS
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold text-xs">
                      {filteredNew.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence>
                      {filteredNew.length === 0 ? (
                        <div className="py-16 text-center text-xs text-neutral-400 italic">
                          No new incoming orders waiting
                        </div>
                      ) : (
                        filteredNew.map((order) => renderKitchenCard(order, false))
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Column 2: In Fryer / Preparing */}
                <div className="bg-white rounded-2xl border border-emerald-100 p-4 flex flex-col gap-3 min-h-[350px] shadow-xs">
                  <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 px-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      <span className="font-black uppercase tracking-wider text-xs text-neutral-900">
                        2. IN FRYER / SHAKER
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-mono font-bold text-xs">
                      {filteredPreparing.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence>
                      {filteredPreparing.length === 0 ? (
                        <div className="py-16 text-center text-xs text-neutral-400 italic">
                          No orders currently in the fryers
                        </div>
                      ) : (
                        filteredPreparing.map((order) => renderKitchenCard(order, false))
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Column 3: Ready for Handover */}
                <div className="bg-white rounded-2xl border border-emerald-100 p-4 flex flex-col gap-3 min-h-[350px] shadow-xs">
                  <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 px-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      <span className="font-black uppercase tracking-wider text-xs text-neutral-900">
                        3. READY FOR HANDOVER
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold text-xs">
                      {filteredReady.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence>
                      {filteredReady.length === 0 ? (
                        <div className="py-16 text-center text-xs text-neutral-400 italic">
                          No orders waiting on counter/pack
                        </div>
                      ) : (
                        filteredReady.map((order) => renderKitchenCard(order, false))
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ) : (
              /* Grid Mode */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                  {allPendingFiltered.map((order) => renderKitchenCard(order, false))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            TAB 2: COMPLETED ORDERS LIST (Full List & History)
            ==================================================== */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <h2 className="text-sm sm:text-base font-black uppercase text-emerald-950 tracking-wider">
                  ALL COMPLETED ORDERS ({filteredCompleted.length} Fulfilled)
                </h2>
              </div>
              <span className="text-xs text-neutral-500 font-medium">
                Fulfilled tickets can be recalled to the active queue if needed.
              </span>
            </div>

            {/* Empty State for Completed */}
            {filteredCompleted.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="min-h-[400px] rounded-3xl bg-white border border-emerald-200/90 p-8 flex flex-col items-center justify-center text-center shadow-xs"
              >
                <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-700 shadow-2xs">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-emerald-950 uppercase tracking-wider mb-2">
                  NO COMPLETED ORDERS YET
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-md mb-6">
                  When orders are prepared and marked "Complete & Hand Over", they will be archived here.
                </p>
                <button
                  onClick={() => setActiveTab('pending')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  View Pending Orders
                </button>
              </motion.div>
            ) : (
              /* Completed Orders Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                  {filteredCompleted.map((order) => renderKitchenCard(order, true))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ----------------------------------------------------
          6. PROFESSIONAL 80MM THERMAL KITCHEN CHIT MODAL
          ---------------------------------------------------- */}
      {ticketToPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-neutral-300 flex flex-col max-h-[90vh]"
          >
            {/* Modal Actions Header */}
            <div className="bg-emerald-950 text-white px-5 py-3.5 flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-amber-300" />
                <span className="font-black text-sm uppercase tracking-wider">
                  Thermal Kitchen Chit Preview (80mm)
                </span>
              </div>
              <button
                onClick={() => setTicketToPrint(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Printable Thermal Ticket Paper Area */}
            <div className="p-6 overflow-y-auto flex-1 bg-neutral-100 flex justify-center">
              <div
                id="kitchen-printable-chit"
                className="w-full max-w-[340px] bg-white p-5 rounded-lg shadow-md border border-neutral-200 text-neutral-900 font-mono text-xs leading-relaxed space-y-3 relative"
              >
                {/* Perforated Top Edge Simulation */}
                <div className="text-center font-bold text-[10px] text-neutral-400 tracking-widest uppercase mb-1">
                  - - - - - - - - - - CUT LINE - - - - - - - - - -
                </div>

                {/* Brand Header */}
                <div className="text-center pb-2 border-b-2 border-dashed border-neutral-400">
                  <div className="text-base font-black tracking-widest text-neutral-950 uppercase">
                    FRYWAY
                  </div>
                  <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">
                    Authentic Hand Cut Fries
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">
                    Sector C Commercial, Bahria Town Lahore
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    Order Tel: 0312-4424505
                  </div>
                </div>

                {/* Huge Ticket Number & Channel */}
                <div className="text-center py-1 border-b-2 border-dashed border-neutral-400">
                  <div className="text-2xl font-black tracking-tight text-neutral-950">
                    TICKET #{ticketToPrint.orderNumber}
                  </div>
                  <div className="mt-1 font-black text-xs uppercase px-2 py-1 rounded bg-neutral-900 text-white inline-block">
                    *** {ticketToPrint.orderType.toUpperCase()} ORDER ***
                  </div>
                  <div className="text-[10px] text-neutral-600 mt-1 font-medium">
                    Placed: {ticketToPrint.createdAt} • Date: {formattedDate}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="py-1 border-b border-dashed border-neutral-300 text-[11px] space-y-0.5">
                  <div className="font-black text-neutral-950">
                    Customer: {ticketToPrint.customer.name}
                  </div>
                  {ticketToPrint.customer.phone && (
                    <div className="text-neutral-700">Phone: {ticketToPrint.customer.phone}</div>
                  )}
                  {ticketToPrint.customer.address && (
                    <div className="text-neutral-700 font-semibold">
                      Address: {ticketToPrint.customer.address}
                    </div>
                  )}
                  {ticketToPrint.customer.deliveryNotes && (
                    <div className="font-bold text-red-700 bg-red-50 p-1 rounded mt-1">
                      ** Driver Note: {ticketToPrint.customer.deliveryNotes} **
                    </div>
                  )}
                </div>

                {/* Items To Prepare List */}
                <div className="py-2 border-b-2 border-dashed border-neutral-400 space-y-2.5">
                  <div className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">
                    ITEMS TO PREPARE:
                  </div>

                  {ticketToPrint.items.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline font-black text-xs text-neutral-950">
                        <span className="text-sm">
                          [{item.quantity}x] {item.name.toUpperCase()} ({item.size.toUpperCase()})
                        </span>
                        <span className="font-mono">{formatPKR(item.totalPrice)}</span>
                      </div>

                      {item.flavour && (
                        <div className="text-[11px] font-bold text-neutral-800 pl-3">
                          • SHAKER: {item.flavour.name.toUpperCase()}
                        </div>
                      )}

                      {item.sauce && (
                        <div className="text-[11px] font-bold text-neutral-800 pl-3">
                          • DIP SAUCE: {item.sauce.name.toUpperCase()}
                        </div>
                      )}

                      {item.extras && item.extras.length > 0 && (
                        <div className="text-[10px] text-neutral-600 pl-3">
                          • EXTRAS:{' '}
                          {item.extras.map((e) => `${e.name} (x${e.quantity})`).join(', ')}
                        </div>
                      )}

                      {item.specialInstructions && (
                        <div className="text-[11px] font-black text-amber-900 bg-amber-50 p-1 rounded mt-0.5 border border-amber-200">
                          *** NOTE: {item.specialInstructions} ***
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Totals & Payment Summary */}
                <div className="py-1 border-b-2 border-dashed border-neutral-400 text-xs space-y-1">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal:</span>
                    <span>{formatPKR(ticketToPrint.subtotal)}</span>
                  </div>
                  {ticketToPrint.deliveryFee > 0 && (
                    <div className="flex justify-between text-neutral-600">
                      <span>Delivery Fee:</span>
                      <span>{formatPKR(ticketToPrint.deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-base pt-1 text-neutral-950">
                    <span>GRAND TOTAL:</span>
                    <span>{formatPKR(ticketToPrint.grandTotal)}</span>
                  </div>
                  <div className="text-[10px] font-bold text-neutral-700 uppercase mt-1">
                    Payment Method:{' '}
                    <strong>{ticketToPrint.paymentMethod.replace(/_/g, ' ')}</strong>
                  </div>
                </div>

                {/* Thermal Barcode & Thank You */}
                <div className="text-center pt-2 space-y-1.5">
                  {/* Visual Barcode */}
                  <div className="font-mono text-center tracking-widest text-[9px] text-neutral-800 font-bold select-none overflow-hidden">
                    ||| | ||||| || |||||| | |||| | |||||| ||| | |||
                  </div>
                  <div className="text-[9px] text-neutral-500 tracking-wider">
                    {ticketToPrint.id.toUpperCase()}
                  </div>
                  <div className="text-[10px] font-bold text-neutral-700 uppercase">
                    *** FRESH & CRISP GUARANTEE ***
                  </div>
                  <div className="text-[9px] text-neutral-400">
                    Hand-cut fresh potatoes fried to golden perfection
                  </div>
                </div>

                {/* Perforated Bottom Edge */}
                <div className="text-center font-bold text-[10px] text-neutral-400 tracking-widest uppercase pt-2">
                  - - - - - - - - - - CUT LINE - - - - - - - - - -
                </div>
              </div>
            </div>

            {/* Modal Bottom Buttons */}
            <div className="p-4 bg-white border-t border-neutral-200 flex gap-3 no-print">
              <button
                onClick={() => setTicketToPrint(null)}
                className="flex-1 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Print Kitchen Chit</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
