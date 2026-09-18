import { motion } from 'framer-motion';
import { FaClock, FaHourglassHalf, FaInfoCircle } from 'react-icons/fa';
import { formatVerificationDate } from '../../../utils/verificationHelpers';

interface VerificationStatusCardProps {
  requestDate: string | null;
}

const VerificationStatusCard = ({
  requestDate,
}: VerificationStatusCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1.5px solid rgba(255,193,7,0.35)',
        borderRadius: '18px',
        padding: '1.5rem 1.25rem',
        boxShadow: '0 6px 24px rgba(255,193,7,0.1)',
        background:
          'linear-gradient(135deg, rgba(255,193,7,0.06), rgba(255,193,7,0.02))',
        textAlign: 'center',
        fontFamily: 'Cairo, sans-serif',
        width: '100%',
      }}
      dir="rtl"
    >
      {/* Animated Icon */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '76px',
          height: '76px',
          margin: '0 auto 1rem',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFC107, #FFD966)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 10px 24px rgba(255,193,7,0.35)',
          position: 'relative',
        }}
      >
        <FaHourglassHalf size={32} />

        {/* Pulse Ring */}
        <motion.span
          animate={{ scale: [1, 1.4, 1.4], opacity: [0.4, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: -3,
            borderRadius: '50%',
            border: '2px solid #FFC107',
            pointerEvents: 'none',
          }}
        />
      </motion.div>

      {/* Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '20px',
          backgroundColor: 'rgba(255,193,7,0.15)',
          color: '#856404',
          fontSize: '0.72rem',
          fontWeight: 700,
          marginBottom: '10px',
        }}
      >
        <FaClock size={10} />
        قيد المراجعة
      </div>

      <h2
        style={{
          color: 'var(--text-secondary)',
          fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
          fontWeight: 900,
          marginBottom: '8px',
        }}
      >
        طلبك قيد المراجعة
      </h2>

      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          lineHeight: 1.6,
          marginBottom: '1.25rem',
          maxWidth: '460px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        تم استلام طلب توثيق هويتك بنجاح. سيقوم فريقنا بمراجعته خلال{' '}
        <strong style={{ color: 'var(--text-secondary)' }}>24-48 ساعة</strong>،
        وسيتم إشعارك فور اتخاذ القرار.
      </p>

      {/* Request Date */}
      {requestDate && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px 14px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            width: '100%',
            maxWidth: '320px',
          }}
        >
          <FaInfoCircle size={12} color="#17A2B8" style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            تاريخ الرفع:{' '}
            <strong style={{ color: 'var(--text-secondary)' }}>
              {formatVerificationDate(requestDate)}
            </strong>
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default VerificationStatusCard;