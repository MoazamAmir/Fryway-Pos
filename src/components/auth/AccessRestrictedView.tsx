import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Lock,
  KeyRound,
  ArrowLeft,
  ChefHat,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Delete,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface AccessRestrictedViewProps {
  portal: 'kitchen' | 'admin';
  onAuthenticate: (pin: string) => boolean;
  onReturnHome: () => void;
}

export const AccessRestrictedView: React.FC<AccessRestrictedViewProps> = ({
  portal,
  onAuthenticate,
  onReturnHome,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const isKitchen = portal === 'kitchen';
  const expectedPin = isKitchen ? '5555' : '7777';
  const portalName = isKitchen ? 'Kitchen Display System' : 'Executive Admin Portal';
  const portalSubtitle = isKitchen
    ? 'Frying Queue & Line Chef Terminal'
    : 'Business Metrics & Management Portal';

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(null);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    setPin('');
    setError(null);
  };

  const verifyPin = (pinToTest: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      const success = onAuthenticate(pinToTest);
      if (!success) {
        setError('Incorrect authorization PIN code. Please try again.');
        setPin('');
      }
      setIsVerifying(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) {
      verifyPin(pin);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-emerald-950 to-neutral-950 text-white flex flex-col justify-between p-4 sm:p-6 md:p-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar with Brand Logo and Back CTA */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b border-white/10">
        <button
          onClick={onReturnHome}
          className="text-left focus:outline-none"
          aria-label="Fryway Home"
        >
          <BrandLogo size="md" variant="light" />
        </button>

        <button
          onClick={onReturnHome}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white text-xs font-bold transition-all active:scale-95 border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Customer Ordering</span>
        </button>
      </header>

      {/* Main Card */}
      <main className="max-w-md mx-auto w-full my-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-neutral-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Corner Glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Portal Icon & Restrict Pill */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-300 border border-emerald-700/80 shadow-lg mb-4">
              {isKitchen ? (
                <ChefHat className="w-8 h-8 stroke-[2.2]" />
              ) : (
                <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/30 text-[11px] font-black uppercase tracking-wider mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Access Restricted</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif] uppercase tracking-tight text-white leading-tight">
              {portalName}
            </h1>
            <p className="text-xs text-neutral-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
              {portalSubtitle}. Enter your authorized staff security PIN to unlock this terminal.
            </p>
          </div>

          {/* PIN Input Display */}
          <div className="mb-6">
            <div className="flex justify-center items-center gap-3 mb-2">
              {[0, 1, 2, 3].map((idx) => {
                const filled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-black transition-all ${
                      filled
                        ? 'border-emerald-500 bg-emerald-900/40 text-emerald-200 shadow-sm'
                        : 'border-white/15 bg-white/5 text-neutral-500'
                    }`}
                  >
                    {filled ? '●' : ''}
                  </div>
                );
              })}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center justify-center gap-1.5 text-xs text-red-400 font-semibold mt-2 text-center"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Numeric Keypad for Tablet / Touch & Mouse */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                className="h-13 rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/25 border border-white/10 text-lg font-black text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-2xs"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-13 rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/25 border border-white/10 text-xs font-bold text-neutral-400 uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-13 rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/25 border border-white/10 text-lg font-black text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-2xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-13 rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/25 border border-white/10 text-neutral-400 hover:text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer"
              aria-label="Backspace"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Demo Helper Hint */}
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-neutral-300">
                Staff Demo PIN:{' '}
                <strong className="text-amber-300 font-mono tracking-wider">{expectedPin}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setPin(expectedPin);
                verifyPin(expectedPin);
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-bold active:scale-95 transition-all cursor-pointer"
            >
              Auto-Fill
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="max-w-5xl mx-auto w-full text-center py-4 border-t border-white/10 text-xs text-neutral-400">
        <p>
          Fryway Authentic Hand Cut Fries &copy; {new Date().getFullYear()} — All unauthorized
          access attempts to this terminal are logged and monitored.
        </p>
      </footer>
    </div>
  );
};
