/**
 * Centralized Store and State Sync Layer for Fryway
 * Manages Orders, Waiter Notifications, Kitchen Queue, Expenses, and Custom Menu Items.
 */

import {
  Order,
  OrderStatus,
  WaiterNotification,
  Expense,
  MenuItem,
  WaiterStaff,
  FlavourItem,
  SauceItem,
  ExtraItem,
  StaffMember,
  BusinessSettings,
} from '../types';
import { MENU_PRODUCTS, FLAVOURS, SAUCES, EXTRAS } from '../data/menuData';
import { audioAlerts } from './audioAlerts';

export const WAITER_STAFF: WaiterStaff[] = [
  { id: 'w1', name: 'Ali Raza', pin: '1111', shift: 'Evening Shift' },
  { id: 'w2', name: 'Hamza Khan', pin: '2222', shift: 'Night Shift' },
  { id: 'w3', name: 'Bilal Ahmed', pin: '3333', shift: 'Day Shift' },
];

export const DINE_IN_TABLES = [
  { id: 'T-01', name: 'Table 1', zone: 'Indoor Main', capacity: 2 },
  { id: 'T-02', name: 'Table 2', zone: 'Indoor Main', capacity: 4 },
  { id: 'T-03', name: 'Table 3', zone: 'Indoor Main', capacity: 4 },
  { id: 'T-04', name: 'Table 4', zone: 'Family Booth', capacity: 6 },
  { id: 'T-05', name: 'Table 5', zone: 'Family Booth', capacity: 6 },
  { id: 'T-VIP', name: 'VIP Lounge', zone: 'Upper Deck', capacity: 8 },
  { id: 'T-OUT1', name: 'Outdoor 1', zone: 'Patio Lawn', capacity: 4 },
  { id: 'T-OUT2', name: 'Outdoor 2', zone: 'Patio Lawn', capacity: 4 },
  { id: 'T-CTR', name: 'Counter Stool', zone: 'Takeaway Bar', capacity: 1 },
];

export const AUTH_PINS = {
  admin: '7777', // Owner pin
  kitchen: '5555', // Kitchen staff pin
  waiterDemo: '1234', // Quick waiter demo pin or staff PINs
};

// Storage Keys
const ORDERS_KEY = 'fryway_orders_v2';
const NOTIFICATIONS_KEY = 'fryway_notifications_v2';
const EXPENSES_KEY = 'fryway_expenses_v2';
const MENU_OVERRIDE_KEY = 'fryway_menu_overrides_v2';

// Dispatch custom event for real-time reactivity
function broadcastUpdate(type: string, detail?: any) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(type, { detail }));
  }
}

// Pre-seeded realistic expenses for Bahria Town kitchen
const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp_01',
    title: 'Fresh Grade-A Whole Potatoes (150 kg sack)',
    category: 'potatoes_produce',
    amount: 14500,
    date: new Date().toISOString().split('T')[0],
    time: '09:30 AM',
    paymentMethod: 'cash',
    notes: 'Direct from wholesale mandi',
  },
  {
    id: 'exp_02',
    title: 'Premium High-Smoke Frying Oil (40 Liters)',
    category: 'cooking_oil',
    amount: 22000,
    date: new Date().toISOString().split('T')[0],
    time: '10:15 AM',
    paymentMethod: 'bank_transfer',
    notes: 'Special double-fry cooking oil',
  },
  {
    id: 'exp_03',
    title: 'Thermal Fries Boxes & Brown Paper Bags (1,000 pcs)',
    category: 'packaging',
    amount: 8500,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '02:00 PM',
    paymentMethod: 'cash',
    notes: 'Custom branded Fryway packaging',
  },
  {
    id: 'exp_04',
    title: 'Dairy Cream & Mayo Base for House Sauces',
    category: 'sauces_spices',
    amount: 9200,
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    time: '11:00 AM',
    paymentMethod: 'cash',
    notes: 'Garlic mayo & cheese mayo restock',
  },
  {
    id: 'exp_05',
    title: 'Kitchen Commercial Cylinder Gas Refill',
    category: 'utilities_gas',
    amount: 16800,
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    time: '04:30 PM',
    paymentMethod: 'cash',
    notes: 'Twin burners for deep fryers',
  },
  {
    id: 'exp_06',
    title: 'Delivery Bike Fuel Allowance & Maintenance',
    category: 'delivery_fuel',
    amount: 4500,
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    time: '01:15 PM',
    paymentMethod: 'petty_cash',
    notes: 'Bahria Town Sector C, J, Tulip riders',
  },
  {
    id: 'exp_07',
    title: 'Head Fryer & Kitchen Staff Bi-Weekly Stipend',
    category: 'salaries',
    amount: 45000,
    date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
    time: '06:00 PM',
    paymentMethod: 'bank_transfer',
    notes: 'Kitchen & counter staff',
  },
];

