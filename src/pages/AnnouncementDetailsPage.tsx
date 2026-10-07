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
  FaExchangeAlt,
  FaHandshake,
  FaFlagCheckered,
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
  getCategoryLabel,
  getTypeLabel,
  getTypeColor,
  getPriceLabel,
  getBarterBadgeLabel,
  getNegotiableLabel,
  getBarterDetail,
  getPrivacyLabel,
  getPrivacyColor,
} from '../utils/announcementHelpers';
import type { Announcement } from '../types';
import type { ContactButtonConfig } from '../components/announcements/AnnouncementContactButton';
import { BARTER_LABELS } from '../utils/announcementNaming';

// ============================================
// Error state
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
  const isAdmin = user?.role === 'admin';
  const ownBadgeStyle = getOwnBadgeStyle(isDark);

  // WhatsApp visibility
    const canViewWhatsApp = (): boolean => {
    if (!announcement) return false;

    // Owner or Admin → always allowed
    if (isOwn || isAdmin) return true;

    if (!isAuthenticated) return false;
    if (!isEmailVerified) return false;

    const privacy = announcement.privacy_type || 'public';

    switch (privacy) {
      case 'public':
        return true;
      case 'region_only':
        return user?.city_id === announcement.city_id;
      case 'verified_only':
        return isVerifiedUser;
      case 'verified_region':
        return isVerifiedUser && user?.city_id === announcement.city_id;
      default:
        return true; // fallback → treat unknown as public
    }
  };

  const getContactButtonConfig = (): ContactButtonConfig | null => {
    if (!announcement) return null;

    // Owner or Admin → direct WhatsApp
    if (isOwn || isAdmin) {
      return {
        label: 'التواصل عبر واتساب',
        icon: <FaWhatsapp size={24} />,
        variant: 'whatsapp' as const,
        to: `https://wa.me/${announcement.whatsapp}`,
        disabled: false,
        tooltip: isOwn
          ? 'رقم واتساب الخاص بك في هذا الإعلان'
          : 'تواصل مع صاحب الخدمة عبر واتساب',
        href: true,
      };
    }

    // Guest
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

    // Email not verified
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

    // Privacy blocked
    if (!canViewWhatsApp()) {
      let reason = 'لا يمكنك التواصل مع هذا المعلن';

      switch (announcement.privacy_type) {
        case 'region_only':
          reason = 'هذه الخدمة مخصصة لمن هم في نفس المنطقة فقط';
          break;
        case 'verified_only':
          reason = 'هذه الخدمة مخصصة للموثقين فقط';
          break;
        case 'verified_region':
          reason = 'هذه الخدمة مخصصة للموثقين في نفس المنطقة فقط';
          break;
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

    // Allowed
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
  // Fetch — waits for auth
  // ============================================
  useEffect(() => {
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

        if (!hasIncrementedView.current) {
          hasIncrementedView.current = true;
        }
      } catch (err: any) {
        if (axios.isCancel(err)) return;

        const status = err?.response?.status;

        if (status === 404) {
          setError({
            kind: 'not_found',
            title: 'الخدمة غير موجودة',
            message:
              'الخدمة التي تحاول الوصول إليها غير متوفرة حالياً. قد يكون قد تم حذفها من قبل صاحبها أو إزالتها من المنصة.',
            suggestion:
              'يمكنك تصفح الخدمات الأخرى المتاحة في المنصة، أو العودة إلى الصفحة الرئيسية.',
          });
        } else if (status === 403) {
          if (!isAuthenticated) {
            setError({
              kind: 'auth_required',
              title: 'سجّل دخولك لعرض هذه الخدمة',
              message:
                'هذه الخدمة مخصصة لمستخدمي المنصة المسجلين. سجّل دخولك أو أنشئ حساباً جديداً لعرضها والتواصل مع صاحب الخدمة.',
              suggestion:
                'التسجيل مجاني وسريع، ويمنحك صلاحية الوصول لجميع الخدمات والمزايا.',
            });
          } else {
            setError({
              kind: 'forbidden',
              title: 'لا تملك صلاحية الوصول',
              message:
                'هذه الخدمة مخصصة لفئة معينة من المستخدمين، ولا يمكنك عرضها بحسابك الحالي.',
              suggestion:
                'إذا كنت تعتقد أن هذا خطأ، يمكنك التواصل مع الدعم أو العودة إلى قائمة الخدمات.',
            });
          }
        } else {
          setError({
            kind: 'generic',
            title: 'تعذّر تحميل الخدمة',
            message:
              'حدث خطأ غير متوقع أثناء تحميل الخدمة. قد تكون المشكلة مؤقتة.',
            suggestion:
              'يرجى المحاولة مرة أخرى بعد قليل، أو العودة إلى قائمة الخدمات.',
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
  // Helpers
  // ============================================
  const getOwnerAvatar = (): string | null => {
    return getStorageUrl(announcement?.user?.profile_image);
  };

  const contactConfig = getContactButtonConfig();
  const isFeatured = Boolean(
    announcement?.pinned_at || announcement?.featured_until
  );

  // ============================================
  // Derived flags (safe even before announcement loads)
  // ============================================
  const isBarter =
    announcement?.price_type === 'barter';
  const isNegotiable =
    announcement?.price_type === 'paid' &&
    announcement?.is_negotiable === true;
  const isCompleted =
    !!announcement &&
    (announcement.is_completed || announcement.status === 'completed');

  const barterDetail =
    isBarter && announcement
      ? getBarterDetail(
          announcement.barter_offered,
          announcement.barter_requested
        )
      : null;

  // ============================================
  // Loading State
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
            جاري تحميل الخدمة...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // Error State
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

    const title = error?.title ?? 'الخدمة غير موجودة';
    const message = error?.message ?? 'تعذّر الوصول إلى هذه الخدمة.';
    const suggestion =
      error?.suggestion ?? 'يمكنك العودة إلى قائمة الخدمات.';

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
                      default: {
                        type: 'spring',
                        stiffness: 260,
                        damping: 18,
                      },
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
                        تصفّح الخدمات
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
                          e.currentTarget.style.color =
                            'var(--text-secondary)';
                          e.currentTarget.style.backgroundColor =
                            'transparent';
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
  // Success — Render
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
            تبادل الخدمات
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

                {/* ============================================ */}
                {/* Main Info Card */}
                {/* ============================================ */}
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

                  {/* ============================================ */}
                  {/* Completed Banner */}
                  {/* ============================================ */}
                  {isCompleted && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        backgroundColor: 'rgba(23,162,184,0.08)',
                        border: '1px solid rgba(23,162,184,0.3)',
                        borderRadius: '12px',
                        marginBottom: '1rem',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    >
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '9px',
                          background:
                            'linear-gradient(135deg, #17A2B8, #138496)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          flexShrink: 0,
                        }}
                      >
                        <FaFlagCheckered size={14} />
                      </div>
                      <span
                        style={{
                          color: '#17A2B8',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                        }}
                      >
                        تم التبادل بنجاح
                      </span>
                    </motion.div>
                  )}

                  {/* Badges Row */}
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
                        <FaStar size={11} /> خدمة مميزة
                      </span>
                    )}

                    {/* Category (flat) */}
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

                    {/* Type */}
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

                    {/* Price / Barter */}
                    <span
                      style={{
                        backgroundColor: isBarter
                          ? 'rgba(156,39,176,0.15)'
                          : 'rgba(232,122,32,0.15)',
                        color: isBarter ? '#9C27B0' : 'var(--primary-orange)',
                        padding: '4px 12px',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {isBarter && <FaExchangeAlt size={10} />}
                      {isBarter
                        ? getBarterBadgeLabel()
                        : getPriceLabel(
                            announcement.price_type,
                            announcement.price
                          )}
                    </span>

                    {/* Negotiable */}
                    {isNegotiable && (
                      <span
                        style={{
                          backgroundColor: 'rgba(40,167,69,0.15)',
                          color: '#28A745',
                          padding: '4px 12px',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <FaHandshake size={10} />
                        {getNegotiableLabel()}
                      </span>
                    )}

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

                    {announcement.category?.is_high_risk && (
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

                  {/* ============================================ */}
                  {/* Barter Detail Block */}
                  {/* ============================================ */}
                  {isBarter && barterDetail && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '10px',
                        padding: '14px',
                        backgroundColor: 'rgba(156,39,176,0.06)',
                        border: '1px solid rgba(156,39,176,0.25)',
                        borderRadius: '12px',
                        marginBottom: '1rem',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.7rem',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <FaExchangeAlt size={10} color="#9C27B0" />
                          {BARTER_LABELS.public.offered}
                        </div>
                        <div
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            lineHeight: 1.45,
                            wordBreak: 'break-word',
                          }}
                        >
                          {barterDetail.offered}
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.7rem',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <FaExchangeAlt size={10} color="#9C27B0" />
                          {BARTER_LABELS.public.requested}
                        </div>
                        <div
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            lineHeight: 1.45,
                            wordBreak: 'break-word',
                          }}
                        >
                          {barterDetail.requested}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Region */}
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

                  {/* Description */}
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
                    rating={announcement.user?.average_rating ?? 0}
                    ratingCount={announcement.user?.total_ratings ?? 0}
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