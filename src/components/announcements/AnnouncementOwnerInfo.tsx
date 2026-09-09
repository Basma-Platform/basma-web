import { Badge } from 'react-bootstrap';
import { FaUser, FaStar, FaUserCheck, FaClock } from 'react-icons/fa';
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

  const formatDate = (date?: string) => {
    if (!date) return 'غير معروف';
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const userInitials = ownerName.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 4px 16px var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        transition: 'all 0.3s ease',
      }}
    >
      <h4
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          fontWeight: 700,
          fontFamily: 'Cairo, sans-serif',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <FaUser size={16} color="var(--primary-orange)" />
        معلومات المعلن
      </h4>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: isDark ? '#2a3a5a' : '#e8e0d8',
            border: '2px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary-orange)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={ownerName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('span');
                  fallback.style.cssText = `
                    color: var(--text-muted);
                    font-size: 18px;
                    font-weight: 700;
                    font-family: 'Cairo', sans-serif;
                  `;
                  fallback.textContent = userInitials;
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <span
              style={{
                color: isDark ? '#C49A6C' : '#8B5A2B',
                fontSize: '18px',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              {userInitials}
            </span>
          )}
        </div>

        <div>
          <div
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              fontWeight: 700,
              fontFamily: 'Cairo, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexWrap: 'wrap',
            }}
          >
            {ownerName}
            {isVerified && (
              <Badge
                style={{
                  backgroundColor: '#28A745',
                  color: '#FFFFFF',
                  fontSize: '0.45rem',
                  padding: '2px 10px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaUserCheck size={8} /> موثق
              </Badge>
            )}
          </div>
          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontFamily: 'Cairo, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <FaStar size={12} color="#F5A623" />
            {rating} ({ratingCount} تقييم)
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
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
              gap: '4px',
            }}
          >
            <FaClock size={12} />
            {formatDate(memberSince)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AnnouncementOwnerInfo;