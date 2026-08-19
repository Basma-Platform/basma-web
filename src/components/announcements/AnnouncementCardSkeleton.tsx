import { Card, Col } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';

interface AnnouncementCardSkeletonProps {
  count?: number;
}

const AnnouncementCardSkeleton = ({ count = 12 }: AnnouncementCardSkeletonProps) => {
  const { isDark } = useTheme();

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Col key={`skeleton-${index}`} xs={12} sm={6} lg={4} xl={3} className="mb-4">
          <Card
            style={{
              backgroundColor: isDark ? '#1e2a4a' : '#FFFFFF',
              border: 'none',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: isDark
                ? '0 4px 16px rgba(0,0,0,0.2)'
                : '0 4px 16px rgba(0,0,0,0.04)',
              height: '100%',
            }}
          >
            {/* Image Skeleton */}
            <div
              className="skeleton shimmer"
              style={{
                width: '100%',
                height: '200px',
                backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                borderRadius: '0',
              }}
            />

            <Card.Body>
              {/* Title Skeleton */}
              <div
                className="skeleton shimmer"
                style={{
                  width: '80%',
                  height: '20px',
                  backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '12px',
                }}
              />

              {/* Description Skeleton */}
              <div
                className="skeleton shimmer"
                style={{
                  width: '100%',
                  height: '14px',
                  backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}
              />
              <div
                className="skeleton shimmer"
                style={{
                  width: '70%',
                  height: '14px',
                  backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}
              />

              {/* Tags Skeleton */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div
                  className="skeleton shimmer"
                  style={{
                    width: '60px',
                    height: '24px',
                    backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                    borderRadius: '12px',
                  }}
                />
                <div
                  className="skeleton shimmer"
                  style={{
                    width: '80px',
                    height: '24px',
                    backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                    borderRadius: '12px',
                  }}
                />
                <div
                  className="skeleton shimmer"
                  style={{
                    width: '70px',
                    height: '24px',
                    backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                    borderRadius: '12px',
                  }}
                />
              </div>

              {/* Footer Skeleton */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  className="skeleton shimmer"
                  style={{
                    width: '100px',
                    height: '16px',
                    backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                    borderRadius: '8px',
                  }}
                />
                <div
                  className="skeleton shimmer"
                  style={{
                    width: '80px',
                    height: '36px',
                    backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                    borderRadius: '20px',
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </>
  );
};

export default AnnouncementCardSkeleton;