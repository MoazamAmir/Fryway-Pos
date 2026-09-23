import React, { useState } from 'react';
import {
  UserCog,
  Plus,
  ShieldCheck,
  ChefHat,
  Store,
  KeyRound,
  CheckCircle2,
  XCircle,
  Phone,
  Calendar,
  Lock,
} from 'lucide-react';
import { StaffMember } from '../../types';

interface AdminStaffTabProps {
  staffList: StaffMember[];
  onToggleStatus: (id: string) => void;
  onUpdatePin: (id: string, pin: string) => void;
  onAddStaff: (staff: Omit<StaffMember, 'id' | 'joinedDate'>) => void;
}

export const AdminStaffTab: React.FC<AdminStaffTabProps> = ({
  staffList,
  onToggleStatus,
  onUpdatePin,
  onAddStaff,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'kitchen' | 'counter'>('counter');
  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');

  // Editing PIN inline
  const [editingPinId, setEditingPinId] = useState<string | null>(null);
  const [newPinVal, setNewPinVal] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || pin.length < 4) return;

    onAddStaff({
      name: name.trim(),
      role,
      pin: pin.trim(),
      phone: phone.trim() || undefined,
      status: 'active',
    });

    setName('');
    setPin('');
    setPhone('');
    setIsModalOpen(false);
  };

  const handleSavePin = (id: string) => {
    if (newPinVal.length >= 4) {
      onUpdatePin(id, newPinVal);
    }
    setEditingPinId(null);
    setNewPinVal('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">
            Staff & Access Authorization
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage authorized staff accounts and security PINs for Admin, Kitchen, and Counter roles.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((member) => {
          const isActive = member.status === 'active';
          const isEditingPin = editingPinId === member.id;
          const RoleIcon =
            member.role === 'admin'
              ? ShieldCheck
              : member.role === 'kitchen'
              ? ChefHat
              : Store;

          return (
            <div
              key={member.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-neutral-200/90 shadow-xs'
                  : 'bg-neutral-50 border-neutral-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 ${
                        member.role === 'admin'
                          ? 'bg-emerald-100 text-emerald-800'
                          : member.role === 'kitchen'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <RoleIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-neutral-900 text-sm block">{member.name}</span>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                        Role: {member.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleStatus(member.id)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Details & PIN */}
              <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral-600">
                  <span className="text-[11px] font-semibold">Security PIN:</span>
                  {isEditingPin ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        maxLength={6}
                        value={newPinVal}
                        onChange={(e) => setNewPinVal(e.target.value)}
                        className="w-16 bg-white border border-emerald-700 text-emerald-900 px-2 py-0.5 rounded text-xs font-mono font-bold text-center"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSavePin(member.id)}
                        className="px-2 py-0.5 rounded bg-emerald-800 text-white text-[10px] font-bold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-neutral-900 bg-neutral-100 px-2.5 py-0.5 rounded border border-neutral-200">
                        ••••
                      </span>
                      <button
                        onClick={() => {
                          setEditingPinId(member.id);
                          setNewPinVal(member.pin);
                        }}
                        className="text-emerald-800 hover:underline text-[11px] font-bold cursor-pointer"
                      >
                        Reset PIN
                      </button>
                    </div>
                  )}
                </div>

                {member.phone && (
                  <div className="flex items-center justify-between text-neutral-500 text-[11px]">
                    <span>Phone:</span>
                    <span className="text-neutral-800 font-mono">{member.phone}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                  <span>Authorized Since:</span>
                  <span>{member.joinedDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-black text-neutral-900 uppercase">
                Authorize New Staff Member
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-neutral-700 font-bold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asif Mehmood"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="text-neutral-700 font-bold block mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:bg-white focus:outline-none"
                >
                  <option value="counter">Counter / Cashier Staff</option>
                  <option value="kitchen">Kitchen Display Operator (KDS)</option>
                  <option value="admin">Executive Store Manager (Admin)</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-700 font-bold block mb-1">Security PIN (4 digits)</label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="text-neutral-700 font-bold block mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold cursor-pointer"
                >
                  Authorize Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
