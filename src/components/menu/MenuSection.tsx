import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, Plus, ArrowRight, Utensils, Check, Flame, AlertCircle } from 'lucide-react';
import { MenuItem, FriesSize } from '../../types';
import { EXTRAS, SIZE_PRICING } from '../../data/menuData';
import { formatPKR } from '../../lib/pricing';
import { getMenuItems } from '../../lib/restaurantStore';

interface MenuSectionProps {
  onCustomizeItem: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onCustomizeItem }) => {
  const [products, setProducts] = useState<MenuItem[]>(() => getMenuItems());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handleUpdate = () => {
      setProducts(getMenuItems());
    };
    window.addEventListener('fryway_menu_update', handleUpdate);
    return () => window.removeEventListener('fryway_menu_update', handleUpdate);
  }, []);

  const categories = [
    { id: 'all', label: 'Complete Menu' },
    { id: 'regular', label: 'Regular Fries' },
    { id: 'medium', label: 'Medium Fries' },
    { id: 'large', label: 'Large Fries' },
    { id: 'extras', label: 'Extras & Dips' },
  ];

  // Filtered menu items
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'extras' && product.category !== 'extras') return false;
      if (selectedCategory !== 'extras' && product.size !== selectedCategory) return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchTag = product.tagline.toLowerCase().includes(q);
      return matchName || matchDesc || matchTag;
    }
    return true;
  });


  return (
    <section id="menu" className="py-20 bg-neutral-50 relative fryway-section-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider mb-3">
              <Utensils className="w-3.5 h-3.5" />
              <span>Authentic Hand-Cut Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Plus_Jakarta_Sans',sans-serif] uppercase tracking-tight text-neutral-900 leading-tight">
              OUR FRIES MENU
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg mt-2 max-w-xl">
              Freshly cut daily from premium whole potatoes, cooked double-crisp, and loaded with your choice of seasonings and signature sauces.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="menu-search-input"
              type="text"
              placeholder="Search fries, sizes, flavours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm placeholder-neutral-400 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`menu-cat-btn-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/15'
                  : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product) => {
              const sizeKey = product.size as FriesSize | undefined;
              const pricing = sizeKey ? SIZE_PRICING[sizeKey] : null;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl overflow-hidden border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-emerald-800/30 transition-all duration-300 flex flex-col group pro-card"
                >
                  {/* Card Image Container */}
                  <div className="relative h-60 w-full overflow-hidden bg-neutral-100 hot-food-media">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="steam-wisps" aria-hidden="true"><span /><span /><span /><span /></div>
                    <span className="image-sheen" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-800/95 text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm backdrop-blur-xs">
                        {product.badge}
                      </span>
                    )}

                    {/* Portion Tag */}
                    {pricing && (
                      <span className="absolute bottom-3 left-4 text-xs font-bold text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                        {pricing.portionWeight}
                      </span>
                    )}
                  </div>

                  {/* Card Content Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <h3 className="text-lg sm:text-xl font-black font-['Plus_Jakarta_Sans',sans-serif] uppercase text-neutral-900 group-hover:text-emerald-900 transition-colors leading-tight break-words">
                          {product.name}
                        </h3>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                            From
                          </span>
                          <span className="text-lg font-black text-emerald-900">
                            {formatPKR(product.basePrice)}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-600 line-clamp-2 mb-4 leading-relaxed">
                        {product.description}
                      </p>
                      {product.nutrition && (
                        <div className="mb-4 grid grid-cols-5 gap-1.5">
                          {[
                            ['Cal', `${product.nutrition.calories}`],
                            ['Protein', `${product.nutrition.protein}g`],
                            ['Fat', `${product.nutrition.fat}g`],
                            ['Carbs', `${product.nutrition.carbs}g`],
                            ['Sodium', `${product.nutrition.sodium}mg`],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-xl bg-neutral-50 border border-neutral-200 px-2 py-2 text-center">
                              <div className="text-[9px] font-black uppercase text-neutral-400">{label}</div>
                              <div className="text-[11px] font-black text-neutral-900">{value}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {product.details && product.details.length > 0 && (
                        <div className="mb-4 grid grid-cols-1 gap-1.5 text-[11px]">
                          {product.details.slice(0, 3).map((detail) => (
                            <div key={detail.label} className="flex justify-between gap-3 rounded-xl bg-emerald-50/70 border border-emerald-100 px-3 py-2">
                              <span className="font-black uppercase text-emerald-900 shrink-0">{detail.label}</span>
                              <span className="text-neutral-700 text-right leading-snug">{detail.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Explicit Variant Breakdown Matrix */}
                      {pricing && (
                        <div className="mb-6 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5 text-xs">
                          <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">
                            Portion Pricing Breakdown
                          </div>
                          <div className="flex justify-between text-neutral-700">
                            <span>Plain Salted:</span>
                            <span className="font-bold text-neutral-900">{formatPKR(pricing.prices.plain)}</span>
                          </div>
                          <div className="flex justify-between text-neutral-700">
                            <span>Add Masala (17 Flavours):</span>
                            <span className="font-bold text-emerald-900">{formatPKR(pricing.prices.masala)}</span>
                          </div>
                          <div className="flex justify-between text-neutral-700">
                            <span>Add Sauce (13 Sauces):</span>
                            <span className="font-bold text-emerald-900">{formatPKR(pricing.prices.sauce)}</span>
                          </div>
                          <div className="flex justify-between text-neutral-700 pt-1 border-t border-neutral-200 font-semibold">
                            <span className="text-emerald-900 font-bold">Add Masala & Sauce:</span>
                            <span className="font-black text-emerald-950">{formatPKR(pricing.prices.masala_sauce)}</span>
                          </div>
                        </div>
                      )}

                      {/* Extras quick summary if extras card */}
                      {product.category === 'extras' && (
                        <div className="mb-6 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5 text-xs">
                          <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">
                            Available Dips & Extras
                          </div>
                          {EXTRAS.map((e) => (
                            <div key={e.id} className="flex justify-between text-neutral-700">
                              <span>{e.name}:</span>
                              <span className="font-bold text-emerald-900">{formatPKR(e.price)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      id={`menu-customize-btn-${product.id}`}
                      onClick={() => product.isAvailable !== false && onCustomizeItem(product)}
                      disabled={product.isAvailable === false}
                      className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all focus:outline-none ${
                        product.isAvailable !== false
                          ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-950/10 cursor-pointer'
                          : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                      }`}
                    >
                      {product.isAvailable !== false ? (
                        <>
                          <Plus className="w-4 h-4 text-amber-300" />
                          <span>CUSTOMIZE & ORDER</span>
                        </>
                      ) : (
                        <span>TEMPORARILY SOLD OUT</span>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty Search Result State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8 max-w-md mx-auto">
            <Utensils className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-neutral-800 mb-1">No Menu Items Found</h3>
            <p className="text-xs text-neutral-500 mb-4">
              We couldn't find any fries matching "{searchQuery}". Try searching for another size, flavour, or sauce.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Extras Quick Add-on Strip */}
        <div className="mt-14 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm pro-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                Gourmet Add-ons
              </span>
              <h3 className="text-2xl font-black font-['Syne',sans-serif] uppercase text-neutral-900">
                Sides & Extra Dipping Cups
              </h3>
            </div>
            <p className="text-xs text-neutral-500 max-w-md">
              Order extra cups of our 13 signature sauces or single-serve sachets to accompany your meal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {EXTRAS.map((extra) => (
              <div
                key={extra.id}
                className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-bold text-neutral-900">{extra.name}</div>
                  <div className="text-xs text-emerald-900 font-extrabold">{formatPKR(extra.price)}</div>
                </div>
                <button
                  id={`extras-quick-add-${extra.id}`}
                  onClick={() => {
                    const extraProduct = products.find((p: MenuItem) => p.category === 'extras') || products[0];
                    if (extraProduct) onCustomizeItem(extraProduct);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold active:scale-95 transition-all"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};




