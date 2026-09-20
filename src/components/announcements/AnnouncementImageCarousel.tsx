import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronRight,
  FaChevronLeft,
  FaImage,
  FaExpand,
  FaSearchPlus,
  FaSearchMinus,
  FaRedo,
  FaTimes,
} from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import { getStorageUrl } from '../../utils/storageHelpers';

// ============================================
// Types
// ============================================
interface ImageCarouselProps {
  images: Array<{ id: number; image_path: string }>;
  title: string;
}

const AnnouncementImageCarousel = ({ images, title }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Drag / Pan state for zoomed image inside Modal
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Fixed type compatibility for browser environments
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ✅ Use storage helper for all image URLs
  const getImageUrl = (path: string) => {
    return getStorageUrl(path) ?? '';
  };

  const handleNext = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, [images.length]);

  // Keyboard navigation inside Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showLightbox) return;
      if (e.key === 'ArrowRight') {
        handlePrev();
      } else if (e.key === 'ArrowLeft') {
        handleNext();
      } else if (e.key === 'Escape') {
        setShowLightbox(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, handleNext, handlePrev]);

  // Zoom Actions
  const handleZoomIn = () =>
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev - 0.25, 1);
      if (newZoom === 1) setPosition({ x: 0, y: 0 });
      return newZoom;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 3-Second Infinite Auto Loop
  useEffect(() => {
    if (images.length > 1 && !isHovered && !showLightbox) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 3000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, images.length, isHovered, showLightbox, handleNext]);

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          maxHeight: '420px',
          borderRadius: '16px',
          backgroundColor: 'var(--bg-card-hover)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          gap: '10px',
        }}
      >
        <FaImage size={48} opacity={0.4} />
        <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.9rem' }}>
          لا توجد صور لهذا الإعلان
        </span>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '18px',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-card)',
        boxShadow: '0 4px 20px var(--shadow-md)',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Main Slide Screen */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          maxHeight: '440px',
          backgroundColor: 'var(--bg-card-hover)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={getImageUrl(images[currentIndex].image_path)}
            alt={`${title} - image ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            onClick={() => {
              setZoomLevel(1);
              setPosition({ x: 0, y: 0 });
              setShowLightbox(true);
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              cursor: 'zoom-in',
            }}
          />
        </AnimatePresence>

        {/* Counter Badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            color: '#FFFFFF',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            fontFamily: 'Cairo, sans-serif',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            zIndex: 3,
          }}
        >
          {currentIndex + 1} / {images.length}
        </div>

        {/* Expand Action */}
        <button
          onClick={() => {
            setZoomLevel(1);
            setPosition({ x: 0, y: 0 });
            setShowLightbox(true);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 3,
          }}
          title="توسيع ومعاينة الصورة"
        >
          <FaExpand size={14} />
        </button>

        {/* Navigation Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous Image"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 3,
                transition: 'all 0.2s ease',
              }}
            >
              <FaChevronRight size={18} />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Image"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 3,
                transition: 'all 0.2s ease',
              }}
            >
              <FaChevronLeft size={18} />
            </button>
          </>
        )}
      </div>

      {/* Centered Thumbnails Row */}
      {images.length > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            backgroundColor: 'var(--bg-card)',
            overflowX: 'auto',
          }}
        >
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => {
                setCurrentIndex(idx);
                setZoomLevel(1);
                setPosition({ x: 0, y: 0 });
              }}
              style={{
                border:
                  idx === currentIndex
                    ? '2px solid var(--primary-orange)'
                    : '2px solid transparent',
                borderRadius: '10px',
                padding: 0,
                overflow: 'hidden',
                backgroundColor: 'transparent',
                opacity: idx === currentIndex ? 1 : 0.55,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                transform: idx === currentIndex ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <img
                src={getImageUrl(img.image_path)}
                alt={`thumb-${idx}`}
                style={{
                  width: '64px',
                  height: '48px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Previewer Modal */}
      <Modal
        show={showLightbox}
        onHide={() => setShowLightbox(false)}
        centered
        fullscreen
        contentClassName="bg-dark text-white border-0"
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          {/* Header Bar: Mobile Stacked, Desktop Side-by-Side */}
          <div
            className="d-flex flex-column flex-md-row align-items-center justify-content-between"
            style={{
              padding: '16px 24px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 10,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              gap: '12px',
            }}
          >
            {/* Title & Index */}
            <div className="text-center text-md-start">
              <div
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#FFFFFF',
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.78rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                صورة {currentIndex + 1} من {images.length}
              </div>
            </div>

            {/* Desktop Side-by-Side Toolbar / Mobile Grid Toolbar */}
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ gap: '8px' }}
            >
              <button
                onClick={handleZoomIn}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: 'none',
                  color: '#FFFFFF',
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="تكبير"
              >
                <FaSearchPlus size={16} />
              </button>

              <button
                onClick={handleZoomOut}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: 'none',
                  color: '#FFFFFF',
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="تصغير"
              >
                <FaSearchMinus size={16} />
              </button>

              <button
                onClick={handleResetZoom}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: 'none',
                  color: '#FFFFFF',
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="إعادة ضبط الحجم"
              >
                <FaRedo size={14} />
              </button>

              <button
                onClick={() => setShowLightbox(false)}
                style={{
                  backgroundColor: 'rgba(220, 53, 69, 0.25)',
                  border: '1px solid rgba(220, 53, 69, 0.4)',
                  color: '#DC3545',
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginRight: '4px',
                }}
                title="إغلاق (Esc)"
              >
                <FaTimes size={18} />
              </button>
            </div>
          </div>

          {/* Interactive Panning Viewport */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              userSelect: 'none',
              cursor:
                zoomLevel > 1
                  ? isDragging
                    ? 'grabbing'
                    : 'grab'
                  : 'default',
            }}
          >
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 5,
                }}
              >
                <FaChevronRight size={20} />
              </button>
            )}

            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                maxWidth: '90vw',
                maxHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={getImageUrl(images[currentIndex]?.image_path)}
                alt={title}
                draggable={false}
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
            </div>

            {images.length > 1 && (
              <button
                onClick={handleNext}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 5,
                }}
              >
                <FaChevronLeft size={20} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {images.length > 1 && (
            <div
              style={{
                padding: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                zIndex: 10,
              }}
            >
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setZoomLevel(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  style={{
                    border:
                      idx === currentIndex
                        ? '2px solid var(--primary-orange)'
                        : '2px solid transparent',
                    borderRadius: '8px',
                    padding: 0,
                    overflow: 'hidden',
                    backgroundColor: 'transparent',
                    opacity: idx === currentIndex ? 1 : 0.4,
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={getImageUrl(img.image_path)}
                    alt={`thumb-${idx}`}
                    style={{
                      width: '50px',
                      height: '38px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AnnouncementImageCarousel;