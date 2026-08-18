import React, { useState } from 'react';
import { 
  Wrench, 
  Truck, 
  Hammer, 
  ShieldCheck, 
  Pipette, 
  Sparkles, 
  Phone, 
  Check, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceItem } from '../types';
import { toPersianDigits, formatPersianPhone } from '../utils';

export const ServicesSection: React.FC = () => {
  const { services, settings, openBookingForService, incrementCallCount } = useApp();
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench': return Wrench;
      case 'Truck': return Truck;
      case 'Hammer': return Hammer;
      case 'ShieldCheck': return ShieldCheck;
      case 'Pipette': return Pipette;
      case 'Sparkles': return Sparkles;
      default: return Wrench;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedServiceId(prev => (prev === id ? null : id));
  };

  return (
    <section id="services" className="py-16 sm:py-20 bg-slate-50/50 dark:bg-[#0f172a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800/60">
            <span>لوله بازکنی در ساوه و خدمات فنی در ساوه</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            {settings.servicesHeadline || "خدمات لوله بازکنی در ساوه و کلیه خدمات فنی در ساوه"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {settings.servicesSubheadline || `کلیه خدمات لوله بازکنی در ساوه و خدمات فنی در ساوه تحت نظارت مستقیم ${settings.managerName} با بهره‌گیری از مدرن‌ترین ابزارآلات و کادر متعهد، با کمترین قیمت و ضمانت کتبی ارائه می‌گردد.`}
          </p>
        </div>

        {/* Services Grid (2 cols on md, 3 cols on lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service: ServiceItem) => {
            const IconComp = getIcon(service.icon);
            const isExpanded = expandedServiceId === service.id;

            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/70 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-blue-400 dark:hover:border-blue-500/50"
              >
                <div>
                  {/* Service Photo with Badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 flex items-center justify-center">
                        <IconComp className="w-16 h-16 text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

                    {/* Top Badge */}
                    {service.badge && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                        {service.badge}
                      </div>
                    )}

                    {/* Icon & Title Overlay */}
                    <div className="absolute bottom-3 right-3 left-3 text-right">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white drop-shadow-sm">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 text-right">
                    
                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {service.shortDesc}
                    </p>

                    {/* Guarantee Pill */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-4 w-full justify-start">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{service.guarantee}</span>
                    </div>

                    {/* Key Features List */}
                    <div className="space-y-2 mb-4">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                        ویژگی‌های شاخص این خدمت:
                      </span>
                      {(service.features || []).slice(0, isExpanded ? (service.features || []).length : 3).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700 animate-in fade-in duration-200 space-y-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {service.fullDesc}
                        </p>
                        
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                            تجهیزات تخصصی مورد استفاده:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {(service.tools || []).map((t, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Toggle Show More Button */}
                    <button
                      onClick={() => toggleExpand(service.id)}
                      className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'بستن توضیحات' : 'توضیحات تکمیلی و مشخصات'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                  </div>
                </div>

                {/* Footer of Card: Pricing & Action Buttons */}
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-200/60 dark:border-slate-700/60 mt-2 bg-slate-50 dark:bg-slate-800/40 rounded-b-3xl">
                  
                  {/* Starting Price */}
                  <div className="flex items-baseline justify-between py-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {settings.forceCallForPrice ? 'هزینه و تعرفه:' : 'تعرفه پایه:'}
                    </span>
                    <div className="text-left">
                      {settings.forceCallForPrice ? (
                        <span className="inline-flex items-center gap-1 font-black text-xs sm:text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800/60">
                          <Phone className="w-3 h-3 text-emerald-500" />
                          <span>{settings.callForPriceCustomText || 'برای استعلام تماس بگیرید'}</span>
                        </span>
                      ) : (
                        <>
                          <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                            {toPersianDigits(service.startingPrice)}
                          </span>
                          {service.priceNote && (
                            <span className="block text-[10px] text-slate-400 dark:text-slate-400">
                              {toPersianDigits(service.priceNote)}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <a
                      href={`tel:${settings.primaryPhone}`}
                      onClick={() => incrementCallCount(settings.primaryPhone)}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>تماس فوری</span>
                    </a>

                    <button
                      onClick={() => openBookingForService(service.title)}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-transform active:scale-95 cursor-pointer"
                    >
                      <span>ثبت درخواست</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Strip */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-4 text-right shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-base sm:text-lg">
                آیا مشکل خاص یا گرفتگی با مصالح سخت دارید؟
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                با دستگاه‌های پیشرفته واتر جت و ژنراتور برقی، سخت‌ترین گرفتگی‌های سیمانی و قیر را بدون شکستن لوله باز می‌کنیم.
              </p>
            </div>
          </div>
          
          <a
            href={`tel:${settings.primaryPhone}`}
            onClick={() => incrementCallCount(settings.primaryPhone)}
            className="shrink-0 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition-all hover:scale-105 active:scale-95"
          >
            مشاوره رایگان با آقای زمانی: {formatPersianPhone(settings.primaryPhone)}
          </a>
        </div>

      </div>
    </section>
  );
};
