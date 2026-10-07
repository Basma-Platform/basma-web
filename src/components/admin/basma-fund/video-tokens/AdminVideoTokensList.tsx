import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaTimes,
  FaVideo,
  FaInbox,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaGlobe,
  FaUser,
  FaUserShield,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

import { adminVideoTokenService } from '../../../../services/adminVideoTokenService';
import AdminVideoTokenCard from './AdminVideoTokenCard';
import AdminCreateVideoTokenModal from './AdminCreateVideoTokenModal';
import type { AdminVideoTokenListItem } from '../../../../types';
import { formatTokenExpiry } from '../../../../utils/videoTokenHelpers';

interface AdminVideoTokensListProps {
  helpRequestId: number;
  helpRequestTitle?: string;
}

// ✅ Normalized entry — matches backend unified shape
interface NormalizedLogEntry {
  id: string | number;
  action_type: string;
  status: string;
  reason: string | null;
  ip_address: string | null;
  user_agent: string | null;
  accessed_at: string | null;
  actor_type: 'user' | 'admin';
  admin: { id: number; name: string } | null;
}

interface AccessLogData {
  token_id: number;
  issued_to_type: string;
  help_request: { id: number; title: string } | null;
  recipient: {
    name: string | null;
    email: string | null;
    whatsapp: string | null;
  };
  max_views: number;
  views_used: number;
  expires_at: string;
  is_revoked: boolean;
  access_log: NormalizedLogEntry[];
}

