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
// SPRINT 03 - Public Announcements Types
// ============================================

export interface SubCategory {
  id: number;
  name: string;
  category: 'goods' | 'services';
  image: string | null;
  is_high_risk: boolean;
  image_url: string | null;
}

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
    sub_category_id: boolean;
    category: boolean;
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
    categories: { value: string; label: string }[];
    types: { value: string; label: string }[];
    payment_types: { value: string; label: string }[];
    privacy_types: { value: string; label: string; available: boolean }[];
    sub_categories: {
      goods: SubCategory[];
      services: SubCategory[];
    };
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
  // NEW: Rating aggregates
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
  type: 'offer' | 'request';
  category: 'goods' | 'services';
  sub_category_id: number | null;
  sub_category: SubCategory | null;
  title: string;
  description: string;
  price_type: 'free' | 'paid' | 'barter';
  price: number | null;
  governorate_id: number;
  city_id: number;
  whatsapp: string;
  whatsapp_visible: boolean;
  privacy_type: 'public' | 'verified_only' | 'region_only' | 'verified_region';
  is_disabled: boolean;
  disabled_at: string | null;
  disable_reason: string | null;
  views: number;
  likes_count: number;
  is_liked_by_user: boolean;
  status: 'active' | 'disabled' | 'deleted';
  pinned_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deleted_by: number | null;
  deleted_reason: string | null;
  is_featured: boolean;
  featured_until: string | null;
  featured_at: string | null;
  featured_request_status?: 'pending' | 'approved' | 'rejected' | null;
  is_currently_featured: boolean;
  images: AnnouncementImage[];
  governorate?: Governorate;
  city?: City;
  user?: AnnouncementUser | AnnouncementUserAdmin;
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
    sub_categories: {
      goods: SubCategory[];
      services: SubCategory[];
    };
  };
  user_context: UserContext;
}

