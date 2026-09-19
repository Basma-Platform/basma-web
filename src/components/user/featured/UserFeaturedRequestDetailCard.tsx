import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaClock,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaImage,
  FaStickyNote,
  FaEnvelope,
  FaExternalLinkAlt,
  FaCreditCard,
  FaStar,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { UserFeaturedRequestDetail } from '../../../types';
import {
  formatFeaturedPrice,
  getDurationLabel,
  formatFeaturedDate,
  formatFeaturedTimeAgo,
  getPaymentMethodColor,
} from '../../../utils/featuredHelpers';

interface UserFeaturedRequestDetailCardProps {
  detail: UserFeaturedRequestDetail;
}

// ============================================
// Inline helper: shorten long payment labels
// ============================================
const shortPaymentLabel = (label: string): string => {
  if (label === 'Bank of Palestine' || label === 'Bank Of Palestine') {
    return 'BOP';
  }
  return label;
};

const UserFeaturedRequestDetailCard = ({
  detail,
}: UserFeaturedRequestDetailCardProps) => {
  // ============================================
  // Status config
  // ============================================
  const statusConfig: {
    Icon: IconType;
    color: string;
    bg: string;
    border: string;
    label: string;
    hint: string;
  } = (() => {
    switch (detail.status) {
      case 'approved':
        return {
          Icon: FaCheckCircle,
          color: '#28A745',
          bg: 'rgba(40,167,69,0.08)',
          border: 'rgba(40,167,69,0.25)',
          label: 'تمت الموافقة',
          hint: 'تم تفعيل التمييز على إعلانك',
        };
      case 'rejected':
        return {
          Icon: FaTimesCircle,
          color: '#DC3545',
          bg: 'rgba(220,53,69,0.08)',
          border: 'rgba(220,53,69,0.25)',
          label: 'مرفوض',
          hint: 'يمكنك إعادة رفع الطلب بحالة صحيحة',
        };
      case 'pending':
      default:
        return {
          Icon: FaHourglassHalf,
          color: '#FFB800',
          bg: 'rgba(255,184,0,0.08)',
          border: 'rgba(255,184,0,0.25)',
          label: 'قيد المراجعة',
          hint: 'سيتم مراجعة طلبك خلال 24 ساعة',
        };
    }
  })();

  const StatusIcon = statusConfig.Icon;
  const paymentColor = getPaymentMethodColor(detail.payment_method);

  const coverUrl = detail.announcement?.cover_image
    ? detail.announcement.cover_image.startsWith('http')
      ? detail.announcement.cover_image
      : `http://localhost:8000/storage/${detail.announcement.cover_image}`
    : null;

  const transferUrl = detail.transfer_image
    ? detail.transfer_image.startsWith('http')
      ? detail.transfer_image
      : `http://localhost:8000/storage/${detail.transfer_image}`
    : null;

  const isFeatured =
    detail.announcement?.is_currently_featured &&
    detail.announcement?.featured_until;

  return (
    <div className="u-frd" dir="rtl">
      {/* ============================================
          Status Banner
          ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="u-frd__status"
        style={{
          backgroundColor: statusConfig.bg,
          borderColor: statusConfig.border,
        }}
      >
        <div
          className="u-frd__status-icon"
          style={{
            background: `linear-gradient(135deg, ${statusConfig.color}, ${statusConfig.color}cc)`,
            boxShadow: `0 6px 16px ${statusConfig.color}40`,
          }}
        >
          {detail.status === 'pending' ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ display: 'inline-flex' }}
            >
              <StatusIcon size={18} />
            </motion.span>
          ) : (
            <StatusIcon size={18} />
          )}
        </div>

        <div className="u-frd__status-info">
          <div
            className="u-frd__status-label"
            style={{ color: statusConfig.color }}
          >
            {statusConfig.label}
          </div>
          <div className="u-frd__status-hint">{statusConfig.hint}</div>
        </div>

        <div className="u-frd__status-id">#{detail.id}</div>
      </motion.div>

      {/* ============================================
          Announcement
          ============================================ */}
      {detail.announcement ? (
        <div className="u-frd__section">
          <SectionTitle Icon={FaImage} title="الإعلان" />

          <div className="u-frd__announcement">
            {/* Thumbnail */}
            <div className="u-frd__cover">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={detail.announcement.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <FaImage size={22} color="var(--text-muted)" opacity={0.4} />
              )}
            </div>

            {/* Info Column */}
            <div className="u-frd__announcement-info">
              <div className="u-frd__announcement-row">
                <span
                  className="u-frd__title"
                  title={detail.announcement.title}
                >
                  {detail.announcement.title}
                </span>

                {isFeatured && (
                  <span className="u-frd__featured-badge">
                    <FaStar size={9} />
                    مميز حتى{' '}
                    {formatFeaturedDate(
                      detail.announcement.featured_until as string
                    )}
                  </span>
                )}
              </div>

              <Link
                to={`/announcements/${detail.announcement.id}`}
                className="u-frd__link"
              >
                <FaExternalLinkAlt size={9} />
                عرض الإعلان
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="u-frd__deleted">
          <FaTimesCircle size={14} />
          <span>تم حذف الإعلان</span>
        </div>
      )}

      {/* ============================================
          Request Details
          ============================================ */}
      <div className="u-frd__section">
        <SectionTitle Icon={FaMoneyBillWave} title="تفاصيل الطلب" />

        <div className="u-frd__details">
          <DetailItem
            Icon={FaClock}
            label="المدة"
            value={getDurationLabel(detail.duration_days)}
            color="#17A2B8"
          />
          <DetailItem
            Icon={FaMoneyBillWave}
            label="المبلغ"
            value={formatFeaturedPrice(detail.amount, detail.currency)}
            color="#E87A20"
          />
          <DetailItem
            Icon={FaCreditCard}
            label="طريقة الدفع"
            value={shortPaymentLabel(detail.payment_method_label)}
            color={paymentColor}
          />
        </div>
      </div>

      {/* ============================================
          User Notes
          ============================================ */}
      {detail.additional_notes && (
        <div className="u-frd__section">
          <SectionTitle Icon={FaStickyNote} title="ملاحظاتك" />
          <div className="u-frd__note-box">{detail.additional_notes}</div>
        </div>
      )}

      {/* ============================================
          Transfer Image
          ============================================ */}
      {transferUrl && (
        <div className="u-frd__section">
          <SectionTitle Icon={FaImage} title="إشعار التحويل" />
          <a
            href={transferUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="u-frd__transfer-link"
          >
            <img
              src={transferUrl}
              alt="Transfer receipt"
              className="u-frd__transfer-img"
            />
            <div className="u-frd__transfer-badge">
              <FaExternalLinkAlt size={9} />
              عرض بحجم كامل
            </div>
          </a>
        </div>
      )}

      {/* ============================================
          Admin Reply
          ============================================ */}
      {detail.status !== 'pending' && detail.reviewed_at && (
        <div
          className="u-frd__section u-frd__section--admin"
          style={{
            backgroundColor:
              detail.status === 'approved'
                ? 'rgba(40,167,69,0.06)'
                : 'rgba(220,53,69,0.06)',
            borderColor:
              detail.status === 'approved'
                ? 'rgba(40,167,69,0.25)'
                : 'rgba(220,53,69,0.25)',
          }}
        >
          <SectionTitle
            Icon={FaEnvelope}
            title={
              detail.status === 'approved' ? 'قبول الإدارة' : 'رفض الإدارة'
            }
            color={detail.status === 'approved' ? '#28A745' : '#DC3545'}
          />

          <div className="u-frd__note-box">
            {detail.admin_notes || 'تمت المراجعة'}
          </div>

          <div className="u-frd__admin-date">
            <FaCalendarAlt size={10} />
            {formatFeaturedDate(detail.reviewed_at)}
          </div>
        </div>
      )}

      {/* ============================================
          Timeline
          ============================================ */}
      <div className="u-frd__section u-frd__section--timeline">
        <SectionTitle Icon={FaCalendarAlt} title="التواريخ" />

        <div className="u-frd__timeline">
          <TimelineItem
            label="تاريخ الطلب"
            value={formatFeaturedDate(detail.created_at)}
            subValue={formatFeaturedTimeAgo(detail.created_at)}
          />
          {detail.reviewed_at && (
            <TimelineItem
              label="تاريخ المراجعة"
              value={formatFeaturedDate(detail.reviewed_at)}
              subValue={formatFeaturedTimeAgo(detail.reviewed_at)}
            />
          )}
        </div>
      </div>

      {/* ============================================
          Component-scoped responsive styles
          ============================================ */}
      <style>{`
        /* ============================================
           BASE (mobile-first)
           ============================================ */
        .u-frd {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-family: 'Cairo', sans-serif;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        /* ---------- Status ---------- */
        .u-frd__status {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid transparent;
          width: 100%;
          box-sizing: border-box;
          min-width: 0;
        }

        .u-frd__status-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          flex-shrink: 0;
        }

        .u-frd__status-info {
          flex: 1;
          min-width: 0;
        }

        .u-frd__status-label {
          font-size: 0.95rem;
          font-weight: 900;
          margin-bottom: 3px;
          line-height: 1.2;
        }

        .u-frd__status-hint {
          color: var(--text-muted);
          font-size: 0.75rem;
          line-height: 1.4;
          word-break: break-word;
        }

        .u-frd__status-id {
          color: var(--text-muted);
          font-size: 0.72rem;
          opacity: 0.7;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ---------- Sections ---------- */
        .u-frd__section {
          padding: 1rem;
          border-radius: 14px;
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
          width: 100%;
          box-sizing: border-box;
        }

        .u-frd__section--admin {
          border-width: 1px;
        }

        .u-frd__section--timeline {
          background-color: var(--bg-card);
        }

        /* ---------- Announcement ---------- */
        .u-frd__announcement {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          width: 100%;
          box-sizing: border-box;
          min-width: 0;
        }

        .u-frd__cover {
          width: 70px;
          height: 70px;
          border-radius: 12px;
          overflow: hidden;
          background-color: var(--bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid var(--border-color);
        }

        .u-frd__announcement-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .u-frd__announcement-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
          min-width: 0;
        }

        .u-frd__title {
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 800;
          line-height: 1.35;
          word-break: break-word;
          width: 100%;
          min-width: 0;
        }

        .u-frd__featured-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 8px;
          background-color: rgba(255,184,0,0.15);
          color: #FFB800;
          font-size: 0.68rem;
          font-weight: 800;
          border: 1px solid rgba(255,184,0,0.3);
          flex-shrink: 0;
          white-space: nowrap;
          align-self: flex-start;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .u-frd__link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--primary-orange);
          font-size: 0.72rem;
          font-weight: 700;
          text-decoration: none;
          align-self: flex-start;
        }

        .u-frd__deleted {
          padding: 1rem;
          border-radius: 14px;
          background-color: rgba(220,53,69,0.05);
          border: 1px solid rgba(220,53,69,0.2);
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.82rem;
          color: #DC3545;
          width: 100%;
          box-sizing: border-box;
          word-break: break-word;
        }

        /* ---------- Details Grid ---------- */
        .u-frd__details {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          width: 100%;
          box-sizing: border-box;
        }

        /* ---------- Notes ---------- */
        .u-frd__note-box {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.65;
          padding: 10px 12px;
          background-color: var(--bg-card);
          border-radius: 10px;
          border: 1px solid var(--border-color);
          white-space: pre-wrap;
          word-break: break-word;
          width: 100%;
          box-sizing: border-box;
        }

        /* ---------- Transfer ---------- */
        .u-frd__transfer-link {
          display: block;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border-color);
          text-decoration: none;
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }

        .u-frd__transfer-img {
          width: 100%;
          height: auto;
          max-height: 320px;
          object-fit: contain;
          display: block;
          background-color: var(--bg-card);
        }

        .u-frd__transfer-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 8px;
          background-color: rgba(0,0,0,0.65);
          color: #FFFFFF;
          font-size: 0.68rem;
          font-weight: 700;
          backdrop-filter: blur(4px);
        }

        /* ---------- Admin Reply ---------- */
        .u-frd__admin-date {
          font-size: 0.72rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 8px;
        }

        /* ---------- Timeline ---------- */
        .u-frd__timeline {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        /* ============================================
           RESPONSIVE: Tablet ≥ 480px
           - Details grid → 2 columns
           - Announcement row → inline title + badge
           ============================================ */
        @media (min-width: 480px) {
          .u-frd__details {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .u-frd__announcement-row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
          }

          .u-frd__title {
            flex: 1 1 auto;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: auto;
          }

          .u-frd__featured-badge {
            align-self: center;
          }
        }

        /* ============================================
           RESPONSIVE: Desktop ≥ 640px
           - Details grid → 3 columns
           ============================================ */
        @media (min-width: 640px) {
          .u-frd__details {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        /* ============================================
           EXTRA SMALL: Under 380px
           - Tighter paddings
           - Cover shrinks slightly
           - Status stacks if needed
           ============================================ */
        @media (max-width: 380px) {
          .u-frd__section {
            padding: 0.75rem;
          }

          .u-frd__status {
            padding: 10px 12px;
            gap: 10px;
          }

          .u-frd__status-icon {
            width: 36px;
            height: 36px;
          }

          .u-frd__status-label {
            font-size: 0.85rem;
          }

          .u-frd__status-hint {
            font-size: 0.7rem;
          }

          .u-frd__status-id {
            font-size: 0.65rem;
          }

          .u-frd__cover {
            width: 56px;
            height: 56px;
            border-radius: 10px;
          }

          .u-frd__title {
            font-size: 0.82rem;
          }

          .u-frd__featured-badge {
            font-size: 0.6rem;
            padding: 2px 8px;
            white-space: normal;
          }

          .u-frd__note-box {
            font-size: 0.78rem;
          }
        }
      `}</style>
    </div>
  );
};

// ============================================
// SectionTitle
// ============================================
interface SectionTitleProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  color?: string;
}

const SectionTitle = ({ Icon, title, color }: SectionTitleProps) => (
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
// DetailItem
// ============================================
interface DetailItemProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  color?: string;
}

const DetailItem = ({ Icon, label, value, color }: DetailItemProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 12px',
      borderRadius: '10px',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      minWidth: 0,
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
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

// ============================================
// TimelineItem
// ============================================
interface TimelineItemProps {
  label: string;
  value: string;
  subValue?: string;
}

const TimelineItem = ({ label, value, subValue }: TimelineItemProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px',
      padding: '8px 10px',
      borderRadius: '10px',
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
      flexWrap: 'wrap',
      minWidth: 0,
    }}
  >
    <div
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      {label}
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: 0,
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
      }}
    >
      <span
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.75rem',
          fontWeight: 700,
        }}
      >
        {value}
      </span>
      {subValue && (
        <span
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.68rem',
            opacity: 0.75,
          }}
        >
          ({subValue})
        </span>
      )}
    </div>
  </div>
);

export default UserFeaturedRequestDetailCard;