import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaUserCheck,
  FaWhatsapp,
  FaCalendarAlt,
  FaImage,
  FaBullhorn,
  FaExternalLinkAlt,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaFlag,
  FaExclamationTriangle,
  FaEnvelopeOpenText,
  FaHistory,
  FaBan,
  FaClock as FaClockSolid,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { AdminReportDetail } from '../../../types';
import {
  getReportStatusColor,
  getReportStatusBg,
  getReportPriorityColor,
  getReportPriorityBg,
  getTargetTypeColor,
  getActionColor,
  getActionLabel,
  formatReportDate,
  formatReportTimeAgo,
} from '../../../utils/reportHelpers';
import { getStorageUrl } from '../../../utils/storageHelpers';

interface AdminReportDetailContentProps {
  detail: AdminReportDetail;
}

const AdminReportDetailContent = ({
  detail,
}: AdminReportDetailContentProps) => {
  // ============================================
  // Status config
  // ============================================
  const statusConfig: {
    Icon: IconType;
    label: string;
    color: string;
    bg: string;
  } = (() => {
    switch (detail.status) {
      case 'reviewed':
        return {
          Icon: FaCheckCircle,
          label: detail.status_label,
          color: getReportStatusColor('reviewed'),
          bg: getReportStatusBg('reviewed'),
        };
      case 'rejected':
        return {
          Icon: FaTimesCircle,
          label: detail.status_label,
          color: getReportStatusColor('rejected'),
          bg: getReportStatusBg('rejected'),
        };
      case 'pending':
      default:
        return {
          Icon: FaHourglassHalf,
          label: detail.status_label,
          color: getReportStatusColor('pending'),
          bg: getReportStatusBg('pending'),
        };
    }
  })();

  const StatusIcon = statusConfig.Icon;

  const priorityColor = getReportPriorityColor(detail.priority);
  const priorityBg = getReportPriorityBg(detail.priority);

  const targetColor = getTargetTypeColor(detail.target_type);
  const TargetIcon =
    detail.target_type === 'user' ? FaUser : FaBullhorn;

  // Reporter avatar
  const reporterAvatar = getStorageUrl(detail.reporter.profile_image);
  const reporterInitials = detail.reporter.name.charAt(0).toUpperCase();

  // Reported user avatar
  const reportedUserAvatar = getStorageUrl(
    detail.reported_user?.profile_image
  );
  const reportedUserInitials = detail.reported_user?.name
    .charAt(0)
    .toUpperCase();

  // Announcement cover
  const announcementCover = getStorageUrl(
    detail.announcement?.cover_image
  );

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
          border: `1px solid ${statusConfig.color}40`,
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
                ? `تمت المعالجة ${formatReportTimeAgo(detail.reviewed_at)}`
                : 'تمت المعالجة'}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: priorityBg,
              color: priorityColor,
              fontSize: '0.65rem',
              fontWeight: 800,
              border: `1px solid ${priorityColor}40`,
              whiteSpace: 'nowrap',
            }}
          >
            <FaExclamationTriangle size={9} />
            {detail.priority_label}
          </span>
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              opacity: 0.7,
              whiteSpace: 'nowrap',
            }}
          >
            #{detail.id}
          </span>
        </div>
      </motion.div>

      {/* ============================================
          Reporter Section
          ============================================ */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
        }}
      >
        <SectionTitle Icon={FaUser} title="المُبلِّغ" color="#17A2B8" />

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
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: reporterAvatar
                ? 'var(--bg-card)'
                : 'linear-gradient(135deg, #17A2B8, #20C9E0)',
              border: '2px solid var(--bg-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {reporterAvatar ? (
              <img
                src={reporterAvatar}
                alt={detail.reporter.name}
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
                {reporterInitials}
              </span>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                fontWeight: 800,
                marginBottom: '4px',
              }}
            >
              {detail.reporter.name}
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
              {detail.reporter.email}
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
            value={detail.reporter.whatsapp}
            color="#25D366"
            ltr
          />
        </div>
      </div>

      {/* ============================================
          Reported User Section
          ============================================ */}
      {detail.reported_user && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
          }}
        >
          <SectionTitle
            Icon={FaExclamationTriangle}
            title="المستخدم المُبلَّغ عنه"
            color="#DC3545"
          />

          {/* Previous reports warning */}
          {typeof detail.previous_reports_against_user === 'number' &&
            detail.previous_reports_against_user > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(220,53,69,0.08)',
                  border: '1px solid rgba(220,53,69,0.25)',
                  marginBottom: '12px',
                }}
              >
                <FaHistory size={12} color="#DC3545" />
                <span
                  style={{
                    color: '#DC3545',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  لديه{' '}
                  {detail.previous_reports_against_user === 1
                    ? 'بلاغ سابق'
                    : `${detail.previous_reports_against_user} بلاغات سابقة`}
                </span>
              </div>
            )}

          {/* ✅ Moderation status chips */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '12px',
            }}
          >
            {/* Warnings count */}
            {typeof detail.reported_user.warnings_count === 'number' &&
              detail.reported_user.warnings_count > 0 && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor:
                      detail.reported_user.warnings_count >= 3
                        ? 'rgba(220,53,69,0.1)'
                        : 'rgba(255,193,7,0.1)',
                    color:
                      detail.reported_user.warnings_count >= 3
                        ? '#DC3545'
                        : '#856404',
                    border: `1px solid ${
                      detail.reported_user.warnings_count >= 3
                        ? 'rgba(220,53,69,0.3)'
                        : 'rgba(255,193,7,0.35)'
                    }`,
                    fontSize: '0.7rem',
                    fontWeight: 800,
                  }}
                >
                  <FaExclamationTriangle size={10} />
                  {detail.reported_user.warnings_count}{' '}
                  {detail.reported_user.warnings_count === 1
                    ? 'تحذير سابق'
                    : 'تحذيرات سابقة'}
                </span>
              )}

            {/* Suspended */}
            {detail.reported_user.is_suspended && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,152,0,0.12)',
                  color: '#E87A20',
                  border: '1px solid rgba(255,152,0,0.35)',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                }}
              >
                <FaClockSolid size={10} />
                معلق حالياً
                {detail.reported_user.suspended_until && (
                  <span style={{ opacity: 0.75, fontWeight: 600 }}>
                    حتى{' '}
                    {new Date(
                      detail.reported_user.suspended_until
                    ).toLocaleDateString('ar-EG', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </span>
            )}

            {/* Blocked */}
            {detail.reported_user.is_blocked && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(220,53,69,0.12)',
                  color: '#DC3545',
                  border: '1px solid rgba(220,53,69,0.35)',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                }}
              >
                <FaBan size={10} />
                محظور بشكل دائم
              </span>
            )}

            {/* Clean state */}
            {detail.reported_user.warnings_count === 0 &&
              !detail.reported_user.is_suspended &&
              !detail.reported_user.is_blocked && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(40,167,69,0.08)',
                    color: '#28A745',
                    border: '1px solid rgba(40,167,69,0.25)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                  }}
                >
                  <FaCheckCircle size={10} />
                  سجل نظيف — لا تحذيرات سابقة
                </span>
              )}
          </div>

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
                  background: reportedUserAvatar
                    ? 'var(--bg-card)'
                    : 'linear-gradient(135deg, #DC3545, #F56575)',
                  border: '2px solid var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {reportedUserAvatar ? (
                  <img
                    src={reportedUserAvatar}
                    alt={detail.reported_user.name}
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
                    {reportedUserInitials}
                  </span>
                )}
              </div>
              {detail.reported_user.is_verified && (
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
                  {detail.reported_user.name}
                </span>
                {detail.reported_user.is_verified && (
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
                {!detail.reported_user.is_active && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(220,53,69,0.15)',
                      color: '#DC3545',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                    }}
                  >
                    <FaTimesCircle size={8} />
                    غير نشط
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
                {detail.reported_user.email}
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
              value={detail.reported_user.whatsapp}
              color="#25D366"
              ltr
            />
            <InfoRow
              Icon={FaCalendarAlt}
              label="عضو منذ"
              value={formatReportDate(detail.reported_user.created_at)}
              color="#17A2B8"
            />
          </div>

          <Link
            to={`/users/${detail.reported_user.id}`}
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
      )}

      {/* ============================================
          Announcement Section
          ============================================ */}
      {detail.announcement && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
          }}
        >
          <SectionTitle
            Icon={FaBullhorn}
            title="الإعلان المُبلَّغ عنه"
            color="#E87A20"
          />

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
              {announcementCover ? (
                <img
                  src={announcementCover}
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
      )}

      {/* ============================================
          Report Reason & Description
          ============================================ */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
        }}
      >
        <SectionTitle Icon={FaFlag} title="تفاصيل البلاغ" color="#E87A20" />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              borderRadius: '8px',
              backgroundColor: `${targetColor}15`,
              color: targetColor,
              fontSize: '0.72rem',
              fontWeight: 800,
              border: `1px solid ${targetColor}30`,
            }}
          >
            <TargetIcon size={10} />
            {detail.target_type_label}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(232,122,32,0.1)',
              color: 'var(--primary-orange)',
              fontSize: '0.72rem',
              fontWeight: 800,
              border: '1px solid rgba(232,122,32,0.25)',
            }}
          >
            <FaFlag size={10} />
            {detail.reason_label}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              borderRadius: '8px',
              backgroundColor: priorityBg,
              color: priorityColor,
              fontSize: '0.72rem',
              fontWeight: 800,
              border: `1px solid ${priorityColor}40`,
            }}
          >
            <FaExclamationTriangle size={10} />
            {detail.priority_label}
          </span>
        </div>

        {detail.description ? (
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
            {detail.description}
          </div>
        ) : (
          <div
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
              opacity: 0.7,
            }}
          >
            لم يقدم المستخدم تفاصيل إضافية
          </div>
        )}
      </div>

      {/* ============================================
          Admin Resolution Section
          ============================================ */}
      {detail.status !== 'pending' && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '14px',
            backgroundColor:
              detail.status === 'reviewed'
                ? 'rgba(40,167,69,0.06)'
                : 'rgba(108,117,125,0.08)',
            border: `1px solid ${
              detail.status === 'reviewed'
                ? 'rgba(40,167,69,0.25)'
                : 'rgba(108,117,125,0.25)'
            }`,
          }}
        >
          <SectionTitle
            Icon={FaEnvelopeOpenText}
            title="قرار الإدارة"
            color={
              detail.status === 'reviewed' ? '#28A745' : '#6C757D'
            }
          />

          {detail.action_taken && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '8px',
                backgroundColor: `${getActionColor(detail.action_taken)}15`,
                color: getActionColor(detail.action_taken),
                fontSize: '0.72rem',
                fontWeight: 800,
                border: `1px solid ${getActionColor(detail.action_taken)}40`,
                marginBottom: '10px',
              }}
            >
              <FaCheckCircle size={10} />
              {getActionLabel(detail.action_taken)}
            </div>
          )}

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
            {detail.admin_notes || 'تمت المراجعة دون ملاحظات'}
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
            {detail.resolved_by && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <FaUser size={9} />
                {detail.resolved_by.name}
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
                {formatReportDate(detail.reviewed_at)}
              </span>
            )}
          </div>
        </div>
      )}
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
  Icon: IconType;
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

const InfoRow = ({
  Icon,
  label,
  value,
  color,
  ltr,
}: {
  Icon: IconType;
  label: string;
  value: string;
  color: string;
  ltr?: boolean;
}) => (
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

export default AdminReportDetailContent;