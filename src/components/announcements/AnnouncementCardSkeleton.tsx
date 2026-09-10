import { Card } from 'react-bootstrap';

const AnnouncementCardSkeleton = () => {
  return (
    <Card
      className="announcement-card-skeleton"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px var(--shadow-sm)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image Skeleton - Top */}
      <div
        className="skeleton shimmer"
        style={{
          width: '100%',
          height: '190px',
          flexShrink: 0,
        }}
      />

      {/* Content Skeleton - Bottom */}
      <Card.Body style={{ 
        padding: '0.8rem 0.9rem 0.9rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}>
        {/* User Info Box Skeleton */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '8px',
            padding: '4px 10px',
            marginBottom: '0.4rem',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            className="skeleton shimmer"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              className="skeleton shimmer"
              style={{
                width: '45%',
                height: '8px',
                borderRadius: '3px',
                marginBottom: '2px',
              }}
            />
            <div
              className="skeleton shimmer"
              style={{
                width: '30%',
                height: '6px',
                borderRadius: '3px',
              }}
            />
          </div>
          <div
            className="skeleton shimmer"
            style={{
              width: '25px',
              height: '8px',
              borderRadius: '3px',
            }}
          />
        </div>

        {/* Title Skeleton */}
        <div
          className="skeleton shimmer"
          style={{
            width: '85%',
            height: '13px',
            borderRadius: '3px',
            marginBottom: '0.2rem',
          }}
        />

        {/* Tags Skeleton */}
        <div style={{ display: 'flex', gap: '3px', marginBottom: '0.3rem', marginTop: 'auto', flexWrap: 'wrap' }}>
          <div
            className="skeleton shimmer"
            style={{
              width: '30px',
              height: '12px',
              borderRadius: '3px',
            }}
          />
          <div
            className="skeleton shimmer"
            style={{
              width: '40px',
              height: '12px',
              borderRadius: '3px',
            }}
          />
          <div
            className="skeleton shimmer"
            style={{
              width: '50px',
              height: '12px',
              borderRadius: '3px',
            }}
          />
        </div>

        {/* Actions Skeleton */}
        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          paddingTop: '0.4rem',
          borderTop: '1px solid var(--border-color)',
        }}>
          <div
            className="skeleton shimmer"
            style={{
              flex: 1,
              height: '22px',
              borderRadius: '6px',
            }}
          />
          <div
            className="skeleton shimmer"
            style={{
              flex: 1,
              height: '22px',
              borderRadius: '6px',
            }}
          />
        </div>
      </Card.Body>

      <style>{`
        .skeleton {
          position: relative;
          overflow: hidden;
          background-color: #e8e0d8;
        }
        
        .shimmer::after {
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
          animation: shimmer 1.8s infinite;
        }
        
        [data-theme="dark"] .skeleton {
          background-color: #5a4432 !important;
        }
        
        [data-theme="dark"] .shimmer::after {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.08) 50%,
            transparent 100%
          );
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </Card>
  );
};

export default AnnouncementCardSkeleton;