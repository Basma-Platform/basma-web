// ============================================
// SPRINT 01 - Base Types
// ============================================

export interface Governorate {
  id: number;
  name: string;
}

export interface City {
  id: number;
  governorate_id: number;
  name: string;
}

export interface AnnouncementImage {
  id: number;
  announcement_id: number;
  image_path: string;
  order: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

// ============================================
// SPRINT 02 - Auth Types
// ============================================

export type UserRole = 'user' | 'admin';

// ============================================
// SPRINT 04 — Account Status & Warnings
// ============================================

export type WarningLevel =
  | 'clean'
  | 'warning'
  | 'last_warning'
  | 'critical';

export interface UserWarningStatus {
  level: WarningLevel;
  message: string | null;
}

export interface UserWarnings {
  count: number;
  threshold: number;
  remaining: number;
  status: UserWarningStatus;
}

/**
 * Error codes returned by backend on login when account is not usable.
 * - ACCOUNT_SUSPENDED: temporary (has suspended_until + days_remaining)
 * - ACCOUNT_BLOCKED: permanent
 */
export type AccountErrorCode = 'ACCOUNT_SUSPENDED' | 'ACCOUNT_BLOCKED';

export interface LoginErrorResponse {
  message: string;
  error_code?: AccountErrorCode;
  suspended_until?: string;
  days_remaining?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  governorate_id: number;
  city_id: number;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  profile_image: string | null;
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  governorate?: Governorate;
  city?: City;
  // Sprint 04 — Moderation
  warnings?: UserWarnings;
  suspended_until?: string | null;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  whatsapp: string;
  governorate_id: number;
  city_id: number;
  terms_accepted: boolean;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyEmailPayload {
  id: number | string;
  hash: string;
  expires?: string;
  signature?: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (data: RegisterPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (data: VerifyEmailPayload) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordPayload) => Promise<void>;
  updateUser: (
    userOrUpdater: User | ((prev: User | null) => User | null)
  ) => void;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ============================================
// SPRINT 05 — Categories (replaces SubCategory)
// ============================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  is_high_risk: boolean;
  display_order: number;
  image_url: string | null;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
}

// ============================================
// SPRINT 05 — Announcement Types (v2)
// ============================================

export type AnnouncementType = 'offer' | 'request';

/** ✅ 'free' has been removed — only paid and barter */
export type AnnouncementPriceType = 'paid' | 'barter';

export type AnnouncementPrivacyType =
  | 'public'
  | 'verified_only'
  | 'region_only'
  | 'verified_region';

/** ✅ 'completed' added */
export type AnnouncementStatus =
  | 'active'
  | 'disabled'
  | 'completed'
  | 'deleted';

export interface UserContext {
  is_authenticated: boolean;
  is_verified: boolean;
  is_admin: boolean;
  city_id: number | null;
  city_name: string | null;
  governorate_id: number | null;
  role: 'guest' | 'user' | 'admin';
  liked_announcement_ids: number[];
  available_filters: {
    governorate_id: boolean;
    city_id: boolean;
    category_id: boolean;
    type: boolean;
    payment_type: boolean;
    search: boolean;
    sort: boolean;
    privacy_type: boolean;
    status: boolean;
  };
}

export interface FiltersResponse {
  success: boolean;
  data: {
    types: { value: string; label: string }[];
    payment_types: { value: string; label: string }[];
    privacy_types: { value: string; label: string; available: boolean }[];
    categories: Category[];
    sort_options: { value: string; label: string }[];
  };
  user_context: UserContext;
}

export interface AnnouncementUser {
  id: number;
  name: string;
  is_verified: boolean;
  profile_image: string | null;
  created_at?: string;
  average_rating?: number;
  total_ratings?: number;
}

export interface AnnouncementUserAdmin extends AnnouncementUser {
  email: string;
  whatsapp: string;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LikeResponse {
  message: string;
  liked: boolean;
  likes_count: number;
}

export interface Announcement {
  id: number;
  user_id: number;
  type: AnnouncementType;

  /** ✅ Flat category (replaces category + sub_category) */
  category_id: number;
  category: Category | null;

  title: string;
  description: string;

  /** ✅ Only 'paid' | 'barter' */
  price_type: AnnouncementPriceType;
  price: number | null;
  is_negotiable: boolean;

  /** 🆕 Barter-specific */
  barter_offered: string | null;
  barter_requested: string | null;

  governorate_id: number;
  city_id: number;
  whatsapp: string;
  whatsapp_visible: boolean;
  privacy_type: AnnouncementPrivacyType;

  status: AnnouncementStatus;
  is_disabled: boolean;
  is_completed: boolean;
  completed_at: string | null;
  disabled_at: string | null;
  disable_reason: string | null;

  views: number;
  likes_count: number;
  is_liked_by_user: boolean;

  pinned_at: string | null;
  is_featured: boolean;
  featured_until: string | null;
  featured_at: string | null;
  featured_request_status?: 'pending' | 'approved' | 'rejected' | null;
  is_currently_featured: boolean;

