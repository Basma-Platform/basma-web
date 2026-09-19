import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUserCheck, FaEdit, FaTrash, FaClock } from 'react-icons/fa';
import StarRating from './StarRating';
import { formatRatingTime, formatRemainingEditTime } from '../../utils/ratingHelpers';
import type { Rating } from '../../types';

interface RatingCardProps {
  rating: Rating;
  /**
   * 'received' — shown on my reviews page (received tab) — shows the RATER
   * 'given' — shown on my reviews page (given tab) — shows the RATED
   * 'public' — shown on a public user profile — shows the RATER
   */
  variant?: 'received' | 'given' | 'public';
  onEdit?: (rating: Rating) => void;
  onDelete?: (rating: Rating) => void;
  showAnnouncement?: boolean;
}

// Extract initials (Arabic + English) for fallback avatar
const getUserInitials = (name: string): string => {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const RatingCard = ({
  rating,
  variant = 'public',
  onEdit,
  onDelete,
  showAnnouncement = true,
}: RatingCardProps) => {
  // Pick displayed user based on variant
  const displayedUser =
    variant === 'given' ? rating.rated : rating.rater;

  const hasEdit = variant === 'given' && rating.can_edit && onEdit;
  const hasDelete = variant === 'given' && rating.can_delete && onDelete;

  const profileImageUrl = displayedUser?.profile_image
    ? displayedUser.profile_image.startsWith('http')
      ? displayedUser.profile_image
      : `http://localhost:8000/storage/${displayedUser.profile_image}`
    : null;

  const initials = displayedUser ? getUserInitials(displayedUser.name) : 'U';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1rem 1.15rem',
        boxShadow: '0 2px 8px var(--shadow-sm)',
        fontFamily: 'Cairo, sans-serif',
        transition: 'all 0.25s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 20px var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px var(--shadow-sm)';
      }}
    >
      {/* Header: User + Stars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '10px',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            overflow: 'hidden',
            background: profileImageUrl
              ? 'var(--bg-input)'
              : 'linear-gradient(135deg, #E87A20, #F5A623)',
            border: '2px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={displayedUser?.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.style.background =
                    'linear-gradient(135deg, #E87A20, #F5A623)';
                  const span = document.createElement('span');
                  span.textContent = initials;
                  span.style.color = '#FFFFFF';
                  span.style.fontWeight = '800';
                  span.style.fontSize = '0.85rem';
                  span.style.fontFamily = 'Cairo, sans-serif';
                  parent.appendChild(span);
                }
              }}
            />
          ) : (
            <span
              style={{
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.85rem',
              }}
            >
              {initials}
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '4px',
              flexWrap: 'wrap',
            }}
          >
            {variant === 'given' && displayedUser && (
              <Link
                to={`/users/${displayedUser.id}`}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                }}
              >
                {displayedUser.name}
              </Link>
            )}
            {variant !== 'given' && (
              <span
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                }}
              >
                {displayedUser?.name || 'مستخدم'}
              </span>
            )}
            {displayedUser?.is_verified && (
              <span
                title="موثق"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '2px 8px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(40,167,69,0.15)',
                  color: '#28A745',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                }}
              >
                <FaUserCheck size={8} />
                موثق
              </span>
            )}
          </div>

          {/* Stars + Time */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <StarRating rating={rating.rating} size={13} />
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.7rem',
              }}
            >
              {formatRatingTime(rating.created_at)}
            </span>
          </div>
        </div>

        {/* Actions (given variant, within 24h) */}
        {(hasEdit || hasDelete) && (
          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            {hasEdit && (
              <button
                type="button"
                onClick={() => onEdit && onEdit(rating)}
                title="تعديل"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#17A2B8';
                  e.currentTarget.style.color = '#17A2B8';
                  e.currentTarget.style.backgroundColor =
                    'rgba(23,162,184,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <FaEdit size={12} />
              </button>
            )}
            {hasDelete && (
              <button
                type="button"
                onClick={() => onDelete && onDelete(rating)}
                title="حذف"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#DC3545';
                  e.currentTarget.style.color = '#DC3545';
                  e.currentTarget.style.backgroundColor =
                    'rgba(220,53,69,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <FaTrash size={11} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Comment */}
      {rating.comment && (
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: showAnnouncement && rating.announcement ? '8px' : 0,
            whiteSpace: 'pre-wrap',
          }}
        >
          "{rating.comment}"
        </div>
      )}

      {/* Announcement link */}
      {showAnnouncement && rating.announcement && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            paddingTop: rating.comment ? '4px' : 0,
          }}
        >
          <span>على إعلان:</span>
          <Link
            to={`/announcements/${rating.announcement.id}`}
            style={{
              color: 'var(--primary-orange)',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            {rating.announcement.title}
          </Link>
        </div>
      )}

      {/* Edit deadline indicator (given variant) */}
      {variant === 'given' &&
        rating.edit_deadline &&
        rating.can_edit && (
          <div
            style={{
              marginTop: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,193,7,0.1)',
              color: '#856404',
              fontSize: '0.68rem',
              fontWeight: 700,
            }}
          >
            <FaClock size={9} />
            {formatRemainingEditTime(rating.edit_deadline)}
          </div>
        )}
    </motion.div>
  );
};

export default RatingCard;