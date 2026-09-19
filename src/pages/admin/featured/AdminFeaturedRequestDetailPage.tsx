import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaStar,
  FaExclamationTriangle,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useAdminFeaturedRequests } from '../../../hooks/useAdminFeaturedRequests';
import {
  AdminFeaturedDetailContent,
  AdminApproveFeaturedModal,
  AdminRejectFeaturedModal,
  AdminDeleteFeaturedModal,
} from '../../../components/admin/featured';

const AdminFeaturedRequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    detail,
    detailLoading,
    actionLoading,
    fetchDetail,
    approveRequest,
    rejectRequest,
    deleteRequest,
  } = useAdminFeaturedRequests();

  // ✅ Track whether the fetch for the current id has finished
  const [hasAttempted, setHasAttempted] = useState(false);

  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const load = async () => {
      setHasAttempted(false);
      try {
        await fetchDetail(Number(id));
      } catch {
        // handled inside hook
      } finally {
        if (!cancelled) setHasAttempted(true);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id, fetchDetail]);

  // ============================================
  // Handlers
  // ============================================
  const handleApprove = async (notes?: string) => {
    if (!detail) return;
    try {
      await approveRequest(detail.id, { admin_notes: notes });
      setShowApprove(false);
    } catch {
      // handled inside hook
    }
  };

  const handleReject = async (reason: string) => {
    if (!detail) return;
    try {
      await rejectRequest(detail.id, { admin_notes: reason });
      setShowReject(false);
    } catch {
      // handled inside hook
    }
  };

  const handleDelete = async (reason?: string) => {
    if (!detail) return;
    try {
      await deleteRequest(detail.id, { reason });
      setShowDelete(false);
      navigate('/admin/featured-requests');
    } catch {
      // handled inside hook
    }
  };

  // ============================================
  // Loading
  // ============================================
  if (detailLoading || !hasAttempted) {
    return (
      <>
        <SEO title="تفاصيل طلب التمييز" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '1rem',
            paddingBottom: '3rem',
          }}
        >
          <Container fluid="xl" className="px-3 px-md-4">
            <div
              style={{
                maxWidth: '720px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <style>{`
                @keyframes adminPageShimmer {
                  0% { opacity: 0.4; }
                  50% { opacity: 0.85; }
                  100% { opacity: 0.4; }
                }
                .admin-featured-page-skel {
                  animation: adminPageShimmer 1.5s ease-in-out infinite;
                  background-color: var(--border-color);
                }
              `}</style>
              <div
                className="admin-featured-page-skel"
                style={{ height: '70px', borderRadius: '14px' }}
              />
              <div
                className="admin-featured-page-skel"
                style={{ height: '120px', borderRadius: '14px' }}
              />
              <div
                className="admin-featured-page-skel"
                style={{ height: '140px', borderRadius: '14px' }}
              />
              <div
                className="admin-featured-page-skel"
                style={{ height: '200px', borderRadius: '14px' }}
              />
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
        <SEO title="تفاصيل طلب التمييز" />
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
              to="/admin/featured-requests"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-orange)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              <FaArrowRight size={11} />
              العودة للطلبات
            </Link>
          </div>
        </div>
      </>
    );
  }

  const isPending = detail.status === 'pending';

  // ============================================
  // Success
  // ============================================
  return (
    <>
      <SEO
        title={`تفاصيل طلب التمييز #${detail.id}`}
        description="مراجعة تفاصيل طلب التمييز"
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
          {/* ============================================
              Breadcrumb + Title
              ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              maxWidth: '720px',
              margin: '0 auto 1.25rem',
            }}
          >
            {/* Breadcrumb */}
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
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                لوحة الإدارة
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <Link
                to="/admin/featured-requests"
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                طلبات التمييز
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <span style={{ opacity: 0.7 }}>طلب #{detail.id}</span>
            </div>

            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #FFC107, #F5A623)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(255,193,7,0.35)',
                  flexShrink: 0,
                }}
              >
                <FaStar size={22} color="#FFFFFF" />
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
                  تفاصيل طلب التمييز
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
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <AdminFeaturedDetailContent detail={detail} />
          </div>

          {/* ============================================
              Action Buttons — only if pending
              ============================================ */}
          {isPending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              style={{
                maxWidth: '720px',
                margin: '1.25rem auto 0',
                padding: '1rem 1.25rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              <motion.button
                type="button"
                whileHover={!actionLoading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!actionLoading ? { scale: 0.97 } : {}}
                onClick={() => setShowApprove(true)}
                disabled={actionLoading}
                style={{
                  flex: '1 1 0',
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

              <motion.button
                type="button"
                whileHover={!actionLoading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!actionLoading ? { scale: 0.97 } : {}}
                onClick={() => setShowReject(true)}
                disabled={actionLoading}
                style={{
                  flex: '1 1 0',
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

              <motion.button
                type="button"
                whileHover={!actionLoading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!actionLoading ? { scale: 0.97 } : {}}
                onClick={() => setShowDelete(true)}
                disabled={actionLoading}
                aria-label="حذف"
                style={{
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
            </motion.div>
          )}

          {/* ============================================
              Delete only — for already-reviewed
              ============================================ */}
          {!isPending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              style={{
                maxWidth: '720px',
                margin: '1.25rem auto 0',
                padding: '1rem 1.25rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              <motion.button
                type="button"
                whileHover={!actionLoading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!actionLoading ? { scale: 0.97 } : {}}
                onClick={() => setShowDelete(true)}
                disabled={actionLoading}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid rgba(220,53,69,0.3)',
                  backgroundColor: 'rgba(220,53,69,0.06)',
                  color: '#DC3545',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: actionLoading ? 0.6 : 1,
                }}
              >
                <FaTrash size={11} />
                حذف الطلب
              </motion.button>
            </motion.div>
          )}
        </Container>
      </div>

      {/* ============================================
          Modals
          ============================================ */}
      <AdminApproveFeaturedModal
        isOpen={showApprove}
        userName={detail.user.name}
        amount={detail.amount}
        currency={detail.currency}
        durationDays={detail.duration_days}
        onConfirm={handleApprove}
        onCancel={() => setShowApprove(false)}
        isLoading={actionLoading}
      />

      <AdminRejectFeaturedModal
        isOpen={showReject}
        userName={detail.user.name}
        onConfirm={handleReject}
        onCancel={() => setShowReject(false)}
        isLoading={actionLoading}
      />

      <AdminDeleteFeaturedModal
        isOpen={showDelete}
        requestId={detail.id}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        isLoading={actionLoading}
      />
    </>
  );
};

export default AdminFeaturedRequestDetailPage;