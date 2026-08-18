import { ServiceItem, SiteSettings, NeighborhoodInfo, ReviewItem, GalleryItem, BookingRequest, TariffItem, DiscountCoupon } from '../types';

export const initialSiteSettings: SiteSettings = {
  businessName: 'دفتر خدماتی بهکار ساوه',
  managerName: 'آقای زمانی',
  primaryPhone: '09124551750',
  secondaryPhone: '09196562006',
  rubikaId: '@Jshhshvsh',
  rubikaUrl: 'https://rubika.ir/Jshhshvsh',
  tariffUpdateDate: '۲۶ مرداد ۱۴۰۵',
  city: 'ساوه',
  address: 'ساوه، میدان امام خمینی، پوشش‌دهی کلیه مناطق و شهرک‌های ساوه و حومه',
  workingHours: 'شبانه‌روزی ۲۴ ساعته - حتی روزهای تعطیل و جمعه‌ها',
  emergencyBannerText: 'اعزام فوری سرویس‌کار به سراسر شهر ساوه و شهرک صنعتی کاوه | شبانه‌روزی',
  isEmergencyBannerActive: false,
  showDiscount: false,
  discountPercentage: 0,
  discountNotice: 'تخفیف ویژه تماس از طریق سایت برای کلیه خدمات تاسیساتی',
  seoTitle: 'دفتر خدماتی بهکار ساوه | لوله بازکنی، تخلیه چاه و ایزوگام',
  seoDescription: 'لوله بازکنی در ساوه و خدمات فنی در ساوه با دفتر بهکار ساوه. اعزام فوری ۱۵ دقیقه‌ای، تخلیه چاه، ایزوگام با تضمین کتبی ۱۰۰٪ و کمترین قیمت. تماس شبانه‌روزی.',
  seoKeywords: 'لوله بازکنی ساوه, تخلیه چاه ساوه, کندن چاه نو ساوه, ایزوگام ساوه با ضمانت, دفتر خدماتی بهکار ساوه, آقای زمانی ساوه, لوله کشی فاضلاب ساوه, تعویض سنگ توالت ساوه',

  // Open Graph & Global SEO Defaults
  ogTitle: 'دفتر خدماتی بهکار ساوه | لوله بازکنی و تخلیه چاه فوری شبانه‌روزی',
  ogDescription: 'اعزام فوری سرویس‌کار در ۱۵ دقیقه سراسر ساوه و حومه. کمترین قیمت، تضمین ۱۰۰٪ کتبی، شبانه‌روزی بدون تعطیلی - مدیریت آقای زمانی ۰۹۱۲۴۵۵۱۷۵۰',
  ogImageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=900&auto=format&fit=crop',
  ogSiteName: 'دفتر خدماتی بهکار ساوه',
  canonicalUrl: 'https://behkar-saveh.ir/',

  // Core Section SEO Metadata Defaults
  servicesMetaTitle: 'خدمات لوله بازکنی، تخلیه چاه و ایزوگام در ساوه | بهکار ساوه',
  servicesMetaDescription: 'لیست کامل خدمات تاسیساتی دفتر بهکار ساوه: لوله بازکنی با ژنراتور بدون کثیف‌کاری، تخلیه چاه با تانکر ساکشن مکنده، نصب ایزوگام و حفر چاه نو با فاکتور رسمی.',
  tariffsMetaTitle: 'تعرفه و لیست قیمت لوله بازکنی و تخلیه چاه در ساوه (نرخ اتحادیه)',
  tariffsMetaDescription: 'استعلام آنلاین و مشاهده قیمت‌های مصوب لوله بازکنی، تخلیه چاه و حفر چاه در ساوه و شهرک صنعتی کاوه. تضمین منصفانه‌ترین قیمت‌ها توسط مدیریت آقای زمانی.',
  whyUsMetaTitle: 'چرا دفتر خدماتی بهکار ساوه؟ | ۱۵ سال سابقه و تضمین ۱۰۰٪ کتبی',
  whyUsMetaDescription: 'دلایل انتخاب دفتر بهکار: اعزام زیر ۱۵ دقیقه، سرویس‌کاران مجرب بومی، ابزارآلات برقی بدون خرابی و پشتیبانی شبانه‌روزی ۲۴/۷ در شهر ساوه.',
  galleryMetaTitle: 'گالری نمونه‌کارهای لوله بازکنی، تخلیه چاه و ایزوگام در ساوه',
  galleryMetaDescription: 'تصاویر و ویدیوهای واقعی از نحوه اجرای پروژه لوله بازکنی، تخلیه چاه با تانکر لجن‌کش و نصب ایزوگام توسط تکنسین‌های بهکار ساوه.',
  reviewsMetaTitle: 'نظرات و رضایت‌مندی همشهریان ساوه از دفتر خدماتی بهکار',
  reviewsMetaDescription: 'تجربه و دیدگاه‌های واقعی شهروندان ساوه، ساکنین شهرک فجر، علوی و مدیران کارخانجات شهرک صنعتی کاوه از کیفیت خدمات لوله بازکنی و تخلیه چاه.',
  faqMetaTitle: 'سوالات متداول لوله بازکنی، تخلیه چاه و ایزوگام در ساوه',
  faqMetaDescription: 'پاسخ به تمامی سوالات شما درباره مدت زمان رسیدن سرویس‌کار، نحوه محاسبه هزینه، ضمانت‌نامه‌ها و روش‌های لوله بازکنی در ساوه.',
  adminUsername: 'jafarzamanichn2005',
  adminPin: 'Jz#9842Km$7W',

  // Dynamic Guarantee settings
  generalGuaranteeText: 'ضمانت کتبی کیفیت و فاکتور رسمی معتبر',
  isogamGuaranteeText: 'ضمانت کتبی کیفیت نصب و تست آب‌بندی استاندارد',
  pipeGuaranteeText: 'تضمین ۱۰۰٪ باز شدن کامل مسیر آب بدون خرابی',
  tankerGuaranteeText: 'تخلیه کامل تا کف چاه و تحویل فوری',
  wellGuaranteeText: 'ضمانت مقاومت سازه چاه و رعایت اصول ایمنی',

  // Section Headlines
  heroHeadline: 'لوله بازکنی، تخلیه چاه و خدمات تاسیساتی شبانه‌روزی',
  heroSubheadline: 'دفتر خدماتی بهکار ساوه با مدیریت آقای زمانی، مجهز به پیشرفته‌ترین دستگاه‌های ژنراتور، تانکرهای مکنده بزرگ و کادر مجرب در سراسر ساوه.',
  servicesHeadline: 'خدمات جامع تاسیساتی، تخلیه چاه و ایزوگام در ساوه',
  servicesSubheadline: 'کلیه خدمات تحت نظارت مستقیم آقای زمانی با بهره‌گیری از مدرن‌ترین ابزارآلات و کادر متعهد، با کمترین قیمت و ضمانت کتبی ارائه می‌گردد.',
  estimatorHeadline: 'استعلام آنلاین و تعرفه مصوب قیمت خدمات در شهر ساوه',
  estimatorSubheadline: 'محاسبه دقیق هزینه لوله بازکنی، تخلیه چاه، حفر چاه و ایزوگام طبق نرخ‌نامه رسمی و استعلام فوری',
  whyUsHeadline: 'چرا دفتر خدماتی بهکار انتخاب اول همشهریان ساوه است؟',
  whyUsSubheadline: 'بیش از ۱۵ سال سابقه درخشان در ارائه خدمات ساختمانی و تاسیساتی در شهر ساوه',
  reviewsHeadline: 'نظرات مشتریان دفتر خدماتی بهکار',
  reviewsSubheadline: 'تجربه شهروندان محترم ساوه، شهرک‌های مسکونی و مدیران محترم شهرک صنعتی کاوه',
  faqHeadline: 'سوالات متداول شهروندان ساوه',
  faqSubheadline: 'پاسخ به پرسش‌های پرتکرار در مورد خدمات لوله بازکنی، تخلیه چاه، ایزوگام و قیمت‌ها در ساوه',
  footerAboutText: 'دفتر خدماتی بهکار ساوه با مدیریت آقای زمانی، مرکز تخصصی ارائه خدمات لوله بازکنی، تخلیه چاه، ایزوگام، حفر چاه و لوله‌کشی با کادر مجرب و دستگاه‌های پیشرفته به صورت شبانه‌روزی در ساوه و حومه.',

  // Technician Status Card Initial Values
  techStatusText: 'وضعیت تکنسین‌های ساوه: آماده اعزام',
  techStatusBadge: '۲۴/۷ فعال',
  techCardImageBadge: 'تضمین کتبی فاکتوردار',
  techCardSubtitle: 'دفتر خدماتی بهکار ساوه',
  techCardTitle: 'تجهیزات مدرن ژنراتور، فنر فولادی و تانکر مکنده',
  techCardLocationText: 'پوشش کلیه نقاط ساوه، شهرک کاوه و روستاهای حومه',

  // Custom Section Banners & Images
  heroImageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=900&auto=format&fit=crop',
  aboutImageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800',
  whyUsImageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',

  // Secret Admin Trigger Phone Number
  adminTriggerPhone: '09123456789',

  // Permanent Media Vault Archive
  mediaVault: [
    {
      id: 'vault-1',
      title: 'لوله بازکنی تخصصی سینک و کف‌شور آشپزخانه',
      category: 'service',
      url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800',
      uploadedAt: '۲۶ مرداد ۱۴۰۵',
      isCurrentActive: true
    },
    {
      id: 'vault-2',
      title: 'تخلیه چاه با تانکر مکنده پرقدرت و پمپ لجن‌کش',
      category: 'service',
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
      uploadedAt: '۲۶ مرداد ۱۴۰۵',
      isCurrentActive: true
    },
    {
      id: 'vault-3',
      title: 'حفر چاه فاضلاب جذبی و کول‌گذاری بتنی مسلح',
      category: 'service',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&q=80&w=800',
      uploadedAt: '۲۶ مرداد ۱۴۰۵',
      isCurrentActive: true
    },
    {
      id: 'vault-4',
      title: 'تجهیزات مدرن ژنراتور و تصویر اصلی سایت',
      category: 'hero',
      url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=900&auto=format&fit=crop',
      uploadedAt: '۲۶ مرداد ۱۴۰۵',
      isCurrentActive: true
    }
  ],

  // Section Visibility Toggles Defaults
  showHeroSection: true,
  showServicesSection: true,
  showPricingSection: true,
  showGallerySection: true,
  showCoverageMapSection: true,
  showWhyUsSection: true,
  showReviewsSection: true,
  showFaqSection: true,

  // Global Call-for-Price Pricing Override Default
  forceCallForPrice: false,
  callForPriceCustomText: 'برای استعلام تماس بگیرید',

  // Button Visibility Toggles
  showHeroCall1: true,
  showHeroCall2: true,
  showHeroRubika: true,
  showHeroBooking: true,
  showFloatingBar: true,
  showFloatingCall1: true,
  showFloatingCall2: true,
  showFloatingRubika: true,

  // Initial Custom Messengers
  messengers: [
    {
      id: 'msg-rubika',
      name: 'روبیکا (Rubika)',
      usernameOrId: '@Jshhshvsh',
      link: 'https://rubika.ir/Jshhshvsh',
      iconName: 'message-circle',
      customIconUrl: 'https://web.rubika.ir/assets/icons/icon-192x192.png',
      colorTheme: 'purple',
      badge: 'پشتیبانی و ارسال عکس',
      isActive: true,
      showInHero: true,
      showInFooter: true,
      showInFloatingBar: true,
    },
    {
      id: 'msg-eitaa',
      name: 'ایتا (Eitaa)',
      usernameOrId: '@behkar_saveh',
      link: 'https://eitaa.com/behkar_saveh',
      iconName: 'send',
      colorTheme: 'orange',
      badge: 'کانال و پیام مستقیم',
      isActive: true,
      showInHero: true,
      showInFooter: true,
      showInFloatingBar: false,
    },
    {
      id: 'msg-whatsapp',
      name: 'واتساپ (WhatsApp)',
      usernameOrId: '09124551750',
      link: 'https://wa.me/989124551750',
      iconName: 'phone',
      colorTheme: 'emerald',
      badge: 'مشاوره آنلاین',
      isActive: false,
      showInHero: false,
      showInFooter: true,
      showInFloatingBar: false,
    },
    {
      id: 'msg-telegram',
      name: 'تلگرام (Telegram)',
      usernameOrId: '@behkar_saveh',
      link: 'https://t.me/behkar_saveh',
      iconName: 'send',
      colorTheme: 'blue',
      badge: 'کانال اطلاع‌رسانی',
      isActive: false,
      showInHero: false,
      showInFooter: true,
      showInFloatingBar: false,
    },
    {
      id: 'msg-bale',
      name: 'بله (Bale)',
      usernameOrId: '@behkar_saveh',
      link: 'https://ble.ir/behkar_saveh',
      iconName: 'message-circle',
      colorTheme: 'cyan',
      badge: 'پیام‌رسان بانکی و خدماتی',
      isActive: false,
      showInHero: false,
      showInFooter: true,
      showInFloatingBar: false,
    },
    {
      id: 'msg-soroush',
      name: 'سروش پلاس (Soroush)',
      usernameOrId: '@behkar_saveh',
      link: 'https://splus.ir/behkar_saveh',
      iconName: 'message-circle',
      colorTheme: 'indigo',
      badge: 'سروش پلاس',
      isActive: false,
      showInHero: false,
      showInFooter: true,
      showInFloatingBar: false,
    },
  ],
};