  images: AnnouncementImage[];
  governorate?: Governorate;
  city?: City;
  user?: AnnouncementUser | AnnouncementUserAdmin;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deleted_by: number | null;
  deleted_reason: string | null;
}

export interface AnnouncementsResponse {
  data: Announcement[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
  };
  filters: {
    categories: Category[];
  };
  user_context: UserContext;
}

// ============================================
// SPRINT 05 — Featured Announcements (3 modes)
// ============================================

/**
 * Mode 1 & Mode 3 → { data: Announcement[] }
 * Mode 2 (split) → { data: { offers, requests } }
 */

// Response for Mode 1 & Mode 3
export interface FeaturedAnnouncementsUnifiedResponse {
  data: Announcement[];
  meta: {
    total: number;
    type: 'all' | 'offer' | 'request';
  };
  user_context: {
    is_authenticated: boolean;
    is_verified: boolean;
  };
}

// Response for Mode 2 (split)
export interface FeaturedAnnouncementsSplitResponse {
  data: {
    offers: Announcement[];
    requests: Announcement[];
  };
  meta: {
    total_offers: number;
    total_requests: number;
    limit_per_type: number;
  };
  user_context: {
    is_authenticated: boolean;
    is_verified: boolean;
  };
}

// Union (backward-compatible)
export type FeaturedAnnouncementsResponse =
  | FeaturedAnnouncementsUnifiedResponse
  | FeaturedAnnouncementsSplitResponse;

// ============================================
// Sprint 03 - Verification & Profile Types
// ============================================

export interface VerificationRequest {
  id: number;
  user_id: number;
  id_image: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  reviewed_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileResponse {
  user: User;
  stats: {
    announcements_count: number;
    active_announcements: number;
    disabled_announcements: number;
    completed_announcements: number;
    deleted_announcements: number;
    monthly_limit: number;
    monthly_used: number;
    monthly_remaining: number;
    can_create_more: boolean;
    is_verified: boolean;
  };
  verification_status: {
    status: 'pending' | 'approved' | 'rejected' | null;
    request_date: string | null;
    review_date: string | null;
    rejection_reason: string | null;
  } | null;
}

export interface MyAnnouncementsResponse {
  data: Announcement[];
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  stats: {
    total: number;
    active: number;
    disabled: number;
    completed: number;
    deleted: number;
    monthly_limit: number;
    monthly_used: number;
    monthly_remaining: number;
  };
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface LocationItem {
  id: number;
  name: string;
}

export interface DashboardUser {
  id: number;
  name: string;
  email: string;
  whatsapp?: string | null;
  governorate?: LocationItem | null;
  city?: LocationItem | null;
  is_verified: boolean;
  profile_image?: string | null;
  created_at: string;
  email_verified_at?: string | null;
}

export interface DashboardStats {
  announcements_count: number;
  completed_count: number;
  total_views: number;
  total_likes_received: number;
  average_rating: number;
  featured_count: number;
  monthly_limit: number | null;
  monthly_used: number;
  monthly_remaining: number | null;
  can_create_more: boolean;
}

export interface DashboardVerification {
  is_verified: boolean;
  status: 'pending' | 'approved' | 'rejected' | null;
  request_date: string | null;
  rejection_reason: string | null;
}

export interface DashboardCharts {
  weekly_announcements: {
    labels: string[];
    data: number[];
  };
  weekly_views: {
    labels: string[];
    data: number[];
  };
}

export interface DashboardRecentAnnouncement {
  id: number;
  title: string;
  price_type: AnnouncementPriceType;
  price: number | null;
  is_negotiable: boolean;
  barter_offered: string | null;
  barter_requested: string | null;
  status: AnnouncementStatus;
  is_disabled: boolean;
  is_completed: boolean;
  views: number;
  likes_count: number;
  created_at: string;
  cover_image: string | null;
  category: {
    id: number;
    name: string;
    is_high_risk: boolean;
  } | null;
  is_featured: boolean;
  featured_until: string | null;
  featured_request_status: 'pending' | 'approved' | 'rejected' | null;
}

export interface DashboardQuickActions {
  can_create: boolean;
  can_verify: boolean;
  profile_path: string;
  create_path: string;
  my_announcements_path: string;
  verify_path: string;
}

export interface DashboardResponse {
  user: DashboardUser;
  stats: DashboardStats;
  verification: DashboardVerification;
  charts: DashboardCharts;
  recent_announcements: DashboardRecentAnnouncement[];
  recent_notifications: Notification[];
  unread_notifications_count: number;
  quick_actions: DashboardQuickActions;
}

// ============================================
// USER PROFILE TYPES
// ============================================

export interface ProfileStats {
  announcements_count: number;
  completed_count: number;
  total_views: number;
  total_likes_received: number;
  average_rating: number;
  featured_count: number;
  monthly_limit: number;
  monthly_used: number;
  monthly_remaining: number;
  can_create_more: boolean;
}

export interface ProfileVerificationStatus {
  is_verified: boolean;
  status: 'pending' | 'approved' | 'rejected' | null;
  request_date: string | null;
  review_date: string | null;
  rejection_reason: string | null;
}

export interface ProfileStatsResponse {
  stats: ProfileStats;
  verification_status: ProfileVerificationStatus;
}

export interface UpdateProfilePayload {
  name: string;
  whatsapp: string;
  governorate_id: number;
  city_id: number;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface UploadProfileImageResponse {
  message: string;
  profile_image: string;
  user: User;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
  verification_invalidated?: boolean;
}

export interface ChangePasswordResponse {
  message: string;
}

// ============================================
// ADMIN PROFILE TYPES
// ============================================

export interface AdminStats {
  users_count: number;
  announcements_count: number;
  pending_reports_count: number;
  pending_verifications_count: number;
  featured_announcements_count: number;
  total_views: number;
  total_likes: number;
  average_rating: number;
}

export interface AdminActivity {
  today_users: number;
  today_announcements: number;
  today_reports: number;
  today_verifications: number;
}

export interface AdminStatsResponse {
  stats: AdminStats;
  activity: AdminActivity;
}

export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  profile_image: string | null;
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateAdminProfilePayload {
  name: string;
}

export interface UpdateAdminProfileResponse {
  message: string;
  user: AdminProfile;
}

export interface UploadAdminImageResponse {
  message: string;
  profile_image: string;
  user: AdminProfile;
}

// ============================================
// USER ANNOUNCEMENT MANAGEMENT TYPES
// ============================================

export interface UserAnnouncementStats {
  total: number;
  active: number;
  disabled: number;
  completed: number;
  featured: number;
  monthly_limit: number | null;
  monthly_used: number;
  monthly_remaining: number | null;
  can_create_more: boolean;
  is_verified: boolean;
}

export interface UserAnnouncementsResponse {
  data: Announcement[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  stats: UserAnnouncementStats;
}

export interface UserAnnouncementDetailResponse {
  id: number;
  title: string;
  description: string;
  type: AnnouncementType;

  category_id: number;
  category: {
    id: number;
    name: string;
    is_high_risk: boolean;
  } | null;

  price_type: AnnouncementPriceType;
  price: number | null;
  is_negotiable: boolean;
  barter_offered: string | null;
  barter_requested: string | null;

  governorate: { id: number; name: string };
  city: { id: number; name: string };
  whatsapp: string;
  privacy_type: AnnouncementPrivacyType;

