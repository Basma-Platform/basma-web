import { motion } from 'framer-motion';
import { FaTimesCircle, FaInfoCircle, FaRedo } from 'react-icons/fa';

interface VerificationRejectedCardProps {
  rejectionReason: string | null;
  requestDate: string | null;
  onReupload: () => void;
}

const VerificationRejectedCard = ({
  rejectionReason,
  onReupload,
}: VerificationRejectedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1.5px solid rgba(220,53,69,0.3)',
        borderRadius: '20px',
        padding: '2rem 1.75rem',
        boxShadow: '0 8px 32px rgba(220,53,69,0.12)',
        background:
          'linear-gradient(135deg, rgba(220,53,69,0.06), rgba(220,53,69,0.02))',
        textAlign: 'center',
        fontFamily: 'Cairo, sans-serif',
      }}
      dir="rtl"
    >
      {/* Icon */}
      <div
        style={{
          width: '90px',
          height: '90px',
          margin: '0 auto 1.25rem',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #DC3545, #F56575)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 12px 32px rgba(220,53,69,0.4)',
        }}
      >
        <FaTimesCircle size={38} />
      </div>

      {/* Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 14px',
          borderRadius: '20px',
          backgroundColor: 'rgba(220,53,69,0.15)',
          color: '#DC3545',
          fontSize: '0.75rem',
          fontWeight: 700,
          marginBottom: '12px',
        }}
      >
        <FaTimesCircle size={11} />
        تم رفض الطلب
      </div>

      <h2
        style={{
          color: 'var(--text-secondary)',
          fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
          fontWeight: 900,
          marginBottom: '10px',
        }}
      >
        نأسف، تم رفض طلبك
      </h2>

      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          lineHeight: 1.7,
          marginBottom: '1.5rem',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        يمكنك إعادة رفع صورة الهوية مع التأكد من وضوحها وجودة الإضاءة.
      </p>

      {/* Rejection Reason Box */}
      {rejectionReason && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '14px 16px',
            backgroundColor: 'rgba(220,53,69,0.06)',
            border: '1px solid rgba(220,53,69,0.25)',
            borderRadius: '14px',
            textAlign: 'right',
            marginBottom: '1.5rem',
            maxWidth: '520px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <FaInfoCircle
            size={14}
            color="#DC3545"
            style={{ flexShrink: 0, marginTop: '3px' }}
          />
          <div>
            <div
              style={{
                color: '#DC3545',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '4px',
              }}
            >
              سبب الرفض:
            </div>
            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                lineHeight: 1.6,
              }}
            >
              {rejectionReason}
            </div>
          </div>
        </div>
      )}

      {/* Re-upload Button */}
      <motion.button
        type="button"
        onClick={onReupload}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        style={{
          padding: '14px 32px',
          borderRadius: '14px',
          border: 'none',
          background: 'linear-gradient(135deg, #E87A20, #F5A623)',
          color: '#FFFFFF',
          fontFamily: 'Cairo, sans-serif',
          fontSize: '0.95rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 6px 20px rgba(232,122,32,0.35)',
        }}
      >
        <FaRedo size={14} />
        إعادة رفع الطلب
      </motion.button>
    </motion.div>
  );
};

export default VerificationRejectedCard;