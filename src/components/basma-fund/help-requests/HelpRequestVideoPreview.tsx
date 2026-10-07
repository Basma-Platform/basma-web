import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaPlayCircle,
  FaLock,
  FaClock,
  FaHandHoldingHeart,
} from 'react-icons/fa';
import type { HelpRequestPublic } from '../../../types';
import { getStorageUrl } from '../../../utils/storageHelpers';
import {
  FUND_THEME,
  formatVideoDuration,
  HELP_REQUEST_VIDEO_PLACEHOLDER,
} from '../../../utils/helpRequestHelpers';

interface HelpRequestVideoPreviewProps {
  request: HelpRequestPublic;
  onInquire: () => void;
}

const HelpRequestVideoPreview = ({
  request,
  onInquire,
}: HelpRequestVideoPreviewProps) => {
  const [imageError, setImageError] = useState(false);

  const thumbUrl = getStorageUrl(request.video.thumbnail_blurred_url);
  const showImage = !!thumbUrl && !imageError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        boxShadow: '0 8px 28px var(--shadow-md)',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {/* Thumbnail area */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          backgroundColor: 'var(--bg-input)',
          overflow: 'hidden',
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
              filter: 'blur(4px)',
              transform: 'scale(1.06)',
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
                'linear-gradient(135deg, rgba(23,162,184,0.2), rgba(23,162,184,0.06))',
            }}
          >
            <img
              src={HELP_REQUEST_VIDEO_PLACEHOLDER}
              alt=""
              style={{ width: '80px', opacity: 0.4 }}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
        )}

        {/* Dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Lock badge center */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '1rem',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.94)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: FUND_THEME.accent,
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            }}
          >
            <FaLock size={26} />
          </motion.div>

          <span
            style={{
              color: '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: 800,
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              maxWidth: '280px',
              lineHeight: 1.5,
            }}
          >
            الفيديو محمي — متاح بعد تقديم الاستفسار
          </span>
        </div>

        {/* Duration badge */}
        {request.video.duration_seconds != null && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(6px)',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 700,
              fontFamily:
                "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <FaClock size={10} />
            {formatVideoDuration(request.video.duration_seconds)}
          </div>
        )}

        {/* Play icon top-left (decorative) */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            borderRadius: '8px',
            backgroundColor: 'rgba(23,162,184,0.85)',
            backdropFilter: 'blur(6px)',
            color: '#FFFFFF',
            fontSize: '0.68rem',
            fontWeight: 700,
          }}
        >
          <FaPlayCircle size={11} />
          فيديو توضيحي
        </div>
      </div>

      {/* CTA area */}
      <div
        style={{
          padding: '1.25rem 1.35rem 1.35rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* ✅ Simplified note */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            lineHeight: 1.55,
          }}
        >
          <FaLock size={11} color={FUND_THEME.accent} />
          <span>
            قدّم استفسارك للحصول على رابط مشاهدة الفيديو{' '}
            <strong style={{ color: FUND_THEME.accent }}>
              مرة واحدة فقط
            </strong>
            .
          </span>
        </div>

        <motion.button
          type="button"
          onClick={onInquire}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            padding: '14px 22px',
            borderRadius: '14px',
            border: 'none',
            background: FUND_THEME.gradient,
            color: '#FFFFFF',
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: `0 8px 22px ${FUND_THEME.shadow}`,
            transition: 'all 0.2s ease',
          }}
        >
          <FaHandHoldingHeart size={15} />
          أريد التبرع لهذا الطلب
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HelpRequestVideoPreview;