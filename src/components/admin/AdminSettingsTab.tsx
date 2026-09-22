import React, { useState } from 'react';
import {
  Settings,
  Store,
  Clock,
  Phone,
  MapPin,
  Bike,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { BusinessSettings } from '../../types';

interface AdminSettingsTabProps {
  settings: BusinessSettings;
  onUpdateSettings: (partial: Partial<BusinessSettings>) => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [formData, setFormData] = useState<BusinessSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleToggleStoreStatus = () => {
    const nextStatus = !formData.isOpen;
    const updated = { ...formData, isOpen: nextStatus };
    setFormData(updated);
    onUpdateSettings({ isOpen: nextStatus });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
        <div>
          <h2 className="text-lg font-black text-white font-['Syne',sans-serif] uppercase">
            Store & Operational Settings
          </h2>
          <p className="text-xs text-neutral-400">
            Configure restaurant open/closed status, operating hours, Bahria Town delivery pricing, and brand details.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved & Live!</span>
          </div>
        )}
      </div>

      {/* 1. Quick Master Store Status Switch */}
      <div
        className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          formData.isOpen
            ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
            : 'bg-rose-950/40 border-rose-900/80 text-rose-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
              formData.isOpen ? 'bg-emerald-500 text-neutral-950' : 'bg-rose-500 text-white'
            }`}
          >
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base">
                Restaurant Operational Status: {formData.isOpen ? 'OPEN' : 'CLOSED'}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  formData.isOpen ? 'bg-emerald-400/20 text-emerald-300' : 'bg-rose-400/20 text-rose-300'
                }`}
              >
                {formData.isOpen ? 'Accepting Orders' : 'Store Paused'}
              </span>
            </div>
            <p className="text-xs opacity-80 mt-0.5">
              {formData.isOpen
                ? 'Customers can browse and place live takeaway & delivery orders.'
                : 'Customer website will display a "Currently Closed" notice with your regular opening hours.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleStoreStatus}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0 ${
            formData.isOpen
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
          }`}
        >
          {formData.isOpen ? 'Temporarily Close Store' : 'Open Store Now'}
        </button>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-5 text-xs">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2">
          Branch & Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-neutral-400 font-bold block mb-1">Restaurant Brand Name</label>
            <input
              type="text"
              value={formData.restaurantName}
              onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-neutral-400 font-bold block mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-neutral-400 font-bold block mb-1">Contact Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-neutral-400 font-bold block mb-1">Branch Physical Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-neutral-400 font-bold block mb-1">Operating Hours Notice</label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2 pt-2">
          Delivery & Pricing Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-neutral-400 font-bold block mb-1">Standard Delivery Fee (PKR)</label>
            <input
              type="number"
              value={formData.deliveryFee}
              onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) || 0 })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-neutral-400 font-bold block mb-1">Free Delivery Threshold (PKR)</label>
            <input
              type="number"
              value={formData.freeDeliveryThreshold}
              onChange={(e) =>
                setFormData({ ...formData, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })
              }
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Orders above this amount get Rs 0 delivery fee automatically.
            </span>
          </div>

          <div>
            <label className="text-neutral-400 font-bold block mb-1">Display Currency</label>
            <input
              type="text"
              disabled
              value={formData.currency}
              className="w-full bg-neutral-950/60 border border-neutral-800 text-neutral-400 rounded-xl px-3 py-2"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Operational Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
