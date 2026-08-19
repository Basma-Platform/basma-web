import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { announcementService } from '../services/announcementService';
import { 
  FaWhatsapp, FaEye, FaMapMarkerAlt, FaTag, 
  FaLock, FaThumbtack, FaCalendarAlt, FaArrowRight, FaShareAlt,
  FaFlag, FaPrint
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import AnnouncementImageCarousel from '../components/announcements/AnnouncementImageCarousel';
import AnnouncementOwnerInfo from '../components/announcements/AnnouncementOwnerInfo';
import AnnouncementComments from '../components/announcements/AnnouncementComments';
import type { Announcement } from '../types';

const AnnouncementDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isDark } = useTheme();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = false; // Will be replaced with auth later

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await announcementService.getAnnouncement(Number(id));
        setAnnouncement(data);
      } catch (err) {
        setError('حدث خطأ في تحميل الإعلان. يرجى المحاولة مرة أخرى.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      goods: 'بضائع',
      service: 'خدمة',
      barter: 'مقايضة',
    };
    return map[category] || category;
  };

  const getTypeLabel = (type: string) => {
    return type === 'offer' ? 'عرض' : 'طلب';
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div
        style={{
          paddingTop: '100px',
          minHeight: '100vh',
          backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            className="spinner-border"
            style={{ color: '#E87A20', width: '3rem', height: '3rem' }}
          />
          <p
            style={{
              color: isDark ? '#C49A6C' : '#8B5A2B',
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
          backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            backgroundColor: isDark ? '#16213e' : '#FFFFFF',
            borderRadius: '16px',
            padding: '3rem',
            maxWidth: '500px',
            boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
          <h3
            style={{
              color: isDark ? '#FDF5E6' : '#6B4226',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            {error || 'الإعلان غير موجود'}
          </h3>
          <Link
            to="/announcements"
            style={{
              color: '#E87A20',
              textDecoration: 'none',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
            }}
          >
            <FaArrowRight /> العودة إلى الإعلانات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title={announcement.title} description={announcement.description.slice(0, 160)} />
      <div
        style={{
          paddingTop: '100px',
          paddingBottom: '60px',
          backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
          minHeight: '100vh',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Container>
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/announcements"
              style={{
                color: isDark ? '#C49A6C' : '#8B5A2B',
                textDecoration: 'none',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1.5rem',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#E87A20';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isDark ? '#C49A6C' : '#8B5A2B';
              }}
            >
              <FaArrowRight />
              العودة إلى الإعلانات
            </Link>
          </motion.div>

          <Row className="g-4">
            {/* Left Column: Images */}
            <Col xs={12} lg={7}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <AnnouncementImageCarousel
                  images={announcement.images || []}
                  title={announcement.title}
                />
    
                {/* Action Buttons */}
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '16px',
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Share Button */}
                  <Button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: announcement.title,
                          text: announcement.description.slice(0, 100),
                          url: window.location.href,
                        }).catch(() => {});
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(window.location.href).then(() => {
                          alert('✅ تم نسخ الرابط إلى الحافظة');
                        }).catch(() => {
                          alert('📋 الرابط: ' + window.location.href);
                        });
                      }
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(139,90,43,0.15)',
                      color: isDark ? '#C49A6C' : '#8B5A2B',
                      borderRadius: '12px',
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      fontFamily: 'Cairo, sans-serif',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <FaShareAlt size={14} />
                    مشاركة
                  </Button>
                  
                  {/* Report Button - Only for logged in users */}
                  {isLoggedIn ? (
                    <Button
                      onClick={() => {
                        if (confirm('هل أنت متأكد من رغبتك في الإبلاغ عن هذا الإعلان؟')) {
                          // TODO: Sprint 5 - Call report API
                          alert('✅ تم إرسال البلاغ. سيتم مراجعته من قبل الإدارة.');
                        }
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(139,90,43,0.15)',
                        color: isDark ? '#C49A6C' : '#8B5A2B',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        fontFamily: 'Cairo, sans-serif',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <FaFlag size={14} />
                      تبليغ
                    </Button>
                  ) : (
                    <Button
                      as={Link as any}
                      to="/login"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(139,90,43,0.15)',
                        color: isDark ? '#C49A6C' : '#8B5A2B',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        fontFamily: 'Cairo, sans-serif',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <FaFlag size={14} />
                      تبليغ (تسجيل الدخول مطلوب)
                    </Button>
                  )}
    
                  {/* Print Button */}
                  <Button
                    onClick={() => window.print()}
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(139,90,43,0.15)',
                      color: isDark ? '#C49A6C' : '#8B5A2B',
                      borderRadius: '12px',
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      fontFamily: 'Cairo, sans-serif',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <FaPrint size={14} />
                    طباعة
                  </Button>
                </div>
              </motion.div>
            </Col>

            {/* Right Column: Details */}
            <Col xs={12} lg={5}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div
                  style={{
                    backgroundColor: isDark ? '#16213e' : '#FFFFFF',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: isDark
                      ? '0 4px 16px rgba(0,0,0,0.2)'
                      : '0 4px 16px rgba(0,0,0,0.04)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.06)'}`,
                  }}
                >
                  {/* Title */}
                  <h1
                    style={{
                      color: isDark ? '#FDF5E6' : '#6B4226',
                      fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                      fontWeight: 900,
                      fontFamily: 'Cairo, sans-serif',
                      marginBottom: '1rem',
                      lineHeight: 1.3,
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
                      marginBottom: '1.5rem',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: isDark ? '#2a3a5a' : '#FDF5E6',
                        color: isDark ? '#C49A6C' : '#6B4226',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.08)'}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <FaTag size={10} />
                      {getCategoryLabel(announcement.category)}
                    </span>
                    <span
                      style={{
                        backgroundColor: announcement.type === 'offer'
                          ? (isDark ? '#1a3a2a' : '#e8f5e9')
                          : (isDark ? '#3a1a1a' : '#fde8e8'),
                        color: announcement.type === 'offer' ? '#28A745' : '#DC3545',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: `1px solid ${announcement.type === 'offer'
                          ? (isDark ? 'rgba(40,167,69,0.2)' : 'rgba(40,167,69,0.15)')
                          : (isDark ? 'rgba(220,53,69,0.2)' : 'rgba(220,53,69,0.15)')
                        }`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {getTypeLabel(announcement.type)}
                    </span>
                    <span
                      style={{
                        backgroundColor: announcement.price_type === 'free'
                          ? (isDark ? '#1a3a2a' : '#e8f5e9')
                          : announcement.price_type === 'paid'
                          ? (isDark ? '#3a2a1a' : '#fff3e0')
                          : (isDark ? '#2a1a3a' : '#f3e5f5'),
                        color: announcement.price_type === 'free'
                          ? '#28A745'
                          : announcement.price_type === 'paid'
                          ? '#E87A20'
                          : '#9C27B0',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: `1px solid ${announcement.price_type === 'free'
                          ? (isDark ? 'rgba(40,167,69,0.2)' : 'rgba(40,167,69,0.15)')
                          : announcement.price_type === 'paid'
                          ? (isDark ? 'rgba(232,122,32,0.2)' : 'rgba(232,122,32,0.15)')
                          : (isDark ? 'rgba(156,39,176,0.2)' : 'rgba(156,39,176,0.15)')
                        }`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {getPriceLabel()}
                    </span>
                    <span
                      style={{
                        backgroundColor: isDark ? '#2a3a5a' : '#FDF5E6',
                        color: isDark ? '#C49A6C' : '#6B4226',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.08)'}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <FaMapMarkerAlt size={10} />
                      {announcement.city?.name || 'غير محدد'}
                    </span>
                    {announcement.pinned_at && (
                      <span
                        style={{
                          backgroundColor: '#E87A20',
                          color: '#FFFFFF',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <FaThumbtack size={10} />
                        مميز
                      </span>
                    )}
                  </div>

                  {/* Owner Info */}
                  <AnnouncementOwnerInfo
                    owner={announcement.user}
                    rating={4.8}
                    ratingCount={12}
                    whatsapp={announcement.whatsapp}
                    isLoggedIn={isLoggedIn}
                  />

                  {/* Description */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3
                      style={{
                        color: isDark ? '#FDF5E6' : '#6B4226',
                        fontSize: '1rem',
                        fontWeight: 700,
                        fontFamily: 'Cairo, sans-serif',
                        marginBottom: '0.5rem',
                      }}
                    >
                      الوصف
                    </h3>
                    <p
                      style={{
                        color: isDark ? '#C49A6C' : '#6B4226',
                        fontSize: '0.95rem',
                        lineHeight: 1.8,
                        fontFamily: 'Cairo, sans-serif',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {announcement.description}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 14px',
                        backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                        borderRadius: '10px',
                      }}
                    >
                      <div
                        style={{
                          color: isDark ? '#C49A6C' : '#8B5A2B',
                          fontSize: '0.7rem',
                          fontFamily: 'Cairo, sans-serif',
                        }}
                      >
                        تاريخ النشر
                      </div>
                      <div
                        style={{
                          color: isDark ? '#FDF5E6' : '#6B4226',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          fontFamily: 'Cairo, sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <FaCalendarAlt size={12} />
                        {formatDate(announcement.created_at)}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '10px 14px',
                        backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                        borderRadius: '10px',
                      }}
                    >
                      <div
                        style={{
                          color: isDark ? '#C49A6C' : '#8B5A2B',
                          fontSize: '0.7rem',
                          fontFamily: 'Cairo, sans-serif',
                        }}
                      >
                        المشاهدات
                      </div>
                      <div
                        style={{
                          color: isDark ? '#FDF5E6' : '#6B4226',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          fontFamily: 'Cairo, sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <FaEye size={12} />
                        {announcement.views}
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp CTA */}
                  <div style={{ marginTop: '1rem' }}>
                    {isLoggedIn ? (
                      <Button
                        href={`https://wa.me/${announcement.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          backgroundColor: '#25D366',
                          borderColor: '#25D366',
                          color: '#FFFFFF',
                          width: '100%',
                          borderRadius: '12px',
                          padding: '14px',
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          fontFamily: 'Cairo, sans-serif',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#1DA851';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#25D366';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <FaWhatsapp size={24} />
                        تواصل عبر واتساب
                      </Button>
                    ) : (
                      <Button
                        as={Link as any}
                        to="/login"
                        style={{
                          backgroundColor: 'transparent',
                          borderColor: '#E87A20',
                          color: '#E87A20',
                          width: '100%',
                          borderRadius: '12px',
                          padding: '14px',
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          fontFamily: 'Cairo, sans-serif',
                          transition: 'all 0.3s ease',
                          borderWidth: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#E87A20';
                          e.currentTarget.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#E87A20';
                        }}
                      >
                        <FaLock size={16} />
                        تسجيل الدخول للتواصل مع المعلن
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>

          {/* Security Guidelines */}
          <Row className="mt-5 justify-content-center">
            <Col xs={12} lg={10}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div
                  style={{
                    backgroundColor: isDark ? '#16213e' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.5rem 2rem',
                    boxShadow: isDark
                      ? '0 4px 16px rgba(0,0,0,0.2)'
                      : '0 4px 16px rgba(0,0,0,0.04)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.06)'}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(232,122,32,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                      }}
                    >
                      🛡️
                    </div>
                    <h4
                      style={{
                        color: isDark ? '#FDF5E6' : '#6B4226',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        fontFamily: 'Cairo, sans-serif',
                        margin: 0,
                      }}
                    >
                      إرشادات الأمان
                    </h4>
                  </div>
                    
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    {[
                      { icon: '📍', text: 'اختر مكاناً عاماً للقاء' },
                      { icon: '👤', text: 'أخبر أحداً عن موعد اجتماعك' },
                      { icon: '⭐', text: 'تحقق من التقييمات قبل التعامل' },
                      { icon: '🚫', text: 'ألغِ الاجتماع إذا شعرت بعدم الأمان' },
                      { icon: '🚨', text: 'أبلغ عن أي سلوك مشبوه' },
                    ].map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                          borderRadius: '10px',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(139,90,43,0.06)'}`,
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateX(-4px)';
                          e.currentTarget.style.borderColor = '#E87A20';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateX(0)';
                          e.currentTarget.style.borderColor = isDark
                            ? 'rgba(255,255,255,0.04)'
                            : 'rgba(139,90,43,0.06)';
                        }}
                      >
                        <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</span>
                        <span
                          style={{
                            color: isDark ? '#C49A6C' : '#6B4226',
                            fontSize: '0.85rem',
                            fontFamily: 'Cairo, sans-serif',
                            lineHeight: 1.4,
                          }}
                        >
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>

          {/* Comments Section */}
          <Row className="mt-4 justify-content-center">
            <Col xs={12} lg={10}>
              <AnnouncementComments isLoggedIn={isLoggedIn} />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AnnouncementDetailsPage;