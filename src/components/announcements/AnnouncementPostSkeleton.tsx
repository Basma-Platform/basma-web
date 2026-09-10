import { Card } from 'react-bootstrap';

const AnnouncementPostSkeleton = () => {
  return (
    <Card
      className="announcement-card-skeleton"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'row',
        minHeight: '220px',
      }}
    >
      {/* Image Skeleton - Left */}
      <div
        className="skeleton shimmer"
        style={{
          width: '260px',
          minHeight: '220px',
          flexShrink: 0,
        }}
      />

      {/* Content Skeleton - Right */}
      <Card.Body style={{ 
        padding: '1rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
      }}>
        {/* User Info Box Skeleton */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '10px',
            padding: '6px 12px',
            marginBottom: '0.5rem',
            border: '1px solid var(--border-color)',
          }}
        >
          <div
            className="skeleton shimmer"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              className="skeleton shimmer"
              style={{
                width: '40%',
                height: '10px',
                borderRadius: '4px',
                marginBottom: '3px',
              }}
            />
            <div
              className="skeleton shimmer"
              style={{
                width: '25%',
                height: '7px',
                borderRadius: '3px',
              }}
            />
          </div>
          <div
            className="skeleton shimmer"
            style={{
              width: '30px',
              height: '10px',
              borderRadius: '4px',
            }}
          />
        </div>

        {/* Title Skeleton */}
        <div
          className="skeleton shimmer"
          style={{
            width: '80%',
            height: '16px',
            borderRadius: '4px',
            marginBottom: '0.2rem',
          }}
        />

        {/* Description Skeleton */}
        <div
          className="skeleton shimmer"
          style={{
            width: '100%',
            height: '10px',
            borderRadius: '3px',
            marginBottom: '3px',
          }}
        />
        <div
          className="skeleton shimmer"
          style={{
            width: '60%',
            height: '10px',
            borderRadius: '3px',
            marginBottom: '0.3rem',
          }}
        />

        {/* Tags Skeleton */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
          <div
            className="skeleton shimmer"
            style={{
              width: '40px',
              height: '16px',
              borderRadius: '4px',
            }}
          />
          <div
            className="skeleton shimmer"
            style={{
              width: '55px',
              height: '16px',
              borderRadius: '4px',
            }}
          />
          <div
            className="skeleton shimmer"
            style={{
              width: '70px',
              height: '16px',
              borderRadius: '4px',
            }}
          />
        </div>

        {/* Actions Skeleton */}
        <div style={{ 
          display: 'flex', 
          gap: '6px', 
          marginTop: 'auto',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--border-color)',
        }}>
          <div
            className="skeleton shimmer"
            style={{
              flex: 1,
              height: '28px',
              borderRadius: '6px',
            }}
          />
          <div
            className="skeleton shimmer"
            style={{
              flex: 1,
              height: '28px',
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

export default AnnouncementPostSkeleton;