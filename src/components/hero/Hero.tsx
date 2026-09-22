import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Flame, Clock, ShieldCheck, Star } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { FRYWAY_IMAGES, RESTAURANT_INFO } from '../../data/menuData';

interface HeroProps {
  onOrderNow: () => void;
  onExploreMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNow, onExploreMenu }) => {
  return (
    <section
      id="hero"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-neutral-50"
    >
      {/* Subtle organic background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Live Operational Status Tag */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-2xl sm:rounded-full bg-white border border-emerald-200/80 shadow-xs mb-6">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Now Serving Fresh in Bahria Town
              </span>
              <span className="text-neutral-300 hidden sm:inline">|</span>
              <span className="text-xs font-semibold text-emerald-800">
                1:00 PM – 2:00 AM
              </span>
            </div>

            {/* Brand Title / Tagline Badge */}
            <div className="mb-4">
              <BrandLogo size="lg" variant="dark" />
            </div>

            {/* Hero Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-['Plus_Jakarta_Sans',sans-serif] tracking-tight text-neutral-900 uppercase leading-[1.16] sm:leading-[1.12] mb-6 break-words">
              CRISPY.{' '}
              <span className="text-emerald-800 underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-8">
                LOADED.
              </span>{' '}
              UNFORGETTABLE.
            </h1>

            {/* Value Proposition description */}
            <p className="text-base sm:text-lg text-neutral-700 max-w-2xl leading-relaxed mb-8 font-['Plus_Jakarta_Sans',sans-serif]">
              Authentic hand-cut potato fries, freshly prepared from whole Pakistani potatoes and double-fried for the ultimate golden crunch. Tossed in your pick of{' '}
              <span className="font-bold text-emerald-900">17 bold seasonings</span> and dipped in{' '}
              <span className="font-bold text-emerald-900">13 signature house-made sauces</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <button
                id="hero-order-now-cta"
                onClick={onOrderNow}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-base shadow-lg shadow-emerald-950/20 hover:shadow-emerald-950/30 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>ORDER NOW</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-explore-menu-cta"
                onClick={onExploreMenu}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-emerald-50 text-emerald-900 border-2 border-emerald-800/30 hover:border-emerald-800 font-bold text-base transition-all focus:outline-none"
              >
                <span>Explore Menu & Pricing</span>
              </button>
            </div>

            {/* Trust Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-emerald-100/90 w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">Hand-Cut Daily</div>
                  <div className="text-[11px] text-neutral-500">Never Frozen</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">17 Flavours</div>
                  <div className="text-[11px] text-neutral-500">Custom Shaken</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">13 Sauces</div>
                  <div className="text-[11px] text-neutral-500">House Gourmet</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">Hot Delivery</div>
                  <div className="text-[11px] text-neutral-500">Bahria Town</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Visual Column (Hero Image) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            {/* Modern Card Frame for Hero Food Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/20 border-4 border-white bg-white group">
              <img
                src={FRYWAY_IMAGES.hero}
                alt="Fryway Authentic Hand Cut Fries with signature sauces and seasonings"
                referrerPolicy="no-referrer"
                className="w-full h-[360px] sm:h-[440px] lg:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlay for Tag Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10 pointer-events-none" />

              {/* Floating Badge on Image */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-md">
                <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Premium Potato Cut
                </span>
              </div>

              {/* Floating Bottom Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Starting From
                    </div>
                    <div className="text-2xl font-black text-neutral-900">
                      Rs 230 <span className="text-xs font-normal text-neutral-500">/ Regular</span>
                    </div>
                  </div>
                  <button
                    onClick={onOrderNow}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    Customize Now
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative Subtle Accent Tag */}
            <div className="hidden sm:block absolute -bottom-5 -left-5 bg-amber-400 text-amber-950 font-black text-xs uppercase px-4 py-2 rounded-xl shadow-md rotate-[-3deg] border border-amber-300">
              ⚡ Double Cooked for Ultra Crunch
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
