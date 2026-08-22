import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Sprint 01 - Guest Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import AnnouncementDetailsPage from "./pages/AnnouncementDetailsPage";
import FAQPage from "./pages/FAQPage";
// Sprint 02 - Guest Pages
import LoginPage from "./pages/LoginPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import GlobalToast from "./components/GlobalToast";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar - always visible */}
      <Navbar />
      <GlobalToast />

      {/* Main content - grows to fill space */}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route
            path="/announcements/:id"
            element={<AnnouncementDetailsPage />}
          />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Routes>
      </main>

      {/* Footer - always visible at bottom */}
      <Footer />
    </div>
  );
}

export default App;
