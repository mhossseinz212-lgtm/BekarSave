import React, { useState, useEffect } from 'react';
import { X, Send, Phone, CheckCircle2, Clock, MapPin, Sparkles, Tag, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { formatPersianPhone, toPersianDigits } from '../utils';
import { DiscountCoupon } from '../types';

export const QuickBookingModal: React.FC = () => {
  const { 
    isBookingModalOpen, 
    setIsBookingModalOpen, 
    selectedServiceForBooking, 
    settings, 
    addBooking,
    neighborhoods,
    incrementCallCount,
    trackRubikaClick,
    validateAndApplyCoupon,
    incrementCouponUsage
  } = useApp();

  const defaultNeighborhood = neighborhoods.length > 0 ? neighborhoods[0].name : 'مرکز شهر ساوه';
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [serviceType, setServiceType] = useState('لوله بازکنی فوری');
  const [neighborhood, setNeighborhood] = useState(defaultNeighborhood);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [isUrgent, setIsUrgent] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCoupon | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyCoupon = () => {
    const res = validateAndApplyCoupon(couponInput);
    if (res.valid && res.coupon) {
      setAppliedCoupon(res.coupon);
      setCouponMessage({ text: res.message, isError: false });
    } else {
      setAppliedCoupon(null);
      setCouponMessage({ text: res.message, isError: true });
    }
  };

  useEffect(() => {
    if (selectedServiceForBooking) {
      setServiceType(selectedServiceForBooking);
    }
  }, [selectedServiceForBooking]);

  useEffect(() => {
    if (neighborhoods.length > 0 && !neighborhood) {
      setNeighborhood(neighborhoods[0].name);
    }
  }, [neighborhoods]);

  if (!isBookingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digitsOnly = phoneNumber
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
        serviceType,
        neighborhood: neighborhood || 'ساوه',
        address: 'ورود مدیریت',
        description: '',
        isUrgent: false,
      });
      setPhoneNumber('');
      setFullName('');
      return;
    }

    if (!phoneNumber.trim()) {
      alert('لطفاً شماره تماس را وارد فرمایید.');
      return;
    }
    if (!fullName.trim()) {
      alert('لطفاً نام و نام خانوادگی خود را وارد نمایید.');
      return;
    }

    const finalDesc = appliedCoupon 
      ? `${description.trim() ? description.trim() + ' | ' : ''}[کد تخفیف: ${appliedCoupon.code} - ${appliedCoupon.discountType === 'percentage' ? toPersianDigits(appliedCoupon.discountValue) + '٪' : toPersianDigits(appliedCoupon.discountValue.toLocaleString()) + ' تومان'}]`
      : description.trim();

    addBooking({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      serviceType,
      neighborhood: neighborhood || 'کل ساوه و حومه',
      address: address.trim() || `منطقه ${neighborhood || 'ساوه'}`,
      description: finalDesc,
      isUrgent,
    });

    if (appliedCoupon) {
      incrementCouponUsage(appliedCoupon.code);
    }

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error(err);
    }

    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setIsSubmitted(false);
    setFullName('');
    setPhoneNumber('');
    setAddress('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1e293b] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700/80 shadow-2xl text-right overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 left-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-xs font-bold mb-2 border border-blue-200 dark:border-blue-800/60">
                <Clock className="w-3.5 h-3.5" />
                <span>اعزام فوری سرویس‌کار به سراسر ساوه</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                ثبت درخواست خدمات تاسیساتی بهکار
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                اطلاعات خود را وارد کنید، نزدیک‌ترین سرویس‌کار منطقه سریعاً با شما تماس خواهد گرفت.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  شماره موبایل جهت تماس و هماهنگی: *
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  required
                  placeholder="۰۹۱۲..."
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm outline-hidden focus:ring-2 focus:ring-blue-500 text-center"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام و نام خانوادگی: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: آقای زمانی"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نوع خدمت:
                  </label>
                  <select
                    value={serviceType}
                    onChange={e => setServiceType(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="لوله بازکنی فوری">لوله بازکنی فوری</option>
                    <option value="تخلیه چاه مکانیزه">تخلیه چاه مکانیزه</option>
                    <option value="حفر چاه نو">حفر چاه نو</option>
                    <option value="ایزوگام با تضمین">ایزوگام با تضمین</option>
                    <option value="تعویض سنگ توالت">تعویض سنگ توالت</option>
                    <option value="لوله‌کشی فاضلاب">لوله‌کشی فاضلاب</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  منطقه یا محله در ساوه:
                </label>
                <select
                  value={neighborhood}
                  onChange={e => setNeighborhood(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {neighborhoods.length > 0 ? (
                    neighborhoods.map((n, idx) => (
                      <option key={idx} value={n.name}>{n.name}</option>
                    ))
                  ) : (
                    <>
                      <option value="کل شهر ساوه و حومه">کل شهر ساوه و حومه</option>
                      <option value="شهرک صنعتی کاوه">شهرک صنعتی کاوه</option>
                      <option value="شهرک فجر ساوه">شهرک فجر ساوه</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  آدرس دقیق (خیابان، کوچه، پلاک):
                </label>
                <input
                  type="text"
                  placeholder="مثال: خیابان شریعتی، کوچه بهار، پلاک ۱۰"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  توضیحات تکمیلی مشکل (اختیاری):
                </label>
                <textarea
                  rows={2}
                  placeholder="مثلاً: گرفتگی توالت ایرانی با افتادن شیء..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                <input
                  type="checkbox"
                  id="modal-urgent"
                  checked={isUrgent}
                  onChange={e => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                />
                <label htmlFor="modal-urgent" className="text-xs font-bold text-emerald-900 dark:text-emerald-300 cursor-pointer">
                  اعزام فوری (حضور کمتر از ۱۵ دقیقه در محل)
                </label>
              </div>

              {/* Coupon Code Input */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>کد تخفیف داری؟ (اختیاری):</span>
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                  <input
                    type="text"
                    placeholder="کد تخفیف را وارد کنید..."
                    value={couponInput}
                    onChange={e => {
                      setCouponInput(e.target.value);
                      if (couponMessage) setCouponMessage(null);
                    }}
                    className="w-full sm:flex-1 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs uppercase font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer shrink-0 flex items-center justify-center"
                  >
                    اعمال کد
                  </button>
                </div>

                {couponMessage && (
                  <p className={`text-[11px] font-bold flex items-center gap-1 ${couponMessage.isError ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {!couponMessage.isError && <Check className="w-3.5 h-3.5" />}
                    <span>{couponMessage.text}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-md shadow-blue-500/20 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>ثبت نهایی و اعزام سرویس‌کار</span>
              </button>
            </form>

            {/* Direct Call & Rubika Quick Links */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-2">
                یا اگر کارتان بسیار فوری است، مستقیماً تماس بگیرید یا در روبیکا پیام دهید:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <a
                  href={`tel:${settings.primaryPhone}`}
                  onClick={() => incrementCallCount(settings.primaryPhone)}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>تماس: {formatPersianPhone(settings.primaryPhone)}</span>
                </a>
                <a
                  href={settings.rubikaUrl || 'https://rubika.ir/Jshhshvsh'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackRubikaClick}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-900/80 text-purple-200 font-bold text-xs border border-purple-500/40 shadow-xs"
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
        ) : (
          <div className="text-center py-6 animate-in fade-in">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              درخواست شما با موفقیت ثبت شد!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              سرویس‌کار دفتر بهکار در منطقه <strong className="text-blue-600 dark:text-blue-400">{neighborhood}</strong> در اسرع وقت (حداکثر تا {toPersianDigits(5)} دقیقه) با شماره شما ({formatPersianPhone(phoneNumber)}) تماس گرفته و جهت انجام کار در محل حضور می‌یابد.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all cursor-pointer shadow-md shadow-blue-500/20"
            >
              متشکرم، بستن پنجره
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
