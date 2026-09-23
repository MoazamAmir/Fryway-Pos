/**
 * Centralized Store and State Sync Layer for Fryway POS Ecosystem
 * Manages Orders (Takeaway + Delivery), Kitchen Queue, Menu & Modifiers Availability,
 * Operating Expenses, Customer Directory, Staff Accounts, and Business Settings.
 */

import {
  Order,
  OrderStatus,
  Expense,
  MenuItem,
  FlavourItem,
  SauceItem,
  ExtraItem,
  StaffMember,
  BusinessSettings,
} from '../types';
import { MENU_PRODUCTS, FLAVOURS, SAUCES, EXTRAS, RESTAURANT_INFO } from '../data/menuData';
import { audioAlerts } from './audioAlerts';

export const AUTH_PINS = {
  admin: '7777', // Owner/Admin PIN
  kitchen: '5555', // Kitchen staff PIN
  counter: '1111', // Counter staff PIN
};

// Storage Keys
const ORDERS_KEY = 'fryway_orders_v3';
const EXPENSES_KEY = 'fryway_expenses_v3';
const MENU_KEY = 'fryway_menu_v3';
const FLAVOURS_KEY = 'fryway_flavours_v3';
const SAUCES_KEY = 'fryway_sauces_v3';
const EXTRAS_KEY = 'fryway_extras_v3';
const SETTINGS_KEY = 'fryway_settings_v3';
const STAFF_KEY = 'fryway_staff_v3';

// Dispatch custom event for real-time reactivity across components
function broadcastUpdate(type: string, detail?: any) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(type, { detail }));
  }
}

// ----------------------------------------------------
// Business Settings
// ----------------------------------------------------
const DEFAULT_SETTINGS: BusinessSettings = {
  restaurantName: RESTAURANT_INFO.name,
  tagline: RESTAURANT_INFO.tagline,
  isOpen: true,
  phone: RESTAURANT_INFO.phone,
  address: RESTAURANT_INFO.address,
  openingHours: RESTAURANT_INFO.hours,
  deliveryFee: RESTAURANT_INFO.deliveryFee,
  freeDeliveryThreshold: RESTAURANT_INFO.freeDeliveryThreshold,
  minOrderAmount: RESTAURANT_INFO.minOrderAmount,
  currency: 'PKR',
  taxPercent: 0,
  discountPercent: 0,
};

export function getBusinessSettings(): BusinessSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT_SETTINGS;
}

export function updateBusinessSettings(partial: Partial<BusinessSettings>): BusinessSettings {
  const current = getBusinessSettings();
  const updated = { ...current, ...partial };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_settings_update', updated);
  return updated;
}

// ----------------------------------------------------
// Staff Accounts Management
// ----------------------------------------------------
const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'st_01',
    name: 'Muhammad Tariq (Owner / General Manager)',
    role: 'admin',
    pin: '7777',
    phone: '0312-4424505',
    status: 'active',
    joinedDate: '2025-01-10',
  },
  {
    id: 'st_02',
    name: 'Chef Bilal Ahmed (Head Line Fryer)',
    role: 'kitchen',
    pin: '5555',
    phone: '0300-1234567',
    status: 'active',
    joinedDate: '2025-02-15',
  },
  {
    id: 'st_03',
    name: 'Hamza Malik (Counter POS & Expediter)',
    role: 'counter',
    pin: '1111',
    phone: '0321-9876543',
    status: 'active',
    joinedDate: '2025-03-01',
  },
  {
    id: 'st_04',
    name: 'Saad Farooq (Evening Kitchen Prep)',
    role: 'kitchen',
    pin: '5556',
    phone: '0305-5554321',
    status: 'active',
    joinedDate: '2025-03-20',
  },
];

