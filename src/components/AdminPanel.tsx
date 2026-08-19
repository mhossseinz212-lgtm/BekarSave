import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  Settings, 
  DollarSign, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit3, 
  Search, 
  BarChart3, 
  Globe, 
  Save, 
  FileText, 
  LogOut, 
  Shield, 
  Layers, 
  Plus, 
  Download,
  AlertCircle,
  Image as ImageIcon,
  User,
  Users,
  Key,
  RefreshCw,
  Sparkles,
  Tag,
  Wrench,
  Truck,
  Hammer,
  Eye,
  EyeOff,
  AlertTriangle,
  Activity,
  MessageCircle,
  Calculator,
  Star,
  MapPin,
  Check,
  CheckCircle,
  ThumbsUp,
  Upload,
  RotateCcw,
  ExternalLink,
  Copy,
  Video,
  HardDrive,
  FolderArchive,
  Database,
  FileSpreadsheet,
  FileJson,
  Printer,
  CheckCheck,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  Percent,
  Flame,
  Droplet,
  Pipette,
  Building2,
  ShieldCheck,
  Zap,
  Send,
  Share2,
  Instagram,
  Radio,
  Mail,
  Palette,
  Link as LinkIcon,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SiteSettings, ServiceItem, BookingRequest, GalleryItem, TariffItem, ReviewItem, NeighborhoodInfo, MessengerItem, CustomActionButton } from '../types';
import { initialSiteSettings } from '../data/initialData';
import { toPersianDigits, formatPersianPhone, safeLocalStorage, safeSessionStorage, compressImageFile } from '../utils';
import { generateSitemapXml, generateRobotsTxt } from '../utils/sitemapGenerator';

