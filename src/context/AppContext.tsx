import { safeLocalStorage, safeSessionStorage, toEnglishDigits, toPersianDigits } from "../utils";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings, ServiceItem, BookingRequest, ReviewItem, GalleryItem, TariffItem, RealStats, RealEventLog, NeighborhoodInfo, MediaVaultItem, DiscountCoupon } from '../types';
import { initialSiteSettings, initialServices, initialBookings, initialReviews, initialGallery, initialTariffs, savehNeighborhoods, initialCoupons } from '../data/initialData';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  resetSettingsToDefault: () => void;
  coupons: DiscountCoupon[];
  addCoupon: (coupon: Omit<DiscountCoupon, 'id' | 'usedCount' | 'createdAt'>) => void;
  updateCoupon: (id: string, updated: Partial<DiscountCoupon>) => void;
  deleteCoupon: (id: string) => void;
  validateAndApplyCoupon: (code: string) => { valid: boolean; message: string; coupon?: DiscountCoupon };
  incrementCouponUsage: (code: string) => void;
  resetCouponsToDefault: () => void;
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  reorderServices: (fromIndex: number, toIndex: number) => void;
  resetServicesToDefault: () => void;
  tariffs: TariffItem[];
  addTariff: (tariff: Omit<TariffItem, 'id'>) => void;
  updateTariff: (id: string, updated: Partial<TariffItem>) => void;
  deleteTariff: (id: string) => void;
  reorderTariffs: (fromIndex: number, toIndex: number) => void;
  batchUpdateTariffs: (percentage: number) => void;
  applyDiscount: (percentage: number) => void;
  removeDiscount: () => void;
  resetTariffsToDefault: () => void;
  bookings: BookingRequest[];
  addBooking: (booking: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateBookingStatus: (id: string, status: BookingRequest['status']) => void;
  deleteBooking: (id: string) => void;
  resetBookingsToDefault: () => void;
  reviews: ReviewItem[];
  addReview: (review: Omit<ReviewItem, 'id' | 'date' | 'verified' | 'approved'>) => void;
  approveReview: (id: string) => void;
  unapproveReview: (id: string) => void;
  deleteReview: (id: string) => void;
  addAdminReview: (review: Omit<ReviewItem, 'id' | 'date'>) => void;
  resetReviewsToDefault: () => void;
  neighborhoods: NeighborhoodInfo[];
  addNeighborhood: (item: Omit<NeighborhoodInfo, 'id'>) => void;
  updateNeighborhood: (id: string, item: Partial<NeighborhoodInfo>) => void;
  deleteNeighborhood: (id: string) => void;
  resetNeighborhoodsToDefault: () => void;
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (id: string, updated: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  resetGalleryToDefault: () => void;
  resetAllToDefault: () => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  selectedServiceForBooking: string | null;
  openBookingForService: (serviceName?: string) => void;
  callCount: number;
  incrementCallCount: (targetPhone?: string) => void;
  trackRubikaClick: () => void;
  trackEstimatorUse: (detail: string) => void;
  stats: RealStats;
  clearStatsLogs: () => void;
  addMediaVaultItem: (item: Omit<MediaVaultItem, 'id' | 'uploadedAt'>) => void;
  deleteMediaVaultItem: (id: string) => void;
  exportFullBackup: () => string;
  importFullBackup: (
    jsonContent: string, 
    selectedSections?: { 
      settings?: boolean; 
      services?: boolean; 
      gallery?: boolean; 
      tariffs?: boolean; 
      reviews?: boolean; 
      neighborhoods?: boolean; 
      bookings?: boolean; 
      stats?: boolean; 
    }
  ) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = safeLocalStorage.getItem('behkar_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    safeLocalStorage.setItem('behkar_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Site Settings
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = safeLocalStorage.getItem('behkar_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = { ...initialSiteSettings, ...parsed };
        // Auto-fix if old unoptimized SEO values exist in user's localStorage
        if (merged.seoTitle && (merged.seoTitle.length > 72 || merged.seoTitle.length < 35)) {
          merged.seoTitle = initialSiteSettings.seoTitle;
        }
        if (merged.seoDescription && (merged.seoDescription.length > 175 || merged.seoDescription.length < 100)) {
          merged.seoDescription = initialSiteSettings.seoDescription;
        }
        if (!merged.ogTitle || merged.ogTitle.length < 5) {
          merged.ogTitle = initialSiteSettings.ogTitle;
        }
        if (!merged.ogImageUrl || merged.ogImageUrl.length < 10) {
          merged.ogImageUrl = initialSiteSettings.ogImageUrl;
        }
        return merged;
      } catch (e) {
        console.error(e);
      }
    }
    return initialSiteSettings;
  });

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      safeLocalStorage.setItem('behkar_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const resetSettingsToDefault = () => {
    const fresh = JSON.parse(JSON.stringify(initialSiteSettings));
    setSettings(fresh);
    safeLocalStorage.setItem('behkar_settings', JSON.stringify(fresh));
  };

  // Services CRUD
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = safeLocalStorage.getItem('behkar_services');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialServices;
  });

  const addService = (serviceData: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...serviceData,
      id: 'srv-' + Date.now(),
    };
    setServices(prev => {
      const next = [newService, ...prev];
      safeLocalStorage.setItem('behkar_services', JSON.stringify(next));
      return next;
    });
  };

  const updateService = (id: string, updated: Partial<ServiceItem>) => {
    setServices(prev => {
      const next = prev.map(s => (s.id === id ? { ...s, ...updated } : s));
      safeLocalStorage.setItem('behkar_services', JSON.stringify(next));
      return next;
    });
  };

  const deleteService = (id: string) => {
    setServices(prev => {
      const next = prev.filter(s => s.id !== id);
      safeLocalStorage.setItem('behkar_services', JSON.stringify(next));
      return next;
    });
  };

  const reorderServices = (fromIndex: number, toIndex: number) => {
    setServices(prev => {
      if (fromIndex < 0 || fromIndex >= prev.length || toIndex < 0 || toIndex >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      safeLocalStorage.setItem('behkar_services', JSON.stringify(copy));
      return copy;
    });
  };

  const resetServicesToDefault = () => {
    const fresh = JSON.parse(JSON.stringify(initialServices));
    setServices(fresh);
    safeLocalStorage.setItem('behkar_services', JSON.stringify(fresh));
  };

  // Tariffs CRUD
  const [coupons, setCoupons] = useState<DiscountCoupon[]>(() => {
    const saved = safeLocalStorage.getItem('behkar_coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialCoupons;
  });

  const addCoupon = (coupon: Omit<DiscountCoupon, 'id' | 'usedCount' | 'createdAt'>) => {
    const newCoupon: DiscountCoupon = {
      ...coupon,
      id: `coupon-${Date.now()}`,
      usedCount: 0,
      createdAt: new Date().toLocaleDateString('fa-IR'),
      code: coupon.code.toUpperCase().trim()
    };
    setCoupons(prev => {
      const next = [newCoupon, ...prev];
      safeLocalStorage.setItem('behkar_coupons', JSON.stringify(next));
      return next;
    });
  };

  const updateCoupon = (id: string, updated: Partial<DiscountCoupon>) => {
    setCoupons(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...updated } : c);
      safeLocalStorage.setItem('behkar_coupons', JSON.stringify(next));
      return next;
    });
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => {
      const next = prev.filter(c => c.id !== id);
      safeLocalStorage.setItem('behkar_coupons', JSON.stringify(next));
      return next;
    });
  };

  const validateAndApplyCoupon = (inputCode: string): { valid: boolean; message: string; coupon?: DiscountCoupon } => {
    const cleanCode = toEnglishDigits(inputCode || '').trim().toUpperCase();
    if (!cleanCode) {
      return { valid: false, message: 'لطفاً کد تخفیف را وارد کنید.' };
    }
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode);
    if (!found) {
      return { valid: false, message: 'کد تخفیف وارد شده معتبر نمی‌باشد.' };
    }
    if (!found.isActive) {
      return { valid: false, message: 'این کد تخفیف در حال حاضر غیرفعال است.' };
    }
    if (found.maxUses > 0 && found.usedCount >= found.maxUses) {
      return { valid: false, message: 'سقف ظرفیت استفاده از این کد تخفیف به پایان رسیده است.' };
    }
    return {
      valid: true,
      message: found.discountType === 'percentage' 
        ? `کد تخفیف ${toPersianDigits(found.discountValue)}٪ با موفقیت اعمال شد.`
        : `کد تخفیف ${toPersianDigits(found.discountValue.toLocaleString())} تومانی با موفقیت اعمال شد.`,
      coupon: found
    };
  };

  const incrementCouponUsage = (code: string) => {
    const cleanCode = toEnglishDigits(code || '').trim().toUpperCase();
    setCoupons(prev => {
      const next = prev.map(c => {
        if (c.code.toUpperCase() === cleanCode) {
          return { ...c, usedCount: c.usedCount + 1 };
        }
        return c;
      });
      safeLocalStorage.setItem('behkar_coupons', JSON.stringify(next));
      return next;
    });
  };

  const resetCouponsToDefault = () => {
    setCoupons(initialCoupons);
    safeLocalStorage.setItem('behkar_coupons', JSON.stringify(initialCoupons));
  };

  const [tariffs, setTariffs] = useState<TariffItem[]>(() => {
    const saved = safeLocalStorage.getItem('behkar_tariffs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialTariffs;
  });

  const addTariff = (tariffData: Omit<TariffItem, 'id'>) => {
    const newTariff: TariffItem = {
      ...tariffData,
      id: 'tar-' + Date.now(),
    };
    setTariffs(prev => {
      const next = [...prev, newTariff];
      safeLocalStorage.setItem('behkar_tariffs', JSON.stringify(next));
      return next;
    });
  };

  const updateTariff = (id: string, updated: Partial<TariffItem>) => {
    setTariffs(prev => {
      const next = prev.map(t => (t.id === id ? { ...t, ...updated } : t));
      safeLocalStorage.setItem('behkar_tariffs', JSON.stringify(next));
      return next;
    });
  };

  const deleteTariff = (id: string) => {
    setTariffs(prev => {
      const next = prev.filter(t => t.id !== id);
      safeLocalStorage.setItem('behkar_tariffs', JSON.stringify(next));
      return next;
    });
  };

  const reorderTariffs = (fromIndex: number, toIndex: number) => {
    setTariffs(prev => {
      if (fromIndex < 0 || fromIndex >= prev.length || toIndex < 0 || toIndex >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      safeLocalStorage.setItem('behkar_tariffs', JSON.stringify(copy));
      return copy;
    });
  };

  const batchUpdateTariffs = (percentage: number) => {
    if (!percentage || percentage === 0) return;
    const multiplier = 1 + percentage / 100;
    
    // Update Tariffs
    setTariffs(prev => {
      const next = prev.map(t => {
        const priceStr = t.priceRange || '';
        // Matches sequences of Persian/Arabic/English digits with commas/separators
        const updatedPriceRange = priceStr.replace(/[\d۰-۹٠-٩,،]+/g, match => {
          const latinDigits = toEnglishDigits(match).replace(/[,،\s]/g, '');
          const val = parseInt(latinDigits, 10);
          if (isNaN(val) || val < 1000) return match;
          const raw = val * multiplier;
          // Round to nearest 1,000 for accurate percentage price adjustments
          const adjusted = Math.max(1000, Math.round(raw / 1000) * 1000);
          return toPersianDigits(adjusted.toLocaleString('en-US'));
        });
        return {
          ...t,
          priceRange: updatedPriceRange
        };
      });
      safeLocalStorage.setItem('behkar_tariffs', JSON.stringify(next));
      return next;
    });

    // Also update Services starting prices
    setServices(prev => {
      const next = prev.map(s => {
        if (!s.startingPrice) return s;
        const updated = s.startingPrice.replace(/[\d۰-۹٠-٩,،]+/g, match => {
          const latinDigits = toEnglishDigits(match).replace(/[,،\s]/g, '');
          const val = parseInt(latinDigits, 10);
          if (isNaN(val) || val < 1000) return match;
          const raw = val * multiplier;
          const adjusted = Math.max(1000, Math.round(raw / 1000) * 1000);
          return toPersianDigits(adjusted.toLocaleString('en-US'));
        });
        return { ...s, startingPrice: updated };
      });
      safeLocalStorage.setItem('behkar_services', JSON.stringify(next));
      return next;
    });
  };

  const applyDiscount = (percentage: number) => {
    if (!percentage || percentage <= 0) return;
    const multiplier = (100 - percentage) / 100;

    // Update Tariffs
    setTariffs(prev => {
      const next = prev.map(t => {
        const basePrice = t.originalPriceRange || t.priceRange || '';
        const updatedPriceRange = basePrice.replace(/[\d۰-۹٠-٩,،]+/g, match => {
          const latinDigits = toEnglishDigits(match).replace(/[,،\s]/g, '');
          const val = parseInt(latinDigits, 10);
          if (isNaN(val) || val < 1000) return match;
          const raw = val * multiplier;
          const adjusted = Math.max(1000, Math.round(raw / 1000) * 1000);
          return toPersianDigits(adjusted.toLocaleString('en-US'));
        });
        return {
          ...t,
          originalPriceRange: t.originalPriceRange || t.priceRange,
          priceRange: updatedPriceRange
        };
      });
      safeLocalStorage.setItem('behkar_tariffs', JSON.stringify(next));
      return next;
    });

    // Update Services starting prices
    setServices(prev => {
      const next = prev.map(s => {
        if (!s.startingPrice) return s;
        const basePrice = s.originalStartingPrice || s.startingPrice || '';
        const updated = basePrice.replace(/[\d۰-۹٠-٩,،]+/g, match => {
          const latinDigits = toEnglishDigits(match).replace(/[,،\s]/g, '');
          const val = parseInt(latinDigits, 10);
          if (isNaN(val) || val < 1000) return match;
          const raw = val * multiplier;
          const adjusted = Math.max(1000, Math.round(raw / 1000) * 1000);
          return toPersianDigits(adjusted.toLocaleString('en-US'));
        });
        return {
          ...s,
          originalStartingPrice: s.originalStartingPrice || s.startingPrice,
          startingPrice: updated
        };
      });
      safeLocalStorage.setItem('behkar_services', JSON.stringify(next));
      return next;
    });

    // Update Settings
    updateSettings({
      showDiscount: true,
      discountPercentage: percentage,
      discountNotice: `تخفیف ویژه ${toPersianDigits(percentage)}٪`
    });
  };

  const removeDiscount = () => {
    // Restore Tariffs
    setTariffs(prev => {
      const next = prev.map(t => {
        if (t.originalPriceRange) {
          const { originalPriceRange, ...rest } = t;
          return {
            ...rest,
            priceRange: originalPriceRange
          };
        }
        return t;
      });
      safeLocalStorage.setItem('behkar_tariffs', JSON.stringify(next));
      return next;
    });

    // Restore Services
    setServices(prev => {
      const next = prev.map(s => {
        if (s.originalStartingPrice) {
          const { originalStartingPrice, ...rest } = s;
          return {
            ...rest,
            startingPrice: originalStartingPrice
          };
        }
        return s;
      });
      safeLocalStorage.setItem('behkar_services', JSON.stringify(next));
      return next;
    });

    // Update Settings
    updateSettings({
      showDiscount: false,
      discountPercentage: 0,
      discountNotice: ''
    });
  };

  const resetTariffsToDefault = () => {
    const fresh = JSON.parse(JSON.stringify(initialTariffs));
    setTariffs(fresh);
    safeLocalStorage.setItem('behkar_tariffs', JSON.stringify(fresh));
  };

  // Dynamic Neighborhoods CRUD
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodInfo[]>(() => {
    const saved = safeLocalStorage.getItem('behkar_neighborhoods');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const addNeighborhood = (item: Omit<NeighborhoodInfo, 'id'>) => {
    const newZone: NeighborhoodInfo = {
      ...item,
      id: 'zone-' + Date.now(),
    };
    setNeighborhoods(prev => {
      const next = [newZone, ...prev];
      safeLocalStorage.setItem('behkar_neighborhoods', JSON.stringify(next));
      return next;
    });
  };

  const updateNeighborhood = (id: string, updated: Partial<NeighborhoodInfo>) => {
    setNeighborhoods(prev => {
      const next = prev.map(z => (z.id === id ? { ...z, ...updated } : z));
      safeLocalStorage.setItem('behkar_neighborhoods', JSON.stringify(next));
      return next;
    });
  };

  const deleteNeighborhood = (id: string) => {
    setNeighborhoods(prev => {
      const next = prev.filter(z => z.id !== id);
      safeLocalStorage.setItem('behkar_neighborhoods', JSON.stringify(next));
      return next;
    });
  };

  const resetNeighborhoodsToDefault = () => {
    setNeighborhoods([]);
    safeLocalStorage.setItem('behkar_neighborhoods', JSON.stringify([]));
  };

  // Real Analytics & Logs
  const [stats, setStats] = useState<RealStats>(() => {
    const saved = safeLocalStorage.getItem('behkar_real_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      totalVisits: 1,
      totalCalls: 0,
      totalRubikaClicks: 0,
      totalBookings: 0,
      totalEstimates: 0,
      logs: [
        {
          id: 'log-init',
          type: 'visit',
          title: 'ورود به وب‌سایت',
          detail: 'کاربر با مرورگر وب وارد سایت بهکار ساوه شد.',
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
  });

  // Track session visit on mount
  useEffect(() => {
    const sessionTracked = safeSessionStorage.getItem('behkar_session_visited');
    if (!sessionTracked) {
      safeSessionStorage.setItem('behkar_session_visited', 'true');
      const nowStr = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
      setStats(prev => {
        const next: RealStats = {
          ...prev,
          totalVisits: prev.totalVisits + 1,
          logs: [
            {
              id: 'log-' + Date.now(),
              type: 'visit',
              title: 'بازدید جدید از سایت',
              detail: 'کاربر وارد سایت خدمات بهکار ساوه شد.',
              timestamp: nowStr
            },
            ...prev.logs.slice(0, 49)
          ]
        };
        safeLocalStorage.setItem('behkar_real_stats', JSON.stringify(next));
        return next;
      });
    }
  }, []);

  const addEventLog = (type: RealEventLog['type'], title: string, detail: string) => {
    const nowStr = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const newLog: RealEventLog = {
      id: 'log-' + Date.now(),
      type,
      title,
      detail,
      timestamp: nowStr
    };
    setStats(prev => {
      const next: RealStats = {
        ...prev,
        logs: [newLog, ...prev.logs.slice(0, 49)]
      };
      if (type === 'call') next.totalCalls += 1;
      if (type === 'rubika') next.totalRubikaClicks += 1;
      if (type === 'booking') next.totalBookings += 1;
      if (type === 'estimator') next.totalEstimates += 1;

      safeLocalStorage.setItem('behkar_real_stats', JSON.stringify(next));
      return next;
    });
  };

  const incrementCallCount = (targetPhone?: string) => {
    const phone = targetPhone || settings.primaryPhone;
    addEventLog('call', 'تماس تلفنی با دفتر', `کلیک روی شماره تماس: ${phone}`);
  };

  const trackRubikaClick = () => {
    addEventLog('rubika', 'پیام در روبیکا', `کلیک روی دکمه پیام در روبیکا`);
  };

  const trackEstimatorUse = (detail: string) => {
    addEventLog('estimator', 'استفاده از ماشین حساب هزینه', detail);
  };

  const clearStatsLogs = () => {
    setStats(prev => {
      const cleared: RealStats = {
        totalVisits: 1,
        totalCalls: 0,
        totalRubikaClicks: 0,
        totalBookings: 0,
        totalEstimates: 0,
        logs: [
          {
            id: 'log-' + Date.now(),
            type: 'visit',
            title: 'راه‌اندازی مجدد آمار',
            detail: 'آمار توسط مدیر سیستم صفر شد.',
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
          }
        ]
      };
      safeLocalStorage.setItem('behkar_real_stats', JSON.stringify(cleared));
      return cleared;
    });
  };

  // Bookings / Inquiries
  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    const saved = safeLocalStorage.getItem('behkar_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialBookings;
  });

  const addBooking = (bookingData: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => {
    const rawPhone = (bookingData.phoneNumber || '').toString().trim();
    const digitsOnly = rawPhone
      .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
      .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
      .replace(/\D/g, '');

    const triggerPhone = (settings.adminTriggerPhone || '09123456789')
      .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
      .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
      .replace(/\D/g, '');

    if (digitsOnly && triggerPhone && digitsOnly === triggerPhone) {
      setIsBookingModalOpen(false);
      setIsAdminModalOpen(true);
      return;
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newBooking: BookingRequest = {
      ...bookingData,
      id: 'req-' + Date.now(),
      createdAt: `امروز ${timeStr}`,
      status: 'pending',
    };
    setBookings(prev => {
      const next = [newBooking, ...prev];
      safeLocalStorage.setItem('behkar_bookings', JSON.stringify(next));
      return next;
    });
    addEventLog(
      'booking',
      'ثبت درخواست جدید در سایت',
      `درخواست ${bookingData.serviceType} توسط ${bookingData.fullName} (${bookingData.phoneNumber}) در ${bookingData.neighborhood}`
    );
  };

  const updateBookingStatus = (id: string, status: BookingRequest['status']) => {
    setBookings(prev => {
      const next = prev.map(b => (b.id === id ? { ...b, status } : b));
      safeLocalStorage.setItem('behkar_bookings', JSON.stringify(next));
      return next;
    });
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => {
      const next = prev.filter(b => b.id !== id);
      safeLocalStorage.setItem('behkar_bookings', JSON.stringify(next));
      return next;
    });
  };

  const resetBookingsToDefault = () => {
    const fresh = JSON.parse(JSON.stringify(initialBookings));
    setBookings(fresh);
    safeLocalStorage.setItem('behkar_bookings', JSON.stringify(fresh));
  };

  // Reviews with Moderation & CRUD
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const saved = safeLocalStorage.getItem('behkar_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialReviews;
  });

  // Client submission (defaults to approved: false awaiting admin verification)
  const addReview = (reviewData: Omit<ReviewItem, 'id' | 'date' | 'verified' | 'approved'>) => {
    const newRev: ReviewItem = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: 'به تازگی',
      verified: true,
      approved: false, // Pending admin approval
    };
    setReviews(prev => {
      const next = [newRev, ...prev];
      safeLocalStorage.setItem('behkar_reviews', JSON.stringify(next));
      return next;
    });
    addEventLog('estimator', 'ثبت نظر جدید توسط مشتری', `نظر ${reviewData.author} برای ${reviewData.service}`);
  };

  const approveReview = (id: string) => {
    setReviews(prev => {
      const next = prev.map(r => (r.id === id ? { ...r, approved: true } : r));
      safeLocalStorage.setItem('behkar_reviews', JSON.stringify(next));
      return next;
    });
  };

  const unapproveReview = (id: string) => {
    setReviews(prev => {
      const next = prev.map(r => (r.id === id ? { ...r, approved: false } : r));
      safeLocalStorage.setItem('behkar_reviews', JSON.stringify(next));
      return next;
    });
  };

  const deleteReview = (id: string) => {
    setReviews(prev => {
      const next = prev.filter(r => r.id !== id);
      safeLocalStorage.setItem('behkar_reviews', JSON.stringify(next));
      return next;
    });
  };

  const addAdminReview = (reviewData: Omit<ReviewItem, 'id' | 'date'>) => {
    const newRev: ReviewItem = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: 'به تازگی',
      approved: true,
    };
    setReviews(prev => {
      const next = [newRev, ...prev];
      safeLocalStorage.setItem('behkar_reviews', JSON.stringify(next));
      return next;
    });
  };

  // Gallery
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = safeLocalStorage.getItem('behkar_gallery');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((item: GalleryItem) => item && !item.id?.startsWith('gal-ba-'));
          if (filtered.length > 0) {
            return filtered;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    return initialGallery;
  });

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: 'gal-' + Date.now(),
    };
    setGallery(prev => {
      const next = [newItem, ...prev];
      safeLocalStorage.setItem('behkar_gallery', JSON.stringify(next));
      return next;
    });
  };

  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    setGallery(prev => {
      const next = prev.map(g => (g.id === id ? { ...g, ...updated } : g));
      safeLocalStorage.setItem('behkar_gallery', JSON.stringify(next));
      return next;
    });
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => {
      const next = prev.filter(g => g.id !== id);
      safeLocalStorage.setItem('behkar_gallery', JSON.stringify(next));
      return next;
    });
  };

  const resetReviewsToDefault = () => {
    const fresh = JSON.parse(JSON.stringify(initialReviews));
    setReviews(fresh);
    safeLocalStorage.setItem('behkar_reviews', JSON.stringify(fresh));
  };

  const resetGalleryToDefault = () => {
    const fresh = JSON.parse(JSON.stringify(initialGallery));
    setGallery(fresh);
    safeLocalStorage.setItem('behkar_gallery', JSON.stringify(fresh));
  };

  const resetAllToDefault = () => {
    const freshSettings = JSON.parse(JSON.stringify(initialSiteSettings));
    const freshServices = JSON.parse(JSON.stringify(initialServices));
    const freshTariffs = JSON.parse(JSON.stringify(initialTariffs));
    const freshNeighborhoods: NeighborhoodInfo[] = [];
    const freshGallery = JSON.parse(JSON.stringify(initialGallery));
    const freshReviews = JSON.parse(JSON.stringify(initialReviews));
    const freshBookings = JSON.parse(JSON.stringify(initialBookings));

    setSettings(freshSettings);
    setServices(freshServices);
    setTariffs(freshTariffs);
    setNeighborhoods(freshNeighborhoods);
    setGallery(freshGallery);
    setReviews(freshReviews);
    setBookings(freshBookings);

    safeLocalStorage.setItem('behkar_settings', JSON.stringify(freshSettings));
    safeLocalStorage.setItem('behkar_services', JSON.stringify(freshServices));
    safeLocalStorage.setItem('behkar_tariffs', JSON.stringify(freshTariffs));
    safeLocalStorage.setItem('behkar_neighborhoods', JSON.stringify(freshNeighborhoods));
    safeLocalStorage.setItem('behkar_gallery', JSON.stringify(freshGallery));
    safeLocalStorage.setItem('behkar_reviews', JSON.stringify(freshReviews));
    safeLocalStorage.setItem('behkar_bookings', JSON.stringify(freshBookings));
  };

  // Admin Auth
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return safeSessionStorage.getItem('behkar_admin_auth') === 'true';
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | null>(null);

  const loginAdmin = (username: string, pass: string): boolean => {
    const validUsername = settings.adminUsername || 'jafarzamanichn2005';
    const validPassword = settings.adminPin || 'Jz#9842Km$7W';

    if (username.trim().toLowerCase() === validUsername.trim().toLowerCase() && pass.trim() === validPassword.trim()) {
      setIsAdminLoggedIn(true);
      safeSessionStorage.setItem('behkar_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    safeSessionStorage.removeItem('behkar_admin_auth');
  };

  const openBookingForService = (serviceName?: string) => {
    setSelectedServiceForBooking(serviceName || 'لوله بازکنی فوری');
    setIsBookingModalOpen(true);
  };

  const addMediaVaultItem = (itemData: Omit<MediaVaultItem, 'id' | 'uploadedAt'>) => {
    const newItem: MediaVaultItem = {
      ...itemData,
      id: 'mv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      uploadedAt: new Date().toLocaleDateString('fa-IR'),
    };
    setSettings(prev => {
      const currentVault = prev.mediaVault || [];
      const filtered = currentVault.filter(m => m.url !== newItem.url);
      const updatedVault = [newItem, ...filtered];
      const updated = { ...prev, mediaVault: updatedVault };
      safeLocalStorage.setItem('behkar_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteMediaVaultItem = (id: string) => {
    setSettings(prev => {
      const currentVault = prev.mediaVault || [];
      const updatedVault = currentVault.filter(m => m.id !== id);
      const updated = { ...prev, mediaVault: updatedVault };
      safeLocalStorage.setItem('behkar_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const exportFullBackup = (): string => {
    const backupObj = {
      appName: 'دفتر خدماتی بهکار ساوه (مدیریت آقای زمانی)',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      exportedAtFa: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR'),
      summary: {
        servicesCount: services.length,
        galleryCount: gallery.length,
        mediaVaultCount: (settings.mediaVault || []).length,
        bookingsCount: bookings.length,
        reviewsCount: reviews.length,
        tariffsCount: tariffs.length,
        neighborhoodsCount: neighborhoods.length,
        totalCalls: stats.totalCalls,
        totalVisits: stats.totalVisits,
        totalLogs: (stats.logs || []).length,
      },
      settings,
      services,
      gallery,
      tariffs,
      reviews,
      neighborhoods,
      bookings,
      stats,
    };
    return JSON.stringify(backupObj, null, 2);
  };

  const importFullBackup = (
    jsonContent: string, 
    selectedSections?: { 
      settings?: boolean; 
      services?: boolean; 
      gallery?: boolean; 
      tariffs?: boolean; 
      reviews?: boolean; 
      neighborhoods?: boolean; 
      bookings?: boolean; 
      stats?: boolean; 
    }
  ): boolean => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed || typeof parsed !== 'object') return false;

      const shouldImport = (key: keyof NonNullable<typeof selectedSections>) => {
        if (!selectedSections) return true;
        return selectedSections[key] !== false;
      };

      if (shouldImport('settings') && parsed.settings) {
        setSettings(parsed.settings);
        safeLocalStorage.setItem('behkar_settings', JSON.stringify(parsed.settings));
      }
      if (shouldImport('services') && parsed.services && Array.isArray(parsed.services)) {
        setServices(parsed.services);
        safeLocalStorage.setItem('behkar_services', JSON.stringify(parsed.services));
      }
      if (shouldImport('gallery') && parsed.gallery && Array.isArray(parsed.gallery)) {
        setGallery(parsed.gallery);
        safeLocalStorage.setItem('behkar_gallery', JSON.stringify(parsed.gallery));
      }
      if (shouldImport('tariffs') && parsed.tariffs && Array.isArray(parsed.tariffs)) {
        setTariffs(parsed.tariffs);
        safeLocalStorage.setItem('behkar_tariffs', JSON.stringify(parsed.tariffs));
      }
      if (shouldImport('reviews') && parsed.reviews && Array.isArray(parsed.reviews)) {
        setReviews(parsed.reviews);
        safeLocalStorage.setItem('behkar_reviews', JSON.stringify(parsed.reviews));
      }
      if (shouldImport('neighborhoods') && parsed.neighborhoods && Array.isArray(parsed.neighborhoods)) {
        setNeighborhoods(parsed.neighborhoods);
        safeLocalStorage.setItem('behkar_neighborhoods', JSON.stringify(parsed.neighborhoods));
      }
      if (shouldImport('bookings') && parsed.bookings && Array.isArray(parsed.bookings)) {
        setBookings(parsed.bookings);
        safeLocalStorage.setItem('behkar_bookings', JSON.stringify(parsed.bookings));
      }
      if (shouldImport('stats') && parsed.stats && typeof parsed.stats === 'object') {
        setStats(parsed.stats);
        safeLocalStorage.setItem('behkar_real_stats', JSON.stringify(parsed.stats));
      }
      return true;
    } catch (err) {
      console.error('Import backup error:', err);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        settings,
        updateSettings,
        resetSettingsToDefault,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        validateAndApplyCoupon,
        incrementCouponUsage,
        resetCouponsToDefault,
        services,
        addService,
        updateService,
        deleteService,
        reorderServices,
        resetServicesToDefault,
        tariffs,
        addTariff,
        updateTariff,
        deleteTariff,
        reorderTariffs,
        batchUpdateTariffs,
        applyDiscount,
        removeDiscount,
        resetTariffsToDefault,
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        resetBookingsToDefault,
        reviews,
        addReview,
        approveReview,
        unapproveReview,
        deleteReview,
        addAdminReview,
        resetReviewsToDefault,
        neighborhoods,
        addNeighborhood,
        updateNeighborhood,
        deleteNeighborhood,
        resetNeighborhoodsToDefault,
        gallery,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        resetGalleryToDefault,
        resetAllToDefault,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isBookingModalOpen,
        setIsBookingModalOpen,
        selectedServiceForBooking,
        openBookingForService,
        callCount: stats.totalCalls,
        incrementCallCount,
        trackRubikaClick,
        trackEstimatorUse,
        stats,
        clearStatsLogs,
        addMediaVaultItem,
        deleteMediaVaultItem,
        exportFullBackup,
        importFullBackup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
