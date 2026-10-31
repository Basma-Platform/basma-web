import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useCommunityPosts } from '../../../hooks/useCommunityPosts';
import { useCommunityInfiniteScroll } from '../../../hooks/useCommunityInfiniteScroll';
import { CommunityPostCard } from './index';
import CommunityPostModal from './CommunityPostModal';
import CommunityPostSkeleton from './CommunityPostSkeleton';
import CommunityEmptyState from './CommunityEmptyState';
import { COMMUNITY_THEME } from '../../../utils/communityHelpers';
import { CommunityIcons } from '../../../utils/communityIcons';
import type { CommunityPost } from '../../../types';

interface CommunityFeedProps {
  filtersComponent: React.ReactNode;
  hasFilters: boolean;
  onClearFilters: () => void;
}

const CommunityFeed = ({
  filtersComponent,
  hasFilters,
  onClearFilters,
}: CommunityFeedProps) => {
  const {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  } = useCommunityPosts({ perPage: 12 });

  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  const { sentinelRef } = useCommunityInfiniteScroll({
    fetchPage: async (page) => {
      if (page > 1 && hasMore) {
        loadMore();
      }
    },
    enabled: hasMore && !loadingMore && !loading,
    rootMargin: '400px',
  });

  useEffect(() => {
    setSelectedPost(null);
  }, []);

  return (
    <>
      {filtersComponent}

      <section style={{ paddingBottom: '4rem' }}>
        <Container>
          {loading && posts.length === 0 && (
            <div style={{ maxWidth: '780px', margin: '0 auto' }}>
              <CommunityPostSkeleton count={3} />
            </div>
          )}

          {error && posts.length === 0 && !loading && (
            <CommunityEmptyState variant="error" onRetry={refresh} />
          )}

          {!loading && !error && posts.length === 0 && (
            <CommunityEmptyState
              variant="empty"
              hasFilters={hasFilters}
              onClearFilters={onClearFilters}
            />
          )}

          {posts.length > 0 && (
            <div style={{ maxWidth: '780px', margin: '0 auto' }}>
              {posts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  onClick={() => setSelectedPost(post)}
                />
              ))}

              {loadingMore && <CommunityPostSkeleton count={2} />}

              {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}

              {hasMore && !loadingMore && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <button
                    type="button"
                    onClick={loadMore}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 32px',
                      fontSize: '0.9rem',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 800,
                      color: COMMUNITY_THEME.accent,
                      backgroundColor: 'var(--bg-card)',
                      border: `1.5px solid ${COMMUNITY_THEME.accent}`,
                      borderRadius: '30px',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: '0 2px 8px var(--shadow-sm)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        COMMUNITY_THEME.gradient;
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 8px 22px ${COMMUNITY_THEME.shadow}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-card)';
                      e.currentTarget.style.color = COMMUNITY_THEME.accent;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 2px 8px var(--shadow-sm)';
                    }}
                  >
                    <CommunityIcons.add size={13} />
                    تحميل المزيد
                  </button>
                </div>
              )}

              {!hasMore && posts.length > 6 && (
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '2.5rem',
                    padding: '1.25rem',
                    borderTop: '1px dashed var(--border-color)',
                    color: 'var(--text-muted)',
                    fontSize: '0.82rem',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <CommunityIcons.confirm size={14} />
                  وصلت إلى نهاية المنشورات
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      <CommunityPostModal
        isOpen={!!selectedPost}
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </>
  );
};

export default CommunityFeed;