  status: AnnouncementStatus;
  is_disabled: boolean;
  disabled_at: string | null;
  disable_reason: string | null;
  is_completed: boolean;
  completed_at: string | null;

  views: number;
  likes_count: number;
  images: AnnouncementImage[];

  is_featured: boolean;
  featured_until: string | null;
  is_currently_featured: boolean;
  featured_request_status: 'pending' | 'approved' | 'rejected' | null;

  can_edit: boolean;
  can_delete: boolean;
  can_disable: boolean;
  can_feature: boolean;
  can_reenable: boolean;
  can_complete: boolean;
  can_reopen: boolean;

  monthly_limit_info: {
    monthly_limit: number | null;
    monthly_used: number;
    monthly_remaining: number | null;
  } | null;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateAnnouncementResponse {
  message: string;
  announcement: {
    id: number;
    title: string;
    status: AnnouncementStatus;
    created_at: string;
  };
  monthly_limit_info: {
    monthly_limit: number | null;
    monthly_used: number;
    monthly_remaining: number | null;
    can_create_more: boolean;
    is_verified: boolean;
  };
  suggestion: {
    message: string;
    feature_url: string;
    feature_benefits: string[];
  };
}

export interface DeleteAnnouncementResponse {
  message: string;
  deletion_info: {
    deleted_at: string;
    permanent_deletion_at: string;
    days_remaining: number;
  };
}

export interface DisableAnnouncementResponse {
  message: string;
  announcement: {
    id: number;
    status: AnnouncementStatus;
    disabled_at: string;
    auto_delete_at: string;
  };
  info: {
    message: string;
  };
}

// ============================================
// FEATURED TYPES
// ============================================

export interface FeaturedPricing {
  duration_days: number;
  duration_label: string;
  price: number;
  currency: string;
}

export interface PlatformPaymentMethod {
  id: number;
  method_type: 'palpay' | 'jawwal_pay' | 'bop';
  method_label: string;
  account_name: string;
  account_number: string;
  instructions: string | null;
}

export interface FeaturedRequestPayload {
  duration_days: number;
  payment_method: 'palpay' | 'jawwal_pay' | 'bop';
  transfer_image: File;
  additional_notes?: string;
}

export interface FeaturedRequest {
  id: number;
  announcement_id: number;
  announcement?: {
    id: number;
    title: string;
    cover_image: string | null;
  };
  status: 'pending' | 'approved' | 'rejected';
  status_label: string;
  duration_days: number;
  duration_label: string;
  amount: number;
  currency: string;
  payment_method: 'palpay' | 'jawwal_pay' | 'bop';
  payment_method_label: string;
  additional_notes: string | null;
  admin_notes: string | null;
  reviewed_at: string | null;
  reviewer?: { id: number; name: string } | null;
  created_at: string;
  updated_at: string;
}

export interface FeaturedStatusResponse {
  is_featured: boolean;
  featured_until: string | null;
  featured_at: string | null;
  has_pending_request: boolean;
  latest_request: {
    id: number;
    status: 'pending' | 'approved' | 'rejected';
    status_label: string;
    duration_days: number;
    duration_label: string;
    amount: number;
    currency: string;
    payment_method: string;
    payment_method_label: string;
    additional_notes: string | null;
    admin_notes: string | null;
    created_at: string;
    reviewed_at: string | null;
  } | null;
  can_request: boolean;
  reason: string | null;
  reason_label: string | null;
}

export interface RequestFeaturedResponse {
  message: string;
  request: FeaturedRequest;
  next_steps: {
    message: string;
    working_hours: string;
  };
}

export interface FeaturedRequestsHistoryResponse {
  data: FeaturedRequest[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export type NotificationType =
  // Sprint 03 — Featured
  | 'featured_request_received_user'
  | 'featured_request_received_admin'
  | 'featured_request_approved'
  | 'featured_request_rejected'
  | 'announcement_auto_deleted'
  | 'announcement_permanently_deleted'
  // Sprint 04 — Verification (KYC)
  | 'verification_submitted_user'
  | 'verification_submitted_admin'
  | 'verification_approved'
  | 'verification_rejected'
  | 'verification_image_deleted'
  // Sprint 04 — Ratings
  | 'rating_received'
  | 'rating_updated'
  // Sprint 04 — Reports
  | 'new_report_received'
  | 'report_processed'
  | 'report_action_taken'
  // Sprint 05 — Announcements
  | 'announcement_completed'
  | 'announcement_reopened'
  // Sprint 06 — Basma Fund (صندوق بصمة)
  | 'help_request_submitted_user'
  | 'help_request_submitted_admin'
  | 'help_request_approved'
  | 'help_request_rejected'
  | 'donation_inquiry_received'
  | 'donation_inquiry_status_changed'
  | 'video_access_granted'
  | 'suspicious_video_access'
  // Fallback
  | 'general';

export interface NotificationMetadata {
  // Featured
  request_id?: number;
  amount?: number;
  currency?: string;
  duration_days?: number;
  payment_method?: string;
  featured_until?: string;
  rejection_reason?: string | null;
  deleted_at?: string;
  // Verification
  verification_request_id?: number;
  // Ratings
  rating_id?: number;
  rater_id?: number;
  rater_name?: string;
  rating?: number;
  comment?: string | null;
  // Reports
  report_id?: number;
  target_type?: 'user' | 'announcement';
  priority?: 'low' | 'medium' | 'high';
  action_taken?: string;
  admin_notes?: string;
  // Basma Fund
  help_request_id?: number;
  public_title?: string;
  inquiry_id?: number;
  tracking_code?: string;
  donor_name?: string | null;
  token_id?: number;
  bound_ip?: string;
  current_ip?: string;
  // Generic
  announcement_id?: number;
  announcement_title?: string;
  user_id?: number;
  user_name?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string | null;
  metadata: NotificationMetadata;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface NotificationsResponse {
  data: Notification[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  unread_count: number;
}

export interface NotificationUnreadCountResponse {
  count: number;
}

export interface MarkNotificationResponse {
  message: string;
  unread_count: number;
}

// ============================================
// FORM TYPES (Updated for Sprint 05)
// ============================================

export interface AnnouncementFormData {
  type: AnnouncementType;
  category_id: number | '';
  title: string;
  description: string;
  price_type: AnnouncementPriceType;
  price: number | '';
  is_negotiable: boolean;
  barter_offered: string;
  barter_requested: string;
  governorate_id: number | '';
  city_id: number | '';
  whatsapp: string;
  privacy_type: AnnouncementPrivacyType;
}

export interface AnnouncementFormErrors {
  type?: string;
  category_id?: string;
  title?: string;
  description?: string;
  price_type?: string;
  price?: string;
  barter_offered?: string;
  barter_requested?: string;
  governorate_id?: string;
  city_id?: string;
  whatsapp?: string;
  privacy_type?: string;
  images?: string;
}

// ============================================
// SPRINT 04 - Verification (KYC) Types
// ============================================

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type DocumentType =
  | 'national_id'
  | 'passport'
  | 'driver_license'
  | 'university_card'
  | 'other';

export interface DocumentTypeOption {
  value: DocumentType;
  label: string;
}

export interface DocumentTypeRequirement {
  must_show: string[];
  optional_show?: string[];
  warning?: string;
}

export interface VerificationRequirements {
  why_we_need_it: string[];
  how_we_protect_it: string[];
  deletion_policy: string[];
  image_requirements: string[];
  document_types: DocumentTypeOption[];
  document_requirements: Record<DocumentType, DocumentTypeRequirement>;
  max_file_size_mb: number;
  accepted_formats: string[];
}

export interface VerificationStatusResponse {
  is_verified: boolean;
  status: VerificationStatus | null;
  document_type: DocumentType | null;
  document_type_label: string | null;
  request_date: string | null;
  review_date: string | null;
  rejection_reason: string | null;
  can_upload: boolean;
  can_reupload: boolean;
}

export interface UploadIdResponse {
  message: string;
  request: {
    id: number;
    status: VerificationStatus;
    document_type: DocumentType;
    document_type_label: string;
    created_at: string;
  };
  warning?: {
    title: string;
    message: string;
    previous_rejection_reason: string;
    previous_rejected_at: string;
  };
}

export type AdminVerificationFilter =
  | 'all'
  | 'pending'
  | 'approved'
  | 'rejected';

export interface AdminVerificationRequest {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    whatsapp: string;
    profile_image: string | null;
    is_verified: boolean;
  };
  document_type: DocumentType;
  document_type_label: string;
  has_image: boolean;
  status: VerificationStatus;
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface ExtractedData {
  full_name: string;
  id_number: string;
  date_of_birth: string | null;
  expiry_date: string | null;
}

export interface VerificationAccessLog {
  id: number;
  admin: {
    id: number;
    name: string;
  } | null;
  reason: string | null;
  accessed_at: string;
}

export interface AdminVerificationDetail {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    whatsapp: string;
    profile_image: string | null;
    is_verified: boolean;
    governorate: { id: number; name: string } | null;
    city: { id: number; name: string } | null;
    created_at: string;
  };
  document_type: DocumentType;
  document_type_label: string;
  has_image: boolean;
  image_deleted_at: string | null;
  auto_delete_at: string | null;
  status: VerificationStatus;
  admin_notes: string | null;
  extracted_data: ExtractedData | null;
  extracted_by: { id: number; name: string } | null;
  extracted_at: string | null;
  reviewed_by: { id: number; name: string } | null;
  reviewed_at: string | null;
  access_logs: VerificationAccessLog[];
  created_at: string;
  updated_at: string;
}

export interface AdminVerificationsListResponse {
  data: AdminVerificationRequest[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
}

export interface VerificationActionPayload {
  admin_notes?: string;
}

export interface ExtractDataPayload {
  full_name: string;
  id_number: string;
  date_of_birth?: string;
  expiry_date?: string;
}

export interface ExtractDataResponse {
  message: string;
  request: AdminVerificationDetail;
}

// ============================================
// SPRINT 04 - Rating Types
// ============================================

export interface RatingUser {
  id: number;
  name: string;
  is_verified: boolean;
  profile_image: string | null;
}

export interface RatingAnnouncement {
  id: number;
  title: string;
}

export interface Rating {
  id: number;
  rating: number;
  comment: string | null;
  rater: RatingUser;
  rated?: RatingUser;
  announcement?: RatingAnnouncement;
  created_at: string;
  updated_at: string;
  can_edit?: boolean;
  can_delete?: boolean;
  edit_deadline?: string;
}

export type ReviewBlockReason = 'own_announcement' | 'already_reviewed' | null;

export interface ExistingRatingInfo {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  can_edit: boolean;
  can_delete: boolean;
  edit_deadline: string;
}

export interface ReviewStatusResponse {
  can_review: boolean;
  reason: ReviewBlockReason;
  reason_label: string | null;
  existing_rating?: ExistingRatingInfo;
  owner: RatingUser;
}

export interface CreateRatingPayload {
  rated_id: number;
  announcement_id: number;
  rating: number;
  comment?: string;
}

export interface UpdateRatingPayload {
  rating?: number;
  comment?: string;
}

export interface RatingDistribution {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
}

export interface UserRatingSummary {
  average_rating: number;
  total_ratings: number;
  rating_distribution: RatingDistribution;
}

export interface UserRatingsResponse {
  summary: UserRatingSummary;
  data: Rating[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export interface PublicUserProfile {
  id: number;
  name: string;
  profile_image: string | null;
  is_verified: boolean;
  is_active: boolean;
  governorate?: { id: number; name: string } | null;
  city?: { id: number; name: string } | null;
  whatsapp: string | null;
  whatsapp_visible: boolean;
  created_at: string;
}

export interface MyRatingStats {
  average_rating: number;
  total_received: number;
  total_given: number;
  ratings_with_comments_received: number;
  rating_distribution: RatingDistribution;
}

export interface MyReviewsListResponse {
  data: Rating[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export interface AdminRatingStats {
  total_ratings: number;
  average_rating: number;
  ratings_with_comments: number;
  distribution: RatingDistribution;
}

export interface AdminRatingsListResponse {
  data: Rating[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

// ============================================
// SPRINT 04 - Featured Requests (Admin + User Detail)
// ============================================

export type FeaturedRequestStatus = 'pending' | 'approved' | 'rejected';

export interface UserFeaturedRequestDetail {
  id: number;
  announcement: {
    id: number;
    title: string;
    cover_image: string | null;
    status: AnnouncementStatus;
    is_currently_featured: boolean;
    featured_until: string | null;
  } | null;
  status: FeaturedRequestStatus;
  status_label: string;
  duration_days: number;
  duration_label: string;
  amount: number;
  currency: string;
  payment_method: 'palpay' | 'jawwal_pay' | 'bop';
  payment_method_label: string;
  transfer_image: string;
  additional_notes: string | null;
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminFeaturedRequestListItem {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    whatsapp: string;
    is_verified: boolean;
    profile_image: string | null;
  };
  announcement: {
    id: number;
    title: string;
    cover_image: string | null;
    status: AnnouncementStatus;
  } | null;
  status: FeaturedRequestStatus;
  status_label: string;
  duration_days: number;
  duration_label: string;
  amount: number;
  currency: string;
  payment_method: 'palpay' | 'jawwal_pay' | 'bop';
  payment_method_label: string;
  created_at: string;
  reviewed_at: string | null;
}

export interface AdminFeaturedStats {
  requests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  revenue: {
    total: number;
    this_month: number;
    currency: string;
  };
  today: {
    new_requests: number;
    reviewed: number;
  };
}

export interface AdminFeaturedListResponse {
  data: AdminFeaturedRequestListItem[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  stats: AdminFeaturedStats;
}

export interface AdminFeaturedDetail {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    whatsapp: string;
    is_verified: boolean;
    profile_image: string | null;
    created_at: string;
  };
  announcement: {
    id: number;
    title: string;
    description: string;
    status: AnnouncementStatus;
    is_featured: boolean;
    featured_until: string | null;
    images: Array<{ id: number; image_path: string; order: number }>;
  } | null;
  status: FeaturedRequestStatus;
  status_label: string;
  duration_days: number;
  duration_label: string;
  amount: number;
  currency: string;
  payment_method: 'palpay' | 'jawwal_pay' | 'bop';
  payment_method_label: string;
  transfer_image: string;
  additional_notes: string | null;
  admin_notes: string | null;
  reviewed_by: { id: number; name: string } | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminFeaturedApprovePayload {
  admin_notes?: string;
}

export interface AdminFeaturedRejectPayload {
  admin_notes: string;
}

export interface AdminFeaturedDeletePayload {
  reason?: string;
}

// ============================================
// SPRINT 04 - Reports System
// ============================================

export type ReportTargetType = 'user' | 'announcement';
export type ReportStatus = 'pending' | 'reviewed' | 'rejected';
export type ReportPriority = 'low' | 'medium' | 'high';

export type ReportAction =
  | 'warn_user'
  | 'suspend_user'
  | 'block_user'
  | 'delete_content'
  | 'reject_report';

export type ReportActionTaken =
  | 'warned'
  | 'suspended'
  | 'blocked'
  | 'deleted_content'
  | 'rejected';

export interface ReportReason {
  value: string;
  label: string;
  priority: ReportPriority;
}

export interface ReportReasonsResponse {
  target_type: ReportTargetType;
  target_type_label: string;
  reasons: ReportReason[];
}

export interface CreateReportPayload {
  target_type: ReportTargetType;
  reported_user_id?: number;
  announcement_id?: number;
  reason: string;
  description?: string;
}

export interface Report {
  id: number;
  target_type: ReportTargetType;
  target_type_label: string;
  reason: string;
  reason_label: string;
  description: string | null;
  status: ReportStatus;
  status_label: string;
  priority: ReportPriority;
  priority_label: string;
  created_at: string;
}

export interface CreateReportResponse {
  message: string;
  report: Report;
}

export interface AdminReportListItem {
  id: number;
  target_type: ReportTargetType;
  target_type_label: string;
  reporter: { id: number; name: string };
  reported_user: { id: number; name: string } | null;
  announcement: { id: number; title: string } | null;
  reason: string;
  reason_label: string;
  priority: ReportPriority;
  priority_label: string;
  status: ReportStatus;
  status_label: string;
  created_at: string;
}

export interface AdminReportDetail {
  id: number;
  target_type: ReportTargetType;
  target_type_label: string;

  reporter: {
    id: number;
    name: string;
    email: string;
    whatsapp: string;
    profile_image: string | null;
  };

  reported_user: {
    id: number;
    name: string;
    email: string;
    whatsapp: string;
    is_verified: boolean;
    is_active: boolean;
    profile_image: string | null;
    created_at: string;
    warnings_count: number;
    is_suspended: boolean;
    suspended_until: string | null;
    is_blocked: boolean;
  } | null;

  announcement: {
    id: number;
    title: string;
    description: string;
    status: string;
    cover_image: string | null;
    user_id: number;
  } | null;

  reason: string;
  reason_label: string;
  description: string | null;
  priority: ReportPriority;
  priority_label: string;
  status: ReportStatus;
  status_label: string;
  action_taken: ReportActionTaken | null;
  action_taken_label: string | null;
  admin_notes: string | null;
  reviewed_at: string | null;
  resolved_by: { id: number; name: string } | null;
  previous_reports_against_user?: number;
  created_at: string;
  updated_at: string;
}

export interface AdminReportsStats {
  reports: {
    total: number;
    pending: number;
    reviewed: number;
    rejected: number;
  };
  by_priority: {
    high: number;
    medium: number;
    low: number;
  };
  by_target: {
    user: number;
    announcement: number;
  };
  today: {
    new: number;
    processed: number;
  };
}

export interface AdminReportsListResponse {
  data: AdminReportListItem[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  stats: AdminReportsStats;
}

export interface ProcessReportPayload {
  action: ReportAction;
  admin_notes: string;
  suspend_days?: number;
}

export interface ProcessReportResponse {
  message: string;
  report: AdminReportDetail;
}

// ============================================
// SPRINT 05 — Admin Dashboard Types
// ============================================

export interface AdminDashboardUsersStats {
  total: number;
  verified: number;
  suspended: number;
  blocked: number;
  new_today: number;
  new_this_week: number;
  new_this_month: number;
}

export interface AdminDashboardAnnouncementsStats {
  total: number;
  active: number;
  disabled: number;
  completed: number;
  deleted: number;
  featured: number;
  total_views: number;
  new_today: number;
  new_this_week: number;
}

export interface AdminDashboardEngagementStats {
  total_ratings: number;
  average_rating: number;
  total_likes: number;
  new_ratings_today: number;
  new_likes_today: number;
}

export interface AdminDashboardModerationStats {
  pending_reports: number;
  pending_verifications: number;
  pending_featured: number;
  total_reports: number;
  total_verifications: number;
  high_priority_reports: number;
}

export interface AdminDashboardFinancialStats {
  total_revenue: number;
  this_month_revenue: number;
  today_revenue: number;
  total_featured_requests: number;
  approved_requests: number;
}

export interface AdminDashboardTodayStats {
  new_users: number;
  new_announcements: number;
  new_ratings: number;
  new_reports: number;
}

export interface AdminDashboardStats {
  users: AdminDashboardUsersStats;
  announcements: AdminDashboardAnnouncementsStats;
  engagement: AdminDashboardEngagementStats;
  moderation: AdminDashboardModerationStats;
  financial: AdminDashboardFinancialStats;
  today: AdminDashboardTodayStats;
}

export interface PendingReports {
  total: number;
  high: number;
  medium: number;
  low: number;
  oldest_age: number;
  link: string;
}

export interface PendingVerifications {
  total: number;
  oldest_age: number;
  link: string;
}

export interface PendingFeatured {
  total: number;
  expected_revenue: number;
  oldest_age: number;
  link: string;
}

export interface NearWarningUser {
  id: number;
  name: string;
  warnings_count: number;
  profile_image: string | null;
}

export interface FrequentlyReportedUser {
  id: number;
  name: string;
  profile_image: string | null;
  reports_count: number;
}

export interface AdminDashboardPending {
  reports: PendingReports;
  verifications: PendingVerifications;
  featured_requests: PendingFeatured;
  near_warning_threshold: NearWarningUser[];
  frequently_reported: FrequentlyReportedUser[];
}

export interface TopUser {
  id: number;
  name: string;
  profile_image: string | null;
  is_verified: boolean;
  announcements: number;
  total_ratings: number;
  average_rating: number;
}

export interface TopAnnouncement {
  id: number;
  title: string;
  views: number;
  likes_count: number;
  user: { id: number; name: string };
  city: { id: number; name: string } | null;
  created_at: string;
}

export interface TopCategory {
  id: number;
  name: string;
  slug: string;
  announcements_count: number;
}

export interface TopGovernorate {
  id: number;
  name: string;
  users_count: number;
  announcements_count: number;
}

export interface AdminDashboardTop {
  top_users: TopUser[];
  top_announcements: TopAnnouncement[];
  top_categories: TopCategory[];
  top_governorates: TopGovernorate[];
}

export interface AdminDashboardAdvanced {
  retention: {
    active_today: number;
    active_this_week: number;
    returning_7d: number;
    returning_30d: number;
  };
  content_quality: {
    reported_ratio: number;
    deleted_ratio: number;
    featured_ratio: number;
  };
  moderation_efficiency: {
    avg_report_processing_minutes: number;
    avg_verification_processing_minutes: number;
    avg_featured_processing_minutes: number;
  };
  system_health: {
    storage_used_mb: number;
    notifications_today: number;
    pending_jobs: number;
    failed_jobs: number;
  };
}

export type ChartDaysRange = 7 | 14 | 30 | 60 | 90;

export interface ChartTimeSeries {
  labels: string[];
  series: Array<{ name: string; data: number[] }>;
}

export interface ChartSimple {
  labels: string[];
  series: number[];
  colors?: string[];
}

export interface ChartDualSeries {
  labels: string[];
  series: Array<{ name: string; data: number[] }>;
}

export interface AdminDashboardCharts {
  user_growth: ChartTimeSeries;
  announcements_created: ChartTimeSeries;
  activity_overview: ChartTimeSeries;
  announcements_by_category: ChartSimple;
  announcements_by_governorate: ChartSimple;
  reports_status: ChartSimple;
  verification_status: ChartSimple;
  payment_methods: ChartDualSeries;
}

export type ActivityEventType =
  | 'user_registered'
  | 'announcement_created'
  | 'announcement_disabled'
  | 'announcement_completed'
  | 'announcement_deleted'
  | 'rating_created'
  | 'report_created'
  | 'verification_submitted'
  | 'verification_approved'
  | 'verification_rejected'
  | 'featured_request_created'
  | 'featured_request_approved'
  | 'featured_request_rejected'
  | 'user_warned'
  | 'user_suspended'
  | 'user_blocked'
  | 'user_restored';

export type ActivityEventCategory =
  | 'user'
  | 'announcement'
  | 'interaction'
  | 'report'
  | 'moderation'
  | 'verification'
  | 'featured'
  | 'system';

export type ActivityActorRole = 'user' | 'admin' | 'system';

export type ActivityIconColor =
  | 'blue'
  | 'green'
  | 'red'
  | 'yellow'
  | 'orange'
  | 'purple'
  | 'gray';

export interface ActivityActor {
  id: number;
  name: string;
  role: ActivityActorRole;
  profile_image: string | null;
}

export interface ActivityTarget {
  type: string;
  id: number;
}

export interface AdminActivityItem {
  id: number;
  event_type: ActivityEventType;
  event_category: ActivityEventCategory;
  title: string;
  description: string;
  icon: string;
  color: ActivityIconColor;
  actor: ActivityActor;
  target: ActivityTarget;
  link: string | null;
  is_sensitive: boolean;
  created_at: string;
  time_ago: string;
}

export interface AdminActivityResponse {
  data: AdminActivityItem[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export interface AdminActivityFilters {
  category?: ActivityEventCategory;
  actor_role?: ActivityActorRole;
  event_type?: ActivityEventType;
  from_date?: string;
  to_date?: string;
  sensitive?: boolean;
  per_page?: number;
  page?: number;
}

export interface AdminDashboardResponse {
  data: {
    overview: AdminDashboardStats;
    pending: AdminDashboardPending;
    top: AdminDashboardTop;
    recent_activity: AdminActivityItem[];
  };
  meta: {
    generated_at: string;
    cache_ttl: number;
  };
}

// ============================================
// SPRINT 06 — BASMA FUND (صندوق بصمة)
// ============================================

// ---------- Help Requests ----------

export type HelpRequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'archived';

export type HelpRequestDisplayNameType = 'full' | 'anonymous' | 'custom';

export interface HelpRequestRegion {
  governorate: { id: number; name: string };
  city: { id: number; name: string };
}

// ---- Public list/detail view ----
export interface HelpRequestPublicVideo {
  thumbnail_blurred_url: string | null;
  duration_seconds: number | null;
  is_available: boolean;
  requires_inquiry: boolean;
}

export interface HelpRequestPublicStats {
  views: number;
  inquiries_count: number;
}

export interface HelpRequestPublic {
  id: number;
  public_title: string;
  public_description: string;
  region: HelpRequestRegion;
  video: HelpRequestPublicVideo;
  stats: HelpRequestPublicStats;
  published_at: string;
  created_at: string;
}

export interface HelpRequestsPublicResponse {
  data: HelpRequestPublic[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

// ---- User (owner) view ----
export interface HelpRequestUser {
  id: number;
  public_title: string;
  public_description: string;
  region: HelpRequestRegion;
  status: HelpRequestStatus;
  status_label?: string;
  display_name_type: HelpRequestDisplayNameType;
  display_name: string;

  video_thumbnail_url: string | null;
  video_duration_seconds: number | null;

  views: number;
  inquiries_count: number;
  video_access_count?: number;

  admin_notes: string | null;
  published_at: string | null;
  reviewed_at: string | null;
  archived_at: string | null;
  archive_reason?: string | null;

  reviewed_by?: { id: number; name: string } | null;
  achievement?: { id: number; title: string } | null;

  can_delete: boolean;
  delete_deadline: string | null;
  delete_seconds_remaining: number | null;

  created_at: string;
  updated_at: string;
}

export interface HelpRequestUserDetail extends HelpRequestUser {
  video_size_bytes?: number | null;
}

export interface HelpRequestsUserResponse {
  data: HelpRequestUser[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  limits: HelpRequestLimits;
}

export interface HelpRequestLimits {
  max_active: number;
  active_used: number;
  active_remaining: number;
  pending_count: number;
  approved_count: number;
  rejected_count: number;
  archived_count: number;
  max_monthly: number;
  monthly_used: number;
  monthly_remaining: number;
  can_submit: boolean;
}

// ---- User create payload ----
export interface HelpRequestCreatePayload {
  public_title: string;
  public_description: string;
  governorate_id: number;
  city_id: number;
  video: File;
  display_name_type: HelpRequestDisplayNameType;
  display_name_custom?: string;

  full_details: {
    real_name: string;
    age: number;
    family_size: number;
    health_condition?: string;
    income_source?: string;
  };

  contact_info: {
    whatsapp: string;
    alt_phone?: string;
  };

  region_data: {
    street: string;
    building: string;
  };
}

export interface HelpRequestCreateResponse {
  message: string;
  data: {
    id: number;
    public_title: string;
    status: HelpRequestStatus;
    user_delete_deadline: string;
    created_at: string;
  };
}

// ---- User requirements ----
export interface HelpRequestRequirements {
  who_can_submit: string;
  video_rules: {
    formats: string[];
    min_duration_sec: number;
    max_duration_sec: number;
    max_size_mb: number;
  };
  limits: {
    max_active_per_user: number;
    max_per_month: number;
  };
  delete_window_minutes: number;
  display_name_options: Array<{
    value: HelpRequestDisplayNameType;
    label: string;
  }>;
}

// ---- Admin views ----
export interface AdminHelpRequestListItem {
  id: number;
  public_title: string;
  public_description: string;

  user: {
    id: number;
    name: string;
    email: string;
    whatsapp: string;
    is_verified: boolean;
    profile_image: string | null;
  };

  region: HelpRequestRegion;
  status: HelpRequestStatus;
  status_label?: string;

  display_name_type: HelpRequestDisplayNameType;
  display_name: string;

  video: {
    thumbnail_url: string | null;
    duration_seconds: number | null;
  };

  stats: {
    views: number;
    inquiries_count: number;
    video_access_count?: number;
  };

  created_at: string;
  published_at: string | null;
  reviewed_at: string | null;
}

export interface AdminHelpRequestAccessLog {
  id: number;
  admin: { id: number; name: string } | null;
  accessed_field: string;
  action_type: string;
  status: string;
  duration_seconds?: number | null;
  reason: string | null;
  metadata?: Record<string, unknown> | null;
  ip_address?: string | null;
  accessed_at: string;
}

export interface AdminHelpRequestEncryptedFields {
  full_details: {
    real_name: string;
    age: number;
    family_size: number;
    health_condition?: string | null;
    income_source?: string | null;
  } | null;
  contact_info: {
    whatsapp: string;
    alt_phone?: string | null;
  } | null;
  region_data: {
    street: string;
    building: string;
  } | null;
}

export interface AdminHelpRequestDetail {
  id: number;
  public_title: string;
  public_description: string;

  user: {
    id: number;
    name: string;
    email: string;
    whatsapp: string;
    is_verified: boolean;
    profile_image: string | null;
  };

  region: HelpRequestRegion;
  display_name_type: HelpRequestDisplayNameType;
  display_name: string;
  status: HelpRequestStatus;
  status_label?: string;

  video: {
    thumbnail_url: string | null;
    stream_url: string;
    duration_seconds: number | null;
    size_bytes: number | null;
    hash: string | null;
  };

  encrypted_unlocked: boolean;
  encrypted_fields: AdminHelpRequestEncryptedFields;

  stats: {
    views: number;
    whatsapp_clicks: number;
    video_access_count: number;
  };

  admin_notes: string | null;
  published_at: string | null;
  reviewed_at: string | null;

  reviewed_by: { id: number; name: string } | null;
  archived_by: { id: number; name: string } | null;

  access_logs: AdminHelpRequestAccessLog[];
  video_tokens: AdminVideoTokenListItem[];

  created_at: string;
  updated_at: string;
}

export interface AdminHelpRequestsListResponse {
  data: AdminHelpRequestListItem[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  stats: AdminHelpRequestStats;
}

export interface AdminHelpRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  archived: number;
  today_new: number;
  total_views: number;
}

// ---------- Donation Inquiries ----------

export type DonationInquiryStatus =
  | 'new'
  | 'contacted'
  | 'completed'
  | 'cancelled';

export type DonationContactMethod = 'whatsapp' | 'email' | 'platform';

export interface DonationInquiryPayload {
  help_request_id: number;
  donor_name?: string;
  donor_whatsapp?: string;
  donor_email?: string;
  message?: string;
  contact_method?: DonationContactMethod;
}

export interface DonationInquiryVideoAccess {
  url: string;
  token: string;                        
  expires_at: string;
  max_views: number;                    // always 1
}

export interface PlatformContactInfo {
  whatsapp: string;
  email: string;
  phone?: string;
  working_hours: string;
}

export interface DonationInquiryCreateResponse {
  message: string;
  data: {
    tracking_code: string;
    video_access: DonationInquiryVideoAccess;
    platform_contact: PlatformContactInfo;
  };
}

export interface DonationInquiryTracking {
  tracking_code: string;
  status: DonationInquiryStatus;
  contact_method: DonationContactMethod;
  help_request: {
    id: number;
    public_title: string;
  };
  created_at: string;
  handled_at: string | null;
}

// ---- Admin ----
export interface AdminDonationInquiryListItem {
  id: number;
  tracking_code: string;
  status: DonationInquiryStatus;
  status_label?: string;
  contact_method: DonationContactMethod;

  donor: {
    name: string | null;
    whatsapp: string | null;
    email: string | null;
    is_user: boolean;
  };

  help_request: {
    id: number;
    public_title: string;
    published_at: string | null;
  };

  message: string | null;
  admin_notes: string | null;

  handled_by: { id: number; name: string } | null;
  handled_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface AdminDonationInquiryDetail {
  id: number;
  tracking_code: string;
  status: DonationInquiryStatus;
  status_label?: string;
  contact_method: DonationContactMethod;

  donor: {
    name: string | null;
    whatsapp: string | null;
    email: string | null;
    ip: string | null;
    user: {
      id: number;
      name: string;
      email: string;
    } | null;
  };

  help_request: {
    id: number;
    public_title: string;
    published_at: string | null;
  };

  message: string | null;
  admin_notes: string | null;

  handled_by: { id: number; name: string } | null;
  handled_at: string | null;

  video_tokens: AdminVideoTokenListItem[];

  created_at: string;
  updated_at: string;
}

export interface AdminDonationInquiriesListResponse {
  data: AdminDonationInquiryListItem[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  stats: AdminDonationInquiryStats;
}

export interface AdminDonationInquiryStats {
  total: number;
  new: number;
  contacted: number;
  completed: number;
  cancelled: number;
  today_new: number;
}

export interface DonationInquiryStatusPayload {
  status: DonationInquiryStatus;
  admin_notes?: string;
}

// ---------- Video Access Tokens ----------
export type VideoTokenRecipientType = 'donor_inquiry' | 'admin_custom';

export interface AdminVideoTokenRecipient {
  name: string | null;
  email: string | null;
  whatsapp: string | null;
}

export interface AdminVideoTokenListItem {
  id: number;
  issued_to_type: VideoTokenRecipientType;
  /** Arabic label — optional (some endpoints omit it) */
  issued_to_type_label?: string;

  purpose: string;

  /** Recipient — optional (some endpoints omit it) */
  recipient?: AdminVideoTokenRecipient;

  max_views: number;
  views_used: number;
  remaining_views: number;

  expires_at: string;
  first_accessed_at: string | null;
  last_accessed_at: string | null;

  is_revoked: boolean;
  revoked_at: string | null;

  bound_ip: string | null;
  issued_ip: string | null;

  issued_by_admin: { id: number; name: string } | null;
  revoked_by: { id: number; name: string } | null;

  created_at: string;
}

export interface AdminVideoTokensListResponse {
  data: AdminVideoTokenListItem[];
  meta: {
    total: number;
  };
}

export interface AdminCreateVideoTokenPayload {
  purpose: string;
  recipient_name?: string;
  recipient_email?: string;
  recipient_whatsapp?: string;
  expires_in_hours: 6 | 24 | 48;
}

export interface AdminCreateVideoTokenResponse {
  message: string;
  data: {
    token_id: number;
    token: string;
    secure_url: string;
    frontend_url: string;           
    expires_at: string;
    expires_in_hours: number;         
    max_views: number;                    // always 1
    issued_to_type: VideoTokenRecipientType;  
    recipient: {
      name: string | null;
      email: string | null;
      whatsapp: string | null;
    };
  };
}

// ---------- Donation Achievements ----------

export interface DonationAchievementMetadata {
  beneficiaries?: number;
  donors?: number;
  amount?: number;
  [key: string]: unknown;
}

export interface DonationAchievement {
  id: number;
  title: string;
  description: string;
  cover_image_url: string | null;
  video_url: string | null;
  metadata: DonationAchievementMetadata | null;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
  achievement_date: string | null;
  created_by: { id: number; name: string } | null;
  created_at: string;
  updated_at: string;
}

export interface DonationAchievementsResponse {
  data: DonationAchievement[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export interface DonationAchievementsFeaturedResponse {
  data: DonationAchievement[];
  meta: {
    total: number;
  };
}

export interface AdminDonationAchievementPayload {
  title: string;
  description: string;
  cover_image?: File | null;
  video_url?: string | null;
  metadata?: DonationAchievementMetadata | null;
  display_order?: number;
  is_active?: boolean;
  is_featured?: boolean;
  achievement_date?: string | null;
}

// Admin Donation Achievements Stats
export interface AdminDonationAchievementsStats {
  total: number;
  active: number;
  inactive: number;
  featured: number;
}

export interface AdminDonationAchievementDetail extends DonationAchievement {
  cover_image_path: string | null;
  help_requests_count: number;
}

// ---------- Public Stats + Contact ----------

export interface BasmaFundPublicStats {
  help_requests: {
    total_published: number;
    total_views: number;
  };
}

export interface BasmaFundPublicStatsResponse {
  data: BasmaFundPublicStats;
}