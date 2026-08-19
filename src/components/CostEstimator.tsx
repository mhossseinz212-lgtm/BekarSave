import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  Phone, 
  Send, 
  Sparkles, 
  MapPin, 
  Clock, 
  Tag, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { toPersianDigits, formatPersianPhone } from '../utils';

export const CostEstimator: React.FC = () => {
  const { settings, addBooking, incrementCallCount, neighborhoods, tariffs } = useApp();

  const defaultNeighborhood = neighborhoods.length > 0 ? neighborhoods[0].name : '';
  const [selectedService, setSelectedService] = useState('pipe');
  const [subType, setSubType] = useState('f15');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(defaultNeighborhood);
  const [areaSize, setAreaSize] = useState<number>(50); // for isogam or well
  const [isUrgent, setIsUrgent] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (neighborhoods.length > 0 && !selectedNeighborhood) {
      setSelectedNeighborhood(neighborhoods[0].name);
    }
  }, [neighborhoods]);

  // Helper to extract min and max numbers from priceRange string like "۱,۰۰۰,۰۰۰ – ۱,۵۰۰,۰۰۰" or "1000000 - 1500000"
  const parseTariffPrice = (tariffId: string, fallbackMin: number, fallbackMax: number) => {
    const item = tariffs.find(t => t.id === tariffId);
    if (!item || !item.priceRange) return { min: fallbackMin, max: fallbackMax, title: item?.title || '' };
    
    // Convert Persian digits to English digits
    const cleaned = item.priceRange
      .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
      .replace(/[,\s،]/g, '');
    
    const parts = cleaned.split(/[-–—]/);
    if (parts.length >= 2) {
      const min = parseInt(parts[0], 10);
      const max = parseInt(parts[1], 10);
      if (!isNaN(min) && !isNaN(max)) {
        return { min, max, title: item.title };
      }
    } else if (parts.length === 1) {
      const single = parseInt(parts[0], 10);
      if (!isNaN(single)) {
        return { min: single, max: single, title: item.title };
      }
    }
    return { min: fallbackMin, max: fallbackMax, title: item.title };
  };

  // Calculation Logic using exact official updated tariffs
  const calculateEstimate = () => {
    let baseMin = 1000000;
    let baseMax = 1500000;
    let label = '';

    if (selectedService === 'pipe') {
      switch (subType) {
        case 'f15': {
          const t = parseTariffPrice('tar-p1', 1000000, 1500000);
          baseMin = t.min;
          baseMax = t.max;
          label = t.title || 'فنر زدن از ۱ تا ۱۵ متر (لوله بازکنی استاندارد)';
          break;
        }
        case 'f25': {
          const t = parseTariffPrice('tar-p2', 1780000, 2500000);
          baseMin = t.min;
          baseMax = t.max;
          label = t.title || 'فنر زدن طول بیش از ۱۵ متر';
          break;
        }
        case 'f_long': {
          const t = parseTariffPrice('tar-p3', 2500000, 3400000);
          baseMin = t.min;
          baseMax = t.max;
          label = t.title || 'فنر زدن متراژ بلند طول بیش از ۲۵ متر';
          break;
        }
        case 'generator_heavy': {
          const t = parseTariffPrice('tar-p4', 1500000, 3230000);
          baseMin = t.min;
          baseMax = t.max;
          label = t.title || 'لوله بازکنی با دستگاه ژنراتور قوی و فنر ضخیم الماسه';
          break;
        }
        default: {
          const t = parseTariffPrice('tar-p1', 1000000, 1500000);
          baseMin = t.min;
          baseMax = t.max;
          label = t.title || 'فنر زدن استاندارد (۱ تا ۱۵ متر)';
        }
      }
    } else if (selectedService === 'tanker') {
      switch (subType) {
        case '6000_suction': {
          const t = parseTariffPrice('tar-t1', 2750000, 4000000);
          baseMin = t.min;
          baseMax = t.max;
          label = t.title || 'تخلیه چاه با تانکر ۶۰۰۰ لیتری با پمپ مکنده';
          break;
        }
        case '8000_suction': {
          const t = parseTariffPrice('tar-t2', 3500000, 4500000);
          baseMin = t.min;
          baseMax = t.max;
          label = t.title || 'تخلیه چاه با تانکر ۸۰۰۰ لیتری با پمپ مکنده';
          break;
        }
        case '6000_sludge': {
          const t = parseTariffPrice('tar-t3', 3000000, 4000000);
          baseMin = t.min;
          baseMax = t.max;
          label = t.title || 'تخلیه چاه با تانکر ۶۰۰۰ لیتری با پمپ لجن‌کش';
          break;
        }
        case '8000_sludge': {
          const t = parseTariffPrice('tar-t4', 4000000, 5000000);
          baseMin = t.min;
          baseMax = t.max;
          label = t.title || 'تخلیه چاه با تانکر ۸۰۰۰ لیتری با پمپ لجن‌کش پرقدرت';
          break;
        }
        default: {
          const t = parseTariffPrice('tar-t1', 2750000, 4000000);
          baseMin = t.min;
          baseMax = t.max;
          label = t.title || 'تخلیه چاه با تانکر ۶۰۰۰ لیتری مکنده';
        }
      }
    } else if (selectedService === 'well_digging') {
      switch (subType) {
        case 'water_manual': {
          const t = parseTariffPrice('tar-d1', 1500000, 3000000);
          baseMin = t.min;
          baseMax = t.max;
          label = t.title || 'حفر چاه آب دستی (هر متر)';
          break;
        }
        case 'water_machine': {
          const t = parseTariffPrice('tar-d2', 1500000, 2000000);
          baseMin = t.min;
          baseMax = t.max;
          label = t.title || 'حفر چاه آب با دستگاه (هر متر)';
          break;
        }
        case 'sewage': {
          const t = parseTariffPrice('tar-d3', 1000000, 2000000);
          baseMin = t.min;
          baseMax = t.max;
          label = t.title || 'حفر چاه فاضلاب جذبی (هر متر)';
          break;
        }
        case 'earth': {
          const t = parseTariffPrice('tar-d4', 1950000, 2800000);
          baseMin = t.min;
          baseMax = t.max;
          label = t.title || 'حفر چاه ارت تخصصی (هر متر)';
          break;
        }
        default: {
          const t = parseTariffPrice('tar-d3', 1000000, 2000000);
          baseMin = t.min;
          baseMax = t.max;
          label = t.title || 'حفر چاه فاضلاب و انبار';
        }
      }
    } else if (selectedService === 'isogam') {
      baseMin = areaSize * 95000;
      baseMax = areaSize * 135000;
      label = `نصب ایزوگام درجه یک برای ${toPersianDigits(areaSize)} متر مربع با ۱۰ سال ضمانت`;
    } else if (selectedService === 'toilet_stone') {
      baseMin = 600000;
      baseMax = 950000;
      label = 'تعویض کامل کاسه توالت، شیب‌بندی، عایق نانو و کاشی‌کاری';
    } else if (selectedService === 'plumbing') {
      baseMin = 250000;
      baseMax = 500000;
      label = 'تعمیرات و اصلاح لوله‌کشی فاضلاب و رفع نشتی';
    }

    // Apply Neighborhood multiplier if configured (e.g. 1.0, 1.5, 2.0)
    const activeZone = neighborhoods.find(n => n.name === selectedNeighborhood);
    const multiplier = (activeZone && activeZone.priceMultiplier && activeZone.priceMultiplier > 0) 
      ? activeZone.priceMultiplier 
      : 1;

    baseMin = Math.round(baseMin * multiplier);
    baseMax = Math.round(baseMax * multiplier);

    // Apply Site Discount (if enabled and > 0)
    const hasDiscount = Boolean(settings.showDiscount && settings.discountPercentage > 0);
    const discountRate = hasDiscount ? (100 - settings.discountPercentage) / 100 : 1;
    const discountedMin = Math.round((baseMin * discountRate) / 1000) * 1000;
    const discountedMax = Math.round((baseMax * discountRate) / 1000) * 1000;

    return {
      originalMin: baseMin,
      originalMax: baseMax,
      discountedMin,
      discountedMax,
      hasDiscount,
      multiplier,
      label,
    };
  };

  const estimate = calculateEstimate();

  const handleInstantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digitsOnly = customerPhone
      .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
      .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
      .replace(/\D/g, '');

    const triggerPhone = (settings.adminTriggerPhone || '09123456789')
      .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
      .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
      .replace(/\D/g, '');

    if (digitsOnly && triggerPhone && digitsOnly === triggerPhone) {
      addBooking({
        fullName: 'مدیر',
        phoneNumber: settings.adminTriggerPhone || '09123456789',
        serviceType: 'ورود به پنل مدیریت',
        neighborhood: 'ساوه',
        address: 'ورود مدیریت',
        description: '',
        isUrgent: false,
      });
      setCustomerPhone('');
      setCustomerName('');
      return;
    }

    if (!customerPhone.trim()) {
      alert('لطفاً شماره تماس خود را وارد نمایید.');
      return;
    }
    if (!customerName.trim()) {
      alert('لطفاً نام و نام خانوادگی خود را وارد نمایید.');
      return;
    }

    addBooking({
      fullName: customerName.trim(),
      phoneNumber: customerPhone.trim(),
      serviceType: estimate.label,
      neighborhood: selectedNeighborhood || 'کل ساوه',
      address: `درخواست آنلاین از منطقه ${selectedNeighborhood || 'ساوه'}`,
      description: `تخمین اولیه: ${toPersianDigits(estimate.discountedMin.toLocaleString())} الی ${toPersianDigits(estimate.discountedMax.toLocaleString())} تومان`,
      isUrgent,
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error(err);
    }

    setSubmitted(true);
  };

  return (
    <section id="calculator" className="py-16 sm:py-20 bg-slate-100/70 dark:bg-[#0f172a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800/60 shadow-2xs">
            <Calculator className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>انتخاب نوع خدمت و محاسبه فوری نتیجه استعلام قیمت</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            انتخاب نوع خدمت و مشاهده فوری نتیجه محاسبه و استعلام قیمت
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            نوع خدمت مورد نظرتان را انتخاب کنید تا بلافاصله نتیجه محاسبه و تعرفه مصوب آن را به همراه ضمانت کتبی مشاهده فرمایید.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          
          {/* Form Controls Column (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-md">
            
            {/* Step 1: Select Main Service Category */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2.5 text-right">
                ۱. انتخاب نوع خدمت:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'pipe', title: 'لوله بازکنی' },
                  { id: 'tanker', title: 'تخلیه چاه' },
                  { id: 'isogam', title: 'ایزوگام با ضمانت' },
                  { id: 'toilet_stone', title: 'تعویض سنگ توالت' },
                  { id: 'plumbing', title: 'لوله‌کشی فاضلاب' },
                  { id: 'well_digging', title: 'حفر چاه نو' },
                ].map(srv => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => {
                      setSelectedService(srv.id);
                      if (srv.id === 'pipe') setSubType('f15');
                      if (srv.id === 'tanker') setSubType('6000_suction');
                      if (srv.id === 'well_digging') setSubType('sewage');
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                      selectedService === srv.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {srv.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Service Specific Sub-types */}
            {selectedService === 'pipe' && (
              <div className="mb-6 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 text-right">
                  ۲. نوع فنر و متراژ گرفتگی لوله:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'f15', title: 'فنر زدن از ۱ تا ۱۵ متر (استاندارد)', price: '۱,۰۰۰,۰۰۰ الی ۱,۵۰۰,۰۰۰ تومان' },
                    { id: 'f25', title: 'فنر زدن طول بیش از ۱۵ متر', price: '۱,۷۸۰,۰۰۰ الی ۲,۵۰۰,۰۰۰ تومان' },
                    { id: 'f_long', title: 'فنر زدن متراژ بیش از ۲۵ متر', price: '۲,۵۰۰,۰۰۰ الی ۳,۴۰۰,۰۰۰ تومان' },
                    { id: 'generator_heavy', title: 'ژنراتور قوی و فنر ضخیم (سیمان/چربی)', price: '۱,۵۰۰,۰۰۰ الی ۳,۲۳۰,۰۰۰ تومان' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSubType(item.id)}
                      className={`p-3 rounded-xl text-right font-medium transition-all cursor-pointer border ${
                        subType === item.id
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 border-blue-500 font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="block text-xs font-bold mb-0.5">{item.title}</span>
                      <span className="block text-[11px] text-blue-600 dark:text-blue-400 font-mono">{toPersianDigits(item.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedService === 'tanker' && (
              <div className="mb-6 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 text-right">
                  ۲. انتخاب نوع تانکر و پمپ تخلیه چاه:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: '6000_suction', title: 'تانکر ۶۰۰۰ لیتری (پمپ مکنده)', price: '۲,۷۵۰,۰۰۰ الی ۴,۰۰۰,۰۰۰ تومان' },
                    { id: '8000_suction', title: 'تانکر ۸۰۰۰ لیتری (پمپ مکنده)', price: '۳,۵۰۰,۰۰۰ الی ۴,۵۰۰,۰۰۰ تومان' },
                    { id: '6000_sludge', title: 'تانکر ۶۰۰۰ لیتری (پمپ لجن‌کش)', price: '۳,۰۰۰,۰۰۰ الی ۴,۰۰۰,۰۰۰ تومان' },
                    { id: '8000_sludge', title: 'تانکر ۸۰۰۰ لیتری (پمپ لجن‌کش)', price: '۴,۰۰۰,۰۰۰ الی ۵,۰۰۰,۰۰۰ تومان' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSubType(item.id)}
                      className={`p-3 rounded-xl text-right transition-all cursor-pointer border ${
                        subType === item.id
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-slate-900 dark:text-white font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="block text-xs font-bold mb-0.5">{item.title}</span>
                      <span className="block text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                        {settings.forceCallForPrice ? (settings.callForPriceCustomText || 'برای استعلام قیمت تماس بگیرید') : toPersianDigits(item.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedService === 'well_digging' && (
              <div className="mb-6 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 text-right">
                  ۲. نوع چاه و روش حفاری مقنی:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'sewage', title: 'حفر چاه فاضلاب دستی', price: 'متری ۱,۰۰۰,۰۰۰ الی ۲,۰۰۰,۰۰۰ تومان' },
                    { id: 'water_manual', title: 'حفر چاه آب دستی', price: 'متری ۱,۵۰۰,۰۰۰ الی ۳,۰۰۰,۰۰۰ تومان' },
                    { id: 'water_machine', title: 'حفر چاه آب با دستگاه', price: 'متری ۱,۵۰۰,۰۰۰ الی ۲,۰۰۰,۰۰۰ تومان' },
                    { id: 'earth', title: 'حفر چاه ارت تخصصی', price: 'متری ۱,۹۵۰,۰۰۰ الی ۲,۸۰۰,۰۰۰ تومان' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSubType(item.id)}
                      className={`p-3 rounded-xl text-right transition-all cursor-pointer border ${
                        subType === item.id
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-slate-900 dark:text-white font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="block text-xs font-bold mb-0.5">{item.title}</span>
                      <span className="block text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                        {settings.forceCallForPrice ? (settings.callForPriceCustomText || 'برای استعلام قیمت تماس بگیرید') : toPersianDigits(item.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedService === 'isogam' && (
              <div className="mb-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    ۲. متراژ تقریبی پشت‌بام / استخر:
                  </label>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                    {toPersianDigits(areaSize)} متر مربع
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={areaSize}
                  onChange={e => setAreaSize(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>{toPersianDigits(20)} متر</span>
                  <span>{toPersianDigits(250)} متر</span>
                  <span>{toPersianDigits(500)} متر</span>
                </div>
              </div>
            )}

            {/* Step 3: Select Neighborhood in Saveh (Conditional - only shown if admin has defined locations) */}
            {neighborhoods.length > 0 && (
              <div className="mb-6 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 text-right">
                  ۳. منطقه یا محله در ساوه:
                </label>
                <select
                  value={selectedNeighborhood}
                  onChange={e => setSelectedNeighborhood(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                >
                  {neighborhoods.map((n, idx) => (
                    <option key={idx} value={n.name}>
                      {n.name} (اعزام فوری اکیپ سیار{n.priceMultiplier && n.priceMultiplier !== 1 ? ` - ضریب ${toPersianDigits(n.priceMultiplier)} برابر` : ''})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Urgency checkbox */}
            <div className="flex items-center gap-2 mb-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
              <input
                type="checkbox"
                id="urgent-check"
                checked={isUrgent}
                onChange={e => setIsUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
              />
              <label htmlFor="urgent-check" className="text-xs font-bold text-emerald-900 dark:text-emerald-300 cursor-pointer">
                اعزام فوق‌فوری سرویس‌کار (حضور فوری اکیپ سیار در محل در ساوه)
              </label>
            </div>

          </div>

          {/* Result & Instant Request Column (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#1e293b] border border-blue-300 dark:border-blue-700/60 p-6 sm:p-7 shadow-xl relative overflow-hidden">
            
            {/* Discount Badge (Only if enabled) */}
            {estimate.hasDiscount && (
              <div className="absolute top-0 left-0 bg-gradient-to-r from-blue-700 to-indigo-600 text-white text-[11px] font-black py-1.5 px-4 rounded-br-2xl shadow-sm">
                {toPersianDigits(settings.discountPercentage)}٪ تخفیف ثبت از سایت
              </div>
            )}

            <div className="pt-2 text-right">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                برآورد هزینه خدمت:
              </span>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight mb-4">
                {estimate.label}
              </h3>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/5 border border-blue-300/60 dark:border-blue-600/30 mb-5">
                {estimate.hasDiscount ? (
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 line-through">
                      تعرفه معمولی: {toPersianDigits(estimate.originalMin.toLocaleString())} تومان
                    </span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      با {toPersianDigits(settings.discountPercentage)}٪ تخفیف
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      تعرفه مصوب و منصفانه ساوه
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      ضمانت کتبی
                    </span>
                  </div>
                )}
                
                {settings.forceCallForPrice ? (
                  <div className="py-2 text-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">تعرفه و هزینه:</span>
                    <div className="inline-flex items-center gap-1.5 font-black text-base text-amber-600 dark:text-amber-400">
                      <Phone className="w-4 h-4 text-emerald-500 animate-pulse" />
                      <span>{settings.callForPriceCustomText || 'برای استعلام تماس بگیرید'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-left">
                    <span className="text-xs text-slate-600 dark:text-slate-300 ml-1">هزینه حدودی:</span>
                    <span className="font-mono text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                      {toPersianDigits(estimate.discountedMin.toLocaleString())}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">تومان</span>
                  </div>
                )}
                
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 text-right">
                  * قیمت قطعی پس از رویت دقیق و بررسی لوله توسط تکنسین در محل تایید می‌شود.
                </p>
              </div>

              {/* Instant Request Form or Success Message */}
              {!submitted ? (
                <form onSubmit={handleInstantSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      شماره تماس شما جهت هماهنگی و اعزام:
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder="۰۹۱۲..."
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      required
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-hidden text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      نام و نام خانوادگی: *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: آقای زمانی"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden text-right focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>ثبت و اعزام سرویس‌کار با این قیمت</span>
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-center animate-in fade-in">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 mb-1">
                    درخواست شما با موفقیت ثبت شد!
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mb-3">
                    تکنسین منطقه {selectedNeighborhood} به زودی با شماره شما تماس خواهد گرفت.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-blue-600 dark:text-blue-400 font-bold underline cursor-pointer"
                  >
                    ثبت استعلام مجدد
                  </button>
                </div>
              )}

              {/* Direct Call Alternative */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-2">
                  یا جهت اعزام فوری تلفنی هم‌اکنون تماس بگیرید:
                </span>
                <a
                  href={`tel:${settings.primaryPhone}`}
                  onClick={() => incrementCallCount(settings.primaryPhone)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-transform active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>تماس مستقیم: {formatPersianPhone(settings.primaryPhone)} (زمانی)</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
