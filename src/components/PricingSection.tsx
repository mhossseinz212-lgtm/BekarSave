import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Phone, 
  Calculator, 
  CheckCircle2, 
  Send, 
  MapPin,
  Sparkles,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { toPersianDigits, formatPersianPhone } from '../utils';

export const PricingSection: React.FC = () => {
  const { 
    settings, 
    tariffs, 
    incrementCallCount, 
    addBooking,
    neighborhoods
  } = useApp();

  // Estimator Form State
  const defaultNeighborhood = neighborhoods.length > 0 ? neighborhoods[0].name : 'مرکز شهر ساوه';
  const [selectedService, setSelectedService] = useState('pipe');
  const [subType, setSubType] = useState('f15');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(defaultNeighborhood);
  const [areaSize, setAreaSize] = useState<number>(50); // for isogam
  const [plumbingLength, setPlumbingLength] = useState<number>(10); // for plumbing meters
  const [wellDepth, setWellDepth] = useState<number>(10); // for well digging meters
  const [isUrgent, setIsUrgent] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (neighborhoods.length > 0 && !selectedNeighborhood) {
      setSelectedNeighborhood(neighborhoods[0].name);
    }
  }, [neighborhoods]);

  // Helper to extract min and max numbers from priceRange string in tariffs
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

  // Calculation Logic: Base Price multiplied by Zone Multiplier
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
      let unitMin = 1000000;
      let unitMax = 2000000;
      switch (subType) {
        case 'water_manual': {
          const t = parseTariffPrice('tar-d1', 1500000, 3000000);
          unitMin = t.min;
          unitMax = t.max;
          label = `حفر چاه آب دستی توسط مقنی (${toPersianDigits(wellDepth)} متر)`;
          break;
        }
        case 'water_machine': {
          const t = parseTariffPrice('tar-d2', 1500000, 2000000);
          unitMin = t.min;
          unitMax = t.max;
          label = `حفر چاه آب با دستگاه (${toPersianDigits(wellDepth)} متر)`;
          break;
        }
        case 'sewage': {
          const t = parseTariffPrice('tar-d3', 1000000, 2000000);
          unitMin = t.min;
          unitMax = t.max;
          label = `حفر چاه فاضلاب جذبی (${toPersianDigits(wellDepth)} متر)`;
          break;
        }
        case 'earth': {
          const t = parseTariffPrice('tar-d4', 1950000, 2800000);
          unitMin = t.min;
          unitMax = t.max;
          label = `حفر چاه ارت تخصصی (${toPersianDigits(wellDepth)} متر)`;
          break;
        }
        default: {
          const t = parseTariffPrice('tar-d3', 1000000, 2000000);
          unitMin = t.min;
          unitMax = t.max;
          label = `حفر چاه فاضلاب جذبی (${toPersianDigits(wellDepth)} متر)`;
        }
      }
      baseMin = unitMin * wellDepth;
      baseMax = unitMax * wellDepth;
    } else if (selectedService === 'isogam') {
      let unitMin = 300000;
      let unitMax = 500000;
      switch (subType) {
        case 'iso_full': {
          const t = parseTariffPrice('tar-i1', 300000, 500000);
          unitMin = t.min;
          unitMax = t.max;
          label = `ایزوگام با نصب کامل برای ${toPersianDigits(areaSize)} متر مربع`;
          break;
        }
        case 'iso_raw': {
          const t = parseTariffPrice('tar-i2', 220000, 450000);
          unitMin = t.min;
          unitMax = t.max;
          label = `خرید ایزوگام خام برای ${toPersianDigits(areaSize)} متر مربع`;
          break;
        }
        case 'iso_roof': {
          const t = parseTariffPrice('tar-i3', 110000, 170000);
          unitMin = t.min;
          unitMax = t.max;
          label = `اجرت نصب ایزوگام پشت‌بام برای ${toPersianDigits(areaSize)} متر مربع`;
          break;
        }
        case 'iso_bath': {
          const t = parseTariffPrice('tar-i4', 150000, 200000);
          unitMin = t.min;
          unitMax = t.max;
          label = `اجرت نصب ایزوگام سرویس و حمام برای ${toPersianDigits(areaSize)} متر مربع`;
          break;
        }
        case 'iso_wall': {
          const t = parseTariffPrice('tar-i5', 200000, 300000);
          unitMin = t.min;
          unitMax = t.max;
          label = `اجرت نصب ایزوگام دیوار جانبی برای ${toPersianDigits(areaSize)} متر مربع`;
          break;
        }
        default: {
          const t = parseTariffPrice('tar-i1', 300000, 500000);
          unitMin = t.min;
          unitMax = t.max;
          label = `ایزوگام با نصب کامل برای ${toPersianDigits(areaSize)} متر مربع`;
        }
      }
      baseMin = unitMin * areaSize;
      baseMax = unitMax * areaSize;
    } else if (selectedService === 'toilet_stone') {
      switch (subType) {
        case 'toilet_full': {
          const t = parseTariffPrice('tar-s1', 2500000, 4500000);
          baseMin = t.min;
          baseMax = t.max;
          label = 'تعویض کامل سنگ توالت (پروژه‌ای با تخریب، لوله‌کشی و عایق)';
          break;
        }
        case 'toilet_convert': {
          const t = parseTariffPrice('tar-s2', 2000000, 3500000);
          baseMin = t.min;
          baseMax = t.max;
          label = 'تبدیل توالت ایرانی به فرنگی تخصصی';
          break;
        }
        default: {
          const t = parseTariffPrice('tar-s1', 2500000, 4500000);
          baseMin = t.min;
          baseMax = t.max;
          label = 'تعویض کامل سنگ توالت پروژه‌ای';
        }
      }
    } else if (selectedService === 'plumbing') {
      switch (subType) {
        case 'pvc': {
          const t = parseTariffPrice('tar-l1', 100000, 200000);
          baseMin = t.min * plumbingLength;
          baseMax = t.max * plumbingLength;
          label = `لوله‌کشی با لوله پلیکا (PVC) به طول ${toPersianDigits(plumbingLength)} متر`;
          break;
        }
        case 'pushfit': {
          const t = parseTariffPrice('tar-l2', 150000, 230000);
          baseMin = t.min * plumbingLength;
          baseMax = t.max * plumbingLength;
          label = `لوله‌کشی پوشفیت (تا سایز ۱۱۰) به طول ${toPersianDigits(plumbingLength)} متر`;
          break;
        }
        case 'polyethylene': {
          const t = parseTariffPrice('tar-l3', 180000, 300000);
          baseMin = t.min * plumbingLength;
          baseMax = t.max * plumbingLength;
          label = `لوله‌کشی پلی‌اتیلن با شاسی‌کشی به طول ${toPersianDigits(plumbingLength)} متر`;
          break;
        }
        case 'under_ceiling': {
          const t = parseTariffPrice('tar-l4', 2000000, 3500000);
          baseMin = t.min;
          baseMax = t.max;
          label = 'لوله‌کشی خرده‌کاری زیرسقفی پروژه‌ای';
          break;
        }
        case 'under_4_units': {
          const t = parseTariffPrice('tar-l5', 6000000, 9000000);
          baseMin = t.min;
          baseMax = t.max;
          label = 'لوله‌کشی فاضلاب ساختمانی زیر ۴ واحد (هر واحد)';
          break;
        }
        default: {
          const t = parseTariffPrice('tar-l1', 100000, 200000);
          baseMin = t.min * plumbingLength;
          baseMax = t.max * plumbingLength;
          label = `لوله‌کشی با لوله پلیکا به طول ${toPersianDigits(plumbingLength)} متر`;
        }
      }
    }

    const rawBaseMin = baseMin;
    const rawBaseMax = baseMax;

    // Apply Neighborhood multiplier (e.g. if multiplier is 5, base is multiplied by 5)
    const activeZone = neighborhoods.find(n => n.name === selectedNeighborhood);
    const multiplier = (activeZone && activeZone.priceMultiplier && Number(activeZone.priceMultiplier) > 0) 
      ? Number(activeZone.priceMultiplier) 
      : 1;

    const multipliedMin = Math.round(rawBaseMin * multiplier);
    const multipliedMax = Math.round(rawBaseMax * multiplier);

    const hasDiscount = Boolean(settings.showDiscount && settings.discountPercentage > 0);
    const discountRate = hasDiscount ? (100 - settings.discountPercentage) / 100 : 1;
    const discountedMin = Math.round((multipliedMin * discountRate) / 1000) * 1000;
    const discountedMax = Math.round((multipliedMax * discountRate) / 1000) * 1000;

    return {
      rawBaseMin,
      rawBaseMax,
      multipliedMin,
      multipliedMax,
      discountedMin,
      discountedMax,
      hasDiscount,
      multiplier,
      zoneName: activeZone?.name || selectedNeighborhood,
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
      address: `استعلام آنلاین از منطقه ${selectedNeighborhood || 'ساوه'}`,
      description: `تخمین محاسبه شده: ${toPersianDigits(estimate.discountedMin.toLocaleString())} تا ${toPersianDigits(estimate.discountedMax.toLocaleString())} تومان (ضریب منطقه: ${toPersianDigits(estimate.multiplier)})`,
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
    <section id="pricing" className="py-16 sm:py-20 bg-slate-50 dark:bg-[#0f172a] transition-colors border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800/60">
            <Calculator className="w-3.5 h-3.5" />
            <span>محاسبه تعرفه لوله بازکنی در ساوه و خدمات فنی در ساوه</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            {settings.estimatorHeadline || 'استعلام هزینه لوله بازکنی در ساوه و خدمات فنی در ساوه'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {settings.estimatorSubheadline || 'محاسبه شفاف و دقیق قیمت لوله بازکنی در ساوه، تخلیه چاه، حفر چاه و کلیه خدمات فنی در ساوه بر اساس منطقه'}
          </p>
        </div>

        {/* ONLINE ESTIMATOR CALCULATOR */}
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
                      if (srv.id === 'isogam') setSubType('iso_full');
                      if (srv.id === 'toilet_stone') setSubType('toilet_full');
                      if (srv.id === 'plumbing') setSubType('pvc');
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
                    { id: 'f15', title: 'فنر استاندارد (تا ۱۵ متر)' },
                    { id: 'f25', title: 'فنر بلند (۱۵ تا ۲۵ متر)' },
                    { id: 'f_long', title: 'فنر متراژ بلند (بیش از ۲۵ متر)' },
                    { id: 'generator_heavy', title: 'فنر ضخیم با ژنراتور قوی' },
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSubType(st.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-right transition-all cursor-pointer ${
                        subType === st.id
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-800 dark:text-blue-200'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {st.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedService === 'tanker' && (
              <div className="mb-6 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 text-right">
                  ۲. نوع تانکر و پمپ مورد نیاز:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: '6000_suction', title: 'تانکر ۶۰۰۰ لیتری (مکنده)' },
                    { id: '8000_suction', title: 'تانکر ۸۰۰۰ لیتری (مکنده)' },
                    { id: '6000_sludge', title: 'تانکر ۶۰۰۰ لیتری (لجن‌کش)' },
                    { id: '8000_sludge', title: 'تانکر ۸۰۰۰ لیتری (لجن‌کش)' },
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSubType(st.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-right transition-all cursor-pointer ${
                        subType === st.id
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-800 dark:text-blue-200'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {st.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedService === 'isogam' && (
              <div className="mb-6 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 text-right">
                  ۲. نوع خدمت ایزوگام:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {[
                    { id: 'iso_full', title: 'ایزوگام با نصب کامل (رول + اجرت)' },
                    { id: 'iso_raw', title: 'خرید ایزوگام خام (رول)' },
                    { id: 'iso_roof', title: 'اجرت نصب پشت‌بام (بدون مصالح)' },
                    { id: 'iso_bath', title: 'اجرت نصب سرویس و حمام' },
                    { id: 'iso_wall', title: 'اجرت نصب دیوار جانبی مرتفع' },
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSubType(st.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-right transition-all cursor-pointer ${
                        subType === st.id
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-800 dark:text-blue-200'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {st.title}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 text-right">
                    متراژ سطح (متر مربع):
                  </label>
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">
                    {toPersianDigits(areaSize)} متر مربع
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={areaSize}
                  onChange={e => setAreaSize(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>۱۰ متر</span>
                  <span>۲۵۰ متر</span>
                  <span>۵۰۰ متر</span>
                </div>
              </div>
            )}

            {selectedService === 'toilet_stone' && (
              <div className="mb-6 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 text-right">
                  ۲. نوع عملیات تعویض توالت:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'toilet_full', title: 'تعویض کامل سنگ توالت (پروژه‌ای)' },
                    { id: 'toilet_convert', title: 'تبدیل توالت ایرانی به فرنگی' },
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSubType(st.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-right transition-all cursor-pointer ${
                        subType === st.id
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-800 dark:text-blue-200'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {st.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedService === 'plumbing' && (
              <div className="mb-6 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 text-right">
                  ۲. نوع سیستم لوله‌کشی فاضلاب:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {[
                    { id: 'pvc', title: 'لوله‌کشی با لوله پلیکا (PVC)' },
                    { id: 'pushfit', title: 'لوله‌کشی پوشفیت (تا سایز ۱۱۰)' },
                    { id: 'polyethylene', title: 'لوله‌کشی پلی‌اتیلن (با شاسی)' },
                    { id: 'under_ceiling', title: 'خرده‌کاری زیرسقفی (پروژه‌ای)' },
                    { id: 'under_4_units', title: 'لوله‌کشی زیر ۴ واحد (هر واحد)' },
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSubType(st.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-right transition-all cursor-pointer ${
                        subType === st.id
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-800 dark:text-blue-200'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {st.title}
                    </button>
                  ))}
                </div>
                {['pvc', 'pushfit', 'polyethylene'].includes(subType) && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 text-right">
                        متراژ متراژ لوله‌کشی (متر طول):
                      </label>
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">
                        {toPersianDigits(plumbingLength)} متر
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      value={plumbingLength}
                      onChange={e => setPlumbingLength(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>۱ متر</span>
                      <span>۵۰ متر</span>
                      <span>۱۰۰ متر</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedService === 'well_digging' && (
              <div className="mb-6 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 text-right">
                  ۲. نوع چاه و روش حفاری:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {[
                    { id: 'sewage', title: 'حفر چاه فاضلاب جذبی' },
                    { id: 'water_manual', title: 'حفر چاه آب دستی' },
                    { id: 'water_machine', title: 'حفر چاه آب با دستگاه' },
                    { id: 'earth', title: 'حفر چاه ارت تخصصی' },
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSubType(st.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-right transition-all cursor-pointer ${
                        subType === st.id
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-800 dark:text-blue-200'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {st.title}
                    </button>
                  ))}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 text-right">
                      عمق یا متراژ حفاری (متر):
                    </label>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">
                      {toPersianDigits(wellDepth)} متر
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={wellDepth}
                    onChange={e => setWellDepth(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>۱ متر</span>
                    <span>۲۵ متر</span>
                    <span>۵۰ متر</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location in Saveh (Conditional - only shown if admin has defined neighborhoods) */}
            {neighborhoods.length > 0 && (
              <div className="mb-6 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 text-right">
                  ۳. انتخاب منطقه یا محله در ساوه:
                </label>
                <select
                  value={selectedNeighborhood}
                  onChange={e => setSelectedNeighborhood(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {neighborhoods.map(n => (
                    <option key={n.id} value={n.name}>
                      {n.name} (اعزام فوری اکیپ سیار{n.priceMultiplier && n.priceMultiplier !== 1 ? ` - ضریب ${toPersianDigits(n.priceMultiplier)} برابر` : ''})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Step 4: Urgency Mode */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={e => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 rounded-md text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  اعزام فوری و شبانه‌روزی با تجهیزات کامل
                </span>
              </label>
            </div>

          </div>

          {/* Price Estimation Card & Direct Submit Form (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            <div className="rounded-3xl bg-white dark:bg-[#1e293b] border-2 border-blue-500/30 p-6 shadow-xl text-right relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500"></div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>نتیجه استعلام قیمت و ثبت فوری</span>
                </span>
                {estimate.hasDiscount && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-black border border-emerald-300 dark:border-emerald-800">
                    {toPersianDigits(settings.discountPercentage)}٪ تخفیف اعمال شد
                  </span>
                )}
              </div>

              {/* Service Label Tag */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mb-4 text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                {estimate.label}
              </div>

              {/* Multiplier / Calculation Breakdown Info */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 mb-4">
                {settings.forceCallForPrice ? (
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold">
                    <span>وضعیت تعرفه:</span>
                    <span className="text-amber-600 dark:text-amber-400">استعلام تلفنی مستقیم (پایین‌ترین نرخ ساوه)</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>تعرفه پایه مصوب:</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {toPersianDigits(estimate.rawBaseMin.toLocaleString())} تا {toPersianDigits(estimate.rawBaseMax.toLocaleString())} تومان
                    </span>
                  </div>
                )}
                {estimate.multiplier !== 1 && !settings.forceCallForPrice && (
                  <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 font-bold">
                    <span>ضریب منطقه ({estimate.zoneName}):</span>
                    <span className="font-mono bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">
                      {toPersianDigits(estimate.multiplier)} برابر (محاسبه شد)
                    </span>
                  </div>
                )}
              </div>

              {/* Final Calculated Price Display */}
              <div className="text-center py-3.5 bg-blue-50/70 dark:bg-blue-950/50 rounded-2xl border border-blue-200 dark:border-blue-800/60 mb-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                  {settings.forceCallForPrice ? 'هزینه و تعرفه مصوب:' : 'مبلغ نهایی برآورد شده (تومان):'}
                </span>
                {settings.forceCallForPrice ? (
                  <div className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5 animate-pulse text-emerald-500" />
                    <span>{settings.callForPriceCustomText || 'برای استعلام تماس بگیرید'}</span>
                  </div>
                ) : (
                  <div className="text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-400 font-mono tracking-tight">
                    {toPersianDigits(estimate.discountedMin.toLocaleString())} الی {toPersianDigits(estimate.discountedMax.toLocaleString())}
                  </div>
                )}
              </div>

              {/* Direct Instant Booking Form */}
              {!submitted ? (
                <form onSubmit={handleInstantSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      نام و نام خانوادگی: *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: آقای زمانی"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      شماره تماس شما جهت اعزام: *
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="0912..."
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>ثبت فوری درخواست با این قیمت</span>
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center animate-in zoom-in-95">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h5 className="font-bold text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 mb-1">
                    درخواست شما با موفقیت ثبت گردید!
                  </h5>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    کارشناسان دفتر بهکار در کمتر از ۵ دقیقه جهت هماهنگی و اعزام با شما تماس خواهند گرفت.
                  </p>
                </div>
              )}

              {/* Direct Call Option */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">تماس مستقیم فوری:</span>
                <a
                  href={`tel:${settings.primaryPhone}`}
                  onClick={() => incrementCallCount(settings.primaryPhone)}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{formatPersianPhone(settings.primaryPhone)}</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
