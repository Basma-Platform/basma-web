import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  FaCheckCircle,
  FaEye,
  FaPlusCircle,
  FaHome,
  FaBullhorn,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useUserAnnouncement } from '../../../hooks/useUserAnnouncement';
import { FeaturedCTACard } from '../../../components/user/announcements';
import type { CreateAnnouncementResponse } from '../../../types';

const AnnouncementSuccessPage = () => {
  const { id } = useParams<{ id: string }>();
  const { announcement, loading, fetchAnnouncement } = useUserAnnouncement();
  const [suggestion, setSuggestion] = useState<CreateAnnouncementResponse['suggestion'] | null>(null);

  // ============================================
  // Load Announcement + Suggestion
  // ============================================
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const data = await fetchAnnouncement(Number(id));
        // Try to load fresh suggestion from API (fallback to default in CTA)
        setSuggestion({
          message: 'اجعل إعلانك مميزاً ليصل إلى آلاف المستخدمين',
          feature_url: `/user/announcements/${id}/feature`,
          feature_benefits: [
            'ظهور في أعلى نتائج البحث',
            'شارة مميز ذهبية',
            'مشاهدات أكثر بـ 10 أضعاف',
          ],
        });
        return data;
      } catch (err) {
        // Fallback silently
        return null;
      }
    };

    load();
  }, [id, fetchAnnouncement]);

  // ============================================
  // Loading
  // ============================================
  if (loading && !announcement) {
    return (
      <div
        style={{
          paddingTop: '120px',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-body)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="spinner-border"
          style={{ color: 'var(--primary-orange)', width: '3rem', height: '3rem' }}
        />
      </div>
    );
  }

  // ============================================
  // Not Found
  // ============================================
  if (!announcement) {
    return (
      <>
        <SEO title="تم النشر بنجاح" />
        <Container className="py-5">
          <div className="text-center py-5">
            <p style={{ color: 'var(--text-muted)', fontFamily: 'Cairo, sans-serif' }}>
              لم يتم العثور على الإعلان.
            </p>
            <Link
              to="/user/my-announcements"
              style={{ color: 'var(--primary-orange)', fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
            >
              العودة إلى إعلاناتي
            </Link>
          </div>
        </Container>
      </>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <SEO
        title="تم النشر بنجاح"
        description="تم نشر إعلانك بنجاح على منصة بصمة"
      />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '1rem',
          paddingBottom: '3rem',
        }}
      >
        <Container fluid="xl" className="px-3 px-md-4">
          <div
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            {/* ============================================ */}
            {/* Success Header */}
            {/* ============================================ */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              style={{
                textAlign: 'center',
                padding: '2.5rem 1.5rem 1.5rem',
              }}
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 18 }}
                style={{
                  width: '96px',
                  height: '96px',
                  margin: '0 auto 1.25rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #28A745, #4FCB6E)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 12px 40px rgba(40,167,69,0.35)',
                  position: 'relative',
                }}
              >
                <FaCheckCircle size={44} />
                
                {/* Smooth, continuous breathing pulse */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.35, 1], 
                    opacity: [0.7, 0, 0.7] 
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: 'easeInOut' 
                  }}
                  style={{
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '50%',
                    border: '2px solid rgba(40,167,69,0.8)',
                    pointerEvents: 'none',
                  }}
                />
              </motion.div>

              <h1
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                  margin: '0 0 8px',
                }}
              >
                تم نشر إعلانك بنجاح! 🎉
              </h1>

              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  fontFamily: 'Cairo, sans-serif',
                  lineHeight: 1.7,
                  margin: 0,
                  maxWidth: '480px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                إعلانك الآن مرئي للمستخدمين حسب إعدادات الخصوصية.
                يمكنك التواصل مع المهتمين عبر واتساب.
              </p>
            </motion.div>

            {/* ============================================ */}
            {/* Announcement Summary Card */}
            {/* ============================================ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '18px',
                padding: '1.25rem',
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 16px var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              {/* Cover */}
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-input)',
                  flexShrink: 0,
                  border: '1px solid var(--border-color)',
                }}
              >
                {announcement.images?.[0] ? (
                  <img
                    src={`http://localhost:8000/storage/${announcement.images[0].image_path}`}
                    alt={announcement.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                      opacity: 0.4,
                    }}
                  >
                    <FaBullhorn size={24} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    fontWeight: 800,
                    fontFamily: 'Cairo, sans-serif',
                    margin: '0 0 6px',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {announcement.title}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                    fontSize: '0.75rem',
                    fontFamily: 'Cairo, sans-serif',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span>
                    {announcement.governorate.name} - {announcement.city.name}
                  </span>
                  <span>•</span>
                  <span>{announcement.views} مشاهدة</span>
                </div>
              </div>

              {/* View Button */}
              <Link
                to={`/user/announcements/${announcement.id}`}
                style={{ textDecoration: 'none', flexShrink: 0 }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '11px',
                    border: '1.5px solid var(--primary-orange)',
                    backgroundColor: 'transparent',
                    color: 'var(--primary-orange)',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--primary-orange)';
                  }}
                >
                  <FaEye size={12} />
                  عرض
                </motion.button>
              </Link>
            </motion.div>

            {/* ============================================ */}
            {/* Featured CTA */}
            {/* ============================================ */}
            <FeaturedCTACard
              announcementId={announcement.id}
              benefits={suggestion?.feature_benefits}
              variant="success"
            />

            {/* ============================================ */}
            {/* Actions */}
            {/* ============================================ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
              }}
            >
              <ActionLink
                to="/user/announcements/create"
                icon={<FaPlusCircle size={15} />}
                title="نشر إعلان آخر"
                subtitle="يمكنك نشر إعلانات إضافية هذا الشهر"
                variant="primary"
              />
              <ActionLink
                to="/user/my-announcements"
                icon={<FaBullhorn size={15} />}
                title="إدارة إعلاناتي"
                subtitle="تعديل، تعطيل، أو حذف الإعلانات"
                variant="secondary"
              />
              <ActionLink
                to="/user/dashboard"
                icon={<FaHome size={15} />}
                title="لوحة التحكم"
                subtitle="العودة إلى الصفحة الرئيسية"
                variant="outline"
              />
            </motion.div>
          </div>
        </Container>
      </div>
    </>
  );
};

// ============================================
// Helper: Action Link
// ============================================
const ActionLink = ({
  to,
  icon,
  title,
  subtitle,
  variant,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  variant: 'primary' | 'secondary' | 'outline';
}) => {
  const config = {
    primary: {
      bg: 'linear-gradient(135deg, #E87A20, #F5A623)',
      color: '#FFFFFF',
      border: 'none',
      shadow: '0 4px 16px rgba(232,122,32,0.3)',
    },
    secondary: {
      bg: 'var(--bg-card)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-color)',
      shadow: '0 2px 8px var(--shadow-sm)',
    },
    outline: {
      bg: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-color)',
      shadow: 'none',
    },
  }[variant];

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <motion.div
        whileHover={{ y: -3 }}
        style={{
          padding: '1rem',
          borderRadius: '14px',
          background: config.bg,
          color: config.color,
          border: config.border,
          boxShadow: config.shadow,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'all 0.2s ease',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '11px',
            backgroundColor:
              variant === 'primary'
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(232,122,32,0.08)',
            color: variant === 'primary' ? '#FFFFFF' : 'var(--primary-orange)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              marginBottom: '2px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '0.7rem',
              opacity: 0.8,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default AnnouncementSuccessPage;