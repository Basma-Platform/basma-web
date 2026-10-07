import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaAward, FaUsers, FaHandHoldingHeart, FaCoins } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { DonationAchievement } from '../../../types';
import { getStorageUrl } from '../../../utils/storageHelpers';
import {
  getAchievementChips,
  ACHIEVEMENT_PLACEHOLDER,
  formatAchievementDate,
} from '../../../utils/achievementHelpers';

interface AchievementCardProps {
  achievement: DonationAchievement;
  onClick?: (achievement: DonationAchievement) => void;
  /**
   * 'carousel' (default) — fixed 300px width, used inside AchievementsCarousel
   * 'grid'               — fills parent grid cell, used in AchievementsPage
   */
  variant?: 'carousel' | 'grid';
}

const ACCENT = '#FFC107';
const ACCENT_DEEP = '#E87A20';

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

const AchievementCard = ({
  achievement,
  onClick,
  variant = 'carousel',
}: AchievementCardProps) => {
  const [imageError, setImageError] = useState(false);
  const coverUrl = getStorageUrl(achievement.cover_image_url);
  const showImage = !!coverUrl && !imageError;

  const chips = getAchievementChips(achievement.metadata);

  const isGrid = variant === 'grid';

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(achievement)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(achievement);
        }
      }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className={
        isGrid ? 'ach-card ach-card--grid' : 'ach-card ach-card--carousel'
      }
      style={{
        // ✅ Grid → fill parent; Carousel → fixed 300px
        width: isGrid ? '100%' : '300px',
        flexShrink: isGrid ? 1 : 0,
        minWidth: 0,

        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '18px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Cairo, sans-serif',
        boxShadow: '0 4px 16px var(--shadow-sm)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        outline: 'none',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 14px 32px ${ACCENT_DEEP}40`;
        e.currentTarget.style.borderColor = ACCENT;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      {/* Cover */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: isGrid ? '4 / 3' : undefined,
          height: isGrid ? undefined : '170px',
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
              transition: 'transform 0.5s ease',
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

        {/* Gradient bottom overlay */}
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
            <FaAward size={9} /> مميز
          </div>
        )}

        {/* Date badge bottom */}
        {achievement.achievement_date && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '12px',
              color: '#FFFFFF',
              fontSize: '0.68rem',
              fontWeight: 700,
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            }}
          >
            {formatAchievementDate(achievement.achievement_date)}
          </div>
        )}
      </div>

      {/* Body */}
      <div
        style={{
          padding: '14px 15px 15px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flex: 1,
        }}
      >
        <h4
          style={{
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.5em',
          }}
        >
          {achievement.title}
        </h4>

        {/* Chips */}
        {chips.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              marginTop: 'auto',
            }}
          >
            {chips.map((chip) => {
              const ChipIcon = chipIcon(chip.key);
              return (
                <span
                  key={chip.key}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    backgroundColor: `${chip.color}15`,
                    color: chip.color,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <ChipIcon size={9} />
                  {chip.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AchievementCard;