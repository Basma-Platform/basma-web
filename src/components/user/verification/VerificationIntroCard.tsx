import { motion } from 'framer-motion';
import { FaShieldAlt, FaCheckCircle, FaLock, FaBolt } from 'react-icons/fa';

const VerificationIntroCard = () => {
  const benefits = [
    { icon: <FaCheckCircle size={14} />, text: 'نشر إعلانات غير محدودة شهرياً' },
    { icon: <FaShieldAlt size={14} />, text: 'شارة "موثق" على حسابك وإعلاناتك' },
    { icon: <FaBolt size={14} />, text: 'أولوية في نتائج البحث والتصفح' },
    { icon: <FaLock size={14} />, text: 'ثقة أكبر من المجتمع والمستخدمين' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '18px',
        padding: '1.5rem 1.25rem',
        boxShadow: '0 6px 24px var(--shadow-sm)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Cairo, sans-serif',
        width: '100%',
      }}
      dir="rtl"
    >
      {/* Decorative Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,122,32,0.1), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '72px',
            height: '72px',
            margin: '0 auto 1rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #E87A20, #F5A623)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 10px 28px rgba(232,122,32,0.3)',
          }}
        >
          <FaShieldAlt size={32} />
        </motion.div>

        {/* Title */}
        <h2
          style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: 'clamp(1.2rem, 2vw, 1.45rem)',
            fontWeight: 900,
            marginBottom: '6px',
            lineHeight: 1.3,
          }}
        >
          وثّق هويتك الآن
        </h2>

        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            marginBottom: '1.25rem',
            maxWidth: '460px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          احصل على شارة "موثق" واستفد من جميع مزايا المنصة مع إعلانات غير محدودة
        </p>

        {/* Benefits Stack / Grid optimized for mobile readability */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '0.25rem',
          }}
        >
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + idx * 0.06 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-input)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
              }}
            >
              <span
                style={{
                  color: '#28A745',
                  flexShrink: 0,
                  display: 'inline-flex',
                }}
              >
                {benefit.icon}
              </span>
              <span
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                {benefit.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default VerificationIntroCard;