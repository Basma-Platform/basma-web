import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaFlag,
  FaUser,
  FaBullhorn,
  FaClock,
  FaExclamationTriangle,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaEye,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { AdminReportListItem } from '../../../types';
import {
  getReportStatusColor,
  getReportStatusBg,
  getReportPriorityColor,
  getReportPriorityBg,
  getTargetTypeColor,
  getTargetTypeLabel,
  getReportPriorityLabel,
  formatReportTimeAgo,
} from '../../../utils/reportHelpers';
import { useCardBorderAnimation } from '../../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../../ui/AnimatedCardBorder';

interface AdminReportCardProps {
  report: AdminReportListItem;
}

const AdminReportCard = ({ report }: AdminReportCardProps) => {
  const navigate = useNavigate();

  // ✅ ONE hook instance per card
  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
    triggerOnce: true,
  });

  // ============================================
  // Status config
  // ============================================
  const statusConfig: {
    Icon: IconType;
    color: string;
    bg: string;
    gradient: string;
  } = (() => {
    switch (report.status) {
      case 'reviewed':
        return {
          Icon: FaCheckCircle,
          color: getReportStatusColor('reviewed'),
          bg: getReportStatusBg('reviewed'),
          gradient: 'linear-gradient(180deg, #28A745, #4FCB6E)',
        };
      case 'rejected':
        return {
          Icon: FaTimesCircle,
          color: getReportStatusColor('rejected'),
          bg: getReportStatusBg('rejected'),
          gradient: 'linear-gradient(180deg, #6C757D, #9CA3AF)',
        };
      case 'pending':
      default:
        return {
          Icon: FaHourglassHalf,
          color: getReportStatusColor('pending'),
          bg: getReportStatusBg('pending'),
          gradient: 'linear-gradient(180deg, #FFC107, #FFD966)',
        };
    }
  })();

  const StatusIcon = statusConfig.Icon;
  const priorityColor = getReportPriorityColor(report.priority);
  const priorityBg = getReportPriorityBg(report.priority);
  const targetTypeColor = getTargetTypeColor(report.target_type);

  const handleClick = () => {
    navigate(`/admin/reports/${report.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    // ✅ OUTER: owns ref + click + hover detection. NO motion.
    <div
      ref={attachRef}
      {...hoverHandlers}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      style={{
        height: '100%',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      {/* ✅ INNER: visual motion only. NO ref, NO click. */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'relative',
          backgroundColor: 'var(--bg-card)',
          border: `1px solid ${
            isDrawn ? statusConfig.color + '60' : 'var(--border-color)'
          }`,
          borderRadius: '16px',
          padding: '1rem',
          boxShadow: isDrawn
            ? '0 8px 24px var(--shadow-md)'
            : '0 2px 8px var(--shadow-sm)',
          transition: 'all 0.25s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          fontFamily: 'Cairo, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* ✅ Animated RIGHT border — status-driven, top → bottom */}
        <AnimatedCardBorder
          isDrawn={isDrawn}
          side="right"
          background={statusConfig.gradient}
          drawFrom="start"
          height={4}
          duration={0.55}
          idleOpacity={0}
          rounded
          cardRadius={16}
        />

        {/* ============================================
            Header: Status + Priority
            ============================================ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {/* Status pill with rotating hourglass for pending */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: statusConfig.bg,
              color: statusConfig.color,
              fontSize: '0.7rem',
              fontWeight: 800,
              border: `1px solid ${statusConfig.color}40`,
              whiteSpace: 'nowrap',
            }}
          >
            {/* ✅ Rotating hourglass when pending */}
            {report.status === 'pending' ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ display: 'inline-flex' }}
              >
                <StatusIcon size={9} />
              </motion.span>
            ) : (
              <StatusIcon size={9} />
            )}
            {report.status_label}
          </div>

          {/* Priority pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 9px',
              borderRadius: '8px',
              backgroundColor: priorityBg,
              color: priorityColor,
              fontSize: '0.65rem',
              fontWeight: 800,
              border: `1px solid ${priorityColor}40`,
              whiteSpace: 'nowrap',
            }}
          >
            <FaExclamationTriangle size={8} />
            {getReportPriorityLabel(report.priority)}
          </div>
        </div>

        {/* ============================================
            Target type + reported user / announcement
            ============================================ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: `${targetTypeColor}15`,
              border: `1px solid ${targetTypeColor}40`,
              color: targetTypeColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {report.target_type === 'user' ? (
              <FaUser size={16} />
            ) : (
              <FaBullhorn size={16} />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginBottom: '2px',
              }}
              title={
                report.target_type === 'user'
                  ? report.reported_user?.name
                  : report.announcement?.title
              }
            >
              {report.target_type === 'user'
                ? report.reported_user?.name || 'مستخدم'
                : report.announcement?.title || 'إعلان'}
            </div>
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.68rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {getTargetTypeLabel(report.target_type)} • {report.reason_label}
            </div>
          </div>
        </div>

        {/* ============================================
            Reporter info
            ============================================ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
          }}
        >
          <FaFlag size={10} color="var(--primary-orange)" />
          <span>بلاغ من:</span>
          <span
            style={{
              color: 'var(--text-secondary)',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
              flex: 1,
            }}
          >
            {report.reporter.name}
          </span>
        </div>

        {/* ============================================
            Footer: Time + CTA
            ============================================ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-color)',
            gap: '8px',
            marginTop: 'auto',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.7rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <FaClock size={10} />
            {formatReportTimeAgo(report.created_at)}
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(232,122,32,0.08)',
              color: 'var(--primary-orange)',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          >
            <FaEye size={10} />
            مراجعة
            <FaChevronLeft size={8} />
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminReportCard;