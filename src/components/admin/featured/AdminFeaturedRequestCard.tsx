import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUserCheck,
  FaImage,
  FaClock,
  FaMoneyBillWave,
  FaCreditCard,
  FaEye,
  FaArrowLeft,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { AdminFeaturedRequestListItem } from '../../../types';
import {
  formatFeaturedPrice,
  formatFeaturedTimeAgo,
  getPaymentMethodColor,
  getInitials,
  resolveStorageUrl,
} from '../../../utils/featuredHelpers';

interface AdminFeaturedRequestCardProps {
  request: AdminFeaturedRequestListItem;
  onClick: (request: AdminFeaturedRequestListItem) => void;
}

/**
 * Shorten payment-method label for the small info chip on this card.
 * The backend sends the full label ("Bank of Palestine"), which overflows
 * in the narrow card grid. We shorten ONLY here — the detail page still
 * shows the full label.
 */
const shortPaymentLabel = (label: string): string => {
  if (label === 'Bank of Palestine' || label === 'Bank Of Palestine') {
    return 'BOP';
  }
  return label;
};

const AdminFeaturedRequestCard = ({
  request,
  onClick,
}: AdminFeaturedRequestCardProps) => {
  const [imageError, setImageError] = useState(false);

  const statusConfig: {
    Icon: IconType;
    label: string;
    color: string;
    bg: string;
    border: string;
  } = (() => {
    switch (request.status) {
      case 'approved':
        return {
          Icon: FaCheckCircle,
          label: 'تمت الموافقة',
          color: '#28A745',
          bg: 'rgba(40,167,69,0.12)',
          border: 'rgba(40,167,69,0.3)',
        };
      case 'rejected':
        return {
          Icon: FaTimesCircle,
          label: 'مرفوض',
          color: '#DC3545',
          bg: 'rgba(220,53,69,0.12)',
          border: 'rgba(220,53,69,0.3)',
        };
      case 'pending':
      default:
        return {
          Icon: FaHourglassHalf,
          label: 'قيد المراجعة',
          color: '#FFB800',
          bg: 'rgba(255,184,0,0.12)',
          border: 'rgba(255,184,0,0.3)',
        };
    }
  })();

  const StatusIcon = statusConfig.Icon;

  const userImageUrl = resolveStorageUrl(request.user.profile_image);
  const coverUrl = resolveStorageUrl(
    request.announcement?.cover_image || null
  );
  const paymentColor = getPaymentMethodColor(request.payment_method);
  const initials = getInitials(request.user.name);

  const showUserImage = !!userImageUrl && !imageError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="admin-request-card"
      onClick={() => onClick(request)}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        boxShadow: '0 2px 8px var(--shadow-sm)',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        fontFamily: 'Cairo, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px var(--shadow-md)';
        e.currentTarget.style.borderColor = statusConfig.color + '60';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      {/* Left status bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '4px',
          height: '100%',
          backgroundColor: statusConfig.color,
          opacity: 0.8,
        }}
      />

      <div className="admin-request-card__body">
        {/* ============================================
            User Row
            ============================================ */}
        <div className="admin-request-card__user">
          <div className="admin-request-card__avatar-wrap">
            <div className="admin-request-card__avatar">
              {showUserImage ? (
                <img
                  src={userImageUrl!}
                  alt={request.user.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="admin-request-card__avatar-fallback">
                  {initials}
                </span>
              )}
            </div>
            {request.user.is_verified && (
              <span title="موثق" className="admin-request-card__verified">
                <FaUserCheck size={7} />
              </span>
            )}
          </div>

          <div className="admin-request-card__user-info">
            <div className="admin-request-card__user-name">
              {request.user.name}
            </div>
            <div className="admin-request-card__user-email">
              {request.user.email}
            </div>
          </div>

          <div
            className="admin-request-card__status"
            style={{
              backgroundColor: statusConfig.bg,
              color: statusConfig.color,
              border: `1px solid ${statusConfig.border}`,
            }}
          >
            {request.status === 'pending' ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ display: 'inline-flex' }}
              >
                <StatusIcon size={9} />
              </motion.span>
            ) : (
              <StatusIcon size={9} />
            )}
            {statusConfig.label}
          </div>
        </div>

        {/* ============================================
            Announcement Row
            ============================================ */}
        <div className="admin-request-card__announcement">
          <div className="admin-request-card__cover">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={request.announcement?.title || ''}
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
              <FaImage size={16} color="var(--text-muted)" opacity={0.4} />
            )}
          </div>

          <div className="admin-request-card__announcement-info">
            <div className="admin-request-card__announcement-title">
              {request.announcement?.title || 'إعلان محذوف'}
            </div>
            {request.announcement?.status === 'deleted' && (
              <div className="admin-request-card__deleted">
                الإعلان محذوف
              </div>
            )}
          </div>
        </div>

        {/* ============================================
            Info Grid
            ============================================ */}
        <div className="admin-request-card__meta">
          <InfoChip
            Icon={FaMoneyBillWave}
            label="المبلغ"
            value={formatFeaturedPrice(request.amount, request.currency)}
            color="#E87A20"
          />
          <InfoChip
            Icon={FaClock}
            label="المدة"
            value={request.duration_label}
            color="#17A2B8"
          />
          <InfoChip
            Icon={FaCreditCard}
            label="الدفع"
            value={shortPaymentLabel(request.payment_method_label)}
            color={paymentColor}
          />
        </div>

        {/* ============================================
            Footer
            ============================================ */}
        <div className="admin-request-card__footer">
          <span className="admin-request-card__time">
            {formatFeaturedTimeAgo(request.created_at)}
          </span>

          <span className="admin-request-card__cta">
            <FaEye size={10} />
            عرض التفاصيل
            <FaArrowLeft size={8} />
          </span>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        .admin-request-card__body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          box-sizing: border-box;
        }

        .admin-request-card__user {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          box-sizing: border-box;
          min-width: 0;
        }

        .admin-request-card__avatar-wrap {
          position: relative;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
        }

        .admin-request-card__avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, #E87A20, #F5A623);
          border: 2px solid var(--bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-request-card__avatar-fallback {
          color: #FFFFFF;
          font-size: 0.9rem;
          font-weight: 800;
        }

        .admin-request-card__verified {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #0d6efd;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          border: 2px solid var(--bg-card);
        }

        .admin-request-card__user-info {
          flex: 1;
          min-width: 0;
        }

        .admin-request-card__user-name {
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 2px;
        }

        .admin-request-card__user-email {
          color: var(--text-muted);
          font-size: 0.68rem;
          font-family: system-ui, sans-serif;
          direction: ltr;
          text-align: right;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-request-card__status {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.65rem;
          font-weight: 800;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .admin-request-card__announcement {
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 10px;
          border-radius: 10px;
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
          width: 100%;
          box-sizing: border-box;
          min-width: 0;
        }

        .admin-request-card__cover {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          overflow: hidden;
          background-color: var(--bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid var(--border-color);
        }

        .admin-request-card__announcement-info {
          flex: 1;
          min-width: 0;
        }

        .admin-request-card__announcement-title {
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-request-card__deleted {
          color: #DC3545;
          font-size: 0.65rem;
          font-weight: 700;
          margin-top: 2px;
        }

        .admin-request-card__meta {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          width: 100%;
          box-sizing: border-box;
        }

        .admin-request-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid var(--border-color);
          gap: 8px;
          margin-top: auto;
          flex-wrap: wrap;
        }

        .admin-request-card__time {
          color: var(--text-muted);
          font-size: 0.7rem;
        }

        .admin-request-card__cta {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 8px;
          background-color: rgba(232,122,32,0.08);
          color: var(--primary-orange);
          font-size: 0.72rem;
          font-weight: 700;
        }

        @media (max-width: 480px) {
          .admin-request-card__body {
            padding: 0.85rem;
            gap: 10px;
          }
          .admin-request-card__avatar-wrap {
            width: 40px;
            height: 40px;
          }
          .admin-request-card__user-name {
            font-size: 0.8rem;
          }
          .admin-request-card__user-email {
            font-size: 0.65rem;
          }
          .admin-request-card__status {
            font-size: 0.6rem;
            padding: 3px 8px;
          }
        }

        @media (max-width: 380px) {
          .admin-request-card__user {
            flex-wrap: wrap;
          }
          .admin-request-card__status {
            margin-right: auto;
            margin-top: 4px;
          }
          .admin-request-card__meta {
            gap: 6px;
          }
        }
      `}</style>
    </motion.div>
  );
};

// ============================================
// Helper: Info chip
// ============================================
interface InfoChipProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  color: string;
}

const InfoChip = ({ Icon, label, value, color }: InfoChipProps) => (
  <div
    style={{
      padding: '8px 6px',
      borderRadius: '10px',
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
      textAlign: 'center',
      minWidth: 0,
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        marginBottom: '4px',
      }}
    >
      <Icon size={10} />
      <span
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.6rem',
          fontWeight: 700,
        }}
      >
        {label}
      </span>
    </div>
    <div
      style={{
        color,
        fontSize: '0.75rem',
        fontWeight: 800,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {value}
    </div>
  </div>
);

export default AdminFeaturedRequestCard;