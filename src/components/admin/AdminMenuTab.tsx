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
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { MenuItem } from '../../types';
import {
  ManagedFlavour,
  ManagedSauce,
  ManagedExtra,
  addFlavour,
  editFlavour,
  deleteFlavour,
  addSauce,
  editSauce,
  deleteSauce,
  addExtra,
  deleteExtra,
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

  // Modals for adding/editing flavours, sauces, extras
  const [isAddFlavourOpen, setIsAddFlavourOpen] = useState(false);
  const [newFlavourName, setNewFlavourName] = useState('');
  const [newFlavourCategory, setNewFlavourCategory] = useState<'spicy' | 'cheesy' | 'tangy' | 'savory' | 'herbal'>('spicy');
  const [newFlavourHeat, setNewFlavourHeat] = useState<0 | 1 | 2 | 3>(1);

  const [isAddSauceOpen, setIsAddSauceOpen] = useState(false);
  const [newSauceName, setNewSauceName] = useState('');
  const [newSauceProfile, setNewSauceProfile] = useState<'creamy' | 'tangy' | 'hot' | 'smokey'>('creamy');
  const [newSauceHeat, setNewSauceHeat] = useState<0 | 1 | 2 | 3>(0);

  const [editingExtraId, setEditingExtraId] = useState<string | null>(null);
  const [extraPriceInput, setExtraPriceInput] = useState('');

  const filteredFlavours = flavours.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSauces = sauces.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.profile.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = menuItems.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExtras = extras.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveExtraPrice = (id: string) => {
    const p = parseFloat(extraPriceInput);
    if (!isNaN(p) && p > 0) {
      onUpdateExtraPrice(id, p);
    }
    setEditingExtraId(null);
    setExtraPriceInput('');
  };

  const handleCreateFlavour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlavourName.trim()) return;
    addFlavour({
      name: newFlavourName.trim(),
      description: 'Handcrafted signature seasoning blend',
      category: newFlavourCategory,
      heatLevel: newFlavourHeat,
      popular: true,
    });
    setNewFlavourName('');
    setIsAddFlavourOpen(false);
  };

  const handleCreateSauce = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSauceName.trim()) return;
    addSauce({
      name: newSauceName.trim(),
      description: 'House-made artisan gourmet dipping sauce',
      profile: newSauceProfile,
      heatLevel: newSauceHeat,
      popular: true,
    });
    setNewSauceName('');
    setIsAddSauceOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
            Menu & Availability Management
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Instantly toggle product, flavour, and sauce availability. Out-of-stock items update live on the customer menu.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center bg-neutral-100/80 p-1 rounded-xl border border-neutral-200 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'products'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Fries ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveSubTab('flavours')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'flavours'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            17 Flavours ({flavours.length})
          </button>
          <button
            onClick={() => setActiveSubTab('sauces')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'sauces'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            13 Sauces ({sauces.length})
          </button>
          <button
            onClick={() => setActiveSubTab('extras')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'extras'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Extras ({extras.length})
          </button>
        </div>
      </div>

      {/* Action Bar: Search + Add Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${activeSubTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs"
          />
        </div>

        {activeSubTab === 'products' && (
          <button
            onClick={onOpenAddProductModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Product</span>
          </button>
        )}

        {activeSubTab === 'flavours' && (
          <button
            onClick={() => setIsAddFlavourOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Flavour</span>
          </button>
        )}

        {activeSubTab === 'sauces' && (
          <button
            onClick={() => setIsAddSauceOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Sauce</span>
          </button>
        )}
      </div>

      {/* 1. PRODUCTS TAB */}
      {activeSubTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const isAvailable = product.isAvailable !== false;
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden flex flex-col justify-between"
              >
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-black text-neutral-900 text-sm uppercase">
                        {product.name}
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">
                        {product.category} {product.size && `• ${product.size}`}
                      </span>
                    </div>
                    <span className="text-base font-black text-emerald-900">
                      {formatPKR(product.basePrice)}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 line-clamp-2">{product.description}</p>
                </div>

                <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-2">
                  {/* Availability Toggle */}
                  <button
                    onClick={() => onToggleMenuItem(product.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                      isAvailable
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
                    }`}
                  >
                    {isAvailable ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Available</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Sold Out</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditItemPrice(product)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-emerald-800 hover:bg-white transition-colors cursor-pointer"
                      title="Edit Base Price"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {product.id.startsWith('prod_') && (
                      <button
                        onClick={() => onDeleteMenuItem(product.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Custom Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. FLAVOURS TAB (17 Flavours) */}
      {activeSubTab === 'flavours' && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-600">
              Showing {filteredFlavours.length} Signature Fry Seasonings
            </span>
            <span className="text-[11px] text-neutral-400">
              Green switch = Live on customer customizer
            </span>
          </div>

          <div className="divide-y divide-neutral-100">
            {filteredFlavours.map((flav) => {
              const isAvailable = flav.isAvailable !== false;
              return (
                <div
                  key={flav.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 text-sm">{flav.name}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
                          {flav.category}
                        </span>
                        {flav.heatLevel > 0 && (
                          <span className="text-[10px] font-extrabold text-amber-700">
                            {'🔥'.repeat(flav.heatLevel)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{flav.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleFlavour(flav.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
                      }`}
                    >
                      {isAvailable ? 'In Stock' : 'Out of Stock'}
                    </button>
                    {flav.id.startsWith('flv_') && (
                      <button
                        onClick={() => deleteFlavour(flav.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Flavour"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. SAUCES TAB (13 Sauces) */}
      {activeSubTab === 'sauces' && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-600">
              Showing {filteredSauces.length} Gourmet House Dipping Sauces
            </span>
            <span className="text-[11px] text-neutral-400">
              Toggle availability when batches are being prepared
            </span>
          </div>

          <div className="divide-y divide-neutral-100">
            {filteredSauces.map((sauce) => {
              const isAvailable = sauce.isAvailable !== false;
              return (
                <div
                  key={sauce.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 text-sm">{sauce.name}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
                          {sauce.profile}
                        </span>
                        {sauce.heatLevel > 0 && (
                          <span className="text-[10px] font-extrabold text-amber-700">
                            {'🔥'.repeat(sauce.heatLevel)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{sauce.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleSauce(sauce.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
                      }`}
                    >
                      {isAvailable ? 'In Stock' : 'Out of Stock'}
                    </button>
                    {sauce.id.startsWith('sauce_') && (
                      <button
                        onClick={() => deleteSauce(sauce.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Sauce"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. EXTRAS & DIPS TAB */}
      {activeSubTab === 'extras' && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden">
          <div className="divide-y divide-neutral-100">
            {filteredExtras.map((extra) => {
              const isAvailable = extra.isAvailable !== false;
              const isEditing = editingExtraId === extra.id;

              return (
                <div
                  key={extra.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
                >
                  <div>
                    <div className="font-bold text-neutral-900 text-sm">{extra.name}</div>
                    <div className="text-xs text-neutral-500 mt-0.5">{extra.description}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Price edit */}
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-neutral-700">Rs</span>
                        <input
                          type="number"
                          value={extraPriceInput}
                          onChange={(e) => setExtraPriceInput(e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-emerald-700 rounded-lg focus:outline-none"
                          placeholder={extra.price.toString()}
                        />
                        <button
                          onClick={() => handleSaveExtraPrice(extra.id)}
                          className="px-2 py-1 bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingExtraId(null)}
                          className="px-2 py-1 text-neutral-500 hover:text-neutral-900 text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-emerald-900">
                          {formatPKR(extra.price)}
                        </span>
                        <button
                          onClick={() => {
                            setEditingExtraId(extra.id);
                            setExtraPriceInput(extra.price.toString());
                          }}
                          className="p-1 text-neutral-400 hover:text-emerald-800 transition-colors cursor-pointer"
                          title="Change Price"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => onToggleExtra(extra.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
                      }`}
                    >
                      {isAvailable ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Flavour Modal */}
      {isAddFlavourOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-black text-neutral-900 uppercase">Add New Seasoning Flavour</h3>
              <button
                onClick={() => setIsAddFlavourOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFlavour} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Flavour Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smoky Peri Peri"
                  value={newFlavourName}
                  onChange={(e) => setNewFlavourName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Category</label>
                <select
                  value={newFlavourCategory}
                  onChange={(e: any) => setNewFlavourCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none"
                >
                  <option value="spicy">Spicy</option>
                  <option value="cheesy">Cheesy</option>
                  <option value="tangy">Tangy</option>
                  <option value="savory">Savory</option>
                  <option value="herbal">Herbal</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Heat Level</label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewFlavourHeat(lvl as any)}
                      className={`flex-1 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                        newFlavourHeat === lvl
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white text-neutral-700 border-neutral-200'
                      }`}
                    >
                      {lvl === 0 ? 'Mild' : '🔥'.repeat(lvl)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFlavourOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold cursor-pointer"
                >
                  Save Flavour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Sauce Modal */}
      {isAddSauceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-black text-neutral-900 uppercase">Add New Gourmet Sauce</h3>
              <button
                onClick={() => setIsAddSauceOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSauce} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Sauce Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Honey Mustard Cream"
                  value={newSauceName}
                  onChange={(e) => setNewSauceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Flavor Profile</label>
                <select
                  value={newSauceProfile}
                  onChange={(e: any) => setNewSauceProfile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none"
                >
                  <option value="creamy">Creamy</option>
                  <option value="tangy">Tangy</option>
                  <option value="hot">Hot & Fiery</option>
                  <option value="smokey">Smokey</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Heat Level</label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewSauceHeat(lvl as any)}
                      className={`flex-1 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                        newSauceHeat === lvl
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white text-neutral-700 border-neutral-200'
                      }`}
                    >
                      {lvl === 0 ? 'Mild' : '🔥'.repeat(lvl)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSauceOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold cursor-pointer"
                >
                  Save Sauce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
