import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUserCheck,
  FaClock,
  FaEye,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaArchive,
  FaUser,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { AdminHelpRequestListItem } from '../../../../types';
import {
  formatHelpRequestTimeAgo,
  FUND_THEME,
} from '../../../../utils/helpRequestHelpers';
import { getStorageUrl } from '../../../../utils/storageHelpers';
import { useCardBorderAnimation } from '../../../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../../../ui/AnimatedCardBorder';

interface AdminHelpRequestCardProps {
  request: AdminHelpRequestListItem;
  onClick: (request: AdminHelpRequestListItem) => void;
}

const statusConfig = (
  status: AdminHelpRequestListItem['status']
): {
  Icon: IconType;
  label: string;
  color: string;
  bg: string;
  border: string;
  gradient: string;
} => {
  switch (status) {
    case 'approved':
      return {
        Icon: FaCheckCircle,
        label: 'منشور',
        color: '#28A745',
        bg: 'rgba(40,167,69,0.12)',
        border: 'rgba(40,167,69,0.3)',
        gradient: 'linear-gradient(180deg, #28A745, #4FCB6E)',
      };
    case 'rejected':
      return {
        Icon: FaTimesCircle,
        label: 'مرفوض',
        color: '#DC3545',
        bg: 'rgba(220,53,69,0.12)',
        border: 'rgba(220,53,69,0.3)',
        gradient: 'linear-gradient(180deg, #DC3545, #F56575)',
      };
    case 'archived':
      return {
        Icon: FaArchive,
        label: 'مؤرشف',
        color: '#6B4226',
        bg: 'rgba(107,66,38,0.12)',
        border: 'rgba(107,66,38,0.3)',
        gradient: 'linear-gradient(180deg, #6B4226, #8B5A2B)',
      };
    case 'pending':
    default:
      return {
        Icon: FaHourglassHalf,
        label: 'قيد المراجعة',
        color: '#FFB800',
        bg: 'rgba(255,184,0,0.12)',
        border: 'rgba(255,184,0,0.3)',
        gradient: 'linear-gradient(180deg, #FFB800, #F5A623)',
      };
  }
};

