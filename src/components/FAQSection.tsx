import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Phone, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { initialFaqs } from '../data/initialData';
import { formatPersianPhone } from '../utils';

export const FAQSection: React.FC = () => {
  const { settings, incrementCallCount } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white dark:bg-[#0f172a] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800/60">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>پاسخ به ابهامات و پرسش‌های شما</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            سوالات متداول شهروندان ساوه
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            پاسخ به سوالات پرتکرار در مورد خدمات لوله بازکنی، تخلیه چاه، ایزوگام و قیمت‌ها در ساوه
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3.5">
          {initialFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/70 overflow-hidden transition-all text-right"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-10 p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 text-right sm:text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-blue-950 dark:text-blue-200">
              سوال دیگری دارید یا نیاز به راهنمایی فوری دارید؟
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-300 mt-0.5">
              مدیریت دفتر بهکار (آقای زمانی) به صورت ۲۴ ساعته پاسخگوی تماس شماست.
            </p>
          </div>
          <a
            href={`tel:${settings.primaryPhone}`}
            onClick={() => incrementCallCount(settings.primaryPhone)}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs"
          >
            <Phone className="w-4 h-4 animate-call-ring" />
            <span>تماس و مشاوره رایگان: {formatPersianPhone(settings.primaryPhone)}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
