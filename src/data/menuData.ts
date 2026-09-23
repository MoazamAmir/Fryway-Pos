import {
  ExtraItem,
  FlavourItem,
  MenuItem,
  SauceItem,
  SizePricing,
} from '../types';

import heroFriesImg from '../assets/images/fryway_hero_fries_1789927482947.jpg';
import plainFriesImg from '../assets/images/fryway_menu_plain_1789927497927.jpg';
import loadedFriesImg from '../assets/images/fryway_menu_loaded_1789927509517.jpg';
import saucesDipsImg from '../assets/images/fryway_sauces_dips_1789927521099.jpg';
import storeCraftImg from '../assets/images/fryway_store_craft_1789927534351.jpg';

export const FRYWAY_IMAGES = {
  hero: heroFriesImg,
  plainFries: plainFriesImg,
  loadedFries: loadedFriesImg,
  saucesDips: saucesDipsImg,
  storeCraft: storeCraftImg,
};

export const SIZE_PRICING: Record<'regular' | 'medium' | 'large', SizePricing> = {
  regular: {
    size: 'regular',
    label: 'Regular Fries',
    portionWeight: 'Approx 220g',
    description: 'Perfect personal portion of golden, fresh hand-cut potatoes crisp to perfection.',
    prices: {
      plain: 230,
      masala: 260,
      sauce: 300,
      masala_sauce: 330,
    },
  },
  medium: {
    size: 'medium',
    label: 'Medium Fries',
    portionWeight: 'Approx 350g',
    description: 'Generous sharing portion or serious appetite satisfaction with rich crunch.',
    prices: {
      plain: 340,
      masala: 370,
      sauce: 420,
      masala_sauce: 450,
    },
  },
  large: {
    size: 'large',
    label: 'Large Fries',
    portionWeight: 'Approx 500g',
    description: 'The ultimate feast portion, perfect for friends, family, and loaded fry lovers.',
    prices: {
      plain: 430,
      masala: 470,
      sauce: 550,
      masala_sauce: 600,
    },
  },
};

export const FLAVOURS: FlavourItem[] = [
  { id: 'herb_yogurt', name: 'Herb & Yogurt', description: 'Fresh Mediterranean herb blend balanced with cool creamy undertones', category: 'herbal', heatLevel: 0, popular: true },
  { id: 'mexican', name: 'Mexican', description: 'Zesty chili-lime spice infused with toasted cumin and Mexican paprika', category: 'spicy', heatLevel: 2, popular: true },
  { id: 'tikka', name: 'Tikka', description: 'Subcontinental charred barbecue spice with aromatic smokey notes', category: 'spicy', heatLevel: 2, popular: true },
  { id: 'fajita', name: 'Fajita', description: 'Smoky grilled pepper and onion seasoning with savoury depth', category: 'savory', heatLevel: 1 },
  { id: 'hot_sour', name: 'Hot & Sour', description: 'Exciting Sichuan-inspired tang with an electric chili kick', category: 'tangy', heatLevel: 2 },
  { id: 'chicken_chat_pati', name: 'Chicken Chat Pati', description: 'Desi tangy-sour spicy seasoning loaded with street-food punch', category: 'spicy', heatLevel: 3, popular: true },
  { id: 'afghani_spicy', name: 'Afghani Spicy', description: 'Robust mountain spice mix with black pepper and mild chili flare', category: 'spicy', heatLevel: 2 },
  { id: 'pizza', name: 'Pizza', description: 'Oregano, basil, sun-dried tomato seasoning with melted cheese aromatics', category: 'savory', heatLevel: 0, popular: true },
  { id: 'butter_garlic', name: 'Butter Garlic', description: 'Velvety toasted garlic notes infused with rich butter essence', category: 'savory', heatLevel: 0, popular: true },
  { id: 'garlic', name: 'Garlic', description: 'Punchy roasted golden garlic dust with sea salt crystals', category: 'savory', heatLevel: 0 },
  { id: 'cheese', name: 'Cheese', description: 'Classic aged cheddar dusting for cheese lovers', category: 'cheesy', heatLevel: 0, popular: true },
  { id: 'butter_cheese', name: 'Butter Cheese', description: 'Decadent melt-in-mouth creamy cheese with butter warmth', category: 'cheesy', heatLevel: 0 },
  { id: 'bbq_smoke', name: 'BBQ Smoke', description: 'Deep hickory smoke with sweet brown sugar notes and cracked pepper', category: 'savory', heatLevel: 1 },
  { id: 'lemon_achari', name: 'Lemon Achari', description: 'Traditional pickled spiced mango and lemon zest excitement', category: 'tangy', heatLevel: 2, popular: true },
  { id: 'chat_masala', name: 'Chat Masala', description: 'Classic Pakistani street-style black salt and roasted cumin burst', category: 'tangy', heatLevel: 1, popular: true },
  { id: 'tandoori_masala', name: 'Tandoori Masala', description: 'Clay-oven inspired crimson rub with garam masala and fenugreek', category: 'spicy', heatLevel: 2 },
  { id: 'jalapeno_masala', name: 'Jalapeno Masala', description: 'Fiery green jalapeno powder with sharp zesty finish', category: 'spicy', heatLevel: 3, popular: true },
];

