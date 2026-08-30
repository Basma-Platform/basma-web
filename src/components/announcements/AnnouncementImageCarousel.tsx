import { useState } from 'react';
import type { AnnouncementImage } from '../../types';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

interface AnnouncementImageCarouselProps {
  images: AnnouncementImage[];
  title: string;
}

const FALLBACK_IMAGE = '/placeholder-image.png';

const AnnouncementImageCarousel = ({
  images,
  title,
}: AnnouncementImageCarouselProps) => {
  const [activeImage, setActiveImage] = useState(0);

  const hasImages = images && images.length > 0;

  const imageList = hasImages
    ? images.map((img) => ({
        id: img.id,
        src: `http://localhost:8000/storage/${img.image_path}`,
        alt: `صورة`,
      }))
    : [
        {
          id: 0,
          src: FALLBACK_IMAGE,
          alt: 'لا توجد صور',
        },
      ];

  const mainImage = imageList[activeImage]?.src || FALLBACK_IMAGE;

  const goToPrevious = () => {
    if (hasImages && activeImage > 0) {
      setActiveImage(activeImage - 1);
    }
  };

  const goToNext = () => {
    if (hasImages && activeImage < imageList.length - 1) {
      setActiveImage(activeImage + 1);
    }
  };

  const isPrevDisabled = !hasImages || activeImage === 0;
  const isNextDisabled = !hasImages || activeImage === imageList.length - 1;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--bg-input)',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={mainImage}
          alt={title}
          style={{
            width: '100%',
            height: '400px',
            objectFit: 'cover',
            display: 'block',
          }}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        {!hasImages && (
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#FFFFFF',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: 500,
              backdropFilter: 'blur(4px)',
            }}
          >
            📷 لا توجد صور
          </div>
        )}

        <button
          onClick={goToPrevious}
          disabled={isPrevDisabled}
          style={{
            position: 'absolute',
            top: '50%',
            right: '16px',
            transform: 'translateY(-50%)',
            backgroundColor: isPrevDisabled
              ? 'rgba(0,0,0,0.2)'
              : 'rgba(0,0,0,0.6)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            fontSize: '18px',
            cursor: isPrevDisabled ? 'default' : 'pointer',
            opacity: isPrevDisabled ? 0.4 : 1,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
          onMouseEnter={(e) => {
            if (!isPrevDisabled) {
              e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,122,32,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isPrevDisabled) {
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.6)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            }
          }}
        >
          <FaChevronRight size={20} />
        </button>

        <button
          onClick={goToNext}
          disabled={isNextDisabled}
          style={{
            position: 'absolute',
            top: '50%',
            left: '16px',
            transform: 'translateY(-50%)',
            backgroundColor: isNextDisabled
              ? 'rgba(0,0,0,0.2)'
              : 'rgba(0,0,0,0.6)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            fontSize: '18px',
            cursor: isNextDisabled ? 'default' : 'pointer',
            opacity: isNextDisabled ? 0.4 : 1,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
          onMouseEnter={(e) => {
            if (!isNextDisabled) {
              e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,122,32,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isNextDisabled) {
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.6)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            }
          }}
        >
          <FaChevronLeft size={20} />
        </button>

        {hasImages && imageList.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '50%',
              transform: 'translateX(50%)',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#FFFFFF',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 500,
              backdropFilter: 'blur(4px)',
            }}
          >
            {activeImage + 1} / {imageList.length}
          </div>
        )}
      </div>

      {hasImages && imageList.length > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            padding: '16px',
            overflowX: 'auto',
            backgroundColor: 'var(--bg-input)',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          {imageList.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => setActiveImage(index)}
              style={{
                width: '80px',
                height: '60px',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                border:
                  activeImage === index
                    ? '2px solid var(--primary-orange)'
                    : '2px solid transparent',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                padding: 0,
                background: 'none',
                boxShadow:
                  activeImage === index
                    ? '0 2px 8px rgba(232,122,32,0.3)'
                    : 'none',
              }}
              onMouseEnter={(e) => {
                if (activeImage !== index) {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeImage !== index) {
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              <img
                src={image.src}
                alt={image.alt || `صورة ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementImageCarousel;