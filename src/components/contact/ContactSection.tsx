import React from 'react';
import { motion } from 'motion/react';
import { Phone, MapPin, Clock, MessageSquare, Navigation, ArrowRight, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../../data/menuData';

interface ContactSectionProps {
  onOrderNow: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOrderNow }) => {
  const whatsappMessage = encodeURIComponent(
    'Hello Fryway Bahria Town! I would like to place an order.'
  );

  return (
    <section id="contact" className="py-20 bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-black uppercase tracking-wider mb-3 border border-emerald-200">
            <Phone className="w-3.5 h-3.5 text-emerald-800" />
            <span>Visit or Call Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] uppercase tracking-tight text-neutral-900 mb-4">
            GET YOUR HOT FRIES
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
            Ready for takeaway counter pickup or direct doorstep delivery across Bahria Town Lahore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Phone Contact Card */}
          <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 hover:border-emerald-800/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-900/10">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase text-neutral-400 tracking-wider block mb-1">
                Direct Telephone
              </span>
              <h3 className="text-2xl font-black text-neutral-900 mb-2 font-['Syne',sans-serif]">
                {RESTAURANT_INFO.phoneDisplay}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Call our takeaway counter directly for fast pickup coordination or special party orders.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-neutral-200/80 flex flex-col gap-2">
              <a
                id="contact-call-now-btn"
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <Phone className="w-4 h-4 text-amber-300" />
                <span>Call Now</span>
              </a>
              <a
                id="contact-whatsapp-btn"
                href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold text-center flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Location Card */}
          <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 hover:border-emerald-800/30 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-900/10">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase text-neutral-400 tracking-wider block mb-1">
                Location & Takeaway Counter
              </span>
              <h3 className="text-2xl font-black text-neutral-900 mb-2 font-['Syne',sans-serif]">
                {RESTAURANT_INFO.location}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {RESTAURANT_INFO.address}. Quick drive-by pickup available with easy parking access.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-neutral-200/80">
              <a
                id="contact-get-directions-btn"
                href="https://maps.google.com/?q=Bahria+Town+Lahore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Timings & Online Ordering Card */}
          <div className="p-8 rounded-3xl bg-emerald-950 text-white border border-emerald-900 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center mb-6 shadow-md">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase text-emerald-300 tracking-wider block mb-1">
                Operating Hours
              </span>
              <h3 className="text-2xl font-black text-white mb-2 font-['Syne',sans-serif]">
                1:00 PM – 2:00 AM
              </h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Open 7 days a week, serving sizzling hot hand-cut fries for afternoon snacks and late-night cravings.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-emerald-900">
              <button
                id="contact-order-now-btn"
                onClick={onOrderNow}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Order Takeaway or Delivery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
