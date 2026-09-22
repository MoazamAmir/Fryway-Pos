import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MapPin, HeartHandshake, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FRYWAY_IMAGES, RESTAURANT_INFO } from '../../data/menuData';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-neutral-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Store Craft Photo (Replaceable Architecture) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-neutral-900 group">
              <img
                src={FRYWAY_IMAGES.storeCraft}
                alt="Fryway Kitchen Hand Cut Fries preparation in Bahria Town Lahore"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] sm:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Tag on image */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-200 shadow-sm">
                <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  {RESTAURANT_INFO.location}
                </span>
              </div>

              {/* Bottom Card */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-white/80 shadow-md">
                <span className="text-[11px] font-bold uppercase text-emerald-800 tracking-wider block mb-1">
                  Artisan Hand-Cut Standard
                </span>
                <p className="text-xs sm:text-sm text-neutral-800 font-semibold leading-relaxed">
                  "Freshly prepared hand-cut fries, loaded with flavour and served your way."
                </p>
              </div>
            </div>

            {/* Corner Decorative Badge */}
            <div className="hidden sm:flex absolute -bottom-5 -right-5 items-center gap-2 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-700">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <div>
                <div className="text-xs font-black uppercase">Pure Potato Bliss</div>
                <div className="text-[10px] text-emerald-200">Zero Preservatives</div>
              </div>
            </div>
          </motion.div>

          {/* About Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider mb-3">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-800" />
              <span>About Fryway</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] uppercase tracking-tight text-neutral-900 mb-6 leading-tight">
              AUTHENTIC HAND CUT FRIES, ELEVATED.
            </h2>

            <div className="space-y-4 text-neutral-600 text-sm sm:text-base leading-relaxed mb-8">
              <p>
                At Fryway, we refuse to compromise. We believe that real French fries cannot come out of a freezer bag. That is why we source whole, prime Pakistani potatoes, cut them fresh by hand in our kitchen, and cook them using a specialized two-stage temperature method.
              </p>
              <p>
                The result? A crisp, caramelized golden crunch on the outside that yields to a steamy, fluffy interior. Tossed in your favorite of our 17 custom-blended seasonings and paired with any of our 13 gourmet house sauces, Fryway turns the humble fry into an unforgettable culinary experience.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Double-Fried for Lasting Crunch</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Sealed Thermal Packaging</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>100% Halal Certified Kitchen</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Custom Spice-to-Order</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
