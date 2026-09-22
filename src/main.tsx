import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { AccountStatusProvider } from './context/AccountStatusContext';
import { NotificationsProvider } from './context/NotificationsContext';
import CookieConsent from './components/CookieConsent';

// Apply saved theme before first paint, so there's no flash of the wrong theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ThemeProvider>
          {/* AccountStatusProvider is now OUTSIDE AuthProvider
              because AuthProvider consumes useAccountStatus(). */}
          <AccountStatusProvider>
            <AuthProvider>
              {/* NotificationsProvider: central polling for unread count.
                  Must be inside AuthProvider to access useAuth(). */}
              <NotificationsProvider>
                <App />
                {/* Mounted once, globally, outside the route tree — shows on
                    every page the same way a real cookie notice does on
                    production sites, instead of being tied to one layout. */}
                <CookieConsent />
              </NotificationsProvider>
            </AuthProvider>
          </AccountStatusProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);