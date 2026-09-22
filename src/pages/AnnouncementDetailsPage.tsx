import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { announcementService } from '../services/announcementService';
import { useAuth } from '../hooks/useAuth';
import {
  FaChevronRight,
  FaTag,
  FaLock,
  FaThumbtack,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaArrowRight,
  FaWhatsapp,
  FaEnvelope,
  FaShieldAlt,
  FaStar,
  FaUser,
  FaSearch,
  FaHome,
  FaRedo,
  FaBan,
  FaExclamationCircle,
  FaUserPlus,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import SEO from '../components/SEO';
import AnnouncementImageCarousel from '../components/announcements/AnnouncementImageCarousel';
import AnnouncementDetailsActions from '../components/announcements/AnnouncementDetailsActions';
import AnnouncementOwnerInfo from '../components/announcements/AnnouncementOwnerInfo';
import AnnouncementInfoCards from '../components/announcements/AnnouncementInfoCards';
import AnnouncementSecurityTips from '../components/announcements/AnnouncementSecurityTips';
import AnnouncementContactButton from '../components/announcements/AnnouncementContactButton';
import FeaturedDetailsBanner from '../components/announcements/FeaturedDetailsBanner';
import AnnouncementReviewSection from '../components/announcements/AnnouncementReviewSection';
import { getStorageUrl } from '../utils/storageHelpers';
import {
  isOwnAnnouncement,
  getOwnBadgeStyle,
} from '../utils/announcementHelpers';
import type { Announcement } from '../types';
import type { ContactButtonConfig } from '../components/announcements/AnnouncementContactButton';

// ============================================
// Error state shape
// ============================================
type ErrorKind =
  | 'not_found'
  | 'auth_required'
  | 'forbidden'
  | 'generic'
  | null;

interface PageError {
  kind: ErrorKind;
  title: string;
  message: string;
  suggestion: string;
}

const AnnouncementDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { isDark } = useTheme();

  // ✅ Destructure isLoading too — we'll wait for auth to settle
  const {
    isAuthenticated,
    user,
    isLoading: isAuthLoading,
  } = useAuth();

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PageError | null>(null);

  const cancelTokenSource = useRef<any>(null);
  const hasIncrementedView = useRef(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  const isEmailVerified =
    user?.email_verified_at !== null && user?.email_verified_at !== undefined;
  const isVerifiedUser = user?.is_verified === true;

  const isOwn = isOwnAnnouncement(
    announcement ? { user_id: announcement.user_id } : null,
    user?.id
  );
  const ownBadgeStyle = getOwnBadgeStyle(isDark);

  // ============================================
  // PRIVACY & CONTACT LOGIC
  // ============================================

  const canViewWhatsApp = (): boolean => {
    if (!announcement) return false;
    if (!isAuthenticated) return false;
    if (!isEmailVerified) return false;

    switch (announcement.privacy_type) {
      case 'public':
        return true;
      case 'region_only':
        return user?.city_id === announcement.city_id;
      case 'verified_only':
        return isVerifiedUser && announcement.user?.is_verified === true;
      case 'verified_region':
        return (
          isVerifiedUser &&
          user?.city_id === announcement.city_id &&
          announcement.user?.is_verified === true
        );
      default:
        return false;
    }
  };

  const getContactButtonConfig = (): ContactButtonConfig | null => {
    if (!announcement) return null;

    const canView = canViewWhatsApp();

    if (!isAuthenticated) {
      return {
        label: 'سجل الدخول للتواصل',
        icon: <FaLock size={20} />,
        variant: 'outline' as const,
        to: '/login',
        disabled: false,
        tooltip: 'يجب تسجيل الدخول للتواصل مع المعلن',
      };
    }

    if (!isEmailVerified) {
      return {
        label: 'فعّل بريدك للتواصل',
        icon: <FaEnvelope size={20} />,
        variant: 'warning' as const,
        to: '/verify-email',
        disabled: false,
        tooltip: 'يجب تفعيل البريد الإلكتروني للتواصل',
      };
    }

    if (!canView) {
      let reason = '';
      switch (announcement.privacy_type) {
        case 'region_only':
          reason = 'هذا الإعلان مخصص للمنطقة فقط';
          break;
        case 'verified_only':
          reason = 'هذا الإعلان مخصص للموثقين فقط';
          break;
        case 'verified_region':
          reason = 'هذا الإعلان مخصص للموثقين في المنطقة فقط';
          break;
        default:
          reason = 'لا يمكنك التواصل مع هذا المعلن';
      }
      return {
        label: 'غير متاح',
        icon: <FaShieldAlt size={20} />,
        variant: 'disabled' as const,
        to: '#',
        disabled: true,
        tooltip: reason,
      };
    }

    return {
      label: 'التواصل عبر واتساب',
      icon: <FaWhatsapp size={24} />,
      variant: 'whatsapp' as const,
      to: `https://wa.me/${announcement.whatsapp}`,
      disabled: false,
      tooltip: 'تواصل مع المعلن عبر واتساب',
      href: true,
    };
  };

  // ============================================
  // FETCH DATA — waits for auth to be ready
  // ============================================
  useEffect(() => {
    // ✅ CRITICAL: Wait for AuthContext to finish initializing before
    // we fetch the announcement. Otherwise the fetch fires with
    // isAuthenticated === false even when the user IS logged in,
    // causing a restricted announcement to show the "auth required"
    // screen incorrectly.
    if (isAuthLoading) return;

    const source = axios.CancelToken.source();
    cancelTokenSource.current = source;

    const fetchAnnouncement = async () => {
      if (!id) {
        setLoading(false);
        setHasAttempted(true);
        return;
      }

      setLoading(true);
      setError(null);
      setHasAttempted(false);

      try {
        const data = await announcementService.getAnnouncement(Number(id));
        setAnnouncement(data);

        // ✅ Increment view count once, only after successful fetch
        if (!hasIncrementedView.current) {
          hasIncrementedView.current = true;
        }
      } catch (err: any) {
        if (axios.isCancel(err)) {
          return;
        }

        const status = err?.response?.status;

        if (status === 404) {
          setError({
            kind: 'not_found',
            title: 'الإعلان غير موجود',
            message:
              'الإعلان الذي تحاول الوصول إليه غير متوفر حالياً. قد يكون قد تم حذفه من قبل صاحبه أو إزالته من المنصة.',
            suggestion:
              'يمكنك تصفح الإعلانات الأخرى المتاحة في المنصة، أو العودة إلى الصفحة الرئيسية.',
          });
        } else if (status === 403) {
          // ✅ At this point, isAuthenticated is GUARANTEED to be accurate
          //    because we waited for isAuthLoading to become false.
          if (!isAuthenticated) {
            setError({
              kind: 'auth_required',
              title: 'سجّل دخولك لعرض هذا الإعلان',
              message:
                'هذا الإعلان مخصص لمستخدمي المنصة المسجلين. سجّل دخولك أو أنشئ حساباً جديداً لعرضه والتواصل مع المعلن.',
              suggestion:
                'التسجيل مجاني وسريع، ويمنحك صلاحية الوصول لجميع الإعلانات والمزايا.',
            });
          } else {
            setError({
              kind: 'forbidden',
              title: 'لا تملك صلاحية الوصول',
              message:
                'هذا الإعلان مخصص لفئة معينة من المستخدمين، ولا يمكنك عرضه بحسابك الحالي.',
              suggestion:
                'إذا كنت تعتقد أن هذا خطأ، يمكنك التواصل مع الدعم أو العودة إلى قائمة الإعلانات.',
            });
          }
        } else {
          setError({
            kind: 'generic',
            title: 'تعذّر تحميل الإعلان',
            message:
              'حدث خطأ غير متوقع أثناء تحميل الإعلان. قد تكون المشكلة مؤقتة.',
            suggestion:
              'يرجى المحاولة مرة أخرى بعد قليل، أو العودة إلى قائمة الإعلانات.',
          });
        }
      } finally {
        setLoading(false);
        setHasAttempted(true);
      }
    };

    fetchAnnouncement();

    return () => {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel();
        cancelTokenSource.current = null;
      }
    };
  }, [id, isAuthLoading, isAuthenticated]);

  // ============================================
  // HELPERS
  // ============================================

  const getPrivacyLabel = (privacyType: string) => {
    const map: Record<string, string> = {
      public: 'عام - للجميع',
      region_only: 'نفس المنطقة فقط',
      verified_only: 'للموثقين فقط',
      verified_region: 'موثق + نفس المنطقة',
    };
    return map[privacyType] || privacyType;
  };

  const getPrivacyColor = (privacyType: string) => {
    const map: Record<string, string> = {
      public: '#28A745',
      region_only: '#17A2B8',
      verified_only: '#E87A20',
      verified_region: '#FFC107',
    };
    return map[privacyType] || 'var(--text-muted)';
  };

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      goods: 'سلع',
      services: 'خدمات',
    };
    return map[category] || category;
  };

  const getTypeLabel = (type: string) => {
    return type === 'offer' ? 'عرض' : 'طلب';
  };

  const getTypeColor = (type: string) => {
    return type === 'offer' ? '#28A745' : '#DC3545';
  };

  const getPriceLabel = () => {
    if (!announcement) return '';
    switch (announcement.price_type) {
      case 'free':
        return 'مجاني';
      case 'paid':
        return `${announcement.price} شيكل`;
      case 'barter':
        return 'مقايضة';
      default:
        return '';
    }
  };

  const getOwnerAvatar = (): string | null => {
    return getStorageUrl(announcement?.user?.profile_image);
  };

  const contactConfig = getContactButtonConfig();
  const isFeatured = Boolean(
    announcement?.pinned_at || announcement?.featured_until
  );

  // ============================================
  // LOADING STATE — also wait for auth
  // ============================================

  if (isAuthLoading || loading || !hasAttempted) {
    return (
      <div
        style={{
          paddingTop: '100px',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-body)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            className="spinner-border"
            style={{
              color: 'var(--primary-orange)',
              width: '3rem',
              height: '3rem',
            }}
          />
          <p
            style={{
              color: 'var(--text-muted)',
              marginTop: '1rem',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            جاري تحميل الإعلان...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================

  if (error || !announcement) {
    const errorKind: ErrorKind = error?.kind ?? 'not_found';

    const config = {
      not_found: {
        Icon: FaSearch,
        accent: '#E87A20',
        accentSoft: 'rgba(232,122,32,0.12)',
        accentBorder: 'rgba(232,122,32,0.35)',
        gradient: 'linear-gradient(135deg, #E87A20, #F5A623)',
        label: 'غير موجود',
      },
      auth_required: {
        Icon: FaLock,
        accent: '#17A2B8',
        accentSoft: 'rgba(23,162,184,0.10)',
        accentBorder: 'rgba(23,162,184,0.30)',
        gradient: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
        label: 'يتطلب تسجيل دخول',
      },
      forbidden: {
        Icon: FaBan,
        accent: '#DC3545',
        accentSoft: 'rgba(220,53,69,0.10)',
        accentBorder: 'rgba(220,53,69,0.30)',
        gradient: 'linear-gradient(135deg, #DC3545, #B02A37)',
        label: 'ممنوع الوصول',
      },
      generic: {
        Icon: FaExclamationCircle,
        accent: '#17A2B8',
        accentSoft: 'rgba(23,162,184,0.10)',
        accentBorder: 'rgba(23,162,184,0.30)',
        gradient: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
        label: 'خطأ مؤقت',
      },
    }[errorKind ?? 'not_found'];

    const { Icon, accent, accentSoft, accentBorder, gradient, label } = config;

    const title = error?.title ?? 'الإعلان غير موجود';
    const message = error?.message ?? 'تعذّر الوصول إلى هذا الإعلان.';
    const suggestion =
      error?.suggestion ?? 'يمكنك العودة إلى قائمة الإعلانات.';

    return (
      <>
        <SEO title={title} description={message} />

        <div
          style={{
            paddingTop: '100px',
            paddingBottom: '60px',
            minHeight: '100vh',
            backgroundColor: 'var(--bg-body)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Container>
            <Row className="justify-content-center">
              <Col xs={12} sm={11} md={9} lg={7} xl={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'relative',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '24px',
                    padding: '2.5rem 2rem 2rem',
                    boxShadow: '0 20px 60px var(--shadow-md)',
                    border: `1px solid ${accentBorder}`,
                    overflow: 'hidden',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      left: 0,
                      height: '5px',
                      background: gradient,
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      top: '-60px',
                      right: '-60px',
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      background: accentSoft,
                      filter: 'blur(40px)',
                      pointerEvents: 'none',
                    }}
                  />

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 14px',
                      borderRadius: '20px',
                      backgroundColor: accentSoft,
                      border: `1px solid ${accentBorder}`,
                      color: accent,
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      fontFamily: 'Cairo, sans-serif',
                      marginBottom: '1.25rem',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <FaExclamationTriangle size={11} />
                    {label}
                  </div>

                  <motion.div
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{
                      scale: [1, 1.04, 1],
                      rotate: [0, -3, 3, 0],
                    }}
                    transition={{
                      scale: {
                        repeat: Infinity,
                        duration: 3,
                        ease: 'easeInOut',
                      },
                      rotate: {
                        repeat: Infinity,
                        duration: 4,
                        ease: 'easeInOut',
                      },
                      default: { type: 'spring', stiffness: 260, damping: 18 },
                    }}
                    style={{
                      width: '88px',
                      height: '88px',
                      margin: '0 auto 1.25rem',
                      borderRadius: '50%',
                      background: gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      boxShadow: `0 12px 32px ${accent}55`,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <Icon size={36} />
                  </motion.div>

                  <h2
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                      fontWeight: 900,
                      fontFamily: 'Cairo, sans-serif',
                      marginBottom: '0.75rem',
                      lineHeight: 1.35,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {title}
                  </h2>

                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                      fontFamily: 'Cairo, sans-serif',
                      lineHeight: 1.75,
                      maxWidth: '440px',
                      margin: '0 auto 1.5rem',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {message}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      marginBottom: '1.5rem',
                      textAlign: 'right',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <FaExclamationTriangle
                      size={12}
                      color={accent}
                      style={{ flexShrink: 0, marginTop: '3px' }}
                    />
                    <span
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                        fontFamily: 'Cairo, sans-serif',
                        lineHeight: 1.65,
                      }}
                    >
                      {suggestion}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {errorKind === 'auth_required' && (
                      <>
                        <Link
                          to="/login"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            background: gradient,
                            color: '#FFFFFF',
                            fontFamily: 'Cairo, sans-serif',
                            fontSize: '0.88rem',
                            fontWeight: 800,
                            textDecoration: 'none',
                            cursor: 'pointer',
                            boxShadow: `0 6px 20px ${accent}40`,
                            minHeight: '46px',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              'translateY(-1px)';
                            e.currentTarget.style.boxShadow = `0 10px 26px ${accent}55`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = `0 6px 20px ${accent}40`;
                          }}
                        >
                          <FaUser size={13} />
                          تسجيل الدخول
                          <FaArrowRight size={12} />
                        </Link>

                        <Link
                          to="/register"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '12px 22px',
                            borderRadius: '12px',
                            backgroundColor: 'transparent',
                            border: `1.5px solid ${accentBorder}`,
                            color: accent,
                            fontFamily: 'Cairo, sans-serif',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            cursor: 'pointer',
                            minHeight: '46px',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = accentSoft;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              'transparent';
                          }}
                        >
                          <FaUserPlus size={13} />
                          إنشاء حساب جديد
                        </Link>
                      </>
                    )}

                    {errorKind === 'generic' && (
                      <motion.button
                        type="button"
                        onClick={() => window.location.reload()}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '12px 22px',
                          borderRadius: '12px',
                          border: 'none',
                          background: gradient,
                          color: '#FFFFFF',
                          fontFamily: 'Cairo, sans-serif',
                          fontSize: '0.88rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: `0 6px 20px ${accent}40`,
                          minHeight: '46px',
                        }}
                      >
                        <FaRedo size={13} />
                        حاول مرة أخرى
                      </motion.button>
                    )}

                    {errorKind !== 'auth_required' && (
                      <Link
                        to="/announcements"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '12px 24px',
                          borderRadius: '12px',
                          background:
                            errorKind === 'generic'
                              ? 'transparent'
                              : gradient,
                          border:
                            errorKind === 'generic'
                              ? `1.5px solid ${accentBorder}`
                              : 'none',
                          color:
                            errorKind === 'generic' ? accent : '#FFFFFF',
                          fontFamily: 'Cairo, sans-serif',
                          fontSize: '0.88rem',
                          fontWeight: 800,
                          textDecoration: 'none',
                          cursor: 'pointer',
                          boxShadow:
                            errorKind === 'generic'
                              ? 'none'
                              : `0 6px 20px ${accent}40`,
                          minHeight: '46px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (errorKind === 'generic') {
                            e.currentTarget.style.backgroundColor = accentSoft;
                          } else {
                            e.currentTarget.style.transform =
                              'translateY(-1px)';
                            e.currentTarget.style.boxShadow = `0 10px 26px ${accent}55`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (errorKind === 'generic') {
                            e.currentTarget.style.backgroundColor =
                              'transparent';
                          } else {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = `0 6px 20px ${accent}40`;
                          }
                        }}
                      >
                        <FaSearch size={13} />
                        تصفّح الإعلانات
                        <FaArrowRight size={12} />
                      </Link>
                    )}

                    {errorKind !== 'auth_required' && (
                      <Link
                        to="/"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '12px 22px',
                          borderRadius: '12px',
                          backgroundColor: 'transparent',
                          border: '1.5px solid var(--border-color)',
                          color: 'var(--text-secondary)',
                          fontFamily: 'Cairo, sans-serif',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          cursor: 'pointer',
                          minHeight: '46px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = accent;
                          e.currentTarget.style.color = accent;
                          e.currentTarget.style.backgroundColor = accentSoft;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor =
                            'var(--border-color)';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <FaHome size={13} />
                        الصفحة الرئيسية
                      </Link>
                    )}
                  </div>

                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.72rem',
                      fontFamily: 'Cairo, sans-serif',
                      lineHeight: 1.6,
                      margin: '1.5rem 0 0',
                      opacity: 0.75,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    إذا استمرت المشكلة، يمكنك{' '}
                    <Link
                      to="/contact"
                      style={{
                        color: accent,
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      التواصل مع الدعم
                    </Link>
                  </p>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }

  // ============================================
  // RENDER — Success
  // ============================================

  return (
    <>
      <SEO
        title={announcement.title}
        description={announcement.description.slice(0, 160)}
      />
      <div
        style={{
          paddingTop: '80px',
          paddingBottom: '60px',
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
        }}
      >
        <Container>
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem',
              fontFamily: 'Cairo, sans-serif',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/"
              style={{
                color: 'var(--primary-orange)',
                textDecoration: 'none',
              }}
            >
              الرئيسية
            </Link>
            <FaChevronRight
              size={10}
              style={{ color: 'var(--text-muted)', opacity: 0.4 }}
            />
            <Link
              to="/announcements"
              style={{
                color: 'var(--primary-orange)',
                textDecoration: 'none',
              }}
            >
              الإعلانات
            </Link>
            <FaChevronRight
              size={10}
              style={{ color: 'var(--text-muted)', opacity: 0.4 }}
            />
            <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
              {announcement.title.length > 30
                ? announcement.title.slice(0, 30) + '...'
                : announcement.title}
            </span>
          </motion.nav>

          {isFeatured && <FeaturedDetailsBanner />}

          <Row className="g-4">
            <Col xs={12} lg={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <AnnouncementImageCarousel
                  images={announcement.images || []}
                  title={announcement.title}
                />

                <AnnouncementDetailsActions
                  announcementId={announcement.id}
                  isLiked={announcement.is_liked_by_user || false}
                  likesCount={announcement.likes_count || 0}
                  isAuthenticated={isAuthenticated}
                  isEmailVerified={isEmailVerified}
                />

                <div className="d-block d-lg-none my-3">
                  <AnnouncementOwnerInfo
                    ownerName={announcement.user?.name || 'مستخدم'}
                    isVerified={announcement.user?.is_verified || false}
                    avatarUrl={getOwnerAvatar()}
                    rating={4.8}
                    ratingCount={12}
                    memberSince={announcement.user?.created_at}
                    userId={announcement.user?.id}
                  />
                </div>

                <div
                  style={{
                    marginTop: '1.25rem',
                    backgroundColor: isFeatured
                      ? isDark
                        ? 'rgba(232, 122, 32, 0.04)'
                        : 'rgba(255, 248, 238, 0.7)'
                      : 'var(--bg-card)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: isFeatured
                      ? isDark
                        ? '0 8px 30px rgba(232, 122, 32, 0.15)'
                        : '0 8px 30px rgba(255, 193, 7, 0.2)'
                      : '0 2px 12px var(--shadow-sm)',
                    border: isOwn
                      ? `1.5px solid ${
                          isDark
                            ? 'rgba(32,201,224,0.5)'
                            : 'rgba(23,162,184,0.35)'
                        }`
                      : isFeatured
                        ? isDark
                          ? '1.5px solid rgba(232, 122, 32, 0.4)'
                          : '1.5px solid #FFC107'
                        : '1px solid var(--border-color)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {isFeatured && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background:
                          'linear-gradient(90deg, #FFD700 0%, #E87A20 50%, #FFC107 100%)',
                      }}
                    />
                  )}

                  {isOwn && (
                    <div
                      style={{
                        marginBottom: '0.75rem',
                        display: 'inline-flex',
                      }}
                    >
                      <span
                        style={{
                          ...ownBadgeStyle,
                          padding: '5px 12px',
                          borderRadius: '10px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          fontFamily: 'Cairo, sans-serif',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <FaUser size={10} />
                        إعلانك
                      </span>
                    </div>
                  )}

                  <h1
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
                      fontWeight: 900,
                      fontFamily: 'Cairo, sans-serif',
                      marginBottom: '0.75rem',
                      lineHeight: 1.3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {announcement.title}
                  </h1>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginBottom: '1rem',
                    }}
                  >
                    {isFeatured && (
                      <span
                        style={{
                          background:
                            'linear-gradient(135deg, #FFD700 0%, #E87A20 100%)',
                          color: '#FFFFFF',
                          padding: '4px 12px',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 8px rgba(232, 122, 32, 0.3)',
                        }}
                      >
                        <FaStar size={11} /> إعلان مميز
                      </span>
                    )}

                    <span
                      style={{
                        backgroundColor: isDark
                          ? 'rgba(255,255,255,0.08)'
                          : '#F0EBE5',
                        color: isDark ? '#C49A6C' : '#6B4226',
                        padding: '4px 12px',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <FaTag size={10} />{' '}
                      {getCategoryLabel(announcement.category)}
                    </span>

                    {announcement.sub_category && (
                      <span
                        style={{
                          backgroundColor: isDark
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(139,90,43,0.06)',
                          color: isDark ? '#C49A6C' : '#8B5A2B',
                          padding: '4px 12px',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {announcement.sub_category.name}
                      </span>
                    )}

                    <span
                      style={{
                        backgroundColor:
                          getTypeColor(announcement.type) + '15',
                        color: getTypeColor(announcement.type),
                        padding: '4px 12px',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {getTypeLabel(announcement.type)}
                    </span>

                    <span
                      style={{
                        backgroundColor:
                          announcement.price_type === 'free'
                            ? '#28A74515'
                            : announcement.price_type === 'paid'
                              ? 'rgba(232,122,32,0.15)'
                              : '#9C27B015',
                        color:
                          announcement.price_type === 'free'
                            ? '#28A745'
                            : announcement.price_type === 'paid'
                              ? 'var(--primary-orange)'
                              : '#9C27B0',
                        padding: '4px 12px',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {getPriceLabel()}
                    </span>

                    {announcement.pinned_at && !isFeatured && (
                      <span
                        style={{
                          backgroundColor: 'var(--primary-orange)',
                          color: '#FFFFFF',
                          padding: '4px 12px',
                          borderRadius: '10px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <FaThumbtack size={10} /> مثبت
                      </span>
                    )}

                    <span
                      style={{
                        backgroundColor:
                          getPrivacyColor(announcement.privacy_type) + '25',
                        color: getPrivacyColor(announcement.privacy_type),
                        padding: '4px 12px',
                        borderRadius: '10px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: `1px solid ${getPrivacyColor(
                          announcement.privacy_type
                        )}40`,
                      }}
                    >
                      <FaLock size={9} />{' '}
                      {getPrivacyLabel(announcement.privacy_type)}
                    </span>

                    {announcement.sub_category?.is_high_risk && (
                      <span
                        style={{
                          backgroundColor: isDark
                            ? 'rgba(255, 193, 7, 0.18)'
                            : 'rgba(255, 193, 7, 0.15)',
                          color: isDark ? '#FFD54F' : '#856404',
                          padding: '4px 12px',
                          borderRadius: '10px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          border: isDark
                            ? '1px solid rgba(255, 213, 79, 0.4)'
                            : '1px solid rgba(255, 193, 7, 0.4)',
                        }}
                      >
                        <FaExclamationTriangle size={10} /> يتطلب توثيق الهوية
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.03)'
                        : 'rgba(139,90,43,0.03)',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                    }}
                  >
                    <FaMapMarkerAlt size={14} color="var(--primary-orange)" />
                    <span
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        fontFamily: 'Cairo, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      {announcement.governorate?.name || 'غير محدد'}
                      {announcement.city?.name &&
                        ` - ${announcement.city.name}`}
                    </span>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        lineHeight: 1.8,
                        fontFamily: 'Cairo, sans-serif',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {announcement.description}
                    </div>
                  </div>

                  <AnnouncementContactButton config={contactConfig} />
                </div>

                <AnnouncementInfoCards
                  views={announcement.views}
                  likes={announcement.likes_count || 0}
                  createdAt={announcement.created_at}
                />

                <AnnouncementReviewSection announcementId={announcement.id} />
              </motion.div>
            </Col>

            <Col xs={12} lg={4}>
              <div
                style={{
                  position: 'sticky',
                  top: '90px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                <div className="d-none d-lg-block">
                  <AnnouncementOwnerInfo
                    ownerName={announcement.user?.name || 'مستخدم'}
                    isVerified={announcement.user?.is_verified || false}
                    avatarUrl={getOwnerAvatar()}
                    rating={4.8}
                    ratingCount={12}
                    memberSince={announcement.user?.created_at}
                    userId={announcement.user?.id}
                  />
                </div>

                <AnnouncementSecurityTips />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AnnouncementDetailsPage;