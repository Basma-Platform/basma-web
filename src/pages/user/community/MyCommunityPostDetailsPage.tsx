import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../../components/SEO';
import { useMyCommunityPostDetails } from '../../../hooks/useMyCommunityPostDetails';
import { useCommunityPostForm } from '../../../hooks/useCommunityPostForm';
import {
  COMMUNITY_THEME,
  formatCommunityDate,
  formatCommunityTimeAgo,
  getCommunityTypeColor,
  isResolvableType,
} from '../../../utils/communityHelpers';
import { CommunityIcons } from '../../../utils/communityIcons';
import {
  CommunityTypeBadge,
  CommunityStatusBadge,
  CommunityPinnedBadge,
  CommunityImageCarousel,
} from '../../../components/community/shared';
import DeleteCommunityPostModal from '../../../components/community/user/DeleteCommunityPostModal';
import ResolveConfirmModal from '../../../components/community/user/ResolveConfirmModal';

const MyCommunityPostDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { post, loading, actionLoading, fetchPost, resolvePost, reset } =
    useMyCommunityPostDetails();
  const { deletePost } = useCommunityPostForm();

  const [showDelete, setShowDelete] = useState(false);
  const [showResolve, setShowResolve] = useState(false);

  const postId = Number(id);

  useEffect(() => {
    if (!postId) return;
    fetchPost(postId).catch(() => {
      /* toast handled in hook */
    });
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  // ============================================
  // Delete
  // ============================================
  const handleDelete = async () => {
    if (!post) return;
    await deletePost(post.id);
    navigate('/user/community-posts');
  };

  // ============================================
  // Resolve
  // ============================================
  const handleResolve = async () => {
    if (!post) return;
    await resolvePost(post.id);
    setShowResolve(false);
  };

  // ============================================
  // Loading
  // ============================================
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

  // ============================================
  // Not found
  // ============================================
  if (!post) {
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
            <p
              style={{
                color: 'var(--text-muted)',
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '1.5rem',
              }}
            >
              ربما تم حذفه أو لا تملك صلاحية الوصول إليه
            </p>
            <Link
              to="/user/community-posts"
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
              }}
            >
              <CommunityIcons.arrowRight size={12} />
              العودة إلى منشوراتي
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const typeColor = getCommunityTypeColor(post.type);
  const resolvable = isResolvableType(post.type);

  return (
    <>
      <SEO title={post.title} description={post.description.slice(0, 155)} />

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
          {/* Back link */}
          <Link
            to="/user/community-posts"
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
            العودة إلى منشوراتي
          </Link>

          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              backgroundColor: 'var(--bg-card)',
              border: `1.5px solid ${
                post.is_pinned ? '#FFC107' : 'var(--border-color)'
              }`,
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px var(--shadow-sm)',
            }}
          >
            {/* Top accent */}
            <div
              style={{
                height: '5px',
                background: post.is_pinned
                  ? 'linear-gradient(90deg, #FFC107, #FFD966)'
                  : `linear-gradient(90deg, ${typeColor}, ${typeColor}70)`,
              }}
            />

            {/* Content */}
            <div style={{ padding: '1.75rem' }}>
              {/* Badges */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '1.25rem',
                }}
              >
                <CommunityTypeBadge type={post.type} size="md" />
                <CommunityStatusBadge
                  status={post.status}
                  labelOverride={post.status_label}
                  size="md"
                />
                {post.is_pinned && <CommunityPinnedBadge size="md" />}
              </div>

              {/* Title */}
              <h1
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'clamp(1.35rem, 3vw, 1.85rem)',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                  lineHeight: 1.35,
                  marginBottom: '1rem',
                }}
              >
                {post.title}
              </h1>

              {/* Time + views */}
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  marginBottom: '1.5rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <CommunityIcons.time size={12} />
                  {formatCommunityTimeAgo(post.published_at || post.created_at)}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <CommunityIcons.views size={12} />
                  <span dir="ltr">{post.views}</span> مشاهدة
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <CommunityIcons.clicks size={12} />
                  <span dir="ltr">{post.whatsapp_clicks}</span> نقرة
                </span>
              </div>

              {/* Rejection reason (if any) */}
              {post.status === 'rejected' && post.admin_notes && (
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(220, 53, 69, 0.08)',
                    border: '1px solid rgba(220, 53, 69, 0.25)',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#DC3545',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      fontFamily: 'Cairo, sans-serif',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <CommunityIcons.ban size={12} />
                    سبب الرفض
                  </div>
                  <p
                    style={{
                      color: 'var(--text-primary)',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.88rem',
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {post.admin_notes}
                  </p>
                </div>
              )}

              {/* Images */}
              {post.images.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <CommunityImageCarousel
                    images={post.images}
                    alt={post.title}
                    variant="modal"
                  />
                </div>
              )}

              {/* Description */}
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '0.75rem',
                    color: COMMUNITY_THEME.accent,
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  <CommunityIcons.info size={12} />
                  الوصف
                </div>
                <p
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    fontFamily: 'Cairo, sans-serif',
                    lineHeight: 1.9,
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    textAlign: 'justify',
                    textJustify: 'inter-word',
                  }}
                >
                  {post.description}
                </p>
              </div>

              {/* Meta grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '10px',
                  marginBottom: '1.5rem',
                }}
              >
                {post.governorate && (
                  <MetaBox
                    icon={<CommunityIcons.region size={13} />}
                    label="المحافظة"
                    value={post.governorate.name}
                  />
                )}
                {post.city && (
                  <MetaBox
                    icon={<CommunityIcons.location size={13} />}
                    label="المنطقة"
                    value={post.city.name}
                  />
                )}
                {post.category && (
                  <MetaBox
                    icon={<CommunityIcons.category size={13} />}
                    label="التصنيف"
                    value={post.category.name}
                  />
                )}
                <MetaBox
                  icon={<CommunityIcons.calendar size={13} />}
                  label="تاريخ الإنشاء"
                  value={formatCommunityDate(post.created_at)}
                />
                {post.published_at && (
                  <MetaBox
                    icon={<CommunityIcons.confirm size={13} />}
                    label="تاريخ النشر"
                    value={formatCommunityDate(post.published_at)}
                  />
                )}
                {post.expires_at && (
                  <MetaBox
                    icon={<CommunityIcons.clock size={13} />}
                    label="ينتهي في"
                    value={formatCommunityDate(post.expires_at)}
                  />
                )}
              </div>

              {/* ============================================ */}
              {/* Action buttons — depends on status */}
              {/* ============================================ */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--border-color)',
                }}
              >
                {/* Edit + Delete (only pending) */}
                {post.can_edit && post.can_delete && (
                  <>
                    <Link
                      to={`/user/community-posts/${post.id}/edit`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        fontSize: '0.85rem',
                        fontFamily: 'Cairo, sans-serif',
                        fontWeight: 800,
                        color: COMMUNITY_THEME.accent,
                        backgroundColor: 'transparent',
                        border: `1.5px solid ${COMMUNITY_THEME.accent}`,
                        borderRadius: '30px',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <CommunityIcons.edit size={12} />
                      تعديل
                    </Link>

                    <button
                      type="button"
                      onClick={() => setShowDelete(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        fontSize: '0.85rem',
                        fontFamily: 'Cairo, sans-serif',
                        fontWeight: 800,
                        color: '#DC3545',
                        backgroundColor: 'transparent',
                        border: '1.5px solid #DC3545',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <CommunityIcons.delete size={12} />
                      حذف
                    </button>
                  </>
                )}

                {/* Resolve (only approved + resolvable) */}
                {post.can_resolve && resolvable && (
                  <button
                    type="button"
                    onClick={() => setShowResolve(true)}
                    disabled={actionLoading}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 22px',
                      fontSize: '0.85rem',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      background:
                        'linear-gradient(135deg, #17A2B8, #20C9E0)',
                      border: 'none',
                      borderRadius: '30px',
                      cursor: actionLoading ? 'wait' : 'pointer',
                      boxShadow: '0 4px 14px rgba(23, 162, 184, 0.35)',
                      transition: 'all 0.2s ease',
                      opacity: actionLoading ? 0.6 : 1,
                    }}
                  >
                    <CommunityIcons.resolve size={12} />
                    وسم كمحلول
                  </button>
                )}

                {/* WhatsApp preview (if exists) */}
                {post.whatsapp_number && (
                  <a
                    href={`https://wa.me/${post.whatsapp_number.replace(
                      /[^\d]/g,
                      ''
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      fontSize: '0.85rem',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 800,
                      color: '#25D366',
                      backgroundColor: 'rgba(37, 211, 102, 0.08)',
                      border: '1.5px solid rgba(37, 211, 102, 0.35)',
                      borderRadius: '30px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <CommunityIcons.clicks size={12} />
                    واتساب
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Delete modal */}
      <DeleteCommunityPostModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

      {/* Resolve modal */}
      <ResolveConfirmModal
        isOpen={showResolve}
        onClose={() => setShowResolve(false)}
        onConfirm={handleResolve}
        loading={actionLoading}
      />
    </>
  );
};

// ============================================
// MetaBox
// ============================================
const MetaBox = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div
    style={{
      padding: '0.75rem',
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
      borderRadius: '10px',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        color: COMMUNITY_THEME.accent,
        fontSize: '0.7rem',
        fontWeight: 800,
        fontFamily: 'Cairo, sans-serif',
        marginBottom: '4px',
      }}
    >
      {icon}
      {label}
    </div>
    <div
      style={{
        color: 'var(--text-secondary)',
        fontSize: '0.85rem',
        fontWeight: 800,
        fontFamily: 'Cairo, sans-serif',
        wordBreak: 'break-word',
      }}
    >
      {value}
    </div>
  </div>
);

export default MyCommunityPostDetailsPage;