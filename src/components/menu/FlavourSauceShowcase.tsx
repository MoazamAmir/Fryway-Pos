import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles, Droplets, Check, ChefHat, Info } from 'lucide-react';
import { getFlavoursList, getSaucesList, ManagedFlavour, ManagedSauce } from '../../lib/restaurantStore';

interface FlavourSauceShowcaseProps {
  onSelectCustomize?: () => void;
}

export const FlavourSauceShowcase: React.FC<FlavourSauceShowcaseProps> = ({
  onSelectCustomize,
}) => {
  const [activeTab, setActiveTab] = useState<'flavours' | 'sauces'>('flavours');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [flavoursList, setFlavoursList] = useState<ManagedFlavour[]>(() => getFlavoursList());
  const [saucesList, setSaucesList] = useState<ManagedSauce[]>(() => getSaucesList());

  useEffect(() => {
    const handleUpdate = () => {
      setFlavoursList(getFlavoursList());
      setSaucesList(getSaucesList());
    };
    window.addEventListener('fryway_flavour_update', handleUpdate);
    window.addEventListener('fryway_sauce_update', handleUpdate);
    return () => {
      window.removeEventListener('fryway_flavour_update', handleUpdate);
      window.removeEventListener('fryway_sauce_update', handleUpdate);
    };
  }, []);

  const flavourCategories = [
    { id: 'all', label: `All ${flavoursList.length} Flavours` },
    { id: 'spicy', label: 'Spicy' },
    { id: 'cheesy', label: 'Cheesy' },
    { id: 'tangy', label: 'Tangy' },
    { id: 'savory', label: 'Savory' },
    { id: 'herbal', label: 'Herbal' },
  ];

  const sauceProfiles = [
    { id: 'all', label: `All ${saucesList.length} Sauces` },
    { id: 'creamy', label: 'Creamy' },
    { id: 'hot', label: 'Hot & Spicy' },
    { id: 'tangy', label: 'Tangy Relish' },
    { id: 'smokey', label: 'Smokey BBQ' },
  ];

  const filteredFlavours = flavoursList.filter((f) =>
    selectedCategory === 'all' ? true : f.category === selectedCategory
  );

  const filteredSauces = saucesList.filter((s) =>
    selectedCategory === 'all' ? true : s.profile === selectedCategory
  );

  return (
    <section id="flavours-sauces" className="py-16 md:py-24 bg-white border-y border-neutral-200/80 fryway-section-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>The Taste Arsenal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] uppercase tracking-tight text-neutral-900 mb-4">
            {flavoursList.length} SEASONINGS. {saucesList.length} GOURMET SAUCES.
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
            Every batch of hand-cut fries can be shaken with our proprietary spice rubs and paired with velvety dipping sauces created in-house.
          </p>
        </div>

        {/* Tab Switcher: Flavours vs Sauces */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-neutral-100 border border-neutral-200 shadow-inner">
            <button
              id="showcase-tab-flavours"
              onClick={() => {
                setActiveTab('flavours');
                setSelectedCategory('all');
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
                activeTab === 'flavours'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>{flavoursList.length} Seasoning Flavours</span>
            </button>
            <button
              id="showcase-tab-sauces"
              onClick={() => {
                setActiveTab('sauces');
                setSelectedCategory('all');
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
                activeTab === 'sauces'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Droplets className="w-4 h-4 text-amber-300" />
              <span>{saucesList.length} Signature Sauces</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {(activeTab === 'flavours' ? flavourCategories : sauceProfiles).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dynamic Showcase Grid */}
        {activeTab === 'flavours' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredFlavours.map((flav, idx) => (
              <motion.div
                key={flav.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.02 }}
                className="rounded-2xl bg-white border border-neutral-200/90 hover:border-emerald-800/40 hover:shadow-lg transition-all flex flex-col justify-between group shadow-xs overflow-hidden"
              >
                <div>
                  {/* Photo Preview if present */}
                  {flav.image && (
                    <div className="relative h-36 w-full overflow-hidden bg-neutral-100">
                      <img
                        src={flav.image}
                        alt={flav.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {flav.popular && (
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-500 text-neutral-950 text-[10px] font-black uppercase shadow-xs">
                          Popular
                        </span>
                      )}
                      {flav.isAvailable === false && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold uppercase shadow-xs">
                          Sold Out
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-neutral-900 text-base group-hover:text-emerald-900 transition-colors">
                        {flav.name}
                      </h3>
                      {!flav.image && flav.popular && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase shrink-0">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {flav.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="capitalize font-semibold text-neutral-500 text-[11px] px-2 py-0.5 rounded-md bg-neutral-50 border border-neutral-200">
                    {flav.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {flav.heatLevel > 0 ? (
                      Array.from({ length: flav.heatLevel }).map((_, i) => (
                        <Flame key={i} className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                      ))
                    ) : (
                      <span className="text-[11px] font-medium text-neutral-400">Mild</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredSauces.map((sauce, idx) => (
              <motion.div
                key={sauce.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.02 }}
                className="rounded-2xl bg-white border border-neutral-200/90 hover:border-emerald-800/40 hover:shadow-lg transition-all flex flex-col justify-between group shadow-xs overflow-hidden"
              >
                <div>
                  {sauce.image && (
                    <div className="relative h-36 w-full overflow-hidden bg-neutral-100">
                      <img
                        src={sauce.image}
                        alt={sauce.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=400&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {sauce.popular && (
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-500 text-neutral-950 text-[10px] font-black uppercase shadow-xs">
                          Signature
                        </span>
                      )}
                      {sauce.isAvailable === false && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold uppercase shadow-xs">
                          Sold Out
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-neutral-900 text-base group-hover:text-emerald-900 transition-colors">
                        {sauce.name}
                      </h3>
                      {!sauce.image && sauce.popular && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase shrink-0">
                          Signature
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {sauce.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="capitalize font-semibold text-neutral-500 text-[11px] px-2 py-0.5 rounded-md bg-neutral-50 border border-neutral-200">
                    {sauce.profile}
                  </span>
                  <div className="flex items-center gap-1">
                    {sauce.heatLevel > 0 ? (
                      Array.from({ length: sauce.heatLevel }).map((_, i) => (
                        <Flame key={i} className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                      ))
                    ) : (
                      <span className="text-[11px] font-medium text-emerald-700">Velvety</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA prompt */}
        {onSelectCustomize && (
          <div className="mt-12 text-center">
            <button
              id="flavours-build-custom-order-btn"
              onClick={onSelectCustomize}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all active:scale-95 hover:-translate-y-0.5 cursor-pointer"
            >
              <ChefHat className="w-4 h-4 text-amber-300" />
              <span>Customize Your Hand-Cut Fries Now</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
