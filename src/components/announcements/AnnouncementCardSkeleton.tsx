import { Card } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';

const AnnouncementCardSkeleton = () => {
  const { isDark } = useTheme();

  return (
    <Card
      style={{
        backgroundColor: isDark ? 'var(--bg-card)' : 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px var(--shadow-sm)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image Skeleton */}
      <div
        className="skeleton shimmer"
        style={{
          width: '100%',
          height: '160px',
          backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
          borderRadius: '0',
          flexShrink: 0,
        }}
      />

      <Card.Body style={{ 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}>
        {/* Header Skeleton */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div
            className="skeleton shimmer"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div              className="skeleton shimmer"
              style={{
                width: '60%',
                height: '12px',
                backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                borderRadius: '6px',
                marginBottom: '4px',
              }}
            />
            <div
              className="skeleton shimmer"
              style={{
                width: '35%',
                height: '8px',
                backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                borderRadius: '6px',
              }}
            />
          </div>
        </div>

        {/* Title Skeleton */}
        <div
          className="skeleton shimmer"
          style={{
            width: '85%',
            height: '16px',
            backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
            borderRadius: '6px',
            marginBottom: '10px',
          }}
        />

        {/* Tags Row 1 Skeleton - 3 badges */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <div
            className="skeleton shimmer"
            style={{
              width: '50px',
              height: '20px',
              backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
              borderRadius: '8px',
            }}
          />
          <div
            className="skeleton shimmer"
            style={{
              width: '40px',
              height: '20px',
              backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
              borderRadius: '8px',
            }}
          />
          <div
            className="skeleton shimmer"
            style={{
              width: '55px',
              height: '20px',
              backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
              borderRadius: '8px',
            }}
          />
        </div>

        {/* Tags Row 2 Skeleton - 2 location badges */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <div
            className="skeleton shimmer"
            style={{
              width: '60px',
              height: '18px',
              backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
              borderRadius: '6px',
            }}
          />
          <div
            className="skeleton shimmer"
            style={{
              width: '55px',
              height: '18px',
              backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
              borderRadius: '6px',
            }}
          />
        </div>

        {/* Actions Skeleton */}
        <div style={{ 
          display: 'flex', 
          gap: '6px', 
          marginTop: 'auto',
        }}>
          <div
            className="skeleton shimmer"
            style={{
              flex: 1,
              height: '30px',
              backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
              borderRadius: '8px',
            }}
          />
          <div
            className="skeleton shimmer"
            style={{
              flex: 1,
              height: '30px',
              backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
              borderRadius: '8px',
            }}
          />
        </div>
      </Card.Body>

      <style>{`
        .skeleton {
          position: relative;
          overflow: hidden;
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
            rgba(255, 255, 255, 0.05) 50%,
            transparent 100%
          );
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        [data-theme="dark"] .shimmer::after {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.03) 50%,
            transparent 100%
          );
        }
      `}</style>
    </Card>
  );
};

export default AnnouncementCardSkeleton;