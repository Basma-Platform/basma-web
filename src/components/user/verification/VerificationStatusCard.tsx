import { motion } from 'framer-motion';
import {
  FaClock,
  FaHourglassHalf,
  FaInfoCircle,
  FaIdCard,
  FaPassport,
  FaCar,
  FaGraduationCap,
  FaFile,
  FaShieldAlt,
} from 'react-icons/fa';
import { formatVerificationDate } from '../../../utils/verificationHelpers';
import type { DocumentType } from '../../../types';

interface VerificationStatusCardProps {
  requestDate: string | null;
  documentTypeLabel?: string | null;
  documentType?: DocumentType | null;
}

// ============================================
// Icon Mapping per Document Type
// ============================================
const DOC_TYPE_ICONS: Record<DocumentType, React.ReactNode> = {
  national_id: <FaIdCard size={12} />,
  passport: <FaPassport size={12} />,
  driver_license: <FaCar size={12} />,
  university_card: <FaGraduationCap size={12} />,
  other: <FaFile size={12} />,
};

const VerificationStatusCard = ({
  requestDate,
  documentTypeLabel,
  documentType,
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
        boxSizing: 'border-box',
      }}
      dir="rtl"
    >
      {/* ============================================ */}
      {/* Animated Icon with Pulse Ring */}
      {/* ============================================ */}
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

      {/* ============================================ */}
      {/* Status Badge */}
      {/* ============================================ */}
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

      {/* ============================================ */}
      {/* Title + Description */}
      {/* ============================================ */}
      <h2
        style={{
          color: 'var(--text-secondary)',
          fontSize: 'clamp(1.1rem, 4vw, 1.35rem)',
          fontWeight: 900,
          marginBottom: '8px',
          lineHeight: 1.3,
        }}
      >
        طلبك قيد المراجعة
      </h2>

      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          lineHeight: 1.7,
          marginBottom: '1.25rem',
          maxWidth: '460px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        تم استلام طلب توثيق هويتك بنجاح. سيقوم فريقنا بمراجعته خلال{' '}
        <strong style={{ color: 'var(--text-secondary)' }}>24-48 ساعة</strong>
        ، وسيتم إشعارك فور اتخاذ القرار.
      </p>

      {/* ============================================ */}
      {/* Info Grid (Document Type + Request Date) */}
      {/* ============================================ */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '360px',
          margin: '0 auto',
        }}
      >
        {/* Document Type */}
        {documentTypeLabel && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              {documentType ? (
                <span
                  style={{
                    color: 'var(--primary-orange)',
                    display: 'inline-flex',
                  }}
                >
                  {DOC_TYPE_ICONS[documentType]}
                </span>
              ) : (
                <FaInfoCircle size={11} color="var(--primary-orange)" />
              )}
              نوع الوثيقة
            </div>
            <span
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {documentTypeLabel}
            </span>
          </div>
        )}

        {/* Request Date */}
        {requestDate && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              <FaClock size={11} color="#17A2B8" />
              تاريخ الرفع
            </div>
            <span
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {formatVerificationDate(requestDate)}
            </span>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* Privacy Reminder */}
      {/* ============================================ */}
      <div
        style={{
          marginTop: '1.25rem',
          padding: '10px 14px',
          backgroundColor: 'rgba(23,162,184,0.06)',
          border: '1px solid rgba(23,162,184,0.2)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          textAlign: 'right',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          lineHeight: 1.55,
          maxWidth: '460px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <FaShieldAlt
          size={12}
          color="#17A2B8"
          style={{ flexShrink: 0, marginTop: '2px' }}
        />
        <span>
          صورتك <strong>مشفرة ومحمية بالكامل</strong>، ولا يراها إلا فريق
          المراجعة، وستُحذف تلقائياً بعد <strong>90 يوماً</strong> من الموافقة.
        </span>
      </div>
    </motion.div>
  );
};

export default VerificationStatusCard;