import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBullhorn, FaStar, FaUserCheck, FaArrowLeft } from 'react-icons/fa';
import { getProfileImageUrl, getUserInitials } from '../../../../utils/profileHelpers';
import type { TopUser } from '../../../../types';

interface TopUsersListProps {
  users: TopUser[];
}

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

/**
 * Top Users — Ranked list
 * - Top 3 have gold/silver/bronze ranks
 * - Each row shows avatar, name, stats, and rating
 */
const TopUsersList = ({ users }: TopUsersListProps) => {
  if (!users || users.length === 0) {
    return <EmptyState label="لا يوجد مستخدمون بعد" />;
  }

  return (
    <div
      dir="rtl"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        maxHeight: '420px',
        overflowY: 'auto',
        margin: '0 -4px',
        padding: '0 4px',
      }}
    >
      {users.map((user, index) => (
        <UserRow key={user.id} user={user} rank={index + 1} />
      ))}
    </div>
  );
};

const UserRow = ({ user, rank }: { user: TopUser; rank: number }) => {
  const avatarUrl = getProfileImageUrl(user.profile_image);
  const initials = getUserInitials(user.name);
  const rankColor = RANK_COLORS[rank - 1];
  const isTop3 = rank <= 3;

  return (
    <Link
      to={`/admin/users/${user.id}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        borderRadius: '12px',
        backgroundColor: 'var(--bg-input)',
        border: `1px solid ${isTop3 ? `${rankColor}40` : 'var(--border-color)'}`,
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary-orange)';
        e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.04)';
        e.currentTarget.style.transform = 'translateX(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isTop3
          ? `${rankColor}40`
          : 'var(--border-color)';
        e.currentTarget.style.backgroundColor = 'var(--bg-input)';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      {/* Rank Badge */}
      <div
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          flexShrink: 0,
          backgroundColor: isTop3 ? rankColor : 'var(--bg-card)',
          color: isTop3 ? '#FFFFFF' : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          fontWeight: 900,
          fontFamily: 'system-ui, sans-serif',
          boxShadow: isTop3 ? `0 2px 8px ${rankColor}60` : 'none',
          border: !isTop3 ? '1px solid var(--border-color)' : 'none',
        }}
      >
        {rank}
      </div>

      {/* Avatar */}
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          backgroundColor: 'rgba(232,122,32,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid var(--border-color)',
          position: 'relative',
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={user.name}
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
              color: 'var(--primary-orange)',
              fontSize: '0.78rem',
              fontWeight: 800,
            }}
          >
            {initials}
          </span>
        )}

        {/* Verified Badge */}
        {user.is_verified && (
          <span
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: '#0d6efd',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-card)',
            }}
          >
            <FaUserCheck size={6} />
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.2,
          }}
        >
          {user.name}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '3px',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <FaBullhorn size={8} />
            {user.announcements} إعلان
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <FaStar size={8} color="#FFC107" />
            {user.average_rating.toFixed(1)}
          </span>
        </div>
      </div>

      <FaArrowLeft
        size={10}
        style={{ color: 'var(--text-muted)', opacity: 0.4, flexShrink: 0 }}
      />
    </Link>
  );
};

const EmptyState = ({ label }: { label: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      padding: '2.5rem 1rem',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontFamily: 'Cairo, sans-serif',
      fontSize: '0.82rem',
      opacity: 0.7,
    }}
  >
    {label}
  </motion.div>
);

export default TopUsersList;