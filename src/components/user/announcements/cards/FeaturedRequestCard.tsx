import { motion } from 'framer-motion';
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaHourglassHalf,
  FaImage,
  FaInfoCircle,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import FeaturedStatusBadge from '../badges/FeaturedStatusBadge';
import { formatPrice, getDurationLabel } from '../../../../utils/featuredHelpers';
import { formatAnnouncementDate } from '../../../../utils/announcementHelpers';
import type { FeaturedRequest } from '../../../../types';

interface FeaturedRequestCardProps {
  request: FeaturedRequest;
}

const FeaturedRequestCard = ({ request }: FeaturedRequestCardProps) => {
  const getStatusConfig = () => {
    switch (request.status) {
      case 'approved':
        return {
          icon: <FaCheckCircle size={16} />,
          color: '#28A745',
          bg: 'rgba(40,167,69,0.08)',
        };
      case 'rejected':
        return {
          icon: <FaTimesCircle size={16} />,
          color: '#DC3545',
          bg: 'rgba(220,53,69,0.08)',
        };
      case 'pending':
      default:
        return {
          icon: <FaHourglassHalf size={16} />,
          color: '#E87A20',
          bg: 'rgba(232,122,32,0.08)',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px var(--shadow-sm)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px var(--shadow-md)';
          e.currentTarget.style.borderColor = config.color + '60';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px var(--shadow-sm)';
          e.currentTarget.style.borderColor = 'var(--border-color)';
        }}
      >
        {/* Left Color Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '4px',
            height: '100%',
            backgroundColor: config.color,
            opacity: 0.7,
          }}
        />

        <div
          style={{
            padding: '1rem 1.15rem 1rem 1.25rem',
            display: 'flex',
            gap: '14px',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          {/* Cover Image */}
          <Link
            to={`/user/announcements/${request.announcement_id}`}
            style={{
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-input)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-color)',
              }}
            >
              {request.announcement?.cover_image ? (
                <img
                  src={`http://localhost:8000/storage/${request.announcement.cover_image}`}
                  alt={request.announcement.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <FaImage size={24} color="var(--text-muted)" opacity={0.4} />
              )}
            </div>
          </Link>

          {/* Main Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Header: Title + Status */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '10px',
                marginBottom: '8px',
                flexWrap: 'wrap',
              }}
            >
              <Link
                to={`/user/announcements/${request.announcement_id}`}
                style={{
                  textDecoration: 'none',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <h4
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    lineHeight: 1.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary-orange)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {request.announcement?.title || 'إعلان محذوف'}
                </h4>
              </Link>

              <FeaturedStatusBadge status={request.status} size="sm" />
            </div>

            {/* Info Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '8px',
                marginBottom: '10px',
              }}
            >
              <InfoItem
                icon={<FaClock size={11} />}
                label="المدة"
                value={getDurationLabel(request.duration_days)}
              />
              <InfoItem
                icon={<FaMoneyBillWave size={11} />}
                label="المبلغ"
                value={formatPrice(request.amount, request.currency)}
                valueColor="var(--primary-orange)"
              />
              <InfoItem
                icon={<FaCalendarAlt size={11} />}
                label="تاريخ الطلب"
                value={formatAnnouncementDate(request.created_at)}
              />
            </div>

            {/* Rejection Reason (if rejected) */}
            {request.status === 'rejected' && request.admin_notes && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(220,53,69,0.06)',
                  borderRadius: '10px',
                  border: '1px solid rgba(220,53,69,0.2)',
                  marginTop: '4px',
                }}
              >
                <FaInfoCircle
                  size={12}
                  color="#DC3545"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: '#DC3545',
                      fontSize: '0.7rem',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 700,
                      marginBottom: '2px',
                    }}
                  >
                    سبب الرفض
                  </div>
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.78rem',
                      fontFamily: 'Cairo, sans-serif',
                      lineHeight: 1.5,
                    }}
                  >
                    {request.admin_notes}
                  </div>
                </div>
              </div>
            )}

            {/* Approved Notice */}
            {request.status === 'approved' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(40,167,69,0.06)',
                  borderRadius: '10px',
                  border: '1px solid rgba(40,167,69,0.2)',
                  marginTop: '4px',
                }}
              >
                <FaCheckCircle size={12} color="#28A745" />
                <span
                  style={{
                    color: '#28A745',
                    fontSize: '0.75rem',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 600,
                  }}
                >
                  إعلانك مميز الآن 🎉
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// Helper Components
// ============================================

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}

const InfoItem = ({ icon, label, value, valueColor }: InfoItemProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '0.72rem',
      fontFamily: 'Cairo, sans-serif',
    }}
  >
    <span
      style={{
        color: 'var(--primary-orange)',
        display: 'inline-flex',
        flexShrink: 0,
      }}
    >
      {icon}
    </span>
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <span
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.65rem',
          lineHeight: 1.1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: valueColor || 'var(--text-secondary)',
          fontWeight: 700,
          fontSize: '0.78rem',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </span>
    </div>
  </div>
);

export default FeaturedRequestCard;