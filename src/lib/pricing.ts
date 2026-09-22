import { CartItem, FriesSize, FriesStyle, OrderType, SelectedExtra } from '../types';
import { RESTAURANT_INFO, SIZE_PRICING } from '../data/menuData';

/**
 * Calculates item unit price based on Size, Style (plain/masala/sauce/masala_sauce) and extras
 */
export function calculateItemUnitPrice(
  size: FriesSize,
  style: FriesStyle,
  extras: SelectedExtra[] = []
): number {
  const sizeConfig = SIZE_PRICING[size];
  if (!sizeConfig) return 0;

  const baseVariantPrice = sizeConfig.prices[style] ?? sizeConfig.prices.plain;
  const extrasTotal = extras.reduce((sum, extra) => sum + extra.price * extra.quantity, 0);

  return baseVariantPrice + extrasTotal;
}

export const calculateItemPrice = (
  size: FriesSize,
  style: FriesStyle,
  _flavour?: any,
  _sauce?: any,
  extras: SelectedExtra[] = []
): number => {
  return calculateItemUnitPrice(size, style, extras);
};


/**
 * Calculates the total subtotal of all cart items
 */
export function calculateCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
}

/**
 * Calculates delivery fee based on order type and subtotal
 */
export function calculateDeliveryFee(orderType: OrderType, subtotal: number): number {
  if (orderType === 'takeaway') {
    return 0;
  }
  if (subtotal >= RESTAURANT_INFO.freeDeliveryThreshold) {
    return 0;
  }
  return RESTAURANT_INFO.deliveryFee;
}

/**
 * Calculates final grand total
 */
export function calculateGrandTotal(subtotal: number, deliveryFee: number): number {
  return subtotal + deliveryFee;
}

/**
 * Formats price into standard Pakistani Rupee representation
 */
export function formatPKR(amount: number): string {
  return `Rs ${amount.toLocaleString('en-PK')}`;
}
