import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  Phone, 
  Navigation,
  CheckCircle,
  Zap,
  Building2,
  Factory,
  Home
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NeighborhoodInfo } from '../types';
import { toPersianDigits, formatPersianPhone } from '../utils';

export const CoverageMap: React.FC = () => {
  const { settings, incrementCallCount, neighborhoods } = useApp();

  return (
    <section id="coverage" className="py-16 sm:py-20 bg-slate-50/60 dark:bg-[#0f172a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800/60">
            <Navigation className="w-3.5 h-3.5" />
            <span>پوشش‌دهی لوله بازکنی در ساوه و خدمات فنی در ساوه</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            مناطق تحت پوشش لوله بازکنی در ساوه و خدمات فنی در ساوه
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            دفتر بهکار به طور کامل و بدون محدودیت، خدمات لوله بازکنی در ساوه و کلیه خدمات فنی در ساوه را در تمام مناطق شهری، مجتمع‌های مسکونی، شهر صنعتی کاوه و حومه پوشش می‌دهد.
          </p>
        </div>

        {/* Global Whole-City Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-right">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/70 shadow-xs hover:border-blue-300 dark:hover:border-blue-600/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2">
              تمام محله‌ها و خیابان‌های ساوه
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              پوشش کامل خیابان‌های اصلی، فرعی و کوچه‌های ساوه از جمله مطهری، شریعتی، فردوسی، طالقانی، آزادی، مدرس و بافت قدیم و جدید.
            </p>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>اعزام فوری سراسر ساوه</span>
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/70 shadow-xs hover:border-blue-300 dark:hover:border-blue-600/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2">
              تمامی شهرک‌ها و مسکن مهر
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              شهرک فجر، شهرک علوی، شهرک دانشگاه، شهرک سپاه، بسیج، ولیعصر، مسکن مهر و تمامی مجتمع‌های آپارتمانی با تجهیزات مخصوص.
            </p>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>فنر متری طول بلند آپارتمانی</span>
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/70 shadow-xs hover:border-blue-300 dark:hover:border-blue-600/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Factory className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2">
              شهر صنعتی کاوه و حومه ساوه
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              کارخانجات و فازهای شهر صنعتی کاوه، یل‌آباد، آوه، غرق‌آباد، نوبران و تمامی باغات و ویلاها با تانکرهای ۶۰۰۰ و ۱۲۰۰۰ لیتری.
            </p>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ارائه فاکتور رسمی و قرارداد شرکتی</span>
            </span>
          </div>
        </div>

        {/* Dynamic Admin-Managed Zones */}
        {neighborhoods.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="text-right mb-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                پایگاه‌ها و ایستگاه‌های فعال در ساوه
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                لیست مناطق و ایستگاه‌های استقرار اکیپ‌های سیار
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {neighborhoods.map((zone) => (
                <div
                  key={zone.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 hover:border-blue-400 text-right transition-all shadow-xs relative overflow-hidden"
                >
                  {zone.isSpecialZone && (
                    <span className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-br-lg">
                      پایگاه ویژه
                    </span>
                  )}

                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                      {zone.name}
                    </h4>
                  </div>

                  {zone.note && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                      {zone.note}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>اعزام فوری اکیپ سیار</span>
                    </span>
                    {zone.activeTechs && (
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        <span>{toPersianDigits(zone.activeTechs)} اکیپ فعال</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action strip */}
        <div className="mt-8 p-5 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <h4 className="text-base sm:text-lg font-black mb-1">
              در هر کجای ساوه یا حومه هستید، فقط یک تماس فاصله داریم!
            </h4>
            <p className="text-xs text-blue-100">
              اعزام سرویس‌کار با نازلترین قیمت و ضمانت کتبی باز شدن لوله و رفع کامل عیب.
            </p>
          </div>
          <a
            href={`tel:${settings.primaryPhone}`}
            onClick={() => incrementCallCount(settings.primaryPhone)}
            className="px-6 py-3 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-black text-sm shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>تماس مستقیم: {formatPersianPhone(settings.primaryPhone)}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