export const initialTariffs: TariffItem[] = [
  // لوله بازکنی
  {
    id: 'tar-p1',
    category: 'pipe',
    categoryName: 'تعرفه لوله بازکنی',
    title: 'فنر زدن از ۱ تا ۱۵ متر (لوله بازکنی استاندارد)',
    unit: 'هر عدد',
    priceRange: '۱,۰۰۰,۰۰۰ – ۱,۵۰۰,۰۰۰',
    note: 'شامل فنر بهداشتی جداگانه برای آشپزخانه و سرویس‌ها'
  },
  {
    id: 'tar-p2',
    category: 'pipe',
    categoryName: 'تعرفه لوله بازکنی',
    title: 'فنر زدن طول بیش از ۱۵ متر',
    unit: 'هر عدد',
    priceRange: '۱,۷۸۰,۰۰۰ – ۲,۵۰۰,۰۰۰',
    note: 'مناسب لوله‌های طبقات و فواصل دور تا چاه'
  },
  {
    id: 'tar-p3',
    category: 'pipe',
    categoryName: 'تعرفه لوله بازکنی',
    title: 'فنر زدن متراژ بلند طول بیش از ۲۵ متر',
    unit: 'هر عدد',
    priceRange: '۲,۵۰۰,۰۰۰ – ۳,۴۰۰,۰۰۰',
    note: 'فنر ضخیم متراژ بالا برای لوله‌های حیاط و پارکینگ'
  },
  {
    id: 'tar-p4',
    category: 'pipe',
    categoryName: 'تعرفه لوله بازکنی',
    title: 'لوله بازکنی با دستگاه ژنراتور قوی و فنر ضخیم الماسه',
    unit: 'کل کار',
    priceRange: '۱,۵۰۰,۰۰۰ – ۳,۲۳۰,۰۰۰',
    note: 'ویژه باز کردن سیمان، قیر، گچ و چربی‌های سنگین سفت‌شده'
  },

  // تخلیه چاه
  {
    id: 'tar-t1',
    category: 'tanker',
    categoryName: 'تعرفه تخلیه چاه با تانکر',
    title: 'تخلیه چاه با تانکر ۶۰۰۰ لیتری با پمپ مکنده (ساکشن)',
    unit: 'هر سرویس',
    priceRange: '۲,۷۵۰,۰۰۰ – ۴,۰۰۰,۰۰۰',
    note: 'تانکر مکانیزه مکنده قوی'
  },
  {
    id: 'tar-t2',
    category: 'tanker',
    categoryName: 'تعرفه تخلیه چاه با تانکر',
    title: 'تخلیه چاه با تانکر ۸۰۰۰ لیتری با پمپ مکنده (ساکشن)',
    unit: 'هر سرویس',
    priceRange: '۳,۵۰۰,۰۰۰ – ۴,۵۰۰,۰۰۰',
    note: 'ظرفیت بالا برای ساختمان‌ها و مجتمع‌های مسکونی'
  },
  {
    id: 'tar-t3',
    category: 'tanker',
    categoryName: 'تعرفه تخلیه چاه با تانکر',
    title: 'تخلیه چاه با تانکر ۶۰۰۰ لیتری با پمپ لجن‌کش',
    unit: 'هر سرویس',
    priceRange: '۳,۰۰۰,۰۰۰ – ۴,۰۰۰,۰۰۰',
    note: 'تخلیه لجن و رسوبات ته‌نشین‌شده کف چاه'
  },
  {
    id: 'tar-t4',
    category: 'tanker',
    categoryName: 'تعرفه تخلیه چاه با تانکر',
    title: 'تخلیه چاه با تانکر ۸۰۰۰ لیتری با پمپ لجن‌کش پرقدرت',
    unit: 'هر سرویس',
    priceRange: '۴,۰۰۰,۰۰۰ – ۵,۰۰۰,۰۰۰',
    note: 'پمپ لجن‌کش ارتفاع‌زن برای چاه‌های عمیق'
  },
  {
    id: 'tar-t5',
    category: 'tanker',
    categoryName: 'تعرفه تخلیه چاه با تانکر',
    title: 'کارگر ساده تا ۴ ساعت',
    unit: 'کل کار',
    priceRange: '۸۷۰,۰۰۰ – ۱,۱۵۰,۰۰۰',
    note: 'جهت لایروبی و باز و بستن درب چاه'
  },
  {
    id: 'tar-t6',
    category: 'tanker',
    categoryName: 'تعرفه تخلیه چاه با تانکر',
    title: 'هر ساعت اضافه کار کارگر ساده',
    unit: 'ساعتی',
    priceRange: '۲۱۷,۰۰۰ – ۲۸۸,۰۰۰',
    note: 'محاسبه به ازای هر ساعت کار مازاد'
  },
  {
    id: 'tar-t7',
    category: 'tanker',
    categoryName: 'تعرفه تخلیه چاه با تانکر',
    title: 'حداقل دستمزد و کارشناسی',
    unit: 'پروژه‌ای',
    priceRange: '۵۰۰,۰۰۰ – ۱,۰۰۰,۰۰۰',
    note: 'تشخیص محل چاه و برآورد ظرفیت'
  },
  {
    id: 'tar-t8',
    category: 'tanker',
    categoryName: 'تعرفه تخلیه چاه با تانکر',
    title: 'ایاب و ذهاب تانکر در ساوه',
    unit: 'هر سرویس',
    priceRange: '۳۹۱,۰۰۰ – ۵۱۷,۰۰۰',
    note: 'پوشش کلیه نقاط ساوه و حومه'
  },

  // حفر چاه
  {
    id: 'tar-d1',
    category: 'digging',
    categoryName: 'تعرفه حفر و کندن چاه',
    title: 'حفر چاه آب دستی توسط مقنی',
    unit: 'متری',
    priceRange: '۱,۵۰۰,۰۰۰ – ۳,۰۰۰,۰۰۰',
    note: 'حفر سنتی با ابزار دستی و بالابر'
  },
  {
    id: 'tar-d2',
    category: 'digging',
    categoryName: 'تعرفه حفر و کندن چاه',
    title: 'حفر چاه آب با دستگاه مکانیزه',
    unit: 'متری',
    priceRange: '۱,۵۰۰,۰۰۰ – ۲,۰۰۰,۰۰۰',
    note: 'سرعت و راندمان بالا در حفاری'
  },
  {
    id: 'tar-d3',
    category: 'digging',
    categoryName: 'تعرفه حفر و کندن چاه',
    title: 'حفر چاه فاضلاب جذبی (میله و انبار)',
    unit: 'متری',
    priceRange: '۱,۰۰۰,۰۰۰ – ۲,۰۰۰,۰۰۰',
    note: 'مناسب منازل و ساختمان‌های مسکونی ساوه'
  },
  {
    id: 'tar-d4',
    category: 'digging',
    categoryName: 'تعرفه حفر و کندن چاه',
    title: 'حفر چاه ارت تخصصی استاندارد',
    unit: 'متری',
    priceRange: '۱,۹۵۰,۰۰۰ – ۲,۸۰۰,۰۰۰',
    note: 'ویژه سیستم ارتینگ و صاعقه‌گیر'
  },
  {
    id: 'tar-d5',
    category: 'digging',
    categoryName: 'تعرفه حفر و کندن چاه',
    title: 'حداقل دستمزد و کارشناسی مقنی',
    unit: 'پروژه‌ای',
    priceRange: '۵۷۵,۰۰۰ – ۱,۰۰۰,۰۰۰',
    note: 'بررسی جنس خاک و انتخاب محل بهینه چاه'
  },
  {
    id: 'tar-d6',
    category: 'digging',
    categoryName: 'تعرفه حفر و کندن چاه',
    title: 'ایاب و ذهاب اکیپ مقنی',
    unit: 'هر سرویس',
    priceRange: '۴۳۵,۰۰۰ – ۵۷۵,۰۰۰',
    note: 'اعزام اکیپ با کلیه ادوات به محل'
  },

  // ایزوگام
  {
    id: 'tar-i1',
    category: 'isogam',
    categoryName: 'تعرفه ایزوگام با ضمانت و نصب',
    title: 'قیمت ایزوگام با نصب کامل (خرید رول و اجرت)',
    unit: 'متر مربع',
    priceRange: '۳۰۰,۰۰۰ – ۵۰۰,۰۰۰',
    note: 'شامل ایزوگام درجه یک با ضمانت کتبی'
  },
  {
    id: 'tar-i2',
    category: 'isogam',
    categoryName: 'تعرفه ایزوگام با ضمانت و نصب',
    title: 'قیمت خام ایزوگام (رول بدون نصب)',
    unit: 'متر مربع',
    priceRange: '۲۲۰,۰۰۰ – ۴۵۰,۰۰۰',
    note: 'فروش رول استاندارد ایزوگام با ضخامت بالا'
  },
  {
    id: 'tar-i3',
    category: 'isogam',
    categoryName: 'تعرفه ایزوگام با ضمانت و نصب',
    title: 'اجرت نصب ایزوگام پشت‌بام (بدون مصالح)',
    unit: 'متر مربع',
    priceRange: '۱۱۰,۰۰۰ – ۱۷۰,۰۰۰',
    note: 'اجرای زیرسازی، پرایمر و نصب استاندارد'
  },
  {
    id: 'tar-i4',
    category: 'isogam',
    categoryName: 'تعرفه ایزوگام با ضمانت و نصب',
    title: 'اجرت نصب ایزوگام سرویس بهداشتی و حمام',
    unit: 'متر مربع',
    priceRange: '۱۵۰,۰۰۰ – ۲۰۰,۰۰۰',
    note: 'عایق‌کاری تخصصی زاویه‌ها و دور لوله‌ها'
  },
  {
    id: 'tar-i5',
    category: 'isogam',
    categoryName: 'تعرفه ایزوگام با ضمانت و نصب',
    title: 'اجرت نصب ایزوگام دیوار جانبی مرتفع',
    unit: 'متر مربع',
    priceRange: '۲۰,۰۰۰ – ۳۰۰,۰۰۰',
    note: 'نصب با داربست و تجهیزات ایمنی'
  },

  // تعویض سنگ توالت
  {
    id: 'tar-s1',
    category: 'toilet_stone',
    categoryName: 'تعرفه تعویض سنگ توالت',
    title: 'تعویض کامل سنگ توالت (پروژه‌ای)',
    unit: 'پروژه‌ای',
    priceRange: '۲,۵۰۰,۰۰۰ – ۴,۵۰۰,۰۰۰',
    note: 'خرید کاسه جدید، تخریب، اصلاح لوله‌کشی، قیرگونی و کاشی‌کاری'
  },
  {
    id: 'tar-s2',
    category: 'toilet_stone',
    categoryName: 'تعرفه تعویض سنگ توالت',
    title: 'تبدیل توالت ایرانی به فرنگی',
    unit: 'پروژه‌ای',
    priceRange: '۲,۰۰۰,۰۰۰ – ۳,۵۰۰,۰۰۰',
    note: 'اصلاح سیفون و جای‌گذاری استاندار'
  },

  // لوله‌کشی فاضلاب
  {
    id: 'tar-l1',
    category: 'plumbing',
    categoryName: 'تعرفه لوله‌کشی فاضلاب',
    title: 'لوله‌کشی با لوله پلیکا (PVC)',
    unit: 'متر طول',
    priceRange: '۱۰۰,۰۰۰ – ۲۰۰,۰۰۰',
    note: 'اجرا و شیب‌بندی اصولی شبکه فاضلاب'
  },
  {
    id: 'tar-l2',
    category: 'plumbing',
    categoryName: 'تعرفه لوله‌کشی فاضلاب',
    title: 'لوله‌کشی پوشفیت (تا سایز ۱۱۰ با بست)',
    unit: 'متر طول',
    priceRange: '۱۵۰,۰۰۰ – ۲۳۰,۰۰۰',
    note: 'نصب اورینگ و اوربست‌های استاندارد'
  },
  {
    id: 'tar-l3',
    category: 'plumbing',
    categoryName: 'تعرفه لوله‌کشی فاضلاب',
    title: 'لوله‌کشی پلی‌اتیلن (با شاسی‌کشی)',
    unit: 'متر طول',
    priceRange: '۱۸۰,۰۰۰ – ۳۰۰,۰۰۰',
    note: 'جوشکاری پلی‌اتیلن و شاسی‌کشی مقاوم'
  },
  {
    id: 'tar-l4',
    category: 'plumbing',
    categoryName: 'تعرفه لوله‌کشی فاضلاب',
    title: 'لوله‌کشی خرده‌کاری زیرسقفی',
    unit: 'پروژه‌ای',
    priceRange: '۲,۰۰۰,۰۰۰ – ۳,۵۰۰,۰۰۰',
    note: 'تعمیرات و تعویض مقطعی لوله‌ها'
  },
  {
    id: 'tar-l5',
    category: 'plumbing',
    categoryName: 'تعرفه لوله‌کشی فاضلاب',
    title: 'لوله‌کشی ساختمانی زیر ۴ واحد',
    unit: 'هر واحد',
    priceRange: '۶,۰۰۰,۰۰۰ – ۹,۰۰۰,۰۰۰',
    note: 'اجرای کامل راه‌اندازی فاضلاب مجتمع'
  }
];

