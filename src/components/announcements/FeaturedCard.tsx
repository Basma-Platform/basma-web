import { Link } from 'react-router-dom';
import { FaEye, FaHeart, FaMapMarkerAlt, FaUserCheck, FaStar } from 'react-icons/fa';
import type { Announcement } from '../../types';
import { getStorageUrl } from '../../utils/storageHelpers';

interface FeaturedCardProps {
  announcement: Announcement;
  onClick?: () => void;
}

const FeaturedCard = ({ announcement, onClick }: FeaturedCardProps) => {
  const getPriceLabel = () => {
    switch (announcement.price_type) {
      case 'free': return 'مجاني';
      case 'paid': return `${announcement.price} شيكل`;
      case 'barter': return 'مقايضة';
      default: return 'مجاني';
    }
  };

  // ✅ Cover image via global helper
  const coverImage =
    announcement.images && announcement.images.length > 0
      ? getStorageUrl(announcement.images[0].image_path, '/placeholder-image.png') ||
        '/placeholder-image.png'
      : '/placeholder-image.png';

  // ✅ User avatar via global helper
  const userAvatar = getStorageUrl(announcement.user?.profile_image);

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
          border: '1.5px solid rgba(255, 215, 0, 0.5)',
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
          e.currentTarget.style.boxShadow = '0 18px 45px rgba(232, 122, 32, 0.25)';
          e.currentTarget.style.borderColor = '#E87A20';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.12)';
          e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.5)';
        }}
      >
        {/* Featured Badge */}
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

        {/* Image Container */}
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

        {/* Card Content */}
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
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={announcement.user?.name || 'مستخدم'}
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
              }}
            >
              {announcement.user?.name || 'مستخدم'}
              {announcement.user?.is_verified && (
                <FaUserCheck size={11} color="#28A745" />
              )}
            </span>
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
                backgroundColor: announcement.price_type === 'free' ? 'rgba(40, 167, 69, 0.12)' : 'rgba(232, 122, 32, 0.12)',
                color: announcement.price_type === 'free' ? '#28A745' : 'var(--primary-orange)',
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