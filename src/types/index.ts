export interface User {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  governorate_id: number;
  city_id: number;
  is_verified: boolean;
  is_active: boolean;
  profile_image: string | null;
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

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
  remember_me: boolean;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
  expires_in?: number;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: number;
}