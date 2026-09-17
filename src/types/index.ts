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
  | 'featured_request_received_user'
  | 'featured_request_received_admin'
  | 'featured_request_approved'
  | 'featured_request_rejected'
  | 'announcement_auto_deleted'
  | 'announcement_permanently_deleted'
  | 'general';

export interface NotificationMetadata {
  request_id?: number;
  announcement_id?: number;
  user_id?: number;
  user_name?: string;
  amount?: number;
  currency?: string;
  duration_days?: number;
  payment_method?: string;
  featured_until?: string;
  rejection_reason?: string | null;
  deleted_at?: string;
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