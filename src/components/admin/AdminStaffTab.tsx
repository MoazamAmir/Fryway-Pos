import React, { useState } from 'react';
import {
  UserCog,
  Plus,
  ShieldCheck,
  ChefHat,
  Tablet,
  KeyRound,
  CheckCircle2,
  XCircle,
  Phone,
  Calendar,
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
        <div>
          <h2 className="text-lg font-black text-white font-['Syne',sans-serif] uppercase">
            Staff & Terminal Access Control
          </h2>
          <p className="text-xs text-neutral-400">
            Manage PIN credentials for executive admin, kitchen display terminal, and table waiter tablets.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black transition-all shadow-md shrink-0"
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
              : Tablet;

          return (
            <div
              key={member.id}
              className={`p-4 rounded-2xl border transition-all ${
                isActive
                  ? 'bg-neutral-900 border-neutral-800'
                  : 'bg-neutral-900/40 border-rose-900/40 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                      member.role === 'admin'
                        ? 'bg-amber-400/20 text-amber-300'
                        : member.role === 'kitchen'
                        ? 'bg-orange-500/20 text-orange-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    <RoleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block">{member.name}</span>
                    <span className="text-[11px] text-neutral-400 capitalize flex items-center gap-1">
                      {member.role} Portal Staff
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleStatus(member.id)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase transition-all shrink-0 ${
                    isActive
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  {isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              {/* Details & PIN */}
              <div className="pt-3 border-t border-neutral-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-[11px]">Login PIN Code:</span>
                  {isEditingPin ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        maxLength={6}
                        value={newPinVal}
                        onChange={(e) => setNewPinVal(e.target.value)}
                        className="w-16 bg-neutral-950 border border-amber-400 text-amber-300 px-2 py-0.5 rounded text-xs font-mono font-bold text-center"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSavePin(member.id)}
                        className="px-2 py-0.5 rounded bg-amber-400 text-neutral-950 text-[10px] font-black"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-amber-300 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                        {member.pin}
                      </span>
                      <button
                        onClick={() => {
                          setEditingPinId(member.id);
                          setNewPinVal(member.pin);
                        }}
                        className="text-neutral-500 hover:text-amber-300 text-[10px] underline"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>

                {member.phone && (
                  <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                    <span>Phone:</span>
                    <span className="text-neutral-300">{member.phone}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-neutral-500 text-[10px]">
                  <span>Member Since:</span>
                  <span>{member.joinedDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-black text-white uppercase font-['Syne',sans-serif]">
              Register New Staff Member
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-neutral-400 font-bold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asif Mehmood"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-neutral-400 font-bold block mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="counter">Counter / Waiter Tablet (POS)</option>
                  <option value="kitchen">Kitchen Display Operator (KDS)</option>
                  <option value="admin">Executive Store Manager (Admin)</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-400 font-bold block mb-1">Security PIN (4 digits)</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="e.g. 4829"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-neutral-400 font-bold block mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-neutral-950 font-black shadow-md hover:bg-amber-300"
                >
                  Register Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
