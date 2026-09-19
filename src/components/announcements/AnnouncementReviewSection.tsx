import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaStar,
  FaEdit,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaTimes,
  FaInfoCircle,
} from 'react-icons/fa';
import { useAnnouncementReview } from '../../hooks/useAnnouncementReview';
import { useAuth } from '../../hooks/useAuth';
import { RatingModal } from '../ratings';
import StarRating from '../ratings/StarRating';
import { formatRemainingEditTime } from '../../utils/ratingHelpers';
import type { Rating } from '../../types';

interface AnnouncementReviewSectionProps {
  announcementId: number;
}

const AnnouncementReviewSection = ({
  announcementId,
}: AnnouncementReviewSectionProps) => {
  const { isAuthenticated } = useAuth();
  const {
    status,
    loading,
    submitting,
    fetchStatus,
    createRating,
    updateRating,
    deleteRating,
  } = useAnnouncementReview();

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ============================================
  // Fetch status
  // ============================================
  useEffect(() => {
    if (!isAuthenticated || !announcementId) return;
    fetchStatus(announcementId);
  }, [announcementId, isAuthenticated, fetchStatus]);

  // ============================================
  // Handlers
  // ============================================
  const handleCreate = async (data: {
    rating: number;
    comment?: string;
  }) => {
    if (!status?.owner) return;
    try {
      await createRating(
        {
          rated_id: status.owner.id,
          announcement_id: announcementId,
          rating: data.rating,
          comment: data.comment,
        },
        announcementId
      );
      setShowCreateModal(false);
    } catch {
      // handled in hook
    }
  };

  const handleEdit = async (data: {
    rating: number;
    comment?: string;
  }) => {
    if (!status?.existing_rating) return;
    try {
      await updateRating(
        status.existing_rating.id,
        { rating: data.rating, comment: data.comment },
        announcementId
      );
      setShowEditModal(false);
    } catch {
      // handled in hook
    }
  };

  const handleDelete = async () => {
    if (!status?.existing_rating) return;
    try {
      setIsDeleting(true);
      await deleteRating(status.existing_rating.id, announcementId);
      setShowDeleteModal(false);
    } catch {
      // handled in hook
    } finally {
      setIsDeleting(false);
    }
  };

  // ============================================
  // Guards
  // ============================================
  if (!isAuthenticated) return null;
  if (status?.reason === 'own_announcement') return null;

  if (loading && !status) {
    return (
      <div
        style={{
          marginTop: '1.25rem',
          padding: '1.25rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          className="spinner-border spinner-border-sm"
          style={{
            color: 'var(--primary-orange)',
            width: '1.2rem',
            height: '1.2rem',
          }}
        />
        <span
          style={{
            color: 'var(--text-muted)',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.85rem',
          }}
        >
          جاري تحميل حالة التقييم...
        </span>
      </div>
    );
  }

  if (!status) return null;

  // ============================================
  // Render: can_review
  // ============================================
  if (status.can_review) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            marginTop: '1.25rem',
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid rgba(255,193,7,0.35)',
            borderRadius: '18px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(255,193,7,0.12)',
            fontFamily: 'Cairo, sans-serif',
            background:
              'linear-gradient(135deg, rgba(255,193,7,0.06), rgba(255,193,7,0.02))',
            position: 'relative',
            overflow: 'hidden',
          }}
          dir="rtl"
        >
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              left: '-40px',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,193,7,0.15), transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                marginBottom: '1rem',
              }}
            >
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #FFC107, #F5A623)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0,
                  boxShadow: '0 6px 16px rgba(255,193,7,0.4)',
                }}
              >
                <FaStar size={22} />
              </motion.div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h4
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.98rem',
                    fontWeight: 900,
                    margin: '0 0 4px',
                    lineHeight: 1.3,
                  }}
                >
                  هل تعاملت مع {status.owner.name}؟
                </h4>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  شارك تجربتك وساعد الآخرين على اتخاذ قرارات أفضل.
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={() => setShowCreateModal(true)}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #FFC107, #F5A623)',
                color: '#FFFFFF',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(255,193,7,0.4)',
              }}
            >
              <FaStar size={14} />
              أضف تقييمك
            </motion.button>
          </div>
        </motion.div>

        {/* Create Modal */}
        <RatingModal
          isOpen={showCreateModal}
          mode="create"
          ownerName={status.owner.name}
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={submitting}
        />
      </>
    );
  }

  // ============================================
  // Render: already_reviewed
  // ============================================
  if (status.reason === 'already_reviewed' && status.existing_rating) {
    const existing = status.existing_rating;
    const canEdit = existing.can_edit;
    const canDelete = existing.can_delete;

    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            marginTop: '1.25rem',
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid rgba(40,167,69,0.35)',
            borderRadius: '18px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(40,167,69,0.1)',
            fontFamily: 'Cairo, sans-serif',
            background:
              'linear-gradient(135deg, rgba(40,167,69,0.06), rgba(40,167,69,0.02))',
            position: 'relative',
            overflow: 'hidden',
          }}
          dir="rtl"
        >
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              left: '-40px',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(40,167,69,0.15), transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #28A745, #4FCB6E)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(40,167,69,0.35)',
                }}
              >
                <FaCheckCircle size={20} />
              </div>
              <div>
                <h4
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  تقييمك لهذا الإعلان
                </h4>
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.72rem',
                    marginTop: '3px',
                  }}
                >
                  شكراً لمشاركة تجربتك
                </div>
              </div>
            </div>

            {/* Existing rating */}
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: 'var(--bg-input)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginBottom: existing.comment ? '8px' : 0,
                  flexWrap: 'wrap',
                }}
              >
                <StarRating rating={existing.rating} size={16} />
                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.72rem',
                  }}
                >
                  {new Date(existing.created_at).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              {existing.comment && (
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    paddingTop: '6px',
                    borderTop: '1px solid var(--border-color)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  "{existing.comment}"
                </div>
              )}
            </div>

            {/* Edit window */}
            {canEdit && existing.edit_deadline && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,193,7,0.08)',
                  border: '1px solid rgba(255,193,7,0.25)',
                  marginBottom: '1rem',
                }}
              >
                <FaClock size={11} color="#856404" />
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#856404',
                    fontWeight: 700,
                  }}
                >
                  {formatRemainingEditTime(existing.edit_deadline)}
                </span>
              </div>
            )}

            {/* Actions */}
            {(canEdit || canDelete) && (
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                {canEdit && (
                  <motion.button
                    type="button"
                    onClick={() => setShowEditModal(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: '1 1 0',
                      minWidth: '120px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      border: '1.5px solid rgba(23,162,184,0.35)',
                      backgroundColor: 'rgba(23,162,184,0.08)',
                      color: '#17A2B8',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <FaEdit size={12} />
                    تعديل
                  </motion.button>
                )}
                {canDelete && (
                  <motion.button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: '1 1 0',
                      minWidth: '120px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      border: '1.5px solid rgba(220,53,69,0.35)',
                      backgroundColor: 'rgba(220,53,69,0.08)',
                      color: '#DC3545',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <FaTrash size={12} />
                    حذف
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Edit Modal */}
        <RatingModal
          isOpen={showEditModal}
          mode="edit"
          ownerName={status.owner.name}
          existingRating={
            {
              id: existing.id,
              rating: existing.rating,
              comment: existing.comment,
              rater: {
                id: 0,
                name: '',
                is_verified: false,
                profile_image: null,
              },
              created_at: existing.created_at,
              updated_at: existing.created_at,
            } as Rating
          }
          onSubmit={handleEdit}
          onCancel={() => setShowEditModal(false)}
          isLoading={submitting}
        />

        {/* Delete Modal */}
        <SimpleDeleteRatingModal
          isOpen={showDeleteModal}
          ratingValue={existing.rating}
          ownerName={status.owner.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={isDeleting}
        />
      </>
    );
  }

  return null;
};

// ============================================
// Simple Delete Modal (inline)
// ============================================
const SimpleDeleteRatingModal = ({
  isOpen,
  ratingValue,
  ownerName,
  onConfirm,
  onCancel,
  isLoading,
}: {
  isOpen: boolean;
  ratingValue?: number;
  ownerName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !isLoading && onCancel()}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 1080,
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
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
            padding: '1.75rem 1.5rem 1.25rem',
            fontFamily: 'Cairo, sans-serif',
            direction: 'rtl',
            position: 'relative',
          }}
        >
          <button
            type="button"
            onClick={() => !isLoading && onCancel()}
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
              opacity: isLoading ? 0.5 : 1,
            }}
            aria-label="إغلاق"
          >
            <FaTimes size={12} />
          </button>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 1rem',
                borderRadius: '50%',
                background: 'rgba(220,53,69,0.12)',
                border: '2px solid rgba(220,53,69,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DC3545',
              }}
            >
              <FaTrash size={24} />
            </div>

            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 900,
                color: 'var(--text-secondary)',
                margin: '0 0 8px',
              }}
            >
              تأكيد حذف التقييم
            </h3>

            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                margin: '0 0 1.25rem',
              }}
            >
              هل أنت متأكد من حذف تقييمك
              {ratingValue && (
                <>
                  {' '}
                  (
                  <strong style={{ color: '#FFC107' }}>
                    {ratingValue} نجوم
                  </strong>
                  )
                </>
              )}
              {ownerName && (
                <>
                  {' '}
                  لـ{' '}
                  <strong style={{ color: 'var(--text-secondary)' }}>
                    {ownerName}
                  </strong>
                </>
              )}
              ؟ لا يمكن التراجع.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                backgroundColor: 'rgba(255,193,7,0.08)',
                border: '1px solid rgba(255,193,7,0.25)',
                borderRadius: '10px',
                marginBottom: '1.25rem',
                textAlign: 'right',
              }}
            >
              <FaInfoCircle
                size={11}
                color="#856404"
                style={{ flexShrink: 0, marginTop: '3px' }}
              />
              <span
                style={{
                  fontSize: '0.72rem',
                  color: '#856404',
                  lineHeight: 1.5,
                }}
              >
                الحذف متاح فقط خلال 24 ساعة من إضافة التقييم.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '11px 16px',
                borderRadius: '11px',
                border: '1.5px solid var(--border-color)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '11px 16px',
                borderRadius: '11px',
                border: 'none',
                background: 'linear-gradient(135deg, #DC3545, #B02A37)',
                color: '#FFFFFF',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 16px rgba(220,53,69,0.3)',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    style={{ width: '13px', height: '13px' }}
                  />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <FaTrash size={11} />
                  نعم، احذف
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default AnnouncementReviewSection;