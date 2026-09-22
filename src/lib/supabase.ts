/**
 * Supabase client and local storage synchronization layer for Fryway
 *
 * Prepared for Phase 2 Supabase connection without modifying frontend UI components.
 */

import { Order } from '../types';

export interface SupabaseConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  isConfigured: boolean;
}

export const SUPABASE_CONFIG: SupabaseConfig = {
  supabaseUrl: (import.meta as any).env?.VITE_SUPABASE_URL || '',
  supabaseAnonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
  isConfigured: Boolean(
    (import.meta as any).env?.VITE_SUPABASE_URL &&
    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY
  ),
};

const LOCAL_STORAGE_ORDERS_KEY = 'fryway_orders_v1';
const LOCAL_STORAGE_ACTIVE_ORDER_KEY = 'fryway_active_order_v1';

/**
 * Saves order to local persistence and dispatches to Supabase if configured
 */
export async function createOrderRecord(order: Order): Promise<{ success: boolean; orderId: string; error?: string }> {
  try {
    // 1. Local Storage persistence
    const existingOrders = getStoredOrders();
    const updatedOrders = [order, ...existingOrders];
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updatedOrders));
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_ORDER_KEY, JSON.stringify(order));

    // 2. Supabase Integration (Phase 2 ready)
    if (SUPABASE_CONFIG.isConfigured) {
      try {
        const response = await fetch(`${SUPABASE_CONFIG.supabaseUrl}/rest/v1/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_CONFIG.supabaseAnonKey!,
            Authorization: `Bearer ${SUPABASE_CONFIG.supabaseAnonKey!}`,
            Prefer: 'return=representation',
          },
          body: JSON.stringify({
            order_number: order.orderNumber,
            order_type: order.orderType,
            customer_name: order.customer.name,
            customer_phone: order.customer.phone,
            delivery_address: order.customer.address || null,
            subtotal: order.subtotal,
            delivery_fee: order.deliveryFee,
            grand_total: order.grandTotal,
            status: order.status,
            items: order.items,
            created_at: order.createdAt,
          }),
        });

        if (!response.ok) {
          console.warn('Supabase record creation deferred to local fallback:', await response.text());
        }
      } catch (cloudErr) {
        console.warn('Cloud sync offline, safely stored in local state:', cloudErr);
      }
    }

    return { success: true, orderId: order.id };
  } catch (err) {
    console.error('Failed to create order:', err);
    return { success: false, orderId: order.id, error: 'Could not record order locally.' };
  }
}

/**
 * Retrieves historical orders
 */
export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Retrieves active order
 */
export function getActiveOrder(): Order | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ACTIVE_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Updates order status in local storage
 */
export function updateOrderStatusLocal(orderId: string, newStatus: Order['status']): Order | null {
  try {
    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    const updated = {
      ...orders[index],
      status: newStatus,
      statusUpdates: [
        ...orders[index].statusUpdates,
        {
          status: newStatus,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Status updated to ${newStatus.replace('_', ' ')}`,
        },
      ],
    };

    orders[index] = updated;
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_ORDER_KEY, JSON.stringify(updated));

    return updated;
  } catch {
    return null;
  }
}
