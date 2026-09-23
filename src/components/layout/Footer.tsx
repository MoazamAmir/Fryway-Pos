import React from 'react';
import { Phone, MapPin, Clock, ArrowUp, Heart, Sparkles } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { RESTAURANT_INFO } from '../../data/menuData';

interface FooterProps {
  onNavigateToSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToSection }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-emerald-950 text-white border-t border-emerald-900 pt-16 pb-12 relative overflow-hidden"><div className="absolute inset-0 opacity-[0.08] fryway-section-surface pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-emerald-900/80">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo size="lg" variant="white" />
            <p className="text-xs text-emerald-200/80 max-w-sm leading-relaxed">
              Authentic hand-cut fries crafted from premium Pakistani potatoes, double-fried for the crunch you crave. Shaken with 17 custom seasonings and paired with 13 gourmet house sauces.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900 border border-emerald-800 text-[11px] font-bold text-amber-300">
                <Sparkles className="w-3 h-3" />
                Bahria Town Lahore
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900 border border-emerald-800 text-[11px] font-bold text-emerald-200">
                100% Halal
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateToSection('hero')}
                  className="text-emerald-200/90 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('menu')}
                  className="text-emerald-200/90 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Fries Menu & Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('flavours-sauces')}
                  className="text-emerald-200/90 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  17 Flavours & 13 Sauces
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('why-fryway')}
                  className="text-emerald-200/90 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  The Hand-Cut Craft
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('about')}
                  className="text-emerald-200/90 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  About Fryway
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('contact')}
                  className="text-emerald-200/90 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Contact & Locations
                </button>
              </li>
            </ul>
          </div>

          {/* Order Types */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider">
              Order Channels
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/90">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Takeaway Counter</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Home Delivery</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Phone Orders</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>WhatsApp Catering</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-emerald-200/90">
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="flex items-center gap-2 hover:text-white transition-colors font-bold text-sm text-white"
              >
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{RESTAURANT_INFO.phoneDisplay}</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{RESTAURANT_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Daily: 1:00 PM – 2:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/70">
          <div>
            © {new Date().getFullYear()} FRYWAY. All rights reserved. Authentic Hand Cut Fries.
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="/kitchen"
              onClick={(e) => {
                e.preventDefault();
                window.location.pathname = '/kitchen';
              }}
              className="text-emerald-300/80 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Kitchen KDS</span>
            </a>
            <span className="text-emerald-800">•</span>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                window.location.pathname = '/admin';
              }}
              className="text-emerald-300/80 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Admin Portal</span>
            </a>
            <span className="text-emerald-800">•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

