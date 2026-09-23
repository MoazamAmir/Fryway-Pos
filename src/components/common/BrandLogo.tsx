import React from 'react';
import frywayLogoImg from '../../assets/fryway_logo.png';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'white';
  showTagline?: boolean;
  className?: string;
  onlyIcon?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showTagline = true,
  className = '',
  onlyIcon = false,
}) => {
  const isLight = variant === 'light' || variant === 'white';

  const logoSizes = {
    sm: 'h-8 sm:h-9 w-auto',
    md: 'h-10 sm:h-12 md:h-13 w-auto',
    lg: 'h-14 sm:h-16 md:h-20 w-auto',
    xl: 'h-20 sm:h-24 md:h-28 w-auto',
  };

  const titleSizes = {
    sm: 'text-base sm:text-lg tracking-wider',
    md: 'text-lg sm:text-xl md:text-2xl tracking-wider',
    lg: 'text-2xl sm:text-3xl tracking-wider',
    xl: 'text-3xl sm:text-4xl tracking-wider',
  };

  const taglineSizes = {
    sm: 'text-[7.5px] sm:text-[8.5px] tracking-[0.14em]',
    md: 'text-[8.5px] sm:text-[9.5px] md:text-[10px] tracking-[0.15em]',
    lg: 'text-[10.5px] sm:text-xs tracking-[0.18em]',
    xl: 'text-xs sm:text-sm tracking-[0.2em]',
  };

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 md:gap-3 select-none ${className}`}>
      {/* Official FryWay Diamond Fries Emblem with zero clipping */}
      <div className="relative shrink-0 flex items-center justify-center p-0.5 overflow-visible">
        <img
          src={frywayLogoImg}
          alt="FryWay — Authentic Hand Cut Fries"
          className={`object-contain shrink-0 transition-transform duration-300 hover:scale-105 filter drop-shadow-xs max-w-none ${logoSizes[size]}`}
          loading="eager"
        />
      </div>

      {/* Brand Typography */}
      {!onlyIcon && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-baseline gap-1">
            <span
              className={`font-black font-['Plus_Jakarta_Sans',sans-serif] uppercase leading-none tracking-wide ${
                titleSizes[size]
              } ${isLight ? 'text-white' : 'text-emerald-950'}`}
            >
              FRYWAY
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block mb-0.5 animate-pulse"></span>
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
      )}
    </div>
  );
};
