import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaStar, FaInfoCircle } from 'react-icons/fa';
import StarRatingInput from './StarRatingInput';
import { validateRatingComment, validateRatingValue } from '../../utils/ratingHelpers';
import type { Rating } from '../../types';

const MAX_COMMENT_LENGTH = 255;

interface RatingModalProps {
  isOpen: boolean;
  mode?: 'create' | 'edit';
  // For create
  ownerName?: string;
  announcementTitle?: string;
  // For edit
  existingRating?: Rating | null;
  // Actions
  onSubmit: (data: { rating: number; comment?: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const RatingModal = ({
  isOpen,
  mode = 'create',
  ownerName,
  announcementTitle,
  existingRating,
  onSubmit,
  onCancel,
  isLoading = false,
}: RatingModalProps) => {
  const isEdit = mode === 'edit';

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Reset on open or mode change
  useEffect(() => {
    if (isOpen) {
      if (isEdit && existingRating) {
        setRating(existingRating.rating);
        setComment(existingRating.comment || '');
      } else {
        setRating(0);
        setComment('');
      }
      setError(null);
    }
  }, [isOpen, isEdit, existingRating]);

  const handleClose = () => {
    if (isLoading) return;
    onCancel();
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    const ratingErr = validateRatingValue(rating);
    if (ratingErr) {
      setError(ratingErr);
      return;
    }

    const commentErr = validateRatingComment(comment);
    if (commentErr) {
      setError(commentErr);
      return;
    }

    setError(null);
    await onSubmit({
      rating,
      comment: comment.trim() || undefined,
    });
  };

  const remaining = MAX_COMMENT_LENGTH - comment.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
              overflow: 'hidden',
              fontFamily: 'Cairo, sans-serif',
              position: 'relative',
              direction: 'rtl',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0.04)',
                color: 'var(--text-muted)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                opacity: isLoading ? 0.5 : 1,
              }}
              aria-label="إغلاق"
            >
              <FaTimes size={12} />
            </button>

            {/* Body */}
            <div
              style={{
                padding: '1.75rem 1.5rem 1.25rem',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              {/* Icon */}
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  style={{
                    width: '68px',
                    height: '68px',
                    margin: '0 auto',
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, #FFC107, #F5A623)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 10px 28px rgba(255,193,7,0.4)',
                  }}
                >
                  <FaStar size={30} />
                </motion.div>
              </div>

              {/* Title */}
              <h3
                style={{
                  textAlign: 'center',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: 'var(--text-secondary)',
                  margin: '0 0 6px',
                }}
              >
                {isEdit ? 'تعديل التقييم' : 'قيّم تجربتك'}
              </h3>

              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  margin: '0 0 1.25rem',
                }}
              >
                {ownerName ? (
                  <>
                    {isEdit ? 'عدّل تقييمك لـ ' : 'شاركنا تجربتك مع '}
                    <strong style={{ color: 'var(--text-secondary)' }}>
                      {ownerName}
                    </strong>
                  </>
                ) : (
                  isEdit ? 'عدّل تقييمك' : 'شاركنا تجربتك'
                )}
              </p>

              {/* Announcement context */}
              {announcementTitle && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    marginBottom: '1.25rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  <FaInfoCircle
                    size={11}
                    color="var(--primary-orange)"
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />
                  <span>
                    الإعلان:{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>
                      {announcementTitle}
                    </strong>
                  </span>
                </div>
              )}

              {/* Stars */}
              <div style={{ marginBottom: '1.25rem' }}>
                <StarRatingInput
                  value={rating}
                  onChange={(v) => {
                    setRating(v);
                    if (error) setError(null);
                  }}
                  disabled={isLoading}
                />
              </div>

              {/* Comment */}
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                تعليق{' '}
                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                  }}
                >
                  (اختياري)
                </span>
              </label>
              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))
                }
                disabled={isLoading}
                placeholder="أخبر الآخرين عن تجربتك..."
                rows={3}
                maxLength={MAX_COMMENT_LENGTH}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: `1px solid ${
                    error && comment.length > MAX_COMMENT_LENGTH
                      ? 'var(--error)'
                      : 'var(--border-color)'
                  }`,
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  outline: 'none',
                  resize: 'none',
                  transition: 'all 0.2s ease',
                  lineHeight: 1.5,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-orange)';
                  e.currentTarget.style.boxShadow =
                    '0 0 0 3px rgba(232,122,32,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />

              {/* Counter */}
              <div
                style={{
                  textAlign: 'left',
                  fontSize: '0.65rem',
                  color: remaining < 20 ? 'var(--error)' : 'var(--text-muted)',
                  fontFamily: 'system-ui, sans-serif',
                  marginTop: '4px',
                  opacity: 0.75,
                }}
              >
                {comment.length}/{MAX_COMMENT_LENGTH}
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    marginTop: '8px',
                    color: 'var(--error)',
                    fontSize: '0.75rem',
                    fontFamily: 'Cairo, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <FaInfoCircle size={10} />
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '1rem 1.5rem 1.25rem',
                display: 'flex',
                gap: '10px',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                flexWrap: 'wrap',
              }}
            >
              <motion.button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.97 } : {}}
                style={{
                  flex: '1 1 0',
                  minWidth: '100px',
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                إلغاء
              </motion.button>

              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || rating < 1}
                whileHover={!isLoading && rating >= 1 ? { scale: 1.02, y: -1 } : {}}
                whileTap={!isLoading && rating >= 1 ? { scale: 0.97 } : {}}
                style={{
                  flex: '1 1 0',
                  minWidth: '140px',
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: 'none',
                  background:
                    rating < 1 || isLoading
                      ? 'var(--primary-brown-light)'
                      : 'linear-gradient(135deg, #FFC107, #F5A623)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor:
                    isLoading || rating < 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow:
                    rating < 1 || isLoading
                      ? 'none'
                      : '0 4px 16px rgba(255,193,7,0.4)',
                  opacity: rating < 1 || isLoading ? 0.6 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{ width: '13px', height: '13px' }}
                    />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <FaStar size={12} />
                    {isEdit ? 'حفظ التعديلات' : 'إرسال التقييم'}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RatingModal;