import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';
import {
  getReportPriorityColor,
  getReportPriorityBg,
  getReportPriorityLabel,
} from '../../utils/reportHelpers';
import type { ReportReason } from '../../types';

interface ReportReasonPickerProps {
  reasons: ReportReason[];
  selected: string | null;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

const ReportReasonPicker = ({
  reasons,
  selected,
  onSelect,
  disabled = false,
}: ReportReasonPickerProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {reasons.map((reason) => {
        const isActive = selected === reason.value;
        const priorityColor = getReportPriorityColor(reason.priority);
        const priorityBg = getReportPriorityBg(reason.priority);
        const isHighPriority = reason.priority === 'high';

        return (
          <motion.button
            key={reason.value}
            type="button"
            onClick={() => !disabled && onSelect(reason.value)}
            disabled={disabled}
            whileHover={!disabled ? { x: -3 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 16px', // Expanded touch padding for mobile ergonomics
              borderRadius: '14px',
              border: `1.5px solid ${
                isActive ? 'var(--primary-orange)' : 'var(--border-color)'
              }`,
              backgroundColor: isActive
                ? 'rgba(232,122,32,0.08)'
                : 'var(--bg-input)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              textAlign: 'right',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: disabled ? 0.6 : 1,
              fontFamily: 'Cairo, sans-serif',
              width: '100%',
              minHeight: '52px', // Touch target optimized (>48px)
              touchAction: 'manipulation',
            }}
          >
            {/* Radio circle */}
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                border: `2px solid ${
                  isActive ? 'var(--primary-orange)' : 'var(--border-color)'
                }`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s ease',
              }}
            >
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  style={{
                    width: '11px',
                    height: '11px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-orange)',
                  }}
                />
              )}
            </div>

            {/* Label */}
            <span
              style={{
                flex: 1,
                color: isActive
                  ? 'var(--primary-orange)'
                  : 'var(--text-secondary)',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 600,
                lineHeight: 1.5,
              }}
            >
              {reason.label}
            </span>

            {/* Priority badge */}
            {isHighPriority && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 9px',
                  borderRadius: '7px',
                  backgroundColor: priorityBg,
                  color: priorityColor,
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  border: `1px solid ${priorityColor}40`,
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
                title={`أولوية ${getReportPriorityLabel(reason.priority)}`}
              >
                <FaExclamationTriangle size={9} />
                {getReportPriorityLabel(reason.priority)}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default ReportReasonPicker;