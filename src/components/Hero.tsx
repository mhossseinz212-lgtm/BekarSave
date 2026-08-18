import React from 'react';
import { 
  Phone, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Wrench, 
  Truck, 
  MapPin, 
  Sparkles,
  MessageSquare,
  Flame,
  ArrowDown,
  Send,
  Instagram,
  Link as LinkIcon,
  MessageCircle,
  Mail,
  Radio,
  Globe,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPersianPhone, toPersianDigits } from '../utils';

export const Hero: React.FC = () => {
  const { settings, openBookingForService, incrementCallCount, trackRubikaClick } = useApp();

  const handleCall = (phone?: string) => {
    incrementCallCount(phone);
  };

  const quickServices = [
    { title: 'لوله بازکنی فوری', icon: Wrench },
    { title: 'تخلیه چاه با تانکر', icon: Truck },
    { title: 'حفر چاه نو', icon: Sparkles },
    { title: 'ایزوگام با ضمانت', icon: ShieldCheck },
    { title: 'تعویض سنگ توالت', icon: CheckCircle2 },
  ];

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-blue-900/10 via-slate-50 to-white dark:from-[#0f172a] dark:via-[#0b1120] dark:to-[#0f172a] transition-colors">
      
      {/* Background Decorative Graphic Elements */}
      <div className="absolute top-0 right-1/4 -translate-y-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Main Content Column (7 cols on lg) */}
          <div className="lg:col-span-7 text-right">
            
            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight sm:leading-[1.25] tracking-tight mb-4 sm:mb-6">
              <span className="block text-slate-900 dark:text-white font-black mb-1">
                {settings.heroHeadline || 'لوله بازکنی در ساوه و خدمات فنی در ساوه'}
              </span>
              <span className="block text-lg sm:text-2xl lg:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {settings.businessName} | مدیریت {settings.managerName}
              </span>
            </h1>

            {/* Subheading & Core Value Proposition */}
            <div className="text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-2xl">
              <p>
                {settings.heroSubheadline || 'تخلیه چاه با تانکرهای مکنده بزرگ، لوله بازکنی با فنرهای جداگانه بدون خرابی و کثیف‌کاری، حفر چاه نو، اجرای ایزوگام درجه یک با ضمانت کتبی، لوله‌کشی و تعویض سنگ توالت.'}
              </p>
              <strong className="block mt-1.5 text-blue-700 dark:text-blue-400 font-bold">
                « با کمترین تعرفه مصوب و بالاترین کیفیت در تمام مناطق ساوه »
              </strong>

              {/* 24/7 Service Badge placed below core value proposition */}
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-300 text-xs sm:text-sm font-semibold shadow-xs">
                <span className="flex h-2 w-2 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>سرویس‌دهی ۲۴ ساعته ساوه</span>
                <span className="text-blue-400">•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">اعزام فوری</span>
              </div>
            </div>

            {/* Call To Action Buttons (High Contrast & Tactile) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
              
              {/* Primary Call Button */}
              {settings.showHeroCall1 !== false && (
                <a
                  id="hero-call-primary"
                  href={`tel:${settings.primaryPhone}`}
                  onClick={() => handleCall(settings.primaryPhone)}
                  className="emergency-pulse-btn flex items-center justify-center gap-3 px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-base sm:text-xl shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center animate-call-ring shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] sm:text-xs font-semibold text-emerald-100 block">تماس مستقیم شبانه‌روزی</span>
                    <span className="font-mono text-lg sm:text-2xl tracking-wider font-black">{formatPersianPhone(settings.primaryPhone)}</span>
                  </div>
                </a>
              )}

              {/* Secondary Call Button */}
              {settings.showHeroCall2 !== false && (
                <a
                  id="hero-call-secondary"
                  href={`tel:${settings.secondaryPhone}`}
                  onClick={() => handleCall(settings.secondaryPhone)}
                  className="flex items-center justify-center gap-2.5 px-4 py-3 sm:px-5 sm:py-4 rounded-2xl bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-lg border-2 border-blue-500/40 dark:border-blue-500/40 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 animate-pulse shrink-0" />
                  <div className="text-right">
                    <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 block">خط دوم اعزام فوری</span>
                    <span className="font-mono text-sm sm:text-base font-bold">{formatPersianPhone(settings.secondaryPhone)}</span>
                  </div>
                </a>
              )}

            </div>

            {/* Quick Consultation / Request Button + Rubika */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              {settings.showHeroBooking !== false && (
                <button
                  id="hero-book-btn"
                  onClick={() => openBookingForService('لوله بازکنی فوری')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  <span>ثبت درخواست آنلاین</span>
                </button>
              )}

              {/* Dynamic Messengers configured by Admin */}
              {settings.messengers && settings.messengers.filter(m => m.isActive !== false && m.showInHero !== false).map(m => {
                const themeBtnStyles: Record<string, string> = {
                  orange: 'bg-orange-500/15 hover:bg-orange-500/25 text-orange-700 dark:text-orange-300 border-orange-400/50',
                  purple: 'bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 border-purple-400/50',
                  emerald: 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border-emerald-400/50',
                  blue: 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-700 dark:text-sky-300 border-sky-400/50',
                  indigo: 'bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 border-indigo-400/50',
                  cyan: 'bg-teal-500/15 hover:bg-teal-500/25 text-teal-700 dark:text-teal-300 border-teal-400/50',
                  pink: 'bg-pink-500/15 hover:bg-pink-500/25 text-pink-700 dark:text-pink-300 border-pink-400/50',
                  red: 'bg-red-500/15 hover:bg-red-500/25 text-red-700 dark:text-red-300 border-red-400/50',
                  amber: 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border-amber-400/50',
                  teal: 'bg-teal-500/15 hover:bg-teal-500/25 text-teal-700 dark:text-teal-300 border-teal-400/50',
                  slate: 'bg-slate-500/15 hover:bg-slate-500/25 text-slate-700 dark:text-slate-300 border-slate-400/50',
                };

                const isCustom = m.colorTheme === 'custom' || !!m.customColorHex;
                const customHex = m.customColorHex || '#9333ea';
                const colorClass = !isCustom ? (themeBtnStyles[m.colorTheme || 'purple'] || themeBtnStyles.purple) : '';

                return (
                  <a
                    key={m.id}
                    href={m.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={m.name.includes('روبیکا') ? trackRubikaClick : undefined}
                    style={isCustom ? {
                      backgroundColor: `${customHex}20`,
                      borderColor: `${customHex}60`,
                      color: customHex,
                    } : undefined}
                    className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm border shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer ${colorClass}`}
                  >
                    {m.customIconUrl ? (
                      <img src={m.customIconUrl} alt={m.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                    ) : m.iconName === 'phone' ? (
                      <Phone className="w-4 h-4 shrink-0" />
                    ) : m.iconName === 'send' ? (
                      <Send className="w-4 h-4 shrink-0" />
                    ) : m.iconName === 'instagram' ? (
                      <Instagram className="w-4 h-4 shrink-0" />
                    ) : m.iconName === 'link' ? (
                      <LinkIcon className="w-4 h-4 shrink-0" />
                    ) : m.iconName === 'mail' ? (
                      <Mail className="w-4 h-4 shrink-0" />
                    ) : m.iconName === 'radio' ? (
                      <Radio className="w-4 h-4 shrink-0" />
                    ) : m.iconName === 'zap' ? (
                      <Zap className="w-4 h-4 shrink-0" />
                    ) : m.iconName === 'globe' ? (
                      <Globe className="w-4 h-4 shrink-0" />
                    ) : m.iconName === 'share-2' ? (
                      <Share2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <MessageCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{m.name}</span>
                    {m.badge && (
                      <span 
                        style={isCustom ? { backgroundColor: `${customHex}30` } : undefined}
                        className="text-[10px] opacity-85 font-normal px-1 py-0.2 rounded bg-black/10 dark:bg-white/10"
                      >
                        {m.badge}
                      </span>
                    )}
                  </a>
                );
              })}

              {/* Fallback Rubika button if no messengers array configured yet */}
              {(!settings.messengers || settings.messengers.length === 0) && settings.showHeroRubika !== false && (
                <a
                  id="hero-rubika-btn"
                  href={settings.rubikaUrl || 'https://rubika.ir/Jshhshvsh'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackRubikaClick}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 hover:from-purple-800/60 hover:to-indigo-800/60 text-purple-200 font-bold text-xs sm:text-sm border border-purple-500/40 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <img 
                    src="https://web.rubika.ir/assets/icons/icon-192x192.png" 
                    alt="Rubika" 
                    className="w-4 h-4 rounded-full object-cover shrink-0" 
                  />
                  <span>پیام مستقیم در روبیکا</span>
                </a>
              )}

              {/* Custom Admin Added Buttons */}
              {settings.customButtons && settings.customButtons.filter(b => b.isVisible).map(btn => (
                <a
                  key={btn.id}
                  href={btn.url}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                    btn.bgClass || 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  <span>{btn.title}</span>
                </a>
              ))}
            </div>

            {/* 4 Trust Guarantee Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-right">
                <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  ۱۰۰٪ تضمین باز شدن
                </span>
              </div>
              <div className="flex items-center gap-2 text-right">
                <Clock className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  حضور فوری در محل
                </span>
              </div>
              <div className="flex items-center gap-2 text-right">
                <Zap className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  بدون کثیف‌کاری و خرابی
                </span>
              </div>
              <div className="flex items-center gap-2 text-right">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  قیمت مصوب اتحادیه
                </span>
              </div>
            </div>

          </div>

          {/* Right Visual / Interactive Showcase Card (5 cols on lg) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/80 shadow-2xl p-6 sm:p-7 overflow-hidden">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {settings.techStatusText || 'وضعیت تکنسین‌های ساوه: آماده اعزام'}
                  </span>
                </div>
                {settings.techStatusBadge && (
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                    {settings.techStatusBadge}
                  </span>
                )}
              </div>

              {/* Service Hero Photo with Overlay info */}
              <div className="relative rounded-2xl overflow-hidden mt-4 aspect-4/3 bg-slate-900 group">
                <img
                  src={settings.heroImageUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop"}
                  alt={settings.techStatusText || "لوله بازکنی و تخلیه چاه ساوه بهکار"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                
                {/* Floating Badges on Image */}
                {settings.techCardImageBadge && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{settings.techCardImageBadge}</span>
                  </div>
                )}

                <div className="absolute bottom-3 right-3 left-3 text-white text-right">
                  {settings.techCardSubtitle && (
                    <span className="text-xs text-blue-400 font-bold block mb-1">
                      {settings.techCardSubtitle}
                    </span>
                  )}
                  {settings.techCardTitle && (
                    <h3 className="font-extrabold text-sm sm:text-base text-white">
                      {settings.techCardTitle}
                    </h3>
                  )}
                  {settings.techCardLocationText && (
                    <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{settings.techCardLocationText}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Problem Selector buttons */}
              <div className="mt-5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2.5 text-right">
                  انتخاب سریع خدمت مورد نیاز شما:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {quickServices.map((qs, idx) => {
                    const IconComp = qs.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => openBookingForService(qs.title)}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/60 hover:border-blue-400 dark:hover:border-blue-600 text-right transition-all text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">{qs.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>



            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
