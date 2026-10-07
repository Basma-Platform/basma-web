import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaEye,
  FaEyeSlash,
  FaStar,
  FaRegStar,
  FaEdit,
  FaTrash,
  FaUsers,
  FaHandHoldingHeart,
  FaCoins,
  FaAward,
  FaCalendarAlt,
  FaUser,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { DonationAchievement } from '../../../../types';
import { getStorageUrl } from '../../../../utils/storageHelpers';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';
import {
  getAchievementChips,
  formatAchievementDate,
  ACHIEVEMENT_PLACEHOLDER,
} from '../../../../utils/achievementHelpers';
import { useCardBorderAnimation } from '../../../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../../../ui/AnimatedCardBorder';

interface AdminAchievementCardProps {
  achievement: DonationAchievement;
  onEdit: (achievement: DonationAchievement) => void;
  onDelete: (achievement: DonationAchievement) => void;
  onToggleFeatured: (achievement: DonationAchievement) => void;
  onToggleActive: (achievement: DonationAchievement) => void;
  isActionLoading?: boolean;
}

const chipIcon = (key: string): IconType => {
  switch (key) {
    case 'beneficiaries':
      return FaUsers;
    case 'donors':
      return FaHandHoldingHeart;
    case 'amount':
      return FaCoins;
    default:
      return FaAward;
  }
};

