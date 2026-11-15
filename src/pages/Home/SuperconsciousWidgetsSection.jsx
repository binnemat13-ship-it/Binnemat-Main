import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Zap, Flame, Award, ArrowUpRight, CheckCircle2, Cpu, Sparkles, Thermometer, Wind } from 'lucide-react';
import GsapCounter from '../../components/common/GsapCounter';
import { useProductsByCategoryQuery } from '../../hooks/useWooQueries';
import { SAFE_SVG_PLACEHOLDER } from '../../services/mockData';

gsap.registerPlugin(ScrollTrigger);

export default function SuperconsciousWidgetsSection({ onSelectCategory, onSelectProduct }) {
  // 1. Fetch live Premium Collection products from backend
  const { data: livePremiumProducts = [] } = useProductsByCategoryQuery('premium-collection');

  // Convert live backend premium products into cards, or fallback to default specs if empty
  const premiumCards = (livePremiumProducts.length > 0)
    ? livePremiumProducts.map((p, idx) => {
        const specs = p.specs 
          ? (Array.isArray(p.specs) ? p.specs : Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`))
          : [
              'Italian Incoloy 840 anti-corrosive heating coil',
              'Sapphire diamond enamel tank rated for 8-Bar',
              'Instant 3-second continuous hot water flow'
            ];

        const imgSrc = p.images?.[0]?.src || p.image || '/images/superconscious_heater_hero.jpg';

        return {
          id: p.id || `winter-${idx}`,
          rawProduct: p,
          tabNumber: String(idx + 1).padStart(2, '0'),
          category: p.name || 'Winter Thermal Geyser',
          title: p.name,
          tagline: p.badge || 'Official Brand Warranty & Winter Warmth',
          image: imgSrc,
          priceFormatted: p.formatted_price || (p.price ? `Rs. ${Number(p.price).toLocaleString()}` : null),
          endValue: 85 + (idx * 2) % 15,
          prefix: '+',
          suffix: '%',
          statDesc: 'Heat Retention & Efficiency',
          gaugeLabel: 'Thermal Efficiency',
          gaugeVal: '75°C Max Heat',
          gaugePercent: 88,
          gaugeIcon: Thermometer,
          icon: Flame,
          color: '#ff3131',
          accentBg: 'rgba(255, 49, 49, 0.1)',
          badgeText: 'Official Factory Sealed',
          categorySlug: 'winter-collection',
          btnText: 'View Appliance',
          points: specs.slice(0, 3)
        };
      })
    : [
        {
          id: 'thermal-1',
          tabNumber: '01',
          category: 'Winter Thermal Sanctuary',
          title: 'FastHeat™ Diamond Core System',
          tagline: 'Endurance Against Saline Hard Water',
          image: '/images/superconscious_heater_hero.jpg',
          endValue: 85,
          prefix: '+',
          suffix: '%',
          statDesc: 'Boiling Heat Retention (Heavy PUF)',
          gaugeLabel: 'Max Water Temp',
          gaugeVal: '75°C Boiling',
          gaugePercent: 90,
          gaugeIcon: Thermometer,
          icon: Flame,
          color: '#ff3131',
          accentBg: 'rgba(255, 49, 49, 0.1)',
          badgeText: '7-Year Tank Warranty',
          categorySlug: 'winter-collection',
          btnText: 'Explore Winter Geysers',
          points: [
            'Italian Incoloy 840 anti-corrosive heating coil',
            'Sapphire diamond enamel tank rated for 8-Bar',
            'Instant 3-second continuous hot water flow'
          ]
        }
      ];

  const [activeTab, setActiveTab] = useState(0);
  const containerRef = useRef(null);
  const pinnedStageRef = useRef(null);
  const cardRefs = useRef([]);
  const stInstanceRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    const stage = pinnedStageRef.current;
    if (!el || !stage || premiumCards.length === 0) return;

    const mm = gsap.matchMedia();

    // DESKTOP: PINNED CARD STACKING ON SCROLL
    mm.add('(min-width: 1024px)', () => {
      // Set initial states for all premium cards
      premiumCards.forEach((_, idx) => {
        if (!cardRefs.current[idx]) return;
        if (idx === 0) {
          gsap.set(cardRefs.current[0], { yPercent: 0, scale: 1, opacity: 1, zIndex: 10, filter: 'blur(0px)' });
        } else {
          gsap.set(cardRefs.current[idx], { yPercent: 120, scale: 0.95, opacity: 0, zIndex: 10 + idx * 10, filter: 'blur(0px)' });
        }
      });

      if (premiumCards.length > 1) {
        const totalDistance = Math.min(2600, 900 * (premiumCards.length - 1));
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: `+=${totalDistance}`,
            pin: stage,
            scrub: 0.8,
            anticipatePin: 1,
            onUpdate: (self) => {
              const p = self.progress;
              const step = 1 / premiumCards.length;
              const calculatedIdx = Math.min(
                premiumCards.length - 1,
                Math.floor(p / step)
              );
              setActiveTab(calculatedIdx);
            }
          }
        });

        stInstanceRef.current = tl.scrollTrigger;

        // Animate each subsequent card sliding over previous card
        for (let i = 1; i < premiumCards.length; i++) {
          const insertTime = (i - 1) * 1.1;
          
          tl.to(cardRefs.current[i], {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
            duration: 1
          }, insertTime + 0.2);

          tl.to(cardRefs.current[i - 1], {
            scale: 0.94,
            opacity: 0.35,
            y: -15,
            filter: 'blur(2px)',
            ease: 'power2.out',
            duration: 1
          }, insertTime + 0.2);
        }
      }
    });

    // MOBILE / TABLET: CLEAN RESPONSIVE STACK
    mm.add('(max-width: 1023px)', () => {
      cardRefs.current.forEach((cardEl) => {
        if (!cardEl) return;
        gsap.set(cardEl, { yPercent: 0, opacity: 1, scale: 1, filter: 'blur(0px)', position: 'relative' });
      });
    });

    return () => {
      mm.revert();
    };
  }, [premiumCards.length]);

  // Smooth scroll to card when user clicks a tab
  const handleTabClick = (idx) => {
    setActiveTab(idx);
    const st = stInstanceRef.current;
    if (st && window.innerWidth >= 1024 && premiumCards.length > 1) {
      const step = 1 / (premiumCards.length - 1 || 1);
      const targetScroll = st.start + (idx * step * 0.92) * (st.end - st.start);
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    } else {
      const targetCard = cardRefs.current[idx];
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <section ref={containerRef} className="relative w-full text-slate-900">
      {/* PINNED VIEWPORT STAGE: Background stays STILL while cards slide up */}
      <div 
        ref={pinnedStageRef} 
        className="w-full min-h-screen flex items-center justify-center py-10 px-4 sm:px-6 relative overflow-hidden"
      >
        {/* Still Ambient Mesh Glow in Pinned Stage */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#fff0f0]/60 dark:bg-[#ff3131]/[0.08] blur-[120px] pointer-events-none -z-10 rounded-full" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#ff3131]/[0.04] blur-[100px] pointer-events-none -z-10 rounded-full" />

        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: STILL HEADLINE & SYNCED SELECTOR TABS */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fff0f0] dark:bg-[#1A1715] border border-[#E5E4E2] dark:border-white/[0.1] text-xs font-mono text-[#ff3131] dark:text-[#ff8585] mb-4 font-bold w-fit shadow-xs">
              <Sparkles size={13} className="text-[#ff3131] dark:text-[#ff8585]" />
              <span>Winter Collection Pillars</span>
            </div>

            <h2 className="font-wix font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white tracking-tight leading-[1.08] mb-4">
              Upgrade Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5c5c] via-[#ff3131] to-[#d01a1a]">
                Living.
              </span>
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 font-normal max-w-md">
              Live Winter Collection appliances engineered for Pakistani Cozy Homes, zero gas dependency, and maximum thermal endurance.
            </p>

            {/* VERTICAL SELECTOR TABS WITH DYNAMIC PROGRESS TRACK */}
            <div className="relative flex flex-col gap-3 max-w-md max-h-[340px] overflow-y-auto no-scrollbar pr-1">
              {/* Left Vertical Progress Line */}
              <div className="absolute left-1 top-2 bottom-2 w-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden hidden sm:block">
                <div 
                  className="w-full bg-gradient-to-b from-[#ff3131] to-[#d01a1a] transition-all duration-500 rounded-full shadow-[0_0_8px_#ff3131]"
                  style={{ 
                    height: `${((activeTab + 1) / premiumCards.length) * 100}%` 
                  }}
                />
              </div>

              {premiumCards.map((item, idx) => {
                const isSelected = activeTab === idx;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(idx)}
                    className={`sm:ml-4 p-4 rounded-2xl text-left transition-all duration-300 border flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-[#181724] border-[#ff3131]/50 dark:border-[#d01a1a]/50 shadow-[0_10px_30px_rgba(255,49,49,0.12)] scale-[1.02]'
                        : 'bg-white/60 dark:bg-[#111018]/60 border-black/[0.06] dark:border-white/[0.06] hover:border-black/15 dark:hover:border-white/15 hover:bg-white/80 dark:hover:bg-[#111018]/80'
                    }`}
                  >
                    <div className="pr-2 max-w-[280px]">
                      <span className={`text-[10px] font-mono block font-bold ${isSelected ? 'text-[#ff3131] dark:text-[#ff8585]' : 'text-slate-400 dark:text-slate-500'}`}>
                        {item.tabNumber}
                      </span>
                      <span className={`text-sm font-wix font-bold truncate block ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                        {item.title}
                      </span>
                      {item.priceFormatted && (
                        <span className="text-[11px] font-bold text-[#ff3131] dark:text-[#ff8585] block mt-0.5">
                          {item.priceFormatted}
                        </span>
                      )}
                    </div>
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all flex-shrink-0 ${
                        isSelected ? 'bg-[#ff3131] shadow-[0_0_10px_#ff3131] scale-125' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: STACKING CARDS STAGE (CARDS SLIDE UP OVER EACH OTHER) */}
          <div className="lg:col-span-7 relative w-full h-auto lg:h-[560px]">
            {premiumCards.map((item, idx) => {
              const Icon = item.icon;
              const GaugeIcon = item.gaugeIcon;
              const isSelected = activeTab === idx;

              return (
                <div
                  key={item.id}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  className="lg:absolute lg:inset-0 w-full rounded-3xl border border-[#E5E4E2] dark:border-white/[0.1] bg-white/95 dark:bg-[#161311]/95 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden will-change-transform mb-6 lg:mb-0"
                  style={{
                    boxShadow: isSelected 
                      ? '0 25px 60px rgba(255, 49, 49, 0.16)' 
                      : '0 15px 35px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {/* Subtle Ambient Aura */}
                  <div 
                    className="absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl pointer-events-none -z-10"
                    style={{ backgroundColor: `${item.color}18` }}
                  />

                  {/* TOP HEADER */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center p-2.5 border border-black/[0.06] dark:border-white/[0.08] shadow-sm"
                          style={{ backgroundColor: item.accentBg }}
                        >
                          <Icon size={22} style={{ color: item.color }} />
                        </div>
                        <div className="max-w-[280px] sm:max-w-[340px]">
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block font-semibold truncate">
                            {item.tagline}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-wix font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight line-clamp-1">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* LIVE STAT WITH GSAP COUNTER */}
                      <div className="text-right">
                        <span
                          className="text-2xl sm:text-3xl font-wix font-black block"
                          style={{ color: item.color }}
                        >
                          <GsapCounter
                            endValue={item.endValue}
                            prefix={item.prefix || ''}
                            suffix={item.suffix || ''}
                            decimals={item.decimals || 0}
                          />
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono font-medium">
                          {item.statDesc}
                        </span>
                      </div>
                    </div>

                    {/* LIVE PROGRESS GAUGE */}
                    <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] mb-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                          <GaugeIcon size={13} style={{ color: item.color }} />
                          <span>{item.gaugeLabel}</span>
                        </span>
                        <span className="font-wix font-bold text-xs" style={{ color: item.color }}>
                          {item.gaugeVal}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-700"
                          style={{ 
                            width: `${item.gaugePercent}%`,
                            backgroundColor: item.color 
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* MIDDLE SECTION: 2 COLUMNS (BULLETS + SPATIAL IMAGE) */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto">
                    {/* Feature Bullets */}
                    <div className="sm:col-span-7 space-y-2">
                      {item.points.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                          <CheckCircle2 size={13} className="text-[#ff3131] dark:text-[#ff8585] mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{pt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Spatial Appliance Portal */}
                    <div className="sm:col-span-5 flex justify-center">
                      <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-xl overflow-hidden bg-transparent p-2 relative group-hover:scale-105 transition-transform flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain will-change-transform rounded"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = SAFE_SVG_PLACEHOLDER;
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ACTION BAR */}
                  <div className="flex items-center justify-between pt-4 border-t border-black/[0.06] dark:border-white/[0.08] mt-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] text-[11px] font-mono text-slate-700 dark:text-slate-300 font-bold">
                      <Award size={12} className="text-[#ff3131] dark:text-[#ff8585]" />
                      <span>{item.priceFormatted || item.badgeText}</span>
                    </span>

                    <button
                      onClick={() => {
                        if (item.rawProduct && onSelectProduct) {
                          onSelectProduct(item.rawProduct);
                        } else if (onSelectCategory) {
                          onSelectCategory('winter-collection');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-[#ff3131] dark:hover:bg-[#ff3131] dark:hover:text-white text-xs font-bold transition-all cursor-pointer border-none shadow-sm hover:shadow-[0_4px_18px_rgba(255,49,49,0.3)]"
                    >
                      <span>{item.btnText}</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
