import { motion } from 'framer-motion';
import {
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaUser,
  FaEnvelope,
  FaWhatsapp,
  FaCalendarAlt,
  FaUserShield,
  FaHourglassHalf,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { AdminVideoTokenListItem } from '../../../../types';
import {
  formatTokenExpiry,
  getTokenTimeRemaining,
} from '../../../../utils/videoTokenHelpers';

interface AdminVideoTokenCardProps {
  token: AdminVideoTokenListItem;
  onRevoke?: (token: AdminVideoTokenListItem) => void;
  onViewAccessLog?: (token: AdminVideoTokenListItem) => void;
}

const AdminVideoTokenCard = ({
  token,
  onRevoke,
  onViewAccessLog,
}: AdminVideoTokenCardProps) => {
  // ============================================
  // Status
  // ============================================
  const isRevoked = token.is_revoked;
  const isUsed = token.views_used >= 1;
  const isExpired = new Date(token.expires_at).getTime() < Date.now();

  const canRevoke = !isRevoked && !isUsed && !isExpired;

  const statusConfig: {
    label: string;
    color: string;
    Icon: IconType;
  } = (() => {
    if (isRevoked) return { label: 'ملغى', color: '#6C757D', Icon: FaBan };
    if (isUsed) return { label: 'مستخدم', color: '#17A2B8', Icon: FaCheckCircle };
    if (isExpired) return { label: 'منتهي', color: '#DC3545', Icon: FaTimesCircle };
    return { label: 'نشط', color: '#28A745', Icon: FaCheckCircle };
  })();

  const StatusIcon = statusConfig.Icon;

  // Safe recipient access
  const recipient = token.recipient ?? null;
  const recipientName = recipient?.name ?? null;
  const recipientEmail = recipient?.email ?? null;
  const recipientWhatsapp = recipient?.whatsapp ?? null;
  const hasRecipient = recipientName || recipientEmail || recipientWhatsapp;

  // Safe date rendering
  const remainingText = isRevoked
    ? '—'
    : isExpired
    ? 'منتهي'
    : getTokenTimeRemaining(token.expires_at);

  const expiryFullText = formatTokenExpiry(token.expires_at);

  // Safe type label
  const typeLabel =
    token.issued_to_type_label ||
    (token.issued_to_type === 'donor_inquiry'
      ? 'استفسار متبرع'
      : 'رابط إداري');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="admin-vtc"
      style={{
        borderColor: statusConfig.color + '30',
      }}
    >
      {/* ============================================ */}
      {/* Header: type + status + id */}
      {/* ============================================ */}
      <div className="admin-vtc__header">
        <div className="admin-vtc__badges">
          <span
            className="admin-vtc__type-badge"
            style={{
              backgroundColor:
                token.issued_to_type === 'donor_inquiry'
                  ? 'rgba(23,162,184,0.12)'
                  : 'rgba(232,122,32,0.12)',
              color:
                token.issued_to_type === 'donor_inquiry'
                  ? '#17A2B8'
                  : '#E87A20',
              borderColor:
                token.issued_to_type === 'donor_inquiry'
                  ? 'rgba(23,162,184,0.3)'
                  : 'rgba(232,122,32,0.3)',
            }}
          >
            {typeLabel}
          </span>

          <span
            className="admin-vtc__status-badge"
            style={{
              backgroundColor: `${statusConfig.color}12`,
              color: statusConfig.color,
              borderColor: `${statusConfig.color}30`,
            }}
          >
            <StatusIcon size={9} />
            {statusConfig.label}
          </span>
        </div>

        <span className="admin-vtc__id">#{token.id}</span>
      </div>

      {/* ============================================ */}
      {/* Purpose */}
      {/* ============================================ */}
      <div className="admin-vtc__purpose">{token.purpose || '—'}</div>

      {/* ============================================ */}
      {/* Recipient (if any) */}
      {/* ============================================ */}
      {hasRecipient && (
        <div className="admin-vtc__recipients">
          {recipientName && (
            <span className="admin-vtc__recipient-chip">
              <FaUser size={9} />
              {recipientName}
            </span>
          )}
          {recipientEmail && (
            <span className="admin-vtc__recipient-chip admin-vtc__recipient-chip--ltr">
              <FaEnvelope size={9} />
              {recipientEmail}
            </span>
          )}
          {recipientWhatsapp && (
            <span className="admin-vtc__recipient-chip admin-vtc__recipient-chip--ltr">
              <FaWhatsapp size={9} />
              {recipientWhatsapp}
            </span>
          )}
        </div>
      )}

      {/* ============================================ */}
      {/* Issued by admin */}
      {/* ============================================ */}
      {token.issued_by_admin && (
        <div className="admin-vtc__issued-by">
          <FaUserShield size={10} color="#17A2B8" />
          <span>بواسطة:</span>
          <strong>{token.issued_by_admin.name}</strong>
        </div>
      )}

      {/* ============================================ */}
      {/* Stats — stacked chips */}
      {/* ============================================ */}
      <div className="admin-vtc__stats">
        <StackedChip
          Icon={FaEye}
          label="المشاهدات"
          value={`${token.views_used} / ${token.max_views}`}
          color="#17A2B8"
        />
        <StackedChip
          Icon={FaClock}
          label="المتبقي"
          value={remainingText}
          color={isExpired ? '#DC3545' : '#FFC107'}
        />
        <StackedChip
          Icon={FaCalendarAlt}
          label="ينتهي"
          value={expiryFullText}
          color="#8B5A2B"
        />
      </div>

      {/* ============================================ */}
      {/* Actions */}
      {/* ============================================ */}
      {(onRevoke || onViewAccessLog) && (
        <div className="admin-vtc__actions">
          {onViewAccessLog && (
            <button
              type="button"
              onClick={() => onViewAccessLog(token)}
              className="admin-vtc__action-btn admin-vtc__action-btn--log"
            >
              <FaHourglassHalf size={11} />
              سجل الوصول
            </button>
          )}
          {onRevoke && canRevoke && (
            <button
              type="button"
              onClick={() => onRevoke(token)}
              className="admin-vtc__action-btn admin-vtc__action-btn--revoke"
            >
              <FaBan size={11} />
              إلغاء
            </button>
          )}
        </div>
      )}

      <style>{`
        .admin-vtc {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1rem;
          font-family: 'Cairo', sans-serif;
          box-shadow: 0 2px 8px var(--shadow-sm);
          transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 0;
          height: 100%;
          box-sizing: border-box;
        }

        .admin-vtc:hover {
          box-shadow: 0 10px 24px var(--shadow-md);
        }

        @media (max-width: 380px) {
          .admin-vtc {
            padding: 0.85rem;
            gap: 9px;
            border-radius: 14px;
          }
        }

        /* ── Header ── */
        .admin-vtc__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }

        .admin-vtc__badges {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          min-width: 0;
        }

        .admin-vtc__type-badge,
        .admin-vtc__status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          border-radius: 7px;
          font-size: 0.66rem;
          font-weight: 800;
          white-space: nowrap;
          border: 1px solid transparent;
          flex-shrink: 0;
        }

        .admin-vtc__id {
          color: var(--text-muted);
          font-size: 0.65rem;
          opacity: 0.7;
          font-weight: 700;
          font-family: system-ui, sans-serif;
          flex-shrink: 0;
        }

        /* ── Purpose ── */
        .admin-vtc__purpose {
          color: var(--text-secondary);
          font-size: 0.8rem;
          line-height: 1.6;
          padding: 9px 11px;
          background-color: var(--bg-input);
          border-radius: 10px;
          border: 1px solid var(--border-color);
          font-weight: 600;
          word-break: break-word;
        }

        @media (max-width: 380px) {
          .admin-vtc__purpose {
            font-size: 0.75rem;
            padding: 8px 10px;
          }
        }

        /* ── Recipients ── */
        .admin-vtc__recipients {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          font-size: 0.7rem;
          padding-bottom: 8px;
          border-bottom: 1px dashed var(--border-color);
        }

        .admin-vtc__recipient-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--text-muted);
          padding: 3px 8px;
          background-color: var(--bg-input);
          border-radius: 6px;
          font-weight: 600;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-vtc__recipient-chip--ltr {
          direction: ltr;
        }

        /* ── Issued by ── */
        .admin-vtc__issued-by {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          color: var(--text-muted);
          padding-bottom: 8px;
          border-bottom: 1px dashed var(--border-color);
        }

        .admin-vtc__issued-by strong {
          color: var(--text-secondary);
        }

        /* ── Stats ── */
        .admin-vtc__stats {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* ── Actions ── */
        .admin-vtc__actions {
          display: flex;
          gap: 6px;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
          margin-top: auto;
          flex-wrap: wrap;
        }

        .admin-vtc__action-btn {
          flex: 1 1 100px;
          min-width: 0;
          padding: 9px 12px;
          border-radius: 9px;
          font-family: 'Cairo', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          color: var(--text-secondary);
        }

        .admin-vtc__action-btn--log:hover {
          border-color: #17A2B8;
          color: #17A2B8;
          background-color: rgba(23,162,184,0.06);
        }

        .admin-vtc__action-btn--revoke {
          border-color: rgba(220,53,69,0.3);
          background-color: rgba(220,53,69,0.06);
          color: #DC3545;
        }

        .admin-vtc__action-btn--revoke:hover {
          background-color: rgba(220,53,69,0.12);
          border-color: rgba(220,53,69,0.5);
        }

        @media (max-width: 320px) {
          .admin-vtc__actions {
            flex-direction: column;
          }
          .admin-vtc__action-btn {
            flex: 1 1 auto;
            width: 100%;
          }
        }
      `}</style>
    </motion.div>
  );
};

// ============================================
// StackedChip
// ============================================
const StackedChip = ({
  Icon,
  label,
  value,
  color,
}: {
  Icon: IconType;
  label: string;
  value: string;
  color: string;
}) => (
  <motion.div
    whileHover={{ x: -3 }}
    transition={{ duration: 0.15 }}
    title={`${label}: ${value}`}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '7px 10px',
      borderRadius: '9px',
      backgroundColor: `${color}08`,
      border: `1px solid ${color}25`,
      cursor: 'default',
      minWidth: 0,
    }}
  >
    <span
      style={{
        width: 22,
        height: 22,
        borderRadius: '6px',
        backgroundColor: `${color}18`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
        flexShrink: 0,
      }}
    >
      <Icon size={10} />
    </span>

    <span
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.68rem',
        fontWeight: 700,
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>

    <span
      aria-hidden="true"
      style={{
        flex: 1,
        height: '1px',
        borderBottom: `1px dotted ${color}40`,
        minWidth: 8,
      }}
    />

    <span
      style={{
        color,
        fontSize: '0.75rem',
        fontWeight: 800,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '55%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {value}
    </span>
  </motion.div>
);

export default AdminVideoTokenCard;