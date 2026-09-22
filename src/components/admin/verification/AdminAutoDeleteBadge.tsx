import { motion } from 'framer-motion';
import { FaClock, FaTrashAlt, FaShieldAlt } from 'react-icons/fa';
import {
  getDaysUntilAutoDelete,
  formatAutoDeleteDate,
} from '../../../utils/verificationHelpers';

interface AdminAutoDeleteBadgeProps {
  hasImage: boolean;
  imageDeletedAt: string | null;
  autoDeleteAt: string | null;
  /** Small variant for card headers */
  compact?: boolean;
}

const AdminAutoDeleteBadge = ({
  hasImage,
  imageDeletedAt,
  autoDeleteAt,
  compact = false,
}: AdminAutoDeleteBadgeProps) => {
  // ============================================
  // Already Deleted
  // ============================================
  if (imageDeletedAt || !hasImage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: compact ? '3px 8px' : '5px 12px',
          borderRadius: '8px',
          backgroundColor: 'rgba(108,117,125,0.12)',
          color: '#6C757D',
          border: '1px solid rgba(108,117,125,0.3)',
          fontSize: compact ? '0.65rem' : '0.7rem',
          fontWeight: 700,
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <FaTrashAlt size={compact ? 9 : 10} />
        {compact ? 'محذوفة' : 'الصورة محذوفة'}
      </motion.div>
    );
  }

  // ============================================
  // No auto-delete scheduled
  // ============================================
  if (!autoDeleteAt) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: compact ? '3px 8px' : '5px 12px',
          borderRadius: '8px',
          backgroundColor: 'rgba(40,167,69,0.1)',
          color: '#28A745',
          border: '1px solid rgba(40,167,69,0.25)',
          fontSize: compact ? '0.65rem' : '0.7rem',
          fontWeight: 700,
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <FaShieldAlt size={compact ? 9 : 10} />
        {compact ? 'متوفرة' : 'الصورة متوفرة بأمان'}
      </div>
    );
  }

  // ============================================
  // Auto-delete scheduled
  // ============================================
  const daysRemaining = getDaysUntilAutoDelete(autoDeleteAt);
  const isUrgent = daysRemaining !== null && daysRemaining <= 7;
  const color = isUrgent ? '#F5A623' : '#17A2B8';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: compact ? '3px 8px' : '5px 12px',
        borderRadius: '8px',
        backgroundColor: `${color}12`,
        color: color,
        border: `1px solid ${color}40`,
        fontSize: compact ? '0.65rem' : '0.7rem',
        fontWeight: 700,
        fontFamily: 'Cairo, sans-serif',
      }}
      title={`ستُحذف تلقائياً في: ${formatAutoDeleteDate(autoDeleteAt)}`}
    >
      <FaClock size={compact ? 9 : 10} />
      {compact ? (
        <>حذف بعد {daysRemaining} يوم</>
      ) : (
        <>
          ستُحذف تلقائياً بعد <strong>{daysRemaining}</strong> يوم
        </>
      )}
    </motion.div>
  );
};

export default AdminAutoDeleteBadge;