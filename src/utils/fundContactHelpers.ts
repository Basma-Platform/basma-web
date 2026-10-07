// ============================================
// BASMA FUND CONTACT FALLBACKS
// ============================================

/**
 * Fallback values shown if the /donations/contact API fails.
 * These are replaced with live values on successful fetch.
 */
export const FUND_CONTACT_FALLBACK = {
  whatsapp: '+970599000000',
  email: 'donations@basma.ps',
  phone: '',
  working_hours: 'السبت - الخميس، 9:00 ص - 6:00 م',
} as const;

// ============================================
// SHARED COPY (Arabic strings)
// ============================================

export const FUND_COPY = {
  // Public
  hero_title: 'صندوق بصمة',
  hero_subtitle:
    'معاً نُعيد الأمل — منصة آمنة وموثوقة لمساعدة المحتاجين في غزة',
  hero_cta: 'تصفح طلبات المساعدة',
  hero_cta_secondary: 'تعرف على الإنجازات',

  privacy_title: 'لماذا تثق بنا؟',
  privacy_points: [
    'هوية صاحب الطلب محفوظة تماماً',
    'الفيديو متاح بعد الاستفسار فقط',
    'التواصل يتم عبر المنصة',
    'بيانات حساسة مشفّرة بالكامل',
  ],

  inquiries_only_notice:
    '🔒 الفيديو الكامل متاح بعد تقديم استفسار التبرع',

  // Inquiry
  inquiry_button: 'أريد التبرع',
  inquiry_title: 'استفسار تبرع',
  inquiry_subtitle:
    'سجّل استفسارك وسنعطيك رابط مشاهدة الفيديو (مرة واحدة فقط) + طرق التواصل مع المنصة.',

  // Video
  video_page_title: 'مشاهدة الفيديو',
  video_page_subtitle: 'يرجى المشاهدة بعناية — لديك فرصة واحدة فقط',

  // Tracking
  tracking_title: 'تتبع استفسارك',
  tracking_hint: 'أدخل كود التتبع (مثل: DON-A1B2C3)',
} as const;