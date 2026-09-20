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
import type { Announcement } from '../types';
import type { ContactButtonConfig } from '../components/announcements/AnnouncementContactButton';

const AnnouncementDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cancelTokenSource = useRef<any>(null);

  // Guard to prevent double-incrementing views during React strict mode / double renders
  const hasIncrementedView = useRef(false);

  const isEmailVerified =
    user?.email_verified_at !== null && user?.email_verified_at !== undefined;
  const isVerifiedUser = user?.is_verified === true;

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
  // FETCH DATA
  // ============================================

  useEffect(() => {
    const source = axios.CancelToken.source();
    cancelTokenSource.current = source;

    const fetchAnnouncement = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      if (hasIncrementedView.current) return;
      hasIncrementedView.current = true;

      setLoading(true);
      setError(null);

      try {
        const data = await announcementService.getAnnouncement(Number(id));
        setAnnouncement(data);
        setLoading(false);
      } catch (err: any) {
        if (axios.isCancel(err)) {
          return;
        }
        setError('حدث خطأ في تحميل الإعلان. يرجى المحاولة مرة أخرى.');
        setLoading(false);
      }
    };

    fetchAnnouncement();

    return () => {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel();
        cancelTokenSource.current = null;
      }
    };
  }, [id]);

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

  // ✅ Uses global storage helper — environment-aware
  const getOwnerAvatar = (): string | null => {
    return getStorageUrl(announcement?.user?.profile_image);
  };

  const contactConfig = getContactButtonConfig();
  const isFeatured = Boolean(
    announcement?.pinned_at || announcement?.featured_until
  );

  // ============================================
  // LOADING & ERROR STATES
  // ============================================

  if (loading) {
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

  if (error || !announcement) {
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
        <div
          style={{
            textAlign: 'center',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '3rem',
            maxWidth: '500px',
            boxShadow: '0 4px 16px var(--shadow-sm)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
          <h3
            style={{
              color: 'var(--text-secondary)',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            {error || 'الإعلان غير موجود'}
          </h3>
          <Link
            to="/announcements"
            style={{
              color: 'var(--primary-orange)',
              textDecoration: 'none',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '1rem',
            }}
          >
            العودة إلى الإعلانات <FaArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
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
          {/* Breadcrumb */}
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
              style={{ color: 'var(--primary-orange)', textDecoration: 'none' }}
            >
              الرئيسية
            </Link>
            <FaChevronRight size={10} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            <Link
              to="/announcements"
              style={{ color: 'var(--primary-orange)', textDecoration: 'none' }}
            >
              الإعلانات
            </Link>
            <FaChevronRight size={10} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
              {announcement.title.length > 30
                ? announcement.title.slice(0, 30) + '...'
                : announcement.title}
            </span>
          </motion.nav>

          {/* Featured Banner Display */}
          {isFeatured && <FeaturedDetailsBanner />}

          <Row className="g-4">
            {/* ============================================ */}
            {/* LEFT COLUMN - Main Content */}
            {/* ============================================ */}
            <Col xs={12} lg={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Image Carousel */}
                <AnnouncementImageCarousel
                  images={announcement.images || []}
                  title={announcement.title}
                />

                {/* Actions Bar */}
                <AnnouncementDetailsActions
                  announcementId={announcement.id}
                  isLiked={announcement.is_liked_by_user || false}
                  likesCount={announcement.likes_count || 0}
                  isAuthenticated={isAuthenticated}
                  isEmailVerified={isEmailVerified}
                />

                {/* 📱 MOBILE OPTIMIZATION: Owner Info Card placed right under Actions Bar for mobile view */}
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

                {/* Main Content Card */}
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
                    border: isFeatured
                      ? isDark
                        ? '1.5px solid rgba(232, 122, 32, 0.4)'
                        : '1.5px solid #FFC107'
                      : '1px solid var(--border-color)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Special Featured Glow Line */}
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

                  {/* Title */}
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

                  {/* Badges */}
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
                      <FaTag size={10} /> {getCategoryLabel(announcement.category)}
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
                        backgroundColor: getTypeColor(announcement.type) + '15',
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
                      <FaLock size={9} /> {getPrivacyLabel(announcement.privacy_type)}
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

                  {/* Location */}
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
                      {announcement.city?.name && ` - ${announcement.city.name}`}
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

                  {/* Contact Button */}
                  <AnnouncementContactButton config={contactConfig} />
                </div>

                {/* Info Cards */}
                <AnnouncementInfoCards
                  views={announcement.views}
                  likes={announcement.likes_count || 0}
                  createdAt={announcement.created_at}
                />

                {/* Review Section */}
                <AnnouncementReviewSection announcementId={announcement.id} />
              </motion.div>
            </Col>

            {/* ============================================ */}
            {/* RIGHT COLUMN - Sidebar */}
            {/* ============================================ */}
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
                {/* 💻 DESKTOP OPTIMIZATION: Owner Info stays in the right sidebar on desktop screens (hidden on mobile) */}
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

                {/* Security Tips */}
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