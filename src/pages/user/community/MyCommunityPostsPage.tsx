import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../../components/SEO';
import { useMyCommunityPosts } from '../../../hooks/useMyCommunityPosts';
import { useCommunityLimits } from '../../../hooks/useCommunityLimits';
import {
  COMMUNITY_THEME,
  formatCommunityTimeAgo,
  getCommunityTypeColor,
} from '../../../utils/communityHelpers';
import { CommunityIcons } from '../../../utils/communityIcons';
import {
  CommunityTypeBadge,
  CommunityStatusBadge,
  CommunityPinnedBadge,
} from '../../../components/community/shared';
import MyCommunityPostsSkeleton from '../../../components/community/user/MyCommunityPostsSkeleton';
import CommunityEmptyState from '../../../components/community/public/CommunityEmptyState';
import type { CommunityPostStatus, UserCommunityPost } from '../../../types';

const STATUS_TABS: Array<{
  value: CommunityPostStatus | 'all';
  label: string;
}> = [
  { value: 'all', label: 'الكل' },
  { value: 'pending', label: 'قيد المراجعة' },
  { value: 'approved', label: 'منشور' },
  { value: 'rejected', label: 'مرفوض' },
  { value: 'resolved', label: 'تم الحل' },
  { value: 'expired', label: 'منتهي' },
];

const MyCommunityPostsPage = () => {
  const { posts, loading, fetchMyPosts } = useMyCommunityPosts();
  const { data: limitsData } = useCommunityLimits();

  const [statusFilter, setStatusFilter] = useState<
    CommunityPostStatus | 'all'
  >('all');

  // Fetch on mount and when filter changes
  useEffect(() => {
    fetchMyPosts({ status: statusFilter }).catch(() => {
      /* toast handled in hook */
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const limits = limitsData?.limits;

  return (
    <>
      <SEO
        title="منشوراتي"
        description="إدارة منشوراتك في منشورات المجتمع - بصمة"
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
          {/* ============================================ */}
          {/* Header */}
          {/* ============================================ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '0.5rem',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: COMMUNITY_THEME.gradient,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CommunityIcons.images size={22} />
                </div>
                <h1
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: 900,
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                  }}
                >
                  منشوراتي
                </h1>
              </div>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  fontFamily: 'Cairo, sans-serif',
                  margin: 0,
                }}
              >
                أدر منشوراتك، تابع حالتها، وأكمل ما يحتاج للحل
              </p>
            </div>

            <Link
              to="/user/community-posts/create"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 26px',
                background: COMMUNITY_THEME.gradient,
                color: '#FFFFFF',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 800,
                textDecoration: 'none',
                borderRadius: '30px',
                boxShadow: `0 6px 20px ${COMMUNITY_THEME.shadow}`,
                transition: 'all 0.25s ease',
              }}
            >
              <CommunityIcons.add size={14} />
              منشور جديد
            </Link>
          </div>

          {/* ============================================ */}
          {/* Limits indicator */}
          {/* ============================================ */}
          {limits && (
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    backgroundColor: COMMUNITY_THEME.accentSoft,
                    color: COMMUNITY_THEME.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CommunityIcons.info size={14} />
                </div>
                <div>
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  >
                    المنشورات هذا الشهر: {limits.monthly_used} من{' '}
                    {limits.max_monthly}
                  </div>
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      fontFamily: 'Cairo, sans-serif',
                      marginTop: '2px',
                    }}
                  >
                    المنشورات النشطة: {limits.active_used} من {limits.max_active}
                  </div>
                </div>
              </div>

              {!limits.can_post && (
                <span
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    fontFamily: 'Cairo, sans-serif',
                    color: '#DC3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    border: '1px solid rgba(220, 53, 69, 0.3)',
                    borderRadius: '20px',
                  }}
                >
                  لا يمكن النشر حالياً
                </span>
              )}
            </div>
          )}

          {/* ============================================ */}
          {/* Status tabs */}
          {/* ============================================ */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '1.5rem',
              overflowX: 'auto',
              paddingBottom: '6px',
              scrollbarWidth: 'thin',
            }}
          >
            {STATUS_TABS.map((tab) => {
              const isActive = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatusFilter(tab.value)}
                  style={{
                    padding: '8px 18px',
                    fontSize: '0.82rem',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                    background: isActive
                      ? COMMUNITY_THEME.gradient
                      : 'var(--bg-card)',
                    border: `1.5px solid ${
                      isActive ? COMMUNITY_THEME.accent : 'var(--border-color)'
                    }`,
                    borderRadius: '30px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ============================================ */}
          {/* Posts */}
          {/* ============================================ */}
          {loading && posts.length === 0 && (
            <MyCommunityPostsSkeleton count={3} />
          )}

          {!loading && posts.length === 0 && (
            <CommunityEmptyState
              variant="empty"
              hasFilters={statusFilter !== 'all'}
              onClearFilters={() => setStatusFilter('all')}
            />
          )}

          {posts.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {posts.map((post, index) => (
                <MyPostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
};

// ============================================
// MyPostCard — inline card (user-owned)
// ============================================
interface MyPostCardProps {
  post: UserCommunityPost;
  index: number;
}

const MyPostCard = ({ post, index }: MyPostCardProps) => {
  const typeColor = getCommunityTypeColor(post.type);
  const coverImage = post.images?.[0];
  const timeAgo = formatCommunityTimeAgo(post.published_at || post.created_at);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: `1.5px solid ${
          post.is_pinned ? '#FFC107' : 'var(--border-color)'
        }`,
        borderRadius: '18px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        transition: 'all 0.3s ease',
        boxShadow: post.is_pinned
          ? '0 4px 20px rgba(255, 193, 7, 0.15)'
          : '0 2px 10px var(--shadow-sm)',
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: '140px',
          flexShrink: 0,
          background: coverImage
            ? '#f5f5f5'
            : `linear-gradient(135deg, ${typeColor}12, ${typeColor}05)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              color: typeColor,
              opacity: 0.7,
            }}
          >
            <CommunityIcons.image size={32} />
          </div>
        )}
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          padding: '1rem 1.25rem',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {/* Badges row */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <CommunityTypeBadge type={post.type} size="sm" />
          <CommunityStatusBadge
            status={post.status}
            labelOverride={post.status_label}
            size="sm"
          />
          {post.is_pinned && <CommunityPinnedBadge size="sm" />}
        </div>

        {/* Title */}
        <Link
          to={`/user/community-posts/${post.id}`}
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            fontWeight: 900,
            fontFamily: 'Cairo, sans-serif',
            lineHeight: 1.4,
            textDecoration: 'none',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.title}
        </Link>

        {/* Description preview */}
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            fontFamily: 'Cairo, sans-serif',
            lineHeight: 1.6,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.description}
        </p>

        {/* Footer: meta + CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '12px',
              color: 'var(--text-muted)',
              fontSize: '0.7rem',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 700,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CommunityIcons.time size={10} />
              {timeAgo}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CommunityIcons.views size={10} />
              <span dir="ltr">{post.views}</span>
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CommunityIcons.clicks size={10} />
              <span dir="ltr">{post.whatsapp_clicks}</span>
            </span>
          </div>

          <Link
            to={`/user/community-posts/${post.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: COMMUNITY_THEME.accent,
              fontSize: '0.75rem',
              fontWeight: 800,
              fontFamily: 'Cairo, sans-serif',
              textDecoration: 'none',
            }}
          >
            إدارة
            <CommunityIcons.arrowLeft size={10} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default MyCommunityPostsPage;