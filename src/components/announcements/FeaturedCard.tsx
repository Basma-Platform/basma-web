import { Link } from 'react-router-dom';
import { FaEye, FaHeart, FaMapMarkerAlt, FaUserCheck, FaStar, FaUser } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import type { Announcement } from '../../types';
import { isOwnAnnouncement, getOwnBadgeStyle } from '../../utils/announcementHelpers';

interface FeaturedCardProps {
  announcement: Announcement;
  onClick?: () => void;
}

const FeaturedCard = ({ announcement, onClick }: FeaturedCardProps) => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  // ✅ Owner check
  const isOwn = isOwnAnnouncement(announcement, user?.id);
  const ownBadgeStyle = getOwnBadgeStyle(isDark);

  // ✅ Real rating values
  const ratingValue = announcement.user?.average_rating ?? 0;
  const ratingCount = announcement.user?.total_ratings ?? 0;
  const hasRating = ratingCount > 0;

  const getPriceLabel = () => {
    switch (announcement.price_type) {
      case 'free':
        return 'مجاني';
      case 'paid':
        return `${announcement.price} شيكل`;
      case 'barter':
        return 'مقايضة';
      default:
        return 'مجاني';
    }
  };

  const coverImage =
    announcement.images && announcement.images.length > 0
      ? `http://localhost:8000/storage/${announcement.images[0].image_path}`
      : '/placeholder-image.png';

  return (
    <Link
      to={`/announcements/${announcement.id}`}
      onClick={onClick}
      style={{
        textDecoration: 'none',
        display: 'block',
        width: '280px',
        flexShrink: 0,
      }}
    >
      <div
        className="featured-card-wrapper"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
          border: isOwn
            ? `1.5px solid ${isDark ? 'rgba(32,201,224,0.6)' : 'rgba(23,162,184,0.45)'}`
            : '1.5px solid rgba(255, 215, 0, 0.5)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
          e.currentTarget.style.boxShadow = isOwn
            ? '0 18px 45px rgba(23, 162, 184, 0.3)'
            : '0 18px 45px rgba(232, 122, 32, 0.25)';
          e.currentTarget.style.borderColor = isOwn
            ? isDark
              ? '#20C9E0'
              : '#17A2B8'
            : '#E87A20';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.12)';
          e.currentTarget.style.borderColor = isOwn
            ? isDark
              ? 'rgba(32,201,224,0.6)'
              : 'rgba(23,162,184,0.45)'
            : 'rgba(255, 215, 0, 0.5)';
        }}
      >
        {/* Featured Badge — top-right */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'linear-gradient(135deg, #FFD700 0%, #E87A20 100%)',
            color: '#FFFFFF',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: 800,
            fontFamily: 'Cairo, sans-serif',
            zIndex: 5,
            boxShadow: '0 4px 14px rgba(232, 122, 32, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            letterSpacing: '0.3px',
          }}
        >
          <FaStar size={10} color="#FFFFFF" /> مميز
        </div>

        {/* ✅ NEW: "إعلانك" badge — top-left */}
        {isOwn && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 6,
            }}
          >
            <span
              style={{
                ...ownBadgeStyle,
                padding: '4px 11px',
                borderRadius: '8px',
                fontSize: '0.62rem',
                fontWeight: 800,
                fontFamily: 'Cairo, sans-serif',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <FaUser size={8} />
              إعلانك
            </span>
          </div>
        )}

        {/* Image */}
        <div
          style={{
            width: '100%',
            height: '150px',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-input)',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <img
            src={coverImage}
            alt={announcement.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.png';
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: 'rgba(232, 122, 32, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--primary-orange)',
                flexShrink: 0,
                border: '1px solid rgba(232, 122, 32, 0.3)',
              }}
            >
              {announcement.user?.profile_image ? (
                <img
                  src={`http://localhost:8000/storage/${announcement.user.profile_image}`}
                  alt={announcement.user.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                announcement.user?.name?.charAt(0).toUpperCase() || 'م'
              )}
            </div>
            <span
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                minWidth: 0,
              }}
            >
              {announcement.user?.name || 'مستخدم'}
              {announcement.user?.is_verified && (
                <FaUserCheck size={11} color="#28A745" style={{ flexShrink: 0 }} />
              )}
            </span>

            {hasRating && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  color: '#F5A623',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontVariantNumeric: 'tabular-nums',
                  flexShrink: 0,
                  padding: '2px 6px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 193, 7, 0.12)',
                }}
              >
                <FaStar size={10} />
                {ratingValue.toFixed(1)}
              </span>
            )}
          </div>

          {/* Title */}
          <h4
            style={{
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 800,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '6px',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.5em',
            }}
          >
            {announcement.title}
          </h4>

          {/* Location */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: 'var(--text-muted)',
              fontSize: '0.7rem',
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '10px',
            }}
          >
            <FaMapMarkerAlt size={11} style={{ color: 'var(--primary-orange)' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {announcement.governorate?.name}
              {announcement.city?.name && ` - ${announcement.city.name}`}
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
            }}
          >
            <span
              style={{
                backgroundColor:
                  announcement.price_type === 'free'
                    ? 'rgba(40, 167, 69, 0.12)'
                    : 'rgba(232, 122, 32, 0.12)',
                color:
                  announcement.price_type === 'free'
                    ? '#28A745'
                    : 'var(--primary-orange)',
                padding: '3px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 800,
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              {getPriceLabel()}
            </span>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--text-muted)',
                  fontSize: '0.7rem',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <FaHeart size={11} color="#DC3545" />
                {announcement.likes_count || 0}
              </span>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--text-muted)',
                  fontSize: '0.7rem',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <FaEye size={11} />
                {announcement.views || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedCard;