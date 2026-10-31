import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import {
  COMMUNITY_THEME,
  getCommunityTypeColor,
  formatCommunityTimeAgo,
} from '../../../utils/communityHelpers';
import {
  getCommunityTypeIcon,
  CommunityIcons,
} from '../../../utils/communityIcons';
import { CommunityTypeBadge, CommunityPinnedBadge } from '../shared';
import { useCardBorderAnimation } from '../../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../../ui/AnimatedCardBorder';
import type { CommunityPost } from '../../../types';

interface CommunityPostCardProps {
  post: CommunityPost;
  onClick: () => void;
}

const CommunityPostCard = ({ post, onClick }: CommunityPostCardProps) => {
  const { isDark } = useTheme();
  const TypeIcon = getCommunityTypeIcon(post.type);
  const typeColor = getCommunityTypeColor(post.type);
  const coverImage = post.images?.[0];
  const timeAgo = post.time_ago || formatCommunityTimeAgo(post.published_at);

  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={attachRef}
      {...hoverHandlers}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        border: `1.5px solid ${
          isDrawn
            ? post.is_pinned
              ? '#FFC107'
              : typeColor
            : 'var(--border-color)'
        }`,
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '1.5rem',
        cursor: 'pointer',
        transition:
          'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
        boxShadow: isDrawn
          ? post.is_pinned
            ? '0 14px 40px rgba(255, 193, 7, 0.25)'
            : `0 12px 36px ${typeColor}25`
          : '0 4px 16px var(--shadow-sm)',
        transform: isDrawn ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      {/* ✅ Animated top border */}
      <AnimatedCardBorder
        isDrawn={isDrawn}
        side="top"
        background={
          post.is_pinned
            ? 'linear-gradient(90deg, #FFC107, #FFD966)'
            : `linear-gradient(90deg, ${typeColor}, ${typeColor}70)`
        }
        drawFrom="start"
        height={4}
        duration={0.65}
        idleOpacity={0}
        rounded
        cardRadius={20}
      />

      {/* Cover image OR decorative header */}
      {coverImage ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            overflow: 'hidden',
            backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
          }}
        >
          <motion.img
            src={coverImage}
            alt={post.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            animate={{ scale: isDrawn ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          {/* Badges overlay */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <CommunityTypeBadge type={post.type} size="md" />
            {post.is_pinned && <CommunityPinnedBadge size="md" />}
          </div>

          {/* Image count */}
          {post.images.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                backgroundColor: 'rgba(0,0,0,0.65)',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontWeight: 800,
                fontFamily: 'Cairo, sans-serif',
                borderRadius: '20px',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            >
              <CommunityIcons.images size={11} />
              {post.images.length}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            padding: '2.5rem 1rem',
            background: `linear-gradient(135deg, ${typeColor}12, ${typeColor}05)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <motion.div
            animate={{ scale: isDrawn ? 1.08 : 1 }}
            transition={{ duration: 0.35 }}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: `${typeColor}20`,
              color: typeColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TypeIcon size={32} />
          </motion.div>

          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <CommunityTypeBadge type={post.type} size="md" />
            {post.is_pinned && <CommunityPinnedBadge size="md" />}
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ padding: '1.5rem' }}>
        {/* Time + views */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            fontSize: '0.72rem',
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 700,
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <CommunityIcons.time size={11} />
            {timeAgo}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <CommunityIcons.views size={11} />
            <span dir="ltr">{post.views.toLocaleString('en-US')}</span>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.15rem',
            fontWeight: 900,
            fontFamily: 'Cairo, sans-serif',
            lineHeight: 1.4,
            marginBottom: '0.6rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.title}
        </h3>

        {/* Description */}
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontFamily: 'Cairo, sans-serif',
            lineHeight: 1.75,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.description}
        </p>

        {/* Meta chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '1rem',
          }}
        >
          {post.city && (
            <MetaChip
              icon={<CommunityIcons.location size={10} />}
              label={
                post.governorate
                  ? `${post.governorate.name} - ${post.city.name}`
                  : post.city.name
              }
            />
          )}
          {!post.city && post.governorate && (
            <MetaChip
              icon={<CommunityIcons.region size={10} />}
              label={post.governorate.name}
            />
          )}
          {post.category && (
            <MetaChip
              icon={<CommunityIcons.category size={10} />}
              label={post.category.name}
            />
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          {post.whatsapp_number ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                color: '#25D366',
              }}
            >
              <CommunityIcons.clicks size={11} />
              <span dir="ltr">
                {post.whatsapp_clicks.toLocaleString('en-US')}
              </span>
            </div>
          ) : (
            <span />
          )}

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: COMMUNITY_THEME.accent,
              fontSize: '0.78rem',
              fontWeight: 800,
              fontFamily: 'Cairo, sans-serif',
              transition: 'transform 0.25s ease',
              transform: isDrawn ? 'translateX(-4px)' : 'translateX(0)',
            }}
          >
            عرض التفاصيل
            <CommunityIcons.arrowLeft size={11} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MetaChip = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '4px 10px',
      fontSize: '0.72rem',
      fontFamily: 'Cairo, sans-serif',
      fontWeight: 700,
      color: 'var(--text-muted)',
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
      borderRadius: '20px',
    }}
  >
    {icon}
    {label}
  </span>
);

export default CommunityPostCard;