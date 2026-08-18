import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Sliders, 
  Sparkles, 
  CheckCircle, 
  ArrowLeftRight,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BeforeAfterItem {
  id: string;
  title: string;
  category: string;
  location?: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  sliderHint?: string;
  description: string;
  highlights: string[];
}

interface BeforeAfterSliderProps {
  onBookService?: (serviceName: string) => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ onBookService }) => {
  const { gallery } = useApp();
  const [activeProjectIdx, setActiveProjectIdx] = useState<number>(0);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(Math.round(percentage));
  }, []);

  const projectsList: BeforeAfterItem[] = (gallery || [])
    .filter(g => g.type === 'before-after' && (g.beforeUrl || g.afterUrl || g.mediaUrl))
    .map(g => ({
      id: g.id,
      title: g.title,
      category: g.category || 'نمونه‌کار قبل و بعد',
      location: g.location || 'ساوه',
      beforeImage: g.beforeUrl || g.mediaUrl,
      afterImage: g.afterUrl || g.mediaUrl,
      beforeLabel: g.beforeLabel || 'وضعیت قبل از انجام کار',
      afterLabel: g.afterLabel || 'وضعیت بعد از اتمام کار',
      sliderHint: g.sliderHint || '👈 دکمه وسط را به چپ و راست بکشید تا تغییر کیفیت را ببینید 👉',
      description: g.description || 'پروژه انجام شده با تجهیزات پیشرفته در ساوه',
      highlights: (g.highlights && g.highlights.length > 0) ? g.highlights : []
    }));

  useEffect(() => {
    if (activeProjectIdx >= projectsList.length && projectsList.length > 0) {
      setActiveProjectIdx(0);
    }
  }, [projectsList.length, activeProjectIdx]);

  if (projectsList.length === 0) {
    return null;
  }

  const currentProject = projectsList[activeProjectIdx] || projectsList[0];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updatePosition(e.clientX);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-3xl bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/80 p-4 sm:p-7 shadow-sm">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
            اسلایدر تعاملی مقایسه قبل و بعد پروژه‌ها
          </span>
        </div>

        {/* Categories Tabs */}
        {projectsList.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {projectsList.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setActiveProjectIdx(idx);
                  setSliderPosition(50);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeProjectIdx === idx
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {p.category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Container - Structured exactly identical to single-card format */}
      <div className="max-w-3xl mx-auto rounded-2xl bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/60 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500/40">
        
        <div>
          {/* 1. Media Preview Area (With Category top-right & Location bottom-right overlay identical to single photo) */}
          <div 
            ref={containerRef}
            dir="ltr"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative h-64 sm:h-96 w-full overflow-hidden select-none bg-slate-950 touch-none"
          >
            {/* Base Layer: AFTER Image */}
            <img
              src={currentProject.afterImage}
              alt={currentProject.afterLabel}
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />

            {/* Clipped Layer: BEFORE Image */}
            <div 
              className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                WebkitClipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
              }}
            >
              <img
                src={currentProject.beforeImage}
                alt={currentProject.beforeLabel}
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />
            </div>

            {/* Bottom Gradient Overlay for High Contrast Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none z-10"></div>

            {/* Dynamic Fade Badge: BEFORE (قبل از کار) on top-left - Fades out when hidden */}
            <div 
              dir="rtl"
              style={{
                opacity: sliderPosition > 12 ? Math.min(1, (sliderPosition - 12) / 20) : 0,
                transform: `translateY(${sliderPosition > 12 ? '0' : '-8px'}) scale(${sliderPosition > 12 ? '1' : '0.95'})`
              }}
              className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg border border-red-400/30 z-20 pointer-events-none transition-all duration-200 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>قبل از کار</span>
            </div>

            {/* Dynamic Fade Badge: AFTER (بعد از کار) on top-right - Fades out when hidden */}
            <div 
              dir="rtl"
              style={{
                opacity: sliderPosition < 88 ? Math.min(1, (88 - sliderPosition) / 20) : 0,
                transform: `translateY(${sliderPosition < 88 ? '0' : '-8px'}) scale(${sliderPosition < 88 ? '1' : '0.95'})`
              }}
              className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg border border-emerald-400/30 z-20 pointer-events-none transition-all duration-200 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse"></span>
              <span>بعد از کار</span>
            </div>

            {/* Location Pin (پایین سمت راست) */}
            <div className="absolute bottom-3 right-3 text-right z-20 pointer-events-none">
              <span className="text-xs text-blue-300 font-bold flex items-center gap-1 drop-shadow-md">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{currentProject.location || 'ساوه'}</span>
              </span>
            </div>

            {/* Type & Category Badge with Sticker Icon (پایین سمت چپ - استیکر پشت متن) */}
            <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-700/80 flex items-center gap-1.5 z-20 shadow-md pointer-events-none">
              <span>{currentProject.category}</span>
              <Sparkles className="w-3 h-3 text-emerald-400" />
            </div>

            {/* Slider Divider Line & Center Draggable Button */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.8)] z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xl border-2 border-white pointer-events-none transition-transform ${isDragging ? 'scale-110 bg-blue-500 ring-4 ring-blue-400/40' : 'hover:scale-105'}`}>
                <ArrowLeftRight className="w-4 h-4" />
              </div>
            </div>

            {/* Native Range Input for Touch/Mouse Slider Control */}
            <input
              type="range"
              min="0"
              max="100"
              dir="ltr"
              value={sliderPosition}
              onChange={handleSliderChange}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              aria-label="اسلایدر مقایسه قبل و بعد"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 touch-none"
            />
          </div>

          {/* Interaction Hint (Directly under photo) */}
          <div className="text-center py-1.5 px-3 bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center gap-1">
            <span>{currentProject.sliderHint || '👈 دکمه وسط را به چپ و راست بکشید تا تغییر کیفیت را ببینید 👉'}</span>
          </div>

          {/* Before/After Status Details Box */}
          <div className="py-2 px-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-right">
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 shrink-0">قبل:</span>
              <span className="text-xs text-slate-600 dark:text-slate-300 leading-tight">{currentProject.beforeLabel}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 shrink-0">بعد:</span>
              <span className="text-xs text-slate-600 dark:text-slate-300 leading-tight">{currentProject.afterLabel}</span>
            </div>
          </div>

          {/* 3. Card Content (Exact structure matching single photo format) */}
          <div className="p-5 text-right">
            {/* عنوان پروژه */}
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-2">
              {currentProject.title}
            </h4>

            {/* متن شرح و توضیحات زیر عکس */}
            {currentProject.description && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                {currentProject.description}
              </p>
            )}

            {/* نکات کلیدی و تیک‌های سبز (Checkmarks) با خط جداکننده بالا */}
            {currentProject.highlights && currentProject.highlights.length > 0 && (
              <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                {currentProject.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="leading-tight">{h}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card bottom action (Exact structure matching single photo format) */}
        <div className="p-5 pt-0 border-t border-slate-200/50 dark:border-slate-700/50 mt-2">
          <button
            onClick={() => onBookService && onBookService(currentProject.category)}
            className="w-full py-2 rounded-xl bg-slate-200 hover:bg-blue-600 hover:text-white dark:bg-slate-700/70 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer text-center"
          >
            استعلام این نوع پروژه در ساوه
          </button>
        </div>
      </div>

    </div>
  );
};
