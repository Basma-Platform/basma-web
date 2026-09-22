import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEye,
  FaUserShield,
  FaHistory,
  FaChevronDown,
} from 'react-icons/fa';
import { useState } from 'react';
import type { VerificationAccessLog } from '../../../types';
import { formatAccessTime, formatVerificationDate } from '../../../utils/verificationHelpers';

interface AdminAccessLogsListProps {
  logs: VerificationAccessLog[];
  defaultOpen?: boolean;
  maxVisible?: number;
}

const AdminAccessLogsList = ({
  logs,
  defaultOpen = false,
  maxVisible = 5,
}: AdminAccessLogsListProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);

  if (!logs || logs.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.25rem',
          fontFamily: 'Cairo, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
        }}
        dir="rtl"
      >
        <FaHistory size={14} style={{ opacity: 0.5 }} />
        لم يتم الوصول إلى صورة هذه الوثيقة بعد.
      </div>
    );
  }

  const visibleLogs = showAll ? logs : logs.slice(0, maxVisible);
  const hasMore = logs.length > maxVisible;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        overflow: 'hidden',
        fontFamily: 'Cairo, sans-serif',
        width: '100%',
      }}
      dir="rtl"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        style={{
          width: '100%',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          textAlign: 'right',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '11px',
              background: 'linear-gradient(135deg, #8B5A2B, #C49A6C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(139,90,43,0.3)',
            }}
          >
            <FaEye size={15} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h4
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              سجل الوصول للصورة
            </h4>
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.68rem',
                marginTop: '2px',
              }}
            >
              {logs.length} عملية وصول
            </div>
          </div>
        </div>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            display: 'inline-flex',
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}
        >
          <FaChevronDown size={12} />
        </motion.span>
      </button>

      {/* Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 1.25rem 1.25rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {visibleLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {/* Admin Icon */}
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(139,90,43,0.12)',
                        color: '#8B5A2B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FaUserShield size={12} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          marginBottom: '4px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                          }}
                        >
                          {log.admin?.name || 'مشرف محذوف'}
                        </span>
                        <span
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.68rem',
                            fontWeight: 600,
                          }}
                          title={formatVerificationDate(log.accessed_at)}
                        >
                          {formatAccessTime(log.accessed_at)}
                        </span>
                      </div>

                      {log.reason && (
                        <div
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.72rem',
                            lineHeight: 1.5,
                            padding: '4px 8px',
                            backgroundColor: 'rgba(23,162,184,0.06)',
                            border: '1px solid rgba(23,162,184,0.15)',
                            borderRadius: '6px',
                            marginTop: '4px',
                          }}
                        >
                          السبب: {log.reason}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Show More */}
              {hasMore && !showAll && (
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  style={{
                    width: '100%',
                    marginTop: '10px',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px dashed var(--border-color)',
                    backgroundColor: 'transparent',
                    color: 'var(--primary-orange)',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  عرض {logs.length - maxVisible} عملية أخرى
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminAccessLogsList;