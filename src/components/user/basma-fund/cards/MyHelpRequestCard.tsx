import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaEye,
  FaHandHoldingHeart,
  FaMapMarkerAlt,
  FaTrash,
  FaClock,
  FaArrowLeft,
} from 'react-icons/fa';
import type { HelpRequestUser } from '../../../../types';
import { getStorageUrl } from '../../../../utils/storageHelpers';
import {
  formatHelpRequestTimeAgo,
  FUND_THEME,
} from '../../../../utils/helpRequestHelpers';
import HelpRequestStatusBadge from './HelpRequestStatusBadge';
import DeleteCountdownTimer from '../modals/DeleteCountdownTimer';
import { useCardBorderAnimation } from '../../../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../../../ui/AnimatedCardBorder';

interface MyHelpRequestCardProps {
  request: HelpRequestUser;
  onDelete?: (request: HelpRequestUser) => void;
}

/**
 * Card for a single help request in the owner's list.
 */
const MyHelpRequestCard = ({
  request,
  onDelete,
}: MyHelpRequestCardProps) => {
  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
    triggerOnce: true,
  });

  const thumbUrl = getStorageUrl(request.video_thumbnail_url);

  const canDelete = request.can_delete;
  const showCountdown =
    canDelete &&
    request.delete_deadline != null &&
    (request.delete_seconds_remaining ?? 0) > 0;

  return (
    <div
      ref={attachRef}
      {...hoverHandlers}
      style={{ height: '100%', minWidth: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'relative',
          backgroundColor: 'var(--bg-card)',
          border: `1px solid ${
            isDrawn ? FUND_THEME.accent : 'var(--border-color)'
          }`,
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxShadow: isDrawn
            ? `0 12px 28px ${FUND_THEME.shadow}`
            : '0 2px 10px var(--shadow-sm)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        {/* Top accent bar */}
        <AnimatedCardBorder
          isDrawn={isDrawn}
          side="top"
          background={FUND_THEME.gradient}
          drawFrom="start"
          height={3}
          duration={0.55}
          idleOpacity={0}
          rounded
          cardRadius={16}
        />

        {/* Thumbnail row */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            padding: '12px 12px 0',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-input)',
              flexShrink: 0,
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {thumbUrl ? (
              <img
                src={thumbUrl}
                alt={request.public_title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'blur(1.5px)',
                }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            ) : (
              <FaHandHoldingHeart
                size={20}
                color={FUND_THEME.accent}
                opacity={0.4}
              />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '5px',
                flexWrap: 'wrap',
              }}
            >
              <HelpRequestStatusBadge status={request.status} />
              {request.display_name_type !== 'full' && (
                <span
                  style={{
                    fontSize: '0.62rem',
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--bg-input)',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontWeight: 700,
                  }}
                >
                  مجهول
                </span>
              )}
            </div>
            <h4
              style={{
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {request.public_title}
            </h4>
          </div>
        </div>

        {/* Region + date */}
        <div
          style={{
            padding: '10px 14px 0',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: 600,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <FaMapMarkerAlt size={10} color={FUND_THEME.accent} />
            {request.region.governorate.name}
            {request.region.city?.name &&
              ` - ${request.region.city.name}`}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <FaClock size={10} />
            {formatHelpRequestTimeAgo(request.created_at)}
          </span>
        </div>

        {/* Delete countdown (only when within window) */}
        {showCountdown && (
          <div style={{ padding: '10px 14px 0' }}>
            <DeleteCountdownTimer
              deadline={request.delete_deadline}
              secondsRemaining={request.delete_seconds_remaining}
              compact
            />
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 'auto',
            padding: '12px 14px 14px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <FaEye size={11} />
              {request.views}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {canDelete && onDelete && (
              <motion.button
                type="button"
                onClick={() => onDelete(request)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="حذف"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid rgba(220,53,69,0.3)',
                  backgroundColor: 'rgba(220,53,69,0.06)',
                  color: '#DC3545',
                  cursor: 'pointer',
                }}
              >
                <FaTrash size={11} />
              </motion.button>
            )}

            <Link
              to={`/user/basma-fund/help-requests/${request.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 12px',
                borderRadius: '9px',
                backgroundColor: `${FUND_THEME.accent}12`,
                color: FUND_THEME.accent,
                textDecoration: 'none',
                fontSize: '0.72rem',
                fontWeight: 800,
                transition: 'all 0.2s ease',
              }}
            >
              التفاصيل
              <FaArrowLeft size={9} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MyHelpRequestCard;