import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Award, 
  Wrench,
  ThumbsUp,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WhyChooseUs: React.FC = () => {
  const { settings } = useApp();

  const reasons = [
    {
      icon: Clock,
      title: 'اعزام فوری سرویس‌کار',
      desc: 'استقرار اکیپ‌های سیار در سراسر ساوه جهت حضور فوری در هر ساعت از شبانه‌روز',
      color: 'amber'
    },
    {
      icon: DollarSign,
      title: 'کمترین قیمت در ساوه',
      desc: 'محاسبه دقیق دستمزد طبق تعرفه مصوب اتحادیه بدون هزینه‌های اضافی و بدون واسطه',
      color: 'emerald'
    },
    {
      icon: ShieldCheck,
      title: 'ضمانت کتبی و فاکتور رسمی',
      desc: settings.generalGuaranteeText || 'ارائه فاکتور رسمی و ضمانت کتبی باز شدن کامل لوله و تضمین کیفیت کار',
      color: 'blue'
    },
    {
      icon: Sparkles,
      title: 'بدون کثیف‌کاری و بدون خرابی',
      desc: 'استفاده از فنرهای مجزا، تمیز و فنرهای مخصوص توالت و آشپزخانه با رعایت بهداشت کامل',
      color: 'purple'
    },
    {
      icon: UserCheck,
      title: 'کادر مجرب و قابل اعتماد',
      desc: 'سرویس‌کاران باتجربه، وقت‌شناس و مورد اعتماد همشهریان محترم ساوه',
      color: 'rose'
    },
    {
      icon: Award,
      title: 'مجهز به مدرن‌ترین دستگاه‌ها',
      desc: 'ژنراتورهای برقی پرقدرت، تانکرهای ساکشن وکیوم و دستگاه‌های نشت‌یاب پیشرفته',
      color: 'amber'
    }
  ];

  return (
    <section id="why-us" className="py-16 sm:py-20 bg-white dark:bg-[#0f172a] transition-colors border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800/60">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>چرا لوله بازکنی در ساوه و خدمات فنی در ساوه را به بهکار بسپاریم؟</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            {settings.whyUsHeadline || `مزایای لوله بازکنی در ساوه و خدمات فنی در ساوه با مدیریت ${settings.managerName}`}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            {settings.whyUsSubheadline || 'بیش از ۱۵ سال سابقه درخشان در ارائه لوله بازکنی در ساوه و کلیه خدمات فنی در ساوه'}
          </p>
        </div>

        {/* Custom Image Banner if set by Admin */}
        {(settings.whyUsImageUrl || settings.aboutImageUrl) && (
          <div className="mb-10 max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md h-64 sm:h-80 relative">
            <img 
              src={settings.whyUsImageUrl || settings.aboutImageUrl} 
              alt="دفتر خدماتی بهکار ساوه"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
              <span className="text-white font-bold text-sm sm:text-base">
                {settings.businessName} - مدیریت {settings.managerName}
              </span>
            </div>
          </div>
        )}

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/60 hover:border-blue-400 dark:hover:border-blue-500/60 transition-all text-right group hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
