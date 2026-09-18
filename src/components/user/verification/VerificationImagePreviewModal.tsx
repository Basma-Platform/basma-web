import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaImage } from 'react-icons/fa';

interface VerificationImagePreviewModalProps {
  isOpen: boolean;
  imageUrl: string;
  title?: string;
  onClose: () => void;
}

const VerificationImagePreviewModal = ({
  isOpen,
  imageUrl,
  title = 'معاينة الصورة',
  onClose,
}: VerificationImagePreviewModalProps) => {
  // Prevent background scrolling and handle escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(10, 10, 10, 0.92)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999999,
          fontFamily: 'Cairo, sans-serif',
          overflow: 'hidden',
        }}
        dir="rtl"
      >
        {/* Simple Header Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '16px 24px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FFFFFF' }}>
            <FaImage size={18} style={{ opacity: 0.7 }} />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{title}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(220, 53, 69, 0.25)',
              border: '1px solid rgba(220, 53, 69, 0.4)',
              color: '#DC3545',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            title="إغلاق"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Clean Image Container */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.img
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            src={imageUrl}
            alt={title}
            style={{
              maxWidth: '90vw',
              maxHeight: '82vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VerificationImagePreviewModal;