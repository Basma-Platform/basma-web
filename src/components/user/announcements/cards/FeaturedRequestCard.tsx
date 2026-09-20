import { motion } from 'framer-motion';
import {
  FaClock,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaImage,
  FaInfoCircle,
  FaCheckCircle,
  FaHourglassHalf,
  FaChevronLeft,
} from 'react-icons/fa';
import FeaturedStatusBadge from '../badges/FeaturedStatusBadge';
import {
  formatPrice,
  getDurationLabel,
  formatFeaturedDate,
} from '../../../../utils/featuredHelpers';
import { getStorageUrl } from '../../../../utils/storageHelpers';
import type { FeaturedRequest } from '../../../../types';

interface FeaturedRequestCardProps {
  request: FeaturedRequest;
  onClick?: (request: FeaturedRequest) => void;
}

const FeaturedRequestCard = ({ request, onClick }: FeaturedRequestCardProps) => {
  const getStatusTheme = () => {
    switch (request.status) {
      case 'approved':
        return {
          color: '#28A745',
          glow: 'rgba(40,167,69,0.15)',
          gradient: 'linear-gradient(90deg, #28A745, #4FCB6E)',
        };
      case 'rejected':
        return {
          color: '#DC3545',
          glow: 'rgba(220,53,69,0.15)',
          gradient: 'linear-gradient(90deg, #DC3545, #E8707D)',
        };
      case 'pending':
      default:
        return {
          color: '#FFB800',
          glow: 'rgba(255,184,0,0.18)',
          gradient: 'linear-gradient(90deg, #FFB800, #F5A623)',
        };
    }
  };

  const theme = getStatusTheme();
  const isClickable = !!onClick;

  // ✅ Cover image via global storage helper
  const coverUrl = getStorageUrl(request.announcement?.cover_image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        isClickable
          ? { y: -3, boxShadow: `0 10px 30px ${theme.glow}` }
          : {}
      }
      whileTap={isClickable ? { scale: 0.985 } : {}}
      transition={{ duration: 0.2 }}
      onClick={isClickable ? () => onClick!(request) : undefined}
      className="featured-request-card"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px var(--shadow-sm)',
        cursor: isClickable ? 'pointer' : 'default',
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (isClickable) e.currentTarget.style.borderColor = `${theme.color}45`;
      }}
      onMouseLeave={(e) => {
        if (isClickable)
          e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      {/* Gradient accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: theme.gradient,
        }}
      />

      <div className="featured-request-card__body">
        {/* ============================================
            Top Row: Thumbnail, Title, Status
            ============================================ */}
        <div className="featured-request-card__top">
          {/* Cover Image */}
          <div className="featured-request-card__thumb">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={request.announcement?.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <FaImage size={20} color="var(--text-muted)" opacity={0.4} />
            )}
          </div>

          {/* Title & Status */}
          <div className="featured-request-card__info">
            <div className="featured-request-card__header">
              <h4 className="featured-request-card__title">
                {request.announcement?.title || 'إعلان محذوف'}
              </h4>
              <div className="featured-request-card__badge">
                <FeaturedStatusBadge
                  status={request.status}
                  size="md"
                  animated
                />
              </div>
            </div>

            {/* Subtitle / ID */}
            <div className="featured-request-card__id">
              طلب{' '}
              <span
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                }}
              >
                #{request.id}
              </span>
            </div>
          </div>

          {/* Chevron */}
          {isClickable && (
            <div className="featured-request-card__chevron">
              <FaChevronLeft size={12} />
            </div>
          )}
        </div>

        {/* ============================================
            Metadata grid
            ============================================ */}
        <div className="featured-request-card__meta">
          <InfoItem
            Icon={FaClock}
            label="المدة"
            value={getDurationLabel(request.duration_days)}
          />
          <InfoItem
            Icon={FaMoneyBillWave}
            label="المبلغ"
            value={formatPrice(request.amount, request.currency)}
            valueColor="var(--primary-orange)"
          />
          <InfoItem
            Icon={FaCalendarAlt}
            label="التاريخ"
            value={formatFeaturedDate(request.created_at)}
          />
        </div>

        {/* ============================================
            Status Banners
            ============================================ */}
        {request.status === 'rejected' && request.admin_notes && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '10px 12px',
              backgroundColor: 'rgba(220,53,69,0.07)',
              borderRadius: '10px',
              border: '1px solid rgba(220,53,69,0.25)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <FaInfoCircle
              size={13}
              color="#DC3545"
              style={{ flexShrink: 0, marginTop: '2px' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: '#DC3545',
                  fontSize: '0.75rem',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 800,
                  marginBottom: '2px',
                }}
              >
                سبب الرفض:
              </div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontFamily: 'Cairo, sans-serif',
                  lineHeight: 1.4,
                  wordBreak: 'break-word',
                }}
              >
                {request.admin_notes}
              </div>
            </div>
          </div>
        )}

        {request.status === 'approved' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              backgroundColor: 'rgba(40,167,69,0.07)',
              borderRadius: '10px',
              border: '1px solid rgba(40,167,69,0.25)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <FaCheckCircle
              size={13}
              color="#28A745"
              style={{ flexShrink: 0 }}
            />
            <span
              style={{
                color: '#28A745',
                fontSize: '0.78rem',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 700,
                wordBreak: 'break-word',
              }}
            >
              إعلانك مميز الآن وجاري عرضه
            </span>
          </div>
        )}

        {request.status === 'pending' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              backgroundColor: 'rgba(255,184,0,0.08)',
              borderRadius: '10px',
              border: '1px solid rgba(255,184,0,0.3)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <FaHourglassHalf
              size={13}
              color="#FFB800"
              style={{ flexShrink: 0 }}
            />
            <span
              style={{
                color: '#FFB800',
                fontSize: '0.78rem',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 700,
                wordBreak: 'break-word',
              }}
            >
              سيتم المراجعة خلال 24 ساعة
            </span>
          </div>
        )}
      </div>

      {/* ============================================
          Card-scoped responsive CSS
          ============================================ */}
      <style>{`
        .featured-request-card__body {
          padding: 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-sizing: border-box;
          width: 100%;
          max-width: 100%;
        }

        .featured-request-card__top {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          width: 100%;
          box-sizing: border-box;
        }

        .featured-request-card__thumb {
          width: 58px;
          height: 58px;
          border-radius: 14px;
          overflow: hidden;
          background-color: var(--bg-input);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
          flex-shrink: 0;
          box-shadow: 0 2px 8px var(--shadow-sm);
        }

        .featured-request-card__info {
          flex: 1;
          min-width: 0;
          box-sizing: border-box;
        }

        .featured-request-card__header {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 5px;
          width: 100%;
          box-sizing: border-box;
        }

        .featured-request-card__title {
          font-size: 0.95rem;
          font-weight: 800;
          font-family: 'Cairo', sans-serif;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.35;
          flex: 1 1 140px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }

        .featured-request-card__badge {
          flex-shrink: 0;
        }

        .featured-request-card__id {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          color: var(--text-muted);
          font-family: 'Cairo', sans-serif;
          background-color: var(--bg-input);
          padding: 2px 8px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
        }

        .featured-request-card__chevron {
          align-self: center;
          color: var(--primary-orange);
          opacity: 0.5;
          flex-shrink: 0;
        }

        .featured-request-card__meta {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          background-color: var(--bg-input);
          padding: 12px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 480px) {
          .featured-request-card__body {
            padding: 0.85rem;
            gap: 10px;
          }

          .featured-request-card__thumb {
            width: 48px;
            height: 48px;
            border-radius: 12px;
          }

          .featured-request-card__title {
            font-size: 0.88rem;
            flex: 1 1 100%;
          }

          .featured-request-card__header {
            gap: 6px;
          }

          .featured-request-card__chevron {
            display: none;
          }

          .featured-request-card__meta {
            gap: 6px;
            padding: 8px;
          }
        }

        @media (max-width: 380px) {
          .featured-request-card__body {
            padding: 0.75rem;
          }

          .featured-request-card__meta {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .featured-request-card__meta > *:nth-child(3) {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </motion.div>
  );
};

// ============================================
// Helper Component: Info Item
// ============================================
interface InfoItemProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  valueColor?: string;
}

const InfoItem = ({ Icon, label, value, valueColor }: InfoItemProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      minWidth: 0,
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--primary-orange)',
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <Icon size={12} />
    </div>
    <div
      style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}
    >
      <span
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.68rem',
          lineHeight: 1.1,
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: valueColor || 'var(--text-secondary)',
          fontWeight: 800,
          fontSize: '0.8rem',
          lineHeight: 1.25,
          fontFamily: 'Cairo, sans-serif',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </span>
    </div>
  </div>
);

export default FeaturedRequestCard;