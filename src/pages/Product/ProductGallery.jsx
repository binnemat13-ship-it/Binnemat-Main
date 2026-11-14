import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SAFE_SVG_PLACEHOLDER } from '../../services/mockData';
import { ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ images, badge, name }) {
  const imageList = images && images.length > 0 ? images : [{ src: SAFE_SVG_PLACEHOLDER }];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const galleryRef = useRef(null);

  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'all' }
      );
    }, el);

    return () => ctx.revert();
  }, [name]);

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const currentSrc = imageList[activeImageIndex]?.src || imageList[activeImageIndex] || SAFE_SVG_PLACEHOLDER;

  return (
    <div ref={galleryRef} className="flex flex-col gap-4">
      {/* MAIN VIEWPORT WITH LUXURY SHADOW, CAROUSEL CONTROLS & BADGE */}
      <div className="glass-apple-card rounded-3xl border border-[#E5E4E2] dark:border-white/10 bg-[#F7F6F4] dark:bg-[#12100E] p-2 h-[320px] sm:h-[480px] flex items-center justify-center relative overflow-hidden shadow-xl group select-none">
        <span className="absolute top-4 left-4 z-10 bg-[#fff0f0]/95 dark:bg-[#1A1715]/95 text-[#ff3131] dark:text-[#ff8585] border border-[#E5E4E2] dark:border-white/10 text-xs font-mono font-bold px-3.5 py-1 rounded-full shadow-md backdrop-blur-md">
          {badge || "100% BRAND SEALED"}
        </span>

        <span className="absolute bottom-4 right-4 z-10 bg-white/90 dark:bg-[#1A1715]/90 text-slate-800 dark:text-slate-200 border border-[#E5E4E2] dark:border-white/10 text-[11px] font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 backdrop-blur-md">
          <ShieldCheck size={14} className="text-[#ff3131] dark:text-[#ff8585]" />
          <span>Official Warranty Stamped</span>
        </span>

        {/* Carousel Navigation Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous Image"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/85 dark:bg-[#1E1B19]/85 border border-black/10 dark:border-white/10 text-slate-800 dark:text-slate-200 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md hover:border-[#ff3131]"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next Image"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/85 dark:bg-[#1E1B19]/85 border border-black/10 dark:border-white/10 text-slate-800 dark:text-slate-200 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md hover:border-[#ff3131]"
            >
              <ChevronRight size={20} />
            </button>

            {/* Image counter indicator */}
            <div className="absolute bottom-4 left-4 z-10 bg-black/50 text-white text-[11px] font-mono px-2.5 py-0.5 rounded-full backdrop-blur-md">
              {activeImageIndex + 1} / {imageList.length}
            </div>
          </>
        )}

        <div className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center bg-transparent p-2">
          <img
            key={currentSrc}
            src={currentSrc}
            alt={name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = SAFE_SVG_PLACEHOLDER;
            }}
            className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* THUMBNAILS STRIP */}
      {imageList.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
          {imageList.map((img, idx) => {
            const thumbSrc = img?.src || img || SAFE_SVG_PLACEHOLDER;
            return (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 h-20 rounded-xl overflow-hidden p-1 border-2 transition-all bg-[#F7F6F4] dark:bg-[#1A1715] cursor-pointer flex-shrink-0 ${
                  activeImageIndex === idx
                    ? 'border-[#ff3131] shadow-md scale-105'
                    : 'border-[#E5E4E2] dark:border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={thumbSrc}
                  alt={`${name} thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = SAFE_SVG_PLACEHOLDER;
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
