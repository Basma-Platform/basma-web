import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearchPlus,
  FaSearchMinus,
  FaRedo,
  FaTimes,
  FaImage,
  FaExclamationTriangle,
  FaShieldAlt,
  FaSpinner,
} from 'react-icons/fa';

interface AdminVerificationImageModalProps {
  isOpen: boolean;
  imageBlob: Blob | null;
  title?: string;
  userName?: string;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
}

const AdminVerificationImageModal = ({
  isOpen,
  imageBlob,
  title = 'معاينة صورة الهوية',
  userName,
  loading = false,
  error = null,
  onClose,
}: AdminVerificationImageModalProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const blobUrlRef = useRef<string | null>(null);

  // ============================================
  // Create Object URL from Blob
  // ============================================
  useEffect(() => {
    if (imageBlob && isOpen) {
      // Cleanup previous
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
      const url = URL.createObjectURL(imageBlob);
      blobUrlRef.current = url;
      setImageUrl(url);
    }

    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [imageBlob, isOpen]);

  // ============================================
  // Reset & Lock Scroll
  // ============================================
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

  // ============================================
  // Zoom Controls
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
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setImageUrl(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    onClose();
  }, [onClose]);

  // ============================================
  // Keyboard Shortcuts
  // ============================================
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

  // ============================================
  // Drag
  // ============================================
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
              padding: '12px 18px',
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
                flex: 1,
              }}
            >
              <FaImage size={16} style={{ opacity: 0.7, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.9rem',
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
                    fontSize: '0.68rem',
                    color: 'rgba(255,255,255,0.55)',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  {userName && <span>{userName}</span>}
                  <span>تكبير: {Math.round(zoom * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Toolbar */}
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
                disabled={!imageUrl}
              />
              <ToolButton
                icon={<FaSearchMinus size={14} />}
                title="تصغير"
                onClick={handleZoomOut}
                disabled={!imageUrl}
              />
              <ToolButton
                icon={<FaRedo size={13} />}
                title="إعادة الضبط"
                onClick={handleReset}
                disabled={!imageUrl}
              />
              <ToolButton
                icon={<FaTimes size={16} />}
                title="إغلاق"
                onClick={handleClose}
                danger
              />
            </div>
          </div>

          {/* ============================================ */}
          {/* Image Viewport */}
          {/* ============================================ */}
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
            {/* Loading */}
            {loading && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#FFFFFF',
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'flex' }}
                >
                  <FaSpinner size={32} />
                </motion.div>
                <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                  جاري تحميل الصورة بأمان...
                </span>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  padding: '2rem',
                }}
              >
                <FaExclamationTriangle
                  size={42}
                  color="#F5A623"
                  style={{ opacity: 0.7 }}
                />
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{error}</div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    opacity: 0.6,
                    maxWidth: '300px',
                    lineHeight: 1.6,
                  }}
                >
                  قد تكون الصورة محذوفة تلقائياً بعد 90 يوماً من الموافقة.
                </div>
              </div>
            )}

            {/* Image */}
            {!loading && !error && imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                draggable={false}
                style={{
                  maxWidth: '90vw',
                  maxHeight: '80vh',
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>

          {/* ============================================ */}
          {/* Security Footer */}
          {/* ============================================ */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '10px 18px',
              backgroundColor: 'rgba(0,0,0,0.85)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.68rem',
              textAlign: 'center',
              flexWrap: 'wrap',
            }}
          >
            <FaShieldAlt size={11} color="#28A745" />
            <span>
              تم تسجيل وصولك لهذه الصورة في{' '}
              <strong style={{ color: '#28A745' }}>سجل الأمان</strong>.
            </span>
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
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      if (!disabled) onClick();
    }}
    onMouseDown={(e) => e.stopPropagation()}
    title={title}
    aria-label={title}
    disabled={disabled}
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
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'all 0.2s ease',
      outline: 'none',
    }}
    onMouseEnter={(e) => {
      if (disabled) return;
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