export const SAUCES: SauceItem[] = [
  { id: 'garlic_mayo', name: 'Garlic Mayo', description: 'Creamy house mayonnaise infused with slow-roasted crushed garlic', profile: 'creamy', heatLevel: 0, popular: true },
  { id: 'cheese_mayo', name: 'Cheese Mayo', description: 'Velvety cheddar blend folded into luscious emulsified mayonnaise', profile: 'creamy', heatLevel: 0, popular: true },
  { id: 'plain_mayo', name: 'Plain Mayo', description: 'Traditional smooth whole-egg creamy mayonnaise', profile: 'creamy', heatLevel: 0 },
  { id: 'cocktail', name: 'Cocktail', description: 'Tangy ketchup-mayo blend with aromatic Worcestershire seasoning', profile: 'tangy', heatLevel: 0, popular: true },
  { id: 'bbq', name: 'BBQ', description: 'Dark, sweet molasses-glazed barbecue sauce with hickory wood smoke', profile: 'smokey', heatLevel: 1 },
  { id: 'mustard_mayo', name: 'Mustard Mayo', description: 'Dijon tang married with smooth cream for a sharp gourmet bite', profile: 'tangy', heatLevel: 1 },
  { id: 'hot_sauce', name: 'Hot Sauce', description: 'Aged red pepper vinegar sauce delivering pure fiery intensity', profile: 'hot', heatLevel: 3, popular: true },
  { id: 'buffalo', name: 'Buffalo', description: 'New York style cayenne butter sauce with tangy acidic snap', profile: 'hot', heatLevel: 2 },
  { id: 'thousand_island', name: 'Thousand Island', description: 'Pickle relish, paprika, and sweet cream for classic comfort', profile: 'tangy', heatLevel: 0 },
  { id: 'green_chilli', name: 'Green Chilli', description: 'Fresh crushed Pakistani desi green chillies with mint & coriander', profile: 'hot', heatLevel: 3, popular: true },
  { id: 'ranch', name: 'Ranch', description: 'Buttermilk dressing loaded with dill, parsley, and roasted chives', profile: 'creamy', heatLevel: 0, popular: true },
  { id: 'chilli_garlic', name: 'Chilli Garlic', description: 'Bold chili flakes infused with minced garlic and tangy tomato puree', profile: 'hot', heatLevel: 2, popular: true },
  { id: 'ketchup', name: 'Ketchup', description: 'Sweet ripe tomato ketchup made with organic vine tomatoes', profile: 'tangy', heatLevel: 0 },
];

export const EXTRAS: ExtraItem[] = [
  { id: 'extra_dip', name: 'Extra Dip (Gourmet Cup)', price: 80, category: 'dip', description: 'Your choice of any of our 13 artisan signature sauces in a sealed dipping cup' },
  { id: 'ketchup_chilli_dip', name: 'Ketchup / Chilli Garlic Dip', price: 50, category: 'dip', description: 'Special side cup of our signature premium tomato or chili garlic dip' },
  { id: 'ketchup_sachet', name: 'Ketchup Sachet', price: 20, category: 'sachet', description: 'Single-serve sealed ketchup sachet' },
];

