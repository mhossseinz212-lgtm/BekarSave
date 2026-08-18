import React from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Wrench, 
  Award, 
  ChevronLeft, 
  Sparkles,
  Lock,
  Send,
  Instagram,
  Link as LinkIcon,
  MessageCircle,
  Mail,
  Radio,
  Globe,
  Zap,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPersianPhone, toPersianDigits } from '../utils';

export const Footer: React.FC = () => {
  const { settings, setIsAdminModalOpen, isAdminLoggedIn, incrementCallCount, trackRubikaClick } = useApp();

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-slate-200 dark:border-slate-800 text-right transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800">
          
          {/* Col 1: Brand Info (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {settings.businessName}
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">
                  مدیریت: {settings.managerName}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              دفتر خدماتی بهکار ساوه با سال‌ها تجربه درخشان، مجهز به پیشرفته‌ترین دستگاه‌های ژنراتور لوله بازکنی، تانکرهای ساکشن و لجن‌کش ۶۰۰۰ و ۱۲۰۰۰ لیتری، اکیپ مجرب مقنی جهت حفر چاه و اکیپ ایزوگام با ۱۰ سال ضمانت کتبی در سراسر شهر ساوه و حومه.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
                ✓ شبانه‌روزی ۲۴ ساعته
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
                ✓ اعزام کمتر از ۱۵ دقیقه
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
                ✓ کمترین قیمت و بالاترین کیفیت
              </span>
            </div>
          </div>

          {/* Col 2: Services Quick Links (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>خدمات تخصصی در ساوه</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a href="#services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                  <ChevronLeft className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                  <span>لوله بازکنی با فنر و ژنراتور ساوه</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                  <ChevronLeft className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                  <span>تخلیه چاه با تانکر لجن‌کش و وکیوم</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                  <ChevronLeft className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                  <span>کندن و حفر چاه نو و لایروبی چاه</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                  <ChevronLeft className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                  <span>ایزوگام با تضمین و ۱۰ سال ضمانت کتبی</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                  <ChevronLeft className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                  <span>لوله‌کشی آب و فاضلاب ساختمانی</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                  <ChevronLeft className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                  <span>تعویض سنگ و کاسه توالت ایرانی و فرنگی</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact Information (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>ارتباط فوری و رزرو شبانه‌روزی</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <a
                href={`tel:${settings.primaryPhone}`}
                onClick={() => incrementCallCount(settings.primaryPhone)}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 flex items-center justify-between transition-colors group shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:animate-call-ring" />
                  <span className="font-bold text-slate-800 dark:text-white">شماره تماس اصلی (زمانی):</span>
                </div>
                <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">{formatPersianPhone(settings.primaryPhone)}</span>
              </a>

              <a
                href={`tel:${settings.secondaryPhone}`}
                onClick={() => incrementCallCount(settings.secondaryPhone)}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 flex items-center justify-between transition-colors group shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-slate-800 dark:text-white">شماره تماس دوم:</span>
                </div>
                <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{formatPersianPhone(settings.secondaryPhone)}</span>
              </a>

              {/* Dynamic Messengers configured by Admin */}
              {settings.messengers && settings.messengers.filter(m => m.isActive !== false && m.showInFooter !== false).map(m => {
                const themeClasses: Record<string, { border: string; text: string; bg: string }> = {
                  purple: { border: 'hover:border-purple-500/60 dark:hover:border-purple-500/60', text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-950/60' },
                  orange: { border: 'hover:border-orange-500/60 dark:hover:border-orange-500/60', text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-950/60' },
                  emerald: { border: 'hover:border-emerald-500/60 dark:hover:border-emerald-500/60', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-950/60' },
                  blue: { border: 'hover:border-sky-500/60 dark:hover:border-sky-500/60', text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-950/60' },
                  indigo: { border: 'hover:border-indigo-500/60 dark:hover:border-indigo-500/60', text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-950/60' },
                  cyan: { border: 'hover:border-teal-500/60 dark:hover:border-teal-500/60', text: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-950/60' },
                  pink: { border: 'hover:border-pink-500/60 dark:hover:border-pink-500/60', text: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-100 dark:bg-pink-950/60' },
                  red: { border: 'hover:border-red-500/60 dark:hover:border-red-500/60', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-950/60' },
                  amber: { border: 'hover:border-amber-500/60 dark:hover:border-amber-500/60', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-950/60' },
                  teal: { border: 'hover:border-teal-500/60 dark:hover:border-teal-500/60', text: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-950/60' },
                  slate: { border: 'hover:border-slate-500/60 dark:hover:border-slate-500/60', text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
                };

                const isCustom = m.colorTheme === 'custom' || !!m.customColorHex;
                const customHex = m.customColorHex || '#9333ea';
                const tc = !isCustom ? (themeClasses[m.colorTheme || 'purple'] || themeClasses.purple) : null;

                return (
                  <a
                    key={m.id}
                    href={m.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={m.name.includes('روبیکا') ? trackRubikaClick : undefined}
                    style={isCustom ? { borderColor: `${customHex}40` } : undefined}
                    className={`p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${tc ? tc.border : 'hover:border-purple-500/60'} flex items-center justify-between transition-colors group shadow-2xs`}
                  >
                    <div className="flex items-center gap-2">
                      {m.customIconUrl ? (
                        <img src={m.customIconUrl} alt={m.name} className="w-4 h-4 rounded-full object-cover" />
                      ) : m.iconName === 'phone' ? (
                        <Phone style={isCustom ? { color: customHex } : undefined} className={`w-4 h-4 ${tc ? tc.text : ''}`} />
                      ) : m.iconName === 'send' ? (
                        <Send style={isCustom ? { color: customHex } : undefined} className={`w-4 h-4 ${tc ? tc.text : ''}`} />
                      ) : m.iconName === 'instagram' ? (
                        <Instagram style={isCustom ? { color: customHex } : undefined} className={`w-4 h-4 ${tc ? tc.text : ''}`} />
                      ) : m.iconName === 'link' ? (
                        <LinkIcon style={isCustom ? { color: customHex } : undefined} className={`w-4 h-4 ${tc ? tc.text : ''}`} />
                      ) : m.iconName === 'mail' ? (
                        <Mail style={isCustom ? { color: customHex } : undefined} className={`w-4 h-4 ${tc ? tc.text : ''}`} />
                      ) : m.iconName === 'radio' ? (
                        <Radio style={isCustom ? { color: customHex } : undefined} className={`w-4 h-4 ${tc ? tc.text : ''}`} />
                      ) : m.iconName === 'zap' ? (
                        <Zap style={isCustom ? { color: customHex } : undefined} className={`w-4 h-4 ${tc ? tc.text : ''}`} />
                      ) : m.iconName === 'globe' ? (
                        <Globe style={isCustom ? { color: customHex } : undefined} className={`w-4 h-4 ${tc ? tc.text : ''}`} />
                      ) : m.iconName === 'share-2' ? (
                        <Share2 style={isCustom ? { color: customHex } : undefined} className={`w-4 h-4 ${tc ? tc.text : ''}`} />
                      ) : (
                        <MessageCircle style={isCustom ? { color: customHex } : undefined} className={`w-4 h-4 ${tc ? tc.text : ''}`} />
                      )}
                      <span className="font-bold text-slate-800 dark:text-white">{m.name}:</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {m.badge && (
                        <span 
                          style={isCustom ? { backgroundColor: `${customHex}20`, color: customHex } : undefined}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${tc ? `${tc.bg} ${tc.text}` : ''}`}
                        >
                          {m.badge}
                        </span>
                      )}
                      <span 
                        style={isCustom ? { color: customHex } : undefined}
                        className={`text-xs font-bold ${tc ? tc.text : ''}`}
                      >
                        ارتباط مستقیم
                      </span>
                    </div>
                  </a>
                );
              })}

              {/* Fallback Rubika card if no messengers list configured */}
              {(!settings.messengers || settings.messengers.length === 0) && (
                <a
                  href={settings.rubikaUrl || 'https://rubika.ir/Jshhshvsh'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackRubikaClick}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/60 dark:hover:border-purple-500/60 flex items-center justify-between transition-colors group shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src="https://web.rubika.ir/assets/icons/icon-192x192.png" 
                      alt="Rubika" 
                      className="w-4 h-4 rounded-full object-cover" 
                    />
                    <span className="font-bold text-slate-800 dark:text-white">پیام و ارسال عکس در روبیکا:</span>
                  </div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">ارتباط مستقیم</span>
                </a>
              )}

              <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-2 text-slate-600 dark:text-slate-400 shadow-2xs">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  محدوده فعالیت: تمام مناطق شهر ساوه، شهرک صنعتی کاوه، شهرک فجر، شهرک علوی، مسکن مهر و بخش‌های یل‌آباد، غرق‌آباد، آوه و نوبران
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Local SEO Keywords Strip */}
        <div className="py-6 border-b border-slate-200 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-500 leading-relaxed">
          <strong className="text-slate-700 dark:text-slate-400">کلمات جستجوی محلی گوگل در ساوه: </strong>
          لوله بازکنی ساوه • تخلیه چاه ساوه • کندن چاه نو ساوه • لوله بازکنی شبانه روزی ساوه • تخلیه چاه با تانکر لجن کش ساوه • لوله کشی ساوه • ایزوگام در ساوه • تعویض کاسه توالت ساوه • لوله بازکنی ارزان ساوه • خدمات ساختمانی آقای زمانی ساوه • تخلیه چاه شهرک صنعتی کاوه ساوه • رفع گرفتگی لوله فاضلاب ساوه با فنر فولادی.
        </div>

        {/* Bottom Copyright & SEO Links & Admin Trigger */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-500">
          <p>
            © {toPersianDigits(1405)} تمامی حقوق محفوظ است | <strong className="text-slate-800 dark:text-slate-300">دفتر خدماتی بهکار ساوه</strong> - با مدیریت <strong className="text-slate-800 dark:text-slate-300">{settings.managerName}</strong>
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <a 
              href="/sitemap.xml" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              نقشه سایت (sitemap.xml)
            </a>
            <span>•</span>
            <a 
              href="/robots.txt" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              راهنمای خزنده‌ها (robots.txt)
            </a>
            {isAdminLoggedIn && (
              <>
                <span>•</span>
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer text-amber-600 dark:text-amber-500 font-bold inline-flex items-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>پنل مدیریت</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
