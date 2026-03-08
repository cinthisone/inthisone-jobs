'use client';

import { LandingNav } from './LandingNav';
import { Hero } from './Hero';
import { SocialProof } from './SocialProof';
import { Problems } from './Problems';
import { Solution } from './Solution';
import { Features } from './Features';
import { ProductShowcase } from './ProductShowcase';
import { HowItWorks } from './HowItWorks';
import { Pricing } from './Pricing';
import { Testimonials } from './Testimonials';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      <main>
        <Hero />
        <SocialProof />
        <Problems />
        <Solution />
        <Features />
        <ProductShowcase />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
