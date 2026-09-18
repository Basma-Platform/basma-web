import { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaUserCheck,
  FaClock,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useAdminVerifications } from '../../../hooks/useAdminVerifications';
import {
  AdminVerificationDetailCard,
  AdminVerificationImageModal,
  AdminApproveModal,
  AdminRejectModal,
  AdminVerificationSkeleton,
} from '../../../components/admin/verification';

const AdminVerificationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    detail,
    detailLoading,
    actionLoading,
    fetchDetail,
    approveRequest,
    rejectRequest,
  } = useAdminVerifications();

  const [showImage, setShowImage] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Track whether the fetch has been attempted for THIS id.
  const [hasAttempted, setHasAttempted] = useState(false);

  // ============================================
  // Fetch Detail
  // ============================================
  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const load = async () => {
      try {
        setError(null);
        setHasAttempted(false);
        await fetchDetail(Number(id));
      } catch {
        if (!cancelled) {
          setError('تعذر تحميل تفاصيل الطلب');
        }
      } finally {
        if (!cancelled) {
          setHasAttempted(true);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id, fetchDetail]);

  // ============================================
  // Approve Handler
  // ============================================
  const handleApprove = async (notes?: string) => {
    if (!detail) return;
    try {
      await approveRequest(detail.id, { admin_notes: notes });
      setShowApprove(false);
      await fetchDetail(detail.id);
    } catch {
      // Error handled in hook
    }
  };

  // ============================================
  // Reject Handler
  // ============================================
  const handleReject = async (reason: string) => {
    if (!detail) return;
    try {
      await rejectRequest(detail.id, { admin_notes: reason });
      setShowReject(false);
      await fetchDetail(detail.id);
    } catch {
      // Error handled in hook
    }
  };

  // ============================================
  // ✅ RENDER GUARDS — ORDER MATTERS
  // ============================================

  if (detailLoading || !hasAttempted) {
    return (
      <>
        <SEO title="تفاصيل طلب التحقق" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '1rem',
            paddingBottom: '3rem',
          }}
        >
          <Container fluid="xl" className="px-3 px-md-4">
            <AdminVerificationSkeleton variant="detail" />
          </Container>
        </div>
      </>
    );
  }

  if (error || !detail) {
    return (
      <>
        <SEO title="تفاصيل طلب التحقق" />
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
              {error || 'الطلب غير موجود'}
            </h3>
            <Link
              to="/admin/verification"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '1rem',
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-orange)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              <FaChevronLeft size={11} />
              العودة للقائمة
            </Link>
          </div>
        </div>
      </>
    );
  }

  const isPending = detail.status === 'pending';
  const isApproved = detail.status === 'approved';
  const isRejected = detail.status === 'rejected';

  return (
    <>
      <SEO
        title={`طلب تحقق #${detail.id}`}
        description={`مراجعة طلب توثيق الهوية لـ ${detail.user.name}`}
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
            style={{ marginBottom: '1.5rem' }}
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
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                لوحة الإدارة
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <Link
                to="/admin/verification"
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                طلبات التحقق
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <span style={{ opacity: 0.7 }}>طلب #{detail.id}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(23,162,184,0.3)',
                }}
              >
                <FaShieldAlt size={22} color="#FFFFFF" />
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
                  تفاصيل طلب التحقق
                </h1>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                  }}
                >
                  مراجعة صورة الهوية واتخاذ القرار
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <Row className="g-4">
            <Col xs={12} lg={8}>
              <AdminVerificationDetailCard
                request={detail}
                onViewImage={() => setShowImage(true)}
              />
            </Col>

            <Col xs={12} lg={4}>
              <div style={{ position: 'sticky', top: '90px' }}>
                {/* Action Card */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 20px var(--shadow-sm)',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  <h4
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '1rem',
                      fontWeight: 800,
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FaUserCheck size={14} color="var(--primary-orange)" />
                    اتخاذ القرار
                  </h4>

                  {/* Enhanced Status Banner (Optimized for Dark & Light modes) */}
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      marginBottom: '1.2rem',
                      backgroundColor: isApproved
                        ? 'rgba(40,167,69,0.12)'
                        : isRejected
                        ? 'rgba(220,53,69,0.12)'
                        : 'rgba(255,152,0,0.15)',
                      border: `1px solid ${
                        isApproved
                          ? 'rgba(40,167,69,0.3)'
                          : isRejected
                          ? 'rgba(220,53,69,0.3)'
                          : 'rgba(255,152,0,0.35)'
                      }`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: isApproved
                        ? '#28A745'
                        : isRejected
                        ? '#DC3545'
                        : '#FF9800',
                    }}
                  >
                    {isApproved && <FaCheckCircle size={16} />}
                    {isRejected && <FaTimesCircle size={16} />}
                    {isPending && <FaClock size={16} />}
                    <span>
                      {isApproved
                        ? 'تمت الموافقة على الطلب'
                        : isRejected
                        ? 'تم رفض الطلب'
                        : 'الطلب قيد المراجعة'}
                    </span>
                  </div>

                  {/* Enhanced Actions Grid (only if pending) */}
                  {isPending ? (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '12px',
                      }}
                    >
                      <motion.button
                        type="button"
                        onClick={() => setShowApprove(true)}
                        disabled={actionLoading}
                        whileHover={!actionLoading ? { scale: 1.015, y: -1 } : {}}
                        whileTap={!actionLoading ? { scale: 0.98 } : {}}
                        style={{
                          width: '100%',
                          height: '48px',
                          borderRadius: '12px',
                          border: 'none',
                          background:
                            'linear-gradient(135deg, #28A745, #1e7e34)',
                          color: '#FFFFFF',
                          fontFamily: 'Cairo, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          cursor: actionLoading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          boxShadow: '0 4px 15px rgba(40,167,69,0.25)',
                          opacity: actionLoading ? 0.6 : 1,
                          transition: 'box-shadow 0.2s ease',
                        }}
                      >
                        <FaCheckCircle size={16} />
                        الموافقة على الطلب
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() => setShowReject(true)}
                        disabled={actionLoading}
                        whileHover={!actionLoading ? { scale: 1.015, y: -1 } : {}}
                        whileTap={!actionLoading ? { scale: 0.98 } : {}}
                        style={{
                          width: '100%',
                          height: '48px',
                          borderRadius: '12px',
                          border: '1.5px solid rgba(220,53,69,0.35)',
                          backgroundColor: 'rgba(220,53,69,0.06)',
                          color: '#DC3545',
                          fontFamily: 'Cairo, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          cursor: actionLoading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          opacity: actionLoading ? 0.6 : 1,
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <FaTimesCircle size={16} />
                        رفض الطلب
                      </motion.button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => navigate('/admin/verification')}
                      style={{
                        width: '100%',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: 'transparent',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-secondary)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                      }}
                    >
                      العودة للقائمة
                    </Button>
                  )}
                </div>

                {/* Enhanced Instruction Box Split into 2 Points */}
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '16px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    fontFamily: 'Cairo, sans-serif',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {/* Point 1 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(40,167,69,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <FaCheckCircle size={12} color="#28A745" />
                    </div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        lineHeight: '1.6',
                        textAlign: 'justify',
                        flex: 1,
                      }}
                    >
                      تأكد من وضوح صورة الهوية قبل الموافقة.
                    </div>
                  </div>

                  {/* Point 2 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(220,53,69,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <FaTimesCircle size={12} color="#DC3545" />
                    </div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        lineHeight: '1.6',
                        textAlign: 'justify',
                        flex: 1,
                      }}
                    >
                      عند الرفض، يجب كتابة سبب واضح لمساعدة المستخدم على إعادة الرفع بشكل صحيح.
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modals */}
      {detail.id_image_url && (
        <AdminVerificationImageModal
          isOpen={showImage}
          imageUrl={detail.id_image_url}
          title={`صورة هوية - ${detail.user.name}`}
          onClose={() => setShowImage(false)}
        />
      )}

      <AdminApproveModal
        isOpen={showApprove}
        userName={detail.user.name}
        onConfirm={handleApprove}
        onCancel={() => setShowApprove(false)}
        isLoading={actionLoading}
      />

      <AdminRejectModal
        isOpen={showReject}
        userName={detail.user.name}
        onConfirm={handleReject}
        onCancel={() => setShowReject(false)}
        isLoading={actionLoading}
      />
    </>
  );
};

export default AdminVerificationDetailPage;