import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import type { NearWarningUser } from '../../../../types';
import { getProfileImageUrl, getUserInitials } from '../../../../utils/profileHelpers';

interface NearWarningUsersListProps {
  users: NearWarningUser[];
  delay?: number;
}

/**
 * Users near warning threshold (2+ warnings)
 * - Compact list with avatar + name + warning count
 * - Each row is a link to /admin/users/{id}
 */
const NearWarningUsersList = ({
  users,
  delay = 0,
}: NearWarningUsersListProps) => {
  if (!users || users.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      dir="rtl"
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        border: '1.5px solid rgba(255,193,7,0.3)',
        borderRadius: '16px',
        padding: '1.15rem',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(255,193,7,0.08)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: '4px',
          background: 'linear-gradient(135deg, #FFC107, #FFD966)',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '11px',
            background: 'linear-gradient(135deg, #FFC107, #FFD966)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 6px 14px rgba(255,193,7,0.3)',
          }}
        >
          <FaExclamationTriangle size={16} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h4
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            تحذير مبكر
          </h4>
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.68rem',
              fontWeight: 500,
            }}
          >
            مستخدمون على وشك الحظر
          </span>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '26px',
            height: '26px',
            padding: '0 8px',
            borderRadius: '13px',
            backgroundColor: 'rgba(255,193,7,0.15)',
            color: '#B7791F',
            fontSize: '0.72rem',
            fontWeight: 800,
            fontFamily: 'system-ui, sans-serif',
            direction: 'ltr',
          }}
        >
          {users.length}
        </span>
      </div>

      {/* Users List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          maxHeight: '280px',
          overflowY: 'auto',
          margin: '0 -4px',
          padding: '0 4px',
        }}
      >
        {users.slice(0, 5).map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </div>

      {users.length > 5 && (
        <div
          style={{
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-color)',
            textAlign: 'center',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
          }}
        >
          + {users.length - 5} مستخدمين آخرين
        </div>
      )}
    </motion.div>
  );
};

const UserRow = ({ user }: { user: NearWarningUser }) => {
  const avatarUrl = getProfileImageUrl(user.profile_image);
  const initials = getUserInitials(user.name);

  return (
    <Link
      to={`/admin/users/${user.id}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 10px',
        borderRadius: '10px',
        backgroundColor: 'var(--bg-input)',
        border: '1px solid var(--border-color)',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#FFC107';
        e.currentTarget.style.backgroundColor = 'rgba(255,193,7,0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.backgroundColor = 'var(--bg-input)';
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          backgroundColor: 'rgba(255,193,7,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid rgba(255,193,7,0.3)',
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
              fontSize: '0.7rem',
              fontWeight: 800,
              color: '#B7791F',
            }}
          >
            {initials}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {user.name}
        </div>
        <div
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <FaExclamationTriangle size={8} color="#B7791F" />
          {user.warnings_count} تحذيرات
        </div>
      </div>

      <FaArrowLeft size={10} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
    </Link>
  );
};

export default NearWarningUsersList;