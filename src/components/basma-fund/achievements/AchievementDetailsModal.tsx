import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaAward,
  FaCalendarAlt,
  FaUsers,
  FaHandHoldingHeart,
  FaCoins,
  FaVideo,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { DonationAchievement } from '../../../types';
import { getStorageUrl } from '../../../utils/storageHelpers';
import {
  getAchievementChips,
  formatAchievementDate,
  ACHIEVEMENT_PLACEHOLDER,
} from '../../../utils/achievementHelpers';

interface AchievementDetailsModalProps {
  isOpen: boolean;
  achievement: DonationAchievement | null;
  onClose: () => void;
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

/**
 * Achievement details modal — opened from AchievementsCarousel / AchievementsPage.
 *
 * ⚠️ Note: The outer motion.div (card) has `position: relative` so the
 * absolute-positioned X button anchors to the card, NOT the fixed backdrop.
 */
const AchievementDetailsModal = ({
  isOpen,
  achievement,
  onClose,
}: AchievementDetailsModalProps) => {
  const [imageError, setImageError] = useState(false);

  if (!achievement) return null;

  const coverUrl = getStorageUrl(achievement.cover_image_url);
  const showImage = !!coverUrl && !imageError;
  const chips = getAchievementChips(achievement.metadata);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1090,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            direction: 'rtl',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative', // ✅ anchors the absolute X button to the card
              width: '100%',
              maxWidth: '640px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '22px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              fontFamily: 'Cairo, sans-serif',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Close — always at card's top-left */}
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                zIndex: 5,
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0.55)',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(6px)',
              }}
            >
              <FaTimes size={13} />
            </button>

            {/* Cover */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
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
                    color: '#FFC107',
                  }}
                >
                  <img
                    src={ACHIEVEMENT_PLACEHOLDER}
                    alt=""
                    style={{ width: '80px', opacity: 0.4 }}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}

              {achievement.is_featured && (
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #FFC107, #E87A20)',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(232,122,32,0.4)',
                  }}
                >
                  <FaAward size={10} /> إنجاز مميز
                </div>
              )}
            </div>

            {/* Body */}
            <div
              style={{
                padding: '1.5rem',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              <h3
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  margin: '0 0 10px',
                  lineHeight: 1.3,
                }}
              >
                {achievement.title}
              </h3>

              {/* Meta row */}
              <div
                style={{
                  display: 'flex',
                  gap: '14px',
                  flexWrap: 'wrap',
                  marginBottom: '1rem',
                }}
              >
                {achievement.achievement_date && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--text-muted)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                  >
                    <FaCalendarAlt size={11} />
                    {formatAchievementDate(achievement.achievement_date)}
                  </div>
                )}

                {achievement.created_by && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--text-muted)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                  >
                    <FaAward size={11} />
                    بواسطة: {achievement.created_by.name}
                  </div>
                )}
              </div>

              {/* Chips */}
              {chips.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginBottom: '1rem',
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
                          gap: '5px',
                          padding: '6px 12px',
                          borderRadius: '10px',
                          backgroundColor: `${chip.color}15`,
                          color: chip.color,
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}
                      >
                        <ChipIcon size={11} />
                        {chip.label}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Description */}
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  lineHeight: 1.75,
                  margin: '0 0 1rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {achievement.description}
              </p>

              {/* Video URL button */}
              {achievement.video_url && (
                <a
                  href={achievement.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '11px',
                    backgroundColor: 'rgba(23,162,184,0.1)',
                    color: '#17A2B8',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  <FaVideo size={12} />
                  مشاهدة الفيديو
                  <FaExternalLinkAlt size={9} />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementDetailsModal;