import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  ChefHat,
  Tablet,
  Users,
  Lock,
  X,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { AppRole } from '../../types';
import { AUTH_PINS, WAITER_STAFF } from '../../lib/restaurantStore';
import { audioAlerts } from '../../lib/audioAlerts';

interface RoleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: AppRole;
  onSuccessRoleChange: (role: AppRole) => void;
}

export const RoleAuthModal: React.FC<RoleAuthModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  onSuccessRoleChange,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const roleMeta = {
    customer: {
      title: 'Customer Website',
      desc: 'Public ordering menu and order status tracker',
      icon: Users,
      color: 'emerald',
    },
    waiter: {
      title: 'Waiter Tablet POS',
      desc: 'Table service ordering for Ali Raza, Hamza Khan & Bilal Ahmed',
      icon: Tablet,
      color: 'blue',
    },
    kitchen: {
      title: 'Kitchen Display (KDS)',
      desc: 'Fryer station screen to accept orders and ring ready chimes',
      icon: ChefHat,
      color: 'amber',
    },
    admin: {
      title: 'Owner Executive Admin',
      desc: 'Owner-only financial analytics, daily/weekly/monthly expenses & menu control',
      icon: ShieldCheck,
      color: 'red',
    },
  }[targetRole];

  const IconComponent = roleMeta.icon;

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(null);
      audioAlerts.playSuccessTone();

      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const verifyPin = (enteredPin: string) => {
    if (targetRole === 'kitchen') {
      if (enteredPin === AUTH_PINS.kitchen || enteredPin === '1234') {
        onSuccessRoleChange('kitchen');
        onClose();
      } else {
        setError('Invalid Kitchen Staff PIN. Hint: 5555');
      }
    } else if (targetRole === 'admin') {
      if (enteredPin === AUTH_PINS.admin || enteredPin === '1234') {
        onSuccessRoleChange('admin');
        onClose();
      } else {
        setError('Invalid Owner PIN. Hint: 7777');
      }
    } else if (targetRole === 'waiter') {
      const staffMatch = WAITER_STAFF.some((s) => s.pin === enteredPin);
      if (staffMatch || enteredPin === AUTH_PINS.waiterDemo || enteredPin === '1111') {
        onSuccessRoleChange('waiter');
        onClose();
      } else {
        setError('Invalid Waiter PIN. Hint: 1111, 2222, or 3333');
      }
    } else {
      onSuccessRoleChange('customer');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-sm bg-neutral-900 rounded-3xl p-6 sm:p-7 border border-neutral-800 z-10 shadow-2xl text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <IconComponent className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-black font-['Syne',sans-serif] uppercase text-white">
            {roleMeta.title}
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto mb-5">
            {roleMeta.desc}
          </p>

          {/* PIN Dots Display */}
          <div className="flex justify-center gap-3 mb-5">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  idx < pin.length
                    ? 'bg-amber-400 border-amber-400 scale-110 shadow-md shadow-amber-400/30'
                    : 'border-neutral-700 bg-neutral-950'
                }`}
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 text-xs font-bold text-red-400 flex items-center justify-center gap-1.5 bg-red-950/40 p-2 rounded-xl border border-red-900/50">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                onClick={() => handleKeyPress(digit)}
                className="h-12 rounded-2xl bg-neutral-800 hover:bg-neutral-750 active:bg-amber-400 active:text-neutral-950 text-white font-black text-base transition-all shadow-2xs"
              >
                {digit}
              </button>
            ))}
            <button
              onClick={() => setPin('')}
              className="h-12 rounded-2xl bg-neutral-850 hover:bg-neutral-800 text-neutral-400 text-xs font-bold transition-all"
            >
              Clear
            </button>
            <button
              onClick={() => handleKeyPress('0')}
              className="h-12 rounded-2xl bg-neutral-800 hover:bg-neutral-750 active:bg-amber-400 active:text-neutral-950 text-white font-black text-base transition-all"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="h-12 rounded-2xl bg-neutral-850 hover:bg-neutral-800 text-neutral-400 text-xs font-bold transition-all"
            >
              ⌫
            </button>
          </div>

          {/* Demo Quick PIN Helpers */}
          <div className="pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex flex-col gap-1 items-center">
            <span className="font-semibold text-neutral-300">Staff PIN Cheat Sheet:</span>
            <div className="flex flex-wrap gap-1.5 justify-center mt-0.5">
              {targetRole === 'waiter' && (
                <>
                  <button
                    onClick={() => verifyPin('1111')}
                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-[10px] font-mono font-bold"
                  >
                    Ali Raza (1111)
                  </button>
                  <button
                    onClick={() => verifyPin('2222')}
                    className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-[10px] font-mono font-bold"
                  >
                    Hamza (2222)
                  </button>
                </>
              )}
              {targetRole === 'kitchen' && (
                <button
                  onClick={() => verifyPin('5555')}
                  className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-[10px] font-mono font-bold"
                >
                  Kitchen Chef (5555)
                </button>
              )}
              {targetRole === 'admin' && (
                <button
                  onClick={() => verifyPin('7777')}
                  className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-[10px] font-mono font-bold"
                >
                  Owner Admin (7777)
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
