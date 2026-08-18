import React from 'react';
import { Phone, MessageSquare, Sparkles, Flame, Send, Instagram, Link as LinkIcon, MessageCircle, Mail, Radio, Globe, Zap, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPersianPhone } from '../utils';

export const MobileFloatingBar: React.FC = () => {
  const { settings, incrementCallCount, trackRubikaClick } = useApp();

  if (settings.showFloatingBar === false) return null;

  const floatingMessengers = settings.messengers?.filter(m => m.isActive !== false && m.showInFloatingBar === true) || [];

  const activeButtonsCount = 
    (settings.showFloatingCall1 !== false ? 1 : 0) +
    (settings.showFloatingCall2 !== false ? 1 : 0) +
    (floatingMessengers.length > 0 ? floatingMessengers.length : (settings.showFloatingRubika !== false ? 1 : 0));

  if (activeButtonsCount === 0) return null;

  const themeBtnClasses: Record<string, { bg: string; text: string; border: string }> = {
    purple: { bg: 'bg-purple-50 dark:bg-purple-950/80', text: 'text-purple-700 dark:text-purple-200', border: 'border-purple-300 dark:border-purple-500/40' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-950/80', text: 'text-orange-700 dark:text-orange-200', border: 'border-orange-300 dark:border-orange-500/40' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/80', text: 'text-emerald-700 dark:text-emerald-200', border: 'border-emerald-300 dark:border-emerald-500/40' },
    blue: { bg: 'bg-sky-50 dark:bg-sky-950/80', text: 'text-sky-700 dark:text-sky-200', border: 'border-sky-300 dark:border-sky-500/40' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/80', text: 'text-indigo-700 dark:text-indigo-200', border: 'border-indigo-300 dark:border-indigo-500/40' },
    cyan: { bg: 'bg-teal-50 dark:bg-teal-950/80', text: 'text-teal-700 dark:text-teal-200', border: 'border-teal-300 dark:border-teal-500/40' },
    pink: { bg: 'bg-pink-50 dark:bg-pink-950/80', text: 'text-pink-700 dark:text-pink-200', border: 'border-pink-300 dark:border-pink-500/40' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-950/80', text: 'text-amber-700 dark:text-amber-200', border: 'border-amber-300 dark:border-amber-500/40' },
    slate: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-200', border: 'border-slate-300 dark:border-slate-700' },
  };

  return (
    <aside aria-label="دسترسی سریع تماس" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-2.5 shadow-2xl safe-area-pb transition-colors duration-300">
      <div className="max-w-md mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        
        {/* Main Big Emergency Call Button */}
        {settings.showFloatingCall1 !== false && (
          <a
            id="mobile-sticky-call-primary"
            href={`tel:${settings.primaryPhone}`}
            onClick={() => incrementCallCount(settings.primaryPhone)}
            className="flex-1 min-w-[140px] emergency-pulse-btn flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/40 active:scale-95 transition-transform"
          >
            <Phone className="w-4 h-4 animate-call-ring shrink-0" />
            <span className="font-mono text-xs sm:text-sm font-black tracking-wider">{formatPersianPhone(settings.primaryPhone)}</span>
          </a>
        )}

        {/* Second Phone Call Button */}
        {settings.showFloatingCall2 !== false && (
          <a
            id="mobile-sticky-call-secondary"
            href={`tel:${settings.secondaryPhone}`}
            onClick={() => incrementCallCount(settings.secondaryPhone)}
            className="px-3.5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1 shrink-0"
            title="تماس با شماره دوم"
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] font-bold whitespace-nowrap">خط ۲</span>
          </a>
        )}

        {/* Dynamic Messengers configured for floating bar */}
        {floatingMessengers.length > 0 ? (
          floatingMessengers.map(m => {
            const isCustom = m.colorTheme === 'custom' || !!m.customColorHex;
            const customHex = m.customColorHex || '#9333ea';
            const tc = !isCustom ? (themeBtnClasses[m.colorTheme || 'purple'] || themeBtnClasses.purple) : null;

            return (
              <a
                key={m.id}
                href={m.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={m.name.includes('روبیکا') ? trackRubikaClick : undefined}
                style={isCustom ? {
                  backgroundColor: `${customHex}18`,
                  borderColor: `${customHex}55`,
                  color: customHex,
                } : undefined}
                className={`px-3 py-3 rounded-2xl ${tc ? `${tc.bg} ${tc.text} border ${tc.border}` : 'border'} text-xs font-bold active:scale-95 transition-transform flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs`}
                title={m.name}
              >
                {m.customIconUrl ? (
                  <img 
                    src={m.customIconUrl} 
                    alt={m.name} 
                    className="w-3.5 h-3.5 rounded-full object-cover shrink-0" 
                  />
                ) : m.iconName === 'phone' ? (
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                ) : m.iconName === 'send' ? (
                  <Send className="w-3.5 h-3.5 shrink-0" />
                ) : m.iconName === 'instagram' ? (
                  <Instagram className="w-3.5 h-3.5 shrink-0" />
                ) : m.iconName === 'link' ? (
                  <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                ) : m.iconName === 'mail' ? (
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                ) : m.iconName === 'radio' ? (
                  <Radio className="w-3.5 h-3.5 shrink-0" />
                ) : m.iconName === 'zap' ? (
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                ) : m.iconName === 'globe' ? (
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                ) : m.iconName === 'share-2' ? (
                  <Share2 className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="text-[11px] whitespace-nowrap">{m.name}</span>
              </a>
            );
          })
        ) : (
          /* Rubika Fallback if no dynamic messengers array */
          settings.showFloatingRubika !== false && (
            <a
              id="mobile-sticky-rubika"
              href={settings.rubikaUrl || 'https://rubika.ir/Jshhshvsh'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackRubikaClick}
              className="px-3 py-3 rounded-2xl bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-200 border border-purple-300 dark:border-purple-500/40 text-xs font-bold active:scale-95 transition-transform flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
              title="پیام در روبیکا"
            >
              <img 
                src="https://web.rubika.ir/assets/icons/icon-192x192.png" 
                alt="Rubika" 
                className="w-3.5 h-3.5 rounded-full object-cover shrink-0" 
              />
              <span className="text-[11px] whitespace-nowrap">روبیکا</span>
            </a>
          )
        )}

      </div>
    </aside>
  );
};
