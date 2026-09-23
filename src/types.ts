export type FriesSize = 'regular' | 'medium' | 'large';

export type FriesStyle = 'plain' | 'masala' | 'sauce' | 'masala_sauce';

export interface FlavourItem {
  id: string;
  name: string;
  description: string;
  category: 'spicy' | 'cheesy' | 'tangy' | 'savory' | 'herbal';
  heatLevel: 0 | 1 | 2 | 3;
  popular?: boolean;
  isAvailable?: boolean;
  nutrition?: NutritionInfo;
  details?: ProductDetail[];
  ingredients?: string[];
  allergenNote?: string;
  servingNote?: string;
}

export interface SauceItem {
  id: string;
  name: string;
  description: string;
  profile: 'creamy' | 'tangy' | 'hot' | 'smokey';
  heatLevel: 0 | 1 | 2 | 3;
  popular?: boolean;
  isAvailable?: boolean;
  nutrition?: NutritionInfo;
  details?: ProductDetail[];
  ingredients?: string[];
  allergenNote?: string;
  servingNote?: string;
}

export interface ExtraItem {
  id: string;
  name: string;
  price: number;
  category: 'dip' | 'sachet';
  description?: string;
  isAvailable?: boolean;
  nutrition?: NutritionInfo;
  details?: ProductDetail[];
  ingredients?: string[];
  allergenNote?: string;
  servingNote?: string;
}

export interface SizePricing {
  size: FriesSize;
  label: string;
  portionWeight: string;
  description: string;
  prices: {
    plain: number;
    masala: number;
    sauce: number;
    masala_sauce: number;
  };
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sodium: number;
}

export interface ProductDetail {
  label: string;
  value: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'fries' | 'extras';
  size?: FriesSize;
  tagline: string;
  description: string;
  basePrice: number;
  image: string;
  badge?: string;
  popular?: boolean;
  isAvailable?: boolean;
  nutrition?: NutritionInfo;
  details?: ProductDetail[];
  ingredients?: string[];
  allergenNote?: string;
  servingNote?: string;
}

export interface SelectedExtra {
  extraId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  id: string; // unique item instance id
  productId: string;
  name: string;
  size: FriesSize;
  sizeLabel: string;
  style: FriesStyle;
  flavour?: FlavourItem;
  sauce?: SauceItem;
  extras: SelectedExtra[];
  specialInstructions?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  image: string;
  nutrition?: NutritionInfo;
  details?: ProductDetail[];
  ingredients?: string[];
  allergenNote?: string;
  servingNote?: string;
}

export type OrderType = 'takeaway' | 'delivery';

export type OrderStatus =
  | 'received'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface OrderCustomer {
  name: string;
  phone: string;
  address?: string;
  deliveryNotes?: string;
}

export interface OrderStatusUpdate {
  status: OrderStatus;
  time: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  placedAtTimestamp: number;
  orderType: OrderType;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: 'cash_on_delivery' | 'cash_on_pickup' | 'card_at_counter';
  status: OrderStatus;
  estimatedMinutes: number; // e.g. 15-25 mins
  statusUpdates: OrderStatusUpdate[];
  kitchenAcceptedAt?: number;
  readyAtTimestamp?: number;
  deliveredAtTimestamp?: number;
}

export type ExpenseCategory =
  | 'potatoes_produce'
  | 'cooking_oil'
  | 'sauces_spices'
  | 'packaging'
  | 'utilities_gas'
  | 'salaries'
  | 'delivery_fuel'
  | 'maintenance_misc'
  | 'marketing';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string; // YYYY-MM-DD
  time?: string;
  paymentMethod?: 'cash' | 'bank_transfer' | 'petty_cash';
  notes?: string;
}

export type AppRole = 'customer' | 'kitchen' | 'admin';

export interface StaffMember {
  id: string;
  name: string;
  role: 'admin' | 'kitchen' | 'counter';
  pin: string;
  phone?: string;
  status: 'active' | 'disabled';
  joinedDate: string;
}

export interface BusinessSettings {
  restaurantName: string;
  tagline: string;
  isOpen: boolean;
  phone: string;
  address: string;
  openingHours: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  minOrderAmount: number;
  currency: string;
  taxPercent: number;
  discountPercent: number;
}

