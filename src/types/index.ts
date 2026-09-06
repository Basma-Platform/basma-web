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
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ============================================
// SPRINT 03 - New Types
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

// ============================================
// SPRINT 03 - Updated Announcement Interface
// ============================================

// ✅ Public user data - ما يظهر للضيوف والمستخدمين العاديين
export interface AnnouncementUser {
  id: number;
  name: string;
  is_verified: boolean;
  profile_image: string | null;
}

// ✅ Admin user data - ما يظهر للأدمن فقط
export interface AnnouncementUserAdmin extends AnnouncementUser {
  email: string;
  whatsapp: string;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
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
  privacy_type: 'public' | 'verified_only' | 'region_only' | 'verified_region';
  is_disabled: boolean;
  disabled_at: string | null;
  disable_reason: string | null;
  views: number;
  status: 'active' | 'disabled' | 'deleted';
  pinned_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  permanently_deleted_at: string | null;
  deleted_by: number | null;
  deleted_reason: string | null;
  images: AnnouncementImage[];
  governorate?: Governorate;
  city?: City;
  // ✅ المستخدم - قد يكون بيانات عامة أو كاملة حسب نوع المستخدم
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