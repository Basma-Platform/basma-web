import { useState } from 'react';
import { FaChevronRight, FaChevronLeft, FaImage } from 'react-icons/fa';
import type { AnnouncementImage } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface AnnouncementImageCarouselProps {
  images: AnnouncementImage[];
  title: string;
}

const FALLBACK_IMAGE = '/placeholder-image.png';

// ✅ استخدام VITE_STORAGE_URL مع fallback للتطوير
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage';

const AnnouncementImageCarousel = ({
  images,
  title,
}: AnnouncementImageCarouselProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const hasImages = images && images.length > 0;

  const imageList = hasImages
    ? images.map((img) => ({
        id: img.id,
        src: `${STORAGE_URL}/${img.image_path}`,
        alt: `صورة ${img.order + 1}`,
      }))
    : [{ id: 0, src: FALLBACK_IMAGE, alt: 'لا توجد صور' }];

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

  const goToImage = (index: number) => {
    setActiveImage(index);
  };

  const isPrevDisabled = !hasImages || activeImage === 0;
  const isNextDisabled = !hasImages || activeImage === imageList.length - 1;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main Image */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--bg-input)',
          minHeight: '350px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={mainImage}
            alt={title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
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
        </AnimatePresence>

        {/* No Images Badge */}
        {!hasImages && (
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#FFFFFF',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 500,
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FaImage size={14} />
            لا توجد صور
          </div>
        )}

        {/* Image Counter */}
        {hasImages && imageList.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#FFFFFF',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 500,
              backdropFilter: 'blur(4px)',
              zIndex: 2,
            }}
          >
            {activeImage + 1} / {imageList.length}
          </div>
        )}

        {/* Navigation Buttons */}
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
              : isHovering || window.innerWidth < 768
              ? 'rgba(0,0,0,0.6)'
              : 'rgba(0,0,0,0)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            fontSize: '18px',
            cursor: isPrevDisabled ? 'default' : 'pointer',
            opacity: isPrevDisabled ? 0.4 : isHovering || window.innerWidth < 768 ? 1 : 0,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 2,
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
              e.currentTarget.style.backgroundColor = isHovering ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)';
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
              : isHovering || window.innerWidth < 768
              ? 'rgba(0,0,0,0.6)'
              : 'rgba(0,0,0,0)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            fontSize: '18px',
            cursor: isNextDisabled ? 'default' : 'pointer',
            opacity: isNextDisabled ? 0.4 : isHovering || window.innerWidth < 768 ? 1 : 0,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 2,
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
              e.currentTarget.style.backgroundColor = isHovering ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            }
          }}
        >
          <FaChevronLeft size={20} />
        </button>
      </div>

      {/* Thumbnails */}
      {hasImages && imageList.length > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 16px',
            overflowX: 'auto',
            backgroundColor: 'var(--bg-input)',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          {imageList.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => goToImage(index)}
              style={{
                width: '70px',
                height: '55px',
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