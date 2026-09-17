import { FaCrown, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FeaturedDetailsBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        background: 'linear-gradient(135deg, var(--primary-orange) 0%, #C46215 50%, var(--primary-brown, #8B5A2B) 100%)',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        boxShadow: '0 8px 25px rgba(232, 122, 32, 0.28)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.25)',
      }}
    >
      {/* Background Animated Flare Glow */}
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.35) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Animated Shimmer Line */}
      <motion.div
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
        }}
      />

      {/* Centered Main Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1,
          maxWidth: '550px',
          width: '100%',
        }}
      >
        {/* Animated Icon Badge */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          <FaCrown size={22} color="#FFD700" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
        </motion.div>

        {/* Header Title with Stars */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
          <FaStar size={12} color="#FFD700" style={{ opacity: 0.9 }} />
          <h3
            style={{
              color: '#FFFFFF',
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: '-0.2px',
            }}
          >
            إعلان مثبت ومميز
          </h3>
          <FaStar size={12} color="#FFD700" style={{ opacity: 0.9 }} />
        </div>

        {/* Subtitle Description */}
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: 'clamp(0.78rem, 2vw, 0.86rem)',
            fontWeight: 500,
            fontFamily: 'Cairo, sans-serif',
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          يحظى هذا الإعلان بأولوية الظهور وأعلى نسبة مشاهدة في المنصة
        </p>
      </div>
    </motion.div>
  );
};

export default FeaturedDetailsBanner;