export const initialServices: ServiceItem[] = [
  {
    id: 'pipe-unclogging',
    slug: 'looleh-bazkoni',
    title: 'لوله بازکنی فوری و شبانه‌روزی',
    shortDesc: 'باز کردن انواع گرفتگی با فنرهای مجزا از ۱ تا بیش از ۲۵ متر و دستگاه ژنراتور قوی بدون کثیف‌کاری و خرابی.',
    fullDesc: 'لوله بازکنی تخصصی در سراسر ساوه با مدرن‌ترین دستگاه ژنراتور برقی و فنرهای فولادی تمیز و جداگانه. باز کردن لوله‌های سخت سیمانی، چربی، مو و رسوب با رعایت کامل بهداشت و بدون کوچک‌ترین آسیب.',
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800',
    startingPrice: 'از ۱,۰۰۰,۰۰۰ تومان',
    priceNote: 'بر اساس متراژ فنر و نوع گرفتگی',
    guarantee: 'تضمین ۱۰۰٪ کتبی باز شدن مسیر آب',
    badge: 'پرفروش‌ترین خدمت',
    features: [
      'فنر زدن از ۱ تا ۱۵ متر (۱,۰۰۰,۰۰۰ الی ۱,۵۰۰,۰۰۰ تومان)',
      'فنر زدن بیش از ۱۵ متر (۱,۷۸۰,۰۰۰ الی ۲,۵۰۰,۰۰۰ تومان)',
      'فنر زدن بیش از ۲۵ متر (۲,۵۰۰,۰۰۰ الی ۳,۴۰۰,۰۰۰ تومان)',
      'لوله بازکنی با ژنراتور قوی و فنر ضخیم (۱,۵۰۰,۰۰۰ الی ۳,۲۳۰,۰۰۰ تومان)',
      'اعزام فوری به تمام مناطق ساوه'
    ],
    tools: ['ژنراتور اتوماتیک پرقدرت', 'فنرهای فولادی الماسه تا ۳۰ متر', 'پمپ تراکم هوا', 'دوربین آندوسکوپی لوله']
  },
  {
    id: 'well-drainage',
    slug: 'takhliyeh-chah',
    title: 'تخلیه چاه مکانیزه با تانکر و پمپ مکنده',
    shortDesc: 'تخلیه چاه با تانکرهای ۶۰۰۰ و ۸۰۰۰ لیتری مجهز به پمپ مکنده و لجن‌کش پرقدرت، لایروبی و اعزام مقنی.',
    fullDesc: 'تخلیه اصولی و بهداشتی چاه با تانکرهای بزرگ مکنده و پمپ‌های لجن‌کش ارتفاع‌زن. لایروبی چاه، تراش انباری کهنه و احیای چاه در ساوه و شهرک صنعتی کاوه.',
    icon: 'Truck',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
    startingPrice: 'از ۲,۷۵۰,۰۰۰ تومان',
    priceNote: 'بسته به حجم تانکر (۶ و ۸ هزار لیتری) و نوع پمپ',
    guarantee: 'تخلیه کامل تا کف چاه و تحویل فوری',
    badge: 'تانکر مکنده بزرگ',
    features: [
      'تانکر ۶۰۰۰ لیتری با پمپ مکنده (۲,۷۵۰,۰۰۰ الی ۴,۰۰۰,۰۰۰ تومان)',
      'تانکر ۸۰۰۰ لیتری با پمپ مکنده (۳,۵۰۰,۰۰۰ الی ۴,۵۰۰,۰۰۰ تومان)',
      'تانکر ۶۰۰۰ لیتری با پمپ لجن‌کش (۳,۰۰۰,۰۰۰ الی ۴,۰۰۰,۰۰۰ تومان)',
      'تانکر ۸۰۰۰ لیتری با پمپ لجن‌کش (۴,۰۰۰,۰۰۰ الی ۵,۰۰۰,۰۰۰ تومان)',
      'کارگر ساده تا ۴ ساعت (۸۷۰,۰۰۰ الی ۱,۱۵۰,۰۰۰ تومان)'
    ],
    tools: ['تانکر مکنده وکیوم', 'پمپ لجن‌کش کف‌کش', 'شلنگ‌های فشار قوی ضخیم', 'تجهیزات ایمنی مقنی']
  },
  {
    id: 'well-digging',
    slug: 'kandan-chah-no',
    title: 'کندن و حفر چاه (آب، فاضلاب و ارت)',
    shortDesc: 'حفر اصولی چاه فاضلاب، چاه آب دستی و با دستگاه و چاه ارت توسط مقنی‌های باتجربه ساوه با رعایت استانداردهای ایمنی.',
    fullDesc: 'حفر انواع چاه جذبی فاضلاب، چاه آب دستی و دستگاهی، چاه ارت ساختمانی و صنعتی. اجرای طوقه‌چینی مستحکم، کول‌گذاری بتنی برای جلوگیری از ریزش و لایروبی انباری چاه کهنه.',
    icon: 'Hammer',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&q=80&w=800',
    startingPrice: 'از ۱,۰۰۰,۰۰۰ تومان (هر متر)',
    priceNote: 'متناسب با نوع چاه و جنس خاک منطقه',
    guarantee: 'تضمین مقاومت سازه و ایمنی کامل',
    badge: 'کادر مقنی بیمه‌شده',
    features: [
      'حفر چاه آب دستی (متری ۱,۵۰۰,۰۰۰ الی ۳,۰۰۰,۰۰۰ تومان)',
      'حفر چاه آب با دستگاه (متری ۱,۵۰۰,۰۰۰ الی ۲,۰۰۰,۰۰۰ تومان)',
      'حفر چاه فاضلاب (متری ۱,۰۰۰,۰۰۰ الی ۲,۰۰۰,۰۰۰ تومان)',
      'حفر چاه ارت (متری ۱,۹۵۰,۰۰۰ الی ۲,۸۰۰,۰۰۰ تومان)',
      'طوقه‌چینی، کول‌گذاری و افزایش گنجایش انبار چاه'
    ],
    tools: ['دژبر و چکش تخریب بادی', 'بالابر برقی استاندارد', 'هواساز تونلی', 'کول‌های بتنی مسلح']
  },
  {
    id: 'isogam-roofing',
    slug: 'isogam-ba-tazmin',
    title: 'ایزوگام با تضمین و کیفیت استاندارد',
    shortDesc: 'نصب و اجرای ایزوگام درجه یک صادراتی با قیر پلیمری خالص، همراه با ضمانت کتبی کیفیت و تحویل با تست آب‌بندی کامل.',
    fullDesc: 'نصب تخصصی ایزوگام دولایه فویل‌دار و ساده بر روی پشت‌بام، استخر، سرویس‌های بهداشتی، حمام، پی ساختمان، بالکن و دیوارهای جانبی در ساوه. زیرسازی و قیرکاری اولیه با شیب‌بندی استاندارد جهت جلوگیری از تجمع آب باران.',
    icon: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=900&auto=format&fit=crop',
    startingPrice: 'از ۱۱۰,۰۰۰ تومان (هر متر)',
    priceNote: 'با مصالح درجه یک و دستمزد اجرا',
    guarantee: 'ضمانت کتبی کیفیت و تست آب‌بندی',
    badge: 'ضمانت کتبی کیفیت',
    features: [
      'قیمت ایزوگام با نصب کامل (۳۰۰,۰۰۰ الی ۵۰۰,۰۰۰ تومان/متر)',
      'قیمت خام ایزوگام رول (۲۲۰,۰۰۰ الی ۴۵۰,۰۰۰ تومان/متر)',
      'اجرت نصب پشت‌بام بدون مصالح (۱۱۰,۰۰۰ الی ۱۷۰,۰۰۰ تومان/متر)',
      'اجرت نصب سرویس و حمام (۱۵۰,۰۰۰ الی ۲۰۰,۰۰۰ تومان/متر)',
      'اجرت نصب دیوار جانبی مرتفع (۲۰۰,۰۰۰ الی ۳۰۰,۰۰۰ تومان/متر)'
    ],
    tools: ['مشعل‌های پرقدرت گازی', 'رول‌های ایزوگام درجه یک صادراتی', 'قیر پلیمری BPP', 'کمچه و ماله صنعتی']
  },
  {
    id: 'sewer-piping',
    slug: 'looleh-keshi-fazelab',
    title: 'لوله‌کشی تخصصی آب و فاضلاب',
    shortDesc: 'اجرا و تعمیرات لوله‌کشی فاضلاب ساختمان با لوله‌های پلیکا، پوش‌فیت، پلی‌اتیلن و رفع نشتی و نم با دستگاه تصویری دیجیتال.',
    fullDesc: 'طراحی، اجرا و بازسازی سیستم لوله‌کشی فاضلاب، آب مصرفی و شوفاژ در پروژه‌های ساختمانی و بازسازی خانه‌های قدیمی در ساوه. اتصال لوله‌های ساختمان به شبکه فاضلاب شهری (اگو) و تشخیص دقیق محل ترکیدگی بدون تخریب بی‌مورد.',
    icon: 'Pipette',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=900&auto=format&fit=crop',
    startingPrice: 'از ۱۰۰,۰۰۰ تومان (هر متر)',
    priceNote: 'بر اساس نوع متراژ و نوع لوله',
    guarantee: 'تضمین عدم نشتی و عدم پس‌زدگی بو',
    badge: 'استادکاران ماهر',
    features: [
      'لوله‌کشی با لوله پلیکا PVC (متری ۱۰۰,۰۰۰ الی ۲۰۰,۰۰۰ تومان)',
      'لوله‌کشی پوشفیت تا سایز ۱۱۰ (متری ۱۵۰,۰۰۰ الی ۲۳۰,۰۰۰ تومان)',
      'لوله‌کشی پلی‌اتیلن با شاسی (متری ۱۸۰,۰۰0 الی ۳۰۰,۰۰۰ تومان)',
      'لوله‌کشی خرده‌کاری زیرسقفی (۲,۰۰۰,۰۰۰ الی ۳,۵۰۰,۰۰۰ تومان پروژه‌ای)',
      'لوله‌کشی زیر ۴ واحد (۶,۰۰۰,۰۰۰ الی ۹,۰۰۰,۰۰۰ تومان هر واحد)'
    ],
    tools: ['دستگاه نشت‌یاب دیجیتال', 'دستگاه جوش پلی‌اتیلن', 'ابزارآلات کامل لوله‌کشی', 'فشارسنج تست شبکه']
  },
  {
    id: 'toilet-stone-replacement',
    slug: 'taviz-sang-toalet',
    title: 'تعویض سنگ و کاسه سرویس بهداشتی',
    shortDesc: 'تعویض کاسه توالت ایرانی شکسته و فرسوده، تبدیل توالت ایرانی به فرنگی و بالعکس، عایق‌کاری، بندکشی نانو و سرامیک‌کاری فوری.',
    fullDesc: 'تخریب اصولی کاسه توالت کهنه، شیب‌بندی استاندارد، عایق‌کاری دولایه با قیر و ایزوگام، تعویض شترگلو و لوله فاضلاب، نصب سنگ جدید چینی مرغوب و کاشی‌کاری پیرامون در کمتر از یک روز کاری بدون معطلی برای ساکنین.',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=900&auto=format&fit=crop',
    startingPrice: 'از ۲,۰۰۰,۰۰۰ تومان',
    priceNote: 'شامل تخریب، عایق و نصب سنگ جدید',
    guarantee: 'ضمانت عدم نفوذ نم و بدون بو',
    badge: 'انجام در کمتر از ۱ روز',
    features: [
      'تعویض کامل سنگ توالت پروژه‌ای (۲,۵۰۰,۰۰۰ الی ۴,۵۰۰,۰۰۰ تومان)',
      'تبدیل توالت ایرانی به فرنگی تخصصی (۲,۰۰۰,۰۰۰ الی ۳,۵۰۰,۰۰۰ تومان)',
      'شامل خرید سنگ جدید، تخریب، لوله‌کشی فاضلاب و عایق‌کاری',
      'بندکشی و کاشی‌کاری با مواد نانو ۱۰۰٪ ضد آب',
      'تحویل سریع در کمتر از یک روز کاری'
    ],
    tools: ['تجهیزات تخریب سبک بدون ضربه به سازه', 'تراز لیزری', 'چسب واترپروف و پودر نانو', 'کاسه‌های طبی جدید']
  }
];

