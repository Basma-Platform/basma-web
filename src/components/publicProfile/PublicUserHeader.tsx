import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUserCheck,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from 'react-icons/fa';
import { formatProfileDate } from '../../utils/profileHelpers';
import StarRating from '../ratings/StarRating';

interface PublicUserHeaderProps {
  user: {
    id: number;
    name: string;
    profile_image: string | null;
    is_verified: boolean;
    governorate?: { id: number; name: string } | null;
    city?: { id: number; name: string } | null;
    created_at: string;
  };
  averageRating: number;
  totalRatings: number;
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

const PublicUserHeader = ({
  user,
  averageRating,
  totalRatings,
}: PublicUserHeaderProps) => {
  const [imageError, setImageError] = useState(false);

  const profileImageUrl = user.profile_image
    ? user.profile_image.startsWith('http')
      ? user.profile_image
      : `http://localhost:8000/storage/${user.profile_image}`
    : null;

  const shouldShowImage = !!profileImageUrl && !imageError;
  const userInitials = getUserInitials(user.name);

  const regionText = (() => {
    if (user.governorate && user.city) {
      return `${user.governorate.name} - ${user.city.name}`;
    }
    return user.governorate?.name || user.city?.name || 'غير محدد';
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        padding: '2rem 1.5rem',
        boxShadow: '0 8px 32px var(--shadow-sm)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Cairo, sans-serif',
        textAlign: 'center',
      }}
      dir="rtl"
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: user.is_verified
            ? 'linear-gradient(135deg, rgba(40,167,69,0.18) 0%, rgba(40,167,69,0.05) 100%)'
            : 'linear-gradient(135deg, rgba(232,122,32,0.18) 0%, rgba(232,122,32,0.05) 100%)',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Avatar */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: shouldShowImage
                ? 'var(--bg-input)'
                : 'linear-gradient(135deg, #E87A20, #F5A623)',
              border: '4px solid var(--bg-card)',
              boxShadow: '0 12px 32px var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            {shouldShowImage ? (
              <img
                src={profileImageUrl!}
                alt={user.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setImageError(true)}
              />
            ) : (
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: '2.4rem',
                  fontWeight: 900,
                  letterSpacing: '1px',
                }}
              >
                {userInitials}
              </span>
            )}
          </motion.div>

          {user.is_verified && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.3,
                type: 'spring',
                stiffness: 300,
              }}
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#0d6efd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid var(--bg-card)',
                boxShadow: '0 4px 12px rgba(13,110,253,0.4)',
              }}
              title="حساب موثق"
            >
              <FaUserCheck size={14} color="#FFFFFF" />
            </motion.div>
          )}
        </div>

        {/* Name + Verified badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginTop: '1rem',
            marginBottom: '8px',
          }}
        >
          <h1
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1.4rem, 2.2vw, 1.75rem)',
              fontWeight: 900,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {user.name}
          </h1>

          {user.is_verified && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 12px',
                borderRadius: '12px',
                backgroundColor: 'rgba(13,110,253,0.15)',
                color: '#0d6efd',
                fontSize: '0.7rem',
                fontWeight: 800,
                border: '1px solid rgba(13,110,253,0.3)',
              }}
            >
              <FaUserCheck size={9} />
              موثق
            </span>
          )}
        </div>

        {/* Rating */}
        {totalRatings > 0 && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255,193,7,0.1)',
              border: '1px solid rgba(255,193,7,0.25)',
              marginBottom: '1rem',
            }}
          >
            <StarRating rating={averageRating} size={13} />
            <span
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 800,
                fontFamily:
                  "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {averageRating.toFixed(1)}
            </span>
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              ({totalRatings} {totalRatings === 1 ? 'تقييم' : 'تقييم'})
            </span>
          </div>
        )}

        {/* Meta info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginTop: totalRatings > 0 ? '0' : '1rem',
          }}
        >
          <MetaItem
            icon={<FaMapMarkerAlt size={12} />}
            value={regionText}
            color="var(--primary-orange)"
          />
          <MetaItem
            icon={<FaCalendarAlt size={12} />}
            value={formatProfileDate(user.created_at)}
            color="#17A2B8"
          />
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// Helper — label removed (was unused)
// ============================================
const MetaItem = ({
  icon,
  value,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  color: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: 'var(--text-muted)',
      fontSize: '0.8rem',
    }}
  >
    <span style={{ color, display: 'inline-flex' }}>{icon}</span>
    <span
      style={{
        fontWeight: 600,
        color: 'var(--text-secondary)',
      }}
    >
      {value}
    </span>
  </div>
);

export default PublicUserHeader;