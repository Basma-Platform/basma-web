import { useEffect, useState, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaExclamationTriangle,
  FaTrash,
  FaHandHoldingHeart,
  FaVideo,
  FaLock,
} from 'react-icons/fa';
import SEO from '../../../components/SEO';
import { getStorageUrl } from '../../../utils/storageHelpers';
import { FUND_THEME } from '../../../utils/helpRequestHelpers';

import { helpRequestService } from '../../../services/helpRequestService';
import { useHelpRequestForm } from '../../../hooks/useHelpRequestForm';

import { MyHelpRequestDetailsHeader } from '../../../components/user/basma-fund/help-requests';
import { MyHelpRequestDetailsInfo } from '../../../components/user/basma-fund/cards';
import {
  DeleteHelpRequestModal,
  DeleteCountdownTimer,
} from '../../../components/user/basma-fund/modals';
import { MyHelpRequestDetailsSkeleton } from '../../../components/user/basma-fund/skeletons';

import type { HelpRequestUserDetail } from '../../../types';

const MyHelpRequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { loading: deleting, deleteRequest } = useHelpRequestForm();

  const [request, setRequest] = useState<HelpRequestUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [windowExpired, setWindowExpired] = useState(false);

  // ============================================
  // Fetch
  // ============================================
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setHasAttempted(false);
      try {
        const data = await helpRequestService.getMyDetail(Number(id));
        if (!cancelled) setRequest(data);
      } catch {
        if (!cancelled) setRequest(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setHasAttempted(true);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ============================================
  // Delete flow
  // ============================================
  const handleDeleteConfirm = useCallback(async () => {
    if (!request) return;
    try {
      await deleteRequest(request.id);
      setDeleteOpen(false);
      navigate('/user/basma-fund/help-requests', { replace: true });
    } catch {
      // toast handled in hook
    }
  }, [request, deleteRequest, navigate]);

  // ============================================
  // Loading
  // ============================================
  if (loading || !hasAttempted) {
    return (
      <>
        <SEO title="تفاصيل طلب المساعدة" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '2rem',
            paddingBottom: '3rem',
          }}
        >
          <Container className="px-3 px-md-4" style={{ maxWidth: '900px' }}>
            <MyHelpRequestDetailsSkeleton />
          </Container>
        </div>
      </>
    );
  }

  // ============================================
  // Not found
  // ============================================
  if (!request) {
    return (
      <>
        <SEO title="تفاصيل طلب المساعدة" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
          }}
        >
          <div
            style={{
              maxWidth: '460px',
              padding: '2.25rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <FaExclamationTriangle size={42} color="#DC3545" opacity={0.6} />
            <h3
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                fontWeight: 800,
                margin: '1rem 0 8px',
              }}
            >
              الطلب غير موجود
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                lineHeight: 1.6,
              }}
            >
              ربما تم حذفه أو ليس لديك صلاحية الوصول إليه.
            </p>
            <Link
              to="/user/basma-fund/help-requests"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                background: FUND_THEME.gradient,
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                boxShadow: `0 4px 14px ${FUND_THEME.shadow}`,
              }}
            >
              <FaArrowRight size={11} />
              العودة لطلباتي
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // Compute delete window state
  // ============================================
  const canDelete = request.can_delete && !windowExpired;
  const thumbUrl = getStorageUrl(request.video_thumbnail_url);

  // ============================================
  // Success
  // ============================================
  return (
    <>
      <SEO
        title={`طلب #${request.id} | ${request.public_title}`}
        description={request.public_description.substring(0, 150)}
      />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '2rem',
          paddingBottom: '3rem',
        }}
        dir="rtl"
      >
        <Container className="px-3 px-md-4" style={{ maxWidth: '900px' }}>
          {/* ============================================ */}
          {/* Delete countdown banner */}
          {/* ============================================ */}
          {canDelete && request.delete_deadline && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                marginBottom: '1rem',
                padding: '1rem 1.15rem',
                borderRadius: '14px',
                backgroundColor: 'rgba(232,122,32,0.08)',
                border: '1px solid rgba(232,122,32,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#E87A20',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  flex: '1 1 220px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '11px',
                    backgroundColor: 'rgba(232,122,32,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FaTrash size={13} />
                </div>
                <div>
                  <div>يمكنك حذف هذا الطلب الآن</div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600,
                      marginTop: '2px',
                    }}
                  >
                    تنتهي الصلاحية تلقائياً
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <DeleteCountdownTimer
                  deadline={request.delete_deadline}
                  secondsRemaining={request.delete_seconds_remaining}
                  onExpire={() => setWindowExpired(true)}
                  compact
                />

                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '9px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #DC3545, #B02A37)',
                    color: '#FFFFFF',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(220,53,69,0.35)',
                  }}
                >
                  <FaTrash size={11} />
                  حذف الطلب
                </button>
              </div>
            </motion.div>
          )}

          {/* ============================================ */}
          {/* Main header */}
          {/* ============================================ */}
          <MyHelpRequestDetailsHeader request={request} />

          {/* ============================================ */}
          {/* Blurred thumbnail card */}
          {/* ============================================ */}
          {thumbUrl && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              style={{
                marginBottom: '1.25rem',
                borderRadius: '18px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  backgroundColor: 'var(--bg-input)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={thumbUrl}
                  alt={request.public_title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'blur(4px)',
                    transform: 'scale(1.06)',
                  }}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
                    pointerEvents: 'none',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '1rem',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.94)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: FUND_THEME.accent,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                    }}
                  >
                    <FaLock size={22} />
                  </div>
                  <span
                    style={{
                      color: '#FFFFFF',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                      maxWidth: '280px',
                      lineHeight: 1.5,
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  >
                    هذه الصورة معروضة بشكل ضبابي للمتبرعين — الفيديو الكامل عند
                    الطلب
                  </span>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(23,162,184,0.85)',
                    backdropFilter: 'blur(6px)',
                    color: '#FFFFFF',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  <FaVideo size={10} />
                  الفيديو خاص بك
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================ */}
          {/* Body sections */}
          {/* ============================================ */}
          <MyHelpRequestDetailsInfo request={request} />

          {/* ============================================ */}
          {/* Footer CTA */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            style={{
              marginTop: '1.5rem',
              padding: '1rem 1.15rem',
              borderRadius: '14px',
              backgroundColor: `${FUND_THEME.accent}08`,
              border: `1px solid ${FUND_THEME.accent}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              <FaHandHoldingHeart size={14} color={FUND_THEME.accent} />
              عرضك سيصل للمتبرعين بعد موافقة الإدارة.
            </div>

            <Link
              to="/user/basma-fund/help-requests"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 800,
              }}
            >
              <FaArrowRight size={10} />
              كل طلباتي
            </Link>
          </motion.div>
        </Container>
      </div>

      {/* ============================================ */}
      {/* Delete modal */}
      {/* ============================================ */}
      <DeleteHelpRequestModal
        isOpen={deleteOpen}
        requestTitle={request.public_title}
        deleteDeadline={request.delete_deadline}
        secondsRemaining={request.delete_seconds_remaining}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
        isLoading={deleting}
      />
    </>
  );
};

export default MyHelpRequestDetailsPage;