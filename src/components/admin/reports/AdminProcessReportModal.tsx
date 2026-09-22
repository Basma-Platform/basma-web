import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaBan,
  FaClock,
  FaInfoCircle,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { ReportAction } from '../../../types';
import {
  getActionColor,
  actionRequiresSuspendDays,
} from '../../../utils/reportHelpers';

const MIN_NOTES = 3;
const MAX_NOTES = 1000;
const MIN_SUSPEND_DAYS = 1;
const MAX_SUSPEND_DAYS = 365;

interface ActionConfig {
  key: ReportAction;
  label: string;
  description: string;
  Icon: IconType;
  confirmLabel: string;
  affectsUser: boolean;
  danger?: boolean;
}

const ACTIONS: ActionConfig[] = [
  {
    key: 'warn_user',
    label: 'تحذير المستخدم',
    description: 'إرسال تحذير رسمي للمستخدم دون تعليق الحساب',
    Icon: FaExclamationTriangle,
    confirmLabel: 'إرسال التحذير',
    affectsUser: true,
  },
  {
    key: 'suspend_user',
    label: 'تعليق الحساب',
    description: 'تعليق حساب المستخدم مؤقتاً لفترة محددة',
    Icon: FaClock,
    confirmLabel: 'تعليق الحساب',
    affectsUser: true,
  },
  {
    key: 'block_user',
    label: 'حظر الحساب',
    description: 'حظر حساب المستخدم نهائياً من المنصة',
    Icon: FaBan,
    confirmLabel: 'حظر الحساب',
    affectsUser: true,
    danger: true,
  },
  {
    key: 'delete_content',
    label: 'حذف المحتوى',
    description: 'حذف الإعلان المخالف نهائياً',
    Icon: FaTrash,
    confirmLabel: 'حذف المحتوى',
    affectsUser: false,
    danger: true,
  },
  {
    key: 'reject_report',
    label: 'رفض البلاغ',
    description: 'إغلاق البلاغ بدون اتخاذ إجراء',
    Icon: FaTimesCircle,
    confirmLabel: 'رفض البلاغ',
    affectsUser: false,
  },
];

interface AdminProcessReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Pre-selected action (from the action buttons on the detail page) */
  initialAction?: ReportAction | null;
  /** Report metadata for context */
  reportId: number;
  targetType: 'user' | 'announcement';
  reportedName?: string;
  announcementTitle?: string;
  /** Submit handler */
  onSubmit: (data: {
    action: ReportAction;
    admin_notes: string;
    suspend_days?: number;
  }) => Promise<void>;
  isLoading?: boolean;
}

