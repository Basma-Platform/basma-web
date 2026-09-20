import { Card, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaEye,
  FaCalendarAlt,
  FaImage,
  FaHeart,
  FaChevronLeft,
  FaClipboardList,
  FaStar,
  FaClock,
  FaTimesCircle,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getStorageUrl } from '../../../utils/storageHelpers';
import type { DashboardRecentAnnouncement } from '../../../types';

interface DashboardRecentAnnouncementsProps {
  announcements: DashboardRecentAnnouncement[];
}

const DashboardRecentAnnouncements = ({
  announcements,
}: DashboardRecentAnnouncementsProps) => {
  const navigate = useNavigate();

  // ============================================
  // Status Badge (Basic)
  // ============================================
  const getStatusBadge = (status: string, isDisabled: boolean) => {
    if (isDisabled)
      return (
        <Badge bg="warning" className="text-dark">
          معطل
        </Badge>
      );
    if (status === 'active') return <Badge bg="success">نشط</Badge>;
    return <Badge bg="danger">محذوف</Badge>;
  };

  // ============================================
  // Featured Badge
  // ============================================
  const getFeaturedBadge = (item: DashboardRecentAnnouncement) => {
    // If currently featured (active + not expired)
    if (item.is_featured && item.featured_until) {
      return (
        <Badge
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#000000',
            fontWeight: 700,
            fontSize: '0.7rem',
            padding: '3px 10px',
            borderRadius: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(255,215,0,0.4)',
          }}
          title={`مميز حتى ${formatDate(item.featured_until)}`}
        >
          <FaStar size={10} /> مميز
        </Badge>
      );
    }

    // If there's a pending featured request
    if (item.featured_request_status === 'pending') {
      return (
        <Badge
          style={{
            backgroundColor: 'rgba(255,193,7,0.15)',
            color: '#856404',
            border: '1px solid rgba(255,193,7,0.3)',
            fontWeight: 600,
            fontSize: '0.7rem',
            padding: '3px 10px',
            borderRadius: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
          title="طلب التمييز قيد المراجعة"
        >
          <FaClock size={9} /> قيد المراجعة
        </Badge>
      );
    }

    // If there's a rejected featured request
    if (item.featured_request_status === 'rejected') {
      return (
        <Badge
          style={{
            backgroundColor: 'rgba(220,53,69,0.1)',
            color: '#DC3545',
            border: '1px solid rgba(220,53,69,0.2)',
            fontWeight: 600,
            fontSize: '0.7rem',
            padding: '3px 10px',
            borderRadius: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
          title="تم رفض طلب التمييز"
        >
          <FaTimesCircle size={9} /> مرفوض
        </Badge>
      );
    }

    return null;
  };

  const getPriceLabel = (priceType: string, price: number | null) => {
    switch (priceType) {
      case 'free':
        return 'مجاني';
      case 'paid':
        return `${price} شيكل`;
      case 'barter':
        return 'مقايضة';
      default:
        return '';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // ✅ Resolve cover image URL via storage helper
  const getCoverImage = (coverImage: string | null): string | null => {
    return getStorageUrl(coverImage);
  };

  return (
    <Card
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 4px 16px var(--shadow-sm)',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5
          style={{
            color: 'var(--text-secondary)',
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 700,
            margin: 0,
            fontSize: '1.05rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <FaClipboardList style={{ color: 'var(--primary-orange)' }} /> أحدث
          إعلاناتي
        </h5>
        <Link
          to="/user/my-announcements"
          style={{
            color: 'var(--primary-orange)',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none',
          }}
        >
          عرض الكل <FaChevronLeft size={10} />
        </Link>
      </div>

      {announcements.length === 0 ? (
        <div
          className="text-center py-4"
          style={{ color: 'var(--text-muted)' }}
        >
          <p className="mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
            لا توجد إعلانات حالياً
          </p>
          <Link
            to="/user/announcements/create"
            style={{
              color: 'var(--primary-orange)',
              fontWeight: 600,
              fontFamily: 'Cairo, sans-serif',
              textDecoration: 'none',
            }}
          >
            + أضف إعلانك الأول
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {announcements.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
              whileHover={{ x: -4 }}
              onClick={() => navigate(`/user/announcements/${item.id}`)}
              style={{
                backgroundColor: 'var(--bg-input)',
                border: item.is_featured
                  ? '2px solid #FFD700'
                  : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                maxWidth: '100%',
                position: 'relative',
              }}
            >
              {/* Desktop View */}
              <div className="d-none d-md-flex align-items-center justify-content-between gap-3">
                <div
                  className="d-flex align-items-center gap-3"
                  style={{ minWidth: 0, flex: 1 }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getCoverImage(item.cover_image) ? (
                      <img
                        src={getCoverImage(item.cover_image)!}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <FaImage color="var(--text-muted)" size={18} />
                    )}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <h6
                        className="text-truncate mb-0"
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          maxWidth: '300px',
                          fontFamily: 'Cairo, sans-serif',
                        }}
                      >
                        {item.title}
                      </h6>
                      {getFeaturedBadge(item)}
                      {getStatusBadge(item.status, item.is_disabled)}
                    </div>

                    <div
                      className="d-flex align-items-center gap-2"
                      style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}
                    >
                      {item.sub_category && (
                        <span
                          className="text-truncate"
                          style={{ fontFamily: 'Cairo, sans-serif' }}
                        >
                          {item.sub_category.name}
                        </span>
                      )}
                      <span>•</span>
                      <span
                        className="fw-semibold"
                        style={{
                          color: 'var(--primary-orange)',
                          fontFamily: 'Cairo, sans-serif',
                        }}
                      >
                        {getPriceLabel(item.price_type, item.price)}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="d-flex align-items-center gap-3 flex-shrink-0"
                  style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                >
                  <span className="d-flex align-items-center gap-1">
                    <FaEye size={12} /> {item.views}
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <FaHeart size={11} color="#DC3545" /> {item.likes_count}
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <FaCalendarAlt size={11} /> {formatDate(item.created_at)}
                  </span>
                </div>
              </div>

              {/* Mobile View */}
              <div
                className="d-flex d-md-none flex-column gap-2"
                style={{ width: '100%', overflow: 'hidden' }}
              >
                <div
                  className="d-flex align-items-center gap-2"
                  style={{ width: '100%', overflow: 'hidden' }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--bg-card)',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getCoverImage(item.cover_image) ? (
                      <img
                        src={getCoverImage(item.cover_image)!}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <FaImage color="var(--text-muted)" size={16} />
                    )}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="d-flex align-items-center gap-1 flex-wrap mb-1">
                      <h6
                        className="text-truncate mb-0"
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          maxWidth: '150px',
                          fontFamily: 'Cairo, sans-serif',
                        }}
                      >
                        {item.title}
                      </h6>
                      {getFeaturedBadge(item)}
                    </div>

                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--primary-orange)',
                          fontWeight: 600,
                          fontFamily: 'Cairo, sans-serif',
                        }}
                      >
                        {getPriceLabel(item.price_type, item.price)}
                      </span>
                      {getStatusBadge(item.status, item.is_disabled)}
                    </div>
                  </div>
                </div>

                <div
                  className="d-flex align-items-center justify-content-between pt-2 mt-1"
                  style={{
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span className="d-flex align-items-center gap-1">
                    <FaEye size={10} /> {item.views}
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <FaHeart size={10} color="#DC3545" /> {item.likes_count}
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <FaCalendarAlt size={10} /> {formatDate(item.created_at)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default DashboardRecentAnnouncements;