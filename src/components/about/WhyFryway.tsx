import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Sparkles, Droplets, Bike, Award, CheckCircle2 } from 'lucide-react';

export const WhyFryway: React.FC = () => {
  const benefits = [
    {
      icon: Utensils,
      title: 'HAND CUT FRIES',
      badge: '100% Fresh Daily',
      description: 'We cut raw, premium whole potatoes by hand every single morning. Never pre-frozen or processed factory sticks.',
      accent: 'emerald',
    },
    {
      icon: Sparkles,
      title: 'LOADED WITH FLAVOUR',
      badge: '17 Seasonings',
      description: 'From Subcontinental Tikka and Chat Masala to Mexican zest and Butter Garlic, customized in vibrant flavor shakers.',
      accent: 'amber',
    },
    {
      icon: Droplets,
      title: '13 ARTISAN SAUCES',
      badge: 'House Blended',
      description: 'Creamy Garlic Mayo, Cheese Mayo, fiery Pakistani Green Chilli, Smokey BBQ, and Buffalo made fresh in-house.',
      accent: 'emerald',
    },
    {
      icon: Bike,
      title: 'TAKEAWAY & DELIVERY',
      badge: 'Bahria Town Lahore',
      description: 'Quick takeaway counter pickup or prompt thermal-insulated bike delivery to your doorstep in Bahria Town.',
      accent: 'amber',
    },
  ];

  return (
    <section id="why-fryway" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-black uppercase tracking-wider mb-3 border border-emerald-200">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>The Fryway Difference</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] uppercase tracking-tight text-neutral-900 mb-4">
            WHY FOOD LOVERS CHOOSE FRYWAY
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
            We started with a single obsession: to bring truly authentic, non-frozen hand-cut potato fries to Lahore, perfectly seasoned and drenched in decadent sauces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-7 rounded-3xl bg-neutral-50 border border-neutral-200/90 hover:border-emerald-800/40 hover:bg-emerald-50/20 transition-all duration-300 flex flex-col justify-between group shadow-xs hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-md shadow-emerald-900/10 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-neutral-600">
                      {benefit.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black font-['Syne',sans-serif] uppercase text-neutral-900 mb-2.5 group-hover:text-emerald-900 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200/60 flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Always Fresh Guaranteed</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
