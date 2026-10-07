import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaHandHoldingHeart,
  FaExclamationTriangle,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaArchive,
} from 'react-icons/fa';
import SEO from '../../../../components/SEO';
import { useAdminHelpRequestDetail } from '../../../../hooks/useAdminHelpRequestDetail';
import {
  AdminHelpRequestDetailContent,
  AdminHelpRequestSkeleton,
} from '../../../../components/admin/basma-fund/help-requests';
import {
  AdminApproveHelpRequestModal,
  AdminRejectHelpRequestModal,
  AdminArchiveHelpRequestModal,
  AdminDeleteHelpRequestModal,
} from '../../../../components/admin/basma-fund/modals';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';

const AdminHelpRequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    detail,
    detailLoading,
    actionLoading,
    fetchDetail,
    reset,
    approve,
    reject,
    archive,
    deleteRequest,
    unlockData,          // 🆕
  } = useAdminHelpRequestDetail();

  // ============================================
  // onUnlock — wraps the hook's unlockData
  // so the SAME hook instance updates `detail`
  // ============================================
  const handleUnlock = async (
    id: number,
    field: 'details' | 'contact' | 'region' | 'all',
    reason: string
  ) => {
    await unlockData(id, field, reason);
  };

  const [hasAttempted, setHasAttempted] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

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
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ============================================
  // Handlers
  // ============================================
  const handleApprove = async (notes?: string) => {
    if (!detail) return;
    try {
      await approve(detail.id, notes);
      setShowApprove(false);
    } catch {
      // handled in hook
    }
  };

  const handleReject = async (reason: string) => {
    if (!detail) return;
    try {
      await reject(detail.id, reason);
      setShowReject(false);
    } catch {
      // handled in hook
    }
  };

  const handleArchive = async (reason: string) => {
    if (!detail) return;
    try {
      await archive(detail.id, reason);
      setShowArchive(false);
    } catch {
      // handled in hook
    }
  };

  const handleDelete = async () => {
    if (!detail) return;
    try {
      await deleteRequest(detail.id);
      setShowDelete(false);
      navigate('/admin/help-requests');
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
        <SEO title="تفاصيل طلب المساعدة | لوحة الإدارة" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '1rem',
            paddingBottom: '3rem',
          }}
        >
          <Container fluid="xl" className="px-3 px-md-4">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <AdminHelpRequestSkeleton variant="detail" />
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
        <SEO title="تفاصيل طلب المساعدة | لوحة الإدارة" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
          }}
        >
          <div
            style={{
              maxWidth: '460px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <FaExclamationTriangle size={42} color="#DC3545" opacity={0.6} />
            <h3
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                fontWeight: 800,
                margin: '1rem 0 8px',
              }}
            >
              الطلب غير موجود
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
              }}
            >
              لا يمكن عرض تفاصيل هذا الطلب.
            </p>
            <Link
              to="/admin/help-requests"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                background: FUND_THEME.gradient,
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                boxShadow: `0 4px 14px ${FUND_THEME.shadow}`,
              }}
            >
              <FaArrowRight size={11} />
              العودة للقائمة
            </Link>
          </div>
        </div>
      </>
    );
  }

  const isPending = detail.status === 'pending';
  const isApproved = detail.status === 'approved';
  const isArchived = detail.status === 'archived';

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <SEO
        title={`تفاصيل الطلب #${detail.id} | لوحة الإدارة`}
        description={`مراجعة طلب المساعدة: ${detail.public_title}`}
      />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '1rem',
          paddingBottom: '3rem',
        }}
        dir="rtl"
      >
        <Container fluid="xl" className="px-3 px-md-4">
          {/* Breadcrumb + Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              maxWidth: '800px',
              margin: '0 auto 1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem',
                fontFamily: 'Cairo, sans-serif',
                flexWrap: 'wrap',
              }}
            >
              <Link
                to="/admin/dashboard"
                style={{
                  color: FUND_THEME.accent,
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                لوحة الإدارة
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <Link
                to="/admin/help-requests"
                style={{
                  color: FUND_THEME.accent,
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                طلبات المساعدة
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <span style={{ opacity: 0.7 }}>طلب #{detail.id}</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: FUND_THEME.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 16px ${FUND_THEME.shadow}`,
                  flexShrink: 0,
                }}
              >
                <FaHandHoldingHeart size={22} color="#FFFFFF" />
              </div>
              <div>
                <h1
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.4rem, 2vw, 1.7rem)',
                    fontWeight: 900,
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  تفاصيل طلب المساعدة
                </h1>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                  }}
                >
                  مراجعة الطلب واتخاذ القرار
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <AdminHelpRequestDetailContent
	      detail={detail}
              onUnlock={handleUnlock}
              isUnlocking={actionLoading}
            />
          </div>

          {/* ============================================ */}
          {/* Action buttons */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            style={{
              maxWidth: '800px',
              margin: '1.25rem auto 0',
              padding: '1rem 1.25rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              fontFamily: 'Cairo, sans-serif',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isPending && (
              <motion.button
                type="button"
                whileHover={!actionLoading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!actionLoading ? { scale: 0.97 } : {}}
                onClick={() => setShowApprove(true)}
                disabled={actionLoading}
                style={{
                  flex: '1 1 140px',
                  minWidth: '140px',
                  padding: '12px 16px',
                  borderRadius: '11px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #28A745, #1e7e34)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow: '0 4px 16px rgba(40,167,69,0.35)',
                  opacity: actionLoading ? 0.6 : 1,
                }}
              >
                <FaCheckCircle size={13} />
                الموافقة
              </motion.button>
            )}

            {isPending && (
              <motion.button
                type="button"
                whileHover={!actionLoading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!actionLoading ? { scale: 0.97 } : {}}
                onClick={() => setShowReject(true)}
                disabled={actionLoading}
                style={{
                  flex: '1 1 140px',
                  minWidth: '140px',
                  padding: '12px 16px',
                  borderRadius: '11px',
                  border: '1.5px solid rgba(220,53,69,0.35)',
                  backgroundColor: 'rgba(220,53,69,0.06)',
                  color: '#DC3545',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  opacity: actionLoading ? 0.6 : 1,
                }}
              >
                <FaTimesCircle size={13} />
                رفض
              </motion.button>
            )}

            {isApproved && (
              <motion.button
                type="button"
                whileHover={!actionLoading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!actionLoading ? { scale: 0.97 } : {}}
                onClick={() => setShowArchive(true)}
                disabled={actionLoading}
                style={{
                  flex: '1 1 140px',
                  minWidth: '140px',
                  padding: '12px 16px',
                  borderRadius: '11px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6B4226, #8B5A2B)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow: '0 4px 16px rgba(107,66,38,0.35)',
                  opacity: actionLoading ? 0.6 : 1,
                }}
              >
                <FaArchive size={12} />
                أرشفة
              </motion.button>
            )}

            <motion.button
              type="button"
              whileHover={!actionLoading ? { scale: 1.02, y: -1 } : {}}
              whileTap={!actionLoading ? { scale: 0.97 } : {}}
              onClick={() => setShowDelete(true)}
              disabled={actionLoading}
              style={{
                flex: '0 1 auto',
                minWidth: '120px',
                padding: '12px 16px',
                borderRadius: '11px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                opacity: actionLoading ? 0.6 : 1,
              }}
            >
              <FaTrash size={11} />
              حذف
            </motion.button>

            {isArchived && (
              <div
                style={{
                  flex: '1 1 100%',
                  textAlign: 'center',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(107,66,38,0.06)',
                  color: '#6B4226',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                هذا الطلب مؤرشف بالفعل
              </div>
            )}
          </motion.div>
        </Container>
      </div>

      {/* ============================================ */}
      {/* Modals */}
      {/* ============================================ */}
      <AdminApproveHelpRequestModal
        isOpen={showApprove}
        requestTitle={detail.public_title}
        onConfirm={handleApprove}
        onCancel={() => setShowApprove(false)}
        isLoading={actionLoading}
      />

      <AdminRejectHelpRequestModal
        isOpen={showReject}
        requestTitle={detail.public_title}
        onConfirm={handleReject}
        onCancel={() => setShowReject(false)}
        isLoading={actionLoading}
      />

      <AdminArchiveHelpRequestModal
        isOpen={showArchive}
        requestTitle={detail.public_title}
        onConfirm={handleArchive}
        onCancel={() => setShowArchive(false)}
        isLoading={actionLoading}
      />

      <AdminDeleteHelpRequestModal
        isOpen={showDelete}
        requestId={detail.id}
        requestTitle={detail.public_title}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        isLoading={actionLoading}
      />
    </>
  );
};

export default AdminHelpRequestDetailPage;