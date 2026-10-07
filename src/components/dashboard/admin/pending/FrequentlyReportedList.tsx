import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFlag, FaArrowLeft } from 'react-icons/fa';
import type { FrequentlyReportedUser } from '../../../../types';
import { getProfileImageUrl, getUserInitials } from '../../../../utils/profileHelpers';

interface FrequentlyReportedListProps {
  users: FrequentlyReportedUser[];
  delay?: number;
}

/**
 * Frequently reported users (5+ reports)
 * - Red alert card
 * - Each row is a link to /admin/users/{id}
 */
const FrequentlyReportedList = ({
  users,
  delay = 0,
}: FrequentlyReportedListProps) => {
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
        border: '1.5px solid rgba(220,53,69,0.3)',
        borderRadius: '16px',
        padding: '1.15rem',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(220,53,69,0.08)',
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
          background: 'linear-gradient(135deg, #DC3545, #F56575)',
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
            background: 'linear-gradient(135deg, #DC3545, #F56575)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 6px 14px rgba(220,53,69,0.3)',
          }}
        >
          <FaFlag size={16} />
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
            مبلّغ عنهم بكثرة
          </h4>
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.68rem',
              fontWeight: 500,
            }}
          >
            مستخدمون بتقارير متعددة
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
            backgroundColor: 'rgba(220,53,69,0.15)',
            color: '#DC3545',
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

const UserRow = ({ user }: { user: FrequentlyReportedUser }) => {
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
        e.currentTarget.style.borderColor = '#DC3545';
        e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.backgroundColor = 'var(--bg-input)';
      }}
    >
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          backgroundColor: 'rgba(220,53,69,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid rgba(220,53,69,0.3)',
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
              color: '#DC3545',
            }}
          >
            {initials}
          </span>
        )}
      </div>

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
          <FaFlag size={8} color="#DC3545" />
          {user.reports_count} بلاغات
        </div>
      </div>

      <FaArrowLeft size={10} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
    </Link>
  );
};

export default FrequentlyReportedList;