import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaUserCheck,
  FaTrash,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaStar,
} from 'react-icons/fa';
import { formatRatingTime } from '../../../utils/ratingHelpers';
import { getStorageUrl } from '../../../utils/storageHelpers';
import type { Rating } from '../../../types';

interface AdminRatingCardProps {
  rating: Rating;
  onDelete: (rating: Rating) => void;
}

const getUserInitials = (name: string): string => {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};

const AdminRatingCard = ({ rating, onDelete }: AdminRatingCardProps) => {
  const raterInitials = getUserInitials(rating.rater?.name || '');
  const ratedInitials = getUserInitials(rating.rated?.name || '');

  // ✅ Use storage helper for both avatars
  const raterImage = getStorageUrl(rating.rater?.profile_image);
  const ratedImage = getStorageUrl(rating.rated?.profile_image);

  // Get rating color based on value
  const ratingColor =
    rating.rating >= 4
      ? '#28A745'
      : rating.rating === 3
      ? '#FFC107'
      : '#DC3545';

  const ratingBg =
    rating.rating >= 4
      ? 'rgba(40,167,69,0.08)'
      : rating.rating === 3
      ? 'rgba(255,193,7,0.1)'
      : 'rgba(220,53,69,0.08)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.25s ease',
        fontFamily: 'Cairo, sans-serif',
        overflow: 'hidden',
        minWidth: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.borderColor = `${ratingColor}50`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.03)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      {/* ============================================ */}
      {/* Users Row: Rater → Rated */}
      {/* ============================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '1rem',
          minWidth: 0,
          backgroundColor: 'var(--bg-input)',
          padding: '8px 10px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Rater */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: 0,
            flex: 1,
          }}
        >
          <Avatar
            imageUrl={raterImage}
            initials={raterInitials}
            isVerified={rating.rater?.is_verified}
            size={34}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2,
              }}
              title={rating.rater?.name}
            >
              {rating.rater?.name || 'مستخدم'}
            </div>
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.6rem',
                fontWeight: 600,
                opacity: 0.8,
              }}
            >
              المُقيِّم
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <FaArrowLeft size={9} color="var(--primary-orange)" />
        </div>

        {/* Rated */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: 0,
            flex: 1,
          }}
        >
          <Avatar
            imageUrl={ratedImage}
            initials={ratedInitials}
            isVerified={rating.rated?.is_verified}
            size={34}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2,
              }}
              title={rating.rated?.name}
            >
              {rating.rated?.name || 'مستخدم'}
            </div>
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.6rem',
                fontWeight: 600,
                opacity: 0.8,
              }}
            >
              المُقيَّم
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* Rating Value — prominent */}
      {/* ============================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '10px 14px',
          backgroundColor: ratingBg,
          borderRadius: '12px',
          border: `1px solid ${ratingColor}25`,
          marginBottom: '1rem',
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            direction: 'ltr',
            flexShrink: 0,
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={13}
              color={star <= rating.rating ? ratingColor : 'var(--border-color)'}
              style={{ opacity: star <= rating.rating ? 1 : 0.35 }}
            />
          ))}
        </div>

        <span
          style={{
            color: ratingColor,
            fontSize: '0.82rem',
            fontWeight: 800,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontVariantNumeric: 'tabular-nums',
            flexShrink: 0,
          }}
        >
          {rating.rating}.0 / 5
        </span>
      </div>

      {/* ============================================ */}
      {/* Comment (optional) */}
      {/* ============================================ */}
      {rating.comment && (
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '1rem',
            wordBreak: 'break-word',
          }}
          title={rating.comment}
        >
          "{rating.comment}"
        </div>
      )}

      {/* ============================================ */}
      {/* Footer: Time + Announcement + Delete */}
      {/* ============================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          marginTop: 'auto',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-color)',
          flexWrap: 'wrap',
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: 0,
            flex: 1,
          }}
        >
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.68rem',
              whiteSpace: 'nowrap',
              fontWeight: 600,
            }}
          >
            {formatRatingTime(rating.created_at)}
          </span>

          {rating.announcement && (
            <Link
              to={`/announcements/${rating.announcement.id}`}
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--text-muted)',
                fontSize: '0.68rem',
                textDecoration: 'none',
                minWidth: 0,
                overflow: 'hidden',
                transition: 'color 0.2s ease',
                fontWeight: 600,
              }}
              title={rating.announcement.title}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-orange)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <FaExternalLinkAlt size={8} style={{ flexShrink: 0 }} />
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '130px',
                }}
              >
                {rating.announcement.title}
              </span>
            </Link>
          )}
        </div>

        <motion.button
          type="button"
          onClick={() => onDelete(rating)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(220,53,69,0.3)',
            backgroundColor: 'rgba(220,53,69,0.06)',
            color: '#DC3545',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#DC3545';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(220,53,69,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.06)';
            e.currentTarget.style.color = '#DC3545';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaTrash size={10} />
          حذف
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============================================
// Avatar helper
// ============================================
const Avatar = ({
  imageUrl,
  initials,
  isVerified,
  size,
}: {
  imageUrl: string | null;
  initials: string;
  isVerified?: boolean;
  size: number;
}) => (
  <div style={{ position: 'relative', flexShrink: 0 }}>
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        background: imageUrl
          ? 'var(--bg-input)'
          : 'linear-gradient(135deg, #E87A20, #F5A623)',
        border: '2px solid var(--bg-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <span
          style={{
            color: '#FFFFFF',
            fontSize: `${Math.round(size * 0.36)}px`,
            fontWeight: 800,
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          {initials}
        </span>
      )}
    </div>
    {isVerified && (
      <div
        style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          width: `${Math.round(size * 0.42)}px`,
          height: `${Math.round(size * 0.42)}px`,
          borderRadius: '50%',
          backgroundColor: '#0d6efd',
          border: '2px solid var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 2px 4px rgba(13,110,253,0.3)',
        }}
        title="موثق"
      >
        <FaUserCheck size={Math.round(size * 0.22)} />
      </div>
    )}
  </div>
);

export default AdminRatingCard;