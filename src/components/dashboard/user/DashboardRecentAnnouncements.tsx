import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaEye,
  FaHeart,
  FaBullhorn,
  FaPlus,
  FaImage,
  FaTag,
  FaExchangeAlt,
  FaHandshake,
  FaFlagCheckered,
  FaChevronLeft,
} from 'react-icons/fa';
import type { DashboardRecentAnnouncement } from '../../../types';
import { getStorageUrl } from '../../../utils/storageHelpers';
import {
  getPriceLabel,
  getBarterBadgeLabel,
  getNegotiableLabel,
  getAnnouncementStatusLabel,
  getAnnouncementStatusColor,
} from '../../../utils/announcementHelpers';

interface DashboardRecentAnnouncementsProps {
  announcements: DashboardRecentAnnouncement[];
}

const DashboardRecentAnnouncements = ({
  announcements,
}: DashboardRecentAnnouncementsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '1.25rem',
        border: '1px solid var(--border-color)',
        boxShadow: '0 4px 16px var(--shadow-sm)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              background: 'linear-gradient(135deg, #E87A20, #F5A623)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(232,122,32,0.35)',
              flexShrink: 0,
            }}
          >
            <FaBullhorn size={16} />
          </div>
          <div>
            <h4
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                fontWeight: 800,
                fontFamily: 'Cairo, sans-serif',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              آخر خدماتي
            </h4>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.7rem',
                fontFamily: 'Cairo, sans-serif',
                margin: '2px 0 0',
              }}
            >
              آخر ما أضفته
            </p>
          </div>
        </div>

        <Link
          to="/user/announcements/create"
          style={{ textDecoration: 'none' }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '7px 14px',
              borderRadius: '9px',
              border: '1.5px solid var(--primary-orange)',
              backgroundColor: 'transparent',
              color: 'var(--primary-orange)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--primary-orange)';
            }}
          >
            <FaPlus size={10} />
            نشر عرض أو طلب
          </motion.button>
        </Link>
      </div>

      {/* List */}
      {announcements.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(232,122,32,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-orange)',
              opacity: 0.6,
              marginBottom: '12px',
            }}
          >
            <FaBullhorn size={26} />
          </div>
          <h5
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 800,
              fontFamily: 'Cairo, sans-serif',
              margin: '0 0 6px',
            }}
          >
            لا توجد عروض أو طلبات بعد
          </h5>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontFamily: 'Cairo, sans-serif',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            ابدأ بنشر عرضك أو طلبك الأول
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flex: 1,
          }}
        >
          {announcements.slice(0, 5).map((item, index) => (
            <RecentItem key={item.id} item={item} index={index} />
          ))}

          {/* View All */}
          <Link
            to="/user/my-announcements"
            style={{
              textDecoration: 'none',
              display: 'block',
              marginTop: 'auto',
              paddingTop: '8px',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <motion.div
              whileHover={{ x: -3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
                borderRadius: '9px',
                color: 'var(--primary-orange)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.78rem',
                fontWeight: 700,
                transition: 'all 0.2s ease',
              }}
            >
              عرض كل الخدمات
              <FaChevronLeft size={10} />
            </motion.div>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

// ============================================
// Recent Item
// ============================================
interface RecentItemProps {
  item: DashboardRecentAnnouncement;
  index: number;
}

const RecentItem = ({ item, index }: RecentItemProps) => {
  const isBarter = item.price_type === 'barter';
  const isNegotiable =
    item.price_type === 'paid' && item.is_negotiable === true;
  const isCompleted = item.is_completed || item.status === 'completed';

  const coverImage = getStorageUrl(item.cover_image);

  const statusColor = getAnnouncementStatusColor(item.status);
  const statusLabel = getAnnouncementStatusLabel(item.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`/user/announcements/${item.id}`}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <motion.div
          whileHover={{ y: -2 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px',
            borderRadius: '11px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary-orange)';
            e.currentTarget.style.backgroundColor =
              'rgba(232,122,32,0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.backgroundColor = 'var(--bg-input)';
          }}
        >
          {/* Thumbnail */}
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid var(--border-color)',
              position: 'relative',
            }}
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: isCompleted ? 0.75 : 1,
                }}
              />
            ) : (
              <FaImage size={16} color="var(--text-muted)" opacity={0.4} />
            )}

            {isCompleted && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(23,162,184,0.75)',
                  color: '#FFFFFF',
                }}
              >
                <FaFlagCheckered size={16} />
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h5
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                margin: '0 0 4px',
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {item.title}
            </h5>

            {/* Meta Row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '5px',
                alignItems: 'center',
                marginBottom: '4px',
              }}
            >
              {/* Status pill */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '1px 7px',
                  borderRadius: '5px',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  backgroundColor: `${statusColor}18`,
                  color: statusColor,
                  border: `1px solid ${statusColor}35`,
                }}
              >
                {statusLabel}
              </span>

              {/* Price / Barter */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '1px 7px',
                  borderRadius: '5px',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  backgroundColor: isBarter
                    ? 'rgba(156,39,176,0.12)'
                    : 'rgba(232,122,32,0.12)',
                  color: isBarter ? '#9C27B0' : 'var(--primary-orange)',
                }}
              >
                {isBarter && <FaExchangeAlt size={7} />}
                {isBarter
                  ? getBarterBadgeLabel()
                  : getPriceLabel(item.price_type, item.price)}
              </span>

              {isNegotiable && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '1px 7px',
                    borderRadius: '5px',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                    backgroundColor: 'rgba(40,167,69,0.12)',
                    color: '#28A745',
                  }}
                >
                  <FaHandshake size={7} />
                  {getNegotiableLabel()}
                </span>
              )}

              {/* Category chip (flat) */}
              {item.category && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '1px 7px',
                    borderRadius: '5px',
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    fontFamily: 'Cairo, sans-serif',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <FaTag size={7} />
                  {item.category.name}
                </span>
              )}
            </div>

            {/* Stats Row */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.65rem',
                fontFamily: 'Cairo, sans-serif',
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
                {item.views}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <FaHeart size={9} />
                {item.likes_count}
              </span>
            </div>
          </div>

          <FaChevronLeft
            size={10}
            style={{ color: 'var(--text-muted)', opacity: 0.4 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default DashboardRecentAnnouncements;