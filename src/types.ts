export interface TariffItem {
  id: string;
  category: string; // 'pipe' | 'tanker' | 'digging' | 'isogam' | 'plumbing' | etc.
  categoryName: string; // e.g. "لوله بازکنی", "تخلیه چاه", "حفر و کندن چاه"
  title: string;
  unit: string;
  priceRange: string;
  originalPriceRange?: string;
  note?: string;
}

export interface RealEventLog {
  id: string;
  type: 'call' | 'visit' | 'booking' | 'rubika' | 'estimator';
  title: string;
  detail: string;
  timestamp: string;
}

export interface RealStats {
  totalVisits: number;
  totalCalls: number;
  totalRubikaClicks: number;
  totalBookings: number;
  totalEstimates: number;
  logs: RealEventLog[];
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  image: string;
  features: string[];
  startingPrice: string;
  originalStartingPrice?: string;
  priceNote?: string;
  guarantee: string;
  tools: string[];
  badge?: string;
}

export interface BookingRequest {
  id: string;
  fullName: string;
  phoneNumber: string;
  serviceType: string;
  address: string;
  neighborhood: string;
  description?: string;
  message?: string;
  isUrgent: boolean;
  createdAt: string;
  status: 'pending' | 'dispatched' | 'completed' | 'cancelled' | 'contacted';
}

export interface ReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  service: string;
  comment: string;
  date: string;
  verified: boolean;
  approved: boolean;
  avatar?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  type: 'image' | 'video' | 'before-after';
  mediaUrl: string;
  beforeUrl?: string;
  afterUrl?: string;
  beforeLabel?: string;
  afterLabel?: string;
  sliderHint?: string;
  highlights?: string[];
  description: string;
  location: string;
}

export interface NeighborhoodInfo {
  id: string;
  name: string;
  responseTimeMinutes?: number;
  activeTechs?: number;
  popularServices?: string[];
  isSpecialZone?: boolean;
  priceMultiplier?: number; // e.g. 1.0 (standard), 1.2, 2.0 (custom multiplier for remote/special zones)
  note?: string;
}

export interface MessengerItem {
  id: string;
  name: string; // e.g. "ایتا", "سروش", "بله", "آی‌گپ", "شاد", "واتساپ", "تلگرام", "اینستاگرام", "گپ", "سیگنال"
  usernameOrId?: string; // e.g. "@jshhshvsh"
  link: string; // e.g. "https://eitaa.com/..."
  iconName?: 'message-circle' | 'send' | 'phone' | 'share-2' | 'link' | 'globe' | 'instagram' | 'mail' | 'radio' | 'zap';
  customIconUrl?: string; // custom image url or base64 data-url
  colorTheme?: 'purple' | 'orange' | 'emerald' | 'blue' | 'indigo' | 'cyan' | 'pink' | 'amber' | 'red' | 'teal' | 'slate' | 'custom';
  customColorHex?: string; // e.g. '#FF5722', '#25D366', '#E1306C'
  badge?: string; // e.g. "کانال رسمی", "پاسخ فوری"
  isActive: boolean;
  showInHero?: boolean;
  showInFooter?: boolean;
  showInFloatingBar?: boolean;
}

export interface CustomActionButton {
  id: string;
  title: string;
  url: string;
  type?: 'tel' | 'link' | 'rubika' | 'booking';
  variant?: 'primary' | 'secondary' | 'success' | 'rubika';
  bgClass?: string;
  isVisible: boolean;
  visible?: boolean;
}

export interface MediaVaultItem {
  id: string;
  title: string;
  category: 'hero' | 'about' | 'service' | 'gallery' | 'og' | 'logo' | 'general';
  url: string;
  uploadedAt: string;
  originalFileName?: string;
  isCurrentActive?: boolean;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  description?: string;
  expiryDate?: string;
}

