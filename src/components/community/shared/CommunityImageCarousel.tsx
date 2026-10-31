import { useState, useEffect } from 'react';
import { CommunityIcons } from '../../../utils/communityIcons';
import { useTheme } from '../../../context/ThemeContext';

interface CommunityImageCarouselProps {
  images: string[];
  alt?: string;
  /** 'card' = 16:9 in feed; 'modal' = taller in modal */
  variant?: 'card' | 'modal';
  className?: string;
}

/**
 * Simple image carousel with thumbnails.
 * - Click image → expand (parent handles via onClick if needed)
 * - Arrow buttons + dot indicators
 * - RTL: arrows mean "previous" on right / "next" on left
 */
const CommunityImageCarousel = ({
  images,
  alt = 'صورة المنشور',
  variant = 'modal',
  className,
}: CommunityImageCarouselProps) => {
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset when images change (post switch)
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          aspectRatio: variant === 'card' ? '16 / 9' : '4 / 3',
          backgroundColor: isDark
            ? 'rgba(255,255,255,0.03)'
            : 'rgba(0,0,0,0.03)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          border: '1px dashed var(--border-color)',
        }}
      >
        <CommunityIcons.image size={32} />
      </div>
    );
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const hasMultiple = images.length > 1;

  return (
    <div className={className} style={{ width: '100%' }}>
      {/* Main image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: variant === 'card' ? '16 / 9' : '4 / 3',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
        }}
      >
        <img
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s ease',
          }}
        />

        {/* Nav arrows */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="السابق"
              style={navButtonStyle('right', isDark)}
            >
              <CommunityIcons.chevronRight size={16} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="التالي"
              style={navButtonStyle('left', isDark)}
            >
              <CommunityIcons.chevronLeft size={16} />
            </button>
          </>
        )}

        {/* Counter */}
        {hasMultiple && (
          <span
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              padding: '3px 10px',
              backgroundColor: 'rgba(0,0,0,0.65)',
              color: '#FFFFFF',
              fontSize: '0.7rem',
              fontWeight: 800,
              fontFamily: 'Cairo, sans-serif',
              borderRadius: '20px',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          >
            {currentIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '10px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {images.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`صورة ${idx + 1}`}
              style={{
                flex: '0 0 auto',
                width: '60px',
                height: '60px',
                borderRadius: '10px',
                overflow: 'hidden',
                padding: 0,
                border:
                  idx === currentIndex
                    ? '2px solid #9C27B0'
                    : '2px solid transparent',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                opacity: idx === currentIndex ? 1 : 0.6,
              }}
            >
              <img
                src={img}
                alt={`مصغرة ${idx + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// Nav button style (RTL aware)
// ============================================
const navButtonStyle = (
  side: 'left' | 'right',
  isDark: boolean
): React.CSSProperties => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  [side]: '10px',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: isDark
    ? 'rgba(0,0,0,0.55)'
    : 'rgba(255,255,255,0.85)',
  color: isDark ? '#FFFFFF' : '#333333',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
  transition: 'all 0.2s ease',
});

export default CommunityImageCarousel;