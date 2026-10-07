import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronLeft,
  FaInbox,
  FaExclamationTriangle,
  FaArrowRight,
  FaSyncAlt,
  FaStickyNote,
  FaTimes,
  FaInfoCircle,
} from 'react-icons/fa';
import SEO from '../../../../components/SEO';
import { useAdminDonationInquiries } from '../../../../hooks/useAdminDonationInquiries';
import {
  AdminInquiryDetailContent,
  AdminInquiryStatusModal,
} from '../../../../components/admin/basma-fund/inquiries';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';
import type { DonationInquiryStatus } from '../../../../types';

const AdminInquiryDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    detail,
    detailLoading,
    actionLoading,
    fetchDetail,
    resetDetail,
    updateStatus,
    addNote,
  } = useAdminDonationInquiries();

  const [hasAttempted, setHasAttempted] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteError, setNoteError] = useState<string | null>(null);

  // Fetch detail
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setHasAttempted(false);
    const load = async () => {
      try {
        await fetchDetail(Number(id));
      } catch {
        // handled in hook
      } finally {
        if (!cancelled) setHasAttempted(true);
      }
    };

    load();

    return () => {
      cancelled = true;
      resetDetail();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ============================================
  // Handlers
  // ============================================
  const handleStatusUpdate = async (
    status: DonationInquiryStatus,
    notes?: string
  ) => {
    if (!detail) return;
    try {
      await updateStatus(detail.id, { status, admin_notes: notes });
      setShowStatus(false);
    } catch {
      // handled in hook
    }
  };

  const handleAddNote = async () => {
    if (!detail) return;
    const trimmed = noteText.trim();
    if (trimmed.length < 3) {
      setNoteError('الملاحظة يجب أن تكون 3 أحرف على الأقل');
      return;
    }
    try {
      await addNote(detail.id, trimmed);
      setShowNote(false);
      setNoteText('');
      setNoteError(null);
    } catch {
      // handled in hook
    }
  };

  // ============================================
  // Loading
  // ============================================
  if (detailLoading || !hasAttempted) {
    return (
      <>
        <SEO title="تفاصيل الاستفسار | لوحة الإدارة" />
        <div className="admin-inq-detail-page">
          <Container fluid="xl" className="admin-inq-detail-page__container">
            <div className="admin-inq-detail-page__wrapper">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="admin-inq-detail-page__skeleton"
                  style={{ height: i === 0 ? '90px' : '150px' }}
                />
              ))}
            </div>
          </Container>
        </div>
      </>
    );
  }

  // ============================================
  // Not found
  // ============================================
  if (!detail) {
    return (
      <>
        <SEO title="تفاصيل الاستفسار | لوحة الإدارة" />
        <div className="admin-inq-detail-page admin-inq-detail-page--centered">
          <div className="admin-inq-detail-page__notfound">
            <FaExclamationTriangle size={42} color="#DC3545" opacity={0.6} />
            <h3 className="admin-inq-detail-page__notfound-title">
              الاستفسار غير موجود
            </h3>
            <p className="admin-inq-detail-page__notfound-text">
              لا يمكن عرض تفاصيل هذا الاستفسار.
            </p>
            <Link
              to="/admin/donation-inquiries"
              className="admin-inq-detail-page__back-btn"
            >
              <FaArrowRight size={11} />
              العودة للقائمة
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <SEO
        title={`تفاصيل الاستفسار ${detail.tracking_code} | لوحة الإدارة`}
        description="مراجعة استفسار التبرع"
      />

      <div className="admin-inq-detail-page" dir="rtl">
        <Container fluid="xl" className="admin-inq-detail-page__container">
          {/* Breadcrumb + Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="admin-inq-detail-page__header"
          >
            <div className="admin-inq-detail-page__breadcrumb">
              <Link to="/admin/dashboard" className="admin-inq-detail-page__crumb">
                لوحة الإدارة
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <Link
                to="/admin/donation-inquiries"
                className="admin-inq-detail-page__crumb"
              >
                طلبات التبرعات
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <span style={{ opacity: 0.7 }}>استفسار #{detail.id}</span>
            </div>

            <div className="admin-inq-detail-page__title-block">
              <div className="admin-inq-detail-page__title-icon">
                <FaInbox size={20} color="#FFFFFF" />
              </div>
              <div className="admin-inq-detail-page__title-text">
                <h1 className="admin-inq-detail-page__title">
                  تفاصيل الاستفسار
                </h1>
                <p className="admin-inq-detail-page__subtitle">
                  مراجعة الاستفسار وتحديث حالته
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="admin-inq-detail-page__content">
            <AdminInquiryDetailContent detail={detail} />
          </div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="admin-inq-detail-page__actions"
          >
            <motion.button
              type="button"
              whileHover={!actionLoading ? { scale: 1.02, y: -1 } : {}}
              whileTap={!actionLoading ? { scale: 0.97 } : {}}
              onClick={() => setShowStatus(true)}
              disabled={actionLoading}
              className="admin-inq-detail-page__action-btn admin-inq-detail-page__action-btn--primary"
            >
              <FaSyncAlt size={12} />
              تحديث الحالة
            </motion.button>

            <motion.button
              type="button"
              whileHover={!actionLoading ? { scale: 1.02, y: -1 } : {}}
              whileTap={!actionLoading ? { scale: 0.97 } : {}}
              onClick={() => {
                setNoteText(detail.admin_notes || '');
                setShowNote(true);
              }}
              disabled={actionLoading}
              className="admin-inq-detail-page__action-btn admin-inq-detail-page__action-btn--secondary"
            >
              <FaStickyNote size={11} />
              {detail.admin_notes ? 'تعديل الملاحظات' : 'إضافة ملاحظات'}
            </motion.button>
          </motion.div>
        </Container>
      </div>

      {/* Status modal */}
      <AdminInquiryStatusModal
        isOpen={showStatus}
        currentStatus={detail.status}
        trackingCode={detail.tracking_code}
        onConfirm={handleStatusUpdate}
        onCancel={() => setShowStatus(false)}
        isLoading={actionLoading}
      />

      {/* Note modal */}
      <AnimatePresence>
        {showNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !actionLoading && setShowNote(false)}
            className="admin-inq-detail-page__backdrop"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.94 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="admin-inq-detail-page__note-modal"
            >
              <button
                type="button"
                onClick={() => !actionLoading && setShowNote(false)}
                disabled={actionLoading}
                className="admin-inq-detail-page__modal-close"
                aria-label="إغلاق"
              >
                <FaTimes size={12} />
              </button>

              <div className="admin-inq-detail-page__modal-body">
                <div className="admin-inq-detail-page__modal-icon">
                  <FaStickyNote size={16} />
                </div>

                <h3 className="admin-inq-detail-page__modal-title">
                  ملاحظات داخلية
                </h3>

                <textarea
                  value={noteText}
                  onChange={(e) => {
                    setNoteText(e.target.value.slice(0, 2000));
                    if (noteError) setNoteError(null);
                  }}
                  disabled={actionLoading}
                  rows={5}
                  maxLength={2000}
                  placeholder="اكتب ملاحظة داخلية حول الاستفسار..."
                  className="admin-inq-detail-page__note-textarea"
                  style={{
                    borderColor: noteError ? 'var(--error)' : 'var(--border-color)',
                  }}
                />

                {noteError && (
                  <div className="admin-inq-detail-page__note-error">
                    <FaInfoCircle size={10} />
                    {noteError}
                  </div>
                )}
              </div>

              <div className="admin-inq-detail-page__modal-footer">
                <button
                  type="button"
                  onClick={() => setShowNote(false)}
                  disabled={actionLoading}
                  className="admin-inq-detail-page__modal-btn admin-inq-detail-page__modal-btn--ghost"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={actionLoading}
                  className="admin-inq-detail-page__modal-btn admin-inq-detail-page__modal-btn--primary"
                >
                  {actionLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13 }} />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <FaStickyNote size={12} />
                      حفظ
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .admin-inq-detail-page {
          background-color: var(--bg-body);
          min-height: 100vh;
          padding-top: 1rem;
          padding-bottom: 3rem;
          width: 100%;
          box-sizing: border-box;
        }

        .admin-inq-detail-page--centered {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        .admin-inq-detail-page__container {
          padding-left: 12px !important;
          padding-right: 12px !important;
          box-sizing: border-box;
        }

        @media (min-width: 576px) {
          .admin-inq-detail-page__container {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }

        .admin-inq-detail-page__wrapper {
          max-width: 800px;
          margin: 0 auto;
        }

        .admin-inq-detail-page__header {
          max-width: 800px;
          margin: 0 auto 1.25rem;
        }

        .admin-inq-detail-page__breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: clamp(0.72rem, 2.5vw, 0.85rem);
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          font-family: 'Cairo', sans-serif;
          flex-wrap: wrap;
        }

        .admin-inq-detail-page__crumb {
          color: ${FUND_THEME.accent};
          text-decoration: none;
          font-weight: 600;
        }

        .admin-inq-detail-page__title-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-inq-detail-page__title-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: ${FUND_THEME.gradient};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px ${FUND_THEME.shadow};
          flex-shrink: 0;
        }

        .admin-inq-detail-page__title-text {
          min-width: 0;
          flex: 1;
        }

        .admin-inq-detail-page__title {
          color: var(--text-secondary);
          font-size: clamp(1.15rem, 4vw, 1.6rem);
          font-weight: 900;
          font-family: 'Cairo', sans-serif;
          margin: 0;
          line-height: 1.25;
        }

        .admin-inq-detail-page__subtitle {
          color: var(--text-muted);
          font-size: clamp(0.72rem, 2.5vw, 0.85rem);
          font-family: 'Cairo', sans-serif;
          margin: 3px 0 0;
        }

        .admin-inq-detail-page__content {
          max-width: 800px;
          margin: 0 auto;
        }

        .admin-inq-detail-page__actions {
          max-width: 800px;
          margin: 1.25rem auto 0;
          padding: 1rem 1.1rem;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          font-family: 'Cairo', sans-serif;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 480px) {
          .admin-inq-detail-page__actions {
            padding: 0.85rem;
            gap: 8px;
          }
        }

        .admin-inq-detail-page__action-btn {
          flex: 1 1 160px;
          min-width: 0;
          padding: 12px 16px;
          border-radius: 11px;
          font-family: 'Cairo', sans-serif;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: all 0.2s ease;
          border: none;
        }

        .admin-inq-detail-page__action-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .admin-inq-detail-page__action-btn--primary {
          background: ${FUND_THEME.gradient};
          color: #FFFFFF;
          box-shadow: 0 4px 16px ${FUND_THEME.shadow};
        }

        .admin-inq-detail-page__action-btn--secondary {
          border: 1.5px solid var(--border-color);
          background-color: transparent;
          color: var(--text-secondary);
          font-weight: 700;
        }

        @media (max-width: 380px) {
          .admin-inq-detail-page__actions {
            flex-direction: column;
          }
          .admin-inq-detail-page__action-btn {
            flex: 1 1 auto;
            width: 100%;
          }
        }

        /* ── Skeletons ── */
        .admin-inq-detail-page__skeleton {
          border-radius: 14px;
          margin-bottom: 1rem;
          background-color: var(--border-color);
          animation: adminInqDetailPulse 1.5s ease-in-out infinite;
        }

        @keyframes adminInqDetailPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }

        /* ── Not found ── */
        .admin-inq-detail-page__notfound {
          max-width: 460px;
          padding: 2.5rem 1.5rem;
          text-align: center;
          background-color: var(--bg-card);
          border-radius: 20px;
          border: 1px solid var(--border-color);
          font-family: 'Cairo', sans-serif;
        }

        .admin-inq-detail-page__notfound-title {
          color: var(--text-secondary);
          font-size: clamp(1rem, 3.5vw, 1.1rem);
          font-weight: 800;
          margin: 1rem 0 8px;
        }

        .admin-inq-detail-page__notfound-text {
          color: var(--text-muted);
          font-size: clamp(0.78rem, 2.8vw, 0.85rem);
          margin: 0 0 1.25rem;
        }

        .admin-inq-detail-page__back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 10px;
          background: ${FUND_THEME.gradient};
          color: #FFFFFF;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 700;
          box-shadow: 0 4px 14px ${FUND_THEME.shadow};
        }

        /* ── Note modal ── */
        .admin-inq-detail-page__backdrop {
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
          .admin-inq-detail-page__backdrop {
            padding: 10px;
            align-items: flex-start;
            padding-top: 24px;
          }
        }

        .admin-inq-detail-page__note-modal {
          position: relative;
          width: 100%;
          max-width: 520px;
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
          .admin-inq-detail-page__note-modal {
            border-radius: 16px;
            max-height: 88vh;
          }
        }

        .admin-inq-detail-page__modal-close {
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

        .admin-inq-detail-page__modal-body {
          padding: 1.5rem 1.5rem 1.25rem;
          overflow-y: auto;
          flex: 1;
        }

        @media (max-width: 380px) {
          .admin-inq-detail-page__modal-body {
            padding: 1.25rem 1.1rem 1rem;
          }
        }

        .admin-inq-detail-page__modal-icon {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background: ${FUND_THEME.gradient};
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          margin: 0 auto 0.85rem;
          box-shadow: 0 6px 18px ${FUND_THEME.shadow};
        }

        .admin-inq-detail-page__modal-title {
          text-align: center;
          color: var(--text-secondary);
          font-size: clamp(0.95rem, 3vw, 1.05rem);
          font-weight: 900;
          margin: 0 0 1rem;
        }

        .admin-inq-detail-page__note-textarea {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-input);
          color: var(--text-primary);
          font-family: 'Cairo', sans-serif;
          font-size: 0.85rem;
          outline: none;
          resize: none;
          box-sizing: border-box;
          line-height: 1.6;
        }

        .admin-inq-detail-page__note-error {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 6px;
          color: var(--error);
          font-size: 0.72rem;
        }

        .admin-inq-detail-page__modal-footer {
          padding: 1rem 1.5rem 1.25rem;
          display: flex;
          gap: 10px;
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-input);
        }

        @media (max-width: 380px) {
          .admin-inq-detail-page__modal-footer {
            padding: 0.9rem 1.1rem 1rem;
            flex-direction: column-reverse;
          }
        }

        .admin-inq-detail-page__modal-btn {
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

        .admin-inq-detail-page__modal-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .admin-inq-detail-page__modal-btn--ghost {
          border: 1.5px solid var(--border-color);
          background-color: var(--bg-card);
          color: var(--text-secondary);
          font-weight: 700;
        }

        .admin-inq-detail-page__modal-btn--primary {
          background: ${FUND_THEME.gradient};
          color: #FFFFFF;
          box-shadow: 0 4px 16px ${FUND_THEME.shadow};
        }
      `}</style>
    </>
  );
};

export default AdminInquiryDetailPage;