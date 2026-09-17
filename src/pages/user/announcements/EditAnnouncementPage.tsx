import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaEdit, FaInfoCircle } from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useAuth } from '../../../hooks/useAuth';
import { useUserAnnouncement } from '../../../hooks/useUserAnnouncement';
import EditAnnouncementForm from '../../../components/user/announcements/forms/EditAnnouncementForm';
import MyAnnouncementsSkeleton from '../../../components/user/announcements/skeletons/MyAnnouncementsSkeleton';

const EditAnnouncementPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { announcement, loading, fetchAnnouncement } = useUserAnnouncement();

  const [error, setError] = useState<string | null>(null);

  // ============================================
  // Fetch announcement
  // ============================================
  useEffect(() => {
    if (!id || !user) return;

    const load = async () => {
      try {
        setError(null);
        await fetchAnnouncement(Number(id));
      } catch {
        setError('الإعلان غير موجود أو لا تملك صلاحية تعديله');
      }
    };
    load();
  }, [id, user, fetchAnnouncement]);

  // ============================================
  // Guards
  // ============================================
  if (!user) return null;

  // ============================================
  // Loading
  // ============================================
  if (loading || (!announcement && !error)) {
    return (
      <>
        <SEO title="تعديل الإعلان" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '1rem',
            paddingBottom: '3rem',
          }}
        >
          <Container fluid="xl" className="px-3 px-md-4">
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                className="skeleton shimmer"
                style={{
                  width: '200px',
                  height: '14px',
                  borderRadius: '6px',
                  marginBottom: '12px',
                }}
              />
              <div
                className="skeleton shimmer"
                style={{ width: '220px', height: '26px', borderRadius: '6px' }}
              />
            </div>
            <MyAnnouncementsSkeleton variant="card" />
          </Container>
          <style>{`
            .skeleton { position: relative; overflow: hidden; background-color: #e8e0d8; }
            .skeleton.shimmer::after {
              content: ''; position: absolute; inset: 0;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
              animation: sh 1.8s infinite;
            }
            [data-theme='dark'] .skeleton { background-color: #5a4432 !important; }
            [data-theme='dark'] .skeleton.shimmer::after {
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
            }
            @keyframes sh { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
          `}</style>
        </div>
      </>
    );
  }

  // ============================================
  // Error / Not found
  // ============================================
  if (error || !announcement) {
    return (
      <>
        <SEO title="تعديل الإعلان" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 8px 32px var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
            <h3
              style={{
                color: 'var(--text-secondary)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '1.2rem',
                fontWeight: 800,
                marginBottom: '8px',
              }}
            >
              {error || 'الإعلان غير موجود'}
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
              }}
            >
              لا يمكن عرض الإعلان. قد يكون محذوفاً أو لا تملك صلاحية الوصول.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/user/my-announcements"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--primary-orange)',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                }}
              >
                <FaChevronLeft size={11} />
                العودة إلى إعلاناتي
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // Guard: can't edit deleted
  // ============================================
  if (!announcement.can_edit) {
    return (
      <>
        <SEO title="تعديل الإعلان" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 8px 32px var(--shadow-sm)',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 1rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,193,7,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaInfoCircle size={26} color="#FFC107" />
            </div>
            <h3
              style={{
                color: 'var(--text-secondary)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '1.15rem',
                fontWeight: 800,
                marginBottom: '8px',
              }}
            >
              لا يمكن تعديل هذا الإعلان
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
              }}
            >
              قد يكون الإعلان محذوفاً أو غير متاح للتعديل.
            </p>
            <Link
              to="/user/my-announcements"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--primary-orange)',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              <FaChevronLeft size={11} />
              العودة إلى إعلاناتي
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <SEO
        title={`تعديل: ${announcement.title}`}
        description="تعديل الإعلان على منصة بصمة"
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
          {/* ============================================ */}
          {/* Breadcrumb + Title */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '1.5rem' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem',
                fontFamily: 'Cairo, sans-serif',
                flexWrap: 'wrap',
              }}
            >
              <Link
                to="/user/dashboard"
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                لوحة التحكم
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <Link
                to="/user/my-announcements"
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                إعلاناتي
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <Link
                to={`/user/announcements/${announcement.id}`}
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  maxWidth: '180px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {announcement.title}
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                تعديل
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(23,162,184,0.3)',
                  flexShrink: 0,
                }}
              >
                <FaEdit size={20} color="#FFFFFF" />
              </div>
              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
                    fontWeight: 900,
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  تعديل الإعلان
                </h1>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.82rem',
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {announcement.title}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ============================================ */}
          {/* Form */}
          {/* ============================================ */}
          <EditAnnouncementForm
            announcement={announcement}
            user={user}
            onSuccess={(id) => navigate(`/user/announcements/${id}`)}
            onCancel={() => navigate('/user/my-announcements')}
          />
        </Container>
      </div>
    </>
  );
};

export default EditAnnouncementPage;