import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaEdit,
  FaTrash,
  FaPause,
  FaPlay,
  FaStar,
  FaEye,
  FaHeart,
  FaMapMarkerAlt,
  FaTag,
  FaWhatsapp,
  FaCalendarAlt,
  FaLock,
  FaExclamationTriangle,
  FaShareAlt,
  FaBullhorn,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useUserAnnouncement } from '../../../hooks/useUserAnnouncement';
import { useUserAnnouncements } from '../../../hooks/useUserAnnouncements';
import {
  MyAnnouncementStatusBadge,
  FeaturedStatusBadge,
  MyAnnouncementDetailsSkeleton, // <-- Using the dedicated details page skeleton
  DeleteConfirmModal,
  DisableConfirmModal,
} from '../../../components/user/announcements';
import AnnouncementImageCarousel from '../../../components/announcements/AnnouncementImageCarousel';
import {
  getCategoryLabel,
  getTypeLabel,
  getPriceLabel,
  getPrivacyLabel,
  getPrivacyColor,
  formatAnnouncementDate,
} from '../../../utils/announcementHelpers';

const MyAnnouncementDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { announcement, loading, fetchAnnouncement } = useUserAnnouncement();
  const { deleteAnnouncement, disableAnnouncement, enableAnnouncement } =
    useUserAnnouncements();

  // Modals
  const [deleteModal, setDeleteModal] = useState(false);
  const [disableModal, setDisableModal] = useState<{
    open: boolean;
    mode: 'disable' | 'enable';
  }>({ open: false, mode: 'disable' });
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (id) fetchAnnouncement(Number(id));
  }, [id, fetchAnnouncement]);

  // ============================================
  // Actions
  // ============================================
  const handleDeleteConfirm = async () => {
    if (!id) return;
    try {
      setModalLoading(true);
      await deleteAnnouncement(Number(id));
      setDeleteModal(false);
      navigate('/user/my-announcements');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDisableConfirm = async (reason?: string) => {
    if (!id) return;
    try {
      setModalLoading(true);
      if (disableModal.mode === 'disable') {
        await disableAnnouncement(Number(id), reason);
      } else {
        await enableAnnouncement(Number(id));
      }
      setDisableModal({ open: false, mode: 'disable' });
      // Refresh
      await fetchAnnouncement(Number(id));
    } finally {
      setModalLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/announcements/${id}`;
    if (navigator.share && announcement) {
      try {
        await navigator.share({
          title: announcement.title,
          text: announcement.description.slice(0, 100),
          url,
        });
      } catch {
        /* cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('✅ تم نسخ الرابط');
      } catch {
        /* ignore */
      }
    }
  };

  // ============================================
  // Loading
  // ============================================
  if (loading && !announcement) {
    return (
      <>
        <SEO title="تفاصيل الإعلان" />
        {/* Replaced generic list skeleton with the precise details layout skeleton */}
        <MyAnnouncementDetailsSkeleton />
      </>
    );
  }

  // ============================================
  // Not Found
  // ============================================
  if (!announcement) {
    return (
      <>
        <SEO title="الإعلان غير موجود" />
        <div
          style={{
            paddingTop: '100px',
            minHeight: '100vh',
            backgroundColor: 'var(--bg-body)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 1rem 3rem',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              padding: '2.5rem 2rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <FaExclamationTriangle size={48} color="#DC3545" opacity={0.6} />
            <h3
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.15rem',
                fontWeight: 800,
                margin: '1rem 0 8px',
              }}
            >
              الإعلان غير موجود
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>
              لا يمكن العثور على هذا الإعلان.
            </p>
            <Link
              to="/user/my-announcements"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-orange)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
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
        title={announcement.title}
        description={announcement.description.slice(0, 160)}
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
          {/* Breadcrumb */}
          {/* ============================================ */}
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
              marginBottom: '1rem',
              fontFamily: 'Cairo, sans-serif',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/user/dashboard"
              style={{ color: 'var(--primary-orange)', textDecoration: 'none' }}
            >
              لوحة التحكم
            </Link>
            <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
            <Link
              to="/user/my-announcements"
              style={{ color: 'var(--primary-orange)', textDecoration: 'none' }}
            >
              إعلاناتي
            </Link>
            <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
            <span style={{ opacity: 0.7, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {announcement.title}
            </span>
          </motion.nav>

          <Row className="g-4">
            {/* ============================================ */}
            {/* Main Content */}
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

                {/* Main Card */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '18px',
                    padding: '1.5rem',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 16px var(--shadow-sm)',
                    marginTop: '12px',
                  }}
                >
                  {/* Title + Status */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '12px',
                      marginBottom: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <h1
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
                        fontWeight: 900,
                        fontFamily: 'Cairo, sans-serif',
                        margin: 0,
                        lineHeight: 1.35,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {announcement.title}
                    </h1>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <MyAnnouncementStatusBadge
                        status={announcement.status}
                        isFeatured={announcement.is_currently_featured}
                        featuredRequestStatus={announcement.featured_request_status}
                        size="md"
                      />
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginBottom: '1rem',
                    }}
                  >
                    <Badge
                      icon={<FaTag size={10} />}
                      label={getCategoryLabel(announcement.category)}
                    />
                    {announcement.sub_category && (
                      <Badge label={announcement.sub_category.name} />
                    )}
                    <Badge
                      label={getTypeLabel(announcement.type)}
                      color={announcement.type === 'offer' ? '#28A745' : '#DC3545'}
                    />
                    <Badge
                      label={getPriceLabel(announcement.price_type, announcement.price)}
                      color={
                        announcement.price_type === 'free'
                          ? '#28A745'
                          : announcement.price_type === 'paid'
                          ? 'var(--primary-orange)'
                          : '#9C27B0'
                      }
                    />
                    <Badge
                      icon={<FaLock size={9} />}
                      label={getPrivacyLabel(announcement.privacy_type)}
                      color={getPrivacyColor(announcement.privacy_type)}
                    />
                    {announcement.sub_category?.is_high_risk && (
                      <Badge
                        icon={<FaExclamationTriangle size={9} />}
                        label="يتطلب توثيق الهوية"
                        color="#FFC107"
                        bg="rgba(255,193,7,0.18)"
                      />
                    )}
                  </div>

                  {/* Stats Row */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '12px 0',
                      borderTop: '1px solid var(--border-color)',
                      borderBottom: '1px solid var(--border-color)',
                      marginBottom: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <StatItem icon={<FaEye size={13} />} value={announcement.views} label="مشاهدة" />
                    <StatItem icon={<FaHeart size={13} />} value={announcement.likes_count} label="إعجاب" />
                    <StatItem icon={<FaCalendarAlt size={13} />} value={formatAnnouncementDate(announcement.created_at)} />
                  </div>

                  {/* Region */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: '10px',
                      marginBottom: '1rem',
                    }}
                  >
                    <FaMapMarkerAlt size={14} color="var(--primary-orange)" />
                    <span
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    >
                      {announcement.governorate.name} - {announcement.city.name}
                    </span>
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h4
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        fontFamily: 'Cairo, sans-serif',
                        marginBottom: '8px',
                      }}
                    >
                      الوصف
                    </h4>
                    <p
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        lineHeight: 1.8,
                        fontFamily: 'Cairo, sans-serif',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {announcement.description}
                    </p>
                  </div>

                  {/* WhatsApp */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      backgroundColor: 'rgba(37,211,102,0.06)',
                      border: '1px solid rgba(37,211,102,0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <FaWhatsapp size={18} color="#25D366" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.7rem',
                          fontFamily: 'Cairo, sans-serif',
                        }}
                      >
                        رقم واتساب
                      </div>
                      <div
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          fontFamily: 'system-ui, sans-serif',
                          direction: 'ltr',
                        }}
                      >
                        {announcement.whatsapp}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>

            {/* ============================================ */}
            {/* Sidebar Actions */}
            {/* ============================================ */}
            <Col xs={12} lg={4}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{ position: 'sticky', top: '90px' }}
              >
                {/* Actions Card */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '18px',
                    padding: '1.25rem',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 16px var(--shadow-sm)',
                    marginBottom: '1rem',
                  }}
                >
                  <h4
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      fontFamily: 'Cairo, sans-serif',
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FaBullhorn size={13} color="var(--primary-orange)" />
                    إجراءات الإعلان
                  </h4>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {/* Share */}
                    <SidebarActionButton
                      icon={<FaShareAlt size={13} />}
                      label="مشاركة الإعلان"
                      description="نسخ الرابط أو مشاركة الإعلان"
                      onClick={handleShare}
                      variant="share"
                    />

                    {/* Feature */}
                    {announcement.can_feature && (
                      <SidebarActionButton
                        icon={<FaStar size={13} />}
                        label="ميّز هذا الإعلان"
                        description="احصل على مشاهدات أكثر"
                        onClick={() =>
                          navigate(`/user/announcements/${id}/feature`)
                        }
                        variant="feature"
                      />
                    )}

                    {/* Edit */}
                    {announcement.can_edit && (
                      <SidebarActionButton
                        icon={<FaEdit size={13} />}
                        label="تعديل الإعلان"
                        onClick={() =>
                          navigate(`/user/announcements/${id}/edit`)
                        }
                        variant="edit"
                      />
                    )}

                    {/* Disable / Enable */}
                    {announcement.can_disable && (
                      <SidebarActionButton
                        icon={<FaPause size={13} />}
                        label="تعطيل الإعلان"
                        description="إخفاء مؤقت عن المستخدمين"
                        onClick={() =>
                          setDisableModal({ open: true, mode: 'disable' })
                        }
                        variant="warning"
                      />
                    )}
                    {announcement.can_reenable && (
                      <SidebarActionButton
                        icon={<FaPlay size={13} />}
                        label="تفعيل الإعلان"
                        description="عرض الإعلان مرة أخرى"
                        onClick={() =>
                          setDisableModal({ open: true, mode: 'enable' })
                        }
                        variant="success"
                      />
                    )}

                    {/* Delete */}
                    {announcement.can_delete && (
                      <SidebarActionButton
                        icon={<FaTrash size={13} />}
                        label="حذف الإعلان"
                        onClick={() => setDeleteModal(true)}
                        variant="danger"
                      />
                    )}
                  </div>
                </div>

                {/* Featured Status Card */}
                {announcement.is_currently_featured && (
                  <div
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: '18px',
                      padding: '1.25rem',
                      border: '1.5px solid rgba(245,166,35,0.35)',
                      background:
                        'linear-gradient(135deg, rgba(245,166,35,0.08), rgba(232,122,32,0.03))',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #F5A623, #E87A20)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          flexShrink: 0,
                        }}
                      >
                        <FaStar size={14} />
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            fontFamily: 'Cairo, sans-serif',
                          }}
                        >
                          إعلان مميز ⭐
                        </div>
                        <div
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.7rem',
                            fontFamily: 'Cairo, sans-serif',
                          }}
                        >
                          حتى {formatAnnouncementDate(announcement.featured_until || '')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Featured Pending Status */}
                {announcement.featured_request_status === 'pending' && (
                  <div
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: '18px',
                      padding: '1.25rem',
                      border: '1.5px solid rgba(232,122,32,0.3)',
                      background:
                        'linear-gradient(135deg, rgba(232,122,32,0.06), transparent)',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                      }}
                    >
                      <FeaturedStatusBadge status="pending" size="sm" animated />
                    </div>
                    <p
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.78rem',
                        fontFamily: 'Cairo, sans-serif',
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      طلب التمييز قيد المراجعة. سيتواصل معك فريقنا خلال 24 ساعة.
                    </p>
                  </div>
                )}
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modals */}
      <DeleteConfirmModal
        isOpen={deleteModal}
        announcementTitle={announcement.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal(false)}
        isLoading={modalLoading}
      />

      <DisableConfirmModal
        isOpen={disableModal.open}
        announcementTitle={announcement.title}
        mode={disableModal.mode}
        onConfirm={handleDisableConfirm}
        onCancel={() => setDisableModal({ open: false, mode: 'disable' })}
        isLoading={modalLoading}
      />
    </>
  );
};

// ============================================
// Helper Components
// ============================================
const Badge = ({
  icon,
  label,
  color,
  bg,
}: {
  icon?: React.ReactNode;
  label: string;
  color?: string;
  bg?: string;
}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      borderRadius: '8px',
      backgroundColor: bg || (color ? `${color}18` : 'var(--bg-input)'),
      color: color || 'var(--text-muted)',
      fontSize: '0.7rem',
      fontWeight: 600,
      fontFamily: 'Cairo, sans-serif',
      border: '1px solid var(--border-color)',
    }}
  >
    {icon}
    {label}
  </span>
);

const StatItem = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label?: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: 'var(--text-muted)',
      fontSize: '0.8rem',
      fontFamily: 'Cairo, sans-serif',
    }}
  >
    <span style={{ color: 'var(--primary-orange)' }}>{icon}</span>
    <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
      {value}
    </span>
    {label && <span style={{ fontSize: '0.72rem' }}>{label}</span>}
  </div>
);

const SidebarActionButton = ({
  icon,
  label,
  description,
  onClick,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
  variant: 'edit' | 'danger' | 'warning' | 'success' | 'feature' | 'share';
}) => {
  const config = {
    edit: { color: '#17A2B8', bg: 'rgba(23,162,184,0.08)', border: 'rgba(23,162,184,0.25)' },
    danger: { color: '#DC3545', bg: 'rgba(220,53,69,0.08)', border: 'rgba(220,53,69,0.25)' },
    warning: { color: '#F0AD4E', bg: 'rgba(240,173,78,0.12)', border: 'rgba(240,173,78,0.35)' },
    success: { color: '#28A745', bg: 'rgba(40,167,69,0.08)', border: 'rgba(40,167,69,0.25)' },
    feature: { color: '#E87A20', bg: 'rgba(232,122,32,0.1)', border: 'rgba(232,122,32,0.35)' },
    share: { color: 'var(--primary-orange)', bg: 'rgba(232,122,32,0.08)', border: 'rgba(232,122,32,0.25)' },
  }[variant];

  return (
    <motion.button
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '11px 14px',
        borderRadius: '11px',
        border: `1px solid ${config.border}`,
        backgroundColor: config.bg,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'Cairo, sans-serif',
        textAlign: 'right',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '9px',
          backgroundColor: `${config.color}20`,
          color: config.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: '0',
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: config.color,
            fontSize: '0.82rem',
            fontWeight: 700,
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.68rem',
              marginTop: '2px',
            }}
          >
            {description}
          </div>
        )}
      </div>
    </motion.button>
  );
};

export default MyAnnouncementDetailsPage;