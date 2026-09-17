import { Container } from 'react-bootstrap';

interface MyAnnouncementsSkeletonProps {
  variant?: 'page' | 'grid' | 'card' | 'featured-history';
  count?: number;
}

const MyAnnouncementsSkeleton = ({
  variant = 'page',
  count = 6,
}: MyAnnouncementsSkeletonProps) => {
  // ============================================
  // Single Card Skeleton
  // ============================================
  if (variant === 'card') {
    return <CardSkeleton />;
  }

  // ============================================
  // Grid Only (no page header)
  // ============================================
  if (variant === 'grid') {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ============================================
  // Featured History Skeleton
  // ============================================
  if (variant === 'featured-history') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Array.from({ length: count }).map((_, i) => (
          <FeaturedHistoryItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ============================================
  // Full Page Skeleton
  // ============================================
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-body)',
        minHeight: '100vh',
        paddingTop: '1rem',
        paddingBottom: '3rem',
      }}
      className="skeleton-wrapper"
    >
      <Container fluid="xl" className="px-3 px-md-4">
        {/* ============================================ */}
        {/* Page Title */}
        {/* ============================================ */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            className="skeleton shimmer"
            style={{
              width: '140px',
              height: '14px',
              borderRadius: '6px',
              marginBottom: '10px',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              className="skeleton shimmer"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                flexShrink: 0,
              }}
            />
            <div>
              <div
                className="skeleton shimmer"
                style={{
                  width: '180px',
                  height: '22px',
                  borderRadius: '6px',
                  marginBottom: '8px',
                }}
              />
              <div
                className="skeleton shimmer"
                style={{
                  width: '240px',
                  height: '12px',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* Stats Row */}
        {/* ============================================ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '10px',
            marginBottom: '1rem',
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* ============================================ */}
        {/* Monthly Limit Inline */}
        {/* ============================================ */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <div
              className="skeleton shimmer"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <div
                className="skeleton shimmer"
                style={{
                  width: '120px',
                  height: '12px',
                  borderRadius: '4px',
                  marginBottom: '8px',
                }}
              />
              <div
                className="skeleton shimmer"
                style={{
                  width: '200px',
                  height: '10px',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                className="skeleton shimmer"
                style={{ width: '50px', height: '24px', borderRadius: '6px' }}
              />
              <div
                className="skeleton shimmer"
                style={{ width: '100px', height: '8px', borderRadius: '4px' }}
              />
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* Filters Bar */}
        {/* ============================================ */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1rem 1.1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div
              className="skeleton shimmer"
              style={{
                flex: '1 1 240px',
                height: '42px',
                borderRadius: '11px',
              }}
            />
            <div
              className="skeleton shimmer"
              style={{ width: '150px', height: '42px', borderRadius: '11px' }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="skeleton shimmer"
                style={{
                  width: '80px',
                  height: '34px',
                  borderRadius: '8px',
                }}
              />
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* Announcements Grid */}
        {/* ============================================ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </Container>

      <SkeletonStyles />
    </div>
  );
};

// ============================================
// Card Skeleton
// ============================================
const CardSkeleton = () => (
  <div
    style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* Cover Image */}
    <div
      className="skeleton shimmer"
      style={{ width: '100%', height: '180px' }}
    />

    {/* Body */}
    <div
      style={{
        padding: '1rem 1.1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        flex: 1,
      }}
    >
      {/* Title */}
      <div
        className="skeleton shimmer"
        style={{ width: '85%', height: '16px', borderRadius: '4px' }}
      />
      <div
        className="skeleton shimmer"
        style={{ width: '60%', height: '16px', borderRadius: '4px' }}
      />

      {/* Meta Chips */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <div
          className="skeleton shimmer"
          style={{ width: '60px', height: '22px', borderRadius: '6px' }}
        />
        <div
          className="skeleton shimmer"
          style={{ width: '80px', height: '22px', borderRadius: '6px' }}
        />
      </div>

      {/* Date */}
      <div
        className="skeleton shimmer"
        style={{ width: '100px', height: '10px', borderRadius: '4px' }}
      />

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-color)',
          flexWrap: 'wrap',
        }}
      >
        <div
          className="skeleton shimmer"
          style={{
            flex: '1 1 100%',
            height: '34px',
            borderRadius: '9px',
          }}
        />
        <div
          className="skeleton shimmer"
          style={{ flex: '1 1 0', height: '34px', borderRadius: '9px' }}
        />
        <div
          className="skeleton shimmer"
          style={{ flex: '1 1 0', height: '34px', borderRadius: '9px' }}
        />
      </div>
    </div>
  </div>
);

// ============================================
// Stat Card Skeleton
// ============================================
const StatCardSkeleton = () => (
  <div
    style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '14px',
      padding: '14px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 2px 8px var(--shadow-sm)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Top bar */}
    <div
      className="skeleton shimmer"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: '3px',
        opacity: 0.5,
      }}
    />

    <div
      className="skeleton shimmer"
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        flexShrink: 0,
      }}
    />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        className="skeleton shimmer"
        style={{
          width: '40%',
          height: '22px',
          borderRadius: '6px',
          marginBottom: '6px',
        }}
      />
      <div
        className="skeleton shimmer"
        style={{ width: '70%', height: '10px', borderRadius: '4px' }}
      />
    </div>
  </div>
);

// ============================================
// Featured History Item Skeleton
// ============================================
const FeaturedHistoryItemSkeleton = () => (
  <div
    style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '1rem 1.15rem 1rem 1.25rem',
      display: 'flex',
      gap: '14px',
      alignItems: 'flex-start',
    }}
  >
    <div
      className="skeleton shimmer"
      style={{
        width: '70px',
        height: '70px',
        borderRadius: '12px',
        flexShrink: 0,
      }}
    />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        className="skeleton shimmer"
        style={{
          width: '60%',
          height: '14px',
          borderRadius: '4px',
          marginBottom: '10px',
        }}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '8px',
        }}
      >
        <div
          className="skeleton shimmer"
          style={{ width: '100%', height: '30px', borderRadius: '6px' }}
        />
        <div
          className="skeleton shimmer"
          style={{ width: '100%', height: '30px', borderRadius: '6px' }}
        />
        <div
          className="skeleton shimmer"
          style={{ width: '100%', height: '30px', borderRadius: '6px' }}
        />
      </div>
    </div>
  </div>
);

// ============================================
// Global Skeleton Styles
// ============================================
const SkeletonStyles = () => (
  <style>{`
    .skeleton {
      position: relative;
      overflow: hidden;
      background-color: #e8e0d8;
    }

    .skeleton.shimmer::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.5) 50%,
        transparent 100%
      );
      animation: skeletonShimmer 1.8s infinite;
    }

    [data-theme='dark'] .skeleton {
      background-color: #5a4432 !important;
    }

    [data-theme='dark'] .skeleton.shimmer::after {
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.08) 50%,
        transparent 100%
      );
    }

    @keyframes skeletonShimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `}</style>
);

export default MyAnnouncementsSkeleton;