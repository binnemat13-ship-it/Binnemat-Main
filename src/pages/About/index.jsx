import React from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import AboutHero from './AboutHero';
import AboutStory from './AboutStory';
import AboutStats from './AboutStats';
import AboutTechnology from './AboutTechnology';
import AboutTimeline from './AboutTimeline';
import AboutValues from './AboutValues';

export default function AboutPage() {
  useDocumentTitle({
    title: 'About Binnemat | Gujranwala Premier Home Appliances Manufacturer',
    description: 'Learn about Binnemat, Gujranwala\'s trusted appliance brand engineering energy-saving room heaters, instant geysers, and BLDC inverter fans for homes across Pakistan.',
    keywords: 'about binnemat, binnemat gujranwala, home appliances in gujranwala, appliance manufacturer pakistan, hafizabad road gujranwala',
    canonicalUrl: 'https://binnemat.com/about'
  });

  return (
    <div className="max-w-[1360px] mx-auto px-[5%] py-4 sm:py-6 relative z-10 space-y-2">
      <AboutHero />
      <AboutStory />
      <AboutStats />
      <AboutTechnology />
      <AboutTimeline />
      <AboutValues />
    </div>
  );
}