export const MENU_PRODUCTS: MenuItem[] = [
  {
    id: 'fries_regular',
    name: 'Regular Hand-Cut Fries',
    category: 'fries',
    size: 'regular',
    tagline: 'Freshly cut daily from premium Pakistani potatoes',
    description: 'Golden crispy exterior with tender fluffy potato interior. Hand-cut to order and tossed in sea salt or custom seasoning.',
    basePrice: 230,
    image: FRYWAY_IMAGES.plainFries,
    badge: 'Classic Single',
    popular: true,
  nutrition: { calories: 430, protein: 6, fat: 19, carbs: 58, sodium: 520 },
    details: [
      { label: 'Cut', value: 'Daily hand-cut skin-on potatoes' },
      { label: 'Cook', value: 'Double-cooked for crisp edges' },
      { label: 'Best with', value: 'Garlic Mayo or Chat Masala' },
    ],
    ingredients: ['Fresh potatoes', 'Sunflower cooking oil', 'Sea salt'],
    allergenNote: 'Prepared in a kitchen that handles dairy, egg, mustard, and spices.',
    servingNote: 'Approx values before selected masala, sauces, and extras.',
  },
  {
    id: 'fries_medium',
    name: 'Medium Hand-Cut Fries',
    category: 'fries',
    size: 'medium',
    tagline: 'Our most popular portion for fries lovers',
    description: 'Generous 350g portion. Hand-cut, double-cooked for signature crunch, customizable with your favorite seasonings and signature dips.',
    basePrice: 340,
    image: FRYWAY_IMAGES.loadedFries,
    badge: 'Most Popular',
    popular: true,
  nutrition: { calories: 690, protein: 9, fat: 31, carbs: 92, sodium: 760 },
    details: [
      { label: 'Portion', value: 'Signature 350g loaded portion' },
      { label: 'Texture', value: 'Crispy outside, fluffy center' },
      { label: 'Best with', value: 'Tikka Masala and Cheese Mayo' },
    ],
    ingredients: ['Fresh potatoes', 'Sunflower cooking oil', 'Sea salt'],
    allergenNote: 'Sauce selections may contain egg, dairy, mustard, or soy.',
    servingNote: 'Nutrition updates in cart based on selected loading style and extras.',
  },
  {
    id: 'fries_large',
    name: 'Large Hand-Cut Fries',
    category: 'fries',
    size: 'large',
    tagline: 'The ultimate loaded feast for sharing',
    description: 'Half a kilogram of authentic hand-cut indulgence. Customize with multiple flavours and sauces for the ultimate Fryway feast.',
    basePrice: 430,
    image: FRYWAY_IMAGES.hero,
    badge: 'Best Value',
    popular: true,
  nutrition: { calories: 980, protein: 13, fat: 45, carbs: 132, sodium: 1080 },
    details: [
      { label: 'Share size', value: 'Built for 2-3 fry lovers' },
      { label: 'Finish', value: 'Extra-crisp batch with generous topping room' },
      { label: 'Best with', value: 'Jalapeno Masala and Ranch drizzle' },
    ],
    ingredients: ['Fresh potatoes', 'Sunflower cooking oil', 'Sea salt'],
    allergenNote: 'Loaded styles may include dairy, egg, mustard, and chilli spice blends.',
    servingNote: 'Approx values before selected masala, sauces, and extras.',
  },
  {
    id: 'extra_gourmet_dips',
    name: 'Artisan Sauces & Dips',
    category: 'extras',
    tagline: '13 freshly blended house-made dipping sauces',
    description: 'Elevate your fry game with creamy Garlic Mayo, Cheese Mayo, fiery Green Chilli, BBQ, Ranch, and spicy Buffalo.',
    basePrice: 80,
    image: FRYWAY_IMAGES.saucesDips,
    badge: 'Handcrafted',
  nutrition: { calories: 145, protein: 1, fat: 13, carbs: 5, sodium: 290 },
    details: [
      { label: 'Range', value: '13 signature dips and sauce cups' },
      { label: 'Prep', value: 'Small-batch creamy and spicy blends' },
      { label: 'Use', value: 'Dip, drizzle, or keep on the side' },
    ],
    ingredients: ['House mayo base', 'Cheese blend', 'Garlic', 'Chilli', 'Herbs'],
    allergenNote: 'Most creamy dips contain egg and dairy; ask staff for sauce guidance.',
    servingNote: 'Approx values per gourmet sauce cup.',
  },
];

export const RESTAURANT_INFO = {
  name: 'FRYWAY',
  tagline: 'AUTHENTIC HAND CUT FRIES',
  phone: '0312-4424505',
  phoneDisplay: '0312-4424505',
  whatsappNumber: '923124424505',
  location: 'Bahria Town Lahore',
  city: 'Lahore, Pakistan',
  address: 'Commercial Sector C, Bahria Town, Lahore',
  deliveryFee: 120, // PKR
  freeDeliveryThreshold: 1200,
  minOrderAmount: 200,
  hours: 'Daily: 1:00 PM – 2:00 AM',
};


