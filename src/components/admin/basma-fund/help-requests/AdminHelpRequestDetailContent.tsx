import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaUserCheck,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaEye,
  FaVideo,
  FaLock,
  FaUnlock,
  FaHistory,
  FaBullhorn,
} from 'react-icons/fa';
import type { AdminHelpRequestDetail } from '../../../../types';
import {
  formatHelpRequestTimeAgo,
  FUND_THEME,
} from '../../../../utils/helpRequestHelpers';
import { getStorageUrl } from '../../../../utils/storageHelpers';
import AdminHelpRequestVideoPlayer from './AdminHelpRequestVideoPlayer';
import AdminHelpRequestEncryptedData from './AdminHelpRequestEncryptedData';
import AdminHelpRequestAccessLogs from './AdminHelpRequestAccessLogs';
import AdminVideoTokensList from '../video-tokens/AdminVideoTokensList';

type UnlockField = 'details' | 'contact' | 'region' | 'all';

interface AdminHelpRequestDetailContentProps {
  detail: AdminHelpRequestDetail;
  /** Managed by the parent page (single hook instance) */
  onUnlock: (
    id: number,
    field: UnlockField,
    reason: string
  ) => Promise<void>;
  isUnlocking?: boolean;
}

const AdminHelpRequestDetailContent = ({
  detail,
  onUnlock,
  isUnlocking = false,
}: AdminHelpRequestDetailContentProps) => {
  const avatarUrl = getStorageUrl(detail.user.profile_image);
  const thumbUrl = getStorageUrl(detail.video.thumbnail_url);

  const statusColor = (() => {
    switch (detail.status) {
      case 'approved':
        return '#28A745';
      case 'rejected':
        return '#DC3545';
      case 'archived':
        return '#6B4226';
      default:
        return '#FFB800';
    }
  })();

  const statusLabel = (() => {
    switch (detail.status) {
      case 'approved':
        return 'منشور';
      case 'rejected':
        return 'مرفوض';
      case 'archived':
        return 'مؤرشف';
      default:
        return 'قيد المراجعة';
    }
  })();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        fontFamily: 'Cairo, sans-serif',
      }}
      dir="rtl"
    >
      {/* ============================================ */}
      {/* Status banner */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 16px',
          borderRadius: '14px',
          backgroundColor: `${statusColor}10`,
          border: `1px solid ${statusColor}40`,
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${statusColor}, ${statusColor}cc)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0,
            boxShadow: `0 6px 16px ${statusColor}40`,
          }}
        >
          <FaBullhorn size={16} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: statusColor,
              fontSize: '0.95rem',
              fontWeight: 900,
              marginBottom: '3px',
            }}
          >
            {statusLabel}
          </div>
          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
            }}
          >
            {detail.status === 'pending'
              ? 'بحاجة إلى مراجعة واتخاذ قرار'
              : detail.reviewed_at
              ? `تمت المراجعة ${formatHelpRequestTimeAgo(detail.reviewed_at)}`
              : 'تمت المراجعة'}
          </div>
        </div>
        <div
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            opacity: 0.7,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          #{detail.id}
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* User section */}
      {/* ============================================ */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
        }}
      >
        <SectionTitle Icon={FaUser} title="صاحب الطلب" />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '56px',
              height: '56px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                background: avatarUrl
                  ? 'var(--bg-card)'
                  : 'linear-gradient(135deg, #17A2B8, #20C9E0)',
                border: '2px solid var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '1.1rem',
                fontWeight: 800,
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={detail.user.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              ) : (
                detail.user.name.charAt(0)
              )}
            </div>
            {detail.user.is_verified && (
              <span
                title="موثق"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#0d6efd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  border: '2px solid var(--bg-input)',
                }}
              >
                <FaUserCheck size={9} />
              </span>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.92rem',
                fontWeight: 800,
                marginBottom: '4px',
              }}
            >
              {detail.user.name}
            </div>
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.72rem',
                fontFamily: 'system-ui, sans-serif',
                direction: 'ltr',
                textAlign: 'right',
              }}
            >
              {detail.user.email}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '8px',
          }}
        >
          <InfoRow
            Icon={FaWhatsapp}
            label="واتساب"
            value={detail.user.whatsapp}
            color="#25D366"
            ltr
          />
        </div>

        <Link
          to={`/users/${detail.user.id}`}
          target="_blank"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '10px',
            padding: '8px 14px',
            borderRadius: '10px',
            backgroundColor: `${FUND_THEME.accent}08`,
            color: FUND_THEME.accent,
            fontSize: '0.75rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <FaUser size={10} />
          عرض الملف الشخصي
        </Link>
      </div>

      {/* ============================================ */}
      {/* Public info */}
      {/* ============================================ */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
        }}
      >
        <SectionTitle Icon={FaBullhorn} title="معلومات عامة" />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              fontWeight: 800,
              lineHeight: 1.4,
            }}
          >
            {detail.public_title}
          </div>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              lineHeight: 1.7,
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}
          >
            {detail.public_description}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '8px',
          }}
        >
          <InfoRow
            Icon={FaMapMarkerAlt}
            label="المنطقة"
            value={`${detail.region.governorate.name}${
              detail.region.city?.name
                ? ' - ' + detail.region.city.name
                : ''
            }`}
            color="#E87A20"
          />
          <InfoRow
            Icon={FaEye}
            label="المشاهدات"
            value={String(detail.stats.views)}
            color="#17A2B8"
          />
          <InfoRow
            Icon={FaVideo}
            label="مرات الوصول للفيديو"
            value={String(detail.stats.video_access_count ?? 0)}
            color="#6F42C1"
          />
        </div>
      </div>

      {/* ============================================ */}
      {/* Video */}
      {/* ============================================ */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
        }}
      >
        <SectionTitle Icon={FaVideo} title="الفيديو التوضيحي" />
        <AdminHelpRequestVideoPlayer
          helpRequestId={detail.id}
          thumbnailUrl={thumbUrl}
          durationSeconds={detail.video.duration_seconds}
          hasVideo={!!detail.video.stream_url}
        />
      </div>

      {/* ============================================ */}
      {/* Encrypted data */}
      {/* ============================================ */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
        }}
      >
        <SectionTitle
          Icon={detail.encrypted_unlocked ? FaUnlock : FaLock}
          title="البيانات الحساسة"
          color={detail.encrypted_unlocked ? '#28A745' : '#6F42C1'}
        />
        <AdminHelpRequestEncryptedData
	  helpRequestId={detail.id}
	  unlocked={detail.encrypted_unlocked}
	  encryptedFields={detail.encrypted_fields}
	  onUnlock={onUnlock}
	  isUnlocking={isUnlocking}
	/>
      </div>

      {/* ============================================ */}
      {/* Admin notes (when reviewed) */}
      {/* ============================================ */}
      {detail.status !== 'pending' && detail.admin_notes && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '14px',
            backgroundColor:
              detail.status === 'approved'
                ? 'rgba(40,167,69,0.06)'
                : detail.status === 'rejected'
                ? 'rgba(220,53,69,0.06)'
                : 'rgba(107,66,38,0.06)',
            border: `1px solid ${
              detail.status === 'approved'
                ? 'rgba(40,167,69,0.25)'
                : detail.status === 'rejected'
                ? 'rgba(220,53,69,0.25)'
                : 'rgba(107,66,38,0.25)'
            }`,
          }}
        >
          <SectionTitle
            Icon={FaHistory}
            title="ملاحظات الإدارة"
            color={
              detail.status === 'approved'
                ? '#28A745'
                : detail.status === 'rejected'
                ? '#DC3545'
                : '#6B4226'
            }
          />
          <div
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              padding: '10px 12px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {detail.admin_notes}
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* Access logs */}
      {/* ============================================ */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
        }}
      >
        <SectionTitle Icon={FaHistory} title="سجل النشاط" color="#6F42C1" />
        <AdminHelpRequestAccessLogs logs={detail.access_logs} />
      </div>

      {/* ============================================ */}
      {/* Video tokens */}
      {/* ============================================ */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
        }}
      >
        <AdminVideoTokensList helpRequestId={detail.id} />
      </div>
    </div>
  );
};

// ============================================
// Internal building blocks
// ============================================
const SectionTitle = ({
  Icon,
  title,
  color,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  color?: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px',
      color: color || 'var(--text-secondary)',
      fontSize: '0.85rem',
      fontWeight: 800,
      fontFamily: 'Cairo, sans-serif',
    }}
  >
    <div
      style={{
        width: '26px',
        height: '26px',
        borderRadius: '8px',
        backgroundColor: `${color || FUND_THEME.accent}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color || FUND_THEME.accent,
        flexShrink: 0,
      }}
    >
      <Icon size={12} />
    </div>
    {title}
  </div>
);

interface InfoRowProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  color: string;
  ltr?: boolean;
}

const InfoRow = ({ Icon, label, value, color, ltr }: InfoRowProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 12px',
      borderRadius: '10px',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
    }}
  >
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        backgroundColor: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
        flexShrink: 0,
      }}
    >
      <Icon size={12} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.65rem',
          marginBottom: '2px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.82rem',
          fontWeight: 800,
          direction: ltr ? 'ltr' : 'rtl',
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

export default AdminHelpRequestDetailContent;