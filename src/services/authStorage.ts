import type { AuthSession, LoginResponse } from '../types';

const SESSION_KEY = 'basma_auth_session';
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const parseSession = (value: string | null): AuthSession | null => {
  if (!value) return null;

  try {
    const session = JSON.parse(value) as AuthSession;

    if (!session.token || !session.user || session.expiresAt <= Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
};

export const authStorage = {
  save: (response: LoginResponse, rememberMe: boolean) => {
    const fallbackDuration = rememberMe ? 30 * DAY_IN_MS : DAY_IN_MS;
    const duration = response.expires_in
      ? response.expires_in * 1000
      : fallbackDuration;

    const session: AuthSession = {
      token: response.token,
      user: response.user,
      expiresAt: Date.now() + duration,
    };

    authStorage.clear();

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(session));

    return session;
  },

  get: (): AuthSession | null => {
    const localSession = parseSession(localStorage.getItem(SESSION_KEY));
    const temporarySession = parseSession(sessionStorage.getItem(SESSION_KEY));
    const session = localSession ?? temporarySession;

    if (!session) authStorage.clear();

    return session;
  },

  clear: () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  },
};