export const savehNeighborhoods: NeighborhoodInfo[] = [];

export const initialReviews: ReviewItem[] = [];

export const initialGallery: GalleryItem[] = [
  {
    id: 'gal-img-1',
    title: 'لوله بازکنی تخصصی سینک و کف‌شور با فنر تمیز و بی‌صدا',
    category: 'لوله بازکنی',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800',
    description: 'رفع گرفتگی لوله فاضلاب آشپزخانه بدون ذره‌ای پاشش آب و کثیف‌کاری، ضدعفونی کامل و تست سرعت عبور آب با رضایت کامل مشتری.',
    highlights: [
      'فنر کاملاً بهداشتی و بدون بو',
      'تراشیدن رسوبات چربی دیواره لوله',
      'حضور سریع در کمتر از ۲۰ دقیقه'
    ],
    location: 'خیابان مطهری ساوه'
  },
  {
    id: 'gal-img-2',
    title: 'تخلیه چاه با تانکر مکنده پرقدرت و پمپ لجن‌کش ساکشن',
    category: 'تخلیه چاه',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
    description: 'تخلیه کامل سپتیک و چاه فاضلاب با تانکر ۱۲۰۰۰ لیتری و شیلنگ‌های فشارقوی بدون بوی نامطبوع در محیط، لجن‌کشی و لایروبی رسوبات کف چاه.',
    highlights: [
      'پمپ لجن‌کش پرقدرت سه فاز',
      'شیلنگ بلند برای مسافت‌های دور',
      'تخلیه کامل تا کف بدون باقیمانده'
    ],
    location: 'شهرک صنعتی کاوه'
  },
  {
    id: 'gal-img-3',
    title: 'حفر چاه فاضلاب جذبی نوساز همراه با کول‌گذاری بتنی و گلدان',
    category: 'حفر چاه',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&q=80&w=800',
    description: 'حفر اصولی میله و انباری چاه فاضلاب توسط مقنی‌های باتجربه و بیمه‌شده با استانداردهای ایمنی کامل و استحکام‌بخشی با کول‌های بتنی مقاوم.',
    highlights: [
      'مقنی حرفه‌ای و دارای بیمه حوادث',
      'کول‌گذاری بتنی ضد ریزش',
      'تعیین بهترین نقطه جذب خاک'
    ],
    location: 'شهرک بسیج ساوه'
  }
];

