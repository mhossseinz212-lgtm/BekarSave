import React, { useState } from 'react';
import { 
  Play, 
  Image as ImageIcon, 
  MapPin, 
  ShieldCheck, 
  Sliders, 
  Video, 
  X,
  Sparkles,
  CheckCircle,
  Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GalleryItem } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { formatPersianPhone } from '../utils';

export const GalleryAndVideos: React.FC = () => {
  const { gallery, settings, openBookingForService, incrementCallCount } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeVideoModal, setActiveVideoModal] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'همه نمونه‌کارها' },
    { id: 'لوله بازکنی', label: 'لوله بازکنی با ژنراتور' },
    { id: 'تخلیه چاه', label: 'تخلیه چاه با تانکر' },
    { id: 'ایزوگام', label: 'ایزوگام با ضمانت' },
    { id: 'تعویض سنگ توالت', label: 'تعویض سنگ توالت' },
    { id: 'حفر چاه', label: 'حفر چاه نو' },
  ];

  const filteredGallery = activeCategory === 'all'
    ? gallery
    : gallery.filter(item => item.category.includes(activeCategory) || item.title.includes(activeCategory));

  const regularGallery = filteredGallery.filter(item => item.type !== 'before-after');

  return (
    <section id="gallery" className="py-16 sm:py-20 bg-white dark:bg-[#0f172a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800/60">
            <Video className="w-3.5 h-3.5" />
            <span>گالری تصاویر واقعی و ویدئوهای اجرایی در ساوه</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            نمونه پروژه‌های انجام شده دفتر خدماتی بهکار
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            مشاهده کیفیت کار، تجهیزات پیشرفته و رعایت کامل تمیزی و استانداردهای فنی در پروژه‌های مختلف شهر ساوه و حومه.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Interactive Before & After Slider Component */}
        <div className="mb-14">
          <BeforeAfterSlider onBookService={openBookingForService} />
        </div>

        {/* Gallery Cards Grid (Images and Videos) */}
        {regularGallery.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700/80 my-4">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              در حال حاضر هیچ نمونه‌کاری در این دسته ثبت نشده است.
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              از پنل مدیریت می‌توانید عکس یا ویدیوی نمونه‌کار جدید اضافه نمایید.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularGallery.map((item: GalleryItem) => (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/60 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500/40"
            >
              <div>
                {/* Media preview */}
                <div className="relative h-52 bg-slate-900 overflow-hidden">
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

                  {/* Video Play Button if video */}
                  {item.type === 'video' && (
                    <button
                      onClick={() => setActiveVideoModal(item)}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer group-hover:bg-blue-500 z-10"
                      aria-label="پخش ویدیو"
                    >
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </button>
                  )}

                  {/* Location Pin (پایین سمت راست) */}
                  <div className="absolute bottom-3 right-3 text-right z-10 pointer-events-none">
                    <span className="text-xs text-blue-300 font-bold flex items-center gap-1 drop-shadow-md">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>{item.location || 'ساوه'}</span>
                    </span>
                  </div>

                  {/* Type / Category Badge with Sticker icon (پایین سمت چپ - استیکر پشت متن) */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-700/80 flex items-center gap-1.5 z-10 shadow-md">
                    <span>{item.category}</span>
                    {item.type === 'video' ? <Video className="w-3 h-3 text-blue-400" /> : <Sparkles className="w-3 h-3 text-emerald-400" />}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 text-right">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      {item.description}
                    </p>
                  )}

                  {/* Highlights / Green Checkmarks */}
                  {item.highlights && item.highlights.length > 0 && (
                    <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                      {item.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="leading-tight">{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card bottom action */}
              <div className="p-5 pt-0 border-t border-slate-200/50 dark:border-slate-700/50 mt-2">
                <button
                  onClick={() => openBookingForService(item.category)}
                  className="w-full py-2 rounded-xl bg-slate-200 hover:bg-blue-600 hover:text-white dark:bg-slate-700/70 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  استعلام این نوع پروژه در ساوه
                </button>
              </div>
            </div>
          ))}
        </div>
        )}

      </div>

      {/* Video Simulation Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-slate-800 text-white">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm truncate max-w-md">{activeVideoModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Simulation Container */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeVideoModal.mediaUrl}
                alt={activeVideoModal.title}
                className="w-full h-full object-cover opacity-60"
              />
              
              {/* Simulated Video Player UI */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                <div className="flex justify-between items-center text-xs bg-black/40 backdrop-blur-xs p-2 rounded-lg">
                  <span className="font-bold text-blue-400">عملیات واقعی در {activeVideoModal.location}</span>
                  <span className="text-emerald-400 font-mono">1080p Full HD</span>
                </div>

                <div className="text-center my-auto">
                  <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center mx-auto mb-3 shadow-lg animate-pulse">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                  <p className="text-xs font-bold text-slate-200">
                    ویدئو شبیه‌سازی تجهیزات پیشرفته دفتر بهکار ساوه
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-2/3"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>01:45</span>
                    <span>02:30</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-900 text-right flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs text-slate-300">
                {activeVideoModal.description}
              </p>
              <a
                href={`tel:${settings.primaryPhone}`}
                onClick={() => incrementCallCount(settings.primaryPhone)}
                className="shrink-0 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>تماس با آقای زمانی ({formatPersianPhone(settings.primaryPhone)})</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
