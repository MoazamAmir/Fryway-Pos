import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Plus, Minus, Sparkles, Flame, Droplets, UtensilsCrossed, ShieldAlert } from 'lucide-react';
import {
  CartItem,
  ExtraItem,
  FlavourItem,
  FriesSize,
  FriesStyle,
  MenuItem,
  SauceItem,
  SelectedExtra,
} from '../../types';
import { EXTRAS, FLAVOURS, SAUCES, SIZE_PRICING } from '../../data/menuData';
import { calculateItemUnitPrice, formatPKR } from '../../lib/pricing';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: MenuItem | null;
  onAddToCart: (item: CartItem) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}) => {
  // Size selection
  const [selectedSize, setSelectedSize] = useState<FriesSize>(
    product?.size || 'medium'
  );

  // Style / Preparation
  const [selectedStyle, setSelectedStyle] = useState<FriesStyle>('masala_sauce');

  // Flavour selection
  const [selectedFlavour, setSelectedFlavour] = useState<FlavourItem>(
    FLAVOURS.find((f) => f.id === 'tikka') || FLAVOURS[0]
  );

  // Sauce selection
  const [selectedSauce, setSelectedSauce] = useState<SauceItem>(
    SAUCES.find((s) => s.id === 'garlic_mayo') || SAUCES[0]
  );

  // Extra Dip selection if extra dip is added
  const [extraDipSauce, setExtraDipSauce] = useState<SauceItem>(
    SAUCES.find((s) => s.id === 'cheese_mayo') || SAUCES[1]
  );

  // Extras state
  const [extraDipQty, setExtraDipQty] = useState<number>(0);
  const [ketchupDipQty, setKetchupDipQty] = useState<number>(0);
  const [ketchupSachetQty, setKetchupSachetQty] = useState<number>(0);

  // Special instructions
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Overall Item Quantity
  const [quantity, setQuantity] = useState<number>(1);

  // Validation state
  const [validationError, setValidationError] = useState<string | null>(null);

  // Calculate extras list
  const selectedExtras: SelectedExtra[] = useMemo(() => {
    const list: SelectedExtra[] = [];
    if (extraDipQty > 0) {
      const extraDipConfig = EXTRAS.find((e) => e.id === 'extra_dip')!;
      list.push({
        extraId: 'extra_dip',
        name: `Extra Dip (${extraDipSauce.name})`,
        price: extraDipConfig.price,
        quantity: extraDipQty,
      });
    }
    if (ketchupDipQty > 0) {
      const ketchupDipConfig = EXTRAS.find((e) => e.id === 'ketchup_chilli_dip')!;
      list.push({
        extraId: 'ketchup_chilli_dip',
        name: ketchupDipConfig.name,
        price: ketchupDipConfig.price,
        quantity: ketchupDipQty,
      });
    }
    if (ketchupSachetQty > 0) {
      const sachetConfig = EXTRAS.find((e) => e.id === 'ketchup_sachet')!;
      list.push({
        extraId: 'ketchup_sachet',
        name: sachetConfig.name,
        price: sachetConfig.price,
        quantity: ketchupSachetQty,
      });
    }
    return list;
  }, [extraDipQty, extraDipSauce, ketchupDipQty, ketchupSachetQty]);

  // Calculate real-time prices
  const unitPrice = useMemo(() => {
    return calculateItemUnitPrice(selectedSize, selectedStyle, selectedExtras);
  }, [selectedSize, selectedStyle, selectedExtras]);

  const totalPrice = useMemo(() => {
    return unitPrice * quantity;
  }, [unitPrice, quantity]);

  // Handle Add to Cart
  const handleConfirm = () => {
    // Validate if flavour or sauce is required
    if ((selectedStyle === 'masala' || selectedStyle === 'masala_sauce') && !selectedFlavour) {
      setValidationError('Please select a seasoning flavour.');
      return;
    }
    if ((selectedStyle === 'sauce' || selectedStyle === 'masala_sauce') && !selectedSauce) {
      setValidationError('Please select a gourmet sauce.');
      return;
    }

    setValidationError(null);

    const sizeConfig = SIZE_PRICING[selectedSize];

    const newItem: CartItem = {
      id: `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: product?.id || 'fries',
      name: `${sizeConfig.label}`,
      size: selectedSize,
      sizeLabel: sizeConfig.label,
      style: selectedStyle,
      flavour: selectedStyle === 'masala' || selectedStyle === 'masala_sauce' ? selectedFlavour : undefined,
      sauce: selectedStyle === 'sauce' || selectedStyle === 'masala_sauce' ? selectedSauce : undefined,
      extras: selectedExtras,
      specialInstructions: specialInstructions.trim() || undefined,
      unitPrice,
      quantity,
      totalPrice,
      image: product?.image || '',
    };

    onAddToCart(newItem);
    onClose();
  };

  if (!isOpen || !product) return null;

  const currentSizeConfig = SIZE_PRICING[selectedSize];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window / Bottom Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col z-10 overflow-hidden"
        >
          {/* Header with image banner */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-emerald-950 shrink-0">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

            {/* Close button */}
            <button
              id="customization-close-btn"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Product Title Badge */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/90 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                Hand-Cut Authentic Potato
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] uppercase tracking-tight text-white leading-tight break-words">
                {product.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 line-clamp-1">
                {currentSizeConfig.description}
              </p>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto px-5 sm:px-7 py-6 space-y-7 flex-1">
            {/* 1. SIZE SELECTION */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-black uppercase text-neutral-900 tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  Select Portion Size
                </label>
                <span className="text-xs text-neutral-500 font-semibold">Required</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {(['regular', 'medium', 'large'] as FriesSize[]).map((sizeKey) => {
                  const cfg = SIZE_PRICING[sizeKey];
                  const isSelected = selectedSize === sizeKey;
                  return (
                    <button
                      key={sizeKey}
                      id={`size-option-${sizeKey}`}
                      type="button"
                      onClick={() => setSelectedSize(sizeKey)}
                      className={`relative p-3 sm:p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-800 bg-emerald-50/70 shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-emerald-800 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                      <div>
                        <div className="text-xs font-black uppercase text-neutral-900 leading-tight">
                          {cfg.label.replace(' Fries', '')}
                        </div>
                        <div className="text-[11px] text-neutral-500">{cfg.portionWeight}</div>
                      </div>
                      <div className="mt-2 text-xs sm:text-sm font-bold text-emerald-900">
                        {formatPKR(cfg.prices[selectedStyle] || cfg.prices.plain)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. STYLE / PREPARATION SELECTION */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-black uppercase text-neutral-900 tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  Preparation & Loading
                </label>
                <span className="text-xs text-neutral-500 font-semibold">Required</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {[
                  {
                    id: 'plain' as FriesStyle,
                    label: 'Plain Fries',
                    sub: 'Crispy salted golden hand-cut',
                    price: currentSizeConfig.prices.plain,
                    icon: UtensilsCrossed,
                  },
                  {
                    id: 'masala' as FriesStyle,
                    label: 'Add Masala',
                    sub: 'Tossed in 1 seasoning flavour',
                    price: currentSizeConfig.prices.masala,
                    icon: Flame,
                  },
                  {
                    id: 'sauce' as FriesStyle,
                    label: 'Add Sauce',
                    sub: 'Drizzled with 1 gourmet sauce',
                    price: currentSizeConfig.prices.sauce,
                    icon: Droplets,
                  },
                  {
                    id: 'masala_sauce' as FriesStyle,
                    label: 'Add Masala & Sauce',
                    sub: 'The full loaded signature experience',
                    price: currentSizeConfig.prices.masala_sauce,
                    icon: Sparkles,
                    badge: 'Recommended',
                  },
                ].map((styleOpt) => {
                  const isSelected = selectedStyle === styleOpt.id;
                  const Icon = styleOpt.icon;
                  return (
                    <button
                      key={styleOpt.id}
                      id={`style-option-${styleOpt.id}`}
                      type="button"
                      onClick={() => setSelectedStyle(styleOpt.id)}
                      className={`relative p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-800 bg-emerald-50/70 shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      {styleOpt.badge && (
                        <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[9px] uppercase tracking-wider shadow-xs">
                          {styleOpt.badge}
                        </span>
                      )}
                      <div className="flex items-start gap-2 mb-2">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-emerald-800 text-white' : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-neutral-900">
                            {styleOpt.label}
                          </div>
                          <div className="text-[11px] text-neutral-500 line-clamp-1">{styleOpt.sub}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-neutral-100">
                        <span className="text-xs font-bold text-emerald-900">{formatPKR(styleOpt.price)}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-800 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. FLAVOUR SELECTION (Only when style has masala) */}
            {(selectedStyle === 'masala' || selectedStyle === 'masala_sauce') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black uppercase text-neutral-900 tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center font-bold">
                      3
                    </span>
                    Choose Seasoning Flavour (17 Options)
                  </label>
                  <span className="text-xs font-bold text-emerald-800">
                    Selected: {selectedFlavour?.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 border border-neutral-200 rounded-2xl">
                  {FLAVOURS.map((flav) => {
                    const isSelected = selectedFlavour?.id === flav.id;
                    return (
                      <button
                        key={flav.id}
                        id={`flavour-option-${flav.id}`}
                        type="button"
                        onClick={() => setSelectedFlavour(flav)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-1.5 min-h-[42px] ${
                          isSelected
                            ? 'border-emerald-800 bg-emerald-800 text-white font-bold shadow-xs'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800 font-medium'
                        }`}
                      >
                        <span className="leading-tight break-words">{flav.name}</span>
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 shrink-0 stroke-[3]" />
                        ) : (
                          flav.heatLevel > 1 && (
                            <Flame className="w-3 h-3 text-amber-500 shrink-0" />
                          )
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 4. SAUCE SELECTION (Only when style has sauce) */}
            {(selectedStyle === 'sauce' || selectedStyle === 'masala_sauce') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black uppercase text-neutral-900 tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center font-bold">
                      {selectedStyle === 'masala_sauce' ? '4' : '3'}
                    </span>
                    Choose Gourmet Sauce (13 Options)
                  </label>
                  <span className="text-xs font-bold text-emerald-800">
                    Selected: {selectedSauce?.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 border border-neutral-200 rounded-2xl">
                  {SAUCES.map((sc) => {
                    const isSelected = selectedSauce?.id === sc.id;
                    return (
                      <button
                        key={sc.id}
                        id={`sauce-option-${sc.id}`}
                        type="button"
                        onClick={() => setSelectedSauce(sc)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-1.5 min-h-[42px] ${
                          isSelected
                            ? 'border-emerald-800 bg-emerald-800 text-white font-bold shadow-xs'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800 font-medium'
                        }`}
                      >
                        <span className="leading-tight break-words">{sc.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 5. EXTRAS & DIPS */}
            <div className="space-y-3">
              <label className="text-sm font-black uppercase text-neutral-900 tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-800 text-xs flex items-center justify-center font-bold">
                  +
                </span>
                Add Extras & Dips (Optional)
              </label>

              <div className="space-y-2.5">
                {/* Extra Dip Cup */}
                <div className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <span>Extra Gourmet Dip (Sealed Cup)</span>
                      <span className="text-emerald-800 font-bold">+Rs 80</span>
                    </div>
                    {/* Choose sauce for this extra dip */}
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-[11px] text-neutral-500 font-medium">Dip Flavor:</span>
                      <select
                        value={extraDipSauce.id}
                        onChange={(e) => {
                          const found = SAUCES.find((s) => s.id === e.target.value);
                          if (found) setExtraDipSauce(found);
                        }}
                        className="text-xs font-semibold bg-white border border-neutral-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      >
                        {SAUCES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => setExtraDipQty(Math.max(0, extraDipQty - 1))}
                      disabled={extraDipQty === 0}
                      className="w-7 h-7 rounded-lg bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-neutral-900 w-4 text-center">
                      {extraDipQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExtraDipQty(extraDipQty + 1)}
                      className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center hover:bg-emerald-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Ketchup / Chilli Garlic Dip */}
                <div className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-neutral-900">
                      Ketchup / Chilli Garlic Dip Cup
                    </div>
                    <div className="text-[11px] text-emerald-800 font-semibold">+Rs 50</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setKetchupDipQty(Math.max(0, ketchupDipQty - 1))}
                      disabled={ketchupDipQty === 0}
                      className="w-7 h-7 rounded-lg bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-neutral-900 w-4 text-center">
                      {ketchupDipQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setKetchupDipQty(ketchupDipQty + 1)}
                      className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center hover:bg-emerald-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Ketchup Sachet */}
                <div className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-neutral-900">Ketchup Sachet</div>
                    <div className="text-[11px] text-emerald-800 font-semibold">+Rs 20</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setKetchupSachetQty(Math.max(0, ketchupSachetQty - 1))}
                      disabled={ketchupSachetQty === 0}
                      className="w-7 h-7 rounded-lg bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-neutral-900 w-4 text-center">
                      {ketchupSachetQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setKetchupSachetQty(ketchupSachetQty + 1)}
                      className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center hover:bg-emerald-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. SPECIAL INSTRUCTIONS */}
            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 tracking-wider block mb-1.5">
                Special Kitchen Instructions (Optional)
              </label>
              <input
                id="customization-instructions-input"
                type="text"
                placeholder="e.g. Extra crispy, keep sauce on the side, less spicy..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              />
            </div>

            {validationError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* Sticky Bottom Bar with Real-Time Total and Add to Cart */}
          <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-4 shrink-0">
            {/* Quantity Controller */}
            <div className="flex items-center bg-white border border-neutral-300 rounded-2xl p-1 shadow-xs">
              <button
                id="customization-qty-decrease"
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-700 hover:bg-neutral-100 active:scale-95 transition-all"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-9 text-center font-black text-sm text-neutral-900">
                {quantity}
              </span>
              <button
                id="customization-qty-increase"
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-700 hover:bg-neutral-100 active:scale-95 transition-all"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Order Button with Dynamic Real-time Calculation */}
            <button
              id="customization-add-to-order-btn"
              type="button"
              onClick={handleConfirm}
              className="flex-1 flex items-center justify-between px-5 sm:px-6 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-950/20 active:scale-98 transition-all focus:outline-none"
            >
              <span>Add to Order</span>
              <span className="font-extrabold text-amber-300 tracking-wide">
                {formatPKR(totalPrice)}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
