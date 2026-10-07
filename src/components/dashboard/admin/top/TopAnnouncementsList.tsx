import { Link } from 'react-router-dom';
import { FaEye, FaHeart, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import type { TopAnnouncement } from '../../../../types';

interface TopAnnouncementsListProps {
  announcements: TopAnnouncement[];
}

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

/**
 * Top Announcements — Ranked by views + likes
 */
const TopAnnouncementsList = ({
  announcements,
}: TopAnnouncementsListProps) => {
  if (!announcements || announcements.length === 0) {
    return (
      <div
        style={{
          padding: '2.5rem 1rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontFamily: 'Cairo, sans-serif',
          fontSize: '0.82rem',
          opacity: 0.7,
        }}
      >
        لا توجد إعلانات بعد
      </div>
    );
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
      {announcements.map((item, index) => (
        <AnnouncementRow key={item.id} item={item} rank={index + 1} />
      ))}
    </div>
  );
};

const AnnouncementRow = ({
  item,
  rank,
}: {
  item: TopAnnouncement;
  rank: number;
}) => {
  const rankColor = RANK_COLORS[rank - 1];
  const isTop3 = rank <= 3;

  return (
    <Link
      to={`/admin/announcements/${item.id}`}
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
      {/* Rank */}
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

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.title}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '4px',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <FaEye size={9} />
            {item.views.toLocaleString('en-US')}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <FaHeart size={9} color="#DC3545" />
            {item.likes_count}
          </span>
          {item.city && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <FaMapMarkerAlt size={9} color="var(--primary-orange)" />
              {item.city.name}
            </span>
          )}
        </div>

        <div
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.6rem',
            marginTop: '3px',
            opacity: 0.7,
          }}
        >
          بواسطة {item.user.name}
        </div>
      </div>

      <FaArrowLeft
        size={10}
        style={{ color: 'var(--text-muted)', opacity: 0.4, flexShrink: 0 }}
      />
    </Link>
  );
};

export default TopAnnouncementsList;