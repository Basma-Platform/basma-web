import { motion } from 'framer-motion';
import {
  FaTimesCircle,
  FaInfoCircle,
  FaRedo,
  FaIdCard,
  FaPassport,
  FaCar,
  FaGraduationCap,
  FaFile,
  FaClock,
  FaLightbulb,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { formatVerificationDate } from '../../../utils/verificationHelpers';
import type { DocumentType } from '../../../types';

interface VerificationRejectedCardProps {
  rejectionReason: string | null;
  requestDate: string | null;
  documentTypeLabel?: string | null;
  documentType?: DocumentType | null;
  onReupload: () => void;
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

const VerificationRejectedCard = ({
  rejectionReason,
  requestDate,
  documentTypeLabel,
  documentType,
  onReupload,
}: VerificationRejectedCardProps) => {
  // ============================================
  // Common tips (shown to help user re-upload correctly)
  // ============================================
  const tips = [
    'تأكد من وضوح الصورة الشخصية والاسم الكامل',
    'أظهر جميع حواف الوثيقة بدون قطع',
    'تجنب الانعكاسات والإضاءة الضعيفة',
    'تأكد من مطابقة الاسم المسجل في حسابك',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1.5px solid rgba(220,53,69,0.3)',
        borderRadius: '20px',
        padding: '2rem 1.5rem',
        boxShadow: '0 8px 32px rgba(220,53,69,0.12)',
        background:
          'linear-gradient(135deg, rgba(220,53,69,0.06), rgba(220,53,69,0.02))',
        textAlign: 'center',
        fontFamily: 'Cairo, sans-serif',
        width: '100%',
        boxSizing: 'border-box',
      }}
      dir="rtl"
    >
      {/* ============================================ */}
      {/* Animated Icon with Warning Badge */}
      {/* ============================================ */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
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
          position: 'relative',
        }}
      >
        <FaTimesCircle size={38} />

        {/* Warning Badge */}
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#F5A623',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid var(--bg-card)',
            boxShadow: '0 4px 10px rgba(245,166,35,0.4)',
          }}
        >
          <FaExclamationTriangle size={12} color="#FFFFFF" />
        </motion.span>
      </motion.div>

      {/* ============================================ */}
      {/* Status Badge */}
      {/* ============================================ */}
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

      {/* ============================================ */}
      {/* Title */}
      {/* ============================================ */}
      <h2
        style={{
          color: 'var(--text-secondary)',
          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
          fontWeight: 900,
          marginBottom: '10px',
          lineHeight: 1.3,
        }}
      >
        نأسف، تم رفض طلبك
      </h2>

      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          lineHeight: 1.7,
          marginBottom: '1.5rem',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        يمكنك إعادة رفع صورة الوثيقة مع التأكد من تطبيق النصائح أدناه.
      </p>

      {/* ============================================ */}
      {/* Info Grid (Document Type + Request Date) */}
      {/* ============================================ */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '400px',
          margin: '0 auto 1.25rem',
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
                <span style={{ color: 'var(--primary-orange)', display: 'inline-flex' }}>
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
      {/* Rejection Reason Box */}
      {/* ============================================ */}
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
            marginBottom: '1.25rem',
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
          <div style={{ flex: 1, minWidth: 0 }}>
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

      {/* ============================================ */}
      {/* Tips Section (Helpful for re-upload) */}
      {/* ============================================ */}
      <div
        style={{
          padding: '14px 16px',
          backgroundColor: 'rgba(245,166,35,0.06)',
          border: '1px solid rgba(245,166,35,0.25)',
          borderRadius: '14px',
          textAlign: 'right',
          marginBottom: '1.5rem',
          maxWidth: '520px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#D97706',
            fontSize: '0.78rem',
            fontWeight: 800,
            marginBottom: '10px',
          }}
        >
          <FaLightbulb size={13} />
          نصائح لرفع ناجح:
        </div>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {tips.map((tip, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
              }}
            >
              <span
                style={{
                  color: '#F5A623',
                  flexShrink: 0,
                  marginTop: '2px',
                  fontWeight: 900,
                }}
              >
                •
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ============================================ */}
      {/* Re-upload CTA */}
      {/* ============================================ */}
      <motion.button
        type="button"
        onClick={onReupload}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%',
          maxWidth: '320px',
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
          justifyContent: 'center',
          gap: '10px',
          boxShadow: '0 6px 20px rgba(232,122,32,0.35)',
          transition: 'all 0.25s ease',
        }}
      >
        <FaRedo size={14} />
        إعادة رفع الطلب
      </motion.button>
    </motion.div>
  );
};

export default VerificationRejectedCard;