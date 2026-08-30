import { Card } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';

const AnnouncementPostSkeleton = () => {
  const { isDark } = useTheme();

  return (
    <Card
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px var(--shadow-sm)',
      }}
    >
      <Card.Body style={{ padding: '1.25rem 1.5rem' }}>
        {/* Header Skeleton */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
          <div
            className="skeleton shimmer"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              className="skeleton shimmer"
              style={{
                width: '40%',
                height: '14px',
                backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                borderRadius: '8px',
                marginBottom: '6px',
              }}
            />
            <div
              className="skeleton shimmer"
              style={{
                width: '25%',
                height: '10px',
                backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                borderRadius: '8px',
              }}
            />
          </div>
        </div>

        {/* Content Skeleton */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div
            className="skeleton shimmer"
            style={{
              width: '180px',
              height: '140px',
              borderRadius: '12px',
              backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              className="skeleton shimmer"
              style={{
                width: '80%',
                height: '18px',
                backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                borderRadius: '8px',
                marginBottom: '8px',
              }}
            />
            <div
              className="skeleton shimmer"
              style={{
                width: '100%',
                height: '12px',
                backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                borderRadius: '8px',
                marginBottom: '4px',
              }}
            />
            <div
              className="skeleton shimmer"
              style={{
                width: '70%',
                height: '12px',
                backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                borderRadius: '8px',
                marginBottom: '10px',
              }}
            />
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              <div
                className="skeleton shimmer"
                style={{
                  width: '60px',
                  height: '20px',
                  backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                  borderRadius: '10px',
                }}
              />
              <div
                className="skeleton shimmer"
                style={{
                  width: '50px',
                  height: '20px',
                  backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                  borderRadius: '10px',
                }}
              />
              <div
                className="skeleton shimmer"
                style={{
                  width: '60px',
                  height: '20px',
                  backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                  borderRadius: '10px',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div
                className="skeleton shimmer"
                style={{
                  width: '100px',
                  height: '32px',
                  backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                  borderRadius: '10px',
                }}
              />
              <div
                className="skeleton shimmer"
                style={{
                  width: '80px',
                  height: '32px',
                  backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
                  borderRadius: '10px',
                }}
              />
            </div>
          </div>
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

export default AnnouncementPostSkeleton;