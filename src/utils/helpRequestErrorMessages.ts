/**
 * Central map of backend response codes → Arabic messages.
 *
 * Used across Basma Fund (public, user, admin) to translate
 * backend `message` codes into user-facing Arabic strings.
 *
 * Priority chain:
 *   1. Exact code lookup
 *   2. Raw message lookup (if the message happens to be a code)
 *   3. If the raw string is already Arabic, keep it
 *   4. Generic Arabic fallback (never shows raw codes)
 */

// ============================================
// MASTER MAP — All backend codes → Arabic
// ============================================
export const BACKEND_MESSAGES: Record<string, string> = {
  // ============================================
  // HELP REQUEST — Verification / limits
  // ============================================
  verification_required: 'يجب توثيق هويتك أولاً لتقديم طلب مساعدة',
  max_active_requests_reached:
    'لقد وصلت إلى الحد الأقصى من الطلبات النشطة.',
  max_monthly_requests_reached:
    'لقد وصلت إلى الحد الأقصى للطلبات هذا الشهر. حاول مجدداً الشهر القادم.',

  // ============================================
  // HELP REQUEST — Video
  // ============================================
  invalid_video_duration: 'مدة الفيديو غير مطابقة للمطلوب.',
  duplicate_video: 'هذا الفيديو مستخدم مسبقاً في طلب آخر',

  // ============================================
  // HELP REQUEST — CRUD
  // ============================================
  help_request_not_found: 'الطلب غير موجود',
  not_found: 'العنصر غير موجود',
  help_request_submitted: 'تم استلام طلبك بنجاح',
  help_request_deleted: 'تم حذف الطلب بنجاح',
  help_request_store_failed: 'حدث خطأ أثناء رفع الطلب. حاول مرة أخرى.',
  delete_failed: 'حدث خطأ أثناء الحذف. حاول مرة أخرى.',

  // ============================================
  // HELP REQUEST — Delete window
  // ============================================
  delete_window_expired: 'انتهت مدة الحذف المتاحة (30 دقيقة)',
  cannot_delete_after_review:
    'لا يمكن الحذف بعد بدء المراجعة. تواصل مع الإدارة إن لزم الأمر.',

  // ============================================
  // HELP REQUEST — Admin actions
  // ============================================
  help_request_approved: 'تمت الموافقة على الطلب بنجاح',
  help_request_rejected: 'تم رفض الطلب بنجاح',
  help_request_archived: 'تمت أرشفة الطلب بنجاح',
  help_request_deleted_permanently: 'تم حذف الطلب نهائياً',
  help_request_restored: 'تم استرجاع الطلب بنجاح',
  already_processed: 'تمت معالجة الطلب مسبقاً',
  only_approved_can_be_archived: 'فقط الطلبات المنشورة يمكن أرشفتها',
  processing_failed: 'حدث خطأ أثناء المعالجة',

  // ============================================
  // HELP REQUEST — Encrypted data access
  // ============================================
  data_unlocked: 'تم فك تشفير البيانات بنجاح',
  encrypted_data_unlocked: 'تم فك تشفير البيانات بنجاح',
  invalid_access_reason: 'يرجى كتابة سبب صحيح (5-500 حرف)',

  // ============================================
  // INQUIRY — User side
  // ============================================
  inquiry_created: 'تم إرسال استفسارك بنجاح',
  inquiry_already_exists:
    'لديك استفسار سابق حول هذا الطلب خلال 24 ساعة',
  inquiry_not_found: 'الاستفسار غير موجود',
  tracking_code_not_found: 'كود التتبع غير صحيح',
  track_not_found: 'كود التتبع غير موجود',

  // ============================================
  // INQUIRY — Admin actions
  // ============================================
  inquiry_status_updated: 'تم تحديث حالة الاستفسار بنجاح',
  inquiry_note_added: 'تمت إضافة الملاحظة بنجاح',
  inquiry_note_updated: 'تم تحديث الملاحظة بنجاح',
  note_added: 'تمت إضافة الملاحظة بنجاح',
  note_updated: 'تم تحديث الملاحظة بنجاح',
  inquiry_contacted: 'تم التواصل مع المتبرع',
  inquiry_completed: 'تم إكمال الاستفسار بنجاح',
  inquiry_cancelled: 'تم إلغاء الاستفسار',
  update_failed: 'حدث خطأ أثناء التحديث',

  // ============================================
  // VIDEO TOKENS
  // ============================================
  token_generated: 'تم إنشاء رابط المشاهدة بنجاح',
  token_revoked: 'تم إلغاء الرابط بنجاح',
  already_revoked: 'الرابط ملغى مسبقاً',
  token_not_found: 'الرابط غير موجود',

  // Token error codes (from public streaming flow)
  TOKEN_NOT_FOUND: 'الرابط غير موجود',
  TOKEN_REVOKED: 'تم إلغاء هذا الرابط',
  TOKEN_EXPIRED: 'انتهت صلاحية هذا الرابط',
  TOKEN_EXHAUSTED: 'تم استخدام هذا الرابط بالكامل',
  TOKEN_IP_MISMATCH: 'لا يمكن فتح الفيديو من جهاز مختلف',
  STREAM_WITHOUT_START: 'يجب البدء بالمشاهدة أولاً',
  STREAM_WINDOW_EXPIRED: 'انتهت صلاحية جلسة المشاهدة',

  // Video file errors
  video_not_available: 'الفيديو غير متوفر',
  video_file_not_found: 'ملف الفيديو غير موجود',

  // ============================================
  // ACHIEVEMENTS — CRUD
  // ============================================
  achievement_created: 'تم إنشاء الإنجاز بنجاح',
  achievement_updated: 'تم تحديث الإنجاز بنجاح',
  achievement_deleted: 'تم حذف الإنجاز بنجاح',
  achievement_not_found: 'الإنجاز غير موجود',
  create_failed: 'حدث خطأ أثناء الإنشاء',
  achivment_created: 'تم إنشاء الإنجاز بنجاح',
  achivment_updated: 'تم تحديث الإنجاز بنجاح',
  achivment_deleted: 'تم حذف الإنجاز بنجاح',

  // Achievements — toggle
  featured_toggled: 'تم تحديث حالة التمييز',
  active_toggled: 'تم تحديث حالة الإنجاز',

  // ============================================
  // ACHIEVEMENTS — Validations
  // ============================================
  'The is active field must be true or false.':
    'قيمة "مفعّل" يجب أن تكون صحيحة أو خاطئة.',
  'The is_active field must be true or false.':
    'قيمة "مفعّل" يجب أن تكون صحيحة أو خاطئة.',
  'The is featured field must be true or false.':
    'قيمة "مميّز" يجب أن تكون صحيحة أو خاطئة.',
  'The is_featured field must be true or false.':
    'قيمة "مميّز" يجب أن تكون صحيحة أو خاطئة.',

  // ============================================
  // COMMUNITY POSTS  🆕
  // ============================================
  post_created: 'تم إنشاء المنشور بنجاح',
  post_updated: 'تم تحديث المنشور بنجاح',
  post_deleted: 'تم حذف المنشور بنجاح',
  post_not_found: 'المنشور غير موجود',
  post_approved: 'تمت الموافقة على المنشور',
  post_rejected: 'تم رفض المنشور',
  post_resolved: 'تم وضع علامة "تم الحل" على المنشور',
  post_already_processed: 'تمت معالجة المنشور مسبقاً',
  already_approved: 'تمت الموافقة على المنشور مسبقاً',
  already_rejected: 'تم رفض المنشور مسبقاً',
  only_pending_can_be_approved: 'فقط المنشورات المعلقة يمكن الموافقة عليها',
  only_pending_can_be_rejected: 'فقط المنشورات المعلقة يمكن رفضها',
  only_lost_found_can_be_resolved:
    'فقط منشورات المفقود/الموجود يمكن وضع علامة "تم الحل" عليها',
  community_post_limits_reached: 'لقد وصلت إلى الحد الأقصى من المنشورات',
  community_posts_limit_monthly:
    'لقد وصلت إلى الحد الشهري للمنشورات',
  community_posts_limit_active:
    'لقد وصلت إلى الحد الأقصى من المنشورات النشطة',

  // ============================================
  // VERIFICATION (KYC)
  // ============================================
  verification_submitted: 'تم رفع طلب التحقق بنجاح',
  verification_approved: 'تمت الموافقة على التحقق بنجاح',
  verification_rejected: 'تم رفض طلب التحقق',
  verification_request_not_found: 'طلب التحقق غير موجود',
  verification_already_processed: 'تمت معالجة طلب التحقق مسبقاً',
  verification_image_deleted: 'تم حذف صورة الهوية',
  duplicate_verification_request: 'لديك طلب تحقق قيد المراجعة',
  data_saved: 'تم حفظ البيانات بنجاح',
  invalid_document_type: 'نوع المستند غير صحيح',

  // ============================================
  // RATINGS
  // ============================================
  rating_created: 'تم إضافة التقييم بنجاح',
  rating_updated: 'تم تحديث التقييم بنجاح',
  rating_deleted: 'تم حذف التقييم بنجاح',
  rating_not_found: 'التقييم غير موجود',
  already_reviewed: 'لقد قمت بتقييم هذا المستخدم مسبقاً',
  rating_window_expired: 'انتهت مدة التعديل على التقييم (24 ساعة)',
  cannot_rate_self: 'لا يمكنك تقييم نفسك',

  // ============================================
  // REPORTS
  // ============================================
  report_created: 'تم إرسال البلاغ بنجاح',
  report_processed: 'تمت معالجة البلاغ',
  report_rejected: 'تم رفض البلاغ',
  report_not_found: 'البلاغ غير موجود',
  already_reported: 'لقد أبلغت عن هذا المحتوى مسبقاً',
  report_already_processed: 'تمت معالجة البلاغ مسبقاً',

  // ============================================
  // FEATURED REQUESTS (Announcements)
  // ============================================
  request_created: 'تم إرسال الطلب بنجاح',
  request_approved: 'تمت الموافقة على الطلب',
  request_rejected: 'تم رفض الطلب',
  request_deleted: 'تم حذف الطلب',
  request_not_found: 'الطلب غير موجود',
  request_already_processed: 'تمت معالجة الطلب مسبقاً',
  announcement_not_found: 'الإعلان غير موجود',
  announcement_not_eligible: 'الإعلان غير مؤهل للتمييز',
  already_featured: 'الإعلان مميز بالفعل',
  already_has_pending_request: 'لديك طلب تمييز قيد المراجعة',

  // ============================================
  // USERS (Admin)
  // ============================================
  user_suspended: 'تم تعليق الحساب بنجاح',
  user_blocked: 'تم حظر الحساب بنجاح',
  user_restored: 'تم استرجاع الحساب بنجاح',
  user_not_found: 'المستخدم غير موجود',
  user_warned: 'تم إرسال التحذير بنجاح',
  user_already_suspended: 'الحساب معلق مسبقاً',
  user_already_blocked: 'الحساب محظور مسبقاً',
  cannot_suspend_admin: 'لا يمكن تعليق حساب مشرف',

  // ============================================
  // NOTIFICATIONS
  // ============================================
  notification_not_found: 'الإشعار غير موجود',
  notifications_read: 'تم تعليم الإشعارات كمقروءة',
  notification_read: 'تم تعليم الإشعار كمقروء',
  notifications_deleted: 'تم حذف الإشعارات',
  notification_deleted: 'تم حذف الإشعار',

  // ============================================
  // PROFILE
  // ============================================
  profile_updated: 'تم تحديث الملف الشخصي بنجاح',
  password_changed: 'تم تغيير كلمة المرور بنجاح',
  image_uploaded: 'تم تحديث الصورة الشخصية بنجاح',
  whatsapp_already_used: 'رقم واتساب مستخدم بالفعل',
  invalid_whatsapp: 'رقم واتساب غير صحيح',
  invalid_current_password: 'كلمة المرور الحالية غير صحيحة',

  // ============================================
  // AUTH
  // ============================================
  login_success: 'مرحباً بعودتك',
  logout_success: 'تم تسجيل الخروج بنجاح',
  register_success: 'تم إنشاء حسابك بنجاح',
  email_verified: 'تم تفعيل حسابك بنجاح',
  password_reset_sent: 'تم إرسال رابط إعادة تعيين كلمة المرور',
  password_reset_success: 'تم تحديث كلمة المرور بنجاح',
  verification_email_sent: 'تم إرسال رابط التفعيل',
  invalid_credentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  email_not_verified: 'يرجى تفعيل بريدك الإلكتروني أولاً',
  email_already_used: 'البريد الإلكتروني مستخدم بالفعل',

  // ============================================
  // ANNOUNCEMENTS
  // ============================================
  announcement_created: 'تم نشر الإعلان بنجاح',
  announcement_updated: 'تم تحديث الإعلان بنجاح',
  announcement_deleted: 'تم حذف الإعلان بنجاح',
  announcement_disabled: 'تم تعطيل الإعلان',
  announcement_enabled: 'تم تفعيل الإعلان',
  announcement_completed: 'تم إكمال الإعلان',
  announcement_reopened: 'تم إعادة فتح الإعلان',
  monthly_limit_reached:
    'لقد وصلت إلى الحد الأقصى للإعلانات هذا الشهر',
  high_risk_requires_verification:
    'هذه الفئة تتطلب توثيق الهوية',

  // ============================================
  // GENERIC
  // ============================================
  successfully_updated: 'تم التحديث بنجاح',
  successfully_created: 'تم الإنشاء بنجاح',
  successfully_deleted: 'تم الحذف بنجاح',
  unauthorized: 'غير مصرح لك بهذا الإجراء',
  forbidden: 'ليس لديك صلاحية لهذا الإجراء',
  server_error: 'حدث خطأ في الخادم. حاول مرة أخرى.',
  validation_failed: 'يرجى تصحيح البيانات المُدخلة',

  // ============================================
  // GENERIC fallback
  // ============================================
  unknown: 'حدث خطأ غير متوقع. حاول مرة أخرى.',
};

