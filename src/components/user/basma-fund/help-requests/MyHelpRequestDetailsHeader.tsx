import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaChevronRight,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEye,
  FaHandHoldingHeart,
  FaArrowRight,
  FaTrophy,
} from 'react-icons/fa';
import type { HelpRequestUserDetail } from '../../../../types';
import {
  FUND_THEME,
  formatHelpRequestDate,
} from '../../../../utils/helpRequestHelpers';
import HelpRequestStatusBadge from '../cards/HelpRequestStatusBadge';

interface MyHelpRequestDetailsHeaderProps {
  request: HelpRequestUserDetail;
}

/**
 * Header for the owner's help request detail page.
 * Shows status, title, meta, and an achievement link when archived.
 */
const MyHelpRequestDetailsHeader = ({
  request,
}: MyHelpRequestDetailsHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'relative',
        padding: 'clamp(1.35rem, 4vw, 1.85rem)',
        borderRadius: '22px',
        background:
          'linear-gradient(135deg, rgba(23,162,184,0.08) 0%, rgba(23,162,184,0.02) 100%)',
        border: '1px solid rgba(23,162,184,0.18)',
        overflow: 'hidden',
        fontFamily: 'Cairo, sans-serif',
        marginBottom: '1.25rem',
      }}
    >
      {/* Soft corner glow */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(23,162,184,0.18), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Breadcrumb */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
          position: 'relative',
          zIndex: 2,
          flexWrap: 'wrap',
        }}
      >
        <Link
          to="/user/basma-fund/help-requests"
          style={{
            color: FUND_THEME.accent,
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          طلباتي
        </Link>
        <FaChevronRight
          size={9}
          style={{ opacity: 0.4, transform: 'rotate(180deg)' }}
        />
        <span style={{ opacity: 0.75 }}>طلب #{request.id}</span>
      </nav>

      {/* Status badge + display name chip */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '0.9rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <HelpRequestStatusBadge status={request.status} />

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 11px',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            fontSize: '0.68rem',
            fontWeight: 700,
          }}
        >
          <FaHandHoldingHeart size={9} />
          {request.display_name}
        </span>
      </div>

      {/* Title */}
      <h1
        style={{
          color: 'var(--text-secondary)',
          fontSize: 'clamp(1.3rem, 3.5vw, 1.75rem)',
          fontWeight: 900,
          lineHeight: 1.3,
          margin: '0 0 1rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {request.public_title}
      </h1>

      {/* Meta row */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          flexWrap: 'wrap',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <MetaChip
          Icon={FaMapMarkerAlt}
          label={`${request.region.governorate.name}${
            request.region.city?.name
              ? ' - ' + request.region.city.name
              : ''
          }`}
        />
        <MetaChip
          Icon={FaCalendarAlt}
          label={`نُشر: ${formatHelpRequestDate(
            request.published_at || request.created_at
          )}`}
        />
        <MetaChip Icon={FaEye} label={`${request.views} مشاهدة`} />
      </div>

      {/* Achievement link (only when archived + linked) */}
      {request.status === 'archived' && request.achievement && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          style={{
            marginTop: '1rem',
            padding: '11px 14px',
            borderRadius: '12px',
            background:
              'linear-gradient(135deg, rgba(255,193,7,0.12), rgba(232,122,32,0.06))',
            border: '1px solid rgba(255,193,7,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#B8860B',
              fontSize: '0.8rem',
              fontWeight: 800,
            }}
          >
            <FaTrophy size={12} />
            <span>
              جزء من إنجاز:{' '}
              <strong style={{ color: '#8B5A2B' }}>
                {request.achievement.title}
              </strong>
            </span>
          </div>
          <Link
            to="/basma-fund/achievements"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: '#B8860B',
              textDecoration: 'none',
              fontSize: '0.72rem',
              fontWeight: 800,
            }}
          >
            عرض الإنجازات
            <FaArrowRight size={9} />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

// ============================================
// Internal chip
// ============================================
interface MetaChipProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
}

const MetaChip = ({ Icon, label }: MetaChipProps) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '10px',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      color: 'var(--text-secondary)',
      fontSize: '0.76rem',
      fontWeight: 700,
      whiteSpace: 'nowrap',
    }}
  >
    <Icon size={11} color={FUND_THEME.accent} />
    {label}
  </span>
);

export default MyHelpRequestDetailsHeader;