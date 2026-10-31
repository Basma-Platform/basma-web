import { useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SEO from '../../../components/SEO';
import { useAdminCommunityPosts } from '../../../hooks/useAdminCommunityPosts';
import {
  COMMUNITY_THEME,
  COMMUNITY_MAX_PINNED_GLOBAL,
} from '../../../utils/communityHelpers';
import { CommunityIcons } from '../../../utils/communityIcons';
import AdminCommunityStatsCards from '../../../components/community/admin/AdminCommunityStatsCards';
import AdminCommunityFilters from '../../../components/community/admin/AdminCommunityFilters';
import AdminCommunityPostCard from '../../../components/community/admin/AdminCommunityPostCard';
import AdminCommunitySkeleton from '../../../components/community/admin/AdminCommunitySkeleton';
import type {
  CommunityAdminFilters as Filters,
  AdminCommunityPostListItem,
} from '../../../types';

const DEFAULT_FILTERS: Filters = {
  status: 'all',
  type: 'all',
  sort: 'newest',
  page: 1,
  per_page: 20,
};

const AdminCommunityPostsPage = () => {
  const {
    posts,
    meta,
    stats,
    loading,
    fetchPosts,
  } = useAdminCommunityPosts();

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  useEffect(() => {
    fetchPosts(filters).catch(() => {
      /* toast in hook */
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.status,
    filters.type,
    filters.search,
    filters.sort,
    filters.page,
  ]);

  const handleFilterChange = (patch: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // ✅ Explicit boolean (not boolean | undefined)
  const hasActiveFilters: boolean = useMemo(() => {
    return Boolean(
      (filters.status && filters.status !== 'all') ||
        (filters.type && filters.type !== 'all') ||
        filters.search ||
        (filters.sort && filters.sort !== 'newest')
    );
  }, [filters]);

  const pinnedCount = useMemo(
    () => posts.filter((p) => p.is_pinned).length,
    [posts]
  );

  return (
    <>
      <SEO
        title="إدارة منشورات المجتمع"
        description="إدارة ومراجعة منشورات المجتمع في بصمة"
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
                  منشورات المجتمع
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
                راجع، اعتمد، وثبّت المنشورات — تحكم كامل بالمحتوى
              </p>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 18px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 193, 7, 0.08)',
                border: '1px solid rgba(255, 193, 7, 0.3)',
              }}
            >
              <CommunityIcons.pinned size={14} color="#D4AF37" />
              <span
                style={{
                  color: '#7A5A10',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                مثبّت: {pinnedCount} / {COMMUNITY_MAX_PINNED_GLOBAL}
              </span>
            </div>
          </div>

          <AdminCommunityStatsCards stats={stats} loading={loading} />

          <AdminCommunityFilters
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {loading && posts.length === 0 && (
            <AdminCommunitySkeleton count={5} />
          )}

          {!loading && posts.length === 0 && (
            <div
              style={{
                padding: '3.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '18px',
                border: '1px dashed var(--border-color)',
              }}
            >
              <CommunityIcons.images
                size={36}
                style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}
              />
              <h3
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 800,
                  marginBottom: '0.5rem',
                }}
              >
                لا توجد منشورات مطابقة
              </h3>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontFamily: 'Cairo, sans-serif',
                  margin: 0,
                }}
              >
                {hasActiveFilters
                  ? 'جرّب تغيير الفلاتر أو مسحها'
                  : 'لا توجد منشورات بعد'}
              </p>
            </div>
          )}

          {posts.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {posts.map((post: AdminCommunityPostListItem, index: number) => (
                <AdminCommunityPostCard
                  key={post.id}
                  post={post}
                  index={index}
                />
              ))}
            </div>
          )}

          {meta && meta.total > 0 && (
            <div
              style={{
                marginTop: '2rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 700,
              }}
            >
              عرض {posts.length} من {meta.total} منشور
            </div>
          )}

          <div
            style={{
              marginTop: '2rem',
              textAlign: 'center',
            }}
          >
            <Link
              to="/admin/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <CommunityIcons.arrowRight size={12} />
              العودة إلى لوحة التحكم
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
};

export default AdminCommunityPostsPage;