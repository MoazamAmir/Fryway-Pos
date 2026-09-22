import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Sparkles,
  Flame,
  Droplets,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
} from 'lucide-react';
import { MenuItem } from '../../types';
import {
  ManagedFlavour,
  ManagedSauce,
  ManagedExtra,
} from '../../lib/restaurantStore';
import { formatPKR } from '../../lib/pricing';

interface AdminMenuTabProps {
  menuItems: MenuItem[];
  onToggleMenuItem: (id: string) => void;
  onOpenAddProductModal: () => void;
  onEditItemPrice: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
  flavours: ManagedFlavour[];
  onToggleFlavour: (id: string) => void;
  sauces: ManagedSauce[];
  onToggleSauce: (id: string) => void;
  extras: ManagedExtra[];
  onToggleExtra: (id: string) => void;
  onUpdateExtraPrice: (id: string, price: number) => void;
}

export const AdminMenuTab: React.FC<AdminMenuTabProps> = ({
  menuItems,
  onToggleMenuItem,
  onOpenAddProductModal,
  onEditItemPrice,
  onDeleteMenuItem,
  flavours,
  onToggleFlavour,
  sauces,
  onToggleSauce,
  extras,
  onToggleExtra,
  onUpdateExtraPrice,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'flavours' | 'sauces' | 'extras'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingExtraId, setEditingExtraId] = useState<string | null>(null);
  const [extraPriceInput, setExtraPriceInput] = useState('');

  const filteredFlavours = flavours.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSauces = sauces.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.profile.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = menuItems.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveExtraPrice = (id: string) => {
    const p = parseFloat(extraPriceInput);
    if (!isNaN(p) && p > 0) {
      onUpdateExtraPrice(id, p);
    }
    setEditingExtraId(null);
    setExtraPriceInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
        <div>
          <h2 className="text-lg font-black text-white font-['Syne',sans-serif] uppercase">
            Menu & Availability Control
          </h2>
          <p className="text-xs text-neutral-400">
            Toggle in-stock status and configure items. Out-of-stock items are instantly disabled on the customer website.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'products'
                ? 'bg-amber-400 text-neutral-950 font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Fries & Products ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveSubTab('flavours')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'flavours'
                ? 'bg-amber-400 text-neutral-950 font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Flavours (17)
          </button>
          <button
            onClick={() => setActiveSubTab('sauces')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'sauces'
                ? 'bg-amber-400 text-neutral-950 font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sauces (13)
          </button>
          <button
            onClick={() => setActiveSubTab('extras')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'extras'
                ? 'bg-amber-400 text-neutral-950 font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Extras ({extras.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeSubTab}...`}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* 1. PRODUCTS SUB-TAB */}
      {activeSubTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400">
              Showing {filteredProducts.length} menu items
            </span>
            <button
              onClick={onOpenAddProductModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Custom Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.isAvailable !== false
                    ? 'bg-neutral-900 border-neutral-800'
                    : 'bg-neutral-900/40 border-rose-900/40 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.name}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-400 block line-clamp-1">
                      {item.tagline || item.description}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleMenuItem(item.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-all shrink-0 ${
                      item.isAvailable !== false
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {item.isAvailable !== false ? 'In Stock' : 'Sold Out'}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs mt-3">
                  <div>
                    <span className="text-neutral-500 text-[10px] block">Base Price</span>
                    <span className="font-black text-amber-300 text-sm">{formatPKR(item.basePrice)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditItemPrice(item)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
                      title="Edit Price"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {item.id.startsWith('custom_item_') && (
                      <button
                        onClick={() => onDeleteMenuItem(item.id)}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. FLAVOURS (17) SUB-TAB */}
      {activeSubTab === 'flavours' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>All 17 Signature Seasoning Flavours</span>
            <span>Click toggle to immediately update customer website availability</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredFlavours.map((flav) => {
              const isAvailable = flav.isAvailable !== false;
              return (
                <div
                  key={flav.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isAvailable
                      ? 'bg-neutral-900 border-neutral-800'
                      : 'bg-neutral-900/40 border-rose-900/40 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isAvailable ? 'bg-amber-400/20 text-amber-300' : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      <Flame className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs truncate">{flav.name}</span>
                        {flav.popular && (
                          <span className="px-1 py-0.2 rounded text-[8px] font-black bg-amber-400/20 text-amber-300">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 block capitalize">
                        {flav.category} • Spice Lv {flav.heatLevel}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleFlavour(flav.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-all shrink-0 ${
                      isAvailable
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                        : 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
                    }`}
                  >
                    {isAvailable ? 'In Stock' : 'Sold Out'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. SAUCES (13) SUB-TAB */}
      {activeSubTab === 'sauces' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>All 13 Artisan Gourmet Sauces</span>
            <span>Click toggle to mark dips and drizzle sauces in/out of stock</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSauces.map((sauce) => {
              const isAvailable = sauce.isAvailable !== false;
              return (
                <div
                  key={sauce.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isAvailable
                      ? 'bg-neutral-900 border-neutral-800'
                      : 'bg-neutral-900/40 border-rose-900/40 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs truncate">{sauce.name}</span>
                        {sauce.popular && (
                          <span className="px-1 py-0.2 rounded text-[8px] font-black bg-emerald-400/20 text-emerald-300">
                            TOP DIP
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 block capitalize">
                        {sauce.profile} Profile
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleSauce(sauce.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-all shrink-0 ${
                      isAvailable
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                        : 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
                    }`}
                  >
                    {isAvailable ? 'In Stock' : 'Sold Out'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. EXTRAS SUB-TAB */}
      {activeSubTab === 'extras' && (
        <div className="space-y-4">
          <div className="text-xs text-neutral-400">
            Manage extra dipping cups and ketchup sachets pricing and availability.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {extras.map((extra) => {
              const isAvailable = extra.isAvailable !== false;
              const isEditing = editingExtraId === extra.id;
              return (
                <div
                  key={extra.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isAvailable
                      ? 'bg-neutral-900 border-neutral-800'
                      : 'bg-neutral-900/40 border-rose-900/40 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="font-bold text-white text-sm block">{extra.name}</span>
                      <span className="text-xs text-neutral-400 block">{extra.description}</span>
                    </div>
                    <button
                      onClick={() => onToggleExtra(extra.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase shrink-0 ${
                        isAvailable
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {isAvailable ? 'In Stock' : 'Sold Out'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-800 mt-3">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={extraPriceInput}
                          onChange={(e) => setExtraPriceInput(e.target.value)}
                          className="w-20 bg-neutral-950 border border-amber-400 text-amber-300 px-2 py-1 rounded text-xs font-bold"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveExtraPrice(extra.id)}
                          className="px-2 py-1 rounded bg-amber-400 text-neutral-950 text-[10px] font-black"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <span className="font-black text-amber-300 text-base">{formatPKR(extra.price)}</span>
                    )}

                    {!isEditing && (
                      <button
                        onClick={() => {
                          setEditingExtraId(extra.id);
                          setExtraPriceInput(extra.price.toString());
                        }}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