export const initialBookings: BookingRequest[] = [
  {
    id: 'req-101',
    fullName: 'رضا کمالی',
    phoneNumber: '09123456789',
    serviceType: 'لوله بازکنی فوری',
    neighborhood: 'خیابان مطهری',
    address: 'خیابان مطهری، کوچه نگار ۵، پلاک ۱۲',
    description: 'گرفتگی شدید لوله توالت ایرانی با آب‌گرفتگی',
    isUrgent: true,
    createdAt: 'امروز ۱۰:۲۵',
    status: 'dispatched'
  },
  {
    id: 'req-102',
    fullName: 'حسین احمدی',
    phoneNumber: '09187654321',
    serviceType: 'تخلیه چاه مکانیزه',
    neighborhood: 'شهرک فجر',
    address: 'شهرک فجر، فاز ۲، مجتمع آفتاب',
    description: 'چاه پر شده و نیاز به تانکر ۱۲۰۰۰ لیتری دارد',
    isUrgent: false,
    createdAt: 'امروز ۰۸:۴۰',
    status: 'pending'
  },
  {
    id: 'req-103',
    fullName: 'مهندس کاظمی',
    phoneNumber: '09351234567',
    serviceType: 'ایزوگام با تضمین',
    neighborhood: 'شهر صنعتی کاوه',
    address: 'سوله تولیدی شماره ۴',
    description: 'عایق‌کاری سقف سوله به مساحت ۴۰۰ متر',
    isUrgent: false,
    createdAt: 'دیروز ۱۶:۱۵',
    status: 'completed'
  }
];

