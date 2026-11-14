import React, { useState, useEffect } from 'react';
import SuperconsciousHero from './SuperconsciousHero';
import CampaignBannerSection from './CampaignBannerSection';
import SuperconsciousTypographySection from './SuperconsciousTypographySection';
import SuperconsciousWidgetsSection from './SuperconsciousWidgetsSection';
import CategoriesSection from './CategoriesSection';
import EnergyBannerSection from './EnergyBannerSection';
import ManifestoSection from './ManifestoSection';
import TestimonialsSection from './TestimonialsSection';
import BrandLogosSection from './BrandLogosSection';
import NewsletterSection from './NewsletterSection';
import ProductCarousel from '../../components/common/ProductCarousel';
import { 
  useCategoriesQuery, 
  useProductsByCategoryQuery 
} from '../../hooks/useWooQueries';

export default function Home({ onSelectProduct, onSelectCategory, setActivePage }) {
  // TanStack Query caching with 5-minute staleTime (0 network calls on component re-mounts)
  const { data: categories = [] } = useCategoriesQuery();
  
  // 3 Distinct Tiers from WooCommerce Backend
  const { data: premiumProducts = [] } = useProductsByCategoryQuery('premium-collection');
  const { data: midTierProducts = [] } = useProductsByCategoryQuery('mid-tier-collection');
  const { data: essentialProducts = [] } = useProductsByCategoryQuery('essential-collection');

  return (
    <div className="relative z-10 bg-[#F7F6F4] dark:bg-[#0E0C0B] text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* 1. HERO SHOWCASE: TIER 1 - PREMIUM / SIGNATURE COLLECTION */}
      <SuperconsciousHero 
        onSelectProduct={onSelectProduct}
        onExploreClick={() => onSelectCategory && onSelectCategory('premium-collection')}
        onSelectCategory={onSelectCategory}
      />

      {/* 2. THE BINNEMAT URDU MANIFESTO ("ہر گھر کا سکون") */}
      

      {/* 3. CAMPAIGN HIGHLIGHT BAR (FROSTED PILL CARDS) */}
      <CampaignBannerSection />

      {/* 4. SUPERCONSCIOUS SIGNATURE CAPSULE TYPOGRAPHY */}
      <SuperconsciousTypographySection />

      {/* FIXED STILL BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none -z-20 bg-[#F7F6F4] dark:bg-[#0E0C0B] transition-colors duration-300">
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[850px] h-[850px] bg-[#fff0f0]/60 dark:bg-[#fff0f0]/[0.06] blur-[150px] rounded-full" />
        <div className="absolute top-[55%] right-[-5%] w-[650px] h-[650px] bg-[#ff3131]/[0.045] dark:bg-[#ff3131]/[0.1] blur-[130px] rounded-full" />
        <div className="absolute top-[80%] left-[-5%] w-[550px] h-[550px] bg-[#E5E4E2]/50 dark:bg-[#E5E4E2]/[0.04] blur-[120px] rounded-full" />
      </div>

      {/* 4. UPGRADE YOUR LIVING - PINNED STACKING CARDS: TIER 1 - PREMIUM COLLECTION */}
      <SuperconsciousWidgetsSection 
        onSelectCategory={onSelectCategory} 
        onSelectProduct={onSelectProduct}
      />

      {/* 5. TIER 2 CAROUSEL - PRO / MID-TIER PERFORMANCE COLLECTION */}
      <section className="max-w-[1360px] mx-auto px-[5%]">
        <ProductCarousel
          eyebrow="HIGH EFFICIENCY &bull; PERFORMANCE ENGINEERING"
          title="Mid-Tier Collection (Pro Performance Series)"
          products={midTierProducts}
          onSelectProduct={onSelectProduct}
        />
      </section>

      {/* 6. LOWEST PRICE HEATER BILL COMPARISON & ENERGY BANNER */}
      <EnergyBannerSection 
        onShopClick={() => onSelectCategory && onSelectCategory('winter-collection')} 
        onSelectProduct={onSelectProduct}
      />

      {/* 7. TIER 3 CAROUSEL - ESSENTIAL EVERYDAY VALUE COLLECTION */}
      <section className="max-w-[1360px] mx-auto px-[5%]">
        <ProductCarousel
          eyebrow="DAILY COMFORT &bull; TIMELESS DURABILITY"
          title="Essential Collection (Everyday Value Series)"
          products={essentialProducts}
          onSelectProduct={onSelectProduct}
        />
      </section>

      {/* 8. CATEGORIES DIRECTORY GRID IN FROSTED GLASS */}
      <CategoriesSection 
        categories={categories} 
        onSelectCategory={onSelectCategory}
        onViewAllClick={() => setActivePage && setActivePage('categories')}
      />
      <ManifestoSection />
      {/* 9. REAL PAKISTANI HOMES VERIFIED REVIEWS */}
      <TestimonialsSection />

      {/* 10. OFFICIAL BRAND PARTNERS */}
      <BrandLogosSection />

      {/* 11. VIP CONCIERGE & CAPSULE NEWSLETTER */}
      <NewsletterSection />
    </div>
  );
}
