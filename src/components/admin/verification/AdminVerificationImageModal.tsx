import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearchPlus,
  FaSearchMinus,
  FaRedo,
  FaTimes,
  FaImage,
} from 'react-icons/fa';

interface AdminVerificationImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  title?: string;
  onClose: () => void;
}

const AdminVerificationImageModal = ({
  isOpen,
  imageUrl,
  title = 'معاينة الصورة',
  onClose,
}: AdminVerificationImageModalProps) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const resolvedImageUrl = imageUrl
    ? imageUrl.startsWith('http')
      ? imageUrl
      : `http://localhost:8000/storage/${imageUrl}`
    : '';

  // ============================================
  // Handlers
  // ============================================
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => {
      const next = Math.max(z - 0.25, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Reset state on open + lock scroll
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-' || e.key === '_') handleZoomOut();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose, handleZoomIn, handleZoomOut]);

  // Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="admin-verification-image-modal"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(10, 10, 10, 0.94)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 99999,
            fontFamily: 'Cairo, sans-serif',
            overflow: 'hidden',
          }}
          dir="rtl"
        >
          {/* ============================================ */}
          {/* Header Bar */}
          {/* ============================================ */}
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              padding: '14px 24px',
              backgroundColor: 'rgba(0,0,0,0.85)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#FFFFFF',
                minWidth: 0,
              }}
            >
              <FaImage size={16} style={{ opacity: 0.7, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  تكبير: {Math.round(zoom * 100)}%
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '6px',
                flexShrink: 0,
                position: 'relative',
                zIndex: 11,
              }}
            >
              <ToolButton
                icon={<FaSearchPlus size={14} />}
                title="تكبير"
                onClick={handleZoomIn}
              />
              <ToolButton
                icon={<FaSearchMinus size={14} />}
                title="تصغير"
                onClick={handleZoomOut}
              />
              <ToolButton
                icon={<FaRedo size={13} />}
                title="إعادة الضبط"
                onClick={handleReset}
              />
              <ToolButton
                icon={<FaTimes size={16} />}
                title="إغلاق"
                onClick={handleClose}
                danger
              />
            </div>
          </div>

          {/* ============================================
              Image Viewport
              ============================================ */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              userSelect: 'none',
              cursor:
                zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              padding: '20px',
              position: 'relative',
              zIndex: 5,
            }}
          >
            {resolvedImageUrl ? (
              /* ✅ FIXED: Plain <img> instead of <motion.img>
                 motion.img overrides style.transform with its own animation,
                 so our manual scale() was silently ignored. */
              <img
                src={resolvedImageUrl}
                alt={title}
                draggable={false}
                style={{
                  maxWidth: '90vw',
                  maxHeight: '82vh',
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.15s ease-out',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            ) : (
              <div
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.9rem',
                }}
              >
                لا توجد صورة متاحة للعرض
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// Tool Button
// ============================================
const ToolButton = ({
  icon,
  title,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    onMouseDown={(e) => e.stopPropagation()}
    title={title}
    aria-label={title}
    style={{
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      border: danger
        ? '1px solid rgba(220,53,69,0.4)'
        : '1px solid rgba(255,255,255,0.15)',
      backgroundColor: danger
        ? 'rgba(220,53,69,0.25)'
        : 'rgba(255,255,255,0.1)',
      color: danger ? '#DC3545' : '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      outline: 'none',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = danger
        ? 'rgba(220,53,69,0.4)'
        : 'rgba(255,255,255,0.2)';
      e.currentTarget.style.transform = 'scale(1.05)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = danger
        ? 'rgba(220,53,69,0.25)'
        : 'rgba(255,255,255,0.1)';
      e.currentTarget.style.transform = 'scale(1)';
    }}
  >
    {icon}
  </button>
);

export default AdminVerificationImageModal;