export const initialFaqs = [
  {
    question: 'چقدر طول می‌کشد تا سرویس‌کار به محل ما در ساوه برسد؟',
    answer: 'به دلیل استقرار اکیپ‌های سیار دفتر خدماتی بهکار در مناطق مختلف ساوه (مرکز شهر، شهرک فجر، علوی و شهرک کاوه)، اعزام تکنسین بلافاصله و به‌صورت فوری پس از تماس شما انجام می‌شود.'
  },
  {
    question: 'آیا لوله بازکنی با دستگاه باعث شکستگی لوله‌ها یا کثیف‌کاری می‌شود؟',
    answer: 'خیر، ما از مدرن‌ترین ژنراتورهای برقی با قابلیت تنظیم دور موتور و فنرهای فولادی استاندارد استفاده می‌کنیم. فنرها بسیار نرم و انعطاف‌پذیر بوده و از زانوها عبور می‌کنند و برای توالت و آشپزخانه فنرهای کاملا مجزا و بهداشتی استفاده می‌شود.'
  },
  {
    question: 'آیا خدمات ایزوگام دارای ضمانت کتبی است؟',
    answer: 'بله، کلیه خدمات نصب ایزوگام دفتر بهکار با ایزوگام‌های درجه یک صادراتی انجام شده و همراه با ضمانت کتبی کیفیت، فاکتور معتبر و تست آب‌بندی به مشتری تحویل داده می‌شود.'
  },
  {
    question: 'تخلیه چاه با چه تانکرهایی انجام می‌شود و نحوه محاسبه هزینه چگونه است؟',
    answer: 'ما دارای تانکرهای بزرگ ۶۰۰۰ و ۱۲۰۰۰ لیتری مجهز به پمپ‌های ساکشن وکیوم قوی و پمپ‌های لجن‌کش ارتفاع‌زن هستیم. قیمت‌ها دقیقاً بر اساس نرخ مصوب اتحادیه و حجم تانکر تعیین می‌شود و کمترین قیمت در ساوه تضمین می‌گردد.'
  },
  {
    question: 'چگونه می‌توان با مدیریت دفتر خدماتی بهکار (آقای زمانی) تماس گرفت؟',
    answer: 'شما می‌توانید در تمامی ساعات شبانه‌روز (۲۴ ساعته و بدون تعطیلی) با شماره‌های مستقیم ۰۹۱۲۴۵۵۱۷۵۰ و ۰۹۱۹۶۵۶۲۰۰۶ تماس حاصل فرمایید یا از طریق دکمه تماس فوری در سایت اقدام نمایید.'
  }
];

export const initialCoupons: DiscountCoupon[] = [
  {
    id: 'coupon-1',
    code: 'SAVEH10',
    discountType: 'percentage',
    discountValue: 10,
    maxUses: 20,
    usedCount: 3,
    isActive: true,
    createdAt: '۱۴۰۵/۰۵/۲۶',
    description: 'تخفیف ۱۰٪ ویژه اهالی محترم ساوه'
  },
  {
    id: 'coupon-2',
    code: 'BEHKAR50',
    discountType: 'fixed',
    discountValue: 50000,
    maxUses: 10,
    usedCount: 1,
    isActive: true,
    createdAt: '۱۴۰۵/۰۵/۲۶',
    description: 'تخفیف ۵۰,۰۰۰ تومانی ثبت آنلاین سفارش'
  }
];
