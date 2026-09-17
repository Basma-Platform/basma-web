import { useState } from 'react';
import { Badge } from 'react-bootstrap';
import { FaUser, FaStar, FaUserCheck, FaClock, FaShieldAlt } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

interface AnnouncementOwnerInfoProps {
  ownerName: string;
  isVerified: boolean;
  avatarUrl: string | null;
  rating?: number;
  ratingCount?: number;
  memberSince?: string;
}

const AnnouncementOwnerInfo = ({
  ownerName,
  isVerified,
  avatarUrl,
  rating = 4.8,
  ratingCount = 12,
  memberSince,
}: AnnouncementOwnerInfoProps) => {
  const { isDark } = useTheme();
  const [imgError, setImgError] = useState(false);

  const formatDate = (date?: string) => {
    if (!date) return 'غير معروف';
    try {
      return new Date(date).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'غير معروف';
    }
  };

  const userInitials = ownerName ? ownerName.trim().charAt(0).toUpperCase() : 'U';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 4px 16px var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        willChange: 'box-shadow, border-color',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px var(--shadow-md)';
        e.currentTarget.style.borderColor = 'rgba(232, 122, 32, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      {/* Header Title */}
      <h4
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          fontWeight: 700,
          fontFamily: 'Cairo, sans-serif',
          marginBottom: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <FaUser size={15} color="var(--primary-orange)" />
        معلومات المعلن
      </h4>

      {/* Owner Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1rem' }}>
        {/* Avatar Container with Blue Verification Indicator */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: isDark ? '#2a3a5a' : '#f0e6dd',
              border: '2px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border-color 0.3s ease',
            }}
          >
            {avatarUrl && !imgError ? (
              <img
                src={avatarUrl}
                alt={ownerName}
                onError={() => setImgError(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <span
                style={{
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontSize: '20px',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                {userInitials}
              </span>
            )}
          </div>

          {/* Verification Badge Icon Overlay (Solid Blue + White Icon) */}
          {isVerified && (
            <span
              title="حساب موثق"
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                backgroundColor: '#0d6efd',
                color: '#FFFFFF',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-card)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              }}
            >
              <FaUserCheck size={9} color="#FFFFFF" />
            </span>
          )}
        </div>

        {/* Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div
            style={{
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: 700,
              fontFamily: 'Cairo, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              lineHeight: 1.2,
            }}
          >
            <span>{ownerName}</span>
            {isVerified && (
              <Badge
                style={{
                  backgroundColor: '#0d6efd',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <FaShieldAlt size={9} color="#FFFFFF" /> موثق
              </Badge>
            )}
          </div>

          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              fontFamily: 'Cairo, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F5A623', fontWeight: 700 }}>
              <FaStar size={12} />
              <span>{rating}</span>
            </div>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>({ratingCount} تقييم)</span>
          </div>
        </div>
      </div>

      {/* Footer Meta Details */}
      <div
        style={{
          marginTop: '1rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <span>عضو منذ</span>
          <span
            style={{
              color: 'var(--text-secondary)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FaClock size={12} style={{ opacity: 0.7 }} />
            {formatDate(memberSince)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AnnouncementOwnerInfo;