import React, { useState } from 'react';
import { useSiteBranding } from '../../context/SiteBrandingContext';
import { APP_CONFIG } from '../../config/env';

export default function Logo({ logoSrc, onClick, className = '', imgClassName = '' }) {
  const { siteLogo } = useSiteBranding();
  const [imgError, setImgError] = useState(false);

  const defaultLogo = '/images/logo.png';
  const candidateLogo = logoSrc !== undefined && logoSrc !== null ? logoSrc : (siteLogo || defaultLogo);
  const effectiveLogo = imgError && candidateLogo !== defaultLogo ? defaultLogo : candidateLogo;

  if (effectiveLogo && (!imgError || candidateLogo !== defaultLogo)) {
    return (
      <div onClick={onClick} className={`cursor-pointer flex items-center ${className}`}>
        <img
          src={effectiveLogo}
          alt={APP_CONFIG.APP_NAME}
          className={imgClassName || "h-10 sm:h-12 md:h-13 w-auto max-w-[190px] sm:max-w-[220px] object-contain transition-transform duration-300 hover:scale-105 dark:brightness-0 dark:invert"}
          onError={() => {
            if (effectiveLogo !== defaultLogo) {
              setImgError(true);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div onClick={onClick} className={`cursor-pointer flex items-center gap-2.5 select-none group text-left ${className}`}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff3131] to-[#d01a1a] flex items-center justify-center p-0.5 shadow-[0_0_12px_rgba(255,49,49,0.25)] group-hover:scale-105 transition-transform">
        <div className="w-full h-full rounded-full bg-white dark:bg-[#111018] flex items-center justify-center">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#ff3131] animate-pulse" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-wix font-extrabold text-xl tracking-tight text-slate-900 dark:text-white lowercase leading-none">
          binnemat
        </span>
        <span className="text-[9px] font-mono tracking-widest text-[#ff3131] dark:text-[#ff8585] uppercase mt-0.5 font-bold">
          Thermal &bull; Inverter
        </span>
      </div>
    </div>
  );
}
