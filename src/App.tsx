import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import PublicLayout from './components/layouts/PublicLayout';
import AuthLayout from './components/layouts/AuthLayout';
import MainLayout from './components/layouts/MainLayout';
import PrivateRoute from './routes/PrivateRoute';
import NotificationsPage from './pages/NotificationsPage';

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

// User pages
import {
  UserProfilePage,
  MyAnnouncementsPage,
  MyAnnouncementDetailsPage,
  CreateAnnouncementPage,
  EditAnnouncementPage,
  AnnouncementSuccessPage,
  RequestFeaturedPage,
  FeaturedRequestsHistoryPage,
} from './pages/user';

// Admin pages
import { AdminProfilePage } from './pages/admin';

// Error Pages
import NotAuthorizedPage from './pages/NotAuthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <>
      {/* يعيد التمرير إلى الأعلى عند تغيير الصفحة */}
      <ScrollToTop />

      {/* THE TOAST CONTAINER */}
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        {/* Public Routes - مع Navbar + Footer */}
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

        {/* Auth Routes - بدون Navbar + Footer */}
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-email/:id/:hash" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected Routes - same for all roles */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* Protected Routes - with MainLayout (Dashboard) */}
        <Route element={<PrivateRoute roles={['user']} />}>
          <Route element={<MainLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/profile" element={<UserProfilePage />} />
            
            {/* Announcements */}
            <Route
              path="/user/my-announcements"
              element={<MyAnnouncementsPage />}
            />
            <Route
              path="/user/announcements/create"
              element={<CreateAnnouncementPage />}
            />
            <Route
              path="/user/announcements/:id"
              element={<MyAnnouncementDetailsPage />}
            />
            <Route
              path="/user/announcements/:id/edit"
              element={<EditAnnouncementPage />}
            />
            <Route
              path="/user/announcements/:id/success"
              element={<AnnouncementSuccessPage />}
            />
            <Route
              path="/user/announcements/:id/feature"
              element={<RequestFeaturedPage />}
            />
            <Route
              path="/user/announcements/:id/featured-status"
              element={<MyAnnouncementDetailsPage />}
            />
            <Route
              path="/user/featured-requests"
              element={<FeaturedRequestsHistoryPage />}
            />

            {/* Future user routes will go here */}
          </Route>
        </Route>

        <Route element={<PrivateRoute roles={['admin']} />}>
          <Route element={<MainLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
            {/* Future admin routes will go here */}
          </Route>
        </Route>

        {/* Error Pages */}
        <Route path="/403" element={<NotAuthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
