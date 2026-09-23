import React, { useState } from 'react';
import {
  Store,
  Clock,
  Phone,
  MapPin,
  Bike,
  CheckCircle2,
  Save,
  AlertTriangle,
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
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
            Business & Store Settings
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure restaurant open/closed status, operating hours, Bahria Town delivery rates, and store contact info.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Settings Saved & Live!</span>
          </div>
        )}
      </div>

      {/* 1. Master Store Operational Status Switch */}
      <div
        className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
          formData.isOpen
            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
            : 'bg-rose-50/80 border-rose-200 text-rose-950'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shrink-0 ${
              formData.isOpen ? 'bg-emerald-800 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-neutral-900 text-base">
                Restaurant Status: {formData.isOpen ? 'OPEN' : 'CLOSED'}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  formData.isOpen ? 'bg-emerald-200/80 text-emerald-900' : 'bg-rose-200/80 text-rose-900'
                }`}
              >
                {formData.isOpen ? 'Accepting Orders' : 'Store Paused'}
              </span>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5 max-w-xl">
              {formData.isOpen
                ? 'Customers can browse and place live takeaway & delivery orders.'
                : 'Customer website will display a "Currently Closed" notice with your regular opening hours.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleStoreStatus}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm shrink-0 cursor-pointer ${
            formData.isOpen
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-emerald-800 hover:bg-emerald-900 text-white'
          }`}
        >
          {formData.isOpen ? 'Temporarily Close Store' : 'Open Store Now'}
        </button>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs space-y-6 text-xs">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2">
          Branch & Brand Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-neutral-700 font-bold block mb-1">Restaurant Name</label>
            <input
              type="text"
              value={formData.restaurantName}
              onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="text-neutral-700 font-bold block mb-1">Brand Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="text-neutral-700 font-bold block mb-1">Contact Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="text-neutral-700 font-bold block mb-1">Branch Physical Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-neutral-700 font-bold block mb-1">Operating Hours Notice</label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2 pt-2">
          Delivery & Pricing Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-neutral-700 font-bold block mb-1">Delivery Fee (PKR)</label>
            <input
              type="number"
              value={formData.deliveryFee}
              onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) || 0 })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Applied on Bahria Town delivery orders.
            </span>
          </div>

          <div>
            <label className="text-neutral-700 font-bold block mb-1">Free Delivery Over (PKR)</label>
            <input
              type="number"
              value={formData.freeDeliveryThreshold}
              onChange={(e) =>
                setFormData({ ...formData, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })
              }
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Orders above this amount get Rs 0 delivery.
            </span>
          </div>

          <div>
            <label className="text-neutral-700 font-bold block mb-1">Display Currency</label>
            <input
              type="text"
              disabled
              value={formData.currency}
              className="w-full bg-neutral-100 border border-neutral-200 text-neutral-500 rounded-xl px-3 py-2"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Operational Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
