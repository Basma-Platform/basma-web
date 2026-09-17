import { Link } from 'react-router-dom';
import { 
  FaBullhorn, FaHandshake, FaArrowLeft, FaPlusCircle,
  FaCheckCircle, FaShieldAlt, FaHandsHelping,
  FaCamera, FaFileAlt, FaMapMarkerAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';

interface AnnouncementsEndCTAProps {
  isLoggedIn: boolean;
  searchTerm?: string;
  hasFilters?: boolean;
}

const AnnouncementsEndCTA = ({ isLoggedIn }: AnnouncementsEndCTAProps) => {
  // ============================================
  // GUEST VIEW - دعوة للتسجيل
  // ============================================
  if (!isLoggedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          marginTop: '3rem',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #E87A20 0%, #D46A1A 50%, #8B5A2B 100%)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 16px 48px rgba(232, 122, 32, 0.35)',
        }}
      >
        {/* Background Ambient Circles */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.08)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-40px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.06)',
            pointerEvents: 'none',
          }}
        />

        {/* Floating Icon Header */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '85px',
            height: '85px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '2px solid rgba(255,255,255,0.4)',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
          }}
        >
          <FaHandshake size={40} color="#FFFFFF" />
        </motion.div>

        {/* Section Heading */}
        <h2
          style={{
            color: '#FFFFFF',
            fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)',
            fontWeight: 900,
            fontFamily: 'Cairo, sans-serif',
            marginBottom: '0.85rem',
            lineHeight: 1.3,
            position: 'relative',
            zIndex: 1,
            textShadow: '0 2px 10px rgba(0,0,0,0.15)',
          }}
        >
          سجّل لنشر أول إعلان
        </h2>

        {/* Description Text */}
        <p
          style={{
            color: 'rgba(255,255,255,0.95)',
            fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)',
            fontFamily: 'Cairo, sans-serif',
            lineHeight: 1.8,
            maxWidth: '620px',
            margin: '0 auto 2.2rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          سعياً نحو الرقي بالمجتمع من خلال زيادة التكافل الاجتماعي
          <br />
          انضم إلى مجتمع بصمة وابدأ بمشاركة ما لديك وتلبية ما تحتاجه
        </p>

        {/* Primary Action Button */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#FFFFFF',
                color: '#E87A20',
                padding: '14px 36px',
                borderRadius: '30px',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                fontSize: '1.05rem',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                transition: 'all 0.3s ease',
              }}
            >
              <FaPlusCircle size={18} />
              ابدأ الآن
              <FaArrowLeft size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Feature Badges */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '2.5rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {[
            { icon: <FaCheckCircle size={15} color="#FFFFFF" />, text: 'مجاني تماماً' },
            { icon: <FaShieldAlt size={15} color="#FFFFFF" />, text: 'بيئة آمنة' },
            { icon: <FaHandsHelping size={15} color="#FFFFFF" />, text: 'مجتمع متكافل' },
          ].map((point, i) => (
            <span
              key={i}
              style={{
                color: 'rgba(255,255,255,0.92)',
                fontSize: '0.9rem',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '6px 16px',
                borderRadius: '20px',
                backdropFilter: 'blur(4px)',
              }}
            >
              {point.icon}
              {point.text}
            </span>
          ))}
        </div>
      </motion.div>
    );
  }

  // ============================================
  // LOGGED-IN USER VIEW
  // ============================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        marginTop: '3rem',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '24px',
        backgroundColor: 'var(--bg-card)',
        border: '2px dashed var(--primary-orange)',
        padding: '3.5rem 2rem',
        textAlign: 'center',
        boxShadow: '0 12px 36px var(--shadow-sm)',
      }}
    >
      {/* Decorative Circles */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          backgroundColor: 'rgba(232, 122, 32, 0.08)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating Animated Icon */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '85px',
          height: '85px',
          borderRadius: '50%',
          backgroundColor: 'rgba(232, 122, 32, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          border: '2px solid rgba(232, 122, 32, 0.25)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <FaBullhorn size={38} color="var(--primary-orange)" />
      </motion.div>

      {/* Dynamic Title */}
      <h2
        style={{
          color: 'var(--text-secondary)',
          fontSize: 'clamp(1.3rem, 2.1vw, 1.7rem)',
          fontWeight: 900,
          fontFamily: 'Cairo, sans-serif',
          marginBottom: '0.85rem',
          lineHeight: 1.3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        هل تبحث عن شيء ولم تجده، أو لديك ما ترغب في مشاركته مع غيرك؟
      </h2>

      {/* Dynamic Description */}
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
          fontFamily: 'Cairo, sans-serif',
          lineHeight: 1.8,
          maxWidth: '620px',
          margin: '0 auto 2.2rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        بادر بنشر طلبك أو عرضك الآن، ودعنا نصل به إلى من يحتاجه حقاً لنجعل التكافل أقرب إليك.
      </p>

      {/* CTA Button */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/dashboard/create-announcement"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--primary-orange)',
              color: '#FFFFFF',
              padding: '14px 36px',
              borderRadius: '30px',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              fontSize: '1.05rem',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(232, 122, 32, 0.35)',
              transition: 'all 0.3s ease',
            }}
          >
            <FaPlusCircle size={18} />
            انشر إعلانك الآن
            <FaArrowLeft size={14} />
          </Link>
        </motion.div>
      </div>

      {/* Tips */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '2.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {[
          { icon: <FaCamera size={14} color="var(--primary-orange)" />, text: 'أضف صوراً واضحة' },
          { icon: <FaFileAlt size={14} color="var(--primary-orange)" />, text: 'اكتب وصفاً دقيقاً' },
          { icon: <FaMapMarkerAlt size={14} color="var(--primary-orange)" />, text: 'حدد منطقتك' },
        ].map((tip, i) => (
          <span
            key={i}
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
            }}
          >
            {tip.icon}
            {tip.text}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default AnnouncementsEndCTA;