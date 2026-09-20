import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaWhatsapp,
  FaCalendarAlt,
  FaEye,
  FaArrowLeft,
} from 'react-icons/fa';
import type { AdminVerificationRequest } from '../../../types';
import {
  getVerificationStatusLabel,
  getVerificationStatusColor,
  getVerificationStatusBg,
  formatVerificationDate,
} from '../../../utils/verificationHelpers';
import { getStorageUrl } from '../../../utils/storageHelpers';

interface AdminVerificationCardProps {
  request: AdminVerificationRequest;
}

// Extract up to 2 initials from full name (supports Arabic & English)
const getUserInitials = (name: string): string => {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};

const AdminVerificationCard = ({ request }: AdminVerificationCardProps) => {
  // Track whether the profile image failed to load
  const [imageError, setImageError] = useState(false);

  const statusColor = getVerificationStatusColor(request.status);
  const statusBg = getVerificationStatusBg(request.status);
  const statusLabel = getVerificationStatusLabel(request.status);

  // Profile image via global storage helper
  const profileImageUrl = getStorageUrl(request.user.profile_image);
  const idImageUrl = getStorageUrl(request.id_image_url);
  const userInitials = getUserInitials(request.user.name);

  const shouldShowImage = !!profileImageUrl && !imageError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100%' }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px var(--shadow-sm)',
          transition: 'all 0.3s ease',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px var(--shadow-md)';
          e.currentTarget.style.borderColor = statusColor + '60';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px var(--shadow-sm)';
          e.currentTarget.style.borderColor = 'var(--border-color)';
        }}
      >
        {/* Left status bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '4px',
            height: '100%',
            backgroundColor: statusColor,
            opacity: 0.8,
          }}
        />

        {/* Header: User Info */}
        <div
          style={{
            padding: '1rem 1.15rem 0.85rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          {/* Avatar with proper fallback */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: shouldShowImage
                ? 'var(--bg-input)'
                : 'linear-gradient(135deg, #E87A20, #F5A623)',
              border: '2px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {shouldShowImage ? (
              <img
                src={profileImageUrl!}
                alt={request.user.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={() => setImageError(true)}
              />
            ) : (
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  fontFamily: 'Cairo, sans-serif',
                  letterSpacing: '0.5px',
                  lineHeight: 1,
                }}
              >
                {userInitials}
              </span>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 800,
                fontFamily: 'Cairo, sans-serif',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginBottom: '3px',
              }}
            >
              {request.user.name}
            </div>
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.72rem',
                fontFamily: 'system-ui, sans-serif',
                direction: 'ltr',
                textAlign: 'right',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {request.user.email}
            </div>
          </div>

          {/* Status Pill */}
          <div
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: statusBg,
              color: statusColor,
              fontSize: '0.65rem',
              fontWeight: 800,
              fontFamily: 'Cairo, sans-serif',
              border: `1px solid ${statusColor}40`,
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {statusLabel}
          </div>
        </div>

        {/* Body: ID Image Preview */}
        <Link
          to={`/admin/verification/${request.id}`}
          style={{
            display: 'block',
            textDecoration: 'none',
            flex: 1,
            overflow: 'hidden',
            backgroundColor: 'var(--bg-input)',
            position: 'relative',
            minHeight: '160px',
          }}
        >
          {idImageUrl ? (
            <img
              src={idImageUrl}
              alt={`ID of ${request.user.name}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              لا توجد صورة
            </div>
          )}

          {/* Overlay on hover */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)',
              pointerEvents: 'none',
            }}
          />

          {/* Date Badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 9px',
              borderRadius: '6px',
              backgroundColor: 'rgba(0,0,0,0.65)',
              color: '#FFFFFF',
              fontSize: '0.65rem',
              fontFamily: 'Cairo, sans-serif',
              backdropFilter: 'blur(4px)',
            }}
          >
            <FaCalendarAlt size={9} />
            {formatVerificationDate(request.created_at)}
          </div>
        </Link>

        {/* Footer: WhatsApp + Actions */}
        <div
          style={{
            padding: '0.85rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              fontFamily: 'system-ui, sans-serif',
              direction: 'ltr',
              flex: 1,
              minWidth: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <FaWhatsapp size={11} color="#25D366" />
            {request.user.whatsapp}
          </div>

          <Link
            to={`/admin/verification/${request.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(232,122,32,0.08)',
              color: 'var(--primary-orange)',
              fontSize: '0.72rem',
              fontWeight: 700,
              fontFamily: 'Cairo, sans-serif',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.08)';
              e.currentTarget.style.color = 'var(--primary-orange)';
            }}
          >
            <FaEye size={10} />
            مراجعة
            <FaArrowLeft size={8} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminVerificationCard;