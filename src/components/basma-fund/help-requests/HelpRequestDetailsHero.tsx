import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaEye,
  FaHandHoldingHeart,
  FaLock,
  FaCalendarAlt,
} from 'react-icons/fa';
import type { HelpRequestPublic } from '../../../types';
import { formatHelpRequestDate } from '../../../utils/helpRequestHelpers';

interface HelpRequestDetailsHeroProps {
  request: HelpRequestPublic;
}

/**
 * Top hero of the public help-request details page.
 * Shows title, region, published date, stats, and a note about the locked video.
 */
const HelpRequestDetailsHero = ({ request }: HelpRequestDetailsHeroProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        position: 'relative',
        padding: 'clamp(1.5rem, 4vw, 2.25rem)',
        borderRadius: '24px',
        background:
          'linear-gradient(135deg, #138496 0%, #17A2B8 55%, #20C9E0 100%)',
        color: '#FFFFFF',
        overflow: 'hidden',
        fontFamily: 'Cairo, sans-serif',
        marginBottom: '1.5rem',
        boxShadow: '0 16px 40px rgba(23,162,184,0.3)',
      }}
    >
      {/* Decorative glows */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-60px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-80px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top badges */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '1rem',
        }}
      >
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '999px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            fontSize: '0.72rem',
            fontWeight: 700,
            backdropFilter: 'blur(6px)',
          }}
        >
          <FaHandHoldingHeart size={11} />
          طلب مساعدة
        </motion.span>

        {request.video.requires_inquiry && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '999px',
              backgroundColor: 'rgba(0,0,0,0.22)',
              border: '1px solid rgba(255,255,255,0.25)',
              fontSize: '0.72rem',
              fontWeight: 700,
              backdropFilter: 'blur(6px)',
            }}
          >
            <FaLock size={10} />
            الفيديو بعد الاستفسار
          </motion.span>
        )}
      </div>

      {/* Title */}
      <h1
        style={{
          position: 'relative',
          zIndex: 2,
          fontSize: 'clamp(1.4rem, 4vw, 2rem)',
          fontWeight: 900,
          lineHeight: 1.25,
          margin: '0 0 1rem',
          color: '#FFFFFF',
        }}
      >
        {request.public_title}
      </h1>

      {/* Meta row */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          gap: '14px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {/* Region */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '0.8rem',
            fontWeight: 700,
            backdropFilter: 'blur(4px)',
          }}
        >
          <FaMapMarkerAlt size={12} />
          {request.region.governorate.name}
          {request.region.city?.name && ` - ${request.region.city.name}`}
        </div>

        {/* Published */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            opacity: 0.9,
          }}
        >
          <FaCalendarAlt size={11} />
          {formatHelpRequestDate(request.published_at)}
        </div>

        {/* Views */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            opacity: 0.9,
          }}
        >
          <FaEye size={11} />
          {request.stats.views} مشاهدة
        </div>
      </div>
    </motion.div>
  );
};

export default HelpRequestDetailsHero;