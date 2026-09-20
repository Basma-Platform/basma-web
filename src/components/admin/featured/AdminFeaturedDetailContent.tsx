import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaUserCheck,
  FaWhatsapp,
  FaCalendarAlt,
  FaImage,
  FaMoneyBillWave,
  FaClock,
  FaCreditCard,
  FaStickyNote,
  FaEnvelopeOpenText,
  FaExternalLinkAlt,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaBullhorn,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { AdminFeaturedDetail } from '../../../types';
import {
  formatFeaturedPrice,
  formatFeaturedDate,
  formatFeaturedTimeAgo,
  getPaymentMethodColor,
  getInitials,
} from '../../../utils/featuredHelpers';
import { getStorageUrl } from '../../../utils/storageHelpers';

interface AdminFeaturedDetailContentProps {
  detail: AdminFeaturedDetail;
}

const AdminFeaturedDetailContent = ({
  detail,
}: AdminFeaturedDetailContentProps) => {
  const statusConfig: {
    Icon: IconType;
    label: string;
    color: string;
    bg: string;
    border: string;
  } = (() => {
    switch (detail.status) {
      case 'approved':
        return {
          Icon: FaCheckCircle,
          label: 'تمت الموافقة',
          color: '#28A745',
          bg: 'rgba(40,167,69,0.08)',
          border: 'rgba(40,167,69,0.25)',
        };
      case 'rejected':
        return {
          Icon: FaTimesCircle,
          label: 'مرفوض',
          color: '#DC3545',
          bg: 'rgba(220,53,69,0.08)',
          border: 'rgba(220,53,69,0.25)',
        };
      case 'pending':
      default:
        return {
          Icon: FaHourglassHalf,
          label: 'قيد المراجعة',
          color: '#E87A20',
          bg: 'rgba(232,122,32,0.08)',
          border: 'rgba(232,122,32,0.25)',
        };
    }
  })();

  const StatusIcon = statusConfig.Icon;
  const paymentColor = getPaymentMethodColor(detail.payment_method);

  // ✅ Storage URLs via global helper
  const userImageUrl = getStorageUrl(detail.user.profile_image);
  const transferUrl = getStorageUrl(detail.transfer_image);
  const announcementCoverUrl = getStorageUrl(
    detail.announcement?.images?.[0]?.image_path
  );

  const userInitials = getInitials(detail.user.name);

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
      {/* ============================================
          Status Banner
          ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 16px',
          borderRadius: '14px',
          backgroundColor: statusConfig.bg,
          border: `1px solid ${statusConfig.border}`,
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${statusConfig.color}, ${statusConfig.color}cc)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0,
            boxShadow: `0 6px 16px ${statusConfig.color}40`,
          }}
        >
          <StatusIcon size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: statusConfig.color,
              fontSize: '0.95rem',
              fontWeight: 900,
              marginBottom: '3px',
            }}
          >
            {statusConfig.label}
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
              ? `تمت المراجعة ${formatFeaturedTimeAgo(detail.reviewed_at)}`
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
          }}
        >
          #{detail.id}
        </div>
      </motion.div>

      {/* ============================================
          User Section
          ============================================ */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
        }}
      >
        <SectionTitle Icon={FaUser} title="المستخدم" />

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
                background: userImageUrl
                  ? 'var(--bg-card)'
                  : 'linear-gradient(135deg, #E87A20, #F5A623)',
                border: '2px solid var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {userImageUrl ? (
                <img
                  src={userImageUrl}
                  alt={detail.user.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span
                  style={{
                    color: '#FFFFFF',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                  }}
                >
                  {userInitials}
                </span>
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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                }}
              >
                {detail.user.name}
              </span>
              {detail.user.is_verified && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(13,110,253,0.15)',
                    color: '#0d6efd',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                  }}
                >
                  <FaUserCheck size={8} />
                  موثق
                </span>
              )}
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

        {/* Contact Grid */}
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
          <InfoRow
            Icon={FaCalendarAlt}
            label="عضو منذ"
            value={formatFeaturedDate(detail.user.created_at)}
            color="#17A2B8"
          />
        </div>

        {/* View Profile */}
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
            backgroundColor: 'rgba(232,122,32,0.08)',
            color: 'var(--primary-orange)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <FaUser size={10} />
          عرض الملف الشخصي
          <FaExternalLinkAlt size={8} />
        </Link>
      </div>

      {/* ============================================
          Announcement Section
          ============================================ */}
      {detail.announcement ? (
        <div
          style={{
            padding: '1rem',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
          }}
        >
          <SectionTitle Icon={FaBullhorn} title="الإعلان" />

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid var(--border-color)',
              }}
            >
              {announcementCoverUrl ? (
                <img
                  src={announcementCoverUrl}
                  alt={detail.announcement.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <FaImage size={20} color="var(--text-muted)" opacity={0.4} />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  marginBottom: '6px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {detail.announcement.title}
              </div>
              {detail.announcement.status === 'deleted' && (
                <div
                  style={{
                    color: '#DC3545',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    marginBottom: '4px',
                  }}
                >
                  الإعلان محذوف
                </div>
              )}
              <Link
                to={`/announcements/${detail.announcement.id}`}
                target="_blank"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: 'var(--primary-orange)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <FaExternalLinkAlt size={9} />
                عرض الإعلان
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: '1rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(220,53,69,0.05)',
            border: '1px solid rgba(220,53,69,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.82rem',
            color: '#DC3545',
          }}
        >
          <FaTimesCircle size={14} />
          <span>تم حذف الإعلان المرتبط بهذا الطلب</span>
        </div>
      )}

      {/* ============================================
          Request Details
          ============================================ */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
        }}
      >
        <SectionTitle Icon={FaMoneyBillWave} title="تفاصيل التمييز" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '8px',
          }}
        >
          <InfoRow
            Icon={FaClock}
            label="المدة"
            value={detail.duration_label}
            color="#17A2B8"
          />
          <InfoRow
            Icon={FaMoneyBillWave}
            label="المبلغ"
            value={formatFeaturedPrice(detail.amount, detail.currency)}
            color="#E87A20"
          />
          <InfoRow
            Icon={FaCreditCard}
            label="طريقة الدفع"
            value={detail.payment_method_label}
            color={paymentColor}
          />
        </div>
      </div>

      {/* ============================================
          User Notes
          ============================================ */}
      {detail.additional_notes && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
          }}
        >
          <SectionTitle Icon={FaStickyNote} title="ملاحظات المستخدم" />
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
            {detail.additional_notes}
          </div>
        </div>
      )}

      {/* ============================================
          Transfer Image
          ============================================ */}
      {transferUrl && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
          }}
        >
          <SectionTitle Icon={FaImage} title="إشعار التحويل" />

          <a
            href={transferUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              textDecoration: 'none',
              position: 'relative',
            }}
          >
            <img
              src={transferUrl}
              alt="Transfer receipt"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '360px',
                objectFit: 'contain',
                display: 'block',
                backgroundColor: 'var(--bg-card)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0,0,0,0.65)',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontWeight: 700,
                backdropFilter: 'blur(4px)',
              }}
            >
              <FaExternalLinkAlt size={9} />
              عرض بحجم كامل
            </div>
          </a>
        </div>
      )}

      {/* ============================================
          Admin Notes (if reviewed)
          ============================================ */}
      {detail.status !== 'pending' && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '14px',
            backgroundColor:
              detail.status === 'approved'
                ? 'rgba(40,167,69,0.06)'
                : 'rgba(220,53,69,0.06)',
            border: `1px solid ${
              detail.status === 'approved'
                ? 'rgba(40,167,69,0.25)'
                : 'rgba(220,53,69,0.25)'
            }`,
          }}
        >
          <SectionTitle
            Icon={FaEnvelopeOpenText}
            title={
              detail.status === 'approved' ? 'قرار الإدارة' : 'سبب الرفض'
            }
            color={detail.status === 'approved' ? '#28A745' : '#DC3545'}
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
              marginBottom: '8px',
            }}
          >
            {detail.admin_notes || 'تمت المراجعة'}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              flexWrap: 'wrap',
            }}
          >
            {detail.reviewed_by && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <FaUser size={9} />
                {detail.reviewed_by.name}
              </span>
            )}
            {detail.reviewed_at && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <FaCalendarAlt size={9} />
                {formatFeaturedDate(detail.reviewed_at)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ============================================
          Timeline
          ============================================ */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
        }}
      >
        <SectionTitle Icon={FaCalendarAlt} title="التواريخ" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
    </div>
  );
};

// ============================================
// Helpers
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
    }}
  >
    <span
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      {label}
    </span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

export default AdminFeaturedDetailContent;