import React, { useState } from 'react';
import { 
  Phone, 
  Clock, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Wrench, 
  Menu, 
  X, 
  Lock, 
  Sparkles,
  MapPin,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPersianPhone, toPersianDigits } from '../utils';

export const Header: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    settings, 
    setIsAdminModalOpen, 
    isAdminLoggedIn,
    incrementCallCount,
    trackRubikaClick
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePhoneClick = () => {
    incrementCallCount(settings.primaryPhone);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-[#0f172a]/95 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-xs">
      {/* Top Discount / Urgent Announcement Banner */}
      {(settings.showDiscount || settings.isEmergencyBannerActive) && (
        <div className={`py-2 px-3 text-xs sm:text-sm font-medium text-center shadow-inner flex items-center justify-center gap-2 overflow-hidden transition-all ${
          settings.showDiscount
            ? 'bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-800 text-white'
            : 'bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white'
        }`}>
          {settings.showDiscount ? (
            <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse shrink-0" />
          ) : (
            <Flame className="w-4 h-4 text-blue-200 animate-bounce shrink-0" />
          )}

          <span className="font-bold truncate">
            {settings.showDiscount
              ? (settings.discountNotice || `تخفیف ویژه ${toPersianDigits(settings.discountPercentage)}٪ ثبت آنلاین سفارش و تماس از سایت`)
              : settings.emergencyBannerText}
          </span>

          {settings.showDiscount && settings.discountPercentage > 0 && (
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-black mr-1 border border-white/30 shrink-0">
              {toPersianDigits(settings.discountPercentage)}٪ تخفیف
            </span>
          )}

          <a
            href={`tel:${settings.primaryPhone}`}
            onClick={handlePhoneClick}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-emerald-900 font-extrabold text-xs hover:bg-emerald-50 transition-colors shadow-xs mr-2 cursor-pointer shrink-0"
          >
            <Phone className="w-3 h-3 text-emerald-700" />
            <span>تماس و دریافت تخفیف</span>
          </a>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a href="#hero" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform shrink-0">
                <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm sm:text-lg text-slate-900 dark:text-white tracking-tight">
                    {settings.businessName}
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                    ساوه
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <span>مدیریت:</span>
                  <strong className="text-blue-600 dark:text-blue-400 font-bold">{settings.managerName}</strong>
                  <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
                  <span className="hidden md:inline-flex text-emerald-600 dark:text-emerald-400 font-semibold items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                    شبانه‌روزی فوری
                  </span>
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-700 dark:text-slate-200">
            <a href="#services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
              خدمات تخصصی
            </a>
            <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>استعلام آنلاین هزینه</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-600 text-white font-bold">رایگان</span>
            </a>
            <a href="#coverage" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
              مناطق ساوه
            </a>
            <a href="#gallery" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
              نمونه‌کارها
            </a>
            <a href="#reviews" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
              نظرات مشتریان
            </a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
              سوالات متداول
            </a>
          </nav>

          {/* Action Buttons & Quick Call */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Primary Phone Button with Ring Effect (Visible on md+) */}
            <a
              id="header-call-primary"
              href={`tel:${settings.primaryPhone}`}
              onClick={handlePhoneClick}
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center animate-call-ring">
                <Phone className="w-3 h-3 text-white" />
              </div>
              <div className="text-right leading-tight">
                <span className="text-[9px] block font-medium text-emerald-100">تماس مستقیم (زمانی)</span>
                <span className="font-mono text-xs sm:text-sm font-black tracking-wider">{formatPersianPhone(settings.primaryPhone)}</span>
              </div>
            </a>

            {/* Dark / Light Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={theme === 'light' ? 'تغییر به حالت شب' : 'تغییر به حالت روز'}
              aria-label="تغییر تم"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              ) : (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              )}
            </button>

            {/* Admin Panel Quick Access Button - Visible ONLY when Admin is Logged In */}
            {isAdminLoggedIn && (
              <button
                id="admin-panel-btn"
                onClick={() => setIsAdminModalOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-300/60 dark:border-amber-700/60 hover:bg-amber-500/20 dark:hover:bg-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer animate-in fade-in duration-200"
                title="مدیریت سایت"
                aria-label="مدیریت سایت"
              >
                <Lock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold hidden md:inline">پنل مدیریت</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </button>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="منوی موبایل"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
              <a 
                href="#services" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span>خدمات تخصصی ساوه</span>
                <Wrench className="w-4 h-4 text-blue-500" />
              </a>
              <a 
                href="#pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-between"
              >
                <span>استعلام آنلاین هزینه و محاسبه‌گر</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-600 text-white font-bold">رایگان</span>
              </a>
              <a 
                href="#coverage" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span>مناطق تحت پوشش ساوه و حومه</span>
                <MapPin className="w-4 h-4 text-emerald-500" />
              </a>
              <a 
                href="#gallery" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                نمونه‌کارها و ویدیوها
              </a>
              <a 
                href="#reviews" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                نظرات مشتریان و همشهریان
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                سوالات متداول
              </a>
              
              <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <a
                  href={`tel:${settings.primaryPhone}`}
                  onClick={() => incrementCallCount(settings.primaryPhone)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-bold text-base shadow-sm"
                >
                  <Phone className="w-5 h-5 animate-call-ring" />
                  <span>تماس فوری با {formatPersianPhone(settings.primaryPhone)}</span>
                </a>
                <a
                  href={`tel:${settings.secondaryPhone}`}
                  onClick={() => incrementCallCount(settings.secondaryPhone)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm border border-slate-200 dark:border-slate-700"
                >
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span>شماره دوم: {formatPersianPhone(settings.secondaryPhone)}</span>
                </a>
                <a
                  href={settings.rubikaUrl || 'https://rubika.ir/Jshhshvsh'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackRubikaClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 font-bold text-sm border border-purple-500/40"
                >
                  <img 
                    src="https://web.rubika.ir/assets/icons/icon-192x192.png" 
                    alt="Rubika" 
                    className="w-4 h-4 rounded-full object-cover shrink-0" 
                  />
                  <span>پیام در روبیکا</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
