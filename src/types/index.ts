// Sprint 01 : Types
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

export interface Announcement {
  id: number;
  user_id: number;
  type: 'offer' | 'request';
  category: 'goods' | 'service' | 'barter';
  title: string;
  description: string;
  price_type: 'free' | 'paid' | 'barter';
  price: number | null;
  governorate_id: number;
  city_id: number;
  whatsapp: string;
  privacy_type: 'public' | 'verified_only' | 'region_only' | 'verified_region';
  is_disabled: boolean;
  views: number;
  status: 'active' | 'disabled' | 'deleted';
  pinned_at: string | null;
  created_at: string;
  updated_at: string;
  images: AnnouncementImage[];
  governorate?: Governorate;
  city?: City;
  user?: User;
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

// Sprint 02 : Auth Types

/**
 * `role` controls which PAGES a user may reach (admin vs regular user
 * dashboards/routes). `is_verified` is a separate axis — the ID-verification
 * badge (FR-20/21) that unlocks extra FEATURES within the `user` role
 * (unlimited announcements, verified badge, etc.). Don't conflate the two:
 * there is no distinct "verified user" role on the backend, just `user` +
 * `is_verified: true`.
 */
export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  governorate_id: number;
  city_id: number;
  role: UserRole;
  // NOTE: `is_verified` is the ID-verification badge (FR-20/21, admin-approved ID
  // upload) — it is NOT the same thing as email confirmation. Use
  // `email_verified_at` to check whether the user has confirmed their email.
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

// FIX: no more `token` — the backend now logs the user into a session
// cookie directly, there's nothing for the client to receive and store.
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
  token: string; // NOTE: this is the password-reset token, unrelated to auth session tokens
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

// FIX: dropped `token` — auth state is now entirely "isAuthenticated + user",
// backed by the httpOnly session cookie the browser manages on its own.
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
