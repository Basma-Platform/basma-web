import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaEye,
  FaHeart,
  FaMapMarkerAlt,
  FaUserCheck,
  FaStar,
  FaUser,
  FaGift,
  FaHandsHelping,
  FaCheckCircle,
  FaExchangeAlt,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useCardBorderAnimation } from '../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../ui/AnimatedCardBorder';
import type { Announcement } from '../../types';
import { getStorageUrl } from '../../utils/storageHelpers';
import {
  isOwnAnnouncement,
  getOwnBadgeStyle,
} from '../../utils/announcementHelpers';

interface FeaturedCardProps {
  announcement: Announcement;
  onClick?: () => void;
}

const FeaturedCard = ({ announcement, onClick }: FeaturedCardProps) => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  // ✅ Border animation hook
  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
    triggerOnce: true,
  });

  const isOwn = isOwnAnnouncement(announcement, user?.id);
  const ownBadgeStyle = getOwnBadgeStyle(isDark);

  // ============================================
  // Price / Barter label
  // ============================================
  const getPriceOrBarterLabel = (): string => {
    if (announcement.price_type === 'paid') {
      return announcement.price ? `${announcement.price} شيكل` : 'مدفوع';
    }
    if (announcement.price_type === 'barter') {
      return 'مقايضة';
    }
    return '';
  };

  const coverImage =
    announcement.images && announcement.images.length > 0
      ? getStorageUrl(
          announcement.images[0].image_path,
          '/placeholder-image.png'
        ) || '/placeholder-image.png'
      : '/placeholder-image.png';

  const userAvatar = getStorageUrl(announcement.user?.profile_image);

  const isOffer = announcement.type === 'offer';
  const typeIcon = isOffer ? (
    <FaGift size={10} />
  ) : (
    <FaHandsHelping size={10} />
  );

  // Featured gold gradient
  const featuredGradient =
    'linear-gradient(90deg, #FFD700 0%, #E87A20 100%)';

  // ✅ Compute border color ONCE (avoids recreation)
  const borderColor = isOwn
    ? isDark
      ? 'rgba(32,201,224,0.5)'
      : 'rgba(23,162,184,0.35)'
    : isDrawn
    ? 'rgba(232, 122, 32, 0.9)'
    : 'rgba(255, 215, 0, 0.5)';

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
      {/* ✅ OUTER: owns ref + hover detection */}
      <div
        ref={attachRef}
        {...hoverHandlers}
        style={{ height: '100%' }}
      >
        {/* ✅ INNER: motion only — smooth, non-jarring lift */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 22,
            mass: 0.6,
          }}
          className="featured-card-wrapper"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '20px',
            overflow: 'hidden',

            // ✅ Single shadow source (only isDrawn)
            boxShadow: isDrawn
              ? '0 16px 40px rgba(232, 122, 32, 0.22)'
              : '0 10px 30px rgba(0, 0, 0, 0.12)',

            border: `1.5px solid ${borderColor}`,

            // ✅ Separate transitions per property — no more 'all'
            transition: [
              'box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              'border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            ].join(', '),

            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            willChange: 'transform, box-shadow',
          }}
        >
          {/* ✅ Animated TOP border */}
          <AnimatedCardBorder
            isDrawn={isDrawn}
            side="top"
            background={featuredGradient}
            drawFrom="start"
            height={3.5}
            duration={0.55}
            idleOpacity={0}
            rounded
            cardRadius={20}
          />

          {/* Featured Badge (top-right) */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background:
                'linear-gradient(135deg, #FFD700 0%, #E87A20 100%)',
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

          {/* "إعلانك" badge (top-left, owner only) */}
          {isOwn && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 10,
              }}
            >
              <span
                style={{
                  ...ownBadgeStyle,
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  fontFamily: 'Cairo, sans-serif',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaUser size={8} />
                إعلانك
              </span>
            </div>
          )}

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

            {/* Type Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                padding: '3px 10px',
                borderRadius: '8px',
                background: isOffer
                  ? 'linear-gradient(135deg, #28A745, #4FCB6E)'
                  : 'linear-gradient(135deg, #17A2B8, #20C9E0)',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 800,
                fontFamily: 'Cairo, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}
            >
              {typeIcon}
              {isOffer ? 'عرض' : 'طلب'}
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50px',
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Card Content */}
          <div
            style={{
              padding: '14px 16px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* User Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
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
              <FaMapMarkerAlt
                size={11}
                style={{ color: 'var(--primary-orange)' }}
              />
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
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
                gap: '6px',
              }}
            >
              {/* Price / Barter Badge */}
              <span
                style={{
                  backgroundColor:
                    announcement.price_type === 'paid'
                      ? 'rgba(232, 122, 32, 0.12)'
                      : 'rgba(156, 39, 176, 0.12)',
                  color:
                    announcement.price_type === 'paid'
                      ? 'var(--primary-orange)'
                      : '#9C27B0',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  fontFamily: 'Cairo, sans-serif',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                {announcement.price_type === 'barter' && (
                  <FaExchangeAlt size={9} />
                )}
                {getPriceOrBarterLabel()}
              </span>

              {/* Stats */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                {announcement.is_completed && (
                  <span
                    title="مكتمل"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      color: '#17A2B8',
                      fontSize: '0.7rem',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 700,
                    }}
                  >
                    <FaCheckCircle size={11} />
                  </span>
                )}

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
        </motion.div>
      </div>
    </Link>
  );
};

export default FeaturedCard;