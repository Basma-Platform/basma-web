import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaEye,
  FaLock,
  FaPlayCircle,
  FaClock,
} from 'react-icons/fa';
import type { HelpRequestPublic } from '../../../types';
import { getStorageUrl } from '../../../utils/storageHelpers';
import {
  formatHelpRequestTimeAgo,
  formatVideoDuration,
  FUND_THEME,
  HELP_REQUEST_VIDEO_PLACEHOLDER,
} from '../../../utils/helpRequestHelpers';

interface HelpRequestCardProps {
  request: HelpRequestPublic;
  onClick?: () => void;
}

/**
 * Public Help Request card.
 * Shows blurred thumbnail + region + stats + "video after inquiry" badge.
 * Used in: BasmaFundPage, HelpRequestGrid
 */
const HelpRequestCard = ({ request, onClick }: HelpRequestCardProps) => {
  const [imageError, setImageError] = useState(false);

  const thumbUrl = getStorageUrl(request.video.thumbnail_blurred_url);
  const showImage = !!thumbUrl && !imageError;

  return (
    <Link
      to={`/basma-fund/help-requests/${request.id}`}
      onClick={onClick}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '18px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          cursor: 'pointer',
          boxShadow: '0 4px 16px var(--shadow-sm)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          fontFamily: 'Cairo, sans-serif',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 14px 32px ${FUND_THEME.shadow}`;
          e.currentTarget.style.borderColor = FUND_THEME.accent;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 16px var(--shadow-sm)';
          e.currentTarget.style.borderColor = 'var(--border-color)';
        }}
      >
        {/* Thumbnail */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '170px',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-input)',
            flexShrink: 0,
          }}
        >
          {showImage ? (
            <img
              src={thumbUrl!}
              alt={request.public_title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(2px)', // extra blur on top of server-side blur
                transform: 'scale(1.05)', // hide blur edges
              }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  'linear-gradient(135deg, rgba(23,162,184,0.15), rgba(23,162,184,0.05))',
                color: FUND_THEME.accent,
              }}
            >
              <img
                src={HELP_REQUEST_VIDEO_PLACEHOLDER}
                alt=""
                style={{
                  width: '60px',
                  opacity: 0.35,
                }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <FaPlayCircle
                size={42}
                style={{ position: 'absolute', opacity: 0.6 }}
              />
            </div>
          )}

          {/* Dark overlay + play icon to reinforce "video" */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Duration badge (top-right) */}
          {request.video.duration_seconds != null && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontWeight: 700,
                fontFamily:
                  "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <FaClock size={9} />
              {formatVideoDuration(request.video.duration_seconds)}
            </div>
          )}

          {/* Video locked badge (bottom) */}
          {request.video.requires_inquiry && (
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(23,162,184,0.9)',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 700,
                backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}
            >
              <FaLock size={9} />
              الفيديو بعد الاستفسار
            </div>
          )}

          {/* Play icon center */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: FUND_THEME.accent,
                boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
              }}
            >
              <FaPlayCircle size={22} />
            </motion.div>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '14px 15px 15px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* Title */}
          <h4
            style={{
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.5em',
            }}
          >
            {request.public_title}
          </h4>

          {/* Region */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <FaMapMarkerAlt size={11} color={FUND_THEME.accent} />
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {request.region.governorate.name}
              {request.region.city?.name &&
                ` - ${request.region.city.name}`}
            </span>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '10px',
              borderTop: '1px solid var(--border-color)',
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
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaEye size={11} />
                {request.stats.views}
              </span>
            </div>

            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.68rem',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              {formatHelpRequestTimeAgo(request.published_at)}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default HelpRequestCard;