const AdminAchievementCard = ({
  achievement,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleActive,
  isActionLoading = false,
}: AdminAchievementCardProps) => {
  const [imageError, setImageError] = useState(false);
  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
    triggerOnce: true,
  });

  const coverUrl = getStorageUrl(achievement.cover_image_url);
  const showImage = !!coverUrl && !imageError;
  const chips = getAchievementChips(achievement.metadata);

  const accent = achievement.is_featured ? '#FFC107' : FUND_THEME.accent;
  const gradient = achievement.is_featured
    ? 'linear-gradient(180deg, #FFC107, #E87A20)'
    : FUND_THEME.gradient;

  return (
    <div ref={attachRef} {...hoverHandlers} style={{ height: '100%', minWidth: 0 }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.3 }}
        className="admin-ach-card"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: `1px solid ${
            isDrawn ? accent + '60' : 'var(--border-color)'
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
          opacity: !achievement.is_active ? 0.7 : 1,
        }}
      >
        <AnimatedCardBorder
          isDrawn={isDrawn}
          side="right"
          background={gradient}
          drawFrom="start"
          height={4}
          duration={0.55}
          idleOpacity={0}
          rounded
          cardRadius={16}
        />

        {/* Cover */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '160px',
            backgroundColor: 'var(--bg-input)',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {showImage ? (
            <img
              src={coverUrl!}
              alt={achievement.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  'linear-gradient(135deg, rgba(255,193,7,0.15), rgba(232,122,32,0.08))',
              }}
            >
              <img
                src={ACHIEVEMENT_PLACEHOLDER}
                alt=""
                style={{ width: '60px', opacity: 0.4 }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}

          {/* Gradient bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60px',
              background:
                'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
              pointerEvents: 'none',
            }}
          />

          {/* Featured badge */}
          {achievement.is_featured && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #FFC107, #E87A20)',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(232,122,32,0.4)',
              }}
            >
              <FaStar size={9} /> مميز
            </div>
          )}

          {/* Inactive badge */}
          {!achievement.is_active && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: 'rgba(108,117,125,0.9)',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 800,
                backdropFilter: 'blur(6px)',
              }}
            >
              <FaEyeSlash size={9} /> معطّل
            </div>
          )}

          {/* Date badge */}
          {achievement.achievement_date && (
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontWeight: 700,
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              <FaCalendarAlt size={9} />
              {formatAchievementDate(achievement.achievement_date)}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="admin-ach-card__body">
          <h4 className="admin-ach-card__title">{achievement.title}</h4>

          <p className="admin-ach-card__desc">{achievement.description}</p>

          {/* Chips */}
          {chips.length > 0 && (
            <div className="admin-ach-card__chips">
              {chips.map((chip) => {
                const ChipIcon = chipIcon(chip.key);
                return (
                  <span
                    key={chip.key}
                    className="admin-ach-card__chip"
                    style={{
                      backgroundColor: `${chip.color}15`,
                      color: chip.color,
                    }}
                  >
                    <ChipIcon size={9} />
                    {chip.label}
                  </span>
                );
              })}
            </div>
          )}

          {/* Meta */}
          <div className="admin-ach-card__meta">
            {achievement.created_by && (
              <span>
                <FaUser size={9} />
                {achievement.created_by.name}
              </span>
            )}
            <span>ترتيب: {achievement.display_order}</span>
          </div>

          {/* Actions */}
          <div className="admin-ach-card__actions">
            <button
              type="button"
              onClick={() => onToggleFeatured(achievement)}
              disabled={isActionLoading}
              title={achievement.is_featured ? 'إلغاء التمييز' : 'تمييز'}
              className="admin-ach-card__icon-btn admin-ach-card__icon-btn--star"
              data-active={achievement.is_featured ? 'true' : 'false'}
            >
              {achievement.is_featured ? (
                <FaStar size={12} />
              ) : (
                <FaRegStar size={12} />
              )}
            </button>

            <button
              type="button"
              onClick={() => onToggleActive(achievement)}
              disabled={isActionLoading}
              title={achievement.is_active ? 'تعطيل' : 'تفعيل'}
              className="admin-ach-card__icon-btn admin-ach-card__icon-btn--toggle"
              data-active={achievement.is_active ? 'true' : 'false'}
            >
              {achievement.is_active ? (
                <FaEye size={12} />
              ) : (
                <FaEyeSlash size={12} />
              )}
            </button>

            <button
              type="button"
              onClick={() => onEdit(achievement)}
              disabled={isActionLoading}
              title="تعديل"
              className="admin-ach-card__icon-btn admin-ach-card__icon-btn--edit"
            >
              <FaEdit size={12} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(achievement)}
              disabled={isActionLoading}
              title="حذف"
              className="admin-ach-card__icon-btn admin-ach-card__icon-btn--delete"
            >
              <FaTrash size={12} />
            </button>
          </div>
        </div>

        <style>{`
          .admin-ach-card__body { padding: 14px 15px 15px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
          .admin-ach-card__title { color: var(--text-primary); font-size: 0.92rem; font-weight: 800; margin: 0; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.5em; }
          .admin-ach-card__desc { color: var(--text-muted); font-size: 0.75rem; line-height: 1.5; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
          .admin-ach-card__chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: auto; }
          .admin-ach-card__chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 8px; font-size: 0.66rem; font-weight: 700; white-space: nowrap; }
          .admin-ach-card__meta { display: flex; gap: 12px; align-items: center; font-size: 0.65rem; color: var(--text-muted); flex-wrap: wrap; }
          .admin-ach-card__meta span { display: inline-flex; align-items: center; gap: 4px; }
          .admin-ach-card__actions { display: flex; gap: 6px; padding-top: 10px; border-top: 1px solid var(--border-color); justify-content: flex-end; }
          .admin-ach-card__icon-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border-color); background-color: transparent; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
          .admin-ach-card__icon-btn:disabled { opacity: 0.5; cursor: not-allowed; }
          .admin-ach-card__icon-btn--star[data-active="true"] { background-color: rgba(255,193,7,0.12); border-color: rgba(255,193,7,0.35); color: #FFC107; }
          .admin-ach-card__icon-btn--star:hover:not(:disabled) { background-color: rgba(255,193,7,0.12); border-color: rgba(255,193,7,0.35); color: #FFC107; }
          .admin-ach-card__icon-btn--toggle[data-active="true"] { background-color: rgba(40,167,69,0.12); border-color: rgba(40,167,69,0.35); color: #28A745; }
          .admin-ach-card__icon-btn--toggle:hover:not(:disabled) { background-color: rgba(40,167,69,0.12); border-color: rgba(40,167,69,0.35); color: #28A745; }
          .admin-ach-card__icon-btn--edit:hover:not(:disabled) { background-color: ${FUND_THEME.accent}12; border-color: ${FUND_THEME.accent}40; color: ${FUND_THEME.accent}; }
          .admin-ach-card__icon-btn--delete:hover:not(:disabled) { background-color: rgba(220,53,69,0.12); border-color: rgba(220,53,69,0.35); color: #DC3545; }
        `}</style>
      </motion.div>
    </div>
  );
};

export default AdminAchievementCard;