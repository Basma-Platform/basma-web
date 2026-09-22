import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFlag } from 'react-icons/fa';
import ReportModal from './ReportModal';

interface ReportButtonProps {
  /** 'user' or 'announcement' */
  targetType: 'user' | 'announcement';
  /** Required when targetType = 'user' */
  reportedUserId?: number;
  /** Required when targetType = 'announcement' */
  announcementId?: number;
  /** Display name to show inside the modal */
  targetName?: string;
  /** Visual variant */
  variant?: 'compact' | 'full';
  /** Optional: disable when not logged in */
  disabled?: boolean;
}

const ReportButton = ({
  targetType,
  reportedUserId,
  announcementId,
  targetName,
  variant = 'full',
  disabled = false,
}: ReportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (disabled) return;
    setIsOpen(true);
  };

  return (
    <>
      {variant === 'compact' ? (
        <motion.button
          type="button"
          onClick={handleOpen}
          disabled={disabled}
          whileHover={!disabled ? { scale: 1.08 } : {}}
          whileTap={!disabled ? { scale: 0.94 } : {}}
          title="إبلاغ"
          aria-label="إبلاغ"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.5 : 1,
            fontFamily: 'Cairo, sans-serif',
          }}
          onMouseEnter={(e) => {
            if (disabled) return;
            e.currentTarget.style.borderColor = '#DC3545';
            e.currentTarget.style.color = '#DC3545';
            e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <FaFlag size={14} />
        </motion.button>
      ) : (
        <motion.button
          type="button"
          onClick={handleOpen}
          disabled={disabled}
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (disabled) return;
            e.currentTarget.style.borderColor = '#DC3545';
            e.currentTarget.style.color = '#DC3545';
            e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <FaFlag size={13} />
          إبلاغ
        </motion.button>
      )}

      {/* Modal */}
      <ReportModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        targetType={targetType}
        reportedUserId={reportedUserId}
        announcementId={announcementId}
        targetName={targetName}
      />
    </>
  );
};

export default ReportButton;