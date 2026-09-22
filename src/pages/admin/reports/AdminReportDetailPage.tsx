import { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaFlag,
  FaExclamationTriangle,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaTrash,
  FaClock,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { useAdminReports } from '../../../hooks/useAdminReports';
import {
  AdminReportDetailContent,
  AdminProcessReportModal,
  AdminReportsSkeleton,
} from '../../../components/admin/reports';
import type { ReportAction } from '../../../types';

const AdminReportDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    detail,
    detailLoading,
    actionLoading,
    fetchDetail,
    processReport,
    resetDetail,
  } = useAdminReports();

  const [error, setError] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  // Modal state
  const [processModal, setProcessModal] = useState<{
    open: boolean;
    initialAction: ReportAction | null;
  }>({ open: false, initialAction: null });

  // ============================================
  // Fetch Detail
  // ============================================
  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const load = async () => {
      setError(null);
      setHasAttempted(false);

      try {
        await fetchDetail(Number(id));
      } catch {
        if (!cancelled) {
          setError('تعذر تحميل تفاصيل البلاغ');
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
      resetDetail();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ============================================
  // Open Process Modal
  // ============================================
  const openProcessModal = useCallback((action: ReportAction | null) => {
    setProcessModal({ open: true, initialAction: action });
  }, []);

  const closeProcessModal = useCallback(() => {
    if (actionLoading) return;
    setProcessModal({ open: false, initialAction: null });
  }, [actionLoading]);

  // ============================================
  // Submit Process
  // ============================================
  const handleProcess = useCallback(
    async (data: {
      action: ReportAction;
      admin_notes: string;
      suspend_days?: number;
    }) => {
      if (!id) return;
      try {
        await processReport(Number(id), data);
        setProcessModal({ open: false, initialAction: null });
        // Detail updated by the hook — no need to refetch
      } catch {
        // toast handled in hook
      }
    },
    [id, processReport]
  );

  // ============================================
  // Loading
  // ============================================
  if ((detailLoading || !hasAttempted) && !detail) {
    return (
      <>
        <SEO title="تفاصيل البلاغ" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '1rem',
            paddingBottom: '3rem',
          }}
        >
          <Container fluid="xl" className="px-3 px-md-4">
            <AdminReportsSkeleton variant="detail" />
          </Container>
        </div>
      </>
    );
  }

  // ============================================
  // Error / not found
  // ============================================
  if (error || !detail) {
    return (
      <>
        <SEO title="تفاصيل البلاغ" />
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
              {error || 'البلاغ غير موجود'}
            </h3>
            <Link
              to="/admin/reports"
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

  // ============================================
  // Determine what actions are available
  // ============================================
  const isPending = detail.status === 'pending';
  const hasAnnouncement = !!detail.announcement;

  // Available action buttons (rendered as quick-CTA on the sidebar)
  const actionButtons: {
    key: ReportAction;
    label: string;
    Icon: React.ComponentType<{ size?: number }>;
    color: string;
    hoverBg: string;
    hide?: boolean;
  }[] = [
    {
      key: 'warn_user',
      label: 'تحذير المستخدم',
      Icon: FaExclamationTriangle,
      color: '#FFC107',
      hoverBg: 'rgba(255,193,7,0.08)',
      hide: !detail.reported_user,
    },
    {
      key: 'suspend_user',
      label: 'تعليق الحساب',
      Icon: FaClock,
      color: '#FF9800',
      hoverBg: 'rgba(255,152,0,0.08)',
      hide: !detail.reported_user,
    },
    {
      key: 'block_user',
      label: 'حظر الحساب',
      Icon: FaBan,
      color: '#DC3545',
      hoverBg: 'rgba(220,53,69,0.06)',
      hide: !detail.reported_user,
    },
    {
      key: 'delete_content',
      label: 'حذف المحتوى',
      Icon: FaTrash,
      color: '#DC3545',
      hoverBg: 'rgba(220,53,69,0.06)',
      hide: !hasAnnouncement,
    },
    {
      key: 'reject_report',
      label: 'رفض البلاغ',
      Icon: FaTimesCircle,
      color: '#6C757D',
      hoverBg: 'rgba(108,117,125,0.08)',
    },
  ];

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <SEO
        title={`بلاغ #${detail.id}`}
        description={`مراجعة البلاغ رقم ${detail.id}`}
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
                to="/admin/reports"
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                إدارة البلاغات
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <span style={{ opacity: 0.7 }}>بلاغ #{detail.id}</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #DC3545, #F56575)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(220,53,69,0.3)',
                    flexShrink: 0,
                  }}
                >
                  <FaFlag size={22} color="#FFFFFF" />
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
                    تفاصيل البلاغ #{detail.id}
                  </h1>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontFamily: 'Cairo, sans-serif',
                      margin: 0,
                    }}
                  >
                    مراجعة تفاصيل البلاغ واتخاذ الإجراء المناسب
                  </p>
                </div>
              </div>

              <Button
                onClick={() => navigate('/admin/reports')}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)',
                  borderRadius: '10px',
                  padding: '8px 18px',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FaArrowRight size={11} />
                العودة للقائمة
              </Button>
            </div>
          </motion.div>

          {/* ============================================
              Content
              ============================================ */}
          <Row className="g-4">
            {/* Main content */}
            <Col xs={12} lg={8}>
              <AdminReportDetailContent detail={detail} />
            </Col>

            {/* Sidebar — Actions */}
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
                    <FaCheckCircle
                      size={14}
                      color="var(--primary-orange)"
                    />
                    اتخاذ القرار
                  </h4>

                  {/* Status Banner */}
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      marginBottom: '1rem',
                      backgroundColor: isPending
                        ? 'rgba(255,193,7,0.08)'
                        : detail.status === 'reviewed'
                          ? 'rgba(40,167,69,0.08)'
                          : 'rgba(108,117,125,0.08)',
                      border: `1px solid ${
                        isPending
                          ? 'rgba(255,193,7,0.25)'
                          : detail.status === 'reviewed'
                            ? 'rgba(40,167,69,0.25)'
                            : 'rgba(108,117,125,0.25)'
                      }`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: isPending
                        ? '#856404'
                        : detail.status === 'reviewed'
                          ? '#28A745'
                          : '#6C757D',
                    }}
                  >
                    {isPending && <FaClock size={14} />}
                    {detail.status === 'reviewed' && (
                      <FaCheckCircle size={14} />
                    )}
                    {detail.status === 'rejected' && (
                      <FaTimesCircle size={14} />
                    )}
                    <span>{detail.status_label}</span>
                  </div>

                  {/* Actions */}
                  {isPending ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {actionButtons
                        .filter((a) => !a.hide)
                        .map((action) => {
                          const Icon = action.Icon;
                          return (
                            <motion.button
                              key={action.key}
                              type="button"
                              onClick={() => openProcessModal(action.key)}
                              disabled={actionLoading}
                              whileHover={
                                !actionLoading ? { x: -3 } : {}
                              }
                              whileTap={
                                !actionLoading ? { scale: 0.98 } : {}
                              }
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 14px',
                                borderRadius: '12px',
                                border: `1px solid ${action.color}40`,
                                backgroundColor: 'var(--bg-input)',
                                cursor: actionLoading
                                  ? 'not-allowed'
                                  : 'pointer',
                                textAlign: 'right',
                                fontFamily: 'Cairo, sans-serif',
                                width: '100%',
                                transition: 'all 0.2s ease',
                                opacity: actionLoading ? 0.6 : 1,
                              }}
                              onMouseEnter={(e) => {
                                if (actionLoading) return;
                                e.currentTarget.style.backgroundColor =
                                  action.hoverBg;
                              }}
                              onMouseLeave={(e) => {
                                if (actionLoading) return;
                                e.currentTarget.style.backgroundColor =
                                  'var(--bg-input)';
                              }}
                            >
                              <div
                                style={{
                                  width: '34px',
                                  height: '34px',
                                  borderRadius: '10px',
                                  backgroundColor: `${action.color}15`,
                                  color: action.color,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                <Icon size={14} />
                              </div>
                              <span
                                style={{
                                  color: action.color,
                                  fontSize: '0.85rem',
                                  fontWeight: 800,
                                  flex: 1,
                                }}
                              >
                                {action.label}
                              </span>
                            </motion.button>
                          );
                        })}
                    </div>
                  ) : (
                    <Button
                      onClick={() => navigate('/admin/reports')}
                      style={{
                        width: '100%',
                        padding: '12px',
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

                {/* Info Box */}
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '14px 16px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    fontFamily: 'Cairo, sans-serif',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  <FaExclamationTriangle
                    size={13}
                    color="#FFC107"
                    style={{ flexShrink: 0, marginTop: '3px' }}
                  />
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                    }}
                  >
                    تأكد من مراجعة البلاغ بعناية قبل اتخاذ القرار. سيتم إشعار
                    الطرفين تلقائياً.
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ============================================
          Process Modal
          ============================================ */}
      <AdminProcessReportModal
        isOpen={processModal.open}
        onClose={closeProcessModal}
        initialAction={processModal.initialAction}
        reportId={detail.id}
        targetType={detail.target_type}
        reportedName={detail.reported_user?.name}
        announcementTitle={detail.announcement?.title}
        onSubmit={handleProcess}
        isLoading={actionLoading}
      />
    </>
  );
};

export default AdminReportDetailPage;