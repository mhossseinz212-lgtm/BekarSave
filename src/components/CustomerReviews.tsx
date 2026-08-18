import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle, 
  MessageSquare, 
  MapPin, 
  Plus, 
  X, 
  Send,
  Sparkles,
  Award,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { ReviewItem } from '../types';
import { toPersianDigits } from '../utils';

export const CustomerReviews: React.FC = () => {
  const { reviews, addReview } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [service, setService] = useState('لوله بازکنی فوری');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  // Show only approved reviews to public visitors
  const approvedReviews = reviews.filter(r => r.approved);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert('لطفاً نام و نظر خود را وارد نمایید.');
      return;
    }

    addReview({
      author: name.trim(),
      location: location.trim() || 'ساوه',
      service,
      rating,
      comment: comment.trim(),
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error(err);
    }

    setName('');
    setLocation('');
    setComment('');
    setSubmittedNotice(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSubmittedNotice(false);
  };

  return (
    <section id="reviews" className="py-16 sm:py-20 bg-slate-50/50 dark:bg-[#0f172a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Stats */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-xs font-bold mb-2 border border-blue-200 dark:border-blue-800/60">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>نظرات و تجربیات همشهریان ساوه</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            نظرات مشتریان دفتر خدماتی بهکار
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            تجربه شهروندان محترم ساوه، شهرک‌های مسکونی و مدیران شهرک صنعتی کاوه
          </p>
        </div>

        {/* Reviews Grid or Empty State */}
        {approvedReviews.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {approvedReviews.map((rev: ReviewItem) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/70 shadow-xs flex flex-col justify-between text-right hover:border-blue-300 dark:hover:border-blue-600/40 transition-colors"
                >
                  <div>
                    {/* Review Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                          <CheckCircle className="w-3 h-3" />
                          <span>مشتری تایید شده</span>
                        </span>
                      )}
                    </div>

                    {/* Service Tag */}
                    <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-3">
                      خدمت: {rev.service}
                    </span>

                    {/* Comment */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-900 dark:text-slate-200">
                      {rev.author}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      <span>{rev.location}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Single Review Button at the Bottom */}
            <div className="text-center">
              <button
                onClick={() => {
                  setSubmittedNotice(false);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت نظر و تجربه شما</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/80 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">
              اولین نفری باشید که تجربه خود را ثبت می‌کند!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              از خدمات لوله بازکنی، تخلیه چاه، ایزوگام یا تعمیرات دفتر بهکار استفاده کرده‌اید؟ نظر و امتیاز شما پس از تایید مدیریت در این قسمت نمایش داده خواهد شد.
            </p>
            <button
              onClick={() => {
                setSubmittedNotice(false);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت نظر و امتیاز جدید</span>
            </button>
          </div>
        )}

      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1e293b] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700/80 shadow-2xl text-right">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                ثبت نظر و تجربه شما از دفتر خدماتی بهکار ساوه
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!submittedNotice ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام و نام خانوادگی: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: علی احمدی"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      محله یا منطقه در ساوه:
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: خیابان مطهری"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      نوع خدمت دریافتی:
                    </label>
                    <select
                      value={service}
                      onChange={e => setService(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="لوله بازکنی فوری">لوله بازکنی فوری</option>
                      <option value="تخلیه چاه با تانکر">تخلیه چاه با تانکر</option>
                      <option value="ایزوگام با ضمانت">ایزوگام با ضمانت</option>
                      <option value="حفر چاه نو">حفر چاه نو</option>
                      <option value="تعویض سنگ توالت">تعویض سنگ توالت</option>
                      <option value="لوله‌کشی فاضلاب">لوله‌کشی فاضلاب</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    میزان رضایت:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mr-2">
                      {toPersianDigits(rating)} ستاره
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    متن نظر و تجربه شما: *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="کیفیت کار، برخورد سرویس‌کار و سرعت عمل را بنویسید..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>ثبت نظر</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                  نظر شما با موفقیت ثبت شد!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  نظر ارزشمند شما پس از بررسی و تایید مدیریت دفتر بهکار در سایت نمایش داده خواهد شد. از همراهی و اعتماد شما سپاسگزاریم.
                </p>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  بستن
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
