import { useState } from 'react';
import { Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaStar,
  FaUserCheck,
  FaClock,
  FaShieldAlt,
  FaArrowLeft,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

interface AnnouncementOwnerInfoProps {
  ownerName: string;
  isVerified: boolean;
  avatarUrl: string | null;
  rating?: number;
  ratingCount?: number;
  memberSince?: string;
  userId?: number;
  onViewProfile?: () => void;
}

// Extract up to 2 initials (Arabic + English friendly)
const getUserInitials = (name: string): string => {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const AnnouncementOwnerInfo = ({
  ownerName,
  isVerified,
  avatarUrl,
  rating = 0,
  ratingCount = 0,
  memberSince,
  userId,
  onViewProfile,
}: AnnouncementOwnerInfoProps) => {
  const navigate = useNavigate();
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

  const userInitials = getUserInitials(ownerName);

  const handleViewProfile = () => {
    if (onViewProfile) onViewProfile();
    else if (userId) navigate(`/users/${userId}`);
  };

  const clickable = !!userId || !!onViewProfile;
  const showImage = !!avatarUrl && !imgError;

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
        fontFamily: 'Cairo, sans-serif',
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
      {/* Header */}
      <h4
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          fontWeight: 700,
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '1rem',
        }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: showImage
                ? 'var(--bg-input)'
                : 'linear-gradient(135deg, #E87A20, #F5A623)',
              border: '2px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border-color 0.3s ease',
            }}
          >
            {showImage ? (
              <img
                src={avatarUrl!}
                alt={ownerName}
                onError={() => setImgError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: '20px',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                }}
              >
                {userInitials}
              </span>
            )}
          </div>

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

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            minWidth: 0,
            flex: 1,
          }}
        >
          <div
            style={{
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              lineHeight: 1.2,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '160px',
              }}
            >
              {ownerName}
            </span>
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
                }}
              >
                <FaShieldAlt size={9} color="#FFFFFF" />
                موثق
              </Badge>
            )}
          </div>

          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#F5A623',
                fontWeight: 700,
              }}
            >
              <FaStar size={12} />
              <span>{rating.toFixed(1)}</span>
            </div>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>({ratingCount} تقييم)</span>
          </div>
        </div>
      </div>

      {/* View Profile Button */}
      {clickable && (
        <button
          type="button"
          onClick={handleViewProfile}
          style={{
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '10px',
            border: '1.5px solid rgba(232,122,32,0.35)',
            backgroundColor: 'rgba(232,122,32,0.06)',
            color: 'var(--primary-orange)',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '0.85rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.06)';
            e.currentTarget.style.color = 'var(--primary-orange)';
          }}
        >
          <FaUser size={11} />
          عرض الملف الشخصي
          <FaArrowLeft size={9} />
        </button>
      )}

      {/* Footer meta */}
      <div
        style={{
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