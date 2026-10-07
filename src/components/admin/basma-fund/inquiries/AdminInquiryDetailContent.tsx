import { motion } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaWhatsapp,
  FaInfoCircle,
  FaCheckCircle,
  FaHandHoldingHeart,
  FaExternalLinkAlt,
  FaLock,
  FaVideo,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaEye,
  FaClock,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import type {
  AdminDonationInquiryDetail,
  AdminVideoTokenListItem,
} from '../../../../types';
import {
  formatInquiryDate,
  getContactMethodLabel,
  getContactMethodColor,
  getInquiryStatusLabel,
  getInquiryStatusColor,
} from '../../../../utils/donationHelpers';
import {
  getVideoTokenTypeLabel,
  formatTokenExpiry,
  getTokenTimeRemaining,
} from '../../../../utils/videoTokenHelpers';

interface AdminInquiryDetailContentProps {
  detail: AdminDonationInquiryDetail;
}

const AdminInquiryDetailContent = ({
  detail,
}: AdminInquiryDetailContentProps) => {
  if (!detail) return null;

  const statusColor = getInquiryStatusColor(detail.status);
  const contactColor = getContactMethodColor(detail.contact_method);

  const helpRequest = detail.help_request ?? null;
  const donor = detail.donor ?? null;

  // ============================================
  // ✅ Build donor cards dynamically
  // ============================================
  interface DonorCard {
    key: string;
    Icon: React.ComponentType<{ size?: number; color?: string }>;
    label: string;
    value: string;
    color: string;
    ltr?: boolean;
  }

  const donorCards: DonorCard[] = [];

  if (donor) {
    if (donor.name) {
      donorCards.push({
        key: 'name',
        Icon: FaUser,
        label: 'الاسم',
        value: donor.name,
        color: '#17A2B8',
      });
    }
    if (donor.whatsapp) {
      donorCards.push({
        key: 'whatsapp',
        Icon: FaWhatsapp,
        label: 'واتساب',
        value: donor.whatsapp,
        color: '#25D366',
        ltr: true,
      });
    }
    if (donor.email) {
      donorCards.push({
        key: 'email',
        Icon: FaEnvelope,
        label: 'البريد الإلكتروني',
        value: donor.email,
        color: '#17A2B8',
        ltr: true,
      });
    }
    donorCards.push({
      key: 'contact_method',
      Icon: FaInfoCircle,
      label: 'طريقة التواصل',
      value: getContactMethodLabel(detail.contact_method),
      color: contactColor,
    });
  }

  return (
    <div className="aidc" dir="rtl">
      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="aidc-status-banner"
        style={{
          backgroundColor: `${statusColor}08`,
          borderColor: `${statusColor}30`,
        }}
      >
        <div
          className="aidc-status-banner__icon"
          style={{
            background: `linear-gradient(135deg, ${statusColor}, ${statusColor}cc)`,
            boxShadow: `0 6px 16px ${statusColor}40`,
          }}
        >
          <FaHandHoldingHeart size={18} />
        </div>
        <div className="aidc-status-banner__text">
          <div
            className="aidc-status-banner__label"
            style={{ color: statusColor }}
          >
            {getInquiryStatusLabel(detail.status)}
          </div>
          <div className="aidc-status-banner__date">
            {formatInquiryDate(detail.created_at)}
          </div>
        </div>
        <div className="aidc-status-banner__code">
          {detail.tracking_code}
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* Donor Section — DYNAMIC GRID */}
      {/* ============================================ */}
      {donor && donorCards.length > 0 && (
        <div className="aidc-section">
          <SectionTitle Icon={FaUser} title="بيانات المتبرع" />

          {/* ✅ Dynamic grid */}
          <div
            className="aidc-grid-dynamic"
            data-count={donorCards.length}
            data-odd={donorCards.length % 2 === 1 ? 'true' : 'false'}
          >
            {donorCards.map((card) => (
              <InfoRow
                key={card.key}
                Icon={card.Icon}
                label={card.label}
                value={card.value}
                color={card.color}
                ltr={card.ltr}
              />
            ))}
          </div>

          {donor.user && (
            <Link
              to={`/users/${donor.user.id}`}
              target="_blank"
              className="aidc-user-link"
            >
              <FaUser size={10} />
              عرض ملف المستخدم المسجّل
              <FaExternalLinkAlt size={8} />
            </Link>
          )}
        </div>
      )}

      {/* Help Request Section */}
      <div className="aidc-section">
        <SectionTitle Icon={FaHandHoldingHeart} title="طلب المساعدة المرتبط" />

        {helpRequest ? (
          <div className="aidc-help-request">
            <div className="aidc-help-request__info">
              <div className="aidc-help-request__title">
                {helpRequest.public_title || '—'}
              </div>
              {helpRequest.published_at && (
                <div className="aidc-help-request__date">
                  <FaCalendarAlt size={9} />
                  {formatInquiryDate(helpRequest.published_at)}
                </div>
              )}
            </div>
            <Link
              to={`/admin/help-requests/${helpRequest.id}`}
              className="aidc-help-request__link"
            >
              عرض الطلب
              <FaExternalLinkAlt size={8} />
            </Link>
          </div>
        ) : (
          <div className="aidc-help-request aidc-help-request--deleted">
            <FaExclamationTriangle size={12} />
            طلب المساعدة المرتبط تم حذفه
          </div>
        )}
      </div>

      {/* Message Section */}
      {detail.message && (
        <div className="aidc-section">
          <SectionTitle Icon={FaInfoCircle} title="رسالة المتبرع" />
          <div className="aidc-message">{detail.message}</div>
        </div>
      )}

      {/* Video Tokens */}
      {detail.video_tokens && detail.video_tokens.length > 0 && (
        <div className="aidc-section">
          <SectionTitle Icon={FaVideo} title="روابط المشاهدة المُصدرة" />

          <div className="aidc-tokens">
            {detail.video_tokens.map((token: AdminVideoTokenListItem) => (
              <VideoTokenItem key={token.id} token={token} />
            ))}
          </div>
        </div>
      )}

      {/* Admin Notes */}
      {detail.admin_notes && (
        <div
          className="aidc-section aidc-section--notes"
          style={{
            backgroundColor: 'rgba(255,193,7,0.06)',
            borderColor: 'rgba(255,193,7,0.25)',
          }}
        >
          <SectionTitle Icon={FaLock} title="ملاحظات الإدارة" color="#FFC107" />
          <div className="aidc-notes">{detail.admin_notes}</div>
        </div>
      )}

      {/* Handler Info */}
      {detail.handled_by && (
        <div className="aidc-handler">
          <FaCheckCircle size={14} color="#28A745" style={{ flexShrink: 0 }} />
          <div className="aidc-handler__text">
            <strong>تمت المعالجة بواسطة:</strong> {detail.handled_by.name}
            {detail.handled_at && (
              <span className="aidc-handler__date">
                · {formatInquiryDate(detail.handled_at)}
              </span>
            )}
          </div>
        </div>
      )}

      <style>{`
        .aidc {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-family: 'Cairo', sans-serif;
          width: 100%;
          box-sizing: border-box;
        }

        /* ── Status Banner ── */
        .aidc-status-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid transparent;
          flex-wrap: wrap;
        }

        @media (max-width: 380px) {
          .aidc-status-banner {
            padding: 12px;
            gap: 10px;
          }
        }

        .aidc-status-banner__icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          flex-shrink: 0;
        }

        @media (max-width: 380px) {
          .aidc-status-banner__icon {
            width: 38px;
            height: 38px;
          }
          .aidc-status-banner__icon svg {
            width: 16px;
            height: 16px;
          }
        }

        .aidc-status-banner__text {
          flex: 1;
          min-width: 0;
        }

        .aidc-status-banner__label {
          font-size: clamp(0.88rem, 3vw, 0.95rem);
          font-weight: 900;
          margin-bottom: 3px;
        }

        .aidc-status-banner__date {
          color: var(--text-muted);
          font-size: clamp(0.68rem, 2.5vw, 0.72rem);
        }

        .aidc-status-banner__code {
          color: var(--text-muted);
          font-size: 0.72rem;
          opacity: 0.7;
          font-weight: 700;
          font-family: system-ui, sans-serif;
          white-space: nowrap;
          flex-shrink: 0;
          direction: ltr;
        }

        /* ── Section ── */
        .aidc-section {
          padding: 1rem;
          border-radius: 14px;
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
        }

        @media (max-width: 380px) {
          .aidc-section {
            padding: 0.85rem;
            border-radius: 12px;
          }
        }

        .aidc-section--notes {
          border-width: 1px;
        }

        /* ═══════════════════════════════════════════════════════ */
        /* ✅ DYNAMIC GRID — Donor Cards                          */
        /* ═══════════════════════════════════════════════════════ */
        /*
         * Default: 2 columns
         * Last card when count is ODD: spans full width (2 columns)
         * Mobile (< 480px): 1 column always
         */
        .aidc-grid-dynamic {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          width: 100%;
        }

        /* ✅ If ODD number → last card spans both columns */
        .aidc-grid-dynamic[data-odd='true'] > *:last-child {
          grid-column: 1 / -1;
        }

        /* Mobile: single column — reset span */
        @media (max-width: 480px) {
          .aidc-grid-dynamic {
            grid-template-columns: 1fr;
          }
          .aidc-grid-dynamic[data-odd='true'] > *:last-child {
            grid-column: auto;
          }
        }

        /* ── User Link — NO HOVER COLOR CHANGE ── */
        .aidc-user-link,
        .aidc-user-link:visited,
        .aidc-user-link:focus,
        .aidc-user-link:hover,
        .aidc-user-link:active {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          padding: 8px 14px;
          border-radius: 10px;
          background-color: rgba(23,162,184,0.1);
          color: #17A2B8 !important;
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none !important;
          transition: background-color 0.2s ease;
        }

        .aidc-user-link:hover {
          background-color: rgba(23,162,184,0.18);
        }

        /* ── Help Request ── */
        .aidc-help-request {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 12px;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          flex-wrap: wrap;
        }

        .aidc-help-request--deleted {
          background-color: rgba(220,53,69,0.06);
          border-color: rgba(220,53,69,0.25);
          color: #DC3545;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .aidc-help-request__info {
          flex: 1;
          min-width: 0;
        }

        .aidc-help-request__title {
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 800;
          margin-bottom: 4px;
          word-break: break-word;
        }

        .aidc-help-request__date {
          color: var(--text-muted);
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* ── Help Request Link — NO HOVER COLOR CHANGE ── */
        .aidc-help-request__link,
        .aidc-help-request__link:visited,
        .aidc-help-request__link:focus,
        .aidc-help-request__link:hover,
        .aidc-help-request__link:active {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          background-color: rgba(23,162,184,0.1);
          color: #17A2B8 !important;
          font-size: 0.72rem;
          font-weight: 800;
          text-decoration: none !important;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background-color 0.2s ease;
        }

        .aidc-help-request__link:hover {
          background-color: rgba(23,162,184,0.18);
        }

        @media (max-width: 380px) {
          .aidc-help-request__link {
            width: 100%;
            justify-content: center;
            padding: 9px 12px;
          }
        }

        /* ── Message ── */
        .aidc-message {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.7;
          padding: 10px 12px;
          background-color: var(--bg-card);
          border-radius: 10px;
          border: 1px solid var(--border-color);
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* ── Tokens ── */
        .aidc-tokens {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* ── Notes ── */
        .aidc-notes {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.7;
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* ── Handler ── */
        .aidc-handler {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          background-color: rgba(40,167,69,0.08);
          border: 1px solid rgba(40,167,69,0.25);
        }

        .aidc-handler__text {
          font-size: clamp(0.72rem, 2.5vw, 0.78rem);
          color: var(--text-secondary);
          min-width: 0;
        }

        .aidc-handler__date {
          color: var(--text-muted);
          margin-right: 8px;
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  );
};

// ============================================
// Video Token Item (unchanged)
// ============================================
const VideoTokenItem = ({ token }: { token: AdminVideoTokenListItem }) => {
  const isRevoked = token.is_revoked;
  const isUsed = token.views_used >= 1;
  const isExpired = new Date(token.expires_at).getTime() < Date.now();

  const statusColor = isRevoked
    ? '#6C757D'
    : isUsed
    ? '#17A2B8'
    : isExpired
    ? '#DC3545'
    : '#28A745';

  const statusLabel = isRevoked
    ? 'ملغى'
    : isUsed
    ? 'مستخدم'
    : isExpired
    ? 'منتهي'
    : 'نشط';

  const recipient = token.recipient ?? null;
  const recipientName = recipient?.name ?? null;
  const recipientEmail = recipient?.email ?? null;
  const recipientWhatsapp = recipient?.whatsapp ?? null;

  const typeLabel =
    token.issued_to_type_label ||
    getVideoTokenTypeLabel(token.issued_to_type);

  return (
    <div className="aidc-token">
      <div className="aidc-token__header">
        <div className="aidc-token__badges">
          <span
            className="aidc-token__badge"
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
            className="aidc-token__badge"
            style={{
              backgroundColor: `${statusColor}12`,
              color: statusColor,
              borderColor: `${statusColor}30`,
            }}
          >
            {statusLabel}
          </span>
        </div>

        <span className="aidc-token__id">#{token.id}</span>
      </div>

      <div className="aidc-token__purpose">{token.purpose || '—'}</div>

      {(recipientName || recipientEmail || recipientWhatsapp) && (
        <div className="aidc-token__recipients">
          {recipientName && (
            <span className="aidc-token__chip">
              <FaUser size={9} />
              {recipientName}
            </span>
          )}
          {recipientEmail && (
            <span className="aidc-token__chip aidc-token__chip--ltr">
              <FaEnvelope size={9} />
              {recipientEmail}
            </span>
          )}
          {recipientWhatsapp && (
            <span className="aidc-token__chip aidc-token__chip--ltr">
              <FaWhatsapp size={9} />
              {recipientWhatsapp}
            </span>
          )}
        </div>
      )}

      <div className="aidc-token__stats">
        <MiniStat
          Icon={FaEye}
          label="المشاهدات"
          value={`${token.views_used} / ${token.max_views}`}
          color="#17A2B8"
        />
        <MiniStat
          Icon={FaClock}
          label="المتبقي"
          value={
            isRevoked || isExpired
              ? '—'
              : getTokenTimeRemaining(token.expires_at)
          }
          color={isExpired ? '#DC3545' : '#FFC107'}
        />
        <MiniStat
          Icon={FaCalendarAlt}
          label="ينتهي"
          value={formatTokenExpiry(token.expires_at)}
          color="#8B5A2B"
        />
      </div>

      <style>{`
        .aidc-token {
          padding: 12px 14px;
          border-radius: 11px;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        @media (max-width: 380px) {
          .aidc-token {
            padding: 10px 12px;
            gap: 7px;
          }
        }

        .aidc-token__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }

        .aidc-token__badges {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          min-width: 0;
        }

        .aidc-token__badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          border-radius: 7px;
          font-size: 0.65rem;
          font-weight: 800;
          white-space: nowrap;
          border: 1px solid transparent;
          flex-shrink: 0;
        }

        .aidc-token__id {
          color: var(--text-muted);
          font-size: 0.62rem;
          opacity: 0.7;
          font-family: system-ui, sans-serif;
          flex-shrink: 0;
        }

        .aidc-token__purpose {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.55;
          word-break: break-word;
        }

        .aidc-token__recipients {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          font-size: 0.7rem;
        }

        .aidc-token__chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
          padding: 2px 8px;
          background-color: var(--bg-input);
          border-radius: 6px;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .aidc-token__chip--ltr {
          direction: ltr;
        }

        .aidc-token__stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 6px;
        }

        @media (max-width: 380px) {
          .aidc-token__stats {
            grid-template-columns: 1fr;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
};

// ============================================
// Mini Stat
// ============================================
const MiniStat = ({
  Icon,
  label,
  value,
  color,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  color: string;
}) => (
  <div
    style={{
      padding: '6px 8px',
      borderRadius: '8px',
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
      textAlign: 'center',
      minWidth: 0,
    }}
  >
    <div
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.6rem',
        fontWeight: 600,
        marginBottom: 2,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Icon size={9} />
      {label}
    </div>
    <div
      style={{
        color,
        fontSize: '0.7rem',
        fontWeight: 800,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
      title={value}
    >
      {value}
    </div>
  </div>
);

// ============================================
// Section Title
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
      gap: 8,
      marginBottom: 12,
      color: color || 'var(--text-secondary)',
      fontSize: '0.85rem',
      fontWeight: 800,
      fontFamily: 'Cairo, sans-serif',
    }}
  >
    <div
      style={{
        width: 26,
        height: 26,
        borderRadius: 8,
        backgroundColor: `${color || 'var(--primary-orange)'}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color || 'var(--primary-orange)',
        flexShrink: 0,
      }}
    >
      <Icon size={12} />
    </div>
    {title}
  </div>
);

// ============================================
// Info Row — ✅ FIXED: Always shows full content
// ============================================
const InfoRow = ({
  Icon,
  label,
  value,
  color,
  ltr = false,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  color: string;
  ltr?: boolean;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px',
      borderRadius: 10,
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      minWidth: 0,
      // ✅ Ensures full content visibility even in narrow columns
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
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
    <div
      style={{
        flex: 1,
        minWidth: 0,
        // ✅ Remove overflow hidden — allow content to wrap if needed
      }}
    >
      <div
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.65rem',
          marginBottom: 2,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.8rem',
          fontWeight: 800,
          direction: ltr ? 'ltr' : 'rtl',
          textAlign: 'right',
          // Allow wrapping instead of truncation
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
          lineHeight: 1.4,
        }}
        title={value} // Tooltip as fallback
      >
        {value}
      </div>
    </div>
  </div>
);

export default AdminInquiryDetailContent;