// Pre-seeded initial sample orders so dashboard has instant rich data
function getInitialOrders(): Order[] {
  const now = Date.now();
  return [
    {
      id: 'ord_sample_1',
      orderNumber: 'FW-8421',
      createdAt: new Date(now - 12 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      placedAtTimestamp: now - 12 * 60000,
      orderType: 'dine_in',
      tableNumber: 'Table 4',
      waiterId: 'w1',
      waiterName: 'Ali Raza',
      customer: { name: 'Dr. Tariq', phone: '0300-9876543' },
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
          extras: [{ extraId: 'extra_dip', name: 'Extra Dip', price: 80, quantity: 1 }],
          specialInstructions: 'Make it extra crisp!',
          unitPrice: 530,
          quantity: 2,
          totalPrice: 1060,
          image: '',
        },
      ],
      subtotal: 1060,
      deliveryFee: 0,
      grandTotal: 1060,
      paymentMethod: 'cash_at_table',
      status: 'preparing',
      estimatedMinutes: 20,
      statusUpdates: [
        { status: 'received', time: '12 mins ago', note: 'Order sent by Waiter Ali Raza' },
        { status: 'preparing', time: '8 mins ago', note: 'Frying in hot oil by Kitchen Chef' },
      ],
      kitchenAcceptedAt: now - 8 * 60000,
    },
    {
      id: 'ord_sample_2',
      orderNumber: 'FW-8420',
      createdAt: new Date(now - 25 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      placedAtTimestamp: now - 25 * 60000,
      orderType: 'delivery',
      customer: {
        name: 'Saad Malik',
        phone: '0321-4455667',
        address: 'House 14, Street 8, Sector C, Bahria Town',
        deliveryNotes: 'Ring bell twice',
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
          extras: [],
          unitPrice: 600,
          quantity: 1,
          totalPrice: 600,
          image: '',
        },
      ],
      subtotal: 600,
      deliveryFee: 120,
      grandTotal: 720,
      paymentMethod: 'cash_on_delivery',
      status: 'out_for_delivery',
      estimatedMinutes: 30,
      statusUpdates: [
        { status: 'received', time: '25 mins ago', note: 'Online order placed' },
        { status: 'preparing', time: '20 mins ago', note: 'Kitchen preparing order' },
        { status: 'ready', time: '8 mins ago', note: 'Packed hot in thermal seal' },
        { status: 'out_for_delivery', time: '4 mins ago', note: 'Rider dispatched to Sector C' },
      ],
    },
  ];
}

/**
 * Orders Management
 */
export function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      const initial = getInitialOrders();
      localStorage.setItem(ORDERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialOrders();
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    broadcastUpdate('fryway_order_update', orders);
  } catch (e) {
    console.error('Failed to save orders to localStorage', e);
  }
}