const AdminProcessReportModal = ({
  isOpen,
  onClose,
  initialAction = null,
  reportId,
  targetType,
  reportedName,
  announcementTitle,
  onSubmit,
  isLoading = false,
}: AdminProcessReportModalProps) => {
  const [selectedAction, setSelectedAction] =
    useState<ReportAction | null>(initialAction);
  const [notes, setNotes] = useState('');
  const [suspendDays, setSuspendDays] = useState<number>(7);
  const [error, setError] = useState<string | null>(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setSelectedAction(initialAction);
      setNotes('');
      setSuspendDays(7);
      setError(null);
    }
  }, [isOpen, initialAction]);

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  const currentActionConfig = ACTIONS.find(
    (a) => a.key === selectedAction
  );

  const requiresSuspendDays =
    selectedAction !== null && actionRequiresSuspendDays(selectedAction);

  const handleSubmit = async () => {
    if (isLoading) return;

    if (!selectedAction) {
      setError('يرجى اختيار إجراء');
      return;
    }

    const trimmedNotes = notes.trim();
    if (trimmedNotes.length < MIN_NOTES) {
      setError(`الملاحظات مطلوبة (${MIN_NOTES} أحرف على الأقل)`);
      return;
    }
    if (trimmedNotes.length > MAX_NOTES) {
      setError(`الملاحظات يجب أن لا تتجاوز ${MAX_NOTES} حرف`);
      return;
    }

    if (requiresSuspendDays) {
      if (
        suspendDays < MIN_SUSPEND_DAYS ||
        suspendDays > MAX_SUSPEND_DAYS
      ) {
        setError(
          `عدد أيام التعليق يجب أن يكون بين ${MIN_SUSPEND_DAYS} و ${MAX_SUSPEND_DAYS}`
        );
        return;
      }
    }

    setError(null);

    try {
      await onSubmit({
        action: selectedAction,
        admin_notes: trimmedNotes,
        suspend_days: requiresSuspendDays ? suspendDays : undefined,
      });
    } catch {
      // Error handled by hook
    }
  };

  const targetDescription =
    targetType === 'user'
      ? reportedName
        ? `المستخدم: ${reportedName}`
        : 'المستخدم المُبلَّغ عنه'
      : announcementTitle
        ? `الإعلان: ${announcementTitle}`
        : 'الإعلان المُبلَّغ عنه';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            direction: 'rtl',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '92vh',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              fontFamily: 'Cairo, sans-serif',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0.04)',
                color: 'var(--text-muted)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                opacity: isLoading ? 0.5 : 1,
              }}
              aria-label="إغلاق"
            >
              <FaTimes size={12} />
            </button>

            {/* Body */}
            <div
              style={{
                padding: '1.75rem 1.5rem 1.25rem',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              {/* Header */}
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '1rem',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    color: 'var(--text-secondary)',
                    margin: '0 0 6px',
                  }}
                >
                  معالجة البلاغ #{reportId}
                </h3>
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  اختر الإجراء المناسب وسجّل ملاحظاتك الإدارية.
                </p>
              </div>

              {/* Target Summary */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1.25rem',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                }}
              >
                <FaInfoCircle
                  size={11}
                  color="var(--primary-orange)"
                  style={{ flexShrink: 0 }}
                />
                <span
                  style={{
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                  }}
                >
                  {targetDescription}
                </span>
              </div>

              {/* Action Picker */}
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                }}
              >
                الإجراء <span style={{ color: 'var(--error)' }}>*</span>
              </label>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '1.25rem',
                }}
              >
                {ACTIONS.map((action) => {
                  const isActive = selectedAction === action.key;
                  const actionColor = getActionColor(action.key);
                  const Icon = action.Icon;

                  return (
                    <motion.button
                      key={action.key}
                      type="button"
                      onClick={() => {
                        if (isLoading) return;
                        setSelectedAction(action.key);
                        if (error) setError(null);
                      }}
                      disabled={isLoading}
                      whileHover={!isLoading ? { x: -3 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: `1.5px solid ${
                          isActive ? actionColor : 'var(--border-color)'
                        }`,
                        backgroundColor: isActive
                          ? `${actionColor}0D`
                          : 'var(--bg-input)',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        textAlign: 'right',
                        transition: 'all 0.2s ease',
                        fontFamily: 'Cairo, sans-serif',
                        width: '100%',
                        opacity: isLoading ? 0.6 : 1,
                      }}
                    >
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '10px',
                          backgroundColor: `${actionColor}20`,
                          color: actionColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={14} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            color: isActive
                              ? actionColor
                              : 'var(--text-secondary)',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            marginBottom: '2px',
                          }}
                        >
                          {action.label}
                        </div>
                        <div
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.7rem',
                            lineHeight: 1.4,
                          }}
                        >
                          {action.description}
                        </div>
                      </div>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: `2px solid ${
                            isActive ? actionColor : 'var(--border-color)'
                          }`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: actionColor,
                            }}
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Suspend days (only for suspend_user) */}
              {requiresSuspendDays && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      marginBottom: '6px',
                    }}
                  >
                    عدد أيام التعليق{' '}
                    <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min={MIN_SUSPEND_DAYS}
                    max={MAX_SUSPEND_DAYS}
                    value={suspendDays}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setSuspendDays(v);
                      if (error) setError(null);
                    }}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      fontFamily:
                        "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      outline: 'none',
                      direction: 'ltr',
                      textAlign: 'center',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '4px',
                      fontSize: '0.68rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span>الحد الأدنى: {MIN_SUSPEND_DAYS} يوم</span>
                    <span>الحد الأقصى: {MAX_SUSPEND_DAYS} يوم</span>
                  </div>
                </div>
              )}

              {/* Admin notes (required) */}
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                ملاحظات الإدارة{' '}
                <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value.slice(0, MAX_NOTES));
                  if (error) setError(null);
                }}
                disabled={isLoading}
                placeholder="اشرح سبب القرار بوضوح..."
                rows={3}
                maxLength={MAX_NOTES}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.82rem',
                  outline: 'none',
                  resize: 'none',
                  lineHeight: 1.5,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '4px',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    opacity: 0.75,
                  }}
                >
                  الحد الأدنى: {MIN_NOTES} أحرف
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    opacity: 0.75,
                    fontFamily: 'system-ui, sans-serif',
                  }}
                >
                  {notes.length}/{MAX_NOTES}
                </span>
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '10px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(220,53,69,0.06)',
                    border: '1px solid rgba(220,53,69,0.2)',
                    color: 'var(--error)',
                    fontSize: '0.75rem',
                  }}
                >
                  <FaInfoCircle size={10} />
                  {error}
                </div>
              )}

              {/* Danger warning for block / delete */}
              {currentActionConfig?.danger && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(220,53,69,0.06)',
                    border: '1px solid rgba(220,53,69,0.2)',
                    borderRadius: '10px',
                    marginTop: '10px',
                  }}
                >
                  <FaExclamationTriangle
                    size={12}
                    color="#DC3545"
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: '#DC3545',
                      lineHeight: 1.5,
                    }}
                  >
                    هذا الإجراء لا يمكن التراجع عنه. تأكد من مراجعة التفاصيل
                    بعناية قبل التأكيد.
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '1rem 1.5rem 1.25rem',
                display: 'flex',
                gap: '10px',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                style={{
                  flex: '1 1 0',
                  minWidth: '100px',
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                إلغاء
              </button>

              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !selectedAction}
                whileHover={
                  !isLoading && selectedAction ? { scale: 1.02, y: -1 } : {}
                }
                whileTap={
                  !isLoading && selectedAction ? { scale: 0.97 } : {}
                }
                style={{
                  flex: '1 1 0',
                  minWidth: '160px',
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: 'none',
                  background: !selectedAction
                    ? 'var(--primary-brown-light)'
                    : currentActionConfig?.danger
                      ? 'linear-gradient(135deg, #DC3545, #B02A37)'
                      : 'linear-gradient(135deg, #28A745, #1e7e34)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor:
                    isLoading || !selectedAction ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow: !selectedAction
                    ? 'none'
                    : currentActionConfig?.danger
                      ? '0 4px 16px rgba(220,53,69,0.35)'
                      : '0 4px 16px rgba(40,167,69,0.35)',
                  opacity: isLoading || !selectedAction ? 0.6 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{ width: '13px', height: '13px' }}
                    />
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <FaCheckCircle size={12} />
                    {currentActionConfig?.confirmLabel || 'تأكيد الإجراء'}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminProcessReportModal;