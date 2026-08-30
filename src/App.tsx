import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layouts/PublicLayout';
import AuthLayout from './components/layouts/AuthLayout';
import MainLayout from './components/layouts/MainLayout';
import PrivateRoute from './routes/PrivateRoute';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AnnouncementDetailsPage from './pages/AnnouncementDetailsPage';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

// Auth Pages
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Dashboard
import UserDashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Error Pages
import NotAuthorizedPage from './pages/NotAuthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* ✅ Public Routes - مع Navbar + Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/announcements/:id" element={<AnnouncementDetailsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
      </Route>

      {/* ✅ Auth Routes - بدون Navbar + Footer */}
      <Route element={<AuthLayout />}>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify-email/:id/:hash" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* ✅ Protected Routes - مع MainLayout (Dashboard) */}
      <Route element={<PrivateRoute roles={['user']} />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          {/* Future user routes will go here */}
        </Route>
      </Route>

      <Route element={<PrivateRoute roles={['admin']} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* Future admin routes will go here */}
        </Route>
      </Route>

      {/* Error Pages */}
      <Route path="/403" element={<NotAuthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