export function addOrder(newOrder: Order): void {
  const current = getOrders();
  const updated = [newOrder, ...current];
  saveOrders(updated);

  // Play kitchen chime when a new order arrives
  audioAlerts.playNewOrderChime();
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string
): Order | null {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  const now = Date.now();
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const existing = orders[idx];
  const updatedOrder: Order = {
    ...existing,
    status,
    statusUpdates: [
      ...existing.statusUpdates,
      {
        status,
        time: timeStr,
        note: note || `Order status updated to ${status.replace('_', ' ')}`,
      },
    ],
  };

  if (status === 'preparing') {
    updatedOrder.kitchenAcceptedAt = now;
  }
  if (status === 'ready') {
    updatedOrder.readyAtTimestamp = now;
  }
  if (status === 'completed' || status === 'delivered') {
    updatedOrder.deliveredAtTimestamp = now;
  }

  orders[idx] = updatedOrder;
  saveOrders(orders);

  // If this order is ready and belongs to a waiter table, create notification!
  if (status === 'ready') {
    audioAlerts.playOrderReadyBell();
    if (existing.waiterId && existing.tableNumber) {
      addWaiterNotification({
        orderId: existing.id,
        orderNumber: existing.orderNumber,
        tableNumber: existing.tableNumber,
        waiterId: existing.waiterId,
        waiterName: existing.waiterName || 'Waiter',
        message: `Order #${existing.orderNumber} for ${existing.tableNumber} is FRESH & READY for table pickup!`,
      });
    }
  }

  return updatedOrder;
}

/**
 * Waiter Notifications
 */
export function getWaiterNotifications(): WaiterNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addWaiterNotification(
  notif: Omit<WaiterNotification, 'id' | 'timestamp' | 'read'>
): WaiterNotification {
  const all = getWaiterNotifications();
  const newNotif: WaiterNotification = {
    ...notif,
    id: 'notif_' + Date.now(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false,
  };
  const updated = [newNotif, ...all];
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  broadcastUpdate('fryway_notification_update', newNotif);
  return newNotif;
}

export function markNotificationRead(id: string): void {
  const all = getWaiterNotifications();
  const updated = all.map((n) => (n.id === id ? { ...n, read: true } : n));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  broadcastUpdate('fryway_notification_update');
}

export function clearAllNotifications(waiterId?: string): void {
  const all = getWaiterNotifications();
  const filtered = waiterId ? all.filter((n) => n.waiterId !== waiterId) : [];
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
  broadcastUpdate('fryway_notification_update');
}

/**
 * Expenses Management
 */
export function getExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    if (!raw) {
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_EXPENSES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_EXPENSES;
  }
}

export function addExpense(expenseData: Omit<Expense, 'id' | 'time'>): Expense {
  const all = getExpenses();
  const newExp: Expense = {
    ...expenseData,
    id: 'exp_' + Date.now(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  const updated = [newExp, ...all];
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(updated));
  broadcastUpdate('fryway_expense_update', newExp);
  return newExp;
}

export function deleteExpense(id: string): void {
  const all = getExpenses();
  const updated = all.filter((e) => e.id !== id);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(updated));
  broadcastUpdate('fryway_expense_update');
}

/**
 * Custom Menu Items & Live Availability
 */
export function getMenuItems(): MenuItem[] {
  try {
    const raw = localStorage.getItem(MENU_OVERRIDE_KEY);
    if (!raw) {
      return MENU_PRODUCTS.map((m) => ({ ...m, isAvailable: true }));
    }
    return JSON.parse(raw);
  } catch {
    return MENU_PRODUCTS.map((m) => ({ ...m, isAvailable: true }));
  }
}

export function saveMenuItems(items: MenuItem[]): void {
  localStorage.setItem(MENU_OVERRIDE_KEY, JSON.stringify(items));
  broadcastUpdate('fryway_menu_update', items);
}

export function toggleMenuItemAvailability(productId: string): MenuItem[] {
  const current = getMenuItems();
  const updated = current.map((item) =>
    item.id === productId ? { ...item, isAvailable: item.isAvailable === false ? true : false } : item
  );
  saveMenuItems(updated);
  return updated;
}

export function addCustomMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
  const current = getMenuItems();
  const newItem: MenuItem = {
    ...item,
    id: 'custom_item_' + Date.now(),
    isAvailable: true,
  };
  const updated = [...current, newItem];
  saveMenuItems(updated);
  return newItem;
}

