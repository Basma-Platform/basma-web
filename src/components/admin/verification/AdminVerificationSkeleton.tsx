import { Row, Col, Card } from 'react-bootstrap';

interface AdminVerificationSkeletonProps {
  variant?: 'list' | 'detail';
  count?: number;
}

const AdminVerificationSkeleton = ({
  variant = 'list',
  count = 6,
}: AdminVerificationSkeletonProps) => {
  if (variant === 'detail') return <DetailSkeleton />;

  return (
    <>
      <style>{`
        @keyframes adminVerShimmer {
          0% { opacity: 0.4; }
          50% { opacity: 0.85; }
          100% { opacity: 0.4; }
        }
        .admin-ver-shimmer {
          animation: adminVerShimmer 1.5s ease-in-out infinite;
          background-color: var(--border-color);
        }
      `}</style>

      {/* Stats Row Skeleton */}
      <Row className="g-3 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <Col key={i} xs={12} sm={6} lg={3}>
            <Card
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1rem 1.1rem',
              }}
            >
              <div
                className="admin-ver-shimmer"
                style={{
                  height: '12px',
                  width: '60%',
                  borderRadius: '4px',
                  marginBottom: '12px',
                }}
              />
              <div
                className="admin-ver-shimmer"
                style={{
                  height: '28px',
                  width: '40%',
                  borderRadius: '6px',
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters Skeleton */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '1rem 1.1rem',
          marginBottom: '1.25rem',
          border: '1px solid var(--border-color)',
        }}
      >
        <div
          className="admin-ver-shimmer"
          style={{ height: '42px', borderRadius: '10px', marginBottom: '10px' }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="admin-ver-shimmer"
              style={{
                height: '32px',
                width: '90px',
                borderRadius: '8px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Card List Skeleton */}
      <Row className="g-3">
        {Array.from({ length: count }).map((_, i) => (
          <Col key={i} xs={12} md={6} lg={4}>
            <Card
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div
                  className="admin-ver-shimmer"
                  style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    className="admin-ver-shimmer"
                    style={{
                      height: '12px',
                      width: '70%',
                      borderRadius: '4px',
                      marginBottom: '8px',
                    }}
                  />
                  <div
                    className="admin-ver-shimmer"
                    style={{ height: '10px', width: '50%', borderRadius: '4px' }}
                  />
                </div>
              </div>
              <div
                className="admin-ver-shimmer"
                style={{
                  height: '120px',
                  borderRadius: '10px',
                  marginBottom: '10px',
                }}
              />
              <div
                className="admin-ver-shimmer"
                style={{ height: '32px', borderRadius: '8px' }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

// ============================================
// Detail Skeleton
// ============================================
const DetailSkeleton = () => (
  <>
    <style>{`
      @keyframes adminVerShimmer {
        0% { opacity: 0.4; }
        50% { opacity: 0.85; }
        100% { opacity: 0.4; }
      }
      .admin-ver-shimmer {
        animation: adminVerShimmer 1.5s ease-in-out infinite;
        background-color: var(--border-color);
      }
    `}</style>

    <Row className="g-4">
      <Col xs={12} lg={8}>
        <Card
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.5rem',
          }}
        >
          <div
            className="admin-ver-shimmer"
            style={{
              height: '20px',
              width: '40%',
              borderRadius: '6px',
              marginBottom: '1.5rem',
            }}
          />
          <div
            className="admin-ver-shimmer"
            style={{
              height: '320px',
              borderRadius: '14px',
              marginBottom: '1.25rem',
            }}
          />
          <div
            className="admin-ver-shimmer"
            style={{
              height: '100px',
              borderRadius: '14px',
            }}
          />
        </Card>
      </Col>
      <Col xs={12} lg={4}>
        <Card
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.5rem',
          }}
        >
          <div
            className="admin-ver-shimmer"
            style={{
              height: '60px',
              borderRadius: '12px',
              marginBottom: '1rem',
            }}
          />
          <div
            className="admin-ver-shimmer"
            style={{
              height: '40px',
              borderRadius: '10px',
              marginBottom: '8px',
            }}
          />
          <div
            className="admin-ver-shimmer"
            style={{ height: '40px', borderRadius: '10px' }}
          />
        </Card>
      </Col>
    </Row>
  </>
);

export default AdminVerificationSkeleton;