const AdminHelpRequestCard = ({
  request,
  onClick,
}: AdminHelpRequestCardProps) => {
  const [imageError, setImageError] = useState(false);
  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
    triggerOnce: true,
  });

  const config = statusConfig(request.status);
  const StatusIcon = config.Icon;
  const thumbUrl = getStorageUrl(request.video.thumbnail_url);
  const showImage = !!thumbUrl && !imageError;

  const handleClick = () => onClick(request);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(request);
    }
  };

  return (
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
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.3 }}
        className="admin-hr-card"
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

        <div className="admin-hr-card__body">
          {/* User row */}
          <div className="admin-hr-card__user">
            <div className="admin-hr-card__avatar-wrap">
              <div className="admin-hr-card__avatar">
                {request.user.profile_image ? (
                  <img
                    src={getStorageUrl(request.user.profile_image) || ''}
                    alt={request.user.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <FaUser size={14} color="#FFFFFF" />
                )}
              </div>
              {request.user.is_verified && (
                <span className="admin-hr-card__verified" title="موثق">
                  <FaUserCheck size={7} />
                </span>
              )}
            </div>

            <div className="admin-hr-card__user-info">
              <div className="admin-hr-card__user-name">
                {request.user.name}
              </div>
              <div className="admin-hr-card__user-email">
                {request.user.email}
              </div>
            </div>

            <div
              className="admin-hr-card__status"
              style={{
                backgroundColor: config.bg,
                color: config.color,
                border: `1px solid ${config.border}`,
              }}
            >
              {request.status === 'pending' ? (
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
              {config.label}
            </div>
          </div>

          {/* Thumbnail + title */}
          <div className="admin-hr-card__body-content">
            <div className="admin-hr-card__thumb">
              {showImage ? (
                <img
                  src={thumbUrl!}
                  alt={request.public_title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'blur(1.5px)',
                  }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <FaUser size={16} color={FUND_THEME.accent} opacity={0.4} />
              )}
            </div>

            <div className="admin-hr-card__title-block">
              <div className="admin-hr-card__title">{request.public_title}</div>
              <div className="admin-hr-card__region">
                <FaMapMarkerAlt size={9} />
                {request.region.governorate.name}
                {request.region.city?.name &&
                  ` - ${request.region.city.name}`}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="admin-hr-card__footer">
            <div className="admin-hr-card__stats">
              <span>
                <FaEye size={10} />
                {request.stats.views}
              </span>
              <span>
                <FaClock size={10} />
                {formatHelpRequestTimeAgo(request.created_at)}
              </span>
            </div>

            <span className="admin-hr-card__cta">
              عرض التفاصيل
              <FaArrowLeft size={8} />
            </span>
          </div>
        </div>

        <style>{`
          .admin-hr-card__body { padding: 1rem; display: flex; flex-direction: column; gap: 12px; width: 100%; box-sizing: border-box; }
          .admin-hr-card__user { display: flex; align-items: center; gap: 10px; width: 100%; min-width: 0; }
          .admin-hr-card__avatar-wrap { position: relative; width: 44px; height: 44px; flex-shrink: 0; }
          .admin-hr-card__avatar { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, #17A2B8, #20C9E0); border: 2px solid var(--bg-card); display: flex; align-items: center; justify-content: center; }
          .admin-hr-card__verified { position: absolute; bottom: -2px; right: -2px; width: 16px; height: 16px; border-radius: 50%; background-color: #0d6efd; display: flex; align-items: center; justify-content: center; color: #FFFFFF; border: 2px solid var(--bg-card); }
          .admin-hr-card__user-info { flex: 1; min-width: 0; }
          .admin-hr-card__user-name { color: var(--text-secondary); font-size: 0.85rem; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
          .admin-hr-card__user-email { color: var(--text-muted); font-size: 0.68rem; font-family: system-ui, sans-serif; direction: ltr; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .admin-hr-card__status { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 8px; font-size: 0.65rem; font-weight: 800; flex-shrink: 0; white-space: nowrap; }
          .admin-hr-card__body-content { display: flex; gap: 10px; align-items: center; padding: 10px; border-radius: 10px; background-color: var(--bg-input); border: 1px solid var(--border-color); width: 100%; box-sizing: border-box; min-width: 0; }
          .admin-hr-card__thumb { width: 56px; height: 56px; border-radius: 8px; overflow: hidden; background-color: var(--bg-card); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid var(--border-color); }
          .admin-hr-card__title-block { flex: 1; min-width: 0; }
          .admin-hr-card__title { color: var(--text-secondary); font-size: 0.85rem; font-weight: 800; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 4px; }
          .admin-hr-card__region { color: var(--text-muted); font-size: 0.68rem; display: flex; align-items: center; gap: 4px; }
          .admin-hr-card__footer { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid var(--border-color); gap: 8px; margin-top: auto; flex-wrap: wrap; }
          .admin-hr-card__stats { display: flex; gap: 12px; align-items: center; color: var(--text-muted); font-size: 0.68rem; font-weight: 600; }
          .admin-hr-card__stats span { display: inline-flex; align-items: center; gap: 4px; }
          .admin-hr-card__cta { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 8px; background-color: ${FUND_THEME.accent}12; color: ${FUND_THEME.accent}; font-size: 0.72rem; font-weight: 700; }
          @media (max-width: 480px) {
            .admin-hr-card__body { padding: 0.85rem; gap: 10px; }
            .admin-hr-card__avatar-wrap { width: 40px; height: 40px; }
            .admin-hr-card__status { font-size: 0.6rem; padding: 3px 8px; }
          }
          @media (max-width: 380px) {
            .admin-hr-card__user { flex-wrap: wrap; }
            .admin-hr-card__status { margin-right: auto; margin-top: 4px; }
          }
        `}</style>
      </motion.div>
    </div>
  );
};

export default AdminHelpRequestCard;