export function updateMenuItem(productId: string, partial: Partial<MenuItem>): MenuItem[] {
  const current = getMenuItems();
  const updated = current.map((it) => (it.id === productId ? { ...it, ...partial } : it));
  saveMenuItems(updated);
  return updated;
}

export function deleteCustomMenuItem(productId: string): MenuItem[] {
  const current = getMenuItems();
  const updated = current.filter((it) => it.id !== productId);
  saveMenuItems(updated);
  return updated;
}

/**
 * Business Settings Management
 */
const SETTINGS_KEY = 'fryway_business_settings_v1';

export const DEFAULT_SETTINGS: BusinessSettings = {
  restaurantName: 'FRYWAY Authentic Hand Cut Fries',
  tagline: 'Authentic Hand Cut Fries Double Crisp',
  isOpen: true,
  phone: '+92 300 1234567',
  address: 'Sector C Commercial, Bahria Town, Lahore',
  openingHours: '1:00 PM – 2:00 AM Daily',
  deliveryFee: 150,
  freeDeliveryThreshold: 1200,
  currency: 'PKR',
  taxPercent: 0,
  discountPercent: 0,
};

export function getBusinessSettings(): BusinessSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function updateBusinessSettings(partial: Partial<BusinessSettings>): BusinessSettings {
  const current = getBusinessSettings();
  const updated: BusinessSettings = { ...current, ...partial };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  broadcastUpdate('fryway_settings_update', updated);
  return updated;
}

/**
 * Flavours & Sauces Availability Store
 */
const FLAVOURS_KEY = 'fryway_flavours_v2';
const SAUCES_KEY = 'fryway_sauces_v2';
const EXTRAS_KEY = 'fryway_extras_v2';

export interface ManagedFlavour extends FlavourItem {
  isAvailable: boolean;
}

export interface ManagedSauce extends SauceItem {
  isAvailable: boolean;
}

export interface ManagedExtra extends ExtraItem {
  isAvailable: boolean;
}

