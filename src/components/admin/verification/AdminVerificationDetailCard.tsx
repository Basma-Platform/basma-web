import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaEye,
  FaInfoCircle,
} from 'react-icons/fa';
import type { AdminVerificationDetail } from '../../../types';
import {
  getVerificationStatusLabel,
  getVerificationStatusColor,
  getVerificationStatusBg,
  formatVerificationDate,
} from '../../../utils/verificationHelpers';
import { getStorageUrl } from '../../../utils/storageHelpers';

interface AdminVerificationDetailCardProps {
  request: AdminVerificationDetail;
  onViewImage: () => void;
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

const AdminVerificationDetailCard = ({
  request,
  onViewImage,
}: AdminVerificationDetailCardProps) => {
  const [profileImageError, setProfileImageError] = useState(false);

  const statusColor = getVerificationStatusColor(request.status);
  const statusBg = getVerificationStatusBg(request.status);
  const statusLabel = getVerificationStatusLabel(request.status);

  // ✅ Profile image via global storage helper
  const profileImageUrl = getStorageUrl(request.user?.profile_image);

  const idImageUrl = getStorageUrl(request.id_image_url);

  const userInitials = getUserInitials(request.user?.name || '');
  const shouldShowImage = !!profileImageUrl && !profileImageError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      dir="rtl"
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '1.5rem',
          boxShadow: '0 4px 20px var(--shadow-sm)',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        {/* Header: User Info + Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '14px',
            marginBottom: '1.25rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-color)',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* Avatar with proper fallback */}
            <div
              style={{
                width: '64px',
                height: '64px',
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
                boxShadow: shouldShowImage
                  ? 'none'
                  : '0 4px 12px rgba(232,122,32,0.3)',
              }}
            >
              {shouldShowImage ? (
                <img
                  src={profileImageUrl!}
                  alt={request.user?.name || 'User'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={() => setProfileImageError(true)}
                />
              ) : (
                <span
                  style={{
                    color: '#FFFFFF',
                    fontSize: '1.3rem',
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

            {/* Info */}
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <span>{request.user?.name}</span>
                {request.user?.is_verified && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(40,167,69,0.15)',
                      color: '#28A745',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                    }}
                  >
                    <FaCheckCircle size={9} />
                    موثق
                  </span>
                )}
              </div>
              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontFamily: 'system-ui, sans-serif',
                  direction: 'ltr',
                  textAlign: 'right',
                }}
              >
                {request.user?.email}
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              backgroundColor: statusBg,
              color: statusColor,
              fontSize: '0.78rem',
              fontWeight: 800,
              border: `1px solid ${statusColor}40`,
              flexShrink: 0,
            }}
          >
            {statusLabel}
          </div>
        </div>

        {/* User Contact Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
            marginBottom: '1.25rem',
          }}
        >
          <InfoItem
            icon={<FaWhatsapp size={13} />}
            iconColor="#25D366"
            label="واتساب"
            value={request.user?.whatsapp || '-'}
            dir="ltr"
          />
          {(request.user?.governorate || request.user?.city) && (
            <InfoItem
              icon={<FaMapMarkerAlt size={13} />}
              iconColor="var(--primary-orange)"
              label="المنطقة"
              value={
                request.user?.governorate && request.user?.city
                  ? `${request.user.governorate.name} - ${request.user.city.name}`
                  : request.user?.governorate?.name ||
                    request.user?.city?.name ||
                    ''
              }
            />
          )}
          <InfoItem
            icon={<FaCalendarAlt size={13} />}
            iconColor="#17A2B8"
            label="تاريخ الرفع"
            value={formatVerificationDate(request.created_at)}
          />
          {request.reviewed_at && (
            <InfoItem
              icon={<FaClock size={13} />}
              iconColor="#28A745"
              label="تاريخ المراجعة"
              value={formatVerificationDate(request.reviewed_at)}
            />
          )}
        </div>

        {/* ID Image Preview Block */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: 'var(--text-secondary)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FaUser size={13} color="var(--primary-orange)" />
            صورة الهوية
          </div>

          <motion.div
            whileHover={{ scale: 1.005 }}
            onClick={onViewImage}
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              cursor: 'zoom-in',
              maxHeight: '420px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {idImageUrl ? (
              <img
                src={idImageUrl}
                alt="ID Document"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '420px',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            ) : (
              <div
                style={{
                  padding: '3rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                }}
              >
                لا توجد صورة
              </div>
            )}

            {/* Zoom overlay badge */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                padding: '6px 12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(0,0,0,0.65)',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <FaEye size={11} />
              اضغط للتكبير
            </div>
          </motion.div>
        </div>

        {/* Admin Notes */}
        {request.admin_notes && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor:
                request.status === 'rejected'
                  ? 'rgba(220,53,69,0.06)'
                  : 'rgba(40,167,69,0.06)',
              border: `1px solid ${
                request.status === 'rejected'
                  ? 'rgba(220,53,69,0.2)'
                  : 'rgba(40,167,69,0.2)'
              }`,
              marginBottom: '1rem',
            }}
          >
            <FaInfoCircle
              size={13}
              color={request.status === 'rejected' ? '#DC3545' : '#28A745'}
              style={{ flexShrink: 0, marginTop: '2px' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color:
                    request.status === 'rejected' ? '#DC3545' : '#28A745',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  marginBottom: '3px',
                }}
              >
                {request.status === 'rejected'
                  ? 'سبب الرفض'
                  : 'ملاحظات الإدارة'}
              </div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  lineHeight: 1.6,
                }}
              >
                {request.admin_notes}
              </div>
            </div>
          </div>
        )}

        {/* Reviewed By */}
        {request.reviewed_by && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              paddingTop: '10px',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <FaUser size={10} />
            تمت المراجعة بواسطة:{' '}
            <strong style={{ color: 'var(--text-secondary)' }}>
              {request.reviewed_by.name}
            </strong>
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface InfoItemProps {
  icon: React.ReactNode;
  iconColor?: string;
  label: string;
  value: string;
  dir?: 'ltr' | 'rtl';
}

const InfoItem = ({
  icon,
  iconColor,
  label,
  value,
  dir = 'rtl',
}: InfoItemProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      backgroundColor: 'var(--bg-input)',
      borderRadius: '10px',
      border: '1px solid var(--border-color)',
    }}
  >
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: iconColor || 'var(--primary-orange)',
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.68rem',
          marginBottom: '2px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.8rem',
          fontWeight: 600,
          fontFamily:
            dir === 'ltr' ? 'system-ui, sans-serif' : 'Cairo, sans-serif',
          direction: dir,
          textAlign: 'right',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </div>
    </div>
  </div>
);

export default AdminVerificationDetailCard;