export const AdminPanel: React.FC = () => {
  const { 
    isAdminModalOpen, 
    setIsAdminModalOpen, 
    isAdminLoggedIn, 
    loginAdmin, 
    logoutAdmin,
    settings,
    updateSettings,
    resetSettingsToDefault,
    services,
    addService,
    updateService,
    deleteService,
    reorderServices,
    resetServicesToDefault,
    tariffs,
    addTariff,
    updateTariff,
    deleteTariff,
    reorderTariffs,
    batchUpdateTariffs,
    applyDiscount,
    removeDiscount,
    resetTariffsToDefault,
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    resetCouponsToDefault,
    bookings,
    updateBookingStatus,
    deleteBooking,
    resetBookingsToDefault,
    reviews,
    approveReview,
    unapproveReview,
    deleteReview,
    addAdminReview,
    resetReviewsToDefault,
    neighborhoods,
    addNeighborhood,
    updateNeighborhood,
    deleteNeighborhood,
    resetNeighborhoodsToDefault,
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    resetGalleryToDefault,
    resetAllToDefault,
    stats,
    clearStatsLogs,
    addMediaVaultItem,
    deleteMediaVaultItem,
    exportFullBackup,
    importFullBackup,
  } = useApp();

  // Login & Security state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    const saved = safeSessionStorage.getItem('behkar_failed_attempts');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lockoutUntil, setLockoutUntil] = useState<number>(() => {
    const saved = safeSessionStorage.getItem('behkar_lockout_until');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [remainingLockoutSec, setRemainingLockoutSec] = useState<number>(0);

  // Active Tab state
  const [activeTab, setActiveTab] = useState<'bookings' | 'visibility' | 'reviews' | 'tariffs' | 'discounts' | 'services' | 'neighborhoods' | 'content' | 'stats' | 'gallery' | 'media' | 'general' | 'seo' | 'backup'>('bookings');
  
  // Coupon Creator state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponTypeInput, setCouponTypeInput] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValueInput, setCouponValueInput] = useState<number>(10);
  const [couponMaxUsesInput, setCouponMaxUsesInput] = useState<number>(5);
  const [couponDescInput, setCouponDescInput] = useState('');
  
  // Backup & Restore Center states
  const [isBackupCopied, setIsBackupCopied] = useState<boolean>(false);
  const [importPreviewData, setImportPreviewData] = useState<{
    rawJson: string;
    fileName: string;
    fileSize: string;
    parsed: any;
    summaryText: string;
    itemCounts: {
      services: number;
      gallery: number;
      mediaVault: number;
      bookings: number;
      reviews: number;
      tariffs: number;
      neighborhoods: number;
    };
  } | null>(null);
  const [selectiveImport, setSelectiveImport] = useState({
    settings: true,
    services: true,
    gallery: true,
    tariffs: true,
    reviews: true,
    neighborhoods: true,
    bookings: true,
    stats: true,
  });
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [resetScope, setResetScope] = useState<'all' | 'bookings' | 'gallery' | 'settings' | 'tariffs' | 'stats'>('all');
  const [resetConfirmationInput, setResetConfirmationInput] = useState<string>('');

  // Media Vault filtering state
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<string>('all');
  const [mediaSearchQuery, setMediaSearchQuery] = useState<string>('');
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);
  
  // Media Vault Upload Modal state
  const [showAddMediaModal, setShowAddMediaModal] = useState<boolean>(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);
  const [newMediaTitle, setNewMediaTitle] = useState<string>('');
  const [newMediaCategory, setNewMediaCategory] = useState<'general' | 'hero' | 'og' | 'service' | 'gallery' | 'about' | 'logo'>('general');
  const [newMediaUrlInput, setNewMediaUrlInput] = useState<string>('');
  
  // Local settings edit state
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Sitemap & Robots generator modal states
  const [showSitemapModal, setShowSitemapModal] = useState<boolean>(false);
  const [generatedXmlText, setGeneratedXmlText] = useState<string>('');
  const [generatedRobotsText, setGeneratedRobotsText] = useState<string>('');

  // Lockout countdown timer
  React.useEffect(() => {
    const checkLockout = () => {
      const now = Date.now();
      if (lockoutUntil > now) {
        setRemainingLockoutSec(Math.ceil((lockoutUntil - now) / 1000));
      } else {
        setRemainingLockoutSec(0);
      }
    };
    checkLockout();
    const timer = setInterval(checkLockout, 1000);
    return () => clearInterval(timer);
  }, [lockoutUntil]);

  // Sync localSettings when settings from context changes
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Custom button creator state
  const [newBtnTitle, setNewBtnTitle] = useState('');
  const [newBtnUrl, setNewBtnUrl] = useState('');
  const [newBtnVariant, setNewBtnVariant] = useState<'primary' | 'secondary' | 'success' | 'rubika'>('primary');

  // Messenger & Social Channels Management State
  const [showAddMessengerModal, setShowAddMessengerModal] = useState<boolean>(false);
  const [editingMessengerId, setEditingMessengerId] = useState<string | null>(null);
  const [messengerFormData, setMessengerFormData] = useState<Omit<MessengerItem, 'id'>>({
    name: '',
    usernameOrId: '',
    link: '',
    iconName: 'message-circle',
    customIconUrl: '',
    colorTheme: 'purple',
    customColorHex: '#9333ea',
    badge: '',
    isActive: true,
    showInHero: true,
    showInFooter: true,
    showInFloatingBar: false,
  });

  // Tariff management state
  const [tariffCategoryFilter, setTariffCategoryFilter] = useState<string>('all');
  const [tariffSearchQuery, setTariffSearchQuery] = useState<string>('');
  const [batchPercentageInput, setBatchPercentageInput] = useState<number | string>(10);
  const [showAddTariffForm, setShowAddTariffForm] = useState(false);
  const [editingTariffId, setEditingTariffId] = useState<string | null>(null);
  const [tariffCustomCategoryName, setTariffCustomCategoryName] = useState('');
  const [tariffFormData, setTariffFormData] = useState<Omit<TariffItem, 'id'>>({
    category: 'pipe',
    categoryName: 'تعرفه لوله بازکنی',
    title: '',
    unit: 'هر عدد',
    priceRange: '',
    note: '',
  });

  // Service management state
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newToolInput, setNewToolInput] = useState('');
  const [serviceFormData, setServiceFormData] = useState<Omit<ServiceItem, 'id'>>({
    title: '',
    slug: '',
    shortDesc: '',
    fullDesc: '',
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=600',
    features: ['اعزام فوری', 'ضمانت کتبی', 'قیمت منصفانه'],
    tools: ['فنر برقی', 'پمپ تراکم'],
    startingPrice: 'تماس بگیرید',
    priceNote: 'بر اساس تعرفه مصوب',
    guarantee: 'تضمین ۱۰۰٪ رفع مشکل',
    badge: 'تضمینی'
  });

  // Review management state
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('ساوه');
  const [newReviewService, setNewReviewService] = useState('لوله بازکنی فوری');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Neighborhood management state
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [zoneFormData, setZoneFormData] = useState<Omit<NeighborhoodInfo, 'id'>>({
    name: '',
    responseTimeMinutes: 15,
    activeTechs: 2,
    popularServices: ['لوله بازکنی فوری', 'تخلیه چاه'],
    isSpecialZone: false,
    priceMultiplier: 1,
    note: 'اعزام فوری شبانه‌روزی با تجهیزات کامل ژنراتور و فنر'
  });

  // Gallery item state (Add & Edit)
  const [editingGalId, setEditingGalId] = useState<string | null>(null);
  const [showAddGalForm, setShowAddGalForm] = useState(false);
  const [newHighlightInput, setNewHighlightInput] = useState('');
  const [galFormData, setGalFormData] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    category: 'لوله بازکنی',
    type: 'image',
    mediaUrl: '',
    beforeUrl: '',
    afterUrl: '',
    beforeLabel: 'وضعیت قبل از انجام کار',
    afterLabel: 'وضعیت بعد از اتمام کار و شستشو',
    sliderHint: '👈 دکمه وسط را به چپ و راست بکشید تا تغییر کیفیت را ببینید 👉',
    highlights: [
      'اجرای سریع و تخصصی در ساوه',
      'تضمین کیفیت کتبی',
      'بدون کثیف‌کاری و با تجهیزات کامل'
    ],
    description: '',
    location: 'ساوه',
  });

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'mediaUrl' | 'beforeUrl' | 'afterUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await compressImageFile(file);
      if (dataUrl) {
        addMediaVaultItem({
          title: `عکس گالری (${file.name})`,
          category: 'gallery',
          url: dataUrl,
          originalFileName: file.name,
          isCurrentActive: true,
        });

        setGalFormData(prev => ({
          ...prev,
          [fieldName]: dataUrl,
          ...(fieldName === 'afterUrl' && prev.type === 'before-after' ? { mediaUrl: dataUrl } : {})
        }));
        showNotification('عکس آپلود و همزمان در آرشیو دائمی تصاویر ذخیره گردید.');
      }
    } catch (err) {
      console.error('Gallery image processing error:', err);
    }
  };

  const handleSettingsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, settingKey: keyof SiteSettings) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await compressImageFile(file);
      if (dataUrl) {
        // Preserve previous image in media vault if available
        const oldImage = localSettings[settingKey] as string;
        const category = settingKey.includes('hero') ? 'hero' : settingKey.includes('og') ? 'og' : settingKey.includes('about') ? 'about' : 'general';

        if (oldImage && typeof oldImage === 'string' && oldImage.length > 5) {
          addMediaVaultItem({
            title: `تصویر سابق بخش (${settingKey})`,
            category,
            url: oldImage,
            isCurrentActive: false,
          });
        }

        // Save new image into media vault
        addMediaVaultItem({
          title: `تصویر جدید بخش (${settingKey}) - ${file.name}`,
          category,
          url: dataUrl,
          originalFileName: file.name,
          isCurrentActive: true,
        });

        const updated = { ...localSettings, [settingKey]: dataUrl };
        setLocalSettings(updated);
        updateSettings(updated);
        showNotification('تصویر جدید فعال شد و تصویر قبلی نیز در آرشیو دائمی ذخیره گردید.');
      }
    } catch (err) {
      console.error('Settings image upload error:', err);
    }
  };

  if (!isAdminModalOpen) return null;

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const runSeoHealthCheck = () => {
    const tests = [];
    let passedCount = 0;

    // Test 1: Title Tag Length & Keywords
    const title = localSettings.seoTitle || '';
    const hasLocation = title.includes('ساوه');
    const hasServiceKw = title.includes('لوله بازکنی') || title.includes('تخلیه چاه');
    const titleLengthOk = title.length >= 35 && title.length <= 70;
    if (titleLengthOk && hasLocation && hasServiceKw) {
      tests.push({ id: 'title', title: 'عنوان اصلی سئو (Meta Title)', score: 100, status: 'pass', msg: `عنوان عالی است (${toPersianDigits(title.length)} کاراکتر) و شامل «ساوه» و کلیدواژه اصلی می‌باشد.` });
      passedCount++;
    } else if (title.length > 0) {
      tests.push({ id: 'title', title: 'عنوان اصلی سئو (Meta Title)', score: 65, status: 'warn', msg: `طول عنوان (${toPersianDigits(title.length)} کاراکتر) یا کلمات کلیدی «ساوه» و «لوله بازکنی» بهینه‌سازی بیشتر نیاز دارند.` });
    } else {
      tests.push({ id: 'title', title: 'عنوان اصلی سئو (Meta Title)', score: 0, status: 'fail', msg: 'عنوان متاتگ سئو هنوز ثبت نشده است!' });
    }

    // Test 2: Description Tag Length & CTA (150 - 160 chars)
    const desc = localSettings.seoDescription || '';
    const descLengthOk = desc.length >= 145 && desc.length <= 165;
    const hasKeywords = desc.includes('لوله بازکنی') || desc.includes('ساوه') || desc.includes('خدمات فنی') || desc.includes('فوری');
    if (descLengthOk && hasKeywords) {
      tests.push({ id: 'desc', title: 'توضیحات متاتگ (Meta Description)', score: 100, status: 'pass', msg: `توضیحات استاندارد گوگل است (${toPersianDigits(desc.length)} کاراکتر، دقیقاً بین ۱۵۰ تا ۱۶۰ کاراکتر) شامل عبارات ترغیب‌کننده و کلمات کلیدی.` });
      passedCount++;
    } else if (desc.length > 0) {
      tests.push({ id: 'desc', title: 'توضیحات متاتگ (Meta Description)', score: 70, status: 'warn', msg: `طول توضیحات سئو (${toPersianDigits(desc.length)} کاراکتر) پیشنهاد می‌شود دقیقاً بین ۱۵۰ تا ۱۶۰ کاراکتر باشد.` });
    } else {
      tests.push({ id: 'desc', title: 'توضیحات متاتگ (Meta Description)', score: 0, status: 'fail', msg: 'توضیحات متاتگ سئو خالی است!' });
    }

    // Test 3: Open Graph Social Sharing Tags
    const ogTitle = localSettings.ogTitle || '';
    const ogImage = localSettings.ogImageUrl || '';
    if (ogTitle.length > 5 && ogImage.length > 10) {
      tests.push({ id: 'og', title: 'کارت اشتراک‌گذاری شبکه اجتماعی (Open Graph)', score: 100, status: 'pass', msg: 'عنوان و کاور تصویر شبکه‌های اجتماعی برای اشتراک در روبیکا، ایتا و تلگرام تنظیم شده است.' });
      passedCount++;
    } else {
      tests.push({ id: 'og', title: 'کارت اشتراک‌گذاری شبکه اجتماعی (Open Graph)', score: 40, status: 'warn', msg: 'عنوان یا تصویر اختصاصی Open Graph را برای نمایش شکیل در پیام‌رسان‌ها پر کنید.' });
    }

    // Test 4: Image Alt Text & Service Cards
    const servicesWithImage = services.filter(s => s.image && s.image.length > 10);
    const servicesRatio = services.length > 0 ? (servicesWithImage.length / services.length) : 1;
    if (servicesRatio >= 0.8) {
      tests.push({ id: 'alt', title: 'متن جایگزین عکس‌ها و تصاویر خدمات (Alt Text)', score: 100, status: 'pass', msg: `بیش از ۸۰٪ خدمات (${toPersianDigits(servicesWithImage.length)} از ${toPersianDigits(services.length)}) دارای تصویر باکیفیت و عنوان مجزا می‌باشند.` });
      passedCount++;
    } else {
      tests.push({ id: 'alt', title: 'متن جایگزین عکس‌ها و تصاویر خدمات (Alt Text)', score: 55, status: 'warn', msg: `تنها ${toPersianDigits(servicesWithImage.length)} خدمت عکس دارند. افزودن عکس به باقی خدمات رتبه گوگل را ارتقا می‌دهد.` });
    }

    // Test 5: Content Word Count
    const totalText =
      (localSettings.heroHeadline || '') +
      ' ' +
      (localSettings.heroSubheadline || '') +
      ' ' +
      (localSettings.servicesHeadline || '') +
      ' ' +
      (localSettings.servicesSubheadline || '') +
      ' ' +
      (localSettings.whyUsHeadline || '') +
      ' ' +
      (localSettings.whyUsSubheadline || '') +
      ' ' +
      (localSettings.footerAboutText || '') +
      ' ' +
      services.map(s => (s.title || '') + ' ' + (s.shortDesc || '') + ' ' + (s.fullDesc || '')).join(' ');
    const wordCount = totalText.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount >= 180) {
      tests.push({ id: 'content', title: 'حجم و عمق محتوای متنی (Content Richness)', score: 100, status: 'pass', msg: `حجم متنی سایت عالی است (حدود ${toPersianDigits(wordCount)} کلمه) که باعث پایداری رتبه در الگوریتم‌های گوگل می‌شود.` });
      passedCount++;
    } else {
      tests.push({ id: 'content', title: 'حجم و عمق محتوای متنی (Content Richness)', score: 60, status: 'warn', msg: `تعداد کلمات کل سایت (${toPersianDigits(wordCount)} کلمه) کم است. تکمیل بخش درباره ما و ضمانت‌ها پیشنهاد می‌شود.` });
    }

    // Test 6: Local SEO Neighborhoods Coverage
    if (neighborhoods.length >= 5) {
      tests.push({ id: 'geo', title: 'پوشش محله‌های ساوه (Local SEO)', score: 100, status: 'pass', msg: `${toPersianDigits(neighborhoods.length)} محله ساوه به همراه ضریب قیمت ثبت شده است که الگوریتم Local SEO گوگل را فعال می‌کند.` });
      passedCount++;
    } else {
      tests.push({ id: 'geo', title: 'پوشش محله‌های ساوه (Local SEO)', score: 60, status: 'warn', msg: 'ثبت بیش از ۵ محله اصلی ساوه باعث نمایش بهتر در جستجوهای منطقه‌ای می‌شود.' });
    }

    const totalScore = Math.round((tests.reduce((acc, curr) => acc + curr.score, 0) / (tests.length * 100)) * 100);

    return { totalScore, tests, passedCount, totalTests: tests.length };
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (remainingLockoutSec > 0) return;

    const success = loginAdmin(usernameInput, passwordInput);
    if (success) {
      setAuthError(false);
      setUsernameInput('');
      setPasswordInput('');
      setFailedAttempts(0);
      setLockoutUntil(0);
      safeSessionStorage.removeItem('behkar_failed_attempts');
      safeSessionStorage.removeItem('behkar_lockout_until');
    } else {
      const nextCount = failedAttempts + 1;
      setFailedAttempts(nextCount);
      safeSessionStorage.setItem('behkar_failed_attempts', String(nextCount));
      
      if (nextCount >= 5) {
        const lockUntil = Date.now() + 5 * 60 * 1000; // 5 minutes lockout
        setLockoutUntil(lockUntil);
        safeSessionStorage.setItem('behkar_lockout_until', String(lockUntil));
        setRemainingLockoutSec(300);
      }
      setAuthError(true);
    }
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    showNotification('تنظیمات سایت با موفقیت ذخیره شد.');
  };

  const handleSaveContentSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    showNotification('متن‌ها، ضمانت‌ها و وضعیت دکمه‌های سایت با موفقیت ذخیره و اعمال گردید.');
  };

  const handleAddCustomButton = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBtnTitle.trim() || !newBtnUrl.trim()) return;
    const newBtn: CustomActionButton = {
      id: 'btn_' + Date.now(),
      title: newBtnTitle.trim(),
      url: newBtnUrl.trim(),
      type: newBtnVariant === 'rubika' ? 'rubika' : newBtnUrl.startsWith('tel:') ? 'tel' : 'link',
      variant: newBtnVariant,
      isVisible: true,
      visible: true,
    };
    const updated = {
      ...localSettings,
      customButtons: [...(localSettings.customButtons || []), newBtn],
    };
    setLocalSettings(updated);
    updateSettings(updated);
    setNewBtnTitle('');
    setNewBtnUrl('');
    showNotification('دکمه سفارشی جدید به سایت اضافه شد.');
  };

  const handleToggleCustomButton = (id: string) => {
    const updatedButtons = (localSettings.customButtons || []).map(b =>
      b.id === id ? { ...b, isVisible: b.isVisible !== false ? false : true, visible: b.visible !== false ? false : true } : b
    );
    const updated = { ...localSettings, customButtons: updatedButtons };
    setLocalSettings(updated);
    updateSettings(updated);
  };

  const handleDeleteCustomButton = (id: string) => {
    const updatedButtons = (localSettings.customButtons || []).filter(b => b.id !== id);
    const updated = { ...localSettings, customButtons: updatedButtons };
    setLocalSettings(updated);
    updateSettings(updated);
    showNotification('دکمه با موفقیت حذف گردید.');
  };

  // Messenger & Social Channels Management Handlers
  const handleOpenAddMessengerModal = () => {
    setEditingMessengerId(null);
    setMessengerFormData({
      name: '',
      usernameOrId: '',
      link: '',
      iconName: 'message-circle',
      customIconUrl: '',
      colorTheme: 'purple',
      customColorHex: '#9333ea',
      badge: '',
      isActive: true,
      showInHero: true,
      showInFooter: true,
      showInFloatingBar: false,
    });
    setShowAddMessengerModal(true);
  };

  const handleSaveMessenger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messengerFormData.name.trim() || !messengerFormData.link.trim()) {
      alert('لطفاً نام پیام‌رسان و لینک مستقیم آن را وارد نمایید.');
      return;
    }

    const currentMessengers = localSettings.messengers || [];

    if (editingMessengerId) {
      const updatedList = currentMessengers.map(m =>
        m.id === editingMessengerId ? { ...messengerFormData, id: editingMessengerId } : m
      );
      const updated = { ...localSettings, messengers: updatedList };
      setLocalSettings(updated);
      updateSettings(updated);
      showNotification('پیام‌رسان با موفقیت ویرایش و بروزرسانی شد.');
      setEditingMessengerId(null);
    } else {
      const newMessenger: MessengerItem = {
        ...messengerFormData,
        id: 'msg_' + Date.now(),
      };
      const updated = { ...localSettings, messengers: [...currentMessengers, newMessenger] };
      setLocalSettings(updated);
      updateSettings(updated);
      showNotification('پیام‌رسان جدید با موفقیت اضافه و در سایت فعال گردید.');
    }

    setShowAddMessengerModal(false);
    setMessengerFormData({
      name: '',
      usernameOrId: '',
      link: '',
      iconName: 'message-circle',
      customIconUrl: '',
      colorTheme: 'purple',
      customColorHex: '#9333ea',
      badge: '',
      isActive: true,
      showInHero: true,
      showInFooter: true,
      showInFloatingBar: false,
    });
  };

  const handleEditMessenger = (msg: MessengerItem) => {
    setEditingMessengerId(msg.id);
    setMessengerFormData({
      name: msg.name,
      usernameOrId: msg.usernameOrId || '',
      link: msg.link,
      iconName: msg.iconName || 'message-circle',
      customIconUrl: msg.customIconUrl || '',
      colorTheme: msg.colorTheme || 'purple',
      customColorHex: msg.customColorHex || '#9333ea',
      badge: msg.badge || '',
      isActive: msg.isActive !== false,
      showInHero: msg.showInHero !== false,
      showInFooter: msg.showInFooter !== false,
      showInFloatingBar: !!msg.showInFloatingBar,
    });
    setShowAddMessengerModal(true);
  };

  const handleMessengerIconUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری (PNG, JPG, SVG, WebP) انتخاب فرمایید.');
      return;
    }
    try {
      const compressedDataUrl = await compressImageFile(file, 200, 200, 0.9);
      if (compressedDataUrl) {
        setMessengerFormData(prev => ({
          ...prev,
          customIconUrl: compressedDataUrl,
        }));
        showNotification('تصویر آیکون اختصاصی با موفقیت بارگذاری شد.');
      }
    } catch {
      alert('خطا در پردازش تصویر. لطفاً تصویر دیگری انتخاب فرمایید.');
    }
  };

  const handleDeleteMessenger = (id: string) => {
    const updatedList = (localSettings.messengers || []).filter(m => m.id !== id);
    const updated = { ...localSettings, messengers: updatedList };
    setLocalSettings(updated);
    updateSettings(updated);
    showNotification('پیام‌رسان با موفقیت حذف گردید.');
  };

  const handleToggleMessengerActive = (id: string) => {
    const updatedList = (localSettings.messengers || []).map(m =>
      m.id === id ? { ...m, isActive: !m.isActive } : m
    );
    const updated = { ...localSettings, messengers: updatedList };
    setLocalSettings(updated);
    updateSettings(updated);
  };

  const handleToggleMessengerLocation = (id: string, key: 'showInHero' | 'showInFooter' | 'showInFloatingBar') => {
    const updatedList = (localSettings.messengers || []).map(m =>
      m.id === id ? { ...m, [key]: !m[key] } : m
    );
    const updated = { ...localSettings, messengers: updatedList };
    setLocalSettings(updated);
    updateSettings(updated);
  };

  const handleMoveMessenger = (index: number, direction: 'up' | 'down') => {
    const list = [...(localSettings.messengers || [])];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    const updated = { ...localSettings, messengers: list };
    setLocalSettings(updated);
    updateSettings(updated);
  };

  const handleSaveTariff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tariffFormData.title.trim() || !tariffFormData.priceRange.trim()) {
      alert('لطفاً عنوان ردیف تعرفه و قیمت را وارد فرمایید.');
      return;
    }

    let finalCategory = tariffFormData.category;
    let finalCategoryName = tariffFormData.categoryName;

    if (tariffFormData.category === 'custom') {
      if (!tariffCustomCategoryName.trim()) {
        alert('لطفاً عنوان دسته‌بندی جدید را وارد نمایید.');
        return;
      }
      finalCategoryName = tariffCustomCategoryName.trim();
      finalCategory = 'custom_' + Date.now();
    }

    const payload: Omit<TariffItem, 'id'> = {
      ...tariffFormData,
      category: finalCategory,
      categoryName: finalCategoryName,
    };

    if (editingTariffId) {
      updateTariff(editingTariffId, payload);
      showNotification('تعرفه با موفقیت ویرایش شد.');
      setEditingTariffId(null);
    } else {
      addTariff(payload);
      showNotification('تعرفه جدید با موفقیت اضافه شد.');
      setShowAddTariffForm(false);
    }

    setTariffCustomCategoryName('');
    setTariffFormData({
      category: 'pipe',
      categoryName: 'تعرفه لوله بازکنی',
      title: '',
      unit: 'هر عدد',
      priceRange: '',
      note: '',
    });
  };

  const handleMoveTariff = (id: string, direction: 'up' | 'down') => {
    const index = tariffs.findIndex(t => t.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < tariffs.length) {
      reorderTariffs(index, targetIndex);
    }
  };

  const handleMoveService = (id: string, direction: 'up' | 'down') => {
    const index = services.findIndex(s => s.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < services.length) {
      reorderServices(index, targetIndex);
    }
  };

  const startEditTariff = (tariff: TariffItem) => {
    setEditingTariffId(tariff.id);
    const standardCategories = ['pipe', 'well_digging', 'toilet_replacement', 'well_emptying', 'isogam', 'plumbing'];
    const isStandard = standardCategories.includes(tariff.category);
    
    if (isStandard) {
      setTariffFormData({
        category: tariff.category,
        categoryName: tariff.categoryName,
        title: tariff.title,
        unit: tariff.unit,
        priceRange: tariff.priceRange,
        note: tariff.note || '',
      });
      setTariffCustomCategoryName('');
    } else {
      setTariffFormData({
        category: 'custom',
        categoryName: tariff.categoryName,
        title: tariff.title,
        unit: tariff.unit,
        priceRange: tariff.priceRange,
        note: tariff.note || '',
      });
      setTariffCustomCategoryName(tariff.categoryName);
    }
    setShowAddTariffForm(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceFormData.title.trim() || !serviceFormData.startingPrice.trim()) {
      alert('لطفاً عنوان خدمت و قیمت پایه را وارد فرمایید.');
      return;
    }

    const slug = serviceFormData.slug.trim() || serviceFormData.title.trim().replace(/\s+/g, '-');

    if (editingServiceId) {
      updateService(editingServiceId, { ...serviceFormData, slug });
      showNotification('خدمت با موفقیت ویرایش شد.');
      setEditingServiceId(null);
      setShowAddServiceForm(false);
    } else {
      addService({ ...serviceFormData, slug });
      showNotification('خدمت جدید به سایت اضافه شد.');
      setShowAddServiceForm(false);
    }

    setServiceFormData({
      title: '',
      slug: '',
      shortDesc: '',
      fullDesc: '',
      icon: 'Wrench',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=600',
      features: ['اعزام فوری', 'ضمانت کتبی', 'قیمت منصفانه'],
      tools: ['فنر برقی', 'پمپ تراکم'],
      startingPrice: 'تماس بگیرید',
      priceNote: 'بر اساس تعرفه مصوب',
      guarantee: 'تضمین ۱۰۰٪ رفع مشکل',
    });
  };

  const startEditService = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setServiceFormData({
      title: service.title,
      slug: service.slug,
      shortDesc: service.shortDesc,
      fullDesc: service.fullDesc,
      icon: service.icon,
      image: service.image ?? '',
      features: service.features,
      tools: service.tools || ['فنر برقی', 'پمپ تراکم'],
      startingPrice: service.startingPrice,
      priceNote: service.priceNote || '',
      guarantee: service.guarantee,
      badge: service.badge,
    });
    setShowAddServiceForm(true);
  };

  const handleDuplicateService = (service: ServiceItem) => {
    const { id, ...rest } = service;
    addService({
      ...rest,
      title: `${rest.title} (کپی)`,
      slug: `${rest.slug || 'service'}-copy-${Date.now().toString().slice(-4)}`
    });
    showNotification(`خدمت «${service.title}» کپی گردید.`);
  };

  const handleDuplicateTariff = (tariff: TariffItem) => {
    const { id, ...rest } = tariff;
    addTariff({
      ...rest,
      title: `${rest.title} (کپی)`
    });
    showNotification(`تعرفه «${tariff.title}» کپی گردید.`);
  };

  const handleBatchPriceApply = (percent: number) => {
    if (!percent || percent === 0) return;
    const isIncrease = percent > 0;
    batchUpdateTariffs(percent);
    showNotification(`کلیه قیمت‌های جدول تعرفه با موفقیت ${toPersianDigits(Math.abs(percent))}٪ ${isIncrease ? 'افزایش' : 'کاهش'} یافت.`);
  };

  const handleAddCustomReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      alert('لطفاً نام و متن نظر را وارد نمایید.');
      return;
    }

    addAdminReview({
      author: newReviewAuthor.trim(),
      location: newReviewLocation.trim() || 'ساوه',
      service: newReviewService,
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      verified: true,
      approved: true,
    });

    setNewReviewAuthor('');
    setNewReviewComment('');
    setShowAddReviewModal(false);
    showNotification('نظر تایید شده با موفقیت ثبت و منتشر شد.');
  };

  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneFormData.name.trim()) {
      alert('لطفاً نام منطقه را وارد نمایید.');
      return;
    }

    if (editingZoneId) {
      updateNeighborhood(editingZoneId, zoneFormData);
      showNotification('منطقه با موفقیت ویرایش شد.');
      setEditingZoneId(null);
      setShowAddZoneModal(false);
    } else {
      addNeighborhood(zoneFormData);
      showNotification('منطقه جدید با موفقیت اضافه شد.');
      setShowAddZoneModal(false);
    }

    setZoneFormData({
      name: '',
      responseTimeMinutes: 15,
      activeTechs: 2,
      popularServices: ['لوله بازکنی فوری', 'تخلیه چاه'],
      isSpecialZone: false,
      priceMultiplier: 1,
      note: 'اعزام فوری شبانه‌روزی با تجهیزات کامل ژنراتور و فنر'
    });
  };

  const startEditZone = (zone: NeighborhoodInfo) => {
    setEditingZoneId(zone.id);
    setZoneFormData({
      name: zone.name,
      responseTimeMinutes: zone.responseTimeMinutes || 15,
      activeTechs: zone.activeTechs || 2,
      popularServices: zone.popularServices || ['لوله بازکنی فوری'],
      isSpecialZone: zone.isSpecialZone || false,
      priceMultiplier: zone.priceMultiplier || 1,
      note: zone.note || ''
    });
    setShowAddZoneModal(true);
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galFormData.title.trim()) {
      alert('لطفاً عنوان پروژه را وارد نمایید.');
      return;
    }

    if (galFormData.type === 'before-after') {
      if (!galFormData.beforeUrl?.trim() || !galFormData.afterUrl?.trim()) {
        alert('لطفاً هم آدرس عکس قبل و هم آدرس عکس بعد را مشخص نمایید (از طریق لینک یا آپلود مستقیم عکس).');
        return;
      }
    } else {
      if (!galFormData.mediaUrl?.trim()) {
        alert('لطفاً آدرس تصویر یا ویدیو را مشخص نمایید.');
        return;
      }
    }

    const payload: Omit<GalleryItem, 'id'> = {
      title: galFormData.title.trim(),
      category: galFormData.category,
      type: galFormData.type,
      mediaUrl: galFormData.type === 'before-after' 
        ? (galFormData.afterUrl || galFormData.beforeUrl || galFormData.mediaUrl) 
        : galFormData.mediaUrl,
      beforeUrl: galFormData.type === 'before-after' ? (galFormData.beforeUrl || '') : '',
      afterUrl: galFormData.type === 'before-after' ? (galFormData.afterUrl || '') : '',
      beforeLabel: galFormData.type === 'before-after' ? (galFormData.beforeLabel || 'وضعیت قبل از انجام کار') : '',
      afterLabel: galFormData.type === 'before-after' ? (galFormData.afterLabel || 'وضعیت بعد از اتمام کار و شستشو') : '',
      sliderHint: galFormData.type === 'before-after' ? (galFormData.sliderHint || '👈 دکمه وسط را به چپ و راست بکشید تا تغییر کیفیت را ببینید 👉') : '',
      highlights: Array.isArray(galFormData.highlights) ? galFormData.highlights : [],
      description: galFormData.description?.trim() || '',
      location: galFormData.location?.trim() || 'ساوه',
    };

    if (editingGalId) {
      updateGalleryItem(editingGalId, payload);
      showNotification('نمونه‌کار با موفقیت ویرایش گردید.');
      setEditingGalId(null);
      setShowAddGalForm(false);
    } else {
      addGalleryItem(payload);
      showNotification('نمونه‌کار جدید با موفقیت به گالری اضافه شد.');
      setShowAddGalForm(false);
    }

    setGalFormData({
      title: '',
      category: 'لوله بازکنی',
      type: 'image',
      mediaUrl: '',
      beforeUrl: '',
      afterUrl: '',
      beforeLabel: 'وضعیت قبل از انجام کار',
      afterLabel: 'وضعیت بعد از اتمام کار و شستشو',
      sliderHint: '👈 دکمه وسط را به چپ و راست بکشید تا تغییر کیفیت را ببینید 👉',
      highlights: [
        'اجرای سریع و تخصصی در ساوه',
        'تضمین کیفیت کتبی',
        'بدون کثیف‌کاری و با تجهیزات کامل'
      ],
      description: '',
      location: 'ساوه',
    });
    setNewHighlightInput('');
  };

  const startEditGallery = (item: GalleryItem) => {
    setEditingGalId(item.id);
    setGalFormData({
      title: item.title,
      category: item.category || 'لوله بازکنی',
      type: item.type || 'image',
      mediaUrl: item.mediaUrl || '',
      beforeUrl: item.beforeUrl || '',
      afterUrl: item.afterUrl || '',
      beforeLabel: item.beforeLabel || 'وضعیت قبل از انجام کار',
      afterLabel: item.afterLabel || 'وضعیت بعد از اتمام کار و شستشو',
      sliderHint: item.sliderHint || '👈 دکمه وسط را به چپ و راست بکشید تا تغییر کیفیت را ببینید 👉',
      highlights: Array.isArray(item.highlights) ? [...item.highlights] : [],
      description: item.description || '',
      location: item.location || 'ساوه',
    });
    setNewHighlightInput('');
    setShowAddGalForm(true);
  };

  const handleExportCSV = () => {
    const headers = 'شناسه,نام مشتری,شماره تماس,نوع خدمت,محله ساوه,آدرس,تاریخ,وضعیت\n';
    const rows = bookings.map(b => 
      `"${b.id}","${b.fullName}","${b.phoneNumber}","${b.serviceType}","${b.neighborhood}","${b.address}","${b.createdAt}","${b.status}"`
    ).join('\n');
    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `behkar-saveh-bookings-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportFullExcel = () => {
    let csv = '\uFEFF'; // UTF-8 BOM for Excel
    const dateStr = new Date().toLocaleDateString('fa-IR');
    const timeStr = new Date().toLocaleTimeString('fa-IR');

    // Section 1: Business Overview
    csv += '--- اطلاعات و مشخصات دفتر خدماتی بهکار ساوه ---\n';
    csv += `نام کسب و کار,${settings.businessName || 'دفتر خدماتی بهکار ساوه'}\n`;
    csv += `مدیریت,${settings.managerName || 'آقای زمانی'}\n`;
    csv += `تلفن اصلی,${settings.primaryPhone || '09124551750'}\n`;
    csv += `تلفن دوم,${settings.secondaryPhone || '09196562006'}\n`;
    csv += `روبیکا,${settings.rubikaId || '@Jshhshvsh'}\n`;
    csv += `آدرس,${settings.address || 'ساوه، میدان امام خمینی'}\n`;
    csv += `تاریخ خروجی,${dateStr} - ${timeStr}\n\n`;

    // Section 2: Bookings Table
    csv += '--- ۱. جدول درخواست‌ها و استعلام‌های مشتریان ---\n';
    csv += 'ردیف,شناسه,نام و نام خانوادگی,شماره تماس,نوع خدمت درخواستی,محله ساوه,آدرس دقیق,تاریخ ثبت,وضعیت سفارش,پیام یا توضیح مشتری\n';
    bookings.forEach((b, idx) => {
      csv += `"${idx + 1}","${b.id}","${(b.fullName || '').replace(/"/g, '""')}","${b.phoneNumber || ''}","${(b.serviceType || '').replace(/"/g, '""')}","${(b.neighborhood || '').replace(/"/g, '""')}","${(b.address || '').replace(/"/g, '""')}","${b.createdAt || ''}","${b.status || ''}","${(b.description || b.message || '').replace(/"/g, '""')}"\n`;
    });
    csv += '\n';

    // Section 3: Tariffs Table
    csv += '--- ۲. جدول نرخ‌ها و تعرفه‌های مصوب اتحادیه ---\n';
    csv += 'ردیف,دسته‌بندی,عنوان خدمت یا عملیات,واحد سنجش,بازه قیمت مصوب (تومان),توضیحات و نکات تکمیلی\n';
    tariffs.forEach((t, idx) => {
      csv += `"${idx + 1}","${(t.categoryName || t.category || '').replace(/"/g, '""')}","${(t.title || '').replace(/"/g, '""')}","${(t.unit || '').replace(/"/g, '""')}","${(t.priceRange || '').replace(/"/g, '""')}","${(t.note || '').replace(/"/g, '""')}"\n`;
    });
    csv += '\n';

    // Section 4: Services
    csv += '--- ۳. لیست خدمات تاسیساتی و کارت‌های معرفی ---\n';
    csv += 'ردیف,عنوان خدمت,شروع قیمت,نوع ضمانت,ابزارآلات و تجهیزات,توضیحات کوتاه\n';
    services.forEach((s, idx) => {
      csv += `"${idx + 1}","${(s.title || '').replace(/"/g, '""')}","${(s.startingPrice || '').replace(/"/g, '""')}","${(s.guarantee || '').replace(/"/g, '""')}","${((s.tools || []).join(' - ')).replace(/"/g, '""')}","${(s.shortDesc || '').replace(/"/g, '""')}"\n`;
    });
    csv += '\n';

    // Section 5: Reviews
    csv += '--- ۴. نظرات و بازخوردهای همشهریان ساوه ---\n';
    csv += 'ردیف,نام مشتری,منطقه یا محله,امتیاز (از ۵),وضعیت تایید,تاریخ ثبت,متن نظر\n';
    reviews.forEach((r, idx) => {
      csv += `"${idx + 1}","${(r.author || '').replace(/"/g, '""')}","${(r.location || 'ساوه').replace(/"/g, '""')}","${r.rating || 5}","${r.approved ? 'تایید شده و نمایان در سایت' : 'در انتظار تایید ادمین'}","${r.date || ''}","${(r.comment || '').replace(/"/g, '""')}"\n`;
    });
    csv += '\n';

    // Section 6: Neighborhoods
    csv += '--- ۵. محله‌ها و مناطق تحت پوشش ساوه ---\n';
    csv += 'ردیف,نام محله / شهرک,مدت زمان رسیدن سرویس‌کار (دقیقه),تعداد تکنسین فعال,وضعیت منطقه,توضیحات\n';
    neighborhoods.forEach((n, idx) => {
      csv += `"${idx + 1}","${(n.name || '').replace(/"/g, '""')}","${n.responseTimeMinutes || 15}","${n.activeTechs || 2}","${n.isSpecialZone ? 'منطقه ویژه / صنعتی' : 'عادی'}","${(n.note || '').replace(/"/g, '""')}"\n`;
    });
    csv += '\n';

    // Section 7: Gallery Summary
    csv += '--- ۶. آرشیو نمونه‌کارها و گالری (عکس و فیلم) ---\n';
    csv += 'ردیف,عنوان نمونه‌کار,دسته‌بندی,نوع مدیا,موقعیت پروژه,توضیحات\n';
    gallery.forEach((g, idx) => {
      csv += `"${idx + 1}","${(g.title || '').replace(/"/g, '""')}","${(g.category || '').replace(/"/g, '""')}","${g.type || 'image'}","${(g.location || 'ساوه').replace(/"/g, '""')}","${(g.description || '').replace(/"/g, '""')}"\n`;
    });
    csv += '\n';

    // Section 8: Media Vault Archive
    csv += '--- ۷. مخزن و آرشیو کلیه تصاویر و رسانه‌ها (Media Vault) ---\n';
    csv += 'ردیف,عنوان فایل,دسته‌بندی,تاریخ آپلود,نام فایل اصلی,وضعیت فعال\n';
    (settings.mediaVault || []).forEach((m, idx) => {
      csv += `"${idx + 1}","${(m.title || '').replace(/"/g, '""')}","${(m.category || '').replace(/"/g, '""')}","${m.uploadedAt || ''}","${(m.originalFileName || '').replace(/"/g, '""')}","${m.isCurrentActive ? 'فعال' : 'بایگانی'}"\n`;
    });
    csv += '\n';

    // Section 9: Dynamic Messengers and Custom Buttons
    csv += '--- ۸. پیام‌رسان‌ها و دکمه‌های اختصاصی سایت ---\n';
    csv += 'ردیف,نوع,عنوان,لینک مستقیم,رنگ یا نوع,وضعیت\n';
    (settings.messengers || []).forEach((msg, idx) => {
      csv += `"${idx + 1}","پیام‌رسان","${(msg.name || '').replace(/"/g, '""')}","${(msg.link || '').replace(/"/g, '""')}","${msg.colorTheme || msg.customColorHex || ''}","${msg.isActive !== false ? 'فعال' : 'غیرفعال'}"\n`;
    });
    (settings.customButtons || []).forEach((btn, idx) => {
      csv += `"${idx + 1}","دکمه اختصاصی","${(btn.title || '').replace(/"/g, '""')}","${(btn.url || '').replace(/"/g, '""')}","${btn.variant || btn.type || ''}","${(btn.isVisible !== false && btn.visible !== false) ? 'فعال' : 'غیرفعال'}"\n`;
    });
    csv += '\n';

    // Section 10: Stats Summary
    csv += '--- ۹. آمار واقعی و لاگ‌های تماس ---\n';
    csv += `کل تماس‌های ثبت‌شده,${stats.totalCalls || 0}\n`;
    csv += `کل کلیک‌های روبیکا,${stats.totalRubikaClicks || 0}\n`;
    csv += `کل استفاده از استعلام آنلاین,${stats.totalEstimates || 0}\n`;
    csv += `کل بازدیدها,${stats.totalVisits || 0}\n\n`;
    csv += 'تاریخ و زمان لاگ,نوع رویداد,توضیحات رویداد\n';
    (stats.logs || []).slice(0, 100).forEach(log => {
      csv += `"${log.timestamp || ''}","${log.type || ''}","${(log.detail || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateFileName = new Date().toISOString().slice(0, 10);
    a.download = `behkar-saveh-full-database-${dateFileName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('خروجی کامل اکسل از کلیه جداول سایت با موفقیت دانلود شد.');
  };

  const handlePrintOrPdfReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('لطفاً اجازه باز شدن پنجره پاپ‌آپ (Pop-up) را در مرورگر فعال کنید.');
      return;
    }

    const dateStr = new Date().toLocaleDateString('fa-IR');
    const timeStr = new Date().toLocaleTimeString('fa-IR');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
      <head>
        <meta charset="utf-8" />
        <title>گزارش و شناسنامه رسمی دفتر خدماتی بهکار ساوه - ${dateStr}</title>
        <style>
          @page { size: A4; margin: 12mm; }
          body { font-family: Tahoma, 'Segoe UI', Arial, sans-serif; direction: rtl; color: #1e293b; line-height: 1.6; font-size: 12px; margin: 0; padding: 16px; }
          .header { border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 18px; font-weight: bold; color: #0369a1; margin: 0; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
          .meta-box { font-size: 11px; color: #475569; text-align: left; }
          .section-title { font-size: 14px; font-weight: bold; color: #0f172a; margin: 18px 0 8px 0; border-right: 4px solid #0284c7; padding-right: 8px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
          .stat-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; background: #f8fafc; text-align: center; }
          .stat-num { font-size: 16px; font-weight: bold; color: #0284c7; }
          .stat-label { font-size: 11px; color: #64748b; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; }
          th { background: #f1f5f9; color: #334155; font-weight: bold; padding: 6px 8px; border: 1px solid #cbd5e1; text-align: right; }
          td { padding: 5px 8px; border: 1px solid #e2e8f0; text-align: right; }
          tr:nth-child(even) { background: #fafafa; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; background: #e0f2fe; color: #0369a1; }
          .footer { margin-top: 24px; border-top: 1px dashed #cbd5e1; padding-top: 10px; font-size: 10px; color: #94a3b8; text-align: center; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${settings.businessName || 'دفتر خدماتی بهکار ساوه'}</h1>
            <div class="subtitle">مدیریت: ${settings.managerName || 'آقای زمانی'} | تلفن تماس فوری: ${formatPersianPhone(settings.primaryPhone || '09124551750')} | تلفن دوم: ${formatPersianPhone(settings.secondaryPhone || '09196562006')}</div>
            <div class="subtitle">پوشش سراسری کلیه مناطق و شهرک‌های مسکونی و صنعتی ساوه و حومه | شبانه‌روزی ۲۴ ساعته</div>
          </div>
          <div class="meta-box">
            <div>تاریخ گزارش: <strong>${dateStr}</strong></div>
            <div>ساعت صدور: <strong>${timeStr}</strong></div>
            <div>نسخه نرم‌افزار: <strong>۲.۰ (بهکار ساوه)</strong></div>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-num">${toPersianDigits(bookings.length)}</div>
            <div class="stat-label">درخواست‌های ثبت‌شده مشتریان</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">${toPersianDigits(tariffs.length)}</div>
            <div class="stat-label">ردیف تعرفه‌های مصوب</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">${toPersianDigits(reviews.length)}</div>
            <div class="stat-label">نظرات و رضایت مشتریان</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">${toPersianDigits(stats.totalCalls)}</div>
            <div class="stat-label">کل تماس‌های گرفته‌شده</div>
          </div>
        </div>

        <div class="section-title">۱. لیست استعلام‌ها و درخواست‌های ثبت‌شده مشتریان</div>
        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>نام مشتری</th>
              <th>شماره تماس</th>
              <th>نوع خدمت</th>
              <th>محله ساوه</th>
              <th>تاریخ ثبت</th>
              <th>وضعیت</th>
            </tr>
          </thead>
          <tbody>
            ${bookings.length === 0 ? '<tr><td colspan="7" style="text-align: center; color: #94a3b8;">موردی ثبت نشده است.</td></tr>' : bookings.map((b, i) => `
              <tr>
                <td>${toPersianDigits(i + 1)}</td>
                <td><strong>${b.fullName || '-'}</strong></td>
                <td>${formatPersianPhone(b.phoneNumber || '-')}</td>
                <td>${b.serviceType || '-'}</td>
                <td>${b.neighborhood || '-'}</td>
                <td>${b.createdAt || '-'}</td>
                <td><span class="badge">${b.status || 'ثبت شده'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">۲. لیست تعرفه‌ها و نرخ‌های مصوب اتحادیه در ساوه</div>
        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>دسته‌بندی</th>
              <th>عنوان خدمت</th>
              <th>واحد</th>
              <th>بازه قیمت مصوب</th>
              <th>توضیحات و ضمانت</th>
            </tr>
          </thead>
          <tbody>
            ${tariffs.map((t, i) => `
              <tr>
                <td>${toPersianDigits(i + 1)}</td>
                <td>${t.categoryName || t.category}</td>
                <td><strong>${t.title}</strong></td>
                <td>${t.unit}</td>
                <td style="color: #059669; font-weight: bold;">${toPersianDigits(t.priceRange)} تومان</td>
                <td>${t.note || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">۳. خدمات اصلی و کارت‌های فعال تاسیساتی</div>
        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>عنوان خدمت</th>
              <th>تضمین کتبی</th>
              <th>شروع قیمت</th>
              <th>تجهیزات و ویژگی‌ها</th>
            </tr>
          </thead>
          <tbody>
            ${services.map((s, i) => `
              <tr>
                <td>${toPersianDigits(i + 1)}</td>
                <td><strong>${s.title}</strong></td>
                <td>${s.guarantee || 'تضمین کیفیت'}</td>
                <td>${toPersianDigits(s.startingPrice)}</td>
                <td>${(s.tools || []).join('، ')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">۴. مشخصات سئو و وضعیت پوشش‌دهی در ساوه</div>
        <table>
          <tbody>
            <tr>
              <td style="width: 25%; font-weight: bold; background: #f8fafc;">عنوان متاتگ سئو گوگل</td>
              <td>${settings.seoTitle || '-'}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; background: #f8fafc;">توضیحات متاتگ سئو</td>
              <td>${settings.seoDescription || '-'}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; background: #f8fafc;">محله‌های تحت پوشش ساوه (${toPersianDigits(neighborhoods.length)} محله)</td>
              <td>${neighborhoods.map(n => n.name).join(' • ')}</td>
            </tr>
          </tbody>
        </table>

        <div class="section-title">۵. نظرات تاییدشده همشهریان ساوه (${toPersianDigits(reviews.length)} نظر)</div>
        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>نام مشتری</th>
              <th>منطقه</th>
              <th>امتیاز</th>
              <th>متن نظر</th>
            </tr>
          </thead>
          <tbody>
            ${reviews.slice(0, 10).map((r, i) => `
              <tr>
                <td>${toPersianDigits(i + 1)}</td>
                <td><strong>${r.author || '-'}</strong></td>
                <td>${r.location || 'ساوه'}</td>
                <td style="color: #d97706; font-weight: bold;">${toPersianDigits(r.rating || 5)} ستاره</td>
                <td>${r.comment || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">۶. آرشیو گالری (${toPersianDigits(gallery.length)} آیتم) و مخزن تصاویر و رسانه‌ها (${toPersianDigits((settings.mediaVault || []).length)} فایل)</div>
        <table>
          <tbody>
            <tr>
              <td style="width: 25%; font-weight: bold; background: #f8fafc;">تعداد نمونه‌کارهای تصویری و ویدئویی</td>
              <td>${toPersianDigits(gallery.length)} مورد ثبت‌شده با توضیحات و برچسب قبل و بعد</td>
            </tr>
            <tr>
              <td style="font-weight: bold; background: #f8fafc;">مخزن رسانه‌های اختصاصی (Media Vault)</td>
              <td>${toPersianDigits((settings.mediaVault || []).length)} فایل عکس و ویدئو با کدگذاری Base64 در نسخه پشتیبان</td>
            </tr>
            <tr>
              <td style="font-weight: bold; background: #f8fafc;">پیام‌رسان‌های فعال</td>
              <td>${(settings.messengers || []).map(m => m.name).join(' • ') || 'روبیکا'}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          گزارش و آرشیو رسمی سامانه اطلاعاتی دفتر خدماتی بهکار ساوه | صادر شده در تاریخ ${dateStr} ساعت ${timeStr} | مدیریت: آقای زمانی
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    showNotification('پنجره چاپ و ایجاد فایل PDF باز شد (می‌توانید گزینه Save as PDF را انتخاب کنید).');
  };

  const handleResetCurrentTab = () => {
    let tabTitle = '';
    switch (activeTab) {
      case 'bookings': tabTitle = 'درخواست‌های مشتریان'; break;
      case 'reviews': tabTitle = 'نظرات مشتریان'; break;
      case 'content': tabTitle = 'محتوا و متون سایت'; break;
      case 'tariffs': tabTitle = 'تعرفه‌ها و قیمت‌ها'; break;
      case 'discounts': tabTitle = 'تخفیفات و بنر ویژه'; break;
      case 'services': tabTitle = 'خدمات اصلی'; break;
      case 'neighborhoods': tabTitle = 'مناطق ساوه'; break;
      case 'stats': tabTitle = 'آمار بازدید'; break;
      case 'gallery': tabTitle = 'نمونه‌کارها'; break;
      case 'general': tabTitle = 'مشخصات عمومی'; break;
      case 'seo': tabTitle = 'تنظیمات سئو'; break;
    }

    const freshSettings = JSON.parse(JSON.stringify(initialSiteSettings));

    switch (activeTab) {
      case 'bookings':
        resetBookingsToDefault();
        showNotification('درخواست‌ها بازنشانی شدند.');
        break;
      case 'reviews':
        resetReviewsToDefault();
        showNotification('نظرات مشتریان بازنشانی شدند.');
        break;
      case 'content':
      case 'general':
      case 'seo':
      case 'discounts':
        resetSettingsToDefault();
        setLocalSettings(freshSettings);
        showNotification('تنظیمات این بخش با موفقیت بازنشانی شدند.');
        break;
      case 'tariffs':
        resetTariffsToDefault();
        showNotification('تعرفه‌ها به حالت اولیه بازگشتند.');
        break;
      case 'services':
        resetServicesToDefault();
        showNotification('خدمات به حالت اولیه بازگشتند.');
        break;
      case 'neighborhoods':
        resetNeighborhoodsToDefault();
        showNotification('مناطق ساوه بازنشانی شدند.');
        break;
      case 'stats':
        clearStatsLogs();
        showNotification('آمار بازدید صفر شد.');
        break;
      case 'gallery':
        resetGalleryToDefault();
        showNotification('نمونه‌کارها بازنشانی شدند.');
        break;
    }
  };

  const filteredTariffs = tariffs.filter(t => {
    const matchesCategory = tariffCategoryFilter === 'all' || t.category === tariffCategoryFilter;
    const query = tariffSearchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      t.title.toLowerCase().includes(query) ||
      (t.note && t.note.toLowerCase().includes(query)) ||
      (t.categoryName && t.categoryName.toLowerCase().includes(query)) ||
      (t.priceRange && t.priceRange.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-2xl text-right overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="p-3 sm:p-5 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0f172a]/80 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white leading-snug">
                  پنل اختصاصی مدیریت دفتر بهکار ساوه
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                  مدیریت جامع
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                مدیریت کامل تعرفه‌ها، خدمات، نظرات، مناطق، آمار واقعی و تنظیمات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isAdminLoggedIn && (
              <button
                onClick={() => {
                  logoutAdmin();
                  setIsAdminModalOpen(false);
                  showNotification('شما با موفقیت از پنل مدیریت خارج شدید.');
                }}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border border-red-200 dark:border-red-900"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">خروج از پنل</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {!isAdminLoggedIn ? (
          /* Login Form with Security Protections */
          <div className="p-6 sm:p-10 max-w-md mx-auto w-full my-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-800 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              ورود امن به پنل مدیریت دفتر بهکار ساوه
            </h4>
            <p className="text-xs text-slate-500 mb-5">
              جهت دسترسی به پنل، مشخصات احراز هویت مدیریت را وارد فرمایید.
            </p>

            {remainingLockoutSec > 0 ? (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs font-bold flex items-start gap-2.5 mb-4 text-right animate-pulse">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-black">سیستم امنیتی فعال شد: مسدودی موقت ورود</p>
                  <p className="text-[11px] font-normal mt-1 opacity-90">
                    به دلیل بیش از ۵ بار تلاش ناموفق، دسترسی موقتاً مسدود گردید.
                  </p>
                  <div className="mt-2 text-xs font-mono font-bold bg-red-200/60 dark:bg-red-900/60 px-2.5 py-1 rounded-lg inline-block">
                    زمان انتظار: {toPersianDigits(remainingLockoutSec)} ثانیه
                  </div>
                </div>
              </div>
            ) : null}

            <form onSubmit={handleLogin} className="space-y-3.5 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نام کاربری مدیر:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    dir="ltr"
                    required
                    disabled={remainingLockoutSec > 0}
                    placeholder="نام کاربری مدیر"
                    value={usernameInput}
                    onChange={e => {
                      setUsernameInput(e.target.value);
                      setAuthError(false);
                    }}
                    className="w-full py-2.5 pr-10 pl-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm outline-hidden focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  کلمه عبور اختصاصی مدیر:
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    dir="ltr"
                    required
                    disabled={remainingLockoutSec > 0}
                    placeholder="کلمه عبور مدیر"
                    value={passwordInput}
                    onChange={e => {
                      setPasswordInput(e.target.value);
                      setAuthError(false);
                    }}
                    className="w-full py-2.5 pr-10 pl-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm outline-hidden focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                    title={showLoginPassword ? 'مخفی‌سازی رمز' : 'نمایش رمز'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {authError && remainingLockoutSec === 0 && (
                  <div className="flex items-center gap-1 text-xs font-bold text-red-500 mt-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>نام کاربری یا کلمه عبور وارد شده اشتباه است. (تلاش ناموفق: {toPersianDigits(failedAttempts)} از ۵)</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={remainingLockoutSec > 0}
                className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <Unlock className="w-4 h-4" />
                <span>ورود به پنل مدیریت</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>سامانه مجهز به حفاظت امنیتی ضد نفوذ و ارتباط امن رمزگذاری‌شده</span>
            </div>
          </div>
        ) : (
          /* Logged In Workspace */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-slate-50 dark:bg-[#0f172a] p-2 sm:p-3 border-b md:border-b-0 md:border-l border-slate-200 dark:border-slate-800 shrink-0 flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'bookings', label: 'درخواست‌های مشتریان', icon: Phone, badge: bookings.filter(b => b.status === 'pending').length },
                { id: 'visibility', label: 'فعال/غیرفعال‌سازی بخش‌های سایت', icon: Eye },
                { id: 'reviews', label: 'تایید و مدیریت نظرات', icon: Star, badge: reviews.filter(r => !r.approved).length },
                { id: 'content', label: 'متن‌ها، ضمانت و دکمه‌ها', icon: Layers },
                { id: 'tariffs', label: 'مدیریت تعرفه و قیمت‌ها', icon: DollarSign, badge: tariffs.length },
                { id: 'discounts', label: 'تخفیفات و بنر ویژه', icon: Percent, badge: settings.showDiscount ? 1 : 0 },
                { id: 'services', label: 'مدیریت خدمات و کارت‌ها', icon: Wrench, badge: services.length },
                { id: 'neighborhoods', label: 'مدیریت مناطق پوشش', icon: MapPin, badge: neighborhoods.length },
                { id: 'stats', label: 'آمار واقعی و لاگ تماس', icon: Activity },
                { id: 'gallery', label: 'گالری و نمونه‌کارها', icon: ImageIcon },
                { id: 'media', label: 'مخزن و آرشیو کلیه تصاویر', icon: HardDrive, badge: (settings.mediaVault || []).length },
                { id: 'backup', label: 'پشتیبان‌گیری و بازیابی جامع', icon: Database },
                { id: 'general', label: 'مشخصات، روبیکا و رمز', icon: Settings },
                { id: 'seo', label: 'سئو و رتبه ۱ گوگل', icon: Globe },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-between p-2 sm:p-2.5 md:p-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-right cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge !== undefined && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : tab.badge > 0 && tab.id === 'reviews' 
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {toPersianDigits(tab.badge)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Content Pane */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-white dark:bg-[#1e293b]">
              
              {/* Section Reset Bar */}
              <div className="mb-4 pb-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  تنظیمات این بخش
                </span>
                <button
                  type="button"
                  onClick={handleResetCurrentTab}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-102"
                  title="بازنشانی این بخش به حالت اولیه"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>بازنشانی این بخش</span>
                </button>
              </div>

              {/* Flash Notification Message */}
              {saveSuccessMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* TAB 1: BOOKINGS */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        درخواست‌های اعزام سرویس‌کار ثبت شده در سایت
                      </h4>
                      <p className="text-xs text-slate-500">
                        مجموع درخواست‌ها: {toPersianDigits(bookings.length)} مورد ({toPersianDigits(bookings.filter(b => b.status === 'pending').length)} مورد در انتظار بررسی)
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={handleExportCSV}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>خروجی اکسل (CSV)</span>
                      </button>
                    </div>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      هنوز هیچ درخواستی در سامانه ثبت نشده است.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookings.map(b => (
                        <div
                          key={b.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            b.status === 'pending'
                              ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
                              : b.status === 'contacted'
                              ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/60'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-80'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm text-slate-900 dark:text-white">
                                {b.fullName}
                              </span>
                              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                {b.serviceType}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {toPersianDigits(b.createdAt)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 mb-3">
                            <div className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-emerald-500" />
                              <a href={`tel:${b.phoneNumber}`} className="font-mono font-bold text-blue-600 hover:underline">
                                {formatPersianPhone(b.phoneNumber)}
                              </a>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-red-500" />
                              <span>منطقه: {b.neighborhood} - {b.address}</span>
                            </div>
                          </div>

                          {b.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/50 p-2.5 rounded-xl mb-3">
                              توضیحات: {b.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateBookingStatus(b.id, 'contacted')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                                  b.status === 'contacted'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                تماس گرفته شد
                              </button>
                              <button
                                onClick={() => updateBookingStatus(b.id, 'completed')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                                  b.status === 'completed'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                انجام و تحویل شد
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                deleteBooking(b.id);
                                showNotification('درخواست حذف شد.');
                              }}
                              className="px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                              title="حذف این درخواست"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: REVIEWS MODERATION */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        تایید، بررسی و مدیریت نظرات مشتریان
                      </h4>
                      <p className="text-xs text-slate-500">
                        نظرات ثبت‌شده توسط مشتریان ابتدا در وضعیت «در انتظار تایید» قرار می‌گیرند و پس از تایید در سایت نمایش داده می‌شوند.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddReviewModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ثبت نظر رسمی مدیر</span>
                    </button>
                  </div>

                  {/* Add Review by Admin Modal */}
                  {showAddReviewModal && (
                    <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 mb-4 animate-in fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-xs sm:text-sm text-blue-900 dark:text-blue-200">
                          افزودن نظر جدید با تایید مستقیم
                        </h5>
                        <button
                          onClick={() => setShowAddReviewModal(false)}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleAddCustomReview} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              نام مشتری:
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="مثال: مهندس رضایی"
                              value={newReviewAuthor}
                              onChange={e => setNewReviewAuthor(e.target.value)}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              محله / منطقه:
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: شهر صنعتی کاوه"
                              value={newReviewLocation}
                              onChange={e => setNewReviewLocation(e.target.value)}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              خدمت:
                            </label>
                            <input
                              type="text"
                              value={newReviewService}
                              onChange={e => setNewReviewService(e.target.value)}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            متن نظر:
                          </label>
                          <textarea
                            rows={2}
                            required
                            placeholder="متن رضایت مشتری..."
                            value={newReviewComment}
                            onChange={e => setNewReviewComment(e.target.value)}
                            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setShowAddReviewModal(false)}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold"
                          >
                            انصراف
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                          >
                            ثبت و تایید نظر
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Reviews List */}
                  {reviews.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      هیچ نظری در سامانه وجود ندارد.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            !rev.approved
                              ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {rev.author}
                              </span>
                              <span className="text-xs text-slate-500">
                                ({rev.location})
                              </span>
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {rev.service}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {!rev.approved ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md">
                                  <Clock className="w-3 h-3" />
                                  <span>در انتظار تایید</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>منتشر شده در سایت</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed mb-3 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl">
                            "{rev.comment}"
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              ))}
                              <span className="mr-1 text-slate-500 font-normal">
                                ({toPersianDigits(rev.rating)} ستاره)
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {!rev.approved ? (
                                <button
                                  onClick={() => {
                                    approveReview(rev.id);
                                    showNotification('نظر تایید شد و هم‌اکنون در سایت نمایش داده می‌شود.');
                                  }}
                                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>تایید و انتشار</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    unapproveReview(rev.id);
                                    showNotification('نظر از حالت انتشار خارج شد.');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                                >
                                  لغو تایید
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  deleteReview(rev.id);
                                  showNotification('نظر با موفقیت حذف شد.');
                                }}
                                className="p-1 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
                                title="حذف نظر"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: SECTIONS VISIBILITY MANAGEMENT (مدیریت نمایش/عدم نمایش بخش‌های سایت) */}
              {activeTab === 'visibility' && (
                <div className="space-y-6">
                  {/* Top Header & Fast Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <span>مدیریت نمایش و فعال‌سازی بخش‌های اصلی سایت</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        با یک کلیک ساده می‌توانید هر کدام از بخش‌های زیر را در سایت فعال یا غیرفعال (مخفی) کنید.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800/90 p-2 sm:px-3 sm:py-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-900 dark:text-white block">
                          {[
                            localSettings.showPricingSection !== false,
                            localSettings.showServicesSection !== false,
                            localSettings.showGallerySection !== false,
                            localSettings.showCoverageMapSection !== false,
                            localSettings.showWhyUsSection !== false,
                            localSettings.showFaqSection !== false,
                            localSettings.showReviewsSection !== false,
                            localSettings.showHeroSection !== false
                          ].filter(Boolean).length >= 7
                            ? 'تمام بخش‌ها فعال هستند'
                            : 'مخفی‌سازی موقت بخش‌ها'}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {[
                            localSettings.showPricingSection !== false,
                            localSettings.showServicesSection !== false,
                            localSettings.showGallerySection !== false,
                            localSettings.showCoverageMapSection !== false,
                            localSettings.showWhyUsSection !== false,
                            localSettings.showFaqSection !== false,
                            localSettings.showReviewsSection !== false,
                            localSettings.showHeroSection !== false
                          ].filter(Boolean).length >= 7
                            ? 'سوئیچ جهت غیرفعال‌سازی موقت'
                            : 'سوئیچ جهت فعال‌سازی سراسری'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const isCurrentlyActive = [
                            localSettings.showPricingSection !== false,
                            localSettings.showServicesSection !== false,
                            localSettings.showGallerySection !== false,
                            localSettings.showCoverageMapSection !== false,
                            localSettings.showWhyUsSection !== false,
                            localSettings.showFaqSection !== false,
                            localSettings.showReviewsSection !== false,
                            localSettings.showHeroSection !== false
                          ].filter(Boolean).length >= 7;

                          if (isCurrentlyActive) {
                            const updated = {
                              ...localSettings,
                              showHeroSection: true,
                              showServicesSection: false,
                              showPricingSection: false,
                              showGallerySection: false,
                              showCoverageMapSection: false,
                              showWhyUsSection: false,
                              showReviewsSection: false,
                              showFaqSection: false,
                            };
                            setLocalSettings(updated);
                            updateSettings(updated);
                            showNotification('تمامی بخش‌های فرعی به صورت موقت مخفی شدند.');
                          } else {
                            const updated = {
                              ...localSettings,
                              showHeroSection: true,
                              showServicesSection: true,
                              showPricingSection: true,
                              showGallerySection: true,
                              showCoverageMapSection: true,
                              showWhyUsSection: true,
                              showReviewsSection: true,
                              showFaqSection: true,
                              showFloatingBar: true,
                            };
                            setLocalSettings(updated);
                            updateSettings(updated);
                            showNotification('تمامی بخش‌های وب‌سایت با موفقیت فعال و نمایان شدند.');
                          }
                        }}
                        className={`w-14 h-7.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner ${
                          [
                            localSettings.showPricingSection !== false,
                            localSettings.showServicesSection !== false,
                            localSettings.showGallerySection !== false,
                            localSettings.showCoverageMapSection !== false,
                            localSettings.showWhyUsSection !== false,
                            localSettings.showFaqSection !== false,
                            localSettings.showReviewsSection !== false,
                            localSettings.showHeroSection !== false
                          ].filter(Boolean).length >= 7 
                            ? 'bg-emerald-600' 
                            : 'bg-slate-400 dark:bg-slate-700'
                        }`}
                        dir="ltr"
                        role="switch"
                        aria-checked={[
                          localSettings.showPricingSection !== false,
                          localSettings.showServicesSection !== false,
                          localSettings.showGallerySection !== false,
                          localSettings.showCoverageMapSection !== false,
                          localSettings.showWhyUsSection !== false,
                          localSettings.showFaqSection !== false,
                          localSettings.showReviewsSection !== false,
                          localSettings.showHeroSection !== false
                        ].filter(Boolean).length >= 7}
                      >
                        <span
                          className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center text-[10px] font-bold ${
                            [
                              localSettings.showPricingSection !== false,
                              localSettings.showServicesSection !== false,
                              localSettings.showGallerySection !== false,
                              localSettings.showCoverageMapSection !== false,
                              localSettings.showWhyUsSection !== false,
                              localSettings.showFaqSection !== false,
                              localSettings.showReviewsSection !== false,
                              localSettings.showHeroSection !== false
                            ].filter(Boolean).length >= 7
                              ? 'translate-x-[26px] text-emerald-600'
                              : 'translate-x-0 text-slate-500'
                          }`}
                        >
                          {[
                            localSettings.showPricingSection !== false,
                            localSettings.showServicesSection !== false,
                            localSettings.showGallerySection !== false,
                            localSettings.showCoverageMapSection !== false,
                            localSettings.showWhyUsSection !== false,
                            localSettings.showFaqSection !== false,
                            localSettings.showReviewsSection !== false,
                            localSettings.showHeroSection !== false
                          ].filter(Boolean).length >= 7 ? '✓' : '✕'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Status Bar */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold">
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>
                        تغییرات بلافاصله پس از کلیک روی دکمه در سایت اعمال می‌شوند (بدون نیاز به بارگذاری مجدد).
                      </span>
                    </div>
                    <span className="font-extrabold text-indigo-700 dark:text-indigo-300 bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      وضعیت کنونی: {[
                        localSettings.showPricingSection !== false,
                        localSettings.showServicesSection !== false,
                        localSettings.showGallerySection !== false,
                        localSettings.showCoverageMapSection !== false,
                        localSettings.showWhyUsSection !== false,
                        localSettings.showFaqSection !== false,
                        localSettings.showReviewsSection !== false,
                        localSettings.showHeroSection !== false
                      ].filter(Boolean).length} از ۸ بخش فعال
                    </span>
                  </div>

                  {/* Special Master Feature: Global Call for Price Toggle */}
                  <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-md ${
                    localSettings.forceCallForPrice
                      ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-amber-500 dark:border-amber-500/80 shadow-amber-500/10'
                      : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/40'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-xs ${
                          localSettings.forceCallForPrice
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                        }`}>
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h5 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                              تغییر همه قیمت‌های سایت به «برای استعلام قیمت تماس بگیرید»
                            </h5>
                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                              localSettings.forceCallForPrice
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                            }`}>
                              {localSettings.forceCallForPrice ? '● حالت استعلام تلفنی فعال است' : '○ نمایش قیمت‌های ریالی معمولی'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            با فعال‌سازی این دکمه، تمام مبالغ و تعرفه‌ها در همه جای سایت (کارت‌های خدمات، محاسبه‌گر استعلام و جدول‌ها) برداشته شده و با عبارت «برای استعلام قیمت تماس بگیرید» جایگزین می‌شوند.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...localSettings, forceCallForPrice: !localSettings.forceCallForPrice };
                            setLocalSettings(updated);
                            updateSettings(updated);
                            showNotification(
                              updated.forceCallForPrice 
                                ? 'حالت استعلام تلفنی فعال شد؛ کلیه قیمت‌های سایت به «برای استعلام قیمت تماس بگیرید» تغییر یافتند.' 
                                : 'نمایش مبالغ و قیمت‌های ریالی در سایت فعال شد.'
                            );
                          }}
                          className={`w-14 h-7.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner ${
                            localSettings.forceCallForPrice ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          dir="ltr"
                          role="switch"
                          aria-checked={Boolean(localSettings.forceCallForPrice)}
                        >
                          <span
                            className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                              localSettings.forceCallForPrice ? 'translate-x-[26px]' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Custom text preview / editor */}
                    {localSettings.forceCallForPrice && (
                      <div className="mt-3.5 pt-3.5 border-t border-amber-200/80 dark:border-amber-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Tag className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-bold">متن جایگزین قیمت:</span>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="text"
                            value={localSettings.callForPriceCustomText || 'برای استعلام قیمت تماس بگیرید'}
                            onChange={e => {
                              const updated = { ...localSettings, callForPriceCustomText: e.target.value };
                              setLocalSettings(updated);
                              updateSettings(updated);
                            }}
                            placeholder="برای استعلام قیمت تماس بگیرید"
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-hidden w-full sm:w-72 text-right"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...localSettings, callForPriceCustomText: 'برای استعلام قیمت تماس بگیرید' };
                              setLocalSettings(updated);
                              updateSettings(updated);
                              showNotification('متن به حالت پیش‌فرض «برای استعلام قیمت تماس بگیرید» بازنشانی شد.');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                          >
                            پیش‌فرض
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">

                    {/* 1. Pricing & Tariffs Section */}
                    <div className={`p-4 rounded-2xl border-2 transition-all shadow-xs ${
                      localSettings.showPricingSection !== false
                        ? 'bg-white dark:bg-slate-900 border-blue-500/60 dark:border-blue-500/40 shadow-blue-500/5'
                        : 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                    }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                            localSettings.showPricingSection !== false
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shadow-xs'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            <Calculator className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h5 className="text-sm font-black text-slate-900 dark:text-white">
                                استعلام آنلاین و تعرفه مصوب قیمت خدمات در شهر ساوه
                              </h5>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                localSettings.showPricingSection !== false
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {localSettings.showPricingSection !== false ? '● در حال نمایش' : '○ مخفی شده'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              شامل محاسبه‌گر قیمت هوشمند آنلاین، جدول دسته‌بندی‌شده کلیه تعرفه‌های لوله بازکنی و تخلیه چاه ساوه و فرم استعلام سریع.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...localSettings, showPricingSection: !(localSettings.showPricingSection !== false) };
                            setLocalSettings(updated);
                            updateSettings(updated);
                            showNotification(updated.showPricingSection ? 'بخش «استعلام آنلاین و تعرفه قیمت» در سایت فعال شد.' : 'بخش «استعلام آنلاین و تعرفه قیمت» از سایت مخفی شد.');
                          }}
                          className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner mt-1 ${
                            localSettings.showPricingSection !== false ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          dir="ltr"
                          role="switch"
                          aria-checked={localSettings.showPricingSection !== false}
                        >
                          <span
                            className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                              localSettings.showPricingSection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* 2. Core Services Section */}
                    <div className={`p-4 rounded-2xl border-2 transition-all shadow-xs ${
                      localSettings.showServicesSection !== false
                        ? 'bg-white dark:bg-slate-900 border-emerald-500/60 dark:border-emerald-500/40 shadow-emerald-500/5'
                        : 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                    }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                            localSettings.showServicesSection !== false
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shadow-xs'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            <Wrench className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h5 className="text-sm font-black text-slate-900 dark:text-white">
                                خدمات جامع تاسیساتی، تخلیه چاه و ایزوگام در ساوه
                              </h5>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                localSettings.showServicesSection !== false
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {localSettings.showServicesSection !== false ? '● در حال نمایش' : '○ مخفی شده'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              کارت‌های تفکیکی ۶ خدمت اصلی: لوله بازکنی، تخلیه چاه، حفر چاه نو، ایزوگام، تعویض سنگ توالت و لوله‌کشی با دکمه‌های درخواست مستقیم.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...localSettings, showServicesSection: !(localSettings.showServicesSection !== false) };
                            setLocalSettings(updated);
                            updateSettings(updated);
                            showNotification(updated.showServicesSection ? 'بخش «خدمات جامع تاسیساتی» در سایت فعال شد.' : 'بخش «خدمات جامع تاسیساتی» از سایت مخفی شد.');
                          }}
                          className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner mt-1 ${
                            localSettings.showServicesSection !== false ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          dir="ltr"
                          role="switch"
                          aria-checked={localSettings.showServicesSection !== false}
                        >
                          <span
                            className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                              localSettings.showServicesSection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* 3. Gallery & Before/After Projects Section */}
                    <div className={`p-4 rounded-2xl border-2 transition-all shadow-xs ${
                      localSettings.showGallerySection !== false
                        ? 'bg-white dark:bg-slate-900 border-purple-500/60 dark:border-purple-500/40 shadow-purple-500/5'
                        : 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                    }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                            localSettings.showGallerySection !== false
                              ? 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 shadow-xs'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h5 className="text-sm font-black text-slate-900 dark:text-white">
                                نمونه پروژه‌های انجام شده دفتر خدماتی بهکار
                              </h5>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                localSettings.showGallerySection !== false
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {localSettings.showGallerySection !== false ? '● در حال نمایش' : '○ مخفی شده'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              گالری تصاویر واقعی، اسلایدر کشویی مقایسه قبل و بعد (Before / After)، ویدیوهای اجرایی و برچسب‌های محله و دسته‌بندی.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...localSettings, showGallerySection: !(localSettings.showGallerySection !== false) };
                            setLocalSettings(updated);
                            updateSettings(updated);
                            showNotification(updated.showGallerySection ? 'بخش «نمونه پروژه‌های انجام شده» در سایت فعال شد.' : 'بخش «نمونه پروژه‌های انجام شده» از سایت مخفی شد.');
                          }}
                          className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner mt-1 ${
                            localSettings.showGallerySection !== false ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          dir="ltr"
                          role="switch"
                          aria-checked={localSettings.showGallerySection !== false}
                        >
                          <span
                            className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                              localSettings.showGallerySection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* 4. Coverage Map Section */}
                    <div className={`p-4 rounded-2xl border-2 transition-all shadow-xs ${
                      localSettings.showCoverageMapSection !== false
                        ? 'bg-white dark:bg-slate-900 border-teal-500/60 dark:border-teal-500/40 shadow-teal-500/5'
                        : 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                    }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                            localSettings.showCoverageMapSection !== false
                              ? 'bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 shadow-xs'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h5 className="text-sm font-black text-slate-900 dark:text-white">
                                مناطق تحت پوشش لوله بازکنی در ساوه و خدمات فنی در ساوه
                              </h5>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                localSettings.showCoverageMapSection !== false
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {localSettings.showCoverageMapSection !== false ? '● در حال نمایش' : '○ مخفی شده'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              نقشه بصری شهر ساوه، لیست کلیه خیابان‌ها و محله‌ها (طالقانی، شهرک فجر، کاوه و...) با زمان تقریبی اعزام فوری تکنسین.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...localSettings, showCoverageMapSection: !(localSettings.showCoverageMapSection !== false) };
                            setLocalSettings(updated);
                            updateSettings(updated);
                            showNotification(updated.showCoverageMapSection ? 'بخش «مناطق تحت پوشش ساوه» در سایت فعال شد.' : 'بخش «مناطق تحت پوشش ساوه» از سایت مخفی شد.');
                          }}
                          className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner mt-1 ${
                            localSettings.showCoverageMapSection !== false ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          dir="ltr"
                          role="switch"
                          aria-checked={localSettings.showCoverageMapSection !== false}
                        >
                          <span
                            className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                              localSettings.showCoverageMapSection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* 5. Why Choose Us Section */}
                    <div className={`p-4 rounded-2xl border-2 transition-all shadow-xs ${
                      localSettings.showWhyUsSection !== false
                        ? 'bg-white dark:bg-slate-900 border-red-500/60 dark:border-red-500/40 shadow-red-500/5'
                        : 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                    }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                            localSettings.showWhyUsSection !== false
                              ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 shadow-xs'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h5 className="text-sm font-black text-slate-900 dark:text-white">
                                چرا دفتر خدماتی بهکار انتخاب اول همشهریان ساوه است
                              </h5>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                localSettings.showWhyUsSection !== false
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {localSettings.showWhyUsSection !== false ? '● در حال نمایش' : '○ مخفی شده'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              مزایای ویژه و رقابتی دفتر (تضمین کتبی، فنرهای ضدعفونی‌شده، عدم دریافت وجه در صورت عدم رفع مشکل، تجهیزات مدرن).
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...localSettings, showWhyUsSection: !(localSettings.showWhyUsSection !== false) };
                            setLocalSettings(updated);
                            updateSettings(updated);
                            showNotification(updated.showWhyUsSection ? 'بخش «چرا دفتر بهکار» در سایت فعال شد.' : 'بخش «چرا دفتر بهکار» از سایت مخفی شد.');
                          }}
                          className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner mt-1 ${
                            localSettings.showWhyUsSection !== false ? 'bg-red-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          dir="ltr"
                          role="switch"
                          aria-checked={localSettings.showWhyUsSection !== false}
                        >
                          <span
                            className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                              localSettings.showWhyUsSection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* 6. Customer Reviews Section */}
                    <div className={`p-4 rounded-2xl border-2 transition-all shadow-xs ${
                      localSettings.showReviewsSection !== false
                        ? 'bg-white dark:bg-slate-900 border-amber-500/60 dark:border-amber-500/40 shadow-amber-500/5'
                        : 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                    }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                            localSettings.showReviewsSection !== false
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shadow-xs'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            <Star className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h5 className="text-sm font-black text-slate-900 dark:text-white">
                                نظرات مشتریان دفتر خدماتی بهکار
                              </h5>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                localSettings.showReviewsSection !== false
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {localSettings.showReviewsSection !== false ? '● در حال نمایش' : '○ مخفی شده'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              دیدگاه‌ها و نظرات ثبت‌شده همشهریان ساوه، سیستم امتیازدهی ستاره‌ای و فرم ارسال نظر جدید توسط مشتریان.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...localSettings, showReviewsSection: !(localSettings.showReviewsSection !== false) };
                            setLocalSettings(updated);
                            updateSettings(updated);
                            showNotification(updated.showReviewsSection ? 'بخش «نظرات مشتریان» در سایت فعال شد.' : 'بخش «نظرات مشتریان» از سایت مخفی شد.');
                          }}
                          className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner mt-1 ${
                            localSettings.showReviewsSection !== false ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          dir="ltr"
                          role="switch"
                          aria-checked={localSettings.showReviewsSection !== false}
                        >
                          <span
                            className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                              localSettings.showReviewsSection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* 7. FAQ Section */}
                    <div className={`p-4 rounded-2xl border-2 transition-all shadow-xs ${
                      localSettings.showFaqSection !== false
                        ? 'bg-white dark:bg-slate-900 border-cyan-500/60 dark:border-cyan-500/40 shadow-cyan-500/5'
                        : 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                    }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                            localSettings.showFaqSection !== false
                              ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 shadow-xs'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            <HelpCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h5 className="text-sm font-black text-slate-900 dark:text-white">
                                سوالات متداول شهروندان ساوه
                              </h5>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                localSettings.showFaqSection !== false
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {localSettings.showFaqSection !== false ? '● در حال نمایش' : '○ مخفی شده'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              سوالات پرتکرار شهروندان درباره نحوه باز کردن لوله، زمان رسیدن سرویس‌کار، نحوه پرداخت و تعرفه فاکتور.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...localSettings, showFaqSection: !(localSettings.showFaqSection !== false) };
                            setLocalSettings(updated);
                            updateSettings(updated);
                            showNotification(updated.showFaqSection ? 'بخش «سوالات متداول» در سایت فعال شد.' : 'بخش «سوالات متداول» از سایت مخفی شد.');
                          }}
                          className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner mt-1 ${
                            localSettings.showFaqSection !== false ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          dir="ltr"
                          role="switch"
                          aria-checked={localSettings.showFaqSection !== false}
                        >
                          <span
                            className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                              localSettings.showFaqSection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* 8. Hero Banner Section */}
                    <div className={`p-4 rounded-2xl border-2 transition-all shadow-xs ${
                      localSettings.showHeroSection !== false
                        ? 'bg-white dark:bg-slate-900 border-amber-500/60 dark:border-amber-500/40 shadow-amber-500/5'
                        : 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                    }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                            localSettings.showHeroSection !== false
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shadow-xs'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h5 className="text-sm font-black text-slate-900 dark:text-white">
                                بخش بنر اصلی و هیرو بالای سایت
                              </h5>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                localSettings.showHeroSection !== false
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {localSettings.showHeroSection !== false ? '● در حال نمایش' : '○ مخفی شده'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              عنوان اصلی سایت، معرفی سریع دفتر بهکار ساوه، دکمه‌های تماس و کارت وضعیت تکنسین‌های ساوه.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...localSettings, showHeroSection: !(localSettings.showHeroSection !== false) };
                            setLocalSettings(updated);
                            updateSettings(updated);
                            showNotification(updated.showHeroSection ? 'بخش هیرو بالای سایت فعال شد.' : 'بخش هیرو بالای سایت مخفی شد.');
                          }}
                          className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner mt-1 ${
                            localSettings.showHeroSection !== false ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          dir="ltr"
                          role="switch"
                          aria-checked={localSettings.showHeroSection !== false}
                        >
                          <span
                            className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                              localSettings.showHeroSection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* 9. Sticky Mobile Floating Bar */}
                    <div className={`p-4 rounded-2xl border-2 transition-all shadow-xs ${
                      localSettings.showFloatingBar !== false
                        ? 'bg-white dark:bg-slate-900 border-indigo-500/60 dark:border-indigo-500/40 shadow-indigo-500/5'
                        : 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                    }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                            localSettings.showFloatingBar !== false
                              ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shadow-xs'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h5 className="text-sm font-black text-slate-900 dark:text-white">
                                نوار شناور تماس سریع و رزرو پایین صفحه موبایل
                              </h5>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                localSettings.showFloatingBar !== false
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {localSettings.showFloatingBar !== false ? '● در حال نمایش' : '○ مخفی شده'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              دکمه‌های چسبان پایین گوشی جهت تماس فوری با ۱ لمس و ثبت درخواست اعزام کارشناس.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...localSettings, showFloatingBar: !(localSettings.showFloatingBar !== false) };
                            setLocalSettings(updated);
                            updateSettings(updated);
                            showNotification(updated.showFloatingBar ? 'نوار شناور تماس موبایل فعال شد.' : 'نوار شناور تماس موبایل مخفی شد.');
                          }}
                          className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner mt-1 ${
                            localSettings.showFloatingBar !== false ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          dir="ltr"
                          role="switch"
                          aria-checked={localSettings.showFloatingBar !== false}
                        >
                          <span
                            className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                              localSettings.showFloatingBar !== false ? 'translate-x-[22px]' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 3: TARIFFS MANAGEMENT */}
              {activeTab === 'tariffs' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        مدیریت تعرفه‌ها و جدول قیمت‌های دفتر
                      </h4>
                      <p className="text-xs text-slate-500">
                        قابلیت افزودن، جستجو، تغییر درصدی قیمت‌ها، جابجایی، کپی، ویرایش متون و مبالغ، حذف و بازنشانی
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingTariffId(null);
                          setShowAddTariffForm(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>افزودن ردیف تعرفه</span>
                      </button>
                      <button
                        onClick={() => {
                          resetTariffsToDefault();
                          showNotification('تعرفه‌ها به لیست پایه بازنشانی شدند.');
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs cursor-pointer"
                        title="بازنشانی به پیش‌فرض"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Global One-Click "Call for Price / برای استعلام تماس بگیرید" Master Switch */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    settings.forceCallForPrice 
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200' 
                      : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700'
                  }`}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          settings.forceCallForPrice ? 'bg-amber-500 text-white shadow-md' : 'bg-blue-600/10 text-blue-600 dark:text-blue-400'
                        }`}>
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-black flex items-center gap-2">
                            <span>دکمه تبدیل قیمت‌های سایت به «برای استعلام تماس بگیرید»</span>
                            {settings.forceCallForPrice && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                                فعال است (قیمت‌های عددی مخفی شدند)
                              </span>
                            )}
                          </h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            با فعال‌سازی این دکمه، تمام قیمت‌های عددی در کارت‌های خدمات، استعلام آنلاین و تعرفه‌ها به متن «برای استعلام تماس بگیرید» تبدیل می‌شوند.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
                        <input
                          type="text"
                          placeholder="متن جایگزین قیمت..."
                          value={localSettings.callForPriceCustomText || 'برای استعلام تماس بگیرید'}
                          onChange={e => {
                            const val = e.target.value;
                            setLocalSettings(prev => ({ ...prev, callForPriceCustomText: val }));
                            updateSettings({ ...settings, callForPriceCustomText: val });
                          }}
                          className="py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[180px]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const nextVal = !settings.forceCallForPrice;
                            const updated = { 
                              ...settings, 
                              forceCallForPrice: nextVal,
                              callForPriceCustomText: localSettings.callForPriceCustomText || 'برای استعلام تماس بگیرید'
                            };
                            setLocalSettings(updated);
                            updateSettings(updated);
                            showNotification(
                              nextVal 
                                ? 'کلیه قیمت‌های سایت با موفقیت به «برای استعلام تماس بگیرید» تبدیل شدند.' 
                                : 'نمایش قیمت‌های عددی در سایت با موفقیت فعال شد.'
                            );
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0 ${
                            settings.forceCallForPrice
                              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20'
                              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                          }`}
                        >
                          <Phone className="w-4 h-4" />
                          <span>{settings.forceCallForPrice ? 'غیرفعال‌سازی (نمایش مجدد قیمت‌ها)' : 'تغییر همه قیمت‌ها به تماس بگیرید'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Batch Price Adjuster & Search Toolbar */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    {/* Real-time Search */}
                    <div className="md:col-span-5 relative">
                      <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="جستجوی سریع بین تعرفه‌ها (عنوان، توضیح، قیمت)..."
                        value={tariffSearchQuery}
                        onChange={e => setTariffSearchQuery(e.target.value)}
                        className="w-full pr-9 pl-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                      />
                      {tariffSearchQuery && (
                        <button
                          onClick={() => setTariffSearchQuery('')}
                          className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Discount Control Section */}
                    <div className="md:col-span-7 flex items-center justify-end gap-2 flex-wrap text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-blue-600" />
                        مدیریت تخفیف تعرفه‌ها:
                      </span>

                      {settings.showDiscount && settings.discountPercentage > 0 && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 animate-pulse">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          تخفیف {toPersianDigits(settings.discountPercentage)}٪ فعال است
                        </span>
                      )}

                      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-1">
                        <input
                          type="number"
                          min="1"
                          max="90"
                          value={batchPercentageInput}
                          onChange={e => setBatchPercentageInput(e.target.value)}
                          onBlur={() => {
                            const val = Number(batchPercentageInput);
                            if (isNaN(val) || val <= 0) setBatchPercentageInput(10);
                          }}
                          className="w-12 text-center text-xs font-bold bg-transparent outline-none"
                        />
                        <span className="text-[11px] text-slate-400 font-bold">٪</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const num = Math.abs(Number(batchPercentageInput)) || 10;
                          applyDiscount(num);
                          showNotification(`تخفیف ${toPersianDigits(num)}٪ با موفقیت روی تمامی تعرفه‌ها و قیمت‌های سایت اعمال گردید.`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs active:scale-95"
                        title="اعمال تخفیف درصدی روی تعرفه‌ها"
                      >
                        <Percent className="w-3.5 h-3.5" />
                        <span>اعمال تخفیف {toPersianDigits(Math.abs(Number(batchPercentageInput)) || 10)}٪</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          removeDiscount();
                          showNotification('تخفیف کلیه تعرفه‌ها لغو گردید و قیمت‌ها به حالت اصلی بازگشتند.');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs active:scale-95"
                        title="برداشتن تخفیف و بازگرداندن قیمت‌ها به حالت عادی"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>برداشتن تخفیف</span>
                      </button>
                    </div>
                  </div>

                  {/* Add / Edit Tariff Form */}
                  {showAddTariffForm && (
                    <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/80 mb-4 animate-in fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-xs sm:text-sm text-blue-900 dark:text-blue-200">
                          {editingTariffId ? 'ویرایش ردیف تعرفه' : 'افزودن تعرفه جدید'}
                        </h5>
                        <button
                          onClick={() => {
                            setShowAddTariffForm(false);
                            setEditingTariffId(null);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveTariff} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              دسته‌بندی:
                            </label>
                            <select
                              value={tariffFormData.category}
                              onChange={e => {
                                const cat = e.target.value;
                                const names: Record<string, string> = {
                                  pipe: 'لوله بازکنی',
                                  well_digging: 'حفر چاه',
                                  toilet_replacement: 'تعویض سنگ توالت',
                                  well_emptying: 'تخلیه چاه',
                                  isogam: 'ایزوگام',
                                  plumbing: 'لوله‌کشی',
                                  custom: tariffCustomCategoryName || 'سایر خدمات',
                                };
                                setTariffFormData(prev => ({
                                  ...prev,
                                  category: cat,
                                  categoryName: names[cat] || (cat === 'custom' ? (tariffCustomCategoryName || 'دسته‌بندی سفارشی') : 'تعرفه عمومی')
                                }));
                              }}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                            >
                              <option value="pipe">لوله بازکنی</option>
                              <option value="well_digging">حفر چاه</option>
                              <option value="toilet_replacement">تعویض سنگ توالت</option>
                              <option value="well_emptying">تخلیه چاه</option>
                              <option value="isogam">ایزوگام</option>
                              <option value="plumbing">لوله‌کشی</option>
                              <option value="custom">➕ سایر (تعریف دسته‌بندی جدید توسط ادمین)</option>
                            </select>
                          </div>

                          {tariffFormData.category === 'custom' && (
                            <div className="animate-in fade-in">
                              <label className="block text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-1">
                                نام دسته‌بندی جدید: *
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="مثال: کاشی‌کاری، نقاشی، برق‌کاری ساختمان"
                                value={tariffCustomCategoryName}
                                onChange={e => {
                                  const val = e.target.value;
                                  setTariffCustomCategoryName(val);
                                  setTariffFormData(prev => ({
                                    ...prev,
                                    categoryName: val || 'دسته‌بندی سفارشی'
                                  }));
                                }}
                                className="w-full py-2 px-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/60 border-2 border-blue-400 dark:border-blue-600 text-xs font-bold"
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              شرح خدمت / آیتم: *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="مثال: باز کردن لوله با فنر برقی"
                              value={tariffFormData.title}
                              onChange={e => setTariffFormData(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              واحد سنجش:
                            </label>
                            <input
                              type="text"
                              placeholder="هر عدد / متری / سرویس"
                              value={tariffFormData.unit}
                              onChange={e => setTariffFormData(prev => ({ ...prev, unit: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              قیمت یا بازه قیمت (تومان): *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="مثال: ۵۰۰,۰۰۰ تا ۱,۵۰۰,۰۰۰"
                              value={tariffFormData.priceRange}
                              onChange={e => setTariffFormData(prev => ({ ...prev, priceRange: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              توضیحات تکمیلی (اختیاری):
                            </label>
                            <input
                              type="text"
                              placeholder="توضیح نوع لوله یا متراژ"
                              value={tariffFormData.note || ''}
                              onChange={e => setTariffFormData(prev => ({ ...prev, note: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddTariffForm(false);
                              setEditingTariffId(null);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold cursor-pointer"
                          >
                            انصراف
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer"
                          >
                            {editingTariffId ? 'ثبت تغییرات' : 'افزودن به تعرفه‌ها'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Dynamic Filter selector */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(() => {
                        const baseFilters = [
                          { id: 'all', label: 'همه دسته‌ها' },
                          { id: 'pipe', label: 'لوله بازکنی' },
                          { id: 'well_digging', label: 'حفر چاه' },
                          { id: 'toilet_replacement', label: 'تعویض سنگ توالت' },
                          { id: 'well_emptying', label: 'تخلیه چاه' },
                          { id: 'isogam', label: 'ایزوگام' },
                          { id: 'plumbing', label: 'لوله‌کشی' },
                        ];
                        const customCats: { id: string; label: string }[] = [];
                        tariffs.forEach(t => {
                          if (!baseFilters.some(b => b.id === t.category) && !customCats.some(c => c.id === t.category)) {
                            customCats.push({ id: t.category, label: t.categoryName });
                          }
                        });
                        return [...baseFilters, ...customCats].map(f => (
                          <button
                            key={f.id}
                            onClick={() => setTariffCategoryFilter(f.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              tariffCategoryFilter === f.id
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {f.label}
                          </button>
                        ));
                      })()}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                      نمایش {toPersianDigits(filteredTariffs.length)} از {toPersianDigits(tariffs.length)} مورد
                    </span>
                  </div>

                  {/* Tariffs List Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black">
                        <tr>
                          <th className="p-3 w-16 text-center">ترتیب</th>
                          <th className="p-3">شرح خدمت</th>
                          <th className="p-3">دسته‌بندی</th>
                          <th className="p-3">واحد</th>
                          <th className="p-3">قیمت (تومان)</th>
                          <th className="p-3 text-center">عملیات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredTariffs.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                              موردی یافت نشد.
                            </td>
                          </tr>
                        ) : (
                          filteredTariffs.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveTariff(t.id, 'up')}
                                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded cursor-pointer transition-colors"
                                    title="انتقال به بالا"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveTariff(t.id, 'down')}
                                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded cursor-pointer transition-colors"
                                    title="انتقال به پایین"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                              <td className="p-3 font-bold text-slate-900 dark:text-white">
                                {t.title}
                                {t.note && (
                                  <span className="block text-[11px] text-slate-400 font-normal">
                                    {t.note}
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-slate-600 dark:text-slate-300">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px]">
                                  {t.categoryName}
                                </span>
                              </td>
                              <td className="p-3 text-slate-600 dark:text-slate-300">
                                {t.unit}
                              </td>
                              <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                                {toPersianDigits(t.priceRange)}
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => handleDuplicateTariff(t)}
                                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg cursor-pointer"
                                    title="تکثیر / کپی این ردیف"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => startEditTariff(t)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg cursor-pointer"
                                    title="ویرایش"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      deleteTariff(t.id);
                                      showNotification('تعرفه حذف شد.');
                                    }}
                                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg cursor-pointer"
                                    title="حذف"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: DISCOUNTS & PROMOTIONAL BANNER MANAGEMENT */}
              {activeTab === 'discounts' && (
                <div className="space-y-6 animate-in fade-in">
                  {/* Header Banner Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-xs">
                        <Percent className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black">مدیریت بنر فوقانی و ساخت کدهای تخفیف اختصاصی</h3>
                        <p className="text-xs text-emerald-100 font-medium mt-0.5">
                          تنظیم بنر اعلان بالای سایت، تخفیف درصدی عمومی تعرفه‌ها و ساخت کدهای تخفیف با تعیین سقف ظرفیت استفاده
                        </p>
                      </div>
                    </div>

                    {settings.showDiscount && (
                      <span className="px-3 py-1.5 rounded-full bg-white text-emerald-900 font-black text-xs flex items-center gap-1.5 shadow-sm animate-pulse">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        تخفیف عمومی {toPersianDigits(settings.discountPercentage)}٪ فعال است
                      </span>
                    )}
                  </div>

                  {/* Section 1: Top Announcement Banner Control (Fixed responsive toggle) */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                            بنر اعلان فوری و فوقانی بالای سایت (Top Header Banner)
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            نمایش نوار رنگی در بالاترین بخش تمام صفحات سایت روی دسکتاپ و موبایل
                          </p>
                        </div>
                      </div>

                      {/* Instant Toggle Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = !localSettings.isEmergencyBannerActive;
                          setLocalSettings(prev => ({ ...prev, isEmergencyBannerActive: nextVal }));
                          updateSettings({ isEmergencyBannerActive: nextVal });
                          showNotification(nextVal ? 'بنر بالای سایت فعال گردید.' : 'بنر بالای سایت غیرفعال شد.');
                        }}
                        className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer active:scale-95 ${
                          localSettings.isEmergencyBannerActive
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/40'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full transition-all ${localSettings.isEmergencyBannerActive ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                        <span>{localSettings.isEmergencyBannerActive ? 'وضعیت بنر: فعال است' : 'وضعیت بنر: غیرفعال است'}</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        متن بنر فوقانی بالای سایت:
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                        <input
                          type="text"
                          value={localSettings.emergencyBannerText}
                          onChange={e => setLocalSettings(prev => ({ ...prev, emergencyBannerText: e.target.value }))}
                          placeholder="مثال: اعزام فوری سرویس‌کار به سراسر شهر ساوه و شهرک صنعتی کاوه | شبانه‌روزی"
                          className="w-full sm:flex-1 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateSettings({ emergencyBannerText: localSettings.emergencyBannerText });
                            showNotification('متن بنر فوقانی ذخیره و به‌روزرسانی شد.');
                          }}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs cursor-pointer shrink-0 flex items-center justify-center"
                        >
                          ثبت متن
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: General Percentage Discount Controller */}
                  <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-emerald-200 dark:border-emerald-800/80">
                      <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <h4 className="font-extrabold text-sm text-emerald-950 dark:text-emerald-200">
                          اعمال و لغو آنلاین تخفیف عمومی قیمت تعرفه‌ها
                        </h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          درصد تخفیف عمومی تعرفه‌ها:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="90"
                            value={batchPercentageInput}
                            onChange={e => setBatchPercentageInput(e.target.value)}
                            className="w-24 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm font-bold text-center outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <span className="font-bold text-slate-600 dark:text-slate-300 text-sm">درصد (٪)</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          عنوان و پیام اعلان تخفیف (نمایش در هدر و جدول):
                        </label>
                        <input
                          type="text"
                          value={localSettings.discountNotice}
                          onChange={e => setLocalSettings(prev => ({ ...prev, discountNotice: e.target.value }))}
                          placeholder="مثال: تخفیف ویژه ۱۰٪ تماس مستقیم و سفارش از سایت"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          const num = Math.abs(Number(batchPercentageInput)) || 10;
                          applyDiscount(num);
                          showNotification(`تخفیف ${toPersianDigits(num)}٪ با موفقیت روی تمامی تعرفه‌ها و قیمت‌های سایت اعمال گردید.`);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <Percent className="w-4 h-4" />
                        <span>اعمال فوری تخفیف {toPersianDigits(Math.abs(Number(batchPercentageInput)) || 10)}٪</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          removeDiscount();
                          showNotification('تخفیف کلیه تعرفه‌ها لغو گردید و قیمت‌ها به حالت اصلی بازگشتند.');
                        }}
                        className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>حذف و لغو کامل تخفیف</span>
                      </button>
                    </div>
                  </div>

                  {/* Section 3: PROMO COUPON CODE GENERATOR (ساخت و مدیریت کدهای تخفیف اختصاصی) */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-5">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h4 className="font-black text-sm text-slate-900 dark:text-slate-100">
                          سیستم ساخت و مدیریت کدهای تخفیف اختصاصی (Coupon Codes)
                        </h4>
                      </div>
                      <span className="text-xs bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 font-extrabold px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                        مجموع کدها: {toPersianDigits(coupons.length)} کد
                      </span>
                    </div>

                    {/* New Coupon Creation Form */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Plus className="w-4 h-4 text-indigo-600" />
                          ایجاد کد تخفیف جدید:
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                            let rand = 'SAVEH-';
                            for (let i = 0; i < 4; i++) {
                              rand += chars.charAt(Math.floor(Math.random() * chars.length));
                            }
                            setCouponCodeInput(rand);
                          }}
                          className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          تولید کد تصادفی شیک
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            عبارت کد تخفیف:
                          </label>
                          <input
                            type="text"
                            value={couponCodeInput}
                            onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                            placeholder="مثال: NOWRUZ1403"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono font-bold uppercase outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            نوع تخفیف:
                          </label>
                          <select
                            value={couponTypeInput}
                            onChange={e => setCouponTypeInput(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="percentage">درصدی (٪)</option>
                            <option value="fixed">مبلغ ثابت (تومان)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            مقدار تخفیف ({couponTypeInput === 'percentage' ? 'درصد' : 'تومان'}):
                          </label>
                          <input
                            type="number"
                            value={couponValueInput}
                            onChange={e => setCouponValueInput(Number(e.target.value))}
                            placeholder={couponTypeInput === 'percentage' ? 'مثال: 15' : 'مثال: 50000'}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            سقف تعداد استفاده (ظرفیت افراد):
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={couponMaxUsesInput}
                            onChange={e => setCouponMaxUsesInput(Number(e.target.value))}
                            placeholder="مثال: 5"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          توضیحات و بابت چه مناسبت یا خدمتی (اختیاری):
                        </label>
                        <input
                          type="text"
                          value={couponDescInput}
                          onChange={e => setCouponDescInput(e.target.value)}
                          placeholder="مثال: تخفیف ویژه برای ۵ سفارش اول مشتریان منطقه شهرک فجر"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (!couponCodeInput.trim()) {
                              showNotification('لطفاً عبارت کد تخفیف را وارد فرمایید.');
                              return;
                            }
                            addCoupon({
                              code: couponCodeInput.trim(),
                              discountType: couponTypeInput,
                              discountValue: couponValueInput || 10,
                              maxUses: couponMaxUsesInput || 5,
                              isActive: true,
                              description: couponDescInput.trim()
                            });
                            setCouponCodeInput('');
                            setCouponDescInput('');
                            showNotification(`کد تخفیف ${couponCodeInput.toUpperCase()} با ظرفیت ${toPersianDigits(couponMaxUsesInput)} نفر با موفقیت ساخته شد.`);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>ساخت و انتشار کد تخفیف</span>
                        </button>
                      </div>
                    </div>

                    {/* Coupons List Table */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                      <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center justify-between">
                        <span>لیست کدهای تخفیف تعریف‌شده</span>
                        <button
                          type="button"
                          onClick={() => {
                            resetCouponsToDefault();
                            showNotification('کدهای تخفیف اولیه بازنشانی شدند.');
                          }}
                          className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
                        >
                          بازنشانی نمونه‌ها
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                              <th className="p-3 font-bold">کد تخفیف</th>
                              <th className="p-3 font-bold">میزان تخفیف</th>
                              <th className="p-3 font-bold">ظرفیت و استفاده</th>
                              <th className="p-3 font-bold">توضیحات</th>
                              <th className="p-3 font-bold">وضعیت</th>
                              <th className="p-3 font-bold text-left">عملیات</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {coupons.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="p-6 text-center text-slate-400 font-medium">
                                  هیچ کد تخفیفی تاکنون تعریف نشده است.
                                </td>
                              </tr>
                            ) : (
                              coupons.map(c => {
                                const isFull = c.maxUses > 0 && c.usedCount >= c.maxUses;
                                const usagePercent = c.maxUses > 0 ? Math.min(100, Math.round((c.usedCount / c.maxUses) * 100)) : 0;
                                return (
                                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="p-3">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-mono font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                                          {c.code}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard?.writeText(c.code);
                                            showNotification(`کد ${c.code} در حافظه کپی شد.`);
                                          }}
                                          title="کپی کد"
                                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                                        >
                                          <Copy className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                    <td className="p-3 font-black text-emerald-700 dark:text-emerald-400">
                                      {c.discountType === 'percentage'
                                        ? `${toPersianDigits(c.discountValue)}٪ تخفیف`
                                        : `${toPersianDigits(c.discountValue.toLocaleString())} تومان`}
                                    </td>
                                    <td className="p-3 min-w-[140px]">
                                      <div className="space-y-1">
                                        <div className="flex justify-between text-[11px] font-bold">
                                          <span className={isFull ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}>
                                            {toPersianDigits(c.usedCount)} از {toPersianDigits(c.maxUses)} نفر
                                          </span>
                                          {isFull && (
                                            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950 px-1.5 py-0.2 rounded">
                                              تکمیل ظرفیت
                                            </span>
                                          )}
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                          <div
                                            className={`h-full transition-all ${isFull ? 'bg-rose-500' : 'bg-indigo-600'}`}
                                            style={{ width: `${usagePercent}%` }}
                                          />
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">
                                      {c.description || 'بدون توضیح'}
                                    </td>
                                    <td className="p-3">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateCoupon(c.id, { isActive: !c.isActive });
                                          showNotification(`وضعیت کد ${c.code} تغییر یافت.`);
                                        }}
                                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                                          c.isActive && !isFull
                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                        }`}
                                      >
                                        {c.isActive ? (isFull ? 'تکمیل ظرفیت' : 'فعال') : 'غیرفعال'}
                                      </button>
                                    </td>
                                    <td className="p-3 text-left">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          deleteCoupon(c.id);
                                          showNotification(`کد تخفیف ${c.code} حذف گردید.`);
                                        }}
                                        className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                                        title="حذف کد"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Live Header Banner Preview */}
                  <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        پیش‌نمایش زنده بنر بالای سایت:
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                        Live Top Header Banner
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-800 text-white text-xs font-medium text-center flex items-center justify-center gap-2 overflow-hidden shadow-inner">
                      <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse shrink-0" />
                      <span className="font-bold">
                        {localSettings.isEmergencyBannerActive
                          ? localSettings.emergencyBannerText
                          : (localSettings.discountNotice || `تخفیف ویژه ${toPersianDigits(Math.abs(Number(batchPercentageInput)) || 10)}٪ ثبت سفارش آنلاین و تماس از سایت`)}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black border border-white/30">
                        بهکار ساوه
                      </span>
                    </div>
                  </div>

                  {/* Save button for settings */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateSettings(localSettings);
                        showNotification('تنظیمات بنر و متون تخفیف با موفقیت ذخیره گردید.');
                      }}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ذخیره تغییرات کلی بنر و تخفیفات</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: SERVICES MANAGEMENT */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        مدیریت کارت‌های خدمات اصلی سایت
                      </h4>
                      <p className="text-xs text-slate-500">
                        تغییر عنوان، توضیحات، قیمت پایه، مزایا و ویژگی‌های خدمات
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingServiceId(null);
                          setShowAddServiceForm(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>افزودن خدمت جدید</span>
                      </button>
                      <button
                        onClick={() => {
                          resetServicesToDefault();
                          showNotification('خدمات به لیست پیش‌فرض بازنشانی شدند.');
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs cursor-pointer"
                        title="بازنشانی خدمات"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Edit Main Header & Description of Services Section */}
                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-3">
                    <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-black text-sm">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>تیتر و عنوان اصلی بالای بخش خدمات</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          تیتر اصلی بخش خدمات:
                        </label>
                        <input
                          type="text"
                          value={localSettings.servicesHeadline || ''}
                          placeholder="خدمات جامع تاسیساتی، تخلیه چاه و ایزوگام در ساوه"
                          onChange={e => setLocalSettings(prev => ({ ...prev, servicesHeadline: e.target.value }))}
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          متن زیر تیتر خدمات:
                        </label>
                        <input
                          type="text"
                          value={localSettings.servicesSubheadline || ''}
                          placeholder="کلیه خدمات تحت نظارت مستقیم مدیریت با کمترین قیمت ارائه می‌گردد"
                          onChange={e => setLocalSettings(prev => ({ ...prev, servicesSubheadline: e.target.value }))}
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          updateSettings(localSettings);
                          showNotification('تیتر و متن بالای بخش خدمات با موفقیت بروزرسانی شد.');
                        }}
                        className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1 transition-all"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>ذخیره تیتر بخش خدمات</span>
                      </button>
                    </div>
                  </div>

                  {/* Add / Edit Service Form */}
                  {showAddServiceForm && (
                    <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/80 mb-4 animate-in fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-xs sm:text-sm text-blue-900 dark:text-blue-200">
                          {editingServiceId ? 'ویرایش کارت خدمت' : 'تعریف خدمت جدید'}
                        </h5>
                        <button
                          onClick={() => {
                            setShowAddServiceForm(false);
                            setEditingServiceId(null);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveService} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              عنوان خدمت: *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="مثال: لوله بازکنی شبانه‌روزی"
                              value={serviceFormData.title}
                              onChange={e => setServiceFormData(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              قیمت شروع / تعرفه: *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="مثال: از ۱۰۰,۰۰۰ تومان"
                              value={serviceFormData.startingPrice}
                              onChange={e => setServiceFormData(prev => ({ ...prev, startingPrice: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              توضیح تعرفه / مبنای قیمت:
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: بر اساس تعرفه مصوب اتحادیه"
                              value={serviceFormData.priceNote || ''}
                              onChange={e => setServiceFormData(prev => ({ ...prev, priceNote: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              متن ضمانت و گارانتی:
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: ضمانت ۱۰۰٪ باز شدن لوله"
                              value={serviceFormData.guarantee || ''}
                              onChange={e => setServiceFormData(prev => ({ ...prev, guarantee: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              نشان / برچسب کارت (Badge):
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: تضمینی، فوری، ویژه، شبانه‌روزی"
                              value={serviceFormData.badge || ''}
                              onChange={e => setServiceFormData(prev => ({ ...prev, badge: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              نام انگلیسی / آیکون:
                            </label>
                            <select
                              value={serviceFormData.icon}
                              onChange={e => setServiceFormData(prev => ({ ...prev, icon: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                            >
                              <option value="Wrench">Wrench (آچار / عمومی)</option>
                              <option value="Droplets">Droplets (قطرات آب / لوله)</option>
                              <option value="Flame">Flame (شعله / ایزوگام)</option>
                              <option value="Truck">Truck (کامیون / تانکر تخلیه)</option>
                              <option value="ShieldCheck">ShieldCheck (سپر ضمانت)</option>
                              <option value="Hammer">Hammer (چکش / حفر و بنایی)</option>
                              <option value="Clock">Clock (ساعت / شبانه‌روزی)</option>
                              <option value="Sparkles">Sparkles (ستاره / کیفیت برتر)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            توضیح کوتاه:
                          </label>
                          <input
                            type="text"
                            placeholder="توضیح خلاصه جهت نمایش روی کارت خدمت"
                            value={serviceFormData.shortDesc}
                            onChange={e => setServiceFormData(prev => ({ ...prev, shortDesc: e.target.value }))}
                            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            توضیحات کامل خدمت:
                          </label>
                          <textarea
                            rows={3}
                            placeholder="توضیحات جامع شیوه اجرا و تجهیزات..."
                            value={serviceFormData.fullDesc}
                            onChange={e => setServiceFormData(prev => ({ ...prev, fullDesc: e.target.value }))}
                            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                          />
                        </div>

                        {/* Features List Manager */}
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2">
                          <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200">
                            مزایا و ویژگی‌های خدمت:
                          </label>
                          <div className="flex flex-wrap gap-1.5 min-h-[30px] items-center">
                            {(serviceFormData.features || []).map((feat, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-xs font-bold"
                              >
                                {feat}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setServiceFormData(prev => ({
                                      ...prev,
                                      features: prev.features.filter((_, i) => i !== idx)
                                    }));
                                  }}
                                  className="text-blue-600 hover:text-red-600 cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2 pt-1">
                            <input
                              type="text"
                              placeholder="افزودن ویژگی جدید (مثال: بدون کثیف‌کاری)..."
                              value={newFeatureInput}
                              onChange={e => setNewFeatureInput(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (newFeatureInput.trim()) {
                                    setServiceFormData(prev => ({
                                      ...prev,
                                      features: [...prev.features, newFeatureInput.trim()]
                                    }));
                                    setNewFeatureInput('');
                                  }
                                }
                              }}
                              className="flex-1 py-1.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newFeatureInput.trim()) {
                                  setServiceFormData(prev => ({
                                    ...prev,
                                    features: [...prev.features, newFeatureInput.trim()]
                                  }));
                                  setNewFeatureInput('');
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer shrink-0"
                            >
                              + افزودن ویژگی
                            </button>
                          </div>
                        </div>

                        {/* Tools List Manager */}
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2">
                          <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200">
                            ابزارها و تجهیزات مورد استفاده:
                          </label>
                          <div className="flex flex-wrap gap-1.5 min-h-[30px] items-center">
                            {(serviceFormData.tools || []).map((tl, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold"
                              >
                                {tl}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setServiceFormData(prev => ({
                                      ...prev,
                                      tools: (prev.tools || []).filter((_, i) => i !== idx)
                                    }));
                                  }}
                                  className="text-emerald-600 hover:text-red-600 cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2 pt-1">
                            <input
                              type="text"
                              placeholder="افزودن ابزار جدید (مثال: فنر ۵۰ متری فولادی)..."
                              value={newToolInput}
                              onChange={e => setNewToolInput(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (newToolInput.trim()) {
                                    setServiceFormData(prev => ({
                                      ...prev,
                                      tools: [...(prev.tools || []), newToolInput.trim()]
                                    }));
                                    setNewToolInput('');
                                  }
                                }
                              }}
                              className="flex-1 py-1.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newToolInput.trim()) {
                                  setServiceFormData(prev => ({
                                    ...prev,
                                    tools: [...(prev.tools || []), newToolInput.trim()]
                                  }));
                                  setNewToolInput('');
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer shrink-0"
                            >
                              + افزودن ابزار
                            </button>
                          </div>
                        </div>

                        {/* Service Image input with Direct File Upload & Delete Option */}
                        <div className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                          <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200">
                              مدیریت تصویر کارت خدمت (آدرس اینترنتی یا آپلود فایل):
                            </label>
                            {serviceFormData.image && (
                              <button
                                type="button"
                                onClick={() => setServiceFormData(prev => ({ ...prev, image: '' }))}
                                className="text-[11px] font-bold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف عکس</span>
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="url"
                              placeholder="https://... یا آپلود فایل جدید"
                              value={serviceFormData.image || ''}
                              onChange={e => setServiceFormData(prev => ({ ...prev, image: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                            />
                            <label className="shrink-0 cursor-pointer px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1 border border-blue-200 dark:border-blue-800 transition-colors">
                              <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span>{serviceFormData.image ? 'تغییر عکس' : 'آپلود عکس'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async e => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    const dataUrl = await compressImageFile(file);
                                    if (dataUrl) {
                                      setServiceFormData(prev => ({ ...prev, image: dataUrl }));
                                    }
                                  } catch (err) {
                                    console.error('Service image upload error:', err);
                                  }
                                }}
                              />
                            </label>
                          </div>

                          {serviceFormData.image ? (
                            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <div className="flex items-center gap-2.5">
                                <div className="relative h-14 w-24 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 shadow-xs shrink-0 bg-slate-100 dark:bg-slate-900">
                                  <img src={serviceFormData.image} alt="پیش‌نمایش تصویر خدمت" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" /> تصویر قرار داده شده است
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setServiceFormData(prev => ({ ...prev, image: '' }))}
                                className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/60 dark:hover:bg-red-900 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1 border border-red-200 dark:border-red-800 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>پاک کردن تصویر</span>
                              </button>
                            </div>
                          ) : (
                            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium pt-0.5">
                              ⚠️ این کارت بدون عکس است (در سایت به‌صورت هدر گرادینت با آیکون نمایش داده می‌شود).
                            </p>
                          )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddServiceForm(false);
                              setEditingServiceId(null);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold cursor-pointer"
                          >
                            انصراف
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer"
                          >
                            {editingServiceId ? 'ثبت ویرایش خدمت' : 'ذخیره خدمت'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map(s => (
                      <div key={s.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start gap-3 mb-3">
                            <div className="shrink-0 relative group">
                              {s.image ? (
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xs group">
                                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                    <label className="p-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-500 cursor-pointer" title="تغییر عکس">
                                      <Upload className="w-3.5 h-3.5" />
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async e => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;
                                          try {
                                            const dataUrl = await compressImageFile(file);
                                            if (dataUrl) {
                                              updateService(s.id, { image: dataUrl });
                                              showNotification(`تصویر خدمت «${s.title}» بروزرسانی شد.`);
                                            }
                                          } catch (err) {
                                            console.error(err);
                                          }
                                        }}
                                      />
                                    </label>
                                    <button
                                      onClick={() => {
                                        if (true) {
                                          updateService(s.id, { image: '' });
                                          showNotification(`عکس خدمت «${s.title}» حذف شد.`);
                                        }
                                      }}
                                      className="p-1.5 rounded-md bg-red-600 text-white hover:bg-red-500 cursor-pointer"
                                      title="حذف عکس"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center p-1 text-center">
                                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">بدون عکس</span>
                                  <label className="mt-1 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[9px] font-bold cursor-pointer hover:bg-blue-200">
                                    + عکس
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={async e => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        try {
                                          const dataUrl = await compressImageFile(file);
                                          if (dataUrl) {
                                            updateService(s.id, { image: dataUrl });
                                            showNotification(`عکس برای خدمت «${s.title}» تنظیم شد.`);
                                          }
                                        } catch (err) {
                                          console.error(err);
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h5 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                  {s.title}
                                </h5>
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded shrink-0">
                                  {toPersianDigits(s.startingPrice)}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                {s.shortDesc}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <label className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded cursor-pointer hover:bg-blue-100 flex items-center gap-1">
                                  <Upload className="w-2.5 h-2.5" />
                                  <span>{s.image ? 'تغییر عکس' : 'آپلود عکس'}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async e => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      try {
                                        const dataUrl = await compressImageFile(file);
                                        if (dataUrl) {
                                          updateService(s.id, { image: dataUrl });
                                          showNotification(`عکس خدمت «${s.title}» بروزرسانی شد.`);
                                        }
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }}
                                  />
                                </label>
                                {s.image && (
                                  <button
                                    onClick={() => {
                                      if (true) {
                                        updateService(s.id, { image: '' });
                                        showNotification(`عکس خدمت «${s.title}» حذف شد.`);
                                      }
                                    }}
                                    className="text-[10px] font-bold text-red-500 hover:text-red-700 dark:text-red-400 flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                    <span>حذف عکس</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {s.badge && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                                {s.badge}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {s.guarantee || 'تضمین کیفیت'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveService(s.id, 'up')}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg cursor-pointer transition-colors"
                              title="انتقال به بالا"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveService(s.id, 'down')}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg cursor-pointer transition-colors"
                              title="انتقال به پایین"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicateService(s)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg cursor-pointer transition-colors"
                              title="تکثیر / کپی این کارت خدمت"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => startEditService(s)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg cursor-pointer transition-colors"
                              title="ویرایش کامل کارت"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                deleteService(s.id);
                                showNotification('خدمت با موفقیت حذف شد.');
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg cursor-pointer transition-colors"
                              title="حذف خدمت"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: NEIGHBORHOODS MANAGEMENT */}
              {activeTab === 'neighborhoods' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        مدیریت مناطق تحت پوشش و پایگاه‌های ساوه
                      </h4>
                      <p className="text-xs text-slate-500">
                        در حالت پیش‌فرض کل ساوه پوشش داده می‌شود. در این بخش می‌توانید ایستگاه‌ها یا مناطق پرتردد را اضافه و مدیریت کنید.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingZoneId(null);
                          setShowAddZoneModal(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>افزودن منطقه / پایگاه</span>
                      </button>
                      <button
                        onClick={() => {
                          resetNeighborhoodsToDefault();
                          showNotification('لیست مناطق پوشش به حالت پیش‌فرض (خالی) بازنشانی شد.');
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs cursor-pointer flex items-center gap-1"
                        title="بازنشانی مناطق به حالت خالی"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline">بازنشانی لیست</span>
                      </button>
                    </div>
                  </div>

                  {/* Add / Edit Zone Modal */}
                  {showAddZoneModal && (
                    <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/80 mb-4 animate-in fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-xs sm:text-sm text-blue-900 dark:text-blue-200">
                          {editingZoneId ? 'ویرایش منطقه' : 'افزودن منطقه جدید'}
                        </h5>
                        <button
                          onClick={() => {
                            setShowAddZoneModal(false);
                            setEditingZoneId(null);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveZone} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              نام محله یا منطقه: *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="مثال: شهرک فجر ساوه"
                              value={zoneFormData.name}
                              onChange={e => setZoneFormData(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              زمان رسیدن (دقیقه):
                            </label>
                            <input
                              type="number"
                              value={zoneFormData.responseTimeMinutes}
                              onChange={e => setZoneFormData(prev => ({ ...prev, responseTimeMinutes: parseInt(e.target.value, 10) || 15 }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              تعداد سرویس‌کار فعال:
                            </label>
                            <input
                              type="number"
                              value={zoneFormData.activeTechs}
                              onChange={e => setZoneFormData(prev => ({ ...prev, activeTechs: parseInt(e.target.value, 10) || 1 }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              ضریب قیمت منطقه (پیش‌فرض ۱):
                            </label>
                            <input
                              type="number"
                              step="0.05"
                              min="0.5"
                              max="5"
                              value={zoneFormData.priceMultiplier || 1}
                              onChange={e => setZoneFormData(prev => ({ ...prev, priceMultiplier: parseFloat(e.target.value) || 1 }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                              placeholder="مثال: 1 یا 1.2"
                            />
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              مثلاً ۱.۲ یعنی ۲۰٪ افزایش هزینه برای مسافت یا حومه
                            </p>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              توضیحات و یادداشت پایگاه:
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: اعزام فوری با دستگاه فنر و پمپ تراکم هوا"
                              value={zoneFormData.note || ''}
                              onChange={e => setZoneFormData(prev => ({ ...prev, note: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddZoneModal(false);
                              setEditingZoneId(null);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold"
                          >
                            انصراف
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer"
                          >
                            {editingZoneId ? 'ثبت تغییرات منطقه' : 'افزودن منطقه'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Neighborhoods List */}
                  {neighborhoods.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-500 mb-3">
                        در حال حاضر هیچ منطقه خاصی به صورت مجزا اضافه نشده و وب‌سایت کل ساوه و حومه را به طور ۱۰۰٪ پوشش می‌دهد.
                      </p>
                      <button
                        onClick={() => setShowAddZoneModal(true)}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                      >
                        افزودن اولین منطقه یا پایگاه
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {neighborhoods.map(z => (
                        <div key={z.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 flex items-center justify-between">
                          <div>
                            <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              <span>{z.name}</span>
                            </h5>
                            <p className="text-xs text-slate-500 mt-1">
                              زمان رسیدن: {toPersianDigits(z.responseTimeMinutes || 15)} دقیقه | {toPersianDigits(z.activeTechs || 1)} اکیپ فعال
                              {z.priceMultiplier && z.priceMultiplier !== 1 && (
                                <span className="mr-2 text-blue-600 dark:text-blue-400 font-bold">
                                  | ضریب قیمت: {toPersianDigits(z.priceMultiplier)} برابر
                                </span>
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEditZone(z)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg cursor-pointer"
                              title="ویرایش"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                deleteNeighborhood(z.id);
                                showNotification('منطقه با موفقیت حذف شد.');
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg cursor-pointer"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: REAL STATS & LOGS */}
              {activeTab === 'stats' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        آمار واقعی بازدیدها و کلیک‌های تماس و روبیکا
                      </h4>
                      <p className="text-xs text-slate-500">
                        این آمار مستقیماً بر اساس تعاملات واقعی کاربران در مرورگر ذخیره و ثبت می‌شود.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        clearStatsLogs();
                        showNotification('آمار و گزارش‌ها با موفقیت بازنشانی شدند.');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>صفر کردن آمار</span>
                    </button>
                  </div>

                  {/* Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
                      <span className="text-xs text-blue-700 dark:text-blue-300 block mb-1">
                        بازدید واقعی سایت:
                      </span>
                      <span className="text-xl font-black text-blue-900 dark:text-blue-100 font-mono">
                        {toPersianDigits(stats.totalVisits)}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                      <span className="text-xs text-emerald-700 dark:text-emerald-300 block mb-1">
                        تماس‌های تلفنی ثبت شده:
                      </span>
                      <span className="text-xl font-black text-emerald-900 dark:text-emerald-100 font-mono">
                        {toPersianDigits(stats.totalCalls)}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
                      <span className="text-xs text-indigo-700 dark:text-indigo-300 block mb-1">
                        کلیک‌های پیام‌رسان روبیکا:
                      </span>
                      <span className="text-xl font-black text-indigo-900 dark:text-indigo-100 font-mono">
                        {toPersianDigits(stats.totalRubikaClicks)}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800">
                      <span className="text-xs text-purple-700 dark:text-purple-300 block mb-1">
                        استفاده از ماشین حساب:
                      </span>
                      <span className="text-xl font-black text-purple-900 dark:text-purple-100 font-mono">
                        {toPersianDigits(stats.totalEstimates)}
                      </span>
                    </div>
                  </div>

                  {/* Real Log entries */}
                  <div className="mt-4">
                    <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-2">
                      لاگ آخرین فعالیت‌ها و تماس‌ها:
                    </h5>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {stats.logs.map((log) => (
                        <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{log.title}:</span>
                            <span className="text-slate-600 dark:text-slate-400">{log.detail}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">{toPersianDigits(log.timestamp)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: GALLERY & PORTFOLIO MANAGEMENT */}
              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        مدیریت تصاویر، ویدیوها و متن‌های گالری نمونه‌کارها
                      </h4>
                      <p className="text-xs text-slate-500">
                        قابلیت افزودن عکس جدید، ویرایش عنوان و متن توضیحات زیر هر عکس، و حذف نمونه‌کارها
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingGalId(null);
                        setGalFormData({
                          title: '',
                          category: 'لوله بازکنی',
                          type: 'image',
                          mediaUrl: '',
                          beforeUrl: '',
                          afterUrl: '',
                          beforeLabel: 'وضعیت قبل از انجام کار',
                          afterLabel: 'وضعیت بعد از اتمام کار و شستشو',
                          sliderHint: '👈 دکمه وسط را به چپ و راست بکشید تا تغییر کیفیت را ببینید 👉',
                          highlights: [],
                          description: '',
                          location: 'ساوه',
                        });
                        setShowAddGalForm(!showAddGalForm);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{showAddGalForm ? 'بستن فرم' : 'افزودن نمونه‌کار جدید'}</span>
                    </button>
                  </div>

                  {/* Add / Edit Gallery Form */}
                  {showAddGalForm && (
                    <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 animate-in fade-in space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-blue-200/60 dark:border-blue-900/60">
                        <h5 className="font-bold text-xs sm:text-sm text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-blue-600" />
                          <span>{editingGalId ? 'ویرایش مشخصات و متن زیر عکس نمونه‌کار' : 'افزودن عکس / ویدیوی جدید به گالری'}</span>
                        </h5>
                        <button
                          onClick={() => {
                            setShowAddGalForm(false);
                            setEditingGalId(null);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveGallery} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              عنوان پروژه / خدمت: *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="مثال: باز کردن لوله آشپزخانه در طالقانی"
                              value={galFormData.title}
                              onChange={e => setGalFormData(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              دسته‌بندی:
                            </label>
                            <select
                              value={galFormData.category}
                              onChange={e => setGalFormData(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                            >
                              <option value="لوله بازکنی">لوله بازکنی</option>
                              <option value="تخلیه چاه">تخلیه چاه</option>
                              <option value="حفر چاه">حفر چاه</option>
                              <option value="ایزوگام">ایزوگام</option>
                              <option value="تعویض سنگ توالت">تعویض سنگ توالت</option>
                              <option value="لوله‌کشی">لوله‌کشی</option>
                              <option value="سایر خدمات">سایر خدمات</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              محله یا منطقه در ساوه:
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: خیابان طالقانی، شهرک فجر"
                              value={galFormData.location || ''}
                              onChange={e => setGalFormData(prev => ({ ...prev, location: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              نوع محتوا:
                            </label>
                            <select
                              value={galFormData.type}
                              onChange={e => setGalFormData(prev => ({ ...prev, type: e.target.value as any }))}
                              className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-blue-600 dark:text-blue-400"
                            >
                              <option value="image">عکس نمونه‌کار (تک عکس)</option>
                              <option value="before-after">تصویر قبل و بعد (دو عکس)</option>
                              <option value="video">ویدیو</option>
                            </select>
                          </div>
                        </div>

                        {/* Dual image inputs for Before/After OR Single image input */}
                        {galFormData.type === 'before-after' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 animate-in fade-in duration-200">
                            {/* Before Image Input */}
                            <div className="space-y-2">
                              <label className="block text-xs font-black text-red-700 dark:text-red-300">
                                ۱. تصویر قبل از انجام کار (Before): *
                              </label>
                              <input
                                type="url"
                                placeholder="لینک عکس قبل (https://...) یا آپلود عکس"
                                value={galFormData.beforeUrl || ''}
                                onChange={e => setGalFormData(prev => ({ ...prev, beforeUrl: e.target.value }))}
                                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                              />
                              <div className="flex items-center gap-2">
                                <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors">
                                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                                  <span>انتخاب فایل عکس قبل</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => handleImageFileUpload(e, 'beforeUrl')}
                                  />
                                </label>
                                {galFormData.beforeUrl && (
                                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                                    <CheckCircle className="w-3 h-3" /> مشخص شد
                                  </span>
                                )}
                              </div>
                              {galFormData.beforeUrl && (
                                <div className="relative h-28 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 mt-1">
                                  <img src={galFormData.beforeUrl} alt="پیش‌نمایش قبل" className="w-full h-full object-cover" />
                                  <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold">قبل</span>
                                </div>
                              )}
                            </div>

                            {/* After Image Input */}
                            <div className="space-y-2">
                              <label className="block text-xs font-black text-emerald-700 dark:text-emerald-300">
                                ۲. تصویر بعد از اتمام کار (After): *
                              </label>
                              <input
                                type="url"
                                placeholder="لینک عکس بعد (https://...) یا آپلود عکس"
                                value={galFormData.afterUrl || ''}
                                onChange={e => setGalFormData(prev => ({ ...prev, afterUrl: e.target.value }))}
                                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                              />
                              <div className="flex items-center gap-2">
                                <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors">
                                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                                  <span>انتخاب فایل عکس بعد</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => handleImageFileUpload(e, 'afterUrl')}
                                  />
                                </label>
                                {galFormData.afterUrl && (
                                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                                    <CheckCircle className="w-3 h-3" /> مشخص شد
                                  </span>
                                )}
                              </div>
                              {galFormData.afterUrl && (
                                <div className="relative h-28 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 mt-1">
                                  <img src={galFormData.afterUrl} alt="پیش‌نمایش بعد" className="w-full h-full object-cover" />
                                  <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">بعد</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* Single Image/Video input */
                          <div className="space-y-2 animate-in fade-in duration-200">
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              آدرس اینترنتی تصویر یا ویدیو (URL) یا آپلود مستقیم فایل: *
                            </label>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                              <input
                                type="url"
                                placeholder="https://images.unsplash.com/... یا فایل آپلود کنید"
                                value={galFormData.mediaUrl}
                                onChange={e => setGalFormData(prev => ({ ...prev, mediaUrl: e.target.value }))}
                                className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                              />
                              <label className="shrink-0 cursor-pointer px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                                <Upload className="w-3.5 h-3.5 text-blue-600" />
                                <span>انتخاب فایل</span>
                                <input
                                  type="file"
                                  accept="image/*,video/*"
                                  className="hidden"
                                  onChange={e => handleImageFileUpload(e, 'mediaUrl')}
                                />
                              </label>
                            </div>
                            {galFormData.mediaUrl && galFormData.type === 'image' && (
                              <div className="relative h-24 w-40 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 mt-1">
                                <img src={galFormData.mediaUrl} alt="پیش‌نمایش" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        )}

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            متن شرح و توضیحات زیر عکس: *
                          </label>
                          <textarea
                            rows={3}
                            placeholder="متن دلخواه خود را برای نمایش در زیر عکس بنویسید (مثال: رفع گرفتگی با دستگاه ژنراتور فنر الماسی بدون کوچکترین خرابی و کثیف‌کاری در ساوه)"
                            value={galFormData.description || ''}
                            onChange={e => setGalFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs leading-relaxed"
                          />
                        </div>

                        {/* Customization for Before/After Labels & Hint (Only active for Before-After content type) */}
                        {galFormData.type === 'before-after' && (
                          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3 animate-in fade-in duration-200">
                            <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-200">
                              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              <span>تنظیم متون قبل و بعد و راهنمای اسلایدر</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                  متن برچسب وضعیت قبل:
                                </label>
                                <input
                                  type="text"
                                  placeholder="وضعیت قبل از انجام کار"
                                  value={galFormData.beforeLabel || ''}
                                  onChange={e => setGalFormData(prev => ({ ...prev, beforeLabel: e.target.value }))}
                                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                  متن برچسب وضعیت بعد:
                                </label>
                                <input
                                  type="text"
                                  placeholder="وضعیت بعد از اتمام کار و شستشو"
                                  value={galFormData.afterLabel || ''}
                                  onChange={e => setGalFormData(prev => ({ ...prev, afterLabel: e.target.value }))}
                                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                متن راهنما و توضیحات زیر اسلایدر (راهنمای کشیدن دکمه):
                              </label>
                              <input
                                type="text"
                                placeholder="👈 دکمه وسط را به چپ و راست بکشید تا تغییر کیفیت را ببینید 👉"
                                value={galFormData.sliderHint || ''}
                                onChange={e => setGalFormData(prev => ({ ...prev, sliderHint: e.target.value }))}
                                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                              />
                            </div>
                          </div>
                        )}

                        {/* Green Ticks (Highlights) Management */}
                        <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900 dark:text-emerald-200">
                              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span className="leading-snug">مدیریت و ویرایش نکات کلیدی و تیک‌های سبز (Checkmarks)</span>
                            </div>
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full shrink-0">
                              {galFormData.highlights?.length || 0} مورد
                            </span>
                          </div>

                          {/* Add new highlight point */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                            <input
                              type="text"
                              placeholder="افزودن نکته تیک سبز جدید (مثال: بدون کثیف‌کاری و با تضمین کتبی)"
                              value={newHighlightInput}
                              onChange={e => setNewHighlightInput(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (newHighlightInput.trim()) {
                                    setGalFormData(prev => ({
                                      ...prev,
                                      highlights: [...(prev.highlights || []), newHighlightInput.trim()]
                                    }));
                                    setNewHighlightInput('');
                                  }
                                }
                              }}
                              className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newHighlightInput.trim()) {
                                  setGalFormData(prev => ({
                                    ...prev,
                                    highlights: [...(prev.highlights || []), newHighlightInput.trim()]
                                  }));
                                  setNewHighlightInput('');
                                }
                              }}
                              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1 shrink-0 shadow-xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>افزودن تیک سبز</span>
                            </button>
                          </div>

                          {/* Quick Preset Suggestions */}
                          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200/80 dark:border-emerald-800/40 space-y-1.5">
                            <span className="block text-[11px] font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>پیشنهادات آماده برای افزودن سریع (با یک کلیک):</span>
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                'بدون کثیف‌کاری و با تمیزکاری کامل محل',
                                'حضور کمتر از ۱۵ دقیقه در سراسر ساوه',
                                'دستگاه ژنراتور پیشرفته و فنر آلمانی',
                                'تضمین کتبی ۱۰۰٪ و ارائه فاکتور رسمی',
                                'خدمات ۲۴ ساعته و بدون تعطیلی',
                                'تخفیف ویژه ثبت سفارش آنلاین',
                                'قیمت منصفانه طبق نرخ اتحادیه',
                                'بدون آسیب به لوله‌ها و سرامیک',
                                'پرسنل مجرب، بااخلاق و متعهد',
                                'رعایت کامل بهداشت و ضدعفونی محل'
                              ].map((preset, pIdx) => {
                                const isAlreadyAdded = (galFormData.highlights || []).includes(preset);
                                return (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    disabled={isAlreadyAdded}
                                    onClick={() => {
                                      if (!isAlreadyAdded) {
                                        setGalFormData(prev => ({
                                          ...prev,
                                          highlights: [...(prev.highlights || []), preset]
                                        }));
                                      }
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                                      isAlreadyAdded
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed'
                                        : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 shadow-xs active:scale-95'
                                    }`}
                                  >
                                    <Plus className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    <span>{preset}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* List of current highlights with inline edit and delete */}
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {(galFormData.highlights || []).map((h, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                <input
                                  type="text"
                                  value={h}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setGalFormData(prev => {
                                      const updated = [...(prev.highlights || [])];
                                      updated[idx] = val;
                                      return { ...prev, highlights: updated };
                                    });
                                  }}
                                  className="flex-1 bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setGalFormData(prev => ({
                                      ...prev,
                                      highlights: (prev.highlights || []).filter((_, i) => i !== idx)
                                    }));
                                  }}
                                  className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                                  title="حذف این تیک سبز"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}

                            {(galFormData.highlights || []).length === 0 && (
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center py-2">
                                هیچ تیک سبزی ثبت نشده است. از کادر بالا عبارت جدید وارد کنید.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddGalForm(false);
                              setEditingGalId(null);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold"
                          >
                            انصراف
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer"
                          >
                            {editingGalId ? 'ذخیره تغییرات متن و عکس' : 'افزودن به گالری'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Gallery Items Grid */}
                  {gallery.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 my-4">
                      <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-60" />
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                        گالری و لیست نمونه‌کارها در حال حاضر کاملاً خالی است.
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        برای نمایش نمونه‌کار در سایت، روی دکمه «افزودن نمونه‌کار جدید» در بالا کلیک کنید.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddGalForm(true);
                          setEditingGalId(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>افزودن اولین نمونه‌کار</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {gallery.map(g => (
                      <div key={g.id} className="flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs hover:shadow-md transition-shadow">
                        {/* Media Preview */}
                        {g.type === 'before-after' ? (
                          <div className="relative h-40 w-full grid grid-cols-2 bg-slate-900 overflow-hidden border-b border-slate-200 dark:border-slate-700">
                            <div className="relative h-full overflow-hidden border-l border-slate-700">
                              <img
                                src={g.beforeUrl || g.mediaUrl}
                                alt="قبل"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=400');
                                }}
                              />
                              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-black shadow-xs">قبل</span>
                            </div>
                            <div className="relative h-full overflow-hidden">
                              <img
                                src={g.afterUrl || g.mediaUrl}
                                alt="بعد"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400');
                                }}
                              />
                              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black shadow-xs">بعد</span>
                            </div>
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-xs flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>قبل و بعد (دو عکس)</span>
                            </span>
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
                              {g.category}
                            </span>
                          </div>
                        ) : (
                          <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                            <img 
                              src={g.mediaUrl} 
                              alt={g.title} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=600');
                              }}
                            />
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                              {g.type === 'video' ? <Video className="w-3 h-3 text-blue-400" /> : <ImageIcon className="w-3 h-3 text-emerald-400" />}
                              <span>{g.type === 'video' ? 'ویدیو' : 'تک عکس'}</span>
                            </span>
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
                              {g.category}
                            </span>
                            {g.location && (
                              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-blue-900/80 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5" />
                                {g.location}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                          <div>
                            <h6 className="font-black text-xs text-slate-900 dark:text-white mb-1.5 leading-snug">
                              {g.title}
                            </h6>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                              {g.description || 'بدون توضیحات متنی'}
                            </p>

                            {/* Green Checkmarks List */}
                            {g.highlights && g.highlights.length > 0 && (
                              <div className="space-y-1 pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                                {g.highlights.map((h, hIdx) => (
                                  <div key={hIdx} className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                                    <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                                    <span className="truncate">{h}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700 gap-2">
                            <button
                              onClick={() => startEditGallery(g)}
                              className="flex-1 py-1.5 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              title="ویرایش عنوان، مشخصات، متن و تیک‌های سبز"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>ویرایش متن و مشخصات</span>
                            </button>
                            <button
                              onClick={() => {
                                deleteGalleryItem(g.id);
                                showNotification('نمونه‌کار حذف شد.');
                              }}
                              className="py-1.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="حذف این نمونه‌کار"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </div>
              )}

              {/* TAB 8: MEDIA VAULT ARCHIVE & FULL BACKUP */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  {/* Header & Quick Action Banner */}
                  <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-black text-base">
                        <HardDrive className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <span>مخزن و آرشیو دائمی کلیه تصاویر سایت ({toPersianDigits((settings.mediaVault || []).length)} تصویر)</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        تمامی عکس‌های قبلی و جدید که آپلود یا ویرایش می‌کنید در این مخزن به‌صورت دائمی ذخیره می‌شوند. هنگام خروجی یا اشتراک‌گذاری سایت، تمام این تصاویر همراه سایت باقی می‌مانند.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setNewMediaTitle('');
                          setNewMediaUrlInput('');
                          setNewMediaCategory('general');
                          setShowAddMediaModal(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        <span>آپلود مستقیم عکس جدید (فایل یا لینک)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const jsonStr = exportFullBackup();
                          const blob = new Blob([jsonStr], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `behkar-saveh-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                          showNotification('پشتیبان کامل شامل تمامی تنظیمات و عکس‌ها دانلود شد.');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                        title="دانلود فایل خروجی کامل کلیه عکس‌ها و اطلاعات سایت"
                      >
                        <Download className="w-4 h-4" />
                        <span>دانلود پشتیبان کامل (با عکس‌ها)</span>
                      </button>

                      <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors" title="بارگذاری فایل پشتیبان JSON برای انتقال به سایت دیگر">
                        <FolderArchive className="w-4 h-4 text-amber-400" />
                        <span>بازیابی کامل از فایل</span>
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = ev => {
                              const content = ev.target?.result as string;
                              if (content && importFullBackup(content)) {
                                showNotification('اطلاعات و تمامی عکس‌های سایت با موفقیت بازیابی شدند.');
                                setTimeout(() => window.location.reload(), 1000);
                              } else {
                                alert('خطا در خواندن فایل پشتیبان JSON.');
                              }
                            };
                            reader.readAsText(file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0">
                      {[
                        { id: 'all', label: 'همه عکس‌ها' },
                        { id: 'hero', label: 'بنر و هیرو' },
                        { id: 'service', label: 'خدمات' },
                        { id: 'gallery', label: 'گالری' },
                        { id: 'og', label: 'شبکه‌های اجتماعی' },
                        { id: 'about', label: 'درباره ما' },
                        { id: 'general', label: 'متفرقه' },
                      ].map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setMediaCategoryFilter(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                            mediaCategoryFilter === cat.id
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={mediaSearchQuery}
                        onChange={e => setMediaSearchQuery(e.target.value)}
                        placeholder="جستجو در تصاویر..."
                        className="w-full pr-9 pl-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Media Items Grid */}
                  {(!localSettings.mediaVault || localSettings.mediaVault.length === 0) && (!settings.mediaVault || settings.mediaVault.length === 0) ? (
                    <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700">
                      <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300">هیچ تصویری در آرشیو ثبت نشده است.</p>
                      <p className="text-xs text-slate-400 mt-1">با آپلود یا ویرایش هر عکس در بخش‌های مختلف، نسخه قبلی و جدید در این مکان نگهداری خواهد شد.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {(localSettings.mediaVault || settings.mediaVault || [])
                        .filter(m => mediaCategoryFilter === 'all' || m.category === mediaCategoryFilter)
                        .filter(m => !mediaSearchQuery || m.title.toLowerCase().includes(mediaSearchQuery.toLowerCase()))
                        .map(item => {
                          const isHeroActive = localSettings.heroImageUrl === item.url || settings.heroImageUrl === item.url;
                          const isOgActive = localSettings.ogImageUrl === item.url || settings.ogImageUrl === item.url;
                          const isActive = item.isCurrentActive || isHeroActive || isOgActive;

                          return (
                            <div key={item.id} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3 group hover:border-indigo-500 transition-all">
                              <div>
                                <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 group">
                                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
                                    {item.category === 'hero' ? 'هیرو' : item.category === 'og' ? 'شبکه‌های اجتماعی' : item.category === 'service' ? 'خدمات' : item.category === 'gallery' ? 'گالری' : 'عمومی'}
                                  </span>
                                  {isActive && (
                                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1 shadow-sm">
                                      <CheckCircle className="w-3 h-3" /> {isHeroActive ? 'عکس هیرو' : isOgActive ? 'کاور OG' : 'فعال'}
                                    </span>
                                  )}
                                </div>

                                <div className="pt-2 space-y-2">
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">عنوان تصویر:</label>
                                    <input
                                      type="text"
                                      value={item.title}
                                      onChange={e => {
                                        const newTitle = e.target.value;
                                        const currentVault = localSettings.mediaVault || settings.mediaVault || [];
                                        const updatedVault = currentVault.map(m => m.id === item.id ? { ...m, title: newTitle } : m);
                                        setLocalSettings(prev => ({ ...prev, mediaVault: updatedVault }));
                                      }}
                                      className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                                      placeholder="عنوان عکس..."
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">دسته‌بندی (نوع عکس):</label>
                                    <select
                                      value={item.category}
                                      onChange={e => {
                                        const newCat = e.target.value as any;
                                        const currentVault = localSettings.mediaVault || settings.mediaVault || [];
                                        const updatedVault = currentVault.map(m => m.id === item.id ? { ...m, category: newCat } : m);
                                        setLocalSettings(prev => ({ ...prev, mediaVault: updatedVault }));
                                      }}
                                      className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium cursor-pointer"
                                    >
                                      <option value="general">عمومی (پیش‌فرض)</option>
                                      <option value="hero">عکس هیرو و بنر اصلی</option>
                                      <option value="og">شبکه‌های اجتماعی (OG)</option>
                                      <option value="service">عکس خدمات</option>
                                      <option value="gallery">گالری و نمونه‌کارها</option>
                                      <option value="about">عکس درباره ما</option>
                                      <option value="logo">لوگو و نماد</option>
                                    </select>
                                  </div>

                                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                                    <span>تاریخ: {item.uploadedAt}</span>
                                    {item.originalFileName && <span className="truncate max-w-[100px]">{item.originalFileName}</span>}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentVault = localSettings.mediaVault || settings.mediaVault || [];
                                      const updated = {
                                        ...localSettings,
                                        mediaVault: currentVault
                                      };
                                      setLocalSettings(updated);
                                      updateSettings(updated);
                                      showNotification('عنوان و دسته‌بندی تصویر با موفقیت ذخیره شد.');
                                    }}
                                    className="w-full py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                    <span>ذخیره تغییرات</span>
                                  </button>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                                <div className="grid grid-cols-2 gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentVault = localSettings.mediaVault || settings.mediaVault || [];
                                      if (isHeroActive) {
                                        // Toggle OFF hero image setting
                                        const updatedVault = currentVault.map(m => (m.id === item.id ? { ...m, isCurrentActive: false } : m));
                                        const updated = {
                                          ...localSettings,
                                          heroImageUrl: '',
                                          mediaVault: updatedVault
                                        };
                                        setLocalSettings(updated);
                                        updateSettings(updated);
                                        showNotification('تصویر بنر هیرو با موفقیت لغو و غیرفعال شد.');
                                      } else {
                                        // Set AS hero image
                                        const updatedVault = currentVault.map(m => ({
                                          ...m,
                                          isCurrentActive: m.id === item.id ? true : (m.category === 'hero' ? false : m.isCurrentActive)
                                        }));
                                        const updated = {
                                          ...localSettings,
                                          heroImageUrl: item.url,
                                          mediaVault: updatedVault
                                        };
                                        setLocalSettings(updated);
                                        updateSettings(updated);
                                        showNotification('تصویر با موفقیت به عنوان بنر اصلی هیرو تنظیم و فعال گردید.');
                                      }
                                    }}
                                    className={`p-1.5 rounded-lg font-bold text-[10px] text-center transition-colors cursor-pointer ${
                                      isHeroActive
                                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                                        : 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                                    }`}
                                  >
                                    {isHeroActive ? 'حذف تنظیم هیرو' : 'تنظیم در هیرو'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentVault = localSettings.mediaVault || settings.mediaVault || [];
                                      if (isOgActive) {
                                        // Toggle OFF OG cover image setting
                                        const updatedVault = currentVault.map(m => (m.id === item.id ? { ...m, isCurrentActive: false } : m));
                                        const updated = {
                                          ...localSettings,
                                          ogImageUrl: '',
                                          mediaVault: updatedVault
                                        };
                                        setLocalSettings(updated);
                                        updateSettings(updated);
                                        showNotification('تنظیم کاور شبکه‌های اجتماعی (OG) لغو و غیرفعال شد.');
                                      } else {
                                        // Set AS OG cover image
                                        const updatedVault = currentVault.map(m => ({
                                          ...m,
                                          isCurrentActive: m.id === item.id ? true : (m.category === 'og' ? false : m.isCurrentActive)
                                        }));
                                        const updated = {
                                          ...localSettings,
                                          ogImageUrl: item.url,
                                          mediaVault: updatedVault
                                        };
                                        setLocalSettings(updated);
                                        updateSettings(updated);
                                        showNotification('تصویر با موفقیت به عنوان کاور شبکه‌های اجتماعی (OG) تنظیم شد.');
                                      }
                                    }}
                                    className={`p-1.5 rounded-lg font-bold text-[10px] text-center transition-colors cursor-pointer ${
                                      isOgActive
                                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                                        : 'bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                                    }`}
                                  >
                                    {isOgActive ? 'حذف تنظیم OG' : 'تنظیم در OG'}
                                  </button>
                                </div>

                                <div className="flex items-center justify-between gap-1 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const a = document.createElement('a');
                                      a.href = item.url;
                                      a.download = (item.originalFileName || `image-${item.id}`) + '.jpg';
                                      a.click();
                                      showNotification('دانلود تصویر آغاز شد.');
                                    }}
                                    className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <Download className="w-3 h-3" /> دانلود
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      deleteMediaVaultItem(item.id);
                                      const currentVault = localSettings.mediaVault || settings.mediaVault || [];
                                      const updatedVault = currentVault.filter(m => m.id !== item.id);
                                      const updated = {
                                        ...localSettings,
                                        mediaVault: updatedVault,
                                        heroImageUrl: (localSettings.heroImageUrl === item.url || settings.heroImageUrl === item.url) ? '' : (localSettings.heroImageUrl || ''),
                                        ogImageUrl: (localSettings.ogImageUrl === item.url || settings.ogImageUrl === item.url) ? '' : (localSettings.ogImageUrl || ''),
                                      };
                                      setLocalSettings(updated);
                                      updateSettings(updated);
                                      showNotification('تصویر با موفقیت از آرشیو حذف گردید.');
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                                  >
                                    <Trash2 className="w-3 h-3" /> حذف از آرشیو
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: CONTENT, GUARANTEES & BUTTONS MANAGEMENT */}
              {activeTab === 'content' && (
                <form onSubmit={handleSaveContentSettings} className="space-y-6">
                  <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      مدیریت متن‌ها، ضمانت‌نامه‌ها و دکمه‌های کل سایت
                    </h4>
                    <p className="text-xs text-slate-500">
                      تغییر متن ضمانت‌ها، تیترهای تمام بخش‌ها، فعال/غیرفعال‌سازی دکمه‌ها و افزودن دکمه‌های سفارشی
                    </p>
                  </div>

                  {/* SECTION 1: GUARANTEE TEXTS & NUMBERS */}
                  <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-3">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-black text-sm">
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span>تنظیمات متن و مدت ضمانت‌نامه‌ها در کل سایت</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-right">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          متن ضمانت‌نامه عمومی سایت:
                        </label>
                        <input
                          type="text"
                          value={localSettings.generalGuaranteeText || ''}
                          placeholder="تضمین ۱۰۰٪ کتبی و عدم دریافت وجه در صورت عدم رفع مشکل"
                          onChange={e => setLocalSettings(prev => ({ ...prev, generalGuaranteeText: e.target.value }))}
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          متن یا مدت ضمانت ایزوگام:
                        </label>
                        <input
                          type="text"
                          value={localSettings.isogamGuaranteeText || ''}
                          placeholder="ضمانت کتبی معتبر و مهر شده"
                          onChange={e => setLocalSettings(prev => ({ ...prev, isogamGuaranteeText: e.target.value }))}
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          متن ضمانت لوله بازکنی و فنرزنی:
                        </label>
                        <input
                          type="text"
                          value={localSettings.pipeGuaranteeText || ''}
                          placeholder="ضمانت باز شدن ۱۰۰٪ با فنر برقی و ژنراتور"
                          onChange={e => setLocalSettings(prev => ({ ...prev, pipeGuaranteeText: e.target.value }))}
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: HEADLINES & TEXTS OF SECTIONS */}
                  <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 space-y-4">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-black text-sm">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>ویرایش تیتر و متن بخش‌های اصلی سایت</span>
                    </div>

                    <div className="space-y-3 text-right">
                      {/* Hero Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            تیتر اصلی بالای سایت (هیرو):
                          </label>
                          <input
                            type="text"
                            value={localSettings.heroHeadline || ''}
                            placeholder="لوله بازکنی و تخلیه چاه شبانه‌روزی ساوه"
                            onChange={e => setLocalSettings(prev => ({ ...prev, heroHeadline: e.target.value }))}
                            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            متن توضیحی زیر تیتر هیرو:
                          </label>
                          <input
                            type="text"
                            value={localSettings.heroSubheadline || ''}
                            placeholder="اعزام فوری به کل ساوه و شهر صنعتی کاوه..."
                            onChange={e => setLocalSettings(prev => ({ ...prev, heroSubheadline: e.target.value }))}
                            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                          />
                        </div>
                      </div>

                      {/* Why Choose Us */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            تیتر بخش چرا انتخاب ما:
                          </label>
                          <input
                            type="text"
                            value={localSettings.whyUsHeadline || ''}
                            placeholder="چرا دفتر خدماتی بهکار در ساوه؟"
                            onChange={e => setLocalSettings(prev => ({ ...prev, whyUsHeadline: e.target.value }))}
                            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            متن زیر تیتر چرا ما:
                          </label>
                          <input
                            type="text"
                            value={localSettings.whyUsSubheadline || ''}
                            placeholder="ارائه خدمات تاسیساتی استاندارد با تعهد اخلاقی و نرخ منصفانه"
                            onChange={e => setLocalSettings(prev => ({ ...prev, whyUsSubheadline: e.target.value }))}
                            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                          />
                        </div>
                      </div>

                      {/* Estimator / Pricing */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            تیتر بخش استعلام قیمت و تعرفه‌ها:
                          </label>
                          <input
                            type="text"
                            value={localSettings.estimatorHeadline || ''}
                            placeholder="استعلام آنلاین و تعرفه مصوب قیمت خدمات در شهر ساوه"
                            onChange={e => setLocalSettings(prev => ({ ...prev, estimatorHeadline: e.target.value }))}
                            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            متن توضیحی بخش استعلام:
                          </label>
                          <input
                            type="text"
                            value={localSettings.estimatorSubheadline || ''}
                            placeholder="محاسبه هوشمند هزینه لوله بازکنی، تخلیه چاه، حفر چاه و ایزوگام..."
                            onChange={e => setLocalSettings(prev => ({ ...prev, estimatorSubheadline: e.target.value }))}
                            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                          />
                        </div>
                      </div>

                      {/* Before / After */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            تیتر بخش نمونه‌کارها و مقایسه قبل و بعد:
                          </label>
                          <input
                            type="text"
                            value={localSettings.beforeAfterHeadline || ''}
                            placeholder="نمونه‌کارهای واقعی و مقایسه قبل و بعد در ساوه"
                            onChange={e => setLocalSettings(prev => ({ ...prev, beforeAfterHeadline: e.target.value }))}
                            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            متن توضیحی بخش قبل و بعد:
                          </label>
                          <input
                            type="text"
                            value={localSettings.beforeAfterSubheadline || ''}
                            placeholder="کیفیت انجام کار و رفع کامل گرفتگی‌ها را با اسلایدر تعاملی مقایسه کنید"
                            onChange={e => setLocalSettings(prev => ({ ...prev, beforeAfterSubheadline: e.target.value }))}
                            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION: TECHNICIAN STATUS & HERO SHOWCASE CARD MANAGEMENT */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-4">
                    <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-900/50 pb-3">
                      <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-black text-sm">
                        <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <span>مدیریت کامل «کارت وضعیت تکنسین‌های ساوه» و عکس هیرو</span>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200">
                        نمایش در بالای سایت (هیرو)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-right">
                      {/* 1. Status Text */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                          عنوان وضعیت تکنسین‌ها:
                        </label>
                        <input
                          type="text"
                          value={localSettings.techStatusText || ''}
                          placeholder="وضعیت تکنسین‌های ساوه: آماده اعزام"
                          onChange={e => setLocalSettings(prev => ({ ...prev, techStatusText: e.target.value }))}
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                        />
                      </div>

                      {/* 2. Status Badge */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                          نشان برچسب بالای کارت (وضعیت آنلاین):
                        </label>
                        <input
                          type="text"
                          value={localSettings.techStatusBadge || ''}
                          placeholder="۲۴/۷ فعال"
                          onChange={e => setLocalSettings(prev => ({ ...prev, techStatusBadge: e.target.value }))}
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                        />
                      </div>

                      {/* 3. Image Badge */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                          نشان شناور روی عکس:
                        </label>
                        <input
                          type="text"
                          value={localSettings.techCardImageBadge || ''}
                          placeholder="تضمین کتبی فاکتوردار"
                          onChange={e => setLocalSettings(prev => ({ ...prev, techCardImageBadge: e.target.value }))}
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                        />
                      </div>

                      {/* 4. Subtitle on Image */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                          زیرعنوان روی تصویر:
                        </label>
                        <input
                          type="text"
                          value={localSettings.techCardSubtitle || ''}
                          placeholder="دفتر خدماتی بهکار ساوه"
                          onChange={e => setLocalSettings(prev => ({ ...prev, techCardSubtitle: e.target.value }))}
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                        />
                      </div>

                      {/* 5. Title on Image */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                          تیتر اصلی روی تصویر:
                        </label>
                        <input
                          type="text"
                          value={localSettings.techCardTitle || ''}
                          placeholder="تجهیزات مدرن ژنراتور، فنر فولادی و تانکر مکنده"
                          onChange={e => setLocalSettings(prev => ({ ...prev, techCardTitle: e.target.value }))}
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                        />
                      </div>

                      {/* 6. Location Text on Image */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                          متن پوشش جغرافیایی زیر تصویر:
                        </label>
                        <input
                          type="text"
                          value={localSettings.techCardLocationText || ''}
                          placeholder="پوشش کلیه نقاط ساوه، شهرک کاوه و روستاهای حومه"
                          onChange={e => setLocalSettings(prev => ({ ...prev, techCardLocationText: e.target.value }))}
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                        />
                      </div>
                    </div>

                    {/* Image Upload & Management Box */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-right">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                          تصویر اصلی کارت تکنسین‌ها (آدرس لینک یا آپلود فایل مستقیم):
                        </label>
                        {localSettings.heroImageUrl && (
                          <button
                            type="button"
                            onClick={() => setLocalSettings(prev => ({ ...prev, heroImageUrl: '' }))}
                            className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف عکس</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="لینک اینترنتی عکس (https://...)"
                          value={localSettings.heroImageUrl || ''}
                          onChange={e => setLocalSettings(prev => ({ ...prev, heroImageUrl: e.target.value }))}
                          className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                        />
                        <label className="shrink-0 cursor-pointer px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900 dark:hover:bg-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors">
                          <Upload className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
                          <span>{localSettings.heroImageUrl ? 'تغییر عکس' : 'آپلود عکس'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleSettingsImageUpload(e, 'heroImageUrl')}
                          />
                        </label>
                      </div>

                      {localSettings.heroImageUrl && (
                        <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 mt-2">
                          <img src={localSettings.heroImageUrl} alt="پیش‌نمایش تصویر تکنسین‌ها" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION: WEBSITE MAIN IMAGES & BANNERS MANAGEMENT */}
                  <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 text-right">
                      <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-black text-sm">
                        <ImageIcon className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
                        <span>مدیریت، تغییر و حذف عکس‌های اصلی و بنرهای سایت</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          updateSettings(localSettings);
                          showNotification('تصاویر و بنرهای جدید سایت با موفقیت ذخیره و اعمال گردید.');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>ذخیره تغییرات بنرها</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
                      {/* 1. Hero Image */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                              ۱. بنر هیرو (بالای سایت):
                            </label>
                            {localSettings.heroImageUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = { ...localSettings, heroImageUrl: '' };
                                  setLocalSettings(updated);
                                  updateSettings(updated);
                                  showNotification('عکس بنر اصلی حذف گردید.');
                                }}
                                className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="url"
                              placeholder="لینک تصویر (https://...)"
                              value={localSettings.heroImageUrl || ''}
                              onChange={e => setLocalSettings(prev => ({ ...prev, heroImageUrl: e.target.value }))}
                              className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                            />
                            <label className="shrink-0 cursor-pointer px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-900 dark:text-purple-200 text-xs font-bold flex items-center gap-1 transition-colors">
                              <Upload className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                              <span>{localSettings.heroImageUrl ? 'تغییر' : 'آپلود'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => handleSettingsImageUpload(e, 'heroImageUrl')}
                              />
                            </label>
                          </div>
                        </div>

                        {localSettings.heroImageUrl ? (
                          <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 mt-2 group">
                            <img src={localSettings.heroImageUrl} alt="پیش‌نمایش بنر اصلی" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-white/90 text-slate-900 text-xs font-bold flex items-center gap-1 hover:bg-white">
                                <Upload className="w-3 h-3 text-purple-600" />
                                <span>ویرایش</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => handleSettingsImageUpload(e, 'heroImageUrl')}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = { ...localSettings, heroImageUrl: '' };
                                  setLocalSettings(updated);
                                  updateSettings(updated);
                                  showNotification('عکس بنر اصلی حذف گردید.');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-xs font-bold flex items-center gap-1 hover:bg-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>حذف</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-28 w-full rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs gap-1 mt-2">
                            <ImageIcon className="w-6 h-6 stroke-1" />
                            <span>تصویری تنظیم نشده است</span>
                          </div>
                        )}
                      </div>

                      {/* 2. Why Us Photo */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                              ۲. بنر بخش «چرا انتخاب ما»:
                            </label>
                            {localSettings.whyUsImageUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = { ...localSettings, whyUsImageUrl: '' };
                                  setLocalSettings(updated);
                                  updateSettings(updated);
                                  showNotification('عکس بخش چرا ما حذف گردید.');
                                }}
                                className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="url"
                              placeholder="لینک تصویر (https://...)"
                              value={localSettings.whyUsImageUrl || ''}
                              onChange={e => setLocalSettings(prev => ({ ...prev, whyUsImageUrl: e.target.value }))}
                              className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                            />
                            <label className="shrink-0 cursor-pointer px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-900 dark:text-purple-200 text-xs font-bold flex items-center gap-1 transition-colors">
                              <Upload className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                              <span>{localSettings.whyUsImageUrl ? 'تغییر' : 'آپلود'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => handleSettingsImageUpload(e, 'whyUsImageUrl')}
                              />
                            </label>
                          </div>
                        </div>

                        {localSettings.whyUsImageUrl ? (
                          <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 mt-2 group">
                            <img src={localSettings.whyUsImageUrl} alt="پیش‌نمایش بنر چرا ما" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-white/90 text-slate-900 text-xs font-bold flex items-center gap-1 hover:bg-white">
                                <Upload className="w-3 h-3 text-purple-600" />
                                <span>ویرایش</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => handleSettingsImageUpload(e, 'whyUsImageUrl')}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = { ...localSettings, whyUsImageUrl: '' };
                                  setLocalSettings(updated);
                                  updateSettings(updated);
                                  showNotification('عکس بخش چرا ما حذف گردید.');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-xs font-bold flex items-center gap-1 hover:bg-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>حذف</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-28 w-full rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs gap-1 mt-2">
                            <ImageIcon className="w-6 h-6 stroke-1" />
                            <span>تصویری تنظیم نشده است</span>
                          </div>
                        )}
                      </div>

                      {/* 3. About Office Photo */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                              ۳. بنر بخش «درباره دفتر و تجهیزات»:
                            </label>
                            {localSettings.aboutImageUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = { ...localSettings, aboutImageUrl: '' };
                                  setLocalSettings(updated);
                                  updateSettings(updated);
                                  showNotification('عکس بخش درباره دفتر حذف گردید.');
                                }}
                                className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="url"
                              placeholder="لینک تصویر (https://...)"
                              value={localSettings.aboutImageUrl || ''}
                              onChange={e => setLocalSettings(prev => ({ ...prev, aboutImageUrl: e.target.value }))}
                              className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                            />
                            <label className="shrink-0 cursor-pointer px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-900 dark:text-purple-200 text-xs font-bold flex items-center gap-1 transition-colors">
                              <Upload className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                              <span>{localSettings.aboutImageUrl ? 'تغییر' : 'آپلود'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => handleSettingsImageUpload(e, 'aboutImageUrl')}
                              />
                            </label>
                          </div>
                        </div>

                        {localSettings.aboutImageUrl ? (
                          <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 mt-2 group">
                            <img src={localSettings.aboutImageUrl} alt="پیش‌نمایش بنر درباره دفتر" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-white/90 text-slate-900 text-xs font-bold flex items-center gap-1 hover:bg-white">
                                <Upload className="w-3 h-3 text-purple-600" />
                                <span>ویرایش</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => handleSettingsImageUpload(e, 'aboutImageUrl')}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = { ...localSettings, aboutImageUrl: '' };
                                  setLocalSettings(updated);
                                  updateSettings(updated);
                                  showNotification('عکس بخش درباره دفتر حذف گردید.');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-xs font-bold flex items-center gap-1 hover:bg-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>حذف</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-28 w-full rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs gap-1 mt-2">
                            <ImageIcon className="w-6 h-6 stroke-1" />
                            <span>تصویری تنظیم نشده است</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION: HOMEPAGE SECTIONS VISIBILITY TOGGLES (مدیریت نمایش بخش‌های مختلف صفحه اصلی) */}
                  <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-800/60 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100 dark:border-indigo-900/60">
                      <div>
                        <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-black text-sm sm:text-base">
                          <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          <span>مدیریت نمایش و عدم نمایش بخش‌های صفحه اصلی سایت</span>
                        </div>
                        <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                          می‌توانید هر کدام از بخش‌های صفحه اصلی (از جمله استعلام آنلاین و تعرفه‌ها، خدمات، گالری، نقشه و...) را با ۱ کلیک فعال یا مخفی نمایید.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 bg-white dark:bg-slate-800/90 p-2 sm:px-3 sm:py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900 dark:text-white block">
                            {[
                              localSettings.showPricingSection !== false,
                              localSettings.showServicesSection !== false,
                              localSettings.showGallerySection !== false,
                              localSettings.showCoverageMapSection !== false,
                              localSettings.showWhyUsSection !== false,
                              localSettings.showFaqSection !== false,
                              localSettings.showReviewsSection !== false,
                              localSettings.showHeroSection !== false
                            ].filter(Boolean).length >= 7
                              ? 'تمام بخش‌ها فعال'
                              : 'مخفی‌سازی موقت'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const isCurrentlyActive = [
                              localSettings.showPricingSection !== false,
                              localSettings.showServicesSection !== false,
                              localSettings.showGallerySection !== false,
                              localSettings.showCoverageMapSection !== false,
                              localSettings.showWhyUsSection !== false,
                              localSettings.showFaqSection !== false,
                              localSettings.showReviewsSection !== false,
                              localSettings.showHeroSection !== false
                            ].filter(Boolean).length >= 7;

                            if (isCurrentlyActive) {
                              const updated = {
                                ...localSettings,
                                showHeroSection: true,
                                showServicesSection: false,
                                showPricingSection: false,
                                showGallerySection: false,
                                showCoverageMapSection: false,
                                showWhyUsSection: false,
                                showReviewsSection: false,
                                showFaqSection: false,
                              };
                              setLocalSettings(updated);
                              updateSettings(updated);
                              showNotification('تمامی بخش‌های فرعی به صورت موقت مخفی شدند.');
                            } else {
                              const updated = {
                                ...localSettings,
                                showHeroSection: true,
                                showServicesSection: true,
                                showPricingSection: true,
                                showGallerySection: true,
                                showCoverageMapSection: true,
                                showWhyUsSection: true,
                                showReviewsSection: true,
                                showFaqSection: true,
                                showFloatingBar: true,
                              };
                              setLocalSettings(updated);
                              updateSettings(updated);
                              showNotification('تمام بخش‌های صفحه اصلی سایت فعال و نمایان شدند.');
                            }
                          }}
                          className={`w-13 h-7 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner ${
                            [
                              localSettings.showPricingSection !== false,
                              localSettings.showServicesSection !== false,
                              localSettings.showGallerySection !== false,
                              localSettings.showCoverageMapSection !== false,
                              localSettings.showWhyUsSection !== false,
                              localSettings.showFaqSection !== false,
                              localSettings.showReviewsSection !== false,
                              localSettings.showHeroSection !== false
                            ].filter(Boolean).length >= 7 
                              ? 'bg-emerald-600' 
                              : 'bg-slate-400 dark:bg-slate-700'
                          }`}
                          dir="ltr"
                          role="switch"
                          aria-checked={[
                            localSettings.showPricingSection !== false,
                            localSettings.showServicesSection !== false,
                            localSettings.showGallerySection !== false,
                            localSettings.showCoverageMapSection !== false,
                            localSettings.showWhyUsSection !== false,
                            localSettings.showFaqSection !== false,
                            localSettings.showReviewsSection !== false,
                            localSettings.showHeroSection !== false
                          ].filter(Boolean).length >= 7}
                        >
                          <span
                            className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center text-[10px] font-bold ${
                              [
                                localSettings.showPricingSection !== false,
                                localSettings.showServicesSection !== false,
                                localSettings.showGallerySection !== false,
                                localSettings.showCoverageMapSection !== false,
                                localSettings.showWhyUsSection !== false,
                                localSettings.showFaqSection !== false,
                                localSettings.showReviewsSection !== false,
                                localSettings.showHeroSection !== false
                              ].filter(Boolean).length >= 7
                                ? 'translate-x-[24px] text-emerald-600'
                                : 'translate-x-0 text-slate-500'
                            }`}
                          >
                            {[
                              localSettings.showPricingSection !== false,
                              localSettings.showServicesSection !== false,
                              localSettings.showGallerySection !== false,
                              localSettings.showCoverageMapSection !== false,
                              localSettings.showWhyUsSection !== false,
                              localSettings.showFaqSection !== false,
                              localSettings.showReviewsSection !== false,
                              localSettings.showHeroSection !== false
                            ].filter(Boolean).length >= 7 ? '✓' : '✕'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Master Call for Price Toggle in Content Settings */}
                    <div className={`p-4 rounded-xl border-2 transition-all shadow-sm ${
                      localSettings.forceCallForPrice
                        ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white'
                        : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/50'
                    }`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                            localSettings.forceCallForPrice
                              ? 'bg-amber-500 text-white'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                          }`}>
                            <Phone className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white block">
                              تغییر همه قیمت‌های سایت به «برای استعلام قیمت تماس بگیرید»
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              تبدیل تمام مبالغ ریالی سایت به حالت استعلام تلفنی با ۱ کلیک
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...localSettings, forceCallForPrice: !localSettings.forceCallForPrice };
                            setLocalSettings(updated);
                            updateSettings(updated);
                            showNotification(
                              updated.forceCallForPrice 
                                ? 'حالت استعلام تلفنی فعال شد؛ تمام قیمت‌ها به «برای استعلام قیمت تماس بگیرید» تغییر یافتند.' 
                                : 'نمایش مبالغ و قیمت‌های ریالی فعال شد.'
                            );
                          }}
                          className={`w-13 h-7 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner ${
                            localSettings.forceCallForPrice ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          dir="ltr"
                          role="switch"
                          aria-checked={Boolean(localSettings.forceCallForPrice)}
                        >
                          <span
                            className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                              localSettings.forceCallForPrice ? 'translate-x-[24px]' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Section Visibility Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-right">
                      
                      {/* 1. Online Estimator & Tariffs Section (کل بخش استعلام آنلاین و تعرفه مصوب قیمت خدمات در شهر ساوه) */}
                      <div className={`p-3.5 rounded-xl border-2 transition-all ${
                        localSettings.showPricingSection !== false
                          ? 'bg-white dark:bg-slate-900 border-blue-500/50 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                              <Calculator className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-black text-slate-900 dark:text-white block">
                                بخش استعلام آنلاین و تعرفه مصوب قیمت خدمات
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                محاسبه‌گر آنلاین، جدول قیمت‌ها و فرم ثبت استعلام
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...localSettings, showPricingSection: !(localSettings.showPricingSection !== false) };
                              setLocalSettings(updated);
                              updateSettings(updated);
                              showNotification(updated.showPricingSection ? 'بخش استعلام و تعرفه‌ها در سایت فعال شد.' : 'بخش استعلام و تعرفه‌ها از سایت مخفی شد.');
                            }}
                            className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner ${
                              localSettings.showPricingSection !== false ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            dir="ltr"
                            role="switch"
                            aria-checked={localSettings.showPricingSection !== false}
                          >
                            <span
                              className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                                localSettings.showPricingSection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* 2. Core Services Section */}
                      <div className={`p-3.5 rounded-xl border-2 transition-all ${
                        localSettings.showServicesSection !== false
                          ? 'bg-white dark:bg-slate-900 border-blue-500/50 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                              <Wrench className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-black text-slate-900 dark:text-white block">
                                بخش خدمات جامع و کارت‌های خدمات
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                لوله بازکنی، تخلیه چاه، ایزوگام، حفر چاه و لوله‌کشی
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...localSettings, showServicesSection: !(localSettings.showServicesSection !== false) };
                              setLocalSettings(updated);
                              updateSettings(updated);
                              showNotification(updated.showServicesSection ? 'بخش خدمات در سایت فعال شد.' : 'بخش خدمات از سایت مخفی شد.');
                            }}
                            className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner ${
                              localSettings.showServicesSection !== false ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            dir="ltr"
                            role="switch"
                            aria-checked={localSettings.showServicesSection !== false}
                          >
                            <span
                              className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                                localSettings.showServicesSection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* 3. Hero & Banner Section */}
                      <div className={`p-3.5 rounded-xl border-2 transition-all ${
                        localSettings.showHeroSection !== false
                          ? 'bg-white dark:bg-slate-900 border-blue-500/50 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-black text-slate-900 dark:text-white block">
                                بخش بنر و هیرو بالای سایت
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                معرفی دفتر، دکمه‌های تماس سریع و کارت تکنسین‌ها
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...localSettings, showHeroSection: !(localSettings.showHeroSection !== false) };
                              setLocalSettings(updated);
                              updateSettings(updated);
                              showNotification(updated.showHeroSection ? 'بخش هیرو در سایت فعال شد.' : 'بخش هیرو از سایت مخفی شد.');
                            }}
                            className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner ${
                              localSettings.showHeroSection !== false ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            dir="ltr"
                            role="switch"
                            aria-checked={localSettings.showHeroSection !== false}
                          >
                            <span
                              className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                                localSettings.showHeroSection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* 4. Gallery & Before/After Slider Section */}
                      <div className={`p-3.5 rounded-xl border-2 transition-all ${
                        localSettings.showGallerySection !== false
                          ? 'bg-white dark:bg-slate-900 border-blue-500/50 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shrink-0">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-black text-slate-900 dark:text-white block">
                                بخش گالری، ویدیوها و اسلایدر قبل و بعد
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                نمونه‌کارهای تصویری و مقایسه قبل و بعد پروژه‌ها
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...localSettings, showGallerySection: !(localSettings.showGallerySection !== false) };
                              setLocalSettings(updated);
                              updateSettings(updated);
                              showNotification(updated.showGallerySection ? 'بخش گالری در سایت فعال شد.' : 'بخش گالری از سایت مخفی شد.');
                            }}
                            className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner ${
                              localSettings.showGallerySection !== false ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            dir="ltr"
                            role="switch"
                            aria-checked={localSettings.showGallerySection !== false}
                          >
                            <span
                              className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                                localSettings.showGallerySection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* 5. Coverage Map Section */}
                      <div className={`p-3.5 rounded-xl border-2 transition-all ${
                        localSettings.showCoverageMapSection !== false
                          ? 'bg-white dark:bg-slate-900 border-blue-500/50 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold shrink-0">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-black text-slate-900 dark:text-white block">
                                بخش نقشه و مناطق تحت پوشش ساوه
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                لیست محله‌های ساوه، زمان اعزام و موقعیت جغرافیایی
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...localSettings, showCoverageMapSection: !(localSettings.showCoverageMapSection !== false) };
                              setLocalSettings(updated);
                              updateSettings(updated);
                              showNotification(updated.showCoverageMapSection ? 'بخش نقشه و پوشش محله‌ها در سایت فعال شد.' : 'بخش نقشه از سایت مخفی شد.');
                            }}
                            className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner ${
                              localSettings.showCoverageMapSection !== false ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            dir="ltr"
                            role="switch"
                            aria-checked={localSettings.showCoverageMapSection !== false}
                          >
                            <span
                              className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                                localSettings.showCoverageMapSection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* 6. Why Choose Us Section */}
                      <div className={`p-3.5 rounded-xl border-2 transition-all ${
                        localSettings.showWhyUsSection !== false
                          ? 'bg-white dark:bg-slate-900 border-blue-500/50 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center font-bold shrink-0">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-black text-slate-900 dark:text-white block">
                                بخش چرا دفتر بهکار و تضمین‌ها
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                مزایای رقابتی، ضمانت‌های کتبی و ابزارآلات پیشرفته
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...localSettings, showWhyUsSection: !(localSettings.showWhyUsSection !== false) };
                              setLocalSettings(updated);
                              updateSettings(updated);
                              showNotification(updated.showWhyUsSection ? 'بخش چرا بهکار در سایت فعال شد.' : 'بخش چرا بهکار از سایت مخفی شد.');
                            }}
                            className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner ${
                              localSettings.showWhyUsSection !== false ? 'bg-red-600' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            dir="ltr"
                            role="switch"
                            aria-checked={localSettings.showWhyUsSection !== false}
                          >
                            <span
                              className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                                localSettings.showWhyUsSection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* 7. Customer Reviews Section */}
                      <div className={`p-3.5 rounded-xl border-2 transition-all ${
                        localSettings.showReviewsSection !== false
                          ? 'bg-white dark:bg-slate-900 border-blue-500/50 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                              <Star className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-black text-slate-900 dark:text-white block">
                                بخش نظرات و رضایت‌مندی مشتریان
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                دیدگاه‌های تاییدشده همشهریان ساوه و امتیازدهی
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...localSettings, showReviewsSection: !(localSettings.showReviewsSection !== false) };
                              setLocalSettings(updated);
                              updateSettings(updated);
                              showNotification(updated.showReviewsSection ? 'بخش نظرات در سایت فعال شد.' : 'بخش نظرات از سایت مخفی شد.');
                            }}
                            className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner ${
                              localSettings.showReviewsSection !== false ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            dir="ltr"
                            role="switch"
                            aria-checked={localSettings.showReviewsSection !== false}
                          >
                            <span
                              className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                                localSettings.showReviewsSection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* 8. FAQ Section */}
                      <div className={`p-3.5 rounded-xl border-2 transition-all ${
                        localSettings.showFaqSection !== false
                          ? 'bg-white dark:bg-slate-900 border-blue-500/50 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold shrink-0">
                              <HelpCircle className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-black text-slate-900 dark:text-white block">
                                بخش سوالات متداول شهروندان ساوه
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                پرسش‌ها و پاسخ‌های پرتکرار مشتریان
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...localSettings, showFaqSection: !(localSettings.showFaqSection !== false) };
                              setLocalSettings(updated);
                              updateSettings(updated);
                              showNotification(updated.showFaqSection ? 'بخش سوالات متداول در سایت فعال شد.' : 'بخش سوالات متداول از سایت مخفی شد.');
                            }}
                            className={`w-12 h-6.5 rounded-full transition-colors relative p-1 inline-flex items-center shrink-0 cursor-pointer shadow-inner ${
                              localSettings.showFaqSection !== false ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            dir="ltr"
                            role="switch"
                            aria-checked={localSettings.showFaqSection !== false}
                          >
                            <span
                              className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                                localSettings.showFaqSection !== false ? 'translate-x-[22px]' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* SECTION 3: BUTTON VISIBILITY TOGGLES */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm">
                      <Layers className="w-4 h-4 text-blue-600" />
                      <span>تنظیمات فعال/غیرفعال بودن دکمه‌های بخش‌های مختلف</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      {/* Hero Buttons */}
                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localSettings.showHeroCall1 !== false}
                          onChange={e => setLocalSettings(prev => ({ ...prev, showHeroCall1: e.target.checked }))}
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                        />
                        <span className="font-bold">دکمه تماس اصلی هیرو</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localSettings.showHeroCall2 !== false}
                          onChange={e => setLocalSettings(prev => ({ ...prev, showHeroCall2: e.target.checked }))}
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                        />
                        <span className="font-bold">دکمه تماس دوم هیرو</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localSettings.showHeroBooking !== false}
                          onChange={e => setLocalSettings(prev => ({ ...prev, showHeroBooking: e.target.checked }))}
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                        />
                        <span className="font-bold">دکمه ثبت درخواست هیرو</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localSettings.showHeroRubika !== false}
                          onChange={e => setLocalSettings(prev => ({ ...prev, showHeroRubika: e.target.checked }))}
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                        />
                        <span className="font-bold">دکمه روبیکا در هیرو</span>
                      </label>

                      {/* Mobile Floating Bar Toggles */}
                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localSettings.showFloatingBar !== false}
                          onChange={e => setLocalSettings(prev => ({ ...prev, showFloatingBar: e.target.checked }))}
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                        />
                        <span className="font-bold">کل نوار شناور پایین موبایل</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localSettings.showFloatingCall1 !== false}
                          onChange={e => setLocalSettings(prev => ({ ...prev, showFloatingCall1: e.target.checked }))}
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                        />
                        <span className="font-bold">دکمه تماس ۱ نوار شناور</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localSettings.showFloatingCall2 !== false}
                          onChange={e => setLocalSettings(prev => ({ ...prev, showFloatingCall2: e.target.checked }))}
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                        />
                        <span className="font-bold">دکمه تماس ۲ نوار شناور</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localSettings.showFloatingRubika !== false}
                          onChange={e => setLocalSettings(prev => ({ ...prev, showFloatingRubika: e.target.checked }))}
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                        />
                        <span className="font-bold">دکمه روبیکا نوار شناور</span>
                      </label>
                    </div>
                  </div>

                  {/* SECTION 4: CUSTOM BUTTONS BUILDER */}
                  <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-black text-sm">
                        <Plus className="w-4 h-4 text-indigo-600" />
                        <span>افزودن و مدیریت دکمه‌های سفارشی اختصاصی</span>
                      </div>
                      <span className="text-xs text-indigo-600 font-bold">
                        {toPersianDigits((localSettings.customButtons || []).length)} دکمه ثبت شده
                      </span>
                    </div>

                    {/* Add Custom Button Mini-form */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="عنوان دکمه (مثال: کانال ایتا)"
                          value={newBtnTitle}
                          onChange={e => setNewBtnTitle(e.target.value)}
                          className="py-1.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border text-xs"
                        />
                        <input
                          type="text"
                          dir="ltr"
                          placeholder="آدرس لینک یا شماره تلفن (tel: یا https://)"
                          value={newBtnUrl}
                          onChange={e => setNewBtnUrl(e.target.value)}
                          className="py-1.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border text-xs font-mono"
                        />
                        <div className="flex items-center gap-2">
                          <select
                            value={newBtnVariant}
                            onChange={e => setNewBtnVariant(e.target.value as any)}
                            className="py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border text-xs flex-1"
                          >
                            <option value="primary">آبی (اصلی)</option>
                            <option value="success">سبز (تماس)</option>
                            <option value="rubika">بنفش (روبیکا)</option>
                            <option value="secondary">خاکستری</option>
                          </select>
                          <button
                            type="button"
                            onClick={handleAddCustomButton}
                            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 cursor-pointer shadow-xs"
                          >
                            + افزودن دکمه
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Existing Custom Buttons List */}
                    {(localSettings.customButtons || []).length > 0 && (
                      <div className="space-y-2">
                        {(localSettings.customButtons || []).map(btn => (
                          <div
                            key={btn.id}
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white">{btn.title}</span>
                              <span className="text-[11px] text-slate-400 font-mono" dir="ltr">{btn.url}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleCustomButton(btn.id)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                                  (btn.isVisible !== false && btn.visible !== false)
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                }`}
                              >
                                {(btn.isVisible !== false && btn.visible !== false) ? 'فعال در سایت' : 'مخفی'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomButton(btn.id)}
                                className="p-1 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                                title="حذف دکمه"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Save Content Settings Action */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>ذخیره تغییرات متن‌ها و دکمه‌ها</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 8: GENERAL SETTINGS & DYNAMIC MESSENGERS */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  {/* Contact Details & Admin Security */}
                  <form onSubmit={handleSaveGeneral} className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                    <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <span>مشخصات تماس و امنیت پنل مدیریت</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          شماره‌های تماس دفتر، نام کاربری و رمز عبور مدیر و شماره مخفی ورود
                        </p>
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
                      >
                        <Save className="w-4 h-4" />
                        <span>ذخیره مشخصات</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          شماره تماس اصلی (آقای زمانی):
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          required
                          value={localSettings.primaryPhone}
                          onChange={e => setLocalSettings(prev => ({ ...prev, primaryPhone: e.target.value }))}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          شماره تماس دوم / پشتیبانی:
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={localSettings.secondaryPhone}
                          onChange={e => setLocalSettings(prev => ({ ...prev, secondaryPhone: e.target.value }))}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          نام کاربری ورود به پنل ادمین:
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          required
                          value={localSettings.adminUsername || 'jafarzamanichn2005'}
                          onChange={e => setLocalSettings(prev => ({ ...prev, adminUsername: e.target.value }))}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          کلمه عبور اختصاصی مدیر:
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          required
                          value={localSettings.adminPin || 'Jz#9842Km$7W'}
                          onChange={e => setLocalSettings(prev => ({ ...prev, adminPin: e.target.value }))}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-2 p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 mt-1 space-y-2">
                        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs">
                          <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>شماره تلفن کلید ورود مخفی به پنل ادمین (Secret Trigger Phone):</span>
                        </div>
                        <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                          با وارد کردن این شماره تلفن در فرم‌های ثبت درخواست و استعلام قیمت آنلاین، فرم ورود به پنل مدیریت باز خواهد شد.
                        </p>
                        <input
                          type="text"
                          dir="ltr"
                          required
                          placeholder="09123456789"
                          value={localSettings.adminTriggerPhone || '09123456789'}
                          onChange={e => setLocalSettings(prev => ({ ...prev, adminTriggerPhone: e.target.value }))}
                          className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-xs font-mono text-amber-900 dark:text-amber-100 font-bold shadow-xs"
                        />
                      </div>
                    </div>
                  </form>

                  {/* Section 2: Dynamic Messengers & Social Media Channels Manager */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <span>مدیریت پیام‌رسان‌ها و ارتباط آنلاین</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          قابلیت افزودن هر نوع پیام‌رسان و کانال ارتباطی دلخواه با آپلود عکس آیکون اختصاصی و انتخاب رنگ دلخواه
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleOpenAddMessengerModal}
                        className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all self-start sm:self-auto shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>افزودن پیام‌رسان جدید</span>
                      </button>
                    </div>

                    {/* Configured Messengers List */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>لیست پیام‌رسان‌های فعال سایت ({toPersianDigits((localSettings.messengers || []).length)} مورد):</span>
                      </div>

                      {(!localSettings.messengers || localSettings.messengers.length === 0) ? (
                        <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs space-y-2">
                          <MessageSquare className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
                          <p>هنوز هیچ پیام‌رسانی اضافه نشده است.</p>
                          <p className="text-[11px] text-slate-400">برای افزودن پیام‌رسان، روی دکمه «افزودن پیام‌رسان جدید» کلیک فرمایید.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {localSettings.messengers.map((msg, index) => {
                            const themeStyles: Record<string, { bg: string; border: string; text: string; badgeBg: string }> = {
                              purple: { bg: 'bg-purple-500/10 dark:bg-purple-950/30', border: 'border-purple-300 dark:border-purple-800/60', text: 'text-purple-600 dark:text-purple-400', badgeBg: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' },
                              orange: { bg: 'bg-orange-500/10 dark:bg-orange-950/30', border: 'border-orange-300 dark:border-orange-800/60', text: 'text-orange-600 dark:text-orange-400', badgeBg: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300' },
                              emerald: { bg: 'bg-emerald-500/10 dark:bg-emerald-950/30', border: 'border-emerald-300 dark:border-emerald-800/60', text: 'text-emerald-600 dark:text-emerald-400', badgeBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' },
                              blue: { bg: 'bg-sky-500/10 dark:bg-sky-950/30', border: 'border-sky-300 dark:border-sky-800/60', text: 'text-sky-600 dark:text-sky-400', badgeBg: 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300' },
                              indigo: { bg: 'bg-indigo-500/10 dark:bg-indigo-950/30', border: 'border-indigo-300 dark:border-indigo-800/60', text: 'text-indigo-600 dark:text-indigo-400', badgeBg: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' },
                              cyan: { bg: 'bg-teal-500/10 dark:bg-teal-950/30', border: 'border-teal-300 dark:border-teal-800/60', text: 'text-teal-600 dark:text-teal-400', badgeBg: 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300' },
                              pink: { bg: 'bg-pink-500/10 dark:bg-pink-950/30', border: 'border-pink-300 dark:border-pink-800/60', text: 'text-pink-600 dark:text-pink-400', badgeBg: 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300' },
                              red: { bg: 'bg-red-500/10 dark:bg-red-950/30', border: 'border-red-300 dark:border-red-800/60', text: 'text-red-600 dark:text-red-400', badgeBg: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' },
                              amber: { bg: 'bg-amber-500/10 dark:bg-amber-950/30', border: 'border-amber-300 dark:border-amber-800/60', text: 'text-amber-600 dark:text-amber-400', badgeBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300' },
                              teal: { bg: 'bg-teal-500/10 dark:bg-teal-950/30', border: 'border-teal-300 dark:border-teal-800/60', text: 'text-teal-600 dark:text-teal-400', badgeBg: 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300' },
                              slate: { bg: 'bg-slate-500/10 dark:bg-slate-800/50', border: 'border-slate-300 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300', badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
                            };

                            const isCustom = msg.colorTheme === 'custom' || !!msg.customColorHex;
                            const customHex = msg.customColorHex || '#9333ea';
                            const st = !isCustom ? (themeStyles[msg.colorTheme || 'purple'] || themeStyles.purple) : null;

                            return (
                              <div
                                key={msg.id}
                                style={isCustom ? {
                                  backgroundColor: `${customHex}10`,
                                  borderColor: `${customHex}40`,
                                } : undefined}
                                className={`p-3.5 rounded-xl border ${st ? `${st.border} ${st.bg}` : ''} space-y-3 transition-all ${
                                  msg.isActive === false ? 'opacity-50 grayscale' : ''
                                } shadow-2xs`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2.5">
                                    <div 
                                      style={isCustom ? { backgroundColor: `${customHex}20`, color: customHex } : undefined}
                                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${st ? st.badgeBg : ''}`}
                                    >
                                      {msg.customIconUrl ? (
                                        <img src={msg.customIconUrl} alt={msg.name} className="w-5 h-5 rounded-full object-cover" />
                                      ) : msg.iconName === 'phone' ? (
                                        <Phone className="w-4 h-4" />
                                      ) : msg.iconName === 'send' ? (
                                        <Send className="w-4 h-4" />
                                      ) : msg.iconName === 'instagram' ? (
                                        <Instagram className="w-4 h-4" />
                                      ) : msg.iconName === 'link' ? (
                                        <LinkIcon className="w-4 h-4" />
                                      ) : msg.iconName === 'mail' ? (
                                        <Mail className="w-4 h-4" />
                                      ) : msg.iconName === 'radio' ? (
                                        <Radio className="w-4 h-4" />
                                      ) : msg.iconName === 'zap' ? (
                                        <Zap className="w-4 h-4" />
                                      ) : msg.iconName === 'globe' ? (
                                        <Globe className="w-4 h-4" />
                                      ) : msg.iconName === 'share-2' ? (
                                        <Share2 className="w-4 h-4" />
                                      ) : (
                                        <MessageCircle className="w-4 h-4" />
                                      )}
                                    </div>
                                    <div>
                                      <h5 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span>{msg.name}</span>
                                        {msg.badge && (
                                          <span 
                                            style={isCustom ? { backgroundColor: `${customHex}25`, color: customHex } : undefined}
                                            className={`text-[10px] px-1.5 py-0.5 rounded-md font-normal ${st ? st.badgeBg : ''}`}
                                          >
                                            {msg.badge}
                                          </span>
                                        )}
                                      </h5>
                                      {msg.usernameOrId && (
                                        <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-0.5" dir="ltr">
                                          {msg.usernameOrId}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Action Buttons: Edit, Delete, Reorder */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleMoveMessenger(index, 'up')}
                                      disabled={index === 0}
                                      className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                                      title="انتقال به بالا"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleMoveMessenger(index, 'down')}
                                      disabled={index === (localSettings.messengers || []).length - 1}
                                      className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                                      title="انتقال به پایین"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleEditMessenger(msg)}
                                      className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 active:scale-95 cursor-pointer flex items-center justify-center transition-all"
                                      title="ویرایش پیام‌رسان"
                                      aria-label={`ویرایش پیام‌رسان ${msg.name}`}
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteMessenger(msg.id)}
                                      className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 active:scale-95 cursor-pointer flex items-center justify-center transition-all"
                                      title="حذف فوری پیام‌رسان"
                                      aria-label={`حذف پیام‌رسان ${msg.name}`}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Link display & test click */}
                                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[11px]">
                                  <span className="font-mono text-slate-600 dark:text-slate-400 truncate max-w-[200px]" dir="ltr">
                                    {msg.link}
                                  </span>
                                  <a
                                    href={msg.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
                                  >
                                    <span>تست لینک</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>

                                {/* Visibility & Location Toggles */}
                                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleMessengerActive(msg.id)}
                                      className={`px-2.5 py-1 rounded-md font-bold text-[10px] transition-colors cursor-pointer ${
                                        msg.isActive !== false
                                          ? 'bg-emerald-600 text-white'
                                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                      }`}
                                    >
                                      {msg.isActive !== false ? '✓ فعال در سایت' : '✗ غیرفعال'}
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-1.5 text-[10px]">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleMessengerLocation(msg.id, 'showInHero')}
                                      className={`px-2 py-0.5 rounded cursor-pointer ${
                                        msg.showInHero !== false ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-400 hover:text-slate-600'
                                      }`}
                                      title="نمایش در هیرو (بالای صفحه)"
                                    >
                                      {msg.showInHero !== false ? '✓ هیرو' : 'هیرو'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleMessengerLocation(msg.id, 'showInFooter')}
                                      className={`px-2 py-0.5 rounded cursor-pointer ${
                                        msg.showInFooter !== false ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold' : 'text-slate-400 hover:text-slate-600'
                                      }`}
                                      title="نمایش در فوتر (پایین صفحه)"
                                    >
                                      {msg.showInFooter !== false ? '✓ فوتر' : 'فوتر'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleMessengerLocation(msg.id, 'showInFloatingBar')}
                                      className={`px-2 py-0.5 rounded cursor-pointer ${
                                        msg.showInFloatingBar ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold' : 'text-slate-400 hover:text-slate-600'
                                      }`}
                                      title="نمایش در نوار شناور موبایل"
                                    >
                                      {msg.showInFloatingBar ? '✓ موبایل' : 'موبایل'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add / Edit Messenger Modal */}
                  {showAddMessengerModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                          <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span>{editingMessengerId ? 'ویرایش اطلاعات پیام‌رسان' : 'افزودن پیام‌رسان جدید'}</span>
                          </h4>
                          <button
                            type="button"
                            onClick={() => setShowAddMessengerModal(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveMessenger} className="space-y-4 text-right">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                نام پیام‌رسان یا پلتفرم:
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="مثال: ایتا، بله، سروش، روبیکا، واتساپ..."
                                value={messengerFormData.name}
                                onChange={e => setMessengerFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                شناسه / آیدی / شماره (اختیاری):
                              </label>
                              <input
                                type="text"
                                dir="ltr"
                                placeholder="@username یا 0912..."
                                value={messengerFormData.usernameOrId}
                                onChange={e => setMessengerFormData(prev => ({ ...prev, usernameOrId: e.target.value }))}
                                className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              لینک مستقیم ارتباط / کانال (URL):
                            </label>
                            <input
                              type="url"
                              dir="ltr"
                              required
                              placeholder="https://..."
                              value={messengerFormData.link}
                              onChange={e => setMessengerFormData(prev => ({ ...prev, link: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              متن برچسب / توضیح کوتاه (Badge):
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: کانال رسمی، پاسخگویی فوری، ارسال عکس"
                              value={messengerFormData.badge}
                              onChange={e => setMessengerFormData(prev => ({ ...prev, badge: e.target.value }))}
                              className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20"
                            />
                          </div>

                          {/* SECTION: Custom Icon Upload & Selection */}
                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                <span>آیکون و تصویر مخصوص پیام‌رسان:</span>
                              </span>
                              {messengerFormData.customIconUrl && (
                                <button
                                  type="button"
                                  onClick={() => setMessengerFormData(prev => ({ ...prev, customIconUrl: '' }))}
                                  className="text-[11px] text-red-500 hover:text-red-700 font-bold cursor-pointer"
                                >
                                  حذف عکس آپلود شده
                                </button>
                              )}
                            </div>

                            {/* Direct Image Upload */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                {messengerFormData.customIconUrl ? (
                                  <div className="w-12 h-12 rounded-xl border border-purple-300 dark:border-purple-700 overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-xs">
                                    <img 
                                      src={messengerFormData.customIconUrl} 
                                      alt="Preview" 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 flex items-center justify-center shrink-0 text-slate-400">
                                    <ImageIcon className="w-5 h-5" />
                                  </div>
                                )}

                                <div className="flex-1">
                                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 text-purple-700 dark:text-purple-300 border border-purple-300/80 dark:border-purple-700/60 text-xs font-bold cursor-pointer transition-colors">
                                    <Upload className="w-4 h-4" />
                                    <span>انتخاب و آپلود عکس آیکون</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleMessengerIconUpload(file);
                                      }}
                                    />
                                  </label>
                                  <p className="text-[10px] text-slate-500 mt-1">
                                    عکس یا لوگوی پیام‌رسان از گالری گوشی یا کامپیوتر (PNG, JPG, SVG)
                                  </p>
                                </div>
                              </div>

                              {/* Or direct image URL */}
                              <div>
                                <input
                                  type="url"
                                  dir="ltr"
                                  placeholder="یا وارد کردن لینک مستقیم تصویر (https://...)"
                                  value={messengerFormData.customIconUrl || ''}
                                  onChange={e => setMessengerFormData(prev => ({ ...prev, customIconUrl: e.target.value }))}
                                  className="w-full py-1.5 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[11px] font-mono text-slate-900 dark:text-white"
                                />
                              </div>
                            </div>

                            {/* Fallback Vector Icons Grid */}
                            {!messengerFormData.customIconUrl && (
                              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold block">
                                  یا انتخاب از آیکون‌های وکتور سیستم:
                                </span>
                                <div className="grid grid-cols-5 gap-1.5">
                                  {[
                                    { id: 'message-circle', label: 'چت', icon: MessageCircle },
                                    { id: 'send', label: 'ارسال', icon: Send },
                                    { id: 'phone', label: 'تماس', icon: Phone },
                                    { id: 'instagram', label: 'اینستا', icon: Instagram },
                                    { id: 'link', label: 'لینک', icon: LinkIcon },
                                    { id: 'globe', label: 'وب', icon: Globe },
                                    { id: 'mail', label: 'ایمیل', icon: Mail },
                                    { id: 'radio', label: 'کانال', icon: Radio },
                                    { id: 'zap', label: 'سریع', icon: Zap },
                                    { id: 'share-2', label: 'اشتراک', icon: Share2 },
                                  ].map(ic => {
                                    const IconComp = ic.icon;
                                    const isSelected = messengerFormData.iconName === ic.id;
                                    return (
                                      <button
                                        key={ic.id}
                                        type="button"
                                        onClick={() => setMessengerFormData(prev => ({ ...prev, iconName: ic.id as any }))}
                                        className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                                          isSelected
                                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                                        }`}
                                      >
                                        <IconComp className="w-4 h-4 shrink-0" />
                                        <span className="text-[10px]">{ic.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* SECTION: Color Theme & Custom Hex Code */}
                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              <span>رنگ و تم دکمه:</span>
                            </span>

                            {/* Generic Color Swatches (No messenger names!) */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                              {[
                                { id: 'purple', name: 'بنفش', hex: '#9333ea', colorClass: 'bg-purple-500' },
                                { id: 'orange', name: 'نارنجی', hex: '#ea580c', colorClass: 'bg-orange-500' },
                                { id: 'emerald', name: 'سبز', hex: '#059669', colorClass: 'bg-emerald-500' },
                                { id: 'blue', name: 'آبی روشن', hex: '#0284c7', colorClass: 'bg-sky-500' },
                                { id: 'indigo', name: 'نیلی', hex: '#4f46e5', colorClass: 'bg-indigo-500' },
                                { id: 'cyan', name: 'فیروزه‌ای', hex: '#0d9488', colorClass: 'bg-teal-500' },
                                { id: 'pink', name: 'صورتی', hex: '#db2777', colorClass: 'bg-pink-500' },
                                { id: 'red', name: 'قرمز', hex: '#dc2626', colorClass: 'bg-red-500' },
                                { id: 'amber', name: 'کهربایی / زرد', hex: '#d97706', colorClass: 'bg-amber-500' },
                                { id: 'slate', name: 'دودی / خاکستری', hex: '#475569', colorClass: 'bg-slate-600' },
                              ].map(col => {
                                const isSelected = messengerFormData.colorTheme === col.id;
                                return (
                                  <button
                                    key={col.id}
                                    type="button"
                                    onClick={() => setMessengerFormData(prev => ({ 
                                      ...prev, 
                                      colorTheme: col.id as any,
                                      customColorHex: col.hex,
                                    }))}
                                    className={`p-2 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition-all ${
                                      isSelected
                                        ? 'bg-white dark:bg-slate-900 border-purple-600 dark:border-purple-400 ring-2 ring-purple-500/20 font-bold shadow-xs'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                                    }`}
                                  >
                                    <span className={`w-3.5 h-3.5 rounded-full ${col.colorClass} shrink-0`} />
                                    <span className="text-[11px] truncate">{col.name}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Custom Color HEX & Color Picker */}
                            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                یا انتخاب رنگ دلخواه با کد رنگ (HEX):
                              </span>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={messengerFormData.customColorHex || '#9333ea'}
                                  onChange={e => setMessengerFormData(prev => ({
                                    ...prev,
                                    colorTheme: 'custom',
                                    customColorHex: e.target.value,
                                  }))}
                                  className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-900 shrink-0"
                                  title="پالت انتخاب رنگ"
                                />
                                <input
                                  type="text"
                                  dir="ltr"
                                  placeholder="#9333ea"
                                  value={messengerFormData.customColorHex || ''}
                                  onChange={e => setMessengerFormData(prev => ({
                                    ...prev,
                                    colorTheme: 'custom',
                                    customColorHex: e.target.value,
                                  }))}
                                  className="w-28 py-1 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                                />
                              </div>
                            </div>

                            {/* Live Real-Time Preview */}
                            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                              <span className="text-[10px] text-slate-500 font-bold block mb-1.5">پیش‌نمایش زنده دکمه:</span>
                              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                                <div
                                  style={{
                                    backgroundColor: `${messengerFormData.customColorHex || '#9333ea'}20`,
                                    borderColor: `${messengerFormData.customColorHex || '#9333ea'}60`,
                                    color: messengerFormData.customColorHex || '#9333ea',
                                  }}
                                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs border shadow-xs"
                                >
                                  {messengerFormData.customIconUrl ? (
                                    <img src={messengerFormData.customIconUrl} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                                  ) : messengerFormData.iconName === 'phone' ? (
                                    <Phone className="w-4 h-4 shrink-0" />
                                  ) : messengerFormData.iconName === 'send' ? (
                                    <Send className="w-4 h-4 shrink-0" />
                                  ) : messengerFormData.iconName === 'instagram' ? (
                                    <Instagram className="w-4 h-4 shrink-0" />
                                  ) : messengerFormData.iconName === 'mail' ? (
                                    <Mail className="w-4 h-4 shrink-0" />
                                  ) : messengerFormData.iconName === 'zap' ? (
                                    <Zap className="w-4 h-4 shrink-0" />
                                  ) : (
                                    <MessageCircle className="w-4 h-4 shrink-0" />
                                  )}
                                  <span>{messengerFormData.name || 'عنوان پیام‌رسان'}</span>
                                  {messengerFormData.badge && (
                                    <span 
                                      style={{ backgroundColor: `${messengerFormData.customColorHex || '#9333ea'}30` }}
                                      className="text-[10px] px-1 py-0.2 rounded font-normal"
                                    >
                                      {messengerFormData.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Visibility & Locations */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                              موقعیت‌های نمایش در وب‌سایت:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={messengerFormData.showInHero}
                                  onChange={e => setMessengerFormData(prev => ({ ...prev, showInHero: e.target.checked }))}
                                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span>نمایش در هیرو (بالا)</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={messengerFormData.showInFooter}
                                  onChange={e => setMessengerFormData(prev => ({ ...prev, showInFooter: e.target.checked }))}
                                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span>نمایش در فوتر (پایین)</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={messengerFormData.showInFloatingBar}
                                  onChange={e => setMessengerFormData(prev => ({ ...prev, showInFloatingBar: e.target.checked }))}
                                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span>نوار شناور موبایل</span>
                              </label>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={() => setShowAddMessengerModal(false)}
                              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                            >
                              انصراف
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                            >
                              <Save className="w-4 h-4" />
                              <span>{editingMessengerId ? 'ثبت ویرایش پیام‌رسان' : 'افزودن پیام‌رسان'}</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 9: SEO & META TAGS CMS */}
              {activeTab === 'seo' && (
                <div className="space-y-6 text-right">
                  {/* Header & Main Save Bar */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span>مدیریت سئو، متاتگ‌ها و کارت‌های شبکه‌های اجتماعی (Open Graph)</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        ویرایش عنوان‌های سئو، توضیحات متاتگ، تصویر شبکه اجتماعی و کلیدواژه‌های تخصصی تمام بخش‌های اصلی سایت برای تصاحب رتبه‌های ۱ تا ۳ گوگل در ساوه
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          updateSettings(localSettings);
                          showNotification('تنظیمات سئو و متاتگ‌های تمامی بخش‌های سایت با موفقیت بروزرسانی شد.');
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>ذخیره تغییرات سئو</span>
                      </button>
                    </div>
                  </div>

                  {/* Automated SEO Diagnostic Health Check Card */}
                  {(() => {
                    const health = runSeoHealthCheck();
                    return (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/60 shadow-xl space-y-4 text-right">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-indigo-900/80">
                          <div>
                            <div className="flex items-center gap-2 text-amber-400 font-black text-sm sm:text-base">
                              <Activity className="w-5 h-5 text-amber-400 animate-pulse" />
                              <span>آنالیز هوشمند و چکاپ سلامت سئوی سایت (SEO Diagnostic Audit)</span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              بررسی خودکار متاتگ‌ها، طول عنوان، وضعیت تصاویر، محتوا و پوشش سئوی محلی ساوه برای صدرنشینی در نتایج گوگل
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => {
                                const optimizedSettings: Partial<SiteSettings> = {
                                  seoTitle: 'دفتر خدماتی بهکار ساوه | لوله بازکنی، تخلیه چاه و ایزوگام',
                                  seoDescription: 'لوله بازکنی در ساوه و خدمات فنی در ساوه با دفتر بهکار ساوه. اعزام فوری ۱۵ دقیقه‌ای، تخلیه چاه، ایزوگام با تضمین کتبی ۱۰۰٪ و کمترین قیمت. تماس شبانه‌روزی.',
                                  ogTitle: 'دفتر خدماتی بهکار ساوه | لوله بازکنی و تخلیه چاه شبانه‌روزی ساوه',
                                  ogDescription: 'ارائه کلیه خدمات تاسیساتی، لوله بازکنی با ژنراتور، تخلیه چاه و ایزوگام در ساوه با پشتیبانی فوری.',
                                  ogImageUrl: localSettings.ogImageUrl || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80'
                                };
                                const merged = { ...localSettings, ...optimizedSettings };
                                setLocalSettings(merged);
                                updateSettings(merged);
                                if (neighborhoods.length < 5) {
                                  resetNeighborhoodsToDefault();
                                }
                                showNotification('سئوی سایت با موفقیت به نمره کامل ۱۰۰٪ ارتقا یافت و ذخیره گردید.');
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 cursor-pointer"
                              title="اعمال فوری مقادیر استاندارد گوگل برای دریافت نمره ۱۰۰٪"
                            >
                              <Sparkles className="w-4 h-4 text-slate-950" />
                              <span>⚡ بهینه‌سازی خودکار سئو (نمره ۱۰۰٪)</span>
                            </button>

                            <div className="text-center bg-black/50 px-3.5 py-1.5 rounded-xl border border-indigo-800/80 shadow-inner">
                              <span className="block text-[10px] text-slate-400 font-bold">امتیاز سئو</span>
                              <span className={`text-xl font-black ${
                                health.totalScore >= 80 ? 'text-emerald-400' : health.totalScore >= 60 ? 'text-amber-400' : 'text-red-400'
                              }`}>
                                {toPersianDigits(health.totalScore)}٪
                              </span>
                            </div>

                            <div className="text-center bg-black/50 px-3.5 py-1.5 rounded-xl border border-indigo-800/80 shadow-inner">
                              <span className="block text-[10px] text-slate-400 font-bold">تست‌های موفق</span>
                              <span className="text-sm font-black text-slate-200">
                                {toPersianDigits(health.passedCount)} از {toPersianDigits(health.totalTests)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-slate-300">
                            <span>شاخص آمادگی سایت برای تصاحب رتبه ۱ تا ۳ گوگل در ساوه:</span>
                            <span className="font-mono">{toPersianDigits(health.totalScore)}٪</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                            <div
                              className={`h-full transition-all duration-500 rounded-full ${
                                health.totalScore >= 80 ? 'bg-emerald-500' : health.totalScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${health.totalScore}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Diagnostic Tests Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {health.tests.map(test => (
                            <div
                              key={test.id}
                              className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                                test.status === 'pass'
                                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                                  : test.status === 'warn'
                                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                                  : 'bg-red-950/40 border-red-800/60 text-red-200'
                              }`}
                            >
                              {test.status === 'pass' ? (
                                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                              ) : test.status === 'warn' ? (
                                <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                              ) : (
                                <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                              )}

                              <div className="flex-1">
                                <div className="flex items-center justify-between font-black text-xs mb-1">
                                  <span>{test.title}</span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/50 font-mono border border-white/10">
                                    {toPersianDigits(test.score)}/۱۰۰
                                  </span>
                                </div>
                                <p className="text-[11px] opacity-90 leading-relaxed">{test.msg}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Google Search Live SERP Preview Box */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                        <Eye className="w-4 h-4" />
                        پیش‌نمایش آنلاین نحوه نمایش وب‌سایت در نتیجه موتور جستجوی گوگل (Google SERP):
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                        {(localSettings.seoTitle || '').length} کاراکتر عنوان | {(localSettings.seoDescription || '').length} کاراکتر توضیحات
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-right dir-rtl">
                      <div className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-slate-300 font-mono text-emerald-700 dark:text-emerald-400">
                        <Globe className="w-3.5 h-3.5" />
                        <span>{localSettings.canonicalUrl || 'https://behkar-saveh.ir/'}</span>
                      </div>
                      <h3 className="text-base font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer leading-snug">
                        {localSettings.seoTitle || 'دفتر خدماتی بهکار ساوه | لوله بازکنی، تخلیه چاه، ایزوگام و حفر چاه'}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                        {localSettings.seoDescription || 'دفتر خدماتی بهکار ساوه با مدیریت آقای زمانی. خدمات فوری شبانه‌روزی لوله بازکنی، تخلیه چاه، ایزوگام با تضمین و حفر چاه نو.'}
                      </p>
                    </div>
                  </div>

                  {/* SECTION 1: GLOBAL SEO META TAGS */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm">
                      <FileText className="w-4.5 h-4.5 text-blue-600" />
                      <span>۱. متاتگ‌های اصلی و عمومی کل تارنما (Global Meta Tags)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Meta Title */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                            عنوان اصلی سئو (Meta Title):
                          </label>
                          <span className={`text-[10px] font-bold ${
                            (localSettings.seoTitle || '').length > 65 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {(localSettings.seoTitle || '').length} / 60 پیشنهاد گوگل
                          </span>
                        </div>
                        <input
                          type="text"
                          value={localSettings.seoTitle || ''}
                          onChange={e => setLocalSettings(prev => ({ ...prev, seoTitle: e.target.value }))}
                          placeholder="عنوان اصلی مرورگر و نتایج گوگل"
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                        />
                      </div>

                      {/* Canonical URL */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                          آدرس دامنه رسمی کانونیکال (Canonical URL):
                        </label>
                        <input
                          type="url"
                          value={localSettings.canonicalUrl || ''}
                          onChange={e => setLocalSettings(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                          placeholder="https://behkar-saveh.ir/"
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                        />
                      </div>

                      {/* Meta Description */}
                      <div className="space-y-1.5 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                            توضیحات متاتگ سئو (Meta Description):
                          </label>
                          <span className={`text-[10px] font-bold ${
                            (localSettings.seoDescription || '').length > 160 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {(localSettings.seoDescription || '').length} / 155 کاراکتر پیشنهادی
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={localSettings.seoDescription || ''}
                          onChange={e => setLocalSettings(prev => ({ ...prev, seoDescription: e.target.value }))}
                          placeholder="خلاصه توضیحات کلیدی سایت که در نتایج گوگل زیر عنوان دیده می‌شود..."
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs leading-relaxed"
                        />
                      </div>

                      {/* Meta Keywords */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                          کلمات کلیدی اصلی و محلی (Meta Keywords - جدا شده با کاما):
                        </label>
                        <input
                          type="text"
                          value={localSettings.seoKeywords || ''}
                          onChange={e => setLocalSettings(prev => ({ ...prev, seoKeywords: e.target.value }))}
                          placeholder="لوله بازکنی ساوه, تخلیه چاه ساوه, ایزوگام ساوه, آقای زمانی..."
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: OPEN GRAPH & SOCIAL MEDIA TAGS */}
                  <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-black text-sm">
                      <Sparkles className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                      <span>۲. تنظیمات اشتراک‌گذاری در واتساپ، ایتا، روبیکا و تلگرام (Open Graph Tags)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* OG Title */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                          عنوان اشتراک‌گذاری (OG Title):
                        </label>
                        <input
                          type="text"
                          value={localSettings.ogTitle || ''}
                          onChange={e => setLocalSettings(prev => ({ ...prev, ogTitle: e.target.value }))}
                          placeholder="دفتر خدماتی بهکار ساوه | لوله بازکنی و تخلیه چاه شبانه‌روزی"
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                        />
                      </div>

                      {/* OG Site Name */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                          نام برند (OG Site Name):
                        </label>
                        <input
                          type="text"
                          value={localSettings.ogSiteName || ''}
                          onChange={e => setLocalSettings(prev => ({ ...prev, ogSiteName: e.target.value }))}
                          placeholder="دفتر خدماتی بهکار ساوه"
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                        />
                      </div>

                      {/* OG Description */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                          متن توضیحات کارت اشتراک‌گذاری (OG Description):
                        </label>
                        <textarea
                          rows={2}
                          value={localSettings.ogDescription || ''}
                          onChange={e => setLocalSettings(prev => ({ ...prev, ogDescription: e.target.value }))}
                          placeholder="اعزام فوری سرویس‌کار در ۱۵ دقیقه سراسر ساوه و شهرک کاوه..."
                          className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                        />
                      </div>

                      {/* OG Image URL */}
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                          لینک تصویر کاور بنر اشتراک‌گذاری (OG Banner Image URL):
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={localSettings.ogImageUrl || ''}
                            onChange={e => setLocalSettings(prev => ({ ...prev, ogImageUrl: e.target.value }))}
                            placeholder="https://..."
                            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                          />
                          <label className="shrink-0 cursor-pointer px-3.5 py-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-bold flex items-center gap-1 transition-colors">
                            <Upload className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-300" />
                            <span>آپلود تصویر کاور</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => handleSettingsImageUpload(e, 'ogImageUrl')}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: CORE SECTIONS INDIVIDUAL SEO META TAGS */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-4">
                    <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-black text-sm">
                      <Tag className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
                      <span>۳. مدیریت عناوین و متاتگ‌های سئوی اختصاصی برای تمام بخش‌های اصلی سایت</span>
                    </div>

                    <div className="space-y-4">
                      {/* Sub-Section 1: Services Section */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                        <span className="text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5" />
                          ۱. سئوی بخش خدمات (لوله بازکنی، تخلیه چاه، ایزوگام، حفر چاه):
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                              عنوان سئو بخش خدمات:
                            </label>
                            <input
                              type="text"
                              value={localSettings.servicesMetaTitle || ''}
                              onChange={e => setLocalSettings(prev => ({ ...prev, servicesMetaTitle: e.target.value }))}
                              placeholder="خدمات لوله بازکنی، تخلیه چاه و ایزوگام در ساوه"
                              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                              توضیحات سئو بخش خدمات:
                            </label>
                            <input
                              type="text"
                              value={localSettings.servicesMetaDescription || ''}
                              onChange={e => setLocalSettings(prev => ({ ...prev, servicesMetaDescription: e.target.value }))}
                              placeholder="لیست جامع خدمات تاسیساتی دفتر بهکار ساوه..."
                              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sub-Section 2: Tariffs Section */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                        <span className="text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <Calculator className="w-3.5 h-3.5" />
                          ۲. سئوی بخش قیمت، تعرفه‌ها و برآورد آنلاین هزینه:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                              عنوان سئو بخش قیمت و تعرفه:
                            </label>
                            <input
                              type="text"
                              value={localSettings.tariffsMetaTitle || ''}
                              onChange={e => setLocalSettings(prev => ({ ...prev, tariffsMetaTitle: e.target.value }))}
                              placeholder="تعرفه و لیست قیمت لوله بازکنی در ساوه"
                              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                              توضیحات سئو بخش قیمت و تعرفه:
                            </label>
                            <input
                              type="text"
                              value={localSettings.tariffsMetaDescription || ''}
                              onChange={e => setLocalSettings(prev => ({ ...prev, tariffsMetaDescription: e.target.value }))}
                              placeholder="استعلام قیمت لوله بازکنی و تخلیه چاه ساوه نرخ اتحادیه..."
                              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sub-Section 3: Why Choose Us Section */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                        <span className="text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5" />
                          ۳. سئوی بخش «چرا انتخاب ما» و ضمانت‌نامه‌ها:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                              عنوان سئو بخش ضمانت و اعتبار:
                            </label>
                            <input
                              type="text"
                              value={localSettings.whyUsMetaTitle || ''}
                              onChange={e => setLocalSettings(prev => ({ ...prev, whyUsMetaTitle: e.target.value }))}
                              placeholder="چرا دفتر خدماتی بهکار ساوه؟ ۱۵ سال سابقه و تضمین"
                              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                              توضیحات سئو بخش ضمانت و اعتبار:
                            </label>
                            <input
                              type="text"
                              value={localSettings.whyUsMetaDescription || ''}
                              onChange={e => setLocalSettings(prev => ({ ...prev, whyUsMetaDescription: e.target.value }))}
                              placeholder="اعزام زیر ۱۵ دقیقه، تکنسین بومی ساوه و فاکتور کتبی..."
                              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sub-Section 4: Gallery & Media Section */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                        <span className="text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5" />
                          ۴. سئوی بخش ویدیوها و گالری نمونه‌کارها:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                              عنوان سئو بخش گالری و نمونه‌کارها:
                            </label>
                            <input
                              type="text"
                              value={localSettings.galleryMetaTitle || ''}
                              onChange={e => setLocalSettings(prev => ({ ...prev, galleryMetaTitle: e.target.value }))}
                              placeholder="گالری ویدیو و نمونه کارهای لوله بازکنی و تخلیه چاه ساوه"
                              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                              توضیحات سئو بخش گالری و نمونه‌کارها:
                            </label>
                            <input
                              type="text"
                              value={localSettings.galleryMetaDescription || ''}
                              onChange={e => setLocalSettings(prev => ({ ...prev, galleryMetaDescription: e.target.value }))}
                              placeholder="فیلم و ویدیوهای واقعی از نحوه باز کردن لوله‌ها و تخلیه چاه..."
                              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sub-Section 5: Customer Reviews Section */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                        <span className="text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5" />
                          ۵. سئوی بخش نظرات و رضایت‌مندی مشتریان:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                              عنوان سئو بخش نظرات مشتریان:
                            </label>
                            <input
                              type="text"
                              value={localSettings.reviewsMetaTitle || ''}
                              onChange={e => setLocalSettings(prev => ({ ...prev, reviewsMetaTitle: e.target.value }))}
                              placeholder="نظرات مشتریان دفتر خدماتی بهکار در شهر ساوه"
                              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                              توضیحات سئو بخش نظرات مشتریان:
                            </label>
                            <input
                              type="text"
                              value={localSettings.reviewsMetaDescription || ''}
                              onChange={e => setLocalSettings(prev => ({ ...prev, reviewsMetaDescription: e.target.value }))}
                              placeholder="رضایت‌مندی ساکنین شهرک فجر، علوی و کاوه از خدمات بهکار..."
                              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sub-Section 6: FAQ Section */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                        <span className="text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5" />
                          ۶. سئوی بخش سوالات متداول (FAQ Google Accordion):
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                              عنوان سئو بخش سوالات متداول:
                            </label>
                            <input
                              type="text"
                              value={localSettings.faqMetaTitle || ''}
                              onChange={e => setLocalSettings(prev => ({ ...prev, faqMetaTitle: e.target.value }))}
                              placeholder="سوالات متداول لوله بازکنی و تخلیه چاه ساوه"
                              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                              توضیحات سئو بخش سوالات متداول:
                            </label>
                            <input
                              type="text"
                              value={localSettings.faqMetaDescription || ''}
                              onChange={e => setLocalSettings(prev => ({ ...prev, faqMetaDescription: e.target.value }))}
                              placeholder="پاسخ کامل به زمان رسیدن سرویس‌کار، شیوه محاسبه هزینه و..."
                              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: AUTOMATIC SITEMAP.XML & ROBOTS.TXT GENERATOR */}
                  <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-black text-sm">
                        <Globe className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" />
                        <span>۴. تولید و بروزرسانی خودکار نقشه سایت (sitemap.xml) و فایل هدایت خزنده‌ها (robots.txt)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const xml = generateSitemapXml(localSettings, services, neighborhoods);
                          const robots = generateRobotsTxt(localSettings);
                          setGeneratedXmlText(xml);
                          setGeneratedRobotsText(robots);
                          setShowSitemapModal(true);
                          showNotification('نقشه سایت sitemap.xml و فایل robots.txt با موفقیت بر اساس تمام بخش‌های فعال تولید شد.');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>تولید و دانلود sitemap.xml و robots.txt</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      این الگوریتم به‌صورت خودکار تمامی بخش‌های فعال اصلی سایت، خدمات ثبت شده ({services.length} خدمت فعال) و محله‌های پوشش داده شده در ساوه ({neighborhoods.length} منطقه) را آنالیز کرده و کد استاندارد <code className="font-mono text-teal-700 dark:text-teal-300">sitemap.xml</code> و لینک راهنمای ربات‌های گوگل در <code className="font-mono text-teal-700 dark:text-teal-300">robots.txt</code> را بروزرسانی می‌کند.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <a
                        href="/sitemap.xml"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 text-xs font-bold text-teal-700 dark:text-teal-300 flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-teal-600" />
                          <span>تست و مشاهده مستقیم sitemap.xml آنلاین</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>

                      <a
                        href="/robots.txt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 text-xs font-bold text-teal-700 dark:text-teal-300 flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-teal-600" />
                          <span>تست و مشاهده مستقیم robots.txt آنلاین</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateSettings(localSettings);
                        showNotification('کلیه متاتگ‌ها و تنظیمات سئو با موفقیت ذخیره گردید.');
                      }}
                      className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>ثبت و ذخیره نهایی تنظیمات سئو</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 10: FULL BACKUP, EXPORT & RESTORE CENTER */}
              {activeTab === 'backup' && (
                <div className="space-y-4 animate-fade-in text-right dir-rtl">
                  
                  {/* Top Compact Bar: Header & Action Buttons */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs">
                        <Database className="w-4 h-4" />
                        <span>سیستم جامع پشتیبان‌گیری، خروجی و بازیابی اطلاعات</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-0.5">
                        پشتیبان‌گیری ۱۰۰٪ اطلاعات، عکس‌ها، فیلم‌ها و درخواست‌ها
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        تهیه نسخه پشتیبان امن، خروجی اکسل و PDF و بازگردانی فوری در هر زمان
                      </p>
                    </div>

                    {/* Compact Action Buttons Toolbar */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* 1. Download JSON Full Backup */}
                      <button
                        type="button"
                        onClick={() => {
                          const jsonStr = exportFullBackup();
                          const dateStr = new Date().toISOString().slice(0, 10);
                          const timeStr = new Date().toTimeString().slice(0, 5).replace(':', '-');
                          const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `behkar-saveh-full-backup-${dateStr}-${timeStr}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                          showNotification('پشتیبان کامل شامل کلیه عکس‌ها، فیلم‌ها، تنظیمات و درخواست‌ها دانلود شد.');
                        }}
                        className="h-8.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                        title="دانلود پشتیبان کامل با تمام تصاویر، ویدئوها و دیتابیس (JSON)"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>پشتیبان کامل (.json)</span>
                      </button>

                      {/* 2. Export Full Excel */}
                      <button
                        type="button"
                        onClick={handleExportFullExcel}
                        className="h-8.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                        title="خروجی کامل اکسل از کلیه درخواست‌ها، تعرفه‌ها، نظرات، خدمات و محله‌ها"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>خروجی اکسل (.csv)</span>
                      </button>

                      {/* 3. Export PDF / Printable Report */}
                      <button
                        type="button"
                        onClick={handlePrintOrPdfReport}
                        className="h-8.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                        title="چاپ و دانلود فایل PDF رسمی از تمام اطلاعات و جداول"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>گزارش PDF / چاپ</span>
                      </button>

                      {/* 4. Import / Restore File */}
                      <label className="h-8.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>ورودی و بازیابی</span>
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              try {
                                const content = ev.target?.result as string;
                                const parsed = JSON.parse(content);
                                if (!parsed || typeof parsed !== 'object') {
                                  alert('ساختار فایل JSON پشتیبان نامعتبر است.');
                                  return;
                                }

                                const counts = {
                                  services: Array.isArray(parsed.services) ? parsed.services.length : 0,
                                  gallery: Array.isArray(parsed.gallery) ? parsed.gallery.length : 0,
                                  mediaVault: Array.isArray(parsed.settings?.mediaVault) ? parsed.settings.mediaVault.length : 0,
                                  bookings: Array.isArray(parsed.bookings) ? parsed.bookings.length : 0,
                                  reviews: Array.isArray(parsed.reviews) ? parsed.reviews.length : 0,
                                  tariffs: Array.isArray(parsed.tariffs) ? parsed.tariffs.length : 0,
                                  neighborhoods: Array.isArray(parsed.neighborhoods) ? parsed.neighborhoods.length : 0,
                                };

                                setImportPreviewData({
                                  rawJson: content,
                                  fileName: file.name,
                                  fileSize: (file.size / 1024).toFixed(1) + ' KB',
                                  parsed,
                                  summaryText: parsed.exportedAtFa || parsed.exportedAt || 'نسخه ذخیره شده',
                                  itemCounts: counts,
                                });

                                setSelectiveImport({
                                  settings: !!parsed.settings,
                                  services: !!(parsed.services && parsed.services.length),
                                  gallery: !!(parsed.gallery && parsed.gallery.length),
                                  tariffs: !!(parsed.tariffs && parsed.tariffs.length),
                                  reviews: !!(parsed.reviews && parsed.reviews.length),
                                  neighborhoods: !!(parsed.neighborhoods && parsed.neighborhoods.length),
                                  bookings: !!(parsed.bookings && parsed.bookings.length),
                                  stats: !!parsed.stats,
                                });
                              } catch (err: any) {
                                alert('خطا در خواندن فایل JSON: ' + (err?.message || 'فایل نامعتبر است.'));
                              }
                            };
                            reader.readAsText(file);
                            e.target.value = '';
                          }}
                        />
                      </label>

                      {/* 5. Copy Code */}
                      <button
                        type="button"
                        onClick={() => {
                          const jsonStr = exportFullBackup();
                          navigator.clipboard.writeText(jsonStr).then(() => {
                            setIsBackupCopied(true);
                            showNotification('کد پشتیبان کامل در کلیپ‌بورد کپی شد.');
                            setTimeout(() => setIsBackupCopied(false), 3000);
                          });
                        }}
                        className="h-8.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors border border-slate-200 dark:border-slate-700"
                        title="کپی متن کامل JSON در کلیپ‌بورد"
                      >
                        {isBackupCopied ? (
                          <>
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400">کپی شد</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>کپی کدها</span>
                          </>
                        )}
                      </button>

                      {/* 6. Factory Reset */}
                      <button
                        type="button"
                        onClick={() => {
                          setResetScope('all');
                          setResetConfirmationInput('');
                          setShowResetModal(true);
                        }}
                        className="h-8.5 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors border border-rose-200 dark:border-rose-800"
                        title="منوی بازگردانی به تنظیمات پیش‌فرض کارخانه"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>بازگردانی اولیه</span>
                      </button>
                    </div>
                  </div>

                  {/* Real-time Data Summary in Backup File */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>آمار لحظه‌ای اطلاعات دیتابیس (۱۰۰٪ در فایل خروجی ذخیره می‌شوند):</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        تاریخ فعلی: {new Date().toLocaleDateString('fa-IR')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-center">
                        <p className="text-[10px] text-slate-500 truncate">درخواست‌های مشتریان</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{toPersianDigits(bookings.length)} پیام</p>
                      </div>

                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-center">
                        <p className="text-[10px] text-slate-500 truncate">مخزن تصاویر</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{toPersianDigits((settings.mediaVault || []).length)} فایل</p>
                      </div>

                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-center">
                        <p className="text-[10px] text-slate-500 truncate">گالری و ویدئوها</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{toPersianDigits(gallery.length)} آیتم</p>
                      </div>

                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-center">
                        <p className="text-[10px] text-slate-500 truncate">خدمات فعال</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{toPersianDigits(services.length)} خدمت</p>
                      </div>

                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-center">
                        <p className="text-[10px] text-slate-500 truncate">تعرفه‌ها و قیمت‌ها</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{toPersianDigits(tariffs.length)} نرخ</p>
                      </div>

                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-center">
                        <p className="text-[10px] text-slate-500 truncate">نظرات مشتریان</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{toPersianDigits(reviews.length)} نظر</p>
                      </div>

                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-center">
                        <p className="text-[10px] text-slate-500 truncate">مناطق پوشش ساوه</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{toPersianDigits(neighborhoods.length)} محله</p>
                      </div>

                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-center">
                        <p className="text-[10px] text-slate-500 truncate">تماس‌ها و لاگ‌ها</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{toPersianDigits(stats.totalCalls)} تماس</p>
                      </div>
                    </div>
                  </div>

                  {/* Information Checklist: All 11 Guaranteed Backup Items */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h5 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>چک‌لیست ۱۱ بخشی که ۱۰۰٪ در فایل پشتیبان ذخیره و بازیابی می‌شوند (همراه با عکس و فیلم):</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">۱. مشخصات، روبیکا و رمز</span>
                          <span className="text-[11px] text-slate-500">شماره‌های تماس، نشانی، شناسه روبیکا، پین ورود و شماره کلید تریگر مخفی</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">۲. پشتیبان‌گیری و بازیابی جامع</span>
                          <span className="text-[11px] text-slate-500">دانلود یکپارچه JSON، خروجی اکسل، پرینت PDF و بازیابی سریع کل اطلاعات</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">۳. مخزن و آرشیو کلیه تصاویر</span>
                          <span className="text-[11px] text-slate-500">تمامی فایل‌های اختصاصی، عکس‌ها و تصاویر Base64 در مخزن رسانه‌ها ({toPersianDigits((localSettings.mediaVault || []).length)} فایل)</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">۴. گالری و نمونه‌کارها</span>
                          <span className="text-[11px] text-slate-500">عکس‌های قبل و بعد، فیلم‌ها و پروژه‌های ساوه ({toPersianDigits(gallery.length)} نمونه‌کار)</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">۵. آمار واقعی و لاگ تماس</span>
                          <span className="text-[11px] text-slate-500">تعداد تماس‌های ثبت‌شده ({toPersianDigits(stats.totalCalls)})، کلیک‌های روبیکا و لاگ رویدادها</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">۶. مدیریت مناطق پوشش</span>
                          <span className="text-[11px] text-slate-500">تمام محله‌ها و شهرک‌های ساوه و زمان اعزام ({toPersianDigits(neighborhoods.length)} منطقه)</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">۷. مدیریت خدمات و کارت‌ها</span>
                          <span className="text-[11px] text-slate-500">کارت‌های تاسیساتی، ویژگی‌ها، ابزارها و شروع قیمت‌ها ({toPersianDigits(services.length)} خدمت)</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">۸. مدیریت تعرفه و قیمت‌ها</span>
                          <span className="text-[11px] text-slate-500">جدول کامل نرخ‌های مصوب اتحادیه ({toPersianDigits(tariffs.length)} ردیف نرخ)</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">۹. متن‌ها، ضمانت و دکمه‌ها</span>
                          <span className="text-[11px] text-slate-500">متن ضمانت کتبی، تیترها، پیام‌رسان‌ها و دکمه‌های شناور</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">۱۰. تایید و مدیریت نظرات</span>
                          <span className="text-[11px] text-slate-500">نظرات همشهریان ساوه، امتیازها و وضعیت تایید ({toPersianDigits(reviews.length)} نظر)</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">۱۱. درخواست‌های مشتریان</span>
                          <span className="text-[11px] text-slate-500">شماره‌ها، آدرس‌ها، خدمت درخواستی و وضعیت سفارش‌ها ({toPersianDigits(bookings.length)} درخواست)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      {/* SITEMAP & ROBOTS XML PREVIEW & DOWNLOAD MODAL */}
      {showSitemapModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-teal-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-sm">
                <Globe className="w-5 h-5" />
                <span>نقشه سایت (sitemap.xml) و فایل راهنمای خزنده‌ها (robots.txt) تولید شده</span>
              </div>
              <button
                onClick={() => setShowSitemapModal(false)}
                className="p-1 rounded-lg hover:bg-teal-700 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5 text-right dir-rtl">
              {/* sitemap.xml section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-600" />
                    کد خروجی استاندارد sitemap.xml:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedXmlText);
                        showNotification('کد sitemap.xml با موفقیت در حافظه کپی شد.');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-teal-100 hover:bg-teal-200 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>کپی کد XML</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([generatedXmlText], { type: 'text/xml' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'sitemap.xml';
                        a.click();
                        URL.revokeObjectURL(url);
                        showNotification('فایل sitemap.xml دانلود شد.');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>دانلود فایل sitemap.xml</span>
                    </button>
                  </div>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={generatedXmlText}
                  className="w-full p-3 rounded-xl bg-slate-900 text-teal-300 font-mono text-[11px] leading-relaxed ltr text-left border border-slate-800"
                />
              </div>

              {/* robots.txt section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-teal-600" />
                    محتوای متنی فایل robots.txt (راهنمای موتورهای جستجو):
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedRobotsText);
                        showNotification('محتوای robots.txt کپی شد.');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-teal-100 hover:bg-teal-200 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>کپی متن</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([generatedRobotsText], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'robots.txt';
                        a.click();
                        URL.revokeObjectURL(url);
                        showNotification('فایل robots.txt دانلود شد.');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>دانلود فایل robots.txt</span>
                    </button>
                  </div>
                </div>
                <textarea
                  readOnly
                  rows={4}
                  value={generatedRobotsText}
                  className="w-full p-3 rounded-xl bg-slate-900 text-teal-300 font-mono text-[11px] leading-relaxed ltr text-left border border-slate-800"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSitemapModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEDIA VAULT ITEM MODAL */}
      {showAddMediaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col dir-rtl">
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-sm">
                <Upload className="w-5 h-5" />
                <span>آپلود مستقیم عکس جدید (فایل از دستگاه یا لینک URL)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMediaModal(false)}
                className="p-1 rounded-lg hover:bg-indigo-700 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newMediaUrlInput.trim()) {
                  showNotification('لطفاً یک عکس انتخاب کرده یا لینک عکس را وارد کنید.');
                  return;
                }
                setIsUploadingMedia(true);
                try {
                  addMediaVaultItem({
                    title: newMediaTitle.trim() || 'تصویر جدید آرشیو',
                    category: newMediaCategory,
                    url: newMediaUrlInput.trim(),
                    isCurrentActive: true,
                  });
                  setMediaCategoryFilter('all');
                  setMediaSearchQuery('');
                  setShowAddMediaModal(false);
                  setNewMediaTitle('');
                  setNewMediaUrlInput('');
                  showNotification('تصویر جدید با موفقیت به آرشیو افزوده‌شد و در بالای لیست قرار گرفت.');
                } catch (err) {
                  console.error(err);
                  showNotification('خطا در افزودن تصویر.');
                } finally {
                  setIsUploadingMedia(false);
                }
              }}
              className="p-5 space-y-4 text-right"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  روش اول: انتخاب فایل عکس از دستگاه (گوشی / کامپیوتر)
                </label>
                <label className="w-full p-4 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                  <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-bounce" />
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    {isUploadingMedia ? 'در حال پردازش و فشرده‌سازی تصویر...' : 'برای انتخاب عکس از گالری/کامپیوتر کلیک کنید'}
                  </span>
                  <span className="text-[10px] text-slate-500">فرمت‌های مجاز: JPG, PNG, WEBP, SVG</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingMedia}
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploadingMedia(true);
                      try {
                        const compressed = await compressImageFile(file);
                        if (compressed) {
                          setNewMediaUrlInput(compressed);
                          if (!newMediaTitle) {
                            setNewMediaTitle(file.name.replace(/\.[^/.]+$/, ''));
                          }
                          showNotification('عکس با موفقیت پردازش شد.');
                        } else {
                          showNotification('خطا در فشرده‌سازی عکس.');
                        }
                      } catch (err) {
                        console.error(err);
                        showNotification('خطا در پردازش فایل عکس.');
                      } finally {
                        setIsUploadingMedia(false);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  روش دوم: یا وارد کردن آدرس اینترنتی عکس (URL)
                </label>
                <input
                  type="text"
                  value={newMediaUrlInput}
                  onChange={(e) => setNewMediaUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg یا data:image/jpeg;base64,..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono ltr text-left dir-ltr"
                />
              </div>

              {newMediaUrlInput && (
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                  <img src={newMediaUrlInput} alt="پیش‌نمایش" className="w-16 h-16 object-cover rounded-lg border border-slate-300 dark:border-slate-600 shrink-0" />
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ عکس آماده افزودن به آرشیو است.
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  عنوان تصویر (اختیاری)
                </label>
                <input
                  type="text"
                  value={newMediaTitle}
                  onChange={(e) => setNewMediaTitle(e.target.value)}
                  placeholder="مثلاً: عکس دستگاه لوله بازکنی"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  دسته‌بندی اولیه تصویر
                </label>
                <select
                  value={newMediaCategory}
                  onChange={(e) => setNewMediaCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold cursor-pointer"
                >
                  <option value="general">عمومی (پیش‌فرض)</option>
                  <option value="hero">عکس هیرو و بنر اصلی</option>
                  <option value="og">کاور شبکه‌های اجتماعی (OG)</option>
                  <option value="service">عکس خدمات</option>
                  <option value="gallery">گالری و نمونه‌کارها</option>
                  <option value="about">عکس درباره ما</option>
                  <option value="logo">لوگو و نماد</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMediaModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isUploadingMedia || !newMediaUrlInput.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره در آرشیو تصاویر</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BACKUP RESTORE INSPECTION & SELECTIVE IMPORT MODAL */}
      {importPreviewData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in text-right dir-rtl">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-sm">
                <FolderArchive className="w-5 h-5" />
                <span>پیش‌نمایش و بازیابی فایل پشتیبان</span>
              </div>
              <button
                onClick={() => setImportPreviewData(null)}
                className="p-1 rounded-lg hover:bg-indigo-700 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* File details */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <FileJson className="w-4 h-4 text-indigo-600" />
                    <span>فایل شناسایی شد: {importPreviewData.fileName}</span>
                  </span>
                  <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-mono">
                    {importPreviewData.fileSize}
                  </span>
                </div>
                <div className="text-[11px] text-indigo-700 dark:text-indigo-300">
                  تاریخ صدور پشتیبان: <span className="font-bold">{importPreviewData.summaryText}</span>
                </div>
              </div>

              {/* Selective Checkboxes */}
              <div>
                <h6 className="font-black text-slate-900 dark:text-white mb-2 text-xs flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                  <span>انتخاب بخش‌های مورد نظر جهت بازیابی:</span>
                </h6>
                <p className="text-[11px] text-slate-500 mb-3">
                  می‌توانید تمام بخش‌ها یا فقط بخش‌های خاصی را برای جایگزینی تیک بزنید:
                </p>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 cursor-pointer hover:border-indigo-400 transition-colors">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectiveImport.settings}
                        onChange={(e) => setSelectiveImport({ ...selectiveImport, settings: e.target.checked })}
                        className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-200">مشخصات عمومی، اطلاعات تماس و متاتگ‌های سئو</span>
                    </div>
                    <Settings className="w-4 h-4 text-slate-400" />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 cursor-pointer hover:border-indigo-400 transition-colors">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectiveImport.gallery}
                        onChange={(e) => setSelectiveImport({ ...selectiveImport, gallery: e.target.checked })}
                        className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-200">گالری و نمونه‌کارها (عکس‌ها، فیلم‌ها و پروژه‌ها)</span>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {toPersianDigits(importPreviewData.itemCounts.gallery)} مورد
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 cursor-pointer hover:border-indigo-400 transition-colors">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectiveImport.bookings}
                        onChange={(e) => setSelectiveImport({ ...selectiveImport, bookings: e.target.checked })}
                        className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-200">درخواست‌های استعلام قیمت و پیام‌های مشتریان</span>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {toPersianDigits(importPreviewData.itemCounts.bookings)} پیام
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 cursor-pointer hover:border-indigo-400 transition-colors">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectiveImport.services}
                        onChange={(e) => setSelectiveImport({ ...selectiveImport, services: e.target.checked })}
                        className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-200">خدمات تاسیساتی و کارت‌های معرفی</span>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {toPersianDigits(importPreviewData.itemCounts.services)} خدمت
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 cursor-pointer hover:border-indigo-400 transition-colors">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectiveImport.tariffs}
                        onChange={(e) => setSelectiveImport({ ...selectiveImport, tariffs: e.target.checked })}
                        className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-200">جدول تعرفه‌ها و قیمت‌های مصوب</span>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {toPersianDigits(importPreviewData.itemCounts.tariffs)} نرخ
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 cursor-pointer hover:border-indigo-400 transition-colors">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectiveImport.reviews}
                        onChange={(e) => setSelectiveImport({ ...selectiveImport, reviews: e.target.checked })}
                        className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-200">نظرات و امتیازات کاربران</span>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {toPersianDigits(importPreviewData.itemCounts.reviews)} نظر
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 cursor-pointer hover:border-indigo-400 transition-colors">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectiveImport.neighborhoods}
                        onChange={(e) => setSelectiveImport({ ...selectiveImport, neighborhoods: e.target.checked })}
                        className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-200">محله‌ها و مناطق تحت پوشش ساوه</span>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {toPersianDigits(importPreviewData.itemCounts.neighborhoods)} منطقه
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 cursor-pointer hover:border-indigo-400 transition-colors">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectiveImport.stats}
                        onChange={(e) => setSelectiveImport({ ...selectiveImport, stats: e.target.checked })}
                        className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-200">آمار بازدیدها، لاگ تماس‌ها و رویدادها</span>
                    </div>
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setImportPreviewData(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!importPreviewData) return;
                  const ok = importFullBackup(importPreviewData.rawJson, selectiveImport);
                  if (ok) {
                    showNotification('بازیابی اطلاعات با موفقیت انجام شد و بخش‌های انتخابی جایگزین گردیدند.');
                    setImportPreviewData(null);
                    setTimeout(() => {
                      window.location.reload();
                    }, 1200);
                  } else {
                    alert('خطا در پردازش و بازیابی اطلاعات فایل.');
                  }
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>تایید و اعمال بازیابی اطلاعات</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FACTORY RESET MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in text-right dir-rtl">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 bg-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>بازگردانی به حالت اولیه پیش‌فرض کارخانه</span>
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                className="p-1 rounded-lg hover:bg-amber-700 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold">
                لطفاً مشخص کنید قصد دارید کدام بخش را به حالت اولیه و پیش‌فرض اورجینال بازگردانید:
              </p>

              <div className="space-y-2.5">
                <label className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  resetScope === 'all'
                    ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                }`}>
                  <input
                    type="radio"
                    name="resetScope"
                    value="all"
                    checked={resetScope === 'all'}
                    onChange={() => setResetScope('all')}
                    className="mt-0.5 w-4 h-4 accent-rose-600"
                  />
                  <div>
                    <span className="font-black text-rose-700 dark:text-rose-300 block">
                      🔴 بازگردانی کامل همه چیز به حالت اولیه کارخانه (Full Reset)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      تمامی تنظیمات، عکس‌ها، ویدئوها، تعرفه‌ها، درخواست‌های آزمایشی و متاتگ‌های سئو به مقادیر پیش‌فرض اولیه برمی‌گردند.
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  resetScope === 'bookings'
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                }`}>
                  <input
                    type="radio"
                    name="resetScope"
                    value="bookings"
                    checked={resetScope === 'bookings'}
                    onChange={() => setResetScope('bookings')}
                    className="mt-0.5 w-4 h-4 accent-blue-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      📞 پاکسازی فقط درخواست‌ها و استعلام‌های مشتریان
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      لیست پیام‌های آزمایشی ثبت‌شده مشتریان پاکسازی می‌شود و سایر اطلاعات سایت دست‌نخورده باقی می‌ماند.
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  resetScope === 'gallery'
                    ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                }`}>
                  <input
                    type="radio"
                    name="resetScope"
                    value="gallery"
                    checked={resetScope === 'gallery'}
                    onChange={() => setResetScope('gallery')}
                    className="mt-0.5 w-4 h-4 accent-purple-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      🖼️ بازگردانی فقط گالری و عکس‌های نمونه‌کارها
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      تصاویر و ویدئوهای گالری به آرشیو نمونه‌کارهای پیش‌فرض اورجینال بازگردانده می‌شوند.
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  resetScope === 'tariffs'
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                }`}>
                  <input
                    type="radio"
                    name="resetScope"
                    value="tariffs"
                    checked={resetScope === 'tariffs'}
                    onChange={() => setResetScope('tariffs')}
                    className="mt-0.5 w-4 h-4 accent-emerald-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      💰 بازگردانی فقط جدول تعرفه‌ها و نرخ‌های مصوب
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      لیست قیمت‌ها به نرخ‌های مصوب اتحادیه اولیه بازنشانی می‌شود.
                    </span>
                  </div>
                </label>
              </div>

              {/* Warning note */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
                💡 پیشنهاد می‌شود قبل از بازگردانی کلی، ابتدا با زدن دکمه «دانلود پشتیبان کامل» یک نسخه فایل پشتیبان برای خود ذخیره کنید.
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={() => {
                  if (resetScope === 'all') {
                    resetAllToDefault();
                    setLocalSettings(JSON.parse(JSON.stringify(initialSiteSettings)));
                    showNotification('تمامی بخش‌های سایت به حالت اولیه پیش‌فرض بازگردانده شدند.');
                  } else if (resetScope === 'bookings') {
                    resetBookingsToDefault();
                    showNotification('لیست استعلام‌ها و درخواست‌های مشتریان بازنشانی شد.');
                  } else if (resetScope === 'gallery') {
                    resetGalleryToDefault();
                    showNotification('گالری و نمونه‌کارها به حالت اولیه بازگشتند.');
                  } else if (resetScope === 'tariffs') {
                    resetTariffsToDefault();
                    showNotification('جدول تعرفه‌ها به نرخ‌های مصوب اولیه بازگشت.');
                  } else if (resetScope === 'stats') {
                    clearStatsLogs();
                    showNotification('آمار بازدیدها و لاگ‌های تماس صفر شدند.');
                  }
                  setShowResetModal(false);
                }}
                className={`px-5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer ${
                  resetScope === 'all' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>تایید و بازگردانی به حالت اولیه</span>
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