export function getFlavoursList(): ManagedFlavour[] {
  try {
    const raw = localStorage.getItem(FLAVOURS_KEY);
    if (!raw) {
      const initial: ManagedFlavour[] = FLAVOURS.map((f) => ({ ...f, isAvailable: true }));
      localStorage.setItem(FLAVOURS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return FLAVOURS.map((f) => ({ ...f, isAvailable: true }));
  }
}

export function toggleFlavourAvailability(id: string): ManagedFlavour[] {
  const list = getFlavoursList();
  const updated = list.map((f) => (f.id === id ? { ...f, isAvailable: !f.isAvailable } : f));
  localStorage.setItem(FLAVOURS_KEY, JSON.stringify(updated));
  broadcastUpdate('fryway_flavour_update', updated);
  return updated;
}

export function getSaucesList(): ManagedSauce[] {
  try {
    const raw = localStorage.getItem(SAUCES_KEY);
    if (!raw) {
      const initial: ManagedSauce[] = SAUCES.map((s) => ({ ...s, isAvailable: true }));
      localStorage.setItem(SAUCES_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return SAUCES.map((s) => ({ ...s, isAvailable: true }));
  }
}

export function toggleSauceAvailability(id: string): ManagedSauce[] {
  const list = getSaucesList();
  const updated = list.map((s) => (s.id === id ? { ...s, isAvailable: !s.isAvailable } : s));
  localStorage.setItem(SAUCES_KEY, JSON.stringify(updated));
  broadcastUpdate('fryway_sauce_update', updated);
  return updated;
}

export function getExtrasList(): ManagedExtra[] {
  try {
    const raw = localStorage.getItem(EXTRAS_KEY);
    if (!raw) {
      const initial: ManagedExtra[] = EXTRAS.map((e) => ({ ...e, isAvailable: true }));
      localStorage.setItem(EXTRAS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return EXTRAS.map((e) => ({ ...e, isAvailable: true }));
  }
}

export function toggleExtraAvailability(id: string): ManagedExtra[] {
  const list = getExtrasList();
  const updated = list.map((e) => (e.id === id ? { ...e, isAvailable: !e.isAvailable } : e));
  localStorage.setItem(EXTRAS_KEY, JSON.stringify(updated));
  broadcastUpdate('fryway_extra_update', updated);
  return updated;
}

export function updateExtraPrice(id: string, price: number): ManagedExtra[] {
  const list = getExtrasList();
  const updated = list.map((e) => (e.id === id ? { ...e, price } : e));
  localStorage.setItem(EXTRAS_KEY, JSON.stringify(updated));
  broadcastUpdate('fryway_extra_update', updated);
  return updated;
}

/**
 * Staff Management Store
 */
const STAFF_KEY = 'fryway_staff_members_v1';

export const DEFAULT_STAFF: StaffMember[] = [
  { id: 'st_1', name: 'Malik Zeeshan', role: 'admin', pin: '7777', phone: '0300-1112233', status: 'active', joinedDate: '2024-01-15' },
  { id: 'st_2', name: 'Chef Tariq Mehmood', role: 'kitchen', pin: '5555', phone: '0321-4445566', status: 'active', joinedDate: '2024-02-01' },
  { id: 'st_3', name: 'Usman Ali', role: 'counter', pin: '3333', phone: '0333-7778899', status: 'active', joinedDate: '2024-03-10' },
  { id: 'st_4', name: 'Hamza Khan', role: 'counter', pin: '2222', phone: '0345-9990011', status: 'active', joinedDate: '2024-04-05' },
];

export function getStaffMembers(): StaffMember[] {
  try {
    const raw = localStorage.getItem(STAFF_KEY);
    if (!raw) {
      localStorage.setItem(STAFF_KEY, JSON.stringify(DEFAULT_STAFF));
      return DEFAULT_STAFF;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_STAFF;
  }
}

export function addStaffMember(staff: Omit<StaffMember, 'id' | 'joinedDate'>): StaffMember {
  const current = getStaffMembers();
  const newStaff: StaffMember = {
    ...staff,
    id: 'st_' + Date.now(),
    joinedDate: new Date().toISOString().split('T')[0],
  };
  const updated = [...current, newStaff];
  localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
  broadcastUpdate('fryway_staff_update', updated);
  return newStaff;
}

export function toggleStaffStatus(id: string): StaffMember[] {
  const current = getStaffMembers();
  const updated = current.map((st) =>
    st.id === id ? { ...st, status: (st.status === 'active' ? 'disabled' : 'active') as 'active' | 'disabled' } : st
  );
  localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
  broadcastUpdate('fryway_staff_update', updated);
  return updated;
}

export function updateStaffPin(id: string, pin: string): StaffMember[] {
  const current = getStaffMembers();
  const updated = current.map((st) => (st.id === id ? { ...st, pin } : st));
  localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
  broadcastUpdate('fryway_staff_update', updated);
  return updated;
}

/**
 * Customer Directory Derived From Live & Historic Orders
 */
export interface CustomerSummary {
  name: string;
  phone: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: Order[];
}

export function getCustomerDirectory(): CustomerSummary[] {
  const allOrders = getOrders();
  const customerMap = new Map<string, CustomerSummary>();

  allOrders.forEach((ord) => {
    const phone = ord.customer.phone.trim();
    const key = phone || ord.customer.name.trim();
    if (!key) return;

    const existing = customerMap.get(key);
    if (!existing) {
      customerMap.set(key, {
        name: ord.customer.name,
        phone: ord.customer.phone,
        address: ord.customer.address,
        totalOrders: 1,
        totalSpent: ord.grandTotal,
        lastOrderDate: ord.createdAt,
        orders: [ord],
      });
    } else {
      existing.totalOrders += 1;
      existing.totalSpent += ord.grandTotal;
      if (ord.customer.address && !existing.address) {
        existing.address = ord.customer.address;
      }
      existing.orders.push(ord);
    }
  });

  return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}

