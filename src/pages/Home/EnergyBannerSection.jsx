import React, { useMemo } from 'react';
import { Flame, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import GsapCounter from '../../components/common/GsapCounter';
import { useProductsByCategoryQuery } from '../../hooks/useWooQueries';
import { SAFE_SVG_PLACEHOLDER } from '../../services/mockData';

export default function EnergyBannerSection({ onShopClick, onSelectProduct }) {
  // Fetch live products to find the most affordable / lowest-price heater appliance
  const { data: winterProducts = [] } = useProductsByCategoryQuery('winter-collection');
  const { data: essentialProducts = [] } = useProductsByCategoryQuery('essential-collection');

  // Combine and find lowest price heater product
  const lowestPriceHeater = useMemo(() => {
    const combined = [...winterProducts, ...essentialProducts];
    if (combined.length === 0) {
      return {
        id: 101,
        name: 'FastHeat™ Quartz Space Heater',
        price: 8500,
        formatted_price: 'Rs. 8,500',
        badge: 'ENERGY SAVER HEATER',
        images: [{ src: '/images/superconscious_heater_hero.jpg' }],
        description: 'Instant infrared quartz heating with low wattage draw and built-in tip-over safety switch. Zero gas danger.'
      };
    }

    // Sort by numeric price ascending
    const sorted = [...combined].sort((a, b) => {
      const priceA = Number(a.price) || 999999;
      const priceB = Number(b.price) || 999999;
      return priceA - priceB;
    });

    return sorted[0];
  }, [winterProducts, essentialProducts]);

  const productName = lowestPriceHeater?.name || 'FastHeat™ Quartz Space Heater';
  const productPrice = lowestPriceHeater?.formatted_price || (lowestPriceHeater?.price ? `Rs. ${Number(lowestPriceHeater.price).toLocaleString()}` : 'Rs. 8,500');
  const numericPrice = Number(lowestPriceHeater?.price) || 8500;
  const productImg = lowestPriceHeater?.images?.[0]?.src || '/images/superconscious_heater_hero.jpg';

  return (
    <section className="max-w-[1360px] mx-auto px-3 sm:px-[5%] my-6 sm:my-10 text-slate-900 dark:text-white">
      <div className="glass-apple-card rounded-3xl p-5 sm:p-8 md:p-12 border border-[#ff3131]/20 dark:border-[#ff3131]/30 bg-gradient-to-br from-[#fff0f0]/60 via-white to-[#fff0f0]/40 dark:from-[#ff3131]/10 dark:via-[#161311] dark:to-[#ff3131]/15 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center shadow-[0_15px_45px_rgba(255,49,49,0.08)] dark:shadow-[0_15px_45px_rgba(0,0,0,0.6)] relative overflow-hidden">
        {/* Ambient Backlight */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-[#ff3131]/[0.08] dark:bg-[#ff3131]/[0.06] blur-3xl pointer-events-none -z-10" />

        {/* LEFT COLUMN: MARKETING HEATER SAVINGS & ENERGY COMPARISON */}
        <div className="lg:col-span-7">
          <span className="text-[10px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest text-[#ff3131] dark:text-[#ff8585] uppercase block mb-2 sm:mb-3 font-bold flex items-center gap-1.5">
            <Flame size={14} className="text-[#ff3131] fill-[#ff3131] shrink-0" />
            <span>INSTANT ROOM WARMTH &bull; LOW POWER ELECTRIC HEATING</span>
          </span>

          <h2 className="font-wix text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4 leading-tight tracking-tight">
            High Efficiency Electric Heaters. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5c5c] via-[#ff3131] to-[#d01a1a]">
              Safe Warmth at Lowest Operating Cost.
            </span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-xl font-normal">
            Say goodbye to suffocating gas fumes, cylinder refills, and gas load-shedding. Instant infrared thermal warmth with auto-thermostat and child-safe cool-touch exterior.
          </p>

          {/* VISUAL BILL COMPARISON TILE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1A1715] border border-[#E5E4E2] dark:border-white/[0.1] mb-6 sm:mb-8 max-w-lg text-xs shadow-sm">
            <div className="sm:border-r border-[#E5E4E2] dark:border-white/10 sm:pr-4 pb-2 sm:pb-0 border-b sm:border-b-0">
              <span className="text-slate-500 block mb-0.5 font-medium">Gas Heater / Cylinder Refills</span>
              <strong className="text-rose-600 text-base block font-wix font-bold">
                <GsapCounter endValue={6500} prefix="Rs. " suffix=" / Mo" />
              </strong>
              <span className="text-[10px] text-slate-400">Carbon monoxide fumes &amp; fire hazards</span>
            </div>
            <div className="sm:pl-2 pt-1 sm:pt-0">
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold block mb-0.5">Binnemat Smart Heater</span>
              <strong className="text-emerald-600 dark:text-emerald-400 text-base block font-wix font-bold">
                <GsapCounter endValue={2800} prefix="Rs. " suffix=" / Mo" />
              </strong>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                <GsapCounter endValue={22000} prefix="Save Rs. " suffix="+ every winter" />
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <button 
              onClick={() => {
                if (lowestPriceHeater && onSelectProduct) {
                  onSelectProduct(lowestPriceHeater);
                } else if (onShopClick) {
                  onShopClick();
                }
              }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#ff3131] to-[#d01a1a] hover:brightness-105 text-white font-bold text-xs tracking-wide transition-all shadow-[0_4px_18px_rgba(255,49,49,0.35)] flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <span>Explore Value Heaters</span>
              <ArrowUpRight size={15} />
            </button>
            <span className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5 font-mono font-semibold">
              <ShieldCheck size={16} className="text-[#ff3131] dark:text-[#ff8585]" />
              <span>Official Binnemat Brand Warranty</span>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: LOWEST PRICE HEATER SPATIAL SHOWCASE */}
        <div className="lg:col-span-5 flex justify-center">
          <div 
            onClick={() => {
              if (lowestPriceHeater && onSelectProduct) onSelectProduct(lowestPriceHeater);
            }}
            className="w-full max-w-sm rounded-3xl overflow-hidden glass-apple-card border border-[#E5E4E2] dark:border-white/[0.1] bg-white dark:bg-[#161311] p-4 group relative shadow-md cursor-pointer hover:border-[#ff3131]/40 transition-all"
          >
            <div className="h-64 sm:h-72 overflow-hidden rounded-2xl bg-[#0C0B0C] flex items-center justify-center relative p-3">
              <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#ff3131]/90 text-white font-mono text-[9px] font-bold uppercase shadow-sm">
                Lowest Price Deal
              </div>
              <img 
                src={productImg} 
                alt={productName}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = SAFE_SVG_PLACEHOLDER;
                }}
                className="w-full h-full object-contain will-change-transform filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="pt-3 px-1 flex justify-between items-center text-xs">
              <div className="max-w-[200px]">
                <strong className="block text-sm text-slate-900 dark:text-white font-wix font-bold truncate">
                  {productName}
                </strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Infrared Warmth &bull; Low Power
                </span>
              </div>
              <strong className="text-base text-[#ff3131] dark:text-[#ff8585] font-wix font-extrabold flex-shrink-0">
                {productPrice}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
