import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'white';
  showTagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showTagline = true,
  className = '',
}) => {
  const isLight = variant === 'light' || variant === 'white';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-base sm:text-lg tracking-wider',
    md: 'text-xl sm:text-2xl tracking-wider',
    lg: 'text-2xl sm:text-3xl tracking-wider',
    xl: 'text-3xl sm:text-4xl tracking-wider',
  };

  const taglineSizes = {
    sm: 'text-[8.5px] sm:text-[9.5px] tracking-[0.14em]',
    md: 'text-[9.5px] sm:text-[11px] tracking-[0.16em]',
    lg: 'text-[11px] sm:text-xs tracking-[0.18em]',
    xl: 'text-xs sm:text-sm tracking-[0.2em]',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Brand Icon: Modern geometric hand-cut fries insignia in fryway green */}
      <div
        className={`relative flex items-center justify-center shrink-0 rounded-xl transition-transform duration-300 hover:scale-105 ${
          iconSizes[size]
        } ${
          isLight
            ? 'bg-white text-emerald-900 shadow-md shadow-emerald-950/10'
            : 'bg-emerald-800 text-white shadow-md shadow-emerald-800/20'
        }`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4"
        >
          {/* Packaging Box silhouette */}
          <path
            d="M8 20L13 40C13.5 42 15 43 17 43H31C33 43 34.5 42 35 40L40 20C40.5 18 39.5 17 38 17H10C8.5 17 7.5 18 8 20Z"
            fill={isLight ? '#064e3b' : '#ffffff'}
          />
          {/* Golden crispy hand-cut fry sticks fanning out */}
          <rect
            x="14"
            y="7"
            width="3.6"
            height="18"
            rx="1.8"
            transform="rotate(-10 14 7)"
            fill="#f59e0b"
          />
          <rect
            x="20.5"
            y="5"
            width="4.2"
            height="21"
            rx="2.1"
            transform="rotate(-2 20.5 5)"
            fill="#fbbf24"
          />
          <rect
            x="28.5"
            y="6"
            width="3.8"
            height="19"
            rx="1.9"
            transform="rotate(9 28.5 6)"
            fill="#f59e0b"
          />
          {/* Subtle stylized F emblem on box */}
          <path
            d="M21 27H27M21 27V36M21 31H25.5"
            stroke={isLight ? '#ffffff' : '#064e3b'}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-baseline gap-1">
          <span
            className={`font-black font-['Plus_Jakarta_Sans',sans-serif] uppercase leading-tight ${
              titleSizes[size]
            } ${isLight ? 'text-white' : 'text-emerald-950'}`}
          >
            FRYWAY
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block mb-0.5"></span>
        </div>
        {showTagline && (
          <span
            className={`font-bold uppercase font-['Plus_Jakarta_Sans',sans-serif] whitespace-nowrap pt-0.5 ${
              taglineSizes[size]
            } ${isLight ? 'text-emerald-200' : 'text-emerald-800'}`}
          >
            AUTHENTIC HAND CUT FRIES
          </span>
        )}
      </div>
    </div>
  );
};