// ============================================
// Legacy alias (backward compat)
// ============================================
export const HELP_REQUEST_ERROR_MESSAGES = BACKEND_MESSAGES;

// ============================================
// Main translate function
// ============================================
export const translateBackendMessage = (
  rawMessage: string | undefined,
  code?: string | undefined
): string => {
  // 1. Code lookup
  if (code && BACKEND_MESSAGES[code]) {
    return BACKEND_MESSAGES[code];
  }

  // 2. Raw message lookup
  if (rawMessage && BACKEND_MESSAGES[rawMessage]) {
    return BACKEND_MESSAGES[rawMessage];
  }

  // 3. Already Arabic → keep it
  if (rawMessage && /[\u0600-\u06FF]/.test(rawMessage)) {
    return rawMessage;
  }

  // 4. Fallback
  return BACKEND_MESSAGES.unknown;
};

// ============================================
// Backward-compatible aliases
// ============================================
export const translateHelpRequestError = translateBackendMessage;

export const translateFieldErrors = (
  errors?: Record<string, string[] | string> | null
): Record<string, string[]> => {
  if (!errors) return {};

  const result: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(errors)) {
    const messages = Array.isArray(value) ? value : [value];
    result[key] = messages.map((msg) =>
      translateBackendMessage(
        typeof msg === 'string' ? msg : undefined,
        typeof msg === 'string' ? msg : undefined
      )
    );
  }

  return result;
};

export const HELP_REQUEST_SUCCESS_MESSAGES: Record<string, string> = {
  help_request_submitted: 'تم استلام طلبك وسيتم مراجعته قريباً',
  help_request_deleted: 'تم حذف الطلب بنجاح',
};

export default {
  BACKEND_MESSAGES,
  HELP_REQUEST_ERROR_MESSAGES,
  translateBackendMessage,
  translateHelpRequestError,
  translateFieldErrors,
  HELP_REQUEST_SUCCESS_MESSAGES,
};