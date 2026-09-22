import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCalendarAlt,
  FaEye,
  FaArrowLeft,
  FaIdCard,
  FaPassport,
  FaCar,
  FaGraduationCap,
  FaFile,
  FaLock,
} from 'react-icons/fa';
import type { AdminVerificationRequest, DocumentType } from '../../../types';
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

// ============================================
// Icon Mapping
// ============================================
const DOC_TYPE_ICONS: Record<DocumentType, React.ReactNode> = {
  national_id: <FaIdCard size={11} />,
  passport: <FaPassport size={11} />,
  driver_license: <FaCar size={11} />,
  university_card: <FaGraduationCap size={11} />,
  other: <FaFile size={11} />,
};

const getUserInitials = (name: string): string => {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const AdminVerificationCard = ({ request }: AdminVerificationCardProps) => {
  const [imageError, setImageError] = useState(false);

  const statusColor = getVerificationStatusColor(request.status);
  const statusBg = getVerificationStatusBg(request.status);
  const statusLabel = getVerificationStatusLabel(request.status);

  const profileImageUrl = getStorageUrl(request.user.profile_image);
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
      <Link
        to={`/admin/verification/${request.id}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          color: 'inherit',
          height: '100%',
        }}
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
            fontFamily: 'Cairo, sans-serif',
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
          {/* Left Status Bar */}
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

          {/* ============================================ */}
          {/* Header: User Info */}
          {/* ============================================ */}
          <div
            style={{
              padding: '1rem 1.15rem 0.85rem 1.15rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            {/* Avatar */}
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
                  fontSize: '0.7rem',
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
                border: `1px solid ${statusColor}40`,
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              {statusLabel}
            </div>
          </div>

          {/* ============================================ */}
          {/* Body: Document Type + Image Status */}
          {/* ============================================ */}
          <div
            style={{
              flex: 1,
              padding: '1rem 1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              backgroundColor: 'var(--bg-input)',
              minHeight: '120px',
            }}
          >
            {/* Document Type */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(232,122,32,0.1)',
                color: 'var(--primary-orange)',
                border: '1px solid rgba(232,122,32,0.2)',
                fontSize: '0.68rem',
                fontWeight: 700,
                alignSelf: 'flex-start',
              }}
            >
              {request.document_type && DOC_TYPE_ICONS[request.document_type]}
              {request.document_type_label || 'وثيقة'}
            </div>

            {/* Image Status */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: request.has_image
                  ? 'rgba(40,167,69,0.06)'
                  : 'rgba(108,117,125,0.06)',
                border: `1px solid ${
                  request.has_image
                    ? 'rgba(40,167,69,0.2)'
                    : 'rgba(108,117,125,0.2)'
                }`,
                marginTop: 'auto',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: request.has_image
                    ? 'rgba(40,167,69,0.15)'
                    : 'rgba(108,117,125,0.12)',
                  color: request.has_image ? '#28A745' : '#6C757D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {request.has_image ? <FaLock size={11} /> : <FaEye size={11} />}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    color: request.has_image ? '#28A745' : 'var(--text-muted)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {request.has_image ? 'صورة محمية' : 'الصورة محذوفة'}
                </div>
                {request.has_image && (
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.62rem',
                      fontWeight: 500,
                    }}
                  >
                    سيتم تسجيل كل مشاهدة
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* Footer */}
          {/* ============================================ */}
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
                fontSize: '0.7rem',
                flex: 1,
                minWidth: 0,
              }}
            >
              <FaCalendarAlt size={10} />
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {formatVerificationDate(request.created_at)}
              </span>
            </div>

            <div
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
                flexShrink: 0,
                transition: 'all 0.2s ease',
              }}
            >
              <FaEye size={10} />
              مراجعة
              <FaArrowLeft size={8} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AdminVerificationCard;