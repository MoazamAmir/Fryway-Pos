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
  RotateCcw,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { MenuItem, FlavourItem, SauceItem, ExtraItem } from '../../types';
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
  editExtra,
  deleteExtra,
  resetMenuToDefaults,
} from '../../lib/restaurantStore';
import { formatPKR } from '../../lib/pricing';
import { IMAGE_PRESETS } from '../../data/menuData';

interface AdminMenuTabProps {
  menuItems: MenuItem[];
  onToggleMenuItem: (id: string) => void;
  onOpenAddProductModal: () => void;
  onEditItemPrice: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
  onEditProduct?: (item: MenuItem) => void;
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
  onEditProduct,
  flavours,
  onToggleFlavour,
  sauces,
  onToggleSauce,
  extras,
  onToggleExtra,
  onUpdateExtraPrice,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'flavours' | 'sauces' | 'extras'>('flavours');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. ADD FLAVOUR STATE
  const [isAddFlavourOpen, setIsAddFlavourOpen] = useState(false);
  const [newFlavourName, setNewFlavourName] = useState('');
  const [newFlavourDesc, setNewFlavourDesc] = useState('');
  const [newFlavourCategory, setNewFlavourCategory] = useState<'spicy' | 'cheesy' | 'tangy' | 'savory' | 'herbal'>('spicy');
  const [newFlavourHeat, setNewFlavourHeat] = useState<0 | 1 | 2 | 3>(1);
  const [newFlavourImage, setNewFlavourImage] = useState(IMAGE_PRESETS.seasonings[0].url);
  const [newFlavourPopular, setNewFlavourPopular] = useState(true);

  // 2. EDIT FLAVOUR STATE
  const [editingFlavour, setEditingFlavour] = useState<ManagedFlavour | null>(null);
  const [editFlavName, setEditFlavName] = useState('');
  const [editFlavDesc, setEditFlavDesc] = useState('');
  const [editFlavCategory, setEditFlavCategory] = useState<'spicy' | 'cheesy' | 'tangy' | 'savory' | 'herbal'>('spicy');
  const [editFlavHeat, setEditFlavHeat] = useState<0 | 1 | 2 | 3>(1);
  const [editFlavImage, setEditFlavImage] = useState('');
  const [editFlavPopular, setEditFlavPopular] = useState(false);

  // 3. ADD SAUCE STATE
  const [isAddSauceOpen, setIsAddSauceOpen] = useState(false);
  const [newSauceName, setNewSauceName] = useState('');
  const [newSauceDesc, setNewSauceDesc] = useState('');
  const [newSauceProfile, setNewSauceProfile] = useState<'creamy' | 'tangy' | 'hot' | 'smokey'>('creamy');
  const [newSauceHeat, setNewSauceHeat] = useState<0 | 1 | 2 | 3>(0);
  const [newSauceImage, setNewSauceImage] = useState(IMAGE_PRESETS.sauces[0].url);
  const [newSaucePopular, setNewSaucePopular] = useState(true);

  // 4. EDIT SAUCE STATE
  const [editingSauce, setEditingSauce] = useState<ManagedSauce | null>(null);
  const [editSauceName, setEditSauceName] = useState('');
  const [editSauceDesc, setEditSauceDesc] = useState('');
  const [editSauceProfile, setEditSauceProfile] = useState<'creamy' | 'tangy' | 'hot' | 'smokey'>('creamy');
  const [editSauceHeat, setEditSauceHeat] = useState<0 | 1 | 2 | 3>(0);
  const [editSauceImage, setEditSauceImage] = useState('');
  const [editSaucePopular, setEditSaucePopular] = useState(false);

  // 5. ADD EXTRA STATE
  const [isAddExtraOpen, setIsAddExtraOpen] = useState(false);
  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState('');
  const [newExtraCategory, setNewExtraCategory] = useState<'dip' | 'sachet'>('dip');
  const [newExtraDesc, setNewExtraDesc] = useState('');
  const [newExtraImage, setNewExtraImage] = useState(IMAGE_PRESETS.sauces[1].url);

  // 6. EDIT EXTRA STATE
  const [editingExtra, setEditingExtra] = useState<ManagedExtra | null>(null);
  const [editExtraName, setEditExtraName] = useState('');
  const [editExtraPrice, setEditExtraPrice] = useState('');
  const [editExtraImage, setEditExtraImage] = useState('');
  const [editExtraDesc, setEditExtraDesc] = useState('');