export interface FeaturedAnnouncementsResponse {
  data: Announcement[];
  meta: {
    total: number;
  };
  user_context: {
    is_authenticated: boolean;
    is_verified: boolean;
  };
}

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
  price_type: 'free' | 'paid' | 'barter';
  price: number | null;
  status: 'active' | 'disabled' | 'deleted';
  is_disabled: boolean;
  views: number;
  likes_count: number;
  created_at: string;
  cover_image: string | null;
  sub_category: {
    id: number;
    name: string;
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
  type: 'offer' | 'request';
  category: 'goods' | 'services';
  sub_category: {
    id: number;
    name: string;
    is_high_risk: boolean;
  } | null;
  price_type: 'free' | 'paid' | 'barter';
  price: number | null;
  governorate: { id: number; name: string };
  city: { id: number; name: string };
  whatsapp: string;
  privacy_type: 'public' | 'verified_only' | 'region_only' | 'verified_region';
  status: 'active' | 'disabled' | 'deleted';
  is_disabled: boolean;
  disabled_at: string | null;
  disable_reason: string | null;
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
    status: string;
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
    status: string;
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
  // ============================================
  // Sprint 03 - Featured
  // ============================================
  | 'featured_request_received_user'
  | 'featured_request_received_admin'
  | 'featured_request_approved'
  | 'featured_request_rejected'
  | 'announcement_auto_deleted'
  | 'announcement_permanently_deleted'
  // ============================================
  // Sprint 04 - Verification (KYC)
  // ============================================
  | 'verification_submitted_user'
  | 'verification_submitted_admin'
  | 'verification_approved'
  | 'verification_rejected'
  | 'verification_image_deleted'
  // ============================================
  // Sprint 04 - Ratings
  // ============================================
  | 'rating_received'
  | 'rating_updated'
  // ============================================
  // Sprint 04 - Reports
  // ============================================
  | 'new_report_received'
  | 'report_processed'
  | 'report_action_taken'
  // ============================================
  // Fallback
  // ============================================
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
// FORM TYPES
// ============================================

export interface AnnouncementFormData {
  type: 'offer' | 'request';
  category: 'goods' | 'services';
  sub_category_id: number | '';
  title: string;
  description: string;
  price_type: 'free' | 'paid' | 'barter';
  price: number | '';
  governorate_id: number | '';
  city_id: number | '';
  whatsapp: string;
  privacy_type: 'public' | 'verified_only' | 'region_only' | 'verified_region';
}

export interface AnnouncementFormErrors {
  type?: string;
  category?: string;
  sub_category_id?: string;
  title?: string;
  description?: string;
  price_type?: string;
  price?: string;
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

// ============================================
// Document Type Option (for dropdowns)
// ============================================
export interface DocumentTypeOption {
  value: DocumentType;
  label: string;
}

// ============================================
// Per-Document Requirements
// ============================================
export interface DocumentTypeRequirement {
  /** Which fields must be visible for this specific document type */
  must_show: string[];
  /** Optional fields */
  optional_show?: string[];
  /** Special warning for this document type */
  warning?: string;
}

// ============================================
// Requirements Response
// ============================================
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

// ============================================
// Status Response
// ============================================
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

// ============================================
// Upload Response
// ============================================
export interface UploadIdResponse {
  message: string;
  request: {
    id: number;
    status: VerificationStatus;
    document_type: DocumentType;
    document_type_label: string;
    created_at: string;
  };
  // Warning when re-uploading after a previous rejection
  warning?: {
    title: string;
    message: string;
    previous_rejection_reason: string;
    previous_rejected_at: string;
  };
}

// ============================================
// Admin Filter
// ============================================
export type AdminVerificationFilter =
  | 'all'
  | 'pending'
  | 'approved'
  | 'rejected';

// ============================================
// Admin List Item
// ============================================
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

// ============================================
// Extracted Data
// ============================================
export interface ExtractedData {
  full_name: string;
  id_number: string;
  date_of_birth: string | null;
  expiry_date: string | null;
}

// ============================================
// Access Log
// ============================================
export interface VerificationAccessLog {
  id: number;
  admin: {
    id: number;
    name: string;
  } | null;
  reason: string | null;
  accessed_at: string;
}

// ============================================
// Admin Detail
// ============================================
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

  // Image availability (NOT URL)
  has_image: boolean;
  image_deleted_at: string | null;
  auto_delete_at: string | null;

  status: VerificationStatus;
  admin_notes: string | null;

  // Extracted data
  extracted_data: ExtractedData | null;
  extracted_by: { id: number; name: string } | null;
  extracted_at: string | null;

  // Reviewer
  reviewed_by: { id: number; name: string } | null;
  reviewed_at: string | null;

  // Access logs
  access_logs: VerificationAccessLog[];

  created_at: string;
  updated_at: string;
}

// ============================================
// Admin List Response
// ============================================
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

// ============================================
// Action Payloads
// ============================================
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
  // Optional flags added by backend on `given` list
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

// USER SIDE — Detail
export interface UserFeaturedRequestDetail {
  id: number;
  announcement: {
    id: number;
    title: string;
    cover_image: string | null;
    status: 'active' | 'disabled' | 'deleted';
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

// ADMIN SIDE — List Item
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
    status: 'active' | 'disabled' | 'deleted';
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

// ADMIN SIDE — Stats
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

// ADMIN SIDE — List Response
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

// ADMIN SIDE — Full Detail
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
    status: 'active' | 'disabled' | 'deleted';
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

// ADMIN SIDE — Actions
export interface AdminFeaturedApprovePayload {
  admin_notes?: string;
}

export interface AdminFeaturedRejectPayload {
  admin_notes: string; // required
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

// User Side — Report Reasons
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

// User Side — Create Report
export interface CreateReportPayload {
  target_type: ReportTargetType;
  reported_user_id?: number;   // required when target_type = 'user'
  announcement_id?: number;    // required when target_type = 'announcement'
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

// Admin Side — List Item
export interface AdminReportListItem {
  id: number;
  target_type: ReportTargetType;
  target_type_label: string;
  reporter: {
    id: number;
    name: string;
  };
  reported_user: {
    id: number;
    name: string;
  } | null;
  announcement: {
    id: number;
    title: string;
  } | null;
  reason: string;
  reason_label: string;
  priority: ReportPriority;
  priority_label: string;
  status: ReportStatus;
  status_label: string;
  created_at: string;
}

// Admin Side — Full Detail
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
  resolved_by: {
    id: number;
    name: string;
  } | null;

  previous_reports_against_user?: number;

  created_at: string;
  updated_at: string;
}

// Admin Side — Stats
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

// Admin Side — List Response
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

// Admin Side — Process Payload
export interface ProcessReportPayload {
  action: ReportAction;
  admin_notes: string;
  suspend_days?: number;
}

export interface ProcessReportResponse {
  message: string;
  report: AdminReportDetail;
}