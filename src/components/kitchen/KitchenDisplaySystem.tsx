import React, { useState, useEffect } from 'react';
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
  Timer,
  ShoppingBag,
  Sparkles,
  Printer,
  ShieldCheck,
  PlusCircle,
  Phone,
  MapPin,
  X,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import {
  getOrders,
  updateOrderStatus,
  addOrder,
} from '../../lib/restaurantStore';
import { BrandLogo } from '../common/BrandLogo';
import { audioAlerts } from '../../lib/audioAlerts';

interface KitchenDisplaySystemProps {
  onExitMode: () => void;
}

export const KitchenDisplaySystem: React.FC<KitchenDisplaySystemProps> = ({ onExitMode }) => {
  const [orders, setOrders] = useState<Order[]>(() => getOrders());
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

  // Sync with store updates
  useEffect(() => {
    const handleUpdate = () => {
      setOrders(getOrders());
    };
    window.addEventListener('fryway_order_update', handleUpdate);
    return () => window.removeEventListener('fryway_order_update', handleUpdate);
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

  // Accept incoming order -> moves to 'preparing'
  const handleStartPreparing = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing', 'Frying fresh hand-cut potatoes & shaking seasoning');
    if (soundEnabled) audioAlerts.playSuccessTone();
  };

  // Mark as ready
  const handleMarkReady = (order: Order) => {
    updateOrderStatus(
      order.id,
      'ready',
      order.orderType === 'delivery'
        ? 'Packed in thermal foil pouch & bag ready for Bahria Town rider'
        : 'Crisp & piping hot on counter tray ready for customer handover'
    );
    if (soundEnabled) audioAlerts.playOrderReadyBell();
  };

  // Mark completed
  const handleCompleteOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'completed', 'Handed over to customer / rider successfully');
    if (soundEnabled) audioAlerts.playSuccessTone();
  };

  // Simulate test order for kitchen testing
  const handleSimulateTestOrder = () => {
    const mockOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: `FW-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [
        {
          id: `item_${Date.now()}_1`,
          productId: 'prod-fries-lg',
          name: 'Hand Cut Fries',
          size: 'large',
          sizeLabel: 'Large (350g)',
          style: 'masala_sauce',
          flavour: {
            id: 'flv-tikka',
            name: 'Tikka Masala',
            description: 'Traditional smoky tikka spice blend with roasted cumin',
            category: 'spicy',
            heatLevel: 2,
            popular: true,
          },
          sauce: {
            id: 'sauce-garlic',
            name: 'Garlic Mayo Dip',
            description: 'Creamy garlic infused mayo with fresh cracked black pepper',
            profile: 'creamy',
            heatLevel: 0,
            popular: true,
          },
          extras: [
            { extraId: 'ext-dip-cheese', name: 'Cheese Mayo Dip Cup', price: 60, quantity: 1 },
          ],
          specialInstructions: 'Make it extra crisp and golden!',
          unitPrice: 480,
          quantity: 2,
          totalPrice: 1080,
          image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
        },
      ],
      orderType: Math.random() > 0.5 ? 'delivery' : 'takeaway',
      subtotal: 1080,
      deliveryFee: 150,
      grandTotal: 1230,
      paymentMethod: 'cash_on_delivery',
      estimatedMinutes: 20,
      customer: {
        name: 'Hamza Malik',
        phone: '0302-8877112',
        address: 'House #42, Sector B, Jasmine Block, Bahria Town Lahore',
        deliveryNotes: 'Ring bell twice, gate is unlocked.',
      },
      status: 'received',
      createdAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      placedAtTimestamp: Date.now(),
      statusUpdates: [
        {
          status: 'received',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          note: 'Order placed & entered kitchen frying queue',
        },
      ],
    };

    addOrder(mockOrder);
    if (soundEnabled) audioAlerts.playNewOrderChime();
  };

  // Order status classifications
  const newOrders = orders.filter((o) => o.status === 'received');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const completedOrders = orders.filter((o) => o.status === 'completed' || o.status === 'delivered');

  // Filter orders by orderType and searchQuery
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
  const filteredCompleted = filterList(completedOrders).slice(0, 10);

  const totalActive = filteredNew.length + filteredPreparing.length + filteredReady.length;

  // Format date and time
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
    hour12: true,
  });

  // Calculate elapsed time in minutes
  const getElapsedMinutes = (order: Order) => {
    const start = order.placedAtTimestamp || Date.now();
    return Math.max(0, Math.floor((currentTime.getTime() - start) / 60000));
  };

  // Reusable Order Card
  const renderOrderCard = (order: Order) => {
    const elapsed = getElapsedMinutes(order);
    const isNew = order.status === 'received';
    const isPrep = order.status === 'preparing';
    const isRdy = order.status === 'ready';
    const isDone = order.status === 'completed' || order.status === 'delivered';
    const isRush = elapsed >= 12;

    return (
      <div
        key={order.id}
        id={`kds-card-${order.id}`}
        className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-200 ${
          isRdy
            ? 'bg-neutral-900 border-emerald-500 ring-2 ring-emerald-500/30'
            : isPrep
            ? 'bg-neutral-900 border-amber-500 ring-2 ring-amber-500/30'
            : isDone
            ? 'bg-neutral-900/60 border-neutral-800 opacity-70'
            : isRush
            ? 'bg-neutral-900 border-rose-500 ring-2 ring-rose-500/40 animate-pulse'
            : 'bg-neutral-900 border-neutral-700'
        }`}
      >
        {/* Top Header */}
        <div
          className={`p-3.5 flex items-center justify-between border-b ${
            isRdy
              ? 'bg-emerald-950/80 border-emerald-800'
              : isPrep
              ? 'bg-amber-950/80 border-amber-900'
              : isRush
              ? 'bg-rose-950/80 border-rose-900'
              : 'bg-neutral-850 border-neutral-800'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base text-white tracking-wider font-mono">
                #{order.orderNumber}
              </span>
              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                  order.orderType === 'delivery'
                    ? 'bg-emerald-600 text-white font-black'
                    : 'bg-amber-400 text-neutral-950 font-black'
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

            <div className="text-[11px] text-neutral-300 mt-1 flex items-center gap-2 font-medium">
              <span>Placed: {order.createdAt}</span>
              <span className="text-neutral-600">•</span>
              <span
                className={`font-black flex items-center gap-1 ${
                  isRush ? 'text-rose-400 animate-pulse' : elapsed >= 8 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                <Clock className="w-3 h-3" />
                {elapsed}m elapsed {isRush && '(RUSH!)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTicketToPrint(order)}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="Print Kitchen Chit"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                isRdy
                  ? 'bg-emerald-500 text-neutral-950'
                  : isPrep
                  ? 'bg-amber-400 text-neutral-950'
                  : isDone
                  ? 'bg-neutral-800 text-neutral-400'
                  : 'bg-neutral-700 text-white'
              }`}
            >
              {isPrep && <Flame className="w-3 h-3 text-orange-950 fill-orange-950" />}
              {isRdy && <PackageCheck className="w-3 h-3 text-neutral-950" />}
              <span>{order.status.replace(/_/g, ' ')}</span>
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5 flex-1 space-y-3">
          {/* Customer Details */}
          <div className="text-xs pb-2 border-b border-neutral-800/80 flex items-start justify-between gap-2 text-neutral-300">
            <div>
              <div className="text-white font-extrabold text-sm">{order.customer.name}</div>
              {order.customer.phone && (
                <div className="text-[11px] text-neutral-400 font-mono mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-neutral-500" />
                  <span>{order.customer.phone}</span>
                </div>
              )}
            </div>
            {order.orderType === 'delivery' && order.customer.address && (
              <div className="text-right max-w-[55%]">
                <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center justify-end gap-1">
                  <MapPin className="w-3 h-3" />
                  Bahria Address
                </span>
                <span className="text-[11px] text-neutral-300 font-medium block truncate" title={order.customer.address}>
                  {order.customer.address}
                </span>
              </div>
            )}
          </div>

          {/* Items To Prepare */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-neutral-400">
              <span>Items To Prepare</span>
              <span>Total: PKR {order.grandTotal}</span>
            </div>

            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-black text-white">
                  <span className="text-amber-300 text-sm tracking-wide">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-neutral-800 text-amber-400 border border-neutral-700">
                    {item.size}
                  </span>
                </div>

                {/* Seasoning Shaker */}
                {item.flavour && (
                  <div className="text-[11px] text-amber-400 font-bold flex items-center gap-1.5 bg-amber-950/30 px-2 py-1 rounded-md border border-amber-900/40">
                    <span>🌶️ Seasoning:</span>
                    <span className="text-white font-extrabold">{item.flavour.name}</span>
                    <span className="text-[10px] text-amber-300/80">({item.flavour.heatLevel === 0 ? 'Mild' : item.flavour.heatLevel === 1 ? 'Spicy' : 'Hot'})</span>
                  </div>
                )}

                {/* Gourmet Sauce */}
                {item.sauce && (
                  <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/30 px-2 py-1 rounded-md border border-emerald-900/40">
                    <span>🥣 Dip Sauce:</span>
                    <span className="text-white font-extrabold">{item.sauce.name}</span>
                  </div>
                )}

                {/* Extras */}
                {item.extras && item.extras.length > 0 && (
                  <div className="text-[11px] text-neutral-300 font-medium">
                    <span className="text-neutral-500 font-bold">Extras: </span>
                    {item.extras.map((ex) => `${ex.name} (×${ex.quantity})`).join(', ')}
                  </div>
                )}

                {/* Item-specific Notes */}
                {item.specialInstructions && (
                  <div className="text-[11px] text-orange-200 font-semibold bg-orange-950/60 p-2 rounded-lg border border-orange-900/80 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                    <span>"{item.specialInstructions}"</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Delivery Special Instructions */}
          {order.customer.deliveryNotes && (
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-900/60 text-xs text-amber-200 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase text-[10px] text-amber-400 block">
                  Delivery Driver Note:
                </span>
                "{order.customer.deliveryNotes}"
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex gap-2">
          {isNew && (
            <button
              id={`kds-prep-btn-${order.id}`}
              onClick={() => handleStartPreparing(order.id)}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-amber-400/20"
            >
              <Flame className="w-4 h-4 text-orange-900 fill-orange-900" />
              <span>START FRYING & PREPARING</span>
            </button>
          )}

          {isPrep && (
            <button
              id={`kds-ready-btn-${order.id}`}
              onClick={() => handleMarkReady(order)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-emerald-600/20"
            >
              <PackageCheck className="w-4 h-4" />
              <span>PACK IN BAG & MARK READY</span>
            </button>
          )}

          {isRdy && (
            <button
              id={`kds-complete-btn-${order.id}`}
              onClick={() => handleCompleteOrder(order.id)}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>HAND OVER / DISPATCH ORDER</span>
            </button>
          )}

          {isDone && (
            <div className="w-full py-2.5 rounded-xl bg-neutral-900 text-neutral-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Order Completed & Handed Over</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-400 selection:text-neutral-950">
      {/* 1. MASTER KDS HEADER */}
      <header className="bg-neutral-900 border-b border-neutral-800 px-4 sm:px-6 py-3 shrink-0 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xl">
        {/* Logo & Operational Status */}
        <div className="flex items-center gap-3">
          <BrandLogo size="md" variant="white" showTagline={false} />
          <div className="border-l border-neutral-800 pl-3">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black uppercase text-amber-400 tracking-wider">
                KITCHEN DISPLAY (KDS)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>🟢 4 Fryers Active (180°C)</span>
              </span>
            </div>
            <div className="text-xs text-neutral-400">
              Sector C, Bahria Town Lahore Station
            </div>
          </div>
        </div>

        {/* Live Date & Time Clock */}
        <div className="flex items-center gap-3 bg-neutral-950 px-4 py-2 rounded-2xl border border-neutral-800 shadow-inner">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="text-right sm:text-left">
            <div className="text-xs font-bold text-neutral-400">
              {formattedDate}
            </div>
            <div className="text-sm font-black text-amber-400 font-mono tabular-nums leading-none">
              {formattedTime}
            </div>
          </div>
        </div>

        {/* Controls: Sound, Fullscreen, Mock Order, Exit */}
        <div className="flex items-center gap-2">
          {/* Quick Mock Order Simulator */}
          <button
            onClick={handleSimulateTestOrder}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Create a test order to test kitchen sounds and tickets"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">+ Test Ticket</span>
          </button>

          {/* Audio Chime Toggle */}
          <button
            id="kds-sound-toggle"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) audioAlerts.playOrderReadyBell();
            }}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                : 'bg-neutral-850 border-neutral-750 text-neutral-400'
            }`}
            title="Toggle kitchen sound chime"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{soundEnabled ? 'Chime ON' : 'Muted'}</span>
          </button>

          {/* Test Kitchen Bell */}
          <button
            onClick={() => audioAlerts.playOrderReadyBell()}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-neutral-850 hover:bg-neutral-800 border border-neutral-750 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition-all"
            title="Test service order bell"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden lg:inline">Ring Bell</span>
          </button>

          {/* Column vs Grid View Toggle */}
          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setViewMode('columns')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'columns'
                  ? 'bg-amber-400 text-neutral-950 font-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Column Kanban View"
            >
              <Columns3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-amber-400 text-neutral-950 font-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Full Screen Mode Toggle */}
          <button
            id="kds-fullscreen-toggle"
            onClick={toggleFullscreen}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              isFullscreen
                ? 'bg-amber-400 text-neutral-950 border-amber-400 font-black'
                : 'bg-neutral-850 hover:bg-neutral-800 border-neutral-750 text-neutral-200'
            }`}
            title="Toggle Fullscreen Kitchen Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}
            </span>
          </button>

          {/* Direct Link to Admin */}
          <button
            onClick={() => {
              window.location.href = '/admin';
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-neutral-850 hover:bg-neutral-800 border border-neutral-750 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition-all"
            title="Go to Admin Portal"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden xl:inline">Admin</span>
          </button>

          {/* Exit Kitchen Terminal Back to Customer Website (/) */}
          <button
            id="kds-exit-button"
            onClick={onExitMode}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Lock and return to customer website"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Return to Web</span>
          </button>
        </div>
      </header>

      {/* 2. SUB-BAR: LIVE STATUS METRICS & FILTERS */}
      <div className="bg-neutral-900/80 border-b border-neutral-800 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-amber-400 text-neutral-950 font-black shadow-sm'
                : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            All Active Queue ({totalActive})
          </button>
          <button
            onClick={() => setFilterType('takeaway')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'takeaway'
                ? 'bg-amber-400 text-neutral-950 font-black shadow-sm'
                : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Takeaway Counter</span>
          </button>
          <button
            onClick={() => setFilterType('delivery')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'delivery'
                ? 'bg-emerald-600 text-white font-black shadow-sm'
                : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Bahria Delivery</span>
          </button>
        </div>

        {/* Live Ticket Count Badges */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-bold">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>New Tickets: {filteredNew.length}</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>In Fryers: {filteredPreparing.length}</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ready / Packed: {filteredReady.length}</span>
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="kds-search-input"
            type="text"
            placeholder="Search ticket #, name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 w-48 sm:w-64"
          />
        </div>
      </div>

      {/* 3. MAIN KITCHEN DISPLAY VIEW */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {totalActive === 0 && filteredCompleted.length === 0 ? (
          /* EMPTY STATE */
          <div className="h-96 flex flex-col items-center justify-center text-center p-6">
            <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
              <ChefHat className="w-10 h-10 stroke-[2]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider mb-2">
              KITCHEN QUEUE CLEAR
            </h2>
            <p className="text-sm text-neutral-400 max-w-sm mb-4">
              All fries batches have been fried, seasoned, and dispatched. The kitchen queue is clear and ready!
            </p>
            <button
              onClick={handleSimulateTestOrder}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simulate Incoming Order</span>
            </button>
          </div>
        ) : viewMode === 'columns' ? (
          /* KANBAN COLUMN VIEW: NEW, PREPARING, READY, COMPLETED */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full items-start">
            {/* COLUMN 1: NEW */}
            <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-3 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                  <h3 className="font-black text-sm uppercase text-amber-400 tracking-wider">
                    NEW TICKETS
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-xs">
                  {filteredNew.length}
                </span>
              </div>
              <div className="space-y-3">
                {filteredNew.length === 0 ? (
                  <div className="py-12 text-center text-neutral-500 text-xs">
                    No new pending tickets
                  </div>
                ) : (
                  filteredNew.map((order) => renderOrderCard(order))
                )}
              </div>
            </div>

            {/* COLUMN 2: PREPARING */}
            <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-3 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <h3 className="font-black text-sm uppercase text-orange-300 tracking-wider">
                    IN FRYERS / PREPARING
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-orange-400/20 text-orange-300 font-extrabold text-xs">
                  {filteredPreparing.length}
                </span>
              </div>
              <div className="space-y-3">
                {filteredPreparing.length === 0 ? (
                  <div className="py-12 text-center text-neutral-500 text-xs">
                    No orders currently in fryers
                  </div>
                ) : (
                  filteredPreparing.map((order) => renderOrderCard(order))
                )}
              </div>
            </div>

            {/* COLUMN 3: READY */}
            <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-3 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-black text-sm uppercase text-emerald-300 tracking-wider">
                    READY FOR HANDOVER
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs">
                  {filteredReady.length}
                </span>
              </div>
              <div className="space-y-3">
                {filteredReady.length === 0 ? (
                  <div className="py-12 text-center text-neutral-500 text-xs">
                    No packed orders awaiting handover
                  </div>
                ) : (
                  filteredReady.map((order) => renderOrderCard(order))
                )}
              </div>
            </div>

            {/* COLUMN 4: COMPLETED (Recent) */}
            <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-3 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <h3 className="font-black text-sm uppercase text-blue-300 tracking-wider">
                    RECENTLY COMPLETED
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-xs">
                  {filteredCompleted.length}
                </span>
              </div>
              <div className="space-y-3">
                {filteredCompleted.length === 0 ? (
                  <div className="py-12 text-center text-neutral-500 text-xs">
                    Completed orders log empty
                  </div>
                ) : (
                  filteredCompleted.map((order) => renderOrderCard(order))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...filteredNew, ...filteredPreparing, ...filteredReady].map((order) =>
              renderOrderCard(order)
            )}
          </div>
        )}
      </main>

      {/* 4. PRINTABLE KITCHEN CHIT MODAL */}
      <AnimatePresence>
        {ticketToPrint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white text-neutral-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative font-mono text-xs"
            >
              <button
                onClick={() => setTicketToPrint(null)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center pb-4 border-b border-neutral-300">
                <div className="font-black text-lg">FRYWAY AUTHENTIC FRIES</div>
                <div className="text-[10px] text-neutral-600">KITCHEN CHIT • LAHORE</div>
                <div className="text-sm font-black mt-2">#{ticketToPrint.orderNumber}</div>
                <div className="text-[11px] font-bold uppercase mt-1">
                  [{ticketToPrint.orderType === 'delivery' ? '🛵 HOME DELIVERY' : '🛍️ TAKEAWAY COUNTER'}]
                </div>
              </div>

              <div className="py-3 border-b border-neutral-300 space-y-1">
                <div>Customer: <span className="font-bold">{ticketToPrint.customer.name}</span></div>
                <div>Phone: <span className="font-bold">{ticketToPrint.customer.phone}</span></div>
                {ticketToPrint.customer.address && (
                  <div>Address: <span className="font-bold">{ticketToPrint.customer.address}</span></div>
                )}
                <div>Time: {ticketToPrint.createdAt}</div>
              </div>

              <div className="py-3 border-b border-neutral-300 space-y-2">
                <div className="font-black uppercase text-[11px]">ITEMS:</div>
                {ticketToPrint.items.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="font-bold">
                      {item.quantity}x {item.name} ({item.size})
                    </div>
                    {item.flavour && (
                      <div className="text-neutral-700 pl-2">• Flavour: {item.flavour.name}</div>
                    )}
                    {item.sauce && (
                      <div className="text-neutral-700 pl-2">• Sauce: {item.sauce.name}</div>
                    )}
                    {item.extras && item.extras.length > 0 && (
                      <div className="text-neutral-700 pl-2">
                        • Extras: {item.extras.map(e => `${e.name} x${e.quantity}`).join(', ')}
                      </div>
                    )}
                    {item.specialInstructions && (
                      <div className="font-bold text-amber-900 pl-2 bg-amber-50 p-1 rounded">
                        Note: {item.specialInstructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-3 flex justify-between font-black text-sm">
                <span>TOTAL:</span>
                <span>PKR {ticketToPrint.grandTotal}</span>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setTicketToPrint(null)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
