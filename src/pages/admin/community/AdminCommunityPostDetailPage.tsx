import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../../components/SEO';
import { useAdminCommunityPostDetail } from '../../../hooks/useAdminCommunityPostDetail';
import {
  COMMUNITY_THEME,
  COMMUNITY_MAX_PINNED_GLOBAL,
} from '../../../utils/communityHelpers';
import { CommunityIcons } from '../../../utils/communityIcons';
import AdminCommunityPostDetailContent from '../../../components/community/admin/AdminCommunityPostDetailContent';
import AdminApprovePostModal from '../../../components/community/admin/AdminApprovePostModal';
import AdminRejectPostModal from '../../../components/community/admin/AdminRejectPostModal';
import AdminDeletePostModal from '../../../components/community/admin/AdminDeletePostModal';
import AdminPinPostButton from '../../../components/community/admin/AdminPinPostButton';

const AdminCommunityPostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    detail,
    loading,
    actionLoading,
    fetchDetail,
    approve,
    reject,
    deletePost,
    pin,
    unpin,
    reset,
  } = useAdminCommunityPostDetail();

  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const postId = Number(id);

  useEffect(() => {
    if (!postId) return;
    fetchDetail(postId).catch(() => {
      /* toast handled in hook */
    });
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleApprove = async (notes?: string) => {
    if (!detail) return;
    await approve(detail.id, notes);
    setShowApprove(false);
  };

  const handleReject = async (notes: string) => {
    if (!detail) return;
    await reject(detail.id, notes);
    setShowReject(false);
  };

  const handleDelete = async (reason?: string) => {
    if (!detail) return;
    await deletePost(detail.id, reason);
    setShowDelete(false);
    navigate('/admin/community-posts');
  };

  const handlePin = async () => {
    if (!detail) return;
    if (detail.is_pinned) {
      await unpin(detail.id);
    } else {
      await pin(detail.id);
    }
  };

  if (loading) {
    return (
      <section
        style={{
          paddingTop: '110px',
          paddingBottom: '4rem',
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
        }}
      >
        <Container>
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              color: 'var(--text-muted)',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <CommunityIcons.clock
              size={32}
              style={{ marginBottom: '1rem', opacity: 0.6 }}
            />
            <p>جاري التحميل...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (!detail) {
    return (
      <section
        style={{
          paddingTop: '110px',
          paddingBottom: '4rem',
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
        }}
      >
        <Container>
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px dashed var(--border-color)',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            <CommunityIcons.ban
              size={40}
              style={{ color: '#DC3545', marginBottom: '1rem' }}
            />
            <h3
              style={{
                color: 'var(--text-secondary)',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                marginBottom: '0.5rem',
              }}
            >
              المنشور غير موجود
            </h3>
            <Link
              to="/admin/community-posts"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                background: COMMUNITY_THEME.gradient,
                color: '#FFFFFF',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                textDecoration: 'none',
                borderRadius: '30px',
                marginTop: '1rem',
              }}
            >
              <CommunityIcons.arrowRight size={12} />
              العودة إلى القائمة
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const canApprove = detail.status === 'pending';
  const canReject = detail.status === 'pending';
  const canPin = detail.status === 'approved';
  const pinDisabled = !detail.is_pinned && !canPin;

  return (
    <>
      <SEO
        title={`إدارة: ${detail.title}`}
        description={detail.description.slice(0, 155)}
      />

      <section
        style={{
          paddingTop: '90px',
          paddingBottom: '4rem',
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Container>
          <Link
            to="/admin/community-posts"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-muted)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: '1.5rem',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = COMMUNITY_THEME.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <CommunityIcons.arrowRight size={12} />
            العودة إلى القائمة
          </Link>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <h1
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'clamp(1.35rem, 2.8vw, 1.75rem)',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                  margin: 0,
                  marginBottom: '0.35rem',
                }}
              >
                مراجعة المنشور #{detail.id}
              </h1>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontFamily: 'Cairo, sans-serif',
                  margin: 0,
                }}
              >
                راجع التفاصيل واتخذ الإجراء المناسب
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ maxWidth: '960px', margin: '0 auto' }}
          >
            <AdminCommunityPostDetailContent post={detail} />

            <div
              style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                backgroundColor: 'var(--bg-card)',
                border: '1.5px solid var(--border-color)',
                borderRadius: '18px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: COMMUNITY_THEME.accent,
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1.25rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <CommunityIcons.confirm size={14} />
                الإجراءات
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                {canApprove && (
                  <button
                    type="button"
                    onClick={() => setShowApprove(true)}
                    disabled={actionLoading}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '11px 24px',
                      fontSize: '0.88rem',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      background: 'linear-gradient(135deg, #28A745, #4FCB6E)',
                      border: 'none',
                      borderRadius: '30px',
                      cursor: actionLoading ? 'wait' : 'pointer',
                      boxShadow: '0 4px 14px rgba(40, 167, 69, 0.35)',
                      transition: 'all 0.2s ease',
                      opacity: actionLoading ? 0.6 : 1,
                    }}
                  >
                    <CommunityIcons.confirm size={13} />
                    الموافقة والنشر
                  </button>
                )}

                {canReject && (
                  <button
                    type="button"
                    onClick={() => setShowReject(true)}
                    disabled={actionLoading}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '11px 24px',
                      fontSize: '0.88rem',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      background: 'linear-gradient(135deg, #DC3545, #F56575)',
                      border: 'none',
                      borderRadius: '30px',
                      cursor: actionLoading ? 'wait' : 'pointer',
                      boxShadow: '0 4px 14px rgba(220, 53, 69, 0.35)',
                      transition: 'all 0.2s ease',
                      opacity: actionLoading ? 0.6 : 1,
                    }}
                  >
                    <CommunityIcons.cancel size={13} />
                    رفض المنشور
                  </button>
                )}

                <div
                  title={
                    pinDisabled
                      ? 'يمكن تثبيت المنشورات المنشورة فقط'
                      : undefined
                  }
                >
                  <AdminPinPostButton
                    isPinned={detail.is_pinned}
                    onClick={handlePin}
                    loading={actionLoading}
                    disabled={pinDisabled}
                    disabledReason={
                      pinDisabled
                        ? 'يمكن تثبيت المنشورات المنشورة فقط'
                        : undefined
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowDelete(true)}
                  disabled={actionLoading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 24px',
                    fontSize: '0.88rem',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 800,
                    color: '#DC3545',
                    backgroundColor: 'transparent',
                    border: '1.5px solid #DC3545',
                    borderRadius: '30px',
                    cursor: actionLoading ? 'wait' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: actionLoading ? 0.6 : 1,
                    marginInlineStart: 'auto',
                  }}
                >
                  <CommunityIcons.delete size={13} />
                  حذف نهائي
                </button>
              </div>

              <p
                style={{
                  marginTop: '1rem',
                  marginBottom: 0,
                  fontSize: '0.72rem',
                  fontFamily: 'Cairo, sans-serif',
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                }}
              >
                يمكنك تثبيت حتى {COMMUNITY_MAX_PINNED_GLOBAL} منشورات في
                الأعلى. المنشورات المثبتة تظهر قبل غيرها في الصفحة العامة.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <AdminApprovePostModal
        isOpen={showApprove}
        onClose={() => setShowApprove(false)}
        onConfirm={handleApprove}
        loading={actionLoading}
      />

      <AdminRejectPostModal
        isOpen={showReject}
        onClose={() => setShowReject(false)}
        onConfirm={handleReject}
        loading={actionLoading}
      />

      <AdminDeletePostModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={actionLoading}
      />
    </>
  );
};

export default AdminCommunityPostDetailPage;