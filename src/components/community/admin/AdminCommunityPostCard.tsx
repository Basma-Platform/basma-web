import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  COMMUNITY_THEME,
  formatCommunityTimeAgo,
  getCommunityTypeColor,
} from '../../../utils/communityHelpers';
import { CommunityIcons } from '../../../utils/communityIcons';
import {
  CommunityTypeBadge,
  CommunityStatusBadge,
  CommunityPinnedBadge,
} from '../shared';
import type { AdminCommunityPostListItem } from '../../../types';

interface AdminCommunityPostCardProps {
  post: AdminCommunityPostListItem;
  index?: number;
}

const AdminCommunityPostCard = ({
  post,
  index = 0,
}: AdminCommunityPostCardProps) => {
  const typeColor = getCommunityTypeColor(post.type);
  const timeAgo = formatCommunityTimeAgo(post.created_at);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: `1.5px solid ${
          post.is_pinned ? '#FFC107' : 'var(--border-color)'
        }`,
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        transition: 'all 0.25s ease',
        boxShadow: post.is_pinned
          ? '0 4px 18px rgba(255, 193, 7, 0.15)'
          : '0 2px 8px var(--shadow-sm)',
      }}
    >
      {/* Left type color bar */}
      <div
        style={{
          width: '4px',
          alignSelf: 'stretch',
          borderRadius: '4px',
          background: post.is_pinned
            ? 'linear-gradient(180deg, #FFC107, #FFD966)'
            : `linear-gradient(180deg, ${typeColor}, ${typeColor}70)`,
          flexShrink: 0,
        }}
      />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Badges */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: '0.5rem',
          }}
        >
          <CommunityTypeBadge type={post.type} size="sm" />
          <CommunityStatusBadge
            status={post.status}
            labelOverride={post.status_label}
            size="sm"
          />
          {post.is_pinned && <CommunityPinnedBadge size="sm" />}
        </div>

        {/* Title */}
        <Link
          to={`/admin/community-posts/${post.id}`}
          style={{
            display: 'block',
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            fontWeight: 800,
            fontFamily: 'Cairo, sans-serif',
            lineHeight: 1.4,
            textDecoration: 'none',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {post.title}
        </Link>

        {/* Meta row */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 600,
          }}
        >
          {post.user && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CommunityIcons.info size={10} />
              {post.user.name}
            </span>
          )}
          {post.city && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CommunityIcons.location size={10} />
              {post.city.name}
            </span>
          )}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <CommunityIcons.time size={10} />
            {timeAgo}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <CommunityIcons.views size={10} />
            <span dir="ltr">{post.views}</span>
          </span>
        </div>
      </div>

      {/* Right: CTA */}
      <Link
        to={`/admin/community-posts/${post.id}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          fontSize: '0.75rem',
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 800,
          color: COMMUNITY_THEME.accent,
          backgroundColor: COMMUNITY_THEME.accentSoft,
          border: `1px solid ${COMMUNITY_THEME.accent}30`,
          borderRadius: '24px',
          textDecoration: 'none',
          flexShrink: 0,
          transition: 'all 0.2s ease',
        }}
      >
        مراجعة
        <CommunityIcons.arrowLeft size={10} />
      </Link>
    </motion.div>
  );
};

export default AdminCommunityPostCard;