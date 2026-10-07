import { motion } from 'framer-motion';
import {
  FaHistory,
  FaVideo,
  FaUnlock,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
} from 'react-icons/fa';
import type { AdminHelpRequestAccessLog } from '../../../../types';

interface AdminHelpRequestAccessLogsProps {
  logs: AdminHelpRequestAccessLog[];
}

const STATUS_COLORS: Record<string, string> = {
  success: '#28A745',
  denied: '#DC3545',
  expired: '#FFB800',
  revoked: '#6B4226',
};

const getActionIcon = (actionType: string) => {
  switch (actionType) {
    case 'view_video':
      return FaVideo;
    case 'view_all_encrypted':
      return FaUnlock;
    case 'approve_request':
    case 'reject_request':
    case 'archive_request':
      return FaCheckCircle;
    default:
      return FaInfoCircle;
  }
};

const getActionLabel = (actionType: string): string => {
  const map: Record<string, string> = {
    view_video: 'مشاهدة الفيديو',
    view_all_encrypted: 'فك تشفير البيانات',
    approve_request: 'الموافقة على الطلب',
    reject_request: 'رفض الطلب',
    archive_request: 'أرشفة الطلب',
    generate_video_token: 'توليد رابط فيديو',
    revoke_video_token: 'إلغاء رابط فيديو',
  };
  return map[actionType] || actionType;
};

const AdminHelpRequestAccessLogs = ({
  logs,
}: AdminHelpRequestAccessLogsProps) => {
  if (!logs || logs.length === 0) {
    return (
      <div
        style={{
          padding: '1.5rem',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-input)',
          border: '1px dashed var(--border-color)',
          textAlign: 'center',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <FaHistory size={26} opacity={0.4} color="var(--text-muted)" />
        <div
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            marginTop: '10px',
          }}
        >
          لا توجد سجلات وصول حتى الآن
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {logs.map((log, idx) => {
        const Icon = getActionIcon(log.action_type);
        const color = STATUS_COLORS[log.status] || '#6C757D';

        return (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.03 }}
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-input)',
              border: `1px solid var(--border-color)`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                backgroundColor: `${color}18`,
                color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={12} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                  }}
                >
                  {getActionLabel(log.action_type)}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: `${color}15`,
                    color,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                  }}
                >
                  {log.status === 'success' ? (
                    <FaCheckCircle size={8} />
                  ) : (
                    <FaTimesCircle size={8} />
                  )}
                  {log.status === 'success'
                    ? 'نجح'
                    : log.status === 'denied'
                    ? 'مرفوض'
                    : log.status === 'expired'
                    ? 'منتهي'
                    : 'ملغى'}
                </span>
              </div>

              {log.admin && (
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.72rem',
                    marginBottom: '3px',
                  }}
                >
                  بواسطة: {log.admin.name}
                </div>
              )}

              {log.reason && (
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.72rem',
                    lineHeight: 1.5,
                  }}
                >
                  السبب: {log.reason}
                </div>
              )}

              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.65rem',
                  marginTop: '4px',
                  opacity: 0.75,
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                {new Date(log.accessed_at).toLocaleString('ar-EG', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                — {log.ip_address}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AdminHelpRequestAccessLogs;