import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FilePlus,
  UserPlus,
  Star,
  Flag,
  ShieldCheck,
  ShieldX,
  PauseCircle,
  Trash2,
  FileCheck,
  Sparkles,
  XCircle,
  AlertTriangle,
  Pause,
  Ban,
  CheckCircle,
  Info,
  type LucideIcon,
} from 'lucide-react';
import { getProfileImageUrl, getUserInitials } from '../../../../utils/profileHelpers';
import type { AdminActivityItem } from '../../../../types';

interface ActivityItemProps {
  activity: AdminActivityItem;
  compact?: boolean;
}

// Icon mapping (Lucide names from API → components)
const ICON_MAP: Record<string, LucideIcon> = {
  'user-plus': UserPlus,
  'file-plus': FilePlus,
  'pause-circle': PauseCircle,
  'trash-2': Trash2,
  star: Star,
  flag: Flag,
  'file-check': FileCheck,
  'shield-check': ShieldCheck,
  'shield-x': ShieldX,
  sparkles: Sparkles,
  'x-circle': XCircle,
  'alert-triangle': AlertTriangle,
  pause: Pause,
  ban: Ban,
  'check-circle': CheckCircle,
};

// Color mapping (API color → CSS)
const COLOR_MAP: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  blue: {
    bg: 'rgba(23,162,184,0.12)',
    text: '#17A2B8',
    border: 'rgba(23,162,184,0.3)',
  },
  green: {
    bg: 'rgba(40,167,69,0.12)',
    text: '#28A745',
    border: 'rgba(40,167,69,0.3)',
  },
  red: {
    bg: 'rgba(220,53,69,0.12)',
    text: '#DC3545',
    border: 'rgba(220,53,69,0.3)',
  },
  yellow: {
    bg: 'rgba(255,193,7,0.12)',
    text: '#B7791F',
    border: 'rgba(255,193,7,0.3)',
  },
  orange: {
    bg: 'rgba(232,122,32,0.12)',
    text: '#E87A20',
    border: 'rgba(232,122,32,0.3)',
  },
  purple: {
    bg: 'rgba(156,39,176,0.12)',
    text: '#9C27B0',
    border: 'rgba(156,39,176,0.3)',
  },
  gray: {
    bg: 'rgba(108,117,125,0.12)',
    text: '#6C757D',
    border: 'rgba(108,117,125,0.3)',
  },
};

/**
 * Single Activity Feed item
 * - Icon with color from API
 * - Actor avatar + name
 * - Title + description
 * - time_ago label
 * - Optional link
 */
const ActivityItem = ({ activity, compact = false }: ActivityItemProps) => {
  const Icon = ICON_MAP[activity.icon] || Info;
  const colors = COLOR_MAP[activity.color] || COLOR_MAP.gray;
  const avatarUrl = getProfileImageUrl(activity.actor.profile_image);
  const initials = getUserInitials(activity.actor.name);

  const content = (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: compact ? '10px' : '12px',
        padding: compact ? '10px' : '12px',
        borderRadius: '12px',
        backgroundColor: 'var(--bg-input)',
        border: `1px solid ${activity.is_sensitive ? colors.border : 'var(--border-color)'}`,
        transition: 'all 0.2s ease',
        cursor: activity.link ? 'pointer' : 'default',
        fontFamily: 'Cairo, sans-serif',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.text;
        e.currentTarget.style.backgroundColor = colors.bg;
        if (activity.link) e.currentTarget.style.transform = 'translateX(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = activity.is_sensitive
          ? colors.border
          : 'var(--border-color)';
        e.currentTarget.style.backgroundColor = 'var(--bg-input)';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      {/* Icon Badge */}
      <div
        style={{
          width: compact ? '32px' : '38px',
          height: compact ? '32px' : '38px',
          borderRadius: '10px',
          backgroundColor: colors.bg,
          color: colors.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: `1px solid ${colors.border}`,
        }}
      >
        <Icon size={compact ? 14 : 16} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title + Time */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: '3px',
          }}
        >
          <h5
            style={{
              color: 'var(--text-secondary)',
              fontSize: compact ? '0.78rem' : '0.82rem',
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.35,
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {activity.title}
          </h5>

          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.65rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              opacity: 0.8,
            }}
          >
            {activity.time_ago}
          </span>
        </div>

        {/* Description */}
        {activity.description && (
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: compact ? '0.68rem' : '0.72rem',
              margin: '0 0 6px',
              lineHeight: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {activity.description}
          </p>
        )}

        {/* Actor Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              backgroundColor: colors.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${colors.border}`,
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={activity.actor.name}
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
                  fontSize: '0.55rem',
                  fontWeight: 800,
                  color: colors.text,
                }}
              >
                {initials}
              </span>
            )}
          </div>

          <span
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          >
            {activity.actor.name}
          </span>

          <span
            style={{
              fontSize: '0.58rem',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '6px',
              backgroundColor: colors.bg,
              color: colors.text,
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
            }}
          >
            {activity.actor.role === 'admin'
              ? 'أدمن'
              : activity.actor.role === 'system'
                ? 'نظام'
                : 'مستخدم'}
          </span>

          {activity.is_sensitive && (
            <span
              style={{
                fontSize: '0.55rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '6px',
                backgroundColor: 'rgba(220,53,69,0.15)',
                color: '#DC3545',
                border: '1px solid rgba(220,53,69,0.3)',
              }}
            >
              حساس
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (activity.link) {
    return (
      <Link
        to={activity.link}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default ActivityItem;