export function getStaffMembers(): StaffMember[] {
  try {
    const saved = localStorage.getItem(STAFF_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  try {
    localStorage.setItem(STAFF_KEY, JSON.stringify(INITIAL_STAFF));
  } catch {}
  return INITIAL_STAFF;
}

export function addStaffMember(staff: Omit<StaffMember, 'id' | 'joinedDate'>): StaffMember {
  const current = getStaffMembers();
  const newStaff: StaffMember = {
    ...staff,
    id: `st_${Date.now()}`,
    joinedDate: new Date().toISOString().split('T')[0],
  };
  const updated = [newStaff, ...current];
  try {
    localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_staff_update', updated);
  return newStaff;
}

export function toggleStaffStatus(id: string): void {
  const current = getStaffMembers();
  const updated = current.map((st) =>
    st.id === id ? { ...st, status: (st.status === 'active' ? 'disabled' : 'active') as 'active' | 'disabled' } : st
  );
  try {
    localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_staff_update', updated);
}

export function updateStaffPin(id: string, newPin: string): void {
  const current = getStaffMembers();
  const updated = current.map((st) => (st.id === id ? { ...st, pin: newPin } : st));
  try {
    localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_staff_update', updated);
}

export function deleteStaffMember(id: string): void {
  const current = getStaffMembers();
  const updated = current.filter((st) => st.id !== id);
  try {
    localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_staff_update', updated);
}

// ----------------------------------------------------
// Menu Products, Flavours, Sauces & Extras Management
// ----------------------------------------------------
export interface ManagedFlavour extends FlavourItem {
  isAvailable: boolean;
}

export interface ManagedSauce extends SauceItem {
  isAvailable: boolean;
}

export interface ManagedExtra extends ExtraItem {
  isAvailable: boolean;
}

export function getMenuItems(): MenuItem[] {
  try {
    const saved = localStorage.getItem(MENU_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  const initial = MENU_PRODUCTS.map((item) => ({ ...item, isAvailable: true }));
  try {
    localStorage.setItem(MENU_KEY, JSON.stringify(initial));
  } catch {}
  return initial;
}

export function toggleMenuItemAvailability(id: string): void {
  const current = getMenuItems();
  const updated = current.map((it) => (it.id === id ? { ...it, isAvailable: !it.isAvailable } : it));
  try {
    localStorage.setItem(MENU_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_menu_update', updated);
}

export function updateMenuItem(id: string, updates: Partial<MenuItem>): void {
  const current = getMenuItems();
  const updated = current.map((it) => (it.id === id ? { ...it, ...updates } : it));
  try {
    localStorage.setItem(MENU_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_menu_update', updated);
}

export function addCustomMenuItem(item: Omit<MenuItem, 'id' | 'isAvailable'>): MenuItem {
  const current = getMenuItems();
  const newItem: MenuItem = {
    ...item,
    id: `prod_${Date.now()}`,
    isAvailable: true,
  };
  const updated = [...current, newItem];
  try {
    localStorage.setItem(MENU_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_menu_update', updated);
  return newItem;
}

export function deleteCustomMenuItem(id: string): void {
  const current = getMenuItems();
  const updated = current.filter((it) => it.id !== id);
  try {
    localStorage.setItem(MENU_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_menu_update', updated);
}

// Flavours
export function getFlavoursList(): ManagedFlavour[] {
  try {
    const saved = localStorage.getItem(FLAVOURS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  const initial: ManagedFlavour[] = FLAVOURS.map((f) => ({ ...f, isAvailable: true }));
  try {
    localStorage.setItem(FLAVOURS_KEY, JSON.stringify(initial));
  } catch {}
  return initial;
}

export function toggleFlavourAvailability(id: string): void {
  const current = getFlavoursList();
  const updated = current.map((f) => (f.id === id ? { ...f, isAvailable: !f.isAvailable } : f));
  try {
    localStorage.setItem(FLAVOURS_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_flavour_update', updated);
}

export function addFlavour(flavour: Omit<ManagedFlavour, 'id' | 'isAvailable'>): ManagedFlavour {
  const current = getFlavoursList();
  const newFlavour: ManagedFlavour = {
    ...flavour,
    id: `flv_${Date.now()}`,
    isAvailable: true,
  };
  const updated = [...current, newFlavour];
  try {
    localStorage.setItem(FLAVOURS_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_flavour_update', updated);
  return newFlavour;
}

export function editFlavour(id: string, updates: Partial<ManagedFlavour>): void {
  const current = getFlavoursList();
  const updated = current.map((f) => (f.id === id ? { ...f, ...updates } : f));
  try {
    localStorage.setItem(FLAVOURS_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_flavour_update', updated);
}

export function deleteFlavour(id: string): void {
  const current = getFlavoursList();
  const updated = current.filter((f) => f.id !== id);
  try {
    localStorage.setItem(FLAVOURS_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_flavour_update', updated);
}

// Sauces
export function getSaucesList(): ManagedSauce[] {
  try {
    const saved = localStorage.getItem(SAUCES_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  const initial: ManagedSauce[] = SAUCES.map((s) => ({ ...s, isAvailable: true }));
  try {
    localStorage.setItem(SAUCES_KEY, JSON.stringify(initial));
  } catch {}
  return initial;
}

export function toggleSauceAvailability(id: string): void {
  const current = getSaucesList();
  const updated = current.map((s) => (s.id === id ? { ...s, isAvailable: !s.isAvailable } : s));
  try {
    localStorage.setItem(SAUCES_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_sauce_update', updated);
}

export function addSauce(sauce: Omit<ManagedSauce, 'id' | 'isAvailable'>): ManagedSauce {
  const current = getSaucesList();
  const newSauce: ManagedSauce = {
    ...sauce,
    id: `sauce_${Date.now()}`,
    isAvailable: true,
  };
  const updated = [...current, newSauce];
  try {
    localStorage.setItem(SAUCES_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_sauce_update', updated);
  return newSauce;
}

export function editSauce(id: string, updates: Partial<ManagedSauce>): void {
  const current = getSaucesList();
  const updated = current.map((s) => (s.id === id ? { ...s, ...updates } : s));
  try {
    localStorage.setItem(SAUCES_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_sauce_update', updated);
}

export function deleteSauce(id: string): void {
  const current = getSaucesList();
  const updated = current.filter((s) => s.id !== id);
  try {
    localStorage.setItem(SAUCES_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_sauce_update', updated);
}

// Extras
export function getExtrasList(): ManagedExtra[] {
  try {
    const saved = localStorage.getItem(EXTRAS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  const initial: ManagedExtra[] = EXTRAS.map((e) => ({ ...e, isAvailable: true }));
  try {
    localStorage.setItem(EXTRAS_KEY, JSON.stringify(initial));
  } catch {}
  return initial;
}

export function toggleExtraAvailability(id: string): void {
  const current = getExtrasList();
  const updated = current.map((e) => (e.id === id ? { ...e, isAvailable: !e.isAvailable } : e));
  try {
    localStorage.setItem(EXTRAS_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_extra_update', updated);
}

export function updateExtraPrice(id: string, price: number): void {
  const current = getExtrasList();
  const updated = current.map((e) => (e.id === id ? { ...e, price } : e));
  try {
    localStorage.setItem(EXTRAS_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_extra_update', updated);
}

export function addExtra(extra: Omit<ManagedExtra, 'id' | 'isAvailable'>): ManagedExtra {
  const current = getExtrasList();
  const newExtra: ManagedExtra = {
    ...extra,
    id: `extra_${Date.now()}`,
    isAvailable: true,
  };
  const updated = [...current, newExtra];
  try {
    localStorage.setItem(EXTRAS_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_extra_update', updated);
  return newExtra;
}

export function deleteExtra(id: string): void {
  const current = getExtrasList();
  const updated = current.filter((e) => e.id !== id);
  try {
    localStorage.setItem(EXTRAS_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_extra_update', updated);
}

// ----------------------------------------------------
// Operating Expenses Management
// ----------------------------------------------------
const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp_01',
    title: 'Grade-A Whole Potatoes (150 kg sack)',
    category: 'potatoes_produce',
    amount: 14500,
    date: new Date().toISOString().split('T')[0],
    time: '09:30 AM',
    paymentMethod: 'cash',
    notes: 'Direct from wholesale potato mandi',
  },
  {
    id: 'exp_02',
    title: 'Double-Fry High Smoke-Point Cooking Oil (40 Liters)',
    category: 'cooking_oil',
    amount: 22000,
    date: new Date().toISOString().split('T')[0],
    time: '10:15 AM',
    paymentMethod: 'bank_transfer',
    notes: 'Deep fryers refill',
  },
  {
    id: 'exp_03',
    title: 'Thermal Fries Boxes & Kraft Paper Bags (1,000 pcs)',
    category: 'packaging',
    amount: 8500,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '02:00 PM',
    paymentMethod: 'cash',
    notes: 'Custom branded Fryway packaging',
  },
  {
    id: 'exp_04',
    title: 'Dairy Cream, Mayo Base & Seasoning Restock',
    category: 'sauces_spices',
    amount: 9200,
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    time: '11:00 AM',
    paymentMethod: 'cash',
    notes: 'Garlic mayo & cheese mayo batch prep',
  },
  {
    id: 'exp_05',
    title: 'Commercial LPG Cylinder Gas Refill',
    category: 'utilities_gas',
    amount: 16800,
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    time: '04:30 PM',
    paymentMethod: 'cash',
    notes: 'Twin fryers gas supply',
  },
  {
    id: 'exp_06',
    title: 'Delivery Bike Fuel Allowance (Bahria Town Riders)',
    category: 'delivery_fuel',
    amount: 4500,
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    time: '01:15 PM',
    paymentMethod: 'petty_cash',
    notes: 'Sector C, Jasmine, Tulip blocks',
  },
  {
    id: 'exp_07',
    title: 'Kitchen Line Fryers Bi-Weekly Stipend',
    category: 'salaries',
    amount: 42000,
    date: new Date(Date.now() - 86400000 * 9).toISOString().split('T')[0],
    time: '06:00 PM',
    paymentMethod: 'bank_transfer',
    notes: 'Staff salaries',
  },
];

export function getExpenses(): Expense[] {
  try {
    const saved = localStorage.getItem(EXPENSES_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(INITIAL_EXPENSES));
  } catch {}
  return INITIAL_EXPENSES;
}

export function addExpense(expense: Omit<Expense, 'id'>): Expense {
  const current = getExpenses();
  const newExp: Expense = {
    ...expense,
    id: `exp_${Date.now()}`,
    time: expense.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  const updated = [newExp, ...current];
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_expense_update', updated);
  return newExp;
}

export function deleteExpense(id: string): void {
  const current = getExpenses();
  const updated = current.filter((e) => e.id !== id);
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_expense_update', updated);
}

export function updateExpense(id: string, updates: Partial<Expense>): void {
  const current = getExpenses();
  const updated = current.map((e) => (e.id === id ? { ...e, ...updates } : e));
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_expense_update', updated);
}

// ----------------------------------------------------
// Orders & Kitchen Flow Management
// ----------------------------------------------------
function getInitialOrders(): Order[] {
  const now = Date.now();
  return [
    {
      id: 'ord_sample_1',
      orderNumber: 'FW-1024',
      createdAt: new Date(now - 8 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      placedAtTimestamp: now - 8 * 60000,
      orderType: 'takeaway',
      customer: { name: 'Usman Chaudhry', phone: '0300-9876543' },
      items: [
        {
          id: 'item_1',
          productId: 'fries_medium',
          name: 'Medium Hand-Cut Fries',
          size: 'medium',
          sizeLabel: 'Medium Fries',
          style: 'masala_sauce',
          flavour: { id: 'tikka', name: 'Tikka', description: '', category: 'spicy', heatLevel: 2 },
          sauce: { id: 'garlic_mayo', name: 'Garlic Mayo', description: '', profile: 'creamy', heatLevel: 0 },
          extras: [{ extraId: 'extra_dip', name: 'Extra Dip (Cheese Mayo)', price: 80, quantity: 1 }],
          specialInstructions: 'Make it extra crisp!',
          unitPrice: 530,
          quantity: 2,
          totalPrice: 1060,
          image: MENU_PRODUCTS[1].image,
        },
      ],
      subtotal: 1060,
      deliveryFee: 0,
      grandTotal: 1060,
      paymentMethod: 'cash_on_pickup',
      status: 'preparing',
      estimatedMinutes: 15,
      statusUpdates: [
        { status: 'received', time: '08:35 PM', note: 'Counter order received' },
        { status: 'preparing', time: '08:37 PM', note: 'Fresh double-frying underway' },
      ],
    },
    {
      id: 'ord_sample_2',
      orderNumber: 'FW-1025',
      createdAt: new Date(now - 14 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      placedAtTimestamp: now - 14 * 60000,
      orderType: 'delivery',
      customer: {
        name: 'Fatima Zahra',
        phone: '0321-4567890',
        address: 'House #184, Sector C, Jasmine Block, Bahria Town Lahore',
        deliveryNotes: 'Please ring bell twice and leave at porch table.',
      },
      items: [
        {
          id: 'item_2',
          productId: 'fries_large',
          name: 'Large Hand-Cut Fries',
          size: 'large',
          sizeLabel: 'Large Fries',
          style: 'masala_sauce',
          flavour: { id: 'mexican', name: 'Mexican', description: '', category: 'spicy', heatLevel: 2 },
          sauce: { id: 'cheese_mayo', name: 'Cheese Mayo', description: '', profile: 'creamy', heatLevel: 0 },
          extras: [
            { extraId: 'ketchup_chilli_dip', name: 'Ketchup / Chilli Garlic Dip', price: 50, quantity: 2 },
          ],
          unitPrice: 700,
          quantity: 1,
          totalPrice: 700,
          image: MENU_PRODUCTS[2].image,
        },
        {
          id: 'item_3',
          productId: 'fries_regular',
          name: 'Regular Hand-Cut Fries',
          size: 'regular',
          sizeLabel: 'Regular Fries',
          style: 'plain',
          extras: [],
          unitPrice: 230,
          quantity: 1,
          totalPrice: 230,
          image: MENU_PRODUCTS[0].image,
        },
      ],
      subtotal: 930,
      deliveryFee: 120,
      grandTotal: 1050,
      paymentMethod: 'cash_on_delivery',
      status: 'ready',
      estimatedMinutes: 25,
      statusUpdates: [
        { status: 'received', time: '08:29 PM', note: 'Home delivery order received' },
        { status: 'preparing', time: '08:32 PM', note: 'Frying & packing' },
        { status: 'ready', time: '08:41 PM', note: 'Packed in thermal bag ready for rider' },
      ],
    },
    {
      id: 'ord_sample_3',
      orderNumber: 'FW-1026',
      createdAt: new Date(now - 3 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      placedAtTimestamp: now - 3 * 60000,
      orderType: 'takeaway',
      customer: { name: 'Dr. Tariq Mahmood', phone: '0333-8889900' },
      items: [
        {
          id: 'item_4',
          productId: 'fries_medium',
          name: 'Medium Hand-Cut Fries',
          size: 'medium',
          sizeLabel: 'Medium Fries',
          style: 'masala',
          flavour: { id: 'butter_garlic', name: 'Butter Garlic', description: '', category: 'savory', heatLevel: 0 },
          extras: [{ extraId: 'extra_dip', name: 'Extra Dip (Ranch)', price: 80, quantity: 1 }],
          unitPrice: 450,
          quantity: 1,
          totalPrice: 450,
          image: MENU_PRODUCTS[1].image,
        },
      ],
      subtotal: 450,
      deliveryFee: 0,
      grandTotal: 450,
      paymentMethod: 'card_at_counter',
      status: 'received',
      estimatedMinutes: 12,
      statusUpdates: [{ status: 'received', time: '08:40 PM', note: 'New order entered kitchen queue' }],
    },
    {
      id: 'ord_sample_4',
      orderNumber: 'FW-1020',
      createdAt: new Date(now - 55 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      placedAtTimestamp: now - 55 * 60000,
      orderType: 'delivery',
      customer: {
        name: 'Ayesha Khan',
        phone: '0315-7766554',
        address: 'Sector C Commercial, Plaza 14, Bahria Town',
      },
      items: [
        {
          id: 'item_5',
          productId: 'fries_large',
          name: 'Large Hand-Cut Fries',
          size: 'large',
          sizeLabel: 'Large Fries',
          style: 'masala_sauce',
          flavour: { id: 'chicken_chat_pati', name: 'Chicken Chat Pati', description: '', category: 'spicy', heatLevel: 3 },
          sauce: { id: 'hot_sauce', name: 'Hot Sauce', description: '', profile: 'hot', heatLevel: 3 },
          extras: [],
          unitPrice: 600,
          quantity: 2,
          totalPrice: 1200,
          image: MENU_PRODUCTS[2].image,
        },
      ],
      subtotal: 1200,
      deliveryFee: 0, // Free delivery threshold met!
      grandTotal: 1200,
      paymentMethod: 'cash_on_delivery',
      status: 'delivered',
      estimatedMinutes: 30,
      statusUpdates: [
        { status: 'received', time: '07:48 PM', note: 'Received' },
        { status: 'preparing', time: '07:52 PM', note: 'Prepared' },
        { status: 'ready', time: '08:05 PM', note: 'Dispatched with rider' },
        { status: 'delivered', time: '08:24 PM', note: 'Delivered successfully' },
      ],
    },
  ];
}

export function getOrders(): Order[] {
  try {
    const saved = localStorage.getItem(ORDERS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  const initial = getInitialOrders();
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(initial));
  } catch {}
  return initial;
}

export function addOrder(order: Order): Order {
  const current = getOrders();
  const updated = [order, ...current];
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_order_update', { order, action: 'added' });
  audioAlerts.playNewOrderChime();
  return order;
}

export function updateOrderStatus(orderId: string, status: OrderStatus, note?: string): void {
  const current = getOrders();
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const updated = current.map((ord) => {
    if (ord.id !== orderId) return ord;

    const statusUpdates = [
      ...ord.statusUpdates,
      {
        status,
        time: nowStr,
        note: note || `Status transitioned to ${status}`,
      },
    ];

    const patch: Partial<Order> = {
      status,
      statusUpdates,
    };

    if (status === 'preparing' && !ord.kitchenAcceptedAt) {
      patch.kitchenAcceptedAt = Date.now();
    }
    if (status === 'ready' && !ord.readyAtTimestamp) {
      patch.readyAtTimestamp = Date.now();
    }
    if ((status === 'completed' || status === 'delivered') && !ord.deliveredAtTimestamp) {
      patch.deliveredAtTimestamp = Date.now();
    }

    return { ...ord, ...patch };
  });

  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  } catch {}
  broadcastUpdate('fryway_order_update', { orderId, status });
}

export function getOrderById(orderId: string): Order | undefined {
  const orders = getOrders();
  return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
}

// ----------------------------------------------------
// Customer Directory & Analytics Helpers
// ----------------------------------------------------
export interface CustomerSummary {
  name: string;
  phone: string;
  address?: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  orderHistory: Order[];
}

export function getCustomerDirectory(): CustomerSummary[] {
  const orders = getOrders();
  const map = new Map<string, CustomerSummary>();

  orders.forEach((ord) => {
    const key = ord.customer.phone.replace(/\D/g, '') || ord.customer.name.toLowerCase();
    const existing = map.get(key);

    if (!existing) {
      map.set(key, {
        name: ord.customer.name,
        phone: ord.customer.phone,
        address: ord.customer.address,
        orderCount: 1,
        totalSpent: ord.grandTotal,
        lastOrderDate: ord.createdAt,
        orderHistory: [ord],
      });
    } else {
      existing.orderCount += 1;
      existing.totalSpent += ord.grandTotal;
      if (!existing.address && ord.customer.address) existing.address = ord.customer.address;
      existing.orderHistory.push(ord);
    }
  });

  return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}

// ----------------------------------------------------
// Product & Modifier Analytics (Derived from real orders)
// ----------------------------------------------------
export interface ItemRank {
  name: string;
  count: number;
  revenue: number;
}

export function getPopularProductsStats(): ItemRank[] {
  const orders = getOrders();
  const tally: Record<string, { count: number; revenue: number }> = {};

  orders.forEach((o) => {
    o.items.forEach((item) => {
      const key = `${item.sizeLabel || item.name}`;
      if (!tally[key]) tally[key] = { count: 0, revenue: 0 };
      tally[key].count += item.quantity;
      tally[key].revenue += item.totalPrice;
    });
  });

  return Object.entries(tally)
    .map(([name, data]) => ({ name, count: data.count, revenue: data.revenue }))
    .sort((a, b) => b.count - a.count);
}

export function getPopularFlavoursStats(): ItemRank[] {
  const orders = getOrders();
  const tally: Record<string, number> = {};

  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (item.flavour) {
        tally[item.flavour.name] = (tally[item.flavour.name] || 0) + item.quantity;
      }
    });
  });

  return Object.entries(tally)
    .map(([name, count]) => ({ name, count, revenue: count * 30 }))
    .sort((a, b) => b.count - a.count);
}

export function getPopularSaucesStats(): ItemRank[] {
  const orders = getOrders();
  const tally: Record<string, number> = {};

  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (item.sauce) {
        tally[item.sauce.name] = (tally[item.sauce.name] || 0) + item.quantity;
      }
    });
  });

  return Object.entries(tally)
    .map(([name, count]) => ({ name, count, revenue: count * 80 }))
    .sort((a, b) => b.count - a.count);
}

export function getPopularExtrasStats(): ItemRank[] {
  const orders = getOrders();
  const tally: Record<string, { count: number; revenue: number }> = {};

  orders.forEach((o) => {
    o.items.forEach((item) => {
      item.extras.forEach((ex) => {
        if (!tally[ex.name]) tally[ex.name] = { count: 0, revenue: 0 };
        tally[ex.name].count += ex.quantity;
        tally[ex.name].revenue += ex.price * ex.quantity;
      });
    });
  });

  return Object.entries(tally)
    .map(([name, data]) => ({ name, count: data.count, revenue: data.revenue }))
    .sort((a, b) => b.count - a.count);
}
