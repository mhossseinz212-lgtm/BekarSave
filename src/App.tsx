import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { PricingSection } from './components/PricingSection';
import { GalleryAndVideos } from './components/GalleryAndVideos';
import { CoverageMap } from './components/CoverageMap';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CustomerReviews } from './components/CustomerReviews';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { MobileFloatingBar } from './components/MobileFloatingBar';
import { QuickBookingModal } from './components/QuickBookingModal';
import { AdminPanel } from './components/AdminPanel';
import { SeoHeadManager } from './components/SeoHeadManager';

function MainContent() {
  const { settings } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Main Header with Day/Night Switch and Emergency Banner */}
      <Header />

      <main className="flex-1">
        {/* Hero Section with Call CTA and Fast Dispatch Counter */}
        {settings.showHeroSection !== false && <Hero />}

        {/* Core Services Grid (لوله بازکنی، تخلیه چاه، کندن چاه، ایزوگام، لوله کشی، تعویض سنگ توالت) */}
        {settings.showServicesSection !== false && <ServicesSection />}

        {/* Official Updated Price Tariff Tables & Online Cost Estimator (استعلام آنلاین و تعرفه مصوب قیمت خدمات در شهر ساوه) */}
        {settings.showPricingSection !== false && <PricingSection />}

        {/* Interactive Media & Videos Showcase with Before/After Slider */}
        {settings.showGallerySection !== false && <GalleryAndVideos />}

        {/* Coverage Map of Saveh Neighborhoods & Response Times */}
        {settings.showCoverageMapSection !== false && <CoverageMap />}

        {/* Trust Guarantees & Why Choose Us */}
        {settings.showWhyUsSection !== false && <WhyChooseUs />}

        {/* Verified Customer Testimonials from Saveh Citizens */}
        {settings.showReviewsSection !== false && <CustomerReviews />}

        {/* Google FAQ Accordion */}
        {settings.showFaqSection !== false && <FAQSection />}
      </main>

      {/* Rich SEO & Contact Footer */}
      <Footer />

      {/* Sticky Mobile Floating Call Bar */}
      {settings.showFloatingBar !== false && <MobileFloatingBar />}

      {/* Service Booking Request Modal */}
      <QuickBookingModal />

      {/* Admin Live CMS & Management Dashboard */}
      <AdminPanel />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <SeoHeadManager />
      <MainContent />
    </AppProvider>
  );
}