  // 7. CONFIRM DELETE STATE
  const [deletingItem, setDeletingItem] = useState<{
    id: string;
    name: string;
    type: 'product' | 'flavour' | 'sauce' | 'extra';
  } | null>(null);

  // Filtered queries
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

  // Handlers for Flavour
  const handleCreateFlavour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlavourName.trim()) return;
    addFlavour({
      name: newFlavourName.trim(),
      description: newFlavourDesc.trim() || 'Handcrafted signature seasoning blend',
      category: newFlavourCategory,
      heatLevel: newFlavourHeat,
      image: newFlavourImage || IMAGE_PRESETS.seasonings[0].url,
      popular: newFlavourPopular,
    });
    setNewFlavourName('');
    setNewFlavourDesc('');
    setIsAddFlavourOpen(false);
  };

  const openEditFlavour = (flavour: ManagedFlavour) => {
    setEditingFlavour(flavour);
    setEditFlavName(flavour.name);
    setEditFlavDesc(flavour.description || '');
    setEditFlavCategory(flavour.category);
    setEditFlavHeat(flavour.heatLevel);
    setEditFlavImage(flavour.image || IMAGE_PRESETS.seasonings[0].url);
    setEditFlavPopular(!!flavour.popular);
  };

  const handleSaveEditFlavour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlavour || !editFlavName.trim()) return;
    editFlavour(editingFlavour.id, {
      name: editFlavName.trim(),
      description: editFlavDesc.trim(),
      category: editFlavCategory,
      heatLevel: editFlavHeat,
      image: editFlavImage,
      popular: editFlavPopular,
    });
    setEditingFlavour(null);
  };

  // Handlers for Sauce
  const handleCreateSauce = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSauceName.trim()) return;
    addSauce({
      name: newSauceName.trim(),
      description: newSauceDesc.trim() || 'House-made artisan gourmet dipping sauce',
      profile: newSauceProfile,
      heatLevel: newSauceHeat,
      image: newSauceImage || IMAGE_PRESETS.sauces[0].url,
      popular: newSaucePopular,
    });
    setNewSauceName('');
    setNewSauceDesc('');
    setIsAddSauceOpen(false);
  };

  const openEditSauce = (sauce: ManagedSauce) => {
    setEditingSauce(sauce);
    setEditSauceName(sauce.name);
    setEditSauceDesc(sauce.description || '');
    setEditSauceProfile(sauce.profile);
    setEditSauceHeat(sauce.heatLevel);
    setEditSauceImage(sauce.image || IMAGE_PRESETS.sauces[0].url);
    setEditSaucePopular(!!sauce.popular);
  };

  const handleSaveEditSauce = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSauce || !editSauceName.trim()) return;
    editSauce(editingSauce.id, {
      name: editSauceName.trim(),
      description: editSauceDesc.trim(),
      profile: editSauceProfile,
      heatLevel: editSauceHeat,
      image: editSauceImage,
      popular: editSaucePopular,
    });
    setEditingSauce(null);
  };

  // Handlers for Extra
  const handleCreateExtra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExtraName.trim() || !newExtraPrice) return;
    addExtra({
      name: newExtraName.trim(),
      price: parseFloat(newExtraPrice) || 50,
      category: newExtraCategory,
      description: newExtraDesc.trim() || 'Signature accompaniment',
      image: newExtraImage,
    });
    setNewExtraName('');
    setNewExtraPrice('');
    setNewExtraDesc('');
    setIsAddExtraOpen(false);
  };

  const openEditExtra = (extra: ManagedExtra) => {
    setEditingExtra(extra);
    setEditExtraName(extra.name);
    setEditExtraPrice(extra.price.toString());
    setEditExtraImage(extra.image || '');
    setEditExtraDesc(extra.description || '');
  };

  const handleSaveEditExtra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExtra || !editExtraName.trim()) return;
    editExtra(editingExtra.id, {
      name: editExtraName.trim(),
      price: parseFloat(editExtraPrice) || editingExtra.price,
      image: editExtraImage,
      description: editExtraDesc.trim(),
    });
    setEditingExtra(null);
  };

  // Execution of Delete
  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    if (deletingItem.type === 'flavour') {
      deleteFlavour(deletingItem.id);
    } else if (deletingItem.type === 'sauce') {
      deleteSauce(deletingItem.id);
    } else if (deletingItem.type === 'product') {
      onDeleteMenuItem(deletingItem.id);
    } else if (deletingItem.type === 'extra') {
      deleteExtra(deletingItem.id);
    }
    setDeletingItem(null);
  };

  // File upload helper for base64 data URL
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setter(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Glass Top Header & Sub-Tabs */}
      <div className="backdrop-blur-xl bg-neutral-900/65 border border-white/10 p-5 rounded-2xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Menu, Flavours & Sauces Ecosystem
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase border border-emerald-500/30">
              Live Sync
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Full management of products, 17 seasonings, 13 gourmet sauces, and dips with images and live stock switches.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center backdrop-blur-md bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('flavours')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'flavours'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30 font-extrabold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>17 Flavours ({flavours.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('sauces')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'sauces'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30 font-extrabold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-amber-300" />
            <span>13 Sauces ({sauces.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('products')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'products'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30 font-extrabold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-300" />
            <span>Fries & Food ({menuItems.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('extras')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'extras'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30 font-extrabold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Extras ({extras.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Glass Action Bar: Search, Add Item & Reset Default */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${activeSubTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl backdrop-blur-md bg-neutral-900/60 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {activeSubTab === 'flavours' && (
            <button
              onClick={() => setIsAddFlavourOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Seasoning Flavour</span>
            </button>
          )}

          {activeSubTab === 'sauces' && (
            <button
              onClick={() => setIsAddSauceOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Signature Sauce</span>
            </button>
          )}

          {activeSubTab === 'products' && (
            <button
              onClick={onOpenAddProductModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Menu Product</span>
            </button>
          )}

          {activeSubTab === 'extras' && (
            <button
              onClick={() => setIsAddExtraOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Extra Item</span>
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm('Reset all items, seasonings and sauces to original factory settings?')) {
                resetMenuToDefaults();
              }
            }}
            title="Reset All Items to Default"
            className="p-2.5 rounded-xl backdrop-blur-md bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================
          1. FLAVOURS (17 SEASONINGS) TAB
         ======================================================== */}
      {activeSubTab === 'flavours' && (
        <div className="backdrop-blur-xl bg-neutral-900/65 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-300">
              Listing {filteredFlavours.length} Signature Fry Seasonings (with Images)
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">
              Live synced with customer landing page
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredFlavours.map((flav) => {
              const isAvailable = flav.isAvailable !== false;
              return (
                <div
                  key={flav.id}
                  className="backdrop-blur-md bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between group shadow-lg"
                >
                  <div className="p-4 space-y-3">
                    {/* Item Image Banner */}
                    <div className="relative h-32 w-full rounded-xl overflow-hidden bg-neutral-950 border border-white/10">
                      {flav.image ? (
                        <img
                          src={flav.image}
                          alt={flav.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-950/20 text-amber-500">
                          <Flame className="w-10 h-10" />
                        </div>
                      )}
                      {/* Popular tag */}
                      {flav.popular && (
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-500/90 text-neutral-950 text-[10px] font-black uppercase shadow-md">
                          Popular
                        </span>
                      )}
                      {/* Heat level */}
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-xs text-[10px] font-bold text-amber-300 border border-white/10">
                        {flav.heatLevel === 0 ? 'Mild' : '🔥'.repeat(flav.heatLevel)}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-black text-white text-base tracking-wide group-hover:text-emerald-300 transition-colors">
                          {flav.name}
                        </h3>
                        <span className="capitalize text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-neutral-300 border border-white/10">
                          {flav.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                        {flav.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-2">
                    {/* Stock switch */}
                    <button
                      onClick={() => onToggleFlavour(flav.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAvailable
                          ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                      }`}
                    >
                      {isAvailable ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Active</span>
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
                        onClick={() => openEditFlavour(flav)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-300 hover:bg-white/10 transition-colors cursor-pointer"
                        title="Edit Flavour"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeletingItem({ id: flav.id, name: flav.name, type: 'flavour' })
                        }
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Flavour"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          2. SAUCES (13 SIGNATURE SAUCES) TAB
         ======================================================== */}
      {activeSubTab === 'sauces' && (
        <div className="backdrop-blur-xl bg-neutral-900/65 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-300">
              Listing {filteredSauces.length} Gourmet Signature Sauces (with Images)
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">
              Live synced with customer landing page
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredSauces.map((sauce) => {
              const isAvailable = sauce.isAvailable !== false;
              return (
                <div
                  key={sauce.id}
                  className="backdrop-blur-md bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between group shadow-lg"
                >
                  <div className="p-4 space-y-3">
                    {/* Item Image Banner */}
                    <div className="relative h-32 w-full rounded-xl overflow-hidden bg-neutral-950 border border-white/10">
                      {sauce.image ? (
                        <img
                          src={sauce.image}
                          alt={sauce.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=400&q=80';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-950/20 text-emerald-400">
                          <Droplets className="w-10 h-10" />
                        </div>
                      )}
                      {sauce.popular && (
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-500/90 text-neutral-950 text-[10px] font-black uppercase shadow-md">
                          Popular
                        </span>
                      )}
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-xs text-[10px] font-bold text-emerald-300 border border-white/10">
                        {sauce.profile}
                      </span>
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-black text-white text-base tracking-wide group-hover:text-emerald-300 transition-colors">
                          {sauce.name}
                        </h3>
                        {sauce.heatLevel > 0 && (
                          <span className="text-[11px] font-bold text-rose-400">
                            {'🔥'.repeat(sauce.heatLevel)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                        {sauce.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onToggleSauce(sauce.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAvailable
                          ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                      }`}
                    >
                      {isAvailable ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Active</span>
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
                        onClick={() => openEditSauce(sauce)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-300 hover:bg-white/10 transition-colors cursor-pointer"
                        title="Edit Sauce"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeletingItem({ id: sauce.id, name: sauce.name, type: 'sauce' })
                        }
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Sauce"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          3. PRODUCTS (FRIES & FOOD) TAB
         ======================================================== */}
      {activeSubTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const isAvailable = product.isAvailable !== false;
            return (
              <div
                key={product.id}
                className="backdrop-blur-xl bg-neutral-900/65 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-4 space-y-3">
                  {/* Product Image */}
                  <div className="relative h-36 w-full rounded-xl overflow-hidden bg-neutral-950 border border-white/10">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/5 text-neutral-500">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-neutral-900/90 backdrop-blur-md text-emerald-400 font-black text-xs border border-emerald-500/30 shadow-lg">
                      {formatPKR(product.basePrice)}
                    </span>
                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-500/90 text-neutral-950 text-[10px] font-black uppercase shadow-md">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-black text-white text-base tracking-wide uppercase">
                      {product.name}
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      {product.category} {product.size && `• ${product.size}`}
                    </span>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onToggleMenuItem(product.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                      isAvailable
                        ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
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
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-300 hover:bg-white/10 transition-colors cursor-pointer"
                      title="Edit Price & Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {product.id.startsWith('prod_') && (
                      <button
                        onClick={() =>
                          setDeletingItem({ id: product.id, name: product.name, type: 'product' })
                        }
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Product"
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

      {/* ========================================================
          4. EXTRAS (DIPS & SACHETS) TAB
         ======================================================== */}
      {activeSubTab === 'extras' && (
        <div className="backdrop-blur-xl bg-neutral-900/65 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-300">
              Showing {filteredExtras.length} Add-on Dips & Sachets (with Images)
            </span>
          </div>

          <div className="divide-y divide-white/10">
            {filteredExtras.map((extra) => {
              const isAvailable = extra.isAvailable !== false;
              return (
                <div
                  key={extra.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-950 border border-white/10 shrink-0">
                      {extra.image ? (
                        <img
                          src={extra.image}
                          alt={extra.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400&q=80';
                          }}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-emerald-400">
                          <Droplets className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{extra.name}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white/10 text-neutral-300">
                          {extra.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400">{extra.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="text-sm font-black text-emerald-400">
                      {formatPKR(extra.price)}
                    </span>

                    <button
                      onClick={() => onToggleExtra(extra.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isAvailable
                          ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                      }`}
                    >
                      {isAvailable ? 'In Stock' : 'Out of Stock'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditExtra(extra)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-300 hover:bg-white/10 transition-colors cursor-pointer"
                        title="Edit Extra"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeletingItem({ id: extra.id, name: extra.name, type: 'extra' })
                        }
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Extra"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 1: ADD NEW FLAVOUR
         ======================================================== */}
      {isAddFlavourOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="backdrop-blur-2xl bg-neutral-900 border border-white/20 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-white uppercase text-base">Add New Seasoning Flavour</h3>
              </div>
              <button
                onClick={() => setIsAddFlavourOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFlavour} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Flavour Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smoky Peri Peri"
                  value={newFlavourName}
                  onChange={(e) => setNewFlavourName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Aromatic African bird's eye chili with zesty lemon undertones"
                  value={newFlavourDesc}
                  onChange={(e) => setNewFlavourDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Image Picker with Presets */}
              <div className="space-y-2">
                <label className="font-bold text-neutral-300 block">Seasoning Image (URL or Preset)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newFlavourImage}
                    onChange={(e) => setNewFlavourImage(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                  />
                  <label className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer font-bold text-neutral-200">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, setNewFlavourImage)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset image buttons */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {IMAGE_PRESETS.seasonings.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setNewFlavourImage(p.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all whitespace-nowrap cursor-pointer ${
                        newFlavourImage === p.url
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Preview */}
                {newFlavourImage && (
                  <div className="h-24 w-full rounded-xl overflow-hidden bg-neutral-950 border border-white/10">
                    <img src={newFlavourImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Category</label>
                  <select
                    value={newFlavourCategory}
                    onChange={(e: any) => setNewFlavourCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none"
                  >
                    <option value="spicy">Spicy</option>
                    <option value="cheesy">Cheesy</option>
                    <option value="tangy">Tangy</option>
                    <option value="savory">Savory</option>
                    <option value="herbal">Herbal</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Heat Level</label>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setNewFlavourHeat(lvl as any)}
                        className={`flex-1 py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                          newFlavourHeat === lvl
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : 'bg-white/5 text-neutral-400 border-white/10'
                        }`}
                      >
                        {lvl === 0 ? 'Mild' : '🔥'.repeat(lvl)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFlavourOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  Save Seasoning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: EDIT FLAVOUR
         ======================================================== */}
      {editingFlavour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="backdrop-blur-2xl bg-neutral-900 border border-white/20 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-white uppercase text-base">Edit Seasoning Flavour</h3>
              </div>
              <button
                onClick={() => setEditingFlavour(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditFlavour} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Flavour Name</label>
                <input
                  type="text"
                  required
                  value={editFlavName}
                  onChange={(e) => setEditFlavName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editFlavDesc}
                  onChange={(e) => setEditFlavDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Image Picker */}
              <div className="space-y-2">
                <label className="font-bold text-neutral-300 block">Seasoning Image</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editFlavImage}
                    onChange={(e) => setEditFlavImage(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                  />
                  <label className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer font-bold text-neutral-200">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, setEditFlavImage)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {IMAGE_PRESETS.seasonings.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setEditFlavImage(p.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all whitespace-nowrap cursor-pointer ${
                        editFlavImage === p.url
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {editFlavImage && (
                  <div className="h-24 w-full rounded-xl overflow-hidden bg-neutral-950 border border-white/10">
                    <img src={editFlavImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Category</label>
                  <select
                    value={editFlavCategory}
                    onChange={(e: any) => setEditFlavCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none"
                  >
                    <option value="spicy">Spicy</option>
                    <option value="cheesy">Cheesy</option>
                    <option value="tangy">Tangy</option>
                    <option value="savory">Savory</option>
                    <option value="herbal">Herbal</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Heat Level</label>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setEditFlavHeat(lvl as any)}
                        className={`flex-1 py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                          editFlavHeat === lvl
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : 'bg-white/5 text-neutral-400 border-white/10'
                        }`}
                      >
                        {lvl === 0 ? 'Mild' : '🔥'.repeat(lvl)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFlavour(null)}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: ADD NEW SAUCE
         ======================================================== */}
      {isAddSauceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="backdrop-blur-2xl bg-neutral-900 border border-white/20 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-white uppercase text-base">Add New Signature Sauce</h3>
              </div>
              <button
                onClick={() => setIsAddSauceOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSauce} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Sauce Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Truffle Garlic Dip"
                  value={newSauceName}
                  onChange={(e) => setNewSauceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Rich velvety house mayonnaise infused with roasted garlic and truffle oil"
                  value={newSauceDesc}
                  onChange={(e) => setNewSauceDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Image Picker */}
              <div className="space-y-2">
                <label className="font-bold text-neutral-300 block">Sauce Image (URL or Preset)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newSauceImage}
                    onChange={(e) => setNewSauceImage(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                  />
                  <label className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer font-bold text-neutral-200">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, setNewSauceImage)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {IMAGE_PRESETS.sauces.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setNewSauceImage(p.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all whitespace-nowrap cursor-pointer ${
                        newSauceImage === p.url
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {newSauceImage && (
                  <div className="h-24 w-full rounded-xl overflow-hidden bg-neutral-950 border border-white/10">
                    <img src={newSauceImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Flavor Profile</label>
                  <select
                    value={newSauceProfile}
                    onChange={(e: any) => setNewSauceProfile(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none"
                  >
                    <option value="creamy">Creamy</option>
                    <option value="tangy">Tangy</option>
                    <option value="hot">Hot & Spicy</option>
                    <option value="smokey">Smokey BBQ</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Heat Level</label>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setNewSauceHeat(lvl as any)}
                        className={`flex-1 py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                          newSauceHeat === lvl
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : 'bg-white/5 text-neutral-400 border-white/10'
                        }`}
                      >
                        {lvl === 0 ? 'Mild' : '🔥'.repeat(lvl)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSauceOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  Save Sauce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: EDIT SAUCE
         ======================================================== */}
      {editingSauce && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="backdrop-blur-2xl bg-neutral-900 border border-white/20 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-white uppercase text-base">Edit Signature Sauce</h3>
              </div>
              <button
                onClick={() => setEditingSauce(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditSauce} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Sauce Name</label>
                <input
                  type="text"
                  required
                  value={editSauceName}
                  onChange={(e) => setNewSauceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editSauceDesc}
                  onChange={(e) => setEditSauceDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Image Picker */}
              <div className="space-y-2">
                <label className="font-bold text-neutral-300 block">Sauce Image</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editSauceImage}
                    onChange={(e) => setEditSauceImage(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                  />
                  <label className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer font-bold text-neutral-200">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, setEditSauceImage)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {IMAGE_PRESETS.sauces.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setEditSauceImage(p.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all whitespace-nowrap cursor-pointer ${
                        editSauceImage === p.url
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {editSauceImage && (
                  <div className="h-24 w-full rounded-xl overflow-hidden bg-neutral-950 border border-white/10">
                    <img src={editSauceImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Flavor Profile</label>
                  <select
                    value={editSauceProfile}
                    onChange={(e: any) => setEditSauceProfile(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none"
                  >
                    <option value="creamy">Creamy</option>
                    <option value="tangy">Tangy</option>
                    <option value="hot">Hot & Spicy</option>
                    <option value="smokey">Smokey BBQ</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Heat Level</label>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setEditSauceHeat(lvl as any)}
                        className={`flex-1 py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                          editSauceHeat === lvl
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : 'bg-white/5 text-neutral-400 border-white/10'
                        }`}
                      >
                        {lvl === 0 ? 'Mild' : '🔥'.repeat(lvl)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSauce(null)}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: ADD EXTRA
         ======================================================== */}
      {isAddExtraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="backdrop-blur-2xl bg-neutral-900 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-black text-white uppercase text-base">Add New Extra Add-on</h3>
              <button
                onClick={() => setIsAddExtraOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExtra} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jalapeno Cheese Dipping Pot"
                  value={newExtraName}
                  onChange={(e) => setNewExtraName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    required
                    placeholder="80"
                    value={newExtraPrice}
                    onChange={(e) => setNewExtraPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Category</label>
                  <select
                    value={newExtraCategory}
                    onChange={(e: any) => setNewExtraCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none"
                  >
                    <option value="dip">Dipping Cup</option>
                    <option value="sachet">Single Sachet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newExtraImage}
                  onChange={(e) => setNewExtraImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExtraOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Save Extra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 6: EDIT EXTRA
         ======================================================== */}
      {editingExtra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="backdrop-blur-2xl bg-neutral-900 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-black text-white uppercase text-base">Edit Extra Item</h3>
              <button
                onClick={() => setEditingExtra(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditExtra} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={editExtraName}
                  onChange={(e) => setEditExtraName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Price (PKR)</label>
                <input
                  type="number"
                  required
                  value={editExtraPrice}
                  onChange={(e) => setEditExtraPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={editExtraImage}
                  onChange={(e) => setEditExtraImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingExtra(null)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 7: CONFIRM DELETE
         ======================================================== */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="backdrop-blur-2xl bg-neutral-900 border border-rose-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-black uppercase text-base">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to delete <span className="font-black text-white">"{deletingItem.name}"</span>? This will remove it from the admin console and customer menus.
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs cursor-pointer shadow-lg shadow-rose-950/40"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
