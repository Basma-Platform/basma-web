import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaSyncAlt,
  FaInfoCircle,
  FaInbox,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { DonationInquiryStatus } from '../../../../types';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';

interface AdminInquiryStatusModalProps {
  isOpen: boolean;
  currentStatus: DonationInquiryStatus;
  trackingCode?: string;
  onConfirm: (status: DonationInquiryStatus, notes?: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const MAX_NOTES = 500;

interface StatusOption {
  value: DonationInquiryStatus;
  label: string;
  description: string;
  Icon: IconType;
  color: string;
  gradient: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: 'new',
    label: 'جديد',
    description: 'لم يتم التعامل مع الاستفسار بعد',
    Icon: FaInbox,
    color: FUND_THEME.accent,
    gradient: FUND_THEME.gradient,
  },
  {
    value: 'contacted',
    label: 'تم التواصل',
    description: 'تم التواصل مع المتبرع',
    Icon: FaPhone,
    color: '#FFB800',
    gradient: 'linear-gradient(135deg, #FFB800, #F5A623)',
  },
  {
    value: 'completed',
    label: 'مكتمل',
    description: 'تمت عملية التبرع بنجاح',
    Icon: FaCheckCircle,
    color: '#28A745',
    gradient: 'linear-gradient(135deg, #28A745, #4FCB6E)',
  },
  {
    value: 'cancelled',
    label: 'ملغي',
    description: 'تم إلغاء الاستفسار',
    Icon: FaTimesCircle,
    color: '#6C757D',
    gradient: 'linear-gradient(135deg, #6C757D, #9CA3AF)',
  },
];

const AdminInquiryStatusModal = ({
  isOpen,
  currentStatus,
  trackingCode,
  onConfirm,
  onCancel,
  isLoading = false,
}: AdminInquiryStatusModalProps) => {
  const [selected, setSelected] = useState<DonationInquiryStatus>(currentStatus);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelected(currentStatus);
      setNotes('');
      setError(null);
    }
  }, [isOpen, currentStatus]);

  const handleClose = () => {
    if (isLoading) return;
    onCancel();
  };

  const handleConfirm = async () => {
    if (isLoading) return;
    if (selected === currentStatus) {
      setError('الرجاء اختيار حالة جديدة');
      return;
    }
    setError(null);
    await onConfirm(selected, notes.trim() || undefined);
  };

  const isValid = selected !== currentStatus;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="aism-backdrop"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="aism-modal"
            dir="rtl"
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              aria-label="إغلاق"
              className="aism-close"
            >
              <FaTimes size={12} />
            </button>

            <div className="aism-body">
              {/* Header icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 16,
                  delay: 0.1,
                }}
                className="aism-icon"
              >
                <FaSyncAlt size={24} />
              </motion.div>

              <h3 className="aism-title">تحديث حالة الاستفسار</h3>

              {trackingCode && (
                <p className="aism-tracking">{trackingCode}</p>
              )}

              {/* ─── Status options ─── */}
              <div className="aism-label-row">
                <span className="aism-label">
                  اختر الحالة الجديدة
                  <span className="aism-label__required">*</span>
                </span>
                {selected === currentStatus && (
                  <span className="aism-current-hint">
                    الحالة الحالية: {STATUS_OPTIONS.find((o) => o.value === currentStatus)?.label}
                  </span>
                )}
              </div>

              <div className="aism-status-grid">
                {STATUS_OPTIONS.map((opt) => {
                  const active = selected === opt.value;
                  const isCurrent = currentStatus === opt.value;
                  const Icon = opt.Icon;

                  return (
                    <motion.button
                      key={opt.value}
                      type="button"
                      whileHover={
                        !isLoading ? { y: -2, scale: 1.01 } : {}
                      }
                      whileTap={!isLoading ? { scale: 0.97 } : {}}
                      onClick={() => !isLoading && setSelected(opt.value)}
                      disabled={isLoading}
                      className="aism-status-card"
                      style={{
                        borderColor: active ? opt.color : 'var(--border-color)',
                        backgroundColor: active
                          ? `${opt.color}10`
                          : 'var(--bg-input)',
                        boxShadow: active
                          ? `0 4px 14px ${opt.color}25`
                          : 'none',
                      }}
                    >
                      <div className="aism-status-card__header">
                        <div
                          className="aism-status-card__icon"
                          style={{ background: opt.gradient }}
                        >
                          <Icon size={12} />
                        </div>
                        <span
                          className="aism-status-card__label"
                          style={{
                            color: active ? opt.color : 'var(--text-secondary)',
                          }}
                        >
                          {opt.label}
                        </span>
                        {isCurrent && (
                          <span className="aism-status-card__current-badge">
                            الحالية
                          </span>
                        )}
                      </div>

                      <div className="aism-status-card__desc">
                        {opt.description}
                      </div>

                      {active && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                          className="aism-status-card__check"
                          style={{ backgroundColor: opt.color }}
                        >
                          <FaCheckCircle size={8} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* ─── Notes ─── */}
              <div className="aism-notes-section">
                <label className="aism-label">
                  ملاحظات إدارية
                  <span className="aism-label__hint">(اختياري)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value.slice(0, MAX_NOTES));
                    if (error) setError(null);
                  }}
                  disabled={isLoading}
                  rows={3}
                  maxLength={MAX_NOTES}
                  placeholder="مثال: تم التواصل مع المتبرع عبر واتساب"
                  className="aism-textarea"
                />
                {notes.length > 0 && (
                  <div className="aism-charcount">
                    {notes.length}/{MAX_NOTES}
                  </div>
                )}
              </div>

              {/* ─── Error ─── */}
              {error && (
                <div className="aism-error">
                  <FaInfoCircle size={10} />
                  {error}
                </div>
              )}
            </div>

            {/* ─── Footer ─── */}
            <div className="aism-footer">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="aism-btn aism-btn--ghost"
              >
                إلغاء
              </button>
              <motion.button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading || !isValid}
                whileHover={
                  !isLoading && isValid ? { scale: 1.02, y: -1 } : {}
                }
                whileTap={!isLoading && isValid ? { scale: 0.97 } : {}}
                className="aism-btn aism-btn--primary"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm aism-spinner" />
                    جاري التحديث...
                  </>
                ) : (
                  <>
                    <FaSyncAlt size={12} />
                    تحديث الحالة
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <style>{`
        /* ── Backdrop ── */
        .aism-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0,0,0,0.65);
          backdrop-filter: blur(6px);
          z-index: 1090;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          direction: rtl;
        }

        @media (max-width: 480px) {
          .aism-backdrop {
            padding: 10px;
            align-items: flex-start;
            padding-top: 24px;
          }
        }

        /* ── Modal ── */
        .aism-modal {
          position: relative;
          width: 100%;
          max-width: 560px;
          background-color: var(--bg-card);
          border-radius: 20px;
          border: 1px solid var(--border-color);
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
          overflow: hidden;
          font-family: 'Cairo', sans-serif;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 480px) {
          .aism-modal {
            border-radius: 16px;
            max-height: 88vh;
          }
        }

        .aism-close {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: none;
          background-color: var(--bg-input);
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }

        .aism-close:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .aism-body {
          padding: 1.5rem 1.5rem 1.25rem;
          overflow-y: auto;
          flex: 1;
        }

        @media (max-width: 380px) {
          .aism-body {
            padding: 1.25rem 1rem 1rem;
          }
        }

        /* ── Header ── */
        .aism-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: ${FUND_THEME.gradient};
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          margin: 0 auto 1rem;
          box-shadow: 0 8px 24px ${FUND_THEME.shadow};
        }

        @media (max-width: 380px) {
          .aism-icon {
            width: 56px;
            height: 56px;
          }
          .aism-icon svg {
            width: 22px;
            height: 22px;
          }
        }

        .aism-title {
          text-align: center;
          color: var(--text-secondary);
          font-size: clamp(1rem, 3.2vw, 1.1rem);
          font-weight: 900;
          margin: 0 0 6px;
        }

        .aism-tracking {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.78rem;
          font-family: system-ui, sans-serif;
          direction: ltr;
          margin: 0 0 1.25rem;
          letter-spacing: 0.5px;
        }

        /* ── Label row ── */
        .aism-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .aism-label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .aism-label__hint {
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.72rem;
        }

        .aism-label__required {
          color: var(--error);
          font-weight: 900;
        }

        .aism-current-hint {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 6px;
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
        }

        /* ── Status Grid — 2 columns ── */
        .aism-status-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 1rem;
        }

        @media (max-width: 480px) {
          .aism-status-grid {
            grid-template-columns: 1fr;
            gap: 6px;
          }
        }

        /* ── Status Card ── */
        .aism-status-card {
          position: relative;
          padding: 12px;
          border-radius: 12px;
          border: 1.5px solid var(--border-color);
          background-color: var(--bg-input);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: right;
          font-family: 'Cairo', sans-serif;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        .aism-status-card:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .aism-status-card__header {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          min-width: 0;
        }

        .aism-status-card__icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          flex-shrink: 0;
        }

        .aism-status-card__label {
          font-size: 0.82rem;
          font-weight: 800;
          flex: 1;
          min-width: 0;
        }

        .aism-status-card__current-badge {
          font-size: 0.55rem;
          padding: 1px 6px;
          border-radius: 6px;
          background-color: var(--bg-card);
          color: var(--text-muted);
          border: 1px solid var(--border-color);
          font-weight: 700;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .aism-status-card__desc {
          color: var(--text-muted);
          font-size: 0.68rem;
          line-height: 1.45;
          text-align: right;
        }

        .aism-status-card__check {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          border: 2px solid var(--bg-card);
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        /* ── Notes ── */
        .aism-notes-section {
          margin-bottom: 0.75rem;
        }

        .aism-textarea {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-input);
          color: var(--text-primary);
          font-family: 'Cairo', sans-serif;
          font-size: 0.82rem;
          outline: none;
          resize: none;
          box-sizing: border-box;
          line-height: 1.5;
          margin-top: 6px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .aism-textarea:focus {
          border-color: ${FUND_THEME.accent};
          box-shadow: 0 0 0 3px ${FUND_THEME.accent}15;
        }

        .aism-charcount {
          text-align: left;
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-top: 4px;
          opacity: 0.7;
          font-family: system-ui, sans-serif;
        }

        /* ── Error ── */
        .aism-error {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 6px;
          color: var(--error);
          font-size: 0.72rem;
        }

        /* ── Footer ── */
        .aism-footer {
          padding: 1rem 1.5rem 1.25rem;
          display: flex;
          gap: 10px;
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-input);
        }

        @media (max-width: 380px) {
          .aism-footer {
            padding: 0.9rem 1rem 1rem;
            flex-direction: column-reverse;
          }
        }

        .aism-btn {
          flex: 1;
          padding: 11px 16px;
          border-radius: 11px;
          font-family: 'Cairo', sans-serif;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border: none;
        }

        .aism-btn--ghost {
          border: 1.5px solid var(--border-color);
          background-color: var(--bg-card);
          color: var(--text-secondary);
          font-weight: 700;
        }

        .aism-btn--ghost:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .aism-btn--primary {
          background: ${FUND_THEME.gradient};
          color: #FFFFFF;
          box-shadow: 0 4px 16px ${FUND_THEME.shadow};
        }

        .aism-btn--primary:disabled {
          background: var(--btn-disabled-bg);
          color: var(--btn-disabled-text);
          box-shadow: none;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .aism-spinner {
          width: 13px;
          height: 13px;
        }

        @media (prefers-reduced-motion: reduce) {
          .aism-status-card,
          .aism-btn {
            transition: none !important;
          }
        }
      `}</style>
    </AnimatePresence>
  );
};

export default AdminInquiryStatusModal;