export interface SiteSettings {
  businessName: string;
  managerName: string;
  primaryPhone: string;
  secondaryPhone: string;
  rubikaId: string;
  rubikaUrl: string;
  tariffUpdateDate: string;
  city: string;
  address: string;
  workingHours: string;
  emergencyBannerText: string;
  isEmergencyBannerActive: boolean;
  showDiscount: boolean;
  discountPercentage: number;
  discountNotice: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  
  // Media Vault Image Archive
  mediaVault?: MediaVaultItem[];
  
  // Open Graph & Global SEO Extensions
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  ogSiteName?: string;
  canonicalUrl?: string;

  // Core Section SEO Metadata
  servicesMetaTitle?: string;
  servicesMetaDescription?: string;
  tariffsMetaTitle?: string;
  tariffsMetaDescription?: string;
  whyUsMetaTitle?: string;
  whyUsMetaDescription?: string;
  galleryMetaTitle?: string;
  galleryMetaDescription?: string;
  reviewsMetaTitle?: string;
  reviewsMetaDescription?: string;
  faqMetaTitle?: string;
  faqMetaDescription?: string;

  adminUsername: string;
  adminPin: string;

  // Dynamic Guarantee settings (editable by admin)
  generalGuaranteeText: string;
  isogamGuaranteeText: string;
  pipeGuaranteeText: string;
  tankerGuaranteeText: string;
  wellGuaranteeText: string;

  // Section Headlines & Subtitles (CMS editable)
  heroHeadline?: string;
  heroSubheadline?: string;
  emergencyResponseText?: string;
  servicesHeadline?: string;
  servicesSubheadline?: string;
  servicesBottomHeadline?: string;
  servicesBottomSubheadline?: string;
  estimatorHeadline?: string;
  estimatorSubheadline?: string;
  tariffsHeadline?: string;
  tariffsSubheadline?: string;
  beforeAfterHeadline?: string;
  beforeAfterSubheadline?: string;
  whyUsHeadline?: string;
  whyUsSubheadline?: string;
  galleryHeadline?: string;
  gallerySubheadline?: string;
  neighborhoodsHeadline?: string;
  neighborhoodsSubheadline?: string;
  reviewsHeadline?: string;
  reviewsSubheadline?: string;
  faqHeadline?: string;
  faqSubheadline?: string;
  aboutHeadline?: string;
  aboutSubheadline?: string;
  footerAboutText?: string;
  copyrightText?: string;

  // Social & Messenger Links
  eitaaUrl?: string;
  whatsappNumber?: string;
  telegramId?: string;
  instagramId?: string;
  baleUrl?: string;
  primaryPhoneTitle?: string;
  secondaryPhoneTitle?: string;

  // Button Visibility Toggles
  showHeroCall1: boolean;
  showHeroCall2: boolean;
  showHeroRubika: boolean;
  showHeroEitaa?: boolean;
  showHeroBooking: boolean;
  showFloatingBar: boolean;
  showFloatingCall1: boolean;
  showFloatingCall2: boolean;
  showFloatingRubika: boolean;
  showFloatingEitaa?: boolean;

  // Custom Section Banners & Images
  heroImageUrl?: string;
  aboutImageUrl?: string;
  whyUsImageUrl?: string;
  footerLogoUrl?: string;

  // Section Visibility Toggles (Admin Controlled)
  showHeroSection?: boolean;
  showServicesSection?: boolean;
  showPricingSection?: boolean;
  showGallerySection?: boolean;
  showCoverageMapSection?: boolean;
  showWhyUsSection?: boolean;
  showReviewsSection?: boolean;
  showFaqSection?: boolean;

  // Global Call-for-Price Pricing Override
  forceCallForPrice?: boolean;
  callForPriceCustomText?: string;

  // Technician Status Card in Hero
  techStatusText?: string;
  techStatusBadge?: string;
  techCardImageBadge?: string;
  techCardSubtitle?: string;
  techCardTitle?: string;
  techCardLocationText?: string;

  // Custom Buttons list
  customButtons?: CustomActionButton[];

  // Dynamic Custom Messengers & Social Media list
  messengers?: MessengerItem[];

  // Secret Admin Trigger Phone Number
  adminTriggerPhone?: string;
}