const AdminVideoTokensList = ({
  helpRequestId,
  helpRequestTitle,
}: AdminVideoTokensListProps) => {
  const [tokens, setTokens] = useState<AdminVideoTokenListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  // Revoke modal
  const [revokeTarget, setRevokeTarget] =
    useState<AdminVideoTokenListItem | null>(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [revokeSubmitting, setRevokeSubmitting] = useState(false);

  // Access log modal
  const [logTarget, setLogTarget] =
    useState<AdminVideoTokenListItem | null>(null);
  const [logLoading, setLogLoading] = useState(false);
  const [logData, setLogData] = useState<AccessLogData | null>(null);

  // ============================================
  // Fetch
  // ============================================
  const fetchTokens = useCallback(async () => {
    try {
      setLoading(true);
      const response =
        await adminVideoTokenService.listForHelpRequest(helpRequestId);
      setTokens(response.data);
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في تحميل الروابط';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [helpRequestId]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  // ============================================
  // Create
  // ============================================
  const handleCreated = useCallback(() => {
    fetchTokens();
  }, [fetchTokens]);

  // ============================================
  // Revoke
  // ============================================
  const handleRevokeClick = useCallback((token: AdminVideoTokenListItem) => {
    setRevokeTarget(token);
    setRevokeReason('');
  }, []);

  const handleRevokeConfirm = async () => {
    if (!revokeTarget) return;
    const trimmed = revokeReason.trim();
    if (trimmed.length < 5) {
      toast.error('يرجى كتابة سبب (5 أحرف على الأقل)');
      return;
    }

    try {
      setRevokeSubmitting(true);
      await adminVideoTokenService.revoke(revokeTarget.id, trimmed);
      toast.success('تم إلغاء الرابط');
      setRevokeTarget(null);
      setRevokeReason('');
      await fetchTokens();
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في إلغاء الرابط';
      toast.error(message);
    } finally {
      setRevokeSubmitting(false);
    }
  };

  // ============================================
  // Access log
  // ✅ Backend now returns UNIFIED structure
  // ============================================
  const handleViewAccessLog = async (token: AdminVideoTokenListItem) => {
    setLogTarget(token);
    setLogLoading(true);
    setLogData(null);
    try {
      const response = await adminVideoTokenService.getAccessLog(token.id);
      // ✅ Safe cast: `response.data` is a superset of AccessLogData
      setLogData(response.data as unknown as AccessLogData);
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في تحميل السجل';
      toast.error(message);
      setLogTarget(null);
    } finally {
      setLogLoading(false);
    }
  };

  // ============================================
  // Stats
  // ============================================
  const activeCount = tokens.filter(
    (t) =>
      !t.is_revoked &&
      t.views_used < 1 &&
      new Date(t.expires_at).getTime() > Date.now()
  ).length;

  const usedCount = tokens.filter((t) => t.views_used >= 1).length;

  return (
    <div className="admin-vtl" dir="rtl">
      {/* Header */}
      <div className="admin-vtl__header">
        <div className="admin-vtl__header-left">
          <div className="admin-vtl__icon">
            <FaVideo size={16} />
          </div>
          <div className="admin-vtl__header-text">
            <h4 className="admin-vtl__title">روابط المشاهدة</h4>
            <p className="admin-vtl__subtitle">
              {tokens.length > 0 ? (
                <>
                  {tokens.length} رابط · {activeCount} نشط · {usedCount} مستخدم
                </>
              ) : (
                'لا توجد روابط بعد'
              )}
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={() => setCreateOpen(true)}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="admin-vtl__create-btn"
        >
          <FaPlus size={11} />
          <span>إنشاء رابط جديد</span>
        </motion.button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="admin-vtl__loading">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="admin-vtl__spinner"
          />
          <div className="admin-vtl__loading-text">جاري تحميل الروابط...</div>
        </div>
      ) : tokens.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-vtl__empty"
        >
          <div className="admin-vtl__empty-icon">
            <FaInbox size={26} />
          </div>
          <h5 className="admin-vtl__empty-title">لا توجد روابط بعد</h5>
          <p className="admin-vtl__empty-desc">
            أنشئ رابطاً جديداً لمشاركته مع متبرع محتمل
          </p>
        </motion.div>
      ) : (
        <div className="admin-vtl__grid">
          {tokens.map((token, idx) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: Math.min(idx * 0.04, 0.4),
              }}
              style={{ minWidth: 0 }}
            >
              <AdminVideoTokenCard
                token={token}
                onRevoke={handleRevokeClick}
                onViewAccessLog={handleViewAccessLog}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AdminCreateVideoTokenModal
        isOpen={createOpen}
        helpRequestId={helpRequestId}
        helpRequestTitle={helpRequestTitle}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />

      {/* Revoke Modal */}
      <AnimatePresence>
        {revokeTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !revokeSubmitting && setRevokeTarget(null)}
            className="admin-vtl__backdrop"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.94 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="admin-vtl__modal"
              style={{ maxWidth: '440px' }}
            >
              <button
                type="button"
                onClick={() => !revokeSubmitting && setRevokeTarget(null)}
                disabled={revokeSubmitting}
                className="admin-vtl__modal-close"
                aria-label="إغلاق"
              >
                <FaTimes size={12} />
              </button>

              <div className="admin-vtl__modal-body">
                <div
                  className="admin-vtl__modal-icon"
                  style={{
                    background: 'linear-gradient(135deg, #DC3545, #E8707D)',
                    boxShadow: '0 8px 24px rgba(220,53,69,0.4)',
                  }}
                >
                  <FaTimesCircle size={24} />
                </div>

                <h3 className="admin-vtl__modal-title">تأكيد إلغاء الرابط</h3>
                <p className="admin-vtl__modal-text">
                  سيتم إلغاء الرابط #{revokeTarget.id} نهائياً. لن يتمكن
                  المستخدم من فتح الفيديو.
                </p>

                <label className="admin-vtl__modal-label">
                  سبب الإلغاء <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <textarea
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  disabled={revokeSubmitting}
                  placeholder="اكتب سبب الإلغاء (5-300 حرف)"
                  rows={3}
                  maxLength={300}
                  className="admin-vtl__textarea"
                />
              </div>

              <div className="admin-vtl__modal-footer">
                <button
                  type="button"
                  onClick={() => setRevokeTarget(null)}
                  disabled={revokeSubmitting}
                  className="admin-vtl__btn admin-vtl__btn--ghost"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleRevokeConfirm}
                  disabled={revokeSubmitting || revokeReason.trim().length < 5}
                  className="admin-vtl__btn admin-vtl__btn--danger"
                >
                  {revokeSubmitting ? 'جاري الإلغاء...' : 'تأكيد الإلغاء'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* Access Log Modal — ✅ FIXED */}
      {/* ============================================ */}
      <AnimatePresence>
        {logTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLogTarget(null)}
            className="admin-vtl__backdrop"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.94 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="admin-vtl__modal admin-vtl__modal--wide"
            >
              <button
                type="button"
                onClick={() => setLogTarget(null)}
                className="admin-vtl__modal-close"
                aria-label="إغلاق"
              >
                <FaTimes size={12} />
              </button>

              <div className="admin-vtl__modal-header">
                <div className="admin-vtl__modal-header-icon">
                  <FaGlobe size={16} />
                </div>
                <div className="admin-vtl__modal-header-text">
                  <h3 className="admin-vtl__modal-title admin-vtl__modal-title--sm">
                    سجل الوصول · #{logTarget.id}
                  </h3>
                  <p className="admin-vtl__modal-header-purpose">
                    {logTarget.purpose}
                  </p>
                </div>
              </div>

              <div className="admin-vtl__modal-content">
                {logLoading ? (
                  <div className="admin-vtl__log-loading">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="admin-vtl__spinner admin-vtl__spinner--sm"
                    />
                  </div>
                ) : logData && logData.access_log.length > 0 ? (
                  <div className="admin-vtl__log-list">
                    {logData.access_log.map((entry, idx) => (
                      <LogEntry key={entry.id || idx} entry={entry} />
                    ))}
                  </div>
                ) : (
                  <div className="admin-vtl__log-empty">
                    <FaClock size={26} opacity={0.4} />
                    <div className="admin-vtl__log-empty-text">
                      لا توجد سجلات وصول بعد
                    </div>
                    <p className="admin-vtl__log-empty-hint">
                      ستظهر السجلات هنا بمجرد أن يفتح المستلم الفيديو
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .admin-vtl {
          font-family: 'Cairo', sans-serif;
          width: 100%;
          box-sizing: border-box;
        }

        /* ============ Header ============ */
        .admin-vtl__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .admin-vtl__header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          flex: 1;
        }

        .admin-vtl__icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #17A2B8, #20C9E0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          box-shadow: 0 6px 16px rgba(23,162,184,0.35);
          flex-shrink: 0;
        }

        .admin-vtl__header-text {
          min-width: 0;
          flex: 1;
        }

        .admin-vtl__title {
          color: var(--text-secondary);
          font-size: clamp(0.92rem, 3vw, 1rem);
          font-weight: 800;
          margin: 0;
          line-height: 1.25;
        }

        .admin-vtl__subtitle {
          color: var(--text-muted);
          font-size: clamp(0.68rem, 2.4vw, 0.72rem);
          margin: 3px 0 0;
          font-weight: 600;
        }

        .admin-vtl__create-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 11px;
          border: none;
          background: linear-gradient(135deg, #17A2B8, #20C9E0);
          color: #FFFFFF;
          font-family: 'Cairo', sans-serif;
          font-size: clamp(0.75rem, 2.6vw, 0.82rem);
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(23,162,184,0.35);
          white-space: nowrap;
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .admin-vtl__header-left {
            gap: 10px;
          }
          .admin-vtl__icon {
            width: 38px;
            height: 38px;
          }
          .admin-vtl__icon svg {
            width: 14px;
            height: 14px;
          }
        }

        @media (max-width: 380px) {
          .admin-vtl__header {
            flex-direction: column;
            align-items: stretch;
          }
          .admin-vtl__create-btn {
            justify-content: center;
          }
        }

        /* ============ Loading ============ */
        .admin-vtl__loading {
          padding: 2.5rem 1rem;
          text-align: center;
        }

        .admin-vtl__spinner {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid rgba(23,162,184,0.2);
          borderTopColor: #17A2B8;
          margin: 0 auto;
        }

        .admin-vtl__spinner--sm {
          width: 28px;
          height: 28px;
          border-width: 2.5px;
        }

        .admin-vtl__loading-text {
          margin-top: 1rem;
          color: var(--text-muted);
          font-size: 0.82rem;
        }

        /* ============ Empty ============ */
        .admin-vtl__empty {
          padding: clamp(1.75rem, 6vw, 2.5rem) clamp(1rem, 4vw, 1.5rem);
          text-align: center;
          background-color: var(--bg-input);
          border-radius: 16px;
          border: 1px dashed var(--border-color);
        }

        .admin-vtl__empty-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          background-color: rgba(23,162,184,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #17A2B8;
        }

        .admin-vtl__empty-title {
          color: var(--text-secondary);
          font-size: clamp(0.88rem, 3vw, 0.95rem);
          font-weight: 800;
          margin: 0 0 6px;
        }

        .admin-vtl__empty-desc {
          color: var(--text-muted);
          font-size: clamp(0.72rem, 2.5vw, 0.78rem);
          margin: 0;
          line-height: 1.6;
        }

        /* ============ Grid ============ */
        .admin-vtl__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }

        @media (max-width: 480px) {
          .admin-vtl__grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }

        /* ============ Backdrop ============ */
        .admin-vtl__backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0,0,0,0.65);
          backdrop-filter: blur(4px);
          z-index: 1090;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          direction: rtl;
        }

        @media (max-width: 480px) {
          .admin-vtl__backdrop {
            padding: 10px;
            align-items: flex-start;
            padding-top: 24px;
          }
        }

        /* ============ Modal ============ */
        .admin-vtl__modal {
          position: relative;
          width: 100%;
          max-width: 480px;
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

        .admin-vtl__modal--wide {
          max-width: 640px;
        }

        @media (max-width: 480px) {
          .admin-vtl__modal {
            border-radius: 16px;
            max-height: 88vh;
          }
        }

        .admin-vtl__modal-close {
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

        .admin-vtl__modal-body {
          padding: 1.75rem 1.5rem 1.25rem;
          overflow-y: auto;
          flex: 1;
          text-align: center;
        }

        @media (max-width: 380px) {
          .admin-vtl__modal-body {
            padding: 1.5rem 1.1rem 1rem;
          }
        }

        .admin-vtl__modal-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          margin: 0 auto 12px;
        }

        .admin-vtl__modal-title {
          color: var(--text-secondary);
          font-size: clamp(1rem, 3.2vw, 1.1rem);
          font-weight: 900;
          margin: 0 0 6px;
        }

        .admin-vtl__modal-title--sm {
          font-size: clamp(0.9rem, 2.8vw, 1rem);
        }

        .admin-vtl__modal-text {
          color: var(--text-muted);
          font-size: clamp(0.75rem, 2.6vw, 0.82rem);
          margin: 0 0 1.1rem;
          line-height: 1.65;
        }

        .admin-vtl__modal-label {
          display: block;
          text-align: right;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .admin-vtl__textarea {
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
        }

        .admin-vtl__modal-footer {
          padding: 1rem 1.5rem 1.25rem;
          display: flex;
          gap: 10px;
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-input);
        }

        @media (max-width: 380px) {
          .admin-vtl__modal-footer {
            padding: 0.9rem 1.1rem 1rem;
            flex-direction: column-reverse;
          }
        }

        .admin-vtl__btn {
          flex: 1;
          padding: 11px 16px;
          border-radius: 11px;
          font-family: 'Cairo', sans-serif;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .admin-vtl__btn--ghost {
          border: 1.5px solid var(--border-color);
          background-color: var(--bg-card);
          color: var(--text-secondary);
          font-weight: 700;
        }

        .admin-vtl__btn--ghost:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .admin-vtl__btn--danger {
          background: linear-gradient(135deg, #DC3545, #B02A37);
          color: #FFFFFF;
          box-shadow: 0 4px 16px rgba(220,53,69,0.4);
        }

        .admin-vtl__btn--danger:disabled {
          background: var(--btn-disabled-bg);
          color: var(--btn-disabled-text);
          box-shadow: none;
          cursor: not-allowed;
          opacity: 0.6;
        }

        /* ============ Modal Header (Log) ============ */
        .admin-vtl__modal-header {
          padding: 1.25rem 1.5rem 1rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        @media (max-width: 380px) {
          .admin-vtl__modal-header {
            padding: 1rem 1.1rem 0.9rem;
            gap: 10px;
          }
        }

        .admin-vtl__modal-header-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #17A2B8, #20C9E0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          flex-shrink: 0;
        }

        .admin-vtl__modal-header-text {
          min-width: 0;
          flex: 1;
          text-align: right;
        }

        .admin-vtl__modal-header-purpose {
          color: var(--text-muted);
          font-size: 0.72rem;
          margin: 3px 0 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-vtl__modal-content {
          padding: 1rem 1.5rem 1.25rem;
          overflow-y: auto;
          flex: 1;
        }

        @media (max-width: 380px) {
          .admin-vtl__modal-content {
            padding: 0.9rem 1.1rem 1rem;
          }
        }

        /* ============ Log Entry ============ */
        .admin-vtl__log-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .admin-vtl__log-loading {
          text-align: center;
          padding: 2rem 0;
        }

        .admin-vtl__log-empty {
          text-align: center;
          padding: 2rem 1rem;
          color: var(--text-muted);
        }

        .admin-vtl__log-empty-text {
          font-size: 0.85rem;
          font-weight: 700;
          margin-top: 10px;
          color: var(--text-secondary);
        }

        .admin-vtl__log-empty-hint {
          font-size: 0.72rem;
          margin: 6px 0 0;
          line-height: 1.55;
        }
      `}</style>
    </div>
  );
};

// ============================================
// LogEntry — rendered separately for clarity
// ✅ Supports BOTH user and admin entries via actor_type
// ============================================
const LogEntry = ({ entry }: { entry: NormalizedLogEntry }) => {
  const isAdmin = entry.actor_type === 'admin';
  const isSuccess = entry.status === 'success';

  const accentColor = isAdmin ? '#6F42C1' : '#17A2B8';
  const ActorIcon = isAdmin ? FaUserShield : FaUser;
  const actorLabel = isAdmin ? 'مشرف' : 'مستخدم';

  return (
    <div
      style={{
        padding: '12px 14px',
        borderRadius: '11px',
        backgroundColor: 'var(--bg-input)',
        border: `1px solid ${
          isSuccess ? accentColor + '25' : 'rgba(220,53,69,0.25)'
        }`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 6,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          {/* Actor badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: `${accentColor}15`,
              color: accentColor,
              fontSize: '0.65rem',
              fontWeight: 800,
              border: `1px solid ${accentColor}30`,
            }}
          >
            <ActorIcon size={9} />
            {actorLabel}
          </span>

          {/* Status badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: isSuccess
                ? 'rgba(40,167,69,0.1)'
                : 'rgba(220,53,69,0.1)',
              color: isSuccess ? '#28A745' : '#DC3545',
              fontSize: '0.62rem',
              fontWeight: 700,
            }}
          >
            {isSuccess ? (
              <FaCheckCircle size={8} />
            ) : (
              <FaTimesCircle size={8} />
            )}
            {isSuccess ? 'ناجح' : 'مرفوض'}
          </span>
        </div>

        {/* Timestamp */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            color: 'var(--text-muted)',
            fontSize: '0.68rem',
            fontFamily: 'system-ui, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          <FaClock size={9} />
          {entry.accessed_at ? formatTokenExpiry(entry.accessed_at) : '—'}
        </span>
      </div>

      {/* Reason */}
      {entry.reason && (
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.72rem',
            lineHeight: 1.55,
            marginBottom: 6,
          }}
        >
          {entry.reason}
        </div>
      )}

      {/* Metadata row */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          fontSize: '0.66rem',
          color: 'var(--text-muted)',
          fontFamily: 'system-ui, sans-serif',
          direction: 'ltr',
          justifyContent: 'flex-end',
        }}
      >
        {entry.admin && (
          <span style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
            بواسطة: <strong>{entry.admin.name}</strong>
          </span>
        )}
        {entry.ip_address && <span>IP: {entry.ip_address}</span>}
      </div>
    </div>
  );
};

export default AdminVideoTokensList;