import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaEye,
  FaHeart,
  FaMapMarkerAlt,
  FaTag,
  FaEdit,
  FaTrash,
  FaPause,
  FaPlay,
  FaStar,
  FaChevronLeft,
  FaImage,
  FaCalendarAlt,
} from 'react-icons/fa';
import MyAnnouncementStatusBadge from '../badges/MyAnnouncementStatusBadge';
import {
  getCategoryLabel,
  getTypeLabel,
  getPriceLabel,
  getCoverImageUrl,
  formatAnnouncementDateShort,
} from '../../../../utils/announcementHelpers';
import type { Announcement } from '../../../../types';

interface MyAnnouncementCardProps {
  announcement: Announcement;
  onDelete: (id: number) => void;
  onDisable: (id: number) => void;
  onEnable: (id: number) => void;
  onFeature: (id: number) => void;
}

const MyAnnouncementCard = ({
  announcement,
  onDelete,
  onDisable,
  onEnable,
  onFeature,
}: MyAnnouncementCardProps) => {
  const coverImage = getCoverImageUrl(announcement);
  const typeColor = announcement.type === 'offer' ? '#28A745' : '#DC3545';
  const isFeatured =
    announcement.is_featured &&
    !!announcement.featured_until &&
    new Date(announcement.featured_until) > new Date();

  // Status-based action availability
  const canEdit = announcement.status !== 'deleted';
  const canDelete = announcement.status !== 'deleted';
  const canDisable =
    announcement.status === 'active' && !announcement.is_disabled;
  const canEnable = announcement.is_disabled;
  const canFeature =
    announcement.status === 'active' &&
    !isFeatured &&
    !announcement.is_featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100%' }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px var(--shadow-sm)',
          transition: 'all 0.3s ease',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 28px var(--shadow-md)';
          e.currentTarget.style.borderColor = 'var(--primary-orange)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px var(--shadow-sm)';
          e.currentTarget.style.borderColor = 'var(--border-color)';
        }}
      >
        {/* ============================================ */}
        {/* Cover Image Section */}
        {/* ============================================ */}
        <Link
          to={`/user/announcements/${announcement.id}`}
          style={{ textDecoration: 'none', display: 'block' }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '180px',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-input)',
            }}
          >
            {announcement.images && announcement.images.length > 0 ? (
              <motion.img
                src={coverImage}
                alt={announcement.title}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  opacity: 0.4,
                }}
              >
                <FaImage size={40} />
              </div>
            )}

            {/* Gradient Overlay for badging */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.4) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Top-Right: Status Badge */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 2,
              }}
            >
              <MyAnnouncementStatusBadge
                status={announcement.status}
                isFeatured={isFeatured}
                featuredRequestStatus={
                  announcement.featured_request_status as
                    | 'pending'
                    | 'approved'
                    | 'rejected'
                    | null
                }
                size="sm"
              />
            </div>

            {/* Top-Left: Type Badge */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                zIndex: 2,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: typeColor,
                color: '#FFFFFF',
                padding: '3px 10px',
                borderRadius: '8px',
                fontSize: '0.65rem',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}
            >
              {getTypeLabel(announcement.type)}
            </div>

            {/* Bottom-Right: Views + Likes */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                display: 'flex',
                gap: '6px',
                zIndex: 2,
              }}
            >
              <StatPill
                icon={<FaEye size={10} />}
                value={announcement.views}
              />
              <StatPill
                icon={<FaHeart size={10} />}
                value={announcement.likes_count || 0}
              />
            </div>

            {/* Bottom-Right: Price Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                zIndex: 2,
              }}
            >
              <span
                style={{
                  backgroundColor:
                    announcement.price_type === 'free'
                      ? '#28A745'
                      : announcement.price_type === 'paid'
                        ? 'var(--primary-orange)'
                        : '#9C27B0',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
              >
                {getPriceLabel(announcement.price_type, announcement.price)}
              </span>
            </div>
          </div>
        </Link>

        {/* ============================================ */}
        {/* Content Section */}
        {/* ============================================ */}
        <div
          style={{
            padding: '1rem 1.1rem',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: '10px',
          }}
        >
          {/* Title */}
          <Link
            to={`/user/announcements/${announcement.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <h3
              style={{
                fontSize: '0.98rem',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.35,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-orange)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {announcement.title}
            </h3>
          </Link>

          {/* Meta Row: Category + Location */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              alignItems: 'center',
            }}
          >
            <MetaChip
              icon={<FaTag size={9} />}
              label={getCategoryLabel(announcement.category)}
            />
            {announcement.sub_category && (
              <MetaChip label={announcement.sub_category.name} />
            )}
            {announcement.governorate && (
              <MetaChip
                icon={<FaMapMarkerAlt size={9} />}
                label={announcement.governorate.name}
                iconColor="var(--primary-orange)"
              />
            )}
          </div>

          {/* Date Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              fontFamily: 'Cairo, sans-serif',
              opacity: 0.75,
            }}
          >
            <FaCalendarAlt size={10} />
            <span>{formatAnnouncementDateShort(announcement.created_at)}</span>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* ============================================ */}
          {/* Actions Row */}
          {/* ============================================ */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              paddingTop: '10px',
              borderTop: '1px solid var(--border-color)',
              flexWrap: 'wrap',
            }}
          >
            {/* View Details */}
            <Link
              to={`/user/announcements/${announcement.id}`}
              style={{ textDecoration: 'none', flex: '1 1 100%' }}
            >
              <ActionButton
                icon={<FaChevronLeft size={11} />}
                label="عرض التفاصيل"
                variant="primary"
                fullWidth
              />
            </Link>

            {/* Edit */}
            {canEdit && (
              <Link
                to={`/user/announcements/${announcement.id}/edit`}
                style={{ textDecoration: 'none', flex: '1 1 0' }}
              >
                <ActionButton
                  icon={<FaEdit size={11} />}
                  label="تعديل"
                  variant="outline"
                  fullWidth
                />
              </Link>
            )}

            {/* Feature */}
            {canFeature && (
              <div
                onClick={() => onFeature(announcement.id)}
                style={{ flex: '1 1 0' }}
              >
                <ActionButton
                  icon={<FaStar size={11} />}
                  label="تمييز"
                  variant="feature"
                  fullWidth
                />
              </div>
            )}

            {/* Disable */}
            {canDisable && (
              <div
                onClick={() => onDisable(announcement.id)}
                style={{ flex: '1 1 0' }}
              >
                <ActionButton
                  icon={<FaPause size={11} />}
                  label="تعطيل"
                  variant="warning"
                  fullWidth
                />
              </div>
            )}

            {/* Enable */}
            {canEnable && (
              <div
                onClick={() => onEnable(announcement.id)}
                style={{ flex: '1 1 0' }}
              >
                <ActionButton
                  icon={<FaPlay size={11} />}
                  label="تفعيل"
                  variant="success"
                  fullWidth
                />
              </div>
            )}

            {/* Delete */}
            {canDelete && (
              <div
                onClick={() => onDelete(announcement.id)}
                style={{ flex: '1 1 0' }}
              >
                <ActionButton
                  icon={<FaTrash size={11} />}
                  label="حذف"
                  variant="danger"
                  fullWidth
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// Helper Components
// ============================================

interface StatPillProps {
  icon: React.ReactNode;
  value: number;
}

const StatPill = ({ icon, value }: StatPillProps) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      backgroundColor: 'rgba(0,0,0,0.6)',
      color: '#FFFFFF',
      padding: '3px 8px',
      borderRadius: '6px',
      fontSize: '0.65rem',
      fontWeight: 600,
      fontFamily: 'Cairo, sans-serif',
      backdropFilter: 'blur(4px)',
    }}
  >
    {icon}
    {value}
  </span>
);

interface MetaChipProps {
  icon?: React.ReactNode;
  label: string;
  iconColor?: string;
}

const MetaChip = ({ icon, label, iconColor }: MetaChipProps) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      backgroundColor: 'var(--bg-input)',
      color: 'var(--text-muted)',
      padding: '3px 8px',
      borderRadius: '6px',
      fontSize: '0.65rem',
      fontWeight: 500,
      fontFamily: 'Cairo, sans-serif',
      border: '1px solid var(--border-color)',
    }}
  >
    {icon && (
      <span style={{ color: iconColor || 'currentColor', display: 'inline-flex' }}>
        {icon}
      </span>
    )}
    {label}
  </span>
);

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  variant: 'primary' | 'outline' | 'danger' | 'warning' | 'success' | 'feature';
  fullWidth?: boolean;
}

const ActionButton = ({
  icon,
  label,
  variant,
  fullWidth = false,
}: ActionButtonProps) => {
  const variants: Record<
    string,
    { color: string; bg: string; border: string; hoverBg: string }
  > = {
    primary: {
      color: '#FFFFFF',
      bg: 'var(--primary-orange)',
      border: 'var(--primary-orange)',
      hoverBg: 'var(--primary-orange-dark)',
    },
    outline: {
      color: 'var(--text-secondary)',
      bg: 'transparent',
      border: 'var(--border-color)',
      hoverBg: 'rgba(232,122,32,0.08)',
    },
    danger: {
      color: '#DC3545',
      bg: 'transparent',
      border: 'rgba(220,53,69,0.3)',
      hoverBg: 'rgba(220,53,69,0.1)',
    },
    warning: {
      color: '#B7791F', // Enhanced contrast amber for peak visibility in light and dark modes
      bg: 'transparent',
      border: 'rgba(255,193,7,0.4)',
      hoverBg: 'rgba(255,193,7,0.12)',
    },
    success: {
      color: '#28A745',
      bg: 'transparent',
      border: 'rgba(40,167,69,0.3)',
      hoverBg: 'rgba(40,167,69,0.1)',
    },
    feature: {
      color: '#D97706', // Rich deep gold/amber for pristine button text legibility
      bg: 'transparent',
      border: 'rgba(245,166,35,0.4)',
      hoverBg: 'rgba(245,166,35,0.12)',
    },
  };

  const style = variants[variant];

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        padding: '8px 12px',
        backgroundColor: style.bg,
        color: style.color,
        border: `1.5px solid ${style.border}`,
        borderRadius: '9px',
        fontSize: '0.72rem',
        fontWeight: 700,
        fontFamily: 'Cairo, sans-serif',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = style.hoverBg;
        if (variant === 'outline') {
          e.currentTarget.style.borderColor = 'var(--primary-orange)';
          e.currentTarget.style.color = 'var(--primary-orange)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = style.bg;
        e.currentTarget.style.borderColor = style.border;
        e.currentTarget.style.color = style.color;
      }}
    >
      {icon}
      {label}
    </motion.button>
  );
};

export default MyAnnouncementCard;