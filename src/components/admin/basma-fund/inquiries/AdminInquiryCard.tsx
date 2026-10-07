import { motion } from 'framer-motion';
import {
  FaUser,
  FaWhatsapp,
  FaEnvelope,
  FaTicketAlt,
  FaBullhorn,
  FaClock,
  FaArrowLeft,
} from 'react-icons/fa';
import type { AdminDonationInquiryListItem } from '../../../../types';
import {
  formatHelpRequestTimeAgo,
  FUND_THEME,
} from '../../../../utils/helpRequestHelpers';
import { useCardBorderAnimation } from '../../../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../../../ui/AnimatedCardBorder';

interface AdminInquiryCardProps {
  inquiry: AdminDonationInquiryListItem;
  onClick: (inquiry: AdminDonationInquiryListItem) => void;
}

const statusConfig = (
  status: AdminDonationInquiryListItem['status']
): {
  label: string;
  color: string;
  bg: string;
  border: string;
  gradient: string;
} => {
  switch (status) {
    case 'contacted':
      return {
        label: 'تم التواصل',
        color: '#FFB800',
        bg: 'rgba(255,184,0,0.12)',
        border: 'rgba(255,184,0,0.3)',
        gradient: 'linear-gradient(180deg, #FFB800, #F5A623)',
      };
    case 'completed':
      return {
        label: 'مكتمل',
        color: '#28A745',
        bg: 'rgba(40,167,69,0.12)',
        border: 'rgba(40,167,69,0.3)',
        gradient: 'linear-gradient(180deg, #28A745, #4FCB6E)',
      };
    case 'cancelled':
      return {
        label: 'ملغي',
        color: '#6C757D',
        bg: 'rgba(108,117,125,0.12)',
        border: 'rgba(108,117,125,0.3)',
        gradient: 'linear-gradient(180deg, #6C757D, #9CA3AF)',
      };
    case 'new':
    default:
      return {
        label: 'جديد',
        color: FUND_THEME.accent,
        bg: `${FUND_THEME.accent}15`,
        border: `${FUND_THEME.accent}40`,
        gradient: FUND_THEME.gradient,
      };
  }
};

const AdminInquiryCard = ({ inquiry, onClick }: AdminInquiryCardProps) => {
  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
    triggerOnce: true,
  });

  const config = statusConfig(inquiry.status);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(inquiry);
    }
  };

  return (
    <div
      ref={attachRef}
      {...hoverHandlers}
      onClick={() => onClick(inquiry)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      style={{
        height: '100%',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.3 }}
        className="admin-inq-card"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: `1px solid ${
            isDrawn ? config.color + '60' : 'var(--border-color)'
          }`,
          borderRadius: '16px',
          boxShadow: isDrawn
            ? '0 8px 24px var(--shadow-md)'
            : '0 2px 8px var(--shadow-sm)',
          fontFamily: 'Cairo, sans-serif',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          boxSizing: 'border-box',
          transition: 'all 0.25s ease',
        }}
      >
        <AnimatedCardBorder
          isDrawn={isDrawn}
          side="right"
          background={config.gradient}
          drawFrom="start"
          height={4}
          duration={0.55}
          idleOpacity={0}
          rounded
          cardRadius={16}
        />

        <div className="admin-inq-card__body">
          {/* Header: tracking code + status */}
          <div className="admin-inq-card__header">
            <div className="admin-inq-card__tracking">
              <FaTicketAlt size={11} />
              <span className="admin-inq-card__tracking-code">
                {inquiry.tracking_code}
              </span>
            </div>
            <div
              className="admin-inq-card__status"
              style={{
                backgroundColor: config.bg,
                color: config.color,
                border: `1px solid ${config.border}`,
              }}
            >
              {config.label}
            </div>
          </div>

          {/* Donor */}
          <div className="admin-inq-card__donor">
            <div className="admin-inq-card__donor-avatar">
              <FaUser size={14} color="#FFFFFF" />
            </div>
            <div className="admin-inq-card__donor-info">
              <div className="admin-inq-card__donor-name">
                {inquiry.donor.name || 'متبرع مجهول'}
              </div>
              <div className="admin-inq-card__donor-contacts">
                {inquiry.donor.whatsapp && (
                  <span>
                    <FaWhatsapp size={9} color="#25D366" />
                    {inquiry.donor.whatsapp}
                  </span>
                )}
                {inquiry.donor.email && (
                  <span>
                    <FaEnvelope size={9} color={FUND_THEME.accent} />
                    {inquiry.donor.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Help request link */}
          <div className="admin-inq-card__hr">
            <FaBullhorn size={11} color={FUND_THEME.accent} />
            <span className="admin-inq-card__hr-title">
              {inquiry.help_request.public_title}
            </span>
          </div>

          {/* Message preview */}
          {inquiry.message && (
            <div className="admin-inq-card__message">
              {inquiry.message.length > 80
                ? inquiry.message.slice(0, 77) + '...'
                : inquiry.message}
            </div>
          )}

          {/* Footer */}
          <div className="admin-inq-card__footer">
            <span className="admin-inq-card__time">
              <FaClock size={10} />
              {formatHelpRequestTimeAgo(inquiry.created_at)}
            </span>
            <span className="admin-inq-card__cta">
              عرض التفاصيل
              <FaArrowLeft size={8} />
            </span>
          </div>
        </div>

        <style>{`
          .admin-inq-card__body { padding: 1rem; display: flex; flex-direction: column; gap: 10px; }
          .admin-inq-card__header { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
          .admin-inq-card__tracking { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 8px; background-color: var(--bg-input); border: 1px dashed var(--border-color); color: ${FUND_THEME.accent}; font-weight: 800; font-family: system-ui, sans-serif; font-size: 0.72rem; }
          .admin-inq-card__tracking-code { letter-spacing: 1px; font-variant-numeric: tabular-nums; }
          .admin-inq-card__status { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 8px; font-size: 0.65rem; font-weight: 800; white-space: nowrap; }
          .admin-inq-card__donor { display: flex; gap: 10px; align-items: center; padding: 10px; border-radius: 10px; background-color: var(--bg-input); border: 1px solid var(--border-color); }
          .admin-inq-card__donor-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, ${FUND_THEME.accent}, ${FUND_THEME.accentLight}); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .admin-inq-card__donor-info { flex: 1; min-width: 0; }
          .admin-inq-card__donor-name { color: var(--text-secondary); font-size: 0.82rem; font-weight: 800; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .admin-inq-card__donor-contacts { display: flex; flex-direction: column; gap: 2px; font-size: 0.68rem; color: var(--text-muted); }
          .admin-inq-card__donor-contacts span { display: inline-flex; align-items: center; gap: 4px; direction: ltr; font-family: system-ui, sans-serif; }
          .admin-inq-card__hr { display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 0.72rem; padding: 6px 10px; background-color: var(--bg-input); border-radius: 8px; }
          .admin-inq-card__hr-title { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .admin-inq-card__message { font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; padding: 0 2px; font-style: italic; }
          .admin-inq-card__footer { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid var(--border-color); gap: 8px; margin-top: auto; flex-wrap: wrap; }
          .admin-inq-card__time { color: var(--text-muted); font-size: 0.7rem; display: inline-flex; align-items: center; gap: 4px; }
          .admin-inq-card__cta { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 8px; background-color: ${FUND_THEME.accent}12; color: ${FUND_THEME.accent}; font-size: 0.72rem; font-weight: 700; }
        `}</style>
      </motion.div>
    </div>
  );
};

